const redis = require('redis');
const config = require('../../config/default');
const logger = require('./logger');

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = redis.createClient({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password || undefined,
        db: config.redis.db,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            logger.error('Redis server connection refused');
            return new Error('Redis server connection refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            logger.error('Redis retry time exhausted');
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            logger.error('Redis max retry attempts reached');
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      this.client.on('error', (error) => {
        logger.error('Redis client error:', error);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        logger.info('Redis client ready');
        this.isConnected = true;
      });

      this.client.on('end', () => {
        logger.info('Redis client disconnected');
        this.isConnected = false;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis client disconnected');
    }
  }

  async get(key) {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping get operation');
        return null;
      }
      return await this.client.get(key);
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  async set(key, value, ttl = config.redis.ttl) {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping set operation');
        return false;
      }
      
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
      return false;
    }
  }

  async del(key) {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping delete operation');
        return false;
      }
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error);
      return false;
    }
  }

  async exists(key) {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping exists operation');
        return false;
      }
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  async incr(key, ttl = config.redis.ttl) {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping incr operation');
        return 0;
      }
      
      const result = await this.client.incr(key);
      if (result === 1 && ttl) {
        await this.client.expire(key, ttl);
      }
      return result;
    } catch (error) {
      logger.error(`Redis INCR error for key ${key}:`, error);
      return 0;
    }
  }

  async hget(hash, field) {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping hget operation');
        return null;
      }
      return await this.client.hGet(hash, field);
    } catch (error) {
      logger.error(`Redis HGET error for hash ${hash}, field ${field}:`, error);
      return null;
    }
  }

  async hset(hash, field, value, ttl = config.redis.ttl) {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping hset operation');
        return false;
      }
      
      await this.client.hSet(hash, field, value);
      if (ttl) {
        await this.client.expire(hash, ttl);
      }
      return true;
    } catch (error) {
      logger.error(`Redis HSET error for hash ${hash}, field ${field}:`, error);
      return false;
    }
  }

  async hgetall(hash) {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping hgetall operation');
        return {};
      }
      return await this.client.hGetAll(hash);
    } catch (error) {
      logger.error(`Redis HGETALL error for hash ${hash}:`, error);
      return {};
    }
  }

  // Cache helper methods
  async cacheGet(key) {
    const value = await this.get(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        logger.error(`Error parsing cached value for key ${key}:`, error);
        return null;
      }
    }
    return null;
  }

  async cacheSet(key, value, ttl = config.cache.defaultTTL) {
    try {
      const serialized = JSON.stringify(value);
      return await this.set(key, serialized, ttl);
    } catch (error) {
      logger.error(`Error serializing value for cache key ${key}:`, error);
      return false;
    }
  }

  // Rate limiting helper
  async checkRateLimit(key, limit, windowMs) {
    try {
      const current = await this.incr(key, Math.ceil(windowMs / 1000));
      return {
        count: current,
        remaining: Math.max(0, limit - current),
        resetTime: Date.now() + windowMs,
        exceeded: current > limit
      };
    } catch (error) {
      logger.error(`Rate limit check error for key ${key}:`, error);
      return {
        count: 0,
        remaining: limit,
        resetTime: Date.now() + windowMs,
        exceeded: false
      };
    }
  }
}

module.exports = new RedisClient();