import TabSelector, { TabType } from './TabSelector'
import TabContent from './TabContent'
import { ThemeParams } from '@/types'

interface EditorPanelProps {
  activeTab: TabType
  themeParams: ThemeParams
  onTabChange: (tab: TabType) => void
  updateThemeParam: (path: string[], value: string | number | unknown) => void
  userTier?: "FREE" | "STANDARD" | "PRO"
}

const EditorPanel = ({
  activeTab,
  themeParams,
  onTabChange,
  updateThemeParam,
  userTier
}: EditorPanelProps) => {
  return (
    <div className="w-1/3 bg-white border-r border-gray-200 overflow-auto">
      <div className="p-6">
        <TabSelector activeTab={activeTab} onTabChange={onTabChange} userTier={userTier} />
        <TabContent
          activeTab={activeTab}
          themeParams={themeParams}
          updateThemeParam={updateThemeParam}
          userTier={userTier}
        />
      </div>
    </div>
  )
}

export default EditorPanel
