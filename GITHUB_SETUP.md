# 🐙 GitHub Integration Setup Guide

## Cách tạo GitHub Repository thật từ Theme Editor

### 📋 **Overview**

API `create-github-repo` hiện tại hỗ trợ 2 modes:
1. **Mock Mode** (mặc định) - Tạo repository giả để test
2. **Real Mode** - Tạo repository thật trên GitHub

---

## 🔑 **Setup GitHub Token**

### **Bước 1: Tạo GitHub Personal Access Token**

1. **Đăng nhập GitHub** và vào Settings
2. **Scroll xuống** Developer settings → Personal access tokens → Tokens (classic)
3. **Click "Generate new token"** → "Generate new token (classic)"
4. **Đặt tên:** `Theme Editor Export`
5. **Chọn scopes:**
   - ✅ `repo` (Full control of private repositories)
   - ✅ `public_repo` (Access public repositories)
6. **Click "Generate token"**
7. **Copy token** (lưu lại, sẽ không hiển thị lại)

### **Bước 2: Cấu hình Token**

#### **Option A: Environment Variable (Recommended)**
Thêm vào file `.env.local`:
```bash
GITHUB_TOKEN=ghp_your_token_here
```

#### **Option B: Request Header**
Gửi token trong header khi gọi API:
```javascript
const response = await fetch('/api/create-github-repo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-github-token': 'ghp_your_token_here'
  },
  body: JSON.stringify({...})
})
```

---

## 🚀 **Cách hoạt động**

### **Mock Mode (Không có token):**
```bash
🐙 [GITHUB] Starting GitHub repository creation...
📋 [GITHUB] Repository configuration: {...}
✅ [GITHUB] Validation passed
⚠️ [GITHUB] No GitHub token provided, using mock mode
🎭 [GITHUB] Using mock implementation
🔍 [GITHUB] Step 1: Checking repository name availability...
✅ [GITHUB] Repository name available
📝 [GITHUB] Step 2: Creating repository...
✅ [GITHUB] Repository created
📁 [GITHUB] Step 3: Initializing with project files...
📄 [GITHUB] Adding 18 files to repository
✅ [GITHUB] Files committed to repository
⚙️ [GITHUB] Step 4: Configuring repository settings...
✅ [GITHUB] Repository configured
🎉 [GITHUB] Repository creation completed successfully (mock)
```

### **Real Mode (Có token):**
```bash
🐙 [GITHUB] Starting GitHub repository creation...
📋 [GITHUB] Repository configuration: {...}
✅ [GITHUB] Validation passed
🔑 [GITHUB] GitHub token found, using real API
🔍 [GITHUB] Step 1: Checking repository name availability...
✅ [GITHUB] Repository name available
📝 [GITHUB] Step 2: Creating repository...
✅ [GITHUB] Repository created
📁 [GITHUB] Step 3: Initializing with project files...
📄 [GITHUB] Adding 18 files to repository
✅ [GITHUB] Files committed to repository
⚙️ [GITHUB] Step 4: Configuring repository settings...
✅ [GITHUB] Repository configured
🎉 [GITHUB] Repository creation completed successfully
```

---

## 🔧 **GitHub API Functions**

