import { ProblemsParams } from '../../types'
import { renderLucideIcon } from '../icons'

interface ProblemsContentExtended {
  [key: string]: string | number | boolean | undefined | Array<any> | object
  about?: {
    title?: string
    description?: string
    backgroundColor?: string
    textColor?: string
  }
  problems?: {
    title?: string
    description?: string
    backgroundColor?: string
    textColor?: string
    primaryColor?: string
    colorMode?: 'theme' | 'custom'
    items?: Array<{
      id?: string
      title: string
      description: string
      icon?: string
    }>
    titleSize?: string
    titleWeight?: string
    titleFont?: string
    descriptionSize?: string
    descriptionWeight?: string
    descriptionFont?: string
    itemTitleWeight?: string
    itemTitleFont?: string
    itemDescriptionSize?: string
    itemDescriptionFont?: string
  }
  solutions?: {
    title?: string
    description?: string
    backgroundColor?: string
    textColor?: string
    primaryColor?: string
    colorMode?: 'theme' | 'custom'
    items?: Array<{
      id?: string
      title: string
      description: string
      benefit: string
      icon?: string
    }>
    titleSize?: string
    titleWeight?: string
    titleFont?: string
    descriptionSize?: string
    descriptionWeight?: string
    descriptionFont?: string
    itemTitleWeight?: string
    itemTitleFont?: string
    itemDescriptionSize?: string
    itemDescriptionFont?: string
    itemBenefitWeight?: string
    itemBenefitFont?: string
  }
  cta?: {
    title?: string
    description?: string
    buttonText?: string
    backgroundColor?: string
    textColor?: string
  }
}

/**
 * Generate static problems section HTML
 */
