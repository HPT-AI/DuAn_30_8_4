const express = require('express');
const { metrics } = require('../middleware/monitoring');
const authentication = require('../middleware/authentication');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Prometheus metrics endpoint
router.get('/', asyncHandler(async (req, res) => {
  res.set('Content-Type', metrics.register.contentType);
  const metricsData = await metrics.getMetrics();
  res.end(metricsData);
}));

// JSON metrics endpoint (for custom dashboards)
router.get('/json', 
  authentication.optional,
  asyncHandler(async (req, res) => {
    const metricsString = await metrics.getMetrics();
    const jsonMetrics = parsePrometheusMetrics(metricsString);
    
    res.json({
      timestamp: new Date().toISOString(),
      metrics: jsonMetrics
    });
  })
);

// Specific metric endpoint
router.get('/:metricName',
  authentication.optional,
  asyncHandler(async (req, res) => {
    const { metricName } = req.params;
    const metric = metrics.getMetric(metricName);
    
    if (!metric) {
      return res.status(404).json({
        error: 'Metric not found',
        message: `Metric '${metricName}' does not exist`
      });
    }
    
    // Get metric values
    const metricString = await metric.get();
    const parsedMetric = parsePrometheusMetrics(metricString.toString());
    
    res.json({
      name: metricName,
      timestamp: new Date().toISOString(),
      data: parsedMetric[metricName] || {}
    });
  })
);

// Reset metrics endpoint (admin only)
router.post('/reset',
  authentication.required,
  authentication.authorize(['admin']),
  asyncHandler(async (req, res) => {
    metrics.resetMetrics();
    
    res.json({
      message: 'All metrics have been reset',
      timestamp: new Date().toISOString()
    });
  })
);

// Custom metrics summary
router.get('/summary/overview',
  authentication.optional,
  asyncHandler(async (req, res) => {
    const metricsString = await metrics.getMetrics();
    const parsedMetrics = parsePrometheusMetrics(metricsString);
    
    // Calculate summary statistics
    const summary = {
      timestamp: new Date().toISOString(),
      requests: {
        total: getMetricValue(parsedMetrics, 'api_gateway_http_requests_total'),
        rate: calculateRate(parsedMetrics, 'api_gateway_http_requests_total'),
        errorRate: calculateErrorRate(parsedMetrics)
      },
      response_time: {
        average: getAverageResponseTime(parsedMetrics),
        p95: getPercentile(parsedMetrics, 'api_gateway_http_request_duration_seconds', 0.95),
        p99: getPercentile(parsedMetrics, 'api_gateway_http_request_duration_seconds', 0.99)
      },
      services: {
        healthy: getHealthyServicesCount(parsedMetrics),
        total: getTotalServicesCount(parsedMetrics)
      },
      cache: {
        hitRate: calculateCacheHitRate(parsedMetrics),
        hits: getMetricValue(parsedMetrics, 'api_gateway_cache_hits_total'),
        misses: getMetricValue(parsedMetrics, 'api_gateway_cache_misses_total')
      },
      rate_limits: {
        hits: getMetricValue(parsedMetrics, 'api_gateway_rate_limit_hits_total')
      },
      system: {
        memory_usage: getMetricValue(parsedMetrics, 'process_resident_memory_bytes'),
        cpu_usage: getMetricValue(parsedMetrics, 'process_cpu_user_seconds_total'),
        uptime: getMetricValue(parsedMetrics, 'process_start_time_seconds')
      }
    };
    
    res.json(summary);
  })
);

// Service-specific metrics
router.get('/services/:serviceName',
  authentication.optional,
  asyncHandler(async (req, res) => {
    const { serviceName } = req.params;
    const metricsString = await metrics.getMetrics();
    const parsedMetrics = parsePrometheusMetrics(metricsString);
    
    // Filter metrics for specific service
    const serviceMetrics = filterMetricsByService(parsedMetrics, serviceName);
    
    if (Object.keys(serviceMetrics).length === 0) {
      return res.status(404).json({
        error: 'Service metrics not found',
        message: `No metrics found for service '${serviceName}'`
      });
    }
    
    res.json({
      service: serviceName,
      timestamp: new Date().toISOString(),
      metrics: serviceMetrics
    });
  })
);

// Real-time metrics (Server-Sent Events)
router.get('/stream',
  authentication.optional,
  (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });
    
    // Send initial data
    sendMetricsUpdate(res);
    
    // Send updates every 5 seconds
    const interval = setInterval(async () => {
      try {
        await sendMetricsUpdate(res);
      } catch (error) {
        clearInterval(interval);
        res.end();
      }
    }, 5000);
    
    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  }
);

