const crypto = require('crypto')

// Configuration for testing high volume traffic
const config = {
  baseUrl: 'http://localhost:3000', // Change to your API URL
  totalRequests: 600,
  concurrentRequest: 50,
  requestInterval: 100, // 100ms between requests
  timeoutMs: 300000, // 5 minutes
  businessInfoExamples: [
    {
      companyName: "Cà Phê Việt Nam",
      industry: "Nông sản",
      description: "Cung cấp cà phê chất lượng cao",
      language: "vietnamese",
      services: "Xuất khẩu cà phê",
      targetAudience: "Khách hàng quốc tế",
      tone: "Chuyên nghiệp"
    },
    {
      companyName: "Vietnam Coffee Trading",
      industry: "Agriculture",
      description: "Premium coffee supplier",
      language: "english",
      services: "Coffee export",
      targetAudience: "International customers",
      tone: "Professional"
    },
    {
      companyName: "Công Ty ABC",
      industry: "Công nghệ",
      description: "Dịch vụ phát triển phần mềm",
      language: "vietnamese",
      services: "Phát triển ứng dụng web",
      targetAudience: "Doanh nghiệp",
      tone: "Trẻ trung"
    }
  ]
}

class APITestRunner {
  constructor() {
    this.results = {
      total: 0,
      success: 0,
      errors: [],
      responseTimes: [],
      startTime: Date.now(),
      queueStats: []
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  generateBusinessInfo() {
    const example = config.businessInfoExamples[
      Math.floor(Math.random() * config.businessInfoExamples.length)
    ]
    
    // Add randomized elements
    return {
      ...example,
      companyName: `${example.companyName} ${Math.floor(Math.random() * 1000)}`,
      description: `${example.description} - Random ID: ${crypto.randomBytes(3).toString('hex')}`
    }
  }

  async makeRequest(endpoint = '/api/generate-theme') {
    const businessInfo = this.generateBusinessInfo()
    const startTime = Date.now()
    
    try {
      console.log(`🌐 Sending request ${this.results.total + 1}/${config.totalRequests}`)
      
      const response = await fetch(`${config.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `API-Test-${Math.random().toString(36).substr(2, 9)}`
        },
        body: JSON.stringify({
          businessInfo,
          currentTheme: null
        })
      })

      const data = await response.json()
      const responseTime = Date.now() - startTime

      this.results.total++
      this.results.responseTimes.push(responseTime)

      if (response.ok && data.success) {
        this.results.success++
        console.log(`✅ Request ${this.results.total} succeeded in ${responseTime}ms`)
        
        // Extract queue stats if available
        if (data.queueStats) {
          this.results.queueStats.push(data.queueStats)
        }
      } else {
        this.results.errors.push({
          request: this.results.total,
          status: response.status,
          error: data.error || 'Unknown error',
          responseTime
        })
        console.log(`❌ Request ${this.results.total} failed: ${data.error}`)
      }

    } catch (error) {
      this.results.total++
      this.results.errors.push({
        request: this.results.total,
        status: 'NETWORK_ERROR',
        error: error.message,
        responseTime: Date.now() - startTime
      })
      console.log(`💥 Request ${this.results.total} network error: ${error.message}`)
    }
  }

  async runConcurrentBatch(batchSize) {
    const promises = []
    
    for (let i = 0; i < batchSize; i++) {
      promises.push(this.makeRequest())
      
      // Small delay to avoid overwhelming
      if (i % 10 === 0 && i > 0) {
        await this.sleep(50)
      }
    }
    
    await Promise.all(promises)
  }

  async runLoadTest() {
    console.log(`🚀 Starting load test with ${config.totalRequests} total requests`)
    console.log(`📊 Configuration: ${config.concurrentRequest} concurrent requests, ${config.requestInterval}ms interval`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    const totalTime = Date.now()
    let processedRequests = 0

    while (processedRequests < config.totalRequests) {
      const remainingRequests = config.totalRequests - processedRequests
      const currentBatchSize = Math.min(config.concurrentRequest, remainingRequests)
      
      console.log(`📦 Processing batch: ${processedRequests + 1}-${processedRequests + currentBatchSize}`)
      
      await this.runConcurrentBatch(currentBatchSize)
      processedRequests += currentBatchSize
      
      if (processedRequests < config.totalRequests) {
        await this.sleep(config.requestInterval)
      }
    }

    const totalTime = Date.now() - totalTime
    this.printResults(totalTime)
  }

  async checkSystemHealth() {
    console.log('🔍 Checking system health...')
    
    try {
      const response = await fetch(`${config.baseUrl}/api/generate-theme?action=health`)
      const data = await response.json()
      
      if (data.success) {
        console.log('✅ System Health:', data)
      } else {
        console.log('❌ System Health Check Failed:', data)
      }
    } catch (error) {
      console.log('💥 Health check failed:', error.message)
    }
  }

  printResults(totalTime) {
    const avgResponseTime = this.results.responseTimes.length > 0 
      ? this.results.responseTimes.reduce((a, b) => a + b, 0) / this.results.responseTimes.length 
      : 0
    
    const successRate = ((this.results.success / this.results.total) * 100).toFixed(2)
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📈 LOAD TEST RESULTS')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Total Requests: ${this.results.total}`)
    console.log(`Successful: ${this.results.success}`)
    console.log(`Failed: ${this.results.errors.length}`)
    console.log(`Success Rate: ${successRate}%`)
    console.log(`Total Time: ${(totalTime / 1000).toFixed(2)} seconds`)
    console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`)
    console.log(`Requests/second: ${(this.results.total / (totalTime / 1000)).toFixed(2)}`)
    
    if (this.results.queueStats.length > 0) {
      const avgQueueLength = this.results.queueStats.reduce((sum, stats) => sum + stats.queuedTasks, 0) / this.results.queueStats.length
      console.log(`Average Queue Length: ${avgQueueLength.toFixed(2)}`)
    }

    if (this.results.errors.length > 0) {
      console.log('\n❌ ERRORS SUMMARY:')
      const errorCounts = {}
      this.results.errors.forEach(error => {
        errorCounts[error.error] = (errorCounts[error.error] || 0) + 1
      })
      
      Object.entries(errorCounts).forEach(([error, count]) => {
        console.log(`  ${error}: ${count} times`)
      })
    }

    console.log('\n🎯 PERFORMANCE RECOMMENDATIONS:')
    
    if (parseFloat(successRate) < 95) {
      console.log('  ⚠️  Consider scaling infrastructure (success rate < 95%)')
    }
    
    if (avgResponseTime > 30000) {
      console.log('  ⚠️  Consider optimizing AI API response time (>30s)')
    }
    
    if (avgQueueLength > 50) {
      console.log('  ⚠️  Consider increasing queue capacity (>50 tasks)')
    }
    
    if (parseFloat(successRate) >= 95 && avgResponseTime < 10000) {
      console.log('  ✅ System performing well under load!')
    }
  }
}

// Run the test
async function main() {
  if (process.argv.includes('--health')) {
    const runner = new APITestRunner()
    await runner.checkSystemHealth()
    return
  }

  if (process.argv.includes('--small')) {
    config.totalRequests = 50
    config.concurrentRequest = 10
  }

  console.log('🌐 API Load Testing Tool for GenerateTheme')
  console.log('📄 Usage:')
  console.log('  node test-high-volume-api.js          # Full test (600 requests)')
  console.log('  node test-high-volume-api.js --small  # Small test (50 requests)')  
  console.log('  node test-high-volume-api.js --health # Health check only')
  console.log('')

  const runner = new APITestRunner()
  
  // Quick health check first
  await runner.checkSystemHealth()
  console.log('')
  
  // Run load test
  await runner.runLoadTest()
}

main().catch(console.error)
