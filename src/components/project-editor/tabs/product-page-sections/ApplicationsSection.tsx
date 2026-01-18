import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { scrollToPreviewSection, SECTION_IDS } from './scrollHelper'
import ImageUpload from '@/components/ui/image-upload'

interface ApplicationsSectionProps {
    activeProductPageId: string
    applications: any
    updateThemeParam: (path: string[], value: unknown) => void
}

const iconOptions = ['Factory', 'Building', 'Home', 'Store', 'Hospital', 'School']

export default function ApplicationsSection({ activeProductPageId, applications = {}, updateThemeParam }: ApplicationsSectionProps) {
    const appList = applications.applications || []

    const addApplication = () => {
        if (activeProductPageId) {
            const newApp = { icon: 'Factory', industry: '', description: '', image: '' }
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'applications', 'applications'],
                [...appList, newApp]
            )
        }
    }

    const removeApplication = (index: number) => {
        if (activeProductPageId) {
            const updated = appList.filter((_: any, i: number) => i !== index)
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'applications', 'applications'],
                updated
            )
        }
    }

    const updateApplication = (index: number, field: string, value: string) => {
        if (activeProductPageId) {
            const updated = [...appList]
            updated[index] = { ...updated[index], [field]: value }
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'applications', 'applications'],
                updated
            )
        }
    }

    return (
        <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => scrollToPreviewSection(SECTION_IDS.APPLICATIONS)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Applications & Use Cases</h3>
                <Button onClick={(e) => { e.stopPropagation(); addApplication(); }} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Application
                </Button>
            </div>

            <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                {appList.map((app: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-600">Application {index + 1}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeApplication(index)}
                                className="text-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <Label>Icon</Label>
                                <Select
                                    value={app.icon || 'Factory'}
                                    onValueChange={(value) => updateApplication(index, 'icon', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {iconOptions.map((icon) => (
                                            <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Industry</Label>
                                <Input
                                    value={app.industry || ''}
                                    onChange={(e) => updateApplication(index, 'industry', e.target.value)}
                                    placeholder="e.g., Manufacturing"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <Label>Description</Label>
                            <Textarea
                                value={app.description || ''}
                                onChange={(e) => updateApplication(index, 'description', e.target.value)}
                                placeholder="How this product is used in this industry"
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label>Industry Image</Label>
                            <ImageUpload
                                value={app.image || ''}
                                onChange={(url) => updateApplication(index, 'image', url)}
                                placeholder="Upload industry/use case image"
                                recommendedSize="600x400px"
                                aspectRatio="3:2"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}
