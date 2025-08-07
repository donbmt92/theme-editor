"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { ThemeParams } from "@/types";
import Image from "next/image";
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
  testimonials?: Testimonial[];
  stats?: Array<{ number: string; label: string; sublabel?: string }>;
}

interface TestimonialsProps {
  theme: ThemeParams;
  content: TestimonialsContent;
}

const Testimonials = ({ theme, content }: TestimonialsProps) => {
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
        backgroundColor:
          content.backgroundColor || theme.colors?.background || "#F8F9FA",
        color: content.textColor || theme.colors?.text || "#2D3748",
        ...getTypographyStyles(),
      }}
    >
      <div
        className="container mx-auto px-4"
        style={{
          maxWidth: theme.layout?.containerWidth || "1200px",
        }}
      >
        <div className="text-center mb-16">
          <h2
            className={cn("text-4xl font-bold mb-4")}
            style={{
              color: content.textColor || theme.colors?.text || "#2D3748",
              fontWeight: theme.typography?.fontWeight || "700",
            }}
          >
            {content.title || "Được Tin Tưởng Bởi Các Nhà Nhập Khẩu Hàng Đầu"}
          </h2>
          <p
            className={cn("text-xl max-w-3xl mx-auto")}
            style={{
              color: content.textColor || theme.colors?.muted || "#718096",
            }}
          >
            {content.subtitle ||
              "Xem những gì khách hàng nói về trải nghiệm nhập khẩu cà phê Việt Nam cao cấp thông qua dịch vụ của chúng tôi."}
          </p>
        </div>

        {/* Testimonials Grid */}
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
                  <p
                    className="leading-relaxed italic"
                    style={{
                      color: content.textColor || theme.colors?.text || "#2D3748",
                    }}
                  >
                    "{testimonial.content || ''}"
                  </p>
                </div>
                
                <div className="flex items-center">
                  <img
                    src={testimonial.image || `https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face`}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div 
                      className="font-semibold"
                      style={{ color: content.textColor || theme.colors?.text || "#2D3748" }}
                    >
                      {testimonial.name || 'Unknown'}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: content.textColor || theme.colors?.muted || "#718096" }}
                    >
                      {testimonial.title || ''}
                    </div>
                    <div 
                      className="text-sm font-medium"
                      style={{ color: theme.colors?.primary || "#8B4513" }}
                    >
                      {testimonial.company || ''}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>



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

        {/* Key Metrics */}
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
              Những Con Số Nói Lên Tất Cả
            </h3>
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div 
                    className={cn("text-4xl font-bold mb-2")}
                    style={{ color: "#FFFFFF" }}
                  >
                    {stat.number || ''}
                  </div>
                  <div 
                    className={cn("text-xl font-semibold mb-1 opacity-90")}
                    style={{ color: "#FFFFFF" }}
                  >
                    {stat.label || ''}
                  </div>
                  <div 
                    className={cn("text-sm opacity-75")}
                    style={{ color: "#FFFFFF" }}
                  >
                    {stat.sublabel || ''}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Testimonials;
