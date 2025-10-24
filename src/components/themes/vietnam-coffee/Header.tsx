'use client'

import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Coffee } from "lucide-react";
import { useState } from "react";
import { ThemeParams } from "@/types";
import Image from "next/image";


interface HeaderContent {
  title?: string;
  subtitle?: string;
  logo?: string;
  logoSize?: 'small' | 'medium' | 'large' | 'xlarge';
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  colorMode?: 'theme' | 'custom';
  navigation?: Array<{ name: string; href: string }>;
  socialLinks?: Array<{ platform: string; url: string; icon?: string }>;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

interface HeaderProps {
  theme: ThemeParams;
  content: HeaderContent;
}

const Header = ({ theme, content }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get project language from theme or default to vietnamese
  const projectLanguage = theme?.projectLanguage || 'vietnamese';

  // Get localized text based on project language
  const getLocalizedText = () => {
    if (projectLanguage === 'english') {
      return {
        home: "Home",
        about: "About Us",
        products: "Products",
        resources: "Resources",
        contact: "Contact",
        freeConsultation: "Free Consultation"
      };
    } else {
      return {
        home: "Trang chủ",
        about: "Về chúng tôi",
        products: "Sản phẩm",
        resources: "Tài nguyên",
        contact: "Liên hệ",
        freeConsultation: "Tư vấn miễn phí"
      };
    }
  };

  const localizedText = getLocalizedText();


  // Get typography styles
  const getTypographyStyles = () => {
    return {
      fontFamily: theme.typography?.fontFamily || 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
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

  // Get logo size classes
  const getLogoSizeClasses = () => {
    switch (content.logoSize) {
      case 'small':
        return 'w-8 h-8'
      case 'large':
        return 'w-20 h-20'
      case 'xlarge':
        return 'w-24 h-24'
      case 'medium':
      default:
        return 'w-16 h-16'
    }
  }

  // Get logo icon size
  const getLogoIconSize = () => {
    switch (content.logoSize) {
      case 'small':
        return 20
      case 'large':
        return 40
      case 'xlarge':
        return 48
      case 'medium':
      default:
        return 32
    }
  }

  // Get button styles based on component settings
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

  // Use navigation from content if available, otherwise fallback to default
  const navigation = content.navigation && content.navigation.length > 0 
    ? content.navigation 
    : [
        { name: localizedText.home, href: "#home" },
        { name: localizedText.about, href: "#about" },
        { name: localizedText.products, href: "#products" },
        { name: localizedText.resources, href: "#resources" },
        { name: localizedText.contact, href: "#contact" }
      ];

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b transition-all duration-300"
      style={{ 
        backgroundColor: content.colorMode === 'custom' && content.backgroundColor 
          ? content.backgroundColor 
          : theme.sections?.header?.backgroundColor || theme.colors.secondary || '#FFFFFF',
        borderColor: content.colorMode === 'custom' && content.primaryColor 
          ? content.primaryColor 
          : theme.colors?.border || theme.colors?.primary,
        color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
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
          <div className="flex items-center space-x-3">
            {content.logo ? (
              <div className={`relative ${getLogoSizeClasses()}`}>
                <Image 
                  src={content.logo} 
                  alt="Logo"
                  fill
                  sizes={content.logoSize === 'small' ? '32px' : 
                         content.logoSize === 'large' ? '80px' : 
                         content.logoSize === 'xlarge' ? '96px' : '64px'}
                  className={`object-contain ${getBorderRadiusClass()}`}
                  priority
                  quality={90}
                />
              </div>
            ) : (
              <div 
                className={`${getLogoSizeClasses()} flex items-center justify-center ${getBorderRadiusClass()}`}
                style={{ backgroundColor: theme.colors.accent }}
              >
                <Coffee className="text-white" size={getLogoIconSize()} />
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
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-6">
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                    style={{ 
                      color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                      fontSize: theme.typography?.fontSize || '16px'
                    }}
                  >
                    {item.name}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Social Links */}
            {content.socialLinks && content.socialLinks.length > 0 && (
              <div className="flex items-center space-x-2">
                {content.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                    style={{ 
                      color: content.textColor || theme.colors.text,
                      fontSize: theme.typography?.fontSize || '16px'
                    }}
                    title={link.platform}
                  >
                    {link.icon ? (
                      <span className="text-lg">{link.icon}</span>
                    ) : (
                      <span className="text-sm font-medium">{link.platform}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
            
            {/* Contact Button */}
            <Button 
              size="sm"
              style={{ 
                backgroundColor: content.colorMode === 'custom' && content.primaryColor 
                  ? content.primaryColor 
                  : theme.colors.primary 
              }}
              className="hover:opacity-90 transition-colors"
            >
              <Phone size={16} />
              {content.contactInfo?.phone || localizedText.freeConsultation}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                style={{ 
                  color: content.textColor || theme.colors.text,
                  ...getTypographyStyles()
                }}
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-80"
              style={{ 
                backgroundColor: content.colorMode === 'custom' && content.backgroundColor 
                  ? content.backgroundColor 
                  : theme.sections?.header?.backgroundColor || theme.colors.secondary,
                color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                borderColor: content.colorMode === 'custom' && content.primaryColor 
                  ? content.primaryColor 
                  : theme.colors?.border || theme.colors?.primary,
                ...getTypographyStyles()
              }}
            >
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    style={{ 
                      color: content.textColor || theme.colors.text,
                      fontSize: theme.typography?.fontSize || '16px'
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div 
                  className="border-t pt-4 space-y-3"
                  style={{ borderColor: theme.colors?.border || theme.colors?.primary }}
                >
                  {/* Social Links in Mobile */}
                  {content.socialLinks && content.socialLinks.length > 0 && (
                    <div className="flex items-center justify-center space-x-4">
                      {content.socialLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground hover:text-primary transition-colors"
                          style={{ 
                            color: content.textColor || theme.colors.text,
                            fontSize: theme.typography?.fontSize || '16px'
                          }}
                          title={link.platform}
                        >
                          {link.icon ? (
                            <span className="text-xl">{link.icon}</span>
                          ) : (
                            <span className="text-sm font-medium">{link.platform}</span>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    className="w-full"
                    style={{...getButtonStyles('premium'), backgroundColor: theme.colors.primary}}
                  >
                    <Phone size={16} />
                    {content.contactInfo?.phone || localizedText.freeConsultation}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header; 