'use client'

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Coffee, Truck, FileCheck, Users, Lightbulb, Shield, Package, TrendingUp, FileText } from "lucide-react";
import { ThemeParams } from "@/types";
import ProductImage from "./ProductImage";
import { cn } from "@/lib/utils";
import { useUnsplashImage } from "@/hooks/use-unsplash-image";

interface ProductItem {
  id?: string;
  name: string;
  description: string;
  price?: string;
  category?: string;
  image?: string;
  features?: string[];
}

interface ServiceItem {
  id?: string;
  name: string;
  description: string;
  icon?: string;
  cta?: string;
  features?: string[];
}

interface ProductsServicesContent {
  title?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  items?: ProductItem[];
  services?: ServiceItem[];
}

interface ProductsServicesProps {
  theme: ThemeParams;
  content: ProductsServicesContent;
}

const ProductsServices = ({ theme, content }: ProductsServicesProps) => {
  // Use Unsplash for images
  console.log("content.items", content);
  const { imageUrl: coffeeImageUrl, isLoading: coffeeImageLoading } = useUnsplashImage(
    content.items?.[0]?.image,
    { query: 'cashew nuts premium' }
  );
  
  const { imageUrl: logisticsImageUrl, isLoading: logisticsImageLoading } = useUnsplashImage(
    content.items?.[1]?.image,
    { query: 'cashew processing packaging' }
  );

  // Icon mapping
  const iconMap: { [key: string]: any } = {
    Package,
    Truck,
    FileCheck,
    Users,
    Lightbulb,
    Shield,
    TrendingUp,
    FileText,
    Coffee
  };

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

  // Get button styles
  const getButtonStyles = (variant: 'outline' | 'primary' = 'outline') => {
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

    return {
      ...baseStyles,
      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
      color: '#FFFFFF',
      borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: 'all 0.3s ease',
    }
  }

  // Get heading size
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

  // Get body text size
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

  // Services data - prioritize content.services, fallback to default
  const services = content.services?.map(service => ({
    icon: iconMap[service.icon || 'Package'] || Package,
    title: service.name,
    description: service.description,
    features: service.features || ["Chất lượng cao", "Dịch vụ chuyên nghiệp", "Giao hàng đúng hạn"],
    cta: service.cta || "Tìm hiểu thêm"
  })) || [
    {
      icon: Package,
      title: "Gia Công Hạt Điều",
      description: "Nhận gia công hạt điều theo yêu cầu riêng của khách hàng (Private Label).",
      features: ["Chứng nhận organic", "Rang xay theo yêu cầu", "Đóng gói chuyên nghiệp", "Kiểm soát chất lượng"],
      cta: "Xem sản phẩm"
    },
    {
      icon: FileCheck,
      title: "Tài Liệu Xuất Khẩu",
      description: "Xử lý đầy đủ tất cả giấy tờ FDA, USDA và hải quan để thông quan suôn sẻ.",
      features: ["Tuân thủ FDA", "Biểu mẫu hải quan", "Chứng nhận sức khỏe", "Tài liệu xuất xứ"],
      cta: "Tìm hiểu thêm"
    },
    {
      icon: Shield,
      title: "Đảm Bảo Chất Lượng",
      description: "Quy trình kiểm tra và kiểm soát chất lượng nghiêm ngặt để đáp ứng tiêu chuẩn an toàn thực phẩm.",
      features: ["Kiểm tra phòng lab", "Chứng nhận HACCP", "Truy xuất nguồn gốc", "Báo cáo chất lượng"],
      cta: "Tiêu chuẩn chất lượng"
    },
    {
      icon: Truck,
      title: "Logistics & Vận Chuyển",
      description: "Quản lý logistics toàn diện từ cảng Việt Nam đến kho hàng của bạn.",
      features: ["Vận chuyển container", "Thông quan hải quan", "Theo dõi giao hàng", "Bảo hiểm hàng hóa"],
      cta: "Thông tin vận chuyển"
    },
    {
      icon: Users,
      title: "Tư Vấn Thị Trường",
      description: "Hướng dẫn chuyên môn về xu hướng thị trường, chiến lược định giá và phát triển kinh doanh.",
      features: ["Phân tích thị trường", "Thông tin giá cả", "Báo cáo xu hướng", "Chiến lược kinh doanh"],
      cta: "Nhận tư vấn"
    },
    {
      icon: TrendingUp,
      title: "Phát Triển Kinh Doanh",
      description: "Hỗ trợ mở rộng kinh doanh xuất khẩu hạt điều với đào tạo và hỗ trợ liên tục.",
      features: ["Chương trình đào tạo", "Hỗ trợ liên tục", "Truy cập mạng lưới", "Chiến lược tăng trưởng"],
      cta: "Bắt đầu phát triển"
    }
  ];

  return (
    <section 
      id="services" 
      className="py-20"
      style={{
        backgroundColor: content.backgroundColor || theme.sections?.products?.backgroundColor || '#F8F9FA',
        ...getTypographyStyles()
      }}
    >
      <div 
        className="container mx-auto px-4"
        style={{
          maxWidth: theme.layout?.containerWidth || '1200px',
          margin: '0 auto'
        }}
      >
        <div className="text-center mb-16">
          <h2 
            className={cn("font-bold mb-4", getHeadingSize('large'))}
            style={{ 
              color: content.textColor || theme.sections?.products?.textColor || theme.colors.text,
              fontWeight: theme.typography?.fontWeight || '700'
            }}
          >
            {content.title || "Giải Pháp Xuất Nhập Khẩu Toàn Diện"}
          </h2>
          <p 
            className={cn("max-w-3xl mx-auto", getBodySize())}
            style={{ 
              color: content.textColor || theme.sections?.products?.textColor || theme.colors.muted || '#718096',
              lineHeight: theme.typography?.lineHeight || '1.6'
            }}
          >
            {content.description || "Từ việc tìm nguồn cà phê cao cấp tại Việt Nam đến giao hàng tại kho Mỹ, chúng tôi xử lý mọi bước của quy trình xuất khẩu."}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={cn("shadow-card hover:shadow-elegant transition-all duration-300 border-border/50 hover:border-primary/50", getBorderRadiusClass())}
              style={{ 
                fontFamily: theme.typography?.fontFamily || 'Inter',
                fontSize: theme.typography?.fontSize || '16px'
              }}
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div 
                    className={cn("h-12 w-12 rounded-lg flex items-center justify-center mr-4", getBorderRadiusClass())}
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
                    }}
                  >
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 
                    className={cn("font-bold", getHeadingSize('small'))}
                    style={{ 
                      color: content.textColor || theme.colors.text,
                      fontWeight: theme.typography?.fontWeight || '700'
                    }}
                  >
                    {service.title}
                  </h3>
                </div>

                <p 
                  className="mb-6 leading-relaxed"
                  style={{ 
                    color: content.textColor || theme.colors.muted || '#718096',
                    fontSize: theme.typography?.fontSize || '16px',
                    lineHeight: theme.typography?.lineHeight || '1.6'
                  }}
                >
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature: string, idx: number) => (
                    <li 
                      key={idx} 
                      className="flex items-center text-sm"
                      style={{ color: content.textColor || theme.colors.text }}
                    >
                      <div 
                        className={cn("h-1.5 w-1.5 rounded-full mr-3", getBorderRadiusClass())}
                        style={{ backgroundColor: theme.colors.primary }}
                      ></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  style={getButtonStyles('outline')}
                >
                  {service.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Services with Images */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Card 
              className={cn("overflow-hidden shadow-elegant border-0", getBorderRadiusClass())}
              style={{ 
                fontFamily: theme.typography?.fontFamily || 'Inter',
                fontSize: theme.typography?.fontSize || '16px'
              }}
            >
              {coffeeImageUrl ? (
                <div className="relative w-full h-80">
                  {coffeeImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                  <Image
                    src={coffeeImageUrl}
                    alt={content.items?.[0]?.name || "Hạt điều Việt Nam cao cấp"}
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                  />
                </div>
              ) : (
                <div 
                  className="w-full h-80 flex items-center justify-center"
                  style={{ backgroundColor: `${theme.colors.primary}10` }}
                >
                  <div className="text-center">
                    <Coffee 
                      size={64} 
                      style={{ color: theme.colors.primary }}
                      className="mb-4"
                    />
                    <p 
                      style={{ color: theme.colors.text }}
                    >
                      {content.items?.[0]?.name || "Hạt điều Việt Nam"}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
          <div className="space-y-6">
            <h3 
              className={cn("font-bold", getHeadingSize('medium'))}
              style={{ 
                color: content.textColor || theme.colors.text,
                fontWeight: theme.typography?.fontWeight || '700'
              }}
            >
              {content.items?.[0]?.name || "Hạt Điều Việt Nam Cao Cấp"}
            </h3>
            <p 
              className={cn("leading-relaxed", getBodySize())}
              style={{ 
                color: content.textColor || theme.colors.muted || '#718096',
                lineHeight: theme.typography?.lineHeight || '1.6'
              }}
            >
              {content.items?.[0]?.description || "Chúng tôi tìm nguồn trực tiếp từ các trang trại hạt điều tốt nhất tại Bình Phước và Đồng Nai, nơi sản xuất những hạt điều ngon nhất thế giới. Kiểm soát chất lượng nghiêm ngặt đảm bảo chỉ những hạt điều loại A đến được thị trường quốc tế."}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {content.items?.slice(0, 2).map((item, index) => (
                <div 
                  key={item.id || index}
                  className={cn("text-center p-4 rounded-lg", getBorderRadiusClass())}
                  style={{ backgroundColor: `${theme.colors.primary}10` }}
                >
                  <div 
                    className="text-2xl font-bold"
                    style={{ 
                      color: theme.colors.primary,
                      fontWeight: theme.typography?.fontWeight || '700'
                    }}
                  >
                    {item.category || item.name}
                  </div>
                  <div 
                    className="text-sm"
                    style={{ 
                      color: content.textColor || theme.colors.muted || '#718096',
                      fontSize: theme.typography?.fontSize || '16px'
                    }}
                  >
                    {item.price || "Liên hệ"}
                  </div>
                </div>
              )) || (
                <>
                  <div 
                    className={cn("text-center p-4 rounded-lg", getBorderRadiusClass())}
                    style={{ backgroundColor: `${theme.colors.primary}10` }}
                  >
                    <div 
                      className="text-2xl font-bold"
                      style={{ 
                        color: theme.colors.primary,
                        fontWeight: theme.typography?.fontWeight || '700'
                      }}
                    >
                      WW320
                    </div>
                    <div 
                      className="text-sm"
                      style={{ 
                        color: content.textColor || theme.colors.muted || '#718096',
                        fontSize: theme.typography?.fontSize || '16px'
                      }}
                    >
                      Loại cao cấp
                    </div>
                  </div>
                  <div 
                    className={cn("text-center p-4 rounded-lg", getBorderRadiusClass())}
                    style={{ backgroundColor: `${theme.colors.primary}10` }}
                  >
                    <div 
                      className="text-2xl font-bold"
                      style={{ 
                        color: theme.colors.primary,
                        fontWeight: theme.typography?.fontWeight || '700'
                      }}
                    >
                      WW240
                    </div>
                    <div 
                      className="text-sm"
                      style={{ 
                        color: content.textColor || theme.colors.muted || '#718096',
                        fontSize: theme.typography?.fontSize || '16px'
                      }}
                    >
                      Loại tiêu chuẩn
                    </div>
                  </div>
                </>
              )}
            </div>
            <Button 
              size="lg" 
              className="shadow-elegant"
              style={getButtonStyles('primary')}
            >
              Xem danh mục sản phẩm
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mt-20">
          <div className="order-2 lg:order-1 space-y-6">
            <h3 
              className={cn("font-bold", getHeadingSize('medium'))}
              style={{ 
                color: content.textColor || theme.colors.text,
                fontWeight: theme.typography?.fontWeight || '700'
              }}
            >
              {content.items?.[1]?.name || "Logistics & Giao Hàng Liền Mạch"}
            </h3>
            <p 
              className={cn("leading-relaxed", getBodySize())}
              style={{ 
                color: content.textColor || theme.colors.muted || '#718096',
                lineHeight: theme.typography?.lineHeight || '1.6'
              }}
            >
              {content.items?.[1]?.description || "Mạng lưới logistics của chúng tôi đảm bảo hạt điều của bạn đến đúng hạn và trong tình trạng hoàn hảo. Chúng tôi xử lý thông quan hải quan, tài liệu và theo dõi giao hàng để bạn có thể tập trung vào kinh doanh."}
            </p>
            <div className="space-y-4">
              {(content.items?.[1]?.features || [
                "Tùy chọn container 20ft & 40ft",
                "Vận chuyển kiểm soát nhiệt độ",
                "Theo dõi & cập nhật thời gian thực",
                "Bảo hiểm hàng hóa bao gồm"
              ]).map((feature: string, index: number) => (
                <div key={index} className="flex items-center">
                  <div 
                    className={cn("h-2 w-2 rounded-full mr-3", getBorderRadiusClass())}
                    style={{ backgroundColor: theme.colors.accent || '#28A745' }}
                  ></div>
                  <span 
                    style={{ color: content.textColor || theme.colors.text }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>
            <Button 
              size="lg" 
              className="shadow-elegant"
              style={getButtonStyles('primary')}
            >
              Tìm hiểu về vận chuyển
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="order-1 lg:order-2">
            <Card 
              className={cn("overflow-hidden shadow-elegant border-0", getBorderRadiusClass())}
              style={{ 
                fontFamily: theme.typography?.fontFamily || 'Inter',
                fontSize: theme.typography?.fontSize || '16px'
              }}
            >
              {logisticsImageUrl ? (
                <div className="relative w-full h-80">
                  {logisticsImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                  <Image
                    src={logisticsImageUrl}
                    alt={content.items?.[1]?.name || "Vận chuyển quốc tế"}
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                  />
                </div>
              ) : (
                <div 
                  className="w-full h-80 flex items-center justify-center"
                  style={{ backgroundColor: `${theme.colors.primary}10` }}
                >
                  <div className="text-center">
                    <Truck 
                      size={64} 
                      style={{ color: theme.colors.primary }}
                      className="mb-4"
                    />
                    <p 
                      style={{ color: theme.colors.text }}
                    >
                      {content.items?.[1]?.name || "Vận chuyển quốc tế"}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsServices; 