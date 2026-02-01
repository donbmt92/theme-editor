import { Worker, Job } from "bullmq";
import { redisConnection } from "../config";
import { DeployJobData, DeployJobResult, JobProgress } from "../types";
import { DeployProcessor } from "@/app/api/deploy-project/deploy-processor";

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

            // Create processor
            const processor = new DeployProcessor({
                deployData: job.data,
                userId: job.data.userId,
                projectId: job.data.projectId,
                startTime: Date.now(),
            });

            // Hook into processor progress (if available) - For now, manually update stages
            await job.updateProgress({
                percentage: 20,
                message: "Generating file manifest...",
                stage: "manifest",
            } as JobProgress);

            // Process deployment
            const result = await processor.process();

            await job.updateProgress({
                percentage: 100,
                message: "Deployment completed!",
                stage: "done",
            } as JobProgress);

            console.log(`✅ [WORKER] Deploy job ${job.id} completed`);
            return result;
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
