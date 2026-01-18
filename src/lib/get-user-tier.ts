import { cache } from 'react'
import { prisma } from '@/lib/prisma'

export type UserTierType = 'FREE' | 'STANDARD' | 'PRO'

/**
 * Calculate user tier based on payment history in last 30 days
 * Cached per-request to avoid duplicate database queries
 * @param userId - User ID to check
 * @returns UserTierType (FREE/STANDARD/PRO)
 */
export const getUserTier = cache(async (userId: string): Promise<UserTierType> => {
    const last30Days = new Date()
    last30Days.setDate(last30Days.getDate() - 30)

    // Get all successful payments in last 30 days
    const payments = await prisma.payment.findMany({
        where: {
            userId,
            status: 'PAID',
            paidAt: { gte: last30Days }
        }
    })

    // Calculate total amount paid (VND)
    const totalPaid = payments.reduce((sum: number, p) => sum + Number(p.amount), 0)

    // Tier logic based on payment amount
    if (totalPaid >= 500000) return 'PRO'        // ≥500k VND
    if (totalPaid >= 100000) return 'STANDARD'   // ≥100k VND
    return 'FREE'
})
