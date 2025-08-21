/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import AIContentGenerator from '@/components/ui/ai-content-generator'
import DeployProjectDialog from '@/components/ui/export-project-dialog'
import { useUndoRedo } from '@/hooks/use-undo-redo'
import { ThemeParams } from '@/types'
import {
  ProjectHeader,
  SaveMessage,
  EditorPanel,
  PreviewPanel,
  LoadingSpinner,
  ErrorState,
  TabType
} from '@/components/project-editor'

// Danh sách icon tiêu biểu để chọn (nhẹ, tránh lag) + dùng cho preview
const ICON_MAP: Record<string, string> = {
  Award: 'Award',
  Globe: 'Globe',
  Users: 'Users',
  Shield: 'Shield',
  Clock: 'Clock',
  TrendingUp: 'TrendingUp',
  CheckCircle: 'CheckCircle',
  AlertCircle: 'AlertCircle',
  Truck: 'Truck',
  Package: 'Package',
  Zap: 'Zap',
  Lightbulb: 'Lightbulb',
  Coffee: 'Coffee',
  FileText: 'FileText',
}

const ICON_CHOICES = Object.keys(ICON_MAP) as string[]

interface ProjectData {
  id: string
  name: string
  theme: {
    id: string
    name: string
    description: string
    defaultParams: string
  }
  versions: Array<{
    id: string
    versionNumber: number
    snapshot: unknown
  }>
}

