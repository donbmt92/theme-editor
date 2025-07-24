'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import VietnamCoffeeTheme from '@/components/themes/VietnamCoffeeTheme'
import { ThemeParams } from '@/types'

export default function ThemePreviewPage() {
  const params = useParams()
  const themeId = params.themeId as string
  const [theme, setTheme] = useState<ThemeParams | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTheme()
  }, [themeId])

  const fetchTheme = async () => {
    try {
      const response = await fetch(`/api/themes/${themeId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.theme.defaultParams) {
          const themeParams = typeof data.theme.defaultParams === 'string' 
      ? JSON.parse(data.theme.defaultParams) 
      : data.theme.defaultParams
          setTheme(themeParams)
        }
      } else {
        setError('Không tìm thấy theme')
      }
    } catch (error) {
      console.error('Error fetching theme:', error)
      setError('Có lỗi xảy ra khi tải theme')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải theme...</p>
        </div>
      </div>
    )
  }

  if (error || !theme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy theme</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="theme-preview">
      <VietnamCoffeeTheme theme={theme} />
    </div>
  )
} 