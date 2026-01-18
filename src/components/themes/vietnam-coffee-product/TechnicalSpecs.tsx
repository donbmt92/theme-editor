"use client"

import { Settings, CheckCircle } from "lucide-react"
import { ThemeParams } from "@/types"

interface Specification {
    label: string
    value: string
}

interface TechnicalSpecsContent {
    title?: string
    subtitle?: string
    specifications?: Specification[]
    customizationOptions?: string[]
}

interface TechnicalSpecsProps {
    theme: ThemeParams
    content?: TechnicalSpecsContent
}

const TechnicalSpecs = ({ theme, content }: TechnicalSpecsProps) => {
    const specifications = content?.specifications || [
        { label: "Material", value: "Stainless Steel 304 / Aluminum 6061 / ABS Plastic" },
        { label: "Size / Dimensions", value: "L x W x H: 100mm x 50mm x 25mm" },
        { label: "Weight", value: "0.5 kg / unit" },
        { label: "Color Options", value: "Silver, Black, Custom RAL colors available" },
        { label: "MOQ", value: "500 units" },
        { label: "Certifications", value: "ISO 9001, CE, RoHS, REACH" },
        { label: "Standards", value: "DIN, ANSI, JIS compatible" },
        { label: "OEM/ODM", value: "Available - Custom specifications accepted" },
        { label: "Sample Available", value: "Yes - Free samples for qualified buyers" },
        { label: "Lead Time", value: "15-30 days depending on order quantity" },
    ]

    const customizationOptions = content?.customizationOptions || [
        "Custom dimensions available",
        "Material alternatives on request",
        "Surface treatment options",
        "Custom packaging solutions",
        "Private labeling available",
    ]

    return (
        <section
            id="product-specs-section"
            style={{
                backgroundColor: theme.colors?.background || "#F9FAFB",
            }}
        >
            <div className="container mx-auto px-4 py-16">
                <div className="flex items-center gap-3 mb-6">
                    <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${theme.colors?.primary || "#D2691E"}15` }}
                    >
                        <Settings
                            className="h-6 w-6"
                            style={{ color: theme.colors?.primary || "#D2691E" }}
                        />
                    </div>
                    <div>
                        <h2
                            className="text-3xl font-bold mb-0"
                            style={{
                                color: theme.colors?.text || "#1F2937",
                                fontFamily: theme.typography?.fontFamily || "Inter"
                            }}
                        >
                            {content?.title || "Technical Specifications"}
                        </h2>
                        <p
                            style={{ color: `${theme.colors?.text || "#1F2937"}99` }}
                        >
                            {content?.subtitle || "Detailed product specifications and standards"}
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Specifications Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr
                                    className="border-b"
                                    style={{ borderColor: theme.colors?.border || "#E5E7EB" }}
                                >
                                    <th
                                        className="text-left p-3 font-semibold"
                                        style={{ color: theme.colors?.text || "#1F2937" }}
                                    >
                                        Specification
                                    </th>
                                    <th
                                        className="text-left p-3 font-semibold"
                                        style={{ color: theme.colors?.text || "#1F2937" }}
                                    >
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {specifications.map((spec, index) => (
                                    <tr
                                        key={index}
                                        className="border-b"
                                        style={{ borderColor: theme.colors?.border || "#E5E7EB" }}
                                    >
                                        <td
                                            className="p-3 font-medium"
                                            style={{ color: theme.colors?.text || "#1F2937" }}
                                        >
                                            {spec.label}
                                        </td>
                                        <td
                                            className="p-3"
                                            style={{ color: `${theme.colors?.text || "#1F2937"}CC` }}
                                        >
                                            {spec.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Additional Info Box */}
                    <div className="space-y-6">
                        <div
                            className="rounded-xl p-6"
                            style={{ backgroundColor: `${theme.colors?.primary || "#D2691E"}08` }}
                        >
                            <h3
                                className="font-semibold text-lg mb-4"
                                style={{ color: theme.colors?.text || "#1F2937" }}
                            >
                                Customization Options
                            </h3>
                            <ul className="space-y-3">
                                {customizationOptions.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-3"
                                        style={{ color: theme.colors?.text || "#1F2937" }}
                                    >
                                        <CheckCircle
                                            className="h-4 w-4 flex-shrink-0"
                                            style={{ color: theme.colors?.accent || "#10B981" }}
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div
                            className="rounded-xl p-6 border"
                            style={{
                                backgroundColor: `${theme.colors?.accent || "#F59E0B"}10`,
                                borderColor: `${theme.colors?.accent || "#F59E0B"}30`
                            }}
                        >
                            <h3
                                className="font-semibold text-lg mb-2"
                                style={{ color: theme.colors?.text || "#1F2937" }}
                            >
                                Need Custom Specifications?
                            </h3>
                            <p
                                className="text-sm mb-4"
                                style={{ color: `${theme.colors?.text || "#1F2937"}CC` }}
                            >
                                Our engineering team can work with you to develop products meeting your exact requirements.
                            </p>
                            <a
                                href="#rfq-form"
                                className="font-medium hover:underline"
                                style={{ color: theme.colors?.accent || "#F59E0B" }}
                            >
                                Contact Our Engineering Team →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TechnicalSpecs
