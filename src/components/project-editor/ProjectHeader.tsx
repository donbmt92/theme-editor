import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Download, Eye, Wand2, Undo, Redo } from 'lucide-react'
import { ThemeParams } from '@/types'

interface ProjectHeaderProps {
  projectName: string
  themeName: string
  isPreviewMode: boolean
  isSaving: boolean
  canUndo: boolean
  canRedo: boolean
  onBack: () => void
  onTogglePreview: () => void
  onSave: () => void
  onShowAI: () => void
  onShowDeploy: () => void
  onUndo: () => void
  onRedo: () => void
  themeParams: ThemeParams
}

const ProjectHeader = ({
  projectName,
  themeName,
  isPreviewMode,
  isSaving,
  canUndo,
  canRedo,
  onBack,
  onTogglePreview,
  onSave, 
  onShowAI,
  onShowDeploy,
  onUndo,
  onRedo,
  themeParams
}: ProjectHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
          >
            <ArrowLeft size={16} className="mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-xl font-bold">{projectName}</h1>
            <p className="text-sm text-gray-600">Dựa trên theme: {themeName}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Undo/Redo */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              title="Hoàn tác (Ctrl+Z)"
            >
              <Undo size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              title="Làm lại (Ctrl+Y)"
            >
              <Redo size={16} />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onShowAI}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
          >
            <Wand2 size={16} className="mr-2" />
            AI Tạo Nội Dung
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePreview}
          >
            <Eye size={16} className="mr-2" />
            {isPreviewMode ? 'Chỉnh sửa' : 'Xem trước'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            title="Lưu project (Ctrl+S)"
          >
            <Save size={16} className="mr-2" />
            {isSaving ? 'Đang lưu...' : 'Lưu'}
          </Button>
          <Button
            size="sm"
            onClick={onShowDeploy}
            style={{ backgroundColor: themeParams?.colors?.primary || '#8B4513' }}
          >
            <Download size={16} className="mr-2" />
            Xuất file
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProjectHeader
