import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setUserToPro(email: string) {
    try {
        const user = await prisma.user.update({
            where: { email },
            data: { tier: 'PRO' }
        })

        console.log('✅ User upgraded to PRO:', user.email, 'Tier:', user.tier)
    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Update với email của bạn
const email = process.argv[2] || 'your-email@example.com'
setUserToPro(email)
