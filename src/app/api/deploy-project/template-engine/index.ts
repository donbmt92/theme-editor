// Main Template Engine - Export all template functions
export * from './deploy-scripts'
export * from './static-files'
export * from './html-templates'

// Main template engine class
export class TemplateEngine {
  /**
   * Generate file content based on file info and parameters
   */
  static async generateFileContent(
    fileInfo: any, 
    themeParams: any, 
    projectName: string, 
    description: string, 
    serverType?: string, 
    domain?: string, 
    timestamp?: number
  ): Promise<string> {
    const { generateStaticCss, generateStaticJs, generateSitemapFile, generateRobotsTxtFile, generateManifestFile, generateStaticReadme } = await import('./static-files')
    const { generateDeployScript } = await import('./deploy-scripts')
    const { 
      generateStaticHeader, 
      generateStaticHeroSection, 
      generateStaticLeadMagnetSection,
      generateStaticProblemsSection, 
      generateStaticProductsSection, 
      generateStaticTestimonialsSection,
      generateStaticWhyChooseUsSection,
      generateStaticBlogSection,
      generateStaticFooter 
    } = await import('./html-templates')

    if (fileInfo.type === 'placeholder') {
      return fileInfo.content
    } else if (fileInfo.type === 'template') {
      switch (fileInfo.template) {
        case 'html':
          return this.generateMainHtml(projectName, description, themeParams)
        case 'css':
          return generateStaticCss(themeParams)
        case 'js':
          return generateStaticJs()
        case 'sitemap':
          return generateSitemapFile(projectName, themeParams)
        case 'robots':
          return generateRobotsTxtFile()
        case 'manifest':
          return generateManifestFile(projectName, themeParams)
        case 'readme':
          return generateStaticReadme(projectName, description)
        case 'deploy-script':
          return generateDeployScript({
            projectName,
            serverType: fileInfo.serverType || serverType || 'nginx',
            domain: fileInfo.domain || domain,
            timestamp: fileInfo.timestamp || timestamp
          })
        default:
          return ''
      }
    }
    
    return ''
  }

  /**
   * Generate main HTML file
   */
  private static async generateMainHtml(projectName: string, description: string, themeParams: any): Promise<string> {
    const content = themeParams?.content || {}
    const colors = themeParams?.colors || {}
    
    const metaTitle = content?.meta?.title || projectName
    const metaDescription = content?.meta?.description || description
    const metaKeywords = content?.meta?.keywords || 'business, website, professional'
    const companyName = content?.header?.title || projectName
    
    // Generate all sections
    const headerSection = await this.generateHeaderSection(content, themeParams)
    const heroSection = await this.generateHeroSection(content, themeParams)
    const leadMagnetSection = await this.generateLeadMagnetSection(content, themeParams)
    const problemsSection = await this.generateProblemsSection(content, themeParams)
    const productsSection = await this.generateProductsSection(content, themeParams)
    const whyChooseUsSection = await this.generateWhyChooseUsSection(content, themeParams)
    const testimonialsSection = await this.generateTestimonialsSection(content, themeParams)
    const blogSection = await this.generateBlogSection(content, themeParams)
    const footerSection = await this.generateFooterSection(themeParams)
    
    return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metaTitle}</title>
    <meta name="description" content="${metaDescription}">
    <meta name="keywords" content="${metaKeywords}">
    <meta name="author" content="${companyName}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${metaTitle}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:url" content="/">
    <meta property="og:site_name" content="${companyName}">
    <meta property="og:locale" content="vi_VN">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${metaTitle}">
    <meta name="twitter:description" content="${metaDescription}">
    
    <!-- Additional SEO Meta Tags -->
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow">
    <meta name="format-detection" content="telephone=no">
    <meta name="theme-color" content="${colors.primary || '#8B4513'}">
    
    <!-- Favicon -->
    <link rel="icon" href="assets/images/favicon.ico">
    <link rel="apple-touch-icon" href="assets/images/favicon.ico">
    <link rel="manifest" href="manifest.json">
    
    <!-- Preconnect to external resources -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="assets/css/styles.css">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "${companyName}",
      "description": "${metaDescription}",
      "url": "/",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "${content?.footer?.contact?.phone || ''}",
        "email": "${content?.footer?.contact?.email || ''}",
        "contactType": "customer service"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Vietnam",
        "addressCountry": "VN"
      }
    }
    </script>
</head>
<body>
    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="sr-only">Skip to main content</a>
    
    <!-- Header -->
    ${headerSection}
    
    <!-- Main Content -->
    <main id="main-content">
        <!-- Hero Section -->
        ${heroSection}
        
        <!-- Lead Magnet Section -->
        ${leadMagnetSection}
        
        <!-- Problems Section -->
        ${problemsSection}
        
        <!-- Products Section -->
        ${productsSection}
        
        <!-- Why Choose Us Section -->
        ${whyChooseUsSection}
        
        <!-- Testimonials Section -->
        ${testimonialsSection}
        
        <!-- Blog Section -->
        ${blogSection}
    </main>
    
    <!-- Footer -->
    ${footerSection}
    
    <!-- Scripts -->
    <script src="assets/js/scripts.js"></script>
</body>
</html>`
  }

  /**
   * Generate HTML sections using template functions
   */
  private static async generateHeaderSection(content: any, themeParams: any): Promise<string> {
    const { generateStaticHeader } = await import('./html-templates')
    return generateStaticHeader({ content: content?.header, colors: themeParams?.colors, themeParams })
  }

  private static async generateHeroSection(content: any, themeParams: any): Promise<string> {
    const { generateStaticHeroSection } = await import('./html-templates')
    return generateStaticHeroSection({ content: content?.hero, colors: themeParams?.colors, themeParams })
  }


  private static async generateProblemsSection(content: any, themeParams: any): Promise<string> {
    const { generateStaticProblemsSection } = await import('./html-templates')
    return generateStaticProblemsSection({ content: content?.problems, colors: themeParams?.colors, themeParams })
  }

  private static async generateLeadMagnetSection(content: any, themeParams: any): Promise<string> {
    const { generateStaticLeadMagnetSection } = await import('./html-templates')
    return generateStaticLeadMagnetSection({ content: content?.leadMagnet, colors: themeParams?.colors, themeParams })
  }


  private static async generateProductsSection(content: any, themeParams: any): Promise<string> {
    const { generateStaticProductsSection } = await import('./html-templates')
    return generateStaticProductsSection({ content: content?.products, colors: themeParams?.colors, themeParams })
  }

  private static async generateWhyChooseUsSection(content: any, themeParams: any): Promise<string> {
    const { generateStaticWhyChooseUsSection } = await import('./html-templates')
    return generateStaticWhyChooseUsSection({ content: content?.whyChooseUs, colors: themeParams?.colors, themeParams })
  }

  private static async generateTestimonialsSection(content: any, themeParams: any): Promise<string> {
    const { generateStaticTestimonialsSection } = await import('./html-templates')
    return generateStaticTestimonialsSection({ content: content?.testimonials, colors: themeParams?.colors, themeParams })
  }

  private static async generateBlogSection(content: any, themeParams: any): Promise<string> {
    const { generateStaticBlogSection } = await import('./html-templates')
    return generateStaticBlogSection({ content: content?.blog, colors: themeParams?.colors, themeParams })
  }

  private static async generateFooterSection(themeParams: any): Promise<string> {
    const { generateStaticFooter } = await import('./html-templates')
    return generateStaticFooter(themeParams)
  }
}
