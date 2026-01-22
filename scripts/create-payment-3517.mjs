import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createPaymentFor3517() {
  console.log('=== TẠO PAYMENT CHO REFERENCE CODE 3517 ===\n')
  
  try {
    // Tìm user đầu tiên để tạo payment
    const firstUser = await prisma.user.findFirst()
    
    if (!firstUser) {
      console.log('❌ Không tìm thấy user nào trong database')
      return
    }
    
    console.log(`📋 Sử dụng user: ${firstUser.id}`)
    
    // Tạo payment với bankTxnId = "3517"
    const testPayment = await prisma.payment.create({
      data: {
        userId: firstUser.id,
        amount: 5000,
        currency: 'VND',
        status: 'PENDING',
        bankTxnId: '3517'
      }
    })
    
    console.log('✅ Đã tạo payment cho reference code 3517:')
    console.log(`   ID: ${testPayment.id}`)
    console.log(`   User ID: ${testPayment.userId}`)
    console.log(`   Bank TXN ID: ${testPayment.bankTxnId}`)
    console.log(`   Amount: ${testPayment.amount}`)
    console.log(`   Status: ${testPayment.status}`)
    
    console.log('\n🎯 Bây giờ Sepay webhook sẽ hoạt động với referenceCode = "3517"')
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo payment:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function main() {
  await createPaymentFor3517()
}

main().catch(console.error)










