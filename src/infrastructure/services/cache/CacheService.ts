import { RedisProvider } from '@base/infrastructure/services/cache/providers/RedisProvider';
import { ICacheService } from '@base/infrastructure/services/cache/interfaces/ICacheService';
import { Service } from 'typedi';
import { cacheConfig } from '@base/config/cache';
import { ICacheProvider } from '@base/infrastructure/services/cache/interfaces/ICacheProvider';

@Service()
export class CacheService implements ICacheService {
  private provider: ICacheProvider;

  public constructor() {
    this.setProvider(cacheConfig.defaultDriver);
  }

  getManager(): any {
    return this.provider.getManager();
  }

  public setProvider(provider: string): this {
    if (provider === 'redis') {
      this.provider = RedisProvider.getInstance();
    }
    return this;
  }

  public manager(): any {
    return this.provider.getManager();
  }

  public async cache(key: string, value: any, ttl?: number): Promise<any> {
    return await this.provider.cache(key, value, ttl);
  }

  public async getCache(key: string) {
    return await this.provider.getCache(key);
  }

  public async setCache(key: string, value: any, ttl?: number): Promise<void> {
    await this.provider.setCache(key, value, ttl);
  }

  public async removeCache(...key: string[]): Promise<number> {
    return await this.provider.removeCache(...key);
  }
}
