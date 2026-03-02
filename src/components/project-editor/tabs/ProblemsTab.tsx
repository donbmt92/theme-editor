import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ThemeParams } from '@/types'
import { Plus, Trash2, AlertTriangle, Clock, DollarSign, Shield, Target } from 'lucide-react'
import { useState } from 'react'

interface ProblemsTabProps {
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number | unknown) => void
}

const ProblemsTab = ({ themeParams, updateThemeParam }: ProblemsTabProps) => {
  const [newProblem, setNewProblem] = useState({ title: '', description: '', icon: 'AlertTriangle' })

  const problems = themeParams.content?.problems || {}
  const problemsItems = problems.items || []

  const addProblem = () => {
    if (newProblem.title && newProblem.description) {
      const updatedProblems = [...problemsItems, {
        id: `problem-${Date.now()}`,
        ...newProblem
      }]
      updateThemeParam(['content', 'problems', 'items'], updatedProblems)
      setNewProblem({ title: '', description: '', icon: 'AlertTriangle' })
    }
  }

  const removeProblem = (index: number) => {
    const updatedProblems = problemsItems.filter((_, i) => i !== index)
    updateThemeParam(['content', 'problems', 'items'], updatedProblems)
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle': return AlertTriangle
      case 'Clock': return Clock
      case 'DollarSign': return DollarSign
      case 'Shield': return Shield
      case 'Target': return Target
      default: return AlertTriangle
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
              value={problems.title || ''}
              onChange={(e) => updateThemeParam(['content', 'problems', 'title'], e.target.value)}
              placeholder="Thách Thức Thường Gặp"
            />
          </div>

          {/* <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={problems.description || ''}
              onChange={(e) => updateThemeParam(['content', 'problems', 'description'], e.target.value)}
              placeholder="Mô tả về những thách thức mà khách hàng thường gặp phải"
              rows={3}
            />
          </div> */}
        </div>
      </Card>

      {/* Màu sắc */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Màu sắc</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="colorMode">Chế độ màu</Label>
            <Select
              value={problems.colorMode || 'theme'}
              onValueChange={(value) => updateThemeParam(['content', 'problems', 'colorMode'], value)}
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

          {problems.colorMode === 'theme' && (
            <>
              <div>
                <Label htmlFor="backgroundColor">Màu nền</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={problems.backgroundColor || '#F8F9FA'}
                    onChange={(e) => updateThemeParam(['content', 'problems', 'backgroundColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={problems.backgroundColor || '#F8F9FA'}
                    onChange={(e) => updateThemeParam(['content', 'problems', 'backgroundColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="textColor">Màu chữ</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={problems.textColor || '#000000'}
                    onChange={(e) => updateThemeParam(['content', 'problems', 'textColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={problems.textColor || '#000000'}
                    onChange={(e) => updateThemeParam(['content', 'problems', 'textColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="primaryColor">Màu chính</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={problems.primaryColor || '#DC2626'}
                    onChange={(e) => updateThemeParam(['content', 'problems', 'primaryColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={problems.primaryColor || '#DC2626'}
                    onChange={(e) => updateThemeParam(['content', 'problems', 'primaryColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Card>



      {/* Danh sách vấn đề */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Danh sách vấn đề</h3>
        <div className="space-y-4">
          {problemsItems.map((problem, index) => {
            const IconComponent = getIconComponent(problem.icon || 'AlertTriangle')
            return (
              <div key={problem.id || index} className="border rounded-lg p-4 bg-red-50">
                <div className="flex items-center space-x-3 mb-3">
                  <IconComponent className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-600">Item {index + 1}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProblem(index)}
                    className="text-red-600 hover:text-red-700 ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <Label htmlFor={`problem-icon-${index}`}>Icon</Label>
                    <Select
                      value={problem.icon || 'AlertTriangle'}
                      onValueChange={(value) => {
                        const updatedProblems = [...problemsItems]
                        updatedProblems[index] = { ...problem, icon: value }
                        updateThemeParam(['content', 'problems', 'items'], updatedProblems)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AlertTriangle">⚠️ Cảnh báo</SelectItem>
                        <SelectItem value="Clock">⏰ Đồng hồ</SelectItem>
                        <SelectItem value="DollarSign">💰 Tiền</SelectItem>
                        <SelectItem value="Shield">🛡️ Bảo vệ</SelectItem>
                        <SelectItem value="Target">🎯 Mục tiêu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor={`problem-title-${index}`}>Tiêu đề</Label>
                    <Input
                      id={`problem-title-${index}`}
                      value={problem.title}
                      onChange={(e) => {
                        const updatedProblems = [...problemsItems]
                        updatedProblems[index] = { ...problem, title: e.target.value }
                        updateThemeParam(['content', 'problems', 'items'], updatedProblems)
                      }}
                      placeholder="Tiêu đề vấn đề"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`problem-description-${index}`}>Mô tả</Label>
                  <Textarea
                    id={`problem-description-${index}`}
                    value={problem.description}
                    onChange={(e) => {
                      const updatedProblems = [...problemsItems]
                      updatedProblems[index] = { ...problem, description: e.target.value }
                      updateThemeParam(['content', 'problems', 'items'], updatedProblems)
                    }}
                    placeholder="Mô tả chi tiết về vấn đề"
                    rows={2}
                  />
                </div>
              </div>
            )
          })}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <h4 className="font-medium mb-3">Thêm vấn đề mới</h4>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <Label htmlFor="new-problem-icon">Icon</Label>
                <Select
                  value={newProblem.icon}
                  onValueChange={(value) => setNewProblem({ ...newProblem, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AlertTriangle">⚠️ Cảnh báo</SelectItem>
                    <SelectItem value="Clock">⏰ Đồng hồ</SelectItem>
                    <SelectItem value="DollarSign">💰 Tiền</SelectItem>
                    <SelectItem value="Shield">🛡️ Bảo vệ</SelectItem>
                    <SelectItem value="Target">🎯 Mục tiêu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="new-problem-title">Tiêu đề</Label>
                <Input
                  id="new-problem-title"
                  value={newProblem.title}
                  onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                  placeholder="Tiêu đề vấn đề mới"
                />
              </div>
            </div>

            <div className="mb-3">
              <Label htmlFor="new-problem-description">Mô tả</Label>
              <Textarea
                id="new-problem-description"
                value={newProblem.description}
                onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
                placeholder="Mô tả chi tiết về vấn đề mới"
                rows={2}
              />
            </div>

            <Button onClick={addProblem} size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-1" />
              Thêm vấn đề
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
              value={problems.cta?.title || ''}
              onChange={(e) => updateThemeParam(['content', 'problems', 'cta', 'title'], e.target.value)}
              placeholder={themeParams.projectLanguage === 'english' ? "Why Choose Us?" : "Tại sao chọn chúng tôi?"}
            />
          </div>

          <div>
            <Label htmlFor="ctaDescription">Mô tả CTA</Label>
            <Textarea
              id="ctaDescription"
              value={problems.cta?.description || ''}
              onChange={(e) => updateThemeParam(['content', 'problems', 'cta', 'description'], e.target.value)}
              placeholder={themeParams.projectLanguage === 'english' ? "Describe why customers should choose you" : "Mô tả về lý do khách hàng nên chọn bạn"}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="ctaButtonText">Nút CTA</Label>
            <Input
              id="ctaButtonText"
              value={problems.cta?.buttonText || ''}
              onChange={(e) => updateThemeParam(['content', 'problems', 'cta', 'buttonText'], e.target.value)}
              placeholder={themeParams.projectLanguage === 'english' ? "Learn More" : "Tìm hiểu thêm"}
            />
          </div>

          {/* Stats Configuration */}
          <div className="border-t pt-4">
            <h4 className="text-md font-medium mb-3">Thống kê</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="stat1Value">Giá trị thống kê 1</Label>
                <Input
                  id="stat1Value"
                  value={problems.cta?.stats?.stat1?.value || '15+'}
                  onChange={(e) => updateThemeParam(['content', 'problems', 'cta', 'stats', 'stat1', 'value'], e.target.value)}
                  placeholder="15+"
                />
              </div>
              <div>
                <Label htmlFor="stat2Value">Giá trị thống kê 2</Label>
                <Input
                  id="stat2Value"
                  value={problems.cta?.stats?.stat2?.value || '500+'}
                  onChange={(e) => updateThemeParam(['content', 'problems', 'cta', 'stats', 'stat2', 'value'], e.target.value)}
                  placeholder="500+"
                />
              </div>
              <div>
                <Label htmlFor="stat3Value">Giá trị thống kê 3</Label>
                <Input
                  id="stat3Value"
                  value={problems.cta?.stats?.stat3?.value || '99.8%'}
                  onChange={(e) => updateThemeParam(['content', 'problems', 'cta', 'stats', 'stat3', 'value'], e.target.value)}
                  placeholder="99.8%"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <Label htmlFor="stat1Label">Nhãn thống kê 1</Label>
                <Input
                  id="stat1Label"
                  value={problems.cta?.stats?.stat1?.label || ''}
                  onChange={(e) => updateThemeParam(['content', 'problems', 'cta', 'stats', 'stat1', 'label'], e.target.value)}
                  placeholder={themeParams.projectLanguage === 'english' ? "Years of Experience" : "Năm kinh nghiệm"}
                />
              </div>
              <div>
                <Label htmlFor="stat2Label">Nhãn thống kê 2</Label>
                <Input
                  id="stat2Label"
                  value={problems.cta?.stats?.stat2?.label || ''}
                  onChange={(e) => updateThemeParam(['content', 'problems', 'cta', 'stats', 'stat2', 'label'], e.target.value)}
                  placeholder={themeParams.projectLanguage === 'english' ? "Successful Shipments" : "Lô hàng thành công"}
                />
              </div>
              <div>
                <Label htmlFor="stat3Label">Nhãn thống kê 3</Label>
                <Input
                  id="stat3Label"
                  value={problems.cta?.stats?.stat3?.label || ''}
                  onChange={(e) => updateThemeParam(['content', 'problems', 'cta', 'stats', 'stat3', 'label'], e.target.value)}
                  placeholder={themeParams.projectLanguage === 'english' ? "On-Time Delivery" : "Giao hàng đúng hạn"}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ProblemsTab
