"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Globe, TrendingUp, Shield, Clock } from "lucide-react";
import { ThemeParams } from "@/types";
import { cn } from "@/lib/utils";

interface Strength {
  icon: any;
  title: string;
  description: string;
  highlight: string;
}

interface WhyChooseUsContent {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  strengths?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  mission?: {
    title: string;
    description: string;
  };
  vision?: {
    title: string;
    description: string;
  };
  cta?: {
    title: string;
    description: string;
    buttonText: string;
  };
}

interface WhyChooseUsSectionProps {
  theme: ThemeParams;
  content: WhyChooseUsContent;
}

const WhyChooseUsSection = ({ theme, content }: WhyChooseUsSectionProps) => {
  // Default strengths data
  const defaultStrengths: Strength[] = [
    {
      icon: Users,
      title: "Đội Ngũ Chuyên Gia",
      description: "15+ năm kinh nghiệm kết hợp trong xuất khẩu cà phê Việt Nam và quy định nhập khẩu Mỹ.",
      highlight: "Đội ngũ song ngữ thông thạo tiếng Việt và tiếng Anh"
    },
    {
      icon: Award,
      title: "Cam Kết Chất Lượng",
      description: "Quy trình kiểm soát chất lượng nghiêm ngặt đảm bảo chỉ cà phê loại A cao cấp đến tay khách hàng.",
      highlight: "Cơ sở được chứng nhận ISO 22000 & HACCP"
    },
    {
      icon: Globe,
      title: "Mạng Lưới Toàn Cầu",
      description: "Đối tác chiến lược với các trang trại hàng đầu Việt Nam và nhà cung cấp logistics Mỹ.",
      highlight: "Quan hệ trực tiếp với 5 tỉnh thành"
    },
    {
      icon: TrendingUp,
      title: "Thông Tin Thị Trường",
      description: "Hiểu sâu về cung cầu Việt Nam và Mỹ để tối ưu hóa giá cả và chiến lược.",
      highlight: "Báo cáo thị trường hàng tuần & phân tích xu hướng"
    },
    {
      icon: Shield,
      title: "Quản Lý Rủi Ro",
      description: "Bảo hiểm toàn diện và kế hoạch dự phòng để bảo vệ đầu tư của bạn.",
      highlight: "Bảo hiểm 100% hàng hóa bao gồm"
    },
    {
      icon: Clock,
      title: "Giao Hàng Đáng Tin Cậy",
      description: "Thành tích giao hàng đúng hạn với theo dõi và cập nhật đầy đủ.",
      highlight: "Tỷ lệ giao hàng đúng hạn 99.8%"
    }
  ];

  const defaultMission = {
    title: "Sứ Mệnh Của Chúng Tôi",
    description: "Kết nối sự xuất sắc của cà phê Việt Nam với nhu cầu thị trường Mỹ, tạo ra những mối quan hệ đối tác lâu dài mang lại lợi ích cho nông dân, nhà nhập khẩu và người tiêu dùng.",
    values: [
      "Minh bạch trong mọi giao dịch",
      "Thực hành canh tác bền vững",
      "Tập trung vào thành công khách hàng",
      "Cải tiến liên tục"
    ]
  };

  const defaultVision = {
    title: "Tầm Nhìn Của Chúng Tôi",
    description: "Trở thành công ty xuất khẩu cà phê Việt Nam hàng đầu tại thị trường Mỹ, được biết đến với chất lượng xuất sắc, dịch vụ đáng tin cậy và giải pháp sáng tạo.",
    goals: [
      "Mở rộng đến 100+ đối tác Mỹ vào năm 2025",
      "Hỗ trợ 1,000+ nông dân Việt Nam",
      "Đạt được vận chuyển carbon-neutral",
      "Ra mắt nền tảng trực tiếp đến người tiêu dùng"
    ]
  };

  const defaultCta = {
    title: "Sẵn Sàng Bắt Đầu Hành Trình Nhập Khẩu Cà Phê?",
    description: "Tham gia cùng 50+ nhà nhập khẩu Mỹ thành công tin tưởng chúng tôi cho nhu cầu cà phê Việt Nam. Bắt đầu với tư vấn miễn phí ngay hôm nay.",
    primaryButton: "Đặt Lịch Tư Vấn Miễn Phí",
    secondaryButton: "Tải Hồ Sơ Công Ty"
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
  const getButtonStyles = (variant: 'outline' | 'primary' | 'secondary' = 'primary') => {
    const baseStyles = {
      fontFamily: theme.typography?.fontFamily || 'Inter',
      fontSize: theme.typography?.fontSize || '16px',
      fontWeight: theme.typography?.fontWeight || '400',
    }

    if (variant === 'outline') {
      return {
        ...baseStyles,
        borderColor: '#FFFFFF',
        color: '#FFFFFF',
        borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
      }
    }

    if (variant === 'secondary') {
      return {
        ...baseStyles,
        backgroundColor: '#FFFFFF',
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

  // Use content or defaults
  const strengths = content.strengths || defaultStrengths;
  const mission = content.mission || defaultMission;
  const vision = content.vision || defaultVision;
  const cta = content.cta || defaultCta;

  return (
    <section 
      className="py-20"
      style={{
        backgroundColor: content.backgroundColor || theme.colors?.background || '#FFFFFF',
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
            className={cn("text-4xl font-bold mb-4")}
            style={{ 
              color: content.textColor || theme.colors?.text || '#2D3748',
              fontWeight: theme.typography?.fontWeight || '700'
            }}
          >
            {content.title || "Tại Sao Chọn VietCoffee Export?"}
          </h2>
          <p 
            className={cn("text-xl max-w-3xl mx-auto")}
            style={{ 
              color: content.textColor || theme.colors?.muted || '#718096'
            }}
          >
            {content.subtitle || "Chúng tôi kết hợp di sản nông nghiệp Việt Nam với chuyên môn xuất khẩu hiện đại để mang lại giá trị vượt trội cho đối tác Mỹ."}
          </p>
        </div>

        {/* Strengths Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {strengths.map((strength, index) => (
            <Card 
              key={index} 
              className={cn("shadow-card hover:shadow-elegant transition-all duration-300 border-border/50 hover:border-primary/30", getBorderRadiusClass())}
              style={{ 
                fontFamily: theme.typography?.fontFamily || 'Inter',
                fontSize: theme.typography?.fontSize || '16px'
              }}
            >
              <CardContent className="p-8">
                <div className="mb-6">
                  <div 
                    className={cn("h-14 w-14 rounded-xl flex items-center justify-center mb-4", getBorderRadiusClass())}
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
                    }}
                  >
                    <strength.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 
                    className={cn("text-xl font-bold mb-3")}
                    style={{ 
                      color: content.textColor || theme.colors?.text || '#2D3748',
                      fontWeight: theme.typography?.fontWeight || '700'
                    }}
                  >
                    {strength.title}
                  </h3>
                  <p 
                    className="mb-4 leading-relaxed"
                    style={{ 
                      color: content.textColor || theme.colors?.muted || '#718096'
                    }}
                  >
                    {strength.description}
                  </p>
                  <div 
                    className={cn("inline-flex items-center px-3 py-1 rounded-full text-sm font-medium", getBorderRadiusClass())}
                    style={{ 
                      backgroundColor: `${theme.colors.primary}10`,
                      color: theme.colors.primary
                    }}
                  >
                    <Award className="h-4 w-4 mr-1" />
                    Chất lượng cao
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Mission */}
          <Card 
            className={cn("shadow-elegant", getBorderRadiusClass())}
            style={{ 
              borderColor: `${theme.colors.primary}20`,
              fontFamily: theme.typography?.fontFamily || 'Inter',
              fontSize: theme.typography?.fontSize || '16px'
            }}
          >
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div 
                  className={cn("h-12 w-12 rounded-lg flex items-center justify-center mr-4", getBorderRadiusClass())}
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 
                  className={cn("text-2xl font-bold")}
                  style={{ 
                    color: content.textColor || theme.colors?.text || '#2D3748',
                    fontWeight: theme.typography?.fontWeight || '700'
                  }}
                >
                  {mission.title}
                </h3>
              </div>
              <p 
                className="mb-6 leading-relaxed"
                style={{ 
                  color: content.textColor || theme.colors?.muted || '#718096'
                }}
              >
                {mission.description}
              </p>
              <div className="space-y-3">
                <h4 
                  className="font-semibold"
                  style={{ 
                    color: content.textColor || theme.colors?.text || '#2D3748',
                    fontWeight: theme.typography?.fontWeight || '600'
                  }}
                >
                  Giá Trị Cốt Lõi:
                </h4>
                <p 
                  className="leading-relaxed"
                  style={{ 
                    color: content.textColor || theme.colors?.muted || '#718096'
                  }}
                >
                  {mission.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card 
            className={cn("shadow-elegant", getBorderRadiusClass())}
            style={{ 
              borderColor: `${theme.colors.accent}20`,
              fontFamily: theme.typography?.fontFamily || 'Inter',
              fontSize: theme.typography?.fontSize || '16px'
            }}
          >
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div 
                  className={cn("h-12 w-12 rounded-lg flex items-center justify-center mr-4", getBorderRadiusClass())}
                  style={{ backgroundColor: theme.colors.accent }}
                >
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 
                  className={cn("text-2xl font-bold")}
                  style={{ 
                    color: content.textColor || theme.colors?.text || '#2D3748',
                    fontWeight: theme.typography?.fontWeight || '700'
                  }}
                >
                  {vision.title}
                </h3>
              </div>
              <p 
                className="mb-6 leading-relaxed"
                style={{ 
                  color: content.textColor || theme.colors?.muted || '#718096'
                }}
              >
                {vision.description}
              </p>
              <div className="space-y-3">
                <h4 
                  className="font-semibold"
                  style={{ 
                    color: content.textColor || theme.colors?.text || '#2D3748',
                    fontWeight: theme.typography?.fontWeight || '600'
                  }}
                >
                  Mục Tiêu 2025:
                </h4>
                <p 
                  className="leading-relaxed"
                  style={{ 
                    color: content.textColor || theme.colors?.muted || '#718096'
                  }}
                >
                  {vision.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card 
          className={cn("border-0 shadow-elegant", getBorderRadiusClass())}
          style={{ 
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
            color: '#FFFFFF'
          }}
        >
          <CardContent className="p-12 text-center">
            <h3 
              className={cn("text-3xl font-bold mb-4")}
              style={{ 
                color: '#FFFFFF',
                fontWeight: theme.typography?.fontWeight || '700'
              }}
            >
              {cta.title}
            </h3>
            <p 
              className={cn("text-xl mb-8 opacity-90 max-w-2xl mx-auto")}
              style={{ color: '#FFFFFF' }}
            >
              {cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90"
                style={getButtonStyles('secondary')}
              >
                {(cta as any)?.buttonText || 'Liên hệ ngay'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WhyChooseUsSection; 