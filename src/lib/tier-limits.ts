export const tierFeatures = {
    FREE: {
        name: 'Free',
        maxProjects: 3,
        maxExportsPerMonth: 5,
        canDeployGithub: false,
        canDeployVercel: false,
        maxVersionHistory: 5,
        hasProductPage: false,
        rateLimit: { requests: 10, windowMs: 60000 }
    },
    STANDARD: {
        name: 'Standard',
        maxProjects: 20,
        maxExportsPerMonth: 50,
        canDeployGithub: true,
        canDeployVercel: true,
        maxVersionHistory: 20,
        hasProductPage: false,
        rateLimit: { requests: 50, windowMs: 60000 }
    },
    PRO: {
        name: 'Pro',
        maxProjects: -1, // unlimited
        maxExportsPerMonth: -1, // unlimited
        canDeployGithub: true,
        canDeployVercel: true,
        maxVersionHistory: -1, // unlimited
        hasProductPage: true,
        rateLimit: { requests: 200, windowMs: 60000 }
    }
} as const

export type TierName = keyof typeof tierFeatures

/**
 * Get feature limits for a specific tier
 * @param tier - Tier name (FREE/STANDARD/PRO)
 * @returns Feature limits object
 */
export function getTierFeatures(tier: TierName) {
    return tierFeatures[tier]
}

/**
 * Check if user can access a specific feature
 * @param tier - User's tier
 * @param feature - Feature key to check
 * @returns Boolean indicating feature access
 */
export function canAccessFeature(
    tier: TierName,
    feature: keyof typeof tierFeatures.FREE
): boolean {
    const features = tierFeatures[tier]
    const value = features[feature]

    // Boolean features
    if (typeof value === 'boolean') return value

    // Unlimited (-1) always returns true
    if (typeof value === 'number' && value === -1) return true

    return true
}