// Create default theme params
const createDefaultThemeParams = (): ThemeParams => ({
  colors: {
    primary: "#8B4513",
    secondary: "#D2691E", 
    accent: "#F4A460",
    background: "#FFFFFF",
    text: "#2D3748"
  },
  typography: {
    fontFamily: "Inter",
    fontSize: "16px",
    headingSize: "2xl",
    bodySize: "base",
    lineHeight: "1.6",
    fontWeight: "400"
  },
  layout: {
    containerWidth: "1200px",
    sectionSpacing: "80px",
    spacing: "comfortable",
    borderRadius: "8px"
  },
  components: {
    button: {
      style: "solid",
      size: "medium",
      rounded: true
    },
    card: {
      shadow: "medium",
      border: true,
      padding: "medium"
    },
    form: {
      style: "default",
      validation: "inline"
    },
    navigation: {
      style: "horizontal",
      sticky: true
    }
  },
  content: {
    meta: {
      title: "Cà Phê Việt Nam - Chất Lượng Quốc Tế",
      description: "Chuyên cung cấp cà phê Việt Nam chất lượng cao cho thị trường quốc tế",
      keywords: "cà phê việt nam, xuất khẩu cà phê, robusta, arabica"
    },
    header: {
      title: "Cà Phê Việt Plus",
      subtitle: "Premium Export Coffee",
      backgroundColor: "#8B4513",
      textColor: "#FFFFFF",
      logo: "/assets/logo.png",
      logoSize: "medium",
      colorMode: "custom",
      primaryColor: "#8B4513",
      navigation: [
        { name: "Trang chủ", href: "#home" },
        { name: "Sản phẩm", href: "#products" },
        { name: "Dịch vụ", href: "#services" },
        { name: "Về chúng tôi", href: "#about" },
        { name: "Liên hệ", href: "#contact" }
      ]
    },
    hero: {
      title: "Cà Phê Việt Nam - Chất Lượng Quốc Tế",
      subtitle: "Xuất khẩu cà phê chất lượng cao",
      description: "Chúng tôi chuyên cung cấp các loại cà phê Việt Nam chất lượng cao cho thị trường quốc tế, đảm bảo hương vị đặc trưng và tiêu chuẩn xuất khẩu.",
      ctaText: "Tìm hiểu thêm",
      ctaSecondaryText: "Liên hệ để được tư vấn",
      image: "/assets/hero-coffee.jpg",
      titleSize: "xl",
      subtitleSize: "xl",
      descriptionSize: "base",
      benefitsSize: "base",
      ctaSize: "base",
      statsSize: "base",
      titleWeight: "bold",
      subtitleWeight: "bold",
      descriptionWeight: "normal",
      benefitsWeight: "medium",
      ctaWeight: "medium",
      statsWeight: "bold",
      titleFont: "inter",
      subtitleFont: "inter",
      descriptionFont: "inter",
      benefitsFont: "inter",
      ctaFont: "inter",
      statsFont: "inter",
      benefits: [
        { icon: "CheckCircle", text: "Chất lượng quốc tế" },
        { icon: "Shield", text: "Đảm bảo xuất khẩu" },
        { icon: "Truck", text: "Giao hàng toàn cầu" }
      ],
      stats: [
        { number: "100+", label: "Khách hàng" },
        { number: "5+", label: "Năm kinh nghiệm" },
        { number: "24/7", label: "Hỗ trợ" }
      ]
    },
    about: {
      title: "Về Chúng Tôi",
      description: "Với hơn 20 năm kinh nghiệm trong ngành cà phê, chúng tôi tự hào là đối tác tin cậy của các nhà nhập khẩu quốc tế.",
      image: "/assets/about-image.jpg",
      features: [
        { icon: "Award", title: "Chứng nhận", description: "ISO 22000, HACCP, FDA" },
        { icon: "Globe", title: "Thị trường", description: "Xuất khẩu 25+ quốc gia" },
        { icon: "Users", title: "Đội ngũ", description: "50+ chuyên gia" }
      ]
    },
    problems: {
      title: "Thách Thức Hiện Tại",
      description: "Những khó khăn mà doanh nghiệp Việt Nam gặp phải",
      backgroundColor: "#FFF8DC",
      textColor: "#2D3748",
      colorMode: "custom",
      primaryColor: "#8B4513",
      titleSize: "2xl",
      descriptionSize: "base",
      titleWeight: "bold",
      descriptionWeight: "normal",
      titleFont: "inter",
      descriptionFont: "inter",
      itemTitleWeight: "semibold",
      itemTitleFont: "inter",
      itemDescriptionSize: "base",
      itemDescriptionFont: "inter",
      items: [
        { id: "1", title: "Khó tiếp cận thị trường Mỹ", description: "Thiếu kết nối...", icon: "AlertCircle" },
        { id: "2", title: "Thủ tục phức tạp", description: "Quy trình xuất khẩu...", icon: "AlertCircle" },
        { id: "3", title: "Giá cả không cạnh tranh", description: "Nhiều khâu trung gian...", icon: "AlertCircle" }
      ]
    },
    solutions: {
      title: "Giải Pháp Của Chúng Tôi",
      description: "Những giải pháp toàn diện để vượt qua thách thức",
      backgroundColor: "#F0F8FF",
      textColor: "#2D3748",
      colorMode: "custom",
      primaryColor: "#8B4513",
      titleSize: "2xl",
      descriptionSize: "base",
      titleWeight: "bold",
      descriptionWeight: "normal",
      titleFont: "inter",
      descriptionFont: "inter",
      itemTitleWeight: "semibold",
      itemTitleFont: "inter",
      itemDescriptionSize: "base",
      itemDescriptionFont: "inter",
      itemBenefitWeight: "medium",
      itemBenefitFont: "inter",
      items: [
        { id: "1", title: "Kết nối trực tiếp", description: "Mạng lưới đối tác...", benefit: "Tăng lợi nhuận 30-40%", icon: "Globe" },
        { id: "2", title: "Hỗ trợ toàn diện", description: "Từ chứng nhận...", benefit: "Tiết kiệm 80% thời gian", icon: "Shield" },
        { id: "3", title: "Quy trình tối ưu", description: "Hệ thống quản lý...", benefit: "Minh bạch 100%", icon: "Zap" }
      ]
    },
    cta: {
      title: "Sẵn sàng bắt đầu hành trình xuất khẩu?",
      description: "Tư vấn miễn phí về quy trình xuất khẩu cà phê sang Mỹ",
      buttonText: "Đăng ký tư vấn miễn phí",
      buttonSecondaryText: "Tải tài liệu mẫu",
      backgroundColor: "#8B4513",
      textColor: "#FFFFFF",
      image: "/assets/cta-image.jpg"
    },
    products: {
      title: "Sản Phẩm Của Chúng Tôi",
      description: "Khám phá các loại cà phê đặc trưng của Việt Nam",
      backgroundColor: "#F0F4F8",
      textColor: "#2D3748",
      colorMode: "custom",
      primaryColor: "#8B4513",
      titleSize: "2xl",
      titleWeight: "bold",
      titleFont: "inter",
      descriptionSize: "base",
      descriptionWeight: "normal",
      descriptionFont: "inter",
      items: [
        {
          id: "1",
          name: "Cà Phê Robusta",
          description: "Cà phê Robusta Việt Nam với hương vị đậm đà, hàm lượng caffeine cao",
          price: "2.50 USD/kg",
          category: "Robusta",
          image: "/assets/product-1.jpg",
          features: ["Hàm lượng caffeine cao", "Hương vị đậm đà", "Giá cả cạnh tranh"]
        },
        {
          id: "2",
          name: "Cà Phê Arabica",
          description: "Cà phê Arabica Tây Nguyên với hương vị tinh tế, chua nhẹ",
          price: "4.20 USD/kg",
          category: "Arabica",
          image: "/assets/product-2.jpg",
          features: ["Hương vị tinh tế", "Chua nhẹ", "Chất lượng cao"]
        },
        {
          id: "3",
          name: "Cà Phê Chồn",
          description: "Cà phê chồn cao cấp với hương vị độc đáo",
          price: "150 USD/kg",
          category: "Premium",
          image: "/assets/product-3.jpg",
          features: ["Hương vị độc đáo", "Chất lượng cao cấp", "Sản lượng giới hạn"]
        }
      ],
      services: [
        { id: "1", name: "Tư vấn xuất khẩu", description: "Hỗ trợ toàn diện quy trình xuất khẩu", icon: "Package", cta: "Tìm hiểu thêm" },
        { id: "2", name: "Logistics", description: "Dịch vụ vận chuyển quốc tế", icon: "Truck", cta: "Tìm hiểu thêm" },
        { id: "3", name: "Chứng nhận", description: "Hỗ trợ chứng nhận chất lượng", icon: "FileText", cta: "Tìm hiểu thêm" },
        { id: "4", name: "Tư vấn thị trường", description: "Phân tích thị trường và xu hướng", icon: "Users", cta: "Tìm hiểu thêm" },
        { id: "5", name: "Bảo hiểm", description: "Bảo hiểm hàng hóa toàn diện", icon: "Shield", cta: "Tìm hiểu thêm" },
        { id: "6", name: "Theo dõi đơn hàng", description: "Hệ thống theo dõi realtime", icon: "TrendingUp", cta: "Tìm hiểu thêm" }
      ]
    },
    footer: {
      companyName: "Cà Phê Việt",
      description: "Chuyên cung cấp cà phê chất lượng cao cho thị trường quốc tế",
      backgroundColor: "#D2691E",
      textColor: "#F9FAFB",
      contact: {
        phone: "+84 123 456 789",
        email: "info@capheviet.com",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        businessHours: "Thứ 2-Thứ 6: 8AM-6PM (EST)"
      },
      quickLinks: [
        { name: "Về Chúng Tôi", href: "#about" },
        { name: "Sản Phẩm", href: "#products" },
        { name: "Dịch Vụ", href: "#services" },
        { name: "Chất Lượng", href: "#quality" },
        { name: "Liên Hệ", href: "#contact" }
      ],
      resources: [
        { name: "Hướng Dẫn", href: "#guide" },
        { name: "Báo Cáo", href: "#reports" },
        { name: "Tài Liệu", href: "#docs" },
        { name: "FAQ", href: "#faq" },
        { name: "Blog", href: "#blog" }
      ],
      legal: [
        { name: "Chính Sách Bảo Mật", href: "#privacy" },
        { name: "Điều Khoản Dịch Vụ", href: "#terms" },
        { name: "Chính Sách Cookie", href: "#cookies" },
        { name: "Tuân Thủ", href: "#compliance" }
      ],
      socialLinks: [
        { icon: "Facebook", href: "#", label: "Facebook" },
        { icon: "Twitter", href: "#", label: "Twitter" },
        { icon: "Linkedin", href: "#", label: "LinkedIn" },
        { icon: "Youtube", href: "#", label: "YouTube" }
      ]
    },
    testimonials: {
      title: "Khách Hàng Nói Gì Về Chúng Tôi",
      subtitle: "Lời chứng thực từ các đối tác và khách hàng quốc tế",
      backgroundColor: "#F5F5DC",
      textColor: "#2D3748",
      colorMode: "custom",
      primaryColor: "#8B4513",
      titleSize: "2xl",
      titleWeight: "bold",
      titleFont: "inter",
      subtitleSize: "lg",
      subtitleWeight: "normal",
      subtitleFont: "inter",
      testimonials: [
        {
          name: "Sarah Johnson",
          title: "Coffee Buyer",
          company: "Starbucks Reserve",
          content: "Chất lượng cà phê Việt Nam vượt trội hơn mong đợi. Hương vị đậm đà và quy trình sản xuất rất chuyên nghiệp.",
          rating: 5,
          image: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face"
        },
        {
          name: "Michael Chen",
          title: "Quality Manager",
          company: "Blue Bottle Coffee",
          content: "Đối tác tin cậy với cam kết chất lượng cao. Giao hàng đúng hạn và dịch vụ khách hàng xuất sắc.",
          rating: 5,
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
        },
        {
          name: "David Rodriguez",
          title: "Import Director",
          company: "Intelligentsia",
          content: "Cà phê Robusta Việt Nam có hương vị độc đáo, phù hợp hoàn hảo cho blend espresso của chúng tôi.",
          rating: 5,
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
        }
      ],
      partners: [
        "Starbucks Reserve", "Blue Bottle Coffee", "Intelligentsia", "Peet's Coffee", "Dunkin'", "Tim Hortons"
      ],
      stats: [
        { number: "500+", label: "Lô hàng xuất khẩu", sublabel: "Chất lượng cao" },
        { number: "200+", label: "Khách hàng tin tưởng", sublabel: "Toàn cầu" },
        { number: "15+", label: "Năm kinh nghiệm", sublabel: "Thị trường" },
        { number: "98%", label: "Tỷ lệ hài lòng", sublabel: "Khách hàng" }
      ]
    },
    leadMagnet: {
      title: "Tải xuống báo cáo thị trường cà phê 2024",
      description: "Phân tích chi tiết xu hướng thị trường, cơ hội kinh doanh và dự báo tương lai của ngành cà phê.",
      backgroundColor: "#F8F9FA",
      textColor: "#2D3748",
      colorMode: "custom",
      primaryColor: "#8B4513",
      titleSize: "2xl",
      titleWeight: "bold",
      titleFont: "inter",
      descriptionSize: "base",
      descriptionWeight: "normal",
      descriptionFont: "inter",
      guideTitle: "Báo cáo thị trường cà phê 2024",
      guideSubtitle: "Dữ liệu cập nhật, phân tích chuyên sâu",
      formTitle: "Nhận báo cáo miễn phí",
      formDescription: "Điền thông tin của bạn để tải xuống báo cáo ngay bây giờ!",
      buttonText: "Tải xuống ngay",
      features: [
        { icon: "FileText", title: "Tài liệu đầy đủ", description: "Mọi biểu mẫu và tài liệu cần thiết" },
        { icon: "TrendingUp", title: "Phân tích thị trường", description: "Dữ liệu thị trường hiện tại" },
        { icon: "Shield", title: "Tiêu chuẩn chất lượng", description: "Yêu cầu chi tiết cho tiêu chuẩn" },
        { icon: "CheckCircle", title: "Quy trình từng bước", description: "Lịch trình rõ ràng từ đầu đến cuối" }
      ],
      trustIndicators: [
        { number: "5,000+", label: "Lượt tải" },
        { number: "92%", label: "Tỷ lệ thành công" },
        { number: "4.9/5", label: "Đánh giá người dùng" }
      ]
    },
    whyChooseUs: {
      title: "Tại sao chọn Cà Phê Việt?",
      subtitle: "Chất lượng, uy tín và sự tận tâm là những giá trị cốt lõi của chúng tôi.",
      backgroundColor: "#FFFFFF",
      textColor: "#2D3748",
      colorMode: "custom",
      primaryColor: "#8B4513",
      titleSize: "2xl",
      titleWeight: "bold",
      titleFont: "inter",
      subtitleSize: "lg",
      subtitleWeight: "normal",
      subtitleFont: "inter",
      strengths: [
        { icon: "Award", title: "Chứng nhận quốc tế", description: "FDA, USDA, ISO" },
        { icon: "Globe", title: "Thị trường toàn cầu", description: "Xuất khẩu đến 25+ quốc gia" },
        { icon: "Users", title: "Đội ngũ chuyên gia", description: "20+ năm kinh nghiệm" },
        { icon: "Shield", title: "Chất lượng đảm bảo", description: "Hệ thống kiểm soát nghiêm ngặt" },
        { icon: "Clock", title: "Giao hàng đúng hạn", description: "Cam kết thời gian" },
        { icon: "TrendingUp", title: "Tăng trưởng bền vững", description: "Phát triển cùng đối tác" }
      ],
      mission: {
        title: "Sứ mệnh",
        description: "Mang giá trị cà phê Việt Nam đến thế giới, tạo giá trị bền vững cho đối tác."
      },
      vision: {
        title: "Tầm nhìn",
        description: "Trở thành đối tác hàng đầu trong lĩnh vực xuất khẩu cà phê, được tin tưởng bởi thị trường quốc tế."
      },
      cta: {
        title: "Bắt đầu hợp tác ngay hôm nay",
        description: "Liên hệ với chúng tôi để được tư vấn miễn phí.",
        buttonText: "Liên hệ ngay"
      }
    },
    blog: {
      title: "Thông Tin Ngành Mới Nhất",
      subtitle: "Cập nhật thông tin với tin tức mới nhất, xu hướng thị trường và chuyên môn về cà phê",
      backgroundColor: "#F8F9FA",
      textColor: "#2D3748",
      colorMode: "custom",
      primaryColor: "#8B4513",
      titleSize: "2xl",
      titleWeight: "bold",
      titleFont: "inter",
      subtitleSize: "lg",
      subtitleWeight: "normal",
      subtitleFont: "inter",
      categories: [
        { name: "Thị trường", count: 15 },
        { name: "Kỹ thuật", count: 12 },
        { name: "Xuất khẩu", count: 8 },
        { name: "Chất lượng", count: 10 }
      ],
      featuredPost: {
        title: "Xu hướng thị trường cà phê 2024",
        excerpt: "Phân tích chi tiết về xu hướng tiêu dùng và cơ hội cho ngành cà phê.",
        author: "Chuyên gia",
        date: "2024-01-15",
        image: "/assets/blog-featured.jpg",
        category: "Thị trường"
      },
      posts: [
        {
          id: "1",
          title: "Hướng dẫn xuất khẩu cà phê",
          excerpt: "Quy trình chi tiết từ chuẩn bị hồ sơ đến giao hàng thành công.",
          author: "Chuyên gia",
          date: "2024-01-10",
          image: "/assets/blog-1.jpg",
          category: "Xuất khẩu"
        },
        {
          id: "2",
          title: "Tiêu chuẩn chất lượng cho cà phê",
          excerpt: "Những yêu cầu cần thiết để đạt tiêu chuẩn quốc tế.",
          author: "Chuyên gia",
          date: "2024-01-08",
          image: "/assets/blog-2.jpg",
          category: "Chất lượng"
        },
        {
          id: "3",
          title: "Kỹ thuật hiện đại cho cà phê",
          excerpt: "Phương pháp hiện đại giúp tăng năng suất và chất lượng.",
          author: "Chuyên gia",
          date: "2024-01-05",
          image: "/assets/blog-3.jpg",
          category: "Kỹ thuật"
        }
      ],
      newsletter: {
        title: "Đăng ký nhận tin tức",
        description: "Nhận thông tin mới nhất về thị trường và cơ hội.",
        placeholder: "Email của bạn",
        buttonText: "Đăng ký"
      }
    }
  }
})

