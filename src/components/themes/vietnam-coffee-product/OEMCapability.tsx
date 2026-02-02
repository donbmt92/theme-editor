"use client"

import { Palette, Package, Tag, Pencil, Shield, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeParams } from "@/types";
import { getTranslation } from "@/lib/product-translations";

interface Capability {
    icon: string
    title: string
    description: string
}

interface OEMCapabilityContent {
    title?: string
    subtitle?: string
    capabilities?: Capability[]
}

interface OEMCapabilityProps {
    theme: ThemeParams
    content?: OEMCapabilityContent
}

const OEMCapability = ({ theme, content }: OEMCapabilityProps) => {
    const t = getTranslation(theme?.projectLanguage as any || 'vietnamese');
    const getIcon = (iconName: string) => {
        const icons: Record<string, any> = {
            Palette, Package, Tag, Pencil, Shield, FileCheck
        }
        return icons[iconName] || Palette
    }

    const capabilities = content?.capabilities || [
        { icon: "Palette", title: "Custom Logo", description: "Laser engraving, printing, or embossing your brand logo" },
        { icon: "Package", title: "Custom Packaging", description: "Branded packaging with your company design and specifications" },
        { icon: "Tag", title: "Private Label", description: "Complete private labeling for your brand identity" },
        { icon: "Pencil", title: "Design Support", description: "Engineering support for custom product development" },
        { icon: "Shield", title: "NDA Protection", description: "Full confidentiality agreement for all custom projects" },
        { icon: "FileCheck", title: "Sample Approval", description: "Pre-production samples for your approval before mass production" },
    ]

    return (
        <section
            id="product-oem-section"
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
                        {content?.title || "OEM / ODM Capability"}
                    </h2>
                    <p
                        className="text-lg"
                        style={{
                            color: `${theme.colors?.text || "#1F2937"}99`,
                            fontFamily: theme.typography?.fontFamily || "Inter"
                        }}
                    >
                        {content?.subtitle || t.oemCapabilitySubtitle}
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {capabilities.map((cap, index) => {
                        const Icon = getIcon(cap.icon)
                        return (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-5 rounded-xl hover:shadow-lg transition-all"
                                style={{ backgroundColor: `${theme.colors?.primary || "#D2691E"}08` }}
                            >
                                <div
                                    className="p-3 rounded-lg flex-shrink-0"
                                    style={{ backgroundColor: `${theme.colors?.primary || "#D2691E"}15` }}
                                >
                                    <Icon
                                        className="h-5 w-5"
                                        style={{ color: theme.colors?.primary || "#D2691E" }}
                                    />
                                </div>
                                <div>
                                    <h3
                                        className="font-semibold mb-1"
                                        style={{ color: theme.colors?.text || "#1F2937" }}
                                    >
                                        {cap.title}
                                    </h3>
                                    <p
                                        className="text-sm"
                                        style={{ color: `${theme.colors?.text || "#1F2937"}CC` }}
                                    >
                                        {cap.description}
                                    </p>
                                </div>
                            </div>
                        )
                    }
                    )}
                </div>

                {/* <div
                    className="mt-10 p-6 rounded-xl border"
                    style={{
                        backgroundColor: `${theme.colors?.accent || "#F59E0B"}10`,
                        borderColor: `${theme.colors?.accent || "#F59E0B"}30`
                    }}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3
                                className="font-semibold text-lg"
                                style={{ color: theme.colors?.text || "#1F2937" }}
                            >
                                Ready to Start Your OEM/ODM Project?
                            </h3>
                            <p
                                style={{ color: `${theme.colors?.text || "#1F2937"}CC` }}
                            >
                                Contact our engineering team for a confidential discussion about your requirements.
                            </p>
                        </div>
                        <Button
                            onClick={() => {
                                const el = document.getElementById('rfq-form')
                                if (el) el.scrollIntoView({ behavior: 'smooth' })
                            }}
                            style={{
                                background: `linear-gradient(135deg, ${theme.colors?.accent || "#F59E0B"}, ${theme.colors?.accent || "#F59E0B"}CC)`,
                                color: theme.colors?.background || "#FFFFFF"
                            }}
                        >
                            Start OEM Project
                        </Button>
                    </div>
                </div> */}
            </div>
        </section>
    )
}

export default OEMCapability
