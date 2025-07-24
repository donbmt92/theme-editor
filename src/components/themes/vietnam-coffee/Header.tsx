'use client'

import { Button } from "@/components/ui/button";
import { Menu, Phone, Download, Globe, Coffee } from "lucide-react";
import { useState } from "react";
import { ThemeParams } from "@/types";

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

  return (
    <header 
      className="backdrop-blur-sm border-b sticky top-0 z-50 shadow-lg"
      style={{ 
        backgroundColor: content.backgroundColor || theme.sections?.header?.backgroundColor || theme.colors.secondary,
        color: content.textColor || theme.sections?.header?.textColor || theme.colors.text,
        borderColor: theme.colors.border
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {content.logo ? (
              <img 
                src={content.logo} 
                alt="Logo"
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.colors.accent }}
              >
                <Coffee className="text-white" size={24} />
              </div>
            )}
            <div>
              <h1 
                className="text-xl font-bold" 
                style={{ color: content.textColor || theme.sections?.header?.textColor || theme.colors.text }}
              >
                {content.title || "Cà Phê Việt + Plus"}
              </h1>
              <p 
                className="text-xs opacity-80" 
                style={{ color: content.textColor || theme.sections?.header?.textColor || theme.colors.text }}
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
              style={{ color: content.textColor || theme.sections?.header?.textColor || theme.colors.text }}
            >
              Trang chủ
            </a>
            <a 
              href="#about" 
              className="hover:opacity-80 transition-colors"
              style={{ color: content.textColor || theme.sections?.header?.textColor || theme.colors.text }}
            >
              Về chúng tôi
            </a>
            <div className="relative group">
              <a 
                href="#products" 
                className="hover:opacity-80 transition-colors"
                style={{ color: content.textColor || theme.sections?.header?.textColor || theme.colors.text }}
              >
                Sản phẩm
              </a>
            </div>
            <a 
              href="#resources" 
              className="hover:opacity-80 transition-colors"
              style={{ color: content.textColor || theme.sections?.header?.textColor || theme.colors.text }}
            >
              Tài nguyên
            </a>
            <a 
              href="#contact" 
              className="hover:opacity-80 transition-colors"
              style={{ color: content.textColor || theme.sections?.header?.textColor || theme.colors.text }}
            >
              Liên hệ
            </a>
            <div className="flex items-center space-x-1" style={{ color: theme.colors.muted }}>
              <Globe size={16} />
              <span className="text-sm">VI | EN</span>
            </div>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              style={{
                borderColor: theme.colors.border,
                color: content.textColor || theme.colors.text
              }}
            >
              <Download size={16} />
              Cẩm nang XNK 2024
            </Button>
            <Button 
              variant="premium" 
              size="sm"
              style={{
                backgroundColor: theme.colors.accent,
                color: theme.colors.text
              }}
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
            style={{ color: content.textColor || theme.colors.text }}
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            className="md:hidden mt-4 pb-4 space-y-4 border-t pt-4 animate-fade-in"
            style={{ borderColor: theme.colors.border }}
          >
            <nav className="flex flex-col space-y-3">
              <a 
                href="#" 
                className="hover:opacity-80 transition-colors"
                style={{ color: content.textColor || theme.colors.text }}
              >
                Trang chủ
              </a>
              <a 
                href="#about" 
                className="hover:opacity-80 transition-colors"
                style={{ color: content.textColor || theme.colors.text }}
              >
                Về chúng tôi
              </a>
              <a 
                href="#products" 
                className="hover:opacity-80 transition-colors"
                style={{ color: content.textColor || theme.colors.text }}
              >
                Sản phẩm
              </a>
              <a 
                href="#resources" 
                className="hover:opacity-80 transition-colors"
                style={{ color: content.textColor || theme.colors.text }}
              >
                Tài nguyên
              </a>
              <a 
                href="#contact" 
                className="hover:opacity-80 transition-colors"
                style={{ color: content.textColor || theme.colors.text }}
              >
                Liên hệ
              </a>
            </nav>
            <div 
              className="flex flex-col space-y-2 pt-3 border-t"
              style={{ borderColor: theme.colors.border }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                style={{
                  borderColor: theme.colors.border,
                  color: content.textColor || theme.colors.text
                }}
              >
                <Download size={16} />
                Cẩm nang XNK 2024
              </Button>
              <Button 
                variant="premium" 
                size="sm" 
                className="w-full"
                style={{
                  backgroundColor: theme.colors.accent,
                  color: theme.colors.text
                }}
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