### **1. Check Repository Availability**
```javascript
async function checkRepositoryAvailability(repoName: string, token: string): Promise<boolean> {
  const response = await fetch(`https://api.github.com/repos/user/${repoName}`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  })
  return response.status === 404 // 404 means available
}
```

### **2. Create Repository**
```javascript
async function createRepository(name: string, description: string, isPrivate: boolean, token: string) {
  const response = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      description,
      private: isPrivate,
      auto_init: true,
      gitignore_template: 'Node',
      license_template: 'mit'
    })
  })
  return await response.json()
}
```

### **3. Add Files to Repository**
```javascript
async function addFilesToRepository(repoFullName: string, files: Record<string, string>, token: string) {
  // Create Git tree with all files
  const tree = await createTree(repoFullName, files, token)
  // Create commit with tree
  const commit = await createCommit(repoFullName, tree.sha, token)
  // Update main branch
  await updateRef(repoFullName, commit.sha, token)
}
```

### **4. Configure Repository Settings**
```javascript
async function configureRepository(repoFullName: string, token: string) {
  const response = await fetch(`https://api.github.com/repos/${repoFullName}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      has_issues: true,
      has_projects: false,
      has_wiki: false,
      has_downloads: false,
      default_branch: 'main'
    })
  })
  return await response.json()
}
```

---

## 📊 **Repository Features**

### **Tự động tạo:**
- ✅ **README.md** với project description
- ✅ **.gitignore** cho Node.js
- ✅ **MIT License**
- ✅ **Initial commit** với tất cả project files
- ✅ **Issues enabled**
- ✅ **Main branch** làm default

### **Repository Structure:**
```
my-project/
├── README.md
├── .gitignore
├── LICENSE
├── package.json
├── vite.config.ts (hoặc next.config.js)
├── tsconfig.json
├── tailwind.config.js
├── src/
│   ├── main.tsx (hoặc app/)
│   ├── App.tsx
│   ├── index.css
│   └── components/
│       ├── Header.tsx
│       ├── HeroSection.tsx
│       ├── About.tsx
│       ├── Problems.tsx
│       ├── Solutions.tsx
│       ├── Products.tsx
│       └── Footer.tsx
└── public/
    └── assets/
```

---

## 🔍 **Error Handling**

### **Common Errors:**

#### **1. Repository Name Already Taken:**
```bash
❌ [GITHUB] Repository name not available
Error: Repository name is already taken
```

#### **2. Invalid Token:**
```bash
💥 [GITHUB] Repository creation failed
Error: GitHub API error: Bad credentials
```

#### **3. Rate Limit Exceeded:**
```bash
💥 [GITHUB] Repository creation failed
Error: GitHub API error: API rate limit exceeded
```

#### **4. Network Error:**
```bash
💥 [GITHUB] Repository creation failed
Error: fetch failed
```

### **Fallback to Mock Mode:**
```bash
⚠️ [GITHUB] No GitHub token provided, using mock mode
🎭 [GITHUB] Using mock implementation
```

---

## 🧪 **Testing**

### **Test với Mock Mode:**
```bash
# Không cần token
curl -X POST http://localhost:3000/api/create-github-repo \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "test-001",
    "repoName": "my-test-repo",
    "description": "Test repository",
    "private": false
  }'
```

### **Test với Real Mode:**
```bash
# Cần có GITHUB_TOKEN trong .env.local
curl -X POST http://localhost:3000/api/create-github-repo \
  -H "Content-Type: application/json" \
  -H "x-github-token: ghp_your_token_here" \
  -d '{
    "projectId": "test-001",
    "repoName": "my-test-repo",
    "description": "Test repository",
    "private": false
  }'
```

---

## 🔐 **Security Best Practices**

### **Token Security:**
- ✅ **Không commit token** vào git
- ✅ **Sử dụng environment variables**
- ✅ **Rotate tokens** định kỳ
- ✅ **Limit token scopes** chỉ những quyền cần thiết

### **Rate Limiting:**
- ⚠️ **GitHub API limit:** 5000 requests/hour cho authenticated users
- ⚠️ **Monitor usage** để tránh exceed limits
- ⚠️ **Implement caching** cho repeated requests

### **Error Handling:**
- ✅ **Graceful fallback** to mock mode
- ✅ **Detailed error messages** cho debugging
- ✅ **User-friendly error** messages

---

## 🚀 **Production Deployment**

### **Environment Variables:**
```bash
# .env.local
GITHUB_TOKEN=ghp_your_production_token_here

# .env.production
GITHUB_TOKEN=ghp_your_production_token_here
```

### **Vercel Deployment:**
1. **Add environment variable** trong Vercel dashboard
2. **Key:** `GITHUB_TOKEN`
3. **Value:** Your GitHub token
4. **Redeploy** application

### **Docker Deployment:**
```dockerfile
# Dockerfile
ENV GITHUB_TOKEN=ghp_your_token_here
```

---

## 📈 **Monitoring & Analytics**

### **Success Metrics:**
- ✅ **Repository creation success rate**
- ✅ **Average creation time**
- ✅ **Error rate by type**
- ✅ **Token usage statistics**

### **Logging:**
```json
{
  "timestamp": "2025-01-15T10:30:45.123Z",
  "service": "github",
  "operation": "create_repository",
  "repoName": "my-project",
  "isPrivate": false,
  "creationTime": 2300,
  "success": true,
  "error": null
}
```

Với setup này, bạn có thể tạo GitHub repositories thật từ Theme Editor! 🚀✨ 