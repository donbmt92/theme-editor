import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";

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

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
    const { domain } = await params;
    const siteData = await getSiteData(domain);

    return {
        title: siteData ? `Products - ${siteData.name}` : "Products",
    };
}

export default async function ProductsListPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain } = await params;
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
        try {
            snapshot = JSON.parse(snapshot);
        } catch {
            snapshot = {};
        }
    }

    // Get product pages from snapshot
    const productPages = snapshot?.content?.productPages || {};
    const enabledProducts = Object.entries(productPages)
        .filter(([_, product]: [string, any]) => product?.enabled)
        .map(([id, product]: [string, any]) => ({
            id,
            title: product?.hero?.title || id,
            description: product?.hero?.description || '',
            image: product?.hero?.image || '',
            slug: toSlug(product?.hero?.title || id),
        }));

    if (enabledProducts.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">No Products Available</h1>
                    <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enabledProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
