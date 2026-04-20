# 📊 Deploy Logging Demo

## Demo chi tiết quá trình Deploy với Logging

### 🎯 **Mục tiêu:**
Theo dõi từng bước của quá trình deploy project với logging chi tiết để debug và monitor.

---

## 📋 **Test Scenario 1: Basic Deploy (Nginx, No Domain)**

### **Input Configuration:**
```json
{
  "projectId": "demo-coffee-001",
  "projectName": "vietnam-coffee-web",
  "description": "Premium coffee export website",
  "includeAssets": true,
  "createUserFolder": true,
  "generateDeployScript": true,
  "serverType": "nginx",
  "domain": "",
  "userId": "clx123abc456def"
}
```

### **Expected Console Output:**
```bash
🚀 Bắt đầu deploy project...
📁 Tạo folder riêng cho user: clx123abc456def
📦 Tạo Static HTML project từ theme...
✅ Tạo Static HTML project thành công!
📁 Folder user được tạo tại: users/clx123abc456def/vietnam-coffee-web-1703123456789/
📜 Deploy script được tạo: deploy-nginx.sh
🚀 Đang chạy deploy script trên VPS...
✅ Deploy script chạy thành công!
📋 Output: [nginx reload output]
🎉 Hoàn thành tất cả các bước!
```

---

## 📋 **Test Scenario 2: Deploy with Domain Validation**

### **Input Configuration:**
```json
{
  "projectId": "demo-tech-002",
  "projectName": "viettech-solutions",
  "description": "Custom software solutions",
  "includeAssets": true,
  "createUserFolder": true,
  "generateDeployScript": true,
  "serverType": "nginx",
  "domain": "viettech.example.com",
  "userId": "clx456def789ghi"
}
```

### **Domain Check Output (Valid):**
```bash
✅ Domain viettech.example.com đã được trỏ về đúng IP VPS: 69.62.83.168
🔄 Đang cập nhật shell script với domain viettech.example.com...
✅ Shell script đã được cập nhật với domain viettech.example.com
```

### **Domain Check Output (Invalid):**
```bash
❌ Domain viettech.example.com trỏ về IP sai: 123.45.67.89. Cần trỏ về IP: 69.62.83.168
```

### **Full Deploy Logs:**
```bash
🚀 Bắt đầu deploy project...
📁 Tạo folder riêng cho user: clx456def789ghi
📦 Tạo Static HTML project từ theme...
✅ Tạo Static HTML project thành công!
📁 Folder user được tạo tại: users/clx456def789ghi/viettech-solutions-1703123456789/
📜 Deploy script được tạo: deploy-nginx.sh
🚀 Đang chạy deploy script trên VPS...
✅ Deploy script chạy thành công!
📋 Output: Nginx configuration updated for viettech.example.com
🎉 Hoàn thành tất cả các bước!
```

---

## 📋 **Test Scenario 3: Different Server Types**

### **Node.js Server:**
```bash
🚀 Bắt đầu deploy project...
📦 Tạo Static HTML project từ theme...
✅ Tạo Static HTML project thành công!
📜 Deploy script được tạo: deploy-node.sh
🚀 Đang chạy deploy script trên VPS...
✅ Deploy script chạy thành công!
📋 Output: PM2 started: my-project (id: 5)
🎉 Hoàn thành tất cả các bước!
```

### **Docker:**
```bash
🚀 Bắt đầu deploy project...
📦 Tạo Static HTML project từ theme...
✅ Tạo Static HTML project thành công!
📜 Deploy script được tạo: deploy-docker.sh
🚀 Đang chạy deploy script trên VPS...
✅ Deploy script chạy thành công!
📋 Output: Container my-project created and started
🎉 Hoàn thành tất cả các bước!
```

---

## 🔍 **Error Scenarios**

### **1. User Not Logged In:**
```bash
❌ Lỗi: Bạn cần đăng nhập để deploy project
```

### **2. Domain Not Validated:**
```bash
❌ Lỗi: Domain chưa được xác thực hoặc trỏ về IP sai. Vui lòng kiểm tra domain trước.
```

### **3. Deploy API Failed:**
```bash
🚀 Bắt đầu deploy project...
📦 Tạo Static HTML project từ theme...
❌ Lỗi: Không thể deploy project
```

### **4. Script Execution Failed:**
```bash
🚀 Đang chạy deploy script trên VPS...
❌ Lỗi khi chạy deploy script: Permission denied
```

### **5. Domain Check Failed:**
```bash
❌ Domain mydomain.com chưa được trỏ về. Lỗi: NXDOMAIN
```

---

## 📊 **Performance Metrics**

### **Deploy Times (Average):**
| Step | Duration |
|------|----------|
| Generate HTML files | ~100-200ms |
| Create folder | ~50ms |
| Generate deploy script | ~50ms |
| Execute deploy script | ~500-2000ms |
| **Total (no domain)** | ~700-2500ms |
| Domain validation | ~200-500ms |
| **Total (with domain)** | ~900-3000ms |

### **File Sizes:**
| Type | Size |
|------|------|
| HTML files | ~10-30KB |
| CSS | ~5-15KB |
| JavaScript | ~2-10KB |
| With assets | ~100KB-1MB+ |

---

## 🛠️ **API Response Examples**

### **Deploy Project Response:**
```json
{
  "success": true,
  "folderPath": "vietnam-coffee-web-1703123456789",
  "userFolderPath": "users/clx123abc456def/vietnam-coffee-web-1703123456789/",
  "filesystemPath": "/var/www/theme-editor/public/exports/users/clx123abc456def/vietnam-coffee-web-1703123456789",
  "deployScriptPath": "deploy-nginx.sh"
}
```

### **Execute Script Response:**
```json
{
  "success": true,
  "stdout": "Nginx configuration reloaded successfully",
  "stderr": ""
}
```

### **Check Domain Response (Valid):**
```json
{
  "ip": "69.62.83.168",
  "valid": true
}
```

### **Check Domain Response (Invalid):**
```json
{
  "ip": "123.45.67.89",
  "valid": false,
  "error": "IP does not match VPS"
}
```

---

## 🎯 **Monitoring Dashboard**

### **Real-time Progress:**
```javascript
{
  step: "deploying",
  logs: [
    "13:45:01: 🚀 Bắt đầu deploy project...",
    "13:45:01: 📁 Tạo folder riêng cho user: abc123",
    "13:45:02: 📦 Tạo Static HTML project từ theme...",
    "13:45:03: ✅ Tạo Static HTML project thành công!",
    // ... more logs
  ],
  folderPath: "my-project-123456789",
  filesystemPath: "/path/to/project",
  deployScriptPath: "deploy-nginx.sh"
}
```

---

*Với logging chi tiết này, bạn có thể theo dõi toàn bộ quá trình deploy và debug issues!* 📊✨