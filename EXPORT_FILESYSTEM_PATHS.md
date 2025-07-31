# Đường dẫn Filesystem cho Export Projects

## 📁 Cấu trúc thư mục lưu trữ

### 1. **Thư mục gốc**
```
{project-root}/
└── public/
    └── exports/
        └── users/
            └── {userId}/
                └── {projectName}-{timestamp}/
                    ├── {projectName}.zip
                    ├── metadata.json
                    └── (các file khác nếu có)
```

### 2. **Ví dụ thực tế**
```
D:\2025\nextjs\theme\theme-editor\
└── public\
    └── exports\
        └── users\
            └── clx123abc456def\
                └── vietnam-coffee-1703123456789\
                    ├── vietnam-coffee.zip
                    ├── metadata.json
                    └── README.md
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

### **ZIP File Path**
```javascript
const zipPath = path.join(projectDir, `${projectName}.zip`)
// Kết quả: D:\2025\nextjs\theme\theme-editor\public\exports\users\clx123abc456def\vietnam-coffee-1703123456789\vietnam-coffee.zip
```

### **Metadata File Path**
```javascript
const metadataPath = path.join(projectDir, 'metadata.json')
// Kết quả: D:\2025\nextjs\theme\theme-editor\public\exports\users\clx123abc456def\vietnam-coffee-1703123456789\metadata.json
```

## 📄 Nội dung Metadata

File `metadata.json` chứa thông tin chi tiết về export:

```json
{
  "projectId": "test-project-1703123456789",
  "userId": "clx123abc456def",
  "projectName": "vietnam-coffee",
  "exportTime": "2023-12-21T10:30:45.123Z",
  "fileSize": 245760,
  "fileCount": 15,
  "userFolderPath": "users/clx123abc456def/vietnam-coffee-1703123456789/",
  "deployScriptPath": "deploy-nginx.sh",
  "framework": "html",
  "serverType": "nginx"
}
```

## 🌐 URL Access

### **Download URL**
```
/api/download-project/{projectId}
```

### **Filesystem URL** (nếu cần)
```
/exports/users/{userId}/{projectName}-{timestamp}/{projectName}.zip
```

## 🔍 Cách truy cập đường dẫn

### **1. Từ Frontend (Export Dialog)**
```javascript
// Trong export-project-dialog.tsx
console.log('Filesystem Path:', exportProgress.filesystemPath)
// Output: D:\2025\nextjs\theme\theme-editor\public\exports\users\clx123abc456def\vietnam-coffee-1703123456789
```

### **2. Từ Backend (API Route)**
```javascript
// Trong export-project/route.ts
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

### **Lưu ZIP file**
```javascript
await fs.writeFile(zipPath, Buffer.from(zipBuffer))
```

### **Lưu metadata**
```javascript
await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
```

### **Đọc metadata**
```javascript
const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'))
```

## 🧹 Cleanup & Maintenance

### **Xóa file cũ**
```javascript
// Xóa file cũ hơn 30 ngày
const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)

for (const file of await fs.readdir(exportsDir)) {
  const filePath = path.join(exportsDir, file)
  const stats = await fs.stat(filePath)
  
  if (stats.mtime.getTime() < thirtyDaysAgo) {
    await fs.rm(filePath, { recursive: true })
  }
}
```

### **Kiểm tra dung lượng**
```javascript
// Tính tổng dung lượng exports
let totalSize = 0
for (const file of await fs.readdir(exportsDir, { recursive: true })) {
  const filePath = path.join(exportsDir, file)
  const stats = await fs.stat(filePath)
  totalSize += stats.size
}
console.log('Total exports size:', (totalSize / 1024 / 1024).toFixed(2), 'MB')
```

## 🔒 Bảo mật

### **Permissions**
- Thư mục `public/exports` có thể truy cập từ web
- Chỉ admin mới có quyền xóa file
- User chỉ có thể download file của mình

### **Validation**
```javascript
// Kiểm tra user có quyền truy cập file
if (filePath.includes(userId) || user.role === 'ADMIN') {
  // Cho phép truy cập
} else {
  // Từ chối truy cập
}
```

## 📊 Monitoring

### **Log Files**
```javascript
console.log(`📁 [EXPORT] Created directory: ${projectDir}`)
console.log(`💾 [EXPORT] ZIP saved to: ${zipPath}`)
console.log(`📄 [EXPORT] Metadata saved to: ${metadataPath}`)
console.log(`📂 [EXPORT] Files saved to filesystem: ${projectDir}`)
```

### **Error Handling**
```javascript
try {
  await fs.mkdir(projectDir, { recursive: true })
} catch (error) {
  console.error('❌ [EXPORT] Failed to save to filesystem:', error)
  // Fallback to memory only
}
```

---

*Đường dẫn filesystem này giúp quản lý và truy xuất file export một cách có tổ chức và bảo mật.* 