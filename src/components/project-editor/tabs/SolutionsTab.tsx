import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ThemeParams } from '@/types'
import { Plus, Trash2, CheckCircle, Truck, DollarSign, Shield, Target } from 'lucide-react'
import { useState } from 'react'

interface SolutionsTabProps {
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number | unknown) => void
}

const SolutionsTab = ({ themeParams, updateThemeParam }: SolutionsTabProps) => {
  const [newSolution, setNewSolution] = useState({ title: '', description: '', benefit: '', icon: 'CheckCircle' })

  const solutions = themeParams.content?.solutions || {}
  const solutionsItems = solutions.items || []

  const addSolution = () => {
    if (newSolution.title && newSolution.description && newSolution.benefit) {
      const updatedSolutions = [...solutionsItems, { 
        id: `solution-${Date.now()}`, 
        ...newSolution 
      }]
      updateThemeParam(['content', 'solutions', 'items'], updatedSolutions)
      setNewSolution({ title: '', description: '', benefit: '', icon: 'CheckCircle' })
    }
  }

  const removeSolution = (index: number) => {
    const updatedSolutions = solutionsItems.filter((_, i) => i !== index)
    updateThemeParam(['content', 'solutions', 'items'], updatedSolutions)
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle': return CheckCircle
      case 'Truck': return Truck
      case 'DollarSign': return DollarSign
      case 'Shield': return Shield
      case 'Target': return Target
      default: return CheckCircle
    }
  }

  return (
    <div className="space-y-6">
      {/* Nội dung chính */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Nội dung chính</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề section</Label>
            <Input
              id="title"
              value={solutions.title || ''}
              onChange={(e) => updateThemeParam(['content', 'solutions', 'title'], e.target.value)}
              placeholder="Giải Pháp Của Chúng Tôi"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={solutions.description || ''}
              onChange={(e) => updateThemeParam(['content', 'solutions', 'description'], e.target.value)}
              placeholder="Mô tả về những giải pháp mà bạn cung cấp cho khách hàng"
              rows={3}
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
              value={solutions.colorMode || 'custom'}
              onValueChange={(value) => updateThemeParam(['content', 'solutions', 'colorMode'], value)}
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
          
          {solutions.colorMode === 'custom' && (
            <>
              <div>
                <Label htmlFor="backgroundColor">Màu nền</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={solutions.backgroundColor || '#FFFFFF'}
                    onChange={(e) => updateThemeParam(['content', 'solutions', 'backgroundColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={solutions.backgroundColor || '#FFFFFF'}
                    onChange={(e) => updateThemeParam(['content', 'solutions', 'backgroundColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="textColor">Màu chữ</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={solutions.textColor || '#000000'}
                    onChange={(e) => updateThemeParam(['content', 'solutions', 'textColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={solutions.textColor || '#000000'}
                    onChange={(e) => updateThemeParam(['content', 'solutions', 'textColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="primaryColor">Màu chính</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={solutions.primaryColor || '#28A745'}
                    onChange={(e) => updateThemeParam(['content', 'solutions', 'primaryColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={solutions.primaryColor || '#28A745'}
                    onChange={(e) => updateThemeParam(['content', 'solutions', 'primaryColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </>
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
              value={solutions.titleSize || '2xl'}
              onValueChange={(value) => updateThemeParam(['content', 'solutions', 'titleSize'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Nhỏ</SelectItem>
                <SelectItem value="base">Vừa</SelectItem>
                <SelectItem value="lg">Lớn</SelectItem>
                <SelectItem value="xl">Rất lớn</SelectItem>
                <SelectItem value="2xl">Cực lớn</SelectItem>
                <SelectItem value="3xl">Khổng lồ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="titleWeight">Độ đậm tiêu đề</Label>
            <Select
              value={solutions.titleWeight || 'bold'}
              onValueChange={(value) => updateThemeParam(['content', 'solutions', 'titleWeight'], value)}
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
            <Label htmlFor="titleFont">Font tiêu đề</Label>
            <Select
              value={solutions.titleFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'solutions', 'titleFont'], value)}
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
            <Label htmlFor="descriptionSize">Kích thước mô tả</Label>
            <Select
              value={solutions.descriptionSize || 'base'}
              onValueChange={(value) => updateThemeParam(['content', 'solutions', 'descriptionSize'], value)}
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
            <Label htmlFor="descriptionWeight">Độ đậm mô tả</Label>
            <Select
              value={solutions.descriptionWeight || 'normal'}
              onValueChange={(value) => updateThemeParam(['content', 'solutions', 'descriptionWeight'], value)}
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
            <Label htmlFor="descriptionFont">Font mô tả</Label>
            <Select
              value={solutions.descriptionFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'solutions', 'descriptionFont'], value)}
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

      {/* Item Typography */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Kiểu chữ cho từng item</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="itemTitleWeight">Độ đậm tiêu đề item</Label>
            <Select
              value={solutions.itemTitleWeight || 'semibold'}
              onValueChange={(value) => updateThemeParam(['content', 'solutions', 'itemTitleWeight'], value)}
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
            <Label htmlFor="itemTitleFont">Font tiêu đề item</Label>
            <Select
              value={solutions.itemTitleFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'solutions', 'itemTitleFont'], value)}
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
            <Label htmlFor="itemDescriptionSize">Kích thước mô tả item</Label>
            <Select
              value={solutions.itemDescriptionSize || 'base'}
              onValueChange={(value) => updateThemeParam(['content', 'solutions', 'itemDescriptionSize'], value)}
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
            <Label htmlFor="itemDescriptionFont">Font mô tả item</Label>
            <Select
              value={solutions.itemDescriptionFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'solutions', 'itemDescriptionFont'], value)}
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
            <Label htmlFor="itemBenefitWeight">Độ đậm benefit</Label>
            <Select
              value={solutions.itemBenefitWeight || 'medium'}
              onValueChange={(value) => updateThemeParam(['content', 'solutions', 'itemBenefitWeight'], value)}
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
            <Label htmlFor="itemBenefitFont">Font benefit</Label>
            <Select
              value={solutions.itemBenefitFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'solutions', 'itemBenefitFont'], value)}
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

      {/* Danh sách giải pháp */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Danh sách giải pháp</h3>
        <div className="space-y-4">
          {solutionsItems.map((solution, index) => {
            const IconComponent = getIconComponent(solution.icon || 'CheckCircle')
            return (
              <div key={solution.id || index} className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center space-x-3 mb-3">
                  <IconComponent className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Item {index + 1}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSolution(index)}
                    className="text-red-600 hover:text-red-700 ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <Label htmlFor={`solution-icon-${index}`}>Icon</Label>
                    <Select
                      value={solution.icon || 'CheckCircle'}
                      onValueChange={(value) => {
                        const updatedSolutions = [...solutionsItems]
                        updatedSolutions[index] = { ...solution, icon: value }
                        updateThemeParam(['content', 'solutions', 'items'], updatedSolutions)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CheckCircle">✅ Hoàn thành</SelectItem>
                        <SelectItem value="Truck">🚚 Vận chuyển</SelectItem>
                        <SelectItem value="DollarSign">💰 Tiền</SelectItem>
                        <SelectItem value="Shield">🛡️ Bảo vệ</SelectItem>
                        <SelectItem value="Target">🎯 Mục tiêu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor={`solution-title-${index}`}>Tiêu đề</Label>
                    <Input
                      id={`solution-title-${index}`}
                      value={solution.title}
                      onChange={(e) => {
                        const updatedSolutions = [...solutionsItems]
                        updatedSolutions[index] = { ...solution, title: e.target.value }
                        updateThemeParam(['content', 'solutions', 'items'], updatedSolutions)
                      }}
                      placeholder="Tiêu đề giải pháp"
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <Label htmlFor={`solution-description-${index}`}>Mô tả</Label>
                  <Textarea
                    id={`solution-description-${index}`}
                    value={solution.description}
                    onChange={(e) => {
                      const updatedSolutions = [...solutionsItems]
                      updatedSolutions[index] = { ...solution, description: e.target.value }
                      updateThemeParam(['content', 'solutions', 'items'], updatedSolutions)
                    }}
                    placeholder="Mô tả chi tiết về giải pháp"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`solution-benefit-${index}`}>Lợi ích</Label>
                  <Input
                    id={`solution-benefit-${index}`}
                    value={solution.benefit}
                    onChange={(e) => {
                      const updatedSolutions = [...solutionsItems]
                      updatedSolutions[index] = { ...solution, benefit: e.target.value }
                      updateThemeParam(['content', 'solutions', 'items'], updatedSolutions)
                    }}
                    placeholder="Lợi ích chính của giải pháp"
                  />
                </div>
              </div>
            )
          })}
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <h4 className="font-medium mb-3">Thêm giải pháp mới</h4>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <Label htmlFor="new-solution-icon">Icon</Label>
                <Select
                  value={newSolution.icon}
                  onValueChange={(value) => setNewSolution({ ...newSolution, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CheckCircle">✅ Hoàn thành</SelectItem>
                    <SelectItem value="Truck">🚚 Vận chuyển</SelectItem>
                    <SelectItem value="DollarSign">💰 Tiền</SelectItem>
                    <SelectItem value="Shield">🛡️ Bảo vệ</SelectItem>
                    <SelectItem value="Target">🎯 Mục tiêu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="new-solution-title">Tiêu đề</Label>
                <Input
                  id="new-solution-title"
                  value={newSolution.title}
                  onChange={(e) => setNewSolution({ ...newSolution, title: e.target.value })}
                  placeholder="Tiêu đề giải pháp mới"
                />
              </div>
            </div>
            
            <div className="mb-3">
              <Label htmlFor="new-solution-description">Mô tả</Label>
              <Textarea
                id="new-solution-description"
                value={newSolution.description}
                onChange={(e) => setNewSolution({ ...newSolution, description: e.target.value })}
                placeholder="Mô tả chi tiết về giải pháp mới"
                rows={2}
              />
            </div>
            
            <div className="mb-3">
              <Label htmlFor="new-solution-benefit">Lợi ích</Label>
              <Input
                id="new-solution-benefit"
                value={newSolution.benefit}
                onChange={(e) => setNewSolution({ ...newSolution, benefit: e.target.value })}
                placeholder="Lợi ích chính của giải pháp mới"
              />
            </div>
            
            <Button onClick={addSolution} size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-1" />
              Thêm giải pháp
            </Button>
          </div>
        </div>
      </Card>

      {/* CTA Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Call-to-Action</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ctaTitle">Tiêu đề CTA</Label>
            <Input
              id="ctaTitle"
              value={solutions.cta?.title || ''}
              onChange={(e) => updateThemeParam(['content', 'solutions', 'cta', 'title'], e.target.value)}
              placeholder="Sẵn sàng áp dụng giải pháp?"
            />
          </div>
          
          <div>
            <Label htmlFor="ctaDescription">Mô tả CTA</Label>
            <Textarea
              id="ctaDescription"
              value={solutions.cta?.description || ''}
              onChange={(e) => updateThemeParam(['content', 'solutions', 'cta', 'description'], e.target.value)}
              placeholder="Mô tả về lý do khách hàng nên áp dụng giải pháp của bạn"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="ctaButtonText">Nút CTA</Label>
            <Input
              id="ctaButtonText"
              value={solutions.cta?.buttonText || ''}
              onChange={(e) => updateThemeParam(['content', 'solutions', 'cta', 'buttonText'], e.target.value)}
              placeholder="Bắt đầu ngay hôm nay"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ctaBackgroundColor">Màu nền CTA</Label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={solutions.cta?.backgroundColor || '#28A745'}
                  onChange={(e) => updateThemeParam(['content', 'solutions', 'cta', 'backgroundColor'], e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <Input
                  value={solutions.cta?.backgroundColor || '#28A745'}
                  onChange={(e) => updateThemeParam(['content', 'solutions', 'cta', 'backgroundColor'], e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="ctaTextColor">Màu chữ CTA</Label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={solutions.cta?.textColor || '#FFFFFF'}
                  onChange={(e) => updateThemeParam(['content', 'solutions', 'cta', 'textColor'], e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <Input
                  value={solutions.cta?.textColor || '#FFFFFF'}
                  onChange={(e) => updateThemeParam(['content', 'solutions', 'cta', 'textColor'], e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SolutionsTab
