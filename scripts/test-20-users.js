// Simulation test for 20 concurrent users
const crypto = require('crypto')

class ConcurrentUserSimulator {
  constructor() {
    this.results = {
      totalUsers: 20,
      completedUsers: 0,
      failedUsers: 0,
      errors: [],
      responseTimes: [],
      queueStats: [],
      startTime: Date.now()
    }
    
    // Business info samples for different users
    this.businessSamples = [
      {
        companyName: "Cà Phê Việt Nam Premium",
        industry: "Nông sản",
        description: "Cung cấp cà phê chất lượng cao từ vùng Tây Nguyên",
        language: "vietnamese",
        services: "Xuất khẩu cà phê premium",
        targetAudience: "Khách hàng quốc tế",
        tone: "Chuyên nghiệp"
      },
      {
        companyName: "Vietnam Coffee Trading Co.",
        industry: "Agriculture", 
        description: "Premium coffee supplier with international standards",
        language: "english",
        services: "Premium coffee export",
        targetAudience: "International customers",
        tone: "Professional"
      },
      {
        companyName: "Công Ty Nông Nghiệp ABC",
        industry: "Thực phẩm",
        description: "Chuyên sản xuất và xuất khẩu các sản phẩm nông nghiệp",
        language: "vietnamese", 
        services: "Sản xuất và xuất khẩu thực phẩm",
        targetAudience: "Thị trường nội địa và quốc tế",
        tone: "Thân thiện"
      },
      {
        companyName: "Tech Solutions Vietnam",
        industry: "Công nghệ",
        description: "Cung cấp giải pháp công nghệ cho doanh nghiệp",
        language: "english",
        services: "Software development",
        targetAudience: "Enterprises",
        tone: "Innovative"
      },
      {
        companyName: "Fashion Store International",
        industry: "Thời trang", 
        description: "Nhà bán lẻ thời trang quốc tế",
        language: "vietnamese",
        services: "Bán lẻ và phân phối thời trang",
        targetAudience: "Khách hàng trẻ",
        tone: "Hiện đại"
      }
    ]
  }

  generateBusinessInfo(userId) {
    const sample = this.businessSamples[userId % this.businessSamples.length]
    
    // Add variations for each user
    return {
      ...sample,
      companyName: `${sample.companyName} ${userId}`,
      description: `${sample.description} - User ID: ${userId}`,
      services: `${sample.services} (Variation ${userId})`
    }
  }

  async simulateUsersConcurrent() {
    console.log('🚀 Starting 20 User Simulation...')
    console.log('📊 Queue System: 10 concurrent / 500 max queue / 2min timeout')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    const userPromises = []
    
    // Create 20 concurrent user simulations
    for (let userId = 1; userId <= 20; userId++) {
      const userPromise = this.simulateUser(userId)
      userPromises.push(userPromise)
      
      // Small stagger to simulate realistic access patterns
      await this.sleep(200) // 200ms between users
    }

    console.log(`📋 All ${this.results.totalUsers} users queued!`)
    
    // Wait for all users to complete
    await Promise.allSettled(userPromises)
    
    this.printResults()
  }

  async simulateUser(userId) {
    const startTime = Date.now()
    
    try {
      console.log(`👤 User ${userId}: Starting request...`)
      
      const businessInfo = this.generateBusinessInfo(userId)
      
      const response = await fetch('http://localhost:3000/api/generate-theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `User-${userId}-Simulator`,
          'X-Simulator-User': userId.toString()
        },
        body: JSON.stringify({
          businessInfo,
          currentTheme: null
        })
      })

      const data = await response.json()
      const responseTime = Date.now() - startTime

      this.results.responseTimes.push(responseTime)
      this.results.completedUsers++

