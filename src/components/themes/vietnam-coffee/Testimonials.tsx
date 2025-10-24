"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { ThemeParams } from "@/types";
import { cn } from "@/lib/utils";

interface Testimonial {
  id?: string;
  name: string;
  title: string;
  company: string;
  content: string;
  rating?: number;
  image?: string;
}

interface TestimonialsContent {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  colorMode?: 'theme' | 'custom';
  primaryColor?: string;
  titleSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  titleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  titleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  subtitleSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  subtitleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  subtitleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  testimonials?: Testimonial[];
  stats?: Array<{ number: string; label: string; sublabel?: string }>;
}

interface TestimonialsProps {
  theme: ThemeParams;
  content: TestimonialsContent;
}

const Testimonials = ({ theme, content }: TestimonialsProps) => {
  // Get project language from theme or default to vietnamese
  const projectLanguage = theme?.projectLanguage || 'vietnamese';

  // Get localized text based on project language
  const getLocalizedText = () => {
    if (projectLanguage === 'english') {
      return {
        numbersSpeak: "The Numbers Speak for Themselves"
      };
    } else {
      return {
        numbersSpeak: "Những Con Số Nói Lên Tất Cả"
      };
    }
  };

  const localizedText = getLocalizedText();

  // Default testimonials data
  const defaultTestimonials: Testimonial[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      title: "Coffee Buyer",
      company: "Starbucks Reserve",
      content:
        "Chất lượng cà phê Việt Nam vượt trội hơn mong đợi. Hương vị đậm đà và quy trình sản xuất rất chuyên nghiệp.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "Quality Manager",
      company: "Blue Bottle Coffee",
      content:
        "Đối tác tin cậy với cam kết chất lượng cao. Giao hàng đúng hạn và dịch vụ khách hàng xuất sắc.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: "3",
      name: "David Rodriguez",
      title: "Import Director",
      company: "Intelligentsia",
      content:
        "Cà phê Robusta Việt Nam có hương vị độc đáo, phù hợp hoàn hảo cho blend espresso của chúng tôi.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    },
  ];



  const defaultStats = [
    { number: "500+", label: "Lô hàng xuất khẩu", sublabel: "Cà phê chất lượng cao" },
    { number: "200+", label: "Khách hàng tin tưởng", sublabel: "Từ 25 tiểu bang Mỹ" },
    { number: "15+", label: "Năm kinh nghiệm", sublabel: "Thị trường quốc tế" },
    { number: "98%", label: "Tỷ lệ hài lòng", sublabel: "Khách hàng đánh giá" },
  ];

  // Handle testimonials data - convert string values to objects if needed
  let testimonials = content.testimonials || defaultTestimonials;
  if (testimonials && Array.isArray(testimonials)) {
    testimonials = testimonials.map(testimonial => {
      if (typeof testimonial === 'string') {
        return {
          id: Math.random().toString(),
          name: testimonial,
          title: '',
          company: '',
          content: '',
          rating: 5,
          image: ''
        };
      }
      return testimonial;
    });
  }
  

  
  // Handle stats data - convert string values to objects if needed
  let stats = content.stats || defaultStats;
  if (stats && Array.isArray(stats)) {
    stats = stats.map(stat => {
      if (typeof stat === 'string') {
        return { number: stat, label: '', sublabel: '' };
      }
      return stat;
    });
  }

  // Get typography styles
  const getTypographyStyles = () => {
    return {
      fontFamily:
        theme.typography?.fontFamily ||
        'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontSize: theme.typography?.fontSize || "16px",
      lineHeight: theme.typography?.lineHeight || "1.6",
      fontWeight: theme.typography?.fontWeight || "400",
    };
  };

  // Get border radius class
  const getBorderRadiusClass = () => {
    switch (theme.layout?.borderRadius) {
      case "none":
        return "rounded-none";
      case "small":
        return "rounded-sm";
      case "large":
        return "rounded-lg";
      case "medium":
      default:
        return "rounded-md";
    }
  };

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

  // Get subtitle size from content
  const getSubtitleSize = () => {
    const size = content.subtitleSize || theme.typography?.bodySize || 'base';
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

  // Get subtitle weight from content
  const getSubtitleWeight = () => {
    const weight = content.subtitleWeight || theme.typography?.fontWeight || 'normal';
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

  // Get subtitle font from content
  const getSubtitleFont = () => {
    const font = content.subtitleFont || theme.typography?.fontFamily || 'inter';
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

  // Client logos data
  const clientLogos = [
    { name: "Starbucks Reserve", logo: "SR" },
    { name: "Blue Bottle Coffee", logo: "BB" },
    { name: "Intelligentsia", logo: "IN" },
    { name: "Peet's Coffee", logo: "PC" },
    { name: "Caribou Coffee", logo: "CC" },
    { name: "Dunkin' Donuts", logo: "DD" }
  ];

  return (
    <section
      className="py-20"
      style={{
        backgroundColor: content.colorMode === 'custom' && content.backgroundColor 
          ? content.backgroundColor 
          : theme.sections?.testimonials?.backgroundColor || theme.colors.background || "#F8F9FA",
        color: content.colorMode === 'custom' && content.textColor 
          ? content.textColor 
          : theme.sections?.testimonials?.textColor || theme.colors.text || "#2D3748",
        ...getTypographyStyles(),
      }}
    >
      <div
        className="container mx-auto px-4"
        style={{
          maxWidth: theme.layout?.containerWidth || "1200px",
        }}
      >
        {/* Header Section - chỉ hiển thị khi có title hoặc subtitle */}
        {((content.title && content.title.trim()) || (content.subtitle && content.subtitle.trim())) && (
          <div className="text-center mb-16">
            {(content.title && content.title.trim()) && (
              <h2
                className={cn("mb-4", getTitleSize(), getTitleWeight(), getTitleFont())}
                style={{
                  color: content.colorMode === 'custom' && content.textColor 
                    ? content.textColor 
                    : theme.colors?.text || "#2D3748",
                }}
              >
                {content.title}
              </h2>
            )}
            {(content.subtitle && content.subtitle.trim()) && (
              <p
                className={cn("max-w-3xl mx-auto", getSubtitleSize(), getSubtitleWeight(), getSubtitleFont())}
                style={{
                  color: content.colorMode === 'custom' && content.textColor 
                    ? `${content.textColor}E6` 
                    : theme.colors?.muted || "#718096",
                }}
              >
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Testimonials Grid - chỉ hiển thị khi có testimonials */}
        {testimonials && testimonials.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={cn("shadow-card hover:shadow-elegant transition-all duration-300 border-border/50", getBorderRadiusClass())}
                style={{
                  fontFamily: theme.typography?.fontFamily || 'Inter',
                  fontSize: theme.typography?.fontSize || '16px'
                }}
              >
                <CardContent className="p-8">
                  <div className="mb-6">
                    <Quote 
                      className="h-8 w-8 mb-4" 
                      style={{ color: theme.colors?.primary || "#8B4513" }}
                    />
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-current"
                          style={{ color: theme.colors?.accent || "#CD853F" }}
                        />
                      ))}
                    </div>
                    {(testimonial.content && testimonial.content.trim()) && (
                      <p
                        className="leading-relaxed italic"
                        style={{
                          color: content.textColor || theme.colors?.text || "#2D3748",
                        }}
                      >
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <img
                      src={testimonial.image && testimonial.image.startsWith('/uploads/') 
                        ? testimonial.image 
                        : testimonial.image || `https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face`}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      {(testimonial.name && testimonial.name.trim()) && (
                        <div 
                          className="font-semibold"
                          style={{ color: content.textColor || theme.colors?.text || "#2D3748" }}
                        >
                          {testimonial.name}
                        </div>
                      )}
                      {(testimonial.title && testimonial.title.trim()) && (
                        <div 
                          className="text-sm"
                          style={{ color: content.textColor || theme.colors?.muted || "#718096" }}
                        >
                          {testimonial.title}
                        </div>
                      )}
                      {(testimonial.company && testimonial.company.trim()) && (
                        <div 
                          className="text-sm font-medium"
                          style={{ color: theme.colors?.primary || "#8B4513" }}
                        >
                          {testimonial.company}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}



        {/* Client Logos */}
        {/* <div className="mb-20">
          <h3 
            className={cn("text-2xl font-bold text-center mb-8")}
            style={{ color: content.textColor || theme.colors?.text || "#2D3748" }}
          >
            Được Tin Tưởng Bởi Các Thương Hiệu Hàng Đầu
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {clientLogos.map((client, index) => (
              <div
                key={index}
                className={cn("flex items-center justify-center w-20 h-20 rounded-lg shadow-sm hover:shadow-md transition-shadow", getBorderRadiusClass())}
                style={{ 
                  backgroundColor: theme.colors?.background || "#FFFFFF",
                  border: `1px solid ${theme.colors?.border || "#E2E8F0"}`
                }}
              >
                <span 
                  className="text-lg font-bold"
                  style={{ color: theme.colors?.primary || "#8B4513" }}
                >
                  {client.logo}
                </span>
              </div>
            ))}
          </div>
        </div> */}

        {/* Key Metrics - chỉ hiển thị khi có stats */}
        {stats && stats.length > 0 && (
          <Card 
            className={cn("border-0 shadow-elegant", getBorderRadiusClass())}
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors?.primary || "#8B4513"}, ${theme.colors?.accent || "#CD853F"})`,
              color: "#FFFFFF"
            }}
          >
            <CardContent className="p-12">
              <h3 
                className={cn("text-3xl font-bold text-center mb-12")}
                style={{ color: "#FFFFFF" }}
              >
                {localizedText.numbersSpeak}
              </h3>
              <div className="grid md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    {(stat.number && stat.number.trim()) && (
                      <div 
                        className={cn("text-4xl font-bold mb-2")}
                        style={{ color: "#FFFFFF" }}
                      >
                        {stat.number}
                      </div>
                    )}
                    {(stat.label && stat.label.trim()) && (
                      <div 
                        className={cn("text-xl font-semibold mb-1 opacity-90")}
                        style={{ color: "#FFFFFF" }}
                      >
                        {stat.label}
                      </div>
                    )}
                    {(stat.sublabel && stat.sublabel.trim()) && (
                      <div 
                        className={cn("text-sm opacity-75")}
                        style={{ color: "#FFFFFF" }}
                      >
                        {stat.sublabel}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
