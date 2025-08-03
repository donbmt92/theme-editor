'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin, Coffee } from "lucide-react";
import { ThemeParams } from "@/types";
import Image from "next/image";

interface FooterContent {
  companyName?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  logo?: string;
}

interface FooterProps {
  theme: ThemeParams;
  content: FooterContent;
}

const Footer = ({ theme, content }: FooterProps) => {
  // Get typography styles - same as Header
  const getTypographyStyles = () => {
    return {
      fontFamily: theme.typography?.fontFamily || 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontSize: theme.typography?.fontSize || '16px',
      lineHeight: theme.typography?.lineHeight || '1.6',
      fontWeight: theme.typography?.fontWeight || '400',
    }
  }

  // Get border radius class - same as Header
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

  // Get button styles based on component settings - same as Header
  const getButtonStyles = (variant: 'outline' | 'premium' = 'outline') => {
    const baseStyles = {
      fontFamily: theme.typography?.fontFamily || 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontSize: theme.typography?.fontSize || '16px',
      fontWeight: theme.typography?.fontWeight || '400',
    }

    if (variant === 'outline') {
      return {
        ...baseStyles,
        borderColor: theme.colors?.border || theme.colors?.primary,
        color: content.textColor || theme.colors?.text,
        borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
      }
    }

    return {
      ...baseStyles,
      backgroundColor: theme.colors?.accent,
      color: theme.colors?.text,
      borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
    }
  }

  // Get heading size based on typography settings
  const getHeadingSize = () => {
    switch (theme.typography?.headingSize) {
      case 'sm':
        return 'text-base'
      case 'base':
        return 'text-lg'
      case 'lg':
        return 'text-xl'
      case 'xl':
        return 'text-2xl'
      case '3xl':
        return 'text-3xl'
      case '2xl':
      default:
        return 'text-xl'
    }
  }

  // Get body text size based on typography settings
  const getBodySize = () => {
    switch (theme.typography?.bodySize) {
      case 'xs':
        return 'text-xs'
      case 'sm':
        return 'text-sm'
      case 'lg':
        return 'text-base'
      case 'xl':
        return 'text-lg'
      case 'base':
      default:
        return 'text-sm'
    }
  }

  return (
    <footer 
      id="contact"
      className={`backdrop-blur-sm border-t z-50 shadow-lg ${getBorderRadiusClass()}`}
      style={{ 
        backgroundColor: content.backgroundColor || theme.sections?.header?.backgroundColor || theme.colors.secondary,
        color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
        borderColor: theme.colors?.border || theme.colors?.primary,
        ...getTypographyStyles()
      }}
    >
      <div 
        className="px-4 py-4"
        style={{
          maxWidth: theme.layout?.containerWidth || '1200px',
          margin: '0 auto'
        }}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              {content.logo ? (
                <div className="relative w-10 h-10">
                  <Image 
                    src={content.logo} 
                    alt="Footer Logo"
                    fill
                    sizes="40px"
                    className={`object-contain ${getBorderRadiusClass()}`}
                    quality={90}
                  />
                </div>
              ) : (
                <div 
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getBorderRadiusClass()}`}
                  style={{ backgroundColor: theme.colors.accent }}
                >
                  <Coffee className="text-white" size={24} />
                </div>
              )}
              <div>
                <h3 
                  className={`font-bold ${getHeadingSize()}`}
                  style={{ 
                    color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                    fontWeight: theme.typography?.fontWeight || '700'
                  }}
                >
                  {content.companyName}
                </h3>
                <p 
                  className={getBodySize()}
                  style={{ 
                    color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                    fontSize: theme.typography?.bodySize === 'sm' ? '0.875rem' : '0.75rem'
                  }}
                >
                  Premium Export Coffee
                </p>
              </div>
            </div>
            <p 
              className={`leading-relaxed ${getBodySize()}`}
              style={{ 
                color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                lineHeight: theme.typography?.lineHeight || '1.6'
              }}
            >
              {content.description}
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:bg-opacity-20"
                style={getButtonStyles('outline')}
              >
                <Facebook size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:bg-opacity-20"
                style={getButtonStyles('outline')}
              >
                <Linkedin size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:bg-opacity-20"
                style={getButtonStyles('outline')}
              >
                <Twitter size={20} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 
              className={`font-semibold mb-4 ${getHeadingSize()}`}
              style={{ 
                color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                fontWeight: theme.typography?.fontWeight || '600'
              }}
            >
              Liên Kết Nhanh
            </h4>
            <ul className={`space-y-3 ${getBodySize()}`}>
              <li>
                <a 
                  href="#about" 
                  className="hover:opacity-80 transition-colors"
                  style={{ 
                    color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                    fontSize: theme.typography?.fontSize || '16px'
                  }}
                >
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a 
                  href="#products" 
                  className="hover:opacity-80 transition-colors"
                  style={{ 
                    color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                    fontSize: theme.typography?.fontSize || '16px'
                  }}
                >
                  Sản phẩm & Dịch vụ
                </a>
              </li>
              <li>
                <a 
                  href="#resources" 
                  className="hover:opacity-80 transition-colors"
                  style={{ 
                    color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                    fontSize: theme.typography?.fontSize || '16px'
                  }}
                >
                  Tài nguyên
                </a>
              </li>
              <li>
                <a 
                  href="#blog" 
                  className="hover:opacity-80 transition-colors"
                  style={{ 
                    color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                    fontSize: theme.typography?.fontSize || '16px'
                  }}
                >
                  Blog
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="hover:opacity-80 transition-colors"
                  style={{ 
                    color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                    fontSize: theme.typography?.fontSize || '16px'
                  }}
                >
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 
              className={`font-semibold mb-4 ${getHeadingSize()}`}
              style={{ 
                color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                fontWeight: theme.typography?.fontWeight || '600'
              }}
            >
              Dịch Vụ
            </h4>
            <ul className={`space-y-3 ${getBodySize()}`}>
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ 
                    color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                    fontSize: theme.typography?.fontSize || '16px'
                  }}
                >
                  Xuất khẩu cà phê
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ 
                    color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                    fontSize: theme.typography?.fontSize || '16px'
                  }}
                >
                  Logistics & Vận chuyển
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ 
                    color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                    fontSize: theme.typography?.fontSize || '16px'
                  }}
                >
                  Tư vấn thủ tục
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ 
                    color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                    fontSize: theme.typography?.fontSize || '16px'
                  }}
                >
                  Đào tạo & Phát triển
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ 
                    color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                    fontSize: theme.typography?.fontSize || '16px'
                  }}
                >
                  Kiểm soát chất lượng
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 
              className={`font-semibold mb-4 ${getHeadingSize()}`}
              style={{ 
                color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                fontWeight: theme.typography?.fontWeight || '600'
              }}
            >
              Liên Hệ
            </h4>
            <div className={`space-y-3 mb-6 ${getBodySize()}`}>
              <div className="flex items-center space-x-3">
                <MapPin size={16} style={{ color: theme.colors.accent }} />
                <span style={{ 
                  color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                  fontSize: theme.typography?.fontSize || '16px'
                }}>
                  {content.contact?.address}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} style={{ color: theme.colors.accent }} />
                <span style={{ 
                  color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                  fontSize: theme.typography?.fontSize || '16px'
                }}>
                  {content.contact?.phone}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} style={{ color: theme.colors.accent }} />
                <span style={{ 
                  color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                  fontSize: theme.typography?.fontSize || '16px'
                }}>
                  {content.contact?.email}
                </span>
              </div>
            </div>

            <div>
              <h5 
                className={`font-semibold mb-3 ${getHeadingSize()}`}
                style={{ 
                  color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                  fontWeight: theme.typography?.fontWeight || '600'
                }}
              >
                Nhận tin tức mới nhất
              </h5>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Email của bạn"
                  className="placeholder:opacity-60"
                  style={{ 
                    backgroundColor: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}1A`,
                    borderColor: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}33`,
                    color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                    borderRadius: getBorderRadiusClass().replace('rounded-', ''),
                    fontFamily: theme.typography?.fontFamily || 'Inter',
                    fontSize: theme.typography?.fontSize || '16px'
                  }}
                />
                <Button 
                  variant="premium" 
                  size="sm"
                  style={getButtonStyles('premium')}
                >
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="border-t mt-12 pt-8"
          style={{ borderColor: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}33` }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div 
              className={getBodySize()}
              style={{ 
                color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                fontSize: theme.typography?.fontSize || '16px'
              }}
            >
              © 2024 {content.companyName}. Tất cả quyền được bảo lưu.
            </div>
            <div className={`flex space-x-6 ${getBodySize()}`}>
              <a 
                href="#" 
                className="hover:opacity-80 transition-colors"
                style={{ 
                  color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                  fontSize: theme.typography?.fontSize || '16px'
                }}
              >
                Chính sách bảo mật
              </a>
              <a 
                href="#" 
                className="hover:opacity-80 transition-colors"
                style={{ 
                  color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                  fontSize: theme.typography?.fontSize || '16px'
                }}
              >
                Điều khoản sử dụng
              </a>
              <a 
                href="#" 
                className="hover:opacity-80 transition-colors"
                style={{ 
                  color: `${content.textColor || theme.sections?.header?.textColor || theme.colors.text}CC`,
                  fontSize: theme.typography?.fontSize || '16px'
                }}
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
