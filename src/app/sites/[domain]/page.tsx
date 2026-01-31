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
                include: {
                    params: true // Fetch user customization params
                }
            }
        }
    });

    // 2. If not found, try to find by subdomain (e.g. shopgiay.geekgolfers.com)
    if (!project) {
        project = await prisma.project.findFirst({
            where: { subdomain: domain.split('.')[0] },
            include: {
                theme: true,
                versions: {
                    orderBy: { versionNumber: 'desc' },
                    take: 1,
                    include: {
                        params: true
                    }
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

    // Get theme params from snapshot (which contains the full deployed state)
    // The snapshot contains both content AND themeParams merged together
    let safeThemeParams: Record<string, any> = {};

    if (latestVersion && latestVersion.snapshot) {
        // The snapshot IS the themeParams object (saved by deploy-project route)
        let snapshotData = latestVersion.snapshot;

        // Handle if it's a string
        if (typeof snapshotData === 'string') {
            try {
                snapshotData = JSON.parse(snapshotData);
            } catch (e) {
                console.error('Failed to parse snapshot:', e);
                snapshotData = {};
            }
        }

        // Use snapshot data as theme params
        safeThemeParams = (snapshotData || {}) as Record<string, any>;
    } else {
        // Fallback to default params if no snapshot
        let themeParams = siteData.theme.defaultParams;

        if (typeof themeParams === 'string') {
            try {
                themeParams = JSON.parse(themeParams);
            } catch (e) {
                console.error('Failed to parse defaultParams:', e);
                themeParams = {};
            }
        }

        safeThemeParams = (themeParams || {}) as Record<string, any>;
    }

    // Safety net for missing colors
    if (!safeThemeParams.colors) {
        safeThemeParams.colors = {
            primary: "#8B4513",
            secondary: "#D2691E",
            accent: "#FFD700",
            background: "#F5F5DC",
            text: "#2D3748"
        };
    }

    // Render based on Theme Name or ID

    // Render based on Theme Name or ID
    // We support VietnamCoffeeTheme for all these variations for now
    const supportedThemes = [
        "vietnam-coffee",
        "vietnam-coffee-theme",
        "Vietnam Coffee Export",
        "corporate-theme",
        "Corporate Professional",
        "creative-theme",
        "Creative Portfolio",
        "minimalist-theme",
        "Minimalist Clean"
    ];

    if (supportedThemes.includes(siteData.theme.name) || supportedThemes.includes(siteData.theme.id)) {
        // Provide a way to pass content. Since VietnamCoffeeTheme likely expects specific props,
        // you might need to adapt 'content' (which is JSON) to the props it expects.

        return (
            <VietnamCoffeeTheme
                content={content as any}
                theme={safeThemeParams as any}
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
