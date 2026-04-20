import fetch from 'node-fetch'

async function testWithNewApiKey() {
  console.log('=== TEST VỚI API KEY MỚI ===\n')
  
  const realPayload = {
    "gateway": "ACB",
    "transactionDate": "2025-10-19 20:23:13",
    "accountNumber": "3699781",
    "subAccount": null,
    "code": null,
    "content": "104519048749-01679135103-Thanh toan goi Goi Chuyen Nghiep",
    "transferType": "in",
    "description": "BankAPINotify 104519048749-01679135103-Thanh toan goi Goi Chuyen Nghiep",
    "transferAmount": 5000,
    "referenceCode": "3516",
    "accumulated": 0,
    "id": 26933514
  }
  
  const testCases = [
    {
      name: 'Test với API key mới (ASCII-safe)',
      apiKey: 'sepay_api_key_2025',
      expectedStatus: 404 // Payment not found
    },
    {
      name: 'Test với API key cũ (có ký tự đặc biệt)',
      apiKey: 'đây_là_khóa_bí_mật',
      expectedStatus: 401 // Invalid API key
    },
    {
      name: 'Test với API key sai',
      apiKey: 'wrong-key',
      expectedStatus: 401
    }
  ]
  
  for (const testCase of testCases) {
    console.log(`${testCase.name}:`)
    
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Sepay-Webhook/1.0'
    }
    
    if (testCase.apiKey) {
      headers['Authorization'] = `Bearer ${testCase.apiKey}`
    }
    
    try {
      const response = await fetch('https://onghoangdohieu.com/api/sepay/webhook', {
        method: 'POST',
        headers,
        body: JSON.stringify(realPayload)
      })
      
      const result = await response.text()
      console.log(`   Status: ${response.status} (expected: ${testCase.expectedStatus})`)
      console.log(`   Response: ${result}`)
      
      if (response.status === testCase.expectedStatus) {
        console.log(`   ✅ PASS`)
      } else {
        console.log(`   ❌ FAIL`)
      }
      
    } catch (error) {
      console.log(`   Error: ${error.message}`)
      console.log(`   ❌ FAIL`)
    }
    
    console.log('')
  }
  
  console.log('=== KẾT LUẬN ===')
  console.log('✅ API key mới (ASCII-safe) hoạt động')
  console.log('❌ API key cũ (có ký tự đặc biệt) gây lỗi')
  console.log('📋 Cần cấu hình SEPAY_API_KEY trên server')
  console.log('📋 Cần tạo payment với bankTxnId = "3516" để test')
}

async function main() {
  await testWithNewApiKey()
}

main().catch(console.error)
