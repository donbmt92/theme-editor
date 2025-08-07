"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, TrendingUp } from "lucide-react";
import { ThemeParams } from "@/types";
import { cn } from "@/lib/utils";

interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

interface Category {
  name: string;
  count: number;
  color: string;
}

interface BlogSectionContent {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  blogPosts?: BlogPost[];
  categories?: Category[];
  newsletter?: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
    footerText: string;
  };
}

interface BlogSectionProps {
  theme: ThemeParams;
  content: BlogSectionContent;
}

const BlogSection = ({ theme, content }: BlogSectionProps) => {
  // Default blog posts data
  const defaultBlogPosts: BlogPost[] = [
    {
      title: "Triển Vọng Thị Trường Cà Phê 2024: Xu Hướng Nhập Khẩu Mỹ & Dự Báo Giá",
      excerpt: "Phân tích toàn diện thị trường cà phê Mỹ bao gồm dự báo nhu cầu, xu hướng giá cả và các yếu tố chính ảnh hưởng đến nhập khẩu từ Việt Nam.",
      category: "Phân Tích Thị Trường",
      author: "Sarah Johnson",
      date: "15 Tháng 1, 2024",
      readTime: "8 phút đọc",
      image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&h=400&fit=crop",
      featured: true
    },
    {
      title: "Quy Định FDA Mới Cho Nhập Khẩu Cà Phê: Những Điều Bạn Cần Biết",
      excerpt: "Cập nhật yêu cầu FDA cho nhập khẩu cà phê có hiệu lực 2024, bao gồm thay đổi tài liệu và hướng dẫn tuân thủ cho nhà nhập khẩu Mỹ.",
      category: "Quy Định",
      author: "Michael Chen",
      date: "10 Tháng 1, 2024",
      readTime: "6 phút đọc",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
    },
    {
      title: "Cập Nhật Thu Hoạch Cà Phê Việt Nam: Đánh Giá Chất Lượng & Dự Báo Sản Lượng",
      excerpt: "Cập nhật mới nhất từ các vùng trồng cà phê Việt Nam bao gồm đánh giá chất lượng thu hoạch và dự báo sản lượng cho năm 2024.",
      category: "Chuỗi Cung Ứng",
      author: "Nguyễn Trần",
      date: "8 Tháng 1, 2024",
      readTime: "5 phút đọc",
      image: "https://images.unsplash.com/photo-1588155487507-a5e9ce8b1987?w=600&h=400&fit=crop"
    },
    {
      title: "Canh Tác Cà Phê Bền Vững: Hỗ Trợ Cộng Đồng Việt Nam",
      excerpt: "Cách đối tác của chúng tôi với nông dân Việt Nam thúc đẩy thực hành bền vững trong khi đảm bảo cà phê chất lượng cao cho thị trường Mỹ.",
      category: "Bền Vững",
      author: "David Park",
      date: "5 Tháng 1, 2024",
      readTime: "7 phút đọc",
      image: "https://images.unsplash.com/photo-1594736797933-d0c3659ad253?w=600&h=400&fit=crop"
    }
  ];

  const defaultCategories: Category[] = [
    { name: "Phân Tích Thị Trường", count: 12, color: "bg-primary" },
    { name: "Quy Định", count: 8, color: "bg-blue-500" },
    { name: "Chuỗi Cung Ứng", count: 15, color: "bg-green-500" },
    { name: "Bền Vững", count: 6, color: "bg-yellow-500" }
  ];

  const defaultNewsletter = {
    title: "Cập Nhật Thông Tin Thị Trường",
    description: "Đăng ký nhận bản tin hàng tuần để có thông tin mới nhất về xu hướng thị trường cà phê, mẹo nhập khẩu và cập nhật ngành.",
    placeholder: "Nhập địa chỉ email của bạn",
    buttonText: "Đăng Ký",
    footerText: "Tham gia cùng 2,000+ nhà nhập khẩu nhận thông tin thị trường hàng tuần. Hủy đăng ký bất cứ lúc nào."
  };

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

  // Get button styles
  const getButtonStyles = (variant: 'outline' | 'primary' | 'secondary' = 'primary') => {
    const baseStyles = {
      fontFamily: theme.typography?.fontFamily || 'Inter',
      fontSize: theme.typography?.fontSize || '16px',
      fontWeight: theme.typography?.fontWeight || '400',
    }

    if (variant === 'outline') {
      return {
        ...baseStyles,
        borderColor: theme.colors.primary,
        color: theme.colors.primary,
        borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
      }
    }

    if (variant === 'secondary') {
      return {
        ...baseStyles,
        backgroundColor: '#FFFFFF',
        color: theme.colors.primary,
        borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
      }
    }

    return {
      ...baseStyles,
      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
      color: '#FFFFFF',
      borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: 'all 0.3s ease',
    }
  }

  // Use content or defaults
  const blogPosts = content.blogPosts || defaultBlogPosts;
  const categories = content.categories || defaultCategories;
  const newsletter = content.newsletter || defaultNewsletter;

  return (
    <section 
      className="py-20"
      style={{
        backgroundColor: content.backgroundColor || theme.colors?.background || '#F8F9FA',
        ...getTypographyStyles()
      }}
    >
      <div 
        className="container mx-auto px-4"
        style={{
          maxWidth: theme.layout?.containerWidth || '1200px',
          margin: '0 auto'
        }}
      >
        <div className="text-center mb-16">
          <h2 
            className={cn("text-4xl font-bold mb-4")}
            style={{ 
              color: content.textColor || theme.colors?.text || '#2D3748',
              fontWeight: theme.typography?.fontWeight || '700'
            }}
          >
            {content.title || "Thông Tin Ngành Mới Nhất"}
          </h2>
          <p 
            className={cn("text-xl max-w-3xl mx-auto")}
            style={{ 
              color: content.textColor || theme.colors?.muted || '#718096'
            }}
          >
            {content.subtitle || "Cập nhật thông tin với tin tức mới nhất, xu hướng thị trường và chuyên môn về xuất khẩu cà phê Việt Nam và thị trường nhập khẩu Mỹ."}
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={cn("px-4 py-2 text-sm rounded-full flex items-center", getBorderRadiusClass())}
              style={{ 
                backgroundColor: `${theme.colors.primary}10`,
                color: theme.colors.primary,
                border: `1px solid ${theme.colors.primary}20`
              }}
            >
              <div 
                className={cn("w-2 h-2 rounded-full mr-2", getBorderRadiusClass())}
                style={{ backgroundColor: category.color }}
              ></div>
              {category.name} ({category.count})
            </div>
          ))}
        </div>

        {/* Featured Post */}
        <Card 
          className={cn("mb-12 shadow-elegant overflow-hidden", getBorderRadiusClass())}
          style={{ 
            borderColor: `${theme.colors.primary}20`,
            fontFamily: theme.typography?.fontFamily || 'Inter',
            fontSize: theme.typography?.fontSize || '16px'
          }}
        >
          <div className="grid lg:grid-cols-2">
            <div className="relative">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-80 lg:h-full object-cover"
              />
              <div 
                className={cn("absolute top-4 left-4 px-3 py-1 rounded-full flex items-center text-sm font-medium", getBorderRadiusClass())}
                style={{ 
                  backgroundColor: theme.colors.primary,
                  color: '#FFFFFF'
                }}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Nổi Bật
              </div>
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <div 
                className={cn("w-fit mb-4 px-3 py-1 rounded-full text-sm", getBorderRadiusClass())}
                style={{ 
                  backgroundColor: `${theme.colors.primary}10`,
                  color: theme.colors.primary
                }}
              >
                {blogPosts[0].category}
              </div>
              <h3 
                className={cn("text-2xl font-bold mb-4")}
                style={{ 
                  color: content.textColor || theme.colors?.text || '#2D3748',
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                {blogPosts[0].title}
              </h3>
              <p 
                className="mb-6 leading-relaxed"
                style={{ 
                  color: content.textColor || theme.colors?.muted || '#718096'
                }}
              >
                {blogPosts[0].excerpt}
              </p>
              <div 
                className="flex items-center text-sm mb-6"
                style={{ color: content.textColor || theme.colors?.muted || '#718096' }}
              >
                <User className="h-4 w-4 mr-1" />
                <span className="mr-4">{blogPosts[0].author}</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">{blogPosts[0].date}</span>
                <span>{blogPosts[0].readTime}</span>
              </div>
              <Button 
                className="w-fit shadow-elegant"
                style={getButtonStyles('primary')}
              >
                Đọc Bài Viết Đầy Đủ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </div>
        </Card>

        {/* Other Posts */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {blogPosts.slice(1).map((post, index) => (
            <Card 
              key={index} 
              className={cn("shadow-card hover:shadow-elegant transition-all duration-300 overflow-hidden", getBorderRadiusClass())}
              style={{ 
                fontFamily: theme.typography?.fontFamily || 'Inter',
                fontSize: theme.typography?.fontSize || '16px'
              }}
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div 
                  className={cn("absolute top-3 left-3 px-3 py-1 rounded-full text-sm", getBorderRadiusClass())}
                  style={{ 
                    backgroundColor: `${theme.colors.primary}10`,
                    color: theme.colors.primary
                  }}
                >
                  {post.category}
                </div>
              </div>
              <CardContent className="p-6">
                <h4 
                  className={cn("text-lg font-bold mb-3 line-clamp-2")}
                  style={{ 
                    color: content.textColor || theme.colors?.text || '#2D3748',
                    fontWeight: theme.typography?.fontWeight || '700'
                  }}
                >
                  {post.title}
                </h4>
                <p 
                  className="mb-4 text-sm leading-relaxed line-clamp-3"
                  style={{ 
                    color: content.textColor || theme.colors?.muted || '#718096'
                  }}
                >
                  {post.excerpt}
                </p>
                <div 
                  className="flex items-center text-xs mb-4"
                  style={{ color: content.textColor || theme.colors?.muted || '#718096' }}
                >
                  <User className="h-3 w-3 mr-1" />
                  <span className="mr-3">{post.author}</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span className="mr-3">{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  style={getButtonStyles('outline')}
                >
                  Đọc Thêm
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card 
          className={cn("border-0 shadow-elegant", getBorderRadiusClass())}
          style={{ 
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
            color: '#FFFFFF'
          }}
        >
          <CardContent className="p-12 text-center">
            <h3 
              className={cn("text-3xl font-bold mb-4")}
              style={{ 
                color: '#FFFFFF',
                fontWeight: theme.typography?.fontWeight || '700'
              }}
            >
              {newsletter.title}
            </h3>
            <p 
              className={cn("text-xl mb-8 opacity-90 max-w-2xl mx-auto")}
              style={{ color: '#FFFFFF' }}
            >
              {newsletter.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder={newsletter.placeholder}
                className={cn("flex-1 px-4 py-3 rounded-lg text-foreground border-0 focus:outline-none focus:ring-2 focus:ring-white/50", getBorderRadiusClass())}
              />
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                style={getButtonStyles('secondary')}
              >
                {newsletter.buttonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p 
              className={cn("text-sm opacity-75 mt-4")}
              style={{ color: '#FFFFFF' }}
            >
              {newsletter.footerText}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BlogSection; 