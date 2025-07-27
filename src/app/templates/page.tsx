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
  })

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thư viện Template
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá bộ sưu tập template được thiết kế chuyên nghiệp. 
            Chọn template phù hợp và bắt đầu tùy chỉnh ngay hôm nay.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="corporate">Corporate</option>
              <option value="creative">Creative</option>
              <option value="minimalist">Minimalist</option>
              <option value="coffee">Coffee & Food</option>
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredThemes.map((theme) => {
            const ThemeIcon = getThemeIcon(theme.name)
            const isVietnamCoffee = theme.id === 'vietnam-coffee-theme'
            
            return (
              <div
                key={theme.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Preview Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {isVietnamCoffee ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20"></div>
                      <div className="absolute top-4 left-4">
                        <Coffee className="h-8 w-8 text-amber-700" />
                      </div>
                      <div className="absolute bottom-4 right-4 text-amber-700 font-semibold">
                        Coffee Export
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ThemeIcon className="h-16 w-16 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  )}
                  
                  {/* Popular Badge */}
                  {isVietnamCoffee && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>Mới</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {theme.name}
                    </h3>
                    <ThemeIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {theme.description}
                  </p>

                  {/* Theme Colors Preview */}
                  {theme.defaultParams && (
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-gray-500">Màu sắc:</span>
                      <div className="flex space-x-1">
                        {(() => {
                          try {
                            const params = typeof theme.defaultParams === 'string' 
          ? JSON.parse(theme.defaultParams) 
          : theme.defaultParams
                            const colors = params.colors || {}
                            return Object.values(colors).slice(0, 4).map((color: unknown, index) => (
                                                              <div
                                  key={index}
                                  className="w-4 h-4 rounded-full border border-gray-200"
                                  style={{ backgroundColor: color as string }}
                                />
                            ))
                          } catch {
                            return null
                          }
                        })()}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/preview/${theme.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center text-sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Xem trước
                    </Link>
                    
                    {/* Admin can edit themes, Users can create projects */}
                    {session?.user?.role === 'ADMIN' ? (
                      <Link
                        href={`/editor/${theme.id}`}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center text-sm group"
                      >
                        <span>Chỉnh sửa</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <Link
                        href={`/templates/user?themeId=${theme.id}`}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center text-sm group"
                      >
                        <span>Tạo Project</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredThemes.length === 0 && (
          <div className="text-center py-12">
            <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy template
            </h3>
            <p className="text-gray-600">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}

        {/* Workflow Info */}
        {session && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {session.user?.role === 'ADMIN' ? '🔧 Admin Panel' : '🚀 Cách sử dụng'}
            </h3>
            {session.user?.role === 'ADMIN' ? (
              <div className="text-gray-700">
                <p className="mb-2">• <strong>Chỉnh sửa Theme:</strong> Click &quot;Chỉnh sửa&quot; để mở Theme Editor</p>
                <p className="mb-2">• <strong>Tạo Theme mới:</strong> Tạo template cho users sử dụng</p>
                <p>• <strong>Quản lý:</strong> Kiểm soát tất cả themes trong hệ thống</p>
              </div>
            ) : (
              <div className="text-gray-700">
                <p className="mb-2">• <strong>Xem Template:</strong> Click &quot;Xem trước&quot; để xem demo</p>
                <p className="mb-2">• <strong>Tạo Project:</strong> Click &quot;Tạo Project&quot; để bắt đầu tùy chỉnh</p>
                <p>• <strong>Chỉnh sửa:</strong> Sau khi tạo project, bạn có thể tùy chỉnh theo ý muốn</p>
              </div>
            )}
          </div>
        )}

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