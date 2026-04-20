/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  CreditCard, 
  CheckCircle, 
  ArrowLeft,
  Shield,
  Clock,
  Users,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface PaymentPlan {
  id: string
  name: string
  price: number
  currency: string
  features: string[]
  popular?: boolean
}

const paymentPlans: PaymentPlan[] = [
  {
    id: 'pro',
    name: 'Gói Chuyên Nghiệp',
    price: 5000,
    currency: 'VND',
    popular: true,
    features: [
      'Tạo không giới hạn projects',
      'Tất cả themes',
      'Export ZIP + Git repository',
      'Hỗ trợ ưu tiên',
      'Lưu trữ 1 năm',
      'Custom domain',
      'Analytics dashboard'
    ]
  },
  ]



function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan') || 'pro'
  
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>(
    paymentPlans.find(p => p.id === planId) || paymentPlans[1]
  )
  const [selectedBank, setSelectedBank] = useState('')
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'plan' | 'info' | 'payment'>('plan')

  const handlePlanSelect = (plan: PaymentPlan) => {
    setSelectedPlan(plan)
  }

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePayment = async () => {
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    setIsProcessing(true)
    
    try {
      // Create payment record
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPlan.price,
          currency: selectedPlan.currency,
          planId: selectedPlan.id,
          customerInfo,
          bankId: selectedBank || 'ACB',
          paymentMethod: selectedBank ? 'bank_transfer' : 'qr_code'
        })
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/payment/pending?paymentId=${data.payment.id}`)
      } else {
        throw new Error('Payment failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft size={20} className="text-gray-600" />
                <span className="text-gray-600">Quay lại</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Thanh toán an toàn</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chọn Gói Dịch Vụ</h1>
          <p className="text-gray-600">Lựa chọn gói phù hợp với nhu cầu của bạn</p>
        </div>

        {/* Payment Plans */}
        {paymentStep === 'plan' && (
          <div className="grid md:grid-cols-3 gap-6 mb-8 justify-items-center">
            {paymentPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`p-6 relative cursor-pointer transition-all hover:shadow-lg ${
                  selectedPlan.id === plan.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handlePlanSelect(plan)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Phổ biến
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{formatPrice(plan.price)}</span>
                    <span className="text-gray-600">/tháng</span>
                  </div>
                  
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Customer Information */}
        {paymentStep === 'info' && (
          <Card className="max-w-2xl mx-auto p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin khách hàng</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                <Input
                  value={customerInfo.fullName}
                  onChange={(e) => handleCustomerInfoChange('fullName', e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <Input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                <Input
                  value={customerInfo.phone}
                  onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                  placeholder="0123456789"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Công ty</label>
                <Input
                  value={customerInfo.company}
                  onChange={(e) => handleCustomerInfoChange('company', e.target.value)}
                  placeholder="Tên công ty (tùy chọn)"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Payment Method */}
        {paymentStep === 'payment' && (
          <Card className="max-w-2xl mx-auto p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thanh toán bằng QR Code</h3>
              <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="mb-4">
                  <img 
                    src={`https://qr.sepay.vn/img?acc=3699781&bank=ACB&amount=${selectedPlan.price}&des=Thanh toan goi ${selectedPlan.name}`}
                    alt="QR Code thanh toán"
                    className="mx-auto w-48 h-48"
                  />
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Tài khoản:</strong> 3699781</p>
                  <p><strong>Ngân hàng:</strong> ACB</p>
                  <p><strong>Số tiền:</strong> {formatPrice(selectedPlan.price)}</p>
                  <p><strong>Nội dung:</strong> Thanh toan goi {selectedPlan.name}</p>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    📱 Mở ứng dụng ngân hàng và quét mã QR để thanh toán
                  </p>
                </div>
              </div>
            </div>

          
            {/* Order Summary */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gói dịch vụ:</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời hạn:</span>
                  <span className="font-medium">1 tháng</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(selectedPlan.price)}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {paymentStep === 'plan' && (
            <Button 
              onClick={() => setPaymentStep('info')}
              className="px-8 py-3"
            >
              Tiếp tục
            </Button>
          )}
          
          {paymentStep === 'info' && (
            <>
              <Button 
                variant="outline"
                onClick={() => setPaymentStep('plan')}
              >
                Quay lại
              </Button>
              <Button 
                onClick={() => setPaymentStep('payment')}
                className="px-8 py-3"
              >
                Tiếp tục
              </Button>
            </>
          )}
          
          {paymentStep === 'payment' && (
            <>
              <Button 
                variant="outline"
                onClick={() => setPaymentStep('info')}
              >
                Quay lại
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="px-8 py-3"
              >
                {isProcessing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Xác nhận thanh toán {formatPrice(selectedPlan.price)}
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Thanh toán an toàn</h3>
            <p className="text-gray-600">Bảo mật thông tin thanh toán với tiêu chuẩn PCI DSS</p>
          </div>
          <div className="text-center">
            <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
            <p className="text-gray-600">Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giúp đỡ</p>
          </div>
          <div className="text-center">
            <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kích hoạt ngay</h3>
            <p className="text-gray-600">Truy cập ngay sau khi thanh toán thành công</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
} 