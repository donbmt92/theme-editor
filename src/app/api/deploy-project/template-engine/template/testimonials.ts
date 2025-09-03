import { TestimonialsParams } from '../../types'

interface TestimonialsContent {
  [key: string]: unknown
  title?: string
  subtitle?: string
  backgroundColor?: string
  textColor?: string
  colorMode?: 'theme' | 'custom'
  primaryColor?: string
  titleSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
  titleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  titleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather'
  subtitleSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  subtitleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  subtitleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather'
  testimonials?: Array<{
    id?: string
    name: string
    title: string
    company: string
    content: string
    rating?: number
    image?: string
  }>
  stats?: Array<{
    number: string
    label: string
    sublabel?: string
  }>
}

/**
 * Generate static testimonials section HTML
 */
export function generateStaticTestimonialsSection({ content, themeParams }: TestimonialsParams): string {
  const getTypographyStyles = () => {
    return {
      fontFamily: themeParams?.typography?.fontFamily || 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontSize: themeParams?.typography?.fontSize || '16px',
      lineHeight: themeParams?.typography?.lineHeight || '1.6',
      fontWeight: themeParams?.typography?.fontWeight || '400',
    }
  }

  const getBorderRadiusClass = () => {
    switch (themeParams?.layout?.borderRadius) {
      case 'none':
        return '0'
      case 'small':
        return '0.125rem'
      case 'large':
        return '0.5rem'
      case 'medium':
      default:
        return '0.375rem'
    }
  }

  // Typography helper functions
  const getFontFamily = (fontType: string) => {
    const testimonialsContent = content as TestimonialsContent;
    const fontName = testimonialsContent?.[fontType] || 'inter';
    
    switch (fontName) {
      case 'inter': return '"Inter", ui-sans-serif, system-ui, sans-serif';
      case 'poppins': return '"Poppins", ui-sans-serif, system-ui, sans-serif';
      case 'roboto': return '"Roboto", ui-sans-serif, system-ui, sans-serif';
      case 'open-sans': return '"Open Sans", ui-sans-serif, system-ui, sans-serif';
      case 'montserrat': return '"Montserrat", ui-sans-serif, system-ui, sans-serif';
      case 'lato': return '"Lato", ui-sans-serif, system-ui, sans-serif';
      case 'nunito': return '"Nunito", ui-sans-serif, system-ui, sans-serif';
      case 'raleway': return '"Raleway", ui-sans-serif, system-ui, sans-serif';
      case 'playfair-display': return '"Playfair Display", ui-serif, Georgia, serif';
      case 'merriweather': return '"Merriweather", ui-serif, Georgia, serif';
      default: return '"Inter", ui-sans-serif, system-ui, sans-serif';
    }
  }

  const getFontSize = (sizeType: string, defaultSize: string) => {
    const testimonialsContent = content as TestimonialsContent;
    const size = testimonialsContent?.[sizeType];
    
    switch (size) {
      case 'xs': return '0.75rem';
      case 'sm': return '0.875rem';
      case 'base': return '1rem';
      case 'lg': return '1.125rem';
      case 'xl': return '1.25rem';
      case '2xl': return '1.5rem';
      case '3xl': return '1.875rem';
      default: return defaultSize;
    }
  }

  const getFontWeight = (weightType: string, defaultWeight: string) => {
    const testimonialsContent = content as TestimonialsContent;
    const weight = testimonialsContent?.[weightType];
    
    switch (weight) {
      case 'light': return '300';
      case 'normal': return '400';
      case 'medium': return '500';
      case 'semibold': return '600';
      case 'bold': return '700';
      case 'extrabold': return '800';
      case 'black': return '900';
      default: return defaultWeight;
    }
  }

  const typographyStyles = getTypographyStyles()
  const borderRadius = getBorderRadiusClass()

  // Get content data with proper typing
  const testimonialsContent = content as TestimonialsContent;
  const isCustom = testimonialsContent?.colorMode === 'custom'

  // Get colors based on colorMode
  const bgColor = isCustom
    ? (testimonialsContent?.backgroundColor || '#F8F9FA')
    : (themeParams?.sections?.testimonials?.backgroundColor || themeParams?.colors?.background || '#F8F9FA')

  const textColor = isCustom
    ? (testimonialsContent?.textColor || '#2D3748')
    : (themeParams?.sections?.testimonials?.textColor || themeParams?.colors?.text || '#2D3748')

  const primaryColor = isCustom
    ? (testimonialsContent?.primaryColor || '#8B4513')
    : (themeParams?.colors?.primary || '#8B4513')

  const accentColor = themeParams?.colors?.accent || '#CD853F'

  // Default data
  const defaultTestimonials = [
    {
      id: "1",
      name: "Sarah Johnson",
      title: "Coffee Buyer",
      company: "Starbucks Reserve",
      content: "Chất lượng cà phê Việt Nam vượt trội hơn mong đợi. Hương vị đậm đà và quy trình sản xuất rất chuyên nghiệp.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "Quality Manager",
      company: "Blue Bottle Coffee",
      content: "Đối tác tin cậy với cam kết chất lượng cao. Giao hàng đúng hạn và dịch vụ khách hàng xuất sắc.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: "3",
      name: "David Rodriguez",
      title: "Import Director",
      company: "Intelligentsia",
      content: "Cà phê Robusta Việt Nam có hương vị độc đáo, phù hợp hoàn hảo cho blend espresso của chúng tôi.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    }
  ]

  const defaultStats = [
    { number: "500+", label: "Lô hàng xuất khẩu", sublabel: "Cà phê chất lượng cao" },
    { number: "200+", label: "Khách hàng tin tưởng", sublabel: "Từ 25 tiểu bang Mỹ" },
    { number: "15+", label: "Năm kinh nghiệm", sublabel: "Thị trường quốc tế" },
    { number: "98%", label: "Tỷ lệ hài lòng", sublabel: "Khách hàng đánh giá" }
  ]

  // Use content or defaults
  const testimonials = testimonialsContent?.testimonials || defaultTestimonials
  const stats = testimonialsContent?.stats || defaultStats

  return `<section id="testimonials" style="
    background-color: ${bgColor};
    color: ${textColor};
    padding: 5rem 0;
    font-family: ${typographyStyles.fontFamily};
    font-size: ${typographyStyles.fontSize};
    line-height: ${typographyStyles.lineHeight};
    font-weight: ${typographyStyles.fontWeight};
  ">
    <div style="
      max-width: ${themeParams?.layout?.containerWidth || '1200px'}; 
      margin: 0 auto; 
      padding: 0 1rem;
    ">
      <!-- Section Header -->
      <div style="text-align: center; margin-bottom: 4rem;">
        <h2 style="
          color: ${textColor};
          font-family: ${getFontFamily('titleFont')};
          font-size: ${getFontSize('titleSize', themeParams?.typography?.headingSize === '2xl' ? '2.5rem' : 
                     themeParams?.typography?.headingSize === 'xl' ? '2.25rem' : 
                     themeParams?.typography?.headingSize === 'lg' ? '2rem' : '2.25rem')};
          font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
          margin-bottom: 1rem;
        ">
          ${testimonialsContent?.title || "Được Tin Tưởng Bởi Các Nhà Nhập Khẩu Hàng Đầu"}
        </h2>
        <p style="
          color: ${textColor}CC;
          font-family: ${getFontFamily('subtitleFont')};
          font-size: ${getFontSize('subtitleSize', themeParams?.typography?.bodySize === 'sm' ? '1rem' : 
                     themeParams?.typography?.bodySize === 'lg' ? '1.25rem' : 
                     themeParams?.typography?.bodySize === 'xl' ? '1.5rem' : '1.125rem')};
          font-weight: ${getFontWeight('subtitleWeight', '400')};
          max-width: 800px;
          margin: 0 auto;
          opacity: 0.8;
        ">
          ${testimonialsContent?.subtitle || "Xem những gì khách hàng nói về trải nghiệm nhập khẩu cà phê Việt Nam cao cấp thông qua dịch vụ của chúng tôi."}
        </p>
      </div>

      <!-- Testimonials Grid -->
      <div style="
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        margin-bottom: 5rem;
      ">
        ${testimonials && Array.isArray(testimonials) ? testimonials.map((testimonial) => `
          <div style="
            background: white;
            padding: 2rem;
            border-radius: ${borderRadius};
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
            border: 1px solid ${themeParams?.colors?.border || '#E2E8F0'};
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 12px 35px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.1)'">
            
            <!-- Quote Icon -->
            <div style="
              margin-bottom: 1.5rem;
              color: ${primaryColor};
            ">
              <span style="font-size: 2rem;">"</span>
            </div>
            
            <!-- Rating Stars -->
            <div style="
              display: flex;
              gap: 0.25rem;
              margin-bottom: 1.5rem;
            ">
              ${Array.from({ length: testimonial.rating || 5 }, () => `
                <span style="
                  color: ${accentColor};
                  font-size: 1.25rem;
                ">⭐</span>
              `).join('')}
            </div>
            
            <!-- Testimonial Content -->
            <blockquote style="
              color: ${textColor};
              font-size: ${typographyStyles.fontSize};
              line-height: 1.7;
              margin-bottom: 2rem;
              font-style: italic;
              opacity: 0.9;
            ">
              "${testimonial.content || ''}"
            </blockquote>
            
            <!-- Author Info -->
            <div style="
              display: flex;
              align-items: center;
              gap: 1rem;
            ">
              <!-- Avatar -->
              <img
                src="${testimonial.image && testimonial.image.startsWith('/uploads/') 
                  ? testimonial.image 
                  : testimonial.image || 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face'}"
                alt="${testimonial.name || 'Unknown'}"
                style="
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  object-fit: cover;
                "
              />
              
              <!-- Author Details -->
              <div>
                <div style="
                  color: ${textColor};
                  font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '600')};
                  font-size: 0.875rem;
                ">${testimonial.name || 'Unknown'}</div>
                <div style="
                  color: ${textColor}CC;
                  font-size: 0.75rem;
                  opacity: 0.8;
                ">${testimonial.title || ''}</div>
                <div style="
                  color: ${primaryColor};
                  font-size: 0.75rem;
                  font-weight: ${getFontWeight('subtitleWeight', themeParams?.typography?.fontWeight || '500')};
                ">${testimonial.company || ''}</div>
              </div>
            </div>
          </div>
        `).join('') : ''}
      </div>

      <!-- Key Metrics -->
      <div style="
        background: linear-gradient(135deg, ${primaryColor}, ${accentColor});
        color: white;
        padding: 3rem 2rem;
        border-radius: ${borderRadius};
        box-shadow: 0 10px 30px rgba(139, 69, 19, 0.3);
        text-align: center;
      ">
        <h3 style="
          font-family: ${getFontFamily('titleFont')};
          font-size: ${getFontSize('titleSize', themeParams?.typography?.headingSize === '2xl' ? '2rem' : 
                     themeParams?.typography?.headingSize === 'xl' ? '1.75rem' : 
                     themeParams?.typography?.headingSize === 'lg' ? '1.5rem' : '1.75rem')};
          font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
          margin-bottom: 3rem;
        ">
          Những Con Số Nói Lên Tất Cả
        </h3>
        
        <div style="
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        ">
          ${stats && Array.isArray(stats) ? stats.map((stat) => `
            <div style="text-align: center;">
              <div style="
                font-size: 2.5rem;
                font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
                margin-bottom: 0.5rem;
              ">${stat.number || ''}</div>
              <div style="
                font-size: ${getFontSize('subtitleSize', themeParams?.typography?.bodySize === 'sm' ? '1rem' : 
                           themeParams?.typography?.bodySize === 'lg' ? '1.25rem' : 
                           themeParams?.typography?.bodySize === 'xl' ? '1.5rem' : '1.125rem')};
                font-weight: ${getFontWeight('subtitleWeight', themeParams?.typography?.fontWeight || '600')};
                margin-bottom: 0.25rem;
                opacity: 0.9;
              ">${stat.label || ''}</div>
              <div style="
                font-size: 0.875rem;
                opacity: 0.75;
              ">${stat.sublabel || ''}</div>
            </div>
          `).join('') : ''}
        </div>
      </div>
    </div>
    
    <style>
      @media (max-width: 1024px) {
        #testimonials > div > div:nth-child(2) {
          grid-template-columns: repeat(2, 1fr);
        }
        
        #testimonials > div > div:nth-child(3) > div {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      
      @media (max-width: 768px) {
        #testimonials {
          padding: 2rem 0;
        }
        
        #testimonials > div > div:first-child {
          margin-bottom: 2rem;
        }
        
        #testimonials h2 {
          font-size: 2rem !important;
        }
        
        #testimonials > div > div:nth-child(2) {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        #testimonials > div > div:nth-child(2) > div {
          padding: 1.5rem;
        }
        
        #testimonials > div > div:nth-child(3) {
          padding: 2rem 1rem;
        }
        
        #testimonials > div > div:nth-child(3) > div {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
      }
    </style>
  </section>`
}
