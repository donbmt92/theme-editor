import { ProductsParams } from '../../types'
import { DEFAULT_CONTENT, DEFAULT_SERVICES } from '../../constants'
import { renderLucideIcon } from '../icons'

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

  const typographyStyles = getTypographyStyles()
  const borderRadius = getBorderRadiusClass()

  // Use provided services or default ones
  const services = content?.services || DEFAULT_SERVICES
  const products = content?.items || []

  return `<section id="products" style="
    background-color: ${content?.backgroundColor || themeParams?.sections?.products?.backgroundColor || '#F8F9FA'};
    color: ${content?.textColor || themeParams?.sections?.products?.textColor || themeParams?.colors?.text || '#2D3748'};
    padding: 4rem 0;
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
          color: ${content?.titleColor || themeParams?.sections?.products?.titleColor || themeParams?.colors?.primary || '#8B4513'};
          font-size: ${themeParams?.typography?.headingSize === '2xl' ? '2.5rem' : 
                     themeParams?.typography?.headingSize === 'xl' ? '2.25rem' : 
                     themeParams?.typography?.headingSize === 'lg' ? '2rem' : '2.25rem'};
          font-weight: ${themeParams?.typography?.fontWeight || '700'};
          margin-bottom: 1rem;
        ">
          ${content?.title || "Giải Pháp Xuất Nhập Khẩu Toàn Diện"}
        </h2>
        <p style="
          color: ${content?.subtitleColor || themeParams?.sections?.products?.subtitleColor || themeParams?.colors?.muted || '#718096'};
          font-size: ${themeParams?.typography?.bodySize === 'sm' ? '1rem' : 
                     themeParams?.typography?.bodySize === 'lg' ? '1.25rem' : 
                     themeParams?.typography?.bodySize === 'xl' ? '1.5rem' : '1.125rem'};
          max-width: 700px;
          margin: 0 auto;
          opacity: 0.8;
        ">
          ${content?.description || "Từ việc tìm nguồn cà phê cao cấp tại Việt Nam đến giao hàng tại kho Mỹ, chúng tôi xử lý mọi bước của quy trình xuất khẩu."}
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
              color: ${themeParams?.colors?.primary || '#8B4513'};
            ">
              ${renderLucideIcon(service.icon, 48, themeParams?.colors?.primary) || `<span style="font-size: 3rem;">${service.icon || '✓'}</span>`}
            </div>
            
            <!-- Service Title -->
            <h3 style="
              color: ${content?.titleColor || themeParams?.sections?.products?.titleColor || themeParams?.colors?.primary || '#8B4513'};
              font-size: ${themeParams?.typography?.headingSize === '2xl' ? '1.5rem' : 
                         themeParams?.typography?.headingSize === 'xl' ? '1.375rem' : 
                         themeParams?.typography?.headingSize === 'lg' ? '1.25rem' : '1.375rem'};
              font-weight: ${themeParams?.typography?.fontWeight || '600'};
              margin-bottom: 1rem;
              text-align: center;
            ">${service.name || service.title}</h3>
            
            <!-- Service Description -->
            <p style="
              color: ${content?.descriptionColor || themeParams?.sections?.products?.descriptionColor || themeParams?.colors?.text || '#2D3748'};
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
                    color: ${content?.textColor || themeParams?.colors?.text || '#2D3748'};
                    font-size: 0.875rem;
                    font-weight: ${themeParams?.typography?.fontWeight || '500'};
                  ">${feature}</span>
                </div>
              `).join('') : ''}
            </div>
            
            <!-- Service CTA -->
            <button style="
              background: linear-gradient(135deg, ${themeParams?.colors?.primary || '#8B4513'} 0%, ${themeParams?.colors?.secondary || '#D2691E'} 100%);
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: ${themeParams?.components?.button?.rounded ? '9999px' : borderRadius};
              font-family: ${typographyStyles.fontFamily};
              font-size: ${typographyStyles.fontSize};
              font-weight: ${themeParams?.typography?.fontWeight || '600'};
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
              border-color: transparent ${themeParams?.colors?.accent || '#CD853F'} transparent transparent;
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
                background: linear-gradient(135deg, ${themeParams?.colors?.primary || '#8B4513'}10, ${themeParams?.colors?.accent || '#CD853F'}10);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
              ">
                <span style="
                  font-size: 4rem;
                  color: ${themeParams?.colors?.primary || '#8B4513'};
                  margin-bottom: 1rem;
                ">☕</span>
                <p style="
                  color: ${themeParams?.colors?.text || '#2D3748'};
                  font-size: 1.125rem;
                ">${products[0]?.name || "Hạt điều Việt Nam"}</p>
              </div>
            </div>
          </div>
          <div style="space-y: 1.5rem;">
            <h3 style="
              color: ${content?.titleColor || themeParams?.colors?.primary || '#8B4513'};
              font-size: ${themeParams?.typography?.headingSize === '2xl' ? '2rem' : 
                         themeParams?.typography?.headingSize === 'xl' ? '1.75rem' : 
                         themeParams?.typography?.headingSize === 'lg' ? '1.5rem' : '1.75rem'};
              font-weight: ${themeParams?.typography?.fontWeight || '700'};
              margin-bottom: 1rem;
            ">
              ${products[0]?.name || "Hạt Điều Việt Nam Cao Cấp"}
            </h3>
            <p style="
              color: ${content?.textColor || themeParams?.colors?.text || '#2D3748'};
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
                background: ${themeParams?.colors?.primary || '#8B4513'}10;
              ">
                <div style="
                  font-size: 1.5rem;
                  font-weight: ${themeParams?.typography?.fontWeight || '700'};
                  color: ${themeParams?.colors?.primary || '#8B4513'};
                  margin-bottom: 0.5rem;
                ">WW320</div>
                <div style="
                  font-size: 0.875rem;
                  color: ${content?.textColor || themeParams?.colors?.muted || '#718096'};
                ">Loại cao cấp</div>
              </div>
              <div style="
                text-align: center;
                padding: 1rem;
                border-radius: ${borderRadius};
                background: ${themeParams?.colors?.primary || '#8B4513'}10;
              ">
                <div style="
                  font-size: 1.5rem;
                  font-weight: ${themeParams?.typography?.fontWeight || '700'};
                  color: ${themeParams?.colors?.primary || '#8B4513'};
                  margin-bottom: 0.5rem;
                ">WW240</div>
                <div style="
                  font-size: 0.875rem;
                  color: ${content?.textColor || themeParams?.colors?.muted || '#718096'};
                ">Loại tiêu chuẩn</div>
              </div>
            </div>
            <button style="
              background: linear-gradient(135deg, ${themeParams?.colors?.primary || '#8B4513'} 0%, ${themeParams?.colors?.secondary || '#D2691E'} 100%);
              color: white;
              border: none;
              padding: 1rem 2rem;
              border-radius: ${themeParams?.components?.button?.rounded ? '9999px' : borderRadius};
              font-family: ${typographyStyles.fontFamily};
              font-size: ${typographyStyles.fontSize};
              font-weight: ${themeParams?.typography?.fontWeight || '600'};
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
                background: linear-gradient(135deg, ${themeParams?.colors?.primary || '#8B4513'}10, ${themeParams?.colors?.accent || '#CD853F'}10);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
              ">
                <span style="
                  font-size: 4rem;
                  color: ${themeParams?.colors?.primary || '#8B4513'};
                  margin-bottom: 1rem;
                ">🚛</span>
                <p style="
                  color: ${themeParams?.colors?.text || '#2D3748'};
                  font-size: 1.125rem;
                ">${products[1]?.name || "Vận chuyển quốc tế"}</p>
              </div>
            </div>
          </div>
          <div style="order: 1; space-y: 1.5rem;">
            <h3 style="
              color: ${content?.titleColor || themeParams?.colors?.primary || '#8B4513'};
              font-size: ${themeParams?.typography?.headingSize === '2xl' ? '2rem' : 
                         themeParams?.typography?.headingSize === 'xl' ? '1.75rem' : 
                         themeParams?.typography?.headingSize === 'lg' ? '1.5rem' : '1.75rem'};
              font-weight: ${themeParams?.typography?.fontWeight || '700'};
              margin-bottom: 1rem;
            ">
              ${products[1]?.name || "Logistics & Giao Hàng Liền Mạch"}
            </h3>
            <p style="
              color: ${content?.textColor || themeParams?.colors?.text || '#2D3748'};
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
                    background-color: ${themeParams?.colors?.accent || '#28A745'};
                    margin-right: 0.75rem;
                  "></div>
                  <span style="color: ${content?.textColor || themeParams?.colors?.text || '#2D3748'};">
                    ${feature}
                  </span>
                </div>
              `).join('')}
            </div>
            <button style="
              background: linear-gradient(135deg, ${themeParams?.colors?.primary || '#8B4513'} 0%, ${themeParams?.colors?.secondary || '#D2691E'} 100%);
              color: white;
              border: none;
              padding: 1rem 2rem;
              border-radius: ${themeParams?.components?.button?.rounded ? '9999px' : borderRadius};
              font-family: ${typographyStyles.fontFamily};
              font-size: ${typographyStyles.fontSize};
              font-weight: ${themeParams?.typography?.fontWeight || '600'};
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
        background: linear-gradient(135deg, ${themeParams?.colors?.primary || '#8B4513'} 0%, ${themeParams?.colors?.secondary || '#D2691E'} 100%);
        color: white;
        padding: 3rem 2rem;
        border-radius: ${borderRadius};
        text-align: center;
        margin-bottom: 3rem;
        box-shadow: 0 10px 30px rgba(139, 69, 19, 0.3);
      ">
        <h3 style="
          font-size: ${themeParams?.typography?.headingSize === '2xl' ? '2rem' : 
                     themeParams?.typography?.headingSize === 'xl' ? '1.75rem' : 
                     themeParams?.typography?.headingSize === 'lg' ? '1.5rem' : '1.75rem'};
          font-weight: ${themeParams?.typography?.fontWeight || '600'};
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
              font-weight: ${themeParams?.typography?.fontWeight || '700'};
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
              font-weight: ${themeParams?.typography?.fontWeight || '700'};
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
              font-weight: ${themeParams?.typography?.fontWeight || '700'};
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
              font-weight: ${themeParams?.typography?.fontWeight || '700'};
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
          color: ${content?.titleColor || themeParams?.sections?.products?.titleColor || themeParams?.colors?.primary || '#8B4513'};
          font-size: ${themeParams?.typography?.headingSize === '2xl' ? '2rem' : 
                     themeParams?.typography?.headingSize === 'xl' ? '1.75rem' : 
                     themeParams?.typography?.headingSize === 'lg' ? '1.5rem' : '1.75rem'};
          font-weight: ${themeParams?.typography?.fontWeight || '600'};
          margin-bottom: 1rem;
        ">
          🎯 Sẵn sàng chinh phục thị trường quốc tế?
        </h3>
        <p style="
          color: ${content?.subtitleColor || themeParams?.sections?.products?.subtitleColor || themeParams?.colors?.muted || '#718096'};
          font-size: ${typographyStyles.fontSize};
          margin-bottom: 2rem;
          opacity: 0.8;
        ">
          Hãy để chúng tôi đồng hành cùng bạn trên hành trình xuất khẩu thành công
        </p>
        <button style="
          background: linear-gradient(135deg, ${themeParams?.colors?.primary || '#8B4513'} 0%, ${themeParams?.colors?.secondary || '#D2691E'} 100%);
          color: white;
          border: none;
          padding: 1.25rem 3rem;
          border-radius: ${themeParams?.components?.button?.rounded ? '9999px' : borderRadius};
          font-family: ${typographyStyles.fontFamily};
          font-size: ${typographyStyles.fontSize};
          font-weight: ${themeParams?.typography?.fontWeight || '600'};
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
