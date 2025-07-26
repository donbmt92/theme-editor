# 📊 Export Logging Demo

## Demo chi tiết quá trình Export với Logging

### 🎯 **Mục tiêu:**
Theo dõi từng bước của quá trình export project với logging chi tiết để debug và monitor performance.

---

## 📋 **Test Scenario 1: Basic Export (ZIP only)**

### **Input Configuration:**
```json
{
  "projectId": "demo-coffee-001",
  "projectName": "Vietnam Coffee Export",
  "description": "Premium coffee export website",
  "framework": "react-vite",
  "typescript": true,
  "cssFramework": "tailwind",
  "includeAssets": true,
  "createGitHubRepo": false,
  "deployToVercel": false,
  "themeParams": {
    "colors": {
      "primary": "#8B4513",
      "secondary": "#D2691E",
      "accent": "#CD853F"
    },
    "content": {
      "hero": {
        "title": "Cà Phê Việt Nam - Chất Lượng Quốc Tế",
        "description": "Xuất khẩu cà phê Robusta và Arabica chất lượng cao..."
      }
    }
  }
}
```

### **Expected Console Output:**
```bash
🚀 [EXPORT] Starting project export process...
📋 [EXPORT] Export configuration: {
  projectId: 'demo-coffee-001',
  projectName: 'Vietnam Coffee Export',
  framework: 'react-vite',
  typescript: true,
  cssFramework: 'tailwind',
  includeAssets: true,
  createGitHubRepo: false,
  deployToVercel: false
}
✅ [EXPORT] Validation passed

📁 [EXPORT] Step 1: Generating project files...
🔧 [EXPORT] Generating project files with config: {
  framework: 'react-vite',
  typescript: true,
  cssFramework: 'tailwind',
  includeAssets: true
}
📦 [EXPORT] Generating package.json...
⚡ [EXPORT] Generating Vite config...
📝 [EXPORT] Generating TypeScript config...
🎨 [EXPORT] Generating CSS framework configs...
📁 [EXPORT] Generating source files...
🧩 [EXPORT] Generating components...
📄 [EXPORT] Generating Header component...
📄 [EXPORT] Generating HeroSection component...
📄 [EXPORT] Generating About component...
📄 [EXPORT] Generating Problems component...
📄 [EXPORT] Generating Solutions component...
📄 [EXPORT] Generating Products component...
📄 [EXPORT] Generating Footer component...
📖 [EXPORT] Generating README...
🚫 [EXPORT] Generating .gitignore...
✅ [EXPORT] Generated 15 files

🗜️ [EXPORT] Step 2: Creating ZIP archive...
📄 [EXPORT] Added to ZIP: package.json
📄 [EXPORT] Added to ZIP: vite.config.ts
📄 [EXPORT] Added to ZIP: tsconfig.json
📄 [EXPORT] Added to ZIP: tailwind.config.js
📄 [EXPORT] Added to ZIP: postcss.config.js
📄 [EXPORT] Added to ZIP: index.html
📄 [EXPORT] Added to ZIP: src/main.tsx
📄 [EXPORT] Added to ZIP: src/App.tsx
📄 [EXPORT] Added to ZIP: src/index.css
📄 [EXPORT] Added to ZIP: src/components/Header.tsx
📄 [EXPORT] Added to ZIP: src/components/HeroSection.tsx
📄 [EXPORT] Added to ZIP: src/components/About.tsx
📄 [EXPORT] Added to ZIP: src/components/Problems.tsx
📄 [EXPORT] Added to ZIP: src/components/Solutions.tsx
📄 [EXPORT] Added to ZIP: src/components/Products.tsx
📄 [EXPORT] Added to ZIP: src/components/Footer.tsx
📄 [EXPORT] Added to ZIP: README.md
📄 [EXPORT] Added to ZIP: .gitignore
✅ [EXPORT] ZIP created successfully (45678 bytes)

💾 [EXPORT] Step 3: Storing ZIP for download...
✅ [EXPORT] ZIP stored for project demo-coffee-001

⏭️ [EXPORT] Step 4: Skipping GitHub creation
⏭️ [EXPORT] Step 5: Skipping Vercel deployment

⏱️ [EXPORT] Total export time: 234ms

🎉 [EXPORT] Export completed successfully: {
  projectName: 'Vietnam Coffee Export',
  fileSize: '44.61KB',
  fileCount: 18,
  githubSuccess: undefined,
  vercelSuccess: undefined
}
```

