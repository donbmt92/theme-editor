// Simple test to verify cache key generation works with Unicode

function generateCacheKey(businessInfo) {
  const keyData = {
    companyName: businessInfo?.companyName,
    industry: businessInfo?.industry, 
    description: businessInfo?.description,
    language: businessInfo?.language,
    services: businessInfo?.services,
    targetAudience: businessInfo?.targetAudience,
    tone: businessInfo?.tone
  }
  
  // Test the new approach using Buffer  
  try {
    const jsonString = JSON.stringify(keyData)
    const buffer = Buffer.from(jsonString, 'utf8')
    return buffer.toString('base64')
      .replace(/[+/=]/g, '')
      .substring(0, 32)
  } catch (error) {
    // Fallback: simple string hash for browser environments
    const jsonString = JSON.stringify(keyData)
    let hash = 0
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 32)
  }
}

function testCacheKey() {
  console.log('🧪 Testing Cache Key Generation with Unicode...')
  
  const testCases = [
    {
      name: "Vietnamese content",
      businessInfo: {
        companyName: "Cà Phê Việt Nam",
        industry: "Nông sản", 
        description: "Cung cấp cà phê chất lượng cao",
        language: "vietnamese"
      }
    },
    {
      name: "Emoji content",
      businessInfo: {
        companyName: "🇻🇳 Coffee Company 🇻🇳",
        industry: "☕ Agriculture ☕",
        description: "Premium cà phê quốc tế 🌍",
        language: "multilingual"
      }
    },
    {
      name: "Special characters",
      businessInfo: {
        companyName: "Công ty ABC & Sons™",
        industry: "Agribusiness (Nông nghiệp)",
        description: "Sản phẩm/sản phẩm cao cấp 100%",
        language: "vi-en"
      }
    }
  ]

  for (const testCase of testCases) {
    try {
      console.log(`\n📝 Testing: ${testCase.name}`)
      const cacheKey = generateCacheKey(testCase.businessInfo)
      console.log(`✅ Cache key: ${cacheKey}`)
      console.log(`📏 Length: ${cacheKey.length} characters`)
      
      // Test deterministic behavior
      const cacheKey2 = generateCacheKey(testCase.businessInfo)
      if (cacheKey === cacheKey2) {
        console.log(`✅ Deterministic: keys match`)
      } else {
        console.log(`❌ Non-deterministic: keys differ`)
      }
      
    } catch (error) {
      console.log(`❌ Error for ${testCase.name}:`, error.message)
    }
  }
}

console.log('🚀 Cache Key Unicode Test')
console.log('==========================')
testCacheKey()
