"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Download, CheckCircle } from "lucide-react";
import { ThemeParams } from "@/types";
import Image from "next/image";
import { useHeroImage } from "@/hooks/use-unsplash-image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useParams } from "next/navigation";
import { useEffect } from "react";
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
  overlayColor?: string;
  overlayOpacity?: number;
  unsplashImageUrl?: string;
}

interface HeroSectionProps {
  theme: ThemeParams;
  content: HeroContent;
  onContentUpdate?: (content: HeroContent) => void;
}

const HeroSection = ({ theme, content, onContentUpdate }: HeroSectionProps) => {
  const params = useParams();
  const projectId = params?.projectId as string;

  // Use Unsplash for hero background image
  const {
    imageUrl: unsplashImageUrl,
    isLoading: imageLoading,
    error: imageError,
  } = useHeroImage();

  // Save Unsplash URL to project when it's fetched
  useEffect(() => {
    if (
      unsplashImageUrl &&
      unsplashImageUrl !== content.unsplashImageUrl &&
      projectId &&
      onContentUpdate
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
  ]);

  // Function to save Unsplash URL to project
  const saveUnsplashUrl = async (projectId: string, imageUrl: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "GET",
      });

      if (!response.ok) return;

      const { project } = await response.json();

      let themeParams = theme;
      if (project.versions && project.versions.length > 0) {
        const latestVersion = project.versions[project.versions.length - 1];
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
          themeParams: updatedThemeParams,
        }),
      });

      console.log("Unsplash URL saved to project:", imageUrl);
    } catch (error) {
      console.error("Failed to save Unsplash URL:", error);
    }
  };

  // Determine which image to use
  const getBackgroundImageUrl = () => {
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

    if (variant === "primary") {
      return {
        ...baseStyles,
        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
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
      borderColor: theme.colors.primary,
      color: theme.colors.primary,
      backgroundColor: "transparent",
      borderRadius: theme.components?.button?.rounded
        ? "9999px"
        : getBorderRadiusClass().replace("rounded-", ""),
    };
  };

  // Get heading size
  const getHeadingSize = () => {
    switch (theme.typography?.headingSize) {
      case "sm":
        return "text-3xl md:text-5xl";
      case "base":
        return "text-4xl md:text-6xl";
      case "lg":
        return "text-5xl md:text-7xl";
      case "xl":
        return "text-6xl md:text-8xl";
      case "2xl":
      default:
        return "text-4xl md:text-6xl";
    }
  };

  // Get body text size
  const getBodySize = () => {
    switch (theme.typography?.bodySize) {
      case "xs":
        return "text-lg";
      case "sm":
        return "text-xl";
      case "lg":
        return "text-2xl";
      case "xl":
        return "text-3xl";
      case "base":
      default:
        return "text-xl";
    }
  };

  const benefits = [
    "Chất lượng cao",
    "Giá cạnh tranh",
    "Giao hàng đúng hạn",
    "Hỗ trợ 24/7",
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center"
      // style={{
      //   backgroundColor: content.backgroundColor || theme.sections?.hero?.backgroundColor || theme.colors.background,
      //   ...getTypographyStyles()
      // }}
    >
      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1
                  // className={cn("font-bold leading-tight", getHeadingSize())}
                  // style={{
                  //   color: content.textColor || theme.sections?.hero?.textColor || theme.colors.text || '#FFFFFF',
                  //   fontWeight: theme.typography?.fontWeight || '700',
                  //   lineHeight: theme.typography?.lineHeight || '1.2'
                  // }}
                className="font-bold text-4xl md:text-6xl"
                
              >
                {content.title || "Cà Phê Việt Nam"}
                <span
                  className="block text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.primary})`,
                  }}
                >
                  {content.subtitle || "Chất Lượng Quốc Tế"}
                </span>
              </h1>

              <p
                className={cn("leading-relaxed", getBodySize())}
                style={{
                  // color: `${content.textColor || '#000000'}E6`,
                  lineHeight: theme.typography?.lineHeight || "1.6",
                }}
              >
                {content.description ||
                  "Chúng tôi chuyên cung cấp các loại cà phê Việt Nam chất lượng cao cho thị trường quốc tế, đảm bảo hương vị đặc trưng và tiêu chuẩn xuất khẩu."}
              </p>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-wrap gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center space-x-2">
                  <CheckCircle
                    className="h-5 w-5"
                    style={{ color: theme.colors.accent }}
                  />
                  <span
                    className="font-medium"
                    style={{
                      color:
                        content.textColor || theme.colors.text || "#FFFFFF",
                    }}
                  >
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group hover:scale-105 hover:shadow-xl transition-all duration-300"
                style={getButtonStyles("primary")}
              >
                {content.ctaText || "Tìm hiểu thêm"}
                <ArrowRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="hover:bg-white hover:text-gray-900 transition-all duration-300"
                style={getButtonStyles("outline")}
              >
                <Download size={20} className="mr-2" />
                Hướng dẫn XNK từ A-Z
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: theme.colors.accent }}
                >
                  500+
                </div>
                <div
                  className="text-sm"
                  style={{ color: `${content.textColor || "#000000"}CC` }}
                >
                  Đơn hàng thành công
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: theme.colors.accent }}
                >
                  15
                </div>
                <div
                  className="text-sm"
                  style={{ color: `${content.textColor || "#000000"}CC` }}
                >
                  Năm kinh nghiệm
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: theme.colors.accent }}
                >
                  100+
                </div>
                <div
                  className="text-sm"
                  style={{ color: `${content.textColor || "#000000"}CC` }}
                >
                  Đối tác Mỹ
                </div>
              </div>
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
            <Card
              className={cn(
                "absolute -bottom-6 -left-6 p-6 backdrop-blur border shadow-lg",
                getBorderRadiusClass()
              )}
              style={{
                backgroundColor: `${
                  content.backgroundColor || theme.colors.background
                }E6`,
                borderColor: theme.colors.border || theme.colors.primary,
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
                    style={{ color: content.textColor || theme.colors.text }}
                  >
                    100% Chất lượng
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: `${content.textColor || theme.colors.text}CC`,
                    }}
                  >
                    FDA & HACCP Certified
                  </div>
                </div>
              </div>
            </Card>
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
