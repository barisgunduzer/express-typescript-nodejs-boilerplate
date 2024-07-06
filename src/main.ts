import 'reflect-metadata';
import { fixModuleAlias } from './utils/fix-module-alias';
fixModuleAlias(__dirname);
import { appConfig } from '@base/config/app';
import dataSource from '@base/database/data-source';
import { securityOptions } from '@base/config/security';
import { ormConfig } from '@base/config/orm';
import { isNullOrEmpty } from '@base/utils/string';
import * as path from 'path';
import { createServer } from 'http';
import express from 'express';
import moment from 'moment';
import bodyParser from 'body-parser';
import Helmet from 'helmet';
import { Container } from 'typedi';
import {
  getMetadataArgsStorage,
  useContainer as routingControllersUseContainer,
  useExpressServer,
} from 'routing-controllers';
import { registerController as registerCronJobs, useContainer as cronUseContainer } from 'cron-decorators';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as swaggerUiExpress from 'swagger-ui-express';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { addTransactionalDataSource, initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import { runSeeders } from 'typeorm-extension';
import rateLimiter from '@base/config/limit';
import requestLogger from '@base/infrastructure/middlewares/application/RequestLogger';
import { RoleTypeEnum } from '@api/enums/RoleTypeEnum';
import { env } from '@base/utils/env';
import cors from 'cors';
import * as http from 'node:http';
import { SocketControllers } from 'socket-controllers';
import { MessageController } from '@api/controllers/Message/MessageController';
import { Server } from 'socket.io';

class App {
  private app: express.Application = express();

  public async startApp() {
    await this.init();
  }

  private async init() {
    moment.locale('tr-TR');

    // Initialize db connection
    await this.typeOrmCreateConnection();

    // Use helmet security headers for secure responses
    this.app.use(Helmet(securityOptions));

    // Use request logger for logging requests
    this.app.use(requestLogger);

    // Use rate limiter for prevent DDOS attacks for production
    if (appConfig.isProduction) {
      this.app.use(rateLimiter);
    }

    // Register app structures
    this.registerCronJobs();
    this.registerRoutingControllers();

    // Create http server and setup middlewares
    const server = createServer(this.app);

    this.setupMiddlewares();

    // Register default home page
    this.registerDefaultHomePage();

    // Register socket controllers
    this.registerSocketControllers();

    // Listen server on open port
    server.listen(appConfig.port);

    // Listen shutdown signal events and handle shutdown process gracefully
    this.listenShutdownSignals(server);
  }

  private async typeOrmCreateConnection() {
    console.log('🔗 Connecting to database...');
    console.log('🔛 Database connection established:', dataSource.options.database);
    await dataSource.initialize();

    if (ormConfig.seedersEnabled) {
      const seedEntities = await runSeeders(dataSource, { seedTracking: true });

      if (isNullOrEmpty(seedEntities)) {
        console.log('🌱 No seedings are pending');
      } else {
        console.log(
          '🌱 Seedings finished successfully: ',
          seedEntities.map((entity) => entity.instance.constructor.name),
        );
      }
    }
  }

  private setupSwagger() {
    const { defaultMetadataStorage } = require('class-transformer/cjs/storage');
    // Parse class-validator classes into JSON Schema
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      // classTransformerMetadataStorage: new MetadataStorage(),
      refPointerPrefix: '#/components/schemas/',
      additionalConverters: {
        CustomTextValidator: (meta) => ({
          minLength: meta.constraints[0],
          maxLength: meta.constraints[1],
          type: 'string',
        }),
      },
    });

    // Set api responses model schema
    schemas.ApiResponse = {
      properties: {
        success: {
          type: 'boolean',
        },
        status: {
          type: 'number',
        },
        data: {
          type: 'object',
        },
        errors: {
          type: 'string',
        },
        stack: {
          type: 'string',
        },
        message: {
          type: 'string',
        },
      },
      type: 'object',
      required: ['success', 'status', 'message'],
    };

    // Parse routing-controllers classes into OpenAPI spec:
    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(
      storage,
      { routePrefix: appConfig.routePrefix },
      {
        info: {
          description: 'NodeJS Boilerplate API' + ` - ${appConfig.node}`,
          title: 'NodeJS Boilerplate API Documentation',
          version: '1.0.0',
          contact: {
            name: 'barisgunduzer',
            email: 'barisgunduzer@gmail.com',
          },
        },
        components: {
          schemas,
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    );

    // Use Swagger
    this.app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
    this.app.use('/swagger.json', (_req, res) => {
      res.setHeader('Content-type', 'application/json');
      res.send(spec);
    });
  }

  private registerSocketControllers() {
    const io = new Server(3001, {cors: {origin: '*'}});

    io.use((socket: any, next: Function) => {
      console.log('Custom middleware');
      next();
    });

    this.app.use(function (req: any, res: any, next) {
      req.io = io;
      next();
    });

    new SocketControllers({
      io,
      container: Container,
      controllers: [MessageController],
      middlewares: [],
    });
  }

  private setupMiddlewares() {
    // Use body parser for json data
    this.app.use(bodyParser.json());

    // Parse application/x-www-form-urlencoded form data
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Enable CORS
    this.app.use(cors());

    // Generate and setup swagger documentation
    this.setupSwagger();

    // Serve static files
    this.serveStaticFiles();
  }

  private registerCronJobs() {
    cronUseContainer(Container);

    if (!appConfig.cronJobsEnabled) {
      return false;
    }

    registerCronJobs([path.join(appConfig.appPath, appConfig.cronJobsPath)]);
  }

  private serveStaticFiles() {
    this.app.use('/public', express.static(path.join(appConfig.appPath, 'public'), { maxAge: 31557600000 }));
  }

  private registerRoutingControllers() {
    routingControllersUseContainer(Container);
    useExpressServer(this.app, {
      currentUserChecker: (action) => action.request.currentUser,
      authorizationChecker: (action, roles: RoleTypeEnum[]) => {
        const { currentUser } = action.request;
        return currentUser && roles.includes(currentUser.activeRole.name);
      },
      development: appConfig.isDevelopment,
      validation: { stopAtFirstError: true },
      cors: true,
      classTransformer: true,
      defaultErrorHandler: false,
      routePrefix: appConfig.routePrefix,
      controllers: [path.join(appConfig.appPath, appConfig.controllersPath)],
      middlewares: [path.join(appConfig.appPath, appConfig.middlewaresPath)],
      interceptors: [path.join(appConfig.appPath, appConfig.interceptorsPath)],
    });
  }

  private registerDefaultHomePage() {
    this.app.get('/', (_req, res) => {
      res.json({
        title: appConfig.appName,
        mode: appConfig.node,
        date: new Date(),
      });
    });
  }

  private listenShutdownSignals(server: http.Server) {
    // Listen SIGINT interruption signal come from ctrl+c
    process.on('SIGINT', async () => {
      console.log('⚠ SIGINT signal received.');
      await this.closeServer(server);
    });

    // Listen SIGTERM signal come from docker stop
    process.on('SIGTERM', async () => {
      console.log('⚠ SIGTERM signal received.');
      await this.closeServer(server);
    });
  }

  private async closeServer(server: http.Server) {
    try {
      await dataSource.destroy();
      server
        .close((err) => {
          if (err) {
            console.error('Server closed with ERROR', err);
            process.exit(1);
          }
        })
        .closeAllConnections();
      Container.reset();
      console.debug('Closed out remaining connections');
      console.log('Server closed gracefully');
      process.exit(0);
    } catch (err) {
      console.error(err);
    }
  }
}

// Initialize app
initializeTransactionalContext({ storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE });
addTransactionalDataSource(dataSource);

const app = new App();

app
  .startApp()
  .then(() => {
    console.log(`🚀 Server started at http://localhost:${appConfig.port}\n🚨 Environment: ${env('NODE_ENV')}`);
  })
  .catch((err) => {
    console.error('❌  Server crashed:', err);
  });
