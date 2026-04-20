// VPS Configuration Constants
export const VPS_CONFIG = {
  MAX_CONCURRENT_DEPLOYS: 50,          // Optimized for 16GB RAM
  CLEANUP_INTERVAL: 6 * 60 * 60 * 1000, // 6 hours for 200GB disk
  MAX_DEPLOY_AGE: 14 * 24 * 60 * 60 * 1000, // 14 days retention
  CHUNK_SIZE: 8,                       // Utilize 4 CPU cores (2 chunks per core)
  STREAM_THRESHOLD: 512 * 1024,        // 512KB+ files use streaming (NVMe optimized)
  VPS_SPECS: '4vCPU-16GB-200GB-NVMe'
} as const

// File Paths
export const FILE_PATHS = {
  DEPLOY_BASE: 'public/deploys',
  USER_FOLDER_PREFIX: 'users',
  ASSETS_FOLDER: 'assets',
  CSS_FOLDER: 'assets/css',
  JS_FOLDER: 'assets/js',
  IMAGES_FOLDER: 'assets/images'
} as const

// Template Types
export const TEMPLATE_TYPES = {
  HTML: 'html',
  CSS: 'css',
  JS: 'js',
  SITEMAP: 'sitemap',
  ROBOTS: 'robots',
  MANIFEST: 'manifest',
  README: 'readme',
  DEPLOY_SCRIPT: 'deploy-script'
} as const

// Server Types
export const SERVER_TYPES = {
  NGINX: 'nginx',
  APACHE: 'apache',
  NODE: 'node',
  DOCKER: 'docker'
} as const

// Deploy Script Names
export const DEPLOY_SCRIPT_NAMES = {
  [SERVER_TYPES.NGINX]: 'deploy-nginx.sh',
  [SERVER_TYPES.APACHE]: 'deploy-apache.sh',
  [SERVER_TYPES.NODE]: 'deploy-node.sh',
  [SERVER_TYPES.DOCKER]: 'deploy-docker.sh'
} as const

// Default Content
export const DEFAULT_CONTENT = {
  META_TITLE: 'business, website, professional',
  COMPANY_NAME: 'Cà Phê Việt + Plus',
  COMPANY_SUBTITLE: 'Premium Export Coffee',
  HERO_TITLE: 'Cà Phê Việt Nam - Chất Lượng Quốc Tế',
  HERO_SUBTITLE: 'Xuất khẩu cà phê chất lượng cao',
  HERO_DESCRIPTION: 'Chúng tôi chuyên cung cấp các loại cà phê Việt Nam chất lượng cao cho thị trường quốc tế, đảm bảo hương vị đặc trưng và tiêu chuẩn xuất khẩu.',
  CTA_TEXT: 'Tìm hiểu thêm',
  ABOUT_TITLE: 'Về Chúng Tôi',
  ABOUT_DESCRIPTION: 'Thông tin về công ty và dịch vụ của chúng tôi',
  PROBLEMS_TITLE: 'Thách Thức Hiện Tại',
  SOLUTIONS_TITLE: 'Giải Pháp Của Chúng Tôi',
  PRODUCTS_TITLE: 'Dịch Vụ Xuất Khẩu Toàn Diện',
  TESTIMONIALS_TITLE: 'Khách Hàng Nói Gì Về Chúng Tôi',
  TESTIMONIALS_SUBTITLE: 'Lời chứng thực từ các đối tác và khách hàng quốc tế'
} as const

// Default Services
export const DEFAULT_SERVICES = [
  {
    icon: "☕",
    title: "Cà Phê Chất Lượng Cao",
    description: "Robusta và Arabica từ các vùng đất tốt nhất Việt Nam",
    features: ["Chứng nhận organic", "Rang xay theo yêu cầu", "Đóng gói chuyên nghiệp"]
  },
  {
    icon: "🚚",
    title: "Logistics & Vận Chuyển",
    description: "Dịch vụ vận chuyển toàn cầu an toàn và nhanh chóng",
    features: ["Bảo hiểm hàng hóa", "Theo dõi realtime", "Giao hàng tận nơi"]
  },
  {
    icon: "📋",
    title: "Tư Vấn Thủ Tục",
    description: "Hỗ trợ đầy đủ về giấy tờ và chứng nhận xuất khẩu",
    features: ["Chứng nhận FDA", "Certificate of Origin", "Phytosanitary Certificate"]
  },
  {
    icon: "👥",
    title: "Đào Tạo & Phát Triển",
    description: "Nâng cao năng lực xuất nhập khẩu cho doanh nghiệp",
    features: ["Workshop chuyên sâu", "Mentoring 1-1", "Networking events"]
  },
  {
    icon: "💡",
    title: "Tư Vấn Chiến Lược",
    description: "Lập kế hoạch phát triển thị trường Mỹ bền vững",
    features: ["Market research", "Branding support", "Sales strategy"]
  },
  {
    icon: "🛡️",
    title: "Kiểm Soát Chất Lượng",
    description: "Đảm bảo tiêu chuẩn quốc tế cho từng lô hàng",
    features: ["Lab testing", "Quality certificates", "Traceability system"]
  }
] as const

// Default Testimonials
export const DEFAULT_TESTIMONIALS = [
  {
    id: "1",
    name: "Sarah Johnson",
    position: "Coffee Buyer",
    company: "Starbucks Reserve",
    content: "Chất lượng cà phê Việt Nam vượt trội hơn mong đợi. Hương vị đậm đà và quy trình sản xuất rất chuyên nghiệp.",
    rating: 5,
    avatar: "SJ"
  },
  {
    id: "2",
    name: "Michael Chen",
    position: "Quality Manager",
    company: "Blue Bottle Coffee",
    content: "Đối tác tin cậy với cam kết chất lượng cao. Giao hàng đúng hạn và dịch vụ khách hàng xuất sắc.",
    rating: 5,
    avatar: "MC"
  },
  {
    id: "3",
    name: "David Rodriguez",
    position: "Import Director",
    company: "Intelligentsia",
    content: "Cà phê Robusta Việt Nam có hương vị độc đáo, phù hợp hoàn hảo cho blend espresso của chúng tôi.",
    rating: 5,
    avatar: "DR"
  }
] as const

// Default Stats
export const DEFAULT_STATS = [
  { number: "500+", label: "Lô hàng xuất khẩu" },
  { number: "200+", label: "Khách hàng tin tưởng" },
  { number: "15+", label: "Năm kinh nghiệm" },
  { number: "98%", label: "Tỷ lệ hài lòng" }
] as const
