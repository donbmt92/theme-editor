import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import FileUpload from '@/components/ui/file-upload'
import { ThemeParams } from '@/types'
import { Plus, Trash2, Download, BookOpen, CheckCircle, TrendingUp, Shield, FileText } from 'lucide-react'
import { useState } from 'react'

interface LeadMagnetTabProps {
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number | unknown) => void
}

const LeadMagnetTab = ({ themeParams, updateThemeParam }: LeadMagnetTabProps) => {
  const [newFeature, setNewFeature] = useState({ title: '', description: '', icon: 'FileText' })
  const [newTrustIndicator, setNewTrustIndicator] = useState({ number: '', label: '' })

  const leadMagnet = themeParams.content?.leadMagnet || {}
  const guideFeatures = leadMagnet.guideFeatures || []
  const trustIndicators = leadMagnet.trustIndicators || []

  const addFeature = () => {
    if (newFeature.title && newFeature.description) {
      const updatedFeatures = [...guideFeatures, { 
        id: `feature-${Date.now()}`, 
        ...newFeature 
      }]
      updateThemeParam(['content', 'leadMagnet', 'guideFeatures'], updatedFeatures)
      setNewFeature({ title: '', description: '', icon: 'FileText' })
    }
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = guideFeatures.filter((_, i) => i !== index)
    updateThemeParam(['content', 'leadMagnet', 'guideFeatures'], updatedFeatures)
  }

  const addTrustIndicator = () => {
    if (newTrustIndicator.number && newTrustIndicator.label) {
      const updatedIndicators = [...trustIndicators, { 
        id: `indicator-${Date.now()}`, 
        ...newTrustIndicator 
      }]
      updateThemeParam(['content', 'leadMagnet', 'trustIndicators'], updatedIndicators)
      setNewTrustIndicator({ number: '', label: '' })
    }
  }

  const removeTrustIndicator = (index: number) => {
    const updatedIndicators = trustIndicators.filter((_, i) => i !== index)
    updateThemeParam(['content', 'leadMagnet', 'trustIndicators'], updatedIndicators)
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return FileText
      case 'TrendingUp': return TrendingUp
      case 'Shield': return Shield
      case 'CheckCircle': return CheckCircle
      case 'BookOpen': return BookOpen
      case 'Download': return Download
      default: return FileText
    }
  }

  return (
    <div className="space-y-6">
      {/* Nội dung chính */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Nội dung chính</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="badgeText">Badge text</Label>
            <Input
              id="badgeText"
              value={leadMagnet.badgeText || ''}
              onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'badgeText'], e.target.value)}
              placeholder="Free Resource"
            />
          </div>
          
          <div>
            <Label htmlFor="title">Tiêu đề chính</Label>
            <Input
              id="title"
              value={leadMagnet.title || ''}
              onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'title'], e.target.value)}
              placeholder="Unlock Your Import/Export Success"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={leadMagnet.description || ''}
              onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'description'], e.target.value)}
              placeholder="Mô tả về tài liệu miễn phí mà bạn cung cấp"
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Guide Preview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Preview tài liệu</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="guideTitle">Tiêu đề tài liệu</Label>
            <Input
              id="guideTitle"
              value={leadMagnet.guideTitle || ''}
              onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'guideTitle'], e.target.value)}
              placeholder="Complete Import Guide"
            />
          </div>
          
          <div>
            <Label htmlFor="guideSubtitle">Phụ đề tài liệu</Label>
            <Input
              id="guideSubtitle"
              value={leadMagnet.guideSubtitle || ''}
              onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'guideSubtitle'], e.target.value)}
              placeholder="2024 Edition - 45 Pages"
            />
          </div>
        </div>
      </Card>

      {/* Màu sắc */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Màu sắc</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="colorMode">Chế độ màu</Label>
            <Select
              value={leadMagnet.colorMode || 'custom'}
              onValueChange={(value) => updateThemeParam(['content', 'leadMagnet', 'colorMode'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="theme">Sử dụng màu chủ đề</SelectItem>
                <SelectItem value="custom">Màu tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {leadMagnet.colorMode === 'custom' && (
            <>
              <div>
                <Label htmlFor="backgroundColor">Màu nền section</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={leadMagnet.backgroundColor || '#FEF3C7'}
                    onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'backgroundColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={leadMagnet.backgroundColor || '#FEF3C7'}
                    onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'backgroundColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="textColor">Màu chữ</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={leadMagnet.textColor || '#000000'}
                    onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'textColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={leadMagnet.textColor || '#000000'}
                    onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'textColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="primaryColor">Màu chính</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={leadMagnet.primaryColor || '#3B82F6'}
                    onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'primaryColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={leadMagnet.primaryColor || '#3B82F6'}
                    onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'primaryColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </>
          )}
          
          {leadMagnet.colorMode === 'theme' && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                Sử dụng màu từ chủ đề chính: <strong>{themeParams.colors?.primary || '#8B4513'}</strong>, <strong>{themeParams.colors?.accent || '#F4A460'}</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Màu sẽ được áp dụng tự động từ ColorsTab
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Typography */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Kiểu chữ</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="titleSize">Kích thước tiêu đề</Label>
            <Select
              value={leadMagnet.titleSize || '4xl'}
              onValueChange={(value) => updateThemeParam(['content', 'leadMagnet', 'titleSize'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2xl">Nhỏ</SelectItem>
                <SelectItem value="3xl">Vừa</SelectItem>
                <SelectItem value="4xl">Lớn</SelectItem>
                <SelectItem value="5xl">Rất lớn</SelectItem>
                <SelectItem value="6xl">Cực lớn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="titleWeight">Độ đậm tiêu đề</Label>
            <Select
              value={leadMagnet.titleWeight || 'bold'}
              onValueChange={(value) => updateThemeParam(['content', 'leadMagnet', 'titleWeight'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Mỏng</SelectItem>
                <SelectItem value="normal">Bình thường</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="semibold">Bán đậm</SelectItem>
                <SelectItem value="bold">Đậm</SelectItem>
                <SelectItem value="extrabold">Rất đậm</SelectItem>
                <SelectItem value="black">Đen</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="descriptionSize">Kích thước mô tả</Label>
            <Select
              value={leadMagnet.descriptionSize || 'xl'}
              onValueChange={(value) => updateThemeParam(['content', 'leadMagnet', 'descriptionSize'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lg">Nhỏ</SelectItem>
                <SelectItem value="xl">Vừa</SelectItem>
                <SelectItem value="2xl">Lớn</SelectItem>
                <SelectItem value="3xl">Rất lớn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="descriptionWeight">Độ đậm mô tả</Label>
            <Select
              value={leadMagnet.descriptionWeight || 'normal'}
              onValueChange={(value) => updateThemeParam(['content', 'leadMagnet', 'descriptionWeight'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Mỏng</SelectItem>
                <SelectItem value="normal">Bình thường</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="semibold">Bán đậm</SelectItem>
                <SelectItem value="bold">Đậm</SelectItem>
                <SelectItem value="extrabold">Rất đậm</SelectItem>
                <SelectItem value="black">Đen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Guide Features */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tính năng tài liệu</h3>
        <div className="space-y-4">
          {guideFeatures.map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon || 'FileText')
            return (
              <div key={feature.id || index} className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center space-x-3 mb-3">
                  <IconComponent className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Feature {index + 1}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    className="text-red-600 hover:text-red-700 ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <Label htmlFor={`feature-icon-${index}`}>Icon</Label>
                    <Select
                      value={feature.icon || 'FileText'}
                      onValueChange={(value) => {
                        const updatedFeatures = [...guideFeatures]
                        updatedFeatures[index] = { ...feature, icon: value }
                        updateThemeParam(['content', 'leadMagnet', 'guideFeatures'], updatedFeatures)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FileText">📄 Tài liệu</SelectItem>
                        <SelectItem value="TrendingUp">📈 Xu hướng</SelectItem>
                        <SelectItem value="Shield">🛡️ Bảo vệ</SelectItem>
                        <SelectItem value="CheckCircle">✅ Hoàn thành</SelectItem>
                        <SelectItem value="BookOpen">📖 Sách</SelectItem>
                        <SelectItem value="Download">⬇️ Tải xuống</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor={`feature-title-${index}`}>Tiêu đề</Label>
                    <Input
                      id={`feature-title-${index}`}
                      value={feature.title}
                      onChange={(e) => {
                        const updatedFeatures = [...guideFeatures]
                        updatedFeatures[index] = { ...feature, title: e.target.value }
                        updateThemeParam(['content', 'leadMagnet', 'guideFeatures'], updatedFeatures)
                      }}
                      placeholder="Tiêu đề tính năng"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`feature-description-${index}`}>Mô tả</Label>
                  <Textarea
                    id={`feature-description-${index}`}
                    value={feature.description}
                    onChange={(e) => {
                      const updatedFeatures = [...guideFeatures]
                      updatedFeatures[index] = { ...feature, description: e.target.value }
                      updateThemeParam(['content', 'leadMagnet', 'guideFeatures'], updatedFeatures)
                    }}
                    placeholder="Mô tả chi tiết về tính năng"
                    rows={2}
                  />
                </div>
              </div>
            )
          })}
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <h4 className="font-medium mb-3">Thêm tính năng mới</h4>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <Label htmlFor="new-feature-icon">Icon</Label>
                <Select
                  value={newFeature.icon}
                  onValueChange={(value) => setNewFeature({ ...newFeature, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FileText">📄 Tài liệu</SelectItem>
                    <SelectItem value="TrendingUp">📈 Xu hướng</SelectItem>
                    <SelectItem value="Shield">🛡️ Bảo vệ</SelectItem>
                    <SelectItem value="CheckCircle">✅ Hoàn thành</SelectItem>
                    <SelectItem value="BookOpen">📖 Sách</SelectItem>
                    <SelectItem value="Download">⬇️ Tải xuống</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="new-feature-title">Tiêu đề</Label>
                <Input
                  id="new-feature-title"
                  value={newFeature.title}
                  onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                  placeholder="Tiêu đề tính năng mới"
                />
              </div>
            </div>
            
            <div className="mb-3">
              <Label htmlFor="new-feature-description">Mô tả</Label>
              <Textarea
                id="new-feature-description"
                value={newFeature.description}
                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                placeholder="Mô tả chi tiết về tính năng mới"
                rows={2}
              />
            </div>
            
            <Button onClick={addFeature} size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-1" />
              Thêm tính năng
            </Button>
          </div>
        </div>
      </Card>

      {/* Trust Indicators */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Chỉ số tin cậy</h3>
        <div className="space-y-4">
          {trustIndicators.map((indicator, index) => (
            <div key={indicator.id || index} className="border rounded-lg p-4 bg-green-50">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-sm font-medium text-gray-600">Indicator {index + 1}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeTrustIndicator(index)}
                  className="text-red-600 hover:text-red-700 ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`indicator-number-${index}`}>Số liệu</Label>
                  <Input
                    id={`indicator-number-${index}`}
                    value={indicator.number}
                    onChange={(e) => {
                      const updatedIndicators = [...trustIndicators]
                      updatedIndicators[index] = { ...indicator, number: e.target.value }
                      updateThemeParam(['content', 'leadMagnet', 'trustIndicators'], updatedIndicators)
                    }}
                    placeholder="5,000+"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`indicator-label-${index}`}>Nhãn</Label>
                  <Input
                    id={`indicator-label-${index}`}
                    value={indicator.label}
                    onChange={(e) => {
                      const updatedIndicators = [...trustIndicators]
                      updatedIndicators[index] = { ...indicator, label: e.target.value }
                      updateThemeParam(['content', 'leadMagnet', 'trustIndicators'], updatedIndicators)
                    }}
                    placeholder="Downloads"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <h4 className="font-medium mb-3">Thêm chỉ số mới</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label htmlFor="new-indicator-number">Số liệu</Label>
                <Input
                  id="new-indicator-number"
                  value={newTrustIndicator.number}
                  onChange={(e) => setNewTrustIndicator({ ...newTrustIndicator, number: e.target.value })}
                  placeholder="5,000+"
                />
              </div>
              
              <div>
                <Label htmlFor="new-indicator-label">Nhãn</Label>
                <Input
                  id="new-indicator-label"
                  value={newTrustIndicator.label}
                  onChange={(e) => setNewTrustIndicator({ ...newTrustIndicator, label: e.target.value })}
                  placeholder="Downloads"
                />
              </div>
            </div>
            
            <Button onClick={addTrustIndicator} size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-1" />
              Thêm chỉ số
            </Button>
          </div>
        </div>
      </Card>

      {/* Form Fields */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Trường form</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="formTitle">Tiêu đề form</Label>
            <Input
              id="formTitle"
              value={leadMagnet.formTitle || ''}
              onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'formTitle'], e.target.value)}
              placeholder="Download Your Free Guide"
            />
          </div>
          
          <div>
            <Label htmlFor="formDescription">Mô tả form</Label>
            <Textarea
              id="formDescription"
              value={leadMagnet.formDescription || ''}
              onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'formDescription'], e.target.value)}
              placeholder="Mô tả về việc điền form để nhận tài liệu"
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="downloadUrl">File tài liệu (PDF)</Label>
            <FileUpload
              value={leadMagnet.downloadUrl || ''}
              onChange={(url) => updateThemeParam(['content', 'leadMagnet', 'downloadUrl'], url)}
              placeholder="Upload file PDF tài liệu"
              allowedHint="Chỉ chấp nhận file PDF, tối đa 20MB"
            />
          </div>
          
          <div>
            <Label htmlFor="buttonText">Nút submit</Label>
            <Input
              id="buttonText"
              value={leadMagnet.buttonText || ''}
              onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'buttonText'], e.target.value)}
              placeholder="Download Free Guide Now"
            />
          </div>
          
          <div>
            <Label htmlFor="privacyText">Văn bản bảo mật</Label>
            <Textarea
              id="privacyText"
              value={leadMagnet.privacyText || ''}
              onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'privacyText'], e.target.value)}
              placeholder="Văn bản về chính sách bảo mật và spam"
              rows={2}
            />
          </div>
        </div>
      </Card>

      {/* Trust Elements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Yếu tố tin cậy</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="secureText">Văn bản bảo mật</Label>
            <Input
              id="secureText"
              value={leadMagnet.secureText || ''}
              onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'secureText'], e.target.value)}
              placeholder="100% Secure"
            />
          </div>
          
          <div>
            <Label htmlFor="noSpamText">Văn bản không spam</Label>
            <Input
              id="noSpamText"
              value={leadMagnet.noSpamText || ''}
              onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'noSpamText'], e.target.value)}
              placeholder="No Spam"
            />
          </div>
          
          <div>
            <Label htmlFor="instantText">Văn bản tức thì</Label>
            <Input
              id="instantText"
              value={leadMagnet.instantText || ''}
              onChange={(e) => updateThemeParam(['content', 'leadMagnet', 'instantText'], e.target.value)}
              placeholder="Instant Download"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default LeadMagnetTab
