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

    // Reconstruct Theme Params from VersionParam table
    // Start with default params
    let themeParams = siteData.theme.defaultParams as Record<string, any>;

    // If we have saved params, override defaults
    if (latestVersion && latestVersion.params && latestVersion.params.length > 0) {
        // Reconstruct nested object from flattened params (e.g. "colors.primary" -> { colors: { primary: ... } })
        // A simple approach for now:
        // 1. Create a deep copy of defaults
        themeParams = JSON.parse(JSON.stringify(themeParams));

        // 2. Apply updates
        latestVersion.params.forEach((param) => {
            // Basic support for flat keys or simple nesting if your params are stored that way.
            // Usually params are stored as keys like 'colors', 'typography' with JSON string values if complex,
            // or dot notation.
            // Based on your schema, VersionParam has paramKey and paramValue.
            try {
                // Check if value is JSON
                const parsedValue = JSON.parse(param.paramValue);
                themeParams[param.paramKey] = parsedValue;
            } catch (e) {
                // If simple string
                themeParams[param.paramKey] = param.paramValue;
            }
        });
    } else {
        // Fallback: If no params saved, maybe use a safe default for secondary color to prevent crash
        if (!themeParams.colors) themeParams.colors = {};
        if (!themeParams.colors.secondary) themeParams.colors.secondary = "#000000"; // Safety net
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
                theme={themeParams as any}
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
