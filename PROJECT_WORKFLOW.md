# Project Creation and Editor Workflow

## Tổng quan

Hệ thống này cung cấp một nền tảng tạo và chỉnh sửa website với AI tích hợp, cho phép người dùng:
- Tạo project từ theme có sẵn
- Chỉnh sửa nội dung và thiết kế bằng editor trực quan
- Sử dụng AI để tạo nội dung tự động
- Tích hợp hình ảnh từ Unsplash
- Xuất project thành file hoàn chỉnh

## 1. Luồng Tạo Project

### 1.1 Bước 1: Chọn Theme
**File:** `src/app/templates/page.tsx`

```typescript
// Người dùng browse danh sách themes có sẵn
const themes = [
  {
    id: 'vietnam-coffee',
    name: 'Vietnam Coffee Export',
    description: 'Theme chuyên biệt cho xuất khẩu cà phê'
    // ... other properties
  }
]
```

**Tính năng:**
- Hiển thị preview theme với Unsplash images
- Loading states khi fetch hình ảnh
- Error handling cho việc load themes
- Toast notifications cho UX tốt hơn

### 1.2 Bước 2: Tạo Project
**API:** `POST /api/projects`
**File:** `src/app/api/projects/route.ts`

```typescript
export async function POST(request: NextRequest) {
  // 1. Validate user session
  const session = await getServerSession(authOptions)
  
  // 2. Parse và validate input
  const { name, themeId } = await withTimeout(request.json(), 5000)
  
  // 3. Kiểm tra theme tồn tại
  const theme = await prisma.theme.findUnique({ where: { id: themeId } })
  
  // 4. Tạo project mới
  const project = await withTimeout(
    prisma.project.create({
      data: {
        name,
        themeId,
        userId: session.user.id,
        status: 'EDITING'
      }
    }),
    10000
  )
  
  // 5. Tạo version đầu tiên với default params
  await prisma.projectVersion.create({
    data: {
      projectId: project.id,
      versionNumber: 1,
      snapshot: theme.defaultParams
    }
  })
}
```

**Error Handling:**
- Timeout cho database operations (8-10s)
- Input validation
- Standardized error responses
- User-friendly error messages

### 1.3 Bước 3: Redirect đến Editor
Sau khi tạo thành công, user được redirect đến:
```
/project/[projectId]
```

## 2. Luồng Editor Project

### 2.1 Architecture Overview
**File:** `src/app/project/[projectId]/page.tsx`

```typescript
interface ProjectData {
  id: string
  name: string
  theme: Theme
  versions: ProjectVersion[]
}

interface ThemeParams {
  colors: ThemeColors
  typography: ThemeTypography
  layout: ThemeLayout
  components: ThemeComponents
  content: ThemeContent
}
```

### 2.2 Data Loading Process

```typescript
const loadProject = async () => {
  try {
    // 1. Fetch project data
    const response = await fetch(`/api/projects/${projectId}`)
    const { project } = await response.json()
    
    // 2. Load latest version hoặc default params
    let themeParams
    if (project.versions?.length > 0) {
      const latestVersion = project.versions[project.versions.length - 1]
      themeParams = latestVersion.snapshot
    } else {
      themeParams = project.theme.defaultParams
    }
    
    // 3. Initialize editor state
    setProject(project)
    setThemeParams(themeParams)
    updateThemeParamsWithHistory(themeParams)
    
  } catch (error) {
    // Error handling with toast notifications
    toast.error('Không thể tải project')
  }
}
```

### 2.3 Editor Features

#### 2.3.1 Real-time Preview
```typescript
// Split view: Editor bên trái, Preview bên phải
<div className="flex h-screen">
  {/* Left Panel - Editor */}
  <div className="w-1/3 bg-white">
    {/* Tab navigation */}
    <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />
    
    {/* Content editors */}
    {activeTab === 'colors' && <ColorEditor />}
    {activeTab === 'typography' && <TypographyEditor />}
    {activeTab === 'content' && <ContentEditor />}
  </div>
  
  {/* Right Panel - Live Preview */}
  <div className="flex-1">
    <VietnamCoffeeTheme 
      theme={themeParams} 
      onContentUpdate={handleContentUpdate}
    />
  </div>
</div>
```

#### 2.3.2 Undo/Redo System
```typescript
const {
  state: themeParamsWithHistory,
  updateState: updateThemeParamsWithHistory,
  undo,
  redo,
  canUndo,
  canRedo
} = useUndoRedo<ThemeParams | null>(null)

// Keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey)) {
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if (e.key === 'z' && e.shiftKey || e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }
  }
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [undo, redo])
```

#### 2.3.3 Auto-save Functionality
```typescript
useEffect(() => {
  if (!autoSaveEnabled || !themeParams) return

  const timeoutId = setTimeout(() => {
    saveProject()
  }, 5000) // Auto-save sau 5 giây không activity

  return () => clearTimeout(timeoutId)
}, [themeParams, autoSaveEnabled])
```

### 2.4 Content Management System

