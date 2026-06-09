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
    timestamp?: number,
    projectId?: string
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
      generateStaticFooter,
      generateStaticProductPage
    } = await import('./html-templates')

    if (fileInfo.type === 'placeholder') {
      return fileInfo.content
    } else if (fileInfo.type === 'template') {
      switch (fileInfo.template) {
        case 'html':
          return this.generateMainHtml(projectName, description, themeParams, projectId)
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
  private static async generateMainHtml(projectName: string, description: string, themeParams: any, projectId?: string): Promise<string> {
    const content = themeParams?.content || {}
    const colors = themeParams?.colors || {}

    const metaTitle = content?.meta?.title || projectName
    const metaDescription = content?.meta?.description || description
    const metaKeywords = content?.meta?.keywords || 'business, website, professional'
    const companyName = content?.header?.title || projectName

    // Generate shell and body sections
    const headerSection = await this.generateHeaderSection(content, themeParams)
    const bodySections = await this.generateBodySections(content, themeParams, projectId)
    const productPageSection = await this.generateProductPageSection(content, themeParams)
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
        ${bodySections}
        
        <!-- Product Page Section (PRO tier only) -->
        ${productPageSection}
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
  private static getDefaultBodySections(): Array<{ id: string; type: string; enabled: boolean; core?: boolean }> {
    return [
      { id: 'hero', type: 'hero', enabled: true, core: true },
      { id: 'problem-solution', type: 'problemSolution', enabled: true, core: true },
      { id: 'lead-magnet', type: 'leadMagnet', enabled: true, core: true },
      { id: 'products', type: 'products', enabled: true, core: true },
      { id: 'why-choose-us', type: 'whyChooseUs', enabled: true, core: true },
      { id: 'testimonials', type: 'testimonials', enabled: true, core: true },
    ]
  }

  private static async generateBodySections(content: any, themeParams: any, projectId?: string): Promise<string> {
    const configuredSections = Array.isArray(content?.sectionOrder) && content.sectionOrder.length > 0
      ? content.sectionOrder
      : this.getDefaultBodySections()

    const renderedSections = await Promise.all(
      configuredSections
        .filter((section: any) => section?.enabled !== false)
        .map((section: any) => this.generateBodySection(section, content, themeParams, projectId))
    )

    return renderedSections.filter(Boolean).join('\n\n')
  }

  private static async generateBodySection(section: any, content: any, themeParams: any, projectId?: string): Promise<string> {
    switch (section?.type) {
      case 'hero':
        return this.generateHeroSection(content, themeParams)
      case 'problemSolution':
        return this.generateProblemsSection(content, themeParams)
      case 'leadMagnet':
        return this.generateLeadMagnetSection(content, themeParams, projectId)
      case 'products':
        return this.generateProductsSection(content, themeParams)
      case 'whyChooseUs':
        return this.generateWhyChooseUsSection(content, themeParams)
      case 'testimonials':
        return this.generateTestimonialsSection(content, themeParams)
      case 'trustBar':
      case 'targetBuyers':
      case 'buyerProblem':
      case 'solutionOverview':
      case 'process':
      case 'proof':
      case 'faq':
      case 'finalCta':
        return this.generateLibrarySection(section, content, themeParams)
      default:
        return ''
    }
  }

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
    return generateStaticProblemsSection({
      content: {
        about: content?.about,
        problems: content?.problems,
        solutions: content?.solutions,
        cta: content?.cta
      },
      colors: themeParams?.colors,
      themeParams
    })
  }

  private static async generateLeadMagnetSection(content: any, themeParams: any, projectId?: string): Promise<string> {
    const { generateStaticLeadMagnetSection } = await import('./html-templates')
    return generateStaticLeadMagnetSection({ content: content?.leadMagnet, colors: themeParams?.colors, themeParams, projectId })
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

  private static async generateFooterSection(themeParams: any): Promise<string> {
    const { generateStaticFooter } = await import('./html-templates')
    return generateStaticFooter(themeParams)
  }

  private static async generateProductPageSection(content: any, themeParams: any): Promise<string> {
    const { generateStaticProductPage } = await import('./html-templates')
    return generateStaticProductPage({ content, themeParams })
  }

  private static async generateLibrarySection(section: any, content: any, themeParams: any): Promise<string> {
    const { generateStaticLibrarySection } = await import('./html-templates')
    const sectionContent = {
      ...(content?.customSections?.[section.id] || {}),
      type: section.type
    }

    return generateStaticLibrarySection({
      type: section.type,
      content: sectionContent,
      themeParams
    })
  }
}
