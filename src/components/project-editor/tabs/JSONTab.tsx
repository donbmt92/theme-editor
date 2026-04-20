import { ThemeParams } from '@/types'
import { useState } from 'react'

interface JSONTabProps {
    themeParams: ThemeParams
    updateThemeParam: (path: string[], value: string | number | unknown) => void
}

const JSONTab = ({ themeParams }: JSONTabProps) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(themeParams, null, 2))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">JSON Preview</h3>
                <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    {copied ? '✓ Đã copy!' : 'Copy JSON'}
                </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[calc(100vh-250px)]">
                <pre className="text-sm text-gray-100 font-mono">
                    <code>{JSON.stringify(themeParams, null, 2)}</code>
                </pre>
            </div>

            <div className="text-xs text-gray-500 italic">
                💡 Tab này chỉ hiển thị trong môi trường development để debug theme params
            </div>
        </div>
    )
}

export default JSONTab
