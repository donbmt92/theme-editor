/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, currency, planId, customerInfo, bankId } = body

    if (!amount || !currency || !planId || !customerInfo || !bankId) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin thanh toán' },
        { status: 400 }
      )
    }

    // Generate unique transaction ID
    const bankTxnId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: amount,
        currency: currency,
        status: 'PENDING',
        bankTxnId: bankTxnId
      }
    })

    // In real implementation, this would redirect to bank payment gateway
    // For now, we'll simulate the bank redirect process
    console.log('Payment created, waiting for bank webhook...')
    
    // Return payment info for frontend to show pending status
    const updatedPayment = await prisma.payment.findUnique({
      where: { id: payment.id }
    })

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      message: 'Thanh toán thành công'
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi xử lý thanh toán' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const payments = await prisma.payment.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      payments
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi tải lịch sử thanh toán' },
      { status: 500 }
    )
  }
} 