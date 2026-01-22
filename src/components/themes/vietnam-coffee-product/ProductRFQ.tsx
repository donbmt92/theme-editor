"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, CheckCircle, Clock, Package, MessageSquare } from "lucide-react"
import { ThemeParams } from "@/types";
import { getTranslation } from "@/lib/product-translations";

interface ProductRFQProps {
    theme: ThemeParams,
    content: any
}

const ProductRFQ = ({ theme, content }: ProductRFQProps) => {
    const t = getTranslation(theme?.projectLanguage as any || 'vietnamese');
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        quantity: "",
        requirements: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim() || !formData.company.trim() || !formData.email.trim()) {
            alert("Please fill in all required fields")
            return
        }
        alert("Thank you! We'll contact you within 12-24 hours with a customized quotation.")
        setFormData({ name: "", company: "", email: "", phone: "", quantity: "", requirements: "" })
    }

    const benefits = [
        { icon: Package, text: t.freeSamplesQualified },
        { icon: Clock, text: t.customQuotation12to24 },
        { icon: MessageSquare, text: t.directSalesEngineer },
    ]

    return (
        <section
            id="product-rfq-section"
            className="py-16"
            style={{
                backgroundColor: theme.colors?.primary || "#D2691E",
            }}
        >
            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Content Side */}
                    <div className="space-y-6">
                        <h2
                            className="text-2xl md:text-3xl font-bold"
                            style={{
                                color: theme.colors?.background || "#FFFFFF",
                                fontFamily: theme.typography?.fontFamily || "Inter"
                            }}
                        >
                            {content?.title || t.requestQuotation}
                        </h2>

                        <p
                            className="text-lg"
                            style={{
                                color: `${theme.colors?.background || "#FFFFFF"}CC`,
                                fontFamily: theme.typography?.fontFamily || "Inter"
                            }}
                        >
                            {t.rfqDescription}
                        </p>

                        <ul className="space-y-4">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon
                                return (
                                    <li key={index} className="flex items-center gap-3">
                                        <div
                                            className="p-2 rounded-lg"
                                            style={{ backgroundColor: `${theme.colors?.accent || "#F59E0B"}20` }}
                                        >
                                            <Icon
                                                className="h-5 w-5"
                                                style={{ color: theme.colors?.accent || "#F59E0B" }}
                                            />
                                        </div>
                                        <span
                                            style={{ color: `${theme.colors?.background || "#FFFFFF"}E6` }}
                                        >
                                            {benefit.text}
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>

                        <div className="flex items-center gap-3 pt-4">
                            <div
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
                                style={{
                                    backgroundColor: `${theme.colors?.accent || "#10B981"}20`,
                                    color: theme.colors?.accent || "#10B981"
                                }}
                            >
                                <CheckCircle className="h-4 w-4" />
                                {t.responseGuaranteed}
                            </div>
                        </div>
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
                            {t.requestQuotation}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rfq-name">{t.nameRequired}</Label>
                                    <Input
                                        id="rfq-name"
                                        placeholder="Your full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rfq-company">{t.companyRequired}</Label>
                                    <Input
                                        id="rfq-company"
                                        placeholder="Company name"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rfq-email">{t.emailRequired}</Label>
                                    <Input
                                        id="rfq-email"
                                        type="email"
                                        placeholder="your@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rfq-phone">{t.whatsappPhone}</Label>
                                    <Input
                                        id="rfq-phone"
                                        placeholder="+1 234 567 890"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rfq-quantity">{t.estimatedOrderQuantity}</Label>
                                <Input
                                    id="rfq-quantity"
                                    placeholder="e.g., 1,000 units / month"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rfq-requirements">{t.customRequirementsOptional}</Label>
                                <Textarea
                                    id="rfq-requirements"
                                    placeholder="Describe any specific requirements, customizations, or questions..."
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    rows={4}
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full mt-4"
                                style={{
                                    background: `linear-gradient(135deg, ${theme.colors?.accent || "#F59E0B"}, ${theme.colors?.accent || "#F59E0B"}CC)`,
                                    color: theme.colors?.background || "#FFFFFF"
                                }}
                            >
                                <Send className="h-5 w-5 mr-2" />
                                {t.submitRFQ}
                            </Button>

                            <p
                                className="text-xs text-center"
                                style={{ color: `${theme.colors?.text || "#1F2937"}99` }}
                            >
                                Your information is kept confidential. We respond to all inquiries.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductRFQ
