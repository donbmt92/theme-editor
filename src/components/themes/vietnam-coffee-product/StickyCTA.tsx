"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, FileText } from "lucide-react"
import { ThemeParams } from "@/types"

interface StickyCTAProps {
    theme: ThemeParams
}

const StickyCTA = ({ theme }: StickyCTAProps) => {
    return (
        <div
            className="fixed bottom-0 left-0 right-0 p-4 shadow-lg md:hidden z-50"
            style={{
                backgroundColor: theme.colors?.background || "#FFFFFF",
                borderTop: `1px solid ${theme.colors?.border || "#E5E7EB"}`
            }}
        >
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    style={{
                        borderColor: theme.colors?.primary || "#D2691E",
                        color: theme.colors?.primary || "#D2691E"
                    }}
                    onClick={() => {
                        const el = document.getElementById('catalog-form')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                >
                    <FileText className="h-4 w-4 mr-2" />
                    Get Catalog
                </Button>
                <Button
                    size="lg"
                    className="flex-1"
                    style={{
                        background: `linear-gradient(135deg, ${theme.colors?.primary || "#D2691E"}, ${theme.colors?.accent || "#F59E0B"})`,
                        color: theme.colors?.background || "#FFFFFF"
                    }}
                    onClick={() => {
                        const el = document.getElementById('rfq-form')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Request Quote
                </Button>
            </div>
        </div>
    )
}

export default StickyCTA
