import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return false;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    return user?.role === 'ADMIN';
}

export async function GET() {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const projects = await prisma.project.findMany({
            select: {
                id: true,
                name: true,
                customDomain: true,
                subdomain: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: { id: true, name: true, email: true }
                },
                _count: {
                    select: { versions: true }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json({ projects });
    } catch (error) {
        console.error("[ADMIN] Failed to fetch projects:", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { projectId } = await request.json();

        if (!projectId) {
            return NextResponse.json({ error: "Project ID required" }, { status: 400 });
        }

        // Delete versions first
        await prisma.projectVersion.deleteMany({
            where: { projectId }
        });

        // Delete project
        await prisma.project.delete({
            where: { id: projectId }
        });

        return NextResponse.json({ success: true, message: "Project deleted" });
    } catch (error) {
        console.error("[ADMIN] Failed to delete project:", error);
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}
