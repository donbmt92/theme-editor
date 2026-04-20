'use client'

import { useJobStatus } from '@/hooks/useJobStatus'
import { Progress } from '@/components/ui/progress'

export function DeployProgress({ jobId }: { jobId: string }) {
    const { status, loading } = useJobStatus(jobId)

    if (loading && !status) {
        return <div>Loading job status...</div>
    }

    if (!status) {
        return <div>Waiting for job to start...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <span className="font-medium">
                    {status.state === 'completed' ? '✅ Completed' :
                        status.state === 'failed' ? '❌ Failed' :
                            status.state === 'active' ? '⚙️ Processing' :
                                '⏳ Waiting'}
                </span>
                <span className="text-sm text-gray-600">
                    {status.progress?.percentage || 0}%
                </span>
            </div>

            {/* Assuming Progress component takes value (0-100) */}
            <Progress value={status.progress?.percentage || 0} />

            <p className="text-sm text-gray-600">
                {status.progress?.message || 'Queued...'}
            </p>

            {status.state === 'failed' && (
                <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
                    Error: {status.error}
                </div>
            )}

            {status.state === 'completed' && status.result && (
                <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
                    ✅ Deployed {status.result.fileCount} files in {status.result.deployTime}ms
                </div>
            )}
        </div>
    )
}
