const crypto = require('crypto')

// Test webhook script
async function testWebhook() {
  const WEBHOOK_SECRET = 'your-webhook-secret-key'
  const WEBHOOK_URL = 'http://localhost:3000/api/payments/webhook'
  
  // Sample payment data
  const paymentData = {
    bankTxnId: 'TXN_1703123456789_abc123def',
    status: 'SUCCESS', // or 'FAILED' or 'PENDING'
    amount: 599000,
    currency: 'VND',
    timestamp: new Date().toISOString(),
    bankCode: 'VCB',
    customerInfo: {
      fullName: 'Nguyễn Văn A',
      email: 'test@example.com',
      phone: '0123456789'
    },
    metadata: {
      planId: 'pro',
      customerInfo: {
        fullName: 'Nguyễn Văn A',
        email: 'test@example.com',
        phone: '0123456789',
        company: 'Test Company'
      },
      bankId: 'vcb'
    }
  }

  // Create signature
  const body = JSON.stringify(paymentData)
  const signature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('hex')

  console.log('Testing webhook with data:', paymentData)
  console.log('Signature:', signature)

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bank-signature': signature
      },
      body: body
    })

    const result = await response.json()
    console.log('Webhook response:', result)
    
    if (response.ok) {
      console.log('✅ Webhook test successful!')
    } else {
      console.log('❌ Webhook test failed!')
    }
  } catch (error) {
    console.error('Error testing webhook:', error)
  }
}

// Test different scenarios
async function runTests() {
  console.log('🧪 Starting webhook tests...\n')

  // Test 1: Successful payment
  console.log('Test 1: Successful payment')
  await testWebhook()
  console.log('\n' + '='.repeat(50) + '\n')

  // Test 2: Failed payment
  console.log('Test 2: Failed payment')
  const failedData = {
    bankTxnId: 'TXN_1703123456790_xyz789abc',
    status: 'FAILED',
    amount: 599000,
    currency: 'VND',
    timestamp: new Date().toISOString(),
    bankCode: 'VCB'
  }
  
  const body = JSON.stringify(failedData)
  const signature = crypto
    .createHmac('sha256', 'your-webhook-secret-key')
    .update(body, 'utf8')
    .digest('hex')

  try {
    const response = await fetch('http://localhost:3000/api/payments/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bank-signature': signature
      },
      body: body
    })

    const result = await response.json()
    console.log('Failed payment response:', result)
  } catch (error) {
    console.error('Error testing failed payment:', error)
  }

  console.log('\n✅ All tests completed!')
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests()
}

module.exports = { testWebhook } 