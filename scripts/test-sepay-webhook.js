// Test Sepay webhook script
async function testSepayWebhook() {
  const API_KEY = 'H0N4ZD49WRMW5FBDIFYJOW7VP1LPQAQRKHQIN8DSJYCQSR76CFWXYXLKT2ETP2UU'
  const WEBHOOK_URL = 'http://localhost:3000/api/sepay/webhook'
  
  // Sample Sepay webhook data
  const webhookData = {
    gateway: "MBBank",
    transactionDate: "2024-05-25 21:11:02",
    accountNumber: "0359123456",
    subAccount: null,
    code: null,
    content: "Thanh toan QR SE123456",
    transferType: "in", // "in" for incoming money, "out" for outgoing
    description: "Thanh toan QR SE123456",
    transferAmount: 599000, // Amount in VND
    referenceCode: "TXN_1753295069539_ll26z947j", // This should match bankTxnId in payment
    accumulated: 0,
    id: 123456
  }

  console.log('Testing Sepay webhook with data:', webhookData)
  console.log('API Key:', API_KEY)

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(webhookData)
    })

    const result = await response.json()
    console.log('Webhook response:', result)
    
    if (response.ok) {
      console.log('✅ Sepay webhook test successful!')
    } else {
      console.log('❌ Sepay webhook test failed!')
    }
  } catch (error) {
    console.error('Error testing Sepay webhook:', error)
  }
}

// Test different scenarios
async function runSepayTests() {
  console.log('🧪 Starting Sepay webhook tests...\n')

  // Test 1: Successful incoming payment
  console.log('Test 1: Successful incoming payment')
  await testSepayWebhook()
  console.log('\n' + '='.repeat(50) + '\n')

  // Test 2: Outgoing transfer (should be ignored)
  console.log('Test 2: Outgoing transfer (should be ignored)')
  const outgoingData = {
    gateway: "MBBank",
    transactionDate: "2024-05-25 21:15:02",
    accountNumber: "0359123456",
    subAccount: null,
    code: null,
    content: "Chuyen tien ra ngoai",
    transferType: "out",
    description: "Chuyen tien ra ngoai",
    transferAmount: 100000,
    referenceCode: "FT123456790",
    accumulated: 0,
    id: 123457
  }

  try {
    const response = await fetch('http://localhost:3000/api/sepay/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer H0N4ZD49WRMW5FBDIFYJOW7VP1LPQAQRKHQIN8DSJYCQSR76CFWXYXLKT2ETP2UU`
      },
      body: JSON.stringify(outgoingData)
    })

    const result = await response.json()
    console.log('Outgoing transfer response:', result)
  } catch (error) {
    console.error('Error testing outgoing transfer:', error)
  }

  // Test 3: Invalid API key
  console.log('\n' + '='.repeat(50) + '\n')
  console.log('Test 3: Invalid API key')
  try {
    const response = await fetch('http://localhost:3000/api/sepay/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid_key'
      },
      body: JSON.stringify({
        gateway: "MBBank",
        transferType: "in",
        transferAmount: 599000,
        referenceCode: "FT123456791"
      })
    })

    const result = await response.json()
    console.log('Invalid API key response:', result)
  } catch (error) {
    console.error('Error testing invalid API key:', error)
  }

  console.log('\n✅ All Sepay tests completed!')
}

// Run tests if this file is executed directly
// Using built-in fetch (Node.js 18+)
runSepayTests()

module.exports = { testSepayWebhook } 