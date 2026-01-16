'use client'

import React, { useState } from 'react'
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
import { Loader2, CheckCircle, AlertCircle, Github, ExternalLink } from 'lucide-react'
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
    const [isExporting, setIsExporting] = useState(false)
    const [exportStatus, setExportStatus] = useState<'idle' | 'github' | 'vercel' | 'success' | 'error'>('idle')
    const [githubUrl, setGithubUrl] = useState('')
    const [vercelUrl, setVercelUrl] = useState('')
    const [error, setError] = useState('')
    const [logs, setLogs] = useState<string[]>([])

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
    }

    const handleExport = async () => {
        if (!session?.user?.id) {
            setError('You must be logged in to export')
            return
        }

        setIsExporting(true)
        setExportStatus('github')
        setError('')
        setLogs([])
        setGithubUrl('')
        setVercelUrl('')

        try {
            // Step 1: Create GitHub repo
            addLog('🚀 Creating GitHub repository...')

            const githubResponse = await fetch('/api/github/create-repo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectName: projectName.toLowerCase().replace(/\s+/g, '-'),
                    description: description || `${projectName} - Built with Theme Editor`,
                    themeName,
                    themeParams,
                    userId: session.user.id,
                    isPrivate: false,
                }),
            })

            const githubData = await githubResponse.json()

            if (!githubData.success) {
                throw new Error(githubData.error || 'Failed to create GitHub repository')
            }

            setGithubUrl(githubData.github.repoUrl)
            addLog(`✅ GitHub repository created: ${githubData.github.repoName}`)
            addLog(`📦 Pushed ${githubData.fileCount} files`)

            // Step 2: Deploy to Vercel
            setExportStatus('vercel')
            addLog('🚀 Deploying to Vercel...')

            const vercelResponse = await fetch('/api/vercel/deploy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    repoFullName: githubData.github.repoFullName,
                    projectName: projectName.toLowerCase().replace(/\s+/g, '-'),
                }),
            })

            const vercelData = await vercelResponse.json()

            if (!vercelData.success) {
                throw new Error(vercelData.error || 'Failed to deploy to Vercel')
            }

            setVercelUrl(vercelData.vercel.deploymentUrl)
            addLog(`✅ Deployed to Vercel: ${vercelData.vercel.deploymentUrl}`)
            addLog('🎉 Export completed successfully!')

            setExportStatus('success')

        } catch (err: any) {
            console.error('Export error:', err)
            setError(err.message || 'Export failed')
            setExportStatus('error')
            addLog(`❌ Error: ${err.message}`)
        } finally {
            setIsExporting(false)
        }
    }

    const resetDialog = () => {
        setDescription('')
        setExportStatus('idle')
        setGithubUrl('')
        setVercelUrl('')
        setError('')
        setLogs([])
    }

    const handleClose = () => {
        if (!isExporting) {
            resetDialog()
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Export to GitHub & Vercel</DialogTitle>
                    <DialogDescription>
                        Export your project as a Next.js application, deploy to GitHub, and publish to Vercel
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Configuration */}
                    {exportStatus === 'idle' && (
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
                                    Description (Optional)
                                </label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter a description for your project..."
                                    rows={3}
                                />
                            </div>

                            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                                <CardContent className="pt-6">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        <strong>What will happen:</strong>
                                        <br />
                                        1. Create a GitHub repository with your project code (34 files)
                                        <br />
                                        2. Deploy to Vercel and get a live website URL
                                        <br />
                                        3. Build time: ~1-2 minutes
                                    </p>
                                </CardContent>
                            </Card>

                            <Button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="w-full"
                                size="lg"
                            >
                                {isExporting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <Github className="mr-2 h-4 w-4" />
                                        Export to GitHub & Vercel
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Progress */}
                    {(exportStatus === 'github' || exportStatus === 'vercel') && (
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        {exportStatus === 'github' ? 'Creating GitHub Repository...' : 'Deploying to Vercel...'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            {exportStatus === 'github' ? (
                                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                            ) : (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            )}
                                            <span className="text-sm">GitHub Repository</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {exportStatus === 'vercel' ? (
                                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                            ) : (
                                                <div className="h-4 w-4 rounded-full border-2 border-muted" />
                                            )}
                                            <span className="text-sm">Vercel Deployment</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Logs */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Export Logs</CardTitle>
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
                    {exportStatus === 'success' && (
                        <div className="space-y-4">
                            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                                        <CheckCircle className="h-5 w-5" />
                                        Export Successful!
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">GitHub Repository</label>
                                        <div className="flex gap-2">
                                            <Input value={githubUrl} readOnly className="flex-1" />
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => window.open(githubUrl, '_blank')}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Live Website</label>
                                        <div className="flex gap-2">
                                            <Input value={vercelUrl} readOnly className="flex-1" />
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => window.open(vercelUrl, '_blank')}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            ⏳ <strong>Note:</strong> Vercel build takes 1-2 minutes.
                                            The website will be live shortly!
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex gap-2">
                                <Button onClick={handleClose} variant="outline" className="flex-1">
                                    Close
                                </Button>
                                <Button
                                    onClick={() => window.open(vercelUrl, '_blank')}
                                    className="flex-1"
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Open Website
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {exportStatus === 'error' && (
                        <div className="space-y-4">
                            <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                                        <AlertCircle className="h-5 w-5" />
                                        Export Failed
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
        </Dialog>
    )
}

export default ReactExportDialog
