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
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  open,
  onOpenChange,
  onGenerate,
  currentTheme
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
        throw new Error(result.error || 'Có lỗi xảy ra')
      }
    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo nội dung')
    } finally {
      setIsGenerating(false)
    }
  }

  const applyContent = () => {
    if (generatedContent) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-purple-600" />
                AI Tạo Nội Dung Thông Minh
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin doanh nghiệp để AI tự động tạo nội dung và màu sắc phù hợp cho website của bạn
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
                      <option value="both">Song ngữ</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
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
                  <CardTitle className="text-lg">Nội dung được tạo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">Tiêu đề Hero:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.hero?.title}</p>
                  </div>
                  <div>
                    <p className="font-medium">Mô tả:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.hero?.description}</p>
                  </div>
                  <div>
                    <p className="font-medium">Về chúng tôi:</p>
                    <p className="text-sm text-gray-600">{generatedContent.content?.about?.description}</p>
                  </div>
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