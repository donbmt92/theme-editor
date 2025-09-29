import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

    // Initialize Google Gemini AI with multiple API keys
    const apiKeys = [
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
    ].filter(key => key && key.trim() !== '') // Remove empty keys

    if (apiKeys.length === 0) {
      console.error('No Google Gemini API keys found')
      return NextResponse.json(
        { success: false, error: 'Cấu hình AI chưa đầy đủ' },
        { status: 500 }
      )
    }

    // Randomly select an API key for load balancing
    const selectedApiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)]
    console.log(`Using API key: ${selectedApiKey.substring(0, 10)}... (${apiKeys.length} keys available)`)

    const genAI = new GoogleGenerativeAI(selectedApiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

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

YÊU CẦU QUAN TRỌNG:
1. TẤT CẢ nội dung website phải được viết bằng ${businessInfo.language === 'english' ? 'tiếng Anh' : 'tiếng Việt'}
2. Không được mix ngôn ngữ trong cùng một section
3. Nếu ngôn ngữ là 'english', tất cả text phải là English
4. Nếu ngôn ngữ là 'vietnamese', tất cả text phải là tiếng Việt
5. Tạo bảng màu phù hợp với ngành nghề và thương hiệu (primary, secondary, accent colors)
6. Viết nội dung đầy đủ cho tất cả các section theo cấu trúc template
7. Nội dung phải phù hợp với tông giọng và ngôn ngữ được chỉ định
8. Đảm bảo nội dung chuyên nghiệp, hấp dẫn và phù hợp với đối tượng khách hàng
9. Sử dụng kích thước tiêu đề phù hợp: titleSize="xl" (lớn), subtitleSize="lg" (lớn), descriptionSize="base" (vừa)
10. Sử dụng độ đậm font phù hợp: titleWeight="semibold", subtitleWeight="medium", descriptionWeight="normal"

Trả về CHÍNH XÁC theo format JSON sau (không thêm markdown hoặc format khác):

{
  "colors": {
    "primary": "#hex_color",
    "secondary": "#hex_color", 
    "accent": "#hex_color",
    "background": "#FFFFFF",
    "text": "#2D3748",
    "border": "#E2E8F0"
  },
  "content": {
    "header": {
      "title": "${businessInfo.companyName}",
      "subtitle": "${businessInfo.language === 'english' ? 'Short slogan suitable for the industry' : 'Slogan ngắn gọn phù hợp với ngành nghề'}",
      "backgroundColor": "#hex_color",
      "textColor": "#hex_color",
      "logo": "/assets/logo.png",
      "navigation": [
        {"name": "${businessInfo.language === 'english' ? 'Home' : 'Trang chủ'}", "href": "#home"},
        {"name": "${businessInfo.language === 'english' ? 'Products' : 'Sản phẩm'}", "href": "#products"},
        {"name": "${businessInfo.language === 'english' ? 'Services' : 'Dịch vụ'}", "href": "#services"},
        {"name": "${businessInfo.language === 'english' ? 'About Us' : 'Về chúng tôi'}", "href": "#about"},
        {"name": "${businessInfo.language === 'english' ? 'Contact' : 'Liên hệ'}", "href": "#contact"}
      ]
    },
         "hero": {
       "title": "${businessInfo.language === 'english' ? 'Attractive main title for ' + businessInfo.industry : 'Tiêu đề chính hấp dẫn cho ' + businessInfo.industry}",
       "subtitle": "${businessInfo.language === 'english' ? 'Supporting subtitle' : 'Phụ đề bổ sung'}",
       "description": "${businessInfo.language === 'english' ? 'Detailed description about core values and main benefits' : 'Mô tả chi tiết về giá trị cốt lõi và lợi ích chính'}",
       "ctaText": "${businessInfo.language === 'english' ? 'Main call to action' : 'Call to action chính'}",
       "ctaSecondaryText": "${businessInfo.language === 'english' ? 'Secondary call to action' : 'Call to action phụ'}",
       "image": "/assets/hero-image.jpg",
       "titleSize": "xl",
       "subtitleSize": "lg",
       "descriptionSize": "base",
       "titleWeight": "semibold",
       "subtitleWeight": "medium",
       "ctaSize": "lg",
       "ctaWeight": "semibold",
       "benefitsSize": "base",
       "benefitsWeight": "medium",
       "statsSize": "lg",
       "statsWeight": "bold",
      "benefits": [
        {"icon": "CheckCircle", "text": "${businessInfo.language === 'english' ? 'Benefit 1' : 'Lợi ích 1'}"},
        {"icon": "Shield", "text": "${businessInfo.language === 'english' ? 'Benefit 2' : 'Lợi ích 2'}"},
        {"icon": "Truck", "text": "${businessInfo.language === 'english' ? 'Benefit 3' : 'Lợi ích 3'}"}
      ],
      "stats": [
        {"number": "100+", "label": "${businessInfo.language === 'english' ? 'Customers' : 'Khách hàng'}"},
        {"number": "5+", "label": "${businessInfo.language === 'english' ? 'Years Experience' : 'Năm kinh nghiệm'}"},
        {"number": "24/7", "label": "${businessInfo.language === 'english' ? 'Support' : 'Hỗ trợ'}"}
      ]
    },
    "about": {
      "title": "${businessInfo.language === 'english' ? 'About Us' : 'Về Chúng Tôi'}",
      "description": "${businessInfo.language === 'english' ? 'Detailed description about the company, history, vision, mission' : 'Mô tả chi tiết về công ty, lịch sử, tầm nhìn, sứ mệnh'}",
      "image": "/assets/about-image.jpg",
      "features": [
        {"icon": "Award", "title": "Chứng nhận", "description": "Mô tả chứng nhận"},
        {"icon": "Globe", "title": "Thị trường", "description": "Mô tả thị trường"},
        {"icon": "Users", "title": "Đội ngũ", "description": "Mô tả đội ngũ"}
      ]
    },
    "problems": {
      "title": "Thách Thức Hiện Tại",
      "description": "Mô tả những vấn đề khách hàng gặp phải trong ngành ${businessInfo.industry}",
      "backgroundColor": "#FFF8DC",
      "textColor": "#2D3748",
      "items": [
        {
          "id": "1",
          "title": "Vấn đề 1",
          "description": "Mô tả chi tiết vấn đề 1",
          "icon": "AlertTriangle"
        },
        {
          "id": "2", 
          "title": "Vấn đề 2",
          "description": "Mô tả chi tiết vấn đề 2",
          "icon": "Clock"
        },
        {
          "id": "3",
          "title": "Vấn đề 3", 
          "description": "Mô tả chi tiết vấn đề 3",
          "icon": "DollarSign"
        },
        {
          "id": "4",
          "title": "Vấn đề 4",
          "description": "Mô tả chi tiết vấn đề 4",
          "icon": "Truck"
        }
      ]
    },
    "solutions": {
      "title": "Giải Pháp Của Chúng Tôi",
      "description": "Mô tả cách công ty giải quyết vấn đề",
      "backgroundColor": "#F0F8FF",
      "textColor": "#2D3748",
      "items": [
        {
          "id": "1",
          "title": "Giải pháp 1",
          "description": "Mô tả chi tiết giải pháp 1",
          "benefit": "Lợi ích cụ thể",
          "icon": "Globe"
        },
        {
          "id": "2",
          "title": "Giải pháp 2", 
          "description": "Mô tả chi tiết giải pháp 2",
          "benefit": "Lợi ích cụ thể",
          "icon": "Shield"
        },
        {
          "id": "3",
          "title": "Giải pháp 3",
          "description": "Mô tả chi tiết giải pháp 3", 
          "benefit": "Lợi ích cụ thể",
          "icon": "Zap"
        },
        {
          "id": "4",
          "title": "Giải pháp 4",
          "description": "Mô tả chi tiết giải pháp 4",
          "benefit": "Lợi ích cụ thể",
          "icon": "Package"
        }
      ]
    },
    "cta": {
      "title": "Sẵn sàng bắt đầu?",
      "description": "Lời kêu gọi hành động cuối trang",
      "buttonText": "Liên hệ ngay",
      "buttonSecondaryText": "Tải tài liệu mẫu",
      "backgroundColor": "#8B4513",
      "textColor": "#FFFFFF",
      "image": "/assets/cta-image.jpg"
    },
    "leadMagnet": {
      "title": "Mở khóa thành công",
      "description": "Tải về hướng dẫn toàn diện cho ${businessInfo.industry}",
      "backgroundColor": "#F8F9FA",
      "textColor": "#2D3748",
      "guideTitle": "Hướng dẫn đầy đủ",
      "guideSubtitle": "Phiên bản 2024 - 45 trang",
      "formTitle": "${businessInfo.language === 'english' ? 'Download Your Free Guide' : 'Tải về hướng dẫn miễn phí'}",
      "formDescription": "${businessInfo.language === 'english' ? 'Enter your details below for instant access to valuable resources' : 'Nhập thông tin bên dưới để có quyền truy cập ngay lập tức'}",
      "buttonText": "${businessInfo.language === 'english' ? 'Download Free Guide Now' : 'Tải về hướng dẫn miễn phí ngay'}",
      "guideFeatures": [
        {"icon": "FileText", "title": "${businessInfo.language === 'english' ? 'Complete Documentation' : 'Tài liệu đầy đủ'}", "description": "${businessInfo.language === 'english' ? 'All necessary forms and documents' : 'Mọi biểu mẫu và tài liệu cần thiết'}"},
        {"icon": "TrendingUp", "title": "${businessInfo.language === 'english' ? 'Market Analysis' : 'Phân tích thị trường'}", "description": "${businessInfo.language === 'english' ? 'Current market data and trends' : 'Dữ liệu thị trường hiện tại'}"},
        {"icon": "Shield", "title": "${businessInfo.language === 'english' ? 'Quality Standards' : 'Tiêu chuẩn chất lượng'}", "description": "${businessInfo.language === 'english' ? 'Detailed requirements for standards' : 'Yêu cầu chi tiết cho tiêu chuẩn'}"},
        {"icon": "CheckCircle", "title": "${businessInfo.language === 'english' ? 'Step-by-Step Process' : 'Quy trình từng bước'}", "description": "${businessInfo.language === 'english' ? 'Clear timeline from start to finish' : 'Lịch trình rõ ràng từ đầu đến cuối'}"}
      ],
      "trustIndicators": [
        {"number": "5,000+", "label": "${businessInfo.language === 'english' ? 'Downloads' : 'Lượt tải'}"},
        {"number": "92%", "label": "${businessInfo.language === 'english' ? 'Success Rate' : 'Tỷ lệ thành công'}"},
        {"number": "4.9/5", "label": "${businessInfo.language === 'english' ? 'User Rating' : 'Đánh giá người dùng'}"}
      ]
    },
    "products": {
      "title": "Sản Phẩm/Dịch Vụ Của Chúng Tôi",
      "description": "Giới thiệu về các sản phẩm/dịch vụ chính",
      "backgroundColor": "#F0F4F8",
      "textColor": "#2D3748",
      "items": [
        {
          "id": "1",
          "name": "Sản phẩm/Dịch vụ 1",
          "description": "Mô tả chi tiết sản phẩm/dịch vụ 1",
          "price": "Giá/Liên hệ",
          "category": "Danh mục 1",
          "image": "/assets/product-1.jpg",
          "features": ["Tính năng 1", "Tính năng 2", "Tính năng 3"]
        },
        {
          "id": "2", 
          "name": "Sản phẩm/Dịch vụ 2",
          "description": "Mô tả chi tiết sản phẩm/dịch vụ 2",
          "price": "Giá/Liên hệ", 
          "category": "Danh mục 2",
          "image": "/assets/product-2.jpg",
          "features": ["Tính năng 1", "Tính năng 2", "Tính năng 3"]
        },
        {
          "id": "3",
          "name": "Sản phẩm/Dịch vụ 3",
          "description": "Mô tả chi tiết sản phẩm/dịch vụ 3",
          "price": "Giá/Liên hệ",
          "category": "Danh mục 3",
          "image": "/assets/product-3.jpg",
          "features": ["Tính năng 1", "Tính năng 2", "Tính năng 3"]
        }
      ],
      "services": [
        {"id": "1", "name": "Dịch vụ 1", "description": "Mô tả dịch vụ 1", "icon": "Package", "cta": "Tìm hiểu thêm"},
        {"id": "2", "name": "Dịch vụ 2", "description": "Mô tả dịch vụ 2", "icon": "Truck", "cta": "Tìm hiểu thêm"},
        {"id": "3", "name": "Dịch vụ 3", "description": "Mô tả dịch vụ 3", "icon": "FileText", "cta": "Tìm hiểu thêm"},
        {"id": "4", "name": "Dịch vụ 4", "description": "Mô tả dịch vụ 4", "icon": "Users", "cta": "Tìm hiểu thêm"},
        {"id": "5", "name": "Dịch vụ 5", "description": "Mô tả dịch vụ 5", "icon": "Shield", "cta": "Tìm hiểu thêm"},
        {"id": "6", "name": "Dịch vụ 6", "description": "Mô tả dịch vụ 6", "icon": "TrendingUp", "cta": "Tìm hiểu thêm"}
      ]
    },
    "whyChooseUs": {
      "title": "Tại Sao Chọn ${businessInfo.companyName}?",
      "subtitle": "Chúng tôi kết hợp kinh nghiệm với công nghệ hiện đại để mang lại giá trị vượt trội",
      "backgroundColor": "#FFFFFF",
      "textColor": "#2D3748",
      "strengths": [
        {"icon": "Award", "title": "Chứng nhận quốc tế", "description": "FDA, USDA, ISO"},
        {"icon": "Globe", "title": "Thị trường toàn cầu", "description": "Xuất khẩu đến 25+ quốc gia"},
        {"icon": "Users", "title": "Đội ngũ chuyên gia", "description": "20+ năm kinh nghiệm"},
        {"icon": "Shield", "title": "Chất lượng đảm bảo", "description": "Hệ thống kiểm soát nghiêm ngặt"},
        {"icon": "Clock", "title": "Giao hàng đúng hạn", "description": "Cam kết thời gian"},
        {"icon": "TrendingUp", "title": "Tăng trưởng bền vững", "description": "Phát triển cùng đối tác"}
      ],
      "mission": {
        "title": "Sứ mệnh",
        "description": "Mang giá trị ${businessInfo.industry} đến thế giới, tạo giá trị bền vững cho đối tác."
      },
      "vision": {
        "title": "Tầm nhìn",
        "description": "Trở thành đối tác hàng đầu trong lĩnh vực ${businessInfo.industry}, được tin tưởng bởi thị trường quốc tế."
      },
      "cta": {
        "title": "Bắt đầu hợp tác ngay hôm nay",
        "description": "Liên hệ với chúng tôi để được tư vấn miễn phí.",
        "buttonText": "Liên hệ ngay"
      }
    },
    "testimonials": {
      "title": "Khách Hàng Nói Gì Về Chúng Tôi",
      "subtitle": "Lời chứng thực từ các đối tác và khách hàng quốc tế",
      "backgroundColor": "#F5F5DC",
      "textColor": "#2D3748",
      "testimonials": [
        {
          "id": "1",
          "name": "Sarah Johnson",
          "title": "Manager",
          "company": "Company A",
          "content": "Chất lượng sản phẩm vượt trội hơn mong đợi. Quy trình làm việc rất chuyên nghiệp.",
          "rating": 5,
          "image": "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face"
        },
        {
          "id": "2",
          "name": "Michael Chen",
          "title": "Director",
          "company": "Company B",
          "content": "Đối tác tin cậy với cam kết chất lượng cao. Giao hàng đúng hạn và dịch vụ xuất sắc.",
          "rating": 5,
          "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
        },
        {
          "id": "3",
          "name": "David Rodriguez",
          "title": "CEO",
          "company": "Company C",
          "content": "Sản phẩm có chất lượng độc đáo, phù hợp hoàn hảo cho nhu cầu của chúng tôi.",
          "rating": 5,
          "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
        }
      ],
      "partners": [
        "Partner A", "Partner B", "Partner C", "Partner D", "Partner E", "Partner F"
      ],
      "stats": [
        {"number": "500+", "label": "Lô hàng", "sublabel": "Chất lượng cao"},
        {"number": "200+", "label": "Khách hàng", "sublabel": "Tin tưởng"},
        {"number": "15+", "label": "Năm kinh nghiệm", "sublabel": "Thị trường"},
        {"number": "98%", "label": "Tỷ lệ hài lòng", "sublabel": "Khách hàng"}
      ]
    },
    "blog": {
      "title": "Thông Tin Ngành Mới Nhất",
      "subtitle": "Cập nhật thông tin với tin tức mới nhất, xu hướng thị trường và chuyên môn về ${businessInfo.industry}",
      "backgroundColor": "#F8F9FA",
      "textColor": "#2D3748",
      "categories": [
        {"name": "Thị trường", "count": 15},
        {"name": "Kỹ thuật", "count": 12},
        {"name": "Xuất khẩu", "count": 8},
        {"name": "Chất lượng", "count": 10}
      ],
      "featuredPost": {
        "title": "Xu hướng thị trường ${businessInfo.industry} 2024",
        "excerpt": "Phân tích chi tiết về xu hướng tiêu dùng và cơ hội cho ${businessInfo.industry}.",
        "author": "Chuyên gia",
        "date": "2024-01-15",
        "image": "/assets/blog-featured.jpg",
        "category": "Thị trường"
      },
      "posts": [
        {
          "id": "1",
          "title": "Hướng dẫn xuất khẩu ${businessInfo.industry}",
          "excerpt": "Quy trình chi tiết từ chuẩn bị hồ sơ đến giao hàng thành công.",
          "author": "Chuyên gia",
          "date": "2024-01-10",
          "image": "/assets/blog-1.jpg",
          "category": "Xuất khẩu"
        },
        {
          "id": "2",
          "title": "Tiêu chuẩn chất lượng cho ${businessInfo.industry}",
          "excerpt": "Những yêu cầu cần thiết để đạt tiêu chuẩn quốc tế.",
          "author": "Chuyên gia",
          "date": "2024-01-08",
          "image": "/assets/blog-2.jpg",
          "category": "Chất lượng"
        },
        {
          "id": "3",
          "title": "Kỹ thuật hiện đại cho ${businessInfo.industry}",
          "excerpt": "Phương pháp hiện đại giúp tăng năng suất và chất lượng.",
          "author": "Chuyên gia",
          "date": "2024-01-05",
          "image": "/assets/blog-3.jpg",
          "category": "Kỹ thuật"
        }
      ],
      "newsletter": {
        "title": "Đăng ký nhận tin tức",
        "description": "Nhận thông tin mới nhất về thị trường và cơ hội.",
        "placeholder": "Email của bạn",
        "buttonText": "Đăng ký"
      }
    },
    "footer": {
      "companyName": "${businessInfo.companyName}",
      "description": "Chuyên cung cấp ${businessInfo.industry} chất lượng cao cho thị trường quốc tế",
      "backgroundColor": "#D2691E",
      "textColor": "#F9FAFB",
      "contact": {
        "phone": "+84 123 456 789",
        "email": "info@company.com",
        "address": "123 Đường ABC, Quận 1, TP.HCM",
        "businessHours": "Thứ 2-Thứ 6: 8AM-6PM (EST)"
      },
      "quickLinks": [
        {"name": "Về Chúng Tôi", "href": "#about"},
        {"name": "Sản Phẩm", "href": "#products"},
        {"name": "Dịch Vụ", "href": "#services"},
        {"name": "Chất Lượng", "href": "#quality"},
        {"name": "Liên Hệ", "href": "#contact"}
      ],
      "resources": [
        {"name": "Hướng Dẫn", "href": "#guide"},
        {"name": "Báo Cáo", "href": "#reports"},
        {"name": "Tài Liệu", "href": "#docs"},
        {"name": "FAQ", "href": "#faq"},
        {"name": "Blog", "href": "#blog"}
      ],
      "legal": [
        {"name": "Chính Sách Bảo Mật", "href": "#privacy"},
        {"name": "Điều Khoản Dịch Vụ", "href": "#terms"},
        {"name": "Chính Sách Cookie", "href": "#cookies"},
        {"name": "Tuân Thủ", "href": "#compliance"}
      ],
      "socialLinks": [
        {"icon": "Facebook", "href": "#", "label": "Facebook"},
        {"icon": "Twitter", "href": "#", "label": "Twitter"},
        {"icon": "Linkedin", "href": "#", "label": "LinkedIn"},
        {"icon": "Youtube", "href": "#", "label": "YouTube"}
      ]
    }
  }
}

Hãy đảm bảo:
- Màu sắc phù hợp với ngành nghề (ví dụ: xanh lá cho nông nghiệp, cam nâu cho cà phê, xanh dương cho công nghệ)
- Nội dung chuyên nghiệp, không có lỗi chính tả
- Phù hợp với tông giọng được yêu cầu
- Sử dụng ngôn ngữ phù hợp (tiếng Việt/tiếng Anh/song ngữ)
- Nội dung cụ thể cho ngành nghề, không generic
- Tất cả các section đều có nội dung đầy đủ và phù hợp
`

    // Generate content using Gemini AI with retry logic and API key failover
    let result, response, text
    let retryCount = 0
    const maxRetries = 3
    
    while (retryCount < maxRetries && retryCount < apiKeys.length) {
      try {
        const currentApiKey = retryCount === 0 ? selectedApiKey : apiKeys[retryCount % apiKeys.length]
        
        console.log(`Attempting to generate content (attempt ${retryCount + 1}/${maxRetries}) with API key: ${currentApiKey.substring(0, 10)}...`)
        
        const genAI = new GoogleGenerativeAI(currentApiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
        
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
          if (error?.status === 503 || error?.message?.includes('overloaded') || error?.message?.includes('Service Unavailable')) {
            return NextResponse.json(
              { 
                success: false, 
                error: 'Dịch vụ AI của Google đang tạm thời không khả dụng. Vui lòng thử lại sau vài phút.',
                errorType: 'AI_SERVICE_UNAVAILABLE',
                retryAfter: 300, // 5 minutes
                suggestion: 'Hãy thử lại sau 5-10 phút hoặc kiểm tra trạng thái dịch vụ Google AI.'
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
      console.log("generatedData", generatedData.products.items);
      
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

    // Merge with current theme structure - prioritize generated colors
    const themeParams = {
      colors: {
        ...currentTheme?.colors,  // Base colors from current theme
        ...generatedData.colors,  // Override with AI generated colors (priority)
        // Fallback defaults if AI doesn't provide colors
        primary: generatedData.colors?.primary || currentTheme?.colors?.primary || "#007bff",
        secondary: generatedData.colors?.secondary || currentTheme?.colors?.secondary || "#6c757d",
        accent: generatedData.colors?.accent || currentTheme?.colors?.accent || "#28a745",
        background: generatedData.colors?.background || currentTheme?.colors?.background || "#ffffff",
        text: generatedData.colors?.text || currentTheme?.colors?.text || "#2D3748",
        border: generatedData.colors?.border || currentTheme?.colors?.border || "#E2E8F0",
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