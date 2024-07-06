import { env } from '@base/utils/env';
import { Service } from 'typedi';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import * as jwt from 'jsonwebtoken';
import { authConfig } from '@base/config/auth';
import { Response } from 'express';
import { ApiResponse } from '@api/responses/ApiResponse';
import { CacheService } from '@base/infrastructure/services/cache/CacheService';
import { CacheHashKeyEnum } from '@api/enums/CacheHashKeyEnum';

@Service()
export class AuthGuard implements ExpressMiddlewareInterface {
  constructor(private readonly cacheService: CacheService) {}

  use(request: any, response: Response, next?: (err?: any) => any): any {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.send(ApiResponse.error('Please log in again.', 401));
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, authConfig.providers.jwt.secret, async (err: any, user: any) => {
      if (err) {
        return response.send(ApiResponse.error('Your session has been terminated. Please login again.', 401));
      }

      const existsToken = await this.cacheService
        .manager()
        .getHashCache(CacheHashKeyEnum.sessionUser, `${env('APP_NAME')}_${user.userId}_${user.activeRole.id}`);

      if (existsToken != token) {
        return response.send(ApiResponse.error('Your session has been terminated. Please login again.', 401));
      }

      request.currentUser = user;

      next();
    });
  }
}
