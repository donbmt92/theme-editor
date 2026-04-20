# 🚀 Hướng dẫn Test Hệ Thống với 20 Người Truy Cập Đồng Thời

## 📋 Tổng quan

Hệ thống Generate Theme API đã được tối ưu để xử lý **20 người truy cập đồng thời** với kiến trúc phân luồng thông minh.

## 🎯 Mô phỏng 20 người truy cập

### **1. Chức năng của từng người:**

```javascript
👤 User 1: Cà Phê Việt Nam Premium (Vietnamese)
👤 User 2: Vietnam Coffee Trading Co. (English) 
👤 User 3: Công Ty Nông Nghiệp ABC (Vietnamese)
👤 User 4: Tech Solutions Vietnam (English)
👤 User 5: Fashion Store International (Vietnamese)
👤 User 6-20: Random combinations với các loại doanh nghiệp khác nhau...
```

### **2. Timeline mong đợi:**

```
T+0s:   🚀 20 users đồng loạt request
T+0.2s: 📋 Queue nhận tất cả requests  
T+0.2s: 🎯 Load balancer phân phối 10 API keys đầu tiên
T+5s:   ⚡ Batch đầu tiên (users 1-10) bắt đầu processing
T+15s:  ✅ Batch đầu hoàn thành → users 11-15 vào queue
T+25s:  ✅ Batch thứ hai hoàn thành → users 16-20 vào queue  
T+35s:  🎉 Tất cả 20 users hoàn thành!
```

## 🏗️ Kiến trúc Phân Luồng

### **Queue System (10 Concurrent)**

```
📋 AI Generation Queue:
├── Max Concurrent Tasks: 10
├── Max Queue Size: 500  
├── Priority System: Dựa trên business type
└── Timeout: 2 phút per task
      
🔄 Processing Flow:
Users 1-10   → [ACTIVE] Processing đồng thời
Users 11-15  → [QUEUED] Chờ slot trở nên available  
Users 16-20  → [QUEUED] Tiếp tục chờ...
```

### **API Load Balancer**

```javascript
🔑 Smart API Key Selection:
├── Key 1: Busy → Automatically skip
├── Key 2: Available → Assign to User 1
├── Key 3: Available → Assign to User 2
├── ...
├── Auto-failover khi key hết quota
└── Real-time performance tracking
```

### **Caching Layer**

```javascript
💾 Intelligent Caching:
├── Cache hit: Response < 200ms
├── Cache miss: AI generation 15-30s
├── Cache TTL: 10 minutes
└── Business context aware caching
```

## 📊 Metrics Theo Dõi

### **Real-time Dashboard**

Mở `monitoring-dashboard.html` để xem:

1. **System Health**: ✅ Healthy / ❌ Overloaded
2. **Queue Status**: Active tasks, Queued tasks  
3. **API Keys**: Available keys, Success rate
4. **Cache Performance**: Hit rate, Miss rate
5. **Performance**: Response times, Wait times

### **Performance Targets**

```bash
🎯 EXPECTED PERFORMANCE:
├── Success Rate: > 95% (19/20 users)
├── Average Response Time: < 15s
├── Queue Wait Time: < 5s  
├── Max Queue Length: < 50 tasks
├── Cache Hit Rate: > 60%
└── Total Completion Time: < 60s
```

## 🧪 Cách Test

### **Method 1: Automated Simulation**

```bash
# Chạy simulation script
node scripts/test-20-users.js

# Expected output:
✅ User 1: Success in 2847ms  
✅ User 2: Success in 3241ms
✅ User 3: Success in 4456ms
📊 Priority: 0.750 | Total Time: 2847ms
✅ User 4-10: Processing in parallel...
📋 Queue: 5 waiting, 10 active
✅ User 11-20: Batch processing...
📈 Success Rate: 95.0%
```

### **Method 2: Manual Testing**

```bash
# Start monitoring dashboard
open monitoring-dashboard.html

# Trigger test via browser interface
Click "Start 20 User Test" button
Watch real-time metrics update
```

### **Method 3: cURL Testing**

```bash
# Test individual request
curl -X POST http://localhost:3000/api/generate-theme \
  -H "Content-Type: application/json" \
  -d '{
    "businessInfo": {
      "companyName": "Test Company",
      "industry": "Nông sản", 
      "description": "Test description",
      "language": "vietnamese"
    }
  }'

# Check system status
curl "http://localhost:3000/api/generate-theme?action=debug"
```

## 🔍 Debugging & Monitoring

### **Server Logs**

Trong terminal server, theo dõi:

```bash
🔄 Reset daily API key usage limits
📋 Queuing AI generation task: generate-1703123456-abc123 (Priority: 0.750)
🔧 Starting AI generation for task: generate-1703123456-abc123  
🎯 Selected API key: AIzaSyDRSk...
📝 Generating theme content...
✅ Theme content generated successfully
⚙️ Preparing theme parameters...
✅ Theme parameters prepared successfully
✅ Task generate-1703123456-abc123 completed successfully in 2847ms
🚀 Returning cached AI response
💾 Cached AI response for future requests
```

### **Common Issues & Solutions**

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **Queue Overflow** | `Queue is full` error | Reduce concurrent users or increase `maxQueueSize` |
| **API Key Quota** | `QUOTA_EXCEEDED` | Add more API keys or check usage limits |
| **Timeout** | `Request timeout` | Reduce request complexity or increase timeout |
| **Memory Issues** | Slow responses | Adjust `maxConcurrentTasks` lower |

## 📈 Tối Ưu Hóa Cho 20+ Users

### **Scaling Up**

Nếu muốn hỗ trợ nhiều hơn 20 users:

```javascript
// Tăng concurrent processing
maxConcurrentTasks: 15,    // từ 10
maxQueueSize: 750,         // từ 500  

// Thêm more API keys
GOOGLE_GEMINI_API_KEY_18=...
GOOGLE_GEMINI_API_KEY_19=...

// Tăng timeout for complex requests  
defaultTimeout: 180000,    // 3 phút từ 2 phút
```

### **Performance Tuning**

```javascript
// Optimize cache settings
cache: {
  ttl: 5 * 60 * 1000,       // 5 phút từ 10 phút
  maxSize: 1500,           // Tăng cache size
  cleanupInterval: 30 * 1000 // Cleanup mỗi 30s
}

// Priority adjustments
calculatePriority(businessInfo) {
  return basePriority * complexityFactor; // Ưu tiên theo complexity
}
```

## 🎯 Expected Results

Với 20 người truy cập đồng thời, bạn sẽ thấy:

### **Immediate (< 1s)**
- ✅ All 20 requests accepted by queue
- 📊 Queue health check passed
- 🎯 API keys distributed efficiently

### **Short-term (1-10s)**  
- ⚡ First batch (10 users) processing
- 📋 Remaining users queued
- 💾 Cache hits for repeat requests

### **Medium-term (10-30s)**
- ✅ Batch 1 completing, Batch 2 starting
- 🔄 Load balancer optimizing key usage
- 📈 Performance metrics stabilizing

### **Completion (30-60s)**
- 🎉 All 20 users completed
- 📊 Success rate: 95%+  
- 💾 Cache populated for future requests

## 🚀 Production Readiness

Hệ thống này đã sẵn sàng cho production với:

- ✅ **Error handling** hoàn chỉnh
- ✅ **Monitoring** real-time
- ✅ **Auto-scaling** queue management
- ✅ **Graceful degradation** khi overload
- ✅ **Performance optimization** tối đa

**Kết luận: Hệ thống có thể xử lý 20+ người truy cập đồng thời một cách hiệu quả và ổn định!** 🎉
