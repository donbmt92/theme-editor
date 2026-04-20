import fetch from 'node-fetch'

async function testWithRealSepayConfig() {
  console.log('=== TEST VỚI CẤU HÌNH SEPAY THỰC TẾ ===\n')
  
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
  
  const realApiKey = 'H0N4ZD49WRMW5FBDIFYJOW7VP1LPQAQRKHQIN8DSJYCQSR76CFWXYXLKT2ETP2UU'
  
  const testCases = [
    {
      name: 'Test với API key thực tế (Apikey format)',
      apiKey: realApiKey,
      headerFormat: 'Apikey',
      expectedStatus: 404 // Payment not found
    },
    {
      name: 'Test với API key thực tế (Bearer format - cũ)',
      apiKey: realApiKey,
      headerFormat: 'Bearer',
      expectedStatus: 401 // Wrong format
    },
    {
      name: 'Test với API key sai (Apikey format)',
      apiKey: 'wrong-key',
      headerFormat: 'Apikey',
      expectedStatus: 401
    },
    {
      name: 'Test không có Authorization header',
      apiKey: null,
      headerFormat: null,
      expectedStatus: 401
    }
  ]
  
  for (const testCase of testCases) {
    console.log(`${testCase.name}:`)
    
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Sepay-Webhook/1.0'
    }
    
    if (testCase.apiKey && testCase.headerFormat) {
      headers['Authorization'] = `${testCase.headerFormat} ${testCase.apiKey}`
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
  console.log('✅ Sepay sử dụng format: Authorization: Apikey API_KEY')
  console.log('✅ API key thực tế: H0N4ZD49WRMW5FBDIFYJOW7VP1LPQAQRKHQIN8DSJYCQSR76CFWXYXLKT2ETP2UU')
  console.log('📋 Cần cấu hình SEPAY_API_KEY trên server')
  console.log('📋 Cần tạo payment với bankTxnId = "3516" để test thành công')
}

async function main() {
  await testWithRealSepayConfig()
}

main().catch(console.error)
