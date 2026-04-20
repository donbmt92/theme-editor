/**
 * Script to check product pages status in database
 * Usage: node scripts/check-products.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkProducts() {
    try {
        console.log('🔍 Checking Product Pages Status...\n')

        // Get all projects
        const projects = await prisma.project.findMany({
            select: {
                id: true,
                name: true,
                customDomain: true,
                themeParams: true,
            }
        })

        console.log(`Found ${projects.length} projects\n`)

        for (const project of projects) {
            console.log(`\n${'='.repeat(60)}`)
            console.log(`📦 Project: ${project.name}`)
            console.log(`   ID: ${project.id}`)
            console.log(`   Domain: ${project.customDomain || 'N/A'}`)
            console.log(`${'='.repeat(60)}`)

            const themeParams = project.themeParams

            // Check products
            const products = themeParams?.content?.products?.items || []
            console.log(`\n📋 Products (${products.length}):`)
            products.forEach((p, i) => {
                console.log(`   ${i + 1}. ${p.name} (ID: ${p.id})`)
                console.log(`      Category: ${p.category || 'N/A'}`)
                console.log(`      Price: ${p.price || 'N/A'}`)
            })

            // Check product pages
            const productPages = themeParams?.content?.productPages || {}
            const productPageIds = Object.keys(productPages)

            console.log(`\n📄 Product Pages (${productPageIds.length}):`)

            if (productPageIds.length === 0) {
                console.log(`   ⚠️  No product pages created yet`)
            } else {
                productPageIds.forEach((id, i) => {
                    const page = productPages[id]
                    const product = products.find(p => p.id === id)

                    console.log(`\n   ${i + 1}. Product: ${product?.name || id}`)
                    console.log(`      ID: ${id}`)
                    console.log(`      Enabled: ${page.enabled ? '✅ YES' : '❌ NO'}`)
                    console.log(`      Show Preview: ${page.showPreview ? '✅ YES' : '❌ NO'}`)
                    console.log(`      Has Hero: ${page.hero ? '✅' : '❌'}`)
                    console.log(`      Has Features: ${page.features?.length > 0 ? `✅ (${page.features.length})` : '❌'}`)
                    console.log(`      Has Specs: ${page.specs ? '✅' : '❌'}`)

                    // Generate slug
                    const title = page.hero?.title || product?.name || id
                    const slug = title
                        .toString()
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w\-]+/g, '')
                        .replace(/\-\-+/g, '-')
                        .replace(/^-+/, '')
                        .replace(/-+$/, '')

                    console.log(`      Slug: ${slug}`)

                    if (page.enabled) {
                        console.log(`      🌐 URL: /products/${slug}`)
                    }
                })
            }

            // Check active product page
            const activeProductPageId = themeParams?.content?.activeProductPageId
            console.log(`\n🎯 Active Product Page ID: ${activeProductPageId || 'None'}`)

            // Summary
            const enabledCount = productPageIds.filter(id => productPages[id]?.enabled).length
            console.log(`\n📊 Summary:`)
            console.log(`   Total Products: ${products.length}`)
            console.log(`   Total Product Pages: ${productPageIds.length}`)
            console.log(`   Enabled for Production: ${enabledCount}`)
            console.log(`   Ready to Deploy: ${enabledCount > 0 ? '✅ YES' : '❌ NO'}`)

            if (enabledCount > 0) {
                console.log(`\n✨ When deployed, these URLs will be available:`)
                console.log(`   - /products (index page)`)
                productPageIds.forEach(id => {
                    const page = productPages[id]
                    if (page.enabled) {
                        const product = products.find(p => p.id === id)
                        const title = page.hero?.title || product?.name || id
                        const slug = title
                            .toString()
                            .toLowerCase()
                            .trim()
                            .replace(/\s+/g, '-')
                            .replace(/[^\w\-]+/g, '')
                            .replace(/\-\-+/g, '-')
                            .replace(/^-+/, '')
                            .replace(/-+$/, '')
                        console.log(`   - /products/${slug}`)
                    }
                })
            }
        }

        console.log(`\n${'='.repeat(60)}\n`)

    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkProducts()
