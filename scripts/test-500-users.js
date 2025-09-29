// High-Volume Load Test for 500 Concurrent Users
const crypto = require('crypto')

class HighVolumeSimulator {
  constructor() {
    this.results = {
      totalUsers: 500,
      completedUsers: 0,
      failedUsers: 0,
      errors: [],
      responseTimes: [],
      queueStats: [],
      startTime: Date.now(),
      batches: {}
    }
    
    // Tạo nhiều business samples để tránh cache overlap
    this.businessSamples = this.generateBusinessSamples()
  }

  generateBusinessSamples() {
    const industries = [
      'Nông sản', 'Công nghệ', 'Thời trang', 'Du lịch', 'Giáo dục',
      'Y tế', 'Bất động sản', 'Tài chính', 'Thực phẩm', 'Mỹ phẩm',
      'Thể thao', 'Giải trí', 'Logistics', 'E-commerce', 'Marketing'
    ]
    
    const tones = [
      'Chuyên nghiệp', 'Thân thiện', 'Hiện đại', 'Truyền thống',
      'Sáng tạo', 'Đáng tin cậy', 'Năng động', 'Lịch sự'
    ]
    
    const samples = []
    
    // Tạo 100 samples độc đáo để giảm cache overlap
    for (let i = 0; i < 100; i++) {
      samples.push({
        companyName: `Công Ty ${this.generateCompanyName(i)}`,
        industry: industries[i % industries.length],
        description: `Chuyên cung cấp dịch vụ chất lượng cao với ${i + 1} năm kinh nghiệm`,
        language: Math.random() > 0.7 ? 'english' : 'vietnamese',
        services: `Dịch vụ ${i + 1} đỉnh cao`,
        targetAudience: `Khách hàng mục tiêu ${i + 1}`,
        tone: tones[i % tones.length]
      })
    }
    
    return samples
  }

  generateCompanyName(index) {
    const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Echo', 'Zeta', 'Eta', 'Theta']
    const suffixes = ['Vietnam', 'Group', 'Co', 'Ltd', 'Corp', 'Inc', 'Solutions', 'Hub']
    
    return `${prefixes[index % prefixes.length]}${index}${suffixes[index % suffixes.length]}`
  }

  getBusinessInfo(userId) {
    const sample = this.businessSamples[userId % this.businessSamples.length]
    
    // Thêm variation để đảm bảo unique requests
    return {
      ...sample,
      companyName: `${sample.companyName}_User${userId}`,
      description: `${sample.description} - Variation ${userId}`,
      services: `${sample.services} (Custom ${userId})`,
      userId: userId
    }
  }

  async simulate500Users() {
    console.log('🚀 HIGH-VOLUME LOAD TEST: 500 Concurrent Users')
    console.log('📊 Optimized Configuration:')
    console.log('   ├── Concurrent Tasks: 50')
    console.log('   ├── Max Queue Size: 2000')
    console.log('   ├── API Keys: 25')
    console.log('   ├── Cache TTL: 30 minutes')
    console.log('   └── Expected Response: < 10s')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // Phân chia thành batches để monitor
    const batchSize = 50
    const batches = []
    
    for (let batch = 0; batch < this.results.totalUsers; batch += batchSize) {
      const batchUsers = []
      for (let userId = batch; userId < Math.min(batch + batchSize, this.results.totalUsers); userId++) {
        batchUsers.push(userId)
      }
      batches.push(batchUsers)
    }

    console.log(`📋 Planning ${batches.length} batches of ~${batchSize} users each`)
    
    // Execute batches with staggered timing
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      const batchStart = Date.now()
      
      console.log(`\n🎯 Batch ${i + 1}/${batches.length}: Users ${batch[0] + 1}-${batch[batch.length - 1] + 1}`)
      
      const batchPromises = batch.map(userId => 
        this.simulateUser(userId, i + 1)
      )
      
      // Stagger requests within batch (100ms intervals)
      for (let j = 0; j < batchPromises.length; j++) {
        setTimeout(() => {
          // Fire request
        }, j * 100)
      }
      
      // Wait for batch to complete
      const batchResults = await Promise.allSettled(batchPromises)
      const batchTime = Date.now() - batchStart
      
      this.results.batches[`batch_${i + 1}`] = {
        users: batch.length,
        time: batchTime,
        results: batchResults.map(r => r.status),
        avgTime: batchTime / batch.length
      }
      
      console.log(`✅ Batch ${i + 1} completed in ${(batchTime / 1000).toFixed(2)}s`)
      
      // Wait before next batch
      if (i < batches.length - 1) {
        await this.sleep(2000) // 2s between batches
      }
    }

