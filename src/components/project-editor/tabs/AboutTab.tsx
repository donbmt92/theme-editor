import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ThemeParams } from '@/types'

interface AboutTabProps {
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number | unknown) => void
}

const AboutTab = ({ themeParams, updateThemeParam }: AboutTabProps) => {

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tiêu đề section</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề chính</Label>
            <Input
              id="title"
              value={themeParams.content?.about?.title || ''}
              onChange={(e) => updateThemeParam(['content', 'about', 'title'], e.target.value)}
              placeholder="Giải Quyết Thách Thức Xuất Nhập Khẩu Thực Tế"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={themeParams.content?.about?.description || ''}
              onChange={(e) => updateThemeParam(['content', 'about', 'description'], e.target.value)}
              placeholder="Chúng tôi hiểu rõ những khó khăn khi xuất khẩu cà phê từ Việt Nam. Đây là cách chúng tôi giải quyết chúng cho bạn."
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
            <Label htmlFor="textColor">Màu chữ</Label>
            <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={themeParams.content?.about?.textColor || '#000000'}
                  onChange={(e) => updateThemeParam(['content', 'about', 'textColor'], e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <Input
                  value={themeParams.content?.about?.textColor || '#000000'}
                  onChange={(e) => updateThemeParam(['content', 'about', 'textColor'], e.target.value)}
                  className="flex-1"
                />
            </div>
          </div>
          
          <div>
            <Label htmlFor="backgroundColor">Màu nền</Label>
            <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={themeParams.content?.about?.backgroundColor || '#FFFFFF'}
                  onChange={(e) => updateThemeParam(['content', 'about', 'backgroundColor'], e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <Input
                  value={themeParams.content?.about?.backgroundColor || '#FFFFFF'}
                  onChange={(e) => updateThemeParam(['content', 'about', 'backgroundColor'], e.target.value)}
                  className="flex-1"
                />
            </div>
          </div>
        </div>
      </Card>

      {/* Typography */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Kiểu chữ</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="titleSize">Kích thước tiêu đề</Label>
            <Select
              value={themeParams.content?.about?.titleSize || '2xl'}
              onValueChange={(value) => updateThemeParam(['content', 'about', 'titleSize'], value)}
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
              value={themeParams.content?.about?.titleWeight || 'bold'}
              onValueChange={(value) => updateThemeParam(['content', 'about', 'titleWeight'], value)}
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
              value={themeParams.content?.about?.titleFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'about', 'titleFont'], value)}
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
              value={themeParams.content?.about?.descriptionSize || 'base'}
              onValueChange={(value) => updateThemeParam(['content', 'about', 'descriptionSize'], value)}
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
              value={themeParams.content?.about?.descriptionWeight || 'normal'}
              onValueChange={(value) => updateThemeParam(['content', 'about', 'descriptionWeight'], value)}
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
              value={themeParams.content?.about?.descriptionFont || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'about', 'descriptionFont'], value)}
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
    </div>
  )
}

export default AboutTab
