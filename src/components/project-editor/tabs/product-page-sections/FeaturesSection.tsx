import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { scrollToPreviewSection, SECTION_IDS } from './scrollHelper'

interface FeaturesSectionProps {
    activeProductPageId: string
    features: any[]
    updateThemeParam: (path: string[], value: unknown) => void
}

const iconOptions = [
    'Package', 'Shield', 'Truck', 'Settings', 'Zap', 'Award',
    'CheckCircle', 'Star', 'Target', 'TrendingUp', 'Users', 'Clock'
]

export default function FeaturesSection({ activeProductPageId, features = [], updateThemeParam }: FeaturesSectionProps) {
    const addFeature = () => {
        if (activeProductPageId) {
            const newFeature = {
                icon: 'CheckCircle',
                title: '',
                description: ''
            }
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'features'],
                [...features, newFeature]
            )
        }
    }

    const removeFeature = (index: number) => {
        if (activeProductPageId) {
            const updatedFeatures = features.filter((_, i) => i !== index)
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'features'],
                updatedFeatures
            )
        }
    }

    const updateFeature = (index: number, field: string, value: string) => {
        if (activeProductPageId) {
            const updatedFeatures = [...features]
            updatedFeatures[index] = { ...updatedFeatures[index], [field]: value }
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'features'],
                updatedFeatures
            )
        }
    }

    return (
        <Card
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => scrollToPreviewSection(SECTION_IDS.FEATURES)}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Product Features</h3>
                <Button onClick={(e) => { e.stopPropagation(); addFeature(); }} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Feature
                </Button>
            </div>

            <div className="space-y-4">
                {features.map((feature, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-600">Feature {index + 1}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFeature(index)}
                                className="text-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <Label>Icon</Label>
                                <Select
                                    value={feature.icon || 'CheckCircle'}
                                    onValueChange={(value) => updateFeature(index, 'icon', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {iconOptions.map((icon) => (
                                            <SelectItem key={icon} value={icon}>
                                                {icon}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Title</Label>
                                <Input
                                    value={feature.title || ''}
                                    onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                    placeholder="Feature title"
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Description</Label>
                            <Textarea
                                value={feature.description || ''}
                                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                placeholder="Benefits-focused description"
                                rows={2}
                            />
                        </div>
                    </div>
                ))}

                {features.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No features added yet. Click "Add Feature" to get started.</p>
                    </div>
                )}
            </div>
        </Card>
    )
}
