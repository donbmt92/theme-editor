'use client'

import React, { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Textarea } from './textarea'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Download, Github, Globe, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { ThemeParams } from '@/types'

interface ExportOptions {
  projectName: string
  description: string
  framework: 'react' | 'nextjs'
  typescript: boolean
  cssFramework: 'tailwind' | 'styled-components' | 'css-modules'
  includeAssets: boolean
  createGitHubRepo: boolean
  deployToVercel: boolean
  gitHubRepoName: string
  gitHubRepoPrivate: boolean
}

interface ExportProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  themeParams: ThemeParams
  projectId: string
  projectName: string
}

const ExportProjectDialog: React.FC<ExportProjectDialogProps> = ({
  open,
  onOpenChange,
  themeParams,
  projectId,
  projectName
}) => {
  const [options, setOptions] = useState<ExportOptions>({
    projectName: projectName || 'my-react-app',
    description: 'Exported from Theme Editor',
    framework: 'react',
    typescript: true,
    cssFramework: 'tailwind',
    includeAssets: true,
    createGitHubRepo: false,
    deployToVercel: false,
    gitHubRepoName: (projectName || 'my-react-app').toLowerCase().replace(/\s+/g, '-'),
    gitHubRepoPrivate: false
  })
  
  const [step, setStep] = useState<'options' | 'exporting' | 'success' | 'error'>('options')
  const [exportProgress, setExportProgress] = useState<{
    downloadUrl?: string
    gitHubRepoUrl?: string
    vercelUrl?: string
    error?: string
    logs: string[]
  }>({
    logs: []
  })

  const updateOption = <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const addLog = (message: string) => {
    setExportProgress(prev => ({
      ...prev,
      logs: [...prev.logs, `${new Date().toLocaleTimeString()}: ${message}`]
    }))
  }

  const startExport = async () => {
    setStep('exporting')
    setExportProgress({ logs: [] })
    
    try {
      addLog('🚀 Bắt đầu xuất project...')
      
      // Step 1: Export ReactJS project
      addLog('📦 Tạo ReactJS project từ theme...')
      const exportResponse = await fetch('/api/export-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId,
          projectName: options.projectName,
          description: options.description,
          framework: options.framework,
          typescript: options.typescript,
          cssFramework: options.cssFramework,
          includeAssets: options.includeAssets,
          createGitHubRepo: options.createGitHubRepo,
          githubRepoName: options.gitHubRepoName,
          githubPrivate: options.gitHubRepoPrivate,
          deployToVercel: options.deployToVercel,
          themeParams
        })
      })

      if (!exportResponse.ok) {
        throw new Error('Không thể xuất project')
      }

      const exportResult = await exportResponse.json()
      addLog('✅ Tạo ReactJS project thành công!')
      
      setExportProgress(prev => ({
        ...prev,
        downloadUrl: exportResult.downloadUrl
      }))

      // Step 2: Create GitHub repository (if requested)
      if (options.createGitHubRepo) {
        addLog('🐙 Tạo GitHub repository...')
        
        const githubResponse = await fetch('/api/create-github-repo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            projectId,
            repoName: options.gitHubRepoName,
            description: options.description,
            private: options.gitHubRepoPrivate,
            projectFiles: exportResult.projectFiles
          })
        })

        if (!githubResponse.ok) {
          throw new Error('Không thể tạo GitHub repository')
        }

        const githubResult = await githubResponse.json()
        addLog('✅ Tạo GitHub repository thành công!')
        
        setExportProgress(prev => ({
          ...prev,
          gitHubRepoUrl: githubResult.repoUrl
        }))

        // Step 3: Deploy to Vercel (if requested)
        if (options.deployToVercel) {
          addLog('🌐 Deploy lên Vercel...')
          
          const vercelResponse = await fetch('/api/deploy-vercel', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              projectId,
              repoUrl: githubResult.repoUrl,
              projectName: options.projectName,
              framework: options.framework
            })
          })

          if (!vercelResponse.ok) {
            throw new Error('Không thể deploy lên Vercel')
          }

          const vercelResult = await vercelResponse.json()
          addLog('✅ Deploy lên Vercel thành công!')
          
          setExportProgress(prev => ({
            ...prev,
            vercelUrl: vercelResult.deploymentUrl
          }))
        }
      }

      addLog('🎉 Hoàn thành tất cả các bước!')
      setStep('success')
      
    } catch (error) {
      console.error('Export error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra'
      addLog(`❌ Lỗi: ${errorMessage}`)
      setExportProgress(prev => ({
        ...prev,
        error: errorMessage
      }))
      setStep('error')
    }
  }

  const resetDialog = () => {
    setStep('options')
    setExportProgress({ logs: [] })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        {step === 'options' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600" />
                Xuất Project ReactJS
              </DialogTitle>
              <DialogDescription>
                Xuất project thành ứng dụng ReactJS hoàn chỉnh, tạo GitHub repo và deploy lên Vercel
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cài đặt cơ bản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tên project</label>
                    <Input
                      value={options.projectName}
                      onChange={(e) => updateOption('projectName', e.target.value)}
                      placeholder="my-awesome-project"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Mô tả</label>
                    <Textarea
                      value={options.description}
                      onChange={(e) => updateOption('description', e.target.value)}
                      placeholder="Mô tả ngắn về project của bạn"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Framework</label>
                      <select
                        value={options.framework}
                        onChange={(e) => updateOption('framework', e.target.value as 'react' | 'nextjs')}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="react">React + Vite</option>
                        <option value="nextjs">Next.js</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">CSS Framework</label>
                      <select
                        value={options.cssFramework}
                        onChange={(e) => updateOption('cssFramework', e.target.value as any)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="tailwind">Tailwind CSS</option>
                        <option value="styled-components">Styled Components</option>
                        <option value="css-modules">CSS Modules</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={options.typescript}
                        onChange={(e) => updateOption('typescript', e.target.checked)}
                        className="mr-2"
                      />
                      TypeScript
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={options.includeAssets}
                        onChange={(e) => updateOption('includeAssets', e.target.checked)}
                        className="mr-2"
                      />
                      Bao gồm assets (ảnh, fonts)
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* GitHub Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    GitHub Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.createGitHubRepo}
                      onChange={(e) => updateOption('createGitHubRepo', e.target.checked)}
                      className="mr-2"
                    />
                    Tạo GitHub repository
                  </label>

                  {options.createGitHubRepo && (
                    <div className="space-y-3 ml-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tên repository</label>
                        <Input
                          value={options.gitHubRepoName}
                          onChange={(e) => updateOption('gitHubRepoName', e.target.value)}
                          placeholder="my-awesome-project"
                        />
                      </div>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={options.gitHubRepoPrivate}
                          onChange={(e) => updateOption('gitHubRepoPrivate', e.target.checked)}
                          className="mr-2"
                        />
                        Repository riêng tư
                      </label>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Vercel Deployment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Vercel Deployment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.deployToVercel}
                      onChange={(e) => updateOption('deployToVercel', e.target.checked)}
                      disabled={!options.createGitHubRepo}
                      className="mr-2"
                    />
                    Deploy lên Vercel
                    {!options.createGitHubRepo && (
                      <span className="text-sm text-gray-500 ml-2">(Cần GitHub repo)</span>
                    )}
                  </label>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button onClick={startExport} className="bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                Bắt đầu xuất file
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'exporting' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                Đang xuất project...
              </DialogTitle>
              <DialogDescription>
                Vui lòng đợi trong khi chúng tôi tạo project của bạn
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tiến trình</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {exportProgress.logs.map((log, index) => (
                      <div key={index} className="text-sm font-mono bg-gray-100 p-2 rounded">
                        {log}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Xuất project thành công!
              </DialogTitle>
              <DialogDescription>
                Project của bạn đã được tạo thành công
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kết quả</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {exportProgress.downloadUrl && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Project Files</p>
                        <p className="text-sm text-gray-600">Tải xuống file ZIP</p>
                      </div>
                      <Button asChild size="sm">
                        <a href={exportProgress.downloadUrl} download>
                          <Download className="mr-2 h-4 w-4" />
                          Tải xuống
                        </a>
                      </Button>
                    </div>
                  )}

                  {exportProgress.gitHubRepoUrl && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">GitHub Repository</p>
                        <p className="text-sm text-gray-600">Source code đã được push</p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <a href={exportProgress.gitHubRepoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          Xem repo
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  )}

                  {exportProgress.vercelUrl && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Live Website</p>
                        <p className="text-sm text-gray-600">Deployed lên Vercel</p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <a href={exportProgress.vercelUrl} target="_blank" rel="noopener noreferrer">
                          <Globe className="mr-2 h-4 w-4" />
                          Xem website
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Logs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chi tiết</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {exportProgress.logs.map((log, index) => (
                      <div key={index} className="text-sm font-mono bg-gray-100 p-2 rounded">
                        {log}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>
                Hoàn thành
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'error' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Có lỗi xảy ra
              </DialogTitle>
              <DialogDescription>
                {exportProgress.error}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chi tiết lỗi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {exportProgress.logs.map((log, index) => (
                      <div key={index} className="text-sm font-mono bg-gray-100 p-2 rounded">
                        {log}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetDialog}>
                Thử lại
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ExportProjectDialog 