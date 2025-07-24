'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Eye } from 'lucide-react'
import Link from 'next/link'

interface ThemeData {
  id: string
  name: string
  description: string
  previewUrl: string
  defaultParams: string
}

const UserTemplatesPage = () => {
  const [themes, setThemes] = useState<ThemeData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null)
  const [projectName, setProjectName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const response = await fetch('/api/themes')
        const data = await response.json()
        
        if (data.success) {
          setThemes(data.themes)
        }
      } catch (error) {
        console.error('Error loading themes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadThemes()
  }, [])

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
        // Redirect to project editor
        window.location.href = `/project/${data.project.id}`
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
                  <img 
                    src={theme.previewUrl} 
                    alt={theme.name}
                    className="w-full h-full object-cover"
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="flex-1"
                        onClick={() => setSelectedTheme(theme)}
                      >
                        <Plus size={16} className="mr-2" />
                        Tạo Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tạo Project từ "{theme.name}"</DialogTitle>
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
    </div>
  )
}

export default UserTemplatesPage 