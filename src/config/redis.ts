import { env } from '@base/utils/env';

export const redisConnectionConfig = {
  host: env('REDIS_HOST', '127.0.0.1'),
  port: Number(env('REDIS_PORT', '6379')),
  connectionName: 'redis-connection',
};
