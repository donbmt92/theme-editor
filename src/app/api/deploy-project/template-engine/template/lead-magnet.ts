import { LeadMagnetParams } from '../../types'
import { renderLucideIcon } from '../icons'

interface LeadMagnetContent {
  [key: string]: string | number | boolean | undefined | Array<string> | object
  title?: string
  subtitle?: string
  description?: string
  backgroundColor?: string
  textColor?: string
  primaryColor?: string
  colorMode?: 'theme' | 'custom'
  badgeText?: string
  guideTitle?: string
  guideSubtitle?: string
  formTitle?: string
  formDescription?: string
  buttonText?: string
  downloadUrl?: string
  privacyText?: string
  secureText?: string
  noSpamText?: string
  instantText?: string
  guideFeatures?: Array<{
    id?: string
    icon?: string
    title: string
    description: string
  }>
  trustIndicators?: Array<{
    id?: string
    number: string
    label: string
  }>
}

/**
 * Generate static Lead Magnet section HTML
 */
export function generateStaticLeadMagnetSection({ content, themeParams }: LeadMagnetParams): string {
  // Get project language from themeParams
  const projectLanguage = themeParams?.projectLanguage || 'vietnamese';

  // Get localized text based on project language
  const getLocalizedText = () => {
    if (projectLanguage === 'english') {
      return {
        title: "Unlock Import-Export Success",
        description: "Download comprehensive guide 'Vietnamese Coffee Export Handbook 2024' - everything you need to know about successful coffee export to the US market.",
        badgeText: "Free Resource",
        guideTitle: "Complete Export Guide",
        guideSubtitle: "2024 Edition - 45 pages",
        formTitle: "Download Free Guide",
        formDescription: "Enter your information below to get instant access to this valuable resource.",
        buttonText: "Download Free Guide Now",
        features: [
          {
            icon: "FileText",
            title: "Complete Document List",
            description: "All forms, certifications and documents needed for FDA compliance"
          },
          {
            icon: "TrendingUp",
            title: "Market Analysis & Price Trends",
            description: "Current US coffee market data and 2024 pricing information"
          },
          {
            icon: "Shield",
            title: "Quality Standards & Testing",
            description: "Detailed requirements for US import quality standards"
          },
          {
            icon: "CheckCircle",
            title: "Step-by-step Import Process",
            description: "Clear timeline from order to warehouse delivery"
          }
        ],
        trustIndicators: [
          { number: "5,000+", label: "Downloads" },
          { number: "92%", label: "Success Rate" },
          { number: "4.9/5", label: "User Rating" }
        ],
        privacyText: "By downloading, you agree to receive occasional emails about export opportunities. Unsubscribe anytime.",
        secureText: "100% Secure",
        noSpamText: "No spam",
        instantText: "Instant download",
        formPlaceholders: {
          name: "Full Name *",
          email: "Business Email *",
          company: "Company Name (Optional)"
        }
      };
    } else {
      return {
        title: "Mở khóa thành công xuất nhập khẩu",
        description: "Tải về hướng dẫn toàn diện \"Cẩm nang xuất khẩu cà phê Việt Nam 2024\" - tất cả những gì bạn cần biết để thành công vào thị trường Mỹ.",
        badgeText: "Tài nguyên miễn phí",
        guideTitle: "Hướng dẫn xuất khẩu đầy đủ",
        guideSubtitle: "Phiên bản 2024 - 45 trang",
        formTitle: "Tải về hướng dẫn miễn phí",
        formDescription: "Nhập thông tin bên dưới để nhận tài liệu ngay.",
        buttonText: "Tải về hướng dẫn miễn phí ngay",
        features: [
          {
            icon: "FileText",
            title: "Danh sách tài liệu đầy đủ",
            description: "Biểu mẫu, chứng nhận và tài liệu cần thiết"
          },
          {
            icon: "TrendingUp",
            title: "Phân tích thị trường",
            description: "Dữ liệu và xu hướng giá mới nhất"
          },
          {
            icon: "Shield",
            title: "Tiêu chuẩn chất lượng",
            description: "Yêu cầu chi tiết cho thị trường Mỹ"
          },
          {
            icon: "CheckCircle",
            title: "Quy trình từng bước",
            description: "Từ đặt hàng đến giao hàng tại kho"
          }
        ],
        trustIndicators: [
          { number: "5,000+", label: "Lượt tải" },
          { number: "92%", label: "Tỷ lệ thành công" },
          { number: "4.9/5", label: "Đánh giá người dùng" }
        ],
        privacyText: "Bằng việc tải về, bạn đồng ý nhận email thỉnh thoảng về cơ hội xuất khẩu. Hủy đăng ký bất cứ lúc nào.",
        secureText: "100% An toàn",
        noSpamText: "Không spam",
        instantText: "Tải về ngay",
        formPlaceholders: {
          name: "Họ và tên *",
          email: "Email doanh nghiệp *",
          company: "Tên công ty (Tùy chọn)"
        }
      };
    }
  };

  const localizedText = getLocalizedText();
  const getTypographyStyles = () => {
    return {
      fontFamily:
        themeParams?.typography?.fontFamily ||
        'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontSize: themeParams?.typography?.fontSize || '16px',
      lineHeight: themeParams?.typography?.lineHeight || '1.6',
      fontWeight: themeParams?.typography?.fontWeight || '400',
    }
  }

  const getBorderRadius = () => {
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

  const c = (content || {}) as LeadMagnetContent
  const isCustom = c.colorMode === 'custom'

  const typography = getTypographyStyles()
  const radius = getBorderRadius()

  const bgColor = isCustom
    ? (c.backgroundColor || '#FEF3C7')
    : (themeParams?.sections?.leadMagnet?.backgroundColor || themeParams?.colors?.background || '#F8F9FA')

  const textColor = isCustom
    ? (c.textColor || '#000000')
    : (themeParams?.sections?.leadMagnet?.textColor || themeParams?.colors?.text || '#2D3748')

  const primary = isCustom
    ? (c.primaryColor || '#3B82F6')
    : (themeParams?.colors?.primary || '#8B4513')

  const accent = themeParams?.colors?.accent || '#CD853F'

  const features = (c.guideFeatures && Array.isArray(c.guideFeatures) && c.guideFeatures.length > 0)
    ? c.guideFeatures
    : localizedText.features

  const indicators = (c.trustIndicators && Array.isArray(c.trustIndicators) && c.trustIndicators.length > 0)
    ? c.trustIndicators
    : localizedText.trustIndicators

  return `<section id="guide" style="
    padding: 5rem 0;
    background-color: ${bgColor};
    font-family: ${typography.fontFamily};
    font-size: ${typography.fontSize};
    line-height: ${typography.lineHeight};
    font-weight: ${typography.fontWeight};
  ">
    <div style="max-width: ${themeParams?.layout?.containerWidth || '1200px'}; margin: 0 auto; padding: 0 1rem;">
      <div style="max-width: 1100px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 3rem;">
          <div style="
            display: inline-flex; align-items: center; padding: 0.5rem 1rem; border-radius: ${themeParams?.components?.button?.rounded ? '9999px' : radius};
            background-color: ${primary}10; color: ${primary}; margin-bottom: 0.75rem; font-weight: 600;
          ">
            <span style="font-size: 1rem; margin-right: 0.5rem;">${renderLucideIcon('Download', 16, primary)}</span>
            ${c.badgeText || localizedText.badgeText}
          </div>
          <h2 style="
            color: ${textColor}; margin: 0 0 0.75rem 0;
            font-weight: 700; font-size: ${themeParams?.typography?.headingSize === '2xl' ? '2.5rem' : themeParams?.typography?.headingSize === 'xl' ? '2.25rem' : '2rem'};
          ">
            ${c.title || localizedText.title}
          </h2>
          <p style="
            color: ${textColor}CC; margin: 0 auto; max-width: 800px;
          ">
            ${c.description || localizedText.description}
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
          <!-- Preview Card -->
          <div style="
            background: #FFFFFF; border-radius: ${radius}; box-shadow: 0 8px 30px rgba(0,0,0,0.1); border: 1px solid ${themeParams?.colors?.border || '#E2E8F0'};
          ">
            <div style="padding: 2rem;">
              <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                <div style="
                  height: 4rem; width: 4rem; border-radius: ${radius}; display: flex; align-items: center; justify-content: center; margin-right: 1rem;
                  background: linear-gradient(135deg, ${primary}, ${accent}); color: #FFFFFF;
                ">
                  ${renderLucideIcon('BookOpen', 28, '#FFFFFF')}
                </div>
                <div>
                  <h3 style="color: ${textColor}; margin: 0 0 0.25rem 0; font-weight: 700;">${c.guideTitle || localizedText.guideTitle}</h3>
                  <p style="color: ${textColor}CC; margin: 0;">${c.guideSubtitle || localizedText.guideSubtitle}</p>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${features.map((f) => `
                  <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                    <div style="color: ${primary}; margin-top: 0.125rem;">
                      ${renderLucideIcon(f.icon || 'FileText', 20, primary)}
                    </div>
                    <div>
                      <div style="color: ${textColor}; font-weight: 600; margin-bottom: 0.25rem;">${f.title}</div>
                      <div style="color: ${textColor}CC; font-size: 0.95rem;">${f.description}</div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid ${themeParams?.colors?.border || '#E2E8F0'};">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
                  ${indicators.map((it) => `
                    <div>
                      <div style="color: ${primary}; font-weight: 700; font-size: 1.25rem;">${it.number}</div>
                      <div style="color: ${textColor}B3; font-size: 0.85rem;">${it.label}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- Form Card (static) -->
          <div style="
            background: #FFFFFF; border-radius: ${radius}; box-shadow: 0 8px 30px rgba(0,0,0,0.1); border: 1px solid ${themeParams?.colors?.border || '#E2E8F0'};
          ">
            <div style="padding: 2rem;">
              <div style="text-align: center; margin-bottom: 1rem;">
                <h3 style="color: ${textColor}; margin: 0 0 0.25rem 0; font-weight: 700;">${c.formTitle || localizedText.formTitle}</h3>
                <p style="color: ${textColor}CC; margin: 0;">${c.formDescription || localizedText.formDescription}</p>
              </div>

              <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem;">
                <input placeholder="${localizedText.formPlaceholders.name}" style="padding: 0.75rem 1rem; border: 1px solid ${themeParams?.colors?.border || '#E2E8F0'}; border-radius: ${radius}; font-family: ${typography.fontFamily}; font-size: ${typography.fontSize};" />
                <input placeholder="${localizedText.formPlaceholders.email}" style="padding: 0.75rem 1rem; border: 1px solid ${themeParams?.colors?.border || '#E2E8F0'}; border-radius: ${radius}; font-family: ${typography.fontFamily}; font-size: ${typography.fontSize};" />
                <input placeholder="${localizedText.formPlaceholders.company}" style="padding: 0.75rem 1rem; border: 1px solid ${themeParams?.colors?.border || '#E2E8F0'}; border-radius: ${radius}; font-family: ${typography.fontFamily}; font-size: ${typography.fontSize};" />
                <button style="
                  background: linear-gradient(135deg, ${primary}, ${accent}); color: #FFFFFF; border: none; padding: 0.875rem 1.25rem; border-radius: ${themeParams?.components?.button?.rounded ? '9999px' : radius};
                  font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'"><span style="margin-right: 0.5rem; vertical-align: middle;">${renderLucideIcon('Download', 18, '#FFFFFF')}</span>${c.buttonText || localizedText.buttonText}</button>
                <p style="color: ${textColor}99; font-size: 0.8rem; text-align: center; margin: 0.5rem 0 0 0;">
                  ${c.privacyText || localizedText.privacyText}
                </p>
              </div>

              <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid ${themeParams?.colors?.border || '#E2E8F0'};">
                <div style="display: flex; align-items: center; justify-content: center; gap: 1.25rem; color: ${textColor}B3; font-size: 0.9rem;">
                  <span style="display: inline-flex; align-items: center; gap: 0.25rem;">${renderLucideIcon('Shield', 16, textColor)} ${c.secureText || localizedText.secureText}</span>
                  <span style="display: inline-flex; align-items: center; gap: 0.25rem;">${renderLucideIcon('CheckCircle', 16, textColor)} ${c.noSpamText || localizedText.noSpamText}</span>
                  <span style="display: inline-flex; align-items: center; gap: 0.25rem;">${renderLucideIcon('Download', 16, textColor)} ${c.instantText || localizedText.instantText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      @media (max-width: 1024px) {
        #guide > div > div:last-child { padding: 0 0.5rem; }
      }
      @media (max-width: 768px) {
        #guide { padding: 2rem 0; }
        #guide > div > div > div:nth-child(2) { grid-template-columns: 1fr !important; }
      }
    </style>
  </section>`
}