#### 2.4.1 Dynamic Content Updates
```typescript
const updateThemeParam = (path: string[], value: string | number) => {
  const newParams = { ...themeParams }
  let current = newParams
  
  // Navigate to nested property
  for (let i = 0; i < path.length - 1; i++) {
    if (!current[path[i]]) {
      current[path[i]] = !isNaN(Number(path[i])) ? [] : {}
    }
    current = current[path[i]]
  }
  
  // Update value
  current[path[path.length - 1]] = value
  setThemeParams(newParams)
  updateThemeParamsWithHistory(newParams)
}
```

#### 2.4.2 Content Tabs Structure
```typescript
const editorTabs = [
  {
    id: 'colors',
    label: 'Màu sắc',
    icon: Palette,
    sections: ['primary', 'secondary', 'accent', 'background', 'text']
  },
  {
    id: 'typography',
    label: 'Typography',
    icon: Type,
    sections: ['fontFamily', 'fontSize', 'lineHeight', 'fontWeight']
  },
  {
    id: 'layout',
    label: 'Bố cục',
    icon: Layout,
    sections: ['containerWidth', 'spacing', 'borderRadius']
  },
  {
    id: 'content',
    label: 'Nội dung',
    icon: FileText,
    sections: ['hero', 'about', 'products', 'footer']
  }
]
```

## 3. AI Content Generation

### 3.1 AI Integration Flow
**API:** `POST /api/generate-theme`
**File:** `src/app/api/generate-theme/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const { businessInfo, currentTheme } = await request.json()
  
  // 1. Validate business information
  if (!businessInfo?.companyName || !businessInfo?.industry) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  
  // 2. Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  
  // 3. Generate content with retry logic
  let retryCount = 0
  const maxRetries = 3
  
  while (retryCount < maxRetries) {
    try {
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      break
    } catch (aiError) {
      retryCount++
      if (retryCount >= maxRetries) {
        // Handle different AI error types
        if (error?.status === 503) {
          return NextResponse.json({
            error: 'Dịch vụ AI đang quá tải',
            retryAfter: 300
          }, { status: 503 })
        }
      }
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, retryCount) * 1000)
      )
    }
  }
  
  // 4. Parse và merge với current theme
  const generatedData = JSON.parse(cleanedText)
  const themeParams = {
    ...currentTheme,
    colors: { ...currentTheme?.colors, ...generatedData.colors },
    content: { ...currentTheme?.content, ...generatedData.content }
  }
  
  return NextResponse.json({ success: true, themeParams })
}
```

### 3.2 AI Prompt Engineering
```typescript
const prompt = `
Bạn là chuyên gia thiết kế website và branding. Tạo nội dung cho:

THÔNG TIN DOANH NGHIỆP:
- Tên: ${businessInfo.companyName}
- Ngành: ${businessInfo.industry}
- Mô tả: ${businessInfo.description}
- Khách hàng: ${businessInfo.targetAudience}
- Tông giọng: ${businessInfo.tone}

YÊU CẦU:
1. Tạo bảng màu phù hợp với ngành nghề
2. Viết nội dung cho các sections
3. Đảm bảo chuyên nghiệp và phù hợp

RESPONSE FORMAT: JSON với structure cụ thể...
`
```

## 4. Unsplash Integration

### 4.1 Image Management System
**File:** `src/lib/unsplash.ts`

```typescript
// Cache mechanism for performance
const imageCache = new Map<string, string>()

export const getThemePhoto = async (themeName: string) => {
  // Check cache first
  if (imageCache.has(themeName)) {
    return imageCache.get(themeName)
  }
  
  try {
    const result = await unsplash.search.getPhotos({
      query: `${themeName} business coffee export`,
      page: 1,
      perPage: 1,
      orientation: 'landscape'
    })
    
    const imageUrl = result.response?.results[0]?.urls?.regular
    
    // Cache the result
    if (imageUrl) {
      imageCache.set(themeName, imageUrl)
    }
    
    return imageUrl
  } catch (error) {
    console.error('Unsplash API error:', error)
    return null
  }
}
```

### 4.2 Automatic URL Persistence
**File:** `src/components/themes/vietnam-coffee/HeroSection.tsx`

```typescript
const HeroSection = ({ theme, content, onContentUpdate }) => {
  const { imageUrl: unsplashImageUrl, isLoading } = useHeroImage()
  
  // Auto-save Unsplash URL when fetched
  useEffect(() => {
    if (unsplashImageUrl && unsplashImageUrl !== content.unsplashImageUrl) {
      const updatedContent = {
        ...content,
        unsplashImageUrl,
        backgroundImage: unsplashImageUrl
      }
      
      // Update UI immediately
      onContentUpdate?.(updatedContent)
      
      // Save to database
      saveUnsplashUrl(projectId, unsplashImageUrl)
    }
  }, [unsplashImageUrl, content.unsplashImageUrl])
  
  // Image priority: saved Unsplash > new Unsplash > user upload > fallback
  const backgroundImageUrl = content.unsplashImageUrl || 
                             unsplashImageUrl || 
                             content.backgroundImage ||
                             content.image
}
```

## 5. Data Persistence

