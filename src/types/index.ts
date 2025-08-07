// Database types - will be properly typed after Prisma client generation
export interface User {
  id: string
  email: string
  passwordHash: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  bankTxnId: string | null
  paidAt: Date | null
  createdAt: Date
}

export interface Theme {
  id: string
  name: string
  description: string | null
  previewUrl: string | null
  defaultParams: Record<string, unknown>
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  userId: string
  themeId: string
  name: string
  status: 'EDITING' | 'ARCHIVED'
  createdAt: Date
  updatedAt: Date
}

export interface ProjectVersion {
  id: string
  projectId: string
  versionNumber: number
  snapshot: Record<string, unknown>
  createdAt: Date
}

export interface Export {
  id: string
  projectVersionId: string
  repoUrl: string | null
  zipPath: string | null
  buildStatus: 'PENDING' | 'BUILDING' | 'SUCCESS' | 'FAILED'
  createdAt: Date
}

// Database types with relations
export type UserWithPayments = User & {
  payments: Payment[]
}

export type ProjectWithDetails = Project & {
  theme: Theme
  versions: ProjectVersion[]
  user: User
}

export type ProjectVersionWithDetails = ProjectVersion & {
  project: ProjectWithDetails
  exports: Export[]
}

// Theme configuration types
export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  success?: string
  warning?: string
  error?: string
  border?: string
  muted?: string
  destructive?: string
}

export interface ThemeTypography {
  fontFamily: string
  fontSize: string
  headingSize: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
  bodySize: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  lineHeight: string
  fontWeight: string
}

export interface ThemeLayout {
  containerWidth: string
  sectionSpacing: string
  spacing: 'minimal' | 'comfortable' | 'spacious'
  borderRadius: string
  gridColumns?: number
  maxWidth?: string
  containerPadding?: string
  itemGap?: string
  maxContentWidth?: string
  headerHeight?: string
  footerPadding?: string
}

export interface ThemeComponents {
  button: {
    style: 'solid' | 'outline' | 'ghost' | 'gradient'
    size: 'small' | 'medium' | 'large'
    rounded?: boolean
  }
  card: {
    shadow: 'none' | 'small' | 'medium' | 'large'
    border: boolean
    padding?: 'small' | 'medium' | 'large'
  }
  form: {
    style?: 'default' | 'minimal' | 'modern'
    validation?: 'inline' | 'below'
  }
  navigation: {
    style?: 'horizontal' | 'vertical' | 'sidebar'
    sticky?: boolean
  }
}

export interface ThemeSections {
  header?: {
    backgroundColor?: string
    textColor?: string
    sticky?: boolean
  }
  hero?: {
    backgroundColor?: string
    textColor?: string
    backgroundImage?: string
    overlayColor?: string
  }
  about?: {
    backgroundColor?: string
    textColor?: string
  }
  problems?: {
    backgroundColor?: string
    textColor?: string
  }
  solutions?: {
    backgroundColor?: string
    textColor?: string
  }
  products?: {
    backgroundColor?: string
    textColor?: string
  }
  testimonials?: {
    backgroundColor?: string
    textColor?: string
  }
  cta?: {
    backgroundColor?: string
    textColor?: string
  }
  footer?: {
    backgroundColor?: string
    textColor?: string
  }
}

export interface ThemeContent {
  // Meta/SEO
  meta?: {
    title?: string
    description?: string
    keywords?: string
    favicon?: string
    analyticsId?: string
    customHeadScripts?: string
    customBodyScripts?: string
  }
  
  // Header
  header?: {
    logo?: string
    title?: string
    subtitle?: string
    backgroundColor?: string
    textColor?: string
    navigation?: Array<{
      name: string
      href: string
    }>
    contactInfo?: {
      phone?: string
      email?: string
    }
    socialLinks?: Array<{
      platform: string
      url: string
      icon?: string
    }>
  }
  
  // Hero
  hero?: {
    title?: string
    subtitle?: string
    description?: string
    ctaText?: string
    ctaSecondaryText?: string
    image?: string
    backgroundImage?: string
    unsplashImageUrl?: string // Add Unsplash URL field
    overlayOpacity?: number
    overlayColor?: string
    backgroundColor?: string
    textColor?: string
    benefits?: Array<{
      icon: string
      text: string
    }>
    stats?: Array<{
      number: string
      label: string
    }>
    trustIndicators?: Array<{
      number: string
      label: string
    }>
  }
  
  // About
  about?: {
    title?: string
    description?: string
    image?: string
    backgroundColor?: string
    textColor?: string
    features?: Array<{
      icon: string
      title: string
      description: string
    }>
  }
  
  // Problems
  problems?: {
    title?: string
    description?: string
    backgroundColor?: string
    textColor?: string
    items?: Array<{
      id: string
      title: string
      description: string
      icon: string
    }>
  }
  
  // Solutions
  solutions?: {
    title?: string
    description?: string
    backgroundColor?: string
    textColor?: string
    items?: Array<{
      id: string
      title: string
      description: string
      benefit: string
      icon: string
    }>
  }
  
