import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  get(key: string) {
    return this.cacheManager.get(key);
  }
  set(key: string, value: any, ttl: number = 0) {
    return this.cacheManager.set(key, value, ttl);
  }
  del(key: string) {
    return this.cacheManager.del(key);
  }
}
