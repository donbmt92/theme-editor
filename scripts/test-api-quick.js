async function testAPI() {
  console.log('🧪 Testing Generate Theme API...')
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Test'
      },
      body: JSON.stringify({
        businessInfo: {
          companyName: "Test Coffee Company",
          industry: "Nông sản",
          description: "Cung cấp cà phê chất lượng cao",
          language: "vietnamese",
          services: "Xuất khẩu cà phê",
          targetAudience: "Khách hàng quốc tế",
          tone: "Chuyên nghiệp"
        },
        currentTheme: null
      })
    })

    const data = await response.json()
    
    if (response.ok && data.success) {
      console.log('✅ API test successful!')
      console.log('📊 Response data keys:', Object.keys(data))
      
      if (data.themeParams) {
        console.log('🎨 Colors:', data.themeParams.colors)
      }
      
      if (data.queueStats) {
        console.log('📈 Queue stats:', data.queueStats)
      }
      
      if (data.performance) {
        console.log('⚡ Performance:', data.performance.totalTime + 'ms')
      }
    } else {
      console.log('❌ API test failed:', data.error)
      
      if (data.queueStats) {
        console.log('📊 Queue status:', data.queueStats)
      }
      
      if (data.queueStats?.queuedTasks > 50) {
        console.log('⚠️  High queue load detected:', data.queueStats.queuedTasks, 'tasks')
      }
    }

  } catch (error) {
    console.log('💥 Network error:', error.message)
    console.log('Make sure the server is running: npm run dev')
  }
}

console.log('🚀 Quick API Test')
console.log('================')
testAPI()