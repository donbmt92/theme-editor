import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    if (!domain) {
        return new NextResponse("Domain not specified", { status: 400 });
    }

    // Allow the main domain
    if (domain === "xnkvietnam.com" || domain === "www.xnkvietnam.com" || domain.endsWith(".xnkvietnam.com")) {
        return new NextResponse("Allowed", { status: 200 });
    }

    // Check if domain exists in Project database
    const project = await prisma.project.findFirst({
        where: {
            OR: [
                { customDomain: domain },
                { subdomain: domain.split('.')[0] } // simplistic check, careful with false positives if domain is full domain
            ]
        },
        select: { id: true }
    });

    if (project) {
        return new NextResponse("Allowed", { status: 200 });
    }

    return new NextResponse("Forbidden", { status: 403 });
}
