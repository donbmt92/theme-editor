"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Download, CheckCircle } from "lucide-react";
import { ThemeParams } from "@/types";
import Image from "next/image";
import { useHeroImage } from "@/hooks/use-unsplash-image";
import { useParams } from "next/navigation";
import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface HeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  image?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  colorMode?: 'theme' | 'custom';
  overlayColor?: string;
  overlayOpacity?: number;
  unsplashImageUrl?: string;
  // Text size customization options
  titleSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  subtitleSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  descriptionSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  benefitsSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  ctaSize?: 'sm' | 'base' | 'lg' | 'xl';
  statsSize?: 'sm' | 'base' | 'lg' | 'xl';
  // Font weight customization options
  titleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  subtitleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  descriptionWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  benefitsWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  ctaWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  statsWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  // Font family customization options
  titleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  subtitleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  descriptionFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  benefitsFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  ctaFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  statsFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  // Benefits array
  benefits?: Array<{
    icon: string;
    text: string;
  }>;
  // Stats array
  stats?: Array<{
    number: string;
    label: string;
  }>;
}

interface HeroSectionProps {
  theme: ThemeParams;
  content: HeroContent;
  onContentUpdate?: (content: HeroContent) => void;
}

const HeroSection = ({ theme, content, onContentUpdate }: HeroSectionProps) => {
  const params = useParams();
  const projectId = params?.projectId as string;

  // Get project language from theme or default to vietnamese
  const projectLanguage = theme?.projectLanguage || 'vietnamese';

  // Get localized text based on project language
  const getLocalizedText = () => {
    if (projectLanguage === 'english') {
      return {
        learnMore: "Learn More",
        benefits: [
          { icon: "✅", text: "High Quality" },
          { icon: "💰", text: "Competitive Price" },
          { icon: "🚚", text: "On-time Delivery" },
          { icon: "📞", text: "24/7 Support" },
        ],
        defaultTitle: "Vietnamese Coffee",
        defaultSubtitle: "International Quality",
        defaultDescription: "We specialize in providing high-quality Vietnamese coffee for international markets, ensuring distinctive flavor and export standards.",
        guideText: "Complete Import-Export Guide",
        stats: {
          orders: "Successful Orders",
          experience: "Years Experience", 
          partners: "US Partners"
        },
        
      };
    } else {
      return {
        learnMore: "Tìm hiểu thêm",
        benefits: [
          { icon: "✅", text: "Chất lượng cao" },
          { icon: "💰", text: "Giá cạnh tranh" },
          { icon: "🚚", text: "Giao hàng đúng hạn" },
          { icon: "📞", text: "Hỗ trợ 24/7" },
        ],
        defaultTitle: "Cà Phê Việt Nam",
        defaultSubtitle: "Chất Lượng Quốc Tế", 
        defaultDescription: "Chúng tôi chuyên cung cấp các loại cà phê Việt Nam chất lượng cao cho thị trường quốc tế, đảm bảo hương vị đặc trưng và tiêu chuẩn xuất khẩu.",
        guideText: "Hướng dẫn XNK từ A-Z",
        stats: {
          orders: "Đơn hàng thành công",
          experience: "Năm kinh nghiệm",
          partners: "Đối tác Mỹ"
        },
       
      };
    }
  };

  const localizedText = getLocalizedText();

  // Use Unsplash for hero background image - ưu tiên hình ảnh upload trước
  const {
    imageUrl: unsplashImageUrl,
  } = useHeroImage(content.backgroundImage, 'coffee shop');

  // Function to save Unsplash URL to project
  const saveUnsplashUrl = useCallback(async (projectId: string, imageUrl: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "GET",
      });

      if (!response.ok) return;

      const { project } = await response.json();

      let themeParams = theme;
      let latestVersion = null;
      if (project.versions && project.versions.length > 0) {
        latestVersion = project.versions[project.versions.length - 1];
        themeParams = latestVersion.snapshot;
      }

      const updatedThemeParams = {
        ...themeParams,
        content: {
          ...themeParams.content,
          hero: {
            ...themeParams.content?.hero,
            unsplashImageUrl: imageUrl,
            backgroundImage: imageUrl,
          },
        },
      };

      await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...project,
          versions: latestVersion ? [
            ...project.versions,
            {
              ...latestVersion,
              snapshot: updatedThemeParams,
            },
          ] : project.versions,
        }),
      });
    } catch (error) {
      console.error("Error saving Unsplash URL:", error);
    }
  }, [theme]);

  // Save Unsplash URL to project when it's fetched (chỉ khi không có hình ảnh upload)
  useEffect(() => {
    if (
      unsplashImageUrl &&
      unsplashImageUrl !== content.unsplashImageUrl &&
      projectId &&
      onContentUpdate &&
      !content.backgroundImage?.startsWith('/uploads/') // Chỉ lưu Unsplash khi không có hình ảnh upload
    ) {
      const updatedContent = {
        ...content,
        unsplashImageUrl,
        backgroundImage: unsplashImageUrl,
      };

      onContentUpdate(updatedContent);
      saveUnsplashUrl(projectId, unsplashImageUrl);
    }
  }, [
    unsplashImageUrl,
    content.unsplashImageUrl,
    projectId,
    content,
    onContentUpdate,
    saveUnsplashUrl,
  ]);

  // Determine which image to use - ưu tiên hình ảnh upload
  const getBackgroundImageUrl = () => {
    // Ưu tiên hình ảnh upload trước
    if (content.backgroundImage && content.backgroundImage.startsWith('/uploads/')) {
      return content.backgroundImage;
    }
    if (content.image && content.image.startsWith('/uploads/')) {
      return content.image;
    }
    
    // Sau đó mới đến Unsplash
    if (content.unsplashImageUrl) return content.unsplashImageUrl;
    if (unsplashImageUrl) return unsplashImageUrl;
    if (content.backgroundImage) return content.backgroundImage;
    if (content.image) return content.image;
    return null;
  };

  const backgroundImageUrl = getBackgroundImageUrl();

  // Get typography styles
  const getTypographyStyles = () => {
    return {
      fontFamily: theme.typography?.fontFamily || "Inter",
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

  // Get button styles
  const getButtonStyles = (variant: "primary" | "outline" = "primary") => {
    const baseStyles = {
      fontFamily: theme.typography?.fontFamily || "Inter",
      fontSize: theme.typography?.fontSize || "16px",
      fontWeight: theme.typography?.fontWeight || "400",
    };

    const primaryColor = content.colorMode === 'custom' && content.primaryColor 
      ? content.primaryColor 
      : theme.colors.primary;

    if (variant === "primary") {
      return {
        ...baseStyles,
        background: content.colorMode === 'custom' && content.primaryColor
          ? `linear-gradient(135deg, ${content.primaryColor}, ${content.primaryColor}80)`
          : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
        color: "#FFFFFF",
        borderRadius: theme.components?.button?.rounded
          ? "9999px"
          : getBorderRadiusClass().replace("rounded-", ""),
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: "all 0.3s ease",
      };
    }

    return {
      ...baseStyles,
      borderColor: primaryColor,
      color: primaryColor,
      backgroundColor: "transparent",
      borderRadius: theme.components?.button?.rounded
        ? "9999px"
        : getBorderRadiusClass().replace("rounded-", ""),
    };
  };


  // Get title size
  const getTitleSize = () => {
    const size = content.titleSize || theme.typography?.headingSize || '2xl';
    switch (size) {
      case "sm":
        return "text-2xl md:text-4xl";
      case "base":
        return "text-3xl md:text-5xl";
      case "lg":
        return "text-4xl md:text-6xl";
      case "xl":
        return "text-5xl md:text-7xl";
      case "2xl":
        return "text-6xl md:text-8xl";
      case "3xl":
        return "text-7xl md:text-9xl";
      default:
        return "text-4xl md:text-6xl";
    }
  };

  // Get subtitle size
  const getSubtitleSize = () => {
    const size = content.subtitleSize || theme.typography?.headingSize || '2xl';
    switch (size) {
      case "sm":
        return "text-xl md:text-3xl";
      case "base":
        return "text-2xl md:text-4xl";
      case "lg":
        return "text-3xl md:text-5xl";
      case "xl":
        return "text-4xl md:text-6xl";
      case "2xl":
        return "text-5xl md:text-7xl";
      case "3xl":
        return "text-6xl md:text-8xl";
      default:
        return "text-2xl md:text-4xl";
    }
  };

  // Get description size
  const getDescriptionSize = () => {
    const size = content.descriptionSize || theme.typography?.bodySize || 'base';
    switch (size) {
      case "xs":
        return "text-base";
      case "sm":
        return "text-lg";
      case "lg":
        return "text-xl";
      case "xl":
        return "text-2xl";
      case "base":
      default:
        return "text-xl";
    }
  };

  // Get benefits size
  const getBenefitsSize = () => {
    const size = content.benefitsSize || theme.typography?.bodySize || 'base';
    switch (size) {
      case "xs":
        return "text-sm";
      case "sm":
        return "text-base";
      case "lg":
        return "text-lg";
      case "xl":
        return "text-xl";
      case "base":
      default:
        return "text-base";
    }
  };

  // Get CTA size
  const getCTASize = () => {
    const size = content.ctaSize || 'base';
    switch (size) {
      case "sm":
        return "text-sm";
      case "lg":
        return "text-lg";
      case "xl":
        return "text-xl";
      case "base":
      default:
        return "text-base";
    }
  };

  // Get stats size
  const getStatsSize = () => {
    const size = content.statsSize || 'base';
    switch (size) {
      case "sm":
        return "text-2xl";
      case "lg":
        return "text-4xl";
      case "xl":
        return "text-5xl";
      case "base":
      default:
        return "text-3xl";
    }
  };

  // Get title weight
  const getTitleWeight = () => {
    const weight = content.titleWeight || theme.typography?.fontWeight || 'bold';
    switch (weight) {
      case "light":
        return "font-light";
      case "normal":
        return "font-normal";
      case "medium":
        return "font-medium";
      case "semibold":
        return "font-semibold";
      case "bold":
        return "font-bold";
      case "extrabold":
        return "font-extrabold";
      case "black":
        return "font-black";
      default:
        return "font-bold";
    }
  };

  // Get subtitle weight
  const getSubtitleWeight = () => {
    const weight = content.subtitleWeight || theme.typography?.fontWeight || 'bold';
    switch (weight) {
      case "light":
        return "font-light";
      case "normal":
        return "font-normal";
      case "medium":
        return "font-medium";
      case "semibold":
        return "font-semibold";
      case "bold":
        return "font-bold";
      case "extrabold":
        return "font-extrabold";
      case "black":
        return "font-black";
      default:
        return "font-bold";
    }
  };

  // Get description weight
  const getDescriptionWeight = () => {
    const weight = content.descriptionWeight || theme.typography?.fontWeight || 'normal';
    switch (weight) {
      case "light":
        return "font-light";
      case "normal":
        return "font-normal";
      case "medium":
        return "font-medium";
      case "semibold":
        return "font-semibold";
      case "bold":
        return "font-bold";
      case "extrabold":
        return "font-extrabold";
      case "black":
        return "font-black";
      default:
        return "font-normal";
    }
  };

  // Get benefits weight
  const getBenefitsWeight = () => {
    const weight = content.benefitsWeight || theme.typography?.fontWeight || 'medium';
    switch (weight) {
      case "light":
        return "font-light";
      case "normal":
        return "font-normal";
      case "medium":
        return "font-medium";
      case "semibold":
        return "font-semibold";
      case "bold":
        return "font-bold";
      case "extrabold":
        return "font-extrabold";
      case "black":
        return "font-black";
      default:
        return "font-medium";
    }
  };

  // Get CTA weight
  const getCTAWeight = () => {
    const weight = content.ctaWeight || theme.typography?.fontWeight || 'medium';
    switch (weight) {
      case "light":
        return "font-light";
      case "normal":
        return "font-normal";
      case "medium":
        return "font-medium";
      case "semibold":
        return "font-semibold";
      case "bold":
        return "font-bold";
      case "extrabold":
        return "font-extrabold";
      case "black":
        return "font-black";
      default:
        return "font-medium";
    }
  };

  // Get stats weight
  const getStatsWeight = () => {
    const weight = content.statsWeight || theme.typography?.fontWeight || 'bold';
    switch (weight) {
      case "light":
        return "font-light";
      case "normal":
        return "font-normal";
      case "medium":
        return "font-medium";
      case "semibold":
        return "font-semibold";
      case "bold":
        return "font-bold";
      case "extrabold":
        return "font-extrabold";
      case "black":
        return "font-black";
      default:
        return "font-bold";
    }
  };

  // Get title font
  const getTitleFont = () => {
    const font = content.titleFont || theme.typography?.fontFamily || 'inter';
    switch (font) {
      case "inter":
        return "font-inter";
      case "poppins":
        return "font-poppins";
      case "roboto":
        return "font-roboto";
      case "open-sans":
        return "font-open-sans";
      case "montserrat":
        return "font-montserrat";
      case "lato":
        return "font-lato";
      case "nunito":
        return "font-nunito";
      case "raleway":
        return "font-raleway";
      case "playfair-display":
        return "font-playfair-display";
      case "merriweather":
        return "font-merriweather";
      default:
        return "font-inter";
    }
  };

  // Get subtitle font
  const getSubtitleFont = () => {
    const font = content.subtitleFont || theme.typography?.fontFamily || 'inter';
    switch (font) {
      case "inter":
        return "font-inter";
      case "poppins":
        return "font-poppins";
      case "roboto":
        return "font-roboto";
      case "open-sans":
        return "font-open-sans";
      case "montserrat":
        return "font-montserrat";
      case "lato":
        return "font-lato";
      case "nunito":
        return "font-nunito";
      case "raleway":
        return "font-raleway";
      case "playfair-display":
        return "font-playfair-display";
      case "merriweather":
        return "font-merriweather";
      default:
        return "font-inter";
    }
  };

  // Get description font
  const getDescriptionFont = () => {
    const font = content.descriptionFont || theme.typography?.fontFamily || 'inter';
    switch (font) {
      case "inter":
        return "font-inter";
      case "poppins":
        return "font-poppins";
      case "roboto":
        return "font-roboto";
      case "open-sans":
        return "font-open-sans";
      case "montserrat":
        return "font-montserrat";
      case "lato":
        return "font-lato";
      case "nunito":
        return "font-nunito";
      case "raleway":
        return "font-raleway";
      case "playfair-display":
        return "font-playfair-display";
      case "merriweather":
        return "font-merriweather";
      default:
        return "font-inter";
    }
  };

  // Get benefits font
  const getBenefitsFont = () => {
    const font = content.benefitsFont || theme.typography?.fontFamily || 'inter';
    switch (font) {
      case "inter":
        return "font-inter";
      case "poppins":
        return "font-poppins";
      case "roboto":
        return "font-roboto";
      case "open-sans":
        return "font-open-sans";
      case "montserrat":
        return "font-montserrat";
      case "lato":
        return "font-lato";
      case "nunito":
        return "font-nunito";
      case "raleway":
        return "font-raleway";
      case "playfair-display":
        return "font-playfair-display";
      case "merriweather":
        return "font-merriweather";
      default:
        return "font-inter";
    }
  };

  // Get CTA font
  const getCTAFont = () => {
    const font = content.ctaFont || theme.typography?.fontFamily || 'inter';
    switch (font) {
      case "inter":
        return "font-inter";
      case "poppins":
        return "font-poppins";
      case "roboto":
        return "font-roboto";
      case "open-sans":
        return "font-open-sans";
      case "montserrat":
        return "font-montserrat";
      case "lato":
        return "font-lato";
      case "nunito":
        return "font-nunito";
      case "raleway":
        return "font-raleway";
      case "playfair-display":
        return "font-playfair-display";
      case "merriweather":
        return "font-merriweather";
      default:
        return "font-inter";
    }
  };

  // Get stats font
  const getStatsFont = () => {
    const font = content.statsFont || theme.typography?.fontFamily || 'inter';
    switch (font) {
      case "inter":
        return "font-inter";
      case "poppins":
        return "font-poppins";
      case "roboto":
        return "font-roboto";
      case "open-sans":
        return "font-open-sans";
      case "montserrat":
        return "font-montserrat";
      case "lato":
        return "font-lato";
      case "nunito":
        return "font-nunito";
      case "raleway":
        return "font-raleway";
      case "playfair-display":
        return "font-playfair-display";
      case "merriweather":
        return "font-merriweather";
      default:
        return "font-inter";
    }
  };

  // Get benefits from content or use localized default
  const benefits = content.benefits || localizedText.benefits;
  
  // Get stats from content or use localized default
  const stats = content.stats || [
    { number: "500+", label: localizedText.stats.orders },
    { number: "15", label: localizedText.stats.experience },
    { number: "100+", label: localizedText.stats.partners }
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center"
      style={{
        backgroundColor: content.colorMode === 'custom' && content.backgroundColor 
          ? content.backgroundColor 
          : theme.sections?.hero?.backgroundColor || theme.colors.background,
        ...getTypographyStyles()
      }}
    >
      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1
                className={cn("leading-tight", getTitleSize(), getTitleWeight(), getTitleFont())}
                style={{
                  color: content.colorMode === 'custom' && content.textColor 
                    ? content.textColor 
                    : theme.sections?.hero?.textColor || theme.colors.text || '#FFFFFF',
                  lineHeight: theme.typography?.lineHeight || '1.2'
                }}
              >
                {content.title || localizedText.defaultTitle}
                <span
                  className={cn("block text-transparent bg-clip-text", getSubtitleSize(), getSubtitleWeight(), getSubtitleFont())}
                  style={{
                    backgroundImage: content.colorMode === 'custom' && content.primaryColor
                      ? `linear-gradient(135deg, ${content.primaryColor}, ${content.primaryColor}80)`
                      : `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.primary})`,
                  }}
                >
                  {content.subtitle || localizedText.defaultSubtitle}
                </span>
              </h1>

              <p
                className={cn("leading-relaxed", getDescriptionSize(), getDescriptionWeight(), getDescriptionFont())}
                style={{
                  color: content.colorMode === 'custom' && content.textColor 
                    ? `${content.textColor}E6` 
                    : `${theme.colors.text || '#000000'}E6`,
                  lineHeight: theme.typography?.lineHeight || "1.6",
                }}
              >
                {content.description || localizedText.defaultDescription}
              </p>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-wrap gap-4">
              {benefits.map((benefit, index) => (
                <div key={benefit.text || index} className="flex items-center space-x-2">
                  {benefit.icon && benefit.icon.length <= 2 ? (
                    // Emoji icons
                    <span className="text-xl">{benefit.icon}</span>
                  ) : (
                    // Lucide icons or fallback
                    <CheckCircle
                      className="h-5 w-5"
                      style={{ 
                        color: content.colorMode === 'custom' && content.primaryColor 
                          ? content.primaryColor 
                          : theme.colors.accent 
                      }}
                    />
                  )}
                  <span
                    className={cn(getBenefitsSize(), getBenefitsWeight(), getBenefitsFont())}
                    style={{
                      color: content.colorMode === 'custom' && content.textColor 
                        ? content.textColor 
                        : theme.colors.text || "#FFFFFF",
                    }}
                  >
                    {typeof benefit === 'string' ? benefit : benefit.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className={cn("group hover:scale-105 hover:shadow-xl transition-all duration-300", getCTASize(), getCTAWeight(), getCTAFont())}
                style={getButtonStyles("primary")}
              >
                {content.ctaText || localizedText.learnMore}
                <ArrowRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={cn("hover:bg-white hover:text-gray-900 transition-all duration-300", getCTASize(), getCTAWeight(), getCTAFont())}
                style={getButtonStyles("outline")}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('guide');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  else window.location.hash = '#guide';
                }}
              >
                <Download size={20} className="mr-2" />
                {localizedText.guideText}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div
                    className={cn("mb-1", getStatsSize(), getStatsWeight(), getStatsFont())}
                    style={{ color: content.colorMode === 'custom' && content.primaryColor 
                      ? content.primaryColor 
                      : theme.colors.accent }}
                  >
                    {stat.number}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: content.colorMode === 'custom' && content.textColor 
                      ? `${content.textColor}CC` 
                      : `${theme.colors.text || "#000000"}CC` }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <Card className="overflow-hidden shadow-2xl border-0">
              {backgroundImageUrl ? (
                <div className="relative w-full h-[600px]">
                  <Image
                    src={backgroundImageUrl}
                    alt="Vietnamese Coffee Export"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                  />
                </div>
              ) : (
                <div
                  className="w-full h-[600px] flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.accent + "20" }}
                >
                  <div className="text-center">
                    <div
                      className="text-6xl mb-4"
                      style={{ color: theme.colors.accent }}
                    >
                      ☕
                    </div>
                    <p className="text-lg" style={{ color: theme.colors.text }}>
                      Cà phê Việt Nam
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Floating Stats Card */}
            {/* <Card
              className={cn(
                "absolute -bottom-6 -left-6 p-6 backdrop-blur border shadow-lg",
                getBorderRadiusClass()
              )}
              style={{
                backgroundColor: content.colorMode === 'custom' && content.backgroundColor 
                  ? `${content.backgroundColor}E6` 
                  : `${theme.colors.background}E6`,
                borderColor: content.colorMode === 'custom' && content.primaryColor 
                  ? content.primaryColor 
                  : theme.colors.border || theme.colors.primary,
              }}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center",
                    getBorderRadiusClass()
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                  }}
                >
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div
                    className="font-bold"
                    style={{ color: content.colorMode === 'custom' && content.textColor 
                      ? content.textColor 
                      : theme.colors.text }}
                  >
                    {localizedText.trust.quality}
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: content.colorMode === 'custom' && content.textColor 
                        ? `${content.textColor}CC` 
                        : `${theme.colors.text}CC`,
                    }}
                  >
                    {localizedText.trust.certified}
                  </div>
                </div>
              </div>
            </Card> */}
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div
        className="absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl"
        style={{ backgroundColor: `${theme.colors.accent}10` }}
      ></div>
      <div
        className="absolute bottom-20 left-20 w-48 h-48 rounded-full blur-2xl"
        style={{ backgroundColor: `${theme.colors.primary}10` }}
      ></div>
    </section>
  );
};

export default HeroSection;
