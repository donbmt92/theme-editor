import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

// Import your Theme Components here
import VietnamCoffeeTheme from "@/components/themes/VietnamCoffeeTheme";

// Helper function to get site data
async function getSiteData(domain: string) {
    // 1. Try to find by custom domain (e.g. shopgiay.com)
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

    // 2. If not found, try to find by subdomain (e.g. shopgiay.toolbmt.com)
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

export async function generateMetadata({ params }: { params: { domain: string } }): Promise<Metadata> {
    const domain = params.domain;
    const siteData = await getSiteData(domain);

    if (!siteData) {
        return {
            title: "Site Not Found",
        };
    }

    return {
        title: siteData.name,
        description: siteData.theme.description || `Welcome to ${siteData.name}`,
    };
}

export default async function SiteHomePage({ params }: { params: { domain: string } }) {
    const domain = params.domain;
    const siteData = await getSiteData(domain);

    if (!siteData) {
        return notFound();
    }

    // Get the latest snapshot content
    const latestVersion = siteData.versions[0];
    const content = latestVersion ? latestVersion.snapshot : {};

    // Render based on Theme Name
    if (siteData.theme.name === "vietnam-coffee") {
        // Provide a way to pass content. Since VietnamCoffeeTheme likely expects specific props,
        // you might need to adapt 'content' (which is JSON) to the props it expects.

        return (
            <VietnamCoffeeTheme
                content={content as any}
                theme={siteData.theme.defaultParams as any}
            />
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">Theme "{siteData.theme.name}" is not yet supported for live rendering.</h1>
            <p>Please contact support.</p>
        </div>
    );
}
