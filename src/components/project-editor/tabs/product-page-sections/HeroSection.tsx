import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { scrollToPreviewSection, SECTION_IDS } from './scrollHelper'
import ImageUpload from '@/components/ui/image-upload'

interface HeroSectionProps {
    activeProductPageId: string
    hero: any
    updateThemeParam: (path: string[], value: unknown) => void
}

export default function HeroSection({ activeProductPageId, hero, updateThemeParam }: HeroSectionProps) {
    const [newUSP, setNewUSP] = useState('')
    const usps = hero.usps || []

    const addUSP = () => {
        if (newUSP.trim() && activeProductPageId) {
            const updatedUSPs = [...usps, newUSP]
            updateThemeParam(['content', 'productPages', activeProductPageId, 'hero', 'usps'], updatedUSPs)
            setNewUSP('')
        }
    }

    const removeUSP = (index: number) => {
        if (activeProductPageId) {
            const updatedUSPs = usps.filter((_: string, i: number) => i !== index)
            updateThemeParam(['content', 'productPages', activeProductPageId, 'hero', 'usps'], updatedUSPs)
        }
    }

    return (
        <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => scrollToPreviewSection(SECTION_IDS.HERO)}>
            <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
            <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="hero-title">Title</Label>
                        <Input
                            id="hero-title"
                            value={hero.title || ''}
                            onChange={(e) =>
                                activeProductPageId && updateThemeParam(
                                    ['content', 'productPages', activeProductPageId, 'hero', 'title'],
                                    e.target.value
                                )
                            }
                            placeholder="Product Name - Manufacturer & Exporter"
                        />
                    </div>
                    <div>
                        <Label htmlFor="hero-subtitle">Subtitle</Label>
                        <Input
                            id="hero-subtitle"
                            value={hero.subtitle || ''}
                            onChange={(e) =>
                                activeProductPageId && updateThemeParam(
                                    ['content', 'productPages', activeProductPageId, 'hero', 'subtitle'],
                                    e.target.value
                                )
                            }
                            placeholder="Professional tagline"
                        />
                    </div>
                </div>

                {/* Image Uploads */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Background Image</Label>
                        <ImageUpload
                            value={hero.backgroundImage || ''}
                            onChange={(url) =>
                                activeProductPageId && updateThemeParam(
                                    ['content', 'productPages', activeProductPageId, 'hero', 'backgroundImage'],
                                    url
                                )
                            }
                            placeholder="Upload background image"
                            recommendedSize="1920x1080px"
                            aspectRatio="16:9"
                        />
                    </div>
                    <div>
                        <Label>Product Image</Label>
                        <ImageUpload
                            value={hero.image || ''}
                            onChange={(url) =>
                                activeProductPageId && updateThemeParam(
                                    ['content', 'productPages', activeProductPageId, 'hero', 'image'],
                                    url
                                )
                            }
                            placeholder="Upload product image"
                            recommendedSize="800x600px"
                            aspectRatio="4:3"
                        />
                    </div>
                </div>

                <div>
                    <Label>Unique Selling Points (USPs)</Label>
                    <div className="space-y-2 mt-2">
                        {usps.map((usp: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    value={usp}
                                    onChange={(e) => {
                                        if (activeProductPageId) {
                                            const updatedUSPs = [...usps]
                                            updatedUSPs[index] = e.target.value
                                            updateThemeParam(
                                                ['content', 'productPages', activeProductPageId, 'hero', 'usps'],
                                                updatedUSPs
                                            )
                                        }
                                    }}
                                    placeholder="USP benefit"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeUSP(index)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <div className="flex items-center gap-2">
                            <Input
                                value={newUSP}
                                onChange={(e) => setNewUSP(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        addUSP()
                                    }
                                }}
                                placeholder="Add new USP..."
                            />
                            <Button onClick={addUSP} size="sm">
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
