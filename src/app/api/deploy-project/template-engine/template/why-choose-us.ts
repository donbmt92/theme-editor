import { WhyChooseUsParams } from '../../types'
import { renderLucideIcon } from '../icons'

interface WhyChooseUsContent {
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
  strengths?: Array<{
    id?: string
    icon: string
    title: string
    description: string
    highlight?: string
  }>
  mission?: {
    title?: string
    description?: string
    values?: string[]
  }
  vision?: {
    title?: string
    description?: string
    goals?: string[]
  }
  cta?: {
    title?: string
    description?: string
    buttonText?: string
    secondaryButtonText?: string
  }
}

/**
 * Generate static Why Choose Us section HTML
 */
export function generateStaticWhyChooseUsSection({ content, themeParams }: WhyChooseUsParams): string {
  // Get project language from themeParams
  const projectLanguage = themeParams?.projectLanguage || 'vietnamese';

  // Get localized text based on project language
  const getLocalizedText = () => {
    if (projectLanguage === 'english') {
      return {
        title: "Why Choose VietCoffee Export?",
        subtitle: "We combine Vietnamese agricultural heritage with modern export expertise to deliver exceptional value to US partners.",
        strengths: [
          {
            icon: 'Users',
            title: 'Expert Team',
            description: '15+ years combined experience in Vietnamese coffee export and US import regulations.',
            highlight: 'Bilingual team fluent in Vietnamese and English'
          },
          {
            icon: 'Award',
            title: 'Quality Commitment',
            description: 'Strict quality control process ensures only premium Grade A coffee reaches customers.',
            highlight: 'ISO 22000 & HACCP certified facilities'
          },
          {
            icon: 'Globe',
            title: 'Global Network',
            description: 'Strategic partnerships with leading Vietnamese farms and US logistics providers.',
            highlight: 'Direct relationships with 5 provinces'
          },
          {
            icon: 'TrendingUp',
            title: 'Market Intelligence',
            description: 'Deep understanding of Vietnamese supply and US demand to optimize pricing and strategy.',
            highlight: 'Weekly market reports & trend analysis'
          },
          {
            icon: 'Shield',
            title: 'Risk Management',
            description: 'Comprehensive insurance and contingency plans to protect your investment.',
            highlight: '100% cargo insurance included'
          },
          {
            icon: 'Clock',
            title: 'Reliable Delivery',
            description: 'Track record of on-time delivery with full tracking and updates.',
            highlight: '99.8% on-time delivery rate'
          }
        ],
        mission: {
          title: 'Our Mission',
          description: 'Connecting Vietnamese coffee excellence with US market demand, creating lasting partnerships that benefit farmers, importers, and consumers.',
          values: [
            'Transparency in all transactions',
            'Sustainable farming practices',
            'Customer success focus',
            'Continuous improvement'
          ]
        },
        vision: {
          title: 'Our Vision',
          description: 'To become the leading Vietnamese coffee export company in the US market, known for exceptional quality, reliable service, and innovative solutions.',
          goals: [
            'Expand to 100+ US partners by 2025',
            'Support 1,000+ Vietnamese farmers',
            'Achieve carbon-neutral shipping',
            'Launch direct-to-consumer platform'
          ]
        },
        cta: {
          title: 'Ready to Start Your Coffee Import Journey?',
          description: 'Join 50+ successful US importers who trust us for their Vietnamese coffee needs. Start with a free consultation today.',
          buttonText: 'Schedule Free Consultation',
          secondaryButtonText: 'Download Company Profile'
        }
      };
    } else {
      return {
        title: "Tại Sao Chọn VietCoffee Export?",
        subtitle: "Chúng tôi kết hợp di sản nông nghiệp Việt Nam với chuyên môn xuất khẩu hiện đại để mang lại giá trị vượt trội cho đối tác Mỹ.",
        strengths: [
          {
            icon: 'Users',
            title: 'Đội Ngũ Chuyên Gia',
            description: '15+ năm kinh nghiệm kết hợp trong xuất khẩu cà phê Việt Nam và quy định nhập khẩu Mỹ.',
            highlight: 'Đội ngũ song ngữ thông thạo tiếng Việt và tiếng Anh'
          },
          {
            icon: 'Award',
            title: 'Cam Kết Chất Lượng',
            description: 'Quy trình kiểm soát chất lượng nghiêm ngặt đảm bảo chỉ cà phê loại A cao cấp đến tay khách hàng.',
            highlight: 'Cơ sở được chứng nhận ISO 22000 & HACCP'
          },
          {
            icon: 'Globe',
            title: 'Mạng Lưới Toàn Cầu',
            description: 'Đối tác chiến lược với các trang trại hàng đầu Việt Nam và nhà cung cấp logistics Mỹ.',
            highlight: 'Quan hệ trực tiếp với 5 tỉnh thành'
          },
          {
            icon: 'TrendingUp',
            title: 'Thông Tin Thị Trường',
            description: 'Hiểu sâu về cung cầu Việt Nam và Mỹ để tối ưu hóa giá cả và chiến lược.',
            highlight: 'Báo cáo thị trường hàng tuần & phân tích xu hướng'
          },
          {
            icon: 'Shield',
            title: 'Quản Lý Rủi Ro',
            description: 'Bảo hiểm toàn diện và kế hoạch dự phòng để bảo vệ đầu tư của bạn.',
            highlight: 'Bảo hiểm 100% hàng hóa bao gồm'
          },
          {
            icon: 'Clock',
            title: 'Giao Hàng Đáng Tin Cậy',
            description: 'Thành tích giao hàng đúng hạn với theo dõi và cập nhật đầy đủ.',
            highlight: 'Tỷ lệ giao hàng đúng hạn 99.8%'
          }
        ],
        mission: {
          title: 'Sứ Mệnh Của Chúng Tôi',
          description: 'Kết nối sự xuất sắc của cà phê Việt Nam với nhu cầu thị trường Mỹ, tạo ra những mối quan hệ đối tác lâu dài mang lại lợi ích cho nông dân, nhà nhập khẩu và người tiêu dùng.',
          values: [
            'Minh bạch trong mọi giao dịch',
            'Thực hành canh tác bền vững',
            'Tập trung vào thành công khách hàng',
            'Cải tiến liên tục'
          ]
        },
        vision: {
          title: 'Tầm Nhìn Của Chúng Tôi',
          description: 'Trở thành công ty xuất khẩu cà phê Việt Nam hàng đầu tại thị trường Mỹ, được biết đến với chất lượng xuất sắc, dịch vụ đáng tin cậy và giải pháp sáng tạo.',
          goals: [
            'Mở rộng đến 100+ đối tác Mỹ vào năm 2025',
            'Hỗ trợ 1,000+ nông dân Việt Nam',
            'Đạt được vận chuyển carbon-neutral',
            'Ra mắt nền tảng trực tiếp đến người tiêu dùng'
          ]
        },
        cta: {
          title: 'Sẵn Sàng Bắt Đầu Hành Trình Nhập Khẩu Cà Phê?',
          description: 'Tham gia cùng 50+ nhà nhập khẩu Mỹ thành công tin tưởng chúng tôi cho nhu cầu cà phê Việt Nam. Bắt đầu với tư vấn miễn phí ngay hôm nay.',
          buttonText: 'Đặt Lịch Tư Vấn Miễn Phí',
          secondaryButtonText: 'Tải Hồ Sơ Công Ty'
        }
      };
    }
  };

  const localizedText = getLocalizedText();
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
    const whyChooseUsContent = content as WhyChooseUsContent;
    const fontName = whyChooseUsContent?.[fontType] || 'inter';
    
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
    const whyChooseUsContent = content as WhyChooseUsContent;
    const size = whyChooseUsContent?.[sizeType];
    
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
    const whyChooseUsContent = content as WhyChooseUsContent;
    const weight = whyChooseUsContent?.[weightType];
    
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
  const whyChooseUsContent = content as WhyChooseUsContent;
  const isCustom = whyChooseUsContent?.colorMode === 'custom'

  // Get colors based on colorMode
  const bgColor = isCustom
    ? (whyChooseUsContent?.backgroundColor || '#FFFFFF')
    : (themeParams?.sections?.whyChooseUs?.backgroundColor || themeParams?.colors?.background || '#FFFFFF')

  const textColor = isCustom
    ? (whyChooseUsContent?.textColor || '#2D3748')
    : (themeParams?.sections?.whyChooseUs?.textColor || themeParams?.colors?.text || '#2D3748')

  const primaryColor = isCustom
    ? (whyChooseUsContent?.primaryColor || '#8B4513')
    : (themeParams?.colors?.primary || '#8B4513')

  const accentColor = themeParams?.colors?.accent || '#CD853F'

  // Use content or localized defaults
  const strengths = whyChooseUsContent?.strengths || localizedText.strengths
  const mission = whyChooseUsContent?.mission || localizedText.mission
  const vision = whyChooseUsContent?.vision || localizedText.vision
  const cta = whyChooseUsContent?.cta || localizedText.cta

  return `<section id="why-choose-us" style="
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
          ${whyChooseUsContent?.title || localizedText.title}
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
          ${whyChooseUsContent?.subtitle || localizedText.subtitle}
        </p>
      </div>

      <!-- Strengths Grid -->
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 5rem;
      ">
        ${strengths && Array.isArray(strengths) ? strengths.map((strength) => `
          <div style="
            background: white;
            padding: 2rem;
            border-radius: ${borderRadius};
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
            border: 1px solid ${themeParams?.colors?.border || '#E2E8F0'};
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          " onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 15px 40px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.1)'">
            
            <!-- Strength Icon -->
            <div style="
              margin-bottom: 1.5rem;
              text-align: center;
            ">
              <div style="
                width: 3.5rem;
                height: 3.5rem;
                border-radius: ${borderRadius};
                background: linear-gradient(135deg, ${primaryColor}, ${accentColor});
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1rem auto;
              ">
                ${renderLucideIcon(strength.icon, 28, '#FFFFFF') || `<span style="font-size: 1.75rem; color: white;">${strength.icon || '✓'}</span>`}
              </div>
            </div>
            
            <!-- Strength Title -->
            <h3 style="
              color: ${textColor};
              font-family: ${getFontFamily('titleFont')};
              font-size: ${getFontSize('titleSize', themeParams?.typography?.headingSize === '2xl' ? '1.5rem' : 
                         themeParams?.typography?.headingSize === 'xl' ? '1.375rem' : 
                         themeParams?.typography?.headingSize === 'lg' ? '1.25rem' : '1.375rem')};
              font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '600')};
              margin-bottom: 1rem;
              text-align: center;
            ">${strength.title}</h3>
            
            <!-- Strength Description -->
            <p style="
              color: ${textColor}CC;
              font-family: ${getFontFamily('subtitleFont')};
              font-size: ${typographyStyles.fontSize};
              line-height: 1.6;
              margin-bottom: 1.5rem;
              text-align: center;
              opacity: 0.8;
            ">${strength.description}</p>
            
            <!-- Highlight Badge -->
            <div style="
              display: inline-flex;
              align-items: center;
              padding: 0.5rem 0.75rem;
              border-radius: ${borderRadius};
              background-color: ${primaryColor}10;
              color: ${primaryColor};
              font-size: 0.875rem;
              font-weight: ${getFontWeight('subtitleWeight', themeParams?.typography?.fontWeight || '500')};
              display: block;
              text-align: center;
              width: fit-content;
              margin: 0 auto;
            ">
              <span style="margin-right: 0.25rem;">🏆</span>
              ${strength.highlight || 'Chất lượng cao'}
            </div>
          </div>
        `).join('') : ''}
      </div>

      <!-- Mission & Vision -->
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 3rem;
        margin-bottom: 4rem;
      ">
        <!-- Mission -->
        <div style="
          background: white;
          padding: 2rem;
          border-radius: ${borderRadius};
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          border: 1px solid ${primaryColor}20;
        ">
          <div style="display: flex; align-items: center; margin-bottom: 1.5rem;">
            <div style="
              width: 3rem;
              height: 3rem;
              border-radius: ${borderRadius};
              background-color: ${primaryColor};
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 1rem;
            ">
              ${renderLucideIcon('Shield', 24, '#FFFFFF') || '<span style="font-size: 1.5rem; color: white;">🛡️</span>'}
            </div>
            <h3 style="
              color: ${textColor};
              font-family: ${getFontFamily('titleFont')};
              font-size: ${getFontSize('titleSize', themeParams?.typography?.headingSize === '2xl' ? '1.5rem' : 
                         themeParams?.typography?.headingSize === 'xl' ? '1.375rem' : 
                         themeParams?.typography?.headingSize === 'lg' ? '1.25rem' : '1.375rem')};
              font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
            ">${mission.title}</h3>
          </div>
          <p style="
            color: ${textColor}CC;
            font-family: ${getFontFamily('subtitleFont')};
            font-size: ${typographyStyles.fontSize};
            line-height: 1.6;
            margin-bottom: 1.5rem;
            opacity: 0.8;
          ">${mission.description}</p>
          <div style="margin-top: 1.5rem;">
            <h4 style="
              font-weight: ${getFontWeight('subtitleWeight', themeParams?.typography?.fontWeight || '600')};
              color: ${textColor};
              margin-bottom: 1rem;
            ">${projectLanguage === 'english' ? 'Core Values:' : 'Giá Trị Cốt Lõi:'}</h4>
            <ul style="
              list-style: none;
              padding: 0;
              margin: 0;
              space-y: 0.5rem;
            ">
              ${(mission.values || []).map((value: string) => `
                <li style="
                  display: flex;
                  align-items: center;
                  color: ${textColor};
                  margin-bottom: 0.5rem;
                ">
                  <div style="
                    width: 0.5rem;
                    height: 0.5rem;
                    border-radius: 50%;
                    background-color: ${primaryColor};
                    margin-right: 0.75rem;
                  "></div>
                  ${value}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <!-- Vision -->
        <div style="
          background: white;
          padding: 2rem;
          border-radius: ${borderRadius};
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          border: 1px solid ${accentColor}20;
        ">
          <div style="display: flex; align-items: center; margin-bottom: 1.5rem;">
            <div style="
              width: 3rem;
              height: 3rem;
              border-radius: ${borderRadius};
              background-color: ${accentColor};
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 1rem;
            ">
              ${renderLucideIcon('TrendingUp', 24, '#FFFFFF') || '<span style="font-size: 1.5rem; color: white;">📈</span>'}
            </div>
            <h3 style="
              color: ${textColor};
              font-family: ${getFontFamily('titleFont')};
              font-size: ${getFontSize('titleSize', themeParams?.typography?.headingSize === '2xl' ? '1.5rem' : 
                         themeParams?.typography?.headingSize === 'xl' ? '1.375rem' : 
                         themeParams?.typography?.headingSize === 'lg' ? '1.25rem' : '1.375rem')};
              font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
            ">${vision.title}</h3>
          </div>
          <p style="
            color: ${textColor}CC;
            font-family: ${getFontFamily('subtitleFont')};
            font-size: ${typographyStyles.fontSize};
            line-height: 1.6;
            margin-bottom: 1.5rem;
            opacity: 0.8;
          ">${vision.description}</p>
          <div style="margin-top: 1.5rem;">
            <h4 style="
              font-weight: ${getFontWeight('subtitleWeight', themeParams?.typography?.fontWeight || '600')};
              color: ${textColor};
              margin-bottom: 1rem;
            ">${projectLanguage === 'english' ? '2025 Goals:' : 'Mục Tiêu 2025:'}</h4>
            <ul style="
              list-style: none;
              padding: 0;
              margin: 0;
              space-y: 0.5rem;
            ">
              ${(vision.goals || []).map((goal: string) => `
                <li style="
                  display: flex;
                  align-items: center;
                  color: ${textColor};
                  margin-bottom: 0.5rem;
                ">
                  <div style="
                    width: 0.5rem;
                    height: 0.5rem;
                    border-radius: 50%;
                    background-color: ${accentColor};
                    margin-right: 0.75rem;
                  "></div>
                  ${goal}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div style="
        background: linear-gradient(135deg, ${primaryColor}, ${accentColor});
        color: white;
        padding: 3rem 2rem;
        border-radius: ${borderRadius};
        text-align: center;
        box-shadow: 0 10px 30px rgba(139, 69, 19, 0.3);
      ">
        <h3 style="
          font-family: ${getFontFamily('titleFont')};
          font-size: ${getFontSize('titleSize', themeParams?.typography?.headingSize === '2xl' ? '2rem' : 
                     themeParams?.typography?.headingSize === 'xl' ? '1.75rem' : 
                     themeParams?.typography?.headingSize === 'lg' ? '1.5rem' : '1.75rem')};
          font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
          margin-bottom: 1rem;
        ">${cta.title}</h3>
        <p style="
          font-size: ${getFontSize('subtitleSize', themeParams?.typography?.bodySize === 'sm' ? '1rem' : 
                     themeParams?.typography?.bodySize === 'lg' ? '1.25rem' : 
                     themeParams?.typography?.bodySize === 'xl' ? '1.5rem' : '1.125rem')};
          margin-bottom: 2rem;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        ">${cta.description}</p>
        <div style="
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: center;
          align-items: center;
        ">
          <button style="
            background: white;
            color: ${primaryColor};
            border: none;
            padding: 1rem 2rem;
            border-radius: ${themeParams?.components?.button?.rounded ? '9999px' : borderRadius};
            font-family: ${typographyStyles.fontFamily};
            font-size: ${typographyStyles.fontSize};
            font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '600')};
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
            min-width: 200px;
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(255, 255, 255, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(255, 255, 255, 0.3)'">
            ${cta.buttonText || 'Liên hệ ngay'}
            <span style="margin-left: 0.5rem;">→</span>
          </button>
          <button style="
            background: transparent;
            color: white;
            border: 1px solid white;
            padding: 1rem 2rem;
            border-radius: ${themeParams?.components?.button?.rounded ? '9999px' : borderRadius};
            font-family: ${typographyStyles.fontFamily};
            font-size: ${typographyStyles.fontSize};
            font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '600')};
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 200px;
          " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'" onmouseout="this.style.backgroundColor='transparent'">
            ${cta.secondaryButtonText || 'Tải Hồ Sơ Công Ty'}
          </button>
        </div>
      </div>
    </div>
    
    <style>
      @media (max-width: 1024px) {
        #why-choose-us > div > div:nth-child(2) {
          grid-template-columns: repeat(2, 1fr);
        }
        
        #why-choose-us > div > div:nth-child(3) {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
      }
      
      @media (max-width: 768px) {
        #why-choose-us {
          padding: 2rem 0;
        }
        
        #why-choose-us > div > div:first-child {
          margin-bottom: 2rem;
        }
        
        #why-choose-us h2 {
          font-size: 2rem !important;
        }
        
        #why-choose-us > div > div:nth-child(2) {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        #why-choose-us > div > div:nth-child(2) > div {
          padding: 1.5rem;
        }
        
        #why-choose-us > div > div:nth-child(3) {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        #why-choose-us > div > div:nth-child(3) > div {
          padding: 1.5rem;
        }
        
        #why-choose-us > div > div:nth-child(4) {
          padding: 2rem 1rem;
        }
        
        #why-choose-us > div > div:nth-child(4) > div {
          flex-direction: column;
          gap: 1rem;
        }
        
        #why-choose-us > div > div:nth-child(4) button {
          min-width: 100%;
        }
      }
      
      @media (max-width: 480px) {
        #why-choose-us > div {
          padding: 0 0.5rem;
        }
        
        #why-choose-us > div > div:nth-child(2) > div,
        #why-choose-us > div > div:nth-child(3) > div {
          padding: 1rem;
        }
        
        #why-choose-us > div > div:nth-child(4) {
          padding: 1.5rem 1rem;
        }
      }
    </style>
  </section>`
}
