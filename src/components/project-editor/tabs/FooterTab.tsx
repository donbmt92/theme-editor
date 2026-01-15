import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ThemeParams } from '@/types'
import { Plus, Trash2 } from 'lucide-react'

interface FooterTabProps {
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number | unknown) => void
}

const FooterTab = ({ themeParams, updateThemeParam }: FooterTabProps) => {
  const addQuickLink = () => {
    const currentLinks = themeParams?.content?.footer?.quickLinks || []
    const newLink = { name: '', href: '#' }
    updateThemeParam(['content', 'footer', 'quickLinks'], [...currentLinks, newLink])
  }

  const removeQuickLink = (index: number) => {
    const currentLinks = themeParams?.content?.footer?.quickLinks || []
    const newLinks = currentLinks.filter((_, i) => i !== index)
    updateThemeParam(['content', 'footer', 'quickLinks'], newLinks)
  }

  const updateQuickLink = (index: number, field: string, value: string) => {
    const currentLinks = themeParams?.content?.footer?.quickLinks || []
    const updatedLinks = currentLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    )
    updateThemeParam(['content', 'footer', 'quickLinks'], updatedLinks)
  }

  const addResource = () => {
    const currentResources = themeParams?.content?.footer?.resources || []
    const newResource = { name: '', href: '#' }
    updateThemeParam(['content', 'footer', 'resources'], [...currentResources, newResource])
  }

  const removeResource = (index: number) => {
    const currentResources = themeParams?.content?.footer?.resources || []
    const newResources = currentResources.filter((_, i) => i !== index)
    updateThemeParam(['content', 'footer', 'resources'], newResources)
  }

  const updateResource = (index: number, field: string, value: string) => {
    const currentResources = themeParams?.content?.footer?.resources || []
    const updatedResources = currentResources.map((resource, i) =>
      i === index ? { ...resource, [field]: value } : resource
    )
    updateThemeParam(['content', 'footer', 'resources'], updatedResources)
  }

  const addLegal = () => {
    const currentLegal = themeParams?.content?.footer?.legal || []
    const newLegal = { name: '', href: '#' }
    updateThemeParam(['content', 'footer', 'legal'], [...currentLegal, newLegal])
  }

  const removeLegal = (index: number) => {
    const currentLegal = themeParams?.content?.footer?.legal || []
    const newLegal = currentLegal.filter((_, i) => i !== index)
    updateThemeParam(['content', 'footer', 'legal'], newLegal)
  }

  const updateLegal = (index: number, field: string, value: string) => {
    const currentLegal = themeParams?.content?.footer?.legal || []
    const updatedLegal = currentLegal.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    updateThemeParam(['content', 'footer', 'legal'], updatedLegal)
  }

  const addSocialLink = () => {
    const currentSocial = themeParams?.content?.footer?.socialLinks || []
    const newSocial = { icon: 'Facebook', href: '#', label: 'Facebook' }
    updateThemeParam(['content', 'footer', 'socialLinks'], [...currentSocial, newSocial])
  }

  const removeSocialLink = (index: number) => {
    const currentSocial = themeParams?.content?.footer?.socialLinks || []
    const newSocial = currentSocial.filter((_, i) => i !== index)
    updateThemeParam(['content', 'footer', 'socialLinks'], newSocial)
  }

  const updateSocialLink = (index: number, field: string, value: string) => {
    const currentSocial = themeParams?.content?.footer?.socialLinks || []
    const updatedSocial = currentSocial.map((social, i) =>
      i === index ? { ...social, [field]: value } : social
    )
    updateThemeParam(['content', 'footer', 'socialLinks'], updatedSocial)
  }

  return (
    <div className="space-y-6">
      {/* Company Info Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Thông tin công ty</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tên công ty</label>
            <Input
              value={themeParams?.content?.footer?.companyName || ''}
              onChange={(e) => updateThemeParam(['content', 'footer', 'companyName'], e.target.value)}
              placeholder="VietCoffee Export"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mô tả công ty</label>
            <Textarea
              value={themeParams?.content?.footer?.description || ''}
              onChange={(e) => updateThemeParam(['content', 'footer', 'description'], e.target.value)}
              placeholder="Đối tác tin cậy của bạn cho xuất khẩu cà phê Việt Nam cao cấp đến thị trường Mỹ. Chất lượng, độ tin cậy và dịch vụ xuất sắc từ năm 2009."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="colorMode">Chế độ màu</Label>
            <Select
              value={themeParams?.content?.footer?.colorMode || 'theme'}
              onValueChange={(value) => updateThemeParam(['content', 'footer', 'colorMode'], value)}
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

          {(themeParams?.content?.footer?.colorMode || 'theme') === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Màu nền</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={themeParams?.content?.footer?.backgroundColor || '#1F2937'}
                    onChange={(e) => updateThemeParam(['content', 'footer', 'backgroundColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={themeParams?.content?.footer?.backgroundColor || '#1F2937'}
                    onChange={(e) => updateThemeParam(['content', 'footer', 'backgroundColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Màu chữ</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={themeParams?.content?.footer?.textColor || '#F9FAFB'}
                    onChange={(e) => updateThemeParam(['content', 'footer', 'textColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={themeParams?.content?.footer?.textColor || '#F9FAFB'}
                    onChange={(e) => updateThemeParam(['content', 'footer', 'textColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Màu chính</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={themeParams?.content?.footer?.primaryColor || '#8B4513'}
                    onChange={(e) => updateThemeParam(['content', 'footer', 'primaryColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={themeParams?.content?.footer?.primaryColor || '#8B4513'}
                    onChange={(e) => updateThemeParam(['content', 'footer', 'primaryColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </>
          )}

          {(themeParams?.content?.footer?.colorMode || 'theme') === 'theme' && (
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
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Kiểu chữ</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fontSize">Kích thước chữ</Label>
            <Select
              value={themeParams?.content?.footer?.fontSize || 'base'}
              onValueChange={(value) => updateThemeParam(['content', 'footer', 'fontSize'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Nhỏ</SelectItem>
                <SelectItem value="base">Bình thường</SelectItem>
                <SelectItem value="lg">Lớn</SelectItem>
                <SelectItem value="xl">Rất lớn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fontWeight">Độ đậm</Label>
            <Select
              value={themeParams?.content?.footer?.fontWeight || 'normal'}
              onValueChange={(value) => updateThemeParam(['content', 'footer', 'fontWeight'], value)}
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
            <Label htmlFor="fontFamily">Font chữ</Label>
            <Select
              value={themeParams?.content?.footer?.fontFamily || 'inter'}
              onValueChange={(value) => updateThemeParam(['content', 'footer', 'fontFamily'], value)}
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
            <Label htmlFor="lineHeight">Chiều cao dòng</Label>
            <Select
              value={themeParams?.content?.footer?.lineHeight || 'normal'}
              onValueChange={(value) => updateThemeParam(['content', 'footer', 'lineHeight'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tight">Chặt</SelectItem>
                <SelectItem value="normal">Bình thường</SelectItem>
                <SelectItem value="relaxed">Thoải mái</SelectItem>
                <SelectItem value="loose">Rộng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Contact Info Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Số điện thoại</label>
            <Input
              value={themeParams?.content?.footer?.contact?.phone || ''}
              onChange={(e) => updateThemeParam(['content', 'footer', 'contact', 'phone'], e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              value={themeParams?.content?.footer?.contact?.email || ''}
              onChange={(e) => updateThemeParam(['content', 'footer', 'contact', 'email'], e.target.value)}
              placeholder="info@vietcoffeeexport.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Địa chỉ</label>
            <Textarea
              value={themeParams?.content?.footer?.contact?.address || ''}
              onChange={(e) => updateThemeParam(['content', 'footer', 'contact', 'address'], e.target.value)}
              placeholder="123 Đường Xuất Khẩu, Tỉnh Bình Phước, Việt Nam"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Giờ làm việc</label>
            <Input
              value={themeParams?.content?.footer?.contact?.businessHours || ''}
              onChange={(e) => updateThemeParam(['content', 'footer', 'contact', 'businessHours'], e.target.value)}
              placeholder="Thứ 2-Thứ 6: 8AM-6PM (EST)"
            />
          </div>
        </div>
      </Card>

      {/* Quick Links */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Liên kết nhanh</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addQuickLink}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Thêm liên kết
          </Button>
        </div>
        <div className="space-y-4">
          {(themeParams?.content?.footer?.quickLinks || []).map((link, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Liên kết {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeQuickLink(index)}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Xóa
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên liên kết</label>
                  <Input
                    value={link.name || ''}
                    onChange={(e) => updateQuickLink(index, 'name', e.target.value)}
                    placeholder="Về Chúng Tôi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <Input
                    value={link.href || ''}
                    onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
                    placeholder="#about"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Resources */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tài nguyên</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addResource}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Thêm tài nguyên
          </Button>
        </div>
        <div className="space-y-4">
          {(themeParams?.content?.footer?.resources || []).map((resource, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Tài nguyên {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeResource(index)}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Xóa
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên tài nguyên</label>
                  <Input
                    value={resource.name || ''}
                    onChange={(e) => updateResource(index, 'name', e.target.value)}
                    placeholder="Hướng Dẫn Xuất/Nhập Khẩu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <Input
                    value={resource.href || ''}
                    onChange={(e) => updateResource(index, 'href', e.target.value)}
                    placeholder="#guide"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Legal Links */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Liên kết pháp lý</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addLegal}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Thêm liên kết
          </Button>
        </div>
        <div className="space-y-4">
          {(themeParams?.content?.footer?.legal || []).map((item, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Liên kết pháp lý {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeLegal(index)}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Xóa
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên</label>
                  <Input
                    value={item.name || ''}
                    onChange={(e) => updateLegal(index, 'name', e.target.value)}
                    placeholder="Chính Sách Bảo Mật"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <Input
                    value={item.href || ''}
                    onChange={(e) => updateLegal(index, 'href', e.target.value)}
                    placeholder="#privacy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Social Links */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Liên kết mạng xã hội</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addSocialLink}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Thêm mạng xã hội
          </Button>
        </div>
        <div className="space-y-4">
          {(themeParams?.content?.footer?.socialLinks || []).map((social, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Mạng xã hội {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Xóa
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <select
                    value={social.icon || 'Facebook'}
                    onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Linkedin">LinkedIn</option>
                    <option value="Youtube">YouTube</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <Input
                    value={social.href || ''}
                    onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                    placeholder="#"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nhãn</label>
                  <Input
                    value={social.label || ''}
                    onChange={(e) => updateSocialLink(index, 'label', e.target.value)}
                    placeholder="Facebook"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Newsletter Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Cài đặt Newsletter</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Placeholder email</label>
            <Input
              value={themeParams?.content?.footer?.newsletter?.placeholder || ''}
              onChange={(e) => updateThemeParam(['content', 'footer', 'newsletter', 'placeholder'], e.target.value)}
              placeholder="Nhập email của bạn"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Text nút đăng ký</label>
            <Input
              value={themeParams?.content?.footer?.newsletter?.buttonText || ''}
              onChange={(e) => updateThemeParam(['content', 'footer', 'newsletter', 'buttonText'], e.target.value)}
              placeholder="Đăng Ký"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mô tả newsletter</label>
            <Textarea
              value={themeParams?.content?.footer?.newsletter?.description || ''}
              onChange={(e) => updateThemeParam(['content', 'footer', 'newsletter', 'description'], e.target.value)}
              placeholder="Nhận cập nhật thị trường hàng tuần và mẹo nhập khẩu gửi đến hộp thư của bạn."
              rows={2}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default FooterTab

