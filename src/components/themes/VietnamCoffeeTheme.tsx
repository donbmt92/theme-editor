'use client'

import React from 'react'
import { ThemeParams } from '@/types'
import Header from './vietnam-coffee/Header'
import HeroSection from './vietnam-coffee/HeroSection'
import ProblemSolution from './vietnam-coffee/ProblemSolution'
import ProductsServices from './vietnam-coffee/ProductsServices'
import Footer from './vietnam-coffee/Footer'

interface VietnamCoffeeThemeProps {
  theme: ThemeParams
  content?: Record<string, unknown>
}

export default function VietnamCoffeeTheme({ theme, content }: VietnamCoffeeThemeProps) {
  // Load content from vietnam-coffee-project-2025-07-19.json structure
  const defaultContent = {
    header: {
      title: "Cà Phê Việt + Plus",
      subtitle: "Premium Export Coffee",
      backgroundColor: "#D2691E",
      textColor: "#2D3748"
    },
    hero: {
      title: "Cà Phê Việt Nam - Chất Lượng Quốc Tế",
      subtitle: "Xuất khẩu cà phê chất lượng cao",
      description: "Chúng tôi chuyên cung cấp các loại cà phê Việt Nam chất lượng cao cho thị trường quốc tế, đảm bảo hương vị đặc trưng và tiêu chuẩn xuất khẩu.",
      ctaText: "Tìm hiểu thêm",
      image: "/assets/hero-coffee.jpg",
      backgroundImage: "/assets/hero-coffee.jpg",
      backgroundColor: "#2D3748",
      textColor: "#FFFFFF",
      overlayColor: "rgba(139, 69, 19, 0.7)"
    },
    about: {
      title: "Về Chúng Tôi",
      description: "Với hơn 20 năm kinh nghiệm trong ngành cà phê, chúng tôi tự hào là đối tác tin cậy của các nhà nhập khẩu quốc tế. Chúng tôi cam kết mang đến những hạt cà phê chất lượng nhất từ vùng đất Tây Nguyên."
    },
    problems: {
      title: "Thách Thức Hiện Tại",
      description: "Những khó khăn mà doanh nghiệp Việt Nam gặp phải khi xuất khẩu cà phê",
      backgroundColor: "#FFF8DC",
      textColor: "#2D3748",
      items: [
        {
          id: "1",
          title: "Khó tiếp cận thị trường Mỹ",
          description: "Thiếu kết nối trực tiếp với nhà nhập khẩu và phân phối, rào cản thương mại phức tạp",
          icon: "AlertCircle"
        },
        {
          id: "2",
          title: "Thủ tục phức tạp",
          description: "Quy trình xuất khẩu, chứng nhận chất lượng và kiểm dịch thực vật phức tạp",
          icon: "AlertCircle"
        },
        {
          id: "3",
          title: "Giá cả không cạnh tranh",
          description: "Nhiều khâu trung gian làm tăng chi phí, giảm lợi nhuận của nông dân",
          icon: "AlertCircle"
        }
      ]
    },
    solutions: {
      title: "Giải Pháp Của Chúng Tôi",
      description: "Những giải pháp toàn diện để vượt qua thách thức và phát triển bền vững",
      backgroundColor: "#F0F8FF",
      textColor: "#2D3748",
      items: [
        {
          id: "1",
          title: "Kết nối trực tiếp",
          description: "Mạng lưới đối tác nhập khẩu rộng khắp tại Mỹ, loại bỏ trung gian, tối ưu hóa chuỗi cung ứng",
          benefit: "Tăng lợi nhuận 30-40%",
          icon: "Globe"
        },
        {
          id: "2",
          title: "Hỗ trợ toàn diện",
          description: "Từ chứng nhận chất lượng, kiểm dịch thực vật đến logistics và thủ tục hải quan",
          benefit: "Tiết kiệm 80% thời gian",
          icon: "Shield"
        },
        {
          id: "3",
          title: "Quy trình tối ưu",
          description: "Hệ thống quản lý hiện đại, theo dõi đơn hàng realtime, đảm bảo minh bạch",
          benefit: "Minh bạch 100%",
          icon: "Zap"
        }
      ]
    },
    cta: {
      title: "Sẵn sàng bắt đầu hành trình xuất khẩu?",
      description: "Tư vấn miễn phí về quy trình xuất khẩu cà phê sang Mỹ, đánh giá tiềm năng sản phẩm và lập kế hoạch phát triển thị trường.",
      buttonText: "Đăng ký tư vấn miễn phí",
      backgroundColor: "#8B4513",
      textColor: "#FFFFFF"
    },
    products: {
      title: "Sản Phẩm Của Chúng Tôi",
      description: "Khám phá các loại cà phê đặc trưng của Việt Nam với hương vị độc đáo",
      backgroundColor: "#F0F4F8",
      textColor: "#2D3748",
      items: [
        {
          id: "1",
          name: "Cà Phê Robusta",
          description: "Cà phê Robusta Việt Nam với hương vị đậm đà, hàm lượng caffeine cao, phù hợp cho espresso",
          price: "2.50 USD/kg",
          category: "Robusta"
        },
        {
          id: "2",
          name: "Cà Phê Arabica",
          description: "Cà phê Arabica Tây Nguyên với hương vị tinh tế, chua nhẹ, hương hoa quả đặc trưng",
          price: "4.20 USD/kg",
          category: "Arabica"
        },
        {
          id: "3",
          name: "Cà Phê Chồn",
          description: "Cà phê chồn cao cấp với hương vị độc đáo, được chế biến tự nhiên qua hệ tiêu hóa của chồn",
          price: "150 USD/kg",
          category: "Premium"
        }
      ]
    },
    footer: {
      companyName: "Cà Phê Việt",
      description: "Chuyên cung cấp cà phê chất lượng cao cho thị trường quốc tế với cam kết về chất lượng và bền vững",
      backgroundColor: "#D2691E",
      textColor: "#F9FAFB",
      contact: {
        phone: "+84 123 456 789",
        email: "info@capheviet.com",
        address: "123 Đường ABC, Quận 1, TP.HCM"
      }
    }
  }

  const mergedContent = { ...defaultContent, ...content }
  
  // Merge theme content with default content
  const finalContent = {
    ...mergedContent,
    ...theme.content
  }

  // Ensure problems.items and solutions.items are always arrays
  if (finalContent.problems && !Array.isArray(finalContent.problems.items)) {
    finalContent.problems.items = defaultContent.problems.items
  }
  
  if (finalContent.solutions && !Array.isArray(finalContent.solutions.items)) {
    finalContent.solutions.items = defaultContent.solutions.items
  }

  return (
    <div className="min-h-screen" style={{ 
      fontFamily: theme.typography?.fontFamily || 'Inter',
      color: theme.colors?.text || '#2D3748' 
    }}>
      <Header theme={theme} content={finalContent.header} />
      <HeroSection theme={theme} content={finalContent.hero} />
      <ProblemSolution 
        theme={theme} 
        content={{
          about: finalContent.about,
          problems: finalContent.problems,
          solutions: finalContent.solutions,
          cta: finalContent.cta
        }} 
      />
      <ProductsServices theme={theme} content={finalContent.products} />
      <Footer theme={theme} content={finalContent.footer} />
    </div>
  )
} 