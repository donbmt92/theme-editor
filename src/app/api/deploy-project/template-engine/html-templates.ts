// Export all HTML template functions
export { generateStaticHeader } from './template/header'
export { generateStaticHeroSection } from './template/hero'
export { generateStaticProblemsSection } from './template/problems'
export { generateStaticProductsSection } from './template/products'
export { generateStaticTestimonialsSection } from './template/testimonials'
export { generateStaticFooter } from './template/footer'

// Re-export types for convenience
export type { HeaderParams, HeroParams, ProblemsParams, ProductsParams, TestimonialsParams } from '../types'
