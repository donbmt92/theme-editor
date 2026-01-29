'use client'

import { CheckCircle, ArrowLeft, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã nâng cấp lên gói Pro. Tài khoản của bạn đã được kích hoạt với tất cả tính năng cao cấp.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">Tính năng mới được mở khóa:</h3>
          <ul className="text-sm text-green-700 space-y-1 text-left">
            <li>• Tạo không giới hạn projects</li>
            <li>• Tất cả themes premium</li>
            <li>• Export ZIP + Git repository</li>
            <li>• Hỗ trợ ưu tiên</li>
            <li>• Custom domain</li>
            <li>• Analytics dashboard</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link href="/dashboard">
            <Button className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Đi đến Dashboard
            </Button>
          </Link>
          <Link href="/templates">
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Xem Templates
            </Button>
          </Link>
          <Button variant="outline" className="w-full">
            <Share2 className="w-4 h-4 mr-2" />
            Chia sẻ với bạn bè
          </Button>
        </div>
      </Card>
    </div>
  )
} 