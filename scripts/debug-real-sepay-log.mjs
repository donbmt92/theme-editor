import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkPaymentInDatabase() {
  console.log('=== KIỂM TRA PAYMENT TRONG DATABASE ===\n')
  
  const referenceCode = '3516'
  
  try {
    // Tìm payment với bankTxnId = referenceCode
    const payment = await prisma.payment.findUnique({
      where: { bankTxnId: referenceCode },
      include: { user: true }
    })
    
    if (payment) {
      console.log('✅ Tìm thấy payment:')
      console.log(`   ID: ${payment.id}`)
      console.log(`   User ID: ${payment.userId}`)
      console.log(`   Amount: ${payment.amount}`)
      console.log(`   Status: ${payment.status}`)
      console.log(`   Bank TXN ID: ${payment.bankTxnId}`)
      console.log(`   Created: ${payment.createdAt}`)
      console.log(`   User Role: ${payment.user.role}`)
      
      // Kiểm tra amount có khớp không
      if (Number(payment.amount) === 5000) {
        console.log('✅ Amount khớp với webhook (5000)')
      } else {
        console.log(`❌ Amount không khớp: DB=${payment.amount}, Webhook=5000`)
      }
      
    } else {
      console.log(`❌ Không tìm thấy payment với bankTxnId = "${referenceCode}"`)
      
      // Tìm các payment gần đây
      console.log('\n📋 Các payment gần đây:')
      const recentPayments = await prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      })
      
      recentPayments.forEach((p, index) => {
        console.log(`   ${index + 1}. ID: ${p.id}, BankTxnId: ${p.bankTxnId}, Amount: ${p.amount}, Status: ${p.status}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function testWebhookWithRealData() {
  console.log('\n=== TEST WEBHOOK VỚI DỮ LIỆU THỰC TẾ ===\n')
  
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
}

async function main() {
  await checkPaymentInDatabase()
  await testWebhookWithRealData()
}

main().catch(console.error)