const ProjectEditor = () => {
  const params = useParams()
  const projectId = params.projectId as string
  const [project, setProject] = useState<ProjectData | null>(null)
  const [themeParams, setThemeParams] = useState<ThemeParams | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('colors')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [showDeployDialog, setShowDeployDialog] = useState(false)
  
  // Undo/Redo functionality
  const {
    state: themeParamsWithHistory,
    updateState: updateThemeParamsWithHistory,
    undo,
    redo,
    canUndo,
    canRedo
  } = useUndoRedo<ThemeParams | null>(null)

  // Load project data function
  const loadProject = async () => {
    try {
      console.log('Loading project data for:', projectId)
      const response = await fetch(`/api/projects/${projectId}`)
      const data = await response.json()
      
      if (data.success) {
        console.log('Project loaded successfully:', data.project)
        setProject(data.project)
        
        // Use latest version or create default params
        const latestVersion = data.project.versions[0]
        let params: ThemeParams
        
        if (latestVersion && latestVersion.snapshot) {
          console.log('Using latest version snapshot:', latestVersion)
          params = latestVersion.snapshot as ThemeParams
        } else if (data.project.theme.defaultParams) {
          try {
            const parsedParams = typeof data.project.theme.defaultParams === 'string' 
              ? JSON.parse(data.project.theme.defaultParams) 
              : data.project.theme.defaultParams
            params = { ...createDefaultThemeParams(), ...parsedParams }
          } catch {
            params = createDefaultThemeParams()
          }
        } else {
          params = createDefaultThemeParams()
        }
        
        // Deep merge with default params to ensure all required properties exist
        const defaultParams = createDefaultThemeParams()
        
        params = {
          ...defaultParams,
          ...params,
          colors: { 
            ...defaultParams.colors,
            ...params.colors
          },
          typography: { ...defaultParams.typography, ...params.typography },
          layout: { ...defaultParams.layout, ...params.layout },
          components: { ...defaultParams.components, ...params.components },
          content: {
            ...defaultParams.content,
            ...params.content,
            meta: { ...defaultParams.content?.meta, ...params.content?.meta },
            header: { ...defaultParams.content?.header, ...params.content?.header },
            hero: { ...defaultParams.content?.hero, ...params.content?.hero },
            about: { ...defaultParams.content?.about, ...params.content?.about },
            problems: { 
              ...defaultParams.content?.problems, 
              ...params.content?.problems,
              items: params.content?.problems?.items || defaultParams.content?.problems?.items
            },
            solutions: { 
              ...defaultParams.content?.solutions, 
              ...params.content?.solutions,
              items: params.content?.solutions?.items || defaultParams.content?.solutions?.items
            },
            products: { 
              ...defaultParams.content?.products, 
              ...params.content?.products,
              items: params.content?.products?.items || defaultParams.content?.products?.items
            },
            cta: { ...defaultParams.content?.cta, ...params.content?.cta },
            testimonials: { 
              ...defaultParams.content?.testimonials, 
              ...params.content?.testimonials,
              testimonials: params.content?.testimonials?.testimonials || defaultParams.content?.testimonials?.testimonials,
              partners: params.content?.testimonials?.partners || defaultParams.content?.testimonials?.partners,
              stats: params.content?.testimonials?.stats || defaultParams.content?.testimonials?.stats
            },
            footer: { 
              ...defaultParams.content?.footer, 
              ...params.content?.footer,
              contact: { 
                ...defaultParams.content?.footer?.contact, 
                ...params.content?.footer?.contact 
              }
            }
          }
        }
        
        console.log('Final merged params:', params)
        setThemeParams(params)
        updateThemeParamsWithHistory(params)
      }
    } catch (error) {
      console.error('Error loading project:', error)
      // Fallback to default params
      const defaultParams = createDefaultThemeParams()
      setThemeParams(defaultParams)
      updateThemeParamsWithHistory(defaultParams)
    } finally {
      setLoading(false)
    }
  }

  // Load project data on mount
  useEffect(() => {
    if (projectId) {
      loadProject()
    }
  }, [projectId])

  // Check for updated query param and reload if needed
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const updatedParam = urlParams.get('updated')
    
    if (updatedParam && projectId) {
      console.log('Detected update parameter, reloading project data...')
      // Remove the query param from URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
      // Reload project data
      setTimeout(() => {
        loadProject()
      }, 100)
    }
  }, [projectId])

  // Force reload when page becomes visible (useful when returning from AI)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && projectId) {
        console.log('Page became visible, reloading project data...')
        loadProject()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [projectId])

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !themeParams) return

    const timeoutId = setTimeout(() => {
      saveProject()
    }, 5000) // Auto-save after 5 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [themeParams, autoSaveEnabled])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveProject()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [themeParams])

  const updateThemeParam = (path: string[], value: string | number | unknown) => {
    if (!themeParams) return

    const newParams = { ...themeParams }
    let current: Record<string, unknown> = newParams as Record<string, unknown>
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        if (!isNaN(Number(path[i]))) {
          current[path[i]] = []
        } else {
          current[path[i]] = {}
        }
      }
      
      // Handle case where array element might be a string instead of object
      if (!isNaN(Number(path[i])) && Array.isArray(current[path[i]])) {
        const arrayIndex = Number(path[i])
        const array = current[path[i]] as unknown[]
        
        // If the element at this index is a string, convert it to an object
        if (typeof array[arrayIndex] === 'string') {
          array[arrayIndex] = { name: array[arrayIndex] as string }
        }
        
        // If the element doesn't exist, create a default object
        if (array[arrayIndex] === undefined) {
          array[arrayIndex] = { name: '' }
        }
        
        // Set current to the array element (object) instead of the array itself
        current = array[arrayIndex] as Record<string, unknown>
      } else {
        current = current[path[i]] as Record<string, unknown>
      }
    }
    
    current[path[path.length - 1]] = value
    setThemeParams(newParams)
    updateThemeParamsWithHistory(newParams)
  }

  const saveProject = async () => {
    if (!themeParams) return
    
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeParams })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSaveMessage('✅ Project đã được lưu thành công!')
        setTimeout(() => setSaveMessage(''), 15000)
      } else {
        setSaveMessage(`❌ Lỗi: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving project:', error)
      setSaveMessage('❌ Có lỗi xảy ra khi lưu project')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAIGenerate = (generatedTheme: ThemeParams) => {
    setThemeParams(generatedTheme)
    updateThemeParamsWithHistory(generatedTheme)
    setSaveMessage('✨ Nội dung AI đã được áp dụng thành công!')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!project || !themeParams) {
    return <ErrorState onBack={() => window.history.back()} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ProjectHeader
        projectName={project.name}
        themeName={project.theme.name}
        isPreviewMode={isPreviewMode}
        isSaving={isSaving}
        canUndo={canUndo}
        canRedo={canRedo}
        onBack={() => window.history.back()}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        onSave={saveProject}
        onShowAI={() => setShowAIDialog(true)}
        onShowDeploy={() => setShowDeployDialog(true)}
        onUndo={undo}
        onRedo={redo}
        themeParams={themeParams}
      />

      {/* Save Message */}
      <SaveMessage message={saveMessage} />

      {isPreviewMode ? (
        /* Preview Mode */
        <div className="h-screen overflow-auto">
          <PreviewPanel themeParams={themeParams} />
        </div>
      ) : (
        /* Edit Mode */
        <div className="flex h-screen">
          {/* Left Panel - Editor */}
          <EditorPanel
            activeTab={activeTab}
            themeParams={themeParams}
            onTabChange={setActiveTab}
            updateThemeParam={updateThemeParam}
          />

          {/* Right Panel - Preview */}
          <PreviewPanel themeParams={themeParams} />
        </div>
      )}

      {/* AI Content Generator Dialog */}
      <AIContentGenerator
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        onGenerate={handleAIGenerate}
        currentTheme={themeParams}
      />

      {/* Deploy Project Dialog */}
      <DeployProjectDialog
        open={showDeployDialog}
        onOpenChange={setShowDeployDialog}
        themeParams={themeParams}
        projectId={projectId}
        projectName={project?.name || 'My Project'}
      />
    </div>
  )
}

export default ProjectEditor 