---

## 📋 **Test Scenario 2: Full Export (ZIP + GitHub + Vercel)**

### **Input Configuration:**
```json
{
  "projectId": "demo-tech-002",
  "projectName": "VietTech Solutions",
  "description": "Custom software solutions for Vietnamese SMEs",
  "framework": "nextjs",
  "typescript": true,
  "cssFramework": "styled-components",
  "includeAssets": true,
  "createGitHubRepo": true,
  "githubRepoName": "viettech-solutions",
  "githubPrivate": false,
  "deployToVercel": true,
  "themeParams": {
    "colors": {
      "primary": "#1E40AF",
      "secondary": "#3B82F6",
      "accent": "#60A5FA"
    },
    "content": {
      "hero": {
        "title": "VietTech - Innovation Made Simple",
        "description": "Custom software solutions for Vietnamese SMEs..."
      }
    }
  }
}
```

### **Expected Console Output:**
```bash
🚀 [EXPORT] Starting project export process...
📋 [EXPORT] Export configuration: {
  projectId: 'demo-tech-002',
  projectName: 'VietTech Solutions',
  framework: 'nextjs',
  typescript: true,
  cssFramework: 'styled-components',
  includeAssets: true,
  createGitHubRepo: true,
  deployToVercel: true
}
✅ [EXPORT] Validation passed

📁 [EXPORT] Step 1: Generating project files...
🔧 [EXPORT] Generating project files with config: {
  framework: 'nextjs',
  typescript: true,
  cssFramework: 'styled-components',
  includeAssets: true
}
📦 [EXPORT] Generating package.json...
⚡ [EXPORT] Generating Next.js config...
📝 [EXPORT] Generating TypeScript config...
🎨 [EXPORT] Generating CSS framework configs...
📁 [EXPORT] Generating source files...
🧩 [EXPORT] Generating components...
📄 [EXPORT] Generating Header component...
📄 [EXPORT] Generating HeroSection component...
📄 [EXPORT] Generating About component...
📄 [EXPORT] Generating Problems component...
📄 [EXPORT] Generating Solutions component...
📄 [EXPORT] Generating Products component...
📄 [EXPORT] Generating Footer component...
📖 [EXPORT] Generating README...
🚫 [EXPORT] Generating .gitignore...
✅ [EXPORT] Generated 16 files

🗜️ [EXPORT] Step 2: Creating ZIP archive...
📄 [EXPORT] Added to ZIP: package.json
📄 [EXPORT] Added to ZIP: next.config.js
📄 [EXPORT] Added to ZIP: tsconfig.json
📄 [EXPORT] Added to ZIP: src/app/layout.tsx
📄 [EXPORT] Added to ZIP: src/app/page.tsx
📄 [EXPORT] Added to ZIP: src/app/globals.css
📄 [EXPORT] Added to ZIP: src/components/Header.tsx
📄 [EXPORT] Added to ZIP: src/components/HeroSection.tsx
📄 [EXPORT] Added to ZIP: src/components/About.tsx
📄 [EXPORT] Added to ZIP: src/components/Problems.tsx
📄 [EXPORT] Added to ZIP: src/components/Solutions.tsx
📄 [EXPORT] Added to ZIP: src/components/Products.tsx
📄 [EXPORT] Added to ZIP: src/components/Footer.tsx
📄 [EXPORT] Added to ZIP: README.md
📄 [EXPORT] Added to ZIP: .gitignore
✅ [EXPORT] ZIP created successfully (52345 bytes)

💾 [EXPORT] Step 3: Storing ZIP for download...
✅ [EXPORT] ZIP stored for project demo-tech-002

🐙 [GITHUB] Starting GitHub repository creation...
📋 [GITHUB] Repository configuration: {
  projectId: 'demo-tech-002',
  repoName: 'viettech-solutions',
  description: 'Custom software solutions for Vietnamese SMEs',
  isPrivate: false,
  fileCount: 16
}
✅ [GITHUB] Validation passed
🔍 [GITHUB] Step 1: Checking repository name availability...
✅ [GITHUB] Repository name available
📝 [GITHUB] Step 2: Creating repository...
✅ [GITHUB] Repository created
📁 [GITHUB] Step 3: Initializing with project files...
📄 [GITHUB] Adding 16 files to repository
📄 [GITHUB] Added: package.json
📄 [GITHUB] Added: next.config.js
📄 [GITHUB] Added: tsconfig.json
📄 [GITHUB] Added: src/app/layout.tsx
📄 [GITHUB] Added: src/app/page.tsx
📄 [GITHUB] Added: src/app/globals.css
📄 [GITHUB] Added: src/components/Header.tsx
📄 [GITHUB] Added: src/components/HeroSection.tsx
📄 [GITHUB] Added: src/components/About.tsx
📄 [GITHUB] Added: src/components/Problems.tsx
📄 [GITHUB] Added: src/components/Solutions.tsx
📄 [GITHUB] Added: src/components/Products.tsx
📄 [GITHUB] Added: src/components/Footer.tsx
📄 [GITHUB] Added: README.md
📄 [GITHUB] Added: .gitignore
✅ [GITHUB] Files committed to repository
⚙️ [GITHUB] Step 4: Configuring repository settings...
✅ [GITHUB] Repository configured
🎉 [GITHUB] Repository creation completed successfully: {
  repoName: 'viettech-solutions',
  repoUrl: 'https://github.com/user/viettech-solutions',
  isPrivate: false,
  totalTime: '2300ms'
}
✅ [EXPORT] GitHub repository created: {
  success: true,
  repoUrl: 'https://github.com/user/viettech-solutions',
  repoName: 'viettech-solutions',
  isPrivate: false,
  message: 'Repository created successfully (mock)',
  creationTime: 2300
}

🚀 [VERCEL] Starting Vercel deployment...
📋 [VERCEL] Deployment configuration: {
  projectId: 'demo-tech-002',
  repoUrl: 'https://github.com/user/viettech-solutions',
  projectName: 'VietTech Solutions',
  framework: 'nextjs'
}
✅ [VERCEL] Validation passed
🔗 [VERCEL] Step 1: Connecting to GitHub repository...
✅ [VERCEL] Connected to repository
🔍 [VERCEL] Step 2: Detecting framework...
✅ [VERCEL] Framework detected: nextjs
⚙️ [VERCEL] Step 3: Configuring build settings...
✅ [VERCEL] Build settings configured
🚀 [VERCEL] Step 4: Starting deployment...
✅ [VERCEL] Deployment started
🔨 [VERCEL] Step 5: Building project...
✅ [VERCEL] Build completed
🌐 [VERCEL] Step 6: Deploying to CDN...
✅ [VERCEL] Deployed to CDN
🎉 [VERCEL] Deployment completed successfully: {
  projectName: 'VietTech Solutions',
  deploymentUrl: 'https://viettech-solutions.vercel.app',
  framework: 'nextjs',
  totalTime: '4900ms'
}
✅ [EXPORT] Vercel deployment successful: {
  success: true,
  deploymentUrl: 'https://viettech-solutions.vercel.app',
  projectName: 'VietTech Solutions',
  framework: 'nextjs',
  message: 'Deployed successfully (mock)',
  deploymentTime: 4900
}

⏱️ [EXPORT] Total export time: 7234ms

🎉 [EXPORT] Export completed successfully: {
  projectName: 'VietTech Solutions',
  fileSize: '51.12KB',
  fileCount: 16,
  githubSuccess: true,
  vercelSuccess: true
}
```

