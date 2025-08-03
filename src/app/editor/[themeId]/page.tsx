/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Save, Download, Eye, Palette, Type, Layout, Settings, FileText, Undo, Redo, Wand2 } from 'lucide-react'
import VietnamCoffeeTheme from '@/components/themes/VietnamCoffeeTheme'
import ImageUpload from '@/components/ui/image-upload'
import AIContentGenerator from '@/components/ui/ai-content-generator'
import ExportProjectDialog from '@/components/ui/export-project-dialog'
import { useUndoRedo } from '@/hooks/use-undo-redo'
import { ThemeParams } from '@/types'

interface ThemeData {
  id: string
  name: string
  description: string
  defaultParams: string
}

const ThemeEditor = () => {
  const params = useParams()
  const themeId = params.themeId as string
  const [theme, setTheme] = useState<ThemeData | null>(null)
  const [themeParams, setThemeParams] = useState<ThemeParams | null>(null)
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'content'>('colors')
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

  // Load theme data
  useEffect(() => {
    console.log(themeId);

    const loadTheme = async () => {
      try {
        const response = await fetch(`/api/themes/${themeId}`)
        const data = await response.json()
        
        if (data.success) {
          setTheme(data.theme)
          // defaultParams is already an object from Prisma, no need to parse
          const params = typeof data.theme.defaultParams === 'string' 
            ? JSON.parse(data.theme.defaultParams) 
            : data.theme.defaultParams
          setThemeParams(params)
          updateThemeParamsWithHistory(params)
        }
      } catch (error) {
        console.error('Error loading theme:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (themeId) {
      loadTheme()
    }
  }, [themeId])

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !themeParams) return

    const timeoutId = setTimeout(() => {
      saveTheme()
    }, 5000) // Auto-save after 5 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [themeParams, autoSaveEnabled])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveTheme()
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
        // If this is an array index, create an array
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

  const saveTheme = async () => {
    if (!themeParams) return
    
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      const response = await fetch(`/api/themes/${themeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeParams })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSaveMessage('✅ Theme đã được lưu thành công!')
        // Auto hide message after 3 seconds
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        setSaveMessage(`❌ Lỗi: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving theme:', error)
      setSaveMessage('❌ Có lỗi xảy ra khi lưu theme')
    } finally {
      setIsSaving(false)
    }
  }

  const exportTheme = async () => {
    setShowExportDialog(true)
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

  if (!theme || !themeParams) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Theme không tồn tại</h1>
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
              ← Quay lại
            </Button>
            <div>
              <h1 className="text-xl font-bold">{theme.name}</h1>
              <p className="text-sm text-gray-600">{theme.description}</p>
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
              onClick={saveTheme}
              disabled={isSaving}
              title="Lưu theme (Ctrl+S)"
            >
              <Save size={16} className="mr-2" />
              {isSaving ? 'Đang lưu...' : 'Lưu'}
            </Button>
            <Button
              size="sm"
              onClick={exportTheme}
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
              <div className="flex space-x-1 mb-6 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setActiveTab('colors')}
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
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
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
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
                   className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
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
                   className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                     activeTab === 'content' 
                       ? 'bg-white text-gray-900 shadow-sm' 
                       : 'text-gray-600 hover:text-gray-900'
                   }`}
                 >
                   <FileText size={16} className="mr-2" />
                   Nội dung
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
                    <h3 className="text-lg font-semibold mb-4">Kiểu chữ</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Font chữ</label>
                        <select
                          value={themeParams.typography.fontFamily}
                          onChange={(e) => updateThemeParam(['typography', 'fontFamily'], e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value='ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'>System Default</option>
                          <option value="Inter">Inter</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Open Sans">Open Sans</option>
                          <option value="Lato">Lato</option>
                          <option value="Montserrat">Montserrat</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Kích thước chữ cơ bản</label>
                        <Input
                          value={themeParams.typography.fontSize}
                          onChange={(e) => updateThemeParam(['typography', 'fontSize'], e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Độ đậm chữ</label>
                        <Input
                          value={themeParams.typography.fontWeight}
                          onChange={(e) => updateThemeParam(['typography', 'fontWeight'], e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Chiều cao dòng</label>
                        <Input
                          value={themeParams.typography.lineHeight}
                          onChange={(e) => updateThemeParam(['typography', 'lineHeight'], e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Layout Tab */}
              {activeTab === 'layout' && (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Bố cục</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Chiều rộng container</label>
                        <Input
                          value={themeParams.layout.containerWidth}
                          onChange={(e) => updateThemeParam(['layout', 'containerWidth'], e.target.value)}
                          placeholder="1200px"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Khoảng cách section</label>
                        <Input
                          value={themeParams.layout.sectionSpacing}
                          onChange={(e) => updateThemeParam(['layout', 'sectionSpacing'], e.target.value)}
                          placeholder="80px"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Border radius</label>
                        <Input
                          value={themeParams.layout.borderRadius}
                          onChange={(e) => updateThemeParam(['layout', 'borderRadius'], e.target.value)}
                          placeholder="8px"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Padding container</label>
                        <Input
                          value={themeParams.layout.containerPadding}
                          onChange={(e) => updateThemeParam(['layout', 'containerPadding'], e.target.value)}
                          placeholder="0 20px"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Grid columns</label>
                        <Input
                          value={themeParams.layout.gridColumns}
                          onChange={(e) => updateThemeParam(['layout', 'gridColumns'], e.target.value)}
                          placeholder="3"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Gap giữa các items</label>
                        <Input
                          value={themeParams.layout.itemGap}
                          onChange={(e) => updateThemeParam(['layout', 'itemGap'], e.target.value)}
                          placeholder="32px"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Max width content</label>
                        <Input
                          value={themeParams.layout.maxContentWidth}
                          onChange={(e) => updateThemeParam(['layout', 'maxContentWidth'], e.target.value)}
                          placeholder="800px"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Header height</label>
                        <Input
                          value={themeParams.layout.headerHeight}
                          onChange={(e) => updateThemeParam(['layout', 'headerHeight'], e.target.value)}
                          placeholder="80px"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Footer padding</label>
                        <Input
                          value={themeParams.layout.footerPadding}
                          onChange={(e) => updateThemeParam(['layout', 'footerPadding'], e.target.value)}
                          placeholder="60px 0 20px"
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  {/* Meta/SEO Content */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Meta & SEO</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề trang</label>
                        <Input
                          value={themeParams?.content?.meta?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'meta', 'title'], e.target.value)}
                          placeholder="Cà Phê Việt Nam - Xuất Khẩu Chất Lượng Cao"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả SEO</label>
                        <Textarea
                          value={themeParams?.content?.meta?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'meta', 'description'], e.target.value)}
                          placeholder="Chuyên cung cấp cà phê Việt Nam chất lượng cao cho thị trường quốc tế..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Keywords</label>
                        <Input
                          value={themeParams?.content?.meta?.keywords || ''}
                          onChange={(e) => updateThemeParam(['content', 'meta', 'keywords'], e.target.value)}
                          placeholder="cà phê việt nam, xuất khẩu cà phê, robusta, arabica"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Favicon</label>
                        <ImageUpload
                          value={themeParams?.content?.meta?.favicon || ''}
                          onChange={(url) => updateThemeParam(['content', 'meta', 'favicon'], url)}
                          placeholder="Upload favicon (16x16, 32x32)"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Header Content */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Header</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Logo</label>
                        <ImageUpload
                          value={themeParams?.content?.header?.logo || ''}
                          onChange={(url) => updateThemeParam(['content', 'header', 'logo'], url)}
                          placeholder="Upload logo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tên công ty</label>
                        <Input
                          value={themeParams?.content?.header?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'header', 'title'], e.target.value)}
                          placeholder="Cà Phê Việt + Plus"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Slogan</label>
                        <Input
                          value={themeParams?.content?.header?.subtitle || ''}
                          onChange={(e) => updateThemeParam(['content', 'header', 'subtitle'], e.target.value)}
                          placeholder="Premium Export Coffee"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Số điện thoại header</label>
                        <Input
                          value={themeParams?.content?.header?.contactInfo?.phone || ''}
                          onChange={(e) => updateThemeParam(['content', 'header', 'contactInfo', 'phone'], e.target.value)}
                          placeholder="+84 123 456 789"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email header</label>
                        <Input
                          value={themeParams?.content?.header?.contactInfo?.email || ''}
                          onChange={(e) => updateThemeParam(['content', 'header', 'contactInfo', 'email'], e.target.value)}
                          placeholder="info@capheviet.com"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Hero Content */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề chính</label>
                        <Input
                          value={themeParams?.content?.hero?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'hero', 'title'], e.target.value)}
                          placeholder="Cà Phê Việt Nam - Chất Lượng Quốc Tế"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề phụ</label>
                        <Input
                          value={themeParams?.content?.hero?.subtitle || ''}
                          onChange={(e) => updateThemeParam(['content', 'hero', 'subtitle'], e.target.value)}
                          placeholder="Xuất khẩu cà phê chất lượng cao"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.hero?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'hero', 'description'], e.target.value)}
                          placeholder="Chúng tôi chuyên cung cấp các loại cà phê Việt Nam chất lượng cao..."
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
                        <label className="block text-sm font-medium mb-2">Nút phụ</label>
                        <Input
                          value={themeParams?.content?.hero?.secondaryCtaText || ''}
                          onChange={(e) => updateThemeParam(['content', 'hero', 'secondaryCtaText'], e.target.value)}
                          placeholder="Hướng dẫn XNK từ A-Z"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Ảnh nền Hero</label>
                        <ImageUpload
                          value={themeParams?.content?.hero?.image || ''}
                          onChange={(url) => updateThemeParam(['content', 'hero', 'image'], url)}
                          placeholder="Upload hero background image"
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
                      <div>
                        <label className="block text-sm font-medium mb-2">Màu nền</label>
                        <Input
                          type="color"
                          value={themeParams?.content?.hero?.backgroundColor || '#2D3748'}
                          onChange={(e) => updateThemeParam(['content', 'hero', 'backgroundColor'], e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Màu chữ</label>
                        <Input
                          type="color"
                          value={themeParams?.content?.hero?.textColor || '#FFFFFF'}
                          onChange={(e) => updateThemeParam(['content', 'hero', 'textColor'], e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* About Content */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Về chúng tôi</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề</label>
                        <Input
                          value={themeParams?.content?.about?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'about', 'title'], e.target.value)}
                          placeholder="Về Chúng Tôi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.about?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'about', 'description'], e.target.value)}
                          placeholder="Với hơn 20 năm kinh nghiệm trong ngành cà phê..."
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Màu nền</label>
                        <Input
                          type="color"
                          value={themeParams?.content?.about?.backgroundColor || '#FFFFFF'}
                          onChange={(e) => updateThemeParam(['content', 'about', 'backgroundColor'], e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Màu chữ</label>
                        <Input
                          type="color"
                          value={themeParams?.content?.about?.textColor || '#2D3748'}
                          onChange={(e) => updateThemeParam(['content', 'about', 'textColor'], e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Problems Content */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Thách thức/Vấn đề</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề section</label>
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
                          placeholder="Những khó khăn mà doanh nghiệp Việt Nam gặp phải..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Màu nền</label>
                        <Input
                          type="color"
                          value={themeParams?.content?.problems?.backgroundColor || '#FFF8DC'}
                          onChange={(e) => updateThemeParam(['content', 'problems', 'backgroundColor'], e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Màu chữ</label>
                        <Input
                          type="color"
                          value={themeParams?.content?.problems?.textColor || '#2D3748'}
                          onChange={(e) => updateThemeParam(['content', 'problems', 'textColor'], e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Vấn đề 1 - Tiêu đề</label>
                        <Input
                          value={themeParams?.content?.problems?.items?.[0]?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'problems', 'items', '0', 'title'], e.target.value)}
                          placeholder="Khó tiếp cận thị trường Mỹ"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Vấn đề 1 - Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.problems?.items?.[0]?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'problems', 'items', '0', 'description'], e.target.value)}
                          placeholder="Thiếu kết nối trực tiếp với nhà nhập khẩu..."
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Vấn đề 2 - Tiêu đề</label>
                        <Input
                          value={themeParams?.content?.problems?.items?.[1]?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'problems', 'items', '1', 'title'], e.target.value)}
                          placeholder="Thủ tục phức tạp"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Vấn đề 2 - Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.problems?.items?.[1]?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'problems', 'items', '1', 'description'], e.target.value)}
                          placeholder="Quy trình xuất khẩu, chứng nhận chất lượng..."
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Vấn đề 3 - Tiêu đề</label>
                        <Input
                          value={themeParams?.content?.problems?.items?.[2]?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'problems', 'items', '2', 'title'], e.target.value)}
                          placeholder="Giá cả không cạnh tranh"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Vấn đề 3 - Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.problems?.items?.[2]?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'problems', 'items', '2', 'description'], e.target.value)}
                          placeholder="Nhiều khâu trung gian làm tăng chi phí..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Solutions Content */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Giải pháp</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề section</label>
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
                          placeholder="Những giải pháp toàn diện để vượt qua thách thức..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Màu nền</label>
                        <Input
                          type="color"
                          value={themeParams?.content?.solutions?.backgroundColor || '#F0F8FF'}
                          onChange={(e) => updateThemeParam(['content', 'solutions', 'backgroundColor'], e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Màu chữ</label>
                        <Input
                          type="color"
                          value={themeParams?.content?.solutions?.textColor || '#2D3748'}
                          onChange={(e) => updateThemeParam(['content', 'solutions', 'textColor'], e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Giải pháp 1 - Tiêu đề</label>
                        <Input
                          value={themeParams?.content?.solutions?.items?.[0]?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'solutions', 'items', '0', 'title'], e.target.value)}
                          placeholder="Kết nối trực tiếp"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Giải pháp 1 - Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.solutions?.items?.[0]?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'solutions', 'items', '0', 'description'], e.target.value)}
                          placeholder="Mạng lưới đối tác nhập khẩu rộng khắp..."
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Giải pháp 1 - Lợi ích</label>
                        <Input
                          value={themeParams?.content?.solutions?.items?.[0]?.benefit || ''}
                          onChange={(e) => updateThemeParam(['content', 'solutions', 'items', '0', 'benefit'], e.target.value)}
                          placeholder="Tăng lợi nhuận 30-40%"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Products Content */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề section</label>
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
                          placeholder="Khám phá các loại cà phê đặc trưng của Việt Nam..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Testimonials Content */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Đánh giá & Chứng thực</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề section</label>
                        <Input
                          value={themeParams?.content?.testimonials?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'testimonials', 'title'], e.target.value)}
                          placeholder="Khách Hàng Nói Gì Về Chúng Tôi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.testimonials?.subtitle || ''}
                          onChange={(e) => updateThemeParam(['content', 'testimonials', 'subtitle'], e.target.value)}
                          placeholder="Lời chứng thực từ các đối tác và khách hàng quốc tế"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Màu nền</label>
                        <Input
                          type="color"
                          value={themeParams?.content?.testimonials?.backgroundColor || '#F5F5DC'}
                          onChange={(e) => updateThemeParam(['content', 'testimonials', 'backgroundColor'], e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Màu chữ</label>
                        <Input
                          type="color"
                          value={themeParams?.content?.testimonials?.textColor || '#2D3748'}
                          onChange={(e) => updateThemeParam(['content', 'testimonials', 'textColor'], e.target.value)}
                        />
                      </div>
                      
                      {/* Testimonial 1 */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Đánh giá 1</h4>
                        <div className="space-y-3">
                          <Input
                            value={themeParams?.content?.testimonials?.testimonials?.[0]?.name || ''}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', '0', 'name'], e.target.value)}
                            placeholder="Tên khách hàng"
                          />
                          <Input
                            value={themeParams?.content?.testimonials?.testimonials?.[0]?.position || ''}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', '0', 'position'], e.target.value)}
                            placeholder="Chức vụ"
                          />
                          <Input
                            value={themeParams?.content?.testimonials?.testimonials?.[0]?.company || ''}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', '0', 'company'], e.target.value)}
                            placeholder="Công ty"
                          />
                          <Textarea
                            value={themeParams?.content?.testimonials?.testimonials?.[0]?.content || ''}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', '0', 'content'], e.target.value)}
                            placeholder="Nội dung đánh giá"
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Testimonial 2 */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Đánh giá 2</h4>
                        <div className="space-y-3">
                          <Input
                            value={themeParams?.content?.testimonials?.testimonials?.[1]?.name || ''}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', '1', 'name'], e.target.value)}
                            placeholder="Tên khách hàng"
                          />
                          <Input
                            value={themeParams?.content?.testimonials?.testimonials?.[1]?.position || ''}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', '1', 'position'], e.target.value)}
                            placeholder="Chức vụ"
                          />
                          <Input
                            value={themeParams?.content?.testimonials?.testimonials?.[1]?.company || ''}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', '1', 'company'], e.target.value)}
                            placeholder="Công ty"
                          />
                          <Textarea
                            value={themeParams?.content?.testimonials?.testimonials?.[1]?.content || ''}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', '1', 'content'], e.target.value)}
                            placeholder="Nội dung đánh giá"
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Testimonial 3 */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Đánh giá 3</h4>
                        <div className="space-y-3">
                          <Input
                            value={themeParams?.content?.testimonials?.testimonials?.[2]?.name || ''}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', '2', 'name'], e.target.value)}
                            placeholder="Tên khách hàng"
                          />
                          <Input
                            value={themeParams?.content?.testimonials?.testimonials?.[2]?.position || ''}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', '2', 'position'], e.target.value)}
                            placeholder="Chức vụ"
                          />
                          <Input
                            value={themeParams?.content?.testimonials?.testimonials?.[2]?.company || ''}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', '2', 'company'], e.target.value)}
                            placeholder="Công ty"
                          />
                          <Textarea
                            value={themeParams?.content?.testimonials?.testimonials?.[2]?.content || ''}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', '2', 'content'], e.target.value)}
                            placeholder="Nội dung đánh giá"
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Thống kê</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Số liệu 1</label>
                            <Input
                              value={themeParams?.content?.testimonials?.stats?.[0]?.number || ''}
                              onChange={(e) => updateThemeParam(['content', 'testimonials', 'stats', '0', 'number'], e.target.value)}
                              placeholder="500+"
                            />
                            <Input
                              value={themeParams?.content?.testimonials?.stats?.[0]?.label || ''}
                              onChange={(e) => updateThemeParam(['content', 'testimonials', 'stats', '0', 'label'], e.target.value)}
                              placeholder="Lô hàng xuất khẩu"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Số liệu 2</label>
                            <Input
                              value={themeParams?.content?.testimonials?.stats?.[1]?.number || ''}
                              onChange={(e) => updateThemeParam(['content', 'testimonials', 'stats', '1', 'number'], e.target.value)}
                              placeholder="200+"
                            />
                            <Input
                              value={themeParams?.content?.testimonials?.stats?.[1]?.label || ''}
                              onChange={(e) => updateThemeParam(['content', 'testimonials', 'stats', '1', 'label'], e.target.value)}
                              placeholder="Khách hàng tin tưởng"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Số liệu 3</label>
                            <Input
                              value={themeParams?.content?.testimonials?.stats?.[2]?.number || ''}
                              onChange={(e) => updateThemeParam(['content', 'testimonials', 'stats', '2', 'number'], e.target.value)}
                              placeholder="15+"
                            />
                            <Input
                              value={themeParams?.content?.testimonials?.stats?.[2]?.label || ''}
                              onChange={(e) => updateThemeParam(['content', 'testimonials', 'stats', '2', 'label'], e.target.value)}
                              placeholder="Năm kinh nghiệm"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Số liệu 4</label>
                            <Input
                              value={themeParams?.content?.testimonials?.stats?.[3]?.number || ''}
                              onChange={(e) => updateThemeParam(['content', 'testimonials', 'stats', '3', 'number'], e.target.value)}
                              placeholder="98%"
                            />
                            <Input
                              value={themeParams?.content?.testimonials?.stats?.[3]?.label || ''}
                              onChange={(e) => updateThemeParam(['content', 'testimonials', 'stats', '3', 'label'], e.target.value)}
                              placeholder="Tỷ lệ hài lòng"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Footer Content */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Footer</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Logo Footer</label>
                        <ImageUpload
                          value={themeParams?.content?.footer?.logo || ''}
                          onChange={(url) => updateThemeParam(['content', 'footer', 'logo'], url)}
                          placeholder="Upload footer logo"
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
                        <label className="block text-sm font-medium mb-2">Mô tả công ty</label>
                        <Textarea
                          value={themeParams?.content?.footer?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'footer', 'description'], e.target.value)}
                          placeholder="Chuyên cung cấp cà phê chất lượng cao..."
                          rows={3}
                        />
                      </div>
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
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề Newsletter</label>
                        <Input
                          value={themeParams?.content?.footer?.newsletter?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'footer', 'newsletter', 'title'], e.target.value)}
                          placeholder="Nhận tin tức mới nhất"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả Newsletter</label>
                        <Input
                          value={themeParams?.content?.footer?.newsletter?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'footer', 'newsletter', 'description'], e.target.value)}
                          placeholder="Đăng ký để nhận cập nhật về sản phẩm mới"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Text nút Newsletter</label>
                        <Input
                          value={themeParams?.content?.footer?.newsletter?.buttonText || ''}
                          onChange={(e) => updateThemeParam(['content', 'footer', 'newsletter', 'buttonText'], e.target.value)}
                          placeholder="Đăng ký"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Copyright Text</label>
                        <Input
                          value={themeParams?.content?.footer?.legal?.copyright || ''}
                          onChange={(e) => updateThemeParam(['content', 'footer', 'legal', 'copyright'], e.target.value)}
                          placeholder="© 2024 Cà Phê Việt. Tất cả quyền được bảo lưu."
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="flex-1 bg-gray-100 overflow-auto">
            <div className="h-full">
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
        projectId={themeId}
        projectName={theme?.name || 'My Theme'}
      />
    </div>
  )
}

export default ThemeEditor 