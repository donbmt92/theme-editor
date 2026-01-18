import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { scrollToPreviewSection, SECTION_IDS } from './scrollHelper'

interface SimpleSectionProps {
    activeProductPageId: string
    title: string
    data: any
    fields: Array<{ key: string; label: string; type?: 'input' | 'textarea' }>
    basePath: string[]
    sectionId: string
    updateThemeParam: (path: string[], value: unknown) => void
}

export function SimpleSection({ activeProductPageId, title, data, fields, basePath, sectionId, updateThemeParam }: SimpleSectionProps) {
    return (
        <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => scrollToPreviewSection(sectionId)}>
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <div className="space-y-4">
                {fields.map((field) => (
                    <div key={field.key}>
                        <Label>{field.label}</Label>
                        {field.type === 'textarea' ? (
                            <Textarea
                                value={data?.[field.key] || ''}
                                onChange={(e) =>
                                    activeProductPageId && updateThemeParam(
                                        [...basePath, field.key],
                                        e.target.value
                                    )
                                }
                                rows={3}
                            />
                        ) : (
                            <Input
                                value={data?.[field.key] || ''}
                                onChange={(e) =>
                                    activeProductPageId && updateThemeParam(
                                        [...basePath, field.key],
                                        e.target.value
                                    )
                                }
                            />
                        )}
                    </div>
                ))}
            </div>
        </Card>
    )
}

// Lead Magnet, RFQ, CTA sections use SimpleSection
interface LeadMagnetSectionProps {
    activeProductPageId: string
    leadMagnet: any
    updateThemeParam: (path: string[], value: unknown) => void
}

export function LeadMagnetSection({ activeProductPageId, leadMagnet, updateThemeParam }: LeadMagnetSectionProps) {
    return (
        <SimpleSection
            activeProductPageId={activeProductPageId}
            title="Lead Magnet (Catalog Download)"
            data={leadMagnet}
            fields={[
                { key: 'title', label: 'Title' },
                { key: 'subtitle', label: 'Subtitle', type: 'textarea' }
            ]}
            basePath={['content', 'productPages', activeProductPageId, 'leadMagnet']}
            sectionId={SECTION_IDS.LEAD_MAGNET}
            updateThemeParam={updateThemeParam}
        />
    )
}

interface RFQSectionProps {
    activeProductPageId: string
    rfq: any
    updateThemeParam: (path: string[], value: unknown) => void
}

export function RFQSection({ activeProductPageId, rfq, updateThemeParam }: RFQSectionProps) {
    return (
        <SimpleSection
            activeProductPageId={activeProductPageId}
            title="Request for Quotation (RFQ) Form"
            data={rfq}
            fields={[
                { key: 'title', label: 'Title' },
                { key: 'subtitle', label: 'Subtitle', type: 'textarea' }
            ]}
            basePath={['content', 'productPages', activeProductPageId, 'rfq']}
            sectionId={SECTION_IDS.RFQ}
            updateThemeParam={updateThemeParam}
        />
    )
}

interface CTASectionProps {
    activeProductPageId: string
    cta: any
    updateThemeParam: (path: string[], value: unknown) => void
}

export function CTASection({ activeProductPageId, cta, updateThemeParam }: CTASectionProps) {
    return (
        <SimpleSection
            activeProductPageId={activeProductPageId}
            title="Call-to-Action (CTA)"
            data={cta}
            fields={[
                { key: 'title', label: 'Title' },
                { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
                { key: 'buttonText', label: 'Button Text' }
            ]}
            basePath={['content', 'productPages', activeProductPageId, 'cta']}
            sectionId={SECTION_IDS.CTA}
            updateThemeParam={updateThemeParam}
        />
    )
}
