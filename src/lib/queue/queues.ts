import { Queue } from "bullmq";
import { redisConnection, queueConfig } from "./config";

// Deploy Queue
export const deployQueue = new Queue("deploy", {
    connection: redisConnection,
    defaultJobOptions: {
        ...queueConfig.defaultJobOptions,
        // timeout: 10 * 60 * 1000, // 10 minutes max
    },
});

// AI Generation Queue
export const aiQueue = new Queue("ai-generation", {
    connection: redisConnection,
    defaultJobOptions: {
        ...queueConfig.defaultJobOptions,
        // timeout: 2 * 60 * 1000, // 2 minutes max
    },
});

// Export Queue (if needed later)
export const exportQueue = new Queue("export", {
    connection: redisConnection,
    defaultJobOptions: {
        ...queueConfig.defaultJobOptions,
        // timeout: 5 * 60 * 1000, // 5 minutes max
    },
});
