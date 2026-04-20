import fetch from 'node-fetch'

// Dữ liệu webhook thực tế từ log của bạn
const webhookPayload = {
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

async function testWebhook() {
  const url = 'https://onghoangdohieu.com/api/sepay/webhook'
  
  // Test với API key khác nhau
  const testCases = [
    {
      name: 'Test với API key đúng',
      apiKey: 'đây_là_khóa_bí_mật'
    },
    {
      name: 'Test với API key sai',
      apiKey: 'wrong-key'
    },
    {
      name: 'Test không có Authorization header',
      apiKey: null
    }
  ]

  for (const testCase of testCases) {
    console.log(`\n=== ${testCase.name} ===`)
    
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (testCase.apiKey) {
      headers['Authorization'] = `Bearer ${testCase.apiKey}`
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(webhookPayload)
      })
      
      const result = await response.text()
      console.log(`Status: ${response.status}`)
      console.log(`Response: ${result}`)
      
    } catch (error) {
      console.error(`Error: ${error.message}`)
    }
  }
}

// Test với payload bị lỗi format (như trong log)
async function testMalformedPayload() {
  console.log('\n=== Test với payload bị lỗi format ===')
  
  const malformedPayload = '{"gateway":"ACB","transactionDate":"2025-10-19 20:23:13","accountNumber":"3699781","subAccount":null,"code":null,"content":"104519048749-01679135103-Thanh toan goi Goi Chuyen Nghiep","transferType":"in","description":"BankAPINotify 104519048749-01679135103-Thanh toan goi Goi Chuyen Nghiep","transferAmount":5000,"referenceCode":"3516","accumulated":0,"id":26933514}{"success":false,"error":"Unauthorized"}'
  
  try {
    const response = await fetch('https://onghoangdohieu.com/api/sepay/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer đây_là_khóa_bí_mật'
      },
      body: malformedPayload
    })
    
    const result = await response.text()
    console.log(`Status: ${response.status}`)
    console.log(`Response: ${result}`)
    
  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
}

async function main() {
  console.log('Testing Sepay Webhook Debug...')
  await testWebhook()
  await testMalformedPayload()
}

main().catch(console.error)