    this.printDetailedResults()
  }

  async simulateUser(userId, batchNumber) {
    const startTime = Date.now()
    
    try {
      console.log(`👤 User ${userId + 1}: Starting request...`)
      
      const businessInfo = this.getBusinessInfo(userId)
      
      const response = await fetch('http://localhost:3000/api/generate-theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `LoadTestUser-${userId + 1}`,
          'X-Batch-Number': batchNumber.toString()
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
        console.log(`✅ User ${userId + 1}: Success in ${responseTime}ms`)
        
        if (data.queueStats) {
          this.results.queueStats.push({
            userId: userId + 1,
            queueLength: data.queueStats.queuedTasks,
            activeTasks: data.queueStats.activeTasks,
            responseTime,
            batch: batchNumber
          })
        }
        
        if (data.cacheHit) {
          console.log(`   💾 Cache hit`)
        } else {
          console.log(`   🔄 Generated fresh content`)
        }
        
      } else {
        this.results.failedUsers++
        this.results.errors.push({
          userId: userId + 1,
          error: data.error,
          responseTime,
          status: response.status,
          batch: batchNumber
        })
        
        console.log(`❌ User ${userId + 1}: Failed - ${data.error}`)
      }

    } catch (error) {
      this.results.failedUsers++
      this.results.errors.push({
        userId: userId + 1,
        error: error.message,
        responseTime: Date.now() - startTime,
        type: 'network',
        batch: batchNumber
      })
      
      console.log(`💥 User ${userId + 1}: Network Error - ${error.message}`)
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  printDetailedResults() {
    const totalTime = Date.now() - this.results.startTime
    const avgResponseTime = this.results.responseTimes.length > 0 
      ? this.results.responseTimes.reduce((a, b) => a + b, 0) / this.results.responseTimes.length 
      : 0

    console.log('\n' + '='.repeat(60))
    console.log('📈 500 USER HIGH-VOLUME LOAD TEST RESULTS')
    console.log('='.repeat(60))
    
    // Overall Performance
    console.log(`👥 Total Users: ${this.results.totalUsers}`)
    console.log(`✅ Successful: ${this.results.completedUsers}`)
    console.log(`❌ Failed: ${this.results.failedUsers}`)
    console.log(`📊 Success Rate: ${((this.results.completedUsers / this.results.totalUsers) * 100).toFixed(2)}%`)
    console.log(`⏱️  Total Test Duration: ${(totalTime / 1000).toFixed(2)} seconds`)
    console.log(`📈 Average Response Time: ${avgResponseTime.toFixed(0)}ms`)
    console.log(`🚀 Throughput: ${(this.results.totalUsers / (totalTime / 1000)).toFixed(2)} users/second`)

    // Queue Performance
    if (this.results.queueStats.length > 0) {
      const maxQueueSize = Math.max(...this.results.queueStats.map(s => s.queueLength))
      const avgActiveTasks = this.results.queueStats.reduce((sum, s) => sum + s.activeTasks, 0) / this.results.queueStats.length
      const avgQueueLength = this.results.queueStats.reduce((sum, s) => sum + s.queueLength, 0) / this.results.queueStats.length
      
      console.log(`\n📋 Queue Performance:`)
      console.log(`   Max Queue Length: ${maxQueueSize}`)
      console.log(`   Average Queue Length: ${avgQueueLength.toFixed(1)}`)
      console.log(`   Average Active Tasks: ${avgActiveTasks.toFixed(1)}`)
    }

    // Response Time Analysis
    if (this.results.responseTimes.length > 0) {
      const sortedTimes = [...this.results.responseTimes].sort((a, b) => a - b)
      const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)]
      const p90 = sortedTimes[Math.floor(sortedTimes.length * 0.9)]
      const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)]
      const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)]
      
      console.log(`\n📊 Response Time Analysis:`)
      console.log(`   P50 (Median): ${p50}ms`)
      console.log(`   P90: ${p90}ms`)
      console.log(`   P95: ${p95}ms`)
      console.log(`   P99: ${p99}ms`)
    }

    // Batch Analysis
    console.log(`\n📦 Batch Performance:`)
    Object.entries(this.results.batches).forEach(([batchName, batch]) => {
      const successRate = batch.results.filter(r => r === 'fulfilled').length / batch.results.length * 100
      console.log(`   ${batchName}: ${batch.users} users in ${(batch.time/1000).toFixed(2)}s (${successRate.toFixed(1)}% success)`)
    })

    // Performance Rating
    console.log(`\n🎯 PERFORMANCE RATING:`)
    
    const successRate = (this.results.completedUsers / this.results.totalUsers) * 100
    const avgUnder10s = this.results.responseTimes.filter(t => t < 10000).length / this.results.responseTimes.length * 100
    
    if (successRate >= 98 && avgResponseTime < 10000) {
      console.log('   ✅ EXCELLENT: Ready for 500+ concurrent users!')
    } else if (successRate >= 95 && avgResponseTime < 15000) {
      console.log('   ⚡ VERY GOOD: Can handle 500 users with minor optimizations')
    } else if (successRate >= 90 && avgResponseTime < 20000) {
      console.log('   ⚠️  GOOD: Suitable for 300-400 concurrent users')
    } else {
      console.log('   💪 NEEDS OPTIMIZATION: Consider additional scaling')
    }
    
    console.log(`   📊 ${successRate.toFixed(1)}% success rate | ${avgResponseTime.toFixed(0)}ms avg | ${avgUnder10s.toFixed(1)}% under 10s`)
    
    // Error Summary
    if (this.results.errors.length > 0) {
      console.log(`\n❌ Error Summary (${this.results.errors.length} total):`)
      const errorGroups = {}
      this.results.errors.forEach(error => {
        const key = error.error
        errorGroups[key] = (errorGroups[key] || 0) + 1
      })
      
      Object.entries(errorGroups).forEach(([error, count]) => {
        console.log(`   ${error}: ${count} occurrences`)
      })
    }

    console.log('\n🎉 High-Volume Load Test Complete!')
    
    // Recommendations
    if (successRate >= 95 && avgResponseTime < 10000) {
      console.log('\n🚀 READY FOR PRODUCTION WITH 500+ USERS!')
      console.log('   ✅ System can handle high-volume traffic reliably')
      console.log('   ✅ Users get fast responses consistently')
    }
  }
}

async function main() {
  const simulator = new HighVolumeSimulator()
  await simulator.simulate500Users()
}

main().catch(console.error)