      if (response.ok && data.success) {
        console.log(`✅ User ${userId}: Success in ${responseTime}ms`)
        
        // Extract performance data
        if (data.queueStats) {
          this.results.queueStats.push({
            userId,
            queueLength: data.queueStats.queuedTasks,
            activeTasks: data.queueStats.activeTasks,
            responseTime
          })
        }
        
        if (data.performance) {
          console.log(`   📊 Priority: ${data.performance.priority?.toFixed(3)} | Total Time: ${data.performance.totalTime}ms`)
        }
        
        if (data.cacheHit) {
          console.log(`   💾 Cached response served`)
        }
        
      } else {
        this.results.failedUsers++
        this.results.errors.push({
          userId,
          error: data.error,
          responseTime,
          status: response.status
        })
        
        console.log(`❌ User ${userId}: Failed - ${data.error}`)
        
        if (data.queueStats) {
          console.log(`   📊 Queue: ${data.queueStats.queuedTasks} waiting, ${data.queueStats.activeTasks} active`)
        }
      }

    } catch (error) {
      this.results.failedUsers++
      this.results.errors.push({
        userId,
        error: error.message,
        responseTime: Date.now() - startTime,
        type: 'network'
      })
      
      console.log(`💥 User ${userId}: Network Error - ${error.message}`)
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async checkSystemStatus() {
    console.log('\n🔍 Checking System Status...')
    
    try {
      const response = await fetch('http://localhost:3000/api/generate-theme?action=debug')
      const data = await response.json()
      
      if (data.success) {
        console.log('📊 System Debug Info:')
        console.log(`   🔑 API Keys: ${data.debug.apiKeys.total} total, ${data.debug.apiKeys.available} available`)
        console.log(`   📦 Cache: ${data.debug.cache.size} entries, ${(data.debug.cache.hitRate * 100).toFixed(1)}% hit rate`)
        console.log(`   📋 Queue: ${data.debug.queue.queuedTasks} queued, ${data.debug.queue.activeTasks} active`)
        console.log(`   ✅ Queue Healthy: ${data.debug.queueHealthy ? 'Yes' : 'No'}`)
      }
    } catch (error) {
      console.log('❌ Could not get system status:', error.message)
    }
  }

  printResults() {
    const totalTime = Date.now() - this.results.startTime
    const avgResponseTime = this.results.responseTimes.length > 0 
      ? this.results.responseTimes.reduce((a, b) => a + b, 0) / this.results.responseTimes.length 
      : 0

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📈 20 USER CONCURRENT TEST RESULTS')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`👥 Total Users: ${this.results.totalUsers}`)
    console.log(`✅ Successful: ${this.results.completedUsers}`)
    console.log(`❌ Failed: ${this.results.failedUsers}`)
    console.log(`📊 Success Rate: ${((this.results.completedUsers / this.results.totalUsers) * 100).toFixed(1)}%`)
    console.log(`⏱️  Total Time: ${(totalTime / 1000).toFixed(2)} seconds`)
    console.log(`📈 Average Response Time: ${avgResponseTime.toFixed(0)}ms`)
    console.log(`🚀 Users/Second: ${(this.results.totalUsers / (totalTime / 1000)).toFixed(2)}`)

    if (this.results.queueStats.length > 0) {
      const maxQueueSize = Math.max(...this.results.queueStats.map(s => s.queueLength))
      const avgActiveTasks = this.results.queueStats.reduce((sum, s) => sum + s.activeTasks, 0) / this.results.queueStats.length
      
      console.log(`📋 Max Queue Length: ${maxQueueSize}`)
      console.log(`⚡ Average Active Tasks: ${avgActiveTasks.toFixed(1)}`)
    }

    // Response time breakdown
    if (this.results.responseTimes.length > 0) {
      const sortedTimes = [...this.results.responseTimes].sort((a, b) => a - b)
      const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)]
      const p90 = sortedTimes[Math.floor(sortedTimes.length * 0.9)]
      const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)]
      
      console.log(`📊 Response Time Percentiles:`)
      console.log(`   P50: ${p50}ms`)
      console.log(`   P90: ${p90}ms`) 
      console.log(`   P95: ${p95}ms`)
    }

    if (this.results.errors.length > 0) {
      console.log('\n❌ ERRORS SUMMARY:')
      const errorGroups = {}
      this.results.errors.forEach(error => {
        const key = error.error
        errorGroups[key] = (errorGroups[key] || 0) + 1
      })
      
      Object.entries(errorGroups).forEach(([error, count]) => {
        console.log(`   ${error}: ${count} users`)
      })
    }

    // Performance analysis
    console.log('\n🎯 PERFORMANCE ANALYSIS:')
    
    if (this.results.completedUsers >= 18) {
      console.log('   ✅ Excellent: System handled high load well')
    } else if (this.results.completedUsers >= 15) {
      console.log('   ⚠️  Good: Some users failed, consider tuning')
    } else {
      console.log('   ❌ Poor: System struggling with load')
    }
    
    if (avgResponseTime < 10000) {
      console.log('   ✅ Fast: Response times under 10s')
    } else if (avgResponseTime < 30000) {
      console.log('   ⚠️  Moderate: Response times 10-30s')
    } else {
      console.log('   ❌ Slow: Response times over 30s')
    }

    if (totalTime < 60000) {
      console.log('   ✅ Efficient: All users completed under 1 minute')
    } else if (totalTime < 120000) {
      console.log('   ⚠️  Acceptable: Completed under 2 minutes')
    } else {
      console.log('   ❌ Slow: Took over 2 minutes')
    }
  }
}

async function main() {
  console.log('🌐 Generate Theme API - 20 User Load Test')
  console.log('📅 ' + new Date().toISOString())
  console.log('')
  
  const simulator = new ConcurrentUserSimulator()
  
  // Check system status first
  await simulator.checkSystemStatus()
  
  console.log('\n🚀 Starting User Simulation...')
  console.log('💡 Tips: Watch the server logs for detailed queue behavior')
  console.log('📱 Each user represents a different business type')
  console.log('')
  
  // Run the simulation
  await simulator.simulateUsersConcurrent()
  
  console.log('\n🎉 Simulation Complete!')
}

main()
