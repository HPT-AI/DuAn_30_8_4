const jwt = require('jsonwebtoken');
const config = require('../../config/default');
const logger = require('../utils/logger');
const redisClient = require('../utils/redis');

class AuthenticationMiddleware {
  // Required authentication middleware
  static required(req, res, next) {
    const token = AuthenticationMiddleware.extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided',
        code: 'NO_TOKEN'
      });
    }

    AuthenticationMiddleware.verifyToken(token, req, res, next, true);
  }

  // Optional authentication middleware
  static optional(req, res, next) {
    const token = AuthenticationMiddleware.extractToken(req);
    
    if (!token) {
      req.user = null;
      return next();
    }

    AuthenticationMiddleware.verifyToken(token, req, res, next, false);
  }

  // Extract token from request
  static extractToken(req) {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check query parameter
    if (req.query.token) {
      return req.query.token;
    }

    // Check cookie
    if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }

    return null;
  }

  // Verify JWT token
  static async verifyToken(token, req, res, next, required = true) {
    try {
      // Check if token is blacklisted
      const isBlacklisted = await redisClient.exists(`blacklist:${token}`);
      if (isBlacklisted) {
        if (required) {
          return res.status(401).json({
            error: 'Token invalid',
            message: 'Token has been revoked',
            code: 'TOKEN_REVOKED'
          });
        } else {
          req.user = null;
          return next();
        }
      }

      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret, {
        issuer: config.jwt.issuer,
        audience: config.jwt.audience
      });

      // Check if user session exists in cache
      const userSession = await redisClient.cacheGet(`session:${decoded.userId}`);
      if (userSession) {
        req.user = {
          ...decoded,
          ...userSession
        };
      } else {
        req.user = decoded;
      }

      req.token = token;
      next();

    } catch (error) {
      logger.error('Token verification error:', error);

      if (required) {
        let errorMessage = 'Invalid token';
        let errorCode = 'INVALID_TOKEN';

        if (error.name === 'TokenExpiredError') {
          errorMessage = 'Token expired';
          errorCode = 'TOKEN_EXPIRED';
        } else if (error.name === 'JsonWebTokenError') {
          errorMessage = 'Malformed token';
          errorCode = 'MALFORMED_TOKEN';
        }

        return res.status(401).json({
          error: 'Authentication failed',
          message: errorMessage,
          code: errorCode
        });
      } else {
        req.user = null;
        next();
      }
    }
  }

  // Role-based authorization middleware
  static authorize(roles = []) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'No authenticated user',
          code: 'NO_AUTH'
        });
      }

      if (roles.length === 0) {
        return next();
      }

      const userRoles = req.user.roles || [];
      const hasRole = roles.some(role => userRoles.includes(role));

      if (!hasRole) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: `Required roles: ${roles.join(', ')}`,
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      next();
    };
  }

  // API Key authentication middleware
  static apiKey(req, res, next) {
    if (!config.security.apiKey.enabled) {
      return next();
    }

    const apiKey = req.headers[config.security.apiKey.header.toLowerCase()];
    
    if (!apiKey) {
      return res.status(401).json({
        error: 'API Key required',
        message: `Missing ${config.security.apiKey.header} header`,
        code: 'NO_API_KEY'
      });
    }

    // In a real implementation, you would validate the API key against a database
    // For now, we'll just check if it exists
    AuthenticationMiddleware.validateApiKey(apiKey)
      .then(isValid => {
        if (!isValid) {
          return res.status(401).json({
            error: 'Invalid API Key',
            message: 'The provided API key is not valid',
            code: 'INVALID_API_KEY'
          });
        }
        next();
      })
      .catch(error => {
        logger.error('API Key validation error:', error);
        return res.status(500).json({
          error: 'Authentication error',
          message: 'Unable to validate API key',
          code: 'AUTH_ERROR'
        });
      });
  }

  // Validate API key (placeholder implementation)
  static async validateApiKey(apiKey) {
    try {
      // Check if API key exists in cache/database
      const keyData = await redisClient.cacheGet(`apikey:${apiKey}`);
      return keyData !== null;
    } catch (error) {
      logger.error('API key validation error:', error);
      return false;
    }
  }

  // Generate JWT token
  static generateToken(payload, options = {}) {
    const tokenOptions = {
      expiresIn: options.expiresIn || config.jwt.expiresIn,
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
      ...options
    };

    return jwt.sign(payload, config.jwt.secret, tokenOptions);
  }

  // Blacklist token
  static async blacklistToken(token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await redisClient.set(`blacklist:${token}`, '1', ttl);
        }
      }
      return true;
    } catch (error) {
      logger.error('Error blacklisting token:', error);
      return false;
    }
  }

  // Store user session
  static async storeUserSession(userId, sessionData, ttl = 86400) {
    try {
      await redisClient.cacheSet(`session:${userId}`, sessionData, ttl);
      return true;
    } catch (error) {
      logger.error('Error storing user session:', error);
      return false;
    }
  }

  // Remove user session
  static async removeUserSession(userId) {
    try {
      await redisClient.del(`session:${userId}`);
      return true;
    } catch (error) {
      logger.error('Error removing user session:', error);
      return false;
    }
  }
}

module.exports = AuthenticationMiddleware;