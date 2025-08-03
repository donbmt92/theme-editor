
import Link from 'next/link'
// import Image from 'next/image'
import { ArrowRight, Palette, Download, Zap, Shield, Users, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Theme Editor</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Tính năng
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Giá cả
            </Link>
            <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 transition-colors">
              Đăng nhập
            </Link>
            <Link 
              href="/auth/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đăng ký
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Tùy chỉnh & Xuất
            <br />
            <span className="text-blue-600">Theme React</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Một nền tảng SaaS cho phép bạn tùy chỉnh theme với giao diện trực quan, 
            lưu trữ các phiên làm việc và xuất file React hoàn chỉnh.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Bắt đầu miễn phí
              <ArrowRight className="h-5 w-5" />
            </Link>
            
            <Link
              href="#demo"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Xem demo
            </Link>
          </div>
          
          {/* <div className="mt-12">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/placeholder-hero.png"
                alt="Theme Editor Interface"
                width={1200}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tất cả các công cụ bạn cần để tạo ra theme React chuyên nghiệp
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Chỉnh sửa trực quan
              </h3>
              <p className="text-gray-600">
                Giao diện drag-and-drop trực quan, thay đổi màu sắc, font chữ, layout real-time
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Xuất file React
              </h3>
              <p className="text-gray-600">
                Tạo và tải xuống file React hoàn chỉnh, hỗ trợ TypeScript và CSS frameworks
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Lưu phiên làm việc
              </h3>
              <p className="text-gray-600">
                Version control cho mỗi project, khôi phục và tiếp tục chỉnh sửa bất cứ lúc nào
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Thanh toán bảo mật
              </h3>
              <p className="text-gray-600">
                Tích hợp với các ngân hàng Việt Nam, thanh toán an toàn và nhanh chóng
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Template marketplace
              </h3>
              <p className="text-gray-600">
                Thư viện template phong phú: Corporate, Creative, Minimalist và nhiều hơn nữa
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Preview real-time
              </h3>
              <p className="text-gray-600">
                Xem trước thay đổi ngay lập tức, test responsive trên mọi thiết bị
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Bảng giá đơn giản
            </h2>
            <p className="text-xl text-gray-600">
              Chỉ trả một lần, sử dụng vĩnh viễn
            </p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-500">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Pro Access
                </h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-blue-600">299.000</span>
                  <span className="text-gray-500 ml-1">VNĐ</span>
                </div>
                <p className="text-gray-600 mb-8">
                  Trả một lần, sử dụng mọi tính năng vĩnh viễn
                </p>
                
                <ul className="text-left space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Chỉnh sửa không giới hạn theme</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Xuất file React & TypeScript</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Lưu trữ project không giới hạn</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Tất cả template premium</span>
          </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Hỗ trợ kỹ thuật 24/7</span>
          </li>
                </ul>

                <div className="flex space-x-4">
                  <Link
                    href="/auth/signup"
                    className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block text-center"
                  >
                    Đăng ký miễn phí
                  </Link>
                  <Link
                    href="/payment"
                    className="flex-1 bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block text-center"
                  >
                    Nâng cấp Pro
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">Theme Editor</span>
              </div>
              <p className="text-gray-400 mb-4">
                Nền tảng tùy chỉnh theme React hàng đầu Việt Nam
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Tính năng</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Giá cả</Link></li>
                <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs" className="hover:text-white transition-colors">Tài liệu</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Liên hệ</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Trợ giúp</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Công ty</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Chính sách</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Điều khoản</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Theme Editor. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
