'use client'

import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { ThemeParams } from "@/types";

interface HeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  image?: string;
  backgroundColor?: string;
  textColor?: string;
  overlayColor?: string;
}

interface HeroSectionProps {
  theme: ThemeParams;
  content: HeroContent;
}

const HeroSection = ({ theme, content }: HeroSectionProps) => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: content.backgroundColor || theme.sections?.hero?.backgroundColor || theme.colors.background }}
    >
      {/* Background Image */}
      {content.image && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${content.image})` }}
        >
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: content.overlayColor || theme.sections?.hero?.overlayColor || 'rgba(139, 69, 19, 0.7)' }}
          ></div>
        </div>
      )}

      {/* Content */}
      <div 
        className="relative z-10 container mx-auto px-4 text-center"
        style={{ color: content.textColor || theme.sections?.hero?.textColor || theme.colors.text }}
      >
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {content.title || "Cà Phê Việt Nam - Chất Lượng Quốc Tế"}
            <span 
              className="block bg-gradient-to-r bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(to right, ${theme.colors.accent}, ${theme.colors.primary})`
              }}
            >
              {content.subtitle || "Xuất khẩu cà phê chất lượng cao"}
            </span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
            style={{ color: `${content.textColor || '#FFFFFF'}E6` }}
          >
            {content.description || "Chúng tôi chuyên cung cấp các loại cà phê Việt Nam chất lượng cao cho thị trường quốc tế, đảm bảo hương vị đặc trưng và tiêu chuẩn xuất khẩu."}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              variant="hero" 
              size="lg" 
              className="group"
              style={{
                backgroundColor: theme.colors.accent,
                color: theme.colors.text
              }}
            >
              {content.ctaText || "Tìm hiểu thêm"}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 hover:bg-white hover:text-gray-900"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.3)',
                color: content.textColor || '#FFFFFF'
              }}
            >
              <Download size={20} />
              Hướng dẫn XNK từ A-Z
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div 
                className="text-3xl font-bold mb-2"
                style={{ color: theme.colors.accent }}
              >
                500+
              </div>
              <div 
                className="text-sm"
                style={{ color: `${content.textColor || '#FFFFFF'}CC` }}
              >
                Đơn hàng thành công
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div 
                className="text-3xl font-bold mb-2"
                style={{ color: theme.colors.accent }}
              >
                15
              </div>
              <div 
                className="text-sm"
                style={{ color: `${content.textColor || '#FFFFFF'}CC` }}
              >
                Năm kinh nghiệm
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div 
                className="text-3xl font-bold mb-2"
                style={{ color: theme.colors.accent }}
              >
                100+
              </div>
              <div 
                className="text-sm"
                style={{ color: `${content.textColor || '#FFFFFF'}CC` }}
              >
                Đối tác Mỹ
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div 
                className="text-3xl font-bold mb-2"
                style={{ color: theme.colors.accent }}
              >
                24/7
              </div>
              <div 
                className="text-sm"
                style={{ color: `${content.textColor || '#FFFFFF'}CC` }}
              >
                Hỗ trợ khách hàng
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        style={{ color: `${content.textColor || '#FFFFFF'}99` }}
      >
        <div className="w-6 h-10 border-2 rounded-full flex justify-center" style={{ borderColor: `${content.textColor || '#FFFFFF'}4D` }}>
          <div 
            className="w-1 h-3 rounded-full mt-2 animate-pulse"
            style={{ backgroundColor: `${content.textColor || '#FFFFFF'}99` }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 