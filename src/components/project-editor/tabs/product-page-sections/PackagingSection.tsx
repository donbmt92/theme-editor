import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { SimpleListEditor } from './OEMSection'
import { scrollToPreviewSection, SECTION_IDS } from './scrollHelper'

interface PackagingSectionProps {
    activeProductPageId: string
    packaging: any
    updateThemeParam: (path: string[], value: unknown) => void
}

export default function PackagingSection({ activeProductPageId, packaging = {}, updateThemeParam }: PackagingSectionProps) {
    const specs = packaging.packagingSpecs || []
    const methods = packaging.shippingMethods || []
    const incoterms = packaging.incoterms || []

    return (
        <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => scrollToPreviewSection(SECTION_IDS.PACKAGING)}>
            <h3 className="text-lg font-semibold mb-4">Packaging & Shipping</h3>

            <div className="space-y-6">
                {/* Packaging Specs */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <Label className="text-base">Packaging Specifications</Label>
                        <Button
                            onClick={() => {
                                if (activeProductPageId) {
                                    updateThemeParam(
                                        ['content', 'productPages', activeProductPageId, 'packaging', 'packagingSpecs'],
                                        [...specs, { label: '', value: '' }]
                                    )
                                }
                            }}
                            size="sm"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Spec
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {specs.map((spec: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    value={spec.label || ''}
                                    onChange={(e) => {
                                        if (activeProductPageId) {
                                            const updated = [...specs]
                                            updated[index] = { ...updated[index], label: e.target.value }
                                            updateThemeParam(['content', 'productPages', activeProductPageId, 'packaging', 'packagingSpecs'], updated)
                                        }
                                    }}
                                    placeholder="Label"
                                />
                                <Input
                                    value={spec.value || ''}
                                    onChange={(e) => {
                                        if (activeProductPageId) {
                                            const updated = [...specs]
                                            updated[index] = { ...updated[index], value: e.target.value }
                                            updateThemeParam(['content', 'productPages', activeProductPageId, 'packaging', 'packagingSpecs'], updated)
                                        }
                                    }}
                                    placeholder="Value"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (activeProductPageId) {
                                            updateThemeParam(
                                                ['content', 'productPages', activeProductPageId, 'packaging', 'packagingSpecs'],
                                                specs.filter((_: any, i: number) => i !== index)
                                            )
                                        }
                                    }}
                                    className="text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Incoterms */}
                <SimpleListEditor
                    activeProductPageId={activeProductPageId}
                    title="Incoterms"
                    data={incoterms}
                    dataPath={['content', 'productPages', activeProductPageId, 'packaging', 'incoterms']}
                    updateThemeParam={updateThemeParam}
                />
            </div>
        </Card>
    )
}
