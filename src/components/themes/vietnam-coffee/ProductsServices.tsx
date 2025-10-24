'use client'

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Coffee, Truck, FileCheck, Users, Lightbulb, Shield, Package, TrendingUp, FileText } from "lucide-react";
import { ThemeParams } from "@/types";
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
  primaryColor?: string;
  colorMode?: 'theme' | 'custom';
  titleSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  titleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  titleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  descriptionSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  descriptionWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  descriptionFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  items?: ProductItem[];
  services?: ServiceItem[];
}

interface ProductsServicesProps {
  theme: ThemeParams;
  content: ProductsServicesContent;
}

const ProductsServices = ({ theme, content }: ProductsServicesProps) => {
  // Get project language from theme or default to vietnamese
  const projectLanguage = theme?.projectLanguage || 'vietnamese';

  // Get localized text based on project language
  const getLocalizedText = () => {
    if (projectLanguage === 'english') {
      return {
        contact: "Contact",
        learnMore: "Learn More",
        viewProductCatalog: "View Product Catalog",
        learnAboutShipping: "Learn About Shipping",
        premiumGrade: "Premium Grade",
        standardGrade: "Standard Grade"
      };
    } else {
      return {
        contact: "Liên hệ",
        learnMore: "Tìm hiểu thêm",
        viewProductCatalog: "Xem danh mục sản phẩm",
        learnAboutShipping: "Tìm hiểu về vận chuyển",
        premiumGrade: "Loại cao cấp",
        standardGrade: "Loại tiêu chuẩn"
      };
    }
  };

  const localizedText = getLocalizedText();

  // Use Unsplash for images
  const { imageUrl: coffeeImageUrl, isLoading: coffeeImageLoading } = useUnsplashImage(
    content.items?.[0]?.image,
    { query: 'cashew nuts premium' }
  );
  
  const { imageUrl: logisticsImageUrl, isLoading: logisticsImageLoading } = useUnsplashImage(
    content.items?.[1]?.image,
    { query: 'cashew processing packaging' }
  );

  // Icon mapping
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
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

  // Get title size from content
  const getTitleSize = () => {
    const size = content.titleSize || theme.typography?.headingSize || '2xl';
    switch (size) {
      case 'sm':
        return 'text-2xl md:text-3xl';
      case 'base':
        return 'text-3xl md:text-4xl';
      case 'lg':
        return 'text-4xl md:text-5xl';
      case 'xl':
        return 'text-5xl md:text-6xl';
      case '2xl':
        return 'text-6xl md:text-7xl';
      case '3xl':
        return 'text-7xl md:text-8xl';
      default:
        return 'text-4xl md:text-5xl';
    }
  };

  // Get title weight from content
  const getTitleWeight = () => {
    const weight = content.titleWeight || theme.typography?.fontWeight || 'bold';
    switch (weight) {
      case 'light':
        return 'font-light';
      case 'normal':
        return 'font-normal';
      case 'medium':
        return 'font-medium';
      case 'semibold':
        return 'font-semibold';
      case 'bold':
        return 'font-bold';
      case 'extrabold':
        return 'font-extrabold';
      case 'black':
        return 'font-black';
      default:
        return 'font-bold';
    }
  };

  // Get title font from content
  const getTitleFont = () => {
    const font = content.titleFont || theme.typography?.fontFamily || 'inter';
    switch (font) {
      case 'inter':
        return 'font-inter';
      case 'poppins':
        return 'font-poppins';
      case 'roboto':
        return 'font-roboto';
      case 'open-sans':
        return 'font-open-sans';
      case 'montserrat':
        return 'font-montserrat';
      case 'lato':
        return 'font-lato';
      case 'nunito':
        return 'font-nunito';
      case 'raleway':
        return 'font-raleway';
      case 'playfair-display':
        return 'font-playfair-display';
      case 'merriweather':
        return 'font-merriweather';
      default:
        return 'font-inter';
    }
  };

  // Get description size from content
  const getDescriptionSize = () => {
    const size = content.descriptionSize || theme.typography?.bodySize || 'base';
    switch (size) {
      case 'xs':
        return 'text-base';
      case 'sm':
        return 'text-lg';
      case 'lg':
        return 'text-xl';
      case 'xl':
        return 'text-2xl';
      case 'base':
      default:
        return 'text-xl';
    }
  };

  // Get description weight from content
  const getDescriptionWeight = () => {
    const weight = content.descriptionWeight || theme.typography?.fontWeight || 'normal';
    switch (weight) {
      case 'light':
        return 'font-light';
      case 'normal':
        return 'font-normal';
      case 'medium':
        return 'font-medium';
      case 'semibold':
        return 'font-semibold';
      case 'bold':
        return 'font-bold';
      case 'extrabold':
        return 'font-extrabold';
      case 'black':
        return 'font-black';
      default:
        return 'font-normal';
    }
  };

  // Get description font from content
  const getDescriptionFont = () => {
    const font = content.descriptionFont || theme.typography?.fontFamily || 'inter';
    switch (font) {
      case 'inter':
        return 'font-inter';
      case 'poppins':
        return 'font-poppins';
      case 'roboto':
        return 'font-roboto';
      case 'open-sans':
        return 'font-open-sans';
      case 'montserrat':
        return 'font-montserrat';
      case 'lato':
        return 'font-lato';
      case 'nunito':
        return 'font-nunito';
      case 'raleway':
        return 'font-raleway';
      case 'playfair-display':
        return 'font-playfair-display';
      case 'merriweather':
        return 'font-merriweather';
      default:
        return 'font-inter';
    }
  };

  // Services data - prioritize content.services, fallback to default
  const services = content.services?.map(service => ({
    icon: iconMap[service.icon || 'Package'] || Package,
    title: service.name,
    description: service.description,
    features: service.features || ["Chất lượng cao", "Dịch vụ chuyên nghiệp", "Giao hàng đúng hạn"],
    cta: service.cta || localizedText.learnMore
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
      cta: localizedText.learnMore
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
        backgroundColor: content.colorMode === 'custom' && content.backgroundColor 
          ? content.backgroundColor 
          : theme.sections?.products?.backgroundColor || theme.colors.background || '#F8F9FA',
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
        {/* Header Section - chỉ hiển thị khi có title hoặc description */}
        {((content.title && content.title.trim()) || (content.description && content.description.trim())) && (
          <div className="text-center mb-16">
            {(content.title && content.title.trim()) && (
              <h2 
                className={cn("mb-4", getTitleSize(), getTitleWeight(), getTitleFont())}
                style={{ 
                  color: content.colorMode === 'custom' && content.textColor 
                    ? content.textColor 
                    : theme.sections?.products?.textColor || theme.colors.text,
                }}
              >
                {content.title}
              </h2>
            )}
            {(content.description && content.description.trim()) && (
              <p 
                className={cn("max-w-3xl mx-auto", getDescriptionSize(), getDescriptionWeight(), getDescriptionFont())}
                style={{ 
                  color: content.colorMode === 'custom' && content.textColor 
                    ? `${content.textColor}E6` 
                    : theme.sections?.products?.textColor || theme.colors.muted || '#718096',
                  lineHeight: theme.typography?.lineHeight || '1.6'
                }}
              >
                {content.description}
              </p>
            )}
          </div>
        )}

        {/* Services Grid - chỉ hiển thị khi có services */}
        {services && services.length > 0 && (
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
                    className={cn("h-12 w-28 rounded-lg flex items-center justify-center mr-4", getBorderRadiusClass())}
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
                    }}
                  >
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 
                    className={cn("font-bold", getHeadingSize('small'))}
                    style={{ 
                      color: content.textColor || theme.colors.text,
                      fontWeight: '700',
                      fontSize:  '30px'
                    }}
                  >
                    {service.title}
                  </h4>
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

             
                {/* <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  style={getButtonStyles('outline')}
                >
                  {service.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button> */}
              </CardContent>
            </Card>
            ))}
          </div>
        )}

      

        {/* Products Grid - hiển thị tất cả sản phẩm theo kiểu chẵn lẻ */}
        {content.items && content.items.length > 0 && (
          <div className="mt-20">
            {content.items.map((item, index) => (
              <div key={item.id || index} className={`grid lg:grid-cols-2 gap-12 items-center ${index > 0 ? 'mt-20' : ''}`}>
                <div className={index % 2 === 0 ? 'order-1' : 'order-2'}>
                  <Card 
                    className={cn("overflow-hidden shadow-elegant border-0", getBorderRadiusClass())}
                    style={{ 
                      fontFamily: theme.typography?.fontFamily || 'Inter',
                      fontSize: theme.typography?.fontSize || '16px'
                    }}
                  >
                    {item.image ? (
                      <div className="relative w-full h-80">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
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
                            {item.name || "Sản phẩm"}
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
                <div className={`space-y-6 ${index % 2 === 0 ? 'order-2' : 'order-1'}`}>
                  {(item.name && item.name.trim()) && (
                    <h3 
                      className={cn("font-bold", getHeadingSize('medium'))}
                      style={{ 
                        color: content.textColor || theme.colors.text,
                        fontWeight: theme.typography?.fontWeight || '700'
                      }}
                    >
                      {item.name}
                    </h3>
                  )}
                  {(item.description && item.description.trim()) && (
                    <p 
                      className={cn("leading-relaxed", getBodySize())}
                      style={{ 
                        color: content.textColor || theme.colors.muted || '#718096',
                        lineHeight: theme.typography?.lineHeight || '1.6'
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                  {(item.category && item.category.trim()) && (
                    <div 
                      className="text-lg font-semibold"
                      style={{ 
                        color: theme.colors.primary,
                        fontWeight: theme.typography?.fontWeight || '600'
                      }}
                    >
                      {item.category}
                    </div>
                  )}
                  {(item.price && item.price.trim()) && (
                    <div 
                      className="text-2xl font-bold"
                      style={{ 
                        color: theme.colors.primary,
                        fontWeight: theme.typography?.fontWeight || '700'
                      }}
                    >
                      {item.price}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
       
      </div>
    </section>
  );
};

export default ProductsServices; 