/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  placeholder?: string
  className?: string
  accept?: string
}

const ImageUpload = ({ 
  value, 
  onChange, 
  placeholder = "Upload image or enter URL", 
  className = "",
  accept = "image/*"
}: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    try {
      // For now, we'll use a mock upload - in real app, upload to cloud storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onChange(result)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Upload failed:', error)
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleUrlSubmit = (url: string) => {
    if (url.trim()) {
      onChange(url.trim())
      setShowUrlInput(false)
    }
  }

  const removeImage = () => {
    onChange('')
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Current Image Preview */}
      {value && (
        <div className="relative group">
          <Image
            src={value}
            alt="Preview"
            width={400}
            height={128}
            className="w-full h-32 object-cover rounded-lg border border-gray-200"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!value && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Kéo thả ảnh vào đây hoặc
          </p>
          <div className="flex space-x-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Đang upload...' : 'Chọn file'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUrlInput(!showUrlInput)}
            >
              Nhập URL
            </Button>
          </div>
        </div>
      )}

      {/* URL Input */}
      {showUrlInput && (
        <div className="flex space-x-2">
          <Input
            placeholder="Nhập URL ảnh..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleUrlSubmit(e.currentTarget.value)
              }
            }}
          />
          <Button
            size="sm"
            onClick={() => {
              const input = document.querySelector('input[placeholder="Nhập URL ảnh..."]') as HTMLInputElement
              if (input) handleUrlSubmit(input.value)
            }}
          >
            OK
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUrlInput(false)}
          >
            Hủy
          </Button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
        }}
        className="hidden"
      />
    </div>
  )
}

export default ImageUpload 