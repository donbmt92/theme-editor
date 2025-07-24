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

  return (
    <section 
      className="py-20"
      style={{ 
        backgroundColor: content.problems?.backgroundColor || theme.sections?.problems?.backgroundColor || '#FFF8DC'
      }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        {content.about && (content.about.title || content.about.description) && (
          <div 
            className="text-center mb-16 animate-fade-in p-8 rounded-lg"
            style={{ 
              backgroundColor: content.about.backgroundColor || 'transparent'
            }}
          >
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ 
                color: content.about.textColor || content.problems?.textColor || theme.sections?.problems?.textColor || theme.colors.text
              }}
            >
              {content.about.title || "Về Chúng Tôi"}
            </h2>
            <p 
              className="text-xl max-w-3xl mx-auto opacity-80"
              style={{ 
                color: content.about.textColor || content.problems?.textColor || theme.sections?.problems?.textColor || theme.colors.text
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
              className="space-y-8 p-8 rounded-lg"
              style={{ 
                backgroundColor: content.problems.backgroundColor || 'transparent'
              }}
            >
              <h3 
                className="text-3xl font-bold mb-8 flex items-center"
                style={{ color: content.problems?.textColor || theme.colors.text }}
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
                    className="p-6 border-l-4 hover:shadow-lg transition-all duration-300 animate-slide-up" 
                    style={{ 
                      animationDelay: `${index * 0.2}s`,
                      borderLeftColor: theme.colors.destructive || '#E53E3E'
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
                          className="text-lg font-semibold mb-2"
                          style={{ color: content.problems?.textColor || theme.colors.text }}
                        >
                          {problem.title}
                        </h4>
                        <p style={{ color: content.problems?.textColor || theme.colors.muted || '#718096' }}>
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
              className="space-y-8 p-8 rounded-lg"
              style={{ 
                backgroundColor: content.solutions.backgroundColor || 'transparent'
              }}
            >
              <h3 
                className="text-3xl font-bold mb-8 flex items-center"
                style={{ color: content.solutions?.textColor || theme.colors.text }}
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
                    className="p-6 border-l-4 hover:shadow-lg transition-all duration-300 animate-slide-up" 
                    style={{ 
                      animationDelay: `${index * 0.2}s`,
                      borderLeftColor: theme.colors.primary
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
                          className="text-lg font-semibold mb-2"
                          style={{ color: content.solutions?.textColor || theme.colors.text }}
                        >
                          {solution.title}
                        </h4>
                        <p 
                          className="mb-3"
                          style={{ color: content.solutions?.textColor || theme.colors.muted || '#718096' }}
                        >
                          {solution.description}
                        </p>
                        <div 
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                          style={{ 
                            backgroundColor: `${theme.colors.primary}1A`,
                            color: theme.colors.primary
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
              className="p-8 shadow-lg max-w-2xl mx-auto"
              style={{ 
                backgroundColor: content.cta.backgroundColor || theme.colors.primary,
                color: content.cta.textColor || '#FFFFFF'
              }}
            >
              <h3 
                className="text-2xl font-bold mb-4" 
                style={{ color: content.cta.textColor || '#FFFFFF' }}
              >
                {content.cta.title || "Sẵn sàng bắt đầu?"}
              </h3>
              <p 
                className="mb-6 opacity-90" 
                style={{ color: content.cta.textColor || '#FFFFFF' }}
              >
                {content.cta.description || "Liên hệ với chúng tôi để được tư vấn miễn phí"}
              </p>
              <Button 
                variant="hero" 
                size="lg"
                style={{ 
                  backgroundColor: content.cta.textColor || '#FFFFFF',
                  color: content.cta.backgroundColor || theme.colors.primary
                }}
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