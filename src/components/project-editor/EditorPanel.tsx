import TabSelector, { TabType } from './TabSelector'
import TabContent from './TabContent'
import { ThemeParams } from '@/types'

interface EditorPanelProps {
  activeTab: TabType
  themeParams: ThemeParams
  onTabChange: (tab: TabType) => void
  updateThemeParam: (path: string[], value: string | number) => void
}

const EditorPanel = ({ 
  activeTab, 
  themeParams, 
  onTabChange, 
  updateThemeParam 
}: EditorPanelProps) => {
  return (
    <div className="w-1/3 bg-white border-r border-gray-200 overflow-auto">
      <div className="p-6">
        <TabSelector activeTab={activeTab} onTabChange={onTabChange} />
        <TabContent 
          activeTab={activeTab} 
          themeParams={themeParams} 
          updateThemeParam={updateThemeParam} 
        />
      </div>
    </div>
  )
}

export default EditorPanel
