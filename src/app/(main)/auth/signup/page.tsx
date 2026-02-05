/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Globe } from 'lucide-react'
import Image from 'next/image'

// Sample gallery images - using picsum.photos for reliability
const galleryImages = [
  'https://picsum.photos/seed/s1/300/400',
  'https://picsum.photos/seed/s2/300/400',
  'https://picsum.photos/seed/s3/300/400',
  'https://picsum.photos/seed/s4/300/400',
  'https://picsum.photos/seed/s5/300/400',
  'https://picsum.photos/seed/s6/300/400',
  'https://picsum.photos/seed/s7/300/400',
  'https://picsum.photos/seed/s8/300/400',
  'https://picsum.photos/seed/s9/300/400',
  'https://picsum.photos/seed/s10/300/400',
  'https://picsum.photos/seed/s11/300/400',
  'https://picsum.photos/seed/s12/300/400',
]

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Vui lòng nhập họ tên')
      return false
    }
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email không hợp lệ')
      return false
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return false
    }
    if (!acceptTerms) {
      setError('Vui lòng đồng ý với điều khoản sử dụng')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Có lỗi xảy ra khi đăng ký')
      } else {
        router.push('/auth/signin?message=Đăng ký thành công! Vui lòng đăng nhập.')
      }
    } catch (error) {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Left Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen">
        {/* Language Selector */}
        <div className="p-6">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
            <Globe className="w-4 h-4" />
            Tiếng Việt
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            {/* Title */}
            <h1 className="text-4xl font-bold text-[#1e3a5f] mb-8">Đăng ký</h1>

            {/* Google Sign Up Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white py-3 px-6 rounded-full font-medium transition-colors mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Tiếp tục với Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm">hoặc</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Họ tên
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nhập họ tên của bạn"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="your-email@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Tối thiểu 6 ký tự"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                  Tôi đồng ý với{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                    Điều khoản sử dụng
                  </Link>{' '}
                  và{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                    Chính sách bảo mật
                  </Link>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-full font-medium hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-gray-600 mt-6">
              Đã có tài khoản?{' '}
              <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                Đăng nhập
              </Link>
            </p>

            {/* Footer */}
            <div className="mt-12 text-center">
              <Link href="/" className="inline-block mb-2">
                <span className="text-2xl font-bold tracking-wide text-[#1e3a5f]">THEME EDITOR</span>
              </Link>
              <p className="text-gray-500 text-sm">© 2026 Theme Editor, Inc.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image Gallery */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 flex gap-4 p-8"
          style={{
            transform: 'rotate(-12deg) translateX(10%) translateY(-5%)',
          }}
        >
          {/* Column 1 */}
          <div className="flex flex-col gap-4 animate-scroll-up">
            {galleryImages.slice(0, 4).map((src, i) => (
              <div key={i} className="relative w-48 h-64 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src={src}
                  alt={`Gallery ${i}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
            {galleryImages.slice(0, 4).map((src, i) => (
              <div key={`dup-${i}`} className="relative w-48 h-64 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src={src}
                  alt={`Gallery ${i}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4 animate-scroll-down" style={{ marginTop: '-100px' }}>
            {galleryImages.slice(4, 8).map((src, i) => (
              <div key={i} className="relative w-48 h-64 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src={src}
                  alt={`Gallery ${i + 4}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
            {galleryImages.slice(4, 8).map((src, i) => (
              <div key={`dup-${i}`} className="relative w-48 h-64 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src={src}
                  alt={`Gallery ${i + 4}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4 animate-scroll-up" style={{ marginTop: '-50px' }}>
            {galleryImages.slice(8, 12).map((src, i) => (
              <div key={i} className="relative w-48 h-64 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src={src}
                  alt={`Gallery ${i + 8}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
            {galleryImages.slice(8, 12).map((src, i) => (
              <div key={`dup-${i}`} className="relative w-48 h-64 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src={src}
                  alt={`Gallery ${i + 8}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-4 animate-scroll-down" style={{ marginTop: '-150px' }}>
            {galleryImages.slice(0, 4).map((src, i) => (
              <div key={i} className="relative w-48 h-64 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src={src}
                  alt={`Gallery ${i}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
            {galleryImages.slice(0, 4).map((src, i) => (
              <div key={`dup-${i}`} className="relative w-48 h-64 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src={src}
                  alt={`Gallery ${i}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>

          {/* Column 5 */}
          <div className="flex flex-col gap-4 animate-scroll-up" style={{ marginTop: '-80px' }}>
            {galleryImages.slice(4, 8).map((src, i) => (
              <div key={i} className="relative w-48 h-64 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src={src}
                  alt={`Gallery ${i + 4}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
            {galleryImages.slice(4, 8).map((src, i) => (
              <div key={`dup-${i}`} className="relative w-48 h-64 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src={src}
                  alt={`Gallery ${i + 4}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        
        @keyframes scroll-down {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }
        
        .animate-scroll-up {
          animation: scroll-up 30s linear infinite;
        }
        
        .animate-scroll-down {
          animation: scroll-down 30s linear infinite;
        }
      `}</style>
    </div>
  )
}