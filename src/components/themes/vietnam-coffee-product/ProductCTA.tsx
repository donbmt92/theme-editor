"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Clock, CheckCircle } from "lucide-react"
import { ThemeParams } from "@/types"

interface ProductCTAContent {
    title?: string
    subtitle?: string
    buttonText?: string
    benefits?: string[]
}

interface ProductCTAProps {
    theme: ThemeParams
    content?: ProductCTAContent
}

const ProductCTA = ({ theme, content }: ProductCTAProps) => {
    const benefits = content?.benefits || [
        "Professional team replies within 12 hours",
        "No obligation, free consultation"
    ]

    return (
        <section
            id="product-cta-section"
            className="py-20 relative overflow-hidden"
            style={{
                backgroundColor: theme.colors?.primary || "#D2691E",
            }}
        >
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${theme.colors?.accent || "#8B4513"}40 10px, ${theme.colors?.accent || "#8B4513"}40 20px)`
                }}
            />

            <div className="container mx-auto px-4 py-16 relative z-10 text-center">
                <h2
                    className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4"
                    style={{
                        color: theme.colors?.background || "#FFFFFF",
                        fontFamily: theme.typography?.fontFamily || "Inter"
                    }}
                >
                    {content?.title || "Start Your Inquiry Today"}
                </h2>
                <p
                    className="text-lg max-w-2xl mx-auto mb-8"
                    style={{
                        color: `${theme.colors?.background || "#FFFFFF"}CC`,
                        fontFamily: theme.typography?.fontFamily || "Inter"
                    }}
                >
                    {content?.subtitle || "Whether you need a sample, custom quotation, or technical consultation, our professional team is ready to assist you."}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <Button
                        size="lg"
                        style={{
                            background: `linear-gradient(135deg, ${theme.colors?.accent || "#F59E0B"}, ${theme.colors?.accent || "#F59E0B"}CC)`,
                            color: theme.colors?.background || "#FFFFFF"
                        }}
                        onClick={() => {
                            const el = document.getElementById('rfq-form')
                            if (el) el.scrollIntoView({ behavior: 'smooth' })
                        }}
                    >
                        <MessageSquare className="h-5 w-5 mr-2" />
                        {content?.buttonText || "Contact Supplier"}
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2"
                            style={{ color: `${theme.colors?.background || "#FFFFFF"}CC` }}
                        >
                            {index === 0 ? (
                                <Clock
                                    className="h-4 w-4"
                                    style={{ color: theme.colors?.accent || "#F59E0B" }}
                                />
                            ) : (
                                <CheckCircle
                                    className="h-4 w-4"
                                    style={{ color: theme.colors?.accent || "#F59E0B" }}
                                />
                            )}
                            <span className="text-sm">{benefit}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ProductCTA
