'use client'

import React from 'react'
import { ThemeParams } from '@/types'
import Header from './vietnam-coffee/Header'
import HeroSection from './vietnam-coffee/HeroSection'
import ProblemSolution from './vietnam-coffee/ProblemSolution'
import LeadMagnetSection from './vietnam-coffee/LeadMagnetSection'
import WhyChooseUsSection from './vietnam-coffee/WhyChooseUsSection'
import ProductsServices from './vietnam-coffee/ProductsServices'
import Testimonials from './vietnam-coffee/Testimonials'
import Footer from './vietnam-coffee/Footer'

// Import HeroContent type
interface HeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  image?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  colorMode?: 'theme' | 'custom';
  overlayColor?: string;
  overlayOpacity?: number;
  unsplashImageUrl?: string;
  titleSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  subtitleSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  descriptionSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
}

interface VietnamCoffeeThemeProps {
  theme: ThemeParams
  content?: Record<string, unknown>
  onContentUpdate?: (content: Record<string, unknown>) => void // Add callback for content updates
}

export default function VietnamCoffeeTheme({ theme, content, onContentUpdate }: VietnamCoffeeThemeProps) {
  // Load content from vietnam-coffee-project-2025-07-19.json structure
  const defaultContent = {
    header: {
      title: "Cà Phê Việt + Plus",
      subtitle: "Premium Export Coffee",
      backgroundColor: "#D2691E",
      textColor: "#2D3748"
    },
    about: {
      title: "Giải Quyết Thách Thức Xuất Nhập Khẩu Thực Tế",
      description: "Chúng tôi hiểu rõ những khó khăn khi xuất khẩu cà phê từ Việt Nam. Đây là cách chúng tôi giải quyết chúng cho bạn.",
      textColor: "#2D3748",
      backgroundColor: "#FFFFFF"
    },
    hero: {
      title: "Cà Phê Việt Nam - Chất Lượng Quốc Tế",
      subtitle: "Xuất khẩu cà phê chất lượng cao",
      description: "Chúng tôi chuyên cung cấp các loại cà phê Việt Nam chất lượng cao cho thị trường quốc tế, đảm bảo hương vị đặc trưng và tiêu chuẩn xuất khẩu.",
      ctaText: "Tìm hiểu thêm",
      image: "/assets/hero-coffee.jpg",
      backgroundImage: "/assets/hero-coffee.jpg",
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
    leadMagnet: {
      title: "Mở khóa thành công xuất nhập khẩu",
      description: "Tải về hướng dẫn toàn diện 'Cẩm nang xuất khẩu cà phê Việt Nam 2025' - tất cả những gì bạn cần biết về xuất khẩu cà phê thành công vào thị trường Mỹ.",
      backgroundColor: "#F8F9FA",
      textColor: "#2D3748",
      guideTitle: "Hướng dẫn xuất khẩu đầy đủ",
      guideSubtitle: "Phiên bản 2025 - 45 trang",
      formTitle: "Tải về hướng dẫn miễn phí",
      formDescription: "Nhập thông tin bên dưới để có quyền truy cập ngay lập tức vào tài nguyên quý giá này.",
      buttonText: "Tải về hướng dẫn miễn phí ngay",
      features: [
        {
          icon: "FileText",
          title: "Danh sách tài liệu đầy đủ",
          description: "Mọi biểu mẫu, chứng nhận và tài liệu cần thiết cho tuân thủ FDA"
        },
        {
          icon: "TrendingUp",
          title: "Phân tích thị trường & Xu hướng giá",
          description: "Dữ liệu thị trường cà phê Mỹ hiện tại và thông tin giá cả 2025"
        },
        {
          icon: "Shield",
          title: "Tiêu chuẩn chất lượng & Kiểm tra",
          description: "Yêu cầu chi tiết cho tiêu chuẩn chất lượng nhập khẩu Mỹ"
        },
        {
          icon: "CheckCircle",
          title: "Quy trình nhập khẩu từng bước",
          description: "Lịch trình rõ ràng từ đặt hàng đến giao hàng tại kho"
        }
      ],
      trustIndicators: [
        { number: "5,000+", label: "Lượt tải" },
        { number: "92%", label: "Tỷ lệ thành công" },
        { number: "4.9/5", label: "Đánh giá người dùng" }
      ]
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
    whyChooseUs: {
      title: "Tại Sao Chọn VietCoffee Export?",
      subtitle: "Chúng tôi kết hợp di sản nông nghiệp Việt Nam với chuyên môn xuất khẩu hiện đại để mang lại giá trị vượt trội cho đối tác Mỹ.",
      backgroundColor: "#FFFFFF",
      textColor: "#2D3748"
    },
    testimonials: {
      title: "Khách Hàng Nói Gì Về Chúng Tôi",
      subtitle: "Lời chứng thực từ các đối tác và khách hàng quốc tế",
      backgroundColor: "#F5F5DC",
      textColor: "#2D3748",
      testimonials: [
        {
          id: "1",
          name: "Sarah Johnson",
          title: "Coffee Buyer",
          company: "Starbucks Reserve",
          content: "Chất lượng cà phê Việt Nam vượt trội hơn mong đợi. Hương vị đậm đà và quy trình sản xuất rất chuyên nghiệp.",
          rating: 5,
          image: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face"
        },
        {
          id: "2",
          name: "Michael Chen",
          title: "Quality Manager",
          company: "Blue Bottle Coffee",
          content: "Đối tác tin cậy với cam kết chất lượng cao. Giao hàng đúng hạn và dịch vụ khách hàng xuất sắc.",
          rating: 5,
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
        },
        {
          id: "3",
          name: "David Rodriguez",
          title: "Import Director",
          company: "Intelligentsia",
          content: "Cà phê Robusta Việt Nam có hương vị độc đáo, phù hợp hoàn hảo cho blend espresso của chúng tôi.",
          rating: 5,
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
        }
      ],
      partners: [
        "Starbucks Reserve",
        "Blue Bottle Coffee",
        "Intelligentsia",
        "Counter Culture",
        "Stumptown Coffee",
        "La Colombe"
      ],
      stats: [
        { number: "500+", label: "Lô hàng xuất khẩu", sublabel: "Cà phê chất lượng cao" },
        { number: "200+", label: "Khách hàng tin tưởng", sublabel: "Từ 25 tiểu bang Mỹ" },
        { number: "15+", label: "Năm kinh nghiệm", sublabel: "Thị trường quốc tế" },
        { number: "98%", label: "Tỷ lệ hài lòng", sublabel: "Khách hàng đánh giá" }
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

  // Ensure header content is properly merged
  if (theme.content?.header) {
    finalContent.header = {
      ...defaultContent.header,
      ...theme.content.header
    }
  }

  // Ensure problems content is properly merged
  if (theme.content?.problems) {
    finalContent.problems = {
      ...defaultContent.problems,
      ...theme.content.problems
    }
  }

  // Ensure solutions content is properly merged
  if (theme.content?.solutions) {
    finalContent.solutions = {
      ...defaultContent.solutions,
      ...theme.content.solutions
    }
  }

  // Ensure about content is properly merged
  if (theme.content?.about) {
    finalContent.about = {
      ...defaultContent.about,
      ...theme.content.about
    }
  }

  // Ensure cta content is properly merged (fallback for backward compatibility)
  if (theme.content?.cta) {
    finalContent.cta = {
      ...defaultContent.cta,
      ...theme.content.cta
    }
  }

  // Ensure problems.items and solutions.items are always arrays
  if (finalContent.problems && !Array.isArray(finalContent.problems.items)) {
    finalContent.problems.items = defaultContent.problems.items
  }
  
  if (finalContent.solutions && !Array.isArray(finalContent.solutions.items)) {
    finalContent.solutions.items = defaultContent.solutions.items
  }

  // Handle hero content update
  const handleHeroContentUpdate = (updatedHeroContent: HeroContent) => {
    if (onContentUpdate) {
      const updatedContent = {
        ...finalContent,
        hero: updatedHeroContent
      };
      onContentUpdate(updatedContent);
    }
  };


  // Get typography styles
  const getTypographyStyles = () => {
    return {
      fontFamily: theme.typography?.fontFamily || 'Inter',
      fontSize: theme.typography?.fontSize || '16px',
      lineHeight: theme.typography?.lineHeight || '1.6',
      fontWeight: theme.typography?.fontWeight || '400',
      color: theme.colors?.text || '#2D3748'
    }
  }

  // Get border radius class
  // const getBorderRadiusClass = () => {
  //   switch (theme.layout?.borderRadius) {
  //     case 'none':
  //       return 'rounded-none'
  //     case 'small':
  //       return 'rounded-sm'
  //     case 'large':
  //       return 'rounded-lg'
  //     case 'medium':
  //     default:
  //       return 'rounded-md'
  //   }
  // }

  return (
    <div 
      className="min-h-screen" 
      style={getTypographyStyles()}
    >
      <Header theme={theme} content={finalContent.header} />
      <HeroSection 
        theme={theme} 
        content={finalContent.hero}
        onContentUpdate={handleHeroContentUpdate}
      />
      <ProblemSolution 
        theme={theme} 
        content={{
          about: finalContent.about,
          problems: finalContent.problems,
          solutions: finalContent.solutions,
          cta: finalContent.cta
        }} 
      />
      <LeadMagnetSection theme={theme} content={finalContent.leadMagnet} />
      <ProductsServices theme={theme} content={finalContent.products} />
      <WhyChooseUsSection theme={theme} content={finalContent.whyChooseUs} />
      <Testimonials theme={theme} content={finalContent.testimonials} />
      <Footer theme={theme} content={finalContent.footer} />
    </div>
  )
} 