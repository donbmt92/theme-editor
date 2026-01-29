"use client"

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ThemeParams } from '@/types'
import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import UpgradePrompt from '@/components/ui/upgrade-prompt'
import { canAccessFeature } from '@/lib/tier-limits'

// Import all section editors
import HeroSection from './product-page-sections/HeroSection'
import OverviewSection from './product-page-sections/OverviewSection'
import FeaturesSection from './product-page-sections/FeaturesSection'
import SpecsSection from './product-page-sections/SpecsSection'
import ApplicationsSection from './product-page-sections/ApplicationsSection'
import CertificationsSection from './product-page-sections/CertificationsSection'
import OEMSection from './product-page-sections/OEMSection'
import PackagingSection from './product-page-sections/PackagingSection'
import WhyChooseSection from './product-page-sections/WhyChooseSection'
import { LeadMagnetSection, RFQSection, CTASection } from './product-page-sections/SimpleSections'

interface ProductPageTabProps {
    themeParams: ThemeParams
    updateThemeParam: (path: string[], value: string | number | unknown) => void
    userTier: 'FREE' | 'STANDARD' | 'PRO'
}

const ProductPageTab = ({ themeParams, updateThemeParam, userTier }: ProductPageTabProps) => {
    const [isGenerating, setIsGenerating] = useState(false)

    // Check if user has access to product page feature
    if (!canAccessFeature(userTier, 'hasProductPage')) {
        return (
            <UpgradePrompt
                tier="PRO"
                feature="Product Page Builder"
                description="Create professional product pages for your B2B export business with our comprehensive product page builder."
                benefits={[
                    "13 pre-built product sections",
                    "Lead magnet forms (catalog download, RFQ)",
                    "Product specifications editor",
                    "OEM/ODM capabilities showcase",
                    "Certifications & quality control display",
                    "Packaging & shipping information"
                ]}
            />
        )
    }

    const products = themeParams.content?.products?.items || []
    const activeProductPageId = themeParams.content?.activeProductPageId || ''
    const productPages = themeParams.content?.productPages || {}

    // Get current product page data
    const currentProductPage = activeProductPageId ? productPages[activeProductPageId] : undefined
    const selectedProduct = products.find((p: any) => p.id === activeProductPageId)

    // Debug log
    // console.log('[ProductPageTab] Current state:', {
    //     activeProductPageId,
    //     hasCurrentProductPage: !!currentProductPage,
    //     currentProductPageKeys: currentProductPage ? Object.keys(currentProductPage) : [],
    //     heroData: currentProductPage?.hero
    // })

    const handleGenerateProductPage = async () => {
        if (!activeProductPageId) {
            alert('Vui lòng chọn sản phẩm trước')
            return
        }

        setIsGenerating(true)
        try {
            const response = await fetch('/api/generate-product-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product: selectedProduct,
                    themeParams
                })
            })

            if (!response.ok) throw new Error('Failed to generate')

            const data = await response.json()

            // console.log('Generated data:', data.productPageData)
            // console.log('Current themeParams.projectLanguage:', themeParams.projectLanguage)

            // Update product page for this specific productId
            // Replace old data completely, but preserve enabled and showPreview settings
            const updatedProductPages = {
                ...productPages,
                [activeProductPageId]: {
                    ...data.productPageData,
                    enabled: true,
                    showPreview: true
                }
            }

            updateThemeParam(['content', 'productPages'], updatedProductPages)
            // alert('Tạo nội dung thành công! Bật "Enable Product Page" để xem Preview 👉')
            console.log('Product page content generated successfully')
        } catch (error) {
            console.error('Generate error:', error)
            alert('Có lỗi xảy ra khi tạo nội dung')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Product Selector */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    Chọn sản phẩm & Tạo nội dung với AI
                </h3>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="product-select">Chọn sản phẩm từ danh sách</Label>
                        <Select
                            value={activeProductPageId || ''}
                            onValueChange={(value) =>
                                updateThemeParam(['content', 'activeProductPageId'], value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="-- Chọn sản phẩm --" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.length === 0 ? (
                                    <SelectItem value="none" disabled>
                                        Chưa có sản phẩm nào. Vui lòng thêm ở tab Products
                                    </SelectItem>
                                ) : (
                                    products.map((product: any) => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {product.name} {product.category ? `(${product.category})` : ''}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedProduct && (
                        <div className="p-4 bg-white rounded-lg border border-blue-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">Sản phẩm đã chọn:</p>
                            <p className="font-semibold text-blue-900">{selectedProduct.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{selectedProduct.description}</p>
                        </div>
                    )}

                    <Button
                        onClick={handleGenerateProductPage}
                        disabled={!activeProductPageId || isGenerating}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="lg"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isGenerating ? 'Đang tạo...' : 'Tạo Product Page với AI 🚀'}
                    </Button>

                    <p className="text-xs text-gray-600 text-center">
                        AI sẽ tự động tạo nội dung cho 13 sections dựa trên thông tin sản phẩm
                    </p>
                </div>
            </Card>

            {/* Show Preview Toggle (Editor Only) */}
            <Card className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Show Preview</h3>
                        <p className="text-sm text-muted-foreground">
                            Preview this product page in the right panel while editing
                        </p>
                    </div>
                    <input
                        type="checkbox"
                        checked={currentProductPage?.showPreview || false}
                        onChange={(e) =>
                            activeProductPageId && updateThemeParam(['content', 'productPages', activeProductPageId, 'showPreview'], e.target.checked)
                        }
                        className="w-10 h-6"
                        disabled={!activeProductPageId}
                    />
                </div>
            </Card>

            {/* Enable Product Page (Production) */}
            <Card className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Enable Product Page</h3>
                        <p className="text-sm text-muted-foreground">
                            Enable this product page for production/export (when you deploy)
                        </p>
                    </div>
                    <input
                        type="checkbox"
                        checked={currentProductPage?.enabled || false}
                        onChange={(e) =>
                            activeProductPageId && updateThemeParam(['content', 'productPages', activeProductPageId, 'enabled'], e.target.checked)
                        }
                        className="w-10 h-6"
                        disabled={!activeProductPageId}
                    />
                </div>
            </Card>

            {/* Section Editors - Only show if product is selected */}
            {activeProductPageId && currentProductPage && (
                <>
                    <HeroSection
                        activeProductPageId={activeProductPageId}
                        hero={currentProductPage.hero || {}}
                        updateThemeParam={updateThemeParam}
                    />

                    <OverviewSection
                        activeProductPageId={activeProductPageId}
                        overview={currentProductPage.overview || {}}
                        updateThemeParam={updateThemeParam}
                    />

                    <FeaturesSection
                        activeProductPageId={activeProductPageId}
                        features={currentProductPage.features || []}
                        updateThemeParam={updateThemeParam}
                    />

                    <SpecsSection
                        activeProductPageId={activeProductPageId}
                        specs={currentProductPage.specs || {}}
                        updateThemeParam={updateThemeParam}
                    />

                    <ApplicationsSection
                        activeProductPageId={activeProductPageId}
                        applications={currentProductPage.applications || {}}
                        updateThemeParam={updateThemeParam}
                    />

                    <CertificationsSection
                        activeProductPageId={activeProductPageId}
                        certifications={currentProductPage.certifications || {}}
                        updateThemeParam={updateThemeParam}
                    />

                    <OEMSection
                        activeProductPageId={activeProductPageId}
                        oem={currentProductPage.oem || {}}
                        updateThemeParam={updateThemeParam}
                    />

                    <PackagingSection
                        activeProductPageId={activeProductPageId}
                        packaging={currentProductPage.packaging || {}}
                        updateThemeParam={updateThemeParam}
                    />

                    <WhyChooseSection
                        activeProductPageId={activeProductPageId}
                        whyChoose={currentProductPage.whyChoose || {}}
                        updateThemeParam={updateThemeParam}
                    />

                    <LeadMagnetSection
                        activeProductPageId={activeProductPageId}
                        leadMagnet={currentProductPage.leadMagnet || {}}
                        updateThemeParam={updateThemeParam}
                    />

                    <RFQSection
                        activeProductPageId={activeProductPageId}
                        rfq={currentProductPage.rfq || {}}
                        updateThemeParam={updateThemeParam}
                    />

                    <CTASection
                        activeProductPageId={activeProductPageId}
                        cta={currentProductPage.cta || {}}
                        updateThemeParam={updateThemeParam}
                    />
                </>
            )}

            {/* Info Card - Show when no product selected */}
            {!activeProductPageId && (
                <Card className="p-6 bg-blue-50 border-blue-200">
                    <h4 className="font-semibold mb-2">📘 Product Page Sections</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                        Select a product above to edit its Product Page with 13 sections:
                    </p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>✓ Hero & Product Overview</li>
                        <li>✓ Product Features & Advantages</li>
                        <li>✓ Technical Specifications</li>
                        <li>✓ Applications & Use Cases</li>
                        <li>✓ Certifications & Quality Control</li>
                        <li>✓ OEM/ODM Capabilities</li>
                        <li>✓ Packaging & Shipping</li>
                        <li>✓ Why Choose Us</li>
                        <li>✓ Catalog Download Form</li>
                        <li>✓ RFQ Form</li>
                        <li>✓ Call-to-Action</li>
                    </ul>
                </Card>
            )}
        </div>
    )
}

export default ProductPageTab
