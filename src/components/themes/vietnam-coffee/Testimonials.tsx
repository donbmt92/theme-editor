"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { ThemeParams } from "@/types";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatar: string; // This can be either image URL or initials
  avatarImage?: string; // New field for image URL
}

interface TestimonialsContent {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  testimonials?: Testimonial[];
  stats?: Array<{ number: string; label: string }>;
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
      position: "Coffee Buyer",
      company: "Starbucks Reserve",
      content:
        "Chất lượng cà phê Việt Nam vượt trội hơn mong đợi. Hương vị đậm đà và quy trình sản xuất rất chuyên nghiệp.",
      rating: 5,
      avatar: "SJ",
    },
    {
      id: "2",
      name: "Michael Chen",
      position: "Quality Manager",
      company: "Blue Bottle Coffee",
      content:
        "Đối tác tin cậy với cam kết chất lượng cao. Giao hàng đúng hạn và dịch vụ khách hàng xuất sắc.",
      rating: 5,
      avatar: "MC",
    },
    {
      id: "3",
      name: "David Rodriguez",
      position: "Import Director",
      company: "Intelligentsia",
      content:
        "Cà phê Robusta Việt Nam có hương vị độc đáo, phù hợp hoàn hảo cho blend espresso của chúng tôi.",
      rating: 5,
      avatar: "DR",
    },
  ];



  const defaultStats = [
    { number: "500+", label: "Lô hàng xuất khẩu" },
    { number: "200+", label: "Khách hàng tin tưởng" },
    { number: "15+", label: "Năm kinh nghiệm" },
    { number: "98%", label: "Tỷ lệ hài lòng" },
  ];

  // Handle testimonials data - convert string values to objects if needed
  let testimonials = content.testimonials || defaultTestimonials;
  if (testimonials && Array.isArray(testimonials)) {
    testimonials = testimonials.map(testimonial => {
      if (typeof testimonial === 'string') {
        return {
          id: Math.random().toString(),
          name: testimonial,
          position: '',
          company: '',
          content: '',
          rating: 5,
          avatar: '',
          avatarImage: ''
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
        return { number: stat, label: '' };
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

  return (
    <section
      className="py-20"
      style={{
        backgroundColor:
          content.backgroundColor || theme.colors?.background || "#F5F5DC",
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
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              color: theme.colors?.primary || "#8B4513",
              fontSize:
                theme.typography?.headingSize === "2xl"
                  ? "2.5rem"
                  : theme.typography?.headingSize === "xl"
                  ? "2rem"
                  : "1.875rem",
              fontWeight: theme.typography?.fontWeight || "700",
            }}
          >
            {content.title || "Khách Hàng Nói Gì Về Chúng Tôi"}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto opacity-80"
            style={{
              color: content.textColor || theme.colors?.text || "#2D3748",
              fontSize:
                theme.typography?.bodySize === "lg" ? "1.125rem" : "1rem",
            }}
          >
            {content.subtitle ||
              "Lời chứng thực từ các đối tác và khách hàng quốc tế"}
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`hover:shadow-lg transition-all duration-300 ${getBorderRadiusClass()}`}
              style={{
                borderColor: theme.colors?.border || theme.colors?.primary,
                backgroundColor: theme.colors?.secondary || "#FFFFFF",
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current"
                      style={{ color: theme.colors?.accent || "#CD853F" }}
                    />
                  ))}
                </div>
                <div className="relative mb-4">
                  <Quote
                    className="w-8 h-8 absolute -top-2 -left-2 opacity-30"
                    style={{ color: theme.colors?.secondary || "#D2691E" }}
                  />
                  <p
                    className="relative z-10 pl-4"
                    style={{
                      color:
                        content.textColor || theme.colors?.text || "#2D3748",
                      fontSize: theme.typography?.fontSize || "16px",
                    }}
                  >
                    {testimonial.content || ''}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden relative`}
                    style={{
                      backgroundColor: theme.colors?.accent || "#CD853F",
                    }}
                  >
                    {testimonial.avatarImage ? (
                      <Image
                        src={testimonial.avatarImage}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span
                        className="font-semibold text-sm"
                        style={{ color: theme.colors?.text || "#FFFFFF" }}
                      >
                        {testimonial.name ? testimonial.name.split(' ').map((word: string) => word[0]).join('').toUpperCase() : 'N/A'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p
                      className="font-semibold"
                      style={{ color: theme.colors?.primary || "#8B4513" }}
                    >
                      {testimonial.name || 'Unknown'}
                    </p>
                    <p
                      className="text-sm opacity-80"
                      style={{
                        color:
                          content.textColor || theme.colors?.text || "#2D3748",
                        fontSize:
                          theme.typography?.bodySize === "sm"
                            ? "0.875rem"
                            : "0.75rem",
                      }}
                    >
                      {(testimonial.position || '')} - {(testimonial.company || '')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>



        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: theme.colors?.secondary || "#D2691E" }}
              >
                {stat.number || ''}
              </div>
              <div
                className="opacity-80"
                style={{
                  color: content.textColor || theme.colors?.text || "#2D3748",
                  fontSize: theme.typography?.fontSize || "16px",
                }}
              >
                {stat.label || ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
