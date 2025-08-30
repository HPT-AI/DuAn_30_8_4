const axios = require('axios');
const config = require('../../config/default');
const logger = require('../utils/logger');
const redisClient = require('../utils/redis');
const { metrics } = require('../middleware/monitoring');

class ServiceDiscovery {
  constructor() {
    this.services = new Map();
    this.healthCheckInterval = null;
    this.loadBalancers = new Map();
    this.initializeServices();
    this.startHealthChecks();
  }

  // Initialize services from configuration
  initializeServices() {
    Object.entries(config.services).forEach(([serviceName, serviceConfig]) => {
      this.registerService(serviceName, serviceConfig);
    });
    logger.info('Services initialized from configuration');
  }

  // Register a new service
  registerService(name, serviceConfig) {
    const service = {
      name,
      instances: [
        {
          id: `${name}-1`,
          url: serviceConfig.baseUrl,
          healthy: true,
          lastHealthCheck: null,
          responseTime: 0,
          errorCount: 0,
          ...serviceConfig
        }
      ],
      config: serviceConfig
    };

    this.services.set(name, service);
    this.loadBalancers.set(name, new LoadBalancer(service.instances, config.loadBalancing.strategy));
    
    logger.info(`Service registered: ${name} at ${serviceConfig.baseUrl}`);
  }

  // Add service instance
  addServiceInstance(serviceName, instance) {
    const service = this.services.get(serviceName);
    if (service) {
      service.instances.push({
        id: instance.id || `${serviceName}-${service.instances.length + 1}`,
        healthy: true,
        lastHealthCheck: null,
        responseTime: 0,
        errorCount: 0,
        ...instance
      });
      
      // Update load balancer
      this.loadBalancers.set(serviceName, new LoadBalancer(service.instances, config.loadBalancing.strategy));
      logger.info(`Instance added to service ${serviceName}: ${instance.url}`);
    }
  }

  // Remove service instance
  removeServiceInstance(serviceName, instanceId) {
    const service = this.services.get(serviceName);
    if (service) {
      service.instances = service.instances.filter(instance => instance.id !== instanceId);
      
      // Update load balancer
      this.loadBalancers.set(serviceName, new LoadBalancer(service.instances, config.loadBalancing.strategy));
      logger.info(`Instance removed from service ${serviceName}: ${instanceId}`);
    }
  }

  // Get service instance using load balancing
  getServiceInstance(serviceName) {
    const loadBalancer = this.loadBalancers.get(serviceName);
    if (loadBalancer) {
      return loadBalancer.getNextInstance();
    }
    return null;
  }

  // Get all healthy instances for a service
  getHealthyInstances(serviceName) {
    const service = this.services.get(serviceName);
    if (service) {
      return service.instances.filter(instance => instance.healthy);
    }
    return [];
  }

  // Get service configuration
  getServiceConfig(serviceName) {
    const service = this.services.get(serviceName);
    return service ? service.config : null;
  }

  // Get all services
  getAllServices() {
    const servicesData = {};
    this.services.forEach((service, name) => {
      servicesData[name] = {
        instances: service.instances,
        config: service.config,
        healthyCount: service.instances.filter(i => i.healthy).length,
        totalCount: service.instances.length
      };
    });
    return servicesData;
  }

  // Health check for a single instance
  async checkInstanceHealth(instance) {
    try {
      const startTime = Date.now();
      const response = await axios.get(`${instance.url}${instance.healthCheck || '/health'}`, {
        timeout: instance.timeout || 5000,
        validateStatus: (status) => status < 500
      });
      
      const responseTime = Date.now() - startTime;
      const isHealthy = response.status >= 200 && response.status < 400;
      
      // Update instance health
      instance.healthy = isHealthy;
      instance.lastHealthCheck = new Date();
      instance.responseTime = responseTime;
      
      if (isHealthy) {
        instance.errorCount = 0;
      } else {
        instance.errorCount++;
      }
      
      // Record metrics
      metrics.recordServiceHealth(instance.name, instance.url, isHealthy);
      
      return {
        healthy: isHealthy,
        responseTime,
        status: response.status,
        error: null
      };
      
    } catch (error) {
      instance.healthy = false;
      instance.lastHealthCheck = new Date();
      instance.errorCount++;
      
      // Record metrics
      metrics.recordServiceHealth(instance.name, instance.url, false);
      
      logger.warn(`Health check failed for ${instance.url}:`, error.message);
      
      return {
        healthy: false,
        responseTime: 0,
        status: 0,
        error: error.message
      };
    }
  }

