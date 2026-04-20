import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { scrollToPreviewSection, SECTION_IDS } from './scrollHelper'

interface SimpleEditorProps {
    activeProductPageId: string
    title: string
    data: any
    dataPath: string[]
    updateThemeParam: (path: string[], value: unknown) => void
}

// Reusable component for simple list-based sections
export function SimpleListEditor({ activeProductPageId, title, data = [], dataPath, updateThemeParam }: SimpleEditorProps & { data: string[] }) {
    const add = () => {
        if (activeProductPageId) {
            updateThemeParam([...dataPath], [...data, ''])
        }
    }

    const remove = (index: number) => {
        if (activeProductPageId) {
            updateThemeParam([...dataPath], data.filter((_: string, i: number) => i !== index))
        }
    }

    const update = (index: number, value: string) => {
        if (activeProductPageId) {
            const updated = [...data]
            updated[index] = value
            updateThemeParam([...dataPath], updated)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <Label className="text-base">{title}</Label>
                <Button onClick={add} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                </Button>
            </div>

            <div className="space-y-2">
                {data.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input
                            value={item}
                            onChange={(e) => update(index, e.target.value)}
                            placeholder={`${title} item`}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-600"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

// OEM Section
interface OEMSectionProps {
    activeProductPageId: string
    oem: any
    updateThemeParam: (path: string[], value: unknown) => void
}

export default function OEMSection({ activeProductPageId, oem = {}, updateThemeParam }: OEMSectionProps) {
    const capabilities = oem.capabilities || []

    const addCapability = () => {
        if (activeProductPageId) {
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'oem', 'capabilities'],
                [...capabilities, { icon: 'Settings', title: '', description: '' }]
            )
        }
    }

    const removeCapability = (index: number) => {
        if (activeProductPageId) {
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'oem', 'capabilities'],
                capabilities.filter((_: any, i: number) => i !== index)
            )
        }
    }

    const updateCapability = (index: number, field: string, value: string) => {
        if (activeProductPageId) {
            const updated = [...capabilities]
            updated[index] = { ...updated[index], [field]: value }
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'oem', 'capabilities'],
                updated
            )
        }
    }

    return (
        <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => scrollToPreviewSection(SECTION_IDS.OEM)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">OEM/ODM Capabilities</h3>
                <Button onClick={addCapability} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Capability
                </Button>
            </div>

            <div className="space-y-3">
                {capabilities.map((cap: any, index: number) => (
                    <div key={index} className="border rounded p-3 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                            <Input
                                value={cap.title || ''}
                                onChange={(e) => updateCapability(index, 'title', e.target.value)}
                                placeholder="Capability title"
                                className="flex-1"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeCapability(index)}
                                className="text-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        <Textarea
                            value={cap.description || ''}
                            onChange={(e) => updateCapability(index, 'description', e.target.value)}
                            placeholder="Description"
                            rows={2}
                        />
                    </div>
                ))}
            </div>
        </Card>
    )
}
