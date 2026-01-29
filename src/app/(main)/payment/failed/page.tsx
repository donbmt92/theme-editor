'use client'

import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h1>
        <p className="text-gray-600 mb-6">
          Rất tiếc, thanh toán của bạn không thể hoàn tất. Vui lòng thử lại hoặc liên hệ hỗ trợ.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">Có thể do:</h3>
          <ul className="text-sm text-red-700 space-y-1 text-left">
            <li>• Số dư tài khoản không đủ</li>
            <li>• Thông tin thẻ không chính xác</li>
            <li>• Giao dịch bị từ chối bởi ngân hàng</li>
            <li>• Lỗi kết nối mạng</li>
            <li>• Hết thời gian xử lý giao dịch</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link href="/payment">
            <Button className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Thử lại thanh toán
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Về Dashboard
            </Button>
          </Link>
          <Button variant="outline" className="w-full">
            <HelpCircle className="w-4 h-4 mr-2" />
            Liên hệ hỗ trợ
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Nếu bạn đã bị trừ tiền nhưng giao dịch thất bại, vui lòng liên hệ hỗ trợ để được hoàn tiền.
          </p>
        </div>
      </Card>
    </div>
  )
} 