### 5.1 Project Version System
```typescript
// Mỗi lần save tạo version mới
const saveProject = async () => {
  const latestVersion = await prisma.projectVersion.findFirst({
    where: { projectId },
    orderBy: { versionNumber: 'desc' }
  })
  
  const newVersionNumber = (latestVersion?.versionNumber || 0) + 1
  
  await prisma.projectVersion.create({
    data: {
      projectId,
      versionNumber: newVersionNumber,
      snapshot: themeParams // Toàn bộ state được save
    }
  })
}
```

### 5.2 Database Schema
```prisma
model Project {
  id        String   @id @default(cuid())
  userId    String
  themeId   String
  name      String
  status    ProjectStatus @default(EDITING)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  versions  ProjectVersion[]
  theme     Theme    @relation(fields: [themeId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}

model ProjectVersion {
  id            String   @id @default(cuid())
  projectId     String
  versionNumber Int
  snapshot      Json     // ThemeParams được store dưới dạng JSON
  createdAt     DateTime @default(now())
  project       Project  @relation(fields: [projectId], references: [id])
}
```

## 6. Error Handling Strategy

### 6.1 Layered Error System
```typescript
// 1. API Level - Standardized responses
const createErrorResponse = (error: AppError) => ({
  success: false,
  error: getUserFriendlyMessage(error),
  errorType: getErrorType(error),
  details: process.env.NODE_ENV === 'development' ? error.message : undefined
})

// 2. Component Level - Toast notifications
const { toast } = useToast()
try {
  await saveProject()
  toast.success('Project đã được lưu thành công!')
} catch (error) {
  toast.error('Có lỗi xảy ra khi lưu project')
}

// 3. Global Level - Error boundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <ProjectEditor />
</ErrorBoundary>
```

### 6.2 Retry Logic & Timeouts
```typescript
// Database operations với timeout
const withTimeout = async (operation: Promise<any>, ms: number) => {
  return Promise.race([
    operation,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operation timeout')), ms)
    )
  ])
}

// AI operations với retry
const withRetry = async (operation: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
}
```

## 7. Performance Optimizations

### 7.1 Image Loading Strategy
```typescript
// 1. Progressive loading với loading states
const ProductImage = ({ productName }) => {
  const { imageUrl, isLoading, error } = useProductImage(productName)
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <FallbackImage />
  
  return (
    <Image
      src={imageUrl}
      alt={productName}
      loading="lazy"
      quality={75}
    />
  )
}

// 2. Next.js Image optimization
<Image
  src={backgroundImageUrl}
  alt="Hero background"
  fill
  sizes="100vw"
  priority // For above-the-fold images
  quality={75}
/>
```

### 7.2 State Management
```typescript
// 1. Debounced auto-save
const debouncedSave = useCallback(
  debounce(() => saveProject(), 5000),
  [themeParams]
)

// 2. Optimistic updates
const updateThemeParam = (path: string[], value: any) => {
  // Update UI immediately
  setThemeParams(newParams)
  
  // Save in background
  debouncedSave()
}
```

## 8. Development Guidelines

### 8.1 Code Organization
```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── projects/        # Project CRUD
│   │   ├── generate-theme/  # AI integration
│   │   └── unsplash/        # Image API
│   ├── project/[id]/        # Project editor
│   └── templates/           # Theme selection
├── components/
│   ├── themes/              # Theme components
│   └── ui/                  # Reusable UI
├── hooks/                   # Custom hooks
├── lib/                     # Utilities
└── types/                   # TypeScript types
```

### 8.2 Testing Strategy
```typescript
// 1. Unit tests cho utility functions
describe('updateThemeParam', () => {
  it('should update nested properties correctly', () => {
    const result = updateThemeParam(
      mockTheme, 
      ['content', 'hero', 'title'], 
      'New Title'
    )
    expect(result.content.hero.title).toBe('New Title')
  })
})

// 2. Integration tests cho API endpoints
describe('/api/projects', () => {
  it('should create project with valid data', async () => {
    const response = await POST(mockRequest)
    expect(response.status).toBe(200)
  })
})
```

## 9. Deployment Considerations

### 9.1 Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# AI Integration
GOOGLE_GEMINI_API_KEY=your_key_here

# Image Service
UNSPLASH_ACCESS_KEY=your_key_here

# Authentication
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

### 9.2 Performance Monitoring
```typescript
// Add performance tracking
const saveProject = async () => {
  const startTime = performance.now()
  try {
    await actualSaveOperation()
    const duration = performance.now() - startTime
    console.log(`Save operation took ${duration}ms`)
  } catch (error) {
    // Log error với context
    logError('Project save failed', { projectId, error })
  }
}
```

---

## Kết luận

Hệ thống này cung cấp một workflow hoàn chỉnh từ việc tạo project đến chỉnh sửa chi tiết với:
- **Real-time preview** cho trải nghiệm tốt
- **AI integration** để tự động hóa content creation
- **Robust error handling** cho stability
- **Performance optimizations** cho UX mượt mà
- **Comprehensive data persistence** cho reliability

Mỗi component được thiết kế modular và có thể mở rộng, đảm bảo maintainability lâu dài. 