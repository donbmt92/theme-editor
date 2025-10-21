import { executeAIRequestWithRetry } from './ai-request-handler'

// Helper function to extract partial data from incomplete JSON
function extractPartialDataFromIncompleteJson(incompleteJson: string): any | null {
  try {
    // Try to extract key-value pairs from incomplete JSON
    const extractedData: any = {}
    
    // Extract string values using regex
    const stringMatches = incompleteJson.match(/"([^"]+)":\s*"([^"]*)/g)
    if (stringMatches) {
      stringMatches.forEach(match => {
        const [, key, value] = match.match(/"([^"]+)":\s*"([^"]*)/) || []
        if (key && value !== undefined) {
          extractedData[key] = value
        }
      })
    }
    
    // Extract boolean values
    const booleanMatches = incompleteJson.match(/"([^"]+)":\s*(true|false)/g)
    if (booleanMatches) {
      booleanMatches.forEach(match => {
        const [, key, value] = match.match(/"([^"]+)":\s*(true|false)/) || []
        if (key && value !== undefined) {
          extractedData[key] = value === 'true'
        }
      })
    }
    
    // Extract number values
    const numberMatches = incompleteJson.match(/"([^"]+)":\s*(\d+)/g)
    if (numberMatches) {
      numberMatches.forEach(match => {
        const [, key, value] = match.match(/"([^"]+)":\s*(\d+)/) || []
        if (key && value !== undefined) {
          extractedData[key] = parseInt(value, 10)
        }
      })
    }
    
    // If we extracted any data, return it
    if (Object.keys(extractedData).length > 0) {
      return extractedData
    }
    
    return null
  } catch (error) {
    console.error('Error extracting partial data:', error)
    return null
  }
}

// Business info interface
interface BusinessInfo {
  companyName: string
  industry: string
  description: string
  language: 'english' | 'vietnamese'
  targetAudience?: string
  services?: string
  location?: string
  tone: string
}

// Theme data interfaces
interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  border: string
}

interface ThemeData {
  colors: ThemeColors
  content: any
}

