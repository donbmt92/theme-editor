import { HeroParams } from "../../types";
import { renderLucideIcon } from "../icons";

interface HeroContentExtended {
  [key: string]:
    | string
    | number
    | boolean
    | undefined
    | Array<{ icon: string; text: string }>;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  image?: string;
  backgroundImage?: string;
  heroImage?: string;
  unsplashImageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  titleFont?: string;
  subtitleFont?: string;
  descriptionFont?: string;
  benefitsFont?: string;
  ctaFont?: string;
  statsFont?: string;
  titleSize?: string;
  subtitleSize?: string;
  descriptionSize?: string;
  benefitsSize?: string;
  ctaSize?: string;
  statsSize?: string;
  titleWeight?: string;
  subtitleWeight?: string;
  descriptionWeight?: string;
  benefitsWeight?: string;
  ctaWeight?: string;
  statsWeight?: string;
  benefits?: Array<{
    icon: string;
    text: string;
  }>;
}

/**
 * Generate static hero section HTML with enhanced customization support
 */
export function generateStaticHeroSection({
  content,
  themeParams,
}: HeroParams): string {
  const getTypographyStyles = () => {
    return {
      fontFamily:
        themeParams?.typography?.fontFamily ||
        'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontSize: themeParams?.typography?.fontSize || "16px",
      lineHeight: themeParams?.typography?.lineHeight || "1.6",
      fontWeight: themeParams?.typography?.fontWeight || "400",
    };
  };

  // Get font family based on hero content settings
  const getFontFamily = (fontType: string) => {
    const heroContent = content as HeroContentExtended;
    const fontName = heroContent?.[fontType] || "inter";

    switch (fontName) {
      case "inter":
        return '"Inter", ui-sans-serif, system-ui, sans-serif';
      case "poppins":
        return '"Poppins", ui-sans-serif, system-ui, sans-serif';
      case "roboto":
        return '"Roboto", ui-sans-serif, system-ui, sans-serif';
      case "open-sans":
        return '"Open Sans", ui-sans-serif, system-ui, sans-serif';
      case "montserrat":
        return '"Montserrat", ui-sans-serif, system-ui, sans-serif';
      case "lato":
        return '"Lato", ui-sans-serif, system-ui, sans-serif';
      case "nunito":
        return '"Nunito", ui-sans-serif, system-ui, sans-serif';
      case "raleway":
        return '"Raleway", ui-sans-serif, system-ui, sans-serif';
      case "playfair-display":
        return '"Playfair Display", ui-serif, Georgia, serif';
      case "merriweather":
        return '"Merriweather", ui-serif, Georgia, serif';
      default:
        return '"Inter", ui-sans-serif, system-ui, sans-serif';
    }
  };

  // Get font size based on hero content settings
  const getFontSize = (sizeType: string, defaultSize: string) => {
    const heroContent = content as HeroContentExtended;
    const size = heroContent?.[sizeType];
    

    switch (size) {
      case "xs":
        return "0.75rem";    // text-xs
      case "sm":
        return "0.875rem";   // text-sm
      case "base":
        return "1rem";       // text-base
      case "lg":
        return "1.125rem";   // text-lg
      case "xl":
        return "1.25rem";    // text-xl
      case "2xl":
        return "1.5rem";     // text-2xl
      case "3xl":
        return "1.875rem";   // text-3xl
      default:
        return defaultSize;
    }
  };

  // Get title size - matches HeroSection.tsx getTitleSize function (desktop sizes)
  const getTitleSize = () => {
    const heroContent = content as HeroContentExtended;
    const size = heroContent?.titleSize || themeParams?.typography?.headingSize || '2xl';
    
    switch (size) {
      case "sm":
        return "2.25rem";    // text-4xl - matches Tailwind exactly
      case "base":
        return "3rem";       // text-5xl - matches Tailwind exactly
      case "lg":
        return "3.75rem";    // text-6xl - matches Tailwind exactly
      case "xl":
        return "4.5rem";     // text-7xl - matches Tailwind exactly
      case "2xl":
        return "6rem";       // text-8xl - matches Tailwind exactly
      case "3xl":
        return "8rem";       // text-9xl - matches Tailwind exactly
      default:
        return "3.75rem";    // default text-6xl - matches Tailwind exactly
    }
  };

    // Get subtitle size - matches HeroSection.tsx getSubtitleSize function (desktop sizes)
  const getSubtitleSize = () => {
    const heroContent = content as HeroContentExtended;
    const size = heroContent?.subtitleSize || themeParams?.typography?.headingSize || '2xl';
    
    switch (size) {
      case "sm":
        return "1.875rem";   // text-3xl - matches Tailwind exactly
      case "base":
        return "2.25rem";    // text-4xl - matches Tailwind exactly
      case "lg":
        return "3rem";       // text-5xl - matches Tailwind exactly
      case "xl":
        return "3.75rem";    // text-6xl - matches Tailwind exactly
      case "2xl":
        return "4.5rem";     // text-7xl - matches Tailwind exactly
      case "3xl":
        return "6rem";       // text-8xl - matches Tailwind exactly
      default:
        return "2.25rem";    // default text-4xl - matches Tailwind exactly
    }
  };

  // Get font weight based on hero content settings
  const getFontWeight = (weightType: string, defaultWeight: string) => {
    const heroContent = content as HeroContentExtended;
    const weight = heroContent?.[weightType];

    switch (weight) {
      case "light":
        return "300";
      case "normal":
        return "400";
      case "medium":
        return "500";
      case "semibold":
        return "600";
      case "bold":
        return "700";
      case "extrabold":
        return "800";
      case "black":
        return "900";
      default:
        return defaultWeight;
    }
  };

  const getBorderRadiusClass = () => {
    switch (themeParams?.layout?.borderRadius) {
      case "none":
        return "0";
      case "small":
        return "0.125rem";
      case "large":
        return "0.5rem";
      case "medium":
      default:
        return "0.375rem";
    }
  };

  const typographyStyles = getTypographyStyles();
  const borderRadius = getBorderRadiusClass();

  // Get background image URL for static export
  const getBackgroundImageUrl = () => {
    const heroContent = content as HeroContentExtended;

    // For static export, use local assets paths
    if (heroContent?.backgroundImage) {
      if (heroContent.backgroundImage.toString().startsWith("/uploads/")) {
        return "assets/images/hero-bg.jpg";
      }
      if (heroContent.backgroundImage.toString().startsWith("http")) {
        return "assets/images/hero-unsplash.jpg";
      }
    }

    if (heroContent?.heroImage) {
      if (heroContent.heroImage.toString().startsWith("/uploads/")) {
        return "assets/images/hero.jpg";
      }
      if (heroContent.heroImage.toString().startsWith("http")) {
        return "assets/images/hero-unsplash.jpg";
      }
    }

    if (heroContent?.image) {
      if (heroContent.image.toString().startsWith("/uploads/")) {
        return "assets/images/hero-alt.jpg";
      }
      if (heroContent.image.toString().startsWith("http")) {
        return "assets/images/hero-unsplash.jpg";
      }
    }

    if (heroContent?.unsplashImageUrl) {
      return "assets/images/hero-unsplash.jpg";
    }

    return null;
  };

  const backgroundImageUrl = getBackgroundImageUrl();

  return `<section id="hero" style="
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    background-color: ${
      content?.backgroundColor ||
      themeParams?.sections?.hero?.backgroundColor ||
      themeParams?.colors?.background ||
      "#F5F5DC"
    };
    color: ${
      content?.textColor ||
      themeParams?.sections?.hero?.textColor ||
      themeParams?.colors?.text ||
      "#2D3748"
    };
    font-family: ${typographyStyles.fontFamily};
    font-size: ${typographyStyles.fontSize};
    line-height: ${typographyStyles.lineHeight};
    font-weight: ${typographyStyles.fontWeight};
  ">
    <!-- Background Elements -->
    <div style="
      position: absolute;
      top: 5rem;
      right: 5rem;
      width: 16rem;
      height: 16rem;
      border-radius: 50%;
      filter: blur(3rem);
      background-color: ${themeParams?.colors?.accent || "#CD853F"}10;
    "></div>
    <div style="
      position: absolute;
      bottom: 5rem;
      left: 5rem;
      width: 12rem;
      height: 12rem;
      border-radius: 50%;
      filter: blur(2rem);
      background-color: ${themeParams?.colors?.primary || "#8B4513"}10;
    "></div>

    <!-- Content -->
    <div style="
      max-width: ${themeParams?.layout?.containerWidth || "1200px"}; 
      margin: 0 auto; 
      padding: 5rem 1rem;
      position: relative;
      z-index: 20;
    ">
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: center;
      " class="hero-grid">
        <!-- Left Content -->
        <div style="display: flex; flex-direction: column; gap: 2rem;">
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <h1 style="
              color: ${content?.textColor || themeParams?.sections?.hero?.textColor || themeParams?.colors?.text || "#2D3748"};
              font-family: ${getFontFamily("titleFont").replace(/"/g, "'")};
              font-size: ${getTitleSize()};
              font-weight: ${getFontWeight("titleWeight", themeParams?.typography?.fontWeight || "700")};
              line-height: 1.2;
              margin: 0;
            ">
              ${content?.title || "Cà Phê Việt Nam"}
              <span style="
                display: block;
                background: linear-gradient(135deg, ${content?.primaryColor || themeParams?.colors?.accent || "#CD853F"}, ${content?.primaryColor || themeParams?.colors?.primary || "#8B4513"});
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                font-family: ${getFontFamily("subtitleFont").replace(/"/g, "'")};
                font-size: ${getSubtitleSize()};
                font-weight: ${getFontWeight("subtitleWeight", themeParams?.typography?.fontWeight || "600")};
              ">
                ${content?.subtitle || "Chất Lượng Quốc Tế"}
              </span>
            </h1>

            <p style="
              color: ${content?.textColor ? `${content.textColor}E6` : `${themeParams?.colors?.text || "#000000"}E6`};
              font-family: ${getFontFamily("descriptionFont").replace(/"/g, "'")};
              font-size: ${getFontSize("descriptionSize", themeParams?.typography?.bodySize === "sm" ? "1.125rem" : themeParams?.typography?.bodySize === "lg" ? "1.375rem" : themeParams?.typography?.bodySize === "xl" ? "1.5rem" : "1.25rem")};
              font-weight: ${getFontWeight("descriptionWeight", "400")};
              line-height: 1.6;
              margin: 0;
            ">
              ${content?.description || "Chúng tôi chuyên cung cấp các loại cà phê Việt Nam chất lượng cao cho thị trường quốc tế, đảm bảo hương vị đặc trưng và tiêu chuẩn xuất khẩu."}
            </p>
          </div>

          <!-- Key Benefits -->
          <div class="benefits-container" style="
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
          ">
            ${(() => {
              const heroContent = content as HeroContentExtended;
              const benefits = heroContent?.benefits || [
                { icon: "✅", text: "Chất lượng cao" },
                { icon: "💰", text: "Giá cạnh tranh" },
                { icon: "🚚", text: "Giao hàng đúng hạn" },
                { icon: "📞", text: "Hỗ trợ 24/7" },
              ];

              return benefits
                .map(
                  (benefit) => `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  ${
                    benefit.icon && benefit.icon.length <= 2
                      ? `<span style="font-size: 1.25rem;">${benefit.icon}</span>`
                      : `<div style="
                        width: 20px;
                        height: 20px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        color: ${
                          content?.primaryColor ||
                          themeParams?.colors?.accent ||
                          "#CD853F"
                        };
                      ">${renderLucideIcon(benefit.icon, 20)}</div>`
                  }
                  <span style="
                    font-family: ${getFontFamily("benefitsFont")};
                    font-size: ${getFontSize("benefitsSize", "1rem")};
                    font-weight: ${getFontWeight("benefitsWeight", "500")};
                    color: ${content?.textColor || themeParams?.colors?.text || "#2D3748"};
                  ">${benefit.text}</span>
                </div>
              `
                )
                .join("");
            })()}
          </div>

          <!-- CTAs -->
          <div style="
            display: flex;
            flex-direction: column;
            gap: 1rem;
          ">
            <div class="cta-container" style="
              display: flex;
              gap: 1rem;
              flex-wrap: wrap;
            ">
              <button style="
                background: ${content?.primaryColor ? `linear-gradient(135deg, ${content.primaryColor}, ${content.primaryColor}80)` : `linear-gradient(135deg, ${themeParams?.colors?.primary || "#8B4513"}, ${themeParams?.colors?.accent || "#CD853F"})`};
                color: #FFFFFF;
                border: none;
                padding: 1rem 2rem;
                border-radius: ${themeParams?.components?.button?.rounded ? "9999px" : borderRadius};
                font-family: ${getFontFamily("ctaFont")};
                font-size: ${getFontSize("ctaSize", "1rem")};
                font-weight: ${getFontWeight("ctaWeight", "600")};
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
              " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 20px 40px -10px rgba(0, 0, 0, 0.2)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'">
                ${content?.ctaText || "Tìm hiểu thêm"}
                <span style="margin-left: 0.5rem; transition: transform 0.3s ease;">→</span>
              </button>
              
              <button style="
                background: transparent;
                border: 2px solid ${content?.primaryColor || themeParams?.colors?.primary || "#8B4513"};
                color: ${content?.primaryColor || themeParams?.colors?.primary || "#8B4513"};
                padding: 1rem 2rem;
                border-radius: ${themeParams?.components?.button?.rounded ? "9999px" : borderRadius};
                font-family: ${getFontFamily("ctaFont")};
                font-size: ${getFontSize("ctaSize", "1rem")};
                font-weight: ${getFontWeight("ctaWeight", "600")};
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
              " onmouseover="this.style.backgroundColor='${content?.primaryColor || themeParams?.colors?.primary || "#8B4513"}'; this.style.color='#FFFFFF'" onmouseout="this.style.backgroundColor='transparent'; this.style.color='${content?.primaryColor || themeParams?.colors?.primary || "#8B4513"}'">
                📖 Hướng dẫn XNK từ A-Z
              </button>
            </div>
          </div>

          <!-- Trust Indicators -->
          <div class="trust-indicators" style="
            display: flex;
            align-items: center;
            gap: 2rem;
            padding-top: 2rem;
          ">
            <div style="text-align: center;">
              <div style="
                font-family: ${getFontFamily("statsFont")};
                font-size: ${getFontSize("statsSize", "3rem")};
                font-weight: ${getFontWeight("statsWeight", "700")};
                color: ${content?.primaryColor || themeParams?.colors?.accent || "#CD853F"};
                margin-bottom: 0.25rem;
              ">500+</div>
              <div style="
                font-size: 0.875rem;
                color: ${content?.textColor ? `${content.textColor}CC` : `${themeParams?.colors?.text || "#000000"}CC`};
              ">Đơn hàng thành công</div>
            </div>
            <div style="text-align: center;">
              <div style="
                font-family: ${getFontFamily("statsFont")};
                font-size: ${getFontSize("statsSize", "3rem")};
                font-weight: ${getFontWeight("statsWeight", "700")};
                color: ${content?.primaryColor || themeParams?.colors?.accent || "#CD853F"};
                margin-bottom: 0.25rem;
              ">15</div>
              <div style="
                font-size: 0.875rem;
                color: ${content?.textColor ? `${content.textColor}CC` : `${themeParams?.colors?.text || "#000000"}CC`};
              ">Năm kinh nghiệm</div>
            </div>
            <div style="text-align: center;">
              <div style="
                font-family: ${getFontFamily("statsFont")};
                font-size: ${getFontSize("statsSize", "3rem")};
                font-weight: ${getFontWeight("statsWeight", "700")};
                color: ${content?.primaryColor || themeParams?.colors?.accent || "#CD853F"};
                margin-bottom: 0.25rem;
              ">100+</div>
              <div style="
                font-size: 0.875rem;
                color: ${
                  content?.textColor
                    ? `${content.textColor}CC`
                    : `${themeParams?.colors?.text || "#000000"}CC`
                };
              ">Đối tác Mỹ</div>
            </div>
          </div>
        </div>

        <!-- Right Image -->
        <div style="position: relative;">
          <div style="
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border: none;
            border-radius: ${borderRadius};
          ">
            ${
              backgroundImageUrl
                ? `
              <div style="
                position: relative;
                width: 100%;
                height: 600px;
              ">
                <img
                  src="${backgroundImageUrl}"
                  alt="Vietnamese Coffee Export"
                  style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  "
                />
              </div>
            `
                : `
              <div style="
                width: 100%;
                height: 600px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: ${themeParams?.colors?.accent || "#CD853F"}20;
              ">
                <div style="text-align: center;">
                  <div style="
                    font-size: 4rem;
                    color: ${themeParams?.colors?.accent || "#CD853F"};
                    margin-bottom: 1rem;
                  ">☕</div>
                  <p style="
                    font-size: 1.125rem;
                    color: ${themeParams?.colors?.text || "#2D3748"};
                  ">Cà phê Việt Nam</p>
                </div>
              </div>
            `
            }
          </div>

          <!-- Floating Stats Card -->
          <div class="floating-card" style="
            position: absolute;
            bottom: -1.5rem;
            left: -1.5rem;
            padding: 1.5rem;
            backdrop-filter: blur(10px);
            border: 1px solid ${content?.primaryColor || themeParams?.colors?.border || themeParams?.colors?.primary || "#8B4513"};
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border-radius: ${borderRadius};
            background-color: ${content?.backgroundColor ? `${content.backgroundColor}E6` : `${themeParams?.colors?.background || "#FFFFFF"}E6`};
          ">
            <div style="
              display: flex;
              align-items: center;
              gap: 1rem;
            ">
              <div style="
                height: 3rem;
                width: 3rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, ${
                  themeParams?.colors?.primary || "#8B4513"
                }, ${themeParams?.colors?.accent || "#CD853F"});
              ">
                <span style="color: white; font-size: 1.5rem;">✓</span>
              </div>
              <div>
                <div style="
                  font-weight: 700;
                  color: ${
                    content?.textColor || themeParams?.colors?.text || "#2D3748"
                  };
                ">100% Chất lượng</div>
                <div style="
                  font-size: 0.875rem;
                  color: ${
                    content?.textColor
                      ? `${content.textColor}CC`
                      : `${themeParams?.colors?.text || "#2D3748"}CC`
                  };
                ">FDA & HACCP Certified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      
      /* Large screens - Desktop layout (lg:grid-cols-2 equivalent) */
      @media (min-width: 1024px) {
        #hero .hero-grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 3rem;
        }
      }
      
      /* Tablet and Mobile - Single column layout (below lg) */
      @media (max-width: 1023px) {
        #hero .hero-grid {
          grid-template-columns: 1fr !important;
          text-align: center;
          gap: 3rem;
        }
        
        #hero .hero-grid > div:first-child {
          order: 2;
        }
        
        #hero .hero-grid > div:last-child {
          order: 1;
          margin-bottom: 2rem;
        }
      }
      
      /* Medium screens - CTA row layout (sm:flex-row equivalent) */
      @media (min-width: 640px) and (max-width: 1023px) {
        #hero .cta-container {
          flex-direction: row !important;
          justify-content: center;
        }
      }
      
      /* Small screens - CTA column layout (below sm) */
      @media (max-width: 639px) {
        #hero .cta-container {
          flex-direction: column !important;
          width: 100%;
        }
        
        #hero .cta-container button {
          width: 100%;
          justify-content: center;
        }
      }
      
      /* Mobile breakpoint - Base mobile styles */
      @media (max-width: 768px) {
        #hero {
          padding: 2rem 0;
        }
        
        #hero > div {
          padding: 2rem 1rem;
        }
        
        /* Responsive font sizes - Base mobile (text-4xl equivalent) */
        #hero h1 {
          font-size: ${(() => {
            const heroContent = content as HeroContentExtended;
            const size = heroContent?.titleSize || '2xl';
            switch (size) {
              case 'sm': return '2.25rem';    // text-4xl - base mobile size
              case 'base': return '2.25rem';  // text-4xl - base mobile size
              case 'lg': return '2.25rem';    // text-4xl - base mobile size
              case 'xl': return '2.25rem';    // text-4xl - base mobile size
              case '2xl': return '2.25rem';   // text-4xl - base mobile size
              case '3xl': return '2.25rem';   // text-4xl - base mobile size
              default: return '2.25rem';      // text-4xl - base mobile size
            }
          })()} !important;
        }
        
        #hero h1 span {
          font-size: ${(() => {
            const heroContent = content as HeroContentExtended;
            const size = heroContent?.subtitleSize || '2xl';
            switch (size) {
              case 'sm': return '1.875rem';   // text-3xl - base mobile size
              case 'base': return '1.875rem'; // text-3xl - base mobile size
              case 'lg': return '1.875rem';   // text-3xl - base mobile size
              case 'xl': return '1.875rem';   // text-3xl - base mobile size
              case '2xl': return '1.875rem';  // text-3xl - base mobile size
              case '3xl': return '1.875rem';  // text-3xl - base mobile size
              default: return '1.875rem';     // text-3xl - base mobile size
            }
          })()} !important;
        }
        
        /* Responsive benefits section */
        #hero .benefits-container {
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        
        /* Responsive trust indicators */
        #hero .trust-indicators {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }
        
        /* Responsive floating card */
        #hero .floating-card {
          position: relative;
          bottom: auto;
          left: auto;
          margin-top: 1rem;
          width: 100%;
        }
      }
      
      /* Medium mobile - Enhanced font sizes (md:text-6xl equivalent) */
      @media (min-width: 768px) and (max-width: 1023px) {
        #hero h1 {
          font-size: ${(() => {
            const heroContent = content as HeroContentExtended;
            const size = heroContent?.titleSize || '2xl';
            switch (size) {
              case 'sm': return '3rem';       // text-5xl - medium mobile
              case 'base': return '3.75rem';  // text-6xl - medium mobile
              case 'lg': return '3.75rem';    // text-6xl - medium mobile
              case 'xl': return '3.75rem';    // text-6xl - medium mobile
              case '2xl': return '3.75rem';   // text-6xl - medium mobile
              case '3xl': return '3.75rem';   // text-6xl - medium mobile
              default: return '3.75rem';      // text-6xl - medium mobile
            }
          })()} !important;
        }
        
        #hero h1 span {
          font-size: ${(() => {
            const heroContent = content as HeroContentExtended;
            const size = heroContent?.subtitleSize || '2xl';
            switch (size) {
              case 'sm': return '2.25rem';    // text-4xl - medium mobile
              case 'base': return '2.25rem';  // text-4xl - medium mobile
              case 'lg': return '2.25rem';    // text-4xl - medium mobile
              case 'xl': return '2.25rem';    // text-4xl - medium mobile
              case '2xl': return '2.25rem';   // text-4xl - medium mobile
              case '3xl': return '2.25rem';   // text-4xl - medium mobile
              default: return '2.25rem';      // text-4xl - medium mobile
            }
          })()} !important;
        }
      }
      
      /* Small mobile breakpoint */
      @media (max-width: 480px) {
        #hero {
          padding: 1rem 0;
        }
        
        #hero > div {
          padding: 1.5rem 0.5rem;
        }
        
        #hero h1 {
          font-size: 1.875rem !important;  // text-3xl - small mobile
        }
        
        #hero h1 span {
          font-size: 1.5rem !important;    // text-2xl - small mobile
        }
      }
    </style>
  </section>`;
}
