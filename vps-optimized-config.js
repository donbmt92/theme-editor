// VPS-Optimized Configuration
// Specs: 4 vCPU, 16GB RAM, 200GB NVMe, 16TB bandwidth

const VPS_OPTIMIZED_CONFIG = {
  // Deploy processing limits (based on your VPS specs)
  MAX_CONCURRENT_DEPLOYS: 50,        // Conservative for 16GB RAM
  CHUNK_SIZE: 8,                     // Utilize 4 cores efficiently (2 chunks per core)
  STREAM_THRESHOLD: 512 * 1024,      // 512KB+ files use streaming (NVMe can handle)
  
  // Memory management  
  CACHE_SIZE_LIMIT: 200 * 1024,      // Cache files < 200KB
  MAX_TEMPLATE_CACHE_SIZE: 100,      // Keep 100 cached templates max
  
  // Disk management (optimized for 200GB NVMe)
  MAX_DEPLOY_AGE_DAYS: 14,           // Keep deploys for 2 weeks
  MAX_DEPLOYS_PER_USER: 100,         // Allow more deploys per user  
  MAX_TOTAL_SIZE_GB: 150,            // Use 75% of disk (150GB/200GB)
  MIN_FREE_SPACE_GB: 20,             // Alert when < 20GB free
  CLEANUP_INTERVAL: 6 * 60 * 60 * 1000, // Cleanup every 6 hours
  
  // Performance tuning
  ENABLE_COMPRESSION: true,          // Gzip responses (save bandwidth)
  PARALLEL_CLEANUP: true,            // Use multiple cores for cleanup
  ENABLE_METRICS: true,              // Monitor performance
  
  // Rate limiting (optimized for 16TB bandwidth)
  RATE_LIMIT_WINDOW: 60 * 1000,      // 1 minute window
  RATE_LIMIT_MAX_REQUESTS: 200,      // 200 deploys per minute max
  BURST_LIMIT: 10,                   // Allow 10 burst requests
  
  // Advanced optimizations for your VPS
  ENABLE_WORKER_THREADS: true,       // Use Node.js worker threads
  WORKER_THREAD_COUNT: 4,            // Match CPU cores
  ENABLE_CLUSTERING: false,          // Single instance is fine for this VPS
  
  // Monitoring thresholds
  MEMORY_WARNING_THRESHOLD: 12 * 1024 * 1024 * 1024, // 12GB
  CPU_WARNING_THRESHOLD: 80,         // 80% CPU usage
  DISK_WARNING_THRESHOLD: 160 * 1024 * 1024 * 1024,  // 160GB
  
  // Security for production
  ENABLE_REQUEST_LOGGING: true,
  ENABLE_RATE_LIMITING: true,
  ENABLE_DDOS_PROTECTION: true,
  
  // Backup configuration  
  ENABLE_BACKUP: true,
  BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // Daily backup
  BACKUP_RETENTION_DAYS: 7,
  BACKUP_LOCATION: '/backup/deploys'
}

// Environment-specific overrides
const PRODUCTION_OVERRIDES = {
  MAX_CONCURRENT_DEPLOYS: 100,       // Can handle more in production
  ENABLE_DEBUG_LOGGING: false,       // Disable debug logs
  ENABLE_COMPRESSION: true,          // Always compress in production
}

const DEVELOPMENT_OVERRIDES = {
  MAX_CONCURRENT_DEPLOYS: 5,         // Lower limit for dev
  ENABLE_DEBUG_LOGGING: true,        // Enable detailed logs
  CLEANUP_INTERVAL: 30 * 60 * 1000,  // Cleanup every 30 minutes
}

module.exports = {
  VPS_OPTIMIZED_CONFIG,
  PRODUCTION_OVERRIDES,
  DEVELOPMENT_OVERRIDES
}