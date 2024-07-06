import { cacheConfig } from '@base/config/cache';
import Cache from 'ioredis-cache';
import { ICacheProvider } from '@base/infrastructure/services/cache/interfaces/ICacheProvider';
import { AppException } from '@api/exceptions/Application/AppException';

export class RedisProvider implements ICacheProvider {
  private readonly manager: Cache;

  private static _instance: RedisProvider = null;

  public static getInstance() {
    if (!RedisProvider._instance) {
      return new RedisProvider();
    }
    return RedisProvider._instance;
  }

  private constructor() {
    try {
      this.manager = new Cache(cacheConfig.redis as any);
    } catch (e) {
      throw new AppException('Redis server connection problem. Please try again later.');
    }
  }

  getManager(): Cache {
    return this.manager;
  }

  async cache(key: string, value: any, ttl?: number): Promise<any> {
    return await this.manager.cache(key, async () => value, ttl);
  }

  async getCache(key: string): Promise<any> {
    return await this.manager.getCache(key);
  }

  async setCache(key: string, value: any, ttl?: number): Promise<void> {
    await this.manager.setCache(key, value, ttl);
  }

  async removeCache(...key: string[]): Promise<number> {
    return await this.manager.deleteCache(...key);
  }
}
