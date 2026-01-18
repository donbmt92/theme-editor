"use client"

import { Package, Truck, Ship, Plane } from "lucide-react"
import { ThemeParams } from "@/types"

interface PackagingSpec {
    label: string
    value: string
}

interface ShippingMethod {
    icon: string
    method: string
    description: string
}

interface PackagingShippingContent {
    title?: string
    subtitle?: string
    packagingSpecs?: PackagingSpec[]
    shippingMethods?: ShippingMethod[]
    incoterms?: string[]
}

interface PackagingShippingProps {
    theme: ThemeParams
    content?: PackagingShippingContent
}

const PackagingShipping = ({ theme, content }: PackagingShippingProps) => {
    const getIcon = (iconName: string) => {
        const icons: Record<string, any> = {
            Ship, Plane, Truck, Package
        }
        return icons[iconName] || Ship
    }

    const packagingSpecs = content?.packagingSpecs || [
        { label: "Individual Packaging", value: "PE bag + foam protection + inner box" },
        { label: "Carton Size", value: "40 x 30 x 25 cm (L x W x H)" },
        { label: "Units per Carton", value: "50 pcs / carton" },
        { label: "Carton Weight", value: "25 kg / carton (gross)" },
        { label: "Pallet Configuration", value: "20 cartons / pallet" },
        { label: "20ft Container", value: "Approx. 10,000 units" },
        { label: "40ft Container", value: "Approx. 22,000 units" },
    ]

    const shippingMethods = content?.shippingMethods || [
        { icon: "Ship", method: "Sea Freight", description: "FOB, CIF, CFR available" },
        { icon: "Plane", method: "Air Freight", description: "Express delivery for urgent orders" },
        { icon: "Truck", method: "Land Transport", description: "Available for neighboring countries" },
    ]

    const incoterms = content?.incoterms || ["EXW", "FOB", "CIF", "CFR", "DDP", "DAP"]

    return (
        <section
            id="product-packaging-section"
            style={{
                backgroundColor: theme.colors?.background || "#F9FAFB",
            }}
        >
            <div className="container mx-auto px-4 py-16">
                <div className="flex items-center gap-3 mb-8">
                    <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${theme.colors?.primary || "#D2691E"}15` }}
                    >
                        <Package
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
                            {content?.title || "Packaging & Shipping"}
                        </h2>
                        <p
                            style={{ color: `${theme.colors?.text || "#1F2937"}99` }}
                        >
                            {content?.subtitle || "Safe packaging and flexible delivery options"}
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Packaging Table */}
                    <div className="lg:col-span-2">
                        <h3
                            className="font-semibold text-lg mb-4"
                            style={{ color: theme.colors?.text || "#1F2937" }}
                        >
                            Packaging Details
                        </h3>
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
                                        Item
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
                                {packagingSpecs.map((spec, index) => (
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

                    {/* Shipping Methods & Incoterms */}
                    <div className="space-y-6">
                        <div
                            className="rounded-xl p-6 shadow-sm"
                            style={{ backgroundColor: theme.colors?.background || "#FFFFFF" }}
                        >
                            <h3
                                className="font-semibold text-lg mb-4"
                                style={{ color: theme.colors?.text || "#1F2937" }}
                            >
                                Shipping Methods
                            </h3>
                            <div className="space-y-4">
                                {shippingMethods.map((item, index) => {
                                    const Icon = getIcon(item.icon)
                                    return (
                                        <div key={index} className="flex items-start gap-3">
                                            <div
                                                className="p-2 rounded-lg"
                                                style={{ backgroundColor: `${theme.colors?.primary || "#D2691E"}15` }}
                                            >
                                                <Icon
                                                    className="h-4 w-4"
                                                    style={{ color: theme.colors?.primary || "#D2691E" }}
                                                />
                                            </div>
                                            <div>
                                                <p
                                                    className="font-medium text-sm"
                                                    style={{ color: theme.colors?.text || "#1F2937" }}
                                                >
                                                    {item.method}
                                                </p>
                                                <p
                                                    className="text-xs"
                                                    style={{ color: `${theme.colors?.text || "#1F2937"}CC` }}
                                                >
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div
                            className="rounded-xl p-6 shadow-sm"
                            style={{ backgroundColor: theme.colors?.background || "#FFFFFF" }}
                        >
                            <h3
                                className="font-semibold text-lg mb-4"
                                style={{ color: theme.colors?.text || "#1F2937" }}
                            >
                                Supported Incoterms
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {incoterms.map((term, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 rounded-lg text-sm font-medium"
                                        style={{
                                            backgroundColor: `${theme.colors?.primary || "#D2691E"}15`,
                                            color: theme.colors?.primary || "#D2691E"
                                        }}
                                    >
                                        {term}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PackagingShipping
