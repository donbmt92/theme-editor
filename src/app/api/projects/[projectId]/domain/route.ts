import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { projectId } = await params;

        // Verify ownership
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                userId: session.user.id,
            }
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Remove domain
        await prisma.project.update({
            where: { id: projectId },
            data: {
                customDomain: null,
            }
        });

        return NextResponse.json({
            success: true,
            message: "Domain removed successfully",
        });
    } catch (error) {
        console.error("[API] Failed to remove domain:", error);
        return NextResponse.json(
            { error: "Failed to remove domain" },
            { status: 500 }
        );
    }
}
