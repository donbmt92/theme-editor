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
}

export interface ThemeTypography {
  fontFamily: string
  headingSize: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
  bodySize: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  lineHeight?: 'tight' | 'normal' | 'relaxed'
  fontWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
}

export interface ThemeLayout {
  containerWidth: string
  spacing: 'minimal' | 'comfortable' | 'spacious'
  borderRadius: 'none' | 'small' | 'medium' | 'large'
  gridColumns?: number
  maxWidth?: string
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

export interface ThemeParams {
  colors: ThemeColors
  typography: ThemeTypography
  layout: ThemeLayout
  components: ThemeComponents
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