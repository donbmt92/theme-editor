// Test script để debug queue health issue

// Simulate imports (để test offline)
const mockQueueStats = {
  activeTasks: 0,
  queuedTasks: 0,
  completedTasks: 0,
  failedTasks: 0,
  averageWaitTime: 0,
  averageTaskTime: 0
}

function isQueueHealthy(stats = mockQueueStats) {
  const avgWaitTimeMinutes = stats.averageWaitTime / 1000 / 60
  
  const totalTasks = stats.completedTasks + stats.failedTasks
  const failureRate = totalTasks > 0 ? stats.failedTasks / totalTasks : 0
  
  const isHealthy = stats.queuedTasks < 500 && 
                    avgWaitTimeMinutes < 10 && 
                    failureRate < 0.20
  
  // Debug logging
  console.log('🔍 Queue Health Check:', {
    queuedTasks: stats.queuedTasks,
    activeTasks: stats.activeTasks,
    completedTasks: stats.completedTasks,
    failedTasks: stats.failedTasks,
    avgWaitTimeMinutes: avgWaitTimeMinutes.toFixed(2),
    failureRate: failureRate.toFixed(3),
    thresholds: {
      maxQueue: 500,
      maxWaitTime: 10,
      maxFailureRate: 0.20
    },
    isHealthy
  })

  return isHealthy
}

// Test cases
console.log('='.repeat(50))
console.log('🧪 TESTING QUEUE HEALTH LOGIC')
console.log('='.repeat(50))

// Test 1: Empty queue (should be healthy)
console.log('\n1️⃣ Test: Empty Queue:')
const emptyResult = isQueueHealthy({
  activeTasks: 0,
  queuedTasks: 0,
  completedTasks: 0,
  failedTasks: 0,
  averageWaitTime: 0,
  averageTaskTime: 0
})

// Test 2: Queue with some failed tasks (simulating your error case)
console.log('\n2️⃣ Test: Queue with Previous Failures:')
const failureResult = isQueueHealthy({
  activeTasks: 0,
  queuedTasks: 0,
  completedTasks: 5,
  failedTasks: 10, // 66% failure rate
  averageWaitTime: 30000, // 30 seconds average wait
  averageTaskTime: 15000
})

// Test 3: Small queue with good performance
console.log('\n3️⃣ Test: Good Performance Queue:')
const goodResult = isQueueHealthy({
  activeTasks: 3,
  queuedTasks: 5,
  completedTasks: 90,
  failedTasks: 10, // 10% failure rate
  averageWaitTime: 5000, // 5 seconds
  averageTaskTime: 12000
})

// Test 4: Underlying issue detection
console.log('\n4️⃣ Root Cause Analysis:')
console.log('💡 Có thể Queue singleton instance có values từ previous sessions')
console.log('💡 FailedTasks cao từ previous runs')
console.log('💡 AverageWaitTime cao từ previous runs')
console.log('✅ Solution: Reset queue stats on startup')

console.log('\n' + '='.repeat(50))
console.log('🎯 SUMMARY:')
console.log('Empty Queue:', emptyResult ? '✅ Healthy' : '❌ Unhealthy')
console.log('Failure Case:', failureResult ? '✅ Healthy' : '❌ Unhealthy') 
console.log('Good Case:', goodResult ? '✅ Healthy' : '❌ Unhealthy')

if (!emptyResult || !failureResult) {
  console.log('\n🚨 PROBLEM DETECTED!')
  console.log('Queue health logic may be too strict or has state persistence issues')
  console.log('Suggested fix: Reset stats on fresh starts or adjust thresholds')
}
