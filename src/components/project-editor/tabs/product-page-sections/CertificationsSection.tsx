import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { scrollToPreviewSection, SECTION_IDS } from './scrollHelper'

interface CertificationsSectionProps {
    activeProductPageId: string
    certifications: any
    updateThemeParam: (path: string[], value: unknown) => void
}

export default function CertificationsSection({ activeProductPageId, certifications = {}, updateThemeParam }: CertificationsSectionProps) {
    const certList = certifications.certifications || []
    const qcProcess = certifications.qcProcess || []

    const addCert = () => {
        if (activeProductPageId) {
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'certifications', 'certifications'],
                [...certList, { name: '', description: '' }]
            )
        }
    }

    const removeCert = (index: number) => {
        if (activeProductPageId) {
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'certifications', 'certifications'],
                certList.filter((_: any, i: number) => i !== index)
            )
        }
    }

    const updateCert = (index: number, field: string, value: string) => {
        if (activeProductPageId) {
            const updated = [...certList]
            updated[index] = { ...updated[index], [field]: value }
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'certifications', 'certifications'],
                updated
            )
        }
    }

    const addQC = () => {
        if (activeProductPageId) {
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'certifications', 'qcProcess'],
                [...qcProcess, { step: `${qcProcess.length + 1}`, title: '', description: '' }]
            )
        }
    }

    const removeQC = (index: number) => {
        if (activeProductPageId) {
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'certifications', 'qcProcess'],
                qcProcess.filter((_: any, i: number) => i !== index)
            )
        }
    }

    const updateQC = (index: number, field: string, value: string) => {
        if (activeProductPageId) {
            const updated = [...qcProcess]
            updated[index] = { ...updated[index], [field]: value }
            updateThemeParam(
                ['content', 'productPages', activeProductPageId, 'certifications', 'qcProcess'],
                updated
            )
        }
    }

    return (
        <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => scrollToPreviewSection(SECTION_IDS.CERTIFICATIONS)}>
            <h3 className="text-lg font-semibold mb-4">Certifications & Quality Control</h3>

            <div className="space-y-6">
                {/* Certifications */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <Label className="text-base">Certifications</Label>
                        <Button onClick={addCert} size="sm">
                            <Plus className="w-4 h-4 mr-1" />
                            Add Certificate
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {certList.map((cert: any, index: number) => (
                            <div key={index} className="border rounded p-3 bg-gray-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Input
                                        value={cert.name || ''}
                                        onChange={(e) => updateCert(index, 'name', e.target.value)}
                                        placeholder="Certificate name (e.g., ISO 9001)"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeCert(index)}
                                        className="text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    value={cert.description || ''}
                                    onChange={(e) => updateCert(index, 'description', e.target.value)}
                                    placeholder="Description"
                                    rows={2}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* QC Process */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <Label className="text-base">Quality Control Process</Label>
                        <Button onClick={addQC} size="sm">
                            <Plus className="w-4 h-4 mr-1" />
                            Add QC Step
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {qcProcess.map((qc: any, index: number) => (
                            <div key={index} className="border rounded p-3 bg-gray-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Input
                                        value={qc.title || ''}
                                        onChange={(e) => updateQC(index, 'title', e.target.value)}
                                        placeholder="Step title"
                                        className="flex-1"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeQC(index)}
                                        className="text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    value={qc.description || ''}
                                    onChange={(e) => updateQC(index, 'description', e.target.value)}
                                    placeholder="Description"
                                    rows={2}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    )
}
