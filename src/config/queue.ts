import { redisConnectionConfig } from '@base/config/redis';
import { RedisOptions } from 'ioredis/built/redis/RedisOptions';

export const queueConfig: { defaultDriver: string; redis: RedisOptions } = {
  defaultDriver: 'redis',
  redis: {
    ...redisConnectionConfig,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    connectTimeout: 5000,
    db: 0,
  },
};
