'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import AIContentGenerator from '@/components/ui/ai-content-generator'
import { ThemeParams } from '@/types'

interface ThemeData {
  id: string
  name: string
  description: string
  previewUrl: string
  defaultParams: string
}

const UserTemplatesPage = () => {
  const searchParams = useSearchParams()
  const preselectedThemeId = searchParams.get('themeId')
  
  const [themes, setThemes] = useState<ThemeData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null)
  const [projectName, setProjectName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [createdProject, setCreatedProject] = useState<any>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isShowingAI, setIsShowingAI] = useState(false)

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const response = await fetch('/api/themes')
        const data = await response.json()
        
        if (data.success) {
          setThemes(data.themes)
          
          // Nếu có themeId được truyền từ URL, tự động chọn theme đó
          if (preselectedThemeId) {
            const preselectedTheme = data.themes.find((theme: ThemeData) => theme.id === preselectedThemeId)
            if (preselectedTheme) {
              setSelectedTheme(preselectedTheme)
              setShowCreateDialog(true) // Mở dialog tạo project ngay lập tức
            }
          }
        }
      } catch (error) {
        console.error('Error loading themes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadThemes()
  }, [preselectedThemeId])

  const createProject = async () => {
    if (!selectedTheme || !projectName.trim()) return

    setIsCreating(true)
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themeId: selectedTheme.id,
          name: projectName
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
        console.log('Project đã được tạo thành công! Popup AI sẽ hiển thị để bạn có thể tạo nội dung.')
      } else {
        alert(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Có lỗi xảy ra khi tạo project')
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
        // Chuyển đến project editor với query param để force reload
        window.location.href = `/project/${createdProject.id}?updated=${Date.now()}`
      } else {
        console.error('Update failed:', data.error)
        alert(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Có lỗi xảy ra khi cập nhật project')
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="coffee-spinner"></div>
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
                {theme.previewUrl ? (
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
      />
    </div>
  )
}

export default UserTemplatesPage 