// Test cache key generation with Unicode content
import { generateCacheKey } from '../src/lib/ai-cache.js'

function testCacheKey() {
  console.log('🧪 Testing Cache Key Generation...')
  
  const testCases = [
    {
      name: "Vietnamese content",
      businessInfo: {
        companyName: "Cà Phê Việt Nam",
        industry: "Nông sản",
        description: "Cung cấp cà phê chất lượng cao vượt trội",
        language: "vietnamese",
        services: "Xuất khẩu cà phê organic",
        targetAudience: "Khách hàng quốc tế",
        tone: "Chuyên nghiệp"
      }
    },
    {
      name: "English content", 
      businessInfo: {
        companyName: "Vietnam Coffee Trading Co.",
        industry: "Agriculture",
        description: "Premium coffee supplier with international standards",
        language: "english",
        services: "Premium coffee export",
        targetAudience: "International customers",
        tone: "Professional"
      }
    },
    {
      name: "Mixed content",
      businessInfo: {
        companyName: "🇻🇳 Coffee Việt Nam 🇻🇳",
        industry: "Agriculture/農林業",
        description: "Premium cà phê quốc tế 国際 コーヒー",
        language: "bilingual",
        services: "Export/輸出",
        targetAudience: "Global customers/グローバル 顧客",
        tone: "Multilingual"
      }
    }
  ]

  for (const testCase of testCases) {
    try {
      console.log(`\n📝 Testing: ${testCase.name}`)
      const cacheKey = generateCacheKey(testCase.businessInfo)
      console.log(`✅ Cache key generated: ${cacheKey}`)
      console.log(`📏 Length: ${cacheKey.length} characters`)
      
      // Test deterministic behavior
      const cacheKey2 = generateCacheKey(testCase.businessInfo)
      if (cacheKey === cacheKey2) {
        console.log(`✅ Deterministic: keys match`)
      } else {
        console.log(`❌ Non-deterministric: keys differ`)
      }
      
    } catch (error) {
      console.log(`❌ Error for ${testCase.name}:`, error.message)
    }
  }
}

console.log('🚀 Cache Key Test')
console.log('=================')
testCacheKey()
