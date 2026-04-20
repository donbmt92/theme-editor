# HƯỚNG DẪN SỬA LỖI SEPAY WEBHOOK

## 🔍 Vấn đề đã xác định:

### 1. API Key không khớp
- **Nguyên nhân:** Server chưa cấu hình `SEPAY_API_KEY` environment variable
- **Giải pháp:** Cấu hình API key trên server

### 2. Payment không tồn tại  
- **Nguyên nhân:** Sepay gửi `referenceCode = "3516"` nhưng không có payment nào với `bankTxnId = "3516"`
- **Giải pháp:** Tạo payment test hoặc kiểm tra logic tạo bankTxnId

## 🚀 Các bước sửa lỗi:

### Bước 1: Deploy code đã sửa
```bash
git add .
git commit -m "Fix Sepay webhook authentication and error handling"
git push origin main
```

### Bước 2: Cấu hình environment variables trên server
```bash
# Trên server production
export SEPAY_API_KEY="sepay_api_key_2025"
# Hoặc thêm vào .env file
echo "SEPAY_API_KEY=sepay_api_key_2025" >> .env
```

### Bước 3: Restart server
```bash
# Nếu dùng PM2
pm2 restart theme-editor

# Hoặc restart service
sudo systemctl restart your-app-service
```

### Bước 4: Test webhook
```bash
# Test với API key đúng
curl -X POST https://onghoangdohieu.com/api/sepay/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sepay_api_key_2025" \
  -d '{
    "gateway": "ACB",
    "transactionDate": "2025-01-19 20:23:13",
    "accountNumber": "3699781",
    "content": "Test payment",
    "transferType": "in",
    "transferAmount": 5000,
    "referenceCode": "3516",
    "id": 123456
  }'
```

## 📋 Cách Sepay phải gửi webhook:

### Headers bắt buộc:
```http
POST /api/sepay/webhook HTTP/1.1
Content-Type: application/json
Authorization: Bearer sepay_api_key_2025
User-Agent: Sepay-Webhook/1.0
```

### Payload chuẩn:
```json
{
  "gateway": "ACB",
  "transactionDate": "2025-01-19 20:23:13",
  "accountNumber": "3699781",
  "subAccount": null,
  "code": null,
  "content": "TXN_xxx-0123456789-Thanh toan goi Goi Chuyen Nghiep",
  "transferType": "in",
  "description": "BankAPINotify TXN_xxx-0123456789-Thanh toan goi Goi Chuyen Nghiep",
  "transferAmount": 5000,
  "referenceCode": "TXN_xxx",  // Phải khớp với bankTxnId trong database
  "accumulated": 0,
  "id": 123456
}
```

## 🔧 Cải thiện đã thực hiện:

1. **✅ Sửa API key:** Thay `đây_là_khóa_bí_mật` → `sepay_api_key_2025` (ASCII-safe)
2. **✅ Thêm logging:** Debug chi tiết headers, payload, API key comparison
3. **✅ Cải thiện error handling:** Log recent payments khi không tìm thấy
4. **✅ Xóa duplicate endpoint:** Chỉ giữ `/api/sepay/webhook`

## 📊 Monitoring:

Sau khi deploy, kiểm tra logs:
```bash
# Xem logs real-time
pm2 logs theme-editor

# Hoặc
tail -f /var/log/your-app.log
```

Tìm các log:
- `=== SEPAY WEBHOOK DEBUG ===`
- `API Key check:`
- `Received Sepay webhook:`
- `Payment not found:` (nếu có)

## ⚠️ Lưu ý quan trọng:

1. **API Key:** Phải cấu hình `SEPAY_API_KEY` trên server
2. **Reference Code:** Phải khớp với `bankTxnId` trong database  
3. **Amount:** Phải khớp với payment amount
4. **Transfer Type:** Chỉ xử lý `"in"` (tiền vào)
5. **HTTPS:** Webhook endpoint phải dùng HTTPS trong production

## 🆘 Nếu vẫn lỗi:

1. Kiểm tra logs server để xem API key thực tế Sepay gửi
2. Liên hệ Sepay để xác nhận:
   - API key chính xác
   - Format payload chuẩn
   - URL webhook: `https://onghoangdohieu.com/api/sepay/webhook`
3. Tạo payment test với `bankTxnId` cụ thể để test
