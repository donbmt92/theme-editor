"use client"

import Image from "next/image"
import { ThemeParams } from "@/types"
import { getIconComponent } from "./iconHelper"

interface Application {
    icon: string
    industry: string
    description: string
    image?: string
}

interface ApplicationsContent {
    title?: string
    subtitle?: string
    applications?: Application[]
}

interface ApplicationsProps {
    theme: ThemeParams
    content?: ApplicationsContent
}

const Applications = ({ theme, content }: ApplicationsProps) => {

    const applications = content?.applications || [
        {
            icon: "Car",
            industry: "Automotive Industry",
            description: "Automotive assembly, engine components, interior parts",
            image: "/placeholder-product.jpg",
        },
        {
            icon: "Cpu",
            industry: "Electronics Manufacturing",
            description: "PCB assemblies, enclosures, heat sinks, connectors",
            image: "/placeholder-product.jpg",
        },
        {
            icon: "Building2",
            industry: "Construction & Building",
            description: "Structural components, fixtures, hardware systems",
            image: "/placeholder-product.jpg",
        },
        {
            icon: "HardHat",
            industry: "Industrial Equipment",
            description: "Machine parts, tools, industrial automation components",
            image: "/placeholder-product.jpg",
        },
        {
            icon: "Plane",
            industry: "Aerospace Applications",
            description: "Precision parts meeting aerospace quality standards",
            image: "/placeholder-product.jpg",
        },
        {
            icon: "Ship",
            industry: "Marine & Offshore",
            description: "Corrosion-resistant components for marine environments",
            image: "/placeholder-product.jpg",
        },
    ]

    return (
        <section
            id="product-applications-section"
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
                        {content?.title || "Applications & Use Cases"}
                    </h2>
                    <p
                        className="text-lg"
                        style={{
                            color: `${theme.colors?.text || "#1F2937"}99`,
                            fontFamily: theme.typography?.fontFamily || "Inter"
                        }}
                    >
                        {content?.subtitle || "Industries and applications where our products are successfully deployed"}
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map((app, index) => {
                        const Icon = getIconComponent(app.icon)
                        return (
                            <div
                                key={index}
                                className="group rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                                style={{ backgroundColor: `${theme.colors?.primary || "#D2691E"}05` }}
                            >
                                {/* Image */}
                                <div className="aspect-video bg-muted relative overflow-hidden">
                                    {app.image && (
                                        <>
                                            <Image
                                                src={app.image}
                                                alt={app.industry}
                                                fill
                                                className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                            />
                                            <div
                                                className="absolute inset-0 bg-gradient-to-t to-transparent"
                                                style={{ backgroundImage: `linear-gradient(to top, ${theme.colors?.primary || "#D2691E"}99, transparent)` }}
                                            />
                                        </>
                                    )}
                                    <div className="absolute bottom-3 left-3">
                                        <div
                                            className="p-2 rounded-lg"
                                            style={{ backgroundColor: `${theme.colors?.background || "#FFFFFF"}E6` }}
                                        >
                                            <Icon
                                                className="h-5 w-5"
                                                style={{ color: theme.colors?.primary || "#D2691E" }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3
                                        className="font-semibold text-lg mb-2"
                                        style={{ color: theme.colors?.text || "#1F2937" }}
                                    >
                                        {app.industry}
                                    </h3>
                                    <p
                                        className="text-sm"
                                        style={{ color: `${theme.colors?.text || "#1F2937"}CC` }}
                                    >
                                        {app.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Applications
