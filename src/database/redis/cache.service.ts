import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

/**
 * Service for managing cache operations using Redis.
 * Provides methods to set, retrieve, and delete cache entries.
 */
@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redis: Redis) { }

  /**
   * Stores data in the Redis cache with a specific key and time-to-live (TTL).
   * 
   * @param key - The key under which the data will be stored.
   * @param data - The data to be cached.
   * @param ttl - Time-to-live for the cache in seconds (default: 3600).
   */
  async setCache(key: string, data: any, ttl = 3600): Promise<void> {
    await this.redis.set(key, JSON.stringify(data), 'EX', ttl);
  }

  /**
   * Retrieves data from the Redis cache for the given key.
   * 
   * @param key - The key of the cache entry to retrieve.
   * @returns The cached data if available, otherwise null.
   */
  async getCache<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Deletes a specific cache entry by its key.
   * 
   * @param key - The key of the cache entry to delete.
   */
  async deleteCache(key: string): Promise<void> {
    await this.redis.del(key);
  }

  /**
 * Deletes multiple cache entries matching a specific pattern.
 * 
 * @param pattern - The pattern to match keys (e.g., 'user:*').
 */
  async deleteByPattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length) {
      await this.redis.del(...keys);
    }
  }
}
