import { ProductsParams } from '../../types'
import { DEFAULT_CONTENT, DEFAULT_SERVICES } from '../../constants'
import { renderLucideIcon } from '../icons'

interface ProductsContent {
  [key: string]: any
  title?: string
  description?: string
  backgroundColor?: string
  textColor?: string
  primaryColor?: string
  colorMode?: 'theme' | 'custom'
  titleSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
  titleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  titleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather'
  descriptionSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  descriptionWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  descriptionFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather'
  items?: Array<{
    id?: string
    name: string
    description: string
    price?: string
    category?: string
    image?: string
    features?: string[]
  }>
  services?: Array<{
    id?: string
    name: string
    description: string
    icon?: string
    cta?: string
    features?: string[]
  }>
}

/**
 * Generate static products/services section HTML
 */
export function generateStaticProductsSection({ content, colors, themeParams }: ProductsParams): string {
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
    const productsContent = content as ProductsContent;
    const fontName = productsContent?.[fontType] || 'inter';
    
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
    const productsContent = content as ProductsContent;
    const size = productsContent?.[sizeType];
    
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
    const productsContent = content as ProductsContent;
    const weight = productsContent?.[weightType];
    
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
  const productsContent = content as ProductsContent;
  const isCustom = productsContent?.colorMode === 'custom'

  // Get colors based on colorMode
  const bgColor = isCustom
    ? (productsContent?.backgroundColor || '#F8F9FA')
    : (themeParams?.sections?.products?.backgroundColor || themeParams?.colors?.background || '#F8F9FA')

  const textColor = isCustom
    ? (productsContent?.textColor || '#2D3748')
    : (themeParams?.sections?.products?.textColor || themeParams?.colors?.text || '#2D3748')

  const primaryColor = isCustom
    ? (productsContent?.primaryColor || '#8B4513')
    : (themeParams?.colors?.primary || '#8B4513')

  const accentColor = themeParams?.colors?.accent || '#CD853F'

  // Use provided services or default ones
  const services = productsContent?.services || DEFAULT_SERVICES
  const products = productsContent?.items || []

  return `<section id="products" style="
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
          color: ${primaryColor};
          font-family: ${getFontFamily('titleFont')};
          font-size: ${getFontSize('titleSize', themeParams?.typography?.headingSize === '2xl' ? '2.5rem' : 
                     themeParams?.typography?.headingSize === 'xl' ? '2.25rem' : 
                     themeParams?.typography?.headingSize === 'lg' ? '2rem' : '2.25rem')};
          font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
          margin-bottom: 1rem;
        ">
          ${productsContent?.title || "Giải Pháp Xuất Nhập Khẩu Toàn Diện"}
        </h2>
        <p style="
          color: ${textColor}CC;
          font-family: ${getFontFamily('descriptionFont')};
          font-size: ${getFontSize('descriptionSize', themeParams?.typography?.bodySize === 'sm' ? '1rem' : 
                     themeParams?.typography?.bodySize === 'lg' ? '1.25rem' : 
                     themeParams?.typography?.bodySize === 'xl' ? '1.5rem' : '1.125rem')};
          font-weight: ${getFontWeight('descriptionWeight', '400')};
          max-width: 700px;
          margin: 0 auto;
          opacity: 0.8;
        ">
          ${productsContent?.description || "Từ việc tìm nguồn cà phê cao cấp tại Việt Nam đến giao hàng tại kho Mỹ, chúng tôi xử lý mọi bước của quy trình xuất khẩu."}
        </p>
      </div>

      <!-- Services Grid -->
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      ">
        ${services && Array.isArray(services) ? services.map((service, index) => `
          <div style="
            background: white;
            padding: 2.5rem;
            border-radius: ${borderRadius};
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
            border: 1px solid ${themeParams?.colors?.border || '#E2E8F0'};
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          " onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 15px 40px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.1)'">
            
            <!-- Service Icon -->
            <div style="
              margin-bottom: 1.5rem;
              text-align: center;
              color: ${primaryColor};
            ">
              ${renderLucideIcon(service.icon, 48, primaryColor) || `<span style="font-size: 3rem;">${service.icon || '✓'}</span>`}
            </div>
            
            <!-- Service Title -->
            <h3 style="
              color: ${primaryColor};
              font-family: ${getFontFamily('titleFont')};
              font-size: ${getFontSize('titleSize', themeParams?.typography?.headingSize === '2xl' ? '1.5rem' : 
                         themeParams?.typography?.headingSize === 'xl' ? '1.375rem' : 
                         themeParams?.typography?.headingSize === 'lg' ? '1.25rem' : '1.375rem')};
              font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '600')};
              margin-bottom: 1rem;
              text-align: center;
            ">${service.name}</h3>
            
            <!-- Service Description -->
            <p style="
              color: ${textColor};
              font-family: ${getFontFamily('descriptionFont')};
              font-size: ${typographyStyles.fontSize};
              line-height: 1.6;
              margin-bottom: 1.5rem;
              text-align: center;
              opacity: 0.8;
            ">${service.description}</p>
            
            <!-- Service Features -->
            <div style="margin-bottom: 1.5rem;">
              ${service.features && Array.isArray(service.features) ? service.features.map((feature: string) => `
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                  margin-bottom: 0.5rem;
                  padding: 0.5rem;
                  background: ${themeParams?.colors?.background || '#F7FAFC'};
                  border-radius: ${borderRadius};
                  border-left: 3px solid ${themeParams?.colors?.success || '#28a745'};
                ">
                  <span style="
                    color: ${themeParams?.colors?.success || '#28a745'};
                    font-size: 1.25rem;
                  ">✓</span>
                  <span style="
                    color: ${textColor};
                    font-size: 0.875rem;
                    font-weight: ${getFontWeight('descriptionWeight', themeParams?.typography?.fontWeight || '500')};
                  ">${feature}</span>
                </div>
              `).join('') : ''}
            </div>
            
            <!-- Service CTA -->
            <button style="
              background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: ${themeParams?.components?.button?.rounded ? '9999px' : borderRadius};
              font-family: ${typographyStyles.fontFamily};
              font-size: ${typographyStyles.fontSize};
              font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '600')};
              cursor: pointer;
              width: 100%;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(139, 69, 19, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(139, 69, 19, 0.3)'">
              ${service.cta || "🚀 Tìm hiểu thêm"}
            </button>
            
            <!-- Decorative Corner -->
            <div style="
              position: absolute;
              top: 0;
              right: 0;
              width: 0;
              height: 0;
              border-style: solid;
              border-width: 0 60px 60px 0;
              border-color: transparent ${accentColor} transparent transparent;
              opacity: 0.1;
            "></div>
          </div>
        `).join('') : ''}
      </div>

      <!-- Featured Products Section -->
      ${products && products.length > 0 ? `
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          margin-bottom: 3rem;
        ">
          <div>
            <div style="
              background: white;
              border-radius: ${borderRadius};
              box-shadow: 0 8px 30px rgba(0,0,0,0.1);
              overflow: hidden;
            ">
              <div style="
                width: 100%;
                height: 320px;
                background: linear-gradient(135deg, ${primaryColor}10, ${accentColor}10);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
              ">
                <span style="
                  font-size: 4rem;
                  color: ${primaryColor};
                  margin-bottom: 1rem;
                ">☕</span>
                <p style="
                  color: ${textColor};
                  font-size: 1.125rem;
                ">${products[0]?.name || "Hạt điều Việt Nam"}</p>
              </div>
            </div>
          </div>
          <div style="space-y: 1.5rem;">
            <h3 style="
              color: ${primaryColor};
              font-family: ${getFontFamily('titleFont')};
              font-size: ${getFontSize('titleSize', themeParams?.typography?.headingSize === '2xl' ? '2rem' : 
                         themeParams?.typography?.headingSize === 'xl' ? '1.75rem' : 
                         themeParams?.typography?.headingSize === 'lg' ? '1.5rem' : '1.75rem')};
              font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
              margin-bottom: 1rem;
            ">
              ${products[0]?.name || "Hạt Điều Việt Nam Cao Cấp"}
            </h3>
            <p style="
              color: ${textColor};
              font-family: ${getFontFamily('descriptionFont')};
              font-size: ${typographyStyles.fontSize};
              line-height: 1.6;
              margin-bottom: 1.5rem;
            ">
              ${products[0]?.description || "Chúng tôi tìm nguồn trực tiếp từ các trang trại hạt điều tốt nhất tại Bình Phước và Đồng Nai, nơi sản xuất những hạt điều ngon nhất thế giới."}
            </p>
            <div style="
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1rem;
            ">
              <div style="
                text-align: center;
                padding: 1rem;
                border-radius: ${borderRadius};
                background: ${primaryColor}10;
              ">
                <div style="
                  font-size: 1.5rem;
                  font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
                  color: ${primaryColor};
                  margin-bottom: 0.5rem;
                ">${products[0]?.category || "WW320"}</div>
                <div style="
                  font-size: 0.875rem;
                  color: ${textColor}CC;
                ">${products[0]?.price || "Loại cao cấp"}</div>
              </div>
              <div style="
                text-align: center;
                padding: 1rem;
                border-radius: ${borderRadius};
                background: ${primaryColor}10;
              ">
                <div style="
                  font-size: 1.5rem;
                  font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
                  color: ${primaryColor};
                  margin-bottom: 0.5rem;
                ">WW240</div>
                <div style="
                  font-size: 0.875rem;
                  color: ${textColor}CC;
                ">Loại tiêu chuẩn</div>
              </div>
            </div>
            <button style="
              background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
              color: white;
              border: none;
              padding: 1rem 2rem;
              border-radius: ${themeParams?.components?.button?.rounded ? '9999px' : borderRadius};
              font-family: ${typographyStyles.fontFamily};
              font-size: ${typographyStyles.fontSize};
              font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '600')};
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 8px 25px rgba(139, 69, 19, 0.4);
            " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 35px rgba(139, 69, 19, 0.5)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 25px rgba(139, 69, 19, 0.4)'">
              🚀 Xem danh mục sản phẩm
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Logistics Section -->
      ${products && products.length > 1 ? `
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          margin-bottom: 3rem;
        ">
          <div style="order: 2;">
            <div style="
              background: white;
              border-radius: ${borderRadius};
              box-shadow: 0 8px 30px rgba(0,0,0,0.1);
              overflow: hidden;
            ">
              <div style="
                width: 100%;
                height: 320px;
                background: linear-gradient(135deg, ${primaryColor}10, ${accentColor}10);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
              ">
                <span style="
                  font-size: 4rem;
                  color: ${primaryColor};
                  margin-bottom: 1rem;
                ">🚛</span>
                <p style="
                  color: ${textColor};
                  font-size: 1.125rem;
                ">${products[1]?.name || "Vận chuyển quốc tế"}</p>
              </div>
            </div>
          </div>
          <div style="order: 1; space-y: 1.5rem;">
            <h3 style="
              color: ${primaryColor};
              font-family: ${getFontFamily('titleFont')};
              font-size: ${getFontSize('titleSize', themeParams?.typography?.headingSize === '2xl' ? '2rem' : 
                         themeParams?.typography?.headingSize === 'xl' ? '1.75rem' : 
                         themeParams?.typography?.headingSize === 'lg' ? '1.5rem' : '1.75rem')};
              font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
              margin-bottom: 1rem;
            ">
              ${products[1]?.name || "Logistics & Giao Hàng Liền Mạch"}
            </h3>
            <p style="
              color: ${textColor};
              font-family: ${getFontFamily('descriptionFont')};
              font-size: ${typographyStyles.fontSize};
              line-height: 1.6;
              margin-bottom: 1.5rem;
            ">
              ${products[1]?.description || "Mạng lưới logistics của chúng tôi đảm bảo hạt điều của bạn đến đúng hạn và trong tình trạng hoàn hảo."}
            </p>
            <div style="space-y: 1rem;">
              ${(products[1]?.features || [
                "Tùy chọn container 20ft & 40ft",
                "Vận chuyển kiểm soát nhiệt độ",
                "Theo dõi & cập nhật thời gian thực",
                "Bảo hiểm hàng hóa bao gồm"
              ]).map((feature: string) => `
                <div style="display: flex; align-items: center;">
                  <div style="
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: ${accentColor};
                    margin-right: 0.75rem;
                  "></div>
                  <span style="color: ${textColor};">
                    ${feature}
                  </span>
                </div>
              `).join('')}
            </div>
            <button style="
              background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
              color: white;
              border: none;
              padding: 1rem 2rem;
              border-radius: ${themeParams?.components?.button?.rounded ? '9999px' : borderRadius};
              font-family: ${typographyStyles.fontFamily};
              font-size: ${typographyStyles.fontSize};
              font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '600')};
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 8px 25px rgba(139, 69, 19, 0.4);
            " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 35px rgba(139, 69, 19, 0.5)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 25px rgba(139, 69, 19, 0.4)'">
              🚀 Tìm hiểu về vận chuyển
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Stats Section -->
      <div style="
        background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
        color: white;
        padding: 3rem 2rem;
        border-radius: ${borderRadius};
        text-align: center;
        margin-bottom: 3rem;
        box-shadow: 0 10px 30px rgba(139, 69, 19, 0.3);
      ">
        <h3 style="
          font-family: ${getFontFamily('titleFont')};
          font-size: ${getFontSize('titleSize', themeParams?.typography?.headingSize === '2xl' ? '2rem' : 
                     themeParams?.typography?.headingSize === 'xl' ? '1.75rem' : 
                     themeParams?.typography?.headingSize === 'lg' ? '1.5rem' : '1.75rem')};
          font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '600')};
          margin-bottom: 2rem;
        ">
          📊 Thành tích nổi bật
        </h3>
        
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        ">
          <div>
            <div style="
              font-size: 3rem;
              font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
              margin-bottom: 0.5rem;
            ">500+</div>
            <div style="
              font-size: 0.875rem;
              opacity: 0.9;
            ">Lô hàng xuất khẩu</div>
          </div>
          <div>
            <div style="
              font-size: 3rem;
              font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
              margin-bottom: 0.5rem;
            ">200+</div>
            <div style="
              font-size: 0.875rem;
              opacity: 0.9;
            ">Khách hàng tin tưởng</div>
          </div>
          <div>
            <div style="
              font-size: 3rem;
              font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
              margin-bottom: 0.5rem;
            ">15+</div>
            <div style="
              font-size: 0.875rem;
              opacity: 0.9;
            ">Năm kinh nghiệm</div>
          </div>
          <div>
            <div style="
              font-size: 3rem;
              font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '700')};
              margin-bottom: 0.5rem;
            ">98%</div>
            <div style="
              font-size: 0.875rem;
              opacity: 0.9;
            ">Tỷ lệ hài lòng</div>
          </div>
        </div>
      </div>

      <!-- Final CTA -->
      <div style="text-align: center;">
        <h3 style="
          color: ${primaryColor};
          font-family: ${getFontFamily('titleFont')};
          font-size: ${getFontSize('titleSize', themeParams?.typography?.headingSize === '2xl' ? '2rem' : 
                     themeParams?.typography?.headingSize === 'xl' ? '1.75rem' : 
                     themeParams?.typography?.headingSize === 'lg' ? '1.5rem' : '1.75rem')};
          font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '600')};
          margin-bottom: 1rem;
        ">
          🎯 Sẵn sàng chinh phục thị trường quốc tế?
        </h3>
        <p style="
          color: ${textColor}CC;
          font-family: ${getFontFamily('descriptionFont')};
          font-size: ${typographyStyles.fontSize};
          margin-bottom: 2rem;
          opacity: 0.8;
        ">
          Hãy để chúng tôi đồng hành cùng bạn trên hành trình xuất khẩu thành công
        </p>
        <button style="
          background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
          color: white;
          border: none;
          padding: 1.25rem 3rem;
          border-radius: ${themeParams?.components?.button?.rounded ? '9999px' : borderRadius};
          font-family: ${typographyStyles.fontFamily};
          font-size: ${typographyStyles.fontSize};
          font-weight: ${getFontWeight('titleWeight', themeParams?.typography?.fontWeight || '600')};
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(139, 69, 19, 0.4);
        " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 35px rgba(139, 69, 19, 0.5)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 25px rgba(139, 69, 19, 0.4)'">
          🚀 Bắt đầu ngay hôm nay
        </button>
      </div>
    </div>
    
    <style>
      @media (max-width: 768px) {
        #products {
          padding: 2rem 0;
        }
        
        #products > div > div:first-child {
          margin-bottom: 2rem;
        }
        
        #products h2 {
          font-size: 2rem !important;
        }
        
        #products > div > div:nth-child(2) {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        #products > div > div:nth-child(2) > div {
          padding: 1.5rem;
        }
        
        #products > div > div:nth-child(3) {
          padding: 2rem 1rem;
        }
        
        #products > div > div:nth-child(3) > div {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
      }
    </style>
  </section>`
}
