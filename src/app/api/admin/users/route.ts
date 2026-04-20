import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Middleware to check admin role
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

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                tier: true,
                createdAt: true,
                _count: {
                    select: { projects: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error("[ADMIN] Failed to fetch users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { userId, role, tier } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const updateData: Record<string, string> = {};
        if (role) updateData.role = role;
        if (tier) updateData.tier = tier;

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, email: true, role: true, tier: true }
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("[ADMIN] Failed to update user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
