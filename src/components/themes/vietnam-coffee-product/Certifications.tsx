"use client"

import { Award, Search, ShieldCheck } from "lucide-react"
import { ThemeParams } from "@/types"

interface Certification {
    name: string
    description: string
}

interface QCStep {
    step: string
    title: string
    description: string
}

interface CertificationsContent {
    title?: string
    subtitle?: string
    certifications?: Certification[]
    qcProcess?: QCStep[]
}

interface CertificationsProps {
    theme: ThemeParams
    content?: CertificationsContent
}

const Certifications = ({ theme, content }: CertificationsProps) => {
    const certifications = content?.certifications || [
        { name: "ISO 9001:2015", description: "Quality Management System" },
        { name: "ISO 14001", description: "Environmental Management" },
        { name: "CE Marking", description: "European Conformity" },
        { name: "RoHS", description: "Hazardous Substances Restriction" },
        { name: "REACH", description: "EU Chemical Regulation" },
    ]

    const qcProcess = content?.qcProcess || [
        { step: "01", title: "Incoming Material Inspection", description: "100% inspection of raw materials against specifications" },
        { step: "02", title: "In-Process Quality Control", description: "Multiple checkpoints during manufacturing process" },
        { step: "03", title: "Final Product Testing", description: "Comprehensive testing against quality standards" },
        { step: "04", title: "Pre-Shipment Inspection", description: "Final verification before dispatch" },
    ]

    return (
        <section
            id="product-certifications-section"
            className="py-16"
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
                        <Award
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
                            {content?.title || "Certifications & Quality Control"}
                        </h2>
                        <p
                            style={{ color: `${theme.colors?.text || "#1F2937"}99` }}
                        >
                            {content?.subtitle || "International standards and rigorous quality processes"}
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Certifications */}
                    <div>
                        <h3
                            className="font-semibold text-lg mb-6"
                            style={{ color: theme.colors?.text || "#1F2937" }}
                        >
                            International Certifications
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {certifications.map((cert, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl p-4 text-center shadow-sm hover:shadow-lg transition-shadow"
                                    style={{ backgroundColor: theme.colors?.background || "#FFFFFF" }}
                                >
                                    <div
                                        className="w-16 h-16 mx-auto mb-3 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${theme.colors?.primary || "#D2691E"}10` }}
                                    >
                                        <ShieldCheck
                                            className="h-8 w-8"
                                            style={{ color: theme.colors?.primary || "#D2691E" }}
                                        />
                                    </div>
                                    <p
                                        className="font-semibold text-sm"
                                        style={{ color: theme.colors?.text || "#1F2937" }}
                                    >
                                        {cert.name}
                                    </p>
                                    <p
                                        className="text-xs mt-1"
                                        style={{ color: `${theme.colors?.text || "#1F2937"}99` }}
                                    >
                                        {cert.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div
                            className="mt-6 flex items-center gap-3 p-4 rounded-lg border"
                            style={{
                                backgroundColor: `${theme.colors?.accent || "#10B981"}10`,
                                borderColor: `${theme.colors?.accent || "#10B981"}30`
                            }}
                        >
                            <Search
                                className="h-5 w-5 flex-shrink-0"
                                style={{ color: theme.colors?.accent || "#10B981" }}
                            />
                            <p className="text-sm">
                                <span className="font-medium" style={{ color: theme.colors?.text }}>
                                    Third-party inspection available:
                                </span>
                                <span
                                    className="ml-1"
                                    style={{ color: `${theme.colors?.text || "#1F2937"}CC` }}
                                >
                                    SGS, Bureau Veritas, Intertek
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* QC Process */}
                    <div>
                        <h3
                            className="font-semibold text-lg mb-6"
                            style={{ color: theme.colors?.text || "#1F2937" }}
                        >
                            Quality Control Process
                        </h3>
                        <div className="space-y-4">
                            {qcProcess.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 p-4 rounded-xl shadow-sm"
                                    style={{ backgroundColor: theme.colors?.background || "#FFFFFF" }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                                        style={{
                                            backgroundColor: theme.colors?.primary || "#D2691E",
                                            color: theme.colors?.background || "#FFFFFF"
                                        }}
                                    >
                                        {item.step}
                                    </div>
                                    <div>
                                        <h4
                                            className="font-semibold mb-1"
                                            style={{ color: theme.colors?.text || "#1F2937" }}
                                        >
                                            {item.title}
                                        </h4>
                                        <p
                                            className="text-sm"
                                            style={{ color: `${theme.colors?.text || "#1F2937"}CC` }}
                                        >
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Certifications
