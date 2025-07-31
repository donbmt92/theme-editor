/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useRef } from 'react'
import { Button } from './button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  placeholder?: string
  recommendedSize?: string
  aspectRatio?: string
}

const ImageUpload = ({ 
  value, 
  onChange, 
  placeholder = "Upload image",
  recommendedSize,
  aspectRatio 
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file)
      onChange(previewUrl)

      // Here you would typically upload to your server
      // For now, we'll just use the preview URL
      // In a real app, you'd upload to your server and get back a URL
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, keep the preview URL
      // In production, replace with actual uploaded URL
      onChange(previewUrl)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      {/* Image Size Recommendations */}
      {recommendedSize && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-md">
          <strong>Kích thước khuyến nghị:</strong> {recommendedSize}
          {aspectRatio && <span className="ml-2">• Tỷ lệ: {aspectRatio}</span>}
        </div>
      )}

      {/* Upload Area */}
      <div className="space-y-2">
        {value ? (
          <div className="relative group">
            <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={value}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-gray-900 hover:bg-gray-100"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors duration-200"
          >
            <div className="flex flex-col items-center space-y-2">
              <ImageIcon size={24} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{placeholder}</p>
                <p className="text-xs text-gray-500">
                  Click to upload • PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Upload size={16} />
                <span>Choose Image</span>
              </div>
            )}
          </Button>
        )}
      </div>

      {/* URL Input for external images */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Hoặc nhập URL hình ảnh:</label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}

export default ImageUpload 