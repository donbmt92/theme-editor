# 🤖 AI Content Generator - Project Editor Demo

## Cách test tính năng AI trong Project Editor

### 1. **Truy cập Project Editor**
```
http://localhost:3000/project/[projectId]
```

### 2. **Tìm nút AI** 
- Ở header, tìm nút màu tím: **"AI Tạo Nội Dung"**
- Icon: ⚡ Wand2 (đũa phép)

### 3. **Demo Input cho Coffee Export Business**

**Thông tin doanh nghiệp:**
- **Tên công ty:** `Cà Phê Xuất Khẩu Việt Nam`
- **Ngành nghề:** `Xuất khẩu cà phê và nông sản`
- **Mô tả:** `Chuyên xuất khẩu cà phê Robusta, Arabica chất lượng cao sang thị trường Châu Âu và Bắc Mỹ. Chúng tôi làm việc trực tiếp với các nông trại ở Tây Nguyên để đảm bảo chất lượng từ khâu thu hoạch.`

**Chi tiết bổ sung:**
- **Khách hàng mục tiêu:** `Nhà nhập khẩu cà phê quốc tế, chuỗi cà phê cao cấp, roasters chuyên nghiệp`
- **Sản phẩm/Dịch vụ:** `Cà phê Robusta nguyên chất, Arabica specialty, dịch vụ rang xay theo yêu cầu, tư vấn chất lượng`
- **Địa điểm:** `Đăk Lăk, Việt Nam`
- **Website hiện tại:** `https://cafevietexport.com`
- **Tông giọng:** `Chuyên nghiệp`
- **Ngôn ngữ:** `Song ngữ`

### 4. **Expected AI Output**

**Colors Generated:**
- **Primary:** `#8B4513` (Saddle Brown - màu nâu cà phê)
- **Secondary:** `#D2691E` (Chocolate - màu chocolate)  
- **Accent:** `#CD853F` (Peru - màu vàng cà phê)

**Content Generated:**
- **Hero Title:** "Cà Phê Việt Nam - Kết Nối Thế Giới"
- **Hero Description:** Professional copy về xuất khẩu cà phê
- **About Section:** Story về truyền thống cà phê Việt Nam
- **Problems:** 3 thách thức xuất khẩu (market access, quality control, logistics)
- **Solutions:** 3 giải pháp của công ty (direct trade, quality assurance, logistics support)
- **Products:** Robusta, Arabica, Specialty blends
- **Meta/SEO:** Optimized cho "coffee export Vietnam"

### 5. **Demo cho ngành khác**

**Công nghệ:**
```
Tên: "VietTech Solutions"
Ngành: "Phát triển phần mềm và ứng dụng mobile"
Mô tả: "Chuyên phát triển ứng dụng mobile và web cho SME Việt Nam"
→ Colors: Blue spectrum (#1E40AF, #3B82F6, #60A5FA)
```

**Thời trang:**
```
Tên: "Áo Dài Sài Gòn"  
Ngành: "Thiết kế và sản xuất áo dài truyền thống"
Mô tả: "Kết hợp truyền thống và hiện đại trong thiết kế áo dài"
→ Colors: Elegant reds/golds (#DC2626, #F59E0B, #EF4444)
```

### 6. **Test Flow:**

1. ✅ **Mở project editor**
2. ✅ **Click "AI Tạo Nội Dung"** 
3. ✅ **Điền form business info**
4. ✅ **Click "Tạo nội dung AI"**
5. ✅ **Wait for generation (5-10s)**
6. ✅ **Preview colors + content**
7. ✅ **Click "Áp dụng nội dung"**
8. ✅ **Thấy success message**
9. ✅ **Check auto-save**
10. ✅ **Test undo/redo**

### 7. **Features trong Project Editor**

- **All tabs:** Colors, Typography, Layout, Content, Problems, Solutions, Products, Footer, Meta
- **Real-time preview:** Right panel updates instantly  
- **Auto-save:** Content saved automatically after 5s
- **Undo/Redo:** Ctrl+Z/Ctrl+Y hoặc buttons
- **Manual save:** Ctrl+S hoặc Save button

### 8. **Troubleshooting**

**Nếu AI button không hiện:**
- Check import `AIContentGenerator` 
- Check `showAIDialog` state
- Check `Wand2` icon import

**Nếu API lỗi:**
- Check `.env.local` có `GOOGLE_GEMINI_API_KEY`
- Check API key đúng format
- Check internet connection

**Nếu nội dung không apply:**
- Check `handleAIGenerate` function
- Check `updateThemeParamsWithHistory` call
- Check save message display

### 9. **So sánh Theme Editor vs Project Editor**

| Feature | Theme Editor | Project Editor |
|---------|-------------|----------------|
| **AI Button** | ✅ Purple | ✅ Purple |
| **All tabs** | ✅ 4 tabs | ✅ 9 tabs |  
| **Auto-save** | ✅ 5s | ✅ 5s |
| **Undo/Redo** | ✅ History | ✅ History |
| **Live preview** | ✅ Right panel | ✅ Right panel |
| **Export** | ✅ Zip/Git | 🚧 TODO |

Cả hai đều có tính năng AI đầy đủ! 🎉 