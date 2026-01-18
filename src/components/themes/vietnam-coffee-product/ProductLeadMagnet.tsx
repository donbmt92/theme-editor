"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, CheckCircle, FileText } from "lucide-react"
import { ThemeParams } from "@/types"

interface ProductLeadMagnetProps {
    theme: ThemeParams
}

const ProductLeadMagnet = ({ theme }: ProductLeadMagnetProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        country: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim() || !formData.email.trim()) {
            alert("Please fill in required fields")
            return
        }
        alert("Thank you! Your catalog download link has been sent.")
        setFormData({ name: "", email: "", company: "", country: "" })
    }

    const benefits = [
        "Complete product specifications",
        "Technical datasheets & drawings",
        "Factory capability overview",
        "Price indication & MOQ details",
    ]

    return (
        <section
            id="product-lead-magnet-section"
            className="py-16 relative overflow-hidden"
            style={{
                backgroundColor: theme.colors?.background || "#F9FAFB",
            }}
        >
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${theme.colors?.primary || "#D2691E"}20 10px, ${theme.colors?.primary || "#D2691E"}20 20px)`
                }}
            />

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Content Side */}
                    <div className="space-y-6">
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                            style={{
                                backgroundColor: `${theme.colors?.accent || "#F59E0B"}20`,
                                color: theme.colors?.accent || "#F59E0B"
                            }}
                        >
                            <FileText className="h-4 w-4" />
                            Free Download
                        </div>

                        <h2
                            className="text-3xl font-bold"
                            style={{
                                color: theme.colors?.text || "#1F2937",
                                fontFamily: theme.typography?.fontFamily || "Inter"
                            }}
                        >
                            Download Free Product Catalog & Technical Datasheet
                        </h2>

                        <p
                            className="text-lg"
                            style={{
                                color: `${theme.colors?.text || "#1F2937"}CC`,
                                fontFamily: theme.typography?.fontFamily || "Inter"
                            }}
                        >
                            Get instant access to our complete product catalog with detailed specifications, technical drawings, and factory capabilities.
                        </p>

                        <ul className="space-y-3">
                            {benefits.map((benefit, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-3"
                                    style={{ color: theme.colors?.text || "#1F2937" }}
                                >
                                    <CheckCircle
                                        className="h-5 w-5 flex-shrink-0"
                                        style={{ color: theme.colors?.accent || "#10B981" }}
                                    />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Form Side */}
                    <div
                        className="p-8 rounded-xl shadow-lg"
                        style={{ backgroundColor: theme.colors?.background || "#FFFFFF" }}
                    >
                        <h3
                            className="text-xl font-semibold mb-6"
                            style={{ color: theme.colors?.text || "#1F2937" }}
                        >
                            Get Instant Access
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="catalog-name">Name *</Label>
                                    <Input
                                        id="catalog-name"
                                        placeholder="Your full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="catalog-email">Email *</Label>
                                    <Input
                                        id="catalog-email"
                                        type="email"
                                        placeholder="your@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="catalog-company">Company</Label>
                                    <Input
                                        id="catalog-company"
                                        placeholder="Company name"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="catalog-country">Country</Label>
                                    <Input
                                        id="catalog-country"
                                        placeholder="Your country"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full mt-4"
                                style={{
                                    background: `linear-gradient(135deg, ${theme.colors?.primary || "#D2691E"}, ${theme.colors?.accent || "#F59E0B"})`,
                                    color: theme.colors?.background || "#FFFFFF"
                                }}
                            >
                                <Download className="h-5 w-5 mr-2" />
                                Download Free Catalog
                            </Button>

                            <p
                                className="text-xs text-center"
                                style={{ color: `${theme.colors?.text || "#1F2937"}99` }}
                            >
                                Instant access after submission. No spam, unsubscribe anytime.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductLeadMagnet
