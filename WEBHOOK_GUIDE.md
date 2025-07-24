# Hướng Dẫn Sepay Webhook Thanh Toán

## Tổng Quan

Hệ thống thanh toán tích hợp với Sepay để nhận webhook callback khi có giao dịch chuyển tiền. Sepay sẽ gửi thông báo real-time khi có tiền vào tài khoản.

## Quy Trình Thanh Toán

### 1. Khởi Tạo Thanh Toán
- User chọn gói và điền thông tin
- Hệ thống tạo payment record với status `PENDING`
- User được redirect đến trang `/payment/pending`

### 2. Chờ Webhook
- User chuyển tiền đến tài khoản Sepay
- Sepay gửi webhook đến `/api/sepay/webhook`
- Hệ thống cập nhật trạng thái payment và user role

### 3. Kết Quả
- Nếu thành công: User được redirect đến `/payment/success`
- Nếu thất bại: User được redirect đến `/payment/failed`

## Sepay Webhook Endpoint

### URL
```
POST /api/sepay/webhook
```

### Headers
```
Content-Type: application/json
Authorization: Bearer <API_KEY>
```

### Payload
```json
{
  "gateway": "MBBank",
  "transactionDate": "2024-05-25 21:11:02",
  "accountNumber": "0359123456",
  "subAccount": null,
  "code": null,
  "content": "Thanh toan QR SE123456",
  "transferType": "in",
  "description": "Thanh toan QR SE123456",
  "transferAmount": 599000,
  "referenceCode": "FT123456789",
  "accumulated": 0,
  "id": 123456
}
```

### Response
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "paymentId": "clx123456789",
  "status": "PAID"
}
```

## Bảo Mật

### API Key Authentication
Webhook sử dụng Bearer token để xác thực:

```javascript
const apiKey = authHeader.replace('Bearer ', '')
const expectedApiKey = process.env.SEPAY_API_KEY || 'đây_là_khóa_bí_mật'
```

### Environment Variables
```env
SEPAY_API_KEY=đây_là_khóa_bí_mật
```

## Testing

### 1. Tạo Payment Test
```bash
# Tạo payment với status PENDING
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 599000,
    "currency": "VND",
    "planId": "pro",
    "customerInfo": {
      "fullName": "Test User",
      "email": "test@example.com",
      "phone": "0123456789"
    },
    "bankId": "vcb"
  }'
```

### 2. Test Sepay Webhook Success
```bash
# Test webhook thành công
curl -X POST http://localhost:3000/api/sepay/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer đây_là_khóa_bí_mật" \
  -d '{
    "gateway": "MBBank",
    "transactionDate": "2024-05-25 21:11:02",
    "accountNumber": "0359123456",
    "content": "Thanh toan QR SE123456",
    "transferType": "in",
    "description": "Thanh toan QR SE123456",
    "transferAmount": 599000,
    "referenceCode": "FT123456789",
    "accumulated": 0,
    "id": 123456
  }'
```

### 3. Test Sepay Webhook Outgoing (Ignored)
```bash
# Test webhook chuyển tiền ra (sẽ bị bỏ qua)
curl -X POST http://localhost:3000/api/sepay/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer đây_là_khóa_bí_mật" \
  -d '{
    "gateway": "MBBank",
    "transactionDate": "2024-05-25 21:15:02",
    "accountNumber": "0359123456",
    "content": "Chuyen tien ra ngoai",
    "transferType": "out",
    "description": "Chuyen tien ra ngoai",
    "transferAmount": 100000,
    "referenceCode": "FT123456790",
    "accumulated": 0,
    "id": 123457
  }'
```

## Trạng Thái Payment

### PENDING
- Thanh toán đã được tạo
- Đang chờ xác nhận từ ngân hàng
- User role chưa được nâng cấp

### PAID
- Thanh toán thành công
- User role được nâng cấp (nếu là gói Pro/Enterprise)
- Có thể truy cập tính năng premium

### FAILED
- Thanh toán thất bại
- User role không thay đổi
- Có thể thử lại thanh toán

## Monitoring

### Logs
Sepay webhook logs được ghi vào console:
```
Received Sepay webhook: { gateway: 'MBBank', transferType: 'in', ... }
Payment FT123456789 marked as PAID via MBBank
```

### Database
Kiểm tra bảng `payments` để theo dõi trạng thái:
```sql
SELECT id, status, amount, bankTxnId, createdAt, paidAt 
FROM payments 
WHERE userId = 'user_id' 
ORDER BY createdAt DESC;
```

## Troubleshooting

### 1. Webhook không nhận được
- Kiểm tra URL webhook có đúng không: `/api/sepay/webhook`
- Kiểm tra firewall/network
- Kiểm tra API key có đúng không

### 2. Payment không được cập nhật
- Kiểm tra referenceCode có khớp với bankTxnId không
- Kiểm tra transferAmount có khớp với payment amount không
- Kiểm tra transferType có phải là "in" không
- Kiểm tra logs để xem lỗi
- Kiểm tra database connection

### 3. User role không được nâng cấp
- Kiểm tra transferAmount có >= 599000 (Pro plan) không
- Kiểm tra logic nâng cấp role dựa trên amount
- Kiểm tra user permissions

## Production Deployment

### 1. Environment Variables
```env
SEPAY_API_KEY=đây_là_khóa_bí_mật
DATABASE_URL=your-production-database-url
NEXTAUTH_SECRET=your-nextauth-secret
```

### 2. SSL/HTTPS
Webhook endpoint phải sử dụng HTTPS trong production.

### 3. Rate Limiting
Cân nhắc thêm rate limiting cho webhook endpoint.

### 4. Monitoring
- Set up alerts cho webhook failures
- Monitor payment success rate
- Track webhook response times 