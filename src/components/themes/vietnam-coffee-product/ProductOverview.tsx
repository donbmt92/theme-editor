"use client"

import { Factory, Globe, Package, Target } from "lucide-react"
import { ThemeParams } from "@/types"

interface QuickOverviewContent {
    description?: string
    highlights?: Array<{
        icon: string
        label: string
        value: string
    }>
}

interface ProductOverviewProps {
    theme: ThemeParams
    content?: QuickOverviewContent
}

const ProductOverview = ({ theme, content }: ProductOverviewProps) => {
    const getIcon = (iconName: string) => {
        const icons: Record<string, any> = {
            Target, Factory, Globe, Package
        }
        return icons[iconName] || Target
    }

    const highlights = content?.highlights || [
        { icon: "Target", label: "Application", value: "Industrial, Commercial, Consumer" },
        { icon: "Factory", label: "Target Industries", value: "Automotive, Electronics, Construction" },
        { icon: "Globe", label: "Export Markets", value: "USA, Europe, Middle East, Asia" },
        { icon: "Package", label: "MOQ", value: "500 Units" },
    ]

    return (
        <section
            id="product-overview-section"
            className="py-16"
            style={{
                backgroundColor: theme.colors?.background || "#FFFFFF",
                borderColor: theme.colors?.border || "#E5E7EB"
            }}
        >
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl">
                    <h2
                        className="text-3xl font-bold mb-4"
                        style={{
                            color: theme.colors?.text || "#1F2937",
                            fontFamily: theme.typography?.fontFamily || "Inter"
                        }}
                    >
                        Product Overview
                    </h2>
                    <p
                        className="text-lg leading-relaxed mb-8"
                        style={{
                            color: `${theme.colors?.text || "#1F2937"}CC`,
                            fontFamily: theme.typography?.fontFamily || "Inter"
                        }}
                    >
                        {content?.description || "Professional product description focusing on core value proposition, main application, and suitability for international buyers. Factual and professional presentation."}
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {highlights.map((item, index) => {
                            const Icon = getIcon(item.icon)
                            return (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg border"
                                    style={{
                                        backgroundColor: `${theme.colors?.background || "#FFFFFF"}`,
                                        borderColor: theme.colors?.border || "#E5E7EB"
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className="p-2 rounded-lg"
                                            style={{ backgroundColor: `${theme.colors?.primary || "#D2691E"}20` }}
                                        >
                                            <Icon
                                                className="h-5 w-5"
                                                style={{ color: theme.colors?.primary || "#D2691E" }}
                                            />
                                        </div>
                                        <span
                                            className="text-sm font-medium"
                                            style={{ color: `${theme.colors?.text || "#1F2937"}99` }}
                                        >
                                            {item.label}
                                        </span>
                                    </div>
                                    <p
                                        className="font-semibold"
                                        style={{ color: theme.colors?.text || "#1F2937" }}
                                    >
                                        {item.value}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductOverview
