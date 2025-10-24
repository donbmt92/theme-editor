'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ArrowRight, Shield, Clock, DollarSign, Truck, Target } from "lucide-react";
import { ThemeParams } from "@/types";
import { cn } from "@/lib/utils";

interface ProblemItem {
  id?: string;
  title: string;
  description: string;
  icon?: string;
}

interface SolutionItem {
  id?: string;
  title: string;
  description: string;
  benefit: string;
  icon?: string;
}

interface ProblemSolutionContent {
  about?: {
    title?: string;
    description?: string;
    backgroundColor?: string;
    textColor?: string;
    titleSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    titleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
    titleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
    descriptionSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    descriptionWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
    descriptionFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  };
  problems?: {
    title?: string;
    description?: string;
    backgroundColor?: string;
    textColor?: string;
    primaryColor?: string;
    colorMode?: 'theme' | 'custom';
    items?: ProblemItem[];
    titleSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    titleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
    titleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
    descriptionSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    descriptionWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
    descriptionFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
    itemTitleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
    itemTitleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
    itemDescriptionSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    itemDescriptionFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
    cta?: {
      title?: string;
      description?: string;
      buttonText?: string;
      backgroundColor?: string;
      textColor?: string;
      stats?: {
        stat1?: {
          value?: string;
          label?: string;
        };
        stat2?: {
          value?: string;
          label?: string;
        };
        stat3?: {
          value?: string;
          label?: string;
        };
      };
    };
  };
  solutions?: {
    title?: string;
    description?: string;
    backgroundColor?: string;
    textColor?: string;
    primaryColor?: string;
    colorMode?: 'theme' | 'custom';
    items?: SolutionItem[];
    titleSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    titleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
    titleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
    descriptionSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    descriptionWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
    descriptionFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
    itemTitleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
    itemTitleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
    itemDescriptionSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    itemDescriptionFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
    itemBenefitWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
    itemBenefitFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
    cta?: {
      title?: string;
      description?: string;
      buttonText?: string;
      backgroundColor?: string;
      textColor?: string;
      stats?: {
        stat1?: {
          value?: string;
          label?: string;
        };
        stat2?: {
          value?: string;
          label?: string;
        };
        stat3?: {
          value?: string;
          label?: string;
        };
      };
    };
  };
  cta?: {
    title?: string;
    description?: string;
    buttonText?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

interface ProblemSolutionProps {
  theme: ThemeParams;
  content: ProblemSolutionContent;
}

const ProblemSolution = ({ theme, content }: ProblemSolutionProps) => {
  // Get project language from theme or default to vietnamese
  const projectLanguage = theme?.projectLanguage || 'vietnamese';

  // Get localized text based on project language
  const getLocalizedText = () => {
    if (projectLanguage === 'english') {
      return {
        learnMore: "Learn More About Us",
        defaultAboutTitle: "Solving Real Import-Export Challenges",
        defaultAboutDescription: "We understand the difficulties of exporting coffee from Vietnam. Here's how we solve them for you.",
        defaultProblemsTitle: "Common Challenges",
        defaultSolutionsTitle: "Our Solutions",
        defaultCtaTitle: "Why Choose Vietnam Coffee Export?",
        defaultCtaDescription: "We are the only coffee export company that combines Vietnamese agricultural expertise with deep knowledge of the US market, providing comprehensive solutions that eliminate all import difficulties.",
        stats: {
          experience: "Years of US Market Experience",
          orders: "Successful Shipments",
          delivery: "On-Time Delivery"
        },
        defaultProblems: [
          {
            id: 'problem-1',
            icon: 'AlertTriangle',
            title: "Complex Import Regulations",
            description: "Complying with FDA requirements and US customs procedures can be challenging for new importers."
          },
          {
            id: 'problem-2',
            icon: 'Clock',
            title: "Unstable Supply Chain",
            description: "Finding high-quality coffee suppliers with on-time delivery is a major challenge."
          },
          {
            id: 'problem-3',
            icon: 'DollarSign',
            title: "Hidden Costs and Price Volatility",
            description: "Unexpected fees and price fluctuations can destroy profit margins."
          },
          {
            id: 'problem-4',
            icon: 'Shield',
            title: "Quality Concerns",
            description: "Ensuring quality standards and product safety in international shipments."
          }
        ],
        defaultSolutions: [
          {
            id: 'solution-1',
            icon: 'CheckCircle',
            title: "Full Regulatory Compliance",
            description: "We handle all FDA, USDA and customs documentation to ensure smooth clearance.",
            benefit: "100% Compliant Delivery"
          },
          {
            id: 'solution-2',
            icon: 'Truck',
            title: "Reliable Supply Network",
            description: "Direct partnerships with premium Vietnamese coffee farms ensure quality and stable supply.",
            benefit: "Guaranteed On-Time Delivery"
          },
          {
            id: 'solution-3',
            icon: 'DollarSign',
            title: "Transparent Pricing",
            description: "Fixed prices with no hidden fees. You know exactly what you'll pay upfront.",
            benefit: "Predictable Costs"
          },
          {
            id: 'solution-4',
            icon: 'Shield',
            title: "Quality Assurance",
            description: "Rigorous testing and certification processes ensure only the best coffee beans reach you.",
            benefit: "High-Quality Products"
          }
        ]
      };
    } else {
      return {
        learnMore: "Tìm hiểu thêm về chúng tôi",
        defaultAboutTitle: "Giải Quyết Thách Thức Xuất Nhập Khẩu Thực Tế",
        defaultAboutDescription: "Chúng tôi hiểu rõ những khó khăn khi xuất khẩu cà phê từ Việt Nam. Đây là cách chúng tôi giải quyết chúng cho bạn.",
        defaultProblemsTitle: "Thách Thức Thường Gặp",
        defaultSolutionsTitle: "Giải Pháp Của Chúng Tôi",
        defaultCtaTitle: "Tại sao chọn Cà Phê Việt Export?",
        defaultCtaDescription: "Chúng tôi là công ty xuất khẩu cà phê duy nhất kết hợp chuyên môn nông nghiệp Việt Nam với kiến thức sâu rộng về thị trường Mỹ, cung cấp giải pháp toàn diện loại bỏ mọi khó khăn nhập khẩu.",
        stats: {
          experience: "Năm kinh nghiệm thị trường Mỹ",
          orders: "Lô hàng thành công",
          delivery: "Giao hàng đúng hạn"
        },
        defaultProblems: [
          {
            id: 'problem-1',
            icon: 'AlertTriangle',
            title: "Quy định nhập khẩu phức tạp",
            description: "Việc tuân thủ các yêu cầu FDA và thủ tục hải quan Mỹ có thể gây khó khăn cho các nhà nhập khẩu mới."
          },
          {
            id: 'problem-2',
            icon: 'Clock',
            title: "Chuỗi cung ứng không ổn định",
            description: "Tìm kiếm nhà cung cấp cà phê chất lượng cao với giao hàng đúng hạn là thách thức lớn."
          },
          {
            id: 'problem-3',
            icon: 'DollarSign',
            title: "Chi phí ẩn và biến động giá",
            description: "Các khoản phí bất ngờ và giá cả biến động có thể phá hủy biên lợi nhuận."
          },
          {
            id: 'problem-4',
            icon: 'Shield',
            title: "Lo ngại về chất lượng",
            description: "Đảm bảo tiêu chuẩn chất lượng và an toàn sản phẩm trong các lô hàng quốc tế."
          }
        ],
        defaultSolutions: [
          {
            id: 'solution-1',
            icon: 'CheckCircle',
            title: "Tuân thủ quy định đầy đủ",
            description: "Chúng tôi xử lý tất cả tài liệu FDA, USDA và hải quan để đảm bảo thông quan suôn sẻ.",
            benefit: "100% Giao hàng tuân thủ"
          },
          {
            id: 'solution-2',
            icon: 'Truck',
            title: "Mạng lưới cung ứng đáng tin cậy",
            description: "Đối tác trực tiếp với các trang trại cà phê Việt Nam cao cấp đảm bảo chất lượng và nguồn cung ổn định.",
            benefit: "Đảm bảo giao hàng đúng hạn"
          },
          {
            id: 'solution-3',
            icon: 'DollarSign',
            title: "Định giá minh bạch",
            description: "Giá cố định không có phí ẩn. Bạn biết chính xác những gì sẽ phải trả trước.",
            benefit: "Chi phí dự đoán được"
          },
          {
            id: 'solution-4',
            icon: 'Shield',
            title: "Đảm bảo chất lượng",
            description: "Quy trình kiểm tra và chứng nhận nghiêm ngặt đảm bảo chỉ những hạt cà phê tốt nhất đến tay bạn.",
            benefit: "Sản phẩm chất lượng cao"
          }
        ]
      };
    }
  };

  const localizedText = getLocalizedText();

  // Get icon component by name
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'AlertTriangle': return AlertTriangle;
      case 'CheckCircle': return CheckCircle;
      case 'Target': return Target;
      case 'Shield': return Shield;
      case 'Clock': return Clock;
      case 'DollarSign': return DollarSign;
      case 'Truck': return Truck;
      default: return AlertTriangle;
    }
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
  const getButtonStyles = () => {
    return {
      fontFamily: theme.typography?.fontFamily || 'Inter',
      fontSize: theme.typography?.fontSize || '16px',
      fontWeight: theme.typography?.fontWeight || '400',
      backgroundColor: '#FFFFFF',
      color: theme.colors.primary,
      borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
    }
  }

  // Get heading size
  const getHeadingSize = (size: 'large' | 'medium' | 'small' = 'medium') => {
    const baseSize = theme.typography?.headingSize || '2xl'
    
    if (size === 'large') {
      switch (baseSize) {
        case 'sm': return 'text-3xl md:text-4xl'
        case 'base': return 'text-4xl md:text-5xl'
        case 'lg': return 'text-4xl md:text-6xl'
        case 'xl': return 'text-5xl md:text-6xl'
        case '3xl': return 'text-6xl md:text-8xl'
        case '2xl':
        default: return 'text-4xl md:text-5xl'
      }
    } else if (size === 'medium') {
      switch (baseSize) {
        case 'sm': return 'text-2xl md:text-3xl'
        case 'base': return 'text-3xl md:text-4xl'
        case 'lg': return 'text-3xl md:text-5xl'
        case 'xl': return 'text-4xl md:text-5xl'
        case '3xl': return 'text-5xl md:text-7xl'
        case '2xl':
        default: return 'text-3xl md:text-4xl'
      }
    } else {
      switch (baseSize) {
        case 'sm': return 'text-xl md:text-2xl'
        case 'base': return 'text-2xl md:text-3xl'
        case 'lg': return 'text-2xl md:text-4xl'
        case 'xl': return 'text-3xl md:text-4xl'
        case '3xl': return 'text-4xl md:text-6xl'
        case '2xl':
        default: return 'text-2xl md:text-3xl'
      }
    }
  }

  // Get body text size
  const getBodySize = () => {
    switch (theme.typography?.bodySize) {
      case 'xs':
        return 'text-lg'
      case 'sm':
        return 'text-xl'
      case 'lg':
        return 'text-2xl'
      case 'xl':
        return 'text-3xl'
      case 'base':
      default:
        return 'text-xl'
    }
  }

  // Helpers for size mapping
  const sizeToClasses = (size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl', fallback: string = 'text-base') => {
    switch (size) {
      case 'xs': return 'text-xs md:text-sm'
      case 'sm': return 'text-sm md:text-base'
      case 'base': return 'text-base md:text-lg'
      case 'lg': return 'text-lg md:text-xl'
      case 'xl': return 'text-xl md:text-2xl'
      case '2xl': return 'text-2xl md:text-3xl'
      case '3xl': return 'text-3xl md:text-4xl'
      default: return fallback
    }
  }

  // Helpers for weight mapping
  const weightToClasses = (weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black', fallback: string = 'font-normal') => {
    switch (weight) {
      case 'light': return 'font-light'
      case 'normal': return 'font-normal'
      case 'medium': return 'font-medium'
      case 'semibold': return 'font-semibold'
      case 'bold': return 'font-bold'
      case 'extrabold': return 'font-extrabold'
      case 'black': return 'font-black'
      default: return fallback
    }
  }

  // Helpers for font mapping
  const fontToClasses = (font?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather', fallback: string = 'font-inter') => {
    switch (font) {
      case 'inter': return 'font-inter'
      case 'poppins': return 'font-poppins'
      case 'roboto': return 'font-roboto'
      case 'open-sans': return 'font-open-sans'
      case 'montserrat': return 'font-montserrat'
      case 'lato': return 'font-lato'
      case 'nunito': return 'font-nunito'
      case 'raleway': return 'font-raleway'
      case 'playfair-display': return 'font-playfair-display'
      case 'merriweather': return 'font-merriweather'
      default: return fallback
    }
  }

  // Derived classes for About Section
  const aboutTitleClasses = cn(sizeToClasses(content.about?.titleSize, getHeadingSize('large')), weightToClasses(content.about?.titleWeight, 'font-bold'), fontToClasses(content.about?.titleFont))
  const aboutDescClasses = cn(sizeToClasses(content.about?.descriptionSize, getBodySize()), weightToClasses(content.about?.descriptionWeight, 'font-normal'), fontToClasses(content.about?.descriptionFont))

  // Derived classes for Problems
  const problemsTitleClasses = cn(sizeToClasses(content.problems?.titleSize, getHeadingSize('medium')), weightToClasses(content.problems?.titleWeight, 'font-bold'), fontToClasses(content.problems?.titleFont))
  const problemsItemTitleClasses = cn(weightToClasses(content.problems?.itemTitleWeight, 'font-semibold'), fontToClasses(content.problems?.itemTitleFont))
  const problemsItemDescClasses = cn(sizeToClasses(content.problems?.itemDescriptionSize, 'text-base md:text-lg'), fontToClasses(content.problems?.itemDescriptionFont))

  // Derived classes for Solutions
  const solutionsTitleClasses = cn(sizeToClasses(content.solutions?.titleSize, getHeadingSize('medium')), weightToClasses(content.solutions?.titleWeight, 'font-bold'), fontToClasses(content.solutions?.titleFont))
  const solutionsDescClasses = cn(sizeToClasses(content.solutions?.descriptionSize, getBodySize()), weightToClasses(content.solutions?.descriptionWeight, 'font-normal'), fontToClasses(content.solutions?.descriptionFont))
  const solutionsItemTitleClasses = cn(weightToClasses(content.solutions?.itemTitleWeight, 'font-semibold'), fontToClasses(content.solutions?.itemTitleFont))
  const solutionsBenefitClasses = cn(weightToClasses(content.solutions?.itemBenefitWeight, 'font-medium'), fontToClasses(content.solutions?.itemBenefitFont))


  const problems = content.problems?.items || localizedText.defaultProblems;
  const solutions = content.solutions?.items || localizedText.defaultSolutions;

  return (
    <section 
      className="py-20"
      style={{ 
        backgroundColor: content.problems?.colorMode === 'custom' && content.problems?.backgroundColor 
          ? content.problems.backgroundColor 
          : theme.sections?.problems?.backgroundColor || theme.colors.background || '#F8F9FA',
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
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            className={cn("font-bold mb-4", aboutTitleClasses)}
            style={{ 
              color: content.about?.textColor || content.problems?.textColor || theme.sections?.problems?.textColor || theme.colors.text,
              fontWeight: theme.typography?.fontWeight || '700'
            }}
          >
            {content.about?.title || localizedText.defaultAboutTitle}
          </h2>
          <p 
            className={cn("max-w-3xl mx-auto", aboutDescClasses)}
            style={{ 
              color: content.about?.textColor || content.problems?.textColor || theme.sections?.problems?.textColor || theme.colors.muted || '#718096',
              lineHeight: theme.typography?.lineHeight || '1.6'
            }}
          >
            {content.about?.description || localizedText.defaultAboutDescription}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Problems */}
          <div>
            <div className="flex items-center mb-8">
              <AlertTriangle 
                className="h-8 w-8 mr-3" 
                style={{ color: theme.colors.destructive || '#E53E3E' }}
              />
              <h3 
                className={problemsTitleClasses}
                style={{ 
                  color: content.problems?.textColor || theme.colors.text,
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                {content.problems?.title || localizedText.defaultProblemsTitle}
              </h3>
            </div>
            <div className="space-y-6">
              {problems.map((problem, index) => {
                const IconComponent = getIcon(problem.icon);
                return (
                  <Card 
                    key={problem.id || index} 
                    className={cn("border-destructive/20 hover:border-destructive/40 transition-colors", getBorderRadiusClass())}
                    style={{ 
                      borderColor: `${theme.colors.destructive || '#E53E3E'}20`,
                      fontFamily: theme.typography?.fontFamily || 'Inter',
                      fontSize: theme.typography?.fontSize || '16px'
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <IconComponent 
                          className="h-6 w-6 mt-1 flex-shrink-0" 
                          style={{ color: theme.colors.destructive || '#E53E3E' }}
                        />
                        <div>
                          <h4 
                            className={cn("mb-2", problemsItemTitleClasses)}
                            style={{ 
                              color: content.problems?.textColor || theme.colors.text,
                              fontWeight: theme.typography?.fontWeight || '600'
                            }}
                          >
                            {problem.title}
                          </h4>
                          <p 
                            className={problemsItemDescClasses}
                            style={{ 
                              color: content.problems?.textColor || theme.colors.muted || '#718096',
                              fontSize: theme.typography?.fontSize || '16px',
                              lineHeight: theme.typography?.lineHeight || '1.6'
                            }}
                          >
                            {problem.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <div className="flex items-center mb-8">
              <CheckCircle 
                className="h-8 w-8 mr-3" 
                style={{ color: theme.colors.accent || '#28A745' }}
              />
              <h3 
                className={solutionsTitleClasses}
                style={{ 
                  color: content.solutions?.textColor || theme.colors.text,
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                {content.solutions?.title || localizedText.defaultSolutionsTitle}
              </h3>
            </div>
            <div className="space-y-6">
              {solutions.map((solution, index) => {
                const IconComponent = getIcon(solution.icon);
                return (
                  <Card 
                    key={solution.id || index} 
                    className={cn("border-success-green/20 hover:border-success-green/40 transition-colors shadow-card", getBorderRadiusClass())}
                    style={{ 
                      borderColor: `${theme.colors.accent || '#28A745'}20`,
                      fontFamily: theme.typography?.fontFamily || 'Inter',
                      fontSize: theme.typography?.fontSize || '16px'
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <IconComponent 
                          className="h-6 w-6 mt-1 flex-shrink-0" 
                          style={{ color:  '#28A745' }}
                        />
                        <div className="flex-1">
                          <h4 
                            className={cn("mb-2", solutionsItemTitleClasses)}
                            style={{ 
                              color: content.solutions?.textColor || theme.colors.text,
                              fontWeight: theme.typography?.fontWeight || '600'
                            }}
                          >
                            {solution.title}
                          </h4>
                          <p 
                            className={cn("mb-3", solutionsDescClasses)}
                            style={{ 
                              color: content.solutions?.textColor || theme.colors.muted || '#718096',
                              fontSize: theme.typography?.fontSize || '16px',
                              lineHeight: theme.typography?.lineHeight || '1.6'
                            }}
                          >
                            {solution.description}
                          </p>
                          <div 
                            className={cn("inline-flex items-center px-3 py-1", getBorderRadiusClass(), solutionsBenefitClasses)}
                            style={{ 
                              backgroundColor: `${theme.colors.accent || '#28A745'}10`,
                              color: theme.colors.primary || '#28A745',
                              fontSize: theme.typography?.fontSize || '16px'
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" 
                            style={{  color:  theme.colors.primary || '#28A745' }}
                            />
                            {solution.benefit}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* USP Section */}
        <div className="mt-20 text-center">
          <Card 
            className={cn("max-w-4xl mx-auto border-0 shadow-elegant", getBorderRadiusClass())}
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
              color: content.problems?.cta?.textColor || content.solutions?.cta?.textColor || '#FFFFFF',
              fontFamily: theme.typography?.fontFamily || 'Inter',
              fontSize: theme.typography?.fontSize || '16px'
            }}
          >
            <CardContent className="p-12">
              <h3 
                className={cn("font-bold mb-4", getHeadingSize('medium'))}
                style={{ 
                  color: content.problems?.cta?.textColor || content.solutions?.cta?.textColor || '#FFFFFF',
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                {content.problems?.cta?.title || content.solutions?.cta?.title || localizedText.defaultCtaTitle}
              </h3>
              <p 
                className={cn("mb-8 opacity-90", getBodySize())}
                style={{ 
                  color: content.problems?.cta?.textColor || content.solutions?.cta?.textColor || '#FFFFFF',
                  lineHeight: theme.typography?.lineHeight || '1.6'
                }}
              >
                {content.problems?.cta?.description || content.solutions?.cta?.description || localizedText.defaultCtaDescription}
              </p>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div 
                    className="text-4xl font-bold mb-2"
                    style={{ 
                      color: content.problems?.cta?.textColor || content.solutions?.cta?.textColor || '#FFFFFF',
                      fontWeight: theme.typography?.fontWeight || '700'
                    }}
                  >
                    {content.problems?.cta?.stats?.stat1?.value || content.solutions?.cta?.stats?.stat1?.value || '15+'}
                  </div>
                  <div 
                    className="opacity-90"
                    style={{ 
                      color: content.problems?.cta?.textColor || content.solutions?.cta?.textColor || '#FFFFFF',
                      fontSize: theme.typography?.fontSize || '16px'
                    }}
                  >
                    {content.problems?.cta?.stats?.stat1?.label || content.solutions?.cta?.stats?.stat1?.label || localizedText.stats.experience}
                  </div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-4xl font-bold mb-2"
                    style={{ 
                      color: content.problems?.cta?.textColor || content.solutions?.cta?.textColor || '#FFFFFF',
                      fontWeight: theme.typography?.fontWeight || '700'
                    }}
                  >
                    {content.problems?.cta?.stats?.stat2?.value || content.solutions?.cta?.stats?.stat2?.value || '500+'}
                  </div>
                  <div 
                    className="opacity-90"
                    style={{ 
                      color: content.problems?.cta?.textColor || content.solutions?.cta?.textColor || '#FFFFFF',
                      fontSize: theme.typography?.fontSize || '16px'
                    }}
                  >
                    {content.problems?.cta?.stats?.stat2?.label || content.solutions?.cta?.stats?.stat2?.label || localizedText.stats.orders}
                  </div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-4xl font-bold mb-2"
                    style={{ 
                      color: content.problems?.cta?.textColor || content.solutions?.cta?.textColor || '#FFFFFF',
                      fontWeight: theme.typography?.fontWeight || '700'
                    }}
                  >
                    {content.problems?.cta?.stats?.stat3?.value || content.solutions?.cta?.stats?.stat3?.value || '99.8%'}
                  </div>
                  <div 
                    className="opacity-90"
                    style={{ 
                      color: content.problems?.cta?.textColor || content.solutions?.cta?.textColor || '#FFFFFF',
                      fontSize: theme.typography?.fontSize || '16px'
                    }}
                  >
                    {content.problems?.cta?.stats?.stat3?.label || content.solutions?.cta?.stats?.stat3?.label || localizedText.stats.delivery}
                  </div>
                </div>
              </div>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                style={getButtonStyles()}
              >
                {content.problems?.cta?.buttonText || content.solutions?.cta?.buttonText || localizedText.learnMore}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution; 