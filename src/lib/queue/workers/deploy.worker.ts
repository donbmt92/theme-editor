import { Worker, Job } from "bullmq";
import { redisConnection } from "../config";
import { DeployJobData, DeployJobResult, JobProgress } from "../types";
import { prisma } from "@/lib/prisma";

export const deployWorker = new Worker<DeployJobData, DeployJobResult>(
    "deploy",
    async (job: Job<DeployJobData>) => {
        console.log(`🚀 [WORKER] Starting deploy job ${job.id}`);

        try {
            // Update progress: Starting
            await job.updateProgress({
                percentage: 0,
                message: "Initializing deployment...",
                stage: "init",
            } as JobProgress);

            const { projectId, userId, themeParams, projectName, description } = job.data;

            // Save version snapshot to database
            await job.updateProgress({
                percentage: 30,
                message: "Saving version snapshot...",
                stage: "snapshot",
            } as JobProgress);

            const project = await prisma.project.findUnique({
                where: { id: projectId },
                include: {
                    versions: {
                        orderBy: { versionNumber: 'desc' },
                        take: 1
                    }
                }
            });

            if (!project) {
                throw new Error(`Project ${projectId} not found`);
            }

            const latestVersionNumber = project.versions[0]?.versionNumber || 0;
            const newVersionNumber = latestVersionNumber + 1;

            // Create new version with theme params as snapshot
            const version = await prisma.projectVersion.create({
                data: {
                    projectId,
                    versionNumber: newVersionNumber,
                    snapshot: themeParams, // Store theme params as snapshot
                }
            });

            console.log(`✅ [WORKER] Created version ${version.versionNumber} for project ${projectId}`);

            await job.updateProgress({
                percentage: 100,
                message: "Deployment completed!",
                stage: "done",
            } as JobProgress);

            console.log(`✅ [WORKER] Deploy job ${job.id} completed`);

            return {
                success: true,
                projectId,
                versionNumber: newVersionNumber,
                domain: job.data.domain,
                message: "Deployment successful. Domain will be configured shortly.",
            };
        } catch (error: any) {
            console.error(`❌ [WORKER] Deploy job ${job.id} failed:`, error);
            throw error; // BullMQ will handle retries
        }
    },
    {
        connection: redisConnection,
        concurrency: 3, // Process 3 deploys simultaneously
        limiter: {
            max: 10,
            duration: 60000, // Max 10 jobs per minute
        },
    },
);

// Event listeners
deployWorker.on("completed", (job) => {
    console.log(`✅ Deploy job ${job.id} completed`);
});

deployWorker.on("failed", (job, err) => {
    console.error(`❌ Deploy job ${job?.id} failed:`, err.message);
});

deployWorker.on("progress", (job, progress) => {
    console.log(`📊 Deploy job ${job.id}: ${(progress as JobProgress).message}`);
});
