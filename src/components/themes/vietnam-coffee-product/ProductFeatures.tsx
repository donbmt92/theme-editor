"use client"

import { ThemeParams } from "@/types"
import { getIconComponent } from "./iconHelper"

interface Feature {
    icon: string
    title: string
    description: string
}

interface ProductFeaturesContent {
    title?: string
    subtitle?: string
    features?: Feature[]
}

interface ProductFeaturesProps {
    theme: ThemeParams
    content?: ProductFeaturesContent
}

const ProductFeatures = ({ theme, content }: ProductFeaturesProps) => {

    const features = content?.features || [
        {
            icon: "Shield",
            title: "Premium Material Quality!",
            description: "Manufactured from high-grade raw materials with strict incoming quality control",
        },
        {
            icon: "Zap",
            title: "High Precision Manufacturing",
            description: "CNC machining with tolerance up to ±0.01mm, ensuring consistent quality",
        },
        {
            icon: "Award",
            title: "International Certifications",
            description: "ISO 9001, CE, RoHS, REACH certified - meeting global export standards",
        },
        {
            icon: "Wrench",
            title: "Easy Installation & Maintenance",
            description: "Designed for simple assembly with standard tools and minimal maintenance",
        },
        {
            icon: "Clock",
            title: "Extended Service Life",
            description: "Engineered for durability with long expected operational life",
        },
        {
            icon: "Leaf",
            title: "Environmentally Compliant",
            description: "REACH and RoHS compliant, meeting environmental regulations worldwide",
        },
    ]

    return (
        <section
            id="product-features-section"
            style={{
                backgroundColor: theme.colors?.background || "#F9FAFB",
            }}
        >
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2
                        className="text-3xl font-bold mb-4"
                        style={{
                            color: theme.colors?.text || "#1F2937",
                            fontFamily: theme.typography?.fontFamily || "Inter"
                        }}
                    >
                        {content?.title || "Product Features & Advantages"}
                    </h2>
                    <p
                        className="text-lg"
                        style={{
                            color: `${theme.colors?.text || "#1F2937"}99`,
                            fontFamily: theme.typography?.fontFamily || "Inter"
                        }}
                    >
                        {content?.subtitle || "Key manufacturing and quality advantages that set our products apart"}
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = getIconComponent(feature.icon)
                        return (
                            <div
                                key={index}
                                className="p-6 rounded-lg border hover:shadow-lg transition-all duration-300 group"
                                style={{
                                    backgroundColor: theme.colors?.background || "#FFFFFF",
                                    borderColor: theme.colors?.border || "#E5E7EB"
                                }}
                            >
                                <div
                                    className="p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: `${theme.colors?.primary || "#D2691E"}15` }}
                                >
                                    <Icon
                                        className="h-6 w-6"
                                        style={{ color: theme.colors?.primary || "#D2691E" }}
                                    />
                                </div>
                                <h3
                                    className="font-semibold text-lg mb-2"
                                    style={{ color: theme.colors?.text || "#1F2937" }}
                                >
                                    {feature.title}
                                </h3>
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: `${theme.colors?.text || "#1F2937"}99` }}
                                >
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default ProductFeatures
