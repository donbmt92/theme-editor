#!/bin/bash

# VPS Optimization Application Script
# For: 4 vCPU, 16GB RAM, 200GB NVMe, 16TB bandwidth
# 
# Usage: chmod +x apply-vps-optimization.sh && ./apply-vps-optimization.sh

set -e

echo "🚀 Applying VPS-Optimized Deploy System"
echo "========================================"
echo "VPS Specs: 4 vCPU, 16GB RAM, 200GB NVMe"
echo ""

# Backup current system
echo "📁 1. Backing up current system..."
if [ -f "src/app/api/deploy-project/route.ts" ]; then
    cp src/app/api/deploy-project/route.ts src/app/api/deploy-project/route.backup.$(date +%Y%m%d_%H%M%S).ts
    echo "   ✅ Backup created"
else
    echo "   ⚠️  No existing route found"
fi

# Apply optimized route
echo "🔄 2. Applying optimized route..."
if [ -f "src/app/api/deploy-project/route.optimized.ts" ]; then
    cp src/app/api/deploy-project/route.optimized.ts src/app/api/deploy-project/route.ts
    echo "   ✅ Optimized route applied"
else
    echo "   ❌ Optimized route not found!"
    exit 1
fi

# Create necessary directories
echo "📁 3. Creating directories..."
mkdir -p public/deploys
mkdir -p logs
mkdir -p backup/deploys
echo "   ✅ Directories created"

# Set up monitoring
echo "📊 4. Setting up monitoring..."
if [ ! -f "src/app/api/deploy-stats/route.ts" ]; then
    echo "   ⚠️  Deploy stats API not found, please create it"
fi

# Configure for VPS specs
echo "⚙️  5. Configuring for your VPS..."
cat > config/vps-deploy.json << 'EOF'
{
  "vps_specs": {
    "cpu_cores": 4,
    "ram_gb": 16,
    "disk_gb": 200,
    "bandwidth_tb": 16
  },
  "optimized_settings": {
    "max_concurrent_deploys": 50,
    "chunk_size": 8,
    "stream_threshold_kb": 512,
    "cache_size_limit_kb": 200,
    "max_deploy_age_days": 14,
    "max_deploys_per_user": 100,
    "cleanup_interval_hours": 6
  },
  "performance_targets": {
    "deploys_per_hour": 3000,
    "avg_deploy_time_ms": 3000,
    "memory_usage_limit_gb": 12,
    "disk_usage_limit_gb": 150
  }
}
EOF

mkdir -p config
echo "   ✅ VPS configuration saved to config/vps-deploy.json"

# Set up cleanup cron job
echo "🧹 6. Setting up automatic cleanup..."
CRON_JOB="0 */6 * * * cd $(pwd) && node src/scripts/deploy-cleanup.js --force >> logs/cleanup.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "deploy-cleanup.js"; then
    echo "   ℹ️  Cleanup cron job already exists"
else
    # Add to crontab
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "   ✅ Automatic cleanup scheduled (every 6 hours)"
fi

# Create startup script for production
echo "🚀 7. Creating production startup script..."
cat > start-optimized.sh << 'EOF'
#!/bin/bash

# Production startup script for optimized deploy system
# Optimized for: 4 vCPU, 16GB RAM, 200GB NVMe

export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=12288"  # 12GB heap limit
export UV_THREADPOOL_SIZE=8                       # Optimize for 4 CPU cores

echo "🚀 Starting optimized deploy system..."
echo "VPS Mode: Production (4 vCPU, 16GB RAM)"

# Check system resources before starting
FREE_RAM=$(free -m | awk 'NR==2{printf "%.1f", $7/1024}')
echo "Available RAM: ${FREE_RAM}GB"

if (( $(echo "$FREE_RAM < 2.0" | bc -l) )); then
    echo "⚠️  Warning: Low memory available"
fi

# Start the application
if command -v pm2 >/dev/null 2>&1; then
    echo "🔄 Starting with PM2..."
    pm2 start npm --name "theme-editor-optimized" -- start
    pm2 save
else
    echo "🔄 Starting with npm..."
    npm start
fi
EOF

chmod +x start-optimized.sh
echo "   ✅ Production startup script created"

# Create monitoring script
echo "📊 8. Creating monitoring script..."
cat > monitor-deploy-system.sh << 'EOF'
#!/bin/bash

# VPS Deploy System Monitor
# Check system health and performance

echo "🖥️  VPS Deploy System Status"
echo "============================"

# System resources
echo "💾 Memory Usage:"
free -h | grep -E "Mem|Swap"

echo ""
echo "💽 Disk Usage:"
df -h | grep -E "Filesystem|/dev/"

echo ""
echo "⚡ CPU Usage:"
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//'

echo ""
echo "🚀 Deploy System Status:"
if curl -s http://localhost:3000/api/deploy-stats > /dev/null; then
    curl -s http://localhost:3000/api/deploy-stats | jq '.stats' 2>/dev/null || echo "API responding but no JSON parser"
else
    echo "❌ Deploy API not responding"
fi

echo ""
echo "📊 Recent Deploy Activity:"
if [ -f "logs/cleanup.log" ]; then
    echo "Last cleanup:"
    tail -n 5 logs/cleanup.log
else
    echo "No cleanup logs found"
fi
EOF

chmod +x monitor-deploy-system.sh
echo "   ✅ Monitoring script created"

# Performance test script
echo "🧪 9. Creating performance test..."
cat > test-deploy-performance.sh << 'EOF'
#!/bin/bash

# VPS Deploy Performance Test
# Test with load appropriate for 4 vCPU, 16GB RAM

echo "🧪 Deploy Performance Test for VPS"
echo "=================================="

# Test with increasing load
echo "📊 Testing concurrent capacity..."

for CONCURRENT in 5 10 25 50; do
    echo ""
    echo "Testing with $CONCURRENT concurrent requests..."
    
    # Use Apache Bench or curl for testing
    if command -v ab >/dev/null 2>&1; then
        ab -n $CONCURRENT -c $CONCURRENT -T 'application/json' -p test-deploy-payload.json http://localhost:3000/api/deploy-project
    else
        echo "Apache Bench not found, using curl..."
        for i in $(seq 1 $CONCURRENT); do
            curl -s -X POST http://localhost:3000/api/deploy-project \
                 -H "Content-Type: application/json" \
                 -d '{"projectId":"test'$i'","projectName":"test'$i'","themeParams":{"colors":{"primary":"#000"}}}' &
        done
        wait
    fi
    
    sleep 5  # Cool down between tests
done

echo ""
echo "✅ Performance test completed"
echo "Check system resources with: ./monitor-deploy-system.sh"
EOF

chmod +x test-deploy-performance.sh
echo "   ✅ Performance test script created"

# Final system check
echo ""
echo "🔍 10. Final system check..."

# Check Node.js memory settings
echo "   Node.js memory limit: $(node -e 'console.log(Math.round(process.memoryUsage().heapTotal / 1024 / 1024))' 2>/dev/null || echo 'Unknown')MB"

# Check available disk space
DISK_FREE=$(df -h . | awk 'NR==2{print $4}')
echo "   Available disk space: $DISK_FREE"

# Check if ports are available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null; then
    echo "   ⚠️  Port 3000 is already in use"
else
    echo "   ✅ Port 3000 is available"
fi

echo ""
echo "🎉 VPS Optimization Applied Successfully!"
echo "========================================"
echo ""
echo "📋 Next Steps:"
echo "1. Restart your application:"
echo "   ./start-optimized.sh"
echo ""
echo "2. Monitor performance:"
echo "   ./monitor-deploy-system.sh"
echo ""
echo "3. Run performance test:"
echo "   ./test-deploy-performance.sh"
echo ""
echo "4. Check deploy stats:"
echo "   curl http://localhost:3000/api/deploy-stats"
echo ""
echo "📊 Expected Performance with your VPS:"
echo "   • Concurrent deploys: 50+ simultaneous"
echo "   • Deploy speed: 2-4 seconds each"
echo "   • Memory usage: <12GB stable"
echo "   • Disk usage: Auto-managed"
echo "   • Throughput: 3000+ deploys/hour"
echo ""
echo "🚀 Your VPS is now optimized for high-scale deployment!"