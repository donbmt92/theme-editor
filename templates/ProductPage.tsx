"use client"

import productPagesData from '@/data/product-pages.json'
import ProductHero from './ProductHero'
import ProductOverview from './ProductOverview'
import ProductFeatures from './ProductFeatures'
import TechnicalSpecs from './TechnicalSpecs'
import Applications from './Applications'
import Certifications from './Certifications'
import OEMCapability from './OEMCapability'
import PackagingShipping from './PackagingShipping'
import WhyChooseUs from './WhyChooseUs'
import ProductLeadMagnet from './ProductLeadMagnet'
import ProductRFQ from './ProductRFQ'
import ProductCTA from './ProductCTA'
import StickyCTA from './StickyCTA'
import Header from '../themes/vietnam-coffee/Header'
import Footer from '../themes/vietnam-coffee/Footer'
import themeData from '@/data/theme-data.json'

interface ProductPageProps {
    slug: string
    language?: string
}

export default function ProductPage({ slug, language }: ProductPageProps) {
    // Get product data
    const productData = (productPagesData as any)[slug]

    if (!productData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
                    <p className="text-muted-foreground">
                        The product you're looking for doesn't exist.
                    </p>
                </div>
            </div>
        )
    }

    const theme = {
        ...(themeData as any),
        projectLanguage: language || (themeData as any).projectLanguage || 'vietnamese'
    }

    return (
        <>
            {/* Header */}
            <Header theme={theme} content={theme.content?.header || {}} />

            <div className="min-h-screen">
                {/* Hero */}
                <ProductHero theme={theme} content={productData.hero} />

                {/* Overview */}
                <ProductOverview theme={theme} content={productData.overview} />

                {/* Features */}
                <ProductFeatures theme={theme} content={{ features: productData.features }} />

                {/* Technical Specs */}
                <TechnicalSpecs theme={theme} content={productData.specs} />

                {/* Applications */}
                <Applications theme={theme} content={productData.applications} />

                {/* Certifications */}
                <Certifications theme={theme} content={productData.certifications} />

                {/* OEM/ODM Capabilities */}
                <OEMCapability theme={theme} content={productData.oem} />

                {/* Packaging & Shipping */}
                <PackagingShipping theme={theme} content={productData.packaging} />

                {/* Why Choose Us */}
                <WhyChooseUs theme={theme} content={productData.whyChoose} />

                {/* Lead Magnet */}
                <ProductLeadMagnet theme={theme} />

                {/* RFQ Form */}
                <ProductRFQ theme={theme} content={{}} />

                {/* CTA */}
                <ProductCTA theme={theme} />

                {/* Sticky CTA */}
                <StickyCTA theme={theme} />
            </div>

            {/* Footer */}
            <Footer theme={theme} content={theme.content?.footer || {}} />
        </>
    )
}
