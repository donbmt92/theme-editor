import { ThemeParams } from "../../types";

export interface ProductPageParams {
    content: any;
    themeParams: ThemeParams;
}

/**
 * Generate static product page HTML
 * This is a simplified version - full implementation would include all 13 sections
 */
export function generateStaticProductPage({
    content,
    themeParams,
}: ProductPageParams): string {
    const productPage = content?.productPage;

    // Don't render if not enabled
    if (!productPage?.enabled) {
        return '';
    }

    const hero = productPage?.hero || {};
    const overview = productPage?.overview || {};

    return `<section id="product-page" style="
    background-color: ${themeParams?.colors?.background || '#FFFFFF'};
    padding: 5rem 1rem;
  ">
    <div style="
      max-width: ${themeParams?.layout?.containerWidth || '1200px'};
      margin: 0 auto;
    ">
      <!-- Product Hero -->
      <div style="text-align: center; margin-bottom: 4rem;">
        <h1 style="
          font-size: 3rem;
          font-weight: 700;
          color: ${themeParams?.colors?.text || '#1F2937'};
          margin-bottom: 1rem;
          font-family: ${themeParams?.typography?.fontFamily || 'Inter'};
        ">
          ${hero?.title || '[Product Name] Manufacturer & Exporter'}
        </h1>
        <p style="
          font-size: 1.25rem;
          color: ${themeParams?.colors?.muted || '#6B7280'};
          margin-bottom: 2rem;
        ">
          ${hero?.subtitle || 'Professional supplier with years of manufacturing experience'}
        </p>

        <!-- USPs -->
        ${hero?.usps && hero.usps.length > 0 ? `
          <div style="
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            justify-content: center;
            margin-top: 2rem;
          ">
            ${hero.usps.map((usp: string) => `
              <div style="
                background: linear-gradient(135deg, ${themeParams?.colors?.primary}10, ${themeParams?.colors?.accent}10);
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                border: 1px solid ${themeParams?.colors?.primary}30;
              ">
                <span style="color: ${themeParams?.colors?.text};">✓ ${usp}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Product Overview -->
      ${overview?.description ? `
        <div style="
          background: ${themeParams?.colors?.background || '#F9FAFB'};
          padding: 3rem;
          border-radius: 1rem;
          margin-bottom: 3rem;
          border: 1px solid ${themeParams?.colors?.border || '#E5E7EB'};
        ">
          <h2 style="
            font-size: 2rem;
            font-weight: 600;
            color: ${themeParams?.colors?.text || '#1F2937'};
            margin-bottom: 1.5rem;
          ">Product Overview</h2>
          <p style="
            font-size: 1.125rem;
            line-height: 1.75;
            color: ${themeParams?.colors?.muted || '#6B7280'};
          ">${overview.description}</p>

          ${overview?.highlights && overview.highlights.length > 0 ? `
            <div style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 1.5rem;
              margin-top: 2rem;
            ">
              ${overview.highlights.map((h: any) => `
                <div style="text-align: center;">
                  <div style="
                    font-weight: 600;
                    color: ${themeParams?.colors?.primary};
                    margin-bottom: 0.5rem;
                  ">${h.label}</div>
                  <div style="
                    font-size: 1.25rem;
                    color: ${themeParams?.colors?.text};
                  ">${h.value}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- Placeholder for remaining sections -->
      <div style="
        background: linear-gradient(135deg, ${themeParams?.colors?.primary}08, ${themeParams?.colors?.accent}08);
        padding: 4rem 2rem;
        border-radius: 1rem;
        text-align: center;
        border: 2px dashed ${themeParams?.colors?.primary}30;
      ">
        <h3 style="
          font-size: 1.5rem;
          font-weight: 600;
          color: ${themeParams?.colors?.text};
          margin-bottom: 1rem;
        ">Complete Product Page Template</h3>
        <p style="
          color: ${themeParams?.colors?.muted};
          margin-bottom: 1.5rem;
        ">
          Includes 13 professional sections: Features, Technical Specs, Applications, 
          Certifications, OEM/ODM, Packaging, Shipping, Why Choose Us, Lead Magnets, 
          RFQ Form, and CTA
        </p>
        <p style="
          font-size: 0.875rem;
          color: ${themeParams?.colors?.muted};
        ">
          Full template generation available for PRO tier users
        </p>
      </div>

      <!-- Back to top -->
      <div style="text-align: center; margin-top: 4rem;">
        <a href="#hero" style="
          display: inline-block;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, ${themeParams?.colors?.primary}, ${themeParams?.colors?.accent});
          color: #FFFFFF;
          text-decoration: none;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        ">
          ↑ Back to Top
        </a>
      </div>
    </div>
  </section>

  <style>
    @media (max-width: 768px) {
      #product-page h1 {
        font-size: 2rem !important;
      }
      #product-page h2 {
        font-size: 1.5rem !important;
      }
    }
  </style>
  `;
}
