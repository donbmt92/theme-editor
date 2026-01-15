import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ThemeParams } from '@/types'
import { Plus, Trash2, Users, Award, Globe, TrendingUp, Shield, Clock, ArrowUpRight, CheckCircle, AlertCircle, Truck, Package, Zap, Lightbulb, Coffee, FileText } from 'lucide-react'
import { useState } from 'react'

interface WhyChooseUsContent {
  title?: string
  subtitle?: string
  backgroundColor?: string
  textColor?: string
  colorMode?: 'theme' | 'custom'
  primaryColor?: string
  titleSize?: string
  titleWeight?: string
  titleFont?: string
  subtitleSize?: string
  subtitleWeight?: string
  subtitleFont?: string
  strengths?: Array<{
    id?: string
    icon: string
    title: string
    description: string
    highlight?: string
  }>
  mission?: {
    title?: string
    description?: string
    values?: string[]
  }
  vision?: {
    title?: string
    description?: string
    goals?: string[]
  }
  cta?: {
    title?: string
    description?: string
    buttonText?: string
    secondaryButtonText?: string
  }
}

interface WhyChooseUsTabProps {
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number | unknown) => void
}

const WhyChooseUsTab = ({ themeParams, updateThemeParam }: WhyChooseUsTabProps) => {
  const [newStrength, setNewStrength] = useState({ title: '', description: '', icon: 'Users', highlight: '' })
  const [newMissionValue, setNewMissionValue] = useState('')
  const [newVisionGoal, setNewVisionGoal] = useState('')

  const whyChooseUs: WhyChooseUsContent = themeParams.content?.whyChooseUs || {}
  const strengths = whyChooseUs.strengths || []
  const mission = whyChooseUs.mission || {}
  const vision = whyChooseUs.vision || {}
  const cta = whyChooseUs.cta || {}

  const addStrength = () => {
    if (newStrength.title && newStrength.description) {
      const updatedStrengths = [...strengths, {
        id: `strength-${Date.now()}`,
        ...newStrength
      }]
      updateThemeParam(['content', 'whyChooseUs', 'strengths'], updatedStrengths)
      setNewStrength({ title: '', description: '', icon: 'Users', highlight: '' })
    }
  }

  const removeStrength = (index: number) => {
    const updatedStrengths = strengths.filter((_, i) => i !== index)
    updateThemeParam(['content', 'whyChooseUs', 'strengths'], updatedStrengths)
  }

  const addMissionValue = () => {
    if (newMissionValue.trim()) {
      const currentValues = mission.values || []
      const updatedValues = [...currentValues, newMissionValue.trim()]
      updateThemeParam(['content', 'whyChooseUs', 'mission', 'values'], updatedValues)
      setNewMissionValue('')
    }
  }

  const removeMissionValue = (index: number) => {
    const currentValues = mission.values || []
    const updatedValues = currentValues.filter((_: string, i: number) => i !== index)
    updateThemeParam(['content', 'whyChooseUs', 'mission', 'values'], updatedValues)
  }

  const addVisionGoal = () => {
    if (newVisionGoal.trim()) {
      const currentGoals = vision.goals || []
      const updatedGoals = [...currentGoals, newVisionGoal.trim()]
      updateThemeParam(['content', 'whyChooseUs', 'vision', 'goals'], updatedGoals)
      setNewVisionGoal('')
    }
  }

  const removeVisionGoal = (index: number) => {
    const currentGoals = vision.goals || []
    const updatedGoals = currentGoals.filter((_: string, i: number) => i !== index)
    updateThemeParam(['content', 'whyChooseUs', 'vision', 'goals'], updatedGoals)
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Users': return Users
      case 'Award': return Award
      case 'Globe': return Globe
      case 'TrendingUp': return TrendingUp
      case 'Shield': return Shield
      case 'Clock': return Clock
      case 'ArrowUpRight': return ArrowUpRight
      case 'CheckCircle': return CheckCircle
      case 'AlertCircle': return AlertCircle
      case 'Truck': return Truck
      case 'Package': return Package
      case 'Zap': return Zap
      case 'Lightbulb': return Lightbulb
      case 'Coffee': return Coffee
      case 'FileText': return FileText
      default: return Users
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
              value={whyChooseUs.title || ''}
              onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'title'], e.target.value)}
              placeholder="Tại Sao Chọn VietCoffee Export?"
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Phụ đề</Label>
            <Textarea
              id="subtitle"
              value={whyChooseUs.subtitle || ''}
              onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'subtitle'], e.target.value)}
              placeholder="Mô tả ngắn gọn về lý do khách hàng nên chọn bạn"
              rows={2}
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
              value={whyChooseUs.colorMode || 'theme'}
              onValueChange={(value) => updateThemeParam(['content', 'whyChooseUs', 'colorMode'], value)}
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

          {(whyChooseUs.colorMode || 'theme') === 'custom' && (
            <>
              <div>
                <Label htmlFor="backgroundColor">Màu nền section</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={whyChooseUs.backgroundColor || '#FFFFFF'}
                    onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'backgroundColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={whyChooseUs.backgroundColor || '#FFFFFF'}
                    onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'backgroundColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="textColor">Màu chữ</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={whyChooseUs.textColor || '#2D3748'}
                    onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'textColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={whyChooseUs.textColor || '#2D3748'}
                    onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'textColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="primaryColor">Màu chính</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={whyChooseUs.primaryColor || '#8B4513'}
                    onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'primaryColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={whyChooseUs.primaryColor || '#8B4513'}
                    onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'primaryColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </>
          )}

          {(whyChooseUs.colorMode || 'theme') === 'theme' && (
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
              value={whyChooseUs.titleSize || '4xl'}
              onValueChange={(value) => updateThemeParam(['content', 'whyChooseUs', 'titleSize'], value)}
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
              value={whyChooseUs.titleWeight || 'bold'}
              onValueChange={(value) => updateThemeParam(['content', 'whyChooseUs', 'titleWeight'], value)}
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
              value={whyChooseUs.titleFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'whyChooseUs', 'titleFont'], value)}
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
            <Label htmlFor="subtitleSize">Kích thước phụ đề</Label>
            <Select
              value={whyChooseUs.subtitleSize || 'xl'}
              onValueChange={(value) => updateThemeParam(['content', 'whyChooseUs', 'subtitleSize'], value)}
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
            <Label htmlFor="subtitleWeight">Độ đậm phụ đề</Label>
            <Select
              value={whyChooseUs.subtitleWeight || 'normal'}
              onValueChange={(value) => updateThemeParam(['content', 'whyChooseUs', 'subtitleWeight'], value)}
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
            <Label htmlFor="subtitleFont">Font phụ đề</Label>
            <Select
              value={whyChooseUs.subtitleFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'whyChooseUs', 'subtitleFont'], value)}
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

      {/* Danh sách điểm mạnh */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Điểm mạnh</h3>
        <div className="space-y-4">
          {strengths.map((strength, index) => (
            <div key={strength.id || index} className="border rounded-lg p-4 bg-blue-50">
              <div className="flex items-center space-x-3 mb-3">
                {(() => {
                  const IconComponent = getIconComponent(strength.icon || 'Users')
                  return <IconComponent className="h-5 w-5 text-blue-600" />
                })()}
                <span className="text-sm font-medium text-gray-600">Điểm mạnh {index + 1}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeStrength(index)}
                  className="text-red-600 hover:text-red-700 ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <Label htmlFor={`strength-icon-${index}`}>Icon</Label>
                  <Select
                    value={strength.icon || 'Users'}
                    onValueChange={(value) => {
                      const updatedStrengths = [...strengths]
                      updatedStrengths[index] = { ...strength, icon: value }
                      updateThemeParam(['content', 'whyChooseUs', 'strengths'], updatedStrengths)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Users">👥 Người dùng</SelectItem>
                      <SelectItem value="Award">🏆 Giải thưởng</SelectItem>
                      <SelectItem value="Globe">🌍 Toàn cầu</SelectItem>
                      <SelectItem value="TrendingUp">📈 Xu hướng</SelectItem>
                      <SelectItem value="Shield">🛡️ Bảo vệ</SelectItem>
                      <SelectItem value="Clock">⏰ Thời gian</SelectItem>
                      <SelectItem value="ArrowUpRight">↗️ Mũi tên</SelectItem>
                      <SelectItem value="CheckCircle">✅ Hoàn thành</SelectItem>
                      <SelectItem value="AlertCircle">⚠️ Cảnh báo</SelectItem>
                      <SelectItem value="Truck">🚚 Vận chuyển</SelectItem>
                      <SelectItem value="Package">📦 Gói hàng</SelectItem>
                      <SelectItem value="Zap">⚡ Nhanh</SelectItem>
                      <SelectItem value="Lightbulb">💡 Ý tưởng</SelectItem>
                      <SelectItem value="Coffee">☕ Cà phê</SelectItem>
                      <SelectItem value="FileText">📄 Tài liệu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor={`strength-title-${index}`}>Tiêu đề</Label>
                  <Input
                    id={`strength-title-${index}`}
                    value={strength.title}
                    onChange={(e) => {
                      const updatedStrengths = [...strengths]
                      updatedStrengths[index] = { ...strength, title: e.target.value }
                      updateThemeParam(['content', 'whyChooseUs', 'strengths'], updatedStrengths)
                    }}
                    placeholder="Tiêu đề điểm mạnh"
                  />
                </div>
              </div>

              <div className="mb-3">
                <Label htmlFor={`strength-description-${index}`}>Mô tả</Label>
                <Textarea
                  id={`strength-description-${index}`}
                  value={strength.description}
                  onChange={(e) => {
                    const updatedStrengths = [...strengths]
                    updatedStrengths[index] = { ...strength, description: e.target.value }
                    updateThemeParam(['content', 'whyChooseUs', 'strengths'], updatedStrengths)
                  }}
                  placeholder="Mô tả chi tiết về điểm mạnh"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor={`strength-highlight-${index}`}>Highlight</Label>
                <Input
                  id={`strength-highlight-${index}`}
                  value={strength.highlight || ''}
                  onChange={(e) => {
                    const updatedStrengths = [...strengths]
                    updatedStrengths[index] = { ...strength, highlight: e.target.value }
                    updateThemeParam(['content', 'whyChooseUs', 'strengths'], updatedStrengths)
                  }}
                  placeholder="Điểm nổi bật (hiển thị trong badge)"
                />
              </div>
            </div>
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <h4 className="font-medium mb-3">Thêm điểm mạnh mới</h4>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <Label htmlFor="new-strength-icon">Icon</Label>
                <Select
                  value={newStrength.icon}
                  onValueChange={(value) => setNewStrength({ ...newStrength, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Users">👥 Người dùng</SelectItem>
                    <SelectItem value="Award">🏆 Giải thưởng</SelectItem>
                    <SelectItem value="Globe">🌍 Toàn cầu</SelectItem>
                    <SelectItem value="TrendingUp">📈 Xu hướng</SelectItem>
                    <SelectItem value="Shield">🛡️ Bảo vệ</SelectItem>
                    <SelectItem value="Clock">⏰ Thời gian</SelectItem>
                    <SelectItem value="ArrowUpRight">↗️ Mũi tên</SelectItem>
                    <SelectItem value="CheckCircle">✅ Hoàn thành</SelectItem>
                    <SelectItem value="AlertCircle">⚠️ Cảnh báo</SelectItem>
                    <SelectItem value="Truck">🚚 Vận chuyển</SelectItem>
                    <SelectItem value="Package">📦 Gói hàng</SelectItem>
                    <SelectItem value="Zap">⚡ Nhanh</SelectItem>
                    <SelectItem value="Lightbulb">💡 Ý tưởng</SelectItem>
                    <SelectItem value="Coffee">☕ Cà phê</SelectItem>
                    <SelectItem value="FileText">📄 Tài liệu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="new-strength-title">Tiêu đề</Label>
                <Input
                  id="new-strength-title"
                  value={newStrength.title}
                  onChange={(e) => setNewStrength({ ...newStrength, title: e.target.value })}
                  placeholder="Tiêu đề điểm mạnh mới"
                />
              </div>
            </div>

            <div className="mb-3">
              <Label htmlFor="new-strength-description">Mô tả</Label>
              <Textarea
                id="new-strength-description"
                value={newStrength.description}
                onChange={(e) => setNewStrength({ ...newStrength, description: e.target.value })}
                placeholder="Mô tả chi tiết về điểm mạnh mới"
                rows={2}
              />
            </div>

            <div className="mb-3">
              <Label htmlFor="new-strength-highlight">Highlight</Label>
              <Input
                id="new-strength-highlight"
                value={newStrength.highlight}
                onChange={(e) => setNewStrength({ ...newStrength, highlight: e.target.value })}
                placeholder="Điểm nổi bật (hiển thị trong badge)"
              />
            </div>

            <Button onClick={addStrength} size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-1" />
              Thêm điểm mạnh
            </Button>
          </div>
        </div>
      </Card>

      {/* Mission */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sứ mệnh</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="missionTitle">Tiêu đề sứ mệnh</Label>
            <Input
              id="missionTitle"
              value={mission.title || ''}
              onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'mission', 'title'], e.target.value)}
              placeholder="Sứ Mệnh Của Chúng Tôi"
            />
          </div>

          <div>
            <Label htmlFor="missionDescription">Mô tả sứ mệnh</Label>
            <Textarea
              id="missionDescription"
              value={mission.description || ''}
              onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'mission', 'description'], e.target.value)}
              placeholder="Mô tả chi tiết về sứ mệnh của công ty"
              rows={3}
            />
          </div>

          <div>
            <Label>Giá trị cốt lõi</Label>
            <div className="space-y-2 mt-2">
              {(mission.values || []).map((value: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={value}
                    onChange={(e) => {
                      const currentValues = [...(mission.values || [])]
                      currentValues[index] = e.target.value
                      updateThemeParam(['content', 'whyChooseUs', 'mission', 'values'], currentValues)
                    }}
                    placeholder="Giá trị cốt lõi"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeMissionValue(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex space-x-2">
                <Input
                  value={newMissionValue}
                  onChange={(e) => setNewMissionValue(e.target.value)}
                  placeholder="Thêm giá trị mới"
                  className="flex-1"
                />
                <Button onClick={addMissionValue} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Vision */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tầm nhìn</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="visionTitle">Tiêu đề tầm nhìn</Label>
            <Input
              id="visionTitle"
              value={vision.title || ''}
              onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'vision', 'title'], e.target.value)}
              placeholder="Tầm Nhìn Của Chúng Tôi"
            />
          </div>

          <div>
            <Label htmlFor="visionDescription">Mô tả tầm nhìn</Label>
            <Textarea
              id="visionDescription"
              value={vision.description || ''}
              onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'vision', 'description'], e.target.value)}
              placeholder="Mô tả chi tiết về tầm nhìn của công ty"
              rows={3}
            />
          </div>

          <div>
            <Label>Mục tiêu 2025</Label>
            <div className="space-y-2 mt-2">
              {(vision.goals || []).map((goal: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={goal}
                    onChange={(e) => {
                      const currentGoals = [...(vision.goals || [])]
                      currentGoals[index] = e.target.value
                      updateThemeParam(['content', 'whyChooseUs', 'vision', 'goals'], currentGoals)
                    }}
                    placeholder="Mục tiêu"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeVisionGoal(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex space-x-2">
                <Input
                  value={newVisionGoal}
                  onChange={(e) => setNewVisionGoal(e.target.value)}
                  placeholder="Thêm mục tiêu mới"
                  className="flex-1"
                />
                <Button onClick={addVisionGoal} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
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
              value={cta.title || ''}
              onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'cta', 'title'], e.target.value)}
              placeholder="Sẵn Sàng Bắt Đầu Hành Trình Nhập Khẩu Cà Phê?"
            />
          </div>

          <div>
            <Label htmlFor="ctaDescription">Mô tả CTA</Label>
            <Textarea
              id="ctaDescription"
              value={cta.description || ''}
              onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'cta', 'description'], e.target.value)}
              placeholder="Mô tả về lý do khách hàng nên liên hệ với bạn"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="ctaButtonText">Nút CTA chính</Label>
            <Input
              id="ctaButtonText"
              value={cta.buttonText || ''}
              onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'cta', 'buttonText'], e.target.value)}
              placeholder="Đặt Lịch Tư Vấn Miễn Phí"
            />
          </div>

          {/* <div>
            <Label htmlFor="ctaSecondaryButtonText">Nút CTA phụ</Label>
            <Input
              id="ctaSecondaryButtonText"
              value={cta.secondaryButtonText || ''}
              onChange={(e) => updateThemeParam(['content', 'whyChooseUs', 'cta', 'secondaryButtonText'], e.target.value)}
              placeholder="Tải Hồ Sơ Công Ty"
            />
          </div> */}
        </div>
      </Card>
    </div>
  )
}

export default WhyChooseUsTab