// Fallback theme data generator
function createFallbackThemeData(businessInfo: BusinessInfo) {
  console.log('🔄 Creating fallback theme data for:', businessInfo.companyName)
  
  return {
    colors: {
      primary: "#007bff",
      secondary: "#6c757d", 
      accent: "#28a745",
      background: "#FFFFFF",
      text: "#2D3748",
      border: "#E2E8F0"
    },
    content: {
      header: {
        title: businessInfo.companyName,
        subtitle: businessInfo.language === 'english' ? 'Professional Solutions' : 'Giải pháp chuyên nghiệp',
        backgroundColor: "#007bff",
        textColor: "#FFFFFF",
        logo: "/assets/logo.png",
        navigation: [
          {"name": businessInfo.language === 'english' ? 'Home' : 'Trang chủ', "href": "#home"},
          {"name": businessInfo.language === 'english' ? 'Products' : 'Sản phẩm', "href": "#products"},
          {"name": businessInfo.language === 'english' ? 'Services' : 'Dịch vụ', "href": "#services"},
          {"name": businessInfo.language === 'english' ? 'About Us' : 'Về chúng tôi', "href": "#about"},
          {"name": businessInfo.language === 'english' ? 'Contact' : 'Liên hệ', "href": "#contact"}
        ]
      },
      hero: {
        title: businessInfo.language === 'english' ? `Welcome to ${businessInfo.companyName}` : `Chào mừng đến với ${businessInfo.companyName}`,
        subtitle: businessInfo.description || (businessInfo.language === 'english' ? 'Professional Services' : 'Dịch vụ chuyên nghiệp'),
        description: businessInfo.description || (businessInfo.language === 'english' ? 'We provide high-quality services' : 'Chúng tôi cung cấp dịch vụ chất lượng cao'),
        ctaText: businessInfo.language === 'english' ? 'Get Started' : 'Bắt đầu',
        ctaSecondaryText: businessInfo.language === 'english' ? 'Learn More' : 'Tìm hiểu thêm',
        image: "/assets/hero-image.jpg",
        titleSize: "xl",
        subtitleSize: "lg",
        descriptionSize: "base",
        titleWeight: "semibold",
        subtitleWeight: "medium",
        ctaSize: "lg",
        ctaWeight: "semibold",
        benefitsSize: "base",
        benefitsWeight: "medium",
        statsSize: "lg",
        statsWeight: "bold",
        benefits: [
          {"icon": "CheckCircle", "text": businessInfo.language === 'english' ? 'Quality Service' : 'Dịch vụ chất lượng'},
          {"icon": "Shield", "text": businessInfo.language === 'english' ? 'Reliable' : 'Đáng tin cậy'},
          {"icon": "Truck", "text": businessInfo.language === 'english' ? 'Fast Delivery' : 'Giao hàng nhanh'}
        ],
        stats: [
          {"number": "100+", "label": businessInfo.language === 'english' ? 'Customers' : 'Khách hàng'},
          {"number": "5+", "label": businessInfo.language === 'english' ? 'Years Experience' : 'Năm kinh nghiệm'},
          {"number": "24/7", "label": businessInfo.language === 'english' ? 'Support' : 'Hỗ trợ'}
        ]
      },
      about: {
        title: businessInfo.language === 'english' ? 'About Us' : 'Về Chúng Tôi',
        description: businessInfo.description || (businessInfo.language === 'english' ? 'We are a professional company' : 'Chúng tôi là một công ty chuyên nghiệp'),
        image: "/assets/about-image.jpg",
        features: [
          {
            icon: "Award",
            title: businessInfo.language === 'english' ? 'Certification' : 'Chứng nhận',
            description: businessInfo.language === 'english' ? 'Certified quality' : 'Chất lượng được chứng nhận'
          },
          {
            icon: "Globe",
            title: businessInfo.language === 'english' ? 'Market' : 'Thị trường',
            description: businessInfo.language === 'english' ? 'Global reach' : 'Phạm vi toàn cầu'
          },
          {
            icon: "Users",
            title: businessInfo.language === 'english' ? 'Team' : 'Đội ngũ',
            description: businessInfo.language === 'english' ? 'Expert team' : 'Đội ngũ chuyên gia'
          }
        ]
      },
      problems: {
        title: businessInfo.language === 'english' ? 'Current Challenges' : 'Thách Thức Hiện Tại',
        description: businessInfo.language === 'english' ? 'Common problems in the industry' : 'Những vấn đề phổ biến trong ngành',
        backgroundColor: "#FFF8DC",
        textColor: "#2D3748",
        items: [
          {
            "id": "1",
            "title": businessInfo.language === 'english' ? 'Problem 1' : 'Vấn đề 1',
            "description": businessInfo.language === 'english' ? 'Description of problem 1' : 'Mô tả vấn đề 1',
            "icon": "AlertTriangle"
          },
          {
            "id": "2", 
            "title": businessInfo.language === 'english' ? 'Problem 2' : 'Vấn đề 2',
            "description": businessInfo.language === 'english' ? 'Description of problem 2' : 'Mô tả vấn đề 2',
            "icon": "Clock"
          }
        ]
      },
      solutions: {
        title: businessInfo.language === 'english' ? 'Our Solutions' : 'Giải Pháp Của Chúng Tôi',
        description: businessInfo.language === 'english' ? 'How we solve problems' : 'Cách chúng tôi giải quyết vấn đề',
        backgroundColor: "#F0F8FF",
        textColor: "#2D3748",
        items: [
          {
            "id": "1",
            "title": businessInfo.language === 'english' ? 'Solution 1' : 'Giải pháp 1',
            "description": businessInfo.language === 'english' ? 'Description of solution 1' : 'Mô tả giải pháp 1',
            "benefit": businessInfo.language === 'english' ? 'Specific benefit' : 'Lợi ích cụ thể',
            "icon": "Globe"
          },
          {
            "id": "2",
            "title": businessInfo.language === 'english' ? 'Solution 2' : 'Giải pháp 2',
            "description": businessInfo.language === 'english' ? 'Description of solution 2' : 'Mô tả giải pháp 2',
            "benefit": businessInfo.language === 'english' ? 'Specific benefit' : 'Lợi ích cụ thể',
            "icon": "Shield"
          }
        ]
      },
      leadMagnet: {
        title: businessInfo.language === 'english' ? 'Unlock Success' : 'Mở Khóa Thành Công',
        description: businessInfo.language === 'english' ? 'Download our comprehensive guide' : 'Tải về hướng dẫn toàn diện',
        backgroundColor: "#F8F9FA",
        textColor: "#2D3748",
        guideTitle: businessInfo.language === 'english' ? 'Complete Guide' : 'Hướng dẫn đầy đủ',
        guideSubtitle: businessInfo.language === 'english' ? '2025 Edition' : 'Phiên bản 2025',
        formTitle: businessInfo.language === 'english' ? 'Download Your Free Guide' : 'Tải về hướng dẫn miễn phí',
        formDescription: businessInfo.language === 'english' ? 'Enter your details below' : 'Nhập thông tin bên dưới',
        buttonText: businessInfo.language === 'english' ? 'Download Free Guide Now' : 'Tải về hướng dẫn miễn phí ngay',
        guideFeatures: [
          {
            "icon": "FileText", 
            "title": businessInfo.language === 'english' ? 'Complete Documentation' : 'Tài liệu đầy đủ', 
            "description": businessInfo.language === 'english' ? 'All necessary documents' : 'Mọi tài liệu cần thiết'
          },
          {
            "icon": "TrendingUp", 
            "title": businessInfo.language === 'english' ? 'Market Analysis' : 'Phân tích thị trường', 
            "description": businessInfo.language === 'english' ? 'Current market data' : 'Dữ liệu thị trường hiện tại'
          }
        ],
        trustIndicators: [
          {"number": "1,000+", "label": businessInfo.language === 'english' ? 'Downloads' : 'Lượt tải'},
          {"number": "90%", "label": businessInfo.language === 'english' ? 'Success Rate' : 'Tỷ lệ thành công'},
          {"number": "4.8/5", "label": businessInfo.language === 'english' ? 'User Rating' : 'Đánh giá người dùng'}
        ]
      },
      testimonials: {
        title: businessInfo.language === 'english' ? 'What Our Customers Say' : 'Khách Hàng Nói Gì Về Chúng Tôi',
        subtitle: businessInfo.language === 'english' ? 'Customer testimonials' : 'Lời chứng thực từ khách hàng',
        backgroundColor: "#F5F5DC",
        textColor: "#2D3748",
        testimonials: [
          {
            "id": "1",
            "name": "Customer A",
            "title": "Client",
            "company": "Company A",
            "content": businessInfo.language === 'english' ? 'Great service and quality' : 'Dịch vụ và chất lượng tuyệt vời',
            "rating": 5,
            "image": "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face"
          }
        ]
      },
      footer: {
        companyName: businessInfo.companyName,
        description: businessInfo.language === 'english' ? 'Professional services' : 'Dịch vụ chuyên nghiệp',
        backgroundColor: "#343a40",
        textColor: "#FFFFFF",
        contact: {
          phone: "+84 123 456 789",
          email: "info@company.com",
          address: businessInfo.language === 'english' ? '123 Main Street, City' : '123 Đường Chính, Thành phố',
          businessHours: businessInfo.language === 'english' ? 'Mon-Fri: 9AM-6PM' : 'Thứ 2-Thứ 6: 9AM-6PM'
        }
      }
    }
  }
}

