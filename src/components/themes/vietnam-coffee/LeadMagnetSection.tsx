'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, BookOpen, CheckCircle, TrendingUp, Shield, FileText } from "lucide-react";
import { ThemeParams } from "@/types";
import { cn } from "@/lib/utils";

interface LeadMagnetContent {
  title?: string;
  subtitle?: string;
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
  guideTitle?: string;
  guideSubtitle?: string;
  formTitle?: string;
  formDescription?: string;
  buttonText?: string;
  downloadUrl?: string;
  badgeText?: string;
  privacyText?: string;
  secureText?: string;
  noSpamText?: string;
  instantText?: string;
  guideFeatures?: Array<{
    id?: string;
    icon?: string;
    title: string;
    description: string;
  }>;
  trustIndicators?: Array<{
    id?: string;
    number: string;
    label: string;
  }>;
}

interface LeadMagnetSectionProps {
  theme: ThemeParams;
  content: LeadMagnetContent;
}

const LeadMagnetSection = ({ theme, content }: LeadMagnetSectionProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: ""
  });
  
  // Get project language from theme or default to vietnamese
  const projectLanguage = theme?.projectLanguage || 'vietnamese';
  
  // Get localized text based on project language
  const getLocalizedText = () => {
    if (projectLanguage === 'english') {
      return {
        nameLabel: "Full Name *",
        emailLabel: "Business Email *", 
        companyLabel: "Company Name (Optional)",
        namePlaceholder: "Enter your full name",
        emailPlaceholder: "your.email@company.com",
        companyPlaceholder: "Your company name",
        secureText: "100% Secure",
        noSpamText: "No Spam", 
        instantText: "Instant Download",
        privacyText: "By downloading, you agree to receive occasional emails about coffee export opportunities. Unsubscribe anytime.",
        badgeText: "Free Guide",
      };
    } else {
      return {
        nameLabel: "Họ và tên *",
        emailLabel: "Email doanh nghiệp *",
        companyLabel: "Tên công ty (Tùy chọn)", 
        namePlaceholder: "Nhập họ và tên đầy đủ",
        emailPlaceholder: "your.email@company.com",
        companyPlaceholder: "Tên công ty của bạn",
        secureText: "100% An toàn",
        noSpamText: "Không spam",
        instantText: "Tải về ngay",
        privacyText: "Bằng việc tải về, bạn đồng ý nhận email thỉnh thoảng về cơ hội xuất khẩu cà phê. Hủy đăng ký bất cứ lúc nào.",
        badgeText: "Hướng dẫn miễn phí",
      };
    }
  };

  const localizedText = getLocalizedText();

  // Get icon component by name
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'FileText': return FileText;
      case 'TrendingUp': return TrendingUp;
      case 'Shield': return Shield;
      case 'CheckCircle': return CheckCircle;
      case 'BookOpen': return BookOpen;
      case 'Download': return Download;
      default: return FileText;
    }
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

  // Get button styles
  const getButtonStyles = () => {
    return {
      fontFamily: theme.typography?.fontFamily || 'Inter',
      fontSize: theme.typography?.fontSize || '16px',
      fontWeight: theme.typography?.fontWeight || '400',
      background: content.colorMode === 'custom' && content.primaryColor
        ? `linear-gradient(135deg, ${content.primaryColor}, ${content.primaryColor}80)`
        : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    // Auto-download guide if available
    if (content.downloadUrl) {
      const link = document.createElement('a');
      link.href = content.downloadUrl;
      link.setAttribute('download', 'guide.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setFormData({ name: "", email: "", company: "" });
  };

  // Default features and trust indicators
  const defaultFeatures = [
    {
      icon: 'FileText',
      title: "Danh sách tài liệu đầy đủ",
      description: "Mọi biểu mẫu, chứng nhận và tài liệu cần thiết cho tuân thủ FDA"
    },
    {
      icon: 'TrendingUp',
      title: "Phân tích thị trường & Xu hướng giá",
      description: "Dữ liệu thị trường cà phê Mỹ hiện tại và thông tin giá cả 2025"
    },
    {
      icon: 'Shield',
      title: "Tiêu chuẩn chất lượng & Kiểm tra",
      description: "Yêu cầu chi tiết cho tiêu chuẩn chất lượng nhập khẩu Mỹ"
    },
    {
      icon: 'CheckCircle',
      title: "Quy trình nhập khẩu từng bước",
      description: "Lịch trình rõ ràng từ đặt hàng đến giao hàng tại kho"
    }
  ];

  const defaultTrustIndicators = [
    { number: "5,000+", label: "Lượt tải" },
    { number: "92%", label: "Tỷ lệ thành công" },
    { number: "4.9/5", label: "Đánh giá người dùng" }
  ];

  const features = content.guideFeatures || defaultFeatures;
  const trustIndicators = content.trustIndicators || defaultTrustIndicators;

  return (
    <section 
      id="guide" 
      className="py-20"
      style={{ 
        backgroundColor: content.colorMode === 'custom' && content.backgroundColor 
          ? content.backgroundColor 
          : theme.colors?.background || '#F8F9FA',
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            {/* Badge - chỉ hiển thị khi có nội dung */}
            {(content.badgeText && content.badgeText.trim()) && (
              <div 
                className={cn("inline-flex items-center px-4 py-2 rounded-full mb-4", getBorderRadiusClass())}
                style={{ 
                  backgroundColor: content.colorMode === 'custom' && content.primaryColor 
                    ? `${content.primaryColor}10` 
                    : `${theme.colors.primary}10`,
                  color: content.colorMode === 'custom' && content.primaryColor 
                    ? content.primaryColor 
                    : theme.colors.primary
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="font-medium">{content.badgeText}</span>
              </div>
            )}
            
            {/* Title - chỉ hiển thị khi có nội dung */}
            {(content.title && content.title.trim()) && (
              <h2 
                className={cn("mb-4", getTitleSize(), getTitleWeight(), getTitleFont())}
                style={{ 
                  color: content.colorMode === 'custom' && content.textColor 
                    ? content.textColor 
                    : theme.colors.text,
                }}
              >
                {content.title}
              </h2>
            )}
            
            {/* Description - chỉ hiển thị khi có nội dung */}
            {(content.description && content.description.trim()) && (
              <p 
                className={cn("max-w-3xl mx-auto", getDescriptionSize(), getDescriptionWeight(), getDescriptionFont())}
                style={{ 
                  color: content.colorMode === 'custom' && content.textColor 
                    ? `${content.textColor}E6` 
                    : theme.colors.muted || '#718096',
                  lineHeight: theme.typography?.lineHeight || '1.6',
                }}
              >
                {content.description}
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Guide Preview */}
            <div>
              <Card 
                className={cn("shadow-elegant", getBorderRadiusClass())}
                style={{ 
                  borderColor: `${theme.colors.primary}20`,
                  fontFamily: theme.typography?.fontFamily || 'Inter',
                  fontSize: theme.typography?.fontSize || '16px'
                }}
              >
                <CardContent className="p-8">
                  {/* Guide Header - chỉ hiển thị khi có guideTitle hoặc guideSubtitle */}
                  {((content.guideTitle && content.guideTitle.trim()) || (content.guideSubtitle && content.guideSubtitle.trim())) && (
                    <div className="flex items-center mb-6">
                      <div 
                        className={cn("h-16 w-16 rounded-xl flex items-center justify-center mr-4", getBorderRadiusClass())}
                        style={{ 
                          background: content.colorMode === 'custom' && content.primaryColor
                            ? `linear-gradient(135deg, ${content.primaryColor}, ${content.primaryColor}80)`
                            : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
                        }}
                      >
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        {(content.guideTitle && content.guideTitle.trim()) && (
                          <h3 
                            className={cn("font-bold", getHeadingSize('small'))}
                            style={{ 
                              color: content.textColor || theme.colors.text,
                              fontWeight: theme.typography?.fontWeight || '700'
                            }}
                          >
                            {content.guideTitle}
                          </h3>
                        )}
                        {(content.guideSubtitle && content.guideSubtitle.trim()) && (
                          <p 
                            style={{ 
                              color: content.textColor || theme.colors.muted || '#718096',
                              fontSize: theme.typography?.fontSize || '16px'
                            }}
                          >
                            {content.guideSubtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {features.map((feature, index) => {
                      const IconComponent = getIcon(feature.icon);
                      return (
                        <div key={index} className="flex items-start space-x-4">
                          <IconComponent 
                            className="h-6 w-6 mt-1 flex-shrink-0" 
                            style={{ 
                              color: content.colorMode === 'custom' && content.primaryColor 
                                ? content.primaryColor 
                                : theme.colors.primary 
                            }}
                          />
                          <div>
                            <h4 
                              className="font-semibold mb-1"
                              style={{ 
                                color: content.textColor || theme.colors.text,
                                fontWeight: theme.typography?.fontWeight || '600'
                              }}
                            >
                              {feature.title}
                            </h4>
                            <p 
                              className="text-sm"
                              style={{ 
                                color: content.textColor || theme.colors.muted || '#718096',
                                fontSize: theme.typography?.fontSize || '16px',
                                lineHeight: theme.typography?.lineHeight || '1.6'
                              }}
                            >
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Trust Indicators - chỉ hiển thị khi có trustIndicators */}
                  {trustIndicators && trustIndicators.length > 0 && (
                    <div className="mt-8 pt-6 border-t" style={{ 
                      borderColor: content.colorMode === 'custom' && content.primaryColor 
                        ? content.primaryColor 
                        : theme.colors.border || theme.colors.primary 
                    }}>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        {trustIndicators.map((indicator, index) => (
                          <div key={index}>
                            <div 
                              className="text-2xl font-bold"
                              style={{ 
                                color: content.colorMode === 'custom' && content.primaryColor 
                                  ? content.primaryColor 
                                  : theme.colors.primary,
                                fontWeight: theme.typography?.fontWeight || '700'
                              }}
                            >
                              {indicator.number}
                            </div>
                            <div 
                              className="text-sm"
                              style={{ 
                                color: content.textColor || theme.colors.muted || '#718096',
                                fontSize: theme.typography?.fontSize || '16px'
                              }}
                            >
                              {indicator.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sign-up Form */}
            <div>
              <Card 
                className={cn("shadow-elegant", getBorderRadiusClass())}
                style={{ 
                  fontFamily: theme.typography?.fontFamily || 'Inter',
                  fontSize: theme.typography?.fontSize || '16px'
                }}
              >
                <CardContent className="p-8">
                  {/* Form Header - chỉ hiển thị khi có formTitle hoặc formDescription */}
                  {((content.formTitle && content.formTitle.trim()) || (content.formDescription && content.formDescription.trim())) && (
                    <div className="text-center mb-8">
                      {(content.formTitle && content.formTitle.trim()) && (
                        <h3 
                          className={cn("font-bold mb-2", getHeadingSize('small'))}
                          style={{ 
                            color: content.textColor || theme.colors.text,
                            fontWeight: theme.typography?.fontWeight || '700'
                          }}
                        >
                          {content.formTitle}
                        </h3>
                      )}
                      {(content.formDescription && content.formDescription.trim()) && (
                        <p 
                          style={{ 
                            color: content.textColor || theme.colors.muted || '#718096',
                            fontSize: theme.typography?.fontSize || '16px',
                            lineHeight: theme.typography?.lineHeight || '1.6'
                          }}
                        >
                          {content.formDescription}
                        </p>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label 
                        htmlFor="name" 
                        style={{ 
                          color: content.textColor || theme.colors.text,
                          fontSize: theme.typography?.fontSize || '16px',
                          fontWeight: theme.typography?.fontWeight || '500'
                        }}
                      >
                        {localizedText.nameLabel}
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-2"
                        placeholder={localizedText.namePlaceholder}
                        style={{ 
                          fontFamily: theme.typography?.fontFamily || 'Inter',
                          fontSize: theme.typography?.fontSize || '16px'
                        }}
                      />
                    </div>

                    <div>
                      <Label 
                        htmlFor="email"
                        style={{ 
                          color: content.textColor || theme.colors.text,
                          fontSize: theme.typography?.fontSize || '16px',
                          fontWeight: theme.typography?.fontWeight || '500'
                        }}
                      >
                        {localizedText.emailLabel}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-2"
                        placeholder={localizedText.emailPlaceholder}
                        style={{ 
                          fontFamily: theme.typography?.fontFamily || 'Inter',
                          fontSize: theme.typography?.fontSize || '16px'
                        }}
                      />
                    </div>

                    <div>
                      <Label 
                        htmlFor="company"
                        style={{ 
                          color: content.textColor || theme.colors.text,
                          fontSize: theme.typography?.fontSize || '16px',
                          fontWeight: theme.typography?.fontWeight || '500'
                        }}
                      >
                        {localizedText.companyLabel}
                      </Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="mt-2"
                        placeholder={localizedText.companyPlaceholder}
                        style={{ 
                          fontFamily: theme.typography?.fontFamily || 'Inter',
                          fontSize: theme.typography?.fontSize || '16px'
                        }}
                      />
                    </div>

                    {/* Button - chỉ hiển thị khi có buttonText */}
                    {(content.buttonText && content.buttonText.trim()) && (
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full hover:scale-105 hover:shadow-xl transition-all duration-300"
                        style={getButtonStyles()}
                      >
                        <Download className="mr-2 h-5 w-5" />
                        {content.buttonText}
                      </Button>
                    )}

                    {/* Privacy Text - chỉ hiển thị khi có privacyText */}
                    {(content.privacyText && content.privacyText.trim()) && (
                      <p 
                        className="text-xs text-center"
                        style={{ 
                          color: content.textColor || theme.colors.muted || '#718096',
                          fontSize: theme.typography?.fontSize || '16px'
                        }}
                      >
                        {content.privacyText}
                      </p>
                    )}
                  </form>

                  {/* Additional Trust Elements - chỉ hiển thị khi có ít nhất một trust element */}
                  {((content.secureText && content.secureText.trim()) || 
                    (content.noSpamText && content.noSpamText.trim()) || 
                    (content.instantText && content.instantText.trim())) && (
                    <div className="mt-8 pt-6 border-t" style={{ 
                      borderColor: content.colorMode === 'custom' && content.primaryColor 
                        ? content.primaryColor 
                        : theme.colors.border || theme.colors.primary 
                    }}>
                      <div className="flex items-center justify-center space-x-6 text-sm">
                        {(content.secureText && content.secureText.trim()) && (
                          <div 
                            className="flex items-center"
                            style={{ 
                              color: content.textColor || theme.colors.muted || '#718096',
                              fontSize: theme.typography?.fontSize || '16px'
                            }}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            <span>{content.secureText}</span>
                          </div>
                        )}
                        {(content.noSpamText && content.noSpamText.trim()) && (
                          <div 
                            className="flex items-center"
                            style={{ 
                              color: content.textColor || theme.colors.muted || '#718096',
                              fontSize: theme.typography?.fontSize || '16px'
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span>{content.noSpamText}</span>
                          </div>
                        )}
                        {(content.instantText && content.instantText.trim()) && (
                          <div 
                            className="flex items-center"
                            style={{ 
                              color: content.textColor || theme.colors.muted || '#718096',
                              fontSize: theme.typography?.fontSize || '16px'
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            <span>{content.instantText}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetSection; 