---

## 📋 **Test Scenario 3: Download Process**

### **Download Request:**
```bash
GET /api/download-project/demo-coffee-001
```

### **Expected Console Output:**
```bash
📥 [DOWNLOAD] Starting project download...
📋 [DOWNLOAD] Download request for project: demo-coffee-001
✅ [DOWNLOAD] Found project file (45678 bytes)
🎉 [DOWNLOAD] Download completed successfully: {
  projectId: 'demo-coffee-001',
  fileSize: '44.61KB',
  totalTime: '45ms'
}
```

---

## 📊 **Performance Metrics**

### **Export Times (Average):**
- **Basic Export (ZIP only):** ~200-300ms
- **GitHub Creation:** ~2000-2500ms
- **Vercel Deployment:** ~4000-5000ms
- **Full Export:** ~7000-8000ms
- **Download:** ~40-60ms

### **File Sizes:**
- **React + Vite:** ~40-50KB
- **Next.js:** ~50-60KB
- **With TypeScript:** +5-10KB
- **With Styled Components:** +2-5KB

### **File Counts:**
- **React + Vite:** 18 files
- **Next.js:** 16 files
- **Components:** 7 files (Header, HeroSection, About, Problems, Solutions, Products, Footer)

---

## 🔍 **Debugging Logs**

