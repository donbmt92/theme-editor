# 🔄 Quy Trình Tạo Project đến Export - Theme Editor

## 📋 Tổng Quan Quy Trình

Quy trình từ tạo project đến export trong Theme Editor bao gồm 6 bước chính:

1. **Authentication & Access** - Xác thực và kiểm tra quyền truy cập
2. **Template Selection** - Chọn template và tạo project
3. **Project Creation** - Tạo project mới trong database
4. **Theme Editing** - Chỉnh sửa theme với editor
5. **AI Content Generation** - Tạo nội dung tự động (optional)
6. **Export & Download** - Xuất project và tải về

---

## 🔐 Bước 1: Authentication & Access

### 1.1 Đăng nhập/Đăng ký
```typescript
// src/app/auth/signin/page.tsx
// src/app/auth/signup/page.tsx
```

**Flow:**
- User truy cập `/auth/signin` hoặc `/auth/signup`
- Nhập thông tin email/password
- NextAuth.js xử lý authentication
- Session được tạo và lưu trong JWT

### 1.2 Kiểm tra quyền truy cập
```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.hasPaidAccess = token.hasPaidAccess as boolean
      }
      return session
    }
  }
}
```

**Logic:**
- Kiểm tra `session.user.hasPaidAccess`
- Free users: Chỉ xem được template, không thể export
- Paid users: Full access đến tất cả tính năng

---

## 🎨 Bước 2: Template Selection

### 2.1 Truy cập Templates Page
```typescript
// src/app/templates/page.tsx
```

**Flow:**
- User truy cập `/templates`
- Hiển thị form tạo website
- User nhập mô tả ngắn về doanh nghiệp
- Click "Tạo Website Ngay"

### 2.2 Redirect đến User Templates
```typescript
// Redirect đến /templates/user?themeId=${themeId}
window.location.href = `/templates/user?themeId=${filteredThemes[0].id}`
```

---

## 🏗️ Bước 3: Project Creation

### 3.1 User Templates Page
```typescript
// src/app/templates/user/page.tsx
```

**Flow:**
- Hiển thị form chi tiết để tạo project
- User nhập thông tin doanh nghiệp:
  - Tên công ty
  - Ngành nghề
  - Mô tả
  - Khách hàng mục tiêu
  - Sản phẩm/Dịch vụ
  - Địa điểm
  - Tông giọng
  - Ngôn ngữ

### 3.2 Tạo Project trong Database
```typescript
// src/app/api/projects/route.ts - POST method
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const { themeId, name } = await request.json()
  
  // Validation
  if (!themeId || !name) {
    return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 })
  }
  
  // Create project
  const project = await prisma.project.create({
    data: {
      userId: session.user.id,
      themeId: themeId,
      name: name.trim(),
      status: 'EDITING'
    },
    include: {
      theme: {
        select: {
          id: true,
          name: true,
          description: true,
          defaultParams: true
        }
      }
    }
  })
  
  return NextResponse.json({ success: true, project })
}
```

**Database Schema:**
```sql
-- Project được tạo với status 'EDITING'
INSERT INTO projects (id, user_id, theme_id, name, status, created_at, updated_at)
VALUES (cuid(), user_id, theme_id, project_name, 'EDITING', now(), now())
```

### 3.3 Redirect đến Editor
```typescript
// Redirect đến project editor
router.push(`/project/${project.id}`)
```

---

## ✏️ Bước 4: Theme Editing

### 4.1 Project Editor Page
```typescript
// src/app/project/[projectId]/page.tsx
```

**Components:**
- `ProjectHeader`: Header với các action buttons
- `EditorPanel`: Panel chỉnh sửa bên trái
- `PreviewPanel`: Preview bên phải
- `AIContentGenerator`: Dialog tạo nội dung AI
- `DeployProjectDialog`: Dialog export/deploy

### 4.2 Load Project Data
```typescript
const loadProject = async () => {
  const response = await fetch(`/api/projects/${projectId}`)
  const data = await response.json()
  
  if (data.success) {
    setProject(data.project)
    
    // Load theme params từ latest version hoặc default
    const latestVersion = data.project.versions[0]
    let params: ThemeParams
    
    if (latestVersion && latestVersion.snapshot) {
      params = latestVersion.snapshot as ThemeParams
    } else {
      params = createDefaultThemeParams()
    }
    
    setThemeParams(params)
  }
}
```

