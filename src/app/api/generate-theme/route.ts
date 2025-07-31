import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// interface BusinessInfo {
//   companyName: string
//   industry: string
//   description: string
//   targetAudience: string
//   services: string
//   location: string
//   website?: string
//   tone: 'professional' | 'friendly' | 'modern' | 'traditional'
//   language: 'vietnamese' | 'english' | 'both'
// }

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

    // Initialize Google Gemini AI
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      console.error('Google Gemini API key not found')
      return NextResponse.json(
        { success: false, error: 'Cấu hình AI chưa đầy đủ' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Create comprehensive prompt for content and color generation
    const prompt = `
Bạn là một chuyên gia thiết kế website và branding. Hãy tạo nội dung và màu sắc cho website doanh nghiệp dựa trên thông tin sau:

THÔNG TIN DOANH NGHIỆP:
- Tên công ty: ${businessInfo.companyName}
- Ngành nghề: ${businessInfo.industry}
- Mô tả: ${businessInfo.description}
- Khách hàng mục tiêu: ${businessInfo.targetAudience || 'Chưa xác định'}
- Sản phẩm/Dịch vụ: ${businessInfo.services || 'Chưa xác định'}
- Địa điểm: ${businessInfo.location || 'Việt Nam'}
- Tông giọng: ${businessInfo.tone}
- Ngôn ngữ: ${businessInfo.language}

YÊU CẦU:
1. Tạo bảng màu phù hợp với ngành nghề và thương hiệu (primary, secondary, accent colors)
2. Viết nội dung cho các section: header, hero, about, problems, solutions, products, footer
3. Nội dung phải phù hợp với tông giọng và ngôn ngữ được chỉ định
4. Đảm bảo nội dung chuyên nghiệp, hấp dẫn và phù hợp với đối tượng khách hàng

Trả về CHÍNH XÁC theo format JSON sau (không thêm markdown hoặc format khác):

{
  "colors": {
    "primary": "#hex_color",
    "secondary": "#hex_color", 
    "accent": "#hex_color",
    "background": "#FFFFFF",
    "text": "#2D3748"
  },
  "content": {
    "meta": {
      "title": "SEO title cho website",
      "description": "Meta description ngắn gọn",
      "keywords": "từ khóa, liên quan, ngành nghề"
    },
    "header": {
      "title": "${businessInfo.companyName}",
      "subtitle": "Slogan ngắn gọn",
      "contactInfo": {
        "phone": "+84 xxx xxx xxx",
        "email": "info@company.com"
      }
    },
    "hero": {
      "title": "Tiêu đề chính hấp dẫn",
      "subtitle": "Phụ đề bổ sung",
      "description": "Mô tả chi tiết về giá trị cốt lõi",
      "ctaText": "Call to action chính",
      "secondaryCtaText": "Call to action phụ"
    },
    "about": {
      "title": "Về Chúng Tôi",
      "description": "Mô tả chi tiết về công ty, lịch sử, tầm nhìn, sứ mệnh"
    },
    "problems": {
      "title": "Thách Thức Hiện Tại",
      "description": "Mô tả những vấn đề khách hàng gặp phải",
      "items": [
        {
          "id": "1",
          "title": "Vấn đề 1",
          "description": "Mô tả chi tiết vấn đề 1",
          "icon": "AlertCircle"
        },
        {
          "id": "2", 
          "title": "Vấn đề 2",
          "description": "Mô tả chi tiết vấn đề 2",
          "icon": "AlertCircle"
        },
        {
          "id": "3",
          "title": "Vấn đề 3", 
          "description": "Mô tả chi tiết vấn đề 3",
          "icon": "AlertCircle"
        }
      ]
    },
    "solutions": {
      "title": "Giải Pháp Của Chúng Tôi",
      "description": "Mô tả cách công ty giải quyết vấn đề",
      "items": [
        {
          "id": "1",
          "title": "Giải pháp 1",
          "description": "Mô tả chi tiết giải pháp 1",
          "benefit": "Lợi ích cụ thể",
          "icon": "CheckCircle"
        },
        {
          "id": "2",
          "title": "Giải pháp 2", 
          "description": "Mô tả chi tiết giải pháp 2",
          "benefit": "Lợi ích cụ thể",
          "icon": "CheckCircle"
        },
        {
          "id": "3",
          "title": "Giải pháp 3",
          "description": "Mô tả chi tiết giải pháp 3", 
          "benefit": "Lợi ích cụ thể",
          "icon": "CheckCircle"
        }
      ]
    },
    "products": {
      "title": "Sản Phẩm/Dịch Vụ",
      "description": "Giới thiệu về các sản phẩm/dịch vụ chính",
      "items": [
        {
          "id": "1",
          "name": "Sản phẩm/Dịch vụ 1",
          "description": "Mô tả chi tiết",
          "price": "Giá/Liên hệ",
          "category": "Danh mục"
        },
        {
          "id": "2", 
          "name": "Sản phẩm/Dịch vụ 2",
          "description": "Mô tả chi tiết",
          "price": "Giá/Liên hệ", 
          "category": "Danh mục"
        },
        {
          "id": "3",
          "name": "Sản phẩm/Dịch vụ 3",
          "description": "Mô tả chi tiết",
          "price": "Giá/Liên hệ",
          "category": "Danh mục"
        }
      ]
    },
    "cta": {
      "title": "Sẵn sàng bắt đầu?",
      "description": "Lời kêu gọi hành động cuối trang",
      "buttonText": "Liên hệ ngay"
    },
    "footer": {
      "companyName": "${businessInfo.companyName}",
      "description": "Mô tả ngắn gọn về công ty",
      "contact": {
        "phone": "+84 xxx xxx xxx",
        "email": "info@company.com", 
        "address": "Địa chỉ chi tiết"
      },
      "newsletter": {
        "title": "Nhận tin tức mới nhất",
        "description": "Đăng ký để nhận thông tin và ưu đãi"
      }
    }
  }
}

Hãy đảm bảo:
- Màu sắc phù hợp với ngành nghề (ví dụ: xanh lá cho nông nghiệp, cam nâu cho cà phê, xanh dương cho công nghệ)
- Nội dung chuyên nghiệp, không có lỗi chính tả
- Phù hợp với tông giọng được yêu cầu
- Sử dụng ngôn ngữ phù hợp (tiếng Việt/tiếng Anh/song ngữ)
- Nội dung cụ thể cho ngành nghề, không generic
`

    // Generate content using Gemini AI with retry logic
    let result, response, text
    let retryCount = 0
    const maxRetries = 3
    
    while (retryCount < maxRetries) {
      try {
        console.log(`Attempting to generate content (attempt ${retryCount + 1}/${maxRetries})`)
        result = await model.generateContent(prompt)
        response = await result.response
        text = response.text()
        break // Success, exit retry loop
                    } catch (aiError: unknown) {
         retryCount++
         console.error(`AI generation error (attempt ${retryCount}):`, aiError)
         
         if (retryCount >= maxRetries) {
           // Type guard to check if aiError has expected properties
           const error = aiError as { status?: number; message?: string }
           
           // If we've exhausted retries, return appropriate error
           if (error?.status === 503 || error?.message?.includes('overloaded')) {
             return NextResponse.json(
               { 
                 success: false, 
                 error: 'Dịch vụ AI đang quá tải. Vui lòng thử lại sau vài phút.',
                 errorType: 'AI_OVERLOADED',
                 retryAfter: 300 // 5 minutes
               },
               { status: 503 }
             )
           } else if (error?.status === 429 || error?.message?.includes('quota')) {
             return NextResponse.json(
               { 
                 success: false, 
                 error: 'Đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau.',
                 errorType: 'QUOTA_EXCEEDED',
                 retryAfter: 3600 // 1 hour
               },
               { status: 429 }
             )
           } else {
             return NextResponse.json(
               { 
                 success: false, 
                 error: 'Có lỗi xảy ra khi tạo nội dung. Vui lòng thử lại.',
                 errorType: 'AI_ERROR',
                 details: process.env.NODE_ENV === 'development' ? error?.message : undefined
               },
               { status: 500 }
             )
           }
         }
        
        // Wait before retry (exponential backoff)
        const waitTime = Math.pow(2, retryCount) * 1000 // 1s, 2s, 4s
        console.log(`Waiting ${waitTime}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }

    // Validate AI response
    if (!text) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Không nhận được phản hồi từ AI. Vui lòng thử lại.',
          errorType: 'NO_AI_RESPONSE'
        },
        { status: 500 }
      )
    }

    // Clean and parse the JSON response
    let generatedData
    try {
      // Remove any markdown formatting and extra whitespace
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      generatedData = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('Raw response:', text)
      
      // Fallback: try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          generatedData = JSON.parse(jsonMatch[0])
        } catch {
          throw new Error('Không thể parse phản hồi từ AI')
        }
      } else {
        throw new Error('Không tìm thấy JSON trong phản hồi AI')
      }
    }

    // Merge with current theme structure
    const themeParams = {
      colors: {
        ...currentTheme?.colors,
        ...generatedData.colors
      },
      typography: currentTheme?.typography || {
        fontFamily: "Inter",
        fontSize: "16px",
        headingSize: "xl",
        bodySize: "base", 
        lineHeight: "1.6",
        fontWeight: "400"
      },
      layout: currentTheme?.layout || {
        containerWidth: "1200px",
        sectionSpacing: "80px",
        spacing: "comfortable",
        borderRadius: "8px"
      },
      components: currentTheme?.components || {
        button: {
          style: "solid",
          size: "medium",
          rounded: true
        },
        card: {
          shadow: "medium",
          border: true,
          padding: "medium"
        },
        form: {
          style: "modern",
          validation: "inline"
        },
        navigation: {
          style: "horizontal",
          sticky: true
        }
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
    console.error('Theme generation error:', error)
    
    let errorMessage = 'Có lỗi xảy ra khi tạo nội dung'
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Lỗi xác thực API. Vui lòng kiểm tra cấu hình.'
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = 'Đã vượt quá giới hạn API. Vui lòng thử lại sau.'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
} 