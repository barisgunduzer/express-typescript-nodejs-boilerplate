import { env } from '@base/utils/env';
import { redisConnectionConfig } from '@base/config/redis';

export const cacheConfig = {
  defaultDriver: env('CACHE_DEFAULT_DRIVER', 'redis'),
  redis: {
    ...redisConnectionConfig,
    maxRetriesPerRequest: 1,
    autoResubscribe: true,
    connectTimeout: 5000,
    db: 1,
  },
};