export async function generateThemeContent(businessInfo: BusinessInfo) {
  // Create optimized prompt for content and color generation
  const prompt = `Bạn là một chuyên gia thiết kế website và branding. Hãy tạo nội dung và màu sắc cho website doanh nghiệp dựa trên thông tin sau:

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
      ],
      "socialLinks": [
        {"platform": "facebook", "url": "https://facebook.com", "icon": "Facebook"},
        {"platform": "linkedin", "url": "https://linkedin.com", "icon": "Linkedin"},
        {"platform": "twitter", "url": "https://twitter.com", "icon": "Twitter"}
      ],
      "ctaButton": {
        "text": "${businessInfo.language === 'english' ? 'Get Quote' : 'Nhận báo giá'}",
        "href": "#contact",
        "style": "primary"
      }
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
        {"icon": "Award", "title": "${businessInfo.language === 'english' ? 'Certification' : 'Chứng nhận'}", "description": "${businessInfo.language === 'english' ? 'Certification description' : 'Mô tả chứng nhận'}"},
        {"icon": "Globe", "title": "${businessInfo.language === 'english' ? 'Market' : 'Thị trường'}", "description": "${businessInfo.language === 'english' ? 'Market description' : 'Mô tả thị trường'}"},
        {"icon": "Users", "title": "${businessInfo.language === 'english' ? 'Team' : 'Đội ngũ'}", "description": "${businessInfo.language === 'english' ? 'Team description' : 'Mô tả đội ngũ'}"}
      ]
    },
    "products": {
      "title": "${businessInfo.language === 'english' ? 'Our Products/Services' : 'Sản Phẩm/Dịch Vụ Của Chúng Tôi'}",
      "description": "${businessInfo.language === 'english' ? 'Introduction to main products/services' : 'Giới thiệu về các sản phẩm/dịch vụ chính'}",
      "backgroundColor": "#F0F4F8",
      "textColor": "#2D3748",
      "items": [
        {
          "id": "1",
          "name": "${businessInfo.language === 'english' ? 'Product/Service 1' : 'Sản phẩm/Dịch vụ 1'}",
          "description": "${businessInfo.language === 'english' ? 'Detailed description of product/service 1' : 'Mô tả chi tiết sản phẩm/dịch vụ 1'}",
          "price": "${businessInfo.language === 'english' ? 'Price/Contact' : 'Giá/Liên hệ'}",
          "category": "${businessInfo.language === 'english' ? 'Category 1' : 'Danh mục 1'}",
          "image": "/assets/product-1.jpg",
          "features": ["${businessInfo.language === 'english' ? 'Feature 1' : 'Tính năng 1'}", "${businessInfo.language === 'english' ? 'Feature 2' : 'Tính năng 2'}", "${businessInfo.language === 'english' ? 'Feature 3' : 'Tính năng 3'}"]
        },
        {
          "id": "2", 
          "name": "${businessInfo.language === 'english' ? 'Product/Service 2' : 'Sản phẩm/Dịch vụ 2'}",
          "description": "${businessInfo.language === 'english' ? 'Detailed description of product/service 2' : 'Mô tả chi tiết sản phẩm/dịch vụ 2'}",
          "price": "${businessInfo.language === 'english' ? 'Price/Contact' : 'Giá/Liên hệ'}", 
          "category": "${businessInfo.language === 'english' ? 'Category 2' : 'Danh mục 2'}",
          "image": "/assets/product-2.jpg",
          "features": ["${businessInfo.language === 'english' ? 'Feature 1' : 'Tính năng 1'}", "${businessInfo.language === 'english' ? 'Feature 2' : 'Tính năng 2'}", "${businessInfo.language === 'english' ? 'Feature 3' : 'Tính năng 3'}"]
        },
        {
          "id": "3",
          "name": "${businessInfo.language === 'english' ? 'Product/Service 3' : 'Sản phẩm/Dịch vụ 3'}",
          "description": "${businessInfo.language === 'english' ? 'Detailed description of product/service 3' : 'Mô tả chi tiết sản phẩm/dịch vụ 3'}",
          "price": "${businessInfo.language === 'english' ? 'Price/Contact' : 'Giá/Liên hệ'}",
          "category": "${businessInfo.language === 'english' ? 'Category 3' : 'Danh mục 3'}",
          "image": "/assets/product-3.jpg",
          "features": ["${businessInfo.language === 'english' ? 'Feature 1' : 'Tính năng 1'}", "${businessInfo.language === 'english' ? 'Feature 2' : 'Tính năng 2'}", "${businessInfo.language === 'english' ? 'Feature 3' : 'Tính năng 3'}"]
        }
      ],
      "services": [
        {"id": "1", "name": "${businessInfo.language === 'english' ? 'Service 1' : 'Dịch vụ 1'}", "description": "${businessInfo.language === 'english' ? 'Service description 1' : 'Mô tả dịch vụ 1'}", "icon": "Package", "cta": "${businessInfo.language === 'english' ? 'Learn More' : 'Tìm hiểu thêm'}"},
        {"id": "2", "name": "${businessInfo.language === 'english' ? 'Service 2' : 'Dịch vụ 2'}", "description": "${businessInfo.language === 'english' ? 'Service description 2' : 'Mô tả dịch vụ 2'}", "icon": "Truck", "cta": "${businessInfo.language === 'english' ? 'Learn More' : 'Tìm hiểu thêm'}"},
        {"id": "3", "name": "${businessInfo.language === 'english' ? 'Service 3' : 'Dịch vụ 3'}", "description": "${businessInfo.language === 'english' ? 'Service description 3' : 'Mô tả dịch vụ 3'}", "icon": "FileText", "cta": "${businessInfo.language === 'english' ? 'Learn More' : 'Tìm hiểu thêm'}"},
        {"id": "4", "name": "${businessInfo.language === 'english' ? 'Service 4' : 'Dịch vụ 4'}", "description": "${businessInfo.language === 'english' ? 'Service description 4' : 'Mô tả dịch vụ 4'}", "icon": "Users", "cta": "${businessInfo.language === 'english' ? 'Learn More' : 'Tìm hiểu thêm'}"},
        {"id": "5", "name": "${businessInfo.language === 'english' ? 'Service 5' : 'Dịch vụ 5'}", "description": "${businessInfo.language === 'english' ? 'Service description 5' : 'Mô tả dịch vụ 5'}", "icon": "Shield", "cta": "${businessInfo.language === 'english' ? 'Learn More' : 'Tìm hiểu thêm'}"},
        {"id": "6", "name": "${businessInfo.language === 'english' ? 'Service 6' : 'Dịch vụ 6'}", "description": "${businessInfo.language === 'english' ? 'Service description 6' : 'Mô tả dịch vụ 6'}", "icon": "TrendingUp", "cta": "${businessInfo.language === 'english' ? 'Learn More' : 'Tìm hiểu thêm'}"}
      ]
    },
    "whyChooseUs": {
      "title": "${businessInfo.language === 'english' ? 'Why Choose ' + businessInfo.companyName + '?' : 'Tại Sao Chọn ' + businessInfo.companyName + '?'}",
      "subtitle": "${businessInfo.language === 'english' ? 'We combine experience with modern technology to deliver superior value' : 'Chúng tôi kết hợp kinh nghiệm với công nghệ hiện đại để mang lại giá trị vượt trội'}",
      "backgroundColor": "#FFFFFF",
      "textColor": "#2D3748",
      "strengths": [
        {"icon": "Award", "title": "${businessInfo.language === 'english' ? 'International Certification' : 'Chứng nhận quốc tế'}", "description": "FDA, USDA, ISO"},
        {"icon": "Globe", "title": "${businessInfo.language === 'english' ? 'Global Market' : 'Thị trường toàn cầu'}", "description": "${businessInfo.language === 'english' ? 'Export to 25+ countries' : 'Xuất khẩu đến 25+ quốc gia'}"},
        {"icon": "Users", "title": "${businessInfo.language === 'english' ? 'Expert Team' : 'Đội ngũ chuyên gia'}", "description": "${businessInfo.language === 'english' ? '20+ years experience' : '20+ năm kinh nghiệm'}"},
        {"icon": "Shield", "title": "${businessInfo.language === 'english' ? 'Quality Assurance' : 'Chất lượng đảm bảo'}", "description": "${businessInfo.language === 'english' ? 'Strict quality control system' : 'Hệ thống kiểm soát nghiêm ngặt'}"},
        {"icon": "Clock", "title": "${businessInfo.language === 'english' ? 'On-time Delivery' : 'Giao hàng đúng hạn'}", "description": "${businessInfo.language === 'english' ? 'Time commitment' : 'Cam kết thời gian'}"},
        {"icon": "TrendingUp", "title": "${businessInfo.language === 'english' ? 'Sustainable Growth' : 'Tăng trưởng bền vững'}", "description": "${businessInfo.language === 'english' ? 'Develop with partners' : 'Phát triển cùng đối tác'}"}
      ],
      "mission": {
        "title": "${businessInfo.language === 'english' ? 'Mission' : 'Sứ mệnh'}",
        "description": "${businessInfo.language === 'english' ? 'Bring ' + businessInfo.industry + ' value to the world, creating sustainable value for partners.' : 'Mang giá trị ' + businessInfo.industry + ' đến thế giới, tạo giá trị bền vững cho đối tác.'}"
      },
      "vision": {
        "title": "${businessInfo.language === 'english' ? 'Vision' : 'Tầm nhìn'}",
        "description": "${businessInfo.language === 'english' ? 'Become the leading partner in ' + businessInfo.industry + ', trusted by international markets.' : 'Trở thành đối tác hàng đầu trong lĩnh vực ' + businessInfo.industry + ', được tin tưởng bởi thị trường quốc tế.'}"
      },
      "cta": {
        "title": "${businessInfo.language === 'english' ? 'Start collaborating today' : 'Bắt đầu hợp tác ngay hôm nay'}",
        "description": "${businessInfo.language === 'english' ? 'Contact us for free consultation.' : 'Liên hệ với chúng tôi để được tư vấn miễn phí.'}",
        "buttonText": "${businessInfo.language === 'english' ? 'Contact Now' : 'Liên hệ ngay'}"
      }
    },
    "problems": {
      "title": "${businessInfo.language === 'english' ? 'Current Challenges' : 'Thách Thức Hiện Tại'}",
      "description": "${businessInfo.language === 'english' ? 'Common problems customers face in ' + businessInfo.industry : 'Những vấn đề khách hàng thường gặp phải trong ngành ' + businessInfo.industry}",
      "backgroundColor": "#FFF8DC",
      "textColor": "#2D3748",
      "items": [
        {
          "id": "1",
          "title": "${businessInfo.language === 'english' ? 'Problem 1' : 'Vấn đề 1'}",
          "description": "${businessInfo.language === 'english' ? 'Detailed description of problem 1' : 'Mô tả chi tiết vấn đề 1'}",
          "icon": "AlertTriangle"
        },
        {
          "id": "2", 
          "title": "${businessInfo.language === 'english' ? 'Problem 2' : 'Vấn đề 2'}",
          "description": "${businessInfo.language === 'english' ? 'Detailed description of problem 2' : 'Mô tả chi tiết vấn đề 2'}",
          "icon": "Clock"
        },
        {
          "id": "3",
          "title": "${businessInfo.language === 'english' ? 'Problem 3' : 'Vấn đề 3'}", 
          "description": "${businessInfo.language === 'english' ? 'Detailed description of problem 3' : 'Mô tả chi tiết vấn đề 3'}",
          "icon": "DollarSign"
        },
        {
          "id": "4",
          "title": "${businessInfo.language === 'english' ? 'Problem 4' : 'Vấn đề 4'}",
          "description": "${businessInfo.language === 'english' ? 'Detailed description of problem 4' : 'Mô tả chi tiết vấn đề 4'}",
          "icon": "Truck"
        }
      ]
    },
    "solutions": {
      "title": "${businessInfo.language === 'english' ? 'Our Solutions' : 'Giải Pháp Của Chúng Tôi'}",
      "description": "${businessInfo.language === 'english' ? 'How we solve these problems' : 'Cách chúng tôi giải quyết những vấn đề này'}",
      "backgroundColor": "#F0F8FF",
      "textColor": "#2D3748",
      "items": [
        {
          "id": "1",
          "title": "${businessInfo.language === 'english' ? 'Solution 1' : 'Giải pháp 1'}",
          "description": "${businessInfo.language === 'english' ? 'Detailed description of solution 1' : 'Mô tả chi tiết giải pháp 1'}",
          "benefit": "${businessInfo.language === 'english' ? 'Specific benefit' : 'Lợi ích cụ thể'}",
          "icon": "Globe"
        },
        {
          "id": "2",
          "title": "${businessInfo.language === 'english' ? 'Solution 2' : 'Giải pháp 2'}", 
          "description": "${businessInfo.language === 'english' ? 'Detailed description of solution 2' : 'Mô tả chi tiết giải pháp 2'}",
          "benefit": "${businessInfo.language === 'english' ? 'Specific benefit' : 'Lợi ích cụ thể'}",
          "icon": "Shield"
        },
        {
          "id": "3",
          "title": "${businessInfo.language === 'english' ? 'Solution 3' : 'Giải pháp 3'}",
          "description": "${businessInfo.language === 'english' ? 'Detailed description of solution 3' : 'Mô tả chi tiết giải pháp 3'}", 
          "benefit": "${businessInfo.language === 'english' ? 'Specific benefit' : 'Lợi ích cụ thể'}",
          "icon": "Zap"
        },
        {
          "id": "4",
          "title": "${businessInfo.language === 'english' ? 'Solution 4' : 'Giải pháp 4'}",
          "description": "${businessInfo.language === 'english' ? 'Detailed description of solution 4' : 'Mô tả chi tiết giải pháp 4'}",
          "benefit": "${businessInfo.language === 'english' ? 'Specific benefit' : 'Lợi ích cụ thể'}",
          "icon": "Package"
        }
      ]
    },
    "cta": {
      "title": "${businessInfo.language === 'english' ? 'Ready to Get Started?' : 'Sẵn sàng bắt đầu?'}",
      "description": "${businessInfo.language === 'english' ? 'Final call to action at the bottom of the page' : 'Lời kêu gọi hành động cuối trang'}",
      "buttonText": "${businessInfo.language === 'english' ? 'Contact Now' : 'Liên hệ ngay'}",
      "buttonSecondaryText": "${businessInfo.language === 'english' ? 'Download Sample Document' : 'Tải tài liệu mẫu'}",
      "backgroundColor": "#8B4513",
      "textColor": "#FFFFFF",
      "image": "/assets/cta-image.jpg"
    },
    "leadMagnet": {
      "title": "${businessInfo.language === 'english' ? 'Unlock Success' : 'Mở Khóa Thành Công'}",
      "description": "${businessInfo.language === 'english' ? 'Download comprehensive guide for ' + businessInfo.industry : 'Tải về hướng dẫn toàn diện cho ' + businessInfo.industry}",
      "backgroundColor": "#F8F9FA",
      "textColor": "#2D3748",
      "guideTitle": "${businessInfo.language === 'english' ? 'Complete Guide' : 'Hướng dẫn đầy đủ'}",
      "guideSubtitle": "${businessInfo.language === 'english' ? '2025 Edition - 45 pages' : 'Phiên bản 2025 - 45 trang'}",
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
    "testimonials": {
      "title": "${businessInfo.language === 'english' ? 'What Our Customers Say' : 'Khách Hàng Nói Gì Về Chúng Tôi'}",
      "subtitle": "${businessInfo.language === 'english' ? 'Testimonials from international partners and customers' : 'Lời chứng thực từ các đối tác và khách hàng quốc tế'}",
      "backgroundColor": "#F5F5DC",
      "textColor": "#2D3748",
      "testimonials": [
        {
          "id": "1",
          "name": "Sarah Johnson",
          "title": "Manager",
          "company": "Company A",
          "content": "${businessInfo.language === 'english' ? 'Product quality exceeds expectations. Very professional work process.' : 'Chất lượng sản phẩm vượt trội hơn mong đợi. Quy trình làm việc rất chuyên nghiệp.'}",
          "rating": 5,
          "image": "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face"
        },
        {
          "id": "2",
          "name": "Michael Chen",
          "title": "Director",
          "company": "Company B",
          "content": "${businessInfo.language === 'english' ? 'Trusted partner with high quality commitment. On-time delivery and excellent service.' : 'Đối tác tin cậy với cam kết chất lượng cao. Giao hàng đúng hạn và dịch vụ xuất sắc.'}",
          "rating": 5,
          "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
        },
        {
          "id": "3",
          "name": "David Rodriguez",
          "title": "CEO",
          "company": "Company C",
          "content": "${businessInfo.language === 'english' ? 'Unique quality products, perfectly suited for our needs.' : 'Sản phẩm có chất lượng độc đáo, phù hợp hoàn hảo cho nhu cầu của chúng tôi.'}",
          "rating": 5,
          "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
        }
      ],
      "partners": [
        "${businessInfo.language === 'english' ? 'Partner A' : 'Đối tác A'}", 
        "${businessInfo.language === 'english' ? 'Partner B' : 'Đối tác B'}", 
        "${businessInfo.language === 'english' ? 'Partner C' : 'Đối tác C'}", 
        "${businessInfo.language === 'english' ? 'Partner D' : 'Đối tác D'}", 
        "${businessInfo.language === 'english' ? 'Partner E' : 'Đối tác E'}", 
        "${businessInfo.language === 'english' ? 'Partner F' : 'Đối tác F'}"
      ],
      "stats": [
        {"number": "500+", "label": "${businessInfo.language === 'english' ? 'Shipments' : 'Lô hàng'}", "sublabel": "${businessInfo.language === 'english' ? 'High Quality' : 'Chất lượng cao'}"},
        {"number": "200+", "label": "${businessInfo.language === 'english' ? 'Customers' : 'Khách hàng'}", "sublabel": "${businessInfo.language === 'english' ? 'Trusted' : 'Tin tưởng'}"},
        {"number": "15+", "label": "${businessInfo.language === 'english' ? 'Years Experience' : 'Năm kinh nghiệm'}", "sublabel": "${businessInfo.language === 'english' ? 'Market' : 'Thị trường'}"},
        {"number": "98%", "label": "${businessInfo.language === 'english' ? 'Satisfaction Rate' : 'Tỷ lệ hài lòng'}", "sublabel": "${businessInfo.language === 'english' ? 'Customers' : 'Khách hàng'}"}
      ]
    },
    "footer": {
      "companyName": "${businessInfo.companyName}",
      "description": "${businessInfo.language === 'english' ? 'Specialized in providing high-quality ' + businessInfo.industry + ' for international market' : 'Chuyên cung cấp ' + businessInfo.industry + ' chất lượng cao cho thị trường quốc tế'}",
      "backgroundColor": "#D2691E",
      "textColor": "#F9FAFB",
      "quickLinks": [
        {"name": "${businessInfo.language === 'english' ? 'About Us' : 'Về chúng tôi'}", "href": "#about"},
        {"name": "${businessInfo.language === 'english' ? 'Products' : 'Sản phẩm'}", "href": "#products"},
        {"name": "${businessInfo.language === 'english' ? 'Services' : 'Dịch vụ'}", "href": "#services"},
        {"name": "${businessInfo.language === 'english' ? 'Contact' : 'Liên hệ'}", "href": "#contact"}
      ],
      "resources": [
        {"name": "${businessInfo.language === 'english' ? 'Documentation' : 'Tài liệu'}", "href": "#docs"},
        {"name": "${businessInfo.language === 'english' ? 'Support' : 'Hỗ trợ'}", "href": "#support"},
        {"name": "${businessInfo.language === 'english' ? 'FAQ' : 'Câu hỏi thường gặp'}", "href": "#faq"}
      ],
      "legal": [
        {"name": "${businessInfo.language === 'english' ? 'Privacy Policy' : 'Chính Sách Bảo Mật'}", "href": "#privacy"},
        {"name": "${businessInfo.language === 'english' ? 'Terms of Service' : 'Điều Khoản Dịch Vụ'}", "href": "#terms"},
        {"name": "${businessInfo.language === 'english' ? 'Cookie Policy' : 'Chính Sách Cookie'}", "href": "#cookies"},
        {"name": "${businessInfo.language === 'english' ? 'Compliance' : 'Tuân Thủ'}", "href": "#compliance"}
      ],
      "socialLinks": [
        {"icon": "Facebook", "href": "#", "label": "Facebook"},
        {"icon": "Twitter", "href": "#", "label": "Twitter"},
        {"icon": "Linkedin", "href": "#", "label": "LinkedIn"},
        {"icon": "Youtube", "href": "#", "label": "YouTube"}
      ],
      "newsletter": {
        "title": "${businessInfo.language === 'english' ? 'Subscribe to Newsletter' : 'Đăng ký nhận tin'}", 
        "description": "${businessInfo.language === 'english' ? 'Get latest updates' : 'Nhận cập nhật mới nhất'}",
        "placeholder": "${businessInfo.language === 'english' ? 'Enter your email' : 'Nhập email của bạn'}",
        "buttonText": "${businessInfo.language === 'english' ? 'Subscribe' : 'Đăng ký'}"
      },
      "contact": {
        "phone": "+84 123 456 789",
        "email": "info@company.com",
        "address": "${businessInfo.language === 'english' ? '123 ABC Street, District 1, Ho Chi Minh City' : '123 Đường ABC, Quận 1, TP.HCM'}",
        "businessHours": "${businessInfo.language === 'english' ? 'Mon-Fri: 8AM-6PM (EST)' : 'Thứ 2-Thứ 6: 8AM-6PM (EST)'}"
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
- Tất cả các section đều có nội dung đầy đủ và phù hợp`

  const aiResult = await executeAIRequestWithRetry(prompt)
  
  if (!aiResult.success) {
    // Handle specific error types with better messaging
    if (aiResult.error === 'QUOTA_EXCEEDED') {
      console.log('🚨 All API keys have exceeded quota limits!')
      console.log('💡 Consider adding more API keys or waiting for quota reset')
      throw new Error('Tất cả API keys đều đã hết quota. Vui lòng thêm API keys mới hoặc chờ quota reset.')
    } else if (aiResult.error === 'AI_SERVICE_UNAVAILABLE') {
      console.log('🚨 AI service is currently unavailable')
      throw new Error('Dịch vụ AI hiện tại không khả dụng. Vui lòng thử lại sau.')
    } else {
      throw new Error(`AI generation failed: ${aiResult.error}`)
    }
  }

  // Parse the generated data with robust error handling
  let generatedData: any
  try {
    // Remove any markdown formatting and extra whitespace
    const cleanedText = (aiResult.text || '').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    generatedData = JSON.parse(cleanedText)
    console.log("✅ Parsed generated data successfully")
  } catch (parseError) {
    console.error('❌ JSON parsing error:', parseError)
    console.error('Raw response length:', (aiResult.text || '').length)
    console.error('Raw response preview (first 500 chars):', (aiResult.text || '').substring(0, 500))
    console.error('Raw response preview (last 500 chars):', (aiResult.text || '').substring(Math.max(0, (aiResult.text || '').length - 500)))
    
    // Enhanced fallback: try multiple strategies to extract valid JSON
    const responseText = aiResult.text || ''
    
    // Strategy 1: Try to find complete JSON object
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      console.log("🔍 Strategy 1: Found JSON object, attempting to parse...")
      try {
        generatedData = JSON.parse(jsonMatch[0])
        console.log("✅ Parsed JSON using regex extraction")
      } catch {
        // Strategy 2: Try to fix incomplete JSON by adding missing closing braces
        console.log("🔍 Strategy 2: Attempting to fix incomplete JSON...")
        try {
          let fixedJson = jsonMatch[0]
          
          // Count opening and closing braces
          const openBraces = (fixedJson.match(/\{/g) || []).length
          const closeBraces = (fixedJson.match(/\}/g) || []).length
          const missingBraces = openBraces - closeBraces
          
          if (missingBraces > 0) {
            // Add missing closing braces
            fixedJson += '}'.repeat(missingBraces)
            console.log(`🔧 Fixed JSON by adding ${missingBraces} missing closing braces`)
          }
          
          generatedData = JSON.parse(fixedJson)
          console.log("✅ Parsed JSON after fixing missing braces")
        } catch {
          // Strategy 3: Try to fix incomplete strings and arrays
          console.log("🔍 Strategy 3: Attempting to fix strings and arrays...")
          try {
            let fixedJson = jsonMatch[0]
            
            // Fix unterminated strings by adding closing quotes
            const stringMatches = fixedJson.match(/"[^"]*$/g)
            if (stringMatches) {
              fixedJson = fixedJson.replace(/"[^"]*$/g, (match) => match + '"')
              console.log("🔧 Fixed unterminated string")
            }
            
            // Fix unterminated arrays by adding closing brackets
            const openBrackets = (fixedJson.match(/\[/g) || []).length
            const closeBrackets = (fixedJson.match(/\]/g) || []).length
            const missingBrackets = openBrackets - closeBrackets
            
            if (missingBrackets > 0) {
              fixedJson += ']'.repeat(missingBrackets)
              console.log(`🔧 Fixed JSON by adding ${missingBrackets} missing closing brackets`)
            }
            
            // Re-count braces after fixing strings and arrays
            const finalOpenBraces = (fixedJson.match(/\{/g) || []).length
            const finalCloseBraces = (fixedJson.match(/\}/g) || []).length
            const finalMissingBraces = finalOpenBraces - finalCloseBraces
            
            if (finalMissingBraces > 0) {
              fixedJson += '}'.repeat(finalMissingBraces)
              console.log(`🔧 Fixed JSON by adding ${finalMissingBraces} additional missing closing braces`)
            }
            
            generatedData = JSON.parse(fixedJson)
            console.log("✅ Parsed JSON after comprehensive fixing")
          } catch {
            // Strategy 4: Try to extract partial data and create fallback
            console.log("🔍 Strategy 4: Attempting to extract partial data...")
            try {
              console.log("🔧 Attempting to extract partial data from incomplete JSON")
              const partialData = extractPartialDataFromIncompleteJson(jsonMatch[0])
              if (partialData) {
                generatedData = partialData
                console.log("✅ Successfully extracted partial data")
              } else {
                throw new Error("Could not extract partial data")
              }
            } catch {
              // Strategy 5: Create fallback data structure
              console.log("🔍 Strategy 5: Creating fallback data structure")
              console.log("⚠️ Creating fallback data structure")
              generatedData = createFallbackThemeData(businessInfo)
            }
          }
        }
      }
    } else {
      // Strategy 6: Create fallback data structure
      console.log("🔍 Strategy 6: No JSON found, creating fallback data structure")
      console.log("⚠️ No JSON found, creating fallback data structure")
      generatedData = createFallbackThemeData(businessInfo)
    }
  }

  return {
    generatedData,
    rawText: aiResult.text,
    responseTime: aiResult.responseTime
  } as {
    generatedData: ThemeData
    rawText: string
    responseTime: number
  }
}

export function prepareThemeParams(generatedData: ThemeData, currentTheme: any) {
  return {
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
}
