import { ConnectionOptions } from "bullmq";

export const redisConnection: ConnectionOptions = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null, // Required for BullMQ
    enableReadyCheck: false,
};

export const queueConfig = {
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential" as const,
            delay: 5000, // 5s, 25s, 125s
        },
        removeOnComplete: {
            count: 100, // Keep last 100 completed jobs
            age: 24 * 3600, // 24 hours
        },
        removeOnFail: {
            count: 500, // Keep last 500 failed jobs for debugging
        },
    },
};
