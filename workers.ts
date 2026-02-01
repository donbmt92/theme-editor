import { startWorkers } from "@/lib/queue/workers";

console.log("🚀 Starting BullMQ worker process...");
startWorkers();

console.log("✅ Workers ready and listening for jobs");
