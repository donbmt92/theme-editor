import VietnamCoffeeTheme from '@/components/themes/VietnamCoffeeTheme'
import { ThemeParams } from '@/types'

interface PreviewPanelProps {
  themeParams: ThemeParams
  projectLanguage?: string
}

const PreviewPanel = ({ themeParams, projectLanguage }: PreviewPanelProps) => {
  // Merge projectLanguage into themeParams
  const themeWithLanguage = {
    ...themeParams,
    projectLanguage: projectLanguage || 'vietnamese'
  }

  return (
    <div className="flex-1 bg-gray-100">
      <div className="h-full overflow-auto">
        {/* Force desktop breakpoint for preview */}
        <div className="min-w-[768px]">
          <VietnamCoffeeTheme theme={themeWithLanguage} />
        </div>
      </div>
    </div>
  )
}

export default PreviewPanel
