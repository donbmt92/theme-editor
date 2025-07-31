import React from 'react'
import VietnamCoffeeTheme from './components/VietnamCoffeeTheme.tsx'
import './styles/globals.css'

function App() {
  const themeParams = {
  "colors": {
    "primary": "#558B2F",
    "secondary": "#A7D1AB",
    "accent": "#F2E8CF",
    "background": "#FFFFFF",
    "text": "#2D3748"
  },
  "typography": {
    "fontFamily": "Inter",
    "fontSize": "16px",
    "headingSize": "xl",
    "bodySize": "base",
    "lineHeight": "1.6",
    "fontWeight": "400"
  },
  "layout": {
    "containerWidth": "1200px",
    "sectionSpacing": "80px",
    "spacing": "comfortable",
    "borderRadius": "8px"
  },
  "components": {
    "button": {
      "size": "medium",
      "style": "solid",
      "rounded": true
    },
    "card": {
      "border": true,
      "shadow": "medium",
      "padding": "medium"
    },
    "form": {
      "style": "modern",
      "validation": "inline"
    },
    "navigation": {
      "style": "horizontal",
      "sticky": true
    }
  },
  "content": {
    "meta": {
      "title": "Dược Liệu Thiên Nhiên Xanh - Thảo Dược Thiên Nhiên Chất Lượng Cao",
      "description": "Cung cấp dược liệu, thảo dược thiên nhiên đạt chuẩn GACP-WHO, phục vụ chăm sóc sức khỏe và hỗ trợ điều trị bệnh theo y học cổ truyền.",
      "keywords": "dược liệu thiên nhiên, thảo dược, đông y, y học cổ truyền, GACP-WHO, an xoa, đinh lăng, cà gai leo, trà thảo dược, gia công dược liệu, OEM"
    },
    "header": {
      "title": "Dược Liệu Thiên Nhiên Xanh",
      "subtitle": "Sức khỏe từ thiên nhiên, chất lượng đạt chuẩn",
      "logo": "",
      "contactInfo": {
        "email": "info@duoclieuthiennhienxanh.com",
        "phone": "+84 123 456 789"
      }
    },
    "hero": {
      "title": "Khơi Nguồn Sức Khỏe Từ Thiên Nhiên",
      "subtitle": "Dược liệu sạch, chất lượng cao, đạt chuẩn GACP-WHO",
      "description": "Dược Liệu Thiên Nhiên Xanh cam kết mang đến cho bạn những sản phẩm thảo dược thiên nhiên tốt nhất, được thu hái và chế biến theo quy trình nghiêm ngặt, đảm bảo chất lượng và hiệu quả. Chúng tôi kết hợp tinh hoa y học cổ truyền với công nghệ hiện đại để phục vụ sức khỏe cộng đồng.",
      "ctaText": "Khám phá sản phẩm",
      "backgroundImage": "https://images.unsplash.com/photo-1729932989171-c5c1a0bdc86d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODQ5Mjd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTM5MzY0NTB8&ixlib=rb-4.1.0&q=80&w=1080",
      "overlayOpacity": 0.7,
      "overlayColor": "#8B4513",
      "secondaryCtaText": "Liên hệ tư vấn",
      "unsplashImageUrl": "https://images.unsplash.com/photo-1729932989171-c5c1a0bdc86d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODQ5Mjd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTM5MzY0NTB8&ixlib=rb-4.1.0&q=80&w=1080"
    },
    "about": {
      "title": "Về Chúng Tôi",
      "description": "Dược Liệu Thiên Nhiên Xanh là doanh nghiệp tiên phong trong lĩnh vực sản xuất và phân phối dược liệu thiên nhiên đạt chuẩn GACP-WHO. Với sứ mệnh mang đến những sản phẩm chất lượng cao, chúng tôi luôn nỗ lực trong việc lựa chọn nguồn nguyên liệu sạch, áp dụng quy trình chế biến hiện đại và tuân thủ nghiêm ngặt các tiêu chuẩn quốc tế.  Chúng tôi tự hào là cầu nối giữa tinh hoa y học cổ truyền và nhu cầu chăm sóc sức khỏe hiện đại của người Việt.",
      "image": ""
    },
    "problems": {
      "title": "Thách Thức Trong Việc Sử Dụng Dược Liệu",
      "description": "Khách hàng thường gặp khó khăn trong việc tìm kiếm nguồn dược liệu chất lượng, đảm bảo nguồn gốc rõ ràng và quy trình chế biến an toàn.",
      "backgroundColor": "#FFF8DC",
      "textColor": "#2D3748",
      "items": [
        {
          "id": "1",
          "icon": "AlertCircle",
          "title": "Nguồn gốc dược liệu không rõ ràng",
          "description": "Khó khăn trong việc xác định nguồn gốc và chất lượng của dược liệu trên thị trường."
        },
        {
          "id": "2",
          "icon": "AlertCircle",
          "title": "Quy trình chế biến không đạt chuẩn",
          "description": "Dược liệu không được chế biến đúng cách, ảnh hưởng đến chất lượng và hiệu quả sử dụng."
        },
        {
          "id": "3",
          "icon": "AlertCircle",
          "title": "Thiếu thông tin và tư vấn chuyên nghiệp",
          "description": "Khách hàng khó tìm được thông tin chính xác và tư vấn chuyên nghiệp về việc sử dụng dược liệu."
        }
      ]
    },
    "solutions": {
      "title": "Giải Pháp Từ Dược Liệu Thiên Nhiên Xanh",
      "description": "Chúng tôi cam kết cung cấp các giải pháp toàn diện để giải quyết những thách thức trên.",
      "backgroundColor": "#F0F8FF",
      "textColor": "#2D3748",
      "items": [
        {
          "id": "1",
          "icon": "CheckCircle",
          "title": "Dược liệu đạt chuẩn GACP-WHO",
          "benefit": "Đảm bảo chất lượng và hiệu quả",
          "description": "Nguồn gốc rõ ràng, được thu hái và chế biến theo tiêu chuẩn quốc tế."
        },
        {
          "id": "2",
          "icon": "CheckCircle",
          "title": "Quy trình chế biến hiện đại",
          "benefit": "Tăng hiệu quả sử dụng",
          "description": "Áp dụng công nghệ hiện đại, bảo toàn tối đa hoạt chất của dược liệu."
        },
        {
          "id": "3",
          "icon": "CheckCircle",
          "title": "Tư vấn chuyên nghiệp",
          "benefit": "Sử dụng dược liệu hiệu quả và an toàn",
          "description": "Đội ngũ chuyên gia giàu kinh nghiệm sẵn sàng tư vấn và hỗ trợ khách hàng."
        }
      ]
    },
    "cta": {
      "title": "Hãy để Dược Liệu Thiên Nhiên Xanh đồng hành cùng bạn trên con đường chăm sóc sức khỏe!",
      "description": "Liên hệ ngay để được tư vấn và đặt hàng.",
      "buttonText": "Liên hệ ngay",
      "backgroundColor": "#8B4513",
      "textColor": "#FFFFFF"
    },
    "products": {
      "title": "Sản Phẩm & Dịch Vụ",
      "description": "Chúng tôi cung cấp đa dạng sản phẩm và dịch vụ để đáp ứng nhu cầu của khách hàng.",
      "backgroundColor": "#F0F4F8",
      "textColor": "#2D3748",
      "items": [
        {
          "id": "1",
          "name": "Dược liệu thô (An xoa, Đinh lăng, Cà gai leo,...)",
          "price": "Liên hệ",
          "category": "Dược liệu",
          "description": "Dược liệu được thu hái và sơ chế theo tiêu chuẩn GACP-WHO."
        },
        {
          "id": "2",
          "name": "Dược liệu đã sơ chế, phơi sấy",
          "price": "Liên hệ",
          "category": "Dược liệu",
          "description": "Dược liệu được làm sạch, phơi sấy theo quy trình hiện đại, đảm bảo chất lượng."
        },
        {
          "id": "3",
          "name": "Trà thảo dược đóng gói",
          "price": "Liên hệ",
          "category": "Sản phẩm chế biến",
          "description": "Các loại trà thảo dược tiện dụng, mang lại nhiều lợi ích cho sức khỏe."
        },
        {
          "id": "4",
          "name": "Tư vấn bài thuốc cổ truyền",
          "price": "Liên hệ",
          "category": "Dịch vụ",
          "description": "Dịch vụ tư vấn bài thuốc cổ truyền từ các chuyên gia Đông y giàu kinh nghiệm."
        },
        {
          "id": "5",
          "name": "Gia công – bào chế OEM",
          "price": "Liên hệ",
          "category": "Dịch vụ",
          "description": "Dịch vụ gia công và bào chế dược liệu theo đơn đặt hàng."
        }
      ]
    },
    "footer": {
      "companyName": "Dược Liệu Thiên Nhiên Xanh",
      "description": "Cung cấp dược liệu thiên nhiên chất lượng cao, phục vụ sức khỏe cộng đồng.",
      "backgroundColor": "#D2691E",
      "textColor": "#F9FAFB",
      "contact": {
        "phone": "+84 123 456 789",
        "email": "info@duoclieuthiennhienxanh.com",
        "address": "Địa chỉ công ty"
      },
      "newsletter": {
        "title": "Nhận tin tức và ưu đãi mới nhất",
        "description": "Đăng ký nhận bản tin để cập nhật thông tin về sản phẩm, chương trình khuyến mãi và kiến thức về y học cổ truyền."
      }
    }
  }
}
  
  return (
    <div className="App">
      <VietnamCoffeeTheme themeParams={themeParams} />
    </div>
  )
}

export default App