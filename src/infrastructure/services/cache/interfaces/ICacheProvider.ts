export interface ICacheProvider {
  getManager(): any;

  cache(key: string, value: any, ttl?: number): Promise<any>;

  getCache(key: string): Promise<any>;

  setCache(key: string, value: any, ttl?: number): Promise<void>;

  removeCache(...key: string[]): Promise<number>;
}
