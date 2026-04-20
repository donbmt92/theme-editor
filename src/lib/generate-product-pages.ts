/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThemeParams } from '@/types'
import { ProjectFiles } from './export-react-project'

/**
 * Helper to generate SEO friendly slug
 */
function toSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '')       // Trim - from end of text
}

/**
 * Get enabled product pages with slugs
 */
export function getEnabledProducts(themeParams: ThemeParams) {
  const productPages = themeParams.content?.productPages || {}
  const enabledProducts: Array<{ id: string; slug: string; data: any }> = []

  for (const [productId, productData] of Object.entries(productPages)) {
    if (productData.enabled) {
      // Generate slug from title, fallback to ID
      const title = productData.hero?.title || productId
      const slug = toSlug(title)
      enabledProducts.push({ id: productId, slug, data: productData })
    }
  }

  return enabledProducts
}

/**
 * Generate product page routes using slugs
 */
export function generateProductRoutes(
  enabledProducts: Array<{ id: string; slug: string; data: any }>,
  projectLanguage: string = 'vietnamese'
): ProjectFiles {
  const files: ProjectFiles = {}

  for (const product of enabledProducts) {
    const { id: productId, slug, data: productData } = product

    // Generate app/products/[slug]/page.tsx
    files[`src/app/products/${slug}/page.tsx`] = `import ProductPage from '@/components/product/ProductPage'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '${productData.hero?.title || 'Product Page'}',
    description: '${productData.hero?.subtitle || 'Professional product page'}',
    openGraph: {
      title: '${productData.hero?.title || 'Product Page'}',
      description: '${productData.hero?.subtitle || 'Professional product page'}',
      images: [
        {
          url: '${productData.hero?.image || '/placeholder.jpg'}',
          width: 1200,
          height: 630,
          alt: '${productData.hero?.title || 'Product'}',
        },
      ],
    },
  }
}

export default function ProductPage_${toPascalCase(slug)}() {
  return <ProductPage slug="${slug}" language="${projectLanguage}" />
}
`
  }

  return files
}

/**
 * Generate product data file with slugs mapping
 */
export function generateProductData(themeParams: ThemeParams): string {
  const productPages = themeParams.content?.productPages || {}

  // Create mapping: slug -> productData
  const enabledData: any = {}

  for (const [productId, productData] of Object.entries(productPages)) {
    if ((productData as any).enabled) {
      const title = (productData as any).hero?.title || productId
      const slug = toSlug(title)

      // Store data keyed by slug for easy lookup
      enabledData[slug] = {
        ...productData,
        id: productId,
        slug: slug
      }
    }
  }

  return JSON.stringify(enabledData, null, 2)
}

/**
 * Generate products index page using slugs
 */
export function generateProductsIndexPage(enabledProducts: Array<{ id: string; slug: string; data: any }>): string {
  return `import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProductsPage() {
  const products = ${JSON.stringify(
    enabledProducts.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.data.hero?.title || 'Product',
      subtitle: p.data.hero?.subtitle || 'Professional product',
      image: p.data.hero?.image || '/placeholder.jpg'
    })),
    null,
    4
  )}

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-lg text-muted-foreground">
            Explore our range of professional products
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
                <CardDescription>{product.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={\`/products/\${product.slug}\`}>
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
`
}

/**
 * Update sitemap to include product page slugs
 */
export function generateProductSitemap(enabledProducts: Array<{ id: string; slug: string; data: any }>): string {
  const productEntries = enabledProducts.map(p => `    {
      url: 'https://yoursite.vercel.app/products/${p.slug}',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }`).join(',\n')

  return `import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yoursite.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://yoursite.vercel.app/products',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
${productEntries}
  ]
}
`
}

/**
 * Helper to convert kebab-case to PascalCase
 * Handles strings that start with numbers by prefixing with 'Product'
 */
function toPascalCase(str: string): string {
  const pascal = str
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')

  // If starts with a number, prefix with 'Product'
  if (/^\d/.test(pascal)) {
    return 'Product' + pascal
  }

  return pascal
}
