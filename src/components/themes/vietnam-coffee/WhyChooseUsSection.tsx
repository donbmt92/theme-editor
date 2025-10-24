"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Globe, TrendingUp, Shield, Clock, ArrowUpRight, CheckCircle, AlertCircle, Truck, Package, Zap, Lightbulb, Coffee, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ThemeParams } from "@/types";
import { cn } from "@/lib/utils";

interface Strength {
  icon: string | LucideIcon;
  title: string;
  description: string;
  highlight: string;
}

interface WhyChooseUsContent {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  colorMode?: 'theme' | 'custom';
  primaryColor?: string;
  titleSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  titleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  titleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  subtitleSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  subtitleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  subtitleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  strengths?: Array<{
    id?: string;
    icon: string;
    title: string;
    description: string;
    highlight?: string;
  }>;
  mission?: {
    title?: string;
    description?: string;
    values?: string[];
  };
  vision?: {
    title?: string;
    description?: string;
    goals?: string[];
  };
  cta?: {
    title?: string;
    description?: string;
    buttonText?: string;
    secondaryButtonText?: string;
  };
}

interface WhyChooseUsSectionProps {
  theme: ThemeParams;
  content: WhyChooseUsContent;
}

const WhyChooseUsSection = ({ theme, content }: WhyChooseUsSectionProps) => {
  // Get project language from theme or default to vietnamese
  const projectLanguage = theme?.projectLanguage || 'vietnamese';

  // Get localized text based on project language
  const getLocalizedText = () => {
    if (projectLanguage === 'english') {
      return {
        contactNow: "Contact Now",
        coreValues: "Core Values:",
        goals2025: "2025 Goals:",
        highQuality: "High Quality"
      };
    } else {
      return {
        contactNow: "Liên hệ ngay",
        coreValues: "Giá Trị Cốt Lõi:",
        goals2025: "Mục Tiêu 2025:",
        highQuality: "Chất lượng cao"
      };
    }
  };

  const localizedText = getLocalizedText();

  // Map tên icon (string) sang component thực tế để render an toàn
  const ICONS: Record<string, LucideIcon> = {
    Users,
    Award,
    Globe,
    TrendingUp,
    Shield,
    Clock,
    ArrowUpRight,
    CheckCircle,
    AlertCircle,
    Truck,
    Package,
    Zap,
    Lightbulb,
    Coffee,
    FileText,
  };

  const normalizeIconName = (name: string) => {
    if (!name) return name;
    // Hỗ trợ cả dạng có hậu tố "Icon" (vd: ArrowUpRightIcon)
    return name.endsWith("Icon") ? name.slice(0, -4) : name;
  };

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
    buttonText: "Đặt Lịch Tư Vấn Miễn Phí",
    secondaryButtonText: "Tải Hồ Sơ Công Ty",
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

  // Get subtitle size from content
  const getSubtitleSize = () => {
    const size = content.subtitleSize || theme.typography?.bodySize || 'base';
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

  // Get subtitle weight from content
  const getSubtitleWeight = () => {
    const weight = content.subtitleWeight || theme.typography?.fontWeight || 'normal';
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

  // Get subtitle font from content
  const getSubtitleFont = () => {
    const font = content.subtitleFont || theme.typography?.fontFamily || 'inter';
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
  const ctaData: { title: string; description: string; buttonText?: string; primaryButton?: string; secondaryButtonText?: string } = cta as unknown as {
    title: string; description: string; buttonText?: string; primaryButton?: string; secondaryButtonText?: string
  };

  return (
    <section 
      className="py-20"
      style={{
        backgroundColor: content.colorMode === 'custom' && content.backgroundColor 
          ? content.backgroundColor 
          : theme.sections?.whyChooseUs?.backgroundColor || theme.colors.background || '#FFFFFF',
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
        {/* Header Section - chỉ hiển thị khi có title hoặc subtitle */}
        {((content.title && content.title.trim()) || (content.subtitle && content.subtitle.trim())) && (
          <div className="text-center mb-16">
            {(content.title && content.title.trim()) && (
              <h2 
                className={cn("mb-4", getTitleSize(), getTitleWeight(), getTitleFont())}
                style={{ 
                  color: content.colorMode === 'custom' && content.textColor 
                    ? content.textColor 
                    : theme.colors?.text || '#2D3748',
                }}
              >
                {content.title}
              </h2>
            )}
            {(content.subtitle && content.subtitle.trim()) && (
              <p 
                className={cn("max-w-3xl mx-auto", getSubtitleSize(), getSubtitleWeight(), getSubtitleFont())}
                style={{ 
                  color: content.colorMode === 'custom' && content.textColor 
                    ? `${content.textColor}E6` 
                    : theme.colors?.muted || '#718096'
                }}
              >
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Strengths Grid - chỉ hiển thị khi có strengths */}
        {strengths && strengths.length > 0 && (
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
                      {(() => {
                        const iconValue = strength.icon as unknown;
                        const IconComp: LucideIcon =
                          typeof iconValue === "string"
                            ? ICONS[normalizeIconName(iconValue)] || Award
                            : (iconValue as LucideIcon) || Award;
                        return <IconComp className="h-7 w-7 text-white" />;
                      })()}
                    </div>
                    {(strength.title && strength.title.trim()) && (
                      <h3 
                        className={cn("text-xl font-bold mb-3")}
                        style={{ 
                          color: content.textColor || theme.colors?.text || '#2D3748',
                          fontWeight: theme.typography?.fontWeight || '700'
                        }}
                      >
                        {strength.title}
                      </h3>
                    )}
                    {(strength.description && strength.description.trim()) && (
                      <p 
                        className="mb-4 leading-relaxed"
                        style={{ 
                          color: content.textColor || theme.colors?.muted || '#718096'
                        }}
                      >
                        {strength.description}
                      </p>
                    )}
                    {(strength.highlight && strength.highlight.trim()) && (
                      <div 
                        className={cn("inline-flex items-center px-3 py-1 rounded-full text-sm font-medium", getBorderRadiusClass())}
                        style={{ 
                          backgroundColor: `${theme.colors.primary}10`,
                          color: theme.colors.primary
                        }}
                      >
                        <Award className="h-4 w-4 mr-1" />
                        {strength.highlight}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Mission & Vision - chỉ hiển thị khi có mission hoặc vision */}
        {((mission.title && mission.title.trim()) || (vision.title && vision.title.trim())) && (
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Mission - chỉ hiển thị khi có title */}
            {(mission.title && mission.title.trim()) && (
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
                  {(mission.description && mission.description.trim()) && (
                    <p 
                      className="mb-6 leading-relaxed"
                      style={{ 
                        color: content.textColor || theme.colors?.muted || '#718096'
                      }}
                    >
                      {mission.description}
                    </p>
                  )}
                  {(mission.values && mission.values.length > 0) && (
                    <div className="space-y-3">
                      <h4 
                        className="font-bold"
                        style={{ 
                          color: content.textColor || theme.colors?.text || '#2D3748',
                          fontWeight: theme.typography?.fontWeight || '700'
                        }}
                      >
                        {localizedText.coreValues}
                      </h4>
                      <div className="space-y-2">
                        {mission.values.map((value: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <div 
                              className={cn("h-2 w-2 rounded-full mr-3", getBorderRadiusClass())}
                              style={{ backgroundColor: theme.colors.primary }}
                            ></div>
                            <span 
                              style={{ color: content.textColor || theme.colors?.muted || '#718096' }}
                            >
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Vision - chỉ hiển thị khi có title */}
            {(vision.title && vision.title.trim()) && (
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
                  {(vision.description && vision.description.trim()) && (
                    <p 
                      className="mb-6 leading-relaxed"
                      style={{ 
                        color: content.textColor || theme.colors?.muted || '#718096'
                      }}
                    >
                      {vision.description}
                    </p>
                  )}
                  {(vision.goals && vision.goals.length > 0) && (
                    <div className="space-y-3">
                      <h4 
                        className="font-bold"
                        style={{ 
                          color: content.textColor || theme.colors?.text || '#2D3748',
                          fontWeight: theme.typography?.fontWeight || '700'
                        }}
                      >
                        {localizedText.goals2025}
                      </h4>
                      <div className="space-y-2">
                        {vision.goals.map((goal: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <div 
                              className={cn("h-2 w-2 rounded-full mr-3", getBorderRadiusClass())}
                              style={{ backgroundColor: theme.colors.accent }}
                            ></div>
                            <span 
                              style={{ color: content.textColor || theme.colors?.muted || '#718096' }}
                            >
                              {goal}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* CTA Section - chỉ hiển thị khi có title */}
        {(ctaData.title && ctaData.title.trim()) && (
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
                {ctaData.title}
              </h3>
              {(ctaData.description && ctaData.description.trim()) && (
                <p 
                  className={cn("text-xl mb-8 opacity-90 max-w-2xl mx-auto")}
                  style={{ color: '#FFFFFF' }}
                >
                  {ctaData.description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-white text-primary hover:bg-white/90"
                  style={getButtonStyles('secondary')}
                >
                  {ctaData.buttonText || localizedText.contactNow}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                {(ctaData.secondaryButtonText && ctaData.secondaryButtonText.trim()) && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-primary"
                    style={getButtonStyles('outline')}
                  >
                    {ctaData.secondaryButtonText}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default WhyChooseUsSection; 