// Export all HTML template functions
export { generateStaticHeader } from './template/header'
export { generateStaticHeroSection } from './template/hero'
export { generateStaticLeadMagnetSection } from './template/lead-magnet'
export { generateStaticWhyChooseUsSection } from './template/why-choose-us'
export { generateStaticProblemsSection } from './template/problems'
export { generateStaticProductsSection } from './template/products'
export { generateStaticTestimonialsSection } from './template/testimonials'
export { generateStaticBlogSection } from './template/blog'
export { generateStaticFooter } from './template/footer'

// Re-export types for convenience
export type { HeaderParams, HeroParams, LeadMagnetParams, WhyChooseUsParams, ProblemsParams, ProductsParams, TestimonialsParams, BlogParams } from '../types'
