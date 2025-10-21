'use client'

import { Button } from "@/components/ui/button";
import { Menu, Phone, Download, Globe, Coffee } from "lucide-react";
import { useState } from "react";
import { ThemeParams } from "@/types";
import Image from "next/image";

interface HeaderContent {
  title?: string;
  subtitle?: string;
  logo?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface HeaderProps {
  theme: ThemeParams;
  content: HeaderContent;
}

const Header = ({ theme, content }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <header 
      className={`backdrop-blur-sm border-b sticky top-0 z-50 shadow-lg ${getBorderRadiusClass()}`}
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
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {content.logo ? (
              <div className="relative w-10 h-10">
                <Image 
                  src={content.logo} 
                  alt="Logo"
                  fill
                  sizes="40px"
                  className={`object-contain ${getBorderRadiusClass()}`}
                  priority
                  quality={90}
                />
              </div>
            ) : (
              <div 
                className={`w-10 h-10 flex items-center justify-center ${getBorderRadiusClass()}`}
                style={{ backgroundColor: theme.colors.accent }}
              >
                <Coffee className="text-white" size={24} />
              </div>
            )}
            <div>
              <h1 
                className="text-xl font-bold" 
                style={{ 
                  color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                  fontSize: theme.typography?.headingSize === '2xl' ? '1.5rem' : 
                           theme.typography?.headingSize === 'xl' ? '1.25rem' : '1.125rem',
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                {content.title || "Cà Phê Việt + Plus"}
              </h1>
              <p 
                className="text-xs opacity-80" 
                style={{ 
                  color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                  fontSize: theme.typography?.bodySize === 'sm' ? '0.875rem' : '0.75rem'
                }}
              >
                {content.subtitle || "Premium Export Coffee"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="hover:opacity-80 transition-colors"
              style={{ 
                color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                fontSize: theme.typography?.fontSize || '16px'
              }}
            >
              Trang chủ
            </a>
            <a 
              href="#about" 
              className="hover:opacity-80 transition-colors"
              style={{ 
                color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                fontSize: theme.typography?.fontSize || '16px'
              }}
            >
              Về chúng tôi
            </a>
            <div className="relative group">
              <a 
                href="#products" 
                className="hover:opacity-80 transition-colors"
                style={{ 
                  color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                  fontSize: theme.typography?.fontSize || '16px'
                }}
              >
                Sản phẩm
              </a>
            </div>
            <a 
              href="#resources" 
              className="hover:opacity-80 transition-colors"
              style={{ 
                color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                fontSize: theme.typography?.fontSize || '16px'
              }}
            >
              Tài nguyên
            </a>
            <a 
              href="#contact" 
              className="hover:opacity-80 transition-colors"
              style={{ 
                color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                fontSize: theme.typography?.fontSize || '16px'
              }}
            >
              Liên hệ
            </a>
          
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              style={getButtonStyles('outline')}
            >
              <Download size={16} />
              Cẩm nang XNK 2025
            </Button>
            <Button 
              variant="premium" 
              size="sm"
              style={getButtonStyles('premium')}
            >
              <Phone size={16} />
              Tư vấn miễn phí
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ 
              color: content.textColor || theme.colors.text,
              ...getTypographyStyles()
            }}
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            className="md:hidden mt-4 pb-4 space-y-4 border-t pt-4 animate-fade-in"
            style={{ 
              borderColor: theme.colors?.border || theme.colors?.primary,
              ...getTypographyStyles()
            }}
          >
            <nav className="flex flex-col space-y-3">
              <a 
                href="#" 
                className="hover:opacity-80 transition-colors"
                style={{ 
                  color: content.textColor || theme.colors.text,
                  fontSize: theme.typography?.fontSize || '16px'
                }}
              >
                Trang chủ
              </a>
              <a 
                href="#about" 
                className="hover:opacity-80 transition-colors"
                style={{ 
                  color: content.textColor || theme.colors.text,
                  fontSize: theme.typography?.fontSize || '16px'
                }}
              >
                Về chúng tôi
              </a>
              <a 
                href="#products" 
                className="hover:opacity-80 transition-colors"
                style={{ 
                  color: content.textColor || theme.colors.text,
                  fontSize: theme.typography?.fontSize || '16px'
                }}
              >
                Sản phẩm
              </a>
              <a 
                href="#resources" 
                className="hover:opacity-80 transition-colors"
                style={{ 
                  color: content.textColor || theme.colors.text,
                  fontSize: theme.typography?.fontSize || '16px'
                }}
              >
                Tài nguyên
              </a>
              <a 
                href="#contact" 
                className="hover:opacity-80 transition-colors"
                style={{ 
                  color: content.textColor || theme.colors.text,
                  fontSize: theme.typography?.fontSize || '16px'
                }}
              >
                Liên hệ
              </a>
            </nav>
            <div 
              className="flex flex-col space-y-2 pt-3 border-t"
              style={{ borderColor: theme.colors?.border || theme.colors?.primary }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                style={getButtonStyles('outline')}
              >
                <Download size={16} />
                Cẩm nang XNK 2025
              </Button>
              <Button 
                variant="premium" 
                size="sm" 
                className="w-full"
                style={getButtonStyles('premium')}
              >
                <Phone size={16} />
                Tư vấn miễn phí
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 