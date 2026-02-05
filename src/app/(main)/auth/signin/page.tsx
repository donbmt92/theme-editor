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
  'https://picsum.photos/seed/a1/300/400',
  'https://picsum.photos/seed/b2/300/400',
  'https://picsum.photos/seed/c3/300/400',
  'https://picsum.photos/seed/d4/300/400',
  'https://picsum.photos/seed/e5/300/400',
  'https://picsum.photos/seed/f6/300/400',
  'https://picsum.photos/seed/g7/300/400',
  'https://picsum.photos/seed/h8/300/400',
  'https://picsum.photos/seed/i9/300/400',
  'https://picsum.photos/seed/j10/300/400',
  'https://picsum.photos/seed/k11/300/400',
  'https://picsum.photos/seed/l12/300/400',
]

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email hoặc mật khẩu không đúng')
      } else {
        router.push('/dashboard')
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
      {/* Left Side - Login Form */}
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
            <h1 className="text-4xl font-bold text-[#1e3a5f] mb-8">Đăng nhập</h1>

            {/* Google Sign In Button */}
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
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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

              {/* Forgot Password */}
              <div>
                <Link href="/auth/forgot" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Bạn quên mật khẩu?
                </Link>
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
                disabled={isLoading || !email || !password}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-full font-medium hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 mt-6">
              Bạn chưa có tài khoản?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Đăng ký
              </Link>
            </p>

            {/* SSO Link */}
            <p className="text-center mt-3">
              <Link href="/auth/sso" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Tiếp tục với Đăng nhập một lần (SSO)
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
            {/* Duplicate for seamless loop */}
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