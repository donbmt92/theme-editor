import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestPayment() {
  console.log('=== TẠO PAYMENT TEST ===\n')
  
  try {
    // Tạo payment với bankTxnId = "3516" để test webhook
    const testPayment = await prisma.payment.create({
      data: {
        userId: 'test-user-id', // Cần có user thực tế
        amount: 5000,
        currency: 'VND',
        status: 'PENDING',
        bankTxnId: '3516'
      }
    })
    
    console.log('✅ Đã tạo payment test:')
    console.log(`   ID: ${testPayment.id}`)
    console.log(`   Bank TXN ID: ${testPayment.bankTxnId}`)
    console.log(`   Amount: ${testPayment.amount}`)
    console.log(`   Status: ${testPayment.status}`)
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo payment:', error)
    
    // Thử tìm user đầu tiên để tạo payment
    try {
      const firstUser = await prisma.user.findFirst()
      if (firstUser) {
        console.log(`\n🔄 Thử tạo payment với user: ${firstUser.id}`)
        
        const testPayment = await prisma.payment.create({
          data: {
            userId: firstUser.id,
            amount: 5000,
            currency: 'VND',
            status: 'PENDING',
            bankTxnId: '3516'
          }
        })
        
        console.log('✅ Đã tạo payment test:')
        console.log(`   ID: ${testPayment.id}`)
        console.log(`   User ID: ${testPayment.userId}`)
        console.log(`   Bank TXN ID: ${testPayment.bankTxnId}`)
        console.log(`   Amount: ${testPayment.amount}`)
        console.log(`   Status: ${testPayment.status}`)
        
      } else {
        console.log('❌ Không tìm thấy user nào trong database')
      }
    } catch (secondError) {
      console.error('❌ Lỗi khi tạo payment với user:', secondError)
    }
  } finally {
    await prisma.$disconnect()
  }
}

async function main() {
  await createTestPayment()
}

main().catch(console.error)
