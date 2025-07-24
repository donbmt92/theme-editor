'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin, Coffee } from "lucide-react";
import { ThemeParams } from "@/types";

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
}

interface FooterProps {
  theme: ThemeParams;
  content: FooterContent;
}

const Footer = ({ theme, content }: FooterProps) => {
  return (
    <footer 
      id="contact"
      style={{ 
        backgroundColor: content.backgroundColor || theme.sections?.footer?.backgroundColor || theme.colors.secondary,
        color: content.textColor || theme.sections?.footer?.textColor || '#F9FAFB'
      }}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.colors.accent }}
              >
                <Coffee className="text-white" size={24} />
              </div>
              <div>
                <h3 
                  className="text-xl font-bold"
                  style={{ color: content.textColor || '#F9FAFB' }}
                >
                  {content.companyName}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
                >
                  Premium Export Coffee
                </p>
              </div>
            </div>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
            >
              {content.description}
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-opacity-20"
                style={{ 
                  color: content.textColor || '#F9FAFB',
                  backgroundColor: `${content.textColor || '#F9FAFB'}1A`
                }}
              >
                <Facebook size={20} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-opacity-20"
                style={{ 
                  color: content.textColor || '#F9FAFB',
                  backgroundColor: `${content.textColor || '#F9FAFB'}1A`
                }}
              >
                <Linkedin size={20} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-opacity-20"
                style={{ 
                  color: content.textColor || '#F9FAFB',
                  backgroundColor: `${content.textColor || '#F9FAFB'}1A`
                }}
              >
                <Twitter size={20} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 
              className="text-lg font-semibold mb-4"
              style={{ color: content.textColor || '#F9FAFB' }}
            >
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="#about" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
                >
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a 
                  href="#products" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
                >
                  Sản phẩm & Dịch vụ
                </a>
              </li>
              <li>
                <a 
                  href="#resources" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
                >
                  Tài nguyên
                </a>
              </li>
              <li>
                <a 
                  href="#blog" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
                >
                  Blog
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
                >
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 
              className="text-lg font-semibold mb-4"
              style={{ color: content.textColor || '#F9FAFB' }}
            >
              Dịch Vụ
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
                >
                  Xuất khẩu cà phê
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
                >
                  Logistics & Vận chuyển
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
                >
                  Tư vấn thủ tục
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
                >
                  Đào tạo & Phát triển
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
                >
                  Kiểm soát chất lượng
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 
              className="text-lg font-semibold mb-4"
              style={{ color: content.textColor || '#F9FAFB' }}
            >
              Liên Hệ
            </h4>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center space-x-3">
                <MapPin size={16} style={{ color: theme.colors.accent }} />
                <span style={{ color: `${content.textColor || '#F9FAFB'}CC` }}>
                  {content.contact?.address}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} style={{ color: theme.colors.accent }} />
                <span style={{ color: `${content.textColor || '#F9FAFB'}CC` }}>
                  {content.contact?.phone}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} style={{ color: theme.colors.accent }} />
                <span style={{ color: `${content.textColor || '#F9FAFB'}CC` }}>
                  {content.contact?.email}
                </span>
              </div>
            </div>

            <div>
              <h5 
                className="font-semibold mb-3"
                style={{ color: content.textColor || '#F9FAFB' }}
              >
                Nhận tin tức mới nhất
              </h5>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Email của bạn"
                  className="placeholder:opacity-60"
                  style={{ 
                    backgroundColor: `${content.textColor || '#F9FAFB'}1A`,
                    borderColor: `${content.textColor || '#F9FAFB'}33`,
                    color: content.textColor || '#F9FAFB'
                  }}
                />
                <Button 
                  variant="hero" 
                  size="sm"
                  style={{
                    backgroundColor: theme.colors.accent,
                    color: theme.colors.text
                  }}
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
          style={{ borderColor: `${content.textColor || '#F9FAFB'}33` }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div 
              className="text-sm"
              style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
            >
              © 2024 {content.companyName}. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-6 text-sm">
              <a 
                href="#" 
                className="hover:opacity-80 transition-colors"
                style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
              >
                Chính sách bảo mật
              </a>
              <a 
                href="#" 
                className="hover:opacity-80 transition-colors"
                style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
              >
                Điều khoản sử dụng
              </a>
              <a 
                href="#" 
                className="hover:opacity-80 transition-colors"
                style={{ color: `${content.textColor || '#F9FAFB'}CC` }}
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