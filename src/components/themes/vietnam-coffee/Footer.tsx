'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { ThemeParams } from "@/types";
import { cn } from "@/lib/utils";

interface FooterContent {
  companyName?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  colorMode?: 'theme' | 'custom';
  primaryColor?: string;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
    businessHours?: string;
  };
  quickLinks?: Array<{ name: string; href: string }>;
  resources?: Array<{ name: string; href: string }>;
  legal?: Array<{ name: string; href: string }>;
  socialLinks?: Array<{ icon: string; href: string; label: string }>;
}

interface FooterProps {
  theme: ThemeParams;
  content: FooterContent;
}

const Footer = ({ theme, content }: FooterProps) => {
  // Get project language from theme or default to vietnamese
  const projectLanguage = theme?.projectLanguage || 'vietnamese';

  // Get localized text based on project language
  const getLocalizedText = () => {
    if (projectLanguage === 'english') {
      return {
        quickLinks: [
          { name: "About Us", href: "#about" },
          { name: "Products", href: "#products" },
          { name: "Export Services", href: "#services" },
          { name: "Quality Assurance", href: "#quality" },
          { name: "Contact", href: "#contact" }
        ],
        resources: [
          { name: "Import/Export Guide", href: "#guide" },
          { name: "Market Reports", href: "#reports" },
          { name: "Documents", href: "#docs" },
          { name: "FAQ", href: "#faq" },
          { name: "Blog", href: "#blog" }
        ],
        legal: [
          { name: "Privacy Policy", href: "#privacy" },
          { name: "Terms of Service", href: "#terms" },
          { name: "Cookie Policy", href: "#cookies" },
          { name: "Compliance", href: "#compliance" }
        ]
      };
    } else {
      return {
        quickLinks: [
          { name: "Về Chúng Tôi", href: "#about" },
          { name: "Sản Phẩm", href: "#products" },
          { name: "Dịch Vụ Xuất Khẩu", href: "#services" },
          { name: "Đảm Bảo Chất Lượng", href: "#quality" },
          { name: "Liên Hệ", href: "#contact" }
        ],
        resources: [
          { name: "Hướng Dẫn Xuất/Nhập Khẩu", href: "#guide" },
          { name: "Báo Cáo Thị Trường", href: "#reports" },
          { name: "Tài Liệu", href: "#docs" },
          { name: "FAQ", href: "#faq" },
          { name: "Blog", href: "#blog" }
        ],
        legal: [
          { name: "Chính Sách Bảo Mật", href: "#privacy" },
          { name: "Điều Khoản Dịch Vụ", href: "#terms" },
          { name: "Chính Sách Cookie", href: "#cookies" },
          { name: "Tuân Thủ", href: "#compliance" }
        ]
      };
    }
  };

  const localizedText = getLocalizedText();

  // Default data
  const defaultQuickLinks = localizedText.quickLinks;
  const defaultResources = localizedText.resources;
  const defaultLegal = localizedText.legal;

  const defaultSocialLinks = [
    { icon: "Facebook", href: "#", label: "Facebook" },
    { icon: "Twitter", href: "#", label: "Twitter" },
    { icon: "Linkedin", href: "#", label: "LinkedIn" },
    { icon: "Youtube", href: "#", label: "YouTube" }
  ];

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
  const getButtonStyles = (variant: 'outline' | 'primary' = 'primary') => {
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
      backgroundColor: theme.colors.primary,
      color: '#FFFFFF',
      borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
    }
  }

  // Get social icon component
  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Facebook':
        return Facebook;
      case 'Twitter':
        return Twitter;
      case 'Linkedin':
        return Linkedin;
      case 'Youtube':
        return Youtube;
      default:
        return Facebook;
    }
  }

  // Use content or defaults
  const quickLinks = content.quickLinks || defaultQuickLinks;
  const resources = content.resources || defaultResources;
  const legal = content.legal || defaultLegal;
  const socialLinks = content.socialLinks || defaultSocialLinks;

  return (
    <footer 
      id="contact"
      className="bg-secondary text-secondary-foreground"
      style={{ 
        backgroundColor: content.colorMode === 'custom' && content.backgroundColor 
          ? content.backgroundColor 
          : theme.sections?.footer?.backgroundColor || theme.colors.secondary || '#1F2937',
        color: content.colorMode === 'custom' && content.textColor 
          ? content.textColor 
          : theme.sections?.footer?.textColor || theme.colors.text || '#F9FAFB',
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
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div 
                  className={cn("h-8 w-8 rounded-full", getBorderRadiusClass())}
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
                  }}
                ></div>
                <span 
                  className="text-xl font-bold"
                  style={{ 
                    color: content.textColor || theme.colors.text || '#F9FAFB',
                    fontWeight: theme.typography?.fontWeight || '700'
                  }}
                >
                  {content.companyName || "VietCoffee Export"}
                </span>
              </div>
              <p 
                className="mb-6 leading-relaxed"
                style={{ 
                  color: `${content.textColor || theme.colors.text || '#F9FAFB'}80`,
                  fontSize: theme.typography?.fontSize || '16px',
                  lineHeight: theme.typography?.lineHeight || '1.6'
                }}
              >
                {content.description || "Đối tác tin cậy của bạn cho xuất khẩu cà phê Việt Nam cao cấp đến thị trường Mỹ. Chất lượng, độ tin cậy và dịch vụ xuất sắc từ năm 2009."}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin 
                    className="h-5 w-5 mt-0.5" 
                    style={{ color: theme.colors.primary }}
                  />
                  <div>
                    <div 
                      className="font-medium"
                      style={{ 
                        color: content.textColor || theme.colors.text || '#F9FAFB',
                        fontWeight: theme.typography?.fontWeight || '500'
                      }}
                    >
                      Văn Phòng Việt Nam
                    </div>
                    <div 
                      className="text-sm"
                      style={{ 
                        color: `${content.textColor || theme.colors.text || '#F9FAFB'}70`,
                        fontSize: theme.typography?.fontSize || '16px'
                      }}
                    >
                      {content.contact?.address || "123 Đường Xuất Khẩu, Tỉnh Bình Phước, Việt Nam"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone 
                    className="h-5 w-5" 
                    style={{ color: theme.colors.primary }}
                  />
                  <div>
                    <div 
                      className="font-medium"
                      style={{ 
                        color: content.textColor || theme.colors.text || '#F9FAFB',
                        fontWeight: theme.typography?.fontWeight || '500'
                      }}
                    >
                      {content.contact?.phone || "+1 (555) 123-4567"}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ 
                        color: `${content.textColor || theme.colors.text || '#F9FAFB'}70`,
                        fontSize: theme.typography?.fontSize || '16px'
                      }}
                    >
                      Giờ Làm Việc Mỹ
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail 
                    className="h-5 w-5" 
                    style={{ color: theme.colors.primary }}
                  />
                  <div>
                    <div 
                      className="font-medium"
                      style={{ 
                        color: content.textColor || theme.colors.text || '#F9FAFB',
                        fontWeight: theme.typography?.fontWeight || '500'
                      }}
                    >
                      {content.contact?.email || "info@vietcoffeeexport.com"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock 
                    className="h-5 w-5" 
                    style={{ color: theme.colors.primary }}
                  />
                  <div 
                    className="text-sm"
                    style={{ 
                      color: `${content.textColor || theme.colors.text || '#F9FAFB'}70`,
                      fontSize: theme.typography?.fontSize || '16px'
                    }}
                  >
                    {content.contact?.businessHours || "Thứ 2-Thứ 6: 8AM-6PM (EST)"}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 
                className="text-lg font-bold mb-6"
                style={{ 
                  color: content.textColor || theme.colors.text || '#F9FAFB',
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                Liên Kết Nhanh
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="hover:text-primary transition-colors"
                      style={{ 
                        color: `${content.textColor || theme.colors.text || '#F9FAFB'}80`,
                        fontSize: theme.typography?.fontSize || '16px'
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 
                className="text-lg font-bold mb-6"
                style={{ 
                  color: content.textColor || theme.colors.text || '#F9FAFB',
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                Tài Nguyên
              </h3>
              <ul className="space-y-3">
                {resources.map((resource, index) => (
                  <li key={index}>
                    <a
                      href={resource.href}
                      className="hover:text-primary transition-colors"
                      style={{ 
                        color: `${content.textColor || theme.colors.text || '#F9FAFB'}80`,
                        fontSize: theme.typography?.fontSize || '16px'
                      }}
                    >
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h3 
                className="text-lg font-bold mb-6"
                style={{ 
                  color: content.textColor || theme.colors.text || '#F9FAFB',
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                Kết Nối
              </h3>
              <p 
                className="mb-4"
                style={{ 
                  color: `${content.textColor || theme.colors.text || '#F9FAFB'}80`,
                  fontSize: theme.typography?.fontSize || '16px'
                }}
              >
                Nhận cập nhật thị trường hàng tuần và mẹo nhập khẩu gửi đến hộp thư của bạn.
              </p>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/50"
                  style={{ 
                    backgroundColor: `${content.textColor || theme.colors.text || '#F9FAFB'}10`,
                    borderColor: `${content.textColor || theme.colors.text || '#F9FAFB'}20`,
                    color: content.textColor || theme.colors.text || '#F9FAFB',
                    borderRadius: getBorderRadiusClass().replace('rounded-', ''),
                    fontFamily: theme.typography?.fontFamily || 'Inter',
                    fontSize: theme.typography?.fontSize || '16px'
                  }}
                />
                <Button 
                  className="w-full"
                  style={getButtonStyles('primary')}
                >
                  Đăng Ký
                </Button>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social, index) => {
                  const IconComponent = getSocialIcon(social.icon);
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-colors", getBorderRadiusClass())}
                      style={{ 
                        backgroundColor: `${content.textColor || theme.colors.text || '#F9FAFB'}10`,
                        color: `${content.textColor || theme.colors.text || '#F9FAFB'}70`
                      }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <Separator 
          className="bg-secondary-foreground/20"
          style={{ backgroundColor: `${content.textColor || theme.colors.text || '#F9FAFB'}20` }}
        />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div 
              className="text-sm"
              style={{ 
                color: `${content.textColor || theme.colors.text || '#F9FAFB'}70`,
                fontSize: theme.typography?.fontSize || '16px'
              }}
            >
              © 2024 {content.companyName || "VietCoffee Export"}. Tất cả quyền được bảo lưu.
            </div>
            
            <div className="flex flex-wrap gap-6">
              {legal.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-sm hover:text-primary transition-colors"
                  style={{ 
                    color: `${content.textColor || theme.colors.text || '#F9FAFB'}70`,
                    fontSize: theme.typography?.fontSize || '16px'
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
