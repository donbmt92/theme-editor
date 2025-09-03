import VietnamCoffeeTheme from '@/components/themes/VietnamCoffeeTheme'
import { ThemeParams } from '@/types'

interface PreviewPanelProps {
  themeParams: ThemeParams
}

const PreviewPanel = ({ themeParams }: PreviewPanelProps) => {
  return (
    <div className="flex-1 bg-gray-100">
      <div className="h-full overflow-auto">
        {/* Force desktop breakpoint for preview */}
        <div className="min-w-[768px]">
          <VietnamCoffeeTheme theme={themeParams} />
        </div>
      </div>
    </div>
  )
}

export default PreviewPanel
