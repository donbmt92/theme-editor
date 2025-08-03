'use client'

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Coffee, Truck, FileCheck, Users, Lightbulb, Shield } from "lucide-react";
import { ThemeParams } from "@/types";
import ProductImage from "./ProductImage";

interface ProductItem {
  id?: string;
  name: string;
  description: string;
  price?: string;
  category?: string;
  image?: string;
}

interface ProductsServicesContent {
  title?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  items?: ProductItem[];
}

interface ProductsServicesProps {
  theme: ThemeParams;
  content: ProductsServicesContent;
}

const ProductsServices = ({ theme, content }: ProductsServicesProps) => {
  // Get typography styles
  const getTypographyStyles = () => {
    return {
      fontFamily: theme.typography?.fontFamily || 'Inter',
      fontSize: theme.typography?.fontSize || '16px',
      lineHeight: theme.typography?.lineHeight || '1.6',
      fontWeight: theme.typography?.fontWeight || '400',
    }
  }

  // Get border radius class
  const getBorderRadiusClass = () => {
    switch (theme.layout?.borderRadius) {
      case 'none':
        return 'rounded-none'
      case 'small':
        return 'rounded-sm'
      case 'large':
        return 'rounded-lg'
      case 'medium':
      default:
        return 'rounded-md'
    }
  }

  // Get button styles based on component settings
  const getButtonStyles = (variant: 'outline' | 'premium' = 'outline') => {
    const baseStyles = {
      fontFamily: theme.typography?.fontFamily || 'Inter',
      fontSize: theme.typography?.fontSize || '16px',
      fontWeight: theme.typography?.fontWeight || '400',
    }

    if (variant === 'outline') {
      return {
        ...baseStyles,
        borderColor: theme.colors.primary,
        color: theme.colors.primary,
        borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
      }
    }
    if (variant === 'premium') {
      return {
        ...baseStyles,
        backgroundColor: theme.colors.primary,
        color: '#FFFFFF',
        borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
      }
    }

    return {
      ...baseStyles,
      backgroundColor: theme.colors.primary,
      color: '#FFFFFF',
      borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
    }
  }

  // Get heading size based on typography settings
  const getHeadingSize = (size: 'large' | 'medium' | 'small' = 'medium') => {
    const baseSize = theme.typography?.headingSize || '2xl'
    
    if (size === 'large') {
      switch (baseSize) {
        case 'sm': return 'text-3xl md:text-4xl'
        case 'base': return 'text-4xl md:text-5xl'
        case 'lg': return 'text-4xl md:text-6xl'
        case 'xl': return 'text-5xl md:text-6xl'
        case '3xl': return 'text-6xl md:text-8xl'
        case '2xl':
        default: return 'text-4xl md:text-5xl'
      }
    } else if (size === 'medium') {
      switch (baseSize) {
        case 'sm': return 'text-2xl md:text-3xl'
        case 'base': return 'text-3xl md:text-4xl'
        case 'lg': return 'text-3xl md:text-5xl'
        case 'xl': return 'text-4xl md:text-5xl'
        case '3xl': return 'text-5xl md:text-7xl'
        case '2xl':
        default: return 'text-3xl md:text-4xl'
      }
    } else {
      switch (baseSize) {
        case 'sm': return 'text-xl md:text-2xl'
        case 'base': return 'text-2xl md:text-3xl'
        case 'lg': return 'text-2xl md:text-4xl'
        case 'xl': return 'text-3xl md:text-4xl'
        case '3xl': return 'text-4xl md:text-6xl'
        case '2xl':
        default: return 'text-2xl md:text-3xl'
      }
    }
  }

  // Get body text size based on typography settings
  const getBodySize = () => {
    switch (theme.typography?.bodySize) {
      case 'xs':
        return 'text-lg'
      case 'sm':
        return 'text-xl'
      case 'lg':
        return 'text-2xl'
      case 'xl':
        return 'text-3xl'
      case 'base':
      default:
        return 'text-xl'
    }
  }

  // Get spacing class based on theme layout spacing
  const getSpacingClass = () => {
    switch (theme.layout?.spacing) {
      case 'minimal':
        return 'py-12'
      case 'spacious':
        return 'py-24'
      case 'comfortable':
      default:
        return 'py-20'
    }
  }

  // Services data
  const services = [
    {
      icon: Coffee,
      title: "Cà Phê Chất Lượng Cao",
      description: "Robusta và Arabica từ các vùng đất tốt nhất Việt Nam",
      features: ["Chứng nhận organic", "Rang xay theo yêu cầu", "Đóng gói chuyên nghiệp"],
      image: content.items?.[0]?.image || ""
    },
    {
      icon: Truck,
      title: "Logistics & Vận Chuyển",
      description: "Dịch vụ vận chuyển toàn cầu an toàn và nhanh chóng",
      features: ["Bảo hiểm hàng hóa", "Theo dõi realtime", "Giao hàng tận nơi"],
      image: content.items?.[1]?.image || ""
    },
    {
      icon: FileCheck,
      title: "Tư Vấn Thủ Tục",
      description: "Hỗ trợ đầy đủ về giấy tờ và chứng nhận xuất khẩu",
      features: ["Chứng nhận FDA", "Certificate of Origin", "Phytosanitary Certificate"],
      image: content.items?.[2]?.image || ""
    },
    {
      icon: Users,
      title: "Đào Tạo & Phát Triển",
      description: "Nâng cao năng lực xuất nhập khẩu cho doanh nghiệp",
      features: ["Workshop chuyên sâu", "Mentoring 1-1", "Networking events"],
      image: ""
    },
    {
      icon: Lightbulb,
      title: "Tư Vấn Chiến Lược",
      description: "Lập kế hoạch phát triển thị trường Mỹ bền vững",
      features: ["Market research", "Branding support", "Sales strategy"],
      image: ""
    },
    {
      icon: Shield,
      title: "Kiểm Soát Chất Lượng",
      description: "Đảm bảo tiêu chuẩn quốc tế cho từng lô hàng",
      features: ["Lab testing", "Quality certificates", "Traceability system"],
      image: ""
    }
  ];

  return (
    <section 
      id="products" 
      className={getSpacingClass()}
      style={{
        backgroundColor: content.backgroundColor || theme.sections?.products?.backgroundColor || '#F0F4F8',
        ...getTypographyStyles()
      }}
    >
      <div 
        className="px-4"
        style={{
          maxWidth: theme.layout?.containerWidth || '1200px',
          margin: '0 auto'
        }}
      >
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 
            className={`font-bold mb-6 ${getHeadingSize('large')}`}
            style={{ 
              color: content.textColor || theme.sections?.products?.textColor || theme.colors.text,
              fontWeight: theme.typography?.fontWeight || '700',
              lineHeight: theme.typography?.lineHeight || '1.2'
            }}
          >
            Dịch Vụ
            <span 
              className="block"
              style={{ color: theme.colors.primary }}
            >
              Xuất Khẩu Toàn Diện
            </span>
          </h2>
          <p 
            className={`max-w-3xl mx-auto ${getBodySize()}`}
            style={{ 
              color: theme.colors.muted || '#718096',
              lineHeight: theme.typography?.lineHeight || '1.6'
            }}
          >
            Từ sản phẩm cà phê chất lượng cao đến dịch vụ logistics và tư vấn chuyên sâu, 
            chúng tôi cung cấp giải pháp một cửa cho việc xuất khẩu sang Mỹ.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`group hover:shadow-xl transition-all duration-300 overflow-hidden animate-slide-up ${getBorderRadiusClass()}`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                fontFamily: theme.typography?.fontFamily || 'Inter',
                fontSize: theme.typography?.fontSize || '16px'
              }}
            >
              {service.image && (
                <div className="h-48 overflow-hidden">
                  <ProductImage
                    image={service.image}
                    productName={service.title}
                    index={index}
                    primaryColor={theme.colors.primary}
                    borderRadiusClass="rounded-none"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                    style={{ backgroundColor: `${theme.colors.primary}1A` }}
                  >
                    <service.icon 
                      style={{ color: theme.colors.primary }} 
                      size={24} 
                    />
                  </div>
                  <h3 
                    className={`font-bold ${getHeadingSize('small')}`}
                    style={{ 
                      color: theme.colors.text,
                      fontWeight: theme.typography?.fontWeight || '700'
                    }}
                  >
                    {service.title}
                  </h3>
                </div>
                
                <p 
                  className="mb-4"
                  style={{ 
                    color: theme.colors.muted || '#718096',
                    fontSize: theme.typography?.fontSize || '16px',
                    lineHeight: theme.typography?.lineHeight || '1.6'
                  }}
                >
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm" style={{ color: theme.colors.muted || '#718096' }}>
                      <div 
                        className="w-1.5 h-1.5 rounded-full mr-3"
                        style={{ backgroundColor: theme.colors.primary }}
                      ></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full group"
                  style={getButtonStyles('outline')}
                >
                  Tìm hiểu thêm
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card 
            className={`p-8 border-2 max-w-3xl mx-auto ${getBorderRadiusClass()}`}
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary || '#FFFFFF'}, ${theme.colors.secondary || '#D2691E'}15)`,
              borderColor: `${theme.colors.primary}33`,
              fontFamily: theme.typography?.fontFamily || 'Inter',
              fontSize: theme.typography?.fontSize || '16px'
            }}
          >
            <h3 
              className={`font-bold mb-4 ${getHeadingSize('medium')}`}
              style={{ 
                color: theme.colors.text,
                fontWeight: theme.typography?.fontWeight || '700'
              }}
            >
              Cần tư vấn dịch vụ phù hợp?
            </h3>
            <p 
              className="mb-6"
              style={{ 
                color: theme.colors.muted || '#718096',
                fontSize: theme.typography?.fontSize || '16px',
                lineHeight: theme.typography?.lineHeight || '1.6'
              }}
            >
              Đội ngũ chuyên gia của chúng tôi sẽ tư vấn miễn phí về gói dịch vụ 
              phù hợp nhất với nhu cầu và quy mô của doanh nghiệp bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="default" 
                size="lg"
                style={getButtonStyles('premium')}
              >
                Tư vấn miễn phí
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                style={getButtonStyles('outline')}
              >
                Xem báo giá
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductsServices; 