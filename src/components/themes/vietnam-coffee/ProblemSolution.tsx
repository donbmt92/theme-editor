'use client'

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Target, Shield, Zap, Globe } from "lucide-react";
import { ThemeParams } from "@/types";

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
  };
  problems?: {
    title?: string;
    description?: string;
    backgroundColor?: string;
    textColor?: string;
    items?: ProblemItem[];
  };
  solutions?: {
    title?: string;
    description?: string;
    backgroundColor?: string;
    textColor?: string;
    items?: SolutionItem[];
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
  // Get icon component by name
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'AlertCircle': return AlertCircle;
      case 'CheckCircle': return CheckCircle;
      case 'Target': return Target;
      case 'Shield': return Shield;
      case 'Zap': return Zap;
      case 'Globe': return Globe;
      default: return AlertCircle;
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

  // Get button styles based on component settings
  const getButtonStyles = () => {
    return {
      fontFamily: theme.typography?.fontFamily || 'Inter',
      fontSize: theme.typography?.fontSize || '16px',
      fontWeight: theme.typography?.fontWeight || '400',
      backgroundColor: content.cta?.textColor || '#FFFFFF',
      color: content.cta?.backgroundColor || theme.colors.primary,
      borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
    }
  }

  // Get heading size based on typography settings
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

  // Get body text size based on typography settings
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

  // Get spacing class based on theme layout spacing
  const getSpacingClass = () => {
    switch (theme.layout?.spacing) {
      case 'minimal':
        return 'py-12'
      case 'spacious':
        return 'py-24'
      case 'comfortable':
      default:
        return 'py-20'
    }
  }

  return (
    <section 
      className={getSpacingClass()}
      style={{ 
        backgroundColor: content.problems?.backgroundColor || theme.sections?.problems?.backgroundColor || '#FFF8DC',
        ...getTypographyStyles()
      }}
    >
      <div 
        className="px-4"
        style={{
          maxWidth: theme.layout?.containerWidth || '1200px',
          margin: '0 auto'
        }}
      >
        {/* Section Header */}
        {content.about && (content.about.title || content.about.description) && (
          <div 
            className={`text-center mb-16 animate-fade-in p-8 ${getBorderRadiusClass()}`}
            style={{ 
              backgroundColor: content.about.backgroundColor || 'transparent'
            }}
          >
            <h2 
              className={`font-bold mb-6 ${getHeadingSize('large')}`}
              style={{ 
                color: content.about.textColor || content.problems?.textColor || theme.sections?.problems?.textColor || theme.colors.text,
                fontWeight: theme.typography?.fontWeight || '700',
                lineHeight: theme.typography?.lineHeight || '1.2'
              }}
            >
              {content.about.title || "Về Chúng Tôi"}
            </h2>
            <p 
              className={`max-w-3xl mx-auto opacity-80 ${getBodySize()}`}
              style={{ 
                color: content.about.textColor || content.problems?.textColor || theme.sections?.problems?.textColor || theme.colors.text,
                lineHeight: theme.typography?.lineHeight || '1.6'
              }}
            >
              {content.about.description || "Thông tin về công ty và dịch vụ của chúng tôi"}
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Problems */}
          {content.problems && (
            <div 
              className={`space-y-8 p-8 ${getBorderRadiusClass()}`}
              style={{ 
                backgroundColor: content.problems.backgroundColor || 'transparent'
              }}
            >
              <h3 
                className={`font-bold mb-8 flex items-center ${getHeadingSize('medium')}`}
                style={{ 
                  color: content.problems?.textColor || theme.colors.text,
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                <AlertCircle 
                  className="mr-3" 
                  size={32}
                  style={{ color: theme.colors.destructive || '#E53E3E' }}
                />
                {content.problems.title || "Thách Thức Hiện Tại"}
              </h3>
              
              {Array.isArray(content.problems.items) && content.problems.items.map((problem, index) => {
                const IconComponent = getIcon(problem.icon);
                return (
                  <Card 
                    key={problem.id || index} 
                    className={`p-6 border-l-4 hover:shadow-lg transition-all duration-300 animate-slide-up ${getBorderRadiusClass()}`}
                    style={{ 
                      animationDelay: `${index * 0.2}s`,
                      borderLeftColor: theme.colors.destructive || '#E53E3E',
                      fontFamily: theme.typography?.fontFamily || 'Inter',
                      fontSize: theme.typography?.fontSize || '16px'
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <IconComponent 
                        className="mt-1" 
                        size={24}
                        style={{ color: theme.colors.destructive || '#E53E3E' }}
                      />
                      <div>
                        <h4 
                          className={`font-semibold mb-2 ${getHeadingSize('small')}`}
                          style={{ 
                            color: content.problems?.textColor || theme.colors.text,
                            fontWeight: theme.typography?.fontWeight || '600'
                          }}
                        >
                          {problem.title}
                        </h4>
                        <p 
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
                  </Card>
                );
              })}
            </div>
          )}

          {/* Solutions */}
          {content.solutions && (
            <div 
              className={`space-y-8 p-8 ${getBorderRadiusClass()}`}
              style={{ 
                backgroundColor: content.solutions.backgroundColor || 'transparent'
              }}
            >
              <h3 
                className={`font-bold mb-8 flex items-center ${getHeadingSize('medium')}`}
                style={{ 
                  color: content.solutions?.textColor || theme.colors.text,
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                <CheckCircle 
                  className="mr-3" 
                  size={32}
                  style={{ color: theme.colors.primary }}
                />
                {content.solutions.title || "Giải Pháp Của Chúng Tôi"}
              </h3>
              
              {Array.isArray(content.solutions.items) && content.solutions.items.map((solution, index) => {
                const IconComponent = getIcon(solution.icon);
                return (
                  <Card 
                    key={solution.id || index} 
                    className={`p-6 border-l-4 hover:shadow-lg transition-all duration-300 animate-slide-up ${getBorderRadiusClass()}`}
                    style={{ 
                      animationDelay: `${index * 0.2}s`,
                      borderLeftColor: theme.colors.primary,
                      fontFamily: theme.typography?.fontFamily || 'Inter',
                      fontSize: theme.typography?.fontSize || '16px'
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <IconComponent 
                        className="mt-1" 
                        size={24}
                        style={{ color: theme.colors.primary }}
                      />
                      <div className="flex-1">
                        <h4 
                          className={`font-semibold mb-2 ${getHeadingSize('small')}`}
                          style={{ 
                            color: content.solutions?.textColor || theme.colors.text,
                            fontWeight: theme.typography?.fontWeight || '600'
                          }}
                        >
                          {solution.title}
                        </h4>
                        <p 
                          className="mb-3"
                          style={{ 
                            color: content.solutions?.textColor || theme.colors.muted || '#718096',
                            fontSize: theme.typography?.fontSize || '16px',
                            lineHeight: theme.typography?.lineHeight || '1.6'
                          }}
                        >
                          {solution.description}
                        </p>
                        <div 
                          className={`inline-flex items-center px-3 py-1 font-medium ${getBorderRadiusClass()}`}
                          style={{ 
                            backgroundColor: `${theme.colors.primary}1A`,
                            color: theme.colors.primary,
                            fontSize: theme.typography?.fontSize || '16px'
                          }}
                        >
                          <Target size={14} className="mr-1" />
                          {solution.benefit}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        {content.cta && (
          <div className="text-center mt-16">
            <Card 
              className={`p-8 shadow-lg max-w-2xl mx-auto ${getBorderRadiusClass()}`}
              style={{ 
                backgroundColor: content.cta.backgroundColor || theme.colors.primary,
                color: content.cta.textColor || '#FFFFFF',
                fontFamily: theme.typography?.fontFamily || 'Inter',
                fontSize: theme.typography?.fontSize || '16px'
              }}
            >
              <h3 
                className={`font-bold mb-4 ${getHeadingSize('medium')}`}
                style={{ 
                  color: content.cta.textColor || '#FFFFFF',
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                {content.cta.title || "Sẵn sàng bắt đầu?"}
              </h3>
              <p 
                className="mb-6 opacity-90"
                style={{ 
                  color: content.cta.textColor || '#FFFFFF',
                  fontSize: theme.typography?.fontSize || '16px',
                  lineHeight: theme.typography?.lineHeight || '1.6'
                }}
              >
                {content.cta.description || "Liên hệ với chúng tôi để được tư vấn miễn phí"}
              </p>
              <Button 
                variant="hero" 
                size="lg"
                style={getButtonStyles()}
              >
                {content.cta.buttonText || "Liên hệ ngay"}
              </Button>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProblemSolution; 