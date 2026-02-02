import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const domain = searchParams.get('domain');
        const projectId = searchParams.get('projectId');

        if (!domain) {
            return NextResponse.json({ error: "Domain is required" }, { status: 400 });
        }

        // Find if domain is used by another project
        const existingProject = await prisma.project.findFirst({
            where: {
                customDomain: domain.toLowerCase().trim(),
                NOT: projectId ? { id: projectId } : undefined,
            },
            select: {
                id: true,
                name: true,
            }
        });

        if (existingProject) {
            return NextResponse.json({
                available: false,
                usedBy: existingProject.name,
            });
        }

        return NextResponse.json({
            available: true,
        });
    } catch (error) {
        console.error("[API] Failed to check domain availability:", error);
        return NextResponse.json(
            { error: "Failed to check domain" },
            { status: 500 }
        );
    }
}
