import { Worker, Job } from "bullmq";
import { redisConnection } from "../config";
import { AIJobData, AIJobResult } from "../types";
import { generateThemeContent } from "@/lib/generate-theme-core";

export const aiWorker = new Worker<AIJobData, AIJobResult>(
    "ai-generation",
    async (job: Job<AIJobData>) => {
        console.log(`🤖 [WORKER] Starting AI job ${job.id}`);

        try {
            await job.updateProgress({
                percentage: 10,
                message: "Sending request to AI...",
            });

            // Your existing AI generation logic
            let content;
            if (job.data.type === 'theme') {
                content = await generateThemeContent(job.data.businessInfo);
            } else {
                throw new Error(`Unsupported AI generation type: ${job.data.type}`);
            }

            await job.updateProgress({
                percentage: 100,
                message: "AI generation completed!",
            });

            return {
                success: true,
                content,
            };
        } catch (error) {
            console.error(`❌ [WORKER] AI job ${job.id} failed:`, error);
            throw error;
        }
    },
    {
        connection: redisConnection,
        concurrency: 5, // 5 AI requests simultaneously
        limiter: {
            max: 20,
            duration: 60000, // Max 20 requests per minute (API limits)
        },
    },
);
