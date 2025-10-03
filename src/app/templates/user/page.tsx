'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import AIContentGenerator from '@/components/ui/ai-content-generator'
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
import { PageLoader } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'
import { useErrorHandler } from '@/components/ui/error-boundary'
import { ThemeParams } from '@/types'

interface ThemeData {
  id: string
  name: string
  description: string
  previewUrl: string
  defaultParams: string
}

interface ThemeWithUnsplash extends ThemeData {
  unsplashImageUrl?: string
  isLoadingImage?: boolean
}

const UserTemplatesPageContent = () => {
  const searchParams = useSearchParams()
  const preselectedThemeId = searchParams.get('themeId')
  
  const [themes, setThemes] = useState<ThemeWithUnsplash[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState<ThemeWithUnsplash | null>(null)
  const [projectName, setProjectName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [createdProject, setCreatedProject] = useState<{ id: string; themeParams?: string } | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isShowingAI, setIsShowingAI] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toasts, toast, dismiss } = useToast()
  const throwError = useErrorHandler()

  // Function to fetch Unsplash image for a theme
  const fetchUnsplashImage = async (theme: ThemeWithUnsplash) => {
    try {
      const response = await fetch('/api/unsplash/theme-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeName: theme.name })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.imageUrl) {
          return data.imageUrl
        }
      } else {
        // Handle specific HTTP errors
        if (response.status === 429) {
          console.warn(`Rate limit exceeded for theme: ${theme.name}`)
        } else if (response.status === 503) {
          console.warn(`Unsplash service unavailable for theme: ${theme.name}`)
        } else {
          console.error(`HTTP ${response.status} error fetching image for theme: ${theme.name}`)
        }
      }
    } catch (error: unknown) {
      console.error('Network error fetching Unsplash image:', error)
      
      // Handle specific network errors
      if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('Network connection failed when fetching theme image')
        } else if (error.name === 'AbortError') {
          console.warn('Theme image fetch was aborted')
        }
      }
    }
    return null
  }

  const loadThemes = useCallback(async () => {
      try {
        const response = await fetch('/api/themes')
        const data = await response.json()
        
        if (data.success) {
          const themesWithUnsplash = data.themes.map((theme: ThemeData) => ({
            ...theme,
            isLoadingImage: true
          }))
          setThemes(themesWithUnsplash)
          
          // Load Unsplash images for each theme
          for (let i = 0; i < themesWithUnsplash.length; i++) {
            const theme = themesWithUnsplash[i]
            
            try {
              const unsplashImageUrl = await fetchUnsplashImage(theme)
              
              setThemes(prev => prev.map(t => 
                t.id === theme.id 
                  ? { ...t, unsplashImageUrl, isLoadingImage: false }
                  : t
              ))
            } catch (error) {
              console.error(`Failed to load image for theme ${theme.name}:`, error)
              
              // Still update the theme to remove loading state
              setThemes(prev => prev.map(t => 
                t.id === theme.id 
                  ? { ...t, unsplashImageUrl: undefined, isLoadingImage: false }
                  : t
              ))
            }
          }
          
          // Tự động chọn theme đầu tiên và tạo project
          if (themesWithUnsplash.length > 0) {
            const firstTheme = themesWithUnsplash[0]
            setSelectedTheme(firstTheme)
            setProjectName('Website mới') // Tên mặc định
            setShowCreateDialog(true) // Mở dialog tạo project ngay lập tức
            
            // Tự động tạo project sau 1 giây
            setTimeout(() => {
              createProject()
            }, 1000)
          }
        }
      } catch (error: unknown) {
        console.error('Error loading themes:', error)
        setError('Không thể tải danh sách themes. Vui lòng kiểm tra kết nối internet và thử lại.')
        toast({
          title: "Lỗi tải themes",
          description: "Không thể tải danh sách themes. Vui lòng refresh trang.",
          variant: "destructive"
        })
        
        // If it's a critical error, trigger error boundary
        if (error instanceof Error && (error.name === 'TypeError' || error.message?.includes('fetch'))) {
          throwError(new Error('Network error loading themes'))
        }
              } finally {
          setLoading(false)
        }
      }, [preselectedThemeId, toast, throwError])

  useEffect(() => {
    loadThemes()
  }, [preselectedThemeId, loadThemes])

  const createProject = async () => {
    if (!selectedTheme) return

    setIsCreating(true)
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themeId: selectedTheme.id,
          name: projectName.trim() || 'Website mới'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Lưu project đã tạo và hiển thị popup AI
        setCreatedProject(data.project)
        // Đóng dialog tạo project trước
        setShowCreateDialog(false)
        setProjectName('')
        setSelectedTheme(null)
        
        // Hiển thị popup AI sau một chút để đảm bảo dialog đã đóng
        setIsShowingAI(true)
        setTimeout(() => {
          setShowAIGenerator(true)
          setIsShowingAI(false)
        }, 300)
        
        // Thông báo cho người dùng
        toast({
          title: "Thành công!",
          description: "Project đã được tạo thành công. AI Content Generator sẽ mở để bạn tạo nội dung.",
          variant: "default"
        })
      } else {
        toast({
          title: "Lỗi tạo project",
          description: data.error || "Có lỗi xảy ra khi tạo project",
          variant: "destructive"
        })
      }
    } catch (error: unknown) {
      console.error('Error creating project:', error)
      toast({
        title: "Lỗi kết nối",
        description: "Không thể kết nối đến server. Vui lòng thử lại.",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleAIGenerate = async (themeParams: ThemeParams) => {
    if (!createdProject) return

    try {
      console.log('Updating project with AI data:', themeParams)
      
      // Cập nhật project với nội dung AI đã tạo
      const response = await fetch(`/api/projects/${createdProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themeParams: themeParams // Gửi trực tiếp object, không stringify
        })
      })

      const data = await response.json()
      
      if (data.success) {
        console.log('Project updated successfully, redirecting to editor...')
        toast({
          title: "Thành công!",
          description: "Nội dung AI đã được cập nhật. Chuyển đến editor...",
          variant: "default",
          duration: 2000
        })
        
        // Chuyển đến project editor với query param để force reload
        setTimeout(() => {
          window.location.href = `/project/${createdProject.id}?updated=${Date.now()}`
        }, 1000)
      } else {
        console.error('Update failed:', data.error)
        toast({
          title: "Lỗi cập nhật project",
          description: data.error || "Có lỗi xảy ra khi cập nhật project",
          variant: "destructive"
        })
      }
    } catch (error: unknown) {
      console.error('Error updating project:', error)
      toast({
        title: "Lỗi kết nối",
        description: "Không thể cập nhật project. Vui lòng thử lại.",
        variant: "destructive"
      })
    }
  }

  const handleAIClose = async (open: boolean) => {
    // Với forceOpen = true, không cho phép đóng popup khi chưa hoàn thành
    if (!open && createdProject) {
      console.log('Không thể đóng popup AI - bắt buộc phải hoàn thành thông tin')
      // Không cho phép đóng popup khi đã tạo project
      return
    }
    setShowAIGenerator(open)
    if (!open) {
      setCreatedProject(null)
    }
  }

  if (loading) {
    return <PageLoader text="Đang tải themes..." />
  }

  if (error && themes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Templates</h1>
              <p className="text-gray-600">Chọn template để tạo project mới</p>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="container mx-auto px-6 py-8">
          <ErrorMessage
            title="Lỗi tải themes"
            message={error}
            type="error"
            onRetry={() => {
              setError(null)
              setLoading(true)
              loadThemes()
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Templates</h1>
            <p className="text-gray-600">Chọn template để tạo project mới</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <Card key={theme.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Preview Image */}
              <div className="h-48 bg-gray-200 relative">
                {theme.isLoadingImage ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : theme.unsplashImageUrl ? (
                  <Image 
                    src={theme.unsplashImageUrl} 
                    alt={theme.name}
                    fill
                    className="object-cover"
                  />
                ) : theme.previewUrl ? (
                  <Image 
                    src={theme.previewUrl} 
                    alt={theme.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Eye size={48} />
                  </div>
                )}
                
                {/* Unsplash Attribution Overlay */}
                {theme.unsplashImageUrl && (
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Photo by Unsplash
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{theme.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {theme.description || 'Không có mô tả'}
                </p>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        className="flex-1"
                        onClick={() => {
                          setSelectedTheme(theme)
                          setShowCreateDialog(true)
                        }}
                      >
                        <Plus size={16} className="mr-2" />
                        Tạo Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tạo Project từ &quot;{selectedTheme?.name || theme.name}&quot;</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Tên Project
                          </label>
                          <Input
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="Nhập tên project của bạn"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                createProject()
                              }
                            }}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={createProject}
                            disabled={!projectName.trim() || isCreating}
                            className="flex-1"
                          >
                            {isCreating ? 'Đang tạo...' : 'Tạo Project'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Link href={`/preview/${theme.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye size={16} className="mr-2" />
                      Xem trước
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {themes.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Không có templates</h3>
            <p className="text-gray-600">Hiện tại chưa có templates nào được tạo.</p>
          </div>
        )}
      </div>

      {/* Loading overlay khi đang hiển thị AI */}
      {isShowingAI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Đang khởi tạo AI Content Generator...</p>
          </div>
        </div>
      )}

      <AIContentGenerator
        open={showAIGenerator}
        onOpenChange={handleAIClose}
        onGenerate={handleAIGenerate}
        currentTheme={createdProject ? (() => {
          try {
            return JSON.parse(createdProject.themeParams || '{}')
          } catch {
            return undefined
          }
        })() : undefined}
        forceOpen={true}
        projectId={createdProject?.id}
      />

      {/* Toasts */}
      <ToastProvider>
        {toasts.map(({ id, title, description, action, ...props }) => (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </div>
  )
}

const UserTemplatesPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    </div>}>
      <UserTemplatesPageContent />
    </Suspense>
  )
}

export default UserTemplatesPage 