  // CTA
  cta?: {
    title?: string
    description?: string
    buttonText?: string
    buttonSecondaryText?: string
    backgroundColor?: string
    textColor?: string
    image?: string
  }
  
  // Products
  products?: {
    title?: string
    description?: string
    backgroundColor?: string
    textColor?: string
    items?: Array<{
      id?: string
      name: string
      description: string
      price?: string
      category?: string
      image?: string
      features?: Array<string>
    }>
    services?: Array<{
      id: string
      name: string
      description: string
      icon: string
      cta: string
    }>
  }
  
  // Testimonials
  testimonials?: {
    title?: string
    subtitle?: string
    backgroundColor?: string
    textColor?: string
    testimonials?: Array<{
      id?: string
      name: string
      title: string
      company: string
      content: string
      image?: string
      rating?: number
    }>
    partners?: Array<string>
    stats?: Array<{
      number: string
      label: string
      sublabel?: string
    }>
  }
  
  // Footer
  footer?: {
    logo?: string
    companyName?: string
    description?: string
    backgroundColor?: string
    textColor?: string
    quickLinks?: Array<{
      name: string
      href: string
    }>
    resources?: Array<{
      name: string
      href: string
    }>
    contact?: {
      phone?: string
      email?: string
      address?: string
      businessHours?: string
    }
    socialLinks?: Array<{
      icon: string
      href: string
      label: string
    }>
    legal?: Array<{
      name: string
      href: string
    }>
  }

  // Lead Magnet
  leadMagnet?: {
    title?: string
    description?: string
    backgroundColor?: string
    textColor?: string
    guideTitle?: string
    guideSubtitle?: string
    formTitle?: string
    formDescription?: string
    buttonText?: string
    features?: Array<{
      icon: string
      title: string
      description: string
    }>
    trustIndicators?: Array<{
      number: string
      label: string
    }>
  }

  // Why Choose Us
  whyChooseUs?: {
    title?: string
    subtitle?: string
    backgroundColor?: string
    textColor?: string
    strengths?: Array<{
      icon: string
      title: string
      description: string
    }>
    mission?: {
      title: string
      description: string
    }
    vision?: {
      title: string
      description: string
    }
    cta?: {
      title: string
      description: string
      buttonText: string
    }
  }

  // Blog
  blog?: {
    title?: string
    subtitle?: string
    backgroundColor?: string
    textColor?: string
    categories?: Array<{
      name: string
      count: number
    }>
    featuredPost?: {
      title: string
      excerpt: string
      author: string
      date: string
      image: string
      category: string
    }
    posts?: Array<{
      id: string
      title: string
      excerpt: string
      author: string
      date: string
      image: string
      category: string
    }>
    newsletter?: {
      title: string
      description: string
      placeholder: string
      buttonText: string
    }
  }
}

export interface ThemeParams {
  colors: ThemeColors
  typography: ThemeTypography
  layout: ThemeLayout
  components: ThemeComponents
  sections?: ThemeSections
  content?: ThemeContent
  custom?: Record<string, unknown>
}

// Editor state types
export interface EditorState {
  selectedComponent: string | null
  selectedProperty: string | null
  isPreviewMode: boolean
  isDirty: boolean
  lastSaved: Date | null
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Payment types
export interface PaymentIntent {
  amount: number
  currency: string
  description?: string
  metadata?: Record<string, string>
}

export interface BankPaymentResponse {
  transactionId: string
  status: 'pending' | 'success' | 'failed'
  redirectUrl?: string
  qrCode?: string
}

// Export types
export interface ExportOptions {
  format: 'zip' | 'git'
  includeAssets: boolean
  framework: 'react' | 'next' | 'vue' | 'angular'
  typescript: boolean
  cssFramework: 'tailwind' | 'styled-components' | 'emotion' | 'css-modules'
}

export interface ExportResult {
  downloadUrl?: string
  repoUrl?: string
  status: 'pending' | 'building' | 'success' | 'failed'
  buildLogs?: string[]
}

// Form validation types
export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  name: string
  acceptTerms: boolean
}

export interface ProjectForm {
  name: string
  themeId: string
  description?: string
}

// Component props types
export interface ThemePreviewProps {
  theme: ThemeParams
  className?: string
  interactive?: boolean
}

export interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  disabled?: boolean
}

export interface PropertyEditorProps {
  property: string
  value: unknown
  onChange: (value: unknown) => void
  type: 'color' | 'text' | 'number' | 'select' | 'toggle'
  options?: Array<{ label: string; value: unknown }>
}

// Navigation types
export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType
  children?: NavItem[]
  requiresAuth?: boolean
  requiresPaid?: boolean
}

// Notification types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  actions?: Array<{
    label: string
    action: () => void
  }>
}

// Search and filter types
export interface SearchFilters {
  query?: string
  category?: string
  tags?: string[]
  createdBy?: string
  dateRange?: {
    from: Date
    to: Date
  }
}

// Pagination types
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Override<T, R> = Omit<T, keyof R> & R 