export function generateStaticProblemsSection({ content, themeParams }: ProblemsParams): string {
  // Get project language from themeParams
  const projectLanguage = themeParams?.projectLanguage || 'vietnamese';
  
  // Get localized text based on project language
  const getLocalizedText = () => {
    if (projectLanguage === 'english') {
      return {
        about: {
          title: "About Us",
          description: "With over 20 years of experience in the coffee industry, we are proud to be a trusted partner of international importers. We are committed to bringing the highest quality coffee beans from the Central Highlands region."
        },
        problems: {
          title: "Current Challenges",
          description: "Difficulties that Vietnamese businesses face when exporting coffee",
          items: [
            {
              id: "1",
              title: "Difficulty accessing US market",
              description: "Lack of direct connections with importers and distributors, complex trade barriers",
              icon: "AlertCircle"
            },
            {
              id: "2", 
              title: "Complex procedures",
              description: "Complex export procedures, quality certifications and plant quarantine",
              icon: "AlertCircle"
            },
            {
              id: "3",
              title: "Non-competitive pricing",
              description: "Many intermediaries increase costs, reducing farmers' profits",
              icon: "AlertCircle"
            }
          ]
        },
        solutions: {
          title: "Our Solutions",
          description: "Comprehensive solutions to overcome challenges and develop sustainably",
          items: [
            {
              id: "1",
              title: "Direct connection",
              description: "Wide network of import partners across the US, eliminating intermediaries, optimizing supply chain",
              benefit: "Increase profits 30-40%",
              icon: "Globe"
            },
            {
              id: "2",
              title: "Comprehensive support",
              description: "From quality certification, plant quarantine to logistics and customs procedures",
              benefit: "Save 80% time",
              icon: "Shield"
            },
            {
              id: "3",
              title: "Optimized process",
              description: "Modern management system, real-time order tracking, ensuring transparency",
              benefit: "100% transparency",
              icon: "Zap"
            }
          ]
        },
        cta: {
          title: "Ready to start your export journey?",
          description: "Free consultation on coffee export process to the US, product potential assessment and market development planning.",
          buttonText: "Register for free consultation"
        }
      };
    } else {
      return {
        about: {
          title: "Về Chúng Tôi",
          description: "Với hơn 20 năm kinh nghiệm trong ngành cà phê, chúng tôi tự hào là đối tác tin cậy của các nhà nhập khẩu quốc tế. Chúng tôi cam kết mang đến những hạt cà phê chất lượng nhất từ vùng đất Tây Nguyên."
        },
        problems: {
          title: "Thách Thức Hiện Tại",
          description: "Những khó khăn mà doanh nghiệp Việt Nam gặp phải khi xuất khẩu cà phê",
          items: [
            {
              id: "1",
              title: "Khó tiếp cận thị trường Mỹ",
              description: "Thiếu kết nối trực tiếp với nhà nhập khẩu và phân phối, rào cản thương mại phức tạp",
              icon: "AlertCircle"
            },
            {
              id: "2",
              title: "Thủ tục phức tạp",
              description: "Quy trình xuất khẩu, chứng nhận chất lượng và kiểm dịch thực vật phức tạp",
              icon: "AlertCircle"
            },
            {
              id: "3",
              title: "Giá cả không cạnh tranh",
              description: "Nhiều khâu trung gian làm tăng chi phí, giảm lợi nhuận của nông dân",
              icon: "AlertCircle"
            }
          ]
        },
        solutions: {
          title: "Giải Pháp Của Chúng Tôi",
          description: "Những giải pháp toàn diện để vượt qua thách thức và phát triển bền vững",
          items: [
            {
              id: "1",
              title: "Kết nối trực tiếp",
              description: "Mạng lưới đối tác nhập khẩu rộng khắp tại Mỹ, loại bỏ trung gian, tối ưu hóa chuỗi cung ứng",
              benefit: "Tăng lợi nhuận 30-40%",
              icon: "Globe"
            },
            {
              id: "2",
              title: "Hỗ trợ toàn diện",
              description: "Từ chứng nhận chất lượng, kiểm dịch thực vật đến logistics và thủ tục hải quan",
              benefit: "Tiết kiệm 80% thời gian",
              icon: "Shield"
            },
            {
              id: "3",
              title: "Quy trình tối ưu",
              description: "Hệ thống quản lý hiện đại, theo dõi đơn hàng realtime, đảm bảo minh bạch",
              benefit: "Minh bạch 100%",
              icon: "Zap"
            }
          ]
        },
        cta: {
          title: "Sẵn sàng bắt đầu hành trình xuất khẩu?",
          description: "Tư vấn miễn phí về quy trình xuất khẩu cà phê sang Mỹ, đánh giá tiềm năng sản phẩm và lập kế hoạch phát triển thị trường.",
          buttonText: "Đăng ký tư vấn miễn phí"
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
    const problemsContent = content as ProblemsContentExtended;
    const fontName = (problemsContent?.problems as any)?.[fontType] || (problemsContent?.solutions as any)?.[fontType] || 'inter';
    
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
    const problemsContent = content as ProblemsContentExtended;
    const size = (problemsContent?.problems as any)?.[sizeType] || (problemsContent?.solutions as any)?.[sizeType];
    
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
    const problemsContent = content as ProblemsContentExtended;
    const weight = (problemsContent?.problems as any)?.[weightType] || (problemsContent?.solutions as any)?.[weightType];
    
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
  const problemsContent = content as ProblemsContentExtended;
  
  // Default problems if none provided
  const defaultProblems = localizedText.problems.items;

  const defaultSolutions = localizedText.solutions.items;

  const problems = problemsContent?.problems?.items || defaultProblems;
  const solutions = problemsContent?.solutions?.items || defaultSolutions;

  return `<section id="problems" style="
    background-color: ${problemsContent?.problems?.backgroundColor || themeParams?.sections?.problems?.backgroundColor || '#F8F9FA'};
    color: ${problemsContent?.problems?.textColor || themeParams?.sections?.problems?.textColor || themeParams?.colors?.text || '#2D3748'};
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
          color: ${problemsContent?.about?.textColor || problemsContent?.problems?.textColor || themeParams?.sections?.problems?.textColor || themeParams?.colors?.text || '#2D3748'};
          font-family: ${getFontFamily('titleFont')};
          font-size: ${getFontSize('titleSize', themeParams?.typography?.headingSize === '2xl' ? '2.5rem' : 
                     themeParams?.typography?.headingSize === 'xl' ? '2.25rem' : 
                     themeParams?.typography?.headingSize === 'lg' ? '2rem' : '2.25rem')};
          font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
          margin-bottom: 1rem;
        ">
          ${problemsContent?.about?.title || localizedText.about.title}
        </h2>
        <p style="
          color: ${problemsContent?.about?.textColor || problemsContent?.problems?.textColor || themeParams?.sections?.problems?.textColor || themeParams?.colors?.muted || '#718096'};
          font-family: ${getFontFamily('descriptionFont')};
          font-size: ${getFontSize('descriptionSize', themeParams?.typography?.bodySize === 'sm' ? '1rem' : 
                     themeParams?.typography?.bodySize === 'lg' ? '1.25rem' : 
                     themeParams?.typography?.bodySize === 'xl' ? '1.5rem' : '1.125rem')};
          font-weight: ${getFontWeight('descriptionWeight', '400')};
          max-width: 768px;
          margin: 0 auto;
          line-height: 1.6;
        ">
          ${problemsContent?.about?.description || localizedText.about.description}
        </p>
      </div>

      <!-- Two Column Layout -->
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: start;
        margin-bottom: 5rem;
      ">
        <!-- Problems Column -->
        <div>
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 2rem;
          ">
            <div style="
              width: 2rem;
              height: 2rem;
              margin-right: 0.75rem;
              color: ${themeParams?.colors?.destructive || '#E53E3E'};
            ">
              ${renderLucideIcon('AlertTriangle', 32, themeParams?.colors?.destructive || '#E53E3E')}
            </div>
            <h3 style="
              color: ${problemsContent?.problems?.textColor || themeParams?.colors?.text || '#2D3748'};
              font-family: ${getFontFamily('titleFont')};
              font-size: ${getFontSize('titleSize', '1.5rem')};
              font-weight: ${getFontWeight('titleWeight', '700')};
              margin: 0;
            ">
              ${problemsContent?.problems?.title || "Thách Thức Thường Gặp"}
            </h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${problems.map((problem: any, index: number) => `
              <div style="
                background: white;
                padding: 1.5rem;
                border-radius: ${borderRadius};
                border: 1px solid ${themeParams?.colors?.destructive || '#E53E3E'}20;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              " onmouseover="this.style.borderColor='${themeParams?.colors?.destructive || '#E53E3E'}40'" onmouseout="this.style.borderColor='${themeParams?.colors?.destructive || '#E53E3E'}20'">
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                  <div style="
                    width: 1.5rem;
                    height: 1.5rem;
                    margin-top: 0.25rem;
                    flex-shrink: 0;
                    color: ${themeParams?.colors?.destructive || '#E53E3E'};
                  ">
                    ${renderLucideIcon(problem.icon, 24, themeParams?.colors?.destructive || '#E53E3E')}
                  </div>
                  <div style="flex: 1;">
                    <h4 style="
                      color: ${problemsContent?.problems?.textColor || themeParams?.colors?.text || '#2D3748'};
                      font-family: ${getFontFamily('itemTitleFont')};
                      font-weight: ${getFontWeight('itemTitleWeight', '600')};
                      margin-bottom: 0.5rem;
                      margin-top: 0;
                    ">${problem.title}</h4>
                    <p style="
                      color: ${problemsContent?.problems?.textColor || themeParams?.colors?.muted || '#718096'};
                      font-family: ${getFontFamily('itemDescriptionFont')};
                      font-size: ${getFontSize('itemDescriptionSize', typographyStyles.fontSize)};
                      line-height: 1.6;
                      margin: 0;
                    ">${problem.description}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Solutions Column -->
        <div>
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 2rem;
          ">
            <div style="
              width: 2rem;
              height: 2rem;
              margin-right: 0.75rem;
              color: ${themeParams?.colors?.accent || '#28A745'};
            ">
              ${renderLucideIcon('CheckCircle', 32, themeParams?.colors?.accent || '#28A745')}
            </div>
            <h3 style="
              color: ${problemsContent?.solutions?.textColor || themeParams?.colors?.text || '#2D3748'};
              font-family: ${getFontFamily('titleFont')};
              font-size: ${getFontSize('titleSize', '1.5rem')};
              font-weight: ${getFontWeight('titleWeight', '700')};
              margin: 0;
            ">
              ${problemsContent?.solutions?.title || "Giải Pháp Của Chúng Tôi"}
            </h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${solutions.map((solution: any, index: number) => `
              <div style="
                background: white;
                padding: 1.5rem;
                border-radius: ${borderRadius};
                border: 1px solid ${themeParams?.colors?.accent || '#28A745'}20;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
              " onmouseover="this.style.borderColor='${themeParams?.colors?.accent || '#28A745'}40'" onmouseout="this.style.borderColor='${themeParams?.colors?.accent || '#28A745'}20'">
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                  <div style="
                    width: 1.5rem;
                    height: 1.5rem;
                    margin-top: 0.25rem;
                    flex-shrink: 0;
                    color: ${themeParams?.colors?.accent || '#28A745'};
                  ">
                    ${renderLucideIcon(solution.icon, 24, '#28A745')}
                  </div>
                  <div style="flex: 1;">
                    <h4 style="
                      color: ${problemsContent?.solutions?.textColor || themeParams?.colors?.text || '#2D3748'};
                      font-family: ${getFontFamily('itemTitleFont')};
                      font-weight: ${getFontWeight('itemTitleWeight', '600')};
                      margin-bottom: 0.5rem;
                      margin-top: 0;
                    ">${solution.title}</h4>
                    <p style="
                      color: ${problemsContent?.solutions?.textColor || themeParams?.colors?.muted || '#718096'};
                      font-family: ${getFontFamily('itemDescriptionFont')};
                      font-size: ${getFontSize('itemDescriptionSize', typographyStyles.fontSize)};
                      line-height: 1.6;
                      margin-bottom: 0.75rem;
                    ">${solution.description}</p>
                    <div style="
                      display: inline-flex;
                      align-items: center;
                      padding: 0.25rem 0.75rem;
                      background-color: ${themeParams?.colors?.accent || '#28A745'}10;
                      color: ${themeParams?.colors?.primary || '#28A745'};
                      border-radius: ${borderRadius};
                      font-family: ${getFontFamily('itemBenefitFont')};
                      font-weight: ${getFontWeight('itemBenefitWeight', '500')};
                      font-size: 0.875rem;
                    ">
                      <span style="margin-right: 0.25rem;">${renderLucideIcon('CheckCircle', 16, themeParams?.colors?.primary || '#28A745')}</span>
                      ${solution.benefit}
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- USP Section -->
      <div style="margin-top: 5rem; text-align: center;">
        <div style="
          max-width: 1024px;
          margin: 0 auto;
          background: linear-gradient(135deg, ${themeParams?.colors?.primary || '#8B4513'}, ${themeParams?.colors?.accent || '#CD853F'});
          color: ${problemsContent?.cta?.textColor || '#FFFFFF'};
          padding: 3rem;
          border-radius: ${borderRadius};
          border: none;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        ">
          <h3 style="
            color: ${problemsContent?.cta?.textColor || '#FFFFFF'};
            font-family: ${getFontFamily('titleFont')};
            font-size: ${getFontSize('titleSize', themeParams?.typography?.headingSize === '2xl' ? '2rem' : 
                       themeParams?.typography?.headingSize === 'xl' ? '1.75rem' : 
                       themeParams?.typography?.headingSize === 'lg' ? '1.5rem' : '1.75rem')};
            font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
            margin-bottom: 1rem;
          ">
            ${problemsContent?.cta?.title || "Tại sao chọn Cà Phê Việt Export?"}
          </h3>
          <p style="
            color: ${problemsContent?.cta?.textColor || '#FFFFFF'};
            font-family: ${getFontFamily('descriptionFont')};
            font-size: ${getFontSize('descriptionSize', typographyStyles.fontSize)};
            margin-bottom: 2rem;
            opacity: 0.9;
            line-height: 1.6;
          ">
            ${problemsContent?.cta?.description || "Chúng tôi là công ty xuất khẩu cà phê duy nhất kết hợp chuyên môn nông nghiệp Việt Nam với kiến thức sâu rộng về thị trường Mỹ, cung cấp giải pháp toàn diện loại bỏ mọi khó khăn nhập khẩu."}
          </p>
          <div style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            margin-bottom: 2rem;
          ">
            <div style="text-align: center;">
              <div style="
                color: ${problemsContent?.cta?.textColor || '#FFFFFF'};
                font-size: 2.5rem;
                font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
                margin-bottom: 0.5rem;
              ">15+</div>
              <div style="
                color: ${problemsContent?.cta?.textColor || '#FFFFFF'};
                font-size: ${typographyStyles.fontSize};
                opacity: 0.9;
              ">Năm kinh nghiệm thị trường Mỹ</div>
            </div>
            <div style="text-align: center;">
              <div style="
                color: ${problemsContent?.cta?.textColor || '#FFFFFF'};
                font-size: 2.5rem;
                font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
                margin-bottom: 0.5rem;
              ">500+</div>
              <div style="
                color: ${problemsContent?.cta?.textColor || '#FFFFFF'};
                font-size: ${typographyStyles.fontSize};
                opacity: 0.9;
              ">Lô hàng thành công</div>
            </div>
            <div style="text-align: center;">
              <div style="
                color: ${problemsContent?.cta?.textColor || '#FFFFFF'};
                font-size: 2.5rem;
                font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
                margin-bottom: 0.5rem;
              ">99.8%</div>
              <div style="
                color: ${problemsContent?.cta?.textColor || '#FFFFFF'};
                font-size: ${typographyStyles.fontSize};
                opacity: 0.9;
              ">Giao hàng đúng hạn</div>
            </div>
          </div>
          <button style="
            background: white;
            color: ${themeParams?.colors?.primary || '#8B4513'};
            border: none;
            padding: 1rem 2rem;
            border-radius: ${themeParams?.components?.button?.rounded ? '9999px' : borderRadius};
            font-family: ${typographyStyles.fontFamily};
            font-size: ${typographyStyles.fontSize};
            font-weight: ${themeParams?.typography?.fontWeight || '600'};
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.2)'">
            ${problemsContent?.cta?.buttonText || "Tìm hiểu thêm về chúng tôi"}
            <span style="margin-left: 0.5rem;">→</span>
          </button>
        </div>
      </div>
    </div>
    
    <style>
      @media (max-width: 768px) {
        #problems {
          padding: 2rem 0;
        }
        
        #problems > div > div:first-child {
          margin-bottom: 2rem;
        }
        
        #problems h2 {
          font-size: 2rem !important;
        }
        
        #problems > div > div:nth-child(2) {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        #problems > div > div:nth-child(2) > div {
          padding: 1rem;
        }
        
        #problems > div > div:nth-child(3) > div > div:nth-child(4) {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
      }
    </style>
  </section>`
}