### 4.3 Theme Parameters Structure
```typescript
interface ThemeParams {
  colors: ThemeColors      // Màu sắc
  typography: ThemeTypography // Typography
  layout: ThemeLayout      // Layout settings
  components: ThemeComponents // Component styles
  content: ThemeContent    // Nội dung
}
```

### 4.4 Real-time Editing
```typescript
const updateThemeParam = (path: string[], value: string | number | unknown) => {
  if (!themeParams) return
  
  const newParams = { ...themeParams }
  let current: Record<string, unknown> = newParams as Record<string, unknown>
  
  // Navigate to nested property
  for (let i = 0; i < path.length - 1; i++) {
    if (!current[path[i]]) {
      current[path[i]] = {}
    }
    current = current[path[i]] as Record<string, unknown>
  }
  
  current[path[path.length - 1]] = value
  setThemeParams(newParams)
  updateThemeParamsWithHistory(newParams)
}
```

### 4.5 Auto-save Functionality
```typescript
// Auto-save sau 5 giây không hoạt động
useEffect(() => {
  if (!autoSaveEnabled || !themeParams) return

  const timeoutId = setTimeout(() => {
    saveProject()
  }, 5000)

  return () => clearTimeout(timeoutId)
}, [themeParams, autoSaveEnabled])

const saveProject = async () => {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ themeParams })
  })
  
  if (response.ok) {
    setSaveMessage('✅ Project đã được lưu thành công!')
  }
}
```

---

## 🤖 Bước 5: AI Content Generation (Optional)

### 5.1 AI Content Generator Dialog
```typescript
// src/components/ui/ai-content-generator.tsx
```

**Flow:**
- User click "AI Generate" button
- Hiển thị dialog với form nhập thông tin doanh nghiệp
- User nhập thông tin chi tiết
- Click "Tạo nội dung"

### 5.2 AI API Call
```typescript
// src/app/api/generate-theme/route.ts
export async function POST(request: NextRequest) {
  const { businessInfo, currentTheme } = await request.json()
  
  // Initialize Google Gemini AI
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-21.5-flash' })
  
  // Create comprehensive prompt
  const prompt = `
  Bạn là một chuyên gia thiết kế website và branding. 
  Hãy tạo nội dung và màu sắc cho website doanh nghiệp dựa trên thông tin sau:
  
  THÔNG TIN DOANH NGHIỆP:
  - Tên công ty: ${businessInfo.companyName}
  - Ngành nghề: ${businessInfo.industry}
  - Mô tả: ${businessInfo.description}
  ...
  
  Trả về CHÍNH XÁC theo format JSON sau:
  {
    "colors": { ... },
    "content": { ... }
  }
  `
  
  // Generate content với retry logic
  let result, response, text
  let retryCount = 0
  const maxRetries = 3
  
  while (retryCount < maxRetries) {
    try {
      result = await model.generateContent(prompt)
      response = await result.response
      text = response.text()
      break
    } catch (aiError) {
      retryCount++
      if (retryCount >= maxRetries) {
        return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
      }
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
    }
  }
  
  // Parse và merge với current theme
  const generatedData = JSON.parse(text)
  const themeParams = {
    colors: { ...currentTheme?.colors, ...generatedData.colors },
    content: { ...currentTheme?.content, ...generatedData.content }
  }
  
  return NextResponse.json({ success: true, themeParams })
}
```

### 5.3 Apply AI Generated Content
```typescript
const handleAIGenerate = (generatedTheme: ThemeParams) => {
  setThemeParams(generatedTheme)
  updateThemeParamsWithHistory(generatedTheme)
  setSaveMessage('✨ Nội dung AI đã được áp dụng thành công!')
}
```

---

## 📦 Bước 6: Export & Download

### 6.1 Export Dialog
```typescript
// src/components/ui/export-project-dialog.tsx
```

