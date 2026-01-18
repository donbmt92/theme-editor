import { prisma } from '@/lib/prisma'
import { getUserTier, UserTierType } from './get-user-tier'

/**
 * Update user tier in database based on payment history
 * @param userId - User ID to update
 * @returns Updated tier
 */
export async function updateUserTier(userId: string): Promise<UserTierType> {
    const tier = await getUserTier(userId)

    await prisma.user.update({
        where: { id: userId },
        data: { tier }
    })

    console.log(`User tier updated: userId=${userId}, tier=${tier}`)

    return tier
}
