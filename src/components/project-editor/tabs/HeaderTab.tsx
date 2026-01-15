import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ImageUpload from '@/components/ui/image-upload'
import { ThemeParams } from '@/types'
import { Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'

interface HeaderTabProps {
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number | unknown) => void
}

const HeaderTab = ({ themeParams, updateThemeParam }: HeaderTabProps) => {
  const [newNavItem, setNewNavItem] = useState({ name: '', href: '' })
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '', icon: '' })

  const header = themeParams.content?.header || {}
  const navigation = header.navigation || []
  const socialLinks = header.socialLinks || []

  // Đảm bảo các thuộc tính cần thiết tồn tại
  const headerWithDefaults = {
    colorMode: (header as any).colorMode || 'theme',
    backgroundColor: header.backgroundColor || '#FFFFFF',
    textColor: header.textColor || '#000000',
    primaryColor: (header as any).primaryColor || '#3B82F6',
    ...header
  }

  const addNavigationItem = () => {
    if (newNavItem.name && newNavItem.href) {
      const updatedNav = [...navigation, { name: newNavItem.name, href: newNavItem.href }]
      updateThemeParam(['content', 'header', 'navigation'], updatedNav)
      setNewNavItem({ name: '', href: '' })
    }
  }

  const removeNavigationItem = (index: number) => {
    const updatedNav = navigation.filter((_, i) => i !== index)
    updateThemeParam(['content', 'header', 'navigation'], updatedNav)
  }

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      const updatedSocial = [...socialLinks, { ...newSocialLink }]
      updateThemeParam(['content', 'header', 'socialLinks'], updatedSocial)
      setNewSocialLink({ platform: '', url: '', icon: '' })
    }
  }

  const removeSocialLink = (index: number) => {
    const updatedSocial = socialLinks.filter((_, i) => i !== index)
    updateThemeParam(['content', 'header', 'socialLinks'], updatedSocial)
  }

  return (
    <div className="space-y-6">
      {/* Logo và Brand */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Logo và Brand</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="logo">Logo</Label>
            <ImageUpload
              value={header.logo || ''}
              onChange={(url) => updateThemeParam(['content', 'header', 'logo'], url)}
              placeholder="Upload logo công ty"
              recommendedSize="256x256px"
              aspectRatio="1:1"
            />
          </div>

          <div>
            <Label htmlFor="logoSize">Kích thước logo</Label>
            <Select
              value={header.logoSize || 'medium'}
              onValueChange={(value) => updateThemeParam(['content', 'header', 'logoSize'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Nhỏ (32x32px)</SelectItem>
                <SelectItem value="medium">Vừa (64x64px)</SelectItem>
                <SelectItem value="large">Lớn (80x80px)</SelectItem>
                <SelectItem value="xlarge">Rất lớn (96x96px)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Tiêu đề chính</Label>
            <Input
              id="title"
              value={header.title || ''}
              onChange={(e) => updateThemeParam(['content', 'header', 'title'], e.target.value)}
              placeholder="Tên công ty của bạn"
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Tiêu đề phụ</Label>
            <Input
              id="subtitle"
              value={header.subtitle || ''}
              onChange={(e) => updateThemeParam(['content', 'header', 'subtitle'], e.target.value)}
              placeholder="Slogan hoặc mô tả ngắn"
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
              value={headerWithDefaults.colorMode}
              onValueChange={(value) => updateThemeParam(['content', 'header', 'colorMode'], value)}
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

          {headerWithDefaults.colorMode === 'custom' && (
            <>
              <div>
                <Label htmlFor="backgroundColor">Màu nền</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={header.backgroundColor || '#FFFFFF'}
                    onChange={(e) => updateThemeParam(['content', 'header', 'backgroundColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={header.backgroundColor || '#FFFFFF'}
                    onChange={(e) => updateThemeParam(['content', 'header', 'backgroundColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="textColor">Màu chữ</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={header.textColor || '#000000'}
                    onChange={(e) => updateThemeParam(['content', 'header', 'textColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={header.textColor || '#000000'}
                    onChange={(e) => updateThemeParam(['content', 'header', 'textColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="primaryColor">Màu chính</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={headerWithDefaults.primaryColor}
                    onChange={(e) => updateThemeParam(['content', 'header', 'primaryColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={headerWithDefaults.primaryColor}
                    onChange={(e) => updateThemeParam(['content', 'header', 'primaryColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </>
          )}

          {headerWithDefaults.colorMode === 'theme' && (
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

      {/* Navigation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Menu điều hướng</h3>
        <div className="space-y-4">
          {navigation.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex-1">
                <Input
                  value={item.name}
                  onChange={(e) => {
                    const updatedNav = [...navigation]
                    updatedNav[index] = { ...item, name: e.target.value }
                    updateThemeParam(['content', 'header', 'navigation'], updatedNav)
                  }}
                  placeholder="Tên menu"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={item.href}
                  onChange={(e) => {
                    const updatedNav = [...navigation]
                    updatedNav[index] = { ...item, href: e.target.value }
                    updateThemeParam(['content', 'header', 'navigation'], updatedNav)
                  }}
                  placeholder="Liên kết"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeNavigationItem(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center space-x-3">
            <Input
              value={newNavItem.name}
              onChange={(e) => setNewNavItem({ ...newNavItem, name: e.target.value })}
              placeholder="Tên menu mới"
            />
            <Input
              value={newNavItem.href}
              onChange={(e) => setNewNavItem({ ...newNavItem, href: e.target.value })}
              placeholder="Liên kết"
            />
            <Button onClick={addNavigationItem} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </div>
        </div>
      </Card>

      {/* Thông tin liên hệ */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              value={header.contactInfo?.phone || ''}
              onChange={(e) => updateThemeParam(['content', 'header', 'contactInfo', 'phone'], e.target.value)}
              placeholder="+84 123 456 789"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={header.contactInfo?.email || ''}
              onChange={(e) => updateThemeParam(['content', 'header', 'contactInfo', 'email'], e.target.value)}
              placeholder="info@company.com"
            />
          </div>
        </div>
      </Card>

      {/* Mạng xã hội */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Mạng xã hội</h3>
        <div className="space-y-4">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex-1">
                <Input
                  value={link.platform}
                  onChange={(e) => {
                    const updatedSocial = [...socialLinks]
                    updatedSocial[index] = { ...link, platform: e.target.value }
                    updateThemeParam(['content', 'header', 'socialLinks'], updatedSocial)
                  }}
                  placeholder="Nền tảng (Facebook, Instagram, LinkedIn...)"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={link.url}
                  onChange={(e) => {
                    const updatedSocial = [...socialLinks]
                    updatedSocial[index] = { ...link, url: e.target.value }
                    updateThemeParam(['content', 'header', 'socialLinks'], updatedSocial)
                  }}
                  placeholder="URL"
                />
              </div>
              <div className="w-32">
                <Input
                  value={link.icon || ''}
                  onChange={(e) => {
                    const updatedSocial = [...socialLinks]
                    updatedSocial[index] = { ...link, icon: e.target.value }
                    updateThemeParam(['content', 'header', 'socialLinks'], updatedSocial)
                  }}
                  placeholder="Icon (tùy chọn)"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeSocialLink(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center space-x-3">
            <Input
              value={newSocialLink.platform}
              onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
              placeholder="Nền tảng"
            />
            <Input
              value={newSocialLink.url}
              onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
              placeholder="URL"
            />
            <Input
              value={newSocialLink.icon}
              onChange={(e) => setNewSocialLink({ ...newSocialLink, icon: e.target.value })}
              placeholder="Icon (tùy chọn)"
              className="w-32"
            />
            <Button onClick={addSocialLink} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default HeaderTab