**Export Options:**
- **Framework**: React, Next.js, Static HTML
- **TypeScript**: Enable/Disable
- **CSS Framework**: Tailwind, Styled Components, Vanilla CSS
- **Include Assets**: Include placeholder images
- **Create User Folder**: Organize files by user
- **Generate Deploy Script**: Auto-generate deployment scripts
- **Server Type**: Nginx, Apache, Docker
- **Domain**: Custom domain for deployment

### 6.2 Export API Call
```typescript
// src/app/api/export-project/route.ts
export async function POST(request: NextRequest) {
  const { 
    projectId, 
    userId,
    projectName, 
    description, 
    framework, 
    typescript, 
    cssFramework, 
    includeAssets,
    createUserFolder,
    generateDeployScript,
    serverType,
    domain,
    themeParams 
  } = await request.json()
  
  // Step 1: Generate project files
  let projectFiles: Record<string, string>
  
  if (framework === 'static-html' || framework === 'html') {
    projectFiles = await generateStaticHtmlFiles({
      projectName, description, includeAssets, themeParams
    })
  } else {
    projectFiles = await generateProjectFiles({
      projectName, description, framework, typescript, cssFramework, includeAssets, themeParams
    })
  }
  
  // Step 2: Create ZIP file
  const zip = new JSZip()
  
  // Create user-specific folder structure if requested
  let userFolderPath = ''
  if (createUserFolder && userId) {
    userFolderPath = `users/${userId}/${projectName}-${Date.now()}/`
  }
  
  for (const [filePath, content] of Object.entries(projectFiles)) {
    const finalPath = createUserFolder ? userFolderPath + filePath : filePath
    zip.file(finalPath, content)
  }
  
  const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' })
  
  // Step 3: Store ZIP for download
  const exportsDir = path.join(process.cwd(), 'public', 'exports')
  const userExportsDir = path.join(exportsDir, 'users', userId)
  const projectDir = path.join(userExportsDir, `${projectName}-${Date.now()}`)
  
  await fs.mkdir(projectDir, { recursive: true })
  const zipPath = path.join(projectDir, `${projectName}.zip`)
  await fs.writeFile(zipPath, Buffer.from(zipBuffer))
  
  return NextResponse.json({
    success: true,
    projectId,
    projectName,
    downloadUrl: `/api/download-project/${projectId}`,
    fileSize: zipBuffer.byteLength,
    fileCount: Object.keys(projectFiles).length,
    exportTime: Date.now() - startTime
  })
}
```

### 6.3 File Generation Process

#### For React/Next.js Projects:
```typescript
async function generateProjectFiles({ projectName, framework, typescript, cssFramework, themeParams }) {
  const files: Record<string, string> = {}
  
  // Package.json
  files['package.json'] = generatePackageJson(projectName, framework, typescript, cssFramework)
  
  // Main App component
  if (framework === 'react-vite') {
    files['src/App.tsx'] = generateReactApp(themeParams, typescript)
    files['src/main.tsx'] = generateReactMain()
    files['index.html'] = generateViteHtml(projectName)
    files['vite.config.ts'] = generateViteConfig()
  } else if (framework === 'nextjs') {
    files['src/app/page.tsx'] = generateNextjsPage(themeParams, typescript)
    files['src/app/layout.tsx'] = generateNextjsLayout(projectName)
    files['next.config.js'] = generateNextConfig()
  }
  
  // Styles
  if (cssFramework === 'tailwind') {
    files['tailwind.config.js'] = generateTailwindConfig()
    files['src/styles/globals.css'] = generateTailwindCSS(themeParams)
  } else {
    files['src/styles/globals.css'] = generateVanillaCSS(themeParams)
  }
  
  // Components
  files['src/components/VietnamCoffeeTheme.tsx'] = generateThemeComponent(themeParams, typescript)
  
  // TypeScript config
  if (typescript) {
    files['tsconfig.json'] = generateTsConfig(framework)
  }
  
  // README
  files['README.md'] = generateReactReadme(projectName, framework)
  
  return files
}
```

