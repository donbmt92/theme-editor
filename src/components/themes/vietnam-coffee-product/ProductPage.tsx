'use client'

import React from 'react'
import { ThemeParams } from '@/types'
import ProductHero from './ProductHero'
import ProductOverview from './ProductOverview'
import ProductFeatures from './ProductFeatures'
import TechnicalSpecs from './TechnicalSpecs'
import Applications from './Applications'
import Certifications from './Certifications'
import OEMCapability from './OEMCapability'
import PackagingShipping from './PackagingShipping'
import WhyChooseUs from './WhyChooseUs'
import ProductRFQ from './ProductRFQ'
import ProductLeadMagnet from './ProductLeadMagnet'
import ProductCTA from './ProductCTA'
import StickyCTA from './StickyCTA'

interface ProductPageProps {
    theme: ThemeParams
    content: any
}

export default function ProductPage({ theme, content }: ProductPageProps) {
    // Get the active product page data
    const activeProductPageId = content.activeProductPageId
    const productPages = content.productPages || {}
    const productPageContent = activeProductPageId ? productPages[activeProductPageId] : {}

    // Helper to get consistent typography
    const getTypographyStyles = () => {
        return {
            fontFamily: theme.typography?.fontFamily || 'Inter',
            color: theme.colors?.text || '#2D3748'
        }
    }

    return (
        <div className="min-h-screen bg-white" style={getTypographyStyles()}>
            <ProductHero theme={theme} content={productPageContent.hero} />
            <ProductOverview theme={theme} content={productPageContent.overview} />
            <ProductFeatures theme={theme} content={{ features: productPageContent.features }} />
            <TechnicalSpecs theme={theme} content={productPageContent.specs} />
            <Applications theme={theme} content={productPageContent.applications} />
            <Certifications theme={theme} content={productPageContent.certifications} />
            <OEMCapability theme={theme} content={productPageContent.oem} />
            <PackagingShipping theme={theme} content={productPageContent.packaging} />
            <WhyChooseUs theme={theme} content={productPageContent.whyChoose} />
            <ProductLeadMagnet theme={theme} />
            <ProductRFQ theme={theme} content={productPageContent.rfq} />
            <ProductCTA theme={theme} content={productPageContent.cta} />
            <StickyCTA theme={theme} />
        </div>
    )
}
