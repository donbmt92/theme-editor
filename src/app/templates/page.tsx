'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Palette, Search, Filter, ArrowRight, Star, Coffee, Building, Minimize, Eye } from 'lucide-react'

interface Theme {
  id: string
  name: string
  description: string
  previewUrl: string
  defaultParams: string
  createdAt: string
}

export default function TemplatesPage() {
  const { data: session, status } = useSession()
  // Removed unused router variable
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchThemes()
  }, [])

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/themes')
      if (response.ok) {
        const data = await response.json()
        setThemes(data.themes)
      }
    } catch (error) {
      console.error('Error fetching themes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Removed unused function - functionality moved to user templates page

  const getThemeIcon = (themeName: string) => {
    if (themeName.toLowerCase().includes('coffee')) return Coffee
    if (themeName.toLowerCase().includes('corporate')) return Building
    if (themeName.toLowerCase().includes('minimalist')) return Minimize
    return Palette
  }
  
  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedCategory === 'all') return matchesSearch
    
    const category = selectedCategory.toLowerCase()
    return matchesSearch && theme.name.toLowerCase().includes(category)
  }).slice(0, 1) // Chỉ lấy theme đầu tiên

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Theme Editor</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/signin"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
       

        {/* Project Creation Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tạo Website 
              </h2>
              <p className="text-gray-600">
                Điền thông tin cơ bản để tạo website chuyên nghiệp cho doanh nghiệp của bạn
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              if (filteredThemes[0]) {
                window.location.href = `/templates/user?themeId=${filteredThemes[0].id}`
              }
            }} className="space-y-6">
              <div>
              
              
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả ngắn
                </label>
                <textarea
                  placeholder="VD: Chuyên xuất khẩu cà phê chất lượng cao từ Việt Nam ra thị trường quốc tế"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

             

             

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
                >
                  🚀 Tạo Website Ngay
                </button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>Bằng cách nhấn nút trên, bạn đồng ý với <a href="#" className="text-blue-600 hover:underline">Điều khoản sử dụng</a></p>
              </div>
            </form>
          </div>
        </div>

        {/* Empty State */}
      

        {/* Workflow Info */}
       

        {/* Access Notice */}
        {status === 'unauthenticated' && (
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Đăng nhập để sử dụng template
            </h3>
            <p className="text-blue-700 mb-4">
              Tạo tài khoản miễn phí để truy cập và tùy chỉnh template
            </p>
            <Link
              href="/auth/signup"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Đăng ký ngay
            </Link>
          </div>
        )}

        {session && !session.user?.hasPaidAccess && (
          <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">
              Nâng cấp để sử dụng template
            </h3>
            <p className="text-amber-700 mb-4">
              Thanh toán một lần để truy cập toàn bộ template và tính năng
            </p>
            <Link
              href="/payment"
              className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Nâng cấp ngay - 299.000 VNĐ
            </Link>
          </div>
        )}
      </main>
    </div>
  )
} 