// Helper functions
function parsePrometheusMetrics(metricsString) {
  const lines = metricsString.split('\n');
  const metrics = {};
  
  lines.forEach(line => {
    if (line && !line.startsWith('#')) {
      const spaceIndex = line.indexOf(' ');
      if (spaceIndex > 0) {
        const metricPart = line.substring(0, spaceIndex);
        const value = parseFloat(line.substring(spaceIndex + 1));
        
        let metricName = metricPart;
        let labels = {};
        
        const braceIndex = metricPart.indexOf('{');
        if (braceIndex > 0) {
          metricName = metricPart.substring(0, braceIndex);
          const labelsString = metricPart.substring(braceIndex + 1, metricPart.length - 1);
          
          // Parse labels
          labelsString.split(',').forEach(labelPair => {
            const equalIndex = labelPair.indexOf('=');
            if (equalIndex > 0) {
              const key = labelPair.substring(0, equalIndex).trim();
              const val = labelPair.substring(equalIndex + 1).trim().replace(/"/g, '');
              labels[key] = val;
            }
          });
        }
        
        if (!metrics[metricName]) {
          metrics[metricName] = [];
        }
        
        metrics[metricName].push({ labels, value });
      }
    }
  });
  
  return metrics;
}

function getMetricValue(metrics, metricName, labels = {}) {
  const metric = metrics[metricName];
  if (!metric) return 0;
  
  if (Object.keys(labels).length === 0) {
    return metric.reduce((sum, item) => sum + item.value, 0);
  }
  
  const matchingMetric = metric.find(item => {
    return Object.entries(labels).every(([key, value]) => 
      item.labels[key] === value
    );
  });
  
  return matchingMetric ? matchingMetric.value : 0;
}

function calculateRate(metrics, metricName, timeWindow = 60) {
  // This is a simplified rate calculation
  // In a real implementation, you would track values over time
  const total = getMetricValue(metrics, metricName);
  return total / timeWindow; // requests per second (approximate)
}

function calculateErrorRate(metrics) {
  const totalRequests = getMetricValue(metrics, 'api_gateway_http_requests_total');
  const errorRequests = getMetricValue(metrics, 'api_gateway_errors_total');
  
  if (totalRequests === 0) return 0;
  return (errorRequests / totalRequests) * 100;
}

function getAverageResponseTime(metrics) {
  const histogram = metrics['api_gateway_http_request_duration_seconds'];
  if (!histogram) return 0;
  
  let totalTime = 0;
  let totalCount = 0;
  
  histogram.forEach(item => {
    if (item.labels.le) {
      const bucket = parseFloat(item.labels.le);
      if (!isNaN(bucket) && bucket !== Infinity) {
        totalTime += bucket * item.value;
        totalCount += item.value;
      }
    }
  });
  
  return totalCount > 0 ? totalTime / totalCount : 0;
}

function getPercentile(metrics, metricName, percentile) {
  // Simplified percentile calculation from histogram
  const histogram = metrics[metricName];
  if (!histogram) return 0;
  
  const buckets = histogram
    .filter(item => item.labels.le && item.labels.le !== '+Inf')
    .sort((a, b) => parseFloat(a.labels.le) - parseFloat(b.labels.le));
  
  if (buckets.length === 0) return 0;
  
  const totalCount = buckets[buckets.length - 1].value;
  const targetCount = totalCount * percentile;
  
  for (const bucket of buckets) {
    if (bucket.value >= targetCount) {
      return parseFloat(bucket.labels.le);
    }
  }
  
  return parseFloat(buckets[buckets.length - 1].labels.le);
}

function getHealthyServicesCount(metrics) {
  const healthMetrics = metrics['api_gateway_service_health_status'];
  if (!healthMetrics) return 0;
  
  return healthMetrics.filter(item => item.value === 1).length;
}

function getTotalServicesCount(metrics) {
  const healthMetrics = metrics['api_gateway_service_health_status'];
  if (!healthMetrics) return 0;
  
  return healthMetrics.length;
}

function calculateCacheHitRate(metrics) {
  const hits = getMetricValue(metrics, 'api_gateway_cache_hits_total');
  const misses = getMetricValue(metrics, 'api_gateway_cache_misses_total');
  const total = hits + misses;
  
  if (total === 0) return 0;
  return (hits / total) * 100;
}

function filterMetricsByService(metrics, serviceName) {
  const serviceMetrics = {};
  
  Object.entries(metrics).forEach(([metricName, metricData]) => {
    const filteredData = metricData.filter(item => 
      item.labels.service === serviceName
    );
    
    if (filteredData.length > 0) {
      serviceMetrics[metricName] = filteredData;
    }
  });
  
  return serviceMetrics;
}

async function sendMetricsUpdate(res) {
  const metricsString = await metrics.getMetrics();
  const parsedMetrics = parsePrometheusMetrics(metricsString);
  
  const summary = {
    timestamp: new Date().toISOString(),
    requests_per_second: calculateRate(parsedMetrics, 'api_gateway_http_requests_total'),
    error_rate: calculateErrorRate(parsedMetrics),
    average_response_time: getAverageResponseTime(parsedMetrics),
    healthy_services: getHealthyServicesCount(parsedMetrics),
    cache_hit_rate: calculateCacheHitRate(parsedMetrics)
  };
  
  res.write(`data: ${JSON.stringify(summary)}\n\n`);
}

module.exports = router;