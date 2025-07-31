'use client'

import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { ThemeParams } from "@/types";
import Image from "next/image";
import { useHeroImage } from "@/hooks/use-unsplash-image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useParams } from "next/navigation";
import { useEffect } from "react";

interface HeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  image?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  unsplashImageUrl?: string; // Add field for storing Unsplash URL
}

interface HeroSectionProps {
  theme: ThemeParams;
  content: HeroContent;
  onContentUpdate?: (content: HeroContent) => void; // Add callback for updating content
}

const HeroSection = ({ theme, content, onContentUpdate }: HeroSectionProps) => {
  const params = useParams();
  const projectId = params?.projectId as string;
  
  // Use Unsplash for hero background image
  const { imageUrl: unsplashImageUrl, isLoading: imageLoading, error: imageError } = useHeroImage();
  
  // Save Unsplash URL to project when it's fetched
  useEffect(() => {
    if (unsplashImageUrl && unsplashImageUrl !== content.unsplashImageUrl && projectId && onContentUpdate) {
      const updatedContent = {
        ...content,
        unsplashImageUrl,
        backgroundImage: unsplashImageUrl // Also update backgroundImage for compatibility
      };
      
      // Update content immediately for UI
      onContentUpdate(updatedContent);
      
      // Save to database
      saveUnsplashUrl(projectId, unsplashImageUrl);
    }
  }, [unsplashImageUrl, content.unsplashImageUrl, projectId, content, onContentUpdate]);
  
  // Function to save Unsplash URL to project
  const saveUnsplashUrl = async (projectId: string, imageUrl: string) => {
    try {
      // Get current theme params
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'GET',
      });
      
      if (!response.ok) return;
      
      const { project } = await response.json();
      
      // Get latest version or create new theme params
      let themeParams = theme;
      if (project.versions && project.versions.length > 0) {
        const latestVersion = project.versions[project.versions.length - 1];
        themeParams = latestVersion.snapshot;
      }
      
      // Update hero content with Unsplash URL
      const updatedThemeParams = {
        ...themeParams,
        content: {
          ...themeParams.content,
          hero: {
            ...themeParams.content?.hero,
            unsplashImageUrl: imageUrl,
            backgroundImage: imageUrl
          }
        }
      };
      
      // Save updated theme params
      await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themeParams: updatedThemeParams
        }),
      });
      
      console.log('Unsplash URL saved to project:', imageUrl);
    } catch (error) {
      console.error('Failed to save Unsplash URL:', error);
    }
  };
  
  // Determine which image to use: saved Unsplash URL > new Unsplash URL > content image > fallback
  const getBackgroundImageUrl = () => {
    if (content.unsplashImageUrl) return content.unsplashImageUrl;
    if (unsplashImageUrl) return unsplashImageUrl;
    if (content.backgroundImage) return content.backgroundImage;
    if (content.image) return content.image;
    return null;
  };

  const backgroundImageUrl = getBackgroundImageUrl();

  // Convert overlayOpacity to overlayColor if needed
  const getOverlayColor = () => {
    if (content.overlayColor) {
      // If it's already a hex color, convert to rgba with opacity
      if (content.overlayColor.startsWith('#')) {
        const opacity = content.overlayOpacity || 0.7;
        return `${content.overlayColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
      }
      return content.overlayColor;
    }
    if (content.overlayOpacity !== undefined) {
      // Convert hex color to rgba with opacity
      const baseColor = theme.colors.primary || '#8B4513';
      const opacity = content.overlayOpacity;
      return `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
    }
    return theme.sections?.hero?.overlayColor || 'rgba(139, 69, 19, 0.7)';
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
  const getButtonStyles = (variant: 'hero' | 'outline' = 'hero') => {
    const baseStyles = {
      fontFamily: theme.typography?.fontFamily || 'Inter',
      fontSize: theme.typography?.fontSize || '16px',
      fontWeight: theme.typography?.fontWeight || '400',
    }

    if (variant === 'hero') {
      return {
        ...baseStyles,
        backgroundColor: theme.colors.accent,
        color: theme.colors.text,
        borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
      }
    }

    return {
      ...baseStyles,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderColor: 'rgba(255,255,255,0.3)',
      color: content.textColor || '#FFFFFF',
      borderRadius: theme.components?.button?.rounded ? '9999px' : getBorderRadiusClass().replace('rounded-', ''),
    }
  }

  // Get heading size based on typography settings
  const getHeadingSize = () => {
    switch (theme.typography?.headingSize) {
      case 'sm':
        return 'text-3xl md:text-4xl'
      case 'base':
        return 'text-4xl md:text-5xl'
      case 'lg':
        return 'text-4xl md:text-6xl'
      case 'xl':
        return 'text-5xl md:text-6xl'
      case '3xl':
        return 'text-6xl md:text-8xl'
      case '2xl':
      default:
        return 'text-5xl md:text-7xl'
    }
  }

  // Get body text size based on typography settings
  const getBodySize = () => {
    switch (theme.typography?.bodySize) {
      case 'xs':
        return 'text-lg md:text-xl'
      case 'sm':
        return 'text-xl md:text-2xl'
      case 'lg':
        return 'text-2xl md:text-3xl'
      case 'xl':
        return 'text-3xl md:text-4xl'
      case 'base':
      default:
        return 'text-xl md:text-2xl'
    }
  }
  
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundColor: content.backgroundColor || theme.sections?.hero?.backgroundColor || theme.colors.background,
        ...getTypographyStyles()
      }}
    >
      {/* Background Image */}
      {backgroundImageUrl && (
        <div className="absolute inset-0">
          {/* Show loading spinner while image is loading */}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-5">
              <LoadingSpinner size="lg" />
            </div>
          )}
          
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={backgroundImageUrl}
              alt="Hero background"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={75}
              style={{ objectPosition: 'center' }}
            />
          </div>
          
          {/* Unsplash Attribution */}
          {unsplashImageUrl && (
            <div className="absolute bottom-2 right-2 z-20">
              <div className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                Photo by <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a>
              </div>
            </div>
          )}
          
          {/* Only show overlay if there's a background image and overlay settings */}
          {(content.overlayColor || content.overlayOpacity !== undefined) && (
            <div 
              className="absolute inset-0 z-10"
              style={{ backgroundColor: getOverlayColor() }}
            ></div>
          )}
        </div>
      )}

      {/* Content */}
      <div 
        className="relative z-10 px-4 text-center"
        style={{ 
          color: content.textColor || theme.sections?.hero?.textColor || theme.colors.text,
          maxWidth: theme.layout?.containerWidth || '1200px',
          margin: '0 auto'
        }}
      >
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 
            className={`font-bold mb-6 leading-tight ${getHeadingSize()}`}
            style={{
              fontWeight: theme.typography?.fontWeight || '700',
              lineHeight: theme.typography?.lineHeight || '1.2'
            }}
          >
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
            className={`mb-8 max-w-3xl mx-auto leading-relaxed ${getBodySize()}`}
            style={{ 
              color: `${content.textColor || '#FFFFFF'}E6`,
              lineHeight: theme.typography?.lineHeight || '1.6'
            }}
          >
            {content.description || "Chúng tôi chuyên cung cấp các loại cà phê Việt Nam chất lượng cao cho thị trường quốc tế, đảm bảo hương vị đặc trưng và tiêu chuẩn xuất khẩu."}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              variant="hero" 
              size="lg" 
              className="group"
              style={getButtonStyles('hero')}
            >
              {content.ctaText || "Tìm hiểu thêm"}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 hover:bg-white hover:text-gray-900"
              style={getButtonStyles('outline')}
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
                style={{ 
                  color: theme.colors.accent,
                  fontSize: theme.typography?.headingSize === 'xl' ? '2rem' : '1.875rem',
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                500+
              </div>
              <div 
                className="text-sm"
                style={{ 
                  color: `${content.textColor || '#FFFFFF'}CC`,
                  fontSize: theme.typography?.bodySize === 'sm' ? '0.875rem' : '0.75rem'
                }}
              >
                Đơn hàng thành công
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div 
                className="text-3xl font-bold mb-2"
                style={{ 
                  color: theme.colors.accent,
                  fontSize: theme.typography?.headingSize === 'xl' ? '2rem' : '1.875rem',
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                15
              </div>
              <div 
                className="text-sm"
                style={{ 
                  color: `${content.textColor || '#FFFFFF'}CC`,
                  fontSize: theme.typography?.bodySize === 'sm' ? '0.875rem' : '0.75rem'
                }}
              >
                Năm kinh nghiệm
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div 
                className="text-3xl font-bold mb-2"
                style={{ 
                  color: theme.colors.accent,
                  fontSize: theme.typography?.headingSize === 'xl' ? '2rem' : '1.875rem',
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                100+
              </div>
              <div 
                className="text-sm"
                style={{ 
                  color: `${content.textColor || '#FFFFFF'}CC`,
                  fontSize: theme.typography?.bodySize === 'sm' ? '0.875rem' : '0.75rem'
                }}
              >
                Đối tác Mỹ
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div 
                className="text-3xl font-bold mb-2"
                style={{ 
                  color: theme.colors.accent,
                  fontSize: theme.typography?.headingSize === 'xl' ? '2rem' : '1.875rem',
                  fontWeight: theme.typography?.fontWeight || '700'
                }}
              >
                24/7
              </div>
              <div 
                className="text-sm"
                style={{ 
                  color: `${content.textColor || '#FFFFFF'}CC`,
                  fontSize: theme.typography?.bodySize === 'sm' ? '0.875rem' : '0.75rem'
                }}
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
        <div 
          className={`w-6 h-10 border-2 flex justify-center ${getBorderRadiusClass()}`} 
          style={{ borderColor: `${content.textColor || '#FFFFFF'}4D` }}
        >
          <div 
            className={`w-1 h-3 mt-2 animate-pulse ${getBorderRadiusClass()}`}
            style={{ backgroundColor: `${content.textColor || '#FFFFFF'}99` }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 