'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Clock, CheckCircle, XCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface PaymentStatus {
  id: string
  status: 'PENDING' | 'PAID' | 'FAILED'
  amount: number
  currency: string
  bankTxnId: string
  createdAt: string
  paidAt?: string
}

export default function PaymentPendingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const paymentId = searchParams.get('paymentId')
  const [payment, setPayment] = useState<PaymentStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (paymentId) {
      checkPaymentStatus()
      // Poll for payment status every 5 seconds
      const interval = setInterval(checkPaymentStatus, 5000)
      return () => clearInterval(interval)
    }
  }, [paymentId])

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`)
      const data = await response.json()
      
      if (data.success) {
        setPayment(data.payment)
        
        // Redirect based on status
        if (data.payment.status === 'PAID') {
          router.push('/payment/success')
        } else if (data.payment.status === 'FAILED') {
          router.push('/payment/failed')
        }
      } else {
        setError(data.error || 'Không thể tải thông tin thanh toán')
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
      setError('Có lỗi xảy ra khi kiểm tra trạng thái thanh toán')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Đang kiểm tra thanh toán...</h1>
          <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button onClick={checkPaymentStatus} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Thử lại
            </Button>
            <Link href="/payment">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại thanh toán
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy thanh toán</h1>
          <p className="text-gray-600 mb-6">Thanh toán không tồn tại hoặc đã bị xóa</p>
          <Link href="/payment">
            <Button className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại thanh toán
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <div className="relative">
            <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
            <div className="absolute -top-2 -right-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Đang chờ thanh toán</h1>
          <p className="text-gray-600">
            Chúng tôi đang chờ xác nhận từ ngân hàng. Quá trình này có thể mất vài phút.
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">Chi tiết thanh toán</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã giao dịch:</span>
              <span className="font-mono text-gray-900">{payment.bankTxnId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Số tiền:</span>
              <span className="font-semibold text-gray-900">{formatPrice(payment.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian tạo:</span>
              <span className="text-gray-900">{formatDate(payment.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-blue-600 font-medium">Đang xử lý</span>
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Hướng dẫn</h3>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• Kiểm tra email xác nhận từ ngân hàng</li>
            <li>• Hoàn tất thanh toán trong ứng dụng ngân hàng</li>
            <li>• Trang này sẽ tự động cập nhật khi có kết quả</li>
            <li>• Bạn có thể đóng tab này và quay lại sau</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={checkPaymentStatus} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Kiểm tra lại
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Về Dashboard
            </Button>
          </Link>
        </div>

        {/* Auto-refresh notice */}
        <p className="text-xs text-gray-500 mt-4">
          Trang sẽ tự động cập nhật mỗi 5 giây
        </p>
      </Card>
    </div>
  )
} 