# AI Content Generation Integration

## Tính năng mới: Tạo nội dung website bằng AI

### Mô tả
Tính năng này sử dụng Google Gemini AI để tự động tạo nội dung và màu sắc phù hợp cho website dựa trên thông tin doanh nghiệp.

### Cách cài đặt

1. **Lấy API Key từ Google AI Studio:**
   - Truy cập: https://makersuite.google.com/app/apikey
   - Đăng nhập với tài khoản Google
   - Tạo API key mới
   - Copy API key

2. **Cấu hình môi trường:**
   Tạo file `.env.local` trong thư mục `theme-editor` với nội dung:
   ```
   GOOGLE_GEMINI_API_KEY="your-api-key-here"
   ```

### Cách sử dụng

1. **Mở Theme Editor:**
   - Vào `/editor/[themeId]`
   - Nhấn nút "AI Tạo Nội Dung" (màu tím) ở header

2. **Điền thông tin doanh nghiệp:**
   - **Thông tin bắt buộc:**
     - Tên công ty
     - Ngành nghề
     - Mô tả doanh nghiệp
   
   - **Thông tin tùy chọn:**
     - Khách hàng mục tiêu
     - Sản phẩm/Dịch vụ
     - Địa điểm
     - Website hiện tại
     - Tông giọng (Chuyên nghiệp/Thân thiện/Hiện đại/Truyền thống)
     - Ngôn ngữ (Tiếng Việt/English/Song ngữ)

3. **Tạo và áp dụng nội dung:**
   - Nhấn "Tạo nội dung AI"
   - Xem trước kết quả (màu sắc + nội dung)
   - Nhấn "Áp dụng nội dung" để cập nhật theme

### Tính năng AI tạo ra

**Màu sắc:**
- Bảng màu phù hợp với ngành nghề
- Primary, Secondary, Accent colors
- Màu nền và màu chữ

**Nội dung:**
- Meta tags và SEO
- Header (logo, slogan, liên hệ)
- Hero section (tiêu đề, mô tả, CTA)
- About section
- Problems & Solutions (3 items mỗi loại)
- Products/Services (3 items)
- Call-to-Action
- Footer (thông tin liên hệ, newsletter)

### API Endpoint

**POST** `/api/generate-theme`

Request body:
```json
{
  "businessInfo": {
    "companyName": "string",
    "industry": "string", 
    "description": "string",
    "targetAudience": "string",
    "services": "string",
    "location": "string",
    "website": "string",
    "tone": "professional|friendly|modern|traditional",
    "language": "vietnamese|english|both"
  },
  "currentTheme": "ThemeParams object"
}
```

Response:
```json
{
  "success": true,
  "themeParams": "Generated ThemeParams",
  "generatedData": "Raw AI response"
}
```

### Lưu ý

- **API Limits:** Google Gemini có giới hạn request miễn phí
- **Chất lượng:** Nội dung được tối ưu cho ngành nghiệp Việt Nam
- **Ngôn ngữ:** Hỗ trợ tiếng Việt, tiếng Anh và song ngữ
- **Màu sắc:** Được chọn dựa trên tâm lý học màu sắc và ngành nghề

### Troubleshooting

**Lỗi "Cấu hình AI chưa đầy đủ":**
- Kiểm tra API key trong `.env.local`
- Đảm bảo API key đúng format

**Lỗi "Đã vượt quá giới hạn API":**
- Đợi một lúc hoặc nâng cấp plan Google AI

**Nội dung không phù hợp:**
- Thử điều chỉnh thông tin đầu vào
- Thay đổi tông giọng hoặc mô tả chi tiết hơn

### Ví dụ sử dụng

**Input:**
- Công ty: "Cà Phê Việt Plus"
- Ngành nghề: "Xuất khẩu cà phê"
- Mô tả: "Chuyên xuất khẩu cà phê Robusta và Arabica chất lượng cao"
- Tông giọng: "Chuyên nghiệp"

**Output:**
- Màu chính: Nâu cà phê (#8B4513)
- Tiêu đề: "Cà Phê Việt Nam - Chất Lượng Quốc Tế"
- Nội dung: Tự động tạo các section phù hợp với ngành xuất khẩu cà phê 