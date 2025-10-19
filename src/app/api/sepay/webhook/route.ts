import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface SepayWebhookPayload {
  gateway: string
  transactionDate: string
  accountNumber: string
  subAccount: string | null
  code: string | null
  content: string
  transferType: 'in' | 'out'
  description: string
  transferAmount: number
  referenceCode: string
  accumulated: number
  id: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const authHeader = request.headers.get('authorization')
    
    // Log để debug
    console.log('=== SEPAY WEBHOOK DEBUG ===')
    console.log('Headers:', {
      authorization: authHeader,
      contentType: request.headers.get('content-type'),
      userAgent: request.headers.get('user-agent')
    })
    console.log('Raw body:', body)
    
    // Verify Authorization header - Sepay format: "Apikey API_KEY"
    if (!authHeader || !authHeader.startsWith('Apikey ')) {
      console.error('Missing or invalid Authorization header - expected Apikey format')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const apiKey = authHeader.replace('Apikey ', '')
    const expectedApiKey = process.env.SEPAY_API_KEY || 'H0N4ZD49WRMW5FBDIFYJOW7VP1LPQAQRKHQIN8DSJYCQSR76CFWXYXLKT2ETP2UU'
    
    console.log('API Key check:', {
      received: apiKey,
      expected: expectedApiKey,
      match: apiKey === expectedApiKey
    })
    
    if (apiKey !== expectedApiKey) {
      console.error('Invalid API key')
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      )
    }

    const payload: SepayWebhookPayload = JSON.parse(body)
    
    console.log('Received Sepay webhook:', payload)

    // Validate required fields
    if (!payload.referenceCode || !payload.transferAmount || !payload.gateway) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Only process incoming transfers (money received)
    if (payload.transferType !== 'in') {
      console.log('Ignoring outgoing transfer:', payload.referenceCode)
      return NextResponse.json({
        success: true,
        message: 'Outgoing transfer ignored'
      })
    }

    // Find payment by reference code (bankTxnId)
    const payment = await prisma.payment.findUnique({
      where: { bankTxnId: payload.referenceCode },
      include: { user: true }
    })

    if (!payment) {
      console.error('Payment not found:', payload.referenceCode)
      
      // Log các payment gần đây để debug
      const recentPayments = await prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, bankTxnId: true, amount: true, status: true, createdAt: true }
      })
      
      console.log('Recent payments:', recentPayments)
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment not found',
          referenceCode: payload.referenceCode,
          recentPayments: recentPayments.map(p => ({
            id: p.id,
            bankTxnId: p.bankTxnId,
            amount: p.amount,
            status: p.status
          }))
        },
        { status: 404 }
      )
    }

    // Verify amount matches
    if (Number(payment.amount) !== payload.transferAmount) {
      console.error('Amount mismatch:', payment.amount, 'vs', payload.transferAmount)
      return NextResponse.json(
        { success: false, error: 'Amount mismatch' },
        { status: 400 }
      )
    }

    // Update payment status to PAID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'PAID',
        paidAt: new Date()
      }
    })

    // Update user role based on payment amount (assuming plan pricing)
    let userRole: 'USER' | 'ADMIN' = 'USER'
    if (payload.transferAmount >= 599000) { // Pro plan
      userRole = 'ADMIN'
    }

    await prisma.user.update({
      where: { id: payment.userId },
      data: { role: userRole }
    })

    console.log(`Payment ${payload.referenceCode} marked as PAID via ${payload.gateway}`)

    // Send success response to Sepay
    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      paymentId: payment.id,
      status: 'PAID',
      gateway: payload.gateway,
      amount: payload.transferAmount
    })

  } catch (error) {
    console.error('Sepay webhook processing error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for webhook verification
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Sepay webhook endpoint is active',
    timestamp: new Date().toISOString(),
    endpoint: '/api/sepay/webhook'
  })
} 