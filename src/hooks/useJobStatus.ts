import { useState, useEffect, useCallback } from "react";

interface JobStatus {
    id: string;
    state: "waiting" | "active" | "completed" | "failed";
    progress: { percentage: number; message: string } | null;
    result: any;
    error: string | null;
}

export function useJobStatus(jobId: string | null, pollInterval = 2000) {
    const [status, setStatus] = useState<JobStatus | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchStatus = useCallback(async () => {
        if (!jobId) return false;

        try {
            const res = await fetch(`/api/jobs/${jobId}`);
            const data = await res.json();

            if (data.success) {
                setStatus(data.job);

                // Stop polling if job is done
                if (data.job.state === "completed" || data.job.state === "failed") {
                    return true; // Signal to stop polling
                }
            }
        } catch (error) {
            console.error("Failed to fetch job status:", error);
        }

        return false; // Continue polling
    }, [jobId]);

    useEffect(() => {
        if (!jobId) return;

        setLoading(true);
        fetchStatus().then((shouldStop) => {
            setLoading(false);
            if (shouldStop) return;
        });

        // Poll every 2 seconds
        const interval = setInterval(async () => {
            const shouldStop = await fetchStatus();
            if (shouldStop) {
                clearInterval(interval);
            }
        }, pollInterval);

        return () => clearInterval(interval);
    }, [jobId, pollInterval, fetchStatus]);

    return { status, loading };
}
