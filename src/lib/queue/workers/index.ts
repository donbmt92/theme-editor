import { deployWorker } from "./deploy.worker";
import { aiWorker } from "./ai.worker";

// Start all workers
export function startWorkers() {
    console.log("🚀 Starting BullMQ workers...");

    // Workers auto-start when imported
    // Just log confirmation
    console.log("✅ Deploy worker started");
    console.log("✅ AI worker started");
}

// Graceful shutdown
export async function stopWorkers() {
    console.log("🛑 Stopping workers...");

    await Promise.all([deployWorker.close(), aiWorker.close()]);

    console.log("✅ All workers stopped");
}

// Handle shutdown signals
process.on("SIGTERM", stopWorkers);
process.on("SIGINT", stopWorkers);
