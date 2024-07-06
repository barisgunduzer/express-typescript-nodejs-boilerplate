import { env } from '@base/utils/env';
import { toBool } from '@base/utils/bool';

function getAppPath() {
  let currentDir = __dirname;
  currentDir = currentDir.replace(/\\config/, '');
  return currentDir;
}

export const appConfig = {
  node: env('NODE_ENV') || 'local',
  locale: env('APP_LOCALE'),
  appName: env('APP_NAME'),
  appPath: getAppPath(),
  port: Number(env('APP_PORT')),
  routePrefix: env('APP_ROUTE_PREFIX'),
  url: env('APP_URL'),

  controllersPath: env('CONTROLLERS_PATH'),
  cronJobsPath: env('CRON_JOBS_PATH'),
  middlewaresPath: env('MIDDLEWARES_PATH'),
  interceptorsPath: env('INTERCEPTORS_PATH'),

  isLocal: env('NODE_ENV') === 'local',
  isDevelopment: env('NODE_ENV') === 'development',
  isStaging: env('NODE_ENV') === 'staging',
  isProduction: env('NODE_ENV') === 'production',

  cronJobsEnabled: toBool(env('ENABLE_CRON_JOBS')),
  graphqlEnabled: toBool(env('ENABLE_GRAPHQL')),
  mockServerEnabled: toBool(env('ENABLE_MOCK_SERVER')),
};
