import { NextRequest, NextResponse } from "next/server";
import { deployQueue } from "@/lib/queue/queues";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get recent jobs for this user
        const [completedDeploys, failedDeploys, activeDeploys] = await Promise.all([
            deployQueue.getCompleted(0, 9), // Last 10 completed
            deployQueue.getFailed(0, 9), // Last 10 failed
            deployQueue.getActive(0, 9), // Current active
        ]);

        const jobs = [...completedDeploys, ...failedDeploys, ...activeDeploys]
            .filter((job) => job.data.userId === session.user.id)
            .map((job) => ({
                id: job.id,
                name: job.name,
                state: job.getState(),
                data: job.data,
                progress: job.progress,
                timestamp: job.timestamp,
            }));

        return NextResponse.json({ success: true, jobs });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch jobs" },
            { status: 500 },
        );
    }
}
