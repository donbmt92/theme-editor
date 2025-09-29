import { NextRequest, NextResponse } from 'next/server'
import { aiLoadBalancer } from '@/lib/ai-load-balancer'

export async function POST(request: NextRequest) {
  try {
    // Check if request is from admin or has proper authorization
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.ADMIN_RESET_TOKEN || 'admin-reset-2024'
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Force reset all API keys (reset error counts and usage)
    // This will allow keys to be used again after quota reset
    
    // Get updated stats
    const stats = aiLoadBalancer.getStats()
    
    return NextResponse.json({
      success: true,
      message: 'API keys reset successfully',
      stats
    })
  } catch (error) {
    console.error('Error resetting API keys:', error)
    return NextResponse.json(
      { error: 'Failed to reset API keys' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get current stats without resetting
    const stats = aiLoadBalancer.getStats()
    
    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Error getting API key stats:', error)
    return NextResponse.json(
      { error: 'Failed to get API key stats' },
      { status: 500 }
    )
  }
}
