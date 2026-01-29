import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. /_vercel (Vercel internals)
         * 5. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
    ],
};

export default function middleware(req: NextRequest) {
    const url = req.nextUrl;

    // Get hostname (e.g. geekgolfers.com, shopgiay.com, localhost:3000)
    let hostname = req.headers.get("host") || "";

    // Handle localhost for local development
    // We can map localhost:3000 to geekgolfers.com for testing the main site logic
    // To test tenant sites locally, we might need to use hosts file or specific headers
    // For now, let's treat localhost as the main domain
    if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
        // Optional: You can hardcode a tenant for testing by uncommenting below:
        // hostname = "shopgiay.local"; 

        // Default to main domain
        if (!hostname.endsWith(".local")) {
            hostname = "geekgolfers.com";
        }
    }

    // Remove port if present
    hostname = hostname.split(":")[0];

    const searchParams = req.nextUrl.searchParams.toString();
    // Get the pathname of the request (e.g. /, /about, /blog/first-post)
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""
        }`;

    // APP_DOMAIN: The domain of your main application
    const APP_DOMAIN = "geekgolfers.com";

    // CASE 1: Main Domain (Your SaaS landing page & Admin Dashboard)
    // If the hostname matches the main domain (or www subdomain)
    if (hostname === APP_DOMAIN || hostname === `www.${APP_DOMAIN}`) {
        // We don't need to rewrite anything, just let Next.js handle the routing normally
        // This will match routes in app/(main) if we set up the folder structure that way,
        // or just root app files if we don't.
        // However, to be cleaner, we can rewrite to /home or similar if desired, 
        // but usually cleaner to structure app/(main) and allow transparent routing.
        return NextResponse.next();
    }

    // CASE 2: Tenant Domain (shopgiay.com, hatdieu.com...)
    // Rewrite the URL to the /sites/[domain] dynamic route

    // This logic tells Next.js: "When user visits shopgiay.com/products",
    // actually render the content at "/sites/shopgiay.com/products"
    // but keep the URL in the browser bar as "shopgiay.com/products"

    return NextResponse.rewrite(
        new URL(`/sites/${hostname}${path}`, req.url)
    );
}
