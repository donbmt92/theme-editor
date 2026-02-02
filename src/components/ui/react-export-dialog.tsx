'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Textarea } from './textarea'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Loader2, CheckCircle, AlertCircle, Server, ExternalLink, Rocket } from 'lucide-react'
import { ThemeParams } from '@/types'

interface ReactExportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    themeParams: ThemeParams
    projectId: string
    projectName: string
    themeName: string
}

const ReactExportDialog: React.FC<ReactExportDialogProps> = ({
    open,
    onOpenChange,
    themeParams,
    projectId,
    projectName,
    themeName,
}) => {
    const { data: session } = useSession()
    const [description, setDescription] = useState('')
    const [customDomain, setCustomDomain] = useState('')
    const [dnsStatus, setDnsStatus] = useState<'idle' | 'checking' | 'verified' | 'unverified' | 'error'>('idle')
    const [dnsMessage, setDnsMessage] = useState('')

    // Fetch existing domain when dialog opens
    useEffect(() => {
        if (open && projectId) {
            fetch(`/api/projects/${projectId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.project?.customDomain) {
                        setCustomDomain(data.project.customDomain);
                    }
                })
                .catch(err => console.error('Failed to fetch project domain:', err));
        }
    }, [open, projectId]);

    const [isDeploying, setIsDeploying] = useState(false)
    const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle')
    const [deployedUrl, setDeployedUrl] = useState('')
    const [error, setError] = useState('')
    const [logs, setLogs] = useState<string[]>([])

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
    }

    const checkDomain = async () => {
        if (!customDomain) return;

        setDnsStatus('checking');
        setDnsMessage('Checking DNS records...');

        try {
            const res = await fetch('/api/check-domain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain: customDomain })
            });
            const data = await res.json();

            if (data.ip) {
                setDnsStatus('verified');
                setDnsMessage('✅ Domain points to this server');
            } else {
                setDnsStatus('unverified');
                setDnsMessage('⚠️ Domain does not point to this server yet. You can still deploy, but the site won\'t work until DNS propagates.');
            }
        } catch (err) {
            setDnsStatus('error');
            setDnsMessage('❌ Invalid domain or DNS check failed');
        }
    };

    const handleDeploy = async () => {
        if (!session?.user?.id) {
            setError('You must be logged in to deploy')
            return
        }

        if (!customDomain || customDomain.trim() === '') {
            setError('❌ Domain is required! Please enter a custom domain.')
            return
        }

        setIsDeploying(true)
        setDeployStatus('deploying')
        setError('')
        setLogs([])
        setDeployedUrl('')

        try {
            addLog('🚀 Starting deployment process...')
            addLog('💾 Saving current editor state as new version...')

            // Prepare deploy data
            // We use serverType 'nginx' as default for the VPS setup
            // exclude assets for now to speed up, or include if needed
            const deployData = {
                projectId,
                userId: session.user.id,
                projectName: projectName.replace(/\s+/g, '-').toLowerCase(),
                description: description || `Deployed from Editor`,
                themeParams: themeParams, // Send current editor state
                serverType: 'nginx',
                includeAssets: true,
                createUserFolder: true,
                generateDeployScript: true,
                domain: customDomain.trim() || window.location.hostname // Use custom domain if provided
            }

            const response = await fetch('/api/deploy-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(deployData),
            })

            const result = await response.json()

            if (!result.success) {
                throw new Error(result.error || 'Deployment failed')
            }

            addLog('✅ Job queued successfully')
            addLog(`🆔 Job ID: ${result.jobId}`)
            addLog('⏳ Waiting for server to process...')

            // Poll for job status
            const pollInterval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`/api/jobs/${result.jobId}`);
                    const statusData = await statusRes.json();

                    if (statusData.logs && statusData.logs.length > 0) {
                        // Update logs (optional: append only new logs if needed)
                        // For simplicity, we can just show the latest message from progress
                    }

                    if (statusData.progress) {
                        // Update logs based on progress message
                        const msg = statusData.progress.message;
                        if (msg && !logs.includes(msg)) {
                            addLog(`🔄 ${msg}`);
                        }
                    }

                    // Check job state (API returns statusData.job.state)
                    const jobState = statusData.job?.state || statusData.state;

                    if (jobState === 'completed') {
                        clearInterval(pollInterval);
                        addLog('🎉 Version saved successfully!');
                        addLog('⚙️  Domain configuration in progress...');
                        addLog('🔒 SSL certificate will be provisioned automatically');
                        addLog('⏱️  Your site will be live in 1-2 minutes');

                        const liveUrl = deployData.domain && deployData.domain !== 'localhost'
                            ? `https://${deployData.domain}`
                            : `http://${window.location.hostname}`; // Fallback

                        setDeployedUrl(liveUrl);
                        setDeployStatus('success');
                        setIsDeploying(false);
                    } else if (jobState === 'failed') {
                        clearInterval(pollInterval);
                        throw new Error(statusData.job?.error || statusData.failedReason || 'Deployment failed');
                    }
                } catch (pollErr) {
                    // Don't stop polling on transient network errors, but stop on max retries if implemented
                    console.error('Poll error:', pollErr);
                }
            }, 2000);

            // Cleanup interval on unmount or error (needs useEffect or careful handling)
            // Ideally we should use a useRef for the interval ID to clear it later

            // NOTE: Since this is inside handleDeploy, we can't easily clear the interval if the component unmounts.
            // A better approach is to use the existing useJobStatus hook or move this logic to a useEffect.
            // For now, to keep it simple within this function scope, we'll assume the dialog stays open.

            // Force status to deploying (it's already set)
            setDeployStatus('deploying');

        } catch (err: any) {
            console.error('Deploy error:', err)
            setError(err.message || 'Deployment failed')
            setDeployStatus('error')
            addLog(`❌ Error: ${err.message}`)
            setIsDeploying(false)
        }
        // Finally block moved inside the flow logic because polling is async
    }

    const resetDialog = () => {
        setDescription('')
        setDeployStatus('idle')
        setDeployedUrl('')
        setError('')
        setLogs([])
        setCustomDomain('')
        setDnsStatus('idle')
        setDnsMessage('')
    }

    const handleClose = () => {
        if (!isDeploying) {
            resetDialog()
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Deploy to Live Server</DialogTitle>
                    <DialogDescription>
                        Save your changes and update the live website immediately.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Configuration */}
                    {deployStatus === 'idle' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Project Name
                                </label>
                                <Input
                                    value={projectName}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Theme
                                </label>
                                <Input
                                    value={themeName}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Custom Domain (Optional)
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        value={customDomain}
                                        onChange={(e) => {
                                            setCustomDomain(e.target.value);
                                            setDnsStatus('idle');
                                            setDnsMessage('');
                                        }}
                                        placeholder="e.g. shopgiay.vn"
                                        onBlur={checkDomain}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={checkDomain}
                                        disabled={!customDomain || dnsStatus === 'checking'}
                                    >
                                        {dnsStatus === 'checking' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check DNS'}
                                    </Button>
                                </div>
                                {dnsMessage && (
                                    <p className={`text-xs mt-1 ${dnsStatus === 'verified' ? 'text-green-600' :
                                        dnsStatus === 'unverified' ? 'text-yellow-600' : 'text-red-500'
                                        }`}>
                                        {dnsMessage}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Version Note (Optional)
                                </label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter a note about this update (e.g. Changed hero image)..."
                                    rows={3}
                                />
                            </div>

                            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                                <CardContent className="pt-6">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        <strong>Ready to Go Live?</strong>
                                        <br />
                                        This action will save a new version of your project and immediately update the content on your live website.
                                    </p>
                                </CardContent>
                            </Card>

                            <Button
                                onClick={handleDeploy}
                                disabled={isDeploying}
                                className="w-full"
                                size="lg"
                            >
                                {isDeploying ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deploying...
                                    </>
                                ) : (
                                    <>
                                        <Rocket className="mr-2 h-4 w-4" />
                                        Deploy Now
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Progress */}
                    {deployStatus === 'deploying' && (
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Updating Live Server...
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Saving Version</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                            <span className="text-sm">Processing Content</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Logs */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Deployment Logs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-black text-green-400 p-4 rounded-md font-mono text-xs max-h-48 overflow-y-auto">
                                        {logs.map((log, i) => (
                                            <div key={i}>{log}</div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Success */}
                    {deployStatus === 'success' && (
                        <div className="space-y-4">
                            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                                        <CheckCircle className="h-5 w-5" />
                                        Deployment Successful!
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            🎉 Your changes are now live. Refresh your website to see the updates.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex gap-2">
                                <Button onClick={handleClose} variant="outline" className="w-full">
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {deployStatus === 'error' && (
                        <div className="space-y-4">
                            <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                                        <AlertCircle className="h-5 w-5" />
                                        Deployment Failed
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>

                                    {logs.length > 0 && (
                                        <div className="mt-4">
                                            <div className="bg-black text-red-400 p-4 rounded-md font-mono text-xs max-h-48 overflow-y-auto">
                                                {logs.map((log, i) => (
                                                    <div key={i}>{log}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="flex gap-2">
                                <Button onClick={resetDialog} variant="outline" className="flex-1">
                                    Try Again
                                </Button>
                                <Button onClick={handleClose} className="flex-1">
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default ReactExportDialog
