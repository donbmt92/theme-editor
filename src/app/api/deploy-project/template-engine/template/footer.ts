import { ThemeParams } from '../../types'

/**
 * Generate static footer HTML
 */
export function generateStaticFooter(themeParams: ThemeParams): string {
  // Get project language from themeParams
  const projectLanguage = themeParams?.projectLanguage || 'vietnamese';

  // Get localized text based on project language
  const getLocalizedText = () => {
    if (projectLanguage === 'english') {
      return {
        companyName: "Viet Coffee",
        companySubtitle: "Premium Export Partner",
        description: "Specialized in providing high-quality coffee for international markets with commitment to quality and sustainability",
        quickLinks: {
          title: "Quick Links",
          links: [
            { name: "Home", href: "#" },
            { name: "About Us", href: "#about" },
            { name: "Products", href: "#products" },
            { name: "Services", href: "#services" },
            { name: "Contact", href: "#contact" }
          ]
        },
        services: {
          title: "Main Services",
          items: [
            { icon: "☕", name: "Coffee Export" },
            { icon: "🚚", name: "Logistics & Shipping" },
            { icon: "📋", name: "Documentation Support" },
            { icon: "👥", name: "Training & Development" },
            { icon: "💡", name: "Strategic Consulting" }
          ]
        },
        contact: {
          title: "Contact Information",
          address: "Ho Chi Minh City, Vietnam",
          phone: "+84 28 1234 5678",
          email: "info@caphevn.com",
          hours: "Mon - Fri: 8:00 - 18:00"
        },
        newsletter: {
          title: "Subscribe to Newsletter",
          placeholder: "Your email"
        },
        copyright: "© 2025 Viet Coffee. All rights reserved.",
        legal: [
          { name: "Privacy Policy", href: "#" },
          { name: "Terms of Service", href: "#" },
          { name: "Sitemap", href: "#" }
        ],
        footer: "Developed with ❤️ in Vietnam | Theme Editor v2.0"
      };
    } else {
      return {
        companyName: "Cà Phê Việt",
        companySubtitle: "Đối tác xuất khẩu cao cấp",
        description: "Chuyên gia xuất khẩu cà phê Việt Nam chất lượng cao, đồng hành cùng doanh nghiệp chinh phục thị trường quốc tế.",
        quickLinks: {
          title: "Liên kết nhanh",
          links: [
            { name: "Trang chủ", href: "#" },
            { name: "Về chúng tôi", href: "#about" },
            { name: "Dịch vụ", href: "#products" },
            { name: "Khách hàng", href: "#testimonials" },
            { name: "Liên hệ", href: "#contact" }
          ]
        },
        services: {
          title: "Dịch vụ chính",
          items: [
            { icon: "☕", name: "Xuất khẩu cà phê" },
            { icon: "🚚", name: "Logistics & Vận chuyển" },
            { icon: "📋", name: "Tư vấn thủ tục" },
            { icon: "👥", name: "Đào tạo & Phát triển" },
            { icon: "💡", name: "Tư vấn chiến lược" }
          ]
        },
        contact: {
          title: "Thông tin liên hệ",
          address: "TP. Hồ Chí Minh, Việt Nam",
          phone: "+84 28 1234 5678",
          email: "info@caphevn.com",
          hours: "Thứ 2 - Thứ 6: 8:00 - 18:00"
        },
        newsletter: {
          title: "Đăng ký nhận tin",
          placeholder: "Email của bạn"
        },
        copyright: "© 2025 Cà Phê Việt. Tất cả quyền được bảo lưu.",
        legal: [
          { name: "Chính sách bảo mật", href: "#" },
          { name: "Điều khoản sử dụng", href: "#" },
          { name: "Sitemap", href: "#" }
        ],
        footer: "Được phát triển với ❤️ tại Việt Nam | Theme Editor v2.0"
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

  const typographyStyles = getTypographyStyles()
  const borderRadius = getBorderRadiusClass()

  return `<footer style="
    background: linear-gradient(135deg, ${themeParams?.colors?.primary || '#8B4513'} 0%, ${themeParams?.colors?.secondary || '#D2691E'} 100%);
    color: white;
    padding: 3rem 0 1rem 0;
    font-family: ${typographyStyles.fontFamily};
    font-size: ${typographyStyles.fontSize};
    line-height: ${typographyStyles.lineHeight};
    font-weight: ${typographyStyles.fontWeight};
    position: relative;
    overflow: hidden;
  ">
    <!-- Background Pattern -->
    <div style="
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.1;
      background-image: radial-gradient(circle at 75% 75%, white 2px, transparent 2px);
      background-size: 40px 40px;
    "></div>

    <div style="
      max-width: ${themeParams?.layout?.containerWidth || '1200px'}; 
      margin: 0 auto; 
      padding: 0 1rem;
      position: relative;
      z-index: 1;
    ">
      <!-- Main Footer Content -->
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      ">
        <!-- Company Info -->
        <div>
          <div style="
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
          ">
            <div style="
              width: 2.5rem;
              height: 2.5rem;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: ${themeParams?.colors?.accent || '#CD853F'};
              border-radius: ${borderRadius};
            ">
              <span style="color: white; font-size: 1.5rem;">☕</span>
            </div>
            <div>
              <h3 style="
                color: white;
                font-size: ${themeParams?.typography?.headingSize === '2xl' ? '1.5rem' : 
                           themeParams?.typography?.headingSize === 'xl' ? '1.25rem' : '1.125rem'};
                font-weight: ${themeParams?.typography?.fontWeight || '700'};
                margin: 0;
              ">${localizedText.companyName}</h3>
              <p style="
                color: rgba(255,255,255,0.8);
                font-size: 0.875rem;
                margin: 0;
              ">${localizedText.companySubtitle}</p>
            </div>
          </div>
          
          <p style="
            color: rgba(255,255,255,0.9);
            font-size: ${typographyStyles.fontSize};
            line-height: 1.6;
            margin-bottom: 1.5rem;
            max-width: 300px;
          ">
            ${localizedText.description}
          </p>
          
          <!-- Social Links -->
          <div style="
            display: flex;
            gap: 1rem;
          ">
            <a href="#" style="
              width: 40px;
              height: 40px;
              background: rgba(255,255,255,0.2);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              text-decoration: none;
              transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='translateY(0)'">
              📘
            </a>
            <a href="#" style="
              width: 40px;
              height: 40px;
              background: rgba(255,255,255,0.2);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              text-decoration: none;
              transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='translateY(0)'">
              📷
            </a>
            <a href="#" style="
              width: 40px;
              height: 40px;
              background: rgba(255,255,255,0.2);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              text-decoration: none;
              transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='translateY(0)'">
              🐦
            </a>
            <a href="#" style="
              width: 40px;
              height: 40px;
              background: rgba(255,255,255,0.2);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              text-decoration: none;
              transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='translateY(0)'">
              💼
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 style="
            color: white;
            font-size: ${themeParams?.typography?.headingSize === '2xl' ? '1.25rem' : 
                       themeParams?.typography?.headingSize === 'xl' ? '1.125rem' : '1rem'};
            font-weight: ${themeParams?.typography?.fontWeight || '600'};
            margin-bottom: 1.5rem;
            border-bottom: 2px solid rgba(255,255,255,0.3);
            padding-bottom: 0.5rem;
          ">${localizedText.quickLinks.title}</h4>
          
          <ul style="
            list-style: none;
            padding: 0;
            margin: 0;
          ">
            ${localizedText.quickLinks.links.map(link => `
            <li style="margin-bottom: 0.75rem;">
              <a href="${link.href}" style="
                color: rgba(255,255,255,0.9);
                text-decoration: none;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
              " onmouseover="this.style.color='white'; this.style.transform='translateX(5px)'" onmouseout="this.style.color='rgba(255,255,255,0.9)'; this.style.transform='translateX(0)'">
                <span>→</span> ${link.name}
              </a>
            </li>
            `).join('')}
          </ul>
        </div>

        <!-- Services -->
        <div>
          <h4 style="
            color: white;
            font-size: ${themeParams?.typography?.headingSize === '2xl' ? '1.25rem' : 
                       themeParams?.typography?.headingSize === 'xl' ? '1.125rem' : '1rem'};
            font-weight: ${themeParams?.typography?.fontWeight || '600'};
            margin-bottom: 1.5rem;
            border-bottom: 2px solid rgba(255,255,255,0.3);
            padding-bottom: 0.5rem;
          ">${localizedText.services.title}</h4>
          
          <ul style="
            list-style: none;
            padding: 0;
            margin: 0;
          ">
            ${localizedText.services.items.map(service => `
            <li style="margin-bottom: 0.75rem;">
              <span style="
                color: rgba(255,255,255,0.9);
                display: flex;
                align-items: center;
                gap: 0.5rem;
              ">
                <span>${service.icon}</span> ${service.name}
              </span>
            </li>
            `).join('')}
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 style="
            color: white;
            font-size: ${themeParams?.typography?.headingSize === '2xl' ? '1.25rem' : 
                       themeParams?.typography?.headingSize === 'xl' ? '1.125rem' : '1rem'};
            font-weight: ${themeParams?.typography?.fontWeight || '600'};
            margin-bottom: 1.5rem;
            border-bottom: 2px solid rgba(255,255,255,0.3);
            padding-bottom: 0.5rem;
          ">${localizedText.contact.title}</h4>
          
          <div style="margin-bottom: 1rem;">
            <div style="
              display: flex;
              align-items: center;
              gap: 0.75rem;
              margin-bottom: 0.75rem;
            ">
              <span style="font-size: 1.25rem;">📍</span>
              <span style="color: rgba(255,255,255,0.9);">
                ${localizedText.contact.address}
              </span>
            </div>
            
            <div style="
              display: flex;
              align-items: center;
              gap: 0.75rem;
              margin-bottom: 0.75rem;
            ">
              <span style="font-size: 1.25rem;">📞</span>
              <span style="color: rgba(255,255,255,0.9);">
                ${localizedText.contact.phone}
              </span>
            </div>
            
            <div style="
              display: flex;
              align-items: center;
              gap: 0.75rem;
              margin-bottom: 0.75rem;
            ">
              <span style="font-size: 1.25rem;">✉️</span>
              <span style="color: rgba(255,255,255,0.9);">
                ${localizedText.contact.email}
              </span>
            </div>
            
            <div style="
              display: flex;
              align-items: center;
              gap: 0.75rem;
              margin-bottom: 0.75rem;
            ">
              <span style="font-size: 1.25rem;">🕒</span>
              <span style="color: rgba(255,255,255,0.9);">
                ${localizedText.contact.hours}
              </span>
            </div>
          </div>
          
          <!-- Newsletter Signup -->
          <div style="
            background: rgba(255,255,255,0.1);
            padding: 1rem;
            border-radius: ${borderRadius};
            border: 1px solid rgba(255,255,255,0.2);
          ">
            <h5 style="
              color: white;
              font-size: 0.875rem;
              font-weight: ${themeParams?.typography?.fontWeight || '600'};
              margin-bottom: 0.75rem;
            ">${localizedText.newsletter.title}</h5>
            <div style="
              display: flex;
              gap: 0.5rem;
            ">
              <input type="email" placeholder="${localizedText.newsletter.placeholder}" style="
                flex: 1;
                padding: 0.5rem;
                border: none;
                border-radius: ${borderRadius};
                font-family: ${typographyStyles.fontFamily};
                font-size: 0.875rem;
              " />
              <button style="
                background: ${themeParams?.colors?.accent || '#CD853F'};
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: ${borderRadius};
                font-family: ${typographyStyles.fontFamily};
                font-size: 0.875rem;
                font-weight: ${themeParams?.typography?.fontWeight || '600'};
                cursor: pointer;
                transition: all 0.3s ease;
              " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                📧
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="
        border-top: 1px solid rgba(255,255,255,0.2);
        padding-top: 2rem;
        text-align: center;
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
        ">
          <p style="
            color: rgba(255,255,255,0.8);
            font-size: 0.875rem;
            margin: 0;
          ">
            ${localizedText.copyright}
          </p>
          
          <div style="
            display: flex;
            gap: 1.5rem;
            flex-wrap: wrap;
          ">
            ${localizedText.legal.map(legal => `
            <a href="${legal.href}" style="
              color: rgba(255,255,255,0.8);
              text-decoration: none;
              font-size: 0.875rem;
              transition: color 0.3s ease;
            " onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
              ${legal.name}
            </a>
            `).join('')}
          </div>
        </div>
        
        <p style="
          color: rgba(255,255,255,0.6);
          font-size: 0.75rem;
          margin: 0;
        ">
          ${localizedText.footer}
        </p>
      </div>
    </div>
    
    <style>
      @media (max-width: 768px) {
        footer {
          padding: 2rem 0 1rem 0;
        }
        
        footer > div > div:first-child {
          grid-template-columns: 1fr;
          gap: 2rem;
          text-align: center;
        }
        
        footer > div > div:first-child > div:first-child > div:first-child {
          justify-content: center;
        }
        
        footer > div > div:first-child > div:first-child > p {
          margin-left: auto;
          margin-right: auto;
        }
        
        footer > div > div:first-child > div:first-child > div:last-child {
          justify-content: center;
        }
        
        footer > div > div:last-child > div:first-child {
          flex-direction: column;
          text-align: center;
        }
        
        footer > div > div:last-child > div:first-child > div:last-child {
          justify-content: center;
        }
      }
    </style>
  </footer>`
}
