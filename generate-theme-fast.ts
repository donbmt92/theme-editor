import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Ultra-fast generation for high concurrency
export const maxDuration = 60 // 1 minute only

export async function POST(request: NextRequest) {
  try {
    const { businessInfo, currentTheme } = await request.json()

    // Validate required fields
    if (!businessInfo?.companyName || !businessInfo?.industry || !businessInfo?.description) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    // Get all API keys
    const ALL_KEYS = [
      process.env.GOOGLE_GEMINI_API_KEY,
      process.env.GOOGLE_GEMINI_API_KEY_2,
      process.env.GOOGLE_GEMINI_API_KEY_3,
      process.env.GOOGLE_GEMINI_API_KEY_4,
      process.env.GOOGLE_GEMINI_API_KEY_5,
      process.env.GOOGLE_GEMINI_API_KEY_6,
      process.env.GOOGLE_GEMINI_API_KEY_7,
      process.env.GOOGLE_GEMINI_API_KEY_8,
      process.env.GOOGLE_GEMINI_API_KEY_9,
      process.env.GOOGLE_GEMINI_API_KEY_10,
      process.env.GOOGLE_GEMINI_API_KEY_11,
      process.env.GOOGLE_GEMINI_API_KEY_12,
      process.env.GOOGLE_GEMINI_API_KEY_13,
      process.env.GOOGLE_GEMINI_API_KEY_14,
      process.env.GOOGLE_GEMINI_API_KEY_15,
      process.env.GOOGLE_GEMINI_API_KEY_16,
      process.env.GOOGLE_GEMINI_API_KEY_17
    ].filter(key => key?.trim())

    if (ALL_KEYS.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No API keys available' },
        { status: 500 }
      )
    }

    // Ultra short prompt for speed
    const prompt = `Website: ${businessInfo.companyName} (${businessInfo.industry})
Lang: ${businessInfo.language}

Create JSON:

{
  "colors": {
    "primary": "#2563eb", "secondary": "#64748b", "accent": "#059669", 
    "background": "#ffffff", "text": "#1f2937"
  },
  "content": {
    "header": { "title": "${businessInfo.companyName}" },
    "hero": { 
      "title": "${businessInfo.companyName}", 
      "description": "${businessInfo.description.substring(0, 100)}..." 
    },
    "footer": { "companyName": "${businessInfo.companyName}" }
  }
}`

    // Try multiple keys if needed
    let result, response, text
    let attempts = 0
    
    while (attempts < Math.min(5, ALL_KEYS.length)) {
      try {
        const apiKey = ALL_KEYS[attempts % ALL_KEYS.length]
        console.log(`🔑 Try ${attempts + 1}: ${apiKey?.substring(0, 10)}...`)
        
        const genAI = new GoogleGenerativeAI(apiKey!)
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-pro', // Faster model
          generationConfig: {
            maxOutputTokens: 2048, // Reduce output for speed
            temperature: 0.7
          }
        })
        
        // Timeout wrapper
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 45000) // 45 seconds
        )
        
        const apiCallPromise = model.generateContent(prompt)
        result = await Promise.race([apiCallPromise, timeoutPromise]) as any
        
        response = await result.response
        text = response.text()
        break
        
      } catch (error) {
        attempts++
        console.error(`❌ Attempt ${attempts} failed:`, error)
        
        if (attempts >= Math.min(5, ALL_KEYS.length)) {
          throw error
        }
        
        // Quick retry
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Quick parse
    let generatedData
    try {
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim()
      generatedData = JSON.parse(cleanedText)
    } catch {
      // Fallback
      generatedData = {
        colors: {
          primary: "#2563eb", secondary: "#64748b", accent: "#059669",
          background: "#ffffff", text: "#1f2937"
        },
        content: {
          header: { title: businessInfo.companyName },
          subtitle: businessInfo.industry,
          hero: { title: businessInfo.companyName },
          footer: { companyName: businessInfo.companyName }
        }
      }
    }

    // Minimal theme params
    const themeParams = {
      colors: generatedData.colors || {
        primary: "#2563eb", secondary: "#64748b", accent: "#059669",
        background: "#ffffff", text: "#1f2937"
      },
      content: {
        ...currentTheme?.content,
        ...generatedData.content
      }
    }

    return NextResponse.json({
      success: true,
      themeParams,
      generatedData
    })

  } catch (error) {
    console.error('Fast generation error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Generation failed' },
      { status: 500 }
    )
  }
}