### **Error Scenarios:**

#### **1. Missing Required Fields:**
```bash
🚀 [EXPORT] Starting project export process...
📋 [EXPORT] Export configuration: {
  projectId: undefined,
  projectName: undefined,
  framework: 'react-vite',
  typescript: true,
  cssFramework: 'tailwind',
  includeAssets: true,
  createGitHubRepo: false,
  deployToVercel: false
}
❌ [EXPORT] Missing required fields
```

#### **2. GitHub Creation Failed:**
```bash
🐙 [GITHUB] Starting GitHub repository creation...
📋 [GITHUB] Repository configuration: {
  projectId: 'demo-001',
  repoName: '',
  description: 'Test project',
  isPrivate: false,
  fileCount: 15
}
❌ [GITHUB] Missing repository name
💥 [GITHUB] Repository creation failed after 5ms: Error: Repository name is required
```

#### **3. Vercel Deployment Failed:**
```bash
🚀 [VERCEL] Starting Vercel deployment...
📋 [VERCEL] Deployment configuration: {
  projectId: 'demo-001',
  repoUrl: undefined,
  projectName: 'Test Project',
  framework: 'react-vite'
}
❌ [VERCEL] Missing required fields
💥 [VERCEL] Deployment failed after 8ms: Error: Repository URL and project name are required
```

#### **4. Download File Not Found:**
```bash
📥 [DOWNLOAD] Starting project download...
📋 [DOWNLOAD] Download request for project: non-existent-id
❌ [DOWNLOAD] Project file not found: non-existent-id
```

---

## 🎯 **Monitoring Dashboard**

### **Real-time Metrics:**
```javascript
// Export Progress
{
  step: "generating_files",
  progress: 45,
  currentFile: "src/components/Header.tsx",
  totalFiles: 18,
  elapsedTime: 120
}

// Performance Metrics
{
  totalExportTime: 7234,
  fileGenerationTime: 234,
  zipCreationTime: 45,
  githubCreationTime: 2300,
  vercelDeploymentTime: 4900,
  fileSize: 52345,
  fileCount: 16
}

// Success Rates
{
  exportSuccess: 95.2,
  githubSuccess: 89.1,
  vercelSuccess: 92.3,
  downloadSuccess: 98.7
}
```

---

## 🚀 **Production Logging Features**

### **Structured Logging:**
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "info",
  "service": "export",
  "operation": "project_export",
  "projectId": "demo-coffee-001",
  "step": "file_generation",
  "metrics": {
    "elapsedTime": 234,
    "fileCount": 18,
    "fileSize": 45678
  },
  "context": {
    "framework": "react-vite",
    "typescript": true,
    "cssFramework": "tailwind"
  }
}
```

### **Error Tracking:**
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "error",
  "service": "export",
  "operation": "github_creation",
  "error": {
    "code": "REPO_NAME_UNAVAILABLE",
    "message": "Repository name is already taken",
    "details": "The repository 'viettech-solutions' already exists"
  },
  "context": {
    "projectId": "demo-tech-002",
    "repoName": "viettech-solutions"
  }
}
```

Với logging chi tiết này, bạn có thể theo dõi toàn bộ quá trình export từ đầu đến cuối, debug issues và optimize performance! 📊✨ 