#### For Static HTML Projects:
```typescript
async function generateStaticHtmlFiles({ projectName, description, includeAssets, themeParams }) {
  const files: Record<string, string> = {}
  
  // Generate main HTML file
  files['index.html'] = generateStaticHtml(projectName, description, themeParams)
  
  // Generate separate CSS file
  files['assets/css/styles.css'] = generateStaticCss(themeParams)
  
  // Generate JavaScript file for interactivity
  files['assets/js/scripts.js'] = generateStaticJs()
  
  // Generate SEO files
  files['sitemap.xml'] = generateSitemapFile(projectName, themeParams)
  files['robots.txt'] = generateRobotsTxtFile()
  files['manifest.json'] = generateManifestFile(projectName, themeParams)
  
  // Generate README
  files['README.md'] = generateStaticReadme(projectName, description)
  
  // Add placeholder images if requested
  if (includeAssets) {
    files['assets/images/hero-coffee.jpg'] = '<!-- Placeholder for hero image -->'
    files['assets/images/logo.png'] = '<!-- Placeholder for logo -->'
    files['assets/images/favicon.ico'] = '<!-- Placeholder for favicon -->'
  }
  
  return files
}
```

### 6.4 Download Process
```typescript
// src/app/api/download-project/[projectId]/route.ts
export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Find the latest export for this project
  const exportRecord = await prisma.export.findFirst({
    where: {
      projectVersion: {
        project: {
          id: params.projectId,
          userId: session.user.id
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  if (!exportRecord?.zipPath) {
    return NextResponse.json({ error: 'Export not found' }, { status: 404 })
  }
  
  // Read ZIP file
  const zipBuffer = await fs.readFile(exportRecord.zipPath)
  
  return new Response(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${exportRecord.projectVersion.project.name}.zip"`
    }
  })
}
```

---

## 🔄 Version Control & History

### 6.5 Project Versioning
```typescript
// Mỗi lần save project, tạo version mới
const saveProject = async () => {
  // Save current state as new version
  const newVersion = await prisma.projectVersion.create({
    data: {
      projectId: projectId,
      versionNumber: latestVersionNumber + 1,
      snapshot: themeParams
    }
  })
  
  // Update project
  await prisma.project.update({
    where: { id: projectId },
    data: { updatedAt: new Date() }
  })
}
```

### 6.6 Undo/Redo Functionality
```typescript
// src/hooks/use-undo-redo.ts
export const useUndoRedo = <T>(initialState: T) => {
  const [history, setHistory] = useState<T[]>([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const updateState = (newState: T) => {
    const newHistory = history.slice(0, currentIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setCurrentIndex(newHistory.length - 1)
  }
  
  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }
  
  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }
  
  return {
    state: history[currentIndex],
    updateState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1
  }
}
```

---

## 📊 Database Flow

### Project Creation Flow:
```sql
-- 1. Create Project
INSERT INTO projects (id, user_id, theme_id, name, status, created_at, updated_at)
VALUES ('proj_123', 'user_456', 'theme_789', 'My Website', 'EDITING', now(), now())

-- 2. Create Initial Version
INSERT INTO project_versions (id, project_id, version_number, snapshot, created_at)
VALUES ('ver_123', 'proj_123', 1, '{"colors": {...}, "content": {...}}', now())

-- 3. Create Export Record (when export)
INSERT INTO exports (id, project_version_id, zip_path, build_status, created_at)
VALUES ('exp_123', 'ver_123', '/public/exports/users/user_456/project.zip', 'SUCCESS', now())
```

---

## 🎯 Tóm Tắt Quy Trình

1. **Authentication** → User đăng nhập và được xác thực
2. **Template Selection** → Chọn template và nhập thông tin cơ bản
3. **Project Creation** → Tạo project mới trong database
4. **Theme Editing** → Chỉnh sửa theme với real-time preview
5. **AI Generation** → Tạo nội dung tự động (optional)
6. **Export & Download** → Xuất project thành file ZIP và tải về

**Tổng thời gian**: ~2-5 phút cho quy trình hoàn chỉnh
**File output**: ZIP chứa project hoàn chỉnh có thể deploy ngay

---

*Quy trình này được thiết kế để đơn giản hóa việc tạo website từ template đến sản phẩm cuối cùng, với khả năng tùy chỉnh cao và tích hợp AI để tự động hóa việc tạo nội dung.*