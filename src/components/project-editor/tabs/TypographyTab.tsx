import { Card } from '@/components/ui/card'
import { ThemeParams } from '@/types'

interface TypographyTabProps {
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number) => void
}

const TypographyTab = ({ themeParams, updateThemeParam }: TypographyTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Typography</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Font Family</label>
            <select
              value={themeParams.typography?.fontFamily || 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'}
              onChange={(e) => updateThemeParam(['typography', 'fontFamily'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value='ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'>System Default</option>
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Heading Size</label>
            <select
              value={themeParams.typography?.headingSize || '2xl'}
              onChange={(e) => updateThemeParam(['typography', 'headingSize'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sm">Small</option>
              <option value="base">Base</option>
              <option value="lg">Large</option>
              <option value="xl">XL</option>
              <option value="2xl">2XL</option>
              <option value="3xl">3XL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Font Size</label>
            <select
              value={themeParams.typography?.fontSize || '16px'}
              onChange={(e) => updateThemeParam(['typography', 'fontSize'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="22px">22px</option>
              <option value="24px">24px</option>
              <option value="26px">26px</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Body Size</label>
            <select
              value={themeParams.typography?.bodySize || 'base'}
              onChange={(e) => updateThemeParam(['typography', 'bodySize'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="xs">Extra Small</option>
              <option value="sm">Small</option>
              <option value="base">Base</option>
              <option value="lg">Large</option>
              <option value="xl">XL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Line Height</label>
            <select
              value={themeParams.typography?.lineHeight || '1.6'}
              onChange={(e) => updateThemeParam(['typography', 'lineHeight'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1.2">1.2 (Tight)</option>
              <option value="1.4">1.4 (Normal)</option>
              <option value="1.6">1.6 (Comfortable)</option>
              <option value="1.8">1.8 (Loose)</option>
              <option value="2.0">2.0 (Very Loose)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Font Weight</label>
            <select
              value={themeParams.typography?.fontWeight || '400'}
              onChange={(e) => updateThemeParam(['typography', 'fontWeight'], e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="300">Light (300)</option>
              <option value="400">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TypographyTab
