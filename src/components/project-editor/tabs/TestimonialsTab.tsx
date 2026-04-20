import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ImageUpload from '@/components/ui/image-upload'
import { ThemeParams } from '@/types'
import { Plus, Trash2 } from 'lucide-react'

interface TestimonialsTabProps {
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number | unknown) => void
}

const TestimonialsTab = ({ themeParams, updateThemeParam }: TestimonialsTabProps) => {
  const addTestimonial = () => {
    const currentTestimonials = themeParams?.content?.testimonials?.testimonials || []
    const newTestimonial = {
      id: Date.now().toString(),
      name: '',
      title: '',
      company: '',
      content: '',
      rating: 5,
      image: ''
    }
    updateThemeParam(['content', 'testimonials', 'testimonials'], [...currentTestimonials, newTestimonial])
  }

  const removeTestimonial = (index: number) => {
    const currentTestimonials = themeParams?.content?.testimonials?.testimonials || []
    const newTestimonials = currentTestimonials.filter((_, i) => i !== index)
    updateThemeParam(['content', 'testimonials', 'testimonials'], newTestimonials)
  }

  const updateTestimonial = (index: number, field: string, value: string | number) => {
    const currentTestimonials = themeParams?.content?.testimonials?.testimonials || []
    const updatedTestimonials = currentTestimonials.map((testimonial, i) =>
      i === index ? { ...testimonial, [field]: value } : testimonial
    )
    updateThemeParam(['content', 'testimonials', 'testimonials'], updatedTestimonials)
  }

  const addStat = () => {
    const currentStats = themeParams?.content?.testimonials?.stats || []
    const newStat = { number: '', label: '', sublabel: '' }
    updateThemeParam(['content', 'testimonials', 'stats'], [...currentStats, newStat])
  }

  const removeStat = (index: number) => {
    const currentStats = themeParams?.content?.testimonials?.stats || []
    const newStats = currentStats.filter((_, i) => i !== index)
    updateThemeParam(['content', 'testimonials', 'stats'], newStats)
  }

  const updateStat = (index: number, field: string, value: string) => {
    const currentStats = themeParams?.content?.testimonials?.stats || []
    const updatedStats = currentStats.map((stat, i) =>
      i === index ? { ...stat, [field]: value } : stat
    )
    updateThemeParam(['content', 'testimonials', 'stats'], updatedStats)
  }

  return (
    <div className="space-y-6">
      {/* Header Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Cài đặt chung</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tiêu đề</label>
            <Input
              value={themeParams?.content?.testimonials?.title || ''}
              onChange={(e) => updateThemeParam(['content', 'testimonials', 'title'], e.target.value)}
              placeholder="Được Tin Tưởng Bởi Các Nhà Nhập Khẩu Hàng Đầu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phụ đề</label>
            <Textarea
              value={themeParams?.content?.testimonials?.subtitle || ''}
              onChange={(e) => updateThemeParam(['content', 'testimonials', 'subtitle'], e.target.value)}
              placeholder="Xem những gì khách hàng nói về trải nghiệm nhập khẩu cà phê Việt Nam cao cấp thông qua dịch vụ của chúng tôi."
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="colorMode">Chế độ màu</Label>
            <Select
              value={themeParams?.content?.testimonials?.colorMode || 'theme'}
              onValueChange={(value) => updateThemeParam(['content', 'testimonials', 'colorMode'], value)}
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

          {(themeParams?.content?.testimonials?.colorMode || 'theme') === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Màu nền</label>
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
                <label className="block text-sm font-medium mb-2">Màu chữ</label>
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

              <div>
                <label className="block text-sm font-medium mb-2">Màu chính</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={themeParams?.content?.testimonials?.primaryColor || '#8B4513'}
                    onChange={(e) => updateThemeParam(['content', 'testimonials', 'primaryColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={themeParams?.content?.testimonials?.primaryColor || '#8B4513'}
                    onChange={(e) => updateThemeParam(['content', 'testimonials', 'primaryColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </>
          )}

          {(themeParams?.content?.testimonials?.colorMode || 'theme') === 'theme' && (
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



      {/* Testimonials List */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Danh sách đánh giá</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addTestimonial}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Thêm đánh giá
          </Button>
        </div>
        <div className="space-y-4">
          {(themeParams?.content?.testimonials?.testimonials || []).map((testimonial, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Đánh giá {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeTestimonial(index)}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Xóa
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên khách hàng</label>
                  <Input
                    value={testimonial.name || ''}
                    onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                    placeholder="Tên khách hàng"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Chức vụ</label>
                  <Input
                    value={testimonial.title || ''}
                    onChange={(e) => updateTestimonial(index, 'title', e.target.value)}
                    placeholder="Coffee Buyer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Công ty</label>
                  <Input
                    value={testimonial.company || ''}
                    onChange={(e) => updateTestimonial(index, 'company', e.target.value)}
                    placeholder="Starbucks Reserve"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Đánh giá sao</label>
                  <select
                    value={testimonial.rating || 5}
                    onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} sao</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Nội dung đánh giá</label>
                  <Textarea
                    value={testimonial.content || ''}
                    onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                    placeholder="Nội dung đánh giá của khách hàng"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`testimonial-image-${index}`}>Hình ảnh đại diện</Label>
                  <ImageUpload
                    value={testimonial.image || ''}
                    onChange={(imageUrl) => updateTestimonial(index, 'image', imageUrl)}
                    placeholder="Upload hình ảnh đại diện"
                    recommendedSize="200x200px"
                    aspectRatio="1:1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Stats List */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Thống kê chính</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addStat}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Thêm thống kê
          </Button>
        </div>
        <div className="space-y-4">
          {(themeParams?.content?.testimonials?.stats || []).map((stat, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Thống kê {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeStat(index)}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Xóa
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Số liệu</label>
                  <Input
                    value={stat.number || ''}
                    onChange={(e) => updateStat(index, 'number', e.target.value)}
                    placeholder="500+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nhãn chính</label>
                  <Input
                    value={stat.label || ''}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    placeholder="Lô hàng xuất khẩu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nhãn phụ</label>
                  <Input
                    value={stat.sublabel || ''}
                    onChange={(e) => updateStat(index, 'sublabel', e.target.value)}
                    placeholder="Cà phê chất lượng cao"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default TestimonialsTab
