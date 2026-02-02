import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return false;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    return user?.role === 'ADMIN';
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { userId } = await params;
        const { newPassword } = await request.json();

        // Generate random password if not provided
        const password = newPassword || Math.random().toString(36).slice(-8);
        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash }
        });

        return NextResponse.json({
            success: true,
            message: "Password reset successfully",
            temporaryPassword: password // Return so admin can share with user
        });
    } catch (error) {
        console.error("[ADMIN] Failed to reset password:", error);
        return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
    }
}
