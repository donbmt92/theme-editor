import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { scrollToPreviewSection, SECTION_IDS } from './scrollHelper'

interface SpecsSectionProps {
    activeProductPageId: string
    specs: any
    updateThemeParam: (path: string[], value: unknown) => void
}

export default function SpecsSection({ activeProductPageId, specs = {}, updateThemeParam }: SpecsSectionProps) {
    const specifications = specs.specifications || []
    const customizationOptions = specs.customizationOptions || []

    const addSpec = () => {
        if (activeProductPageId) {
            const newSpec = { label: '', value: '' }
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'specs', 'specifications'],
                [...specifications, newSpec]
            )
        }
    }

    const removeSpec = (index: number) => {
        if (activeProductPageId) {
            const updated = specifications.filter((_: any, i: number) => i !== index)
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'specs', 'specifications'],
                updated
            )
        }
    }

    const updateSpec = (index: number, field: string, value: string) => {
        if (activeProductPageId) {
            const updated = [...specifications]
            updated[index] = { ...updated[index], [field]: value }
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'specs', 'specifications'],
                updated
            )
        }
    }

    const addCustomization = () => {
        if (activeProductPageId) {
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'specs', 'customizationOptions'],
                [...customizationOptions, '']
            )
        }
    }

    const removeCustomization = (index: number) => {
        if (activeProductPageId) {
            const updated = customizationOptions.filter((_: string, i: number) => i !== index)
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'specs', 'customizationOptions'],
                updated
            )
        }
    }

    const updateCustomization = (index: number, value: string) => {
        if (activeProductPageId) {
            const updated = [...customizationOptions]
            updated[index] = value
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'specs', 'customizationOptions'],
                updated
            )
        }
    }

    return (
        <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => scrollToPreviewSection(SECTION_IDS.SPECS)}>
            <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>

            <div className="space-y-6">
                {/* Specifications Table */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <Label className="text-base">Specifications</Label>
                        <Button onClick={addSpec} size="sm">
                            <Plus className="w-4 h-4 mr-1" />
                            Add Spec
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {specifications.map((spec: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    value={spec.label || ''}
                                    onChange={(e) => updateSpec(index, 'label', e.target.value)}
                                    placeholder="Label (e.g., Material)"
                                    className="flex-1"
                                />
                                <Input
                                    value={spec.value || ''}
                                    onChange={(e) => updateSpec(index, 'value', e.target.value)}
                                    placeholder="Value (e.g., Stainless Steel)"
                                    className="flex-1"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeSpec(index)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customization Options */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <Label className="text-base">Customization Options</Label>
                        <Button onClick={addCustomization} size="sm">
                            <Plus className="w-4 h-4 mr-1" />
                            Add Option
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {customizationOptions.map((option: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    value={option}
                                    onChange={(e) => updateCustomization(index, e.target.value)}
                                    placeholder="Customization option (e.g., Custom logo printing)"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeCustomization(index)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    )
}
