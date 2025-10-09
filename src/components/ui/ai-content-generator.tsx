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
import { Wand2, Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { ThemeParams } from '@/types'

interface BusinessInfo {
  companyName: string
  industry: string
  description: string
  targetAudience: string
  services: string
  location: string
  website?: string
  tone: 'professional' | 'friendly' | 'modern' | 'traditional'
  language: 'vietnamese' | 'english' | 'both'
}

interface AIContentGeneratorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (themeParams: ThemeParams) => void
  currentTheme?: ThemeParams
  forceOpen?: boolean
  projectId?: string
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  open,
  onOpenChange,
  onGenerate,
  currentTheme,
  forceOpen = false,
  projectId
}) => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    companyName: '',
    industry: '',
    description: '',
    targetAudience: '',
    services: '',
    location: '',
    website: '',
    tone: 'professional',
    language: 'vietnamese'
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'form' | 'preview' | 'success'>('form')
  const [generatedContent, setGeneratedContent] = useState<ThemeParams | null>(null)
  const [retryAttempt, setRetryAttempt] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateContent = async (retryCount = 0): Promise<void> => {
    if (!businessInfo.companyName || !businessInfo.industry || !businessInfo.description) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    const maxRetries = 3
    setIsGenerating(true)
    setError('')
    setRetryAttempt(retryCount)
    
    // Enhanced progress messages
    if (retryCount === 0) {
      setProgressMessage('🚀 Đang gửi yêu cầu đến AI...')
    } else {
      setProgressMessage(`🔄 Đang thử lại lần ${retryCount + 1}... (AI có thể cần nhiều thời gian hơn)`)
    }

    try {
      const requestData = { businessInfo, currentTheme }
      console.log(`🚀 [AI-GENERATOR] Sending request (attempt ${retryCount + 1}/${maxRetries + 1}):`, requestData)
      
      // Update progress messages gradually
      const progressTimeouts: NodeJS.Timeout[] = []
      progressTimeouts.push(setTimeout(() => {
        setProgressMessage('🤖 AI đang phân tích thông tin doanh nghiệp của bạn...')
      }, 5000))
      
      progressTimeouts.push(setTimeout(() => {
        setProgressMessage('✨ AI đang tạo nội dung và màu sắc phù hợp...')
      }, 15000))
      
      progressTimeouts.push(setTimeout(() => {
        setProgressMessage('📝 AI đang hoàn thiện các section chi tiết...')
      }, 30000))
      
      progressTimeouts.push(setTimeout(() => {
        setProgressMessage('⏳ Sắp xong rồi... AI đang kiểm tra và tối ưu nội dung...')
      }, 60000))
      
      progressTimeouts.push(setTimeout(() => {
        setProgressMessage('🕐 AI vẫn đang xử lý... Đây là một request phức tạp, vui lòng kiên nhẫn...')
      }, 90000))
      
      progressTimeouts.push(setTimeout(() => {
        setProgressMessage('⏰ Gần hoàn thành... AI đang tổng hợp tất cả nội dung...')
      }, 120000))
      
      // Tăng timeout cho fetch request lên 180 giây (3 phút)
      const controller = new AbortController()
      const fetchTimeoutId = setTimeout(() => controller.abort(), 180000) // 180 seconds timeout
      
      const response = await fetch('/api/generate-theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      })
      
      // Clear all timeouts
      clearTimeout(fetchTimeoutId)
      progressTimeouts.forEach(t => clearTimeout(t))
      
      console.log('📡 [AI-GENERATOR] Response status:', response.status, response.statusText)
      setProgressMessage('📦 Đang xử lý và định dạng dữ liệu...')

      // Xử lý 504 Gateway Timeout với retry logic
      if (response.status === 504) {
        console.warn(`⏱️ [AI-GENERATOR] Gateway timeout (attempt ${retryCount + 1}/${maxRetries + 1})`)
        
        if (retryCount < maxRetries) {
          // Exponential backoff: 3s, 6s, 12s
          const backoffDelay = Math.pow(2, retryCount) * 3000
          setError(
            `⏱️ Server đang xử lý yêu cầu của bạn...\n\n` +
            `🔄 Đang thử lại lần ${retryCount + 2}/${maxRetries + 1} sau ${backoffDelay / 1000}s\n\n` +
            `💡 AI đang phân tích và tạo nội dung chi tiết cho doanh nghiệp của bạn. Vui lòng đợi thêm chút...`
          )
          
          await new Promise(resolve => setTimeout(resolve, backoffDelay))
          return generateContent(retryCount + 1)
        } else {
          throw new Error(
            `⏱️ **Timeout: Server mất nhiều thời gian xử lý hơn dự kiến**\n\n` +
            `❌ **Nguyên nhân có thể:**\n` +
            `• Server đang quá tải với nhiều yêu cầu đồng thời\n` +
            `• Thông tin business quá phức tạp cần nhiều thời gian xử lý\n` +
            `• Kết nối đến AI service bị gián đoạn\n\n` +
            `✅ **Giải pháp đề xuất:**\n` +
            `1️⃣ Thử lại với **mô tả ngắn gọn hơn** (3-5 câu)\n` +
            `2️⃣ Chỉ điền **thông tin bắt buộc** (tên, ngành nghề, mô tả)\n` +
            `3️⃣ Thử lại sau **2-3 phút** khi server bớt tải\n` +
            `4️⃣ Sử dụng **API Streaming** (tính năng mới, ít bị timeout)\n\n` +
            `📞 Nếu vấn đề tiếp diễn, vui lòng liên hệ hỗ trợ kỹ thuật.`
          )
        }
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error('🚨 [AI-GENERATOR] HTTP Error:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        })
        
        // Xử lý các lỗi khác với retry cho 503
        if (response.status === 503 && retryCount < maxRetries) {
          const backoffDelay = Math.pow(2, retryCount) * 2000
          setError(`🔄 Service tạm thời không khả dụng. Đang thử lại sau ${backoffDelay / 1000}s...`)
          await new Promise(resolve => setTimeout(resolve, backoffDelay))
          return generateContent(retryCount + 1)
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}\n\nChi tiết: ${errorText}`)
      }

      const result = await response.json()
      console.log('✅ [AI-GENERATOR] Response received:', result)
      
      // Check if response has themeParams (success) or explicit success flag
      if (result.success || result.themeParams) {
        // Log cache info if available
        if (result.cached || result.cacheHit) {
          console.log('💾 [AI-GENERATOR] Served from cache:', {
            cachedAt: result.cachedAt,
            servedAt: result.servedAt,
            cacheHit: result.cacheHit
          })
        }
        
        setGeneratedContent(result.themeParams)
        setStep('preview')
      } else {
        // Handle specific error types
        if (result.errorType === 'AI_SERVICE_UNAVAILABLE') {
          throw new Error(`${result.error}\n\n${result.suggestion || ''}`)
        } else if (result.errorType === 'QUOTA_EXCEEDED') {
          throw new Error(`${result.error}\n\nVui lòng thử lại sau ${Math.ceil(result.retryAfter / 60)} phút.`)
        } else if (result.errorType === 'QUEUE_OVERLOADED') {
          throw new Error(
            `⚠️ Hệ thống đang xử lý nhiều yêu cầu.\n\n` +
            `Vui lòng thử lại sau ${Math.ceil(result.retryAfter / 60)} phút.\n\n` +
            `Trạng thái hàng đợi:\n` +
            `• Đang xử lý: ${result.queueStats?.activeTasks || 0} yêu cầu\n` +
            `• Đang chờ: ${result.queueStats?.queuedTasks || 0} yêu cầu`
          )
        } else {
          throw new Error(result.error || 'Có lỗi xảy ra khi tạo nội dung. Vui lòng thử lại.')
        }
      }
    } catch (err) {
      console.error('🚨 [AI-GENERATOR] Generation error:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : 'No stack trace',
        businessInfo: businessInfo,
        currentTheme: currentTheme,
        retryCount
      })
      
      // Handle AbortError (client-side timeout)
      if (err instanceof Error && err.name === 'AbortError') {
        if (retryCount < maxRetries) {
          const backoffDelay = Math.pow(2, retryCount) * 3000
          setError(
            `⏱️ **Request đang xử lý quá lâu...**\n\n` +
            `🔄 Đang thử lại lần ${retryCount + 2}/${maxRetries + 1} sau ${backoffDelay / 1000}s\n\n` +
            `💡 Yêu cầu của bạn đang được xử lý, vui lòng kiên nhẫn...`
          )
          await new Promise(resolve => setTimeout(resolve, backoffDelay))
          return generateContent(retryCount + 1)
        } else {
          setError(
            `⏱️ **Request timeout sau ${maxRetries + 1} lần thử (180 giây/3 phút mỗi lần)**\n\n` +
            `❌ **Nguyên nhân:**\n` +
            `• AI service đang xử lý quá lâu (>180s)\n` +
            `• Thông tin business có thể quá chi tiết\n` +
            `• Kết nối mạng không ổn định\n` +
            `• Server AI đang quá tải\n\n` +
            `✅ **Giải pháp:**\n` +
            `1️⃣ **Rút gọn mô tả** business xuống 3-5 câu ngắn gọn\n` +
            `2️⃣ **Bỏ qua** các trường không bắt buộc (website, location...)\n` +
            `3️⃣ **Thử lại sau 2-3 phút** khi server bớt tải\n` +
            `4️⃣ **Kiểm tra kết nối internet** của bạn\n\n` +
            `📧 Liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.`
          )
        }
      } else {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo nội dung')
      }
    } finally {
      setIsGenerating(false)
      setRetryAttempt(0)
      setProgressMessage('')
    }
  }

  const applyContent = async () => {
    if (generatedContent) {
      // Lưu language vào project nếu có projectId
      if (projectId) {
        try {
          await fetch(`/api/projects/${projectId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              language: businessInfo.language
            })
          })
        } catch (error) {
          console.error('Error saving language to project:', error)
        }
      }
      
      onGenerate(generatedContent)
      setStep('success')
      setTimeout(() => {
        onOpenChange(false)
        setStep('form')
        setGeneratedContent(null)
      }, 2000)
    }
  }

  const resetForm = () => {
    setStep('form')
    setGeneratedContent(null)
    setError('')
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen: boolean) => {
        // Nếu forceOpen = true và đang ở step form, không cho phép đóng
        if (forceOpen && step === 'form' && !newOpen) {
          return
        }
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-purple-600" />
                AI Tạo Nội Dung Thông Minh
              </DialogTitle>
              <DialogDescription>
                {forceOpen ? (
                  <div className="space-y-2">
                    <span className="text-orange-600 font-medium block">
                      ⚠️ Vui lòng điền thông tin bắt buộc để tiếp tục tạo project
                    </span>
                    <span className="text-sm text-gray-600 block">
                      Bạn không thể đóng popup này cho đến khi hoàn thành việc điền thông tin và tạo nội dung AI.
                    </span>
                  </div>
                ) : (
                  'Nhập thông tin doanh nghiệp để AI tự động tạo nội dung và màu sắc phù hợp cho website của bạn'
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin cơ bản *</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tên công ty *</label>
                    <Input
                      value={businessInfo.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Ví dụ: Cà Phê Việt Plus"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Ngành nghề *</label>
                    <Input
                      value={businessInfo.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      placeholder="Ví dụ: Xuất khẩu cà phê, Thương mại điện tử, Công nghệ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Mô tả doanh nghiệp *</label>
                    <Textarea
                      value={businessInfo.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Mô tả ngắn gọn về công ty, sản phẩm/dịch vụ chính..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Target & Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Khách hàng & Dịch vụ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Khách hàng mục tiêu</label>
                    <Input
                      value={businessInfo.targetAudience}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                      placeholder="Ví dụ: Nhà nhập khẩu quốc tế, Doanh nghiệp SME, Khách hàng cá nhân"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sản phẩm/Dịch vụ chính</label>
                    <Textarea
                      value={businessInfo.services}
                      onChange={(e) => handleInputChange('services', e.target.value)}
                      placeholder="Liệt kê các sản phẩm/dịch vụ chính..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Địa điểm</label>
                    <Input
                      value={businessInfo.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Ví dụ: TP. Hồ Chí Minh, Việt Nam"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Website hiện tại (nếu có)</label>
                    <Input
                      value={businessInfo.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Style Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Phong cách & Ngôn ngữ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tông giọng</label>
                    <select
                      value={businessInfo.tone}
                      onChange={(e) => handleInputChange('tone', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="professional">Chuyên nghiệp</option>
                      <option value="friendly">Thân thiện</option>
                      <option value="modern">Hiện đại</option>
                      <option value="traditional">Truyền thống</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Ngôn ngữ</label>
                    <select
                      value={businessInfo.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="vietnamese">Tiếng Việt</option>
                      <option value="english">English</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Tips to avoid timeout - Show when not generating */}
              {!isGenerating && !error && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">💡 Tips để tạo nội dung nhanh và chính xác:</p>
                      <ul className="text-xs text-blue-800 mt-2 space-y-1 ml-1">
                        <li>✅ Mô tả ngắn gọn, súc tích (3-5 câu)</li>
                        <li>✅ Tập trung vào điểm mạnh chính của doanh nghiệp</li>
                        <li>✅ Chỉ điền thông tin bắt buộc nếu muốn tạo nhanh</li>
                        <li>⚠️ Tránh mô tả quá dài (&gt;500 từ) để không bị timeout</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Message when generating */}
              {isGenerating && progressMessage && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">{progressMessage}</p>
                    {retryAttempt > 0 && (
                      <p className="text-xs text-blue-700 mt-1">
                        Lần thử: {retryAttempt + 1}/4 | AI đang xử lý thông tin của bạn...
                      </p>
                    )}
                    <p className="text-xs text-blue-600 mt-2">
                      ⏱️ Thời gian xử lý thường: 30-60 giây | Tối đa: 180 giây (3 phút)
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{error}</p>
                    </div>
                  </div>
                  {!isGenerating && (
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => generateContent(0)}
                        disabled={isGenerating}
                        className="text-sm"
                      >
                        <Loader2 className="h-4 w-4 mr-2" />
                        Thử lại
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              {!forceOpen ? (
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Hủy
                </Button>
              ) : (
                <div className="text-sm text-orange-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Vui lòng hoàn thành thông tin để tiếp tục
                </div>
              )}
              <Button 
                onClick={() => generateContent(0)}
                disabled={isGenerating || !businessInfo.companyName || !businessInfo.industry || !businessInfo.description}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {retryAttempt > 0 ? `Đang thử lại (${retryAttempt + 1}/4)...` : 'Đang tạo nội dung...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Tạo nội dung AI
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'preview' && generatedContent && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                Nội dung đã được tạo thành công!
              </DialogTitle>
              <DialogDescription>
                Xem trước nội dung và màu sắc AI đề xuất cho website của bạn
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Colors Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bảng màu được tạo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div 
                        className="w-full h-16 rounded-lg border"
                        style={{ backgroundColor: generatedContent.colors.primary }}
                      ></div>
                      <p className="text-sm mt-2">Màu chính</p>
                      <p className="text-xs text-gray-600">{generatedContent.colors.primary}</p>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-full h-16 rounded-lg border"
                        style={{ backgroundColor: generatedContent.colors.secondary }}
                      ></div>
                      <p className="text-sm mt-2">Màu phụ</p>
                      <p className="text-xs text-gray-600">{generatedContent.colors.secondary}</p>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-full h-16 rounded-lg border"
                        style={{ backgroundColor: generatedContent.colors.accent }}
                      ></div>
                      <p className="text-sm mt-2">Màu nhấn</p>
                      <p className="text-xs text-gray-600">{generatedContent.colors.accent}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nội dung Header & Hero</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">Tên công ty:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.header?.title}</p>
                  </div>
                  <div>
                    <p className="font-medium">Slogan:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.header?.subtitle}</p>
                  </div>
                  <div>
                    <p className="font-medium">Tiêu đề Hero:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.hero?.title}</p>
                    <p className="text-xs text-blue-600">
                      Kích thước: <strong>{generatedContent.content?.hero?.titleSize || 'xl'}</strong> 
                      | Độ đậm: <strong>{generatedContent.content?.hero?.titleWeight || 'semibold'}</strong>
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Tiêu đề phụ Hero:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.hero?.subtitle}</p>
                    <p className="text-xs text-blue-600">
                      Kích thước: <strong>{generatedContent.content?.hero?.subtitleSize || 'lg'}</strong> 
                      | Độ đậm: <strong>{generatedContent.content?.hero?.subtitleWeight || 'medium'}</strong>
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Mô tả Hero:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.hero?.description}</p>
                    <p className="text-xs text-blue-600">
                      Kích thước: <strong>{generatedContent.content?.hero?.descriptionSize || 'base'}</strong>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vấn đề & Giải pháp</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">Vấn đề khách hàng gặp phải:</p>
                    {generatedContent.content?.problems?.items?.map((problem, index) => (
                      <div key={index} className="ml-4 mb-2">
                        <p className="text-sm font-medium">• {problem.title}</p>
                        <p className="text-xs text-gray-600 ml-2">{problem.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <p className="font-medium">Giải pháp của chúng tôi:</p>
                    {generatedContent.content?.solutions?.items?.map((solution, index) => (
                      <div key={index} className="ml-4 mb-2">
                        <p className="text-sm font-medium">• {solution.title}</p>
                        <p className="text-xs text-gray-600 ml-2">{solution.description}</p>
                        {solution.benefit && (
                          <p className="text-xs text-green-600 ml-2 font-medium">✓ {solution.benefit}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lead Magnet & Tài liệu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">Tiêu đề Lead Magnet:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.leadMagnet?.title}</p>
                  </div>
                  <div>
                    <p className="font-medium">Mô tả:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.leadMagnet?.description}</p>
                  </div>
                  <div>
                    <p className="font-medium">Tiêu đề hướng dẫn:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.leadMagnet?.guideTitle}</p>
                    <p className="text-xs text-gray-500">{generatedContent.content?.leadMagnet?.guideSubtitle}</p>
                  </div>
                  <div>
                    <p className="font-medium">Form:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.leadMagnet?.formTitle}</p>
                    <p className="text-xs text-gray-500">{generatedContent.content?.leadMagnet?.formDescription}</p>
                    <p className="text-xs text-blue-600">{generatedContent.content?.leadMagnet?.buttonText}</p>
                  </div>
                  <div>
                    <p className="font-medium">Tính năng chính:</p>
                    {generatedContent.content?.leadMagnet?.features?.map((feature, index) => (
                      <div key={index} className="ml-4 mb-2">
                        <p className="text-sm font-medium">• {feature.title}</p>
                        <p className="text-xs text-gray-600 ml-2">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-medium">Chỉ số tin cậy:</p>
                    {generatedContent.content?.leadMagnet?.trustIndicators?.map((indicator, index) => (
                      <div key={index} className="ml-4 mb-2">
                        <p className="text-sm font-medium">• {indicator.number} {indicator.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lý do chọn chúng tôi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">Tiêu đề:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.whyChooseUs?.title}</p>
                  </div>
                  <div>
                    <p className="font-medium">Phụ đề:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.whyChooseUs?.subtitle}</p>
                  </div>
                  <div>
                    <p className="font-medium">Điểm mạnh:</p>
                    {generatedContent.content?.whyChooseUs?.strengths?.map((strength, index) => (
                      <div key={index} className="ml-4 mb-2">
                        <p className="text-sm font-medium">• {strength.title}</p>
                        <p className="text-xs text-gray-600 ml-2">{strength.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Đánh giá khách hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">Tiêu đề:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.testimonials?.title}</p>
                  </div>
                  <div>
                    <p className="font-medium">Testimonials:</p>
                    {generatedContent.content?.testimonials?.testimonials?.map((testimonial, index) => (
                      <div key={index} className="ml-4 mb-2 border-l-2 border-gray-200 pl-3">
                        <p className="text-sm font-medium">{testimonial.name} - {testimonial.title}</p>
                        <p className="text-xs text-gray-600">{testimonial.company}</p>
                        <p className="text-xs text-gray-500 italic">&quot;{testimonial.content}&quot;</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sản phẩm/Dịch vụ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">Tiêu đề:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.products?.title}</p>
                  </div>
                  <div>
                    <p className="font-medium">Mô tả:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.products?.description}</p>
                  </div>
                  <div>
                    <p className="font-medium">Sản phẩm/Dịch vụ:</p>
                    {generatedContent.content?.products?.items?.map((product, index) => (
                      <div key={index} className="border-l-4 border-gray-200 pl-3 mb-3">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.description}</p>
                        {product.price && (
                          <p className="text-sm font-medium text-green-600">{product.price}</p>
                        )}
                        {product.category && (
                          <p className="text-xs text-gray-500">Danh mục: {product.category}</p>
                        )}
                        {product.features && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">Tính năng:</p>
                            <ul className="text-xs text-gray-500 ml-4">
                              {product.features.map((feature, idx) => (
                                <li key={idx}>• {feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="font-medium">Về chúng tôi:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.about?.description}</p>
                  </div>
                  <div>
                    <p className="font-medium">Call to Action:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.cta?.title}</p>
                    <p className="text-xs text-gray-500">{generatedContent.content?.cta?.description}</p>
                  </div>
                  {generatedContent.content?.footer?.contact && (
                    <div>
                      <p className="font-medium">Liên hệ:</p>
                      <p className="text-sm text-gray-600">📞 {generatedContent.content?.footer?.contact?.phone}</p>
                      <p className="text-sm text-gray-600">✉️ {generatedContent.content?.footer?.contact?.email}</p>
                      <p className="text-sm text-gray-600">📍 {generatedContent.content?.footer?.contact?.address}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Tạo lại
              </Button>
              <Button onClick={applyContent} className="bg-green-600 hover:bg-green-700">
                Áp dụng nội dung
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Hoàn thành!
            </h3>
            <p className="text-sm text-gray-600">
              Nội dung đã được áp dụng thành công vào theme của bạn.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AIContentGenerator 