"use client"

import { Lock, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface UpgradePromptProps {
    tier: "STANDARD" | "PRO"
    feature: string
    description?: string
    benefits?: string[]
}

export default function UpgradePrompt({
    tier,
    feature,
    description,
    benefits
}: UpgradePromptProps) {
    const defaultBenefits = {
        STANDARD: [
            "Up to 20 projects",
            "50 exports per month",
            "GitHub & Vercel deployment",
            "20 version history"
        ],
        PRO: [
            "Unlimited projects",
            "Unlimited exports",
            "Product page builder",
            "Unlimited version history",
            "Priority support"
        ]
    }

    const featureBenefits = benefits || defaultBenefits[tier]

    return (
        <div className="flex items-center justify-center min-h-[500px] p-8">
            <Card className="max-w-2xl w-full p-12 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                        <Lock className="w-10 h-10 text-amber-600" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-4">
                    {feature} - {tier} Feature
                </h2>

                <p className="text-muted-foreground text-lg mb-8">
                    {description || `Upgrade to ${tier} to unlock this powerful feature and take your projects to the next level.`}
                </p>

                <div className="bg-muted/50 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold mb-4 text-lg">
                        What you'll get with {tier}:
                    </h3>
                    <ul className="space-y-3 text-left max-w-md mx-auto">
                        {featureBenefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" asChild>
                        <Link href="/payment">
                            Upgrade to {tier}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/pricing">
                            View all plans
                        </Link>
                    </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-6">
                    No commitment required. Cancel anytime.
                </p>
            </Card>
        </div>
    )
}
