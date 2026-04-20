# 📋 Hướng dẫn xem Log cho AI Generator

## 1. Xem Log trong Browser Console

### Cách mở Console:
- **Chrome/Edge**: `F12` hoặc `Ctrl+Shift+I` → tab Console
- **Firefox**: `F12` → tab Console
- **Safari**: `Cmd+Option+C`

### Các Log Messages:

#### ✅ Thành công:
```
🚀 [AI-GENERATOR] Sending request (attempt 1/4): 
  {
    businessInfo: {
      companyName: "...",
      industry: "...",
      description: "..."
    },
    currentTheme: {...}
  }

📡 [AI-GENERATOR] Response status: 200 OK

✅ [AI-GENERATOR] Response received: 
  {
    success: true,
    themeParams: {...}
  }
```

#### ⚠️ Timeout (504):
```
🚀 [AI-GENERATOR] Sending request (attempt 1/4): {...}
📡 [AI-GENERATOR] Response status: 504 Gateway Time-out
⏱️ [AI-GENERATOR] Gateway timeout (attempt 1/4)

# Sau đó retry...
🚀 [AI-GENERATOR] Sending request (attempt 2/4): {...}
```

#### ❌ Error:
```
🚨 [AI-GENERATOR] Generation error: 
  {
    error: Error: HTTP 504: ...,
    message: "HTTP 504: Chi tiết: <html>...",
    stack: "Error: HTTP 504:... at ...",
    businessInfo: {...},
    currentTheme: {...},
    retryCount: 3
  }
```

## 2. Filter Log trong Console

Để chỉ xem log của AI Generator:

```javascript
// Trong Console, gõ:
localStorage.setItem('debug', 'AI-GENERATOR')

// Hoặc filter bằng text:
// Gõ "AI-GENERATOR" trong ô search của Console
```

## 3. Copy Log để báo lỗi

### Trong Console:
1. Click chuột phải vào log
2. Chọn **"Copy object"** hoặc **"Save as..."**
3. Paste vào text editor

### Hoặc dùng code:

```javascript
// Gõ trong Console để export log gần nhất:
copy(JSON.stringify({
  timestamp: new Date().toISOString(),
  // Copy object từ console
}))
```

## 4. Xem Network Request

### Trong tab **Network** (F12):
1. Filter: `generate-theme`
2. Click vào request
3. Xem:
   - **Headers**: Request method, status code
   - **Payload**: Data gửi đi (businessInfo)
   - **Response**: Data nhận về hoặc error
   - **Timing**: Thời gian chờ (nếu timeout sẽ thấy rất lớn)

### Ví dụ khi timeout:
```
Request URL: https://onghoangdohieu.com/api/generate-theme
Request Method: POST
Status Code: 504 Gateway Time-out
Time: 60.23s (timeout)
```

## 5. Xem Server Logs (nếu có quyền truy cập)

### SSH vào server:
```bash
ssh root@srv828623

# Xem log nginx
tail -f /var/log/nginx/error.log

# Xem log Next.js (nếu chạy bằng PM2)
pm2 logs theme-editor --lines 100

# Xem log theo thời gian thực
pm2 logs theme-editor
```

### Log patterns cần chú ý:
```
# Timeout từ nginx
[error] upstream timed out (110: Connection timed out)

# Rate limit
Too many requests from this IP

# Memory issue
JavaScript heap out of memory
```

## 6. Debug Tips

### Enable verbose logging:

Thêm vào `ai-content-generator.tsx`:

```typescript
// Sau dòng 94, thêm:
console.log('📤 [AI-GENERATOR] Request payload:', JSON.stringify(requestData, null, 2))
console.log('🌐 [AI-GENERATOR] Request URL:', '/api/generate-theme')
console.log('⏰ [AI-GENERATOR] Timeout set to:', 180000, 'ms (3 minutes)')
```

### Measure timing:

```typescript
// Trước fetch:
console.time('AI-GENERATOR-Request')

// Sau fetch:
console.timeEnd('AI-GENERATOR-Request')
```

### Log response size:

```typescript
const result = await response.json()
console.log('📊 [AI-GENERATOR] Response size:', 
  JSON.stringify(result).length, 'characters',
  (JSON.stringify(result).length / 1024).toFixed(2), 'KB'
)
```

## 7. Common Error Patterns

### 504 Gateway Timeout:
```
Nguyên nhân: Server mất >60s xử lý (nginx default)
Giải pháp: Tăng nginx proxy_read_timeout
```

### 503 Service Unavailable:
```
Nguyên nhân: Server quá tải hoặc đang restart
Giải pháp: Đợi và retry
```

### AbortError:
```
Nguyên nhân: Client timeout (180s)
Giải pháp: Giảm độ phức tạp của request
```

## 8. Export Log History

Thêm vào component để lưu log history:

```typescript
const [logHistory, setLogHistory] = useState<any[]>([])

// Trong try-catch:
setLogHistory(prev => [...prev, {
  timestamp: new Date().toISOString(),
  type: 'request',
  data: requestData
}])

// Export button:
<Button onClick={() => {
  const logJson = JSON.stringify(logHistory, null, 2)
  const blob = new Blob([logJson], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-generator-logs-${Date.now()}.json`
  a.click()
}}>
  📥 Export Logs
</Button>
```

---

## 📞 Khi báo lỗi, cung cấp:

1. ✅ Full error log từ Console
2. ✅ Network timing (tab Network)
3. ✅ businessInfo đã gửi (cẩn thận thông tin nhạy cảm)
4. ✅ Browser version
5. ✅ Thời gian xảy ra lỗi (để check server logs)

