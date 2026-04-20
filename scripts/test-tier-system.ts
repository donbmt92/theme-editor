// Test script for user tier system
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testTierSystem() {
    console.log('🧪 Testing User Tier System...\n')

    try {
        // 1. Find test users
        const users = await prisma.user.findMany({
            take: 3,
            include: {
                payments: {
                    where: { status: 'PAID' },
                    orderBy: { paidAt: 'desc' }
                }
            }
        })

        console.log('📊 User Tier Status:\n')

        for (const user of users) {
            const totalPaid = user.payments.reduce((sum, p) => sum + Number(p.amount), 0)

            let expectedTier: 'FREE' | 'STANDARD' | 'PRO' = 'FREE'
            if (totalPaid >= 500000) expectedTier = 'PRO'
            else if (totalPaid >= 100000) expectedTier = 'STANDARD'

            const tierMatch = user.tier === expectedTier ? '✅' : '❌'

            console.log(`${tierMatch} ${user.email}`)
            console.log(`   Current Tier: ${user.tier}`)
            console.log(`   Expected Tier: ${expectedTier}`)
            console.log(`   Total Paid: ${totalPaid.toLocaleString()} VND`)
            console.log(`   Payments: ${user.payments.length}`)
            console.log('')
        }

        // 2. Test tier calculation function
        console.log('🔍 Testing Tier Calculation...\n')
        const { getUserTier } = await import('../src/lib/get-user-tier')

        for (const user of users.slice(0, 2)) {
            const calculatedTier = await getUserTier(user.id)
            const match = calculatedTier === user.tier ? '✅' : '⚠️'
            console.log(`${match} ${user.email}: ${calculatedTier}`)
        }

        // 3. Test rate limits
        console.log('\n⏱️  Rate Limits per Tier:\n')
        const { tierLimits } = await import('../src/lib/rate-limiter')

        for (const [tier, limits] of Object.entries(tierLimits)) {
            console.log(`${tier}: ${limits.requests} requests / ${limits.windowMs / 1000}s`)
        }

        // 4. Test feature limits
        console.log('\n🎨 Feature Limits per Tier:\n')
        const { tierFeatures } = await import('../src/lib/tier-limits')

        for (const [tier, features] of Object.entries(tierFeatures)) {
            console.log(`${tier}:`)
            console.log(`  - Projects: ${features.maxProjects === -1 ? 'Unlimited' : features.maxProjects}`)
            console.log(`  - Exports: ${features.maxExportsPerMonth === -1 ? 'Unlimited' : features.maxExportsPerMonth}`)
            console.log(`  - GitHub Deploy: ${features.canDeployGithub ? 'YES' : 'NO'}`)
            console.log(`  - Vercel Deploy: ${features.canDeployVercel ? 'YES' : 'NO'}`)
            console.log(`  - Product Page: ${features.hasProductPage ? 'YES' : 'NO'}`)
            console.log('')
        }

        console.log('✅ Tier system test completed!\n')

    } catch (error) {
        console.error('❌ Test failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

testTierSystem()
