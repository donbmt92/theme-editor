import { TestimonialsParams } from '../../types'
import { DEFAULT_CONTENT, DEFAULT_TESTIMONIALS } from '../../constants'

/**
 * Generate static testimonials section HTML
 */
export function generateStaticTestimonialsSection({ content, colors, themeParams }: TestimonialsParams): string {
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

  // Use provided testimonials or default ones
  const testimonials: Array<{
    id: string;
    name: string;
    position: string;
    company: string;
    content: string;
    rating: number;
    avatar: string;
  }> = content?.testimonials || DEFAULT_TESTIMONIALS

  return `<section id="testimonials" style="
    background-color: ${content?.backgroundColor || themeParams?.sections?.testimonials?.backgroundColor || '#F8F9FA'};
    color: ${content?.textColor || themeParams?.sections?.testimonials?.textColor || themeParams?.colors?.text || '#2D3748'};
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
          color: ${content?.titleColor || themeParams?.sections?.testimonials?.titleColor || themeParams?.colors?.primary || '#8B4513'};
          font-size: ${themeParams?.typography?.headingSize === '2xl' ? '2.5rem' : 
                     themeParams?.typography?.headingSize === 'xl' ? '2.25rem' : 
                     themeParams?.typography?.headingSize === 'lg' ? '2rem' : '2.25rem'};
          font-weight: ${themeParams?.typography?.fontWeight || '700'};
          margin-bottom: 1rem;
        ">
          ${content?.title || DEFAULT_CONTENT.TESTIMONIALS_TITLE}
        </h2>
        <p style="
          color: ${content?.subtitleColor || themeParams?.sections?.testimonials?.subtitleColor || themeParams?.colors?.muted || '#718096'};
          font-size: ${themeParams?.typography?.bodySize === 'sm' ? '1rem' : 
                     themeParams?.typography?.bodySize === 'lg' ? '1.25rem' : 
                     themeParams?.typography?.bodySize === 'xl' ? '1.5rem' : '1.125rem'};
          max-width: 600px;
          margin: 0 auto;
          opacity: 0.8;
        ">
          ${content?.subtitle || DEFAULT_CONTENT.TESTIMONIALS_SUBTITLE}
        </p>
      </div>

      <!-- Testimonials Grid -->
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      ">
        ${testimonials.map((testimonial, index) => `
          <div style="
            background: white;
            padding: 2.5rem;
            border-radius: ${borderRadius};
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
            border: 1px solid ${themeParams?.colors?.border || '#E2E8F0'};
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 12px 35px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.1)'">
            
            <!-- Quote Icon -->
            <div style="
              position: absolute;
              top: 1rem;
              right: 1rem;
              font-size: 3rem;
              color: ${themeParams?.colors?.accent || '#CD853F'};
              opacity: 0.3;
            ">"</div>
            
            <!-- Rating Stars -->
            <div style="
              display: flex;
              gap: 0.25rem;
              margin-bottom: 1.5rem;
              justify-content: center;
            ">
              ${Array.from({ length: testimonial.rating || 5 }, (_, i) => `
                <span style="
                  color: ${themeParams?.colors?.warning || '#ffc107'};
                  font-size: 1.25rem;
                ">⭐</span>
              `).join('')}
            </div>
            
            <!-- Testimonial Content -->
            <blockquote style="
              color: ${content?.descriptionColor || themeParams?.sections?.testimonials?.descriptionColor || themeParams?.colors?.text || '#2D3748'};
              font-size: ${typographyStyles.fontSize};
              line-height: 1.7;
              margin-bottom: 2rem;
              text-align: center;
              font-style: italic;
              opacity: 0.9;
              position: relative;
            ">
              "${testimonial.content}"
            </blockquote>
            
            <!-- Author Info -->
            <div style="
              display: flex;
              align-items: center;
              gap: 1rem;
              justify-content: center;
            ">
              <!-- Avatar -->
              <div style="
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, ${themeParams?.colors?.primary || '#8B4513'} 0%, ${themeParams?.colors?.secondary || '#D2691E'} 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
                font-weight: ${themeParams?.typography?.fontWeight || '600'};
                text-transform: uppercase;
              ">${testimonial.avatar}</div>
              
              <!-- Author Details -->
              <div style="text-align: left;">
                <h4 style="
                  color: ${content?.titleColor || themeParams?.sections?.testimonials?.titleColor || themeParams?.colors?.primary || '#8B4513'};
                  font-size: ${themeParams?.typography?.headingSize === '2xl' ? '1.25rem' : 
                             themeParams?.typography?.headingSize === 'xl' ? '1.125rem' : 
                             themeParams?.typography?.headingSize === 'lg' ? '1rem' : '1.125rem'};
                  font-weight: ${themeParams?.typography?.fontWeight || '600'};
                  margin: 0 0 0.25rem 0;
                ">${testimonial.name}</h4>
                <p style="
                  color: ${content?.subtitleColor || themeParams?.sections?.testimonials?.subtitleColor || themeParams?.colors?.muted || '#718096'};
                  font-size: 0.875rem;
                  margin: 0;
                  opacity: 0.8;
                ">${testimonial.position}</p>
                <p style="
                  color: ${content?.subtitleColor || themeParams?.sections?.testimonials?.subtitleColor || themeParams?.colors?.muted || '#718096'};
                  font-size: 0.875rem;
                  margin: 0;
                  opacity: 0.7;
                  font-weight: ${themeParams?.typography?.fontWeight || '500'};
                ">${testimonial.company}</p>
              </div>
            </div>
            
            <!-- Decorative Bottom Border -->
            <div style="
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, ${themeParams?.colors?.primary || '#8B4513'} 0%, ${themeParams?.colors?.secondary || '#D2691E'} 100%);
            "></div>
          </div>
        `).join('')}
      </div>

      <!-- Trust Indicators -->
      <div style="
        background: white;
        padding: 2rem;
        border-radius: ${borderRadius};
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        text-align: center;
        margin-bottom: 3rem;
      ">
        <h3 style="
          color: ${content?.titleColor || themeParams?.sections?.testimonials?.titleColor || themeParams?.colors?.primary || '#8B4513'};
          font-size: ${themeParams?.typography?.headingSize === '2xl' ? '1.75rem' : 
                     themeParams?.typography?.headingSize === 'xl' ? '1.5rem' : 
                     themeParams?.typography?.headingSize === 'lg' ? '1.375rem' : '1.5rem'};
          font-weight: ${themeParams?.typography?.fontWeight || '600'};
          margin-bottom: 1.5rem;
        ">
          🏆 Được tin tưởng bởi các thương hiệu hàng đầu
        </h3>
        
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
          align-items: center;
        ">
          <div style="
            padding: 1rem;
            background: ${themeParams?.colors?.background || '#F7FAFC'};
            border-radius: ${borderRadius};
            border: 1px solid ${themeParams?.colors?.border || '#E2E8F0'};
          ">
            <div style="
              font-size: 2rem;
              margin-bottom: 0.5rem;
            ">☕</div>
            <div style="
              font-size: 0.875rem;
              font-weight: ${themeParams?.typography?.fontWeight || '600'};
              color: ${themeParams?.colors?.primary || '#8B4513'};
            ">Starbucks</div>
          </div>
          
          <div style="
            padding: 1rem;
            background: ${themeParams?.colors?.background || '#F7FAFC'};
            border-radius: ${borderRadius};
            border: 1px solid ${themeParams?.colors?.border || '#E2E8F0'};
          ">
            <div style="
              font-size: 2rem;
              margin-bottom: 0.5rem;
            ">🔵</div>
            <div style="
              font-size: 0.875rem;
              font-weight: ${themeParams?.typography?.fontWeight || '600'};
              color: ${themeParams?.colors?.primary || '#8B4513'};
            ">Blue Bottle</div>
          </div>
          
          <div style="
            padding: 1rem;
            background: ${themeParams?.colors?.background || '#F7FAFC'};
            border-radius: ${borderRadius};
            border: 1px solid ${themeParams?.colors?.border || '#E2E8F0'};
          ">
            <div style="
              font-size: 2rem;
              margin-bottom: 0.5rem;
            ">🧠</div>
            <div style="
              font-size: 0.875rem;
              font-weight: ${themeParams?.typography?.fontWeight || '600'};
              color: ${themeParams?.colors?.primary || '#8B4513'};
            ">Intelligentsia</div>
          </div>
          
          <div style="
            padding: 1rem;
            background: ${themeParams?.colors?.background || '#F7FAFC'};
            border-radius: ${borderRadius};
            border: 1px solid ${themeParams?.colors?.border || '#E2E8F0'};
          ">
            <div style="
              font-size: 2rem;
              margin-bottom: 0.5rem;
            ">🌍</div>
            <div style="
              font-size: 0.875rem;
              font-weight: ${themeParams?.typography?.fontWeight || '600'};
              color: ${themeParams?.colors?.primary || '#8B4513'};
            ">Global Partners</div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div style="
        text-align: center;
        background: linear-gradient(135deg, ${themeParams?.colors?.primary || '#8B4513'} 0%, ${themeParams?.colors?.secondary || '#D2691E'} 100%);
        color: white;
        padding: 3rem 2rem;
        border-radius: ${borderRadius};
        box-shadow: 0 10px 30px rgba(139, 69, 19, 0.3);
      ">
        <h3 style="
          font-size: ${themeParams?.typography?.headingSize === '2xl' ? '2rem' : 
                     themeParams?.typography?.headingSize === 'xl' ? '1.75rem' : 
                     themeParams?.typography?.headingSize === 'lg' ? '1.5rem' : '1.75rem'};
          font-weight: ${themeParams?.typography?.fontWeight || '600'};
          margin-bottom: 1rem;
        ">
          💬 Hãy để chúng tôi kể câu chuyện thành công của bạn!
        </h3>
        <p style="
          font-size: ${typographyStyles.fontSize};
          margin-bottom: 2rem;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        ">
          Tham gia cùng hàng trăm doanh nghiệp đã thành công trong xuất khẩu với sự hỗ trợ của chúng tôi
        </p>
        <button style="
          background: white;
          color: ${themeParams?.colors?.primary || '#8B4513'};
          border: none;
          padding: 1rem 2.5rem;
          border-radius: ${themeParams?.components?.button?.rounded ? '9999px' : borderRadius};
          font-family: ${typographyStyles.fontFamily};
          font-size: ${typographyStyles.fontSize};
          font-weight: ${themeParams?.typography?.fontWeight || '600'};
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.2)'">
          🚀 Bắt đầu hành trình ngay
        </button>
      </div>
    </div>
    
    <style>
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
          padding: 1.5rem;
        }
        
        #testimonials > div > div:nth-child(3) > div {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        
        #testimonials > div > div:nth-child(4) {
          padding: 2rem 1rem;
        }
      }
    </style>
  </section>`
}
