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
  guideTitle?: string;
  guideSubtitle?: string;
  formTitle?: string;
  formDescription?: string;
  buttonText?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  trustIndicators?: Array<{
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

  // Get button styles
  const getButtonStyles = () => {
    return {
      fontFamily: theme.typography?.fontFamily || 'Inter',
      fontSize: theme.typography?.fontSize || '16px',
      fontWeight: theme.typography?.fontWeight || '400',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
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
      description: "Dữ liệu thị trường cà phê Mỹ hiện tại và thông tin giá cả 2024"
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

  const features = content.features || defaultFeatures;
  const trustIndicators = content.trustIndicators || defaultTrustIndicators;

  return (
    <section 
      id="guide" 
      className="py-20"
      style={{ 
        backgroundColor: content.backgroundColor || theme.sections?.leadMagnet?.backgroundColor || '#F8F9FA',
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
            <div 
              className={cn("inline-flex items-center px-4 py-2 rounded-full mb-4", getBorderRadiusClass())}
              style={{ 
                backgroundColor: `${theme.colors.primary}10`,
                color: theme.colors.primary
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="font-medium">Tài nguyên miễn phí</span>
            </div>
            <h2 
              className={cn("font-bold mb-4", getHeadingSize('large'))}
              style={{ 
                color: content.textColor || theme.sections?.leadMagnet?.textColor || theme.colors.text,
                fontWeight: theme.typography?.fontWeight || '700'
              }}
            >
              {content.title || "Mở khóa thành công xuất nhập khẩu"}
            </h2>
            <p 
              className={cn("max-w-3xl mx-auto", getBodySize())}
              style={{ 
                color: content.textColor || theme.sections?.leadMagnet?.textColor || theme.colors.muted || '#718096',
                lineHeight: theme.typography?.lineHeight || '1.6'
              }}
            >
              {content.description || "Tải về hướng dẫn toàn diện 'Cẩm nang xuất khẩu cà phê Việt Nam 2024' - tất cả những gì bạn cần biết về xuất khẩu cà phê thành công vào thị trường Mỹ."}
            </p>
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
                  <div className="flex items-center mb-6">
                    <div 
                      className={cn("h-16 w-16 rounded-xl flex items-center justify-center mr-4", getBorderRadiusClass())}
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
                      }}
                    >
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 
                        className={cn("font-bold", getHeadingSize('small'))}
                        style={{ 
                          color: content.textColor || theme.colors.text,
                          fontWeight: theme.typography?.fontWeight || '700'
                        }}
                      >
                        {content.guideTitle || "Hướng dẫn xuất khẩu đầy đủ"}
                      </h3>
                      <p 
                        style={{ 
                          color: content.textColor || theme.colors.muted || '#718096',
                          fontSize: theme.typography?.fontSize || '16px'
                        }}
                      >
                        {content.guideSubtitle || "Phiên bản 2024 - 45 trang"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {features.map((feature, index) => {
                      const IconComponent = getIcon(feature.icon);
                      return (
                        <div key={index} className="flex items-start space-x-4">
                          <IconComponent 
                            className="h-6 w-6 mt-1 flex-shrink-0" 
                            style={{ color: theme.colors.primary }}
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

                  {/* Trust Indicators */}
                  <div className="mt-8 pt-6 border-t" style={{ borderColor: theme.colors.border || theme.colors.primary }}>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {trustIndicators.map((indicator, index) => (
                        <div key={index}>
                          <div 
                            className="text-2xl font-bold"
                            style={{ 
                              color: theme.colors.primary,
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
                  <div className="text-center mb-8">
                    <h3 
                      className={cn("font-bold mb-2", getHeadingSize('small'))}
                      style={{ 
                        color: content.textColor || theme.colors.text,
                        fontWeight: theme.typography?.fontWeight || '700'
                      }}
                    >
                      {content.formTitle || "Tải về hướng dẫn miễn phí"}
                    </h3>
                    <p 
                      style={{ 
                        color: content.textColor || theme.colors.muted || '#718096',
                        fontSize: theme.typography?.fontSize || '16px',
                        lineHeight: theme.typography?.lineHeight || '1.6'
                      }}
                    >
                      {content.formDescription || "Nhập thông tin bên dưới để có quyền truy cập ngay lập tức vào tài nguyên quý giá này."}
                    </p>
                  </div>

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
                        Họ và tên *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-2"
                        placeholder="Nhập họ và tên đầy đủ"
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
                        Email doanh nghiệp *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-2"
                        placeholder="your.email@company.com"
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
                        Tên công ty (Tùy chọn)
                      </Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="mt-2"
                        placeholder="Tên công ty của bạn"
                        style={{ 
                          fontFamily: theme.typography?.fontFamily || 'Inter',
                          fontSize: theme.typography?.fontSize || '16px'
                        }}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full hover:scale-105 hover:shadow-xl transition-all duration-300"
                      style={getButtonStyles()}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      {content.buttonText || "Tải về hướng dẫn miễn phí ngay"}
                    </Button>

                    <p 
                      className="text-xs text-center"
                      style={{ 
                        color: content.textColor || theme.colors.muted || '#718096',
                        fontSize: theme.typography?.fontSize || '16px'
                      }}
                    >
                      Bằng việc tải về, bạn đồng ý nhận email thỉnh thoảng về cơ hội xuất khẩu cà phê. Hủy đăng ký bất cứ lúc nào.
                    </p>
                  </form>

                  {/* Additional Trust Elements */}
                  <div className="mt-8 pt-6 border-t" style={{ borderColor: theme.colors.border || theme.colors.primary }}>
                    <div className="flex items-center justify-center space-x-6 text-sm">
                      <div 
                        className="flex items-center"
                        style={{ 
                          color: content.textColor || theme.colors.muted || '#718096',
                          fontSize: theme.typography?.fontSize || '16px'
                        }}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        <span>100% An toàn</span>
                      </div>
                      <div 
                        className="flex items-center"
                        style={{ 
                          color: content.textColor || theme.colors.muted || '#718096',
                          fontSize: theme.typography?.fontSize || '16px'
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Không spam</span>
                      </div>
                      <div 
                        className="flex items-center"
                        style={{ 
                          color: content.textColor || theme.colors.muted || '#718096',
                          fontSize: theme.typography?.fontSize || '16px'
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        <span>Tải về ngay</span>
                      </div>
                    </div>
                  </div>
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