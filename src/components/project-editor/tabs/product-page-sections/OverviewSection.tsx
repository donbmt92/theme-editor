import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { scrollToPreviewSection, SECTION_IDS } from './scrollHelper'

interface OverviewSectionProps {
    activeProductPageId: string
    overview: any
    updateThemeParam: (path: string[], value: unknown) => void
}

export default function OverviewSection({ activeProductPageId, overview, updateThemeParam }: OverviewSectionProps) {
    return (
        <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => scrollToPreviewSection(SECTION_IDS.OVERVIEW)}>
            <h3 className="text-lg font-semibold mb-4">Product Overview</h3>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="product-description">Description</Label>
                    <Textarea
                        id="product-description"
                        value={overview?.description || ''}
                        onChange={(e) =>
                            activeProductPageId && updateThemeParam(
                                ['content', 'productPages', activeProductPageId, 'overview', 'description'],
                                e.target.value
                            )
                        }
                        placeholder="Professional product description focusing on core value proposition (2-3 sentences)"
                        rows={3}
                    />
                </div>
            </div>
        </Card>
    )
}
