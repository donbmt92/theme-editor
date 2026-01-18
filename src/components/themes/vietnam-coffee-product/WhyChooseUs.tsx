"use client"

import { Factory, Calendar, Users, Globe, Wrench, TrendingUp } from "lucide-react"
import Image from "next/image"
import { ThemeParams } from "@/types"

interface Metric {
    icon: string
    value: string
    label: string
}

interface WhyChooseUsContent {
    title?: string
    subtitle?: string
    metrics?: Metric[]
    strengths?: string[]
    factoryImage?: string
    testimonial?: {
        quote: string
        author: string
        company: string
        country: string
    }
}

interface WhyChooseUsProps {
    theme: ThemeParams
    content?: WhyChooseUsContent
}

const WhyChooseUs = ({ theme, content }: WhyChooseUsProps) => {
    const getIcon = (iconName: string) => {
        const icons: Record<string, any> = {
            Calendar, Factory, Wrench, TrendingUp, Globe, Users
        }
        return icons[iconName] || Factory
    }

    const metrics = content?.metrics || [
        { icon: "Calendar", value: "15+", label: "Years Experience" },
        { icon: "Factory", value: "10,000 m²", label: "Factory Size" },
        { icon: "Wrench", value: "20+", label: "Production Lines" },
        { icon: "TrendingUp", value: "500,000+", label: "Monthly Capacity" },
        { icon: "Globe", value: "50+", label: "Export Countries" },
        { icon: "Users", value: "200+", label: "Team Members" },
    ]

    const strengths = content?.strengths || [
        "Direct factory with no middlemen - competitive pricing",
        "Dedicated export team with 10+ years international experience",
        "Advanced manufacturing equipment from Germany and Japan",
        "Flexible MOQ for new customers and trial orders",
        "Multi-language support (English, Spanish, Arabic, French)",
        "Long-term partnerships with global Fortune 500 companies",
    ]

    return (
        <section
            id="product-why-choose-section"
            style={{
                backgroundColor: theme.colors?.background || "#FFFFFF",
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
                        {content?.title || "Why Choose Us"}
                    </h2>
                    <p
                        className="text-lg"
                        style={{
                            color: `${theme.colors?.text || "#1F2937"}99`,
                            fontFamily: theme.typography?.fontFamily || "Inter"
                        }}
                    >
                        {content?.subtitle || "Factory strength and capabilities that make us your reliable manufacturing partner"}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Factory Image & Metrics */}
                    <div>
                        <div className="relative rounded-xl overflow-hidden shadow-lg mb-6">
                            <div className="relative w-full aspect-video bg-muted">
                                {content?.factoryImage && (
                                    <Image
                                        src={content.factoryImage}
                                        alt="Manufacturing facility"
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
                            />
                            <div className="absolute bottom-4 left-4 right-4">
                                <p
                                    className="font-semibold text-lg text-white"
                                >
                                    Manufacturing Facility
                                </p>
                                <p
                                    className="text-white/80 text-sm"
                                >
                                    Professional production base
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {metrics.map((metric, index) => {
                                const Icon = getIcon(metric.icon)
                                return (
                                    <div
                                        key={index}
                                        className="rounded-xl p-4 text-center"
                                        style={{ backgroundColor: `${theme.colors?.primary || "#D2691E"}08` }}
                                    >
                                        <Icon
                                            className="h-5 w-5 mx-auto mb-2"
                                            style={{ color: theme.colors?.primary || "#D2691E" }}
                                        />
                                        <p
                                            className="font-bold text-lg"
                                            style={{ color: theme.colors?.text || "#1F2937" }}
                                        >
                                            {metric.value}
                                        </p>
                                        <p
                                            className="text-xs"
                                            style={{ color: `${theme.colors?.text || "#1F2937"}CC` }}
                                        >
                                            {metric.label}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Strengths List */}
                    <div className="space-y-6">
                        <h3
                            className="font-semibold text-xl"
                            style={{ color: theme.colors?.text || "#1F2937" }}
                        >
                            Our Competitive Advantages
                        </h3>

                        <ul className="space-y-4">
                            {strengths.map((strength, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                        style={{ backgroundColor: `${theme.colors?.accent || "#10B981"}20` }}
                                    >
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: theme.colors?.accent || "#10B981" }}
                                        />
                                    </div>
                                    <span style={{ color: theme.colors?.text || "#1F2937" }}>
                                        {strength}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {content?.testimonial && (
                            <div
                                className="p-5 border rounded-xl"
                                style={{
                                    backgroundColor: `${theme.colors?.primary || "#D2691E"}05`,
                                    borderColor: `${theme.colors?.primary || "#D2691E"}20`
                                }}
                            >
                                <p
                                    className="text-sm italic"
                                    style={{ color: `${theme.colors?.text || "#1F2937"}CC` }}
                                >
                                    "{content.testimonial.quote}"
                                </p>
                                <p
                                    className="text-sm font-medium mt-2"
                                    style={{ color: theme.colors?.text || "#1F2937" }}
                                >
                                    — {content.testimonial.author}, {content.testimonial.company}, {content.testimonial.country}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhyChooseUs
