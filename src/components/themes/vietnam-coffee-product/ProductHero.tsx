"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, FileText } from "lucide-react"
import Image from "next/image"
import { ThemeParams } from "@/types"

interface ProductHeroContent {
    title?: string
    subtitle?: string
    usps?: string[]
    images?: string[]
    mainImage?: string
    image?: string  // From editor
    backgroundImage?: string  // From editor
}

interface ProductHeroProps {
    theme: ThemeParams
    content?: ProductHeroContent
}

const ProductHero = ({ theme, content }: ProductHeroProps) => {
    const usps = content?.usps || [
        "ISO 9001:2015 Certified Manufacturing",
        "MOQ as low as 500 units",
        "15+ years export experience to US, EU & Global markets",
    ]

    // Priority: image from editor > mainImage > first image from array > placeholder
    const mainImage = content?.image || content?.mainImage || content?.images?.[0] || "/placeholder-product.jpg"
    const backgroundImage = content?.backgroundImage

    return (
        <section
            id="product-hero-section"
            className="relative overflow-hidden"
            style={{
                backgroundColor: theme.colors?.primary || "#FFFFFF",
            }}
        >
            {/* Background Image or Pattern */}
            {backgroundImage ? (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        opacity: 0.3
                    }}
                />
            ) : (
                <div className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${theme.colors?.accent || "#8B4513"}20 10px, ${theme.colors?.accent || "#8B4513"}20 20px)`
                    }}
                />
            )}

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] py-8">
                    {/* Content Side */}
                    <div className="space-y-6">
                        <Badge
                            variant="secondary"
                            className="bg-amber-500/20 border-amber-500/30"
                            style={{ color: theme.colors?.accent || "#F59E0B" }}
                        >
                            Export Ready • OEM/ODM Available
                        </Badge>

                        <h1
                            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                            style={{
                                color: theme.colors?.background || "#FFFFFF",
                                fontFamily: theme.typography?.fontFamily || "Inter"
                            }}
                        >
                            {content?.title || "[Product Name] Manufacturer & Exporter | Custom OEM Solutions"}
                        </h1>

                        <p
                            className="text-lg max-w-xl"
                            style={{
                                color: `${theme.colors?.background || "#FFFFFF"}CC`,
                                fontFamily: theme.typography?.fontFamily || "Inter"
                            }}
                        >
                            {content?.subtitle || "Professional supplier with years of manufacturing experience. Serving international buyers in global markets."}
                        </p>

                        {/* USPs */}
                        <ul className="space-y-3 py-2">
                            {usps.map((usp, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle
                                        className="h-5 w-5 flex-shrink-0 mt-0.5"
                                        style={{ color: theme.colors?.accent || "#F59E0B" }}
                                    />
                                    <span style={{ color: `${theme.colors?.background || "#FFFFFF"}E6` }}>
                                        {usp}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                size="lg"
                                style={{
                                    background: `linear-gradient(135deg, ${theme.colors?.accent || "#F59E0B"}, ${theme.colors?.accent || "#F59E0B"}99)`,
                                    color: theme.colors?.background || "#FFFFFF"
                                }}
                            >
                                <FileText className="h-5 w-5 mr-2" />
                                Request a Quote
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                style={{
                                    borderColor: theme.colors?.accent || "#F59E0B",
                                    color: theme.colors?.background || "#FFFFFF"
                                }}
                            >
                                <Download className="h-5 w-5 mr-2" />
                                Get Free Catalog
                            </Button>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="relative">
                        <div className="relative bg-card rounded-xl shadow-2xl overflow-hidden">
                            {/* Main Product Image */}
                            <div className="aspect-square bg-muted relative">
                                <Image
                                    src={mainImage}
                                    alt={content?.title || "Product"}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Thumbnail Gallery */}
                            {content?.images && content.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2 p-3 bg-secondary">
                                    {content.images.slice(0, 4).map((img, i) => (
                                        <div
                                            key={i}
                                            className="aspect-square bg-muted rounded border-2 border-transparent hover:border-amber-500 cursor-pointer transition-colors overflow-hidden relative"
                                        >
                                            <Image
                                                src={img}
                                                alt={`Product view ${i + 1}`}
                                                fill
                                                className="object-cover opacity-70 hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Trust Badge */}
                        <div className="absolute -bottom-4 -right-4 bg-card rounded-lg shadow-lg p-4 hidden lg:block">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" style={{ color: theme.colors?.accent }} />
                                <span className="font-medium">Verified Manufacturer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductHero
