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

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateContent = async () => {
    if (!businessInfo.companyName || !businessInfo.industry || !businessInfo.description) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/generate-theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          businessInfo,
          currentTheme
        })
      })

      if (!response.ok) {
        throw new Error('Không thể tạo nội dung. Vui lòng thử lại.')
      }

      const result = await response.json()
      
      if (result.success) {
        setGeneratedContent(result.themeParams)
        setStep('preview')
      } else {
        // Handle specific error types
        if (result.errorType === 'AI_SERVICE_UNAVAILABLE') {
          throw new Error(`${result.error}\n\n${result.suggestion || ''}`)
        } else if (result.errorType === 'QUOTA_EXCEEDED') {
          throw new Error(`${result.error}\n\nVui lòng thử lại sau ${Math.ceil(result.retryAfter / 60)} phút.`)
        } else {
          throw new Error(result.error || 'Có lỗi xảy ra')
        }
      }
    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo nội dung')
    } finally {
      setIsGenerating(false)
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
      onOpenChange={(newOpen) => {
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

              {error && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{error}</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={generateContent}
                      disabled={isGenerating}
                      className="text-sm"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang thử lại...
                        </>
                      ) : (
                        'Thử lại'
                      )}
                    </Button>
                  </div>
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
                onClick={generateContent}
                disabled={isGenerating || !businessInfo.companyName || !businessInfo.industry || !businessInfo.description}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo nội dung...
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
                    <p className="font-medium">Tính năng chính:</p>
                    {generatedContent.content?.leadMagnet?.features?.map((feature, index) => (
                      <div key={index} className="ml-4 mb-2">
                        <p className="text-sm font-medium">• {feature.title}</p>
                        <p className="text-xs text-gray-600 ml-2">{feature.description}</p>
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
                    </div>
                  ))}
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