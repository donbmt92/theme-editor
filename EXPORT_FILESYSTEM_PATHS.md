# Đường dẫn Filesystem cho Deploy Projects

## 📁 Cấu trúc thư mục lưu trữ

### 1. **Thư mục gốc**
```
{project-root}/
└── public/
    └── exports/
        └── users/
            └── {userId}/
                └── {projectName}-{timestamp}/
                    ├── index.html
                    ├── css/
                    │   └── style.css
                    ├── js/
                    │   └── main.js
                    ├── images/
                    ├── deploy-{server}.sh
                    └── metadata.json
```

### 2. **Ví dụ thực tế**
```
D:\2025\nextjs\theme\theme-editor\
└── public\
    └── exports\
        └── users\
            └── clx123abc456def\
                └── vietnam-coffee-1703123456789\
                    ├── index.html
                    ├── css\
                    │   └── style.css
                    ├── js\
                    │   └── main.js
                    ├── images\
                    ├── deploy-nginx.sh
                    └── metadata.json
```

## 🔧 Chi tiết từng thành phần

### **Base Path**
```javascript
const exportsDir = path.join(process.cwd(), 'public', 'exports')
// Kết quả: D:\2025\nextjs\theme\theme-editor\public\exports
```

### **User Directory**
```javascript
const userExportsDir = path.join(exportsDir, 'users', userId)
// Kết quả: D:\2025\nextjs\theme\theme-editor\public\exports\users\clx123abc456def
```

### **Project Directory**
```javascript
const projectDir = path.join(userExportsDir, `${projectName}-${Date.now()}`)
// Kết quả: D:\2025\nextjs\theme\theme-editor\public\exports\users\clx123abc456def\vietnam-coffee-1703123456789
```

## 📄 Nội dung Metadata

File `metadata.json` chứa thông tin chi tiết về deploy:

```json
{
  "projectId": "test-project-1703123456789",
  "userId": "clx123abc456def",
  "projectName": "vietnam-coffee",
  "deployTime": "2023-12-21T10:30:45.123Z",
  "userFolderPath": "users/clx123abc456def/vietnam-coffee-1703123456789/",
  "deployScriptPath": "deploy-nginx.sh",
  "serverType": "nginx",
  "domain": "coffee.example.com"
}
```

## 🌐 API Endpoints

### **Deploy Project**
```
POST /api/deploy-project
```
Request body:
```json
{
  "projectId": "...",
  "projectName": "...",
  "description": "...",
  "userId": "...",
  "includeAssets": true,
  "createUserFolder": true,
  "generateDeployScript": true,
  "serverType": "nginx",
  "domain": "example.com",
  "themeParams": {...}
}
```

Response:
```json
{
  "success": true,
  "folderPath": "vietnam-coffee-1703123456789",
  "userFolderPath": "users/clx123abc456def/vietnam-coffee-1703123456789/",
  "filesystemPath": "/full/path/to/project",
  "deployScriptPath": "deploy-nginx.sh"
}
```

### **Execute Deploy Script**
```
POST /api/execute-deploy-script
```
Request body:
```json
{
  "scriptPath": "deploy-nginx.sh",
  "projectName": "vietnam-coffee",
  "serverType": "nginx",
  "domain": "example.com",
  "filesystemPath": "/full/path/to/project"
}
```

Response:
```json
{
  "success": true,
  "stdout": "Nginx reloaded successfully",
  "stderr": ""
}
```

### **Check Domain**
```
POST /api/check-domain
```
Request body:
```json
{
  "domain": "example.com"
}
```

Response (valid):
```json
{
  "ip": "69.62.83.168"
}
```

Response (invalid):
```json
{
  "ip": "123.45.67.89",
  "error": "IP does not match VPS"
}
```

### **Update Deploy Script**
```
POST /api/update-deploy-script
```
Request body:
```json
{
  "projectId": "...",
  "domain": "example.com",
  "serverType": "nginx",
  "filesystemPath": "/full/path/to/project"
}
```

## 🔍 Cách truy cập đường dẫn

### **1. Từ Frontend (Deploy Dialog)**
```javascript
// Trong DeployProjectDialog
console.log('Filesystem Path:', deployProgress.filesystemPath)
// Output: D:\2025\nextjs\theme\theme-editor\public\exports\users\clx123abc456def\vietnam-coffee-1703123456789
```

### **2. Từ Backend (API Route)**
```javascript
// Trong deploy-project/route.ts
console.log('Project Directory:', projectDir)
// Output: D:\2025\nextjs\theme\theme-editor\public\exports\users\clx123abc456def\vietnam-coffee-1703123456789
```

### **3. Từ File System**
```bash
# Windows
dir "D:\2025\nextjs\theme\theme-editor\public\exports\users\clx123abc456def\vietnam-coffee-1703123456789"

# Linux/Mac
ls -la "/path/to/project/public/exports/users/clx123abc456def/vietnam-coffee-1703123456789"
```

## 🛠️ Quản lý Files

### **Tạo thư mục**
```javascript
await fs.mkdir(projectDir, { recursive: true })
```

### **Lưu HTML file**
```javascript
await fs.writeFile(path.join(projectDir, 'index.html'), htmlContent)
```

### **Lưu metadata**
```javascript
await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
```

## 🧹 Cleanup & Maintenance

### **Xóa file cũ**
```javascript
// Xóa file cũ hơn 30 ngày
const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)

for (const file of await fs.readdir(userExportsDir)) {
  const filePath = path.join(userExportsDir, file)
  const stats = await fs.stat(filePath)
  
  if (stats.mtime.getTime() < thirtyDaysAgo) {
    await fs.rm(filePath, { recursive: true })
  }
}
```

## 🔒 Bảo mật

### **Permissions**
- Thư mục `public/exports` có thể truy cập từ web (static files)
- Deploy scripts chỉ execute thông qua API
- User chỉ có thể deploy với userId của mình

### **Validation**
```javascript
// Kiểm tra user có quyền
if (session.user.id !== userId) {
  throw new Error('Unauthorized')
}
```

## 📊 Monitoring

### **Log Messages**
```javascript
console.log(`📁 [DEPLOY] Created directory: ${projectDir}`)
console.log(`📄 [DEPLOY] HTML saved to: ${htmlPath}`)
console.log(`📜 [DEPLOY] Script saved: ${scriptPath}`)
console.log(`📂 [DEPLOY] Files saved to filesystem: ${projectDir}`)
```

### **Error Handling**
```javascript
try {
  await fs.mkdir(projectDir, { recursive: true })
} catch (error) {
  console.error('❌ [DEPLOY] Failed to create directory:', error)
  throw error
}
```

---

*Đường dẫn filesystem này giúp quản lý và truy xuất file deploy một cách có tổ chức và bảo mật.*