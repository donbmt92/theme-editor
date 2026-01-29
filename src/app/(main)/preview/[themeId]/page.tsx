/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import VietnamCoffeeTheme from '@/components/themes/VietnamCoffeeTheme'
import { ThemeParams } from '@/types'

export default function ThemePreviewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const themeId = params.themeId as string
  const projectId = searchParams.get('projectId')
  const [theme, setTheme] = useState<ThemeParams | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (projectId) {
      fetchProject()
    } else {
      fetchTheme()
    }
  }, [themeId, projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/preview/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.project) {
          // Use latest version or default params
          const latestVersion = data.project.versions[0]
          let params: ThemeParams
          
          if (latestVersion && latestVersion.snapshot) {
            params = latestVersion.snapshot as ThemeParams
          } else if (data.project.theme.defaultParams) {
            try {
              const parsedParams = typeof data.project.theme.defaultParams === 'string' 
                ? JSON.parse(data.project.theme.defaultParams) 
                : data.project.theme.defaultParams
              params = parsedParams
            } catch {
              setError('Dữ liệu theme không hợp lệ')
              return
            }
          } else {
            setError('Không tìm thấy dữ liệu theme')
            return
          }
          
          // Merge projectLanguage into themeParams
          const themeWithLanguage = {
            ...params,
            projectLanguage: data.project.language || 'vietnamese'
          }
          
          setTheme(themeWithLanguage)
        } else {
          setError('Không tìm thấy project')
        }
      } else {
        setError('Không tìm thấy project')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      setError('Có lỗi xảy ra khi tải project')
    } finally {
      setLoading(false)
    }
  }

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
    <div className="min-h-screen bg-gray-100">
      <div className="h-full overflow-auto">
        {/* Force desktop breakpoint for preview */}
        <div className="min-w-[768px]">
          <VietnamCoffeeTheme theme={theme} />
        </div>
      </div>
    </div>
  )
} 