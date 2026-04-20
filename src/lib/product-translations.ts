// Multilingual translations for product page components
// Supports: Vietnamese, English, Chinese (Simplified), Japanese

export type Language = 'vietnamese' | 'english' | 'chinese' | 'japanese'

export interface Translations {
    // Hero Section
    exportReady: string
    oemAvailable: string
    requestQuote: string
    getFreeCatalog: string
    verifiedManufacturer: string

    // Quick Overview
    quickOverview: string
    productOverview: string

    // Product Features
    productFeatures: string
    featuresAdvantages: string

    // Technical Specs
    technicalSpecs: string
    specifications: string
    customizationOptions: string

    // Applications
    applicationsUseCases: string
    applications: string

    // Certifications
    qualityCertifications: string
    certifications: string
    qcProcess: string
    qualityControlProcess: string

    // OEM Capability
    oemCapabilities: string
    oemOdmCapabilities: string

    // Packaging & Shipping
    packagingShipping: string
    packagingSpecs: string
    shippingMethods: string
    supportedIncoterms: string

    // Why Choose Us
    whyChooseUs: string
    ourStrengths: string
    ourCompetitiveAdvantages: string

    // Lead Magnet
    downloadCatalog: string
    downloadNow: string
    yourName: string
    yourEmail: string
    yourCompany: string
    yourPhone: string
    country: string
    message: string
    submit: string
    getInstantAccess: string

    // RFQ Form
    requestQuotation: string
    getQuote: string
    productInterest: string
    estimatedQuantity: string
    targetPrice: string
    requirements: string
    submitRFQ: string

    // Final CTA
    contactUs: string
    startCooperation: string
    sendInquiry: string

    // Sticky CTA
    quickContact: string
    inquireNow: string

    // Form Labels & Placeholders
    name: string
    nameRequired: string
    email: string
    emailRequired: string
    company: string
    companyRequired: string
    phone: string
    phoneOptional: string
    whatsappPhone: string
    estimatedOrderQuantity: string
    customRequirementsOptional: string

    // Additional
    freeDownload: string
    thirdPartyInspection: string
    responseGuaranteed: string

    // Descriptions & Subtitles
    rfqDescription: string
    leadMagnetDescription: string
    whyChooseUsSubtitle: string
    oemCapabilitySubtitle: string
    certificationsSubtitle: string
    manufacturingFacility: string
    professionalProductionBase: string
    certificationsQualityControl: string
    internationalCertifications: string
    qualityControlProcessTitle: string
    productFeaturesSubtitle: string
    technicalSpecsSubtitle: string
    customizationOptionsTitle: string
    applicationsSubtitle: string
    packagingShippingTitle: string
    packagingShippingSubtitle: string
    packagingDetails: string
    shippingMethodsTitle: string
    supportedIncotermsTitle: string
    itemLabel: string
    detailsLabel: string

    // Benefits
    freeSamplesQualified: string
    customQuotation12to24: string
    directSalesEngineer: string
    completeProductSpecs: string
    technicalDatasheets: string
    factoryCapabilityOverview: string
    priceIndicationMOQ: string
}

export const translations: Record<Language, Translations> = {
    vietnamese: {
        // Hero Section
        exportReady: 'Sẵn sàng Xuất khẩu',
        oemAvailable: 'Cung cấp OEM/ODM',
        requestQuote: 'Yêu cầu Báo giá',
        getFreeCatalog: 'Tải Catalogue Miễn phí',
        verifiedManufacturer: 'Nhà sản xuất Đã xác minh',

        // Quick Overview
        quickOverview: 'Tổng quan Nhanh',
        productOverview: 'Tổng quan Sản phẩm',

        // Product Features
        productFeatures: 'Đặc điểm Sản phẩm',
        featuresAdvantages: 'Tính năng & Ưu điểm',

        // Technical Specs
        technicalSpecs: 'Thông số Kỹ thuật',
        specifications: 'Thông số',
        customizationOptions: 'Tùy chọn Tùy chỉnh',

        // Applications
        applicationsUseCases: 'Ứng dụng & Trường hợp Sử dụng',
        applications: 'Ứng dụng',

        // Certifications
        qualityCertifications: 'Chứng nhận Chất lượng',
        certifications: 'Chứng nhận',
        qcProcess: 'Quy trình Kiểm soát Chất lượng',
        qualityControlProcess: 'Quy trình QC',

        // OEM Capability
        oemCapabilities: 'Năng lực OEM/ODM',
        oemOdmCapabilities: 'Khả năng OEM/ODM',

        // Packaging & Shipping
        packagingShipping: 'Đóng gói & Vận chuyển',
        packagingSpecs: 'Thông số Đóng gói',
        shippingMethods: 'Phương thức Vận chuyển',
        supportedIncoterms: 'Điều khoản Incoterms hỗ trợ',

        // Why Choose Us
        whyChooseUs: 'Tại sao Chọn Chúng tôi',
        ourStrengths: 'Thế mạnh của Chúng tôi',
        ourCompetitiveAdvantages: 'Lợi thế Cạnh tranh',

        // Lead Magnet
        downloadCatalog: 'Tải Xuống Catalogue',
        downloadNow: 'Tải ngay',
        yourName: 'Tên của bạn',
        yourEmail: 'Email của bạn',
        yourCompany: 'Công ty của bạn',
        yourPhone: 'Số điện thoại',
        country: 'Quốc gia',
        message: 'Tin nhắn',
        submit: 'Gửi',
        getInstantAccess: 'Truy cập Ngay',

        // RFQ Form
        requestQuotation: 'Yêu cầu Báo giá',
        getQuote: 'Nhận Báo giá',
        productInterest: 'Sản phẩm quan tâm',
        estimatedQuantity: 'Số lượng dự kiến',
        targetPrice: 'Giá mục tiêu',
        requirements: 'Yêu cầu',
        submitRFQ: 'Gửi Yêu cầu Báo giá',

        // Final CTA
        contactUs: 'Liên hệ với Chúng tôi',
        startCooperation: 'Bắt đầu Hợp tác',
        sendInquiry: 'Gửi Yêu cầu',

        // Sticky CTA
        quickContact: 'Liên hệ Nhanh',
        inquireNow: 'Liên hệ Ngay',

        // Form Labels
        name: 'Tên',
        nameRequired: 'Tên *',
        email: 'Email',
        emailRequired: 'Email *',
        company: 'Công ty',
        companyRequired: 'Công ty *',
        phone: 'Điện thoại',
        phoneOptional: 'Điện thoại',
        whatsappPhone: 'WhatsApp / Điện thoại',
        estimatedOrderQuantity: 'Số lượng Đơn hàng Dự kiến',
        customRequirementsOptional: 'Yêu cầu Tùy chỉnh (Tùy chọn)',

        // Additional
        freeDownload: 'Tải miễn phí',
        thirdPartyInspection: 'Kiểm tra bên thứ ba có sẵn',
        responseGuaranteed: 'Đảm bảo Phản hồi',

        // Descriptions & Subtitles
        rfqDescription: 'Sẵn sàng thảo luận yêu cầu dự án của bạn? Đội ngũ chúng tôi cung cấp báo giá cá nhân hóa dựa trên nhu cầu cụ thể của bạn.',
        leadMagnetDescription: 'Truy cập ngay vào catalogue sản phẩm đầy đủ với thông số chi tiết, bản vẽ kỹ thuật và năng lực nhà máy.',
        whyChooseUsSubtitle: 'Năng lực và thế mạnh nhà máy giúp chúng tôi trở thành đối tác sản xuất đáng tin cậy của bạn',
        oemCapabilitySubtitle: 'Dịch vụ tùy chỉnh toàn diện để đáp ứng yêu cầu thương hiệu và sản phẩm cụ thể của bạn',
        certificationsSubtitle: 'Tiêu chuẩn quốc tế và quy trình chất lượng nghiêm ngặt',
        manufacturingFacility: 'Cơ sở Sản xuất',
        professionalProductionBase: 'Cơ sở sản xuất chuyên nghiệp',
        certificationsQualityControl: 'Chứng nhận & Kiểm soát Chất lượng',
        internationalCertifications: 'Chứng nhận Quốc tế',
        qualityControlProcessTitle: 'Quy trình Kiểm soát Chất lượng',
        productFeaturesSubtitle: 'Ưu điểm sản xuất và chất lượng chính làm nên sự khác biệt của sản phẩm',
        technicalSpecsSubtitle: 'Thông số kỹ thuật và tiêu chuẩn chi tiết',
        customizationOptionsTitle: 'Tùy chọn Tùy chỉnh',
        applicationsSubtitle: 'Các ngành và ứng dụng triển khai sản phẩm thành công',
        packagingShippingTitle: 'Đóng gói & Vận chuyển',
        packagingShippingSubtitle: 'Đóng gói an toàn và tùy chọn giao hàng linh hoạt',
        packagingDetails: 'Chi tiết Đóng gói',
        shippingMethodsTitle: 'Phương thức Vận chuyển',
        supportedIncotermsTitle: 'Điều khoản Incoterms Hỗ trợ',
        itemLabel: 'Mục',
        detailsLabel: 'Chi tiết',

        // Benefits
        freeSamplesQualified: 'Mẫu miễn phí cho khách hàng đủ điều kiện',
        customQuotation12to24: 'Báo giá tùy chỉnh trong 12-24 giờ',
        directSalesEngineer: 'Liên lạc trực tiếp với kỹ sư bán hàng',
        completeProductSpecs: 'Thông số sản phẩm đầy đủ',
        technicalDatasheets: 'Bảng dữ liệu & bản vẽ kỹ thuật',
        factoryCapabilityOverview: 'Tổng quan năng lực nhà máy',
        priceIndicationMOQ: 'Chỉ dẫn giá & chi tiết MOQ',
    },

    english: {
        // Hero Section
        exportReady: 'Export Ready',
        oemAvailable: 'OEM/ODM Available',
        requestQuote: 'Request a Quote',
        getFreeCatalog: 'Get Free Catalog',
        verifiedManufacturer: 'Verified Manufacturer',

        // Quick Overview
        quickOverview: 'Quick Overview',
        productOverview: 'Product Overview',

        // Product Features
        productFeatures: 'Product Features',
        featuresAdvantages: 'Features & Advantages',

        // Technical Specs
        technicalSpecs: 'Technical Specifications',
        specifications: 'Specifications',
        customizationOptions: 'Customization Options',

        // Applications
        applicationsUseCases: 'Applications & Use Cases',
        applications: 'Applications',

        // Certifications
        qualityCertifications: 'Quality Certifications',
        certifications: 'Certifications',
        qcProcess: 'Quality Control Process',
        qualityControlProcess: 'QC Process',

        // OEM Capability
        oemCapabilities: 'OEM/ODM Capabilities',
        oemOdmCapabilities: 'OEM/ODM Capabilities',

        // Packaging & Shipping
        packagingShipping: 'Packaging & Shipping',
        packagingSpecs: 'Packaging Specifications',
        shippingMethods: 'Shipping Methods',
        supportedIncoterms: 'Supported Incoterms',

        // Why Choose Us
        whyChooseUs: 'Why Choose Us',
        ourStrengths: 'Our Strengths',
        ourCompetitiveAdvantages: 'Our Competitive Advantages',

        // Lead Magnet
        downloadCatalog: 'Download Catalog',
        downloadNow: 'Download Now',
        yourName: 'Your Name',
        yourEmail: 'Your Email',
        yourCompany: 'Your Company',
        yourPhone: 'Phone Number',
        country: 'Country',
        message: 'Message',
        submit: 'Submit',
        getInstantAccess: 'Get Instant Access',

        // RFQ Form
        requestQuotation: 'Request for Quotation',
        getQuote: 'Get Quote',
        productInterest: 'Product of Interest',
        estimatedQuantity: 'Estimated Quantity',
        targetPrice: 'Target Price',
        requirements: 'Requirements',
        submitRFQ: 'Submit RFQ',

        // Final CTA
        contactUs: 'Contact Us',
        startCooperation: 'Start Cooperation',
        sendInquiry: 'Send Inquiry',

        // Sticky CTA
        quickContact: 'Quick Contact',
        inquireNow: 'Inquire Now',

        // Form Labels
        name: 'Name',
        nameRequired: 'Name *',
        email: 'Email',
        emailRequired: 'Email *',
        company: 'Company',
        companyRequired: 'Company *',
        phone: 'Phone',
        phoneOptional: 'Phone',
        whatsappPhone: 'WhatsApp / Phone',
        estimatedOrderQuantity: 'Estimated Order Quantity',
        customRequirementsOptional: 'Custom Requirements (Optional)',

        // Additional
        freeDownload: 'Free Download',
        thirdPartyInspection: 'Third-party inspection available',
        responseGuaranteed: 'Response guaranteed',

        // Descriptions & Subtitles
        rfqDescription: 'Ready to discuss your project requirements? Our team provides personalized quotations based on your specific needs.',
        leadMagnetDescription: 'Get instant access to our complete product catalog with detailed specifications, technical drawings, and factory capabilities.',
        whyChooseUsSubtitle: 'Factory strength and capabilities that make us your reliable manufacturing partner',
        oemCapabilitySubtitle: 'Comprehensive customization services to meet your specific brand and product requirements',
        certificationsSubtitle: 'International standards and rigorous quality processes',
        manufacturingFacility: 'Manufacturing Facility',
        professionalProductionBase: 'Professional production base',
        certificationsQualityControl: 'Certifications & Quality Control',
        internationalCertifications: 'International Certifications',
        qualityControlProcessTitle: 'Quality Control Process',
        productFeaturesSubtitle: 'Key manufacturing and quality advantages that set our products apart',
        technicalSpecsSubtitle: 'Detailed product specifications and standards',
        customizationOptionsTitle: 'Customization Options',
        applicationsSubtitle: 'Industries and applications where our products are successfully deployed',
        packagingShippingTitle: 'Packaging & Shipping',
        packagingShippingSubtitle: 'Safe packaging and flexible delivery options',
        packagingDetails: 'Packaging Details',
        shippingMethodsTitle: 'Shipping Methods',
        supportedIncotermsTitle: 'Supported Incoterms',
        itemLabel: 'Item',
        detailsLabel: 'Details',

        // Benefits
        freeSamplesQualified: 'Free samples for qualified buyers',
        customQuotation12to24: 'Custom quotation within 12-24 hours',
        directSalesEngineer: 'Direct communication with sales engineer',
        completeProductSpecs: 'Complete product specifications',
        technicalDatasheets: 'Technical datasheets & drawings',
        factoryCapabilityOverview: 'Factory capability overview',
        priceIndicationMOQ: 'Price indication & MOQ details',
    },

    chinese: {
        // Hero Section
        exportReady: '可出口',
        oemAvailable: '提供OEM/ODM',
        requestQuote: '索取报价',
        getFreeCatalog: '获取免费目录',
        verifiedManufacturer: '认证制造商',

        // Quick Overview
        quickOverview: '快速概览',
        productOverview: '产品概览',

        // Product Features
        productFeatures: '产品特点',
        featuresAdvantages: '特性与优势',

        // Technical Specs
        technicalSpecs: '技术规格',
        specifications: '规格参数',
        customizationOptions: '定制选项',

        // Applications
        applicationsUseCases: '应用与案例',
        applications: '应用领域',

        // Certifications
        qualityCertifications: '质量认证',
        certifications: '认证证书',
        qcProcess: '质量控制流程',
        qualityControlProcess: 'QC流程',

        // OEM Capability
        oemCapabilities: 'OEM/ODM能力',
        oemOdmCapabilities: 'OEM/ODM能力',

        // Packaging & Shipping
        packagingShipping: '包装与运输',
        packagingSpecs: '包装规格',
        shippingMethods: '运输方式',
        supportedIncoterms: '支持的贸易术语',

        // Why Choose Us
        whyChooseUs: '为什么选择我们',
        ourStrengths: '我们的优势',
        ourCompetitiveAdvantages: '我们的竞争优势',

        // Lead Magnet
        downloadCatalog: '下载目录',
        downloadNow: '立即下载',
        yourName: '您的姓名',
        yourEmail: '您的邮箱',
        yourCompany: '您的公司',
        yourPhone: '电话号码',
        country: '国家',
        message: '留言',
        submit: '提交',
        getInstantAccess: '立即访问',

        // RFQ Form
        requestQuotation: '询价申请',
        getQuote: '获取报价',
        productInterest: '感兴趣的产品',
        estimatedQuantity: '预计数量',
        targetPrice: '目标价格',
        requirements: '需求说明',
        submitRFQ: '提交询价',

        // Final CTA
        contactUs: '联系我们',
        startCooperation: '开始合作',
        sendInquiry: '发送询盘',

        // Sticky CTA
        quickContact: '快速联系',
        inquireNow: '立即咨询',

        // Form Labels
        name: '姓名',
        nameRequired: '姓名 *',
        email: '邮箱',
        emailRequired: '邮箱 *',
        company: '公司',
        companyRequired: '公司 *',
        phone: '电话',
        phoneOptional: '电话',
        whatsappPhone: 'WhatsApp / 电话',
        estimatedOrderQuantity: '预计订单数量',
        customRequirementsOptional: '定制需求（可选）',

        // Additional
        freeDownload: '免费下载',
        thirdPartyInspection: '提供第三方检验',
        responseGuaranteed: '保证回复',

        // Descriptions & Subtitles
        rfqDescription: '准备讨论您的项目需求？我们的团队根据您的具体需求提供个性化报价。',
        leadMagnetDescription: '立即获取我们完整的产品目录，包含详细规格、技术图纸和工厂能力。',
        whyChooseUsSubtitle: '工厂实力和能力使我们成为您可靠的制造合作伙伴',
        oemCapabilitySubtitle: '全面的定制服务，满足您特定的品牌和产品要求',
        certificationsSubtitle: '国际标准和严格的质量流程',
        manufacturingFacility: '生产设施',
        professionalProductionBase: '专业生产基地',
        certificationsQualityControl: '认证与质量控制',
        internationalCertifications: '国际认证',
        qualityControlProcessTitle: '质量控制流程',
        productFeaturesSubtitle: '使我们产品脱颖而出的关键制造和质量优势',
        technicalSpecsSubtitle: '详细的产品规格和标准',
        customizationOptionsTitle: '定制选项',
        applicationsSubtitle: '我们产品成功部署的行业和应用',
        packagingShippingTitle: '包装与运输',
        packagingShippingSubtitle: '安全包装和灵活交付选项',
        packagingDetails: '包装详情',
        shippingMethodsTitle: '运输方式',
        supportedIncotermsTitle: '支持的贸易术语',
        itemLabel: '项目',
        detailsLabel: '详情',

        // Benefits
        freeSamplesQualified: '为合格买家提供免费样品',
        customQuotation12to24: '12-24小时内提供定制报价',
        directSalesEngineer: '与销售工程师直接沟通',
        completeProductSpecs: '完整的产品规格',
        technicalDatasheets: '技术数据表和图纸',
        factoryCapabilityOverview: '工厂能力概述',
        priceIndicationMOQ: '价格指示和MOQ详情',
    },

    japanese: {
        // Hero Section
        exportReady: '輸出可能',
        oemAvailable: 'OEM/ODM対応',
        requestQuote: '見積もり依頼',
        getFreeCatalog: '無料カタログ取得',
        verifiedManufacturer: '認証済みメーカー',

        // Quick Overview
        quickOverview: 'クイック概要',
        productOverview: '製品概要',

        // Product Features
        productFeatures: '製品の特徴',
        featuresAdvantages: '特徴と利点',

        // Technical Specs
        technicalSpecs: '技術仕様',
        specifications: '仕様',
        customizationOptions: 'カスタマイズオプション',

        // Applications
        applicationsUseCases: 'アプリケーションと使用例',
        applications: 'アプリケーション',

        // Certifications
        qualityCertifications: '品質認証',
        certifications: '認証',
        qcProcess: '品質管理プロセス',
        qualityControlProcess: 'QCプロセス',

        // OEM Capability
        oemCapabilities: 'OEM/ODM能力',
        oemOdmCapabilities: 'OEM/ODM能力',

        // Packaging & Shipping
        packagingShipping: '包装と配送',
        packagingSpecs: '包装仕様',
        shippingMethods: '配送方法',
        supportedIncoterms: '対応インコタームズ',

        // Why Choose Us
        whyChooseUs: '当社を選ぶ理由',
        ourStrengths: '当社の強み',
        ourCompetitiveAdvantages: '当社の競争優位性',

        // Lead Magnet
        downloadCatalog: 'カタログダウンロード',
        downloadNow: '今すぐダウンロード',
        yourName: 'お名前',
        yourEmail: 'メールアドレス',
        yourCompany: '会社名',
        yourPhone: '電話番号',
        country: '国',
        message: 'メッセージ',
        submit: '送信',
        getInstantAccess: '今すぐアクセス',

        // RFQ Form
        requestQuotation: '見積もり依頼',
        getQuote: '見積もり取得',
        productInterest: '興味のある製品',
        estimatedQuantity: '推定数量',
        targetPrice: '目標価格',
        requirements: '要件',
        submitRFQ: '見積もりを送信',

        // Final CTA
        contactUs: 'お問い合わせ',
        startCooperation: '協力開始',
        sendInquiry: 'お問い合わせ送信',

        // Sticky CTA
        quickContact: 'クイック連絡',
        inquireNow: '今すぐお問い合わせ',

        // Form Labels
        name: '名前',
        nameRequired: '名前 *',
        email: 'メール',
        emailRequired: 'メール *',
        company: '会社',
        companyRequired: '会社 *',
        phone: '電話',
        phoneOptional: '電話',
        whatsappPhone: 'WhatsApp / 電話',
        estimatedOrderQuantity: '推定注文数量',
        customRequirementsOptional: 'カスタム要件（オプション）',

        // Additional
        freeDownload: '無料ダウンロード',
        thirdPartyInspection: '第三者検査が可能',
        responseGuaranteed: '回答保証',

        // Descriptions & Subtitles
        rfqDescription: 'プロジェクト要件について話し合う準備はできていますか？当社のチームは、お客様の特定のニーズに基づいてパーソナライズされた見積もりを提供します。',
        leadMagnetDescription: '詳細な仕様、技術図面、工場能力を含む完全な製品カタログに即座にアクセスできます。',
        whyChooseUsSubtitle: '当社を信頼できる製造パートナーにする工場の強みと能力',
        oemCapabilitySubtitle: 'お客様の特定のブランドと製品要件を満たす包括的なカスタマイズサービス',
        certificationsSubtitle: '国際基準と厳格な品質プロセス',
        manufacturingFacility: '製造施設',
        professionalProductionBase: 'プロフェッショナルな生産拠点',
        certificationsQualityControl: '認証と品質管理',
        internationalCertifications: '国際認証',
        qualityControlProcessTitle: '品質管理プロセス',
        productFeaturesSubtitle: '当社製品を際立たせる主要な製造と品質の優位性',
        technicalSpecsSubtitle: '詳細な製品仕様と基準',
        customizationOptionsTitle: 'カスタマイズオプション',
        applicationsSubtitle: '当社製品が成功裏に展開されている業界とアプリケーション',
        packagingShippingTitle: '包装と配送',
        packagingShippingSubtitle: '安全な包装と柔軟な配送オプション',
        packagingDetails: '包装の詳細',
        shippingMethodsTitle: '配送方法',
        supportedIncotermsTitle: '対応インコタームズ',
        itemLabel: '項目',
        detailsLabel: '詳細',

        // Benefits
        freeSamplesQualified: '適格なバイヤー向けの無料サンプル',
        customQuotation12to24: '12〜24時間以内のカスタム見積もり',
        directSalesEngineer: '営業エンジニアとの直接コミュニケーション',
        completeProductSpecs: '完全な製品仕様',
        technicalDatasheets: '技術データシートと図面',
        factoryCapabilityOverview: '工場能力の概要',
        priceIndicationMOQ: '価格目安とMOQの詳細',
    },
}

// Helper function to get translation
export const getTranslation = (language: Language = 'vietnamese'): Translations => {
    return translations[language] || translations.vietnamese
}
