/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useRef } from 'react'
import { Button } from './button'
import { Upload, X, FileText, Download, ExternalLink } from 'lucide-react'
import { useFileUpload } from '@/hooks/use-file-upload'

interface FileUploadProps {
  value: string
  onChange: (url: string) => void
  placeholder?: string
  allowedHint?: string
}

const FileUpload = ({ value, onChange, placeholder = 'Upload file (PDF)', allowedHint = 'PDF, up to 20MB' }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isUploading, error, upload } = useFileUpload({
    onSuccess: (url) => onChange(url),
    onError: (msg) => alert(`Upload failed: ${msg}`),
  })

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    await upload(file)
  }

  const handleRemove = () => {
    onChange('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      {error && <div className="text-xs text-red-500 bg-red-50 p-2 rounded-md">{error}</div>}

      <div className="space-y-2">
        {value ? (
          <div className="border rounded-md p-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-gray-600" />
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  {value.split('/').pop()}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <a href={value} download className="inline-flex items-center px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50">
                  <Download size={14} className="mr-1" /> Tải xuống
                </a>
                <a href={value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50">
                  <ExternalLink size={14} className="mr-1" /> Mở
                </a>
                <Button type="button" variant="ghost" size="sm" onClick={handleRemove} className="h-7 px-2">
                  <X size={14} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400"
          >
            <div className="flex flex-col items-center gap-1">
              <FileText size={22} className="text-gray-400" />
              <div className="text-sm font-medium text-gray-900">{placeholder}</div>
              <div className="text-xs text-gray-500">{allowedHint}</div>
            </div>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileSelect} className="hidden" />

        {!value && (
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full">
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload size={16} />
                <span>Choose File</span>
              </div>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export default FileUpload