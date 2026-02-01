import { NextRequest, NextResponse } from "next/server";
import { deployQueue, aiQueue } from "@/lib/queue/queues";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ jobId: string }> } // Params is a Promise in Next.js 15+
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { jobId } = await params;

        // Try to find job in deploy queue
        let job = await deployQueue.getJob(jobId);
        let queueName = "deploy";

        // If not found, try AI queue
        if (!job) {
            job = await aiQueue.getJob(jobId);
            queueName = "ai-generation";
        }

        if (!job) {
            return NextResponse.json(
                { success: false, error: "Job not found" },
                { status: 404 },
            );
        }

        // Get job state
        const state = await job.getState();
        const progress = job.progress;
        const result = job.returnvalue;
        const failedReason = job.failedReason;

        return NextResponse.json({
            success: true,
            job: {
                id: job.id,
                name: job.name,
                queue: queueName,
                state, // waiting, active, completed, failed, delayed
                progress,
                result,
                error: failedReason,
                attemptsMade: job.attemptsMade,
                timestamp: job.timestamp,
                processedOn: job.processedOn,
                finishedOn: job.finishedOn,
            },
        });
    } catch (error) {
        console.error("[API] Failed to get job status:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch job status" },
            { status: 500 },
        );
    }
}