  // Health check for all instances
  async performHealthChecks() {
    const healthCheckPromises = [];
    
    this.services.forEach((service) => {
      service.instances.forEach((instance) => {
        healthCheckPromises.push(this.checkInstanceHealth(instance));
      });
    });
    
    try {
      await Promise.all(healthCheckPromises);
      logger.debug('Health checks completed');
    } catch (error) {
      logger.error('Error during health checks:', error);
    }
  }

  // Start periodic health checks
  startHealthChecks() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, config.loadBalancing.healthCheckInterval);
    
    // Perform initial health check
    this.performHealthChecks();
    
    logger.info(`Health checks started with interval: ${config.loadBalancing.healthCheckInterval}ms`);
  }

  // Stop health checks
  stopHealthChecks() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      logger.info('Health checks stopped');
    }
  }

  // Circuit breaker functionality
  isCircuitOpen(serviceName) {
    const service = this.services.get(serviceName);
    if (!service) return false;
    
    const unhealthyInstances = service.instances.filter(i => !i.healthy).length;
    const totalInstances = service.instances.length;
    
    // Open circuit if more than 50% of instances are unhealthy
    return (unhealthyInstances / totalInstances) > 0.5;
  }

  // Get service statistics
  getServiceStats(serviceName) {
    const service = this.services.get(serviceName);
    if (!service) return null;
    
    const stats = {
      name: serviceName,
      totalInstances: service.instances.length,
      healthyInstances: service.instances.filter(i => i.healthy).length,
      averageResponseTime: 0,
      totalErrors: 0,
      circuitOpen: this.isCircuitOpen(serviceName)
    };
    
    if (service.instances.length > 0) {
      stats.averageResponseTime = service.instances.reduce((sum, i) => sum + i.responseTime, 0) / service.instances.length;
      stats.totalErrors = service.instances.reduce((sum, i) => sum + i.errorCount, 0);
    }
    
    return stats;
  }
}

// Load Balancer class
class LoadBalancer {
  constructor(instances, strategy = 'round-robin') {
    this.instances = instances;
    this.strategy = strategy;
    this.currentIndex = 0;
    this.connections = new Map(); // For least-connections strategy
  }

  getNextInstance() {
    const healthyInstances = this.instances.filter(instance => instance.healthy);
    
    if (healthyInstances.length === 0) {
      return null;
    }
    
    switch (this.strategy) {
      case 'round-robin':
        return this.roundRobin(healthyInstances);
      case 'least-connections':
        return this.leastConnections(healthyInstances);
      case 'random':
        return this.random(healthyInstances);
      case 'weighted':
        return this.weighted(healthyInstances);
      default:
        return this.roundRobin(healthyInstances);
    }
  }

  roundRobin(instances) {
    const instance = instances[this.currentIndex % instances.length];
    this.currentIndex++;
    return instance;
  }

  leastConnections(instances) {
    let selectedInstance = instances[0];
    let minConnections = this.connections.get(selectedInstance.id) || 0;
    
    instances.forEach(instance => {
      const connections = this.connections.get(instance.id) || 0;
      if (connections < minConnections) {
        minConnections = connections;
        selectedInstance = instance;
      }
    });
    
    return selectedInstance;
  }

  random(instances) {
    const randomIndex = Math.floor(Math.random() * instances.length);
    return instances[randomIndex];
  }

  weighted(instances) {
    // Simple weighted selection based on response time (lower is better)
    const weights = instances.map(instance => {
      const responseTime = instance.responseTime || 1;
      return 1 / responseTime; // Inverse of response time
    });
    
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < instances.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return instances[i];
      }
    }
    
    return instances[0];
  }

  // Track connection for least-connections strategy
  addConnection(instanceId) {
    const current = this.connections.get(instanceId) || 0;
    this.connections.set(instanceId, current + 1);
  }

  removeConnection(instanceId) {
    const current = this.connections.get(instanceId) || 0;
    this.connections.set(instanceId, Math.max(0, current - 1));
  }
}

// Create singleton instance
const serviceDiscovery = new ServiceDiscovery();

module.exports = {
  serviceDiscovery,
  LoadBalancer
};