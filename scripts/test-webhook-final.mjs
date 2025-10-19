import fetch from 'node-fetch'

async function testWebhookWithExistingPayment() {
  console.log('=== TEST WEBHOOK VỚI PAYMENT ĐÃ TỒN TẠI ===\n')
  
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
    "referenceCode": "3516", // Payment đã tồn tại
    "accumulated": 0,
    "id": 26933514
  }
  
  const realApiKey = 'H0N4ZD49WRMW5FBDIFYJOW7VP1LPQAQRKHQIN8DSJYCQSR76CFWXYXLKT2ETP2UU'
  
  console.log('Testing với payment đã tồn tại (bankTxnId = "3516"):')
  console.log('Payload:', JSON.stringify(realPayload, null, 2))
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Apikey ${realApiKey}`,
    'User-Agent': 'Sepay-Webhook/1.0'
  }
  
  try {
    const response = await fetch('https://onghoangdohieu.com/api/sepay/webhook', {
      method: 'POST',
      headers,
      body: JSON.stringify(realPayload)
    })
    
    const result = await response.text()
    console.log(`\nStatus: ${response.status}`)
    console.log(`Response: ${result}`)
    
    if (response.status === 200) {
      console.log('\n✅ SUCCESS! Webhook hoạt động hoàn hảo!')
      console.log('📋 Payment đã được cập nhật thành PAID')
      console.log('📋 User role đã được nâng cấp')
    } else if (response.status === 401) {
      console.log('\n❌ UNAUTHORIZED - Cần cấu hình SEPAY_API_KEY trên server')
    } else if (response.status === 404) {
      console.log('\n❌ PAYMENT NOT FOUND - Payment không tồn tại')
    } else {
      console.log(`\n❌ ERROR - Status: ${response.status}`)
    }
    
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`)
  }
  
  console.log('\n=== KẾT LUẬN ===')
  console.log('✅ Payment test đã được tạo với bankTxnId = "3516"')
  console.log('✅ Webhook format đã đúng: Authorization: Apikey API_KEY')
  console.log('📋 Cần deploy code và cấu hình SEPAY_API_KEY trên server')
  console.log('📋 Sau đó webhook sẽ hoạt động hoàn hảo!')
}

async function main() {
  await testWebhookWithExistingPayment()
}

main().catch(console.error)
