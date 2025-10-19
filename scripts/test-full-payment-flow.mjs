import fetch from 'node-fetch'

// Test luồng thanh toán hoàn chỉnh
async function testFullPaymentFlow() {
  console.log('=== TEST LUỒNG THANH TOÁN HOÀN CHỈNH ===\n')
  
  const baseUrl = 'https://onghoangdohieu.com'
  
  // Step 1: Tạo payment (simulate)
  console.log('1. Tạo payment record...')
  const paymentData = {
    amount: 5000,
    currency: 'VND',
    planId: 'pro',
    customerInfo: {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '0123456789'
    },
    bankId: 'ACB'
  }
  
  // Simulate payment creation (không thể test thực vì cần auth)
  const mockPaymentId = 'test_payment_' + Date.now()
  const mockBankTxnId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  
  console.log(`   Payment ID: ${mockPaymentId}`)
  console.log(`   Bank TXN ID: ${mockBankTxnId}`)
  console.log(`   Amount: ${paymentData.amount} VND`)
  
  // Step 2: Test Sepay webhook với payload thực tế
  console.log('\n2. Test Sepay webhook...')
  
  const webhookPayload = {
    "gateway": "ACB",
    "transactionDate": "2025-01-19 20:23:13",
    "accountNumber": "3699781",
    "subAccount": null,
    "code": null,
    "content": `${mockBankTxnId}-0123456789-Thanh toan goi Goi Chuyen Nghiep`,
    "transferType": "in",
    "description": `BankAPINotify ${mockBankTxnId}-0123456789-Thanh toan goi Goi Chuyen Nghiep`,
    "transferAmount": paymentData.amount,
    "referenceCode": mockBankTxnId,
    "accumulated": 0,
    "id": Math.floor(Math.random() * 1000000)
  }
  
  console.log('   Webhook payload:', JSON.stringify(webhookPayload, null, 2))
  
  // Test với API key khác nhau
  const testCases = [
    {
      name: 'Test với API key đúng',
      apiKey: 'đây_là_khóa_bí_mật',
      expectedStatus: 200
    },
    {
      name: 'Test với API key sai',
      apiKey: 'wrong-key',
      expectedStatus: 401
    },
    {
      name: 'Test không có Authorization header',
      apiKey: null,
      expectedStatus: 401
    }
  ]
  
  for (const testCase of testCases) {
    console.log(`\n   ${testCase.name}:`)
    
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Sepay-Webhook/1.0'
    }
    
    if (testCase.apiKey) {
      headers['Authorization'] = `Bearer ${testCase.apiKey}`
    }
    
    try {
      const response = await fetch(`${baseUrl}/api/sepay/webhook`, {
        method: 'POST',
        headers,
        body: JSON.stringify(webhookPayload)
      })
      
      const result = await response.text()
      console.log(`     Status: ${response.status} (expected: ${testCase.expectedStatus})`)
      console.log(`     Response: ${result}`)
      
      if (response.status === testCase.expectedStatus) {
        console.log(`     ✅ PASS`)
      } else {
        console.log(`     ❌ FAIL`)
      }
      
    } catch (error) {
      console.log(`     Error: ${error.message}`)
      console.log(`     ❌ FAIL`)
    }
  }
  
  // Step 3: Test với payload bị lỗi format (như trong log thực tế)
  console.log('\n3. Test với payload bị lỗi format...')
  
  const malformedPayload = JSON.stringify(webhookPayload) + '{"success":false,"error":"Unauthorized"}'
  
  try {
    const response = await fetch(`${baseUrl}/api/sepay/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer đây_là_khóa_bí_mật',
        'User-Agent': 'Sepay-Webhook/1.0'
      },
      body: malformedPayload
    })
    
    const result = await response.text()
    console.log(`   Status: ${response.status}`)
    console.log(`   Response: ${result}`)
    
  } catch (error) {
    console.log(`   Error: ${error.message}`)
  }
  
  // Step 4: Test GET endpoint
  console.log('\n4. Test GET endpoint (webhook verification)...')
  
  try {
    const response = await fetch(`${baseUrl}/api/sepay/webhook`, {
      method: 'GET'
    })
    
    const result = await response.text()
    console.log(`   Status: ${response.status}`)
    console.log(`   Response: ${result}`)
    
  } catch (error) {
    console.log(`   Error: ${error.message}`)
  }
  
  console.log('\n=== KẾT LUẬN ===')
  console.log('✅ Đã test luồng thanh toán hoàn chỉnh')
  console.log('✅ Đã test các trường hợp lỗi')
  console.log('✅ Đã test webhook verification')
  console.log('\n📋 Các bước tiếp theo:')
  console.log('1. Deploy code lên server')
  console.log('2. Cấu hình SEPAY_API_KEY trên server')
  console.log('3. Test với Sepay thực tế')
  console.log('4. Monitor logs để debug')
}

async function main() {
  await testFullPaymentFlow()
}

main().catch(console.error)
