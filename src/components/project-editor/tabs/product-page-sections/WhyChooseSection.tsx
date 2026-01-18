import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { SimpleListEditor } from './OEMSection'
import { scrollToPreviewSection, SECTION_IDS } from './scrollHelper'
import ImageUpload from '@/components/ui/image-upload'

interface WhyChooseSectionProps {
    activeProductPageId: string
    whyChoose: any
    updateThemeParam: (path: string[], value: unknown) => void
}

export default function WhyChooseSection({ activeProductPageId, whyChoose = {}, updateThemeParam }: WhyChooseSectionProps) {
    const metrics = whyChoose.metrics || []
    const strengths = whyChoose.strengths || []

    return (
        <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => scrollToPreviewSection(SECTION_IDS.WHY_CHOOSE)}>
            <h3 className="text-lg font-semibold mb-4">Why Choose Us</h3>

            <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
                {/* Factory Image */}
                <div>
                    <Label>Factory/Facility Image</Label>
                    <ImageUpload
                        value={whyChoose.factoryImage || ''}
                        onChange={(url) =>
                            activeProductPageId && updateThemeParam(
                                ['content', 'productPages', activeProductPageId, 'whyChoose', 'factoryImage'],
                                url
                            )
                        }
                        placeholder="Upload factory or facility image"
                        recommendedSize="1200x800px"
                        aspectRatio="16:9"
                    />
                </div>

                {/* Metrics */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <Label className="text-base">Metrics</Label>
                        <Button
                            onClick={() => {
                                if (activeProductPageId) {
                                    updateThemeParam(
                                        ['content', 'productPages', activeProductPageId, 'whyChoose', 'metrics'],
                                        [...metrics, { icon: 'Award', value: '', label: '' }]
                                    )
                                }
                            }}
                            size="sm"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Metric
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {metrics.map((metric: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    value={metric.value || ''}
                                    onChange={(e) => {
                                        if (activeProductPageId) {
                                            const updated = [...metrics]
                                            updated[index] = { ...updated[index], value: e.target.value }
                                            updateThemeParam(['content', 'productPages', activeProductPageId, 'whyChoose', 'metrics'], updated)
                                        }
                                    }}
                                    placeholder="Value (e.g., 15+)"
                                />
                                <Input
                                    value={metric.label || ''}
                                    onChange={(e) => {
                                        if (activeProductPageId) {
                                            const updated = [...metrics]
                                            updated[index] = { ...updated[index], label: e.target.value }
                                            updateThemeParam(['content', 'productPages', activeProductPageId, 'whyChoose', 'metrics'], updated)
                                        }
                                    }}
                                    placeholder="Label (e.g., Years Experience)"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (activeProductPageId) {
                                            updateThemeParam(
                                                ['content', 'productPages', activeProductPageId, 'whyChoose', 'metrics'],
                                                metrics.filter((_: any, i: number) => i !== index)
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

                {/* Strengths */}
                <SimpleListEditor
                    activeProductPageId={activeProductPageId}
                    title="Key Strengths"
                    data={strengths}
                    dataPath={['content', 'productPages', activeProductPageId, 'whyChoose', 'strengths']}
                    updateThemeParam={updateThemeParam}
                />
            </div>
        </Card>
    )
}
