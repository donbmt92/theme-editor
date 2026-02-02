import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import ProductPage from "@/components/themes/vietnam-coffee-product/ProductPage";

// Helper to generate slug from title
function toSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

async function getSiteData(domain: string) {
    let project = await prisma.project.findFirst({
        where: { customDomain: domain },
        include: {
            theme: true,
            versions: {
                orderBy: { versionNumber: 'desc' },
                take: 1,
            }
        }
    });

    if (!project) {
        project = await prisma.project.findFirst({
            where: { subdomain: domain.split('.')[0] },
            include: {
                theme: true,
                versions: {
                    orderBy: { versionNumber: 'desc' },
                    take: 1,
                }
            }
        });
    }

    return project;
}

function findProductBySlug(productPages: Record<string, any>, slug: string): { id: string; product: any } | null {
    for (const [id, product] of Object.entries(productPages)) {
        if (!product?.enabled) continue;
        const productSlug = toSlug(product?.hero?.title || id);
        if (productSlug === slug) {
            return { id, product };
        }
    }
    return null;
}

export async function generateMetadata({ params }: { params: Promise<{ domain: string; slug: string }> }): Promise<Metadata> {
    const { domain, slug } = await params;
    const siteData = await getSiteData(domain);

    if (!siteData || !siteData.versions[0]) {
        return { title: "Product Not Found" };
    }

    let snapshot: any = siteData.versions[0].snapshot;
    if (typeof snapshot === 'string') {
        try { snapshot = JSON.parse(snapshot); } catch { snapshot = {}; }
    }

    const productPages = snapshot?.content?.productPages || {};
    const result = findProductBySlug(productPages, slug);

    if (!result) {
        return { title: "Product Not Found" };
    }

    return {
        title: `${result.product.hero?.title || 'Product'} - ${siteData.name}`,
        description: result.product.hero?.description || '',
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ domain: string; slug: string }> }) {
    const { domain, slug } = await params;
    const siteData = await getSiteData(domain);

    if (!siteData) {
        return notFound();
    }

    const latestVersion = siteData.versions[0];
    if (!latestVersion || !latestVersion.snapshot) {
        return notFound();
    }

    let snapshot: any = latestVersion.snapshot;
    if (typeof snapshot === 'string') {
        try { snapshot = JSON.parse(snapshot); } catch { snapshot = {}; }
    }

    const productPages = snapshot?.content?.productPages || {};
    const result = findProductBySlug(productPages, slug);

    if (!result) {
        return notFound();
    }

    // Build theme params for styling
    const themeParams = {
        colors: snapshot?.colors || {
            primary: "#8B4513",
            secondary: "#D2691E",
            accent: "#FFD700",
            background: "#F5F5DC",
            text: "#2D3748"
        },
        typography: snapshot?.typography || {},
        ...snapshot
    };

    // Build content structure that ProductPage expects
    // ProductPage expects: { activeProductPageId, productPages }
    const contentForProductPage = {
        activeProductPageId: result.id,
        productPages: productPages
    };

    // Render the product page component
    return (
        <ProductPage
            theme={themeParams}
            content={contentForProductPage}
        />
    );
}
