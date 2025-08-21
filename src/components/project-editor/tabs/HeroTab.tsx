import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ImageUpload from '@/components/ui/image-upload'
import { ThemeParams } from '@/types'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface HeroTabProps {
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number | unknown) => void
}

const HeroTab = ({ themeParams, updateThemeParam }: HeroTabProps) => {
  const [newBenefit, setNewBenefit] = useState({ icon: '', text: '' })
  const [newStat, setNewStat] = useState({ number: '', label: '' })

  const hero = themeParams.content?.hero || {}
  const benefits = hero.benefits || []
  const stats = hero.stats || []
  
  // Type-safe access to hero properties with proper typing
  const heroContent = hero as typeof hero & {
    colorMode?: 'theme' | 'custom'
    primaryColor?: string
    titleFont?: string
    subtitleFont?: string
    descriptionFont?: string
    benefitsFont?: string
    ctaFont?: string
    statsFont?: string
    benefitsSize?: string
    benefitsWeight?: string
    ctaSize?: string
    ctaWeight?: string
    statsSize?: string
    statsWeight?: string
  }

  const addBenefit = () => {
    if (newBenefit.icon && newBenefit.text) {
      const updatedBenefits = [...benefits, { ...newBenefit }]
      updateThemeParam(['content', 'hero', 'benefits'], updatedBenefits)
      setNewBenefit({ icon: '', text: '' })
    }
  }

  const removeBenefit = (index: number) => {
    const updatedBenefits = benefits.filter((_, i) => i !== index)
    updateThemeParam(['content', 'hero', 'benefits'], updatedBenefits)
  }

  const addStat = () => {
    if (newStat.number && newStat.label) {
      const updatedStats = [...stats, { ...newStat }]
      updateThemeParam(['content', 'hero', 'stats'], updatedStats)
      setNewStat({ number: '', label: '' })
    }
  }

  const removeStat = (index: number) => {
    const updatedStats = stats.filter((_, i) => i !== index)
    updateThemeParam(['content', 'hero', 'stats'], updatedStats)
  }

  return (
    <div className="space-y-6">
      {/* Nội dung chính */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Nội dung chính</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề chính</Label>
            <Input
              id="title"
              value={hero.title || ''}
              onChange={(e) => updateThemeParam(['content', 'hero', 'title'], e.target.value)}
              placeholder="Tiêu đề chính của hero section"
            />
          </div>
          
          <div>
            <Label htmlFor="subtitle">Tiêu đề phụ</Label>
            <Input
              id="subtitle"
              value={hero.subtitle || ''}
              onChange={(e) => updateThemeParam(['content', 'hero', 'subtitle'], e.target.value)}
              placeholder="Tiêu đề phụ hoặc slogan"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={hero.description || ''}
              onChange={(e) => updateThemeParam(['content', 'hero', 'description'], e.target.value)}
              placeholder="Mô tả chi tiết về dịch vụ/sản phẩm của bạn"
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* CTA Buttons */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Nút Call-to-Action</h3>
        
        {/* CTA Typography Settings */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label htmlFor="ctaSize">Kích thước CTA</Label>
            <Select
              value={heroContent.ctaSize || 'base'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'ctaSize'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Nhỏ</SelectItem>
                <SelectItem value="base">Vừa</SelectItem>
                <SelectItem value="lg">Lớn</SelectItem>
                <SelectItem value="xl">Rất lớn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="ctaWeight">Độ đậm CTA</Label>
            <Select
              value={heroContent.ctaWeight || 'medium'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'ctaWeight'], value)}
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
            <Label htmlFor="ctaFont">Font CTA</Label>
            <Select
              value={heroContent.ctaFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'ctaFont'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="open-sans">Open Sans</SelectItem>
                <SelectItem value="montserrat">Montserrat</SelectItem>
                <SelectItem value="lato">Lato</SelectItem>
                <SelectItem value="nunito">Nunito</SelectItem>
                <SelectItem value="raleway">Raleway</SelectItem>
                <SelectItem value="playfair-display">Playfair Display</SelectItem>
                <SelectItem value="merriweather">Merriweather</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="ctaText">Nút chính</Label>
            <Input
              id="ctaText"
              value={hero.ctaText || ''}
              onChange={(e) => updateThemeParam(['content', 'hero', 'ctaText'], e.target.value)}
              placeholder="Ví dụ: Bắt đầu ngay"
            />
          </div>
          
          <div>
            <Label htmlFor="ctaSecondaryText">Nút phụ</Label>
            <Input
              id="ctaSecondaryText"
              value={hero.ctaSecondaryText || ''}
              onChange={(e) => updateThemeParam(['content', 'hero', 'ctaSecondaryText'], e.target.value)}
              placeholder="Ví dụ: Tìm hiểu thêm"
            />
          </div>
        </div>
      </Card>

      {/* Hình ảnh */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Hình ảnh</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="backgroundImage">Ảnh nền</Label>
            <ImageUpload
              value={hero.backgroundImage || ''}
              onChange={(url) => updateThemeParam(['content', 'hero', 'backgroundImage'], url)}
              placeholder="Upload ảnh nền hero"
              recommendedSize="1920x1080px"
              aspectRatio="16:9"
            />
          </div>
          
          <div>
            <Label htmlFor="image">Ảnh chính</Label>
            <ImageUpload
              value={hero.image || ''}
              onChange={(url) => updateThemeParam(['content', 'hero', 'image'], url)}
              placeholder="Upload ảnh chính hero"
              recommendedSize="600x400px"
              aspectRatio="3:2"
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
              value={heroContent.colorMode || 'custom'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'colorMode'], value)}
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
          
          {heroContent.colorMode === 'custom' && (
            <>
              <div>
                <Label htmlFor="backgroundColor">Màu nền</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={hero.backgroundColor || '#FFFFFF'}
                    onChange={(e) => updateThemeParam(['content', 'hero', 'backgroundColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={hero.backgroundColor || '#FFFFFF'}
                    onChange={(e) => updateThemeParam(['content', 'hero', 'backgroundColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="textColor">Màu chữ</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={hero.textColor || '#000000'}
                    onChange={(e) => updateThemeParam(['content', 'hero', 'textColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={hero.textColor || '#000000'}
                    onChange={(e) => updateThemeParam(['content', 'hero', 'textColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="primaryColor">Màu chính</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={heroContent.primaryColor || '#3B82F6'}
                    onChange={(e) => updateThemeParam(['content', 'hero', 'primaryColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={heroContent.primaryColor || '#3B82F6'}
                    onChange={(e) => updateThemeParam(['content', 'hero', 'primaryColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="overlayColor">Màu overlay</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={hero.overlayColor || '#000000'}
                    onChange={(e) => updateThemeParam(['content', 'hero', 'overlayColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={hero.overlayColor || '#000000'}
                    onChange={(e) => updateThemeParam(['content', 'hero', 'overlayColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="overlayOpacity">Độ mờ overlay</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hero.overlayOpacity || 0}
                    onChange={(e) => updateThemeParam(['content', 'hero', 'overlayOpacity'], parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-12">{hero.overlayOpacity || 0}%</span>
                </div>
              </div>
            </>
          )}
          
          {heroContent.colorMode === 'theme' && (
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
              value={hero.titleSize || 'xl'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'titleSize'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Nhỏ (0.875rem)</SelectItem>
                <SelectItem value="base">Vừa (1rem)</SelectItem>
                <SelectItem value="lg">Lớn (1.125rem)</SelectItem>
                <SelectItem value="xl">Rất lớn (1.25rem) - Mặc định</SelectItem>
                <SelectItem value="2xl">Cực lớn (1.5rem)</SelectItem>
                <SelectItem value="3xl">Khổng lồ (1.875rem)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Kích thước hiện tại: <strong>{hero.titleSize || 'xl'}</strong> 
              {hero.titleSize === 'xl' && ' (Khuyến nghị cho tiêu đề chính)'}
            </p>
          </div>
          
          <div>
            <Label htmlFor="titleWeight">Độ đậm tiêu đề</Label>
            <Select
              value={hero.titleWeight || 'semibold'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'titleWeight'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Mỏng (300)</SelectItem>
                <SelectItem value="normal">Bình thường (400)</SelectItem>
                <SelectItem value="medium">Trung bình (500)</SelectItem>
                <SelectItem value="semibold">Bán đậm (600) - Mặc định</SelectItem>
                <SelectItem value="bold">Đậm (700)</SelectItem>
                <SelectItem value="extrabold">Rất đậm (800)</SelectItem>
                <SelectItem value="black">Đen (900)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Độ đậm hiện tại: <strong>{hero.titleWeight || 'semibold'}</strong>
            </p>
          </div>
          
          <div>
            <Label htmlFor="subtitleSize">Kích thước tiêu đề phụ</Label>
            <Select
              value={hero.subtitleSize || 'lg'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'subtitleSize'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Nhỏ (0.875rem)</SelectItem>
                <SelectItem value="base">Vừa (1rem)</SelectItem>
                <SelectItem value="lg">Lớn (1.125rem) - Mặc định</SelectItem>
                <SelectItem value="xl">Rất lớn (1.25rem)</SelectItem>
                <SelectItem value="2xl">Cực lớn (1.5rem)</SelectItem>
                <SelectItem value="3xl">Khổng lồ (1.875rem)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Kích thước hiện tại: <strong>{hero.subtitleSize || 'lg'}</strong>
            </p>
          </div>
          
          <div>
            <Label htmlFor="descriptionSize">Kích thước mô tả</Label>
            <Select
              value={hero.descriptionSize || 'base'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'descriptionSize'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Rất nhỏ (0.75rem)</SelectItem>
                <SelectItem value="sm">Nhỏ (0.875rem)</SelectItem>
                <SelectItem value="base">Vừa (1rem) - Mặc định</SelectItem>
                <SelectItem value="lg">Lớn (1.125rem)</SelectItem>
                <SelectItem value="xl">Rất lớn (1.25rem)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Kích thước hiện tại: <strong>{hero.descriptionSize || 'base'}</strong>
            </p>
          </div>
          
          <div>
            <Label htmlFor="subtitleWeight">Độ đậm tiêu đề phụ</Label>
            <Select
              value={hero.subtitleWeight || 'medium'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'subtitleWeight'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Mỏng (300)</SelectItem>
                <SelectItem value="normal">Bình thường (400)</SelectItem>
                <SelectItem value="medium">Trung bình (500) - Mặc định</SelectItem>
                <SelectItem value="semibold">Bán đậm (600)</SelectItem>
                <SelectItem value="bold">Đậm (700)</SelectItem>
                <SelectItem value="extrabold">Rất đậm (800)</SelectItem>
                <SelectItem value="black">Đen (900)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Độ đậm hiện tại: <strong>{hero.subtitleWeight || 'medium'}</strong>
            </p>
          </div>
        </div>

        {/* Font Family Section */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
          <div>
            <Label htmlFor="titleFont">Font tiêu đề</Label>
            <Select
              value={heroContent.titleFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'titleFont'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="open-sans">Open Sans</SelectItem>
                <SelectItem value="montserrat">Montserrat</SelectItem>
                <SelectItem value="lato">Lato</SelectItem>
                <SelectItem value="nunito">Nunito</SelectItem>
                <SelectItem value="raleway">Raleway</SelectItem>
                <SelectItem value="playfair-display">Playfair Display</SelectItem>
                <SelectItem value="merriweather">Merriweather</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="subtitleFont">Font tiêu đề phụ</Label>
            <Select
              value={heroContent.subtitleFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'subtitleFont'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="open-sans">Open Sans</SelectItem>
                <SelectItem value="montserrat">Montserrat</SelectItem>
                <SelectItem value="lato">Lato</SelectItem>
                <SelectItem value="nunito">Nunito</SelectItem>
                <SelectItem value="raleway">Raleway</SelectItem>
                <SelectItem value="playfair-display">Playfair Display</SelectItem>
                <SelectItem value="merriweather">Merriweather</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="descriptionFont">Font mô tả</Label>
            <Select
              value={heroContent.descriptionFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'descriptionFont'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="open-sans">Open Sans</SelectItem>
                <SelectItem value="montserrat">Montserrat</SelectItem>
                <SelectItem value="lato">Lato</SelectItem>
                <SelectItem value="nunito">Nunito</SelectItem>
                <SelectItem value="raleway">Raleway</SelectItem>
                <SelectItem value="playfair-display">Playfair Display</SelectItem>
                <SelectItem value="merriweather">Merriweather</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="ctaFont">Font CTA</Label>
            <Select
              value={heroContent.ctaFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'ctaFont'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="open-sans">Open Sans</SelectItem>
                <SelectItem value="montserrat">Montserrat</SelectItem>
                <SelectItem value="lato">Lato</SelectItem>
                <SelectItem value="nunito">Nunito</SelectItem>
                <SelectItem value="raleway">Raleway</SelectItem>
                <SelectItem value="playfair-display">Playfair Display</SelectItem>
                <SelectItem value="merriweather">Merriweather</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Lợi ích */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Lợi ích</h3>
        
        {/* Benefits Typography Settings */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label htmlFor="benefitsSize">Kích thước lợi ích</Label>
            <Select
              value={heroContent.benefitsSize || 'base'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'benefitsSize'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Rất nhỏ</SelectItem>
                <SelectItem value="sm">Nhỏ</SelectItem>
                <SelectItem value="base">Vừa</SelectItem>
                <SelectItem value="lg">Lớn</SelectItem>
                <SelectItem value="xl">Rất lớn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="benefitsWeight">Độ đậm lợi ích</Label>
            <Select
              value={heroContent.benefitsWeight || 'medium'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'benefitsWeight'], value)}
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
            <Label htmlFor="benefitsFont">Font lợi ích</Label>
            <Select
              value={heroContent.benefitsFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'benefitsFont'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="open-sans">Open Sans</SelectItem>
                <SelectItem value="montserrat">Montserrat</SelectItem>
                <SelectItem value="lato">Lato</SelectItem>
                <SelectItem value="nunito">Nunito</SelectItem>
                <SelectItem value="raleway">Raleway</SelectItem>
                <SelectItem value="playfair-display">Playfair Display</SelectItem>
                <SelectItem value="merriweather">Merriweather</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm text-gray-600 mb-1 block">Icon</Label>
                <Select
                  value={benefit.icon}
                  onValueChange={(value) => {
                    const updatedBenefits = [...benefits]
                    updatedBenefits[index] = { ...benefit, icon: value }
                    updateThemeParam(['content', 'hero', 'benefits'], updatedBenefits)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="✅">✅ Check</SelectItem>
                    <SelectItem value="🌍">🌍 Globe</SelectItem>
                    <SelectItem value="⭐">⭐ Star</SelectItem>
                    <SelectItem value="🏆">🏆 Trophy</SelectItem>
                    <SelectItem value="💎">💎 Diamond</SelectItem>
                    <SelectItem value="⚡">⚡ Lightning</SelectItem>
                    <SelectItem value="🛡️">🛡️ Shield</SelectItem>
                    <SelectItem value="🚀">🚀 Rocket</SelectItem>
                    <SelectItem value="CheckCircle">CheckCircle (Lucide)</SelectItem>
                    <SelectItem value="Award">Award (Lucide)</SelectItem>
                    <SelectItem value="Globe">Globe (Lucide)</SelectItem>
                    <SelectItem value="Shield">Shield (Lucide)</SelectItem>
                    <SelectItem value="Users">Users (Lucide)</SelectItem>
                    <SelectItem value="TrendingUp">TrendingUp (Lucide)</SelectItem>
                    <SelectItem value="Clock">Clock (Lucide)</SelectItem>
                    <SelectItem value="Zap">Zap (Lucide)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-sm text-gray-600 mb-1 block">Nội dung</Label>
                <Input
                  value={benefit.text}
                  onChange={(e) => {
                    const updatedBenefits = [...benefits]
                    updatedBenefits[index] = { ...benefit, text: e.target.value }
                    updateThemeParam(['content', 'hero', 'benefits'], updatedBenefits)
                  }}
                  placeholder="Mô tả lợi ích"
                />
              </div>
              <div className="pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeBenefit(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <Label className="text-sm text-gray-600 mb-1 block">Icon mới</Label>
              <Select
                value={newBenefit.icon}
                onValueChange={(value) => setNewBenefit({ ...newBenefit, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="✅">✅ Check</SelectItem>
                  <SelectItem value="🌍">🌍 Globe</SelectItem>
                  <SelectItem value="⭐">⭐ Star</SelectItem>
                  <SelectItem value="🏆">🏆 Trophy</SelectItem>
                  <SelectItem value="💎">💎 Diamond</SelectItem>
                  <SelectItem value="⚡">⚡ Lightning</SelectItem>
                  <SelectItem value="🛡️">🛡️ Shield</SelectItem>
                  <SelectItem value="🚀">🚀 Rocket</SelectItem>
                  <SelectItem value="CheckCircle">CheckCircle (Lucide)</SelectItem>
                  <SelectItem value="Award">Award (Lucide)</SelectItem>
                  <SelectItem value="Globe">Globe (Lucide)</SelectItem>
                  <SelectItem value="Shield">Shield (Lucide)</SelectItem>
                  <SelectItem value="Users">Users (Lucide)</SelectItem>
                  <SelectItem value="TrendingUp">TrendingUp (Lucide)</SelectItem>
                  <SelectItem value="Clock">Clock (Lucide)</SelectItem>
                  <SelectItem value="Zap">Zap (Lucide)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="text-sm text-gray-600 mb-1 block">Nội dung mới</Label>
              <Input
                value={newBenefit.text}
                onChange={(e) => setNewBenefit({ ...newBenefit, text: e.target.value })}
                placeholder="Mô tả lợi ích"
              />
            </div>
            <div className="pt-6">
              <Button onClick={addBenefit} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Thêm
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Thống kê */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Thống kê</h3>
        
        {/* Stats Typography Settings */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label htmlFor="statsSize">Kích thước thống kê</Label>
            <Select
              value={heroContent.statsSize || 'base'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'statsSize'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Nhỏ</SelectItem>
                <SelectItem value="base">Vừa</SelectItem>
                <SelectItem value="lg">Lớn</SelectItem>
                <SelectItem value="xl">Rất lớn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="statsWeight">Độ đậm thống kê</Label>
            <Select
              value={heroContent.statsWeight || 'bold'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'statsWeight'], value)}
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
            <Label htmlFor="statsFont">Font thống kê</Label>
            <Select
              value={heroContent.statsFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'hero', 'statsFont'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="open-sans">Open Sans</SelectItem>
                <SelectItem value="montserrat">Montserrat</SelectItem>
                <SelectItem value="lato">Lato</SelectItem>
                <SelectItem value="nunito">Nunito</SelectItem>
                <SelectItem value="raleway">Raleway</SelectItem>
                <SelectItem value="playfair-display">Playfair Display</SelectItem>
                <SelectItem value="merriweather">Merriweather</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex-1">
                <Input
                  value={stat.number}
                  onChange={(e) => {
                    const updatedStats = [...stats]
                    updatedStats[index] = { ...stat, number: e.target.value }
                    updateThemeParam(['content', 'hero', 'stats'], updatedStats)
                  }}
                  placeholder="Số liệu (ví dụ: 1000+)"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={stat.label}
                  onChange={(e) => {
                    const updatedStats = [...stats]
                    updatedStats[index] = { ...stat, label: e.target.value }
                    updateThemeParam(['content', 'hero', 'stats'], updatedStats)
                  }}
                  placeholder="Nhãn (ví dụ: Khách hàng)"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeStat(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex items-center space-x-3">
            <Input
              value={newStat.number}
              onChange={(e) => setNewStat({ ...newStat, number: e.target.value })}
              placeholder="Số liệu"
            />
            <Input
              value={newStat.label}
              onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
              placeholder="Nhãn"
            />
            <Button onClick={addStat} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default HeroTab
