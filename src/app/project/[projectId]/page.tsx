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
import DeployProjectDialog from '@/components/ui/export-project-dialog'
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

// Create default theme params
const createDefaultThemeParams = (): ThemeParams => ({
  colors: {
    primary: "#8B4513",
    secondary: "#D2691E", 
    accent: "#F4A460",
    background: "#FFFFFF",
    text: "#2D3748"
  },
  typography: {
    fontFamily: "Inter",
    fontSize: "16px",
    headingSize: "2xl",
    bodySize: "base",
    lineHeight: "1.6",
    fontWeight: "400"
  },
  layout: {
    containerWidth: "1200px",
    sectionSpacing: "80px",
    spacing: "comfortable",
    borderRadius: "8px"
  },
  components: {
    button: {
      style: "solid",
      size: "medium",
      rounded: true
    },
    card: {
      shadow: "medium",
      border: true,
      padding: "medium"
    },
    form: {
      style: "default",
      validation: "inline"
    },
    navigation: {
      style: "horizontal",
      sticky: true
    }
  },
  content: {
    meta: {
      title: "Cà Phê Việt Nam - Chất Lượng Quốc Tế",
      description: "Chuyên cung cấp cà phê Việt Nam chất lượng cao cho thị trường quốc tế",
      keywords: "cà phê việt nam, xuất khẩu cà phê, robusta, arabica"
    },
    header: {
      title: "Cà Phê Việt Plus",
      subtitle: "Premium Export Coffee",
      logo: ""
    },
    hero: {
      title: "Cà Phê Việt Nam - Chất Lượng Quốc Tế",
      subtitle: "Xuất khẩu cà phê chất lượng cao",
      description: "Chúng tôi chuyên cung cấp các loại cà phê Việt Nam chất lượng cao cho thị trường quốc tế, đảm bảo hương vị đặc trưng và tiêu chuẩn xuất khẩu.",
      ctaText: "Tìm hiểu thêm",
      backgroundImage: "/assets/hero-coffee.jpg",
      overlayOpacity: 0.7,
      overlayColor: "#8B4513"
    },
    about: {
      title: "Về Chúng Tôi",
      description: "Với hơn 20 năm kinh nghiệm trong ngành cà phê, chúng tôi tự hào là đối tác tin cậy của các nhà nhập khẩu quốc tế.",
      image: ""
    },
    problems: {
      title: "Thách Thức Hiện Tại",
      description: "Những khó khăn mà doanh nghiệp Việt Nam gặp phải khi xuất khẩu cà phê",
      backgroundColor: "#FFF8DC",
      textColor: "#2D3748",
      items: [
        {
          title: "Thiếu kết nối thị trường",
          description: "Doanh nghiệp Việt gặp khó khăn trong việc tiếp cận khách hàng quốc tế",
          icon: "AlertCircle"
        },
        {
          title: "Quy trình phức tạp",
          description: "Thủ tục xuất khẩu phức tạp, tốn thời gian và chi phí",
          icon: "Clock"
        },
        {
          title: "Giá cả không ổn định",
          description: "Biến động giá cả khiến khó lập kế hoạch kinh doanh dài hạn",
          icon: "TrendingDown"
        }
      ]
    },
    solutions: {
      title: "Giải Pháp Của Chúng Tôi",
      description: "Những giải pháp toàn diện để vượt qua thách thức và phát triển bền vững",
      backgroundColor: "#F0F8FF",
      textColor: "#2D3748",
      items: [
        {
          title: "Kết nối trực tiếp",
          description: "Mạng lưới đối tác nhập khẩu rộng khắp tại Mỹ, loại bỏ trung gian",
          benefit: "Tăng lợi nhuận 30-40%",
          icon: "Globe"
        },
        {
          title: "Hỗ trợ toàn diện",
          description: "Từ chứng nhận chất lượng đến logistics và thủ tục hải quan",
          benefit: "Tiết kiệm 80% thời gian",
          icon: "Shield"
        },
        {
          title: "Quy trình tối ưu",
          description: "Hệ thống quản lý hiện đại, theo dõi đơn hàng realtime",
          benefit: "Minh bạch 100%",
          icon: "Zap"
        }
      ]
    },
    cta: {
      title: "Sẵn sàng bắt đầu hành trình xuất khẩu?",
      description: "Tư vấn miễn phí về quy trình xuất khẩu cà phê sang Mỹ",
      buttonText: "Đăng ký tư vấn miễn phí",
      backgroundColor: "#8B4513",
      textColor: "#FFFFFF"
    },
    products: {
      title: "Sản Phẩm Của Chúng Tôi",
      description: "Khám phá các loại cà phê đặc trưng của Việt Nam",
      backgroundColor: "#F0F4F8",
      textColor: "#2D3748",
      items: [
        {
          name: "Cà Phê Robusta",
          description: "Cà phê Robusta Việt Nam với hương vị đậm đà, hàm lượng caffeine cao",
          price: "2.50 USD/kg",
          category: "Robusta",
          image: ""
        },
        {
          name: "Cà Phê Arabica",
          description: "Cà phê Arabica Tây Nguyên với hương vị tinh tế, chua nhẹ",
          price: "4.20 USD/kg",
          category: "Arabica",
          image: ""
        },
        {
          name: "Cà Phê Chồn",
          description: "Cà phê chồn cao cấp với hương vị độc đáo",
          price: "150 USD/kg",
          category: "Premium",
          image: ""
        }
      ]
    },
    footer: {
      companyName: "Cà Phê Việt",
      description: "Chuyên cung cấp cà phê chất lượng cao cho thị trường quốc tế",
      backgroundColor: "#D2691E",
      textColor: "#F9FAFB",
      contact: {
        phone: "+84 123 456 789",
        email: "info@capheviet.com",
        address: "123 Đường ABC, Quận 1, TP.HCM"
      }
    },
    testimonials: {
      title: "Khách Hàng Nói Gì Về Chúng Tôi",
      subtitle: "Lời chứng thực từ các đối tác và khách hàng quốc tế",
      backgroundColor: "#F5F5DC",
      textColor: "#2D3748",
      testimonials: [
        {
          name: "Sarah Johnson",
          position: "Coffee Buyer",
          company: "Starbucks Reserve",
          content: "Chất lượng cà phê Việt Nam vượt trội hơn mong đợi. Hương vị đậm đà và quy trình sản xuất rất chuyên nghiệp.",
          rating: 5,
          avatar: "SJ"
        },
        {
          name: "Michael Chen",
          position: "Quality Manager",
          company: "Blue Bottle Coffee",
          content: "Đối tác tin cậy với cam kết chất lượng cao. Giao hàng đúng hạn và dịch vụ khách hàng xuất sắc.",
          rating: 5,
          avatar: "MC"
        },
        {
          name: "David Rodriguez",
          position: "Import Director",
          company: "Intelligentsia",
          content: "Cà phê Robusta Việt Nam có hương vị độc đáo, phù hợp hoàn hảo cho blend espresso của chúng tôi.",
          rating: 5,
          avatar: "DR"
        }
      ],

      stats: [
        { number: "500+", label: "Lô hàng xuất khẩu" },
        { number: "200+", label: "Khách hàng tin tưởng" },
        { number: "15+", label: "Năm kinh nghiệm" },
        { number: "98%", label: "Tỷ lệ hài lòng" }
      ]
    }
  }
})

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
  const [showDeployDialog, setShowDeployDialog] = useState(false)
  
  // Undo/Redo functionality
  const {
    state: themeParamsWithHistory,
    updateState: updateThemeParamsWithHistory,
    undo,
    redo,
    canUndo,
    canRedo
  } = useUndoRedo<ThemeParams | null>(null)

  // Load project data function
  const loadProject = async () => {
    try {
      console.log('Loading project data for:', projectId)
      const response = await fetch(`/api/projects/${projectId}`)
      const data = await response.json()
      
      if (data.success) {
        console.log('Project loaded successfully:', data.project)
        setProject(data.project)
        
        // Use latest version or create default params
        const latestVersion = data.project.versions[0]
        let params: ThemeParams
        
        if (latestVersion && latestVersion.snapshot) {
          console.log('Using latest version snapshot:', latestVersion)
          params = latestVersion.snapshot as ThemeParams
        } else if (data.project.theme.defaultParams) {
          try {
            const parsedParams = typeof data.project.theme.defaultParams === 'string' 
              ? JSON.parse(data.project.theme.defaultParams) 
              : data.project.theme.defaultParams
            params = { ...createDefaultThemeParams(), ...parsedParams }
          } catch {
            params = createDefaultThemeParams()
          }
        } else {
          params = createDefaultThemeParams()
        }
        
        // Deep merge with default params to ensure all required properties exist
        const defaultParams = createDefaultThemeParams()
        
        params = {
          ...defaultParams,
          ...params,
          colors: { 
            ...defaultParams.colors,  // Base colors
            ...params.colors          // AI colors override defaults (higher priority)
          },
          typography: { ...defaultParams.typography, ...params.typography },
          layout: { ...defaultParams.layout, ...params.layout },
          components: { ...defaultParams.components, ...params.components },
          content: {
            ...defaultParams.content,
            ...params.content,
            // Deep merge for nested content objects
            meta: { ...defaultParams.content?.meta, ...params.content?.meta },
            header: { ...defaultParams.content?.header, ...params.content?.header },
            hero: { ...defaultParams.content?.hero, ...params.content?.hero },
            about: { ...defaultParams.content?.about, ...params.content?.about },
            problems: { 
              ...defaultParams.content?.problems, 
              ...params.content?.problems,
              items: params.content?.problems?.items || defaultParams.content?.problems?.items
            },
            solutions: { 
              ...defaultParams.content?.solutions, 
              ...params.content?.solutions,
              items: params.content?.solutions?.items || defaultParams.content?.solutions?.items
            },
            products: { 
              ...defaultParams.content?.products, 
              ...params.content?.products,
              items: params.content?.products?.items || defaultParams.content?.products?.items
            },
            cta: { ...defaultParams.content?.cta, ...params.content?.cta },
            testimonials: { 
              ...defaultParams.content?.testimonials, 
              ...params.content?.testimonials,
              testimonials: params.content?.testimonials?.testimonials || defaultParams.content?.testimonials?.testimonials,
              partners: params.content?.testimonials?.partners || defaultParams.content?.testimonials?.partners,
              stats: params.content?.testimonials?.stats || defaultParams.content?.testimonials?.stats
            },
            footer: { 
              ...defaultParams.content?.footer, 
              ...params.content?.footer,
              contact: { 
                ...defaultParams.content?.footer?.contact, 
                ...params.content?.footer?.contact 
              }
            }
          }
        }
        
        console.log('Final merged params:', params)
        setThemeParams(params)
        updateThemeParamsWithHistory(params)
      }
    } catch (error) {
      console.error('Error loading project:', error)
      // Fallback to default params
      const defaultParams = createDefaultThemeParams()
      setThemeParams(defaultParams)
      updateThemeParamsWithHistory(defaultParams)
    } finally {
      setLoading(false)
    }
  }

  // Load project data on mount
  useEffect(() => {
    if (projectId) {
      loadProject()
    }
  }, [projectId])

  // Check for updated query param and reload if needed
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const updatedParam = urlParams.get('updated')
    
    if (updatedParam && projectId) {
      console.log('Detected update parameter, reloading project data...')
      // Remove the query param from URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
      // Reload project data
      setTimeout(() => {
        loadProject()
      }, 100)
    }
  }, [projectId])

  // Force reload when page becomes visible (useful when returning from AI)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && projectId) {
        console.log('Page became visible, reloading project data...')
        loadProject()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
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
      
      // Handle case where array element might be a string instead of object
      if (!isNaN(Number(path[i])) && Array.isArray(current[path[i]])) {
        const arrayIndex = Number(path[i])
        const array = current[path[i]] as unknown[]
        
        // If the element at this index is a string, convert it to an object
        if (typeof array[arrayIndex] === 'string') {
          array[arrayIndex] = { name: array[arrayIndex] as string }
        }
        
        // If the element doesn't exist, create a default object
        if (array[arrayIndex] === undefined) {
          array[arrayIndex] = { name: '' }
        }
        
        // Set current to the array element (object) instead of the array itself
        current = array[arrayIndex] as Record<string, unknown>
      } else {
        current = current[path[i]] as Record<string, unknown>
      }
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
        setTimeout(() => setSaveMessage(''), 15000)
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
              onClick={() => setShowDeployDialog(true)}
              style={{ backgroundColor: themeParams?.colors?.primary || '#8B4513' }}
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
                            value={themeParams.colors?.primary || '#8B4513'}
                            onChange={(e) => updateThemeParam(['colors', 'primary'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams.colors?.primary || '#8B4513'}
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
                            value={themeParams.colors?.secondary || '#D2691E'}
                            onChange={(e) => updateThemeParam(['colors', 'secondary'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams.colors?.secondary || '#D2691E'}
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
                            value={themeParams.colors?.accent || '#F4A460'}
                            onChange={(e) => updateThemeParam(['colors', 'accent'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams.colors?.accent || '#F4A460'}
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
                            value={themeParams.colors?.background || '#FFFFFF'}
                            onChange={(e) => updateThemeParam(['colors', 'background'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams.colors?.background || '#FFFFFF'}
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
                            value={themeParams.colors?.text || '#2D3748'}
                            onChange={(e) => updateThemeParam(['colors', 'text'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams.colors?.text || '#2D3748'}
                            onChange={(e) => updateThemeParam(['colors', 'text'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Màu viền</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams.colors?.border || '#E2E8F0'}
                            onChange={(e) => updateThemeParam(['colors', 'border'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams.colors?.border || '#E2E8F0'}
                            onChange={(e) => updateThemeParam(['colors', 'border'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Màu mờ</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams.colors?.muted || '#718096'}
                            onChange={(e) => updateThemeParam(['colors', 'muted'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams.colors?.muted || '#718096'}
                            onChange={(e) => updateThemeParam(['colors', 'muted'], e.target.value)}
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
                          value={themeParams.typography?.fontFamily || 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'}
                          onChange={(e) => updateThemeParam(['typography', 'fontFamily'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value='ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'>System Default</option>
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
                          value={themeParams.typography?.headingSize || '2xl'}
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
                        <label className="block text-sm font-medium mb-2">Heading Weight</label>
                        <select
                          value={themeParams.typography?.fontSize || '16px'}
                          onChange={(e) => updateThemeParam(['typography', 'fontSize'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="12px">12px</option>
                          <option value="14px">14px</option>
                          <option value="16px">16px</option>
                          <option value="18px">18px</option>
                          <option value="20px">20px</option>
                          <option value="22px">22px</option>
                          <option value="24px">24px</option>
                          <option value="26px">26px</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Body Size</label>
                        <select
                          value={themeParams.typography?.bodySize || 'base'}
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
                      <div>
                        <label className="block text-sm font-medium mb-2">Line Height</label>
                        <select
                          value={themeParams.typography?.lineHeight || '1.6'}
                          onChange={(e) => updateThemeParam(['typography', 'lineHeight'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="1.2">1.2 (Tight)</option>
                          <option value="1.4">1.4 (Normal)</option>
                          <option value="1.6">1.6 (Comfortable)</option>
                          <option value="1.8">1.8 (Loose)</option>
                          <option value="2.0">2.0 (Very Loose)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Font Weight</label>
                        <select
                          value={themeParams.typography?.fontWeight || '400'}
                          onChange={(e) => updateThemeParam(['typography', 'fontWeight'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="300">Light (300)</option>
                          <option value="400">Normal (400)</option>
                          <option value="500">Medium (500)</option>
                          <option value="600">Semi Bold (600)</option>
                          <option value="700">Bold (700)</option>
                          <option value="800">Extra Bold (800)</option>
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
                          value={themeParams.layout?.containerWidth || '1200px'}
                          onChange={(e) => updateThemeParam(['layout', 'containerWidth'], e.target.value)}
                          placeholder="1200px"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Spacing</label>
                        <select
                          value={themeParams.layout?.spacing || 'comfortable'}
                          onChange={(e) => updateThemeParam(['layout', 'spacing'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="minimal">Minimal</option>
                          <option value="comfortable">Comfortable</option>
                          <option value="spacious">Spacious</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Section Spacing</label>
                        <Input
                          value={themeParams.layout?.sectionSpacing || '80px'}
                          onChange={(e) => updateThemeParam(['layout', 'sectionSpacing'], e.target.value)}
                          placeholder="80px"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Border Radius</label>
                        <select
                          value={themeParams.layout?.borderRadius || '8px'}
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

                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Button Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Button Style</label>
                        <select
                          value={themeParams.components?.button?.style || 'solid'}
                          onChange={(e) => updateThemeParam(['components', 'button', 'style'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="solid">Solid</option>
                          <option value="outline">Outline</option>
                          <option value="ghost">Ghost</option>
                          <option value="gradient">Gradient</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Button Size</label>
                        <select
                          value={themeParams.components?.button?.size || 'medium'}
                          onChange={(e) => updateThemeParam(['components', 'button', 'size'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="buttonRounded"
                          checked={themeParams.components?.button?.rounded || false}
                          onChange={(e) => updateThemeParam(['components', 'button', 'rounded'], e.target.checked.toString())}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="buttonRounded" className="text-sm font-medium">
                          Rounded Buttons
                        </label>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Card Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Card Shadow</label>
                        <select
                          value={themeParams.components?.card?.shadow || 'medium'}
                          onChange={(e) => updateThemeParam(['components', 'card', 'shadow'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="none">None</option>
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="cardBorder"
                          checked={themeParams.components?.card?.border || false}
                          onChange={(e) => updateThemeParam(['components', 'card', 'border'], e.target.checked.toString())}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="cardBorder" className="text-sm font-medium">
                          Show Card Border
                        </label>
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
                        <div className="mb-2">
                          <p className="text-xs text-gray-500">Gợi ý: 200x80px hoặc 160x60px (tỷ lệ 2.5:1)</p>
                        </div>
                        <ImageUpload
                          value={themeParams?.content?.header?.logo || ''}
                          onChange={(url) => updateThemeParam(['content', 'header', 'logo'], url)}
                          placeholder="Upload logo công ty"
                          recommendedSize="200x80px hoặc 160x60px"
                          aspectRatio="2.5:1"
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
                        <div className="mb-2">
                          <p className="text-xs text-gray-500">Gợi ý: 1920x1080px hoặc 1600x900px (tỷ lệ 16:9)</p>
                        </div>
                        <ImageUpload
                          value={themeParams?.content?.hero?.backgroundImage || ''}
                          onChange={(url) => updateThemeParam(['content', 'hero', 'backgroundImage'], url)}
                          placeholder="Upload hình ảnh nền hero"
                          recommendedSize="1920x1080px hoặc 1600x900px"
                          aspectRatio="16:9"
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
                        <div className="mb-2">
                          <p className="text-xs text-gray-500">Gợi ý: 600x400px hoặc 800x600px (tỷ lệ 3:2 hoặc 4:3)</p>
                        </div>
                        <ImageUpload
                          value={themeParams?.content?.about?.image || ''}
                          onChange={(url) => updateThemeParam(['content', 'about', 'image'], url)}
                          placeholder="Upload hình ảnh về công ty"
                          recommendedSize="600x400px hoặc 800x600px"
                          aspectRatio="3:2 hoặc 4:3"
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

                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Đánh giá & Chứng thực</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề</label>
                        <Input
                          value={themeParams?.content?.testimonials?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'testimonials', 'title'], e.target.value)}
                          placeholder="Khách Hàng Nói Gì Về Chúng Tôi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <Input
                          value={themeParams?.content?.testimonials?.subtitle || ''}
                          onChange={(e) => updateThemeParam(['content', 'testimonials', 'subtitle'], e.target.value)}
                          placeholder="Lời chứng thực từ các đối tác và khách hàng quốc tế"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Background Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams?.content?.testimonials?.backgroundColor || '#F5F5DC'}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'backgroundColor'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams?.content?.testimonials?.backgroundColor || '#F5F5DC'}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'backgroundColor'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Text Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={themeParams?.content?.testimonials?.textColor || '#2D3748'}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'textColor'], e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={themeParams?.content?.testimonials?.textColor || '#2D3748'}
                            onChange={(e) => updateThemeParam(['content', 'testimonials', 'textColor'], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Testimonials Items */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Đánh giá khách hàng</h3>
                    <div className="space-y-4">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Đánh giá {index + 1}</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Tên khách hàng</label>
                              <Input
                                value={themeParams?.content?.testimonials?.testimonials?.[index]?.name || ''}
                                onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', index.toString(), 'name'], e.target.value)}
                                placeholder="Tên khách hàng"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Chức vụ</label>
                              <Input
                                value={themeParams?.content?.testimonials?.testimonials?.[index]?.position || ''}
                                onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', index.toString(), 'position'], e.target.value)}
                                placeholder="Coffee Buyer"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Công ty</label>
                              <Input
                                value={themeParams?.content?.testimonials?.testimonials?.[index]?.company || ''}
                                onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', index.toString(), 'company'], e.target.value)}
                                placeholder="Starbucks Reserve"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Nội dung đánh giá</label>
                              <Textarea
                                value={themeParams?.content?.testimonials?.testimonials?.[index]?.content || ''}
                                onChange={(e) => updateThemeParam(['content', 'testimonials', 'testimonials', index.toString(), 'content'], e.target.value)}
                                placeholder="Nội dung đánh giá của khách hàng"
                                rows={3}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Hình ảnh đại diện</label>
                              <div className="mb-2">
                                <p className="text-xs text-gray-500">Gợi ý: 100x100px hoặc 200x200px (tỷ lệ 1:1)</p>
                              </div>
                              <ImageUpload
                                value={themeParams?.content?.testimonials?.testimonials?.[index]?.avatarImage || ''}
                                onChange={(url) => updateThemeParam(['content', 'testimonials', 'testimonials', index.toString(), 'avatarImage'], url)}
                                placeholder="Upload hình ảnh đại diện"
                                recommendedSize="100x100px hoặc 200x200px"
                                aspectRatio="1:1"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>



                  {/* Statistics */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Thống kê</h3>
                    <div className="space-y-4">
                      {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Thống kê {index + 1}</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Số liệu</label>
                              <Input
                                value={themeParams?.content?.testimonials?.stats?.[index]?.number || ''}
                                onChange={(e) => updateThemeParam(['content', 'testimonials', 'stats', index.toString(), 'number'], e.target.value)}
                                placeholder="500+"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Nhãn</label>
                              <Input
                                value={themeParams?.content?.testimonials?.stats?.[index]?.label || ''}
                                onChange={(e) => updateThemeParam(['content', 'testimonials', 'stats', index.toString(), 'label'], e.target.value)}
                                placeholder="Lô hàng xuất khẩu"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
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
                    <h3 className="text-lg font-semibold mb-4">Dịch Vụ Xuất Khẩu</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tiêu đề chính</label>
                        <Input
                          value={themeParams?.content?.products?.title || ''}
                          onChange={(e) => updateThemeParam(['content', 'products', 'title'], e.target.value)}
                          placeholder="Dịch Vụ Xuất Khẩu Toàn Diện"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <Textarea
                          value={themeParams?.content?.products?.description || ''}
                          onChange={(e) => updateThemeParam(['content', 'products', 'description'], e.target.value)}
                          placeholder="Từ sản phẩm cà phê chất lượng cao đến dịch vụ logistics và tư vấn chuyên sâu, chúng tôi cung cấp giải pháp một cửa cho việc xuất khẩu sang Mỹ."
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

                  {/* Service Items */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Danh sách dịch vụ</h3>
                    <div className="space-y-4">
                      {[
                        { index: 0, name: "Cà Phê Chất Lượng Cao", icon: "Coffee" },
                        { index: 1, name: "Logistics & Vận Chuyển", icon: "Truck" },
                        { index: 2, name: "Tư Vấn Thủ Tục", icon: "FileCheck" },
                        { index: 3, name: "Đào Tạo & Phát Triển", icon: "Users" },
                        { index: 4, name: "Tư Vấn Chiến Lược", icon: "Lightbulb" },
                        { index: 5, name: "Kiểm Soát Chất Lượng", icon: "Shield" }
                      ].map((service) => (
                        <div key={service.index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">{service.name}</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                              <Input
                                value={themeParams?.content?.products?.items?.[service.index]?.name || service.name}
                                onChange={(e) => updateThemeParam(['content', 'products', 'items', service.index.toString(), 'name'], e.target.value)}
                                placeholder={service.name}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Mô tả</label>
                              <Textarea
                                value={themeParams?.content?.products?.items?.[service.index]?.description || ''}
                                onChange={(e) => updateThemeParam(['content', 'products', 'items', service.index.toString(), 'description'], e.target.value)}
                                placeholder="Mô tả dịch vụ"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Hình ảnh dịch vụ</label>
                              <div className="mb-2">
                                <p className="text-xs text-gray-500">Gợi ý: 400x300px hoặc 600x450px (tỷ lệ 4:3)</p>
                              </div>
                              <ImageUpload
                                value={themeParams?.content?.products?.items?.[service.index]?.image || ''}
                                onChange={(url) => updateThemeParam(['content', 'products', 'items', service.index.toString(), 'image'], url)}
                                placeholder="Upload hình ảnh dịch vụ"
                                recommendedSize="400x300px hoặc 600x450px"
                                aspectRatio="4:3"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Danh mục</label>
                              <Input
                                value={themeParams?.content?.products?.items?.[service.index]?.category || service.icon}
                                onChange={(e) => updateThemeParam(['content', 'products', 'items', service.index.toString(), 'category'], e.target.value)}
                                placeholder={service.icon}
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
                        <div className="mb-2">
                          <p className="text-xs text-gray-500">Gợi ý: 180x72px hoặc 150x60px (tỷ lệ 2.5:1)</p>
                        </div>
                        <ImageUpload
                          value={themeParams?.content?.footer?.logo || ''}
                          onChange={(url) => updateThemeParam(['content', 'footer', 'logo'], url)}
                          placeholder="Upload logo footer"
                          recommendedSize="180x72px hoặc 150x60px"
                          aspectRatio="2.5:1"
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
                        <div className="mb-2">
                          <p className="text-xs text-gray-500">Gợi ý: 32x32px hoặc 16x16px (định dạng .ico, .png)</p>
                        </div>
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

      {/* Deploy Project Dialog */}
      <DeployProjectDialog
        open={showDeployDialog}
        onOpenChange={setShowDeployDialog}
        themeParams={themeParams}
        projectId={projectId}
        projectName={project?.name || 'My Project'}
      />
    </div>
  )
}

export default ProjectEditor 