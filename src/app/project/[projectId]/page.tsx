/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Save, Download, Eye, Palette, Type, Layout, Settings, FileText, Undo, Redo, ArrowLeft, Wand2 } from 'lucide-react'
import VietnamCoffeeTheme from '@/components/themes/VietnamCoffeeTheme'
import ImageUpload from '@/components/ui/image-upload'
import AIContentGenerator from '@/components/ui/ai-content-generator'
import ExportProjectDialog from '@/components/ui/export-project-dialog'
import { useUndoRedo } from '@/hooks/use-undo-redo'
import { ThemeParams } from '@/types'

interface ProjectData {
  id: string
  name: string
  theme: {
    id: string
    name: string
    description: string
    defaultParams: string
  }
  versions: Array<{
    id: string
    versionNumber: number
    snapshot: unknown
  }>
}

const ProjectEditor = () => {
  const params = useParams()
  const projectId = params.projectId as string
  const [project, setProject] = useState<ProjectData | null>(null)
  const [themeParams, setThemeParams] = useState<ThemeParams | null>(null)
  type TabType = 'colors' | 'typography' | 'layout' | 'content' | 'problems' | 'solutions' | 'products' | 'footer' | 'meta'
  const [activeTab, setActiveTab] = useState<TabType>('colors')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  
  // Undo/Redo functionality
  const {
    state: themeParamsWithHistory,
    updateState: updateThemeParamsWithHistory,
    undo,
    redo,
    canUndo,
    canRedo
  } = useUndoRedo<ThemeParams | null>(null)

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        const data = await response.json()
        
        if (data.success) {
          setProject(data.project)
          
          // Use latest version or theme default params
          const latestVersion = data.project.versions[0]
          const params = latestVersion 
            ? latestVersion.snapshot 
            : (typeof data.project.theme.defaultParams === 'string' 
            ? JSON.parse(data.project.theme.defaultParams) 
            : data.project.theme.defaultParams)
          console.log(params);
          
          setThemeParams(params)
          updateThemeParamsWithHistory(params)
        }
      } catch (error) {
        console.error('Error loading project:', error)
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      loadProject()
    }
  }, [projectId])

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !themeParams) return

    const timeoutId = setTimeout(() => {
      saveProject()
    }, 5000) // Auto-save after 5 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [themeParams, autoSaveEnabled])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveProject()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [themeParams])

  const updateThemeParam = (path: string[], value: string | number) => {
    if (!themeParams) return

    const newParams = { ...themeParams }
    let current: Record<string, unknown> = newParams as Record<string, unknown>
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        if (!isNaN(Number(path[i]))) {
          current[path[i]] = []
        } else {
          current[path[i]] = {}
        }
      }
      current = current[path[i]] as Record<string, unknown>
    }
    
    current[path[path.length - 1]] = value
    setThemeParams(newParams)
    updateThemeParamsWithHistory(newParams)
  }

  const saveProject = async () => {
    if (!themeParams) return
    
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeParams })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSaveMessage('✅ Project đã được lưu thành công!')
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        setSaveMessage(`❌ Lỗi: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving project:', error)
      setSaveMessage('❌ Có lỗi xảy ra khi lưu project')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAIGenerate = (generatedTheme: ThemeParams) => {
    setThemeParams(generatedTheme)
    updateThemeParamsWithHistory(generatedTheme)
    setSaveMessage('✨ Nội dung AI đã được áp dụng thành công!')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="coffee-spinner"></div>
      </div>
    )
  }

  if (!project || !themeParams) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project không tồn tại</h1>
          <Button onClick={() => window.history.back()}>Quay lại</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={16} className="mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-xl font-bold">{project.name}</h1>
              <p className="text-sm text-gray-600">Dựa trên theme: {project.theme.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Undo/Redo */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                title="Hoàn tác (Ctrl+Z)"
              >
                <Undo size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                title="Làm lại (Ctrl+Y)"
              >
                <Redo size={16} />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIDialog(true)}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
            >
              <Wand2 size={16} className="mr-2" />
              AI Tạo Nội Dung
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye size={16} className="mr-2" />
              {isPreviewMode ? 'Chỉnh sửa' : 'Xem trước'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={saveProject}
              disabled={isSaving}
              title="Lưu project (Ctrl+S)"
            >
              <Save size={16} className="mr-2" />
              {isSaving ? 'Đang lưu...' : 'Lưu'}
            </Button>
            <Button
              size="sm"
              onClick={() => setShowExportDialog(true)}
              style={{ backgroundColor: themeParams?.colors.primary }}
            >
              <Download size={16} className="mr-2" />
              Xuất file
            </Button>
          </div>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`px-6 py-3 text-sm font-medium ${
          saveMessage.includes('✅') 
            ? 'bg-green-50 text-green-800 border-b border-green-200' 
            : 'bg-red-50 text-red-800 border-b border-red-200'
        }`}>
          {saveMessage}
        </div>
      )}

      {isPreviewMode ? (
        /* Preview Mode */
        <div className="h-screen overflow-auto">
          <VietnamCoffeeTheme theme={themeParams} />
        </div>
      ) : (
        /* Edit Mode */
        <div className="flex h-screen">
          {/* Left Panel - Editor */}
          <div className="w-1/3 bg-white border-r border-gray-200 overflow-auto">
            <div className="p-6">
              {/* Tabs */}
              <div className="flex flex-wrap gap-1 mb-6 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setActiveTab('colors')}
                  className={`flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'colors' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Palette size={16} className="mr-2" />
                  Màu sắc
                </button>
                <button
                  onClick={() => setActiveTab('typography')}
                  className={`flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'typography' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Type size={16} className="mr-2" />
                  Chữ
                </button>
                <button
                  onClick={() => setActiveTab('layout')}
                  className={`flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'layout' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Layout size={16} className="mr-2" />
                  Bố cục
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'content' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText size={16} className="mr-2" />
                  Nội dung
                </button>
                <button
                  onClick={() => setActiveTab('problems')}
                  className={`flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'problems' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText size={16} className="mr-2" />
                  Vấn đề
                </button>
                <button
                  onClick={() => setActiveTab('solutions')}
                  className={`flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'solutions' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText size={16} className="mr-2" />
                  Giải pháp
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'products' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText size={16} className="mr-2" />
                  Sản phẩm
                </button>
                <button
                  onClick={() => setActiveTab('footer')}
                  className={`flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'footer' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText size={16} className="mr-2" />
                  Footer
                </button>
                <button
                  onClick={() => setActiveTab('meta')}
                  className={`flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'meta' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Settings size={16} className="mr-2" />
                  Meta
                </button>
              </div>

              {/* Colors Tab */}
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Màu chủ đề</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Màu chính</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams.colors.primary}
                            onChange={(e) => updateThemeParam(['colors', 'primary'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams.colors.primary}
                            onChange={(e) => updateThemeParam(['colors', 'primary'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Màu phụ</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams.colors.secondary}
                            onChange={(e) => updateThemeParam(['colors', 'secondary'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams.colors.secondary}
                            onChange={(e) => updateThemeParam(['colors', 'secondary'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Màu nhấn</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams.colors.accent}
                            onChange={(e) => updateThemeParam(['colors', 'accent'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams.colors.accent}
                            onChange={(e) => updateThemeParam(['colors', 'accent'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Màu nền</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams.colors.background}
                            onChange={(e) => updateThemeParam(['colors', 'background'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams.colors.background}
                            onChange={(e) => updateThemeParam(['colors', 'background'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Màu chữ</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams.colors.text}
                            onChange={(e) => updateThemeParam(['colors', 'text'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams.colors.text}
                            onChange={(e) => updateThemeParam(['colors', 'text'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Typography Tab */}
              {activeTab === 'typography' && (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Typography</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Font Family</label>
                        <select
                          value={themeParams.typography.fontFamily}
                          onChange={(e) => updateThemeParam(['typography', 'fontFamily'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Poppins">Poppins</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Open Sans">Open Sans</option>
                          <option value="Montserrat">Montserrat</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Heading Size</label>
                        <select
                          value={themeParams.typography.headingSize}
                          onChange={(e) => updateThemeParam(['typography', 'headingSize'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="sm">Small</option>
                          <option value="base">Base</option>
                          <option value="lg">Large</option>
                          <option value="xl">XL</option>
                          <option value="2xl">2XL</option>
                          <option value="3xl">3XL</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Body Size</label>
                        <select
                          value={themeParams.typography.bodySize}
                          onChange={(e) => updateThemeParam(['typography', 'bodySize'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="xs">Extra Small</option>
                          <option value="sm">Small</option>
                          <option value="base">Base</option>
                          <option value="lg">Large</option>
                          <option value="xl">XL</option>
                        </select>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Layout Tab */}
              {activeTab === 'layout' && (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Layout</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Container Width</label>
                        <Input
                          value={themeParams.layout.containerWidth}
                          onChange={(e) => updateThemeParam(['layout', 'containerWidth'], e.target.value)}
                          placeholder="1200px"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Spacing</label>
                        <select
                          value={themeParams.layout.spacing}
                          onChange={(e) => updateThemeParam(['layout', 'spacing'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="minimal">Minimal</option>
                          <option value="comfortable">Comfortable</option>
                          <option value="spacious">Spacious</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Border Radius</label>
                        <select
                          value={themeParams.layout.borderRadius}
                          onChange={(e) => updateThemeParam(['layout', 'borderRadius'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="none">None</option>
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Header</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Logo</label>
                        <ImageUpload
                          value={themeParams?.content?.header?.logo || ''}
                          onChange={(url) => updateThemeParam(['content', 'header', 'logo'], url)}
                          placeholder="Upload logo công ty"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tên công ty</label>
                        <Input
                          value={themeParams?.content?.header?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'header', 'title'], e.target.value)}
                          placeholder="Tên công ty của bạn"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Slogan</label>
                        <Input
                          value={themeParams?.content?.header?.subtitle || ''}
                          onChange={(e) => updateThemeParam(['content', 'header', 'subtitle'], e.target.value)}
                          placeholder="Slogan công ty"
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Hình ảnh nền</label>
                        <ImageUpload
                          value={themeParams?.content?.hero?.backgroundImage || ''}
                          onChange={(url) => updateThemeParam(['content', 'hero', 'backgroundImage'], url)}
                          placeholder="Upload hình ảnh nền hero"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề chính</label>
                        <Input
                          value={themeParams?.content?.hero?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'hero', 'title'], e.target.value)}
                          placeholder="Tiêu đề chính"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề phụ</label>
                        <Input
                          value={themeParams?.content?.hero?.subtitle || ''}
                          onChange={(e) => updateThemeParam(['content', 'hero', 'subtitle'], e.target.value)}
                          placeholder="Tiêu đề phụ"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.hero?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'hero', 'description'], e.target.value)}
                          placeholder="Mô tả về công ty của bạn"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Nút CTA</label>
                        <Input
                          value={themeParams?.content?.hero?.ctaText || ''}
                          onChange={(e) => updateThemeParam(['content', 'hero', 'ctaText'], e.target.value)}
                          placeholder="Tìm hiểu thêm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Độ mờ overlay (0-1)</label>
                        <Input
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          value={themeParams?.content?.hero?.overlayOpacity || 0.7}
                          onChange={(e) => updateThemeParam(['content', 'hero', 'overlayOpacity'], parseFloat(e.target.value))}
                          placeholder="0.7"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Màu overlay</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams?.content?.hero?.overlayColor || '#8B4513'}
                            onChange={(e) => updateThemeParam(['content', 'hero', 'overlayColor'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams?.content?.hero?.overlayColor || '#8B4513'}
                            onChange={(e) => updateThemeParam(['content', 'hero', 'overlayColor'], e.target.value)}
                            className="flex-1"
                            placeholder="rgba(139, 69, 19, 0.7)"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Về chúng tôi</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Hình ảnh</label>
                        <ImageUpload
                          value={themeParams?.content?.about?.image || ''}
                          onChange={(url) => updateThemeParam(['content', 'about', 'image'], url)}
                          placeholder="Upload hình ảnh về công ty"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề</label>
                        <Input
                          value={themeParams?.content?.about?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'about', 'title'], e.target.value)}
                          placeholder="Về chúng tôi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.about?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'about', 'description'], e.target.value)}
                          placeholder="Mô tả về công ty"
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Problems Tab */}
              {activeTab === 'problems' && (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Vấn đề</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề</label>
                        <Input
                          value={themeParams?.content?.problems?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'problems', 'title'], e.target.value)}
                          placeholder="Thách Thức Hiện Tại"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.problems?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'problems', 'description'], e.target.value)}
                          placeholder="Những khó khăn mà doanh nghiệp Việt Nam gặp phải"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Background Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams?.content?.problems?.backgroundColor || '#FFF8DC'}
                            onChange={(e) => updateThemeParam(['content', 'problems', 'backgroundColor'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams?.content?.problems?.backgroundColor || '#FFF8DC'}
                            onChange={(e) => updateThemeParam(['content', 'problems', 'backgroundColor'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Text Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams?.content?.problems?.textColor || '#2D3748'}
                            onChange={(e) => updateThemeParam(['content', 'problems', 'textColor'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams?.content?.problems?.textColor || '#2D3748'}
                            onChange={(e) => updateThemeParam(['content', 'problems', 'textColor'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Problem Items */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Danh sách vấn đề</h3>
                    <div className="space-y-4">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Vấn đề {index + 1}</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                              <Input
                                value={themeParams?.content?.problems?.items?.[index]?.title || ''}
                                onChange={(e) => updateThemeParam(['content', 'problems', 'items', index.toString(), 'title'], e.target.value)}
                                placeholder="Tiêu đề vấn đề"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Mô tả</label>
                              <Textarea
                                value={themeParams?.content?.problems?.items?.[index]?.description || ''}
                                onChange={(e) => updateThemeParam(['content', 'problems', 'items', index.toString(), 'description'], e.target.value)}
                                placeholder="Mô tả vấn đề"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Icon</label>
                              <Input
                                value={themeParams?.content?.problems?.items?.[index]?.icon || ''}
                                onChange={(e) => updateThemeParam(['content', 'problems', 'items', index.toString(), 'icon'], e.target.value)}
                                placeholder="AlertCircle"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Solutions Tab */}
              {activeTab === 'solutions' && (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Giải pháp</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề</label>
                        <Input
                          value={themeParams?.content?.solutions?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'solutions', 'title'], e.target.value)}
                          placeholder="Giải Pháp Của Chúng Tôi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.solutions?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'solutions', 'description'], e.target.value)}
                          placeholder="Những giải pháp toàn diện để vượt qua thách thức"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Background Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams?.content?.solutions?.backgroundColor || '#F0F8FF'}
                            onChange={(e) => updateThemeParam(['content', 'solutions', 'backgroundColor'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams?.content?.solutions?.backgroundColor || '#F0F8FF'}
                            onChange={(e) => updateThemeParam(['content', 'solutions', 'backgroundColor'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Text Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams?.content?.solutions?.textColor || '#2D3748'}
                            onChange={(e) => updateThemeParam(['content', 'solutions', 'textColor'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams?.content?.solutions?.textColor || '#2D3748'}
                            onChange={(e) => updateThemeParam(['content', 'solutions', 'textColor'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Solution Items */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Danh sách giải pháp</h3>
                    <div className="space-y-4">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Giải pháp {index + 1}</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                              <Input
                                value={themeParams?.content?.solutions?.items?.[index]?.title || ''}
                                onChange={(e) => updateThemeParam(['content', 'solutions', 'items', index.toString(), 'title'], e.target.value)}
                                placeholder="Tiêu đề giải pháp"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Mô tả</label>
                              <Textarea
                                value={themeParams?.content?.solutions?.items?.[index]?.description || ''}
                                onChange={(e) => updateThemeParam(['content', 'solutions', 'items', index.toString(), 'description'], e.target.value)}
                                placeholder="Mô tả giải pháp"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Lợi ích</label>
                              <Input
                                value={themeParams?.content?.solutions?.items?.[index]?.benefit || ''}
                                onChange={(e) => updateThemeParam(['content', 'solutions', 'items', index.toString(), 'benefit'], e.target.value)}
                                placeholder="Tăng lợi nhuận 30-40%"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Icon</label>
                              <Input
                                value={themeParams?.content?.solutions?.items?.[index]?.icon || ''}
                                onChange={(e) => updateThemeParam(['content', 'solutions', 'items', index.toString(), 'icon'], e.target.value)}
                                placeholder="Globe"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* CTA Section */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Call to Action</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề</label>
                        <Input
                          value={themeParams?.content?.cta?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'cta', 'title'], e.target.value)}
                          placeholder="Sẵn sàng bắt đầu hành trình xuất khẩu?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.cta?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'cta', 'description'], e.target.value)}
                          placeholder="Mô tả CTA"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Nút CTA</label>
                        <Input
                          value={themeParams?.content?.cta?.buttonText || ''}
                          onChange={(e) => updateThemeParam(['content', 'cta', 'buttonText'], e.target.value)}
                          placeholder="Đăng ký tư vấn miễn phí"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Background Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams?.content?.cta?.backgroundColor || '#8B4513'}
                            onChange={(e) => updateThemeParam(['content', 'cta', 'backgroundColor'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams?.content?.cta?.backgroundColor || '#8B4513'}
                            onChange={(e) => updateThemeParam(['content', 'cta', 'backgroundColor'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Text Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams?.content?.cta?.textColor || '#FFFFFF'}
                            onChange={(e) => updateThemeParam(['content', 'cta', 'textColor'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams?.content?.cta?.textColor || '#FFFFFF'}
                            onChange={(e) => updateThemeParam(['content', 'cta', 'textColor'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề</label>
                        <Input
                          value={themeParams?.content?.products?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'products', 'title'], e.target.value)}
                          placeholder="Sản Phẩm Của Chúng Tôi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.products?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'products', 'description'], e.target.value)}
                          placeholder="Khám phá các loại cà phê đặc trưng của Việt Nam"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Background Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={(themeParams?.content?.products as Record<string, string>)?.backgroundColor || '#F0F4F8'}
                            onChange={(e) => updateThemeParam(['content', 'products', 'backgroundColor'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={(themeParams?.content?.products as Record<string, string>)?.backgroundColor || '#F0F4F8'}
                            onChange={(e) => updateThemeParam(['content', 'products', 'backgroundColor'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Text Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={(themeParams?.content?.products as Record<string, string>)?.textColor || '#2D3748'}
                            onChange={(e) => updateThemeParam(['content', 'products', 'textColor'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={(themeParams?.content?.products as Record<string, string>)?.textColor || '#2D3748'}
                            onChange={(e) => updateThemeParam(['content', 'products', 'textColor'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Product Items */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h3>
                    <div className="space-y-4">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Sản phẩm {index + 1}</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                              <Input
                                value={themeParams?.content?.products?.items?.[index]?.name || ''}
                                onChange={(e) => updateThemeParam(['content', 'products', 'items', index.toString(), 'name'], e.target.value)}
                                placeholder="Tên sản phẩm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Mô tả</label>
                              <Textarea
                                value={themeParams?.content?.products?.items?.[index]?.description || ''}
                                onChange={(e) => updateThemeParam(['content', 'products', 'items', index.toString(), 'description'], e.target.value)}
                                placeholder="Mô tả sản phẩm"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Giá</label>
                              <Input
                                value={themeParams?.content?.products?.items?.[index]?.price || ''}
                                onChange={(e) => updateThemeParam(['content', 'products', 'items', index.toString(), 'price'], e.target.value)}
                                placeholder="2.50 USD/kg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Hình ảnh sản phẩm</label>
                              <ImageUpload
                                value={themeParams?.content?.products?.items?.[index]?.image || ''}
                                onChange={(url) => updateThemeParam(['content', 'products', 'items', index.toString(), 'image'], url)}
                                placeholder="Upload hình ảnh sản phẩm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Danh mục</label>
                              <Input
                                value={themeParams?.content?.products?.items?.[index]?.category || ''}
                                onChange={(e) => updateThemeParam(['content', 'products', 'items', index.toString(), 'category'], e.target.value)}
                                placeholder="Robusta"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Footer Tab */}
              {activeTab === 'footer' && (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Footer</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Logo Footer</label>
                        <ImageUpload
                          value={themeParams?.content?.footer?.logo || ''}
                          onChange={(url) => updateThemeParam(['content', 'footer', 'logo'], url)}
                          placeholder="Upload logo footer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tên công ty</label>
                        <Input
                          value={themeParams?.content?.footer?.companyName || ''}
                          onChange={(e) => updateThemeParam(['content', 'footer', 'companyName'], e.target.value)}
                          placeholder="Cà Phê Việt"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.footer?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'footer', 'description'], e.target.value)}
                          placeholder="Mô tả công ty"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Background Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams?.content?.footer?.backgroundColor || '#D2691E'}
                            onChange={(e) => updateThemeParam(['content', 'footer', 'backgroundColor'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams?.content?.footer?.backgroundColor || '#D2691E'}
                            onChange={(e) => updateThemeParam(['content', 'footer', 'backgroundColor'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Text Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams?.content?.footer?.textColor || '#F9FAFB'}
                            onChange={(e) => updateThemeParam(['content', 'footer', 'textColor'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams?.content?.footer?.textColor || '#F9FAFB'}
                            onChange={(e) => updateThemeParam(['content', 'footer', 'textColor'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Contact Information */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                        <Input
                          value={themeParams?.content?.footer?.contact?.phone || ''}
                          onChange={(e) => updateThemeParam(['content', 'footer', 'contact', 'phone'], e.target.value)}
                          placeholder="+84 123 456 789"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input
                          value={themeParams?.content?.footer?.contact?.email || ''}
                          onChange={(e) => updateThemeParam(['content', 'footer', 'contact', 'email'], e.target.value)}
                          placeholder="info@capheviet.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Địa chỉ</label>
                        <Textarea
                          value={themeParams?.content?.footer?.contact?.address || ''}
                          onChange={(e) => updateThemeParam(['content', 'footer', 'contact', 'address'], e.target.value)}
                          placeholder="123 Đường ABC, Quận 1, TP.HCM"
                          rows={2}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Meta Tab */}
              {activeTab === 'meta' && (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Meta & SEO</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Page Title</label>
                        <Input
                          value={themeParams?.content?.meta?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'meta', 'title'], e.target.value)}
                          placeholder="Tiêu đề trang"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Meta Description</label>
                        <Textarea
                          value={themeParams?.content?.meta?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'meta', 'description'], e.target.value)}
                          placeholder="Mô tả trang web"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Keywords</label>
                        <Input
                          value={themeParams?.content?.meta?.keywords || ''}
                          onChange={(e) => updateThemeParam(['content', 'meta', 'keywords'], e.target.value)}
                          placeholder="từ khóa, phân cách bằng dấu phẩy"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Favicon URL</label>
                        <Input
                          value={themeParams?.content?.meta?.favicon || ''}
                          onChange={(e) => updateThemeParam(['content', 'meta', 'favicon'], e.target.value)}
                          placeholder="URL favicon"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Analytics ID</label>
                        <Input
                          value={themeParams?.content?.meta?.analyticsId || ''}
                          onChange={(e) => updateThemeParam(['content', 'meta', 'analyticsId'], e.target.value)}
                          placeholder="GA-XXXXXXXXX-X"
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 bg-gray-100">
            <div className="h-full overflow-auto">
              <VietnamCoffeeTheme theme={themeParams} />
            </div>
          </div>
        </div>
      )}

      {/* AI Content Generator Dialog */}
      <AIContentGenerator
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        onGenerate={handleAIGenerate}
        currentTheme={themeParams}
      />

      {/* Export Project Dialog */}
      <ExportProjectDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        themeParams={themeParams}
        projectId={projectId}
        projectName={project?.name || 'My Project'}
      />
    </div>
  )
}

export default ProjectEditor 