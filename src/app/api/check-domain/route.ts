/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns/promises'

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json()
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    try {
      const addresses = await dns.resolve4(domain)
      if (addresses && addresses.length > 0) {
        return NextResponse.json({ ip: addresses[0] })
      }
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Could not resolve domain' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
