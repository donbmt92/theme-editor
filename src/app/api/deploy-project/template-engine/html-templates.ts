// Export all HTML template functions
export { generateStaticHeader } from './template/header'
export { generateStaticHeroSection } from './template/hero'
export { generateStaticLeadMagnetSection } from './template/lead-magnet'
export { generateStaticWhyChooseUsSection } from './template/why-choose-us'
export { generateStaticProblemsSection } from './template/problems'
export { generateStaticProductsSection } from './template/products'
export { generateStaticTestimonialsSection } from './template/testimonials'
export { generateStaticFooter } from './template/footer'
export { generateStaticProductPage } from './template/product-page'

// Re-export types for convenience
export type { HeaderParams, HeroParams, LeadMagnetParams, WhyChooseUsParams, ProblemsParams, ProductsParams, TestimonialsParams } from '../types'
