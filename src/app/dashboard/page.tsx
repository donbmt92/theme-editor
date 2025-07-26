/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Palette, User, LogOut, Settings, Plus, Edit, Eye, Calendar, CreditCard } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  status: string
  createdAt: string
  updatedAt: string
  theme: {
    id: string
    name: string
    description: string
  }
  versions: Array<{
    id: string
    versionNumber: number
  }>
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProjects()
    }
  }, [status])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      
      if (data.success) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Palette className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Theme Editor</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{session.user?.name || session.user?.email}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Chào mừng trở lại, {session.user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">
            Bắt đầu tạo và tùy chỉnh theme React của bạn.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/templates"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-500"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tạo Project mới</h3>
                <p className="text-sm text-gray-600">Bắt đầu với template mới</p>
              </div>
            </div>
          </Link>

          <Link
            href="/templates"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Palette className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Xem Templates</h3>
                <p className="text-sm text-gray-600">Khám phá thư viện template</p>
              </div>
            </div>
          </Link>

          <Link
            href="/payment"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Nâng cấp Pro</h3>
                <p className="text-sm text-gray-600">Mở khóa tất cả tính năng</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Projects gần đây</h2>
            <Link
              href="/templates"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Xem tất cả templates
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Chưa có project nào</p>
              <Link
                href="/templates"
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tạo project đầu tiên
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{project.theme.name}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(project.updatedAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.status === 'EDITING' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status === 'EDITING' ? 'Đang chỉnh sửa' : 'Đã lưu'}
                        </span>
                        {project.versions.length > 0 && (
                          <span className="text-gray-500">
                            Phiên bản {project.versions[0].versionNumber}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/project/${project.id}`}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/preview/${project.theme.id}`}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Xem trước"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 