'use client'

import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Download, Globe, Coffee, ChevronDown } from "lucide-react";
import { useState } from "react";
import { ThemeParams } from "@/types";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
  const [isOpen, setIsOpen] = useState(false);

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

  const navigation = [
    { name: "Trang chủ", href: "#home" },
    { name: "Về chúng tôi", href: "#about" },
    { 
      name: "Sản phẩm", 
      href: "#products",
      dropdown: [
        { name: "Cà phê Robusta", href: "#robusta" },
        { name: "Cà phê Arabica", href: "#arabica" },
        { name: "Cà phê Chồn", href: "#weasel" },
        { name: "Cà phê Đặc biệt", href: "#specialty" }
      ]
    },
    {
      name: "Tài nguyên",
      href: "#resources",
      dropdown: [
        { name: "Cẩm nang XNK 2024", href: "#guide" },
        { name: "Thị trường", href: "#market" },
        { name: "Tài liệu", href: "#documentation" }
      ]
    },
    { name: "Liên hệ", href: "#contact" }
  ];

  return (
    <header 
      className={cn(
        "backdrop-blur-sm border-b sticky top-0 z-50 shadow-lg",
        getBorderRadiusClass()
      )}
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
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-6">
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.dropdown ? (
                    <>
                      <NavigationMenuTrigger 
                        className="text-foreground hover:text-primary transition-colors"
                        style={{ 
                          color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                          fontSize: theme.typography?.fontSize || '16px'
                        }}
                      >
                        {item.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-48 p-2">
                          {item.dropdown.map((subItem) => (
                            <NavigationMenuLink
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                            >
                              {subItem.name}
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
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
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              style={getButtonStyles('outline')}
            >
              <Download size={16} />
              Cẩm nang XNK 2024
            </Button>
            <Button 
              size="sm"
              style={{ backgroundColor: theme.colors.primary }}
              className="hover:opacity-90 transition-colors"
            >
              <Phone size={16} />
              Tư vấn miễn phí
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
                backgroundColor: content.backgroundColor || theme.sections?.header?.backgroundColor || theme.colors.secondary,
                color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
                borderColor: theme.colors?.border || theme.colors?.primary,
                ...getTypographyStyles()
              }}
            >
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <a
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
                    {item.dropdown && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                            style={{ 
                              color: content.textColor || theme.colors.text,
                              fontSize: theme.typography?.fontSize || '16px'
                            }}
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div 
                  className="border-t pt-4 space-y-3"
                  style={{ borderColor: theme.colors?.border || theme.colors?.primary }}
                >
                  <Button 
                    variant="outline" 
                    className="w-full"
                    style={getButtonStyles('outline')}
                  >
                    <Download size={16} />
                    Cẩm nang XNK 2024
                  </Button>
                  <Button 
                    className="w-full"
                    style={{...getButtonStyles('premium'), backgroundColor: theme.colors.primary}}
                  >
                    <Phone size={16} />
                    Tư vấn miễn phí
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