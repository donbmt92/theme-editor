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
  const defaultProblems = [
    {
      id: 'problem-1',
      icon: 'AlertTriangle',
      title: "Quy định nhập khẩu phức tạp",
      description: "Việc tuân thủ các yêu cầu FDA và thủ tục hải quan Mỹ có thể gây khó khăn cho các nhà nhập khẩu mới."
    },
    {
      id: 'problem-2',
      icon: 'Clock',
      title: "Chuỗi cung ứng không ổn định",
      description: "Tìm kiếm nhà cung cấp cà phê chất lượng cao với giao hàng đúng hạn là thách thức lớn."
    },
    {
      id: 'problem-3',
      icon: 'DollarSign',
      title: "Chi phí ẩn và biến động giá",
      description: "Các khoản phí bất ngờ và giá cả biến động có thể phá hủy biên lợi nhuận."
    },
    {
      id: 'problem-4',
      icon: 'Shield',
      title: "Lo ngại về chất lượng",
      description: "Đảm bảo tiêu chuẩn chất lượng và an toàn sản phẩm trong các lô hàng quốc tế."
    }
  ];

  const defaultSolutions = [
    {
      id: 'solution-1',
      icon: 'CheckCircle',
      title: "Tuân thủ quy định đầy đủ",
      description: "Chúng tôi xử lý tất cả tài liệu FDA, USDA và hải quan để đảm bảo thông quan suôn sẻ.",
      benefit: "100% Giao hàng tuân thủ"
    },
    {
      id: 'solution-2',
      icon: 'Truck',
      title: "Mạng lưới cung ứng đáng tin cậy",
      description: "Đối tác trực tiếp với các trang trại cà phê Việt Nam cao cấp đảm bảo chất lượng và nguồn cung ổn định.",
      benefit: "Đảm bảo giao hàng đúng hạn"
    },
    {
      id: 'solution-3',
      icon: 'DollarSign',
      title: "Định giá minh bạch",
      description: "Giá cố định không có phí ẩn. Bạn biết chính xác những gì sẽ phải trả trước.",
      benefit: "Chi phí dự đoán được"
    },
    {
      id: 'solution-4',
      icon: 'Shield',
      title: "Đảm bảo chất lượng",
      description: "Quy trình kiểm tra và chứng nhận nghiêm ngặt đảm bảo chỉ những hạt cà phê tốt nhất đến tay bạn.",
      benefit: "Sản phẩm chất lượng cao"
    }
  ];

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
          ${problemsContent?.about?.title || "Giải Quyết Thách Thức Xuất Nhập Khẩu Thực Tế"}
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
          ${problemsContent?.about?.description || "Chúng tôi hiểu rõ những khó khăn khi xuất khẩu cà phê từ Việt Nam. Đây là cách chúng tôi giải quyết chúng cho bạn."}
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
