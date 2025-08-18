import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ThemeParams } from '@/types'

interface LayoutTabProps {
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number | unknown) => void
}

const LayoutTab = ({ themeParams, updateThemeParam }: LayoutTabProps) => {
  return (
    <div className="space-y-6">
      {/* Layout Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Cài đặt Layout</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Chiều rộng container</label>
            <Input
              value={themeParams.layout?.containerWidth || '1200px'}
              onChange={(e) => updateThemeParam(['layout', 'containerWidth'], e.target.value)}
              placeholder="1200px"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Khoảng cách section</label>
            <Input
              value={themeParams.layout?.sectionSpacing || '80px'}
              onChange={(e) => updateThemeParam(['layout', 'sectionSpacing'], e.target.value)}
              placeholder="80px"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Khoảng cách tổng thể</label>
            <select
              value={themeParams.layout?.spacing || 'comfortable'}
              onChange={(e) => updateThemeParam(['layout', 'spacing'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="minimal">Minimal</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bo góc</label>
            <select
              value={themeParams.layout?.borderRadius || '8px'}
              onChange={(e) => updateThemeParam(['layout', 'borderRadius'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">None</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Button Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Cài đặt Button</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Kiểu button</label>
            <select
              value={themeParams.components?.button?.style || 'solid'}
              onChange={(e) => updateThemeParam(['components', 'button', 'style'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="solid">Solid</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
              <option value="gradient">Gradient</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Kích thước button</label>
            <select
              value={themeParams.components?.button?.size || 'medium'}
              onChange={(e) => updateThemeParam(['components', 'button', 'size'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="buttonRounded"
              checked={themeParams.components?.button?.rounded || false}
              onChange={(e) => updateThemeParam(['components', 'button', 'rounded'], e.target.checked.toString())}
              className="rounded border-gray-300"
            />
            <label htmlFor="buttonRounded" className="text-sm font-medium">
              Button bo tròn
            </label>
          </div>
        </div>
      </Card>

      {/* Card Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Cài đặt Card</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Đổ bóng card</label>
            <select
              value={themeParams.components?.card?.shadow || 'medium'}
              onChange={(e) => updateThemeParam(['components', 'card', 'shadow'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">None</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="cardBorder"
              checked={themeParams.components?.card?.border || false}
              onChange={(e) => updateThemeParam(['components', 'card', 'border'], e.target.checked.toString())}
              className="rounded border-gray-300"
            />
            <label htmlFor="cardBorder" className="text-sm font-medium">
              Hiển thị viền card
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Padding card</label>
            <select
              value={themeParams.components?.card?.padding || 'medium'}
              onChange={(e) => updateThemeParam(['components', 'card', 'padding'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Form Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Cài đặt Form</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Kiểu form</label>
            <select
              value={themeParams.components?.form?.style || 'default'}
              onChange={(e) => updateThemeParam(['components', 'form', 'style'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Default</option>
              <option value="minimal">Minimal</option>
              <option value="bordered">Bordered</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Validation</label>
            <select
              value={themeParams.components?.form?.validation || 'inline'}
              onChange={(e) => updateThemeParam(['components', 'form', 'validation'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="inline">Inline</option>
              <option value="tooltip">Tooltip</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Navigation Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Cài đặt Navigation</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Kiểu navigation</label>
            <select
              value={themeParams.components?.navigation?.style || 'horizontal'}
              onChange={(e) => updateThemeParam(['components', 'navigation', 'style'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="dropdown">Dropdown</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="navSticky"
              checked={themeParams.components?.navigation?.sticky || false}
              onChange={(e) => updateThemeParam(['components', 'navigation', 'sticky'], e.target.checked.toString())}
              className="rounded border-gray-300"
            />
            <label htmlFor="navSticky" className="text-sm font-medium">
              Navigation sticky
            </label>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default LayoutTab
