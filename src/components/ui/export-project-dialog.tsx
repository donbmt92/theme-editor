/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
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
import { Loader2, CheckCircle, AlertCircle, Terminal } from 'lucide-react'
import { ThemeParams } from '@/types'

interface DeployOptions {
  projectName: string
  description: string
  includeAssets: boolean
  createUserFolder: boolean
  generateDeployScript: boolean
  serverType: 'nginx' | 'apache' | 'node' | 'docker'
  domain: string
}

interface DeployProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  themeParams: ThemeParams
  projectId: string
  projectName: string
}

const DeployProjectDialog: React.FC<DeployProjectDialogProps> = ({
  open,
  onOpenChange,
  themeParams,
  projectId,
  projectName
}) => {
  const { data: session } = useSession()
  const [options, setOptions] = useState<DeployOptions>({
    projectName: projectName || 'my-website',
    description: 'Deployed from Theme Editor',
    includeAssets: true,
    createUserFolder: true,
    generateDeployScript: true,
    serverType: 'nginx',
    domain: ''
  })
  
  const [step, setStep] = useState<'options' | 'deploying' | 'success' | 'error'>('options')
  const [domainStatus, setDomainStatus] = useState<'unchecked' | 'checking' | 'valid' | 'invalid'>('unchecked')
  const [domainIp, setDomainIp] = useState<string | null>(null)
  const [deployProgress, setDeployProgress] = useState<{
    folderPath?: string
    deployScriptPath?: string
    userFolderPath?: string
    filesystemPath?: string
    error?: string
    logs: string[]
  }>({
    logs: []
  })

  const updateOption = <K extends keyof DeployOptions>(key: K, value: DeployOptions[K]) => {
    setOptions(prev => {
      const newOptions = {
        ...prev,
        [key]: value
      }
      
      return newOptions
    })
  }

  const addLog = (message: string) => {
    setDeployProgress(prev => ({
      ...prev,
      logs: [...prev.logs, `${new Date().toLocaleTimeString()}: ${message}`]
    }))
  }

  const checkDomain = async () => {
    if (!options.domain) return
    setDomainStatus('checking')
    try {
      const response = await fetch('/api/check-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: options.domain })
      })
      const data = await response.json()
      if (data.ip) {
        // Kiểm tra xem IP có phải là 69.62.83.168 không
        if (data.ip === '69.62.83.168') {
          setDomainStatus('valid')
          setDomainIp(data.ip)
          addLog(`✅ Domain ${options.domain} đã được trỏ về đúng IP VPS: ${data.ip}`)
          
          // Auto-update shell script if deploy script exists
          if (deployProgress.deployScriptPath && deployProgress.filesystemPath) {
            addLog(`🔄 Đang cập nhật shell script với domain ${options.domain}...`)
            await updateDeployScript()
          }
        } else {
          setDomainStatus('invalid')
          setDomainIp(data.ip)
          addLog(`❌ Domain ${options.domain} trỏ về IP sai: ${data.ip}. Cần trỏ về IP: 69.62.83.168`)
        }
      } else {
        setDomainStatus('invalid')
        setDomainIp(null)
        addLog(`❌ Domain ${options.domain} chưa được trỏ về. Lỗi: ${data.error}`)
      }
    } catch (error) {
      setDomainStatus('invalid')
      setDomainIp(null)
      addLog(`❌ Lỗi khi kiểm tra domain: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const updateDeployScript = async () => {
    try {
      const response = await fetch('/api/update-deploy-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          domain: options.domain,
          serverType: options.serverType,
          filesystemPath: deployProgress.filesystemPath
        })
      })
      
      if (response.ok) {
        addLog(`✅ Shell script đã được cập nhật với domain ${options.domain}`)
      } else {
        addLog(`❌ Không thể cập nhật shell script`)
      }
    } catch (error) {
      addLog(`❌ Lỗi khi cập nhật shell script: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const startDeploy = async () => {
    if (!session?.user?.id) {
      addLog('❌ Lỗi: Bạn cần đăng nhập để deploy project')
      setStep('error')
      return
    }

    // Kiểm tra domain nếu có nhập
    if (options.domain && domainStatus !== 'valid') {
      addLog('❌ Lỗi: Domain chưa được xác thực hoặc trỏ về IP sai. Vui lòng kiểm tra domain trước.')
      setStep('error')
      return
    }

    setStep('deploying')
    setDeployProgress({ logs: [] })
    
    try {
      addLog('🚀 Bắt đầu deploy project...')
      
      // Step 1: Deploy Static HTML project với user folder
      if (options.createUserFolder) {
        addLog(`📁 Tạo folder riêng cho user: ${session.user.id}`)
      }
      
      addLog('📦 Tạo Static HTML project từ theme...')
      const deployResponse = await fetch('/api/deploy-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...options,
          projectId,
          userId: session.user.id,
          themeParams
        })
      })

      if (!deployResponse.ok) {
        throw new Error('Không thể deploy project')
      }

      const deployResult = await deployResponse.json()
      addLog('✅ Tạo Static HTML project thành công!')
      
      if (options.createUserFolder && deployResult.userFolderPath) {
        addLog(`📁 Folder user được tạo tại: ${deployResult.userFolderPath}`)
      }
      
      if (options.generateDeployScript && deployResult.deployScriptPath) {
        addLog(`📜 Deploy script được tạo: ${deployResult.deployScriptPath}`)
        
        // Tự động chạy shell script
        addLog('🚀 Đang chạy deploy script trên VPS...')
        try {
          const executeResponse = await fetch('/api/execute-deploy-script', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              scriptPath: deployResult.deployScriptPath,
              projectName: options.projectName,
              serverType: options.serverType,
              domain: options.domain
            })
          })
          

          if (executeResponse.ok) {
            const executeResult = await executeResponse.json()
            addLog('✅ Deploy script chạy thành công!')
            if (executeResult.stdout) {
              addLog(`📋 Output: ${executeResult.stdout}`)
            }
            if (executeResult.stderr) {
              addLog(`⚠️ Warnings: ${executeResult.stderr}`)
            }
          } else {
            const errorData = await executeResponse.json()
            addLog(`❌ Lỗi khi chạy deploy script: ${errorData.error}`)
          }
        } catch (error) {
          addLog(`❌ Lỗi khi chạy deploy script: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
      
      setDeployProgress(prev => ({
        ...prev,
        folderPath: deployResult.folderPath,
        deployScriptPath: deployResult.deployScriptPath,
        userFolderPath: deployResult.userFolderPath,
        filesystemPath: deployResult.filesystemPath
      }))

      addLog('🎉 Hoàn thành tất cả các bước!')
      setStep('success')
      
    } catch (error) {
      console.error('Deploy error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra'
      addLog(`❌ Lỗi: ${errorMessage}`)
      setDeployProgress(prev => ({
        ...prev,
        error: errorMessage
      }))
      setStep('error')
    }
  }

  const resetDialog = () => {
    setStep('options')
    setDeployProgress({ logs: [] })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        {step === 'options' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-green-600" />
                Deploy Project Web
              </DialogTitle>
              <DialogDescription>
                Deploy project thành website Static HTML hoàn chỉnh và tự động chạy script deploy trên VPS
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

                  <div>
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Static HTML Website</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Project sẽ được tạo thành website HTML tĩnh, hoạt động trên mọi web server
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
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



              {/* Server Deployment Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Tùy chọn Deploy & Folder
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={options.createUserFolder}
                        onChange={(e) => updateOption('createUserFolder', e.target.checked)}
                        className="mr-2"
                      />
                      Tạo folder riêng cho user (tránh trùng file)
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={options.generateDeployScript}
                        onChange={(e) => updateOption('generateDeployScript', e.target.checked)}
                        className="mr-2"
                      />
                      Tạo và chạy script deploy tự động
                    </label>
                  </div>

                  {options.generateDeployScript && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Loại server</label>
                        <select
                          value={options.serverType}
                          onChange={(e) => updateOption('serverType', e.target.value as 'nginx' | 'apache' | 'node' | 'docker')}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="nginx">Nginx</option>
                          <option value="apache">Apache</option>
                          <option value="node">Node.js Server</option>
                          <option value="docker">Docker</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Domain (tùy chọn)</label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={options.domain}
                            onChange={(e) => {
                              updateOption('domain', e.target.value)
                              setDomainStatus('unchecked')
                              setDomainIp(null)
                            }}
                            placeholder="your-domain.com"
                          />
                          <Button 
                            variant="outline"
                            onClick={checkDomain}
                            disabled={!options.domain || domainStatus === 'checking'}
                          >
                            {domainStatus === 'checking' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kiểm tra'}
                          </Button>
                        </div>
                        {domainStatus === 'valid' && domainIp && (
                          <p className="text-sm text-green-600 mt-2">
                            ✅ Domain đã trỏ về đúng IP VPS: {domainIp}
                          </p>
                        )}
                        {domainStatus === 'invalid' && domainIp && (
                          <p className="text-sm text-red-600 mt-2">
                            ❌ Domain trỏ về IP sai: {domainIp}. Cần trỏ về IP: 69.62.83.168
                          </p>
                        )}
                        {domainStatus === 'invalid' && !domainIp && (
                          <p className="text-sm text-red-600 mt-2">
                            ❌ Không thể xác thực domain. Vui lòng kiểm tra lại.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button onClick={startDeploy} className="bg-green-600 hover:bg-green-700">
                <Terminal className="mr-2 h-4 w-4" />
                Bắt đầu deploy project
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'deploying' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                Đang deploy project...
              </DialogTitle>
              <DialogDescription>
                Vui lòng đợi trong khi chúng tôi tạo folder và deploy project của bạn
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tiến trình</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {deployProgress.logs.map((log, index) => (
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
                Deploy project thành công!
              </DialogTitle>
              <DialogDescription>
                Project của bạn đã được deploy thành công thành folder
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kết quả</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {deployProgress.folderPath && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Project Folder</p>
                        <p className="text-sm text-gray-600">Folder đã được tạo: {deployProgress.folderPath}</p>
                      </div>
                      <div className="text-green-600">
                        📁
                      </div>
                    </div>
                  )}



                  {deployProgress.userFolderPath && (
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium">User Folder</p>
                        <p className="text-sm text-gray-600">Folder riêng cho user: {deployProgress.userFolderPath}</p>
                      </div>
                      <div className="text-purple-600">
                        📁
                      </div>
                    </div>
                  )}

                  {deployProgress.deployScriptPath && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Deploy Script</p>
                        <p className="text-sm text-gray-600">Script deploy tự động cho {options.serverType} - Đã chạy thành công!</p>
                      </div>
                      <div className="text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    </div>
                  )}

                  {deployProgress.filesystemPath && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Filesystem Path</p>
                        <p className="text-sm text-gray-600">Đường dẫn lưu folder trên server</p>
                      </div>
                      <div className="text-blue-600 text-xs font-mono">
                        {deployProgress.filesystemPath}
                      </div>
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
                    {deployProgress.logs.map((log, index) => (
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
                {deployProgress.error}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chi tiết lỗi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {deployProgress.logs.map((log, index) => (
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

export default DeployProjectDialog 