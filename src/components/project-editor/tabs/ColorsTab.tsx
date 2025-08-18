import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ThemeParams } from '@/types'

interface ColorsTabProps {
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number) => void
}

const ColorsTab = ({ themeParams, updateThemeParam }: ColorsTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Màu chủ đề</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Màu chính</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={themeParams.colors?.primary || '#8B4513'}
                onChange={(e) => updateThemeParam(['colors', 'primary'], e.target.value)}
                className="w-12 h-10 rounded border border-gray-300"
              />
              <Input
                value={themeParams.colors?.primary || '#8B4513'}
                onChange={(e) => updateThemeParam(['colors', 'primary'], e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Màu phụ</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={themeParams.colors?.secondary || '#D2691E'}
                onChange={(e) => updateThemeParam(['colors', 'secondary'], e.target.value)}
                className="w-12 h-10 rounded border border-gray-300"
              />
              <Input
                value={themeParams.colors?.secondary || '#D2691E'}
                onChange={(e) => updateThemeParam(['colors', 'secondary'], e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Màu nhấn</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={themeParams.colors?.accent || '#F4A460'}
                onChange={(e) => updateThemeParam(['colors', 'accent'], e.target.value)}
                className="w-12 h-10 rounded border border-gray-300"
              />
              <Input
                value={themeParams.colors?.accent || '#F4A460'}
                onChange={(e) => updateThemeParam(['colors', 'accent'], e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Màu nền</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={themeParams.colors?.background || '#FFFFFF'}
                onChange={(e) => updateThemeParam(['colors', 'background'], e.target.value)}
                className="w-12 h-10 rounded border border-gray-300"
              />
              <Input
                value={themeParams.colors?.background || '#FFFFFF'}
                onChange={(e) => updateThemeParam(['colors', 'background'], e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Màu chữ</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={themeParams.colors?.text || '#2D3748'}
                onChange={(e) => updateThemeParam(['colors', 'text'], e.target.value)}
                className="w-12 h-10 rounded border border-gray-300"
              />
              <Input
                value={themeParams.colors?.text || '#2D3748'}
                onChange={(e) => updateThemeParam(['colors', 'text'], e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Màu viền</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={themeParams.colors?.border || '#E2E8F0'}
                onChange={(e) => updateThemeParam(['colors', 'border'], e.target.value)}
                className="w-12 h-10 rounded border border-gray-300"
              />
              <Input
                value={themeParams.colors?.border || '#E2E8F0'}
                onChange={(e) => updateThemeParam(['colors', 'border'], e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Màu mờ</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={themeParams.colors?.muted || '#718096'}
                onChange={(e) => updateThemeParam(['colors', 'muted'], e.target.value)}
                className="w-12 h-10 rounded border border-gray-300"
              />
              <Input
                value={themeParams.colors?.muted || '#718096'}
                onChange={(e) => updateThemeParam(['colors', 'muted'], e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ColorsTab
