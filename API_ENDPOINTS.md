# API Endpoints Documentation

## Project Management APIs

### 1. Project CRUD Operations

#### 1.1 Tạo Project Mới
**Endpoint:** `POST /api/projects`

**Request Body:**
```json
{
  "name": "Tên project",
  "themeId": "theme-id-here",
  "description": "Mô tả project (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "project-id",
    "name": "Tên project",
    "themeId": "theme-id",
    "userId": "user-id",
    "status": "EDITING",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "theme": {
      "id": "theme-id",
      "name": "Theme Name",
      "description": "Theme description",
      "defaultParams": {}
    }
  }
}
```

**Error Responses:**
- `400` - Thiếu thông tin bắt buộc
- `401` - Chưa đăng nhập
- `404` - Theme không tồn tại
- `503` - Database timeout

#### 1.2 Lấy Danh Sách Projects
**Endpoint:** `GET /api/projects`

**Query Parameters:**
- `limit` (optional): Số lượng projects (default: 10)
- `page` (optional): Trang hiện tại (default: 1)

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "id": "project-id",
      "name": "Project Name",
      "status": "EDITING",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "theme": {
        "id": "theme-id",
        "name": "Theme Name",
        "description": "Theme description"
      },
      "versions": [
        {
          "id": "version-id",
          "versionNumber": 1,
          "createdAt": "2024-01-01T00:00:00Z"
        }
      ]
    }
  ]
}
```

#### 1.3 Lấy Chi Tiết Project
**Endpoint:** `GET /api/projects/[projectId]`

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "project-id",
    "name": "Project Name",
    "themeId": "theme-id",
    "status": "EDITING",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "theme": {
      "id": "theme-id",
      "name": "Theme Name",
      "description": "Theme description",
      "defaultParams": {}
    },
    "versions": [
      {
        "id": "version-id",
        "versionNumber": 1,
        "snapshot": {
          "colors": {},
          "typography": {},
          "layout": {},
          "content": {}
        },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### 1.4 Cập Nhật Project
**Endpoint:** `PUT /api/projects/[projectId]`

**Request Body:**
```json
{
  "name": "Tên project mới (optional)",
  "themeParams": {
    "colors": {},
    "typography": {},
    "layout": {},
    "content": {}
  }
}
```

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "project-id",
    "name": "Updated Project Name",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Project đã được cập nhật thành công"
}
```

#### 1.5 Xóa Project
**Endpoint:** `DELETE /api/projects/[projectId]`

**Response:**
```json
{
  "success": true,
  "message": "Project đã được xóa thành công"
}
```

### 2. Theme Management APIs

#### 2.1 Lấy Danh Sách Themes
**Endpoint:** `GET /api/themes`

**Response:**
```json
{
  "success": true,
  "themes": [
    {
      "id": "theme-id",
      "name": "Vietnam Coffee Export",
      "description": "Theme chuyên biệt cho xuất khẩu cà phê",
      "previewUrl": "https://example.com/preview.jpg",
      "defaultParams": {},
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 2.2 Lấy Chi Tiết Theme
**Endpoint:** `GET /api/themes/[themeId]`

**Response:**
```json
{
  "success": true,
  "theme": {
    "id": "theme-id",
    "name": "Theme Name",
    "description": "Theme description",
    "previewUrl": "https://example.com/preview.jpg",
    "defaultParams": {
      "colors": {},
      "typography": {},
      "layout": {},
      "content": {}
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 2.3 Cập Nhật Theme
**Endpoint:** `PUT /api/themes/[themeId]`

**Request Body:**
```json
{
  "name": "Updated Theme Name",
  "description": "Updated description",
  "themeParams": {
    "colors": {},
    "typography": {},
    "layout": {},
    "content": {}
  }
}
```

### 3. AI Content Generation API

#### 3.1 Tạo Nội Dung AI
**Endpoint:** `POST /api/generate-theme`

**Request Body:**
```json
{
  "businessInfo": {
    "companyName": "Tên công ty",
    "industry": "Ngành nghề",
    "description": "Mô tả doanh nghiệp",
    "targetAudience": "Khách hàng mục tiêu",
    "services": "Sản phẩm/Dịch vụ",
    "location": "Địa điểm",
    "tone": "professional|friendly|modern|traditional",
    "language": "vietnamese|english|both"
  },
  "currentTheme": {
    "colors": {},
    "typography": {},
    "layout": {},
    "content": {}
  }
}
```

**Response:**
```json
{
  "success": true,
  "themeParams": {
    "colors": {
      "primary": "#8B4513",
      "secondary": "#D2691E",
      "accent": "#FFD700",
      "background": "#FFFFFF",
      "text": "#2D3748"
    },
    "content": {
      "hero": {
        "title": "Generated title",
        "subtitle": "Generated subtitle",
        "description": "Generated description"
      },
      "about": {
        "title": "Về Chúng Tôi",
        "description": "Generated about content"
      }
    }
  },
  "generatedData": {
    "colors": {},
    "content": {}
  }
}
```

**Error Responses:**
- `400` - Thiếu thông tin bắt buộc
- `503` - AI service overloaded
- `429` - Rate limit exceeded
- `500` - AI generation error

### 4. Unsplash Image APIs

#### 4.1 Lấy Hình Ảnh Theme
**Endpoint:** `POST /api/unsplash/theme-image`

**Request Body:**
```json
{
  "themeName": "vietnam-coffee"
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://images.unsplash.com/photo-...",
  "attribution": {
    "photographer": "Photographer Name",
    "unsplashUrl": "https://unsplash.com/photos/..."
  }
}
```

#### 4.2 Lấy Hình Ảnh Ngẫu Nhiên
**Endpoint:** `GET /api/unsplash/random`

**Query Parameters:**
- `query` (optional): Từ khóa tìm kiếm
- `count` (optional): Số lượng ảnh (default: 1)

**Response:**
```json
{
  "success": true,
  "images": [
    {
      "id": "image-id",
      "url": "https://images.unsplash.com/photo-...",
      "alt": "Image description",
      "photographer": "Photographer Name",
      "unsplashUrl": "https://unsplash.com/photos/..."
    }
  ]
}
```

#### 4.3 Tìm Kiếm Hình Ảnh
**Endpoint:** `POST /api/unsplash/random`

**Request Body:**
```json
{
  "query": "coffee business",
  "count": 5
}
```

### 5. Export APIs

#### 5.1 Xuất Project
**Endpoint:** `POST /api/export-project`

**Request Body:**
```json
{
  "projectId": "project-id",
  "format": "zip|git",
  "includeAssets": true,
  "framework": "react|next|vue|angular",
  "typescript": true,
  "cssFramework": "tailwind|styled-components|emotion|css-modules"
}
```

**Response:**
```json
{
  "success": true,
  "exportId": "export-id",
  "status": "pending|building|success|failed",
  "downloadUrl": "https://example.com/download/export.zip",
  "repoUrl": "https://github.com/user/repo"
}
```

#### 5.2 Kiểm Tra Trạng Thái Export
**Endpoint:** `GET /api/export-project/[exportId]`

**Response:**
```json
{
  "success": true,
  "export": {
    "id": "export-id",
    "status": "building",
    "progress": 75,
    "downloadUrl": "https://example.com/download/export.zip",
    "buildLogs": ["Building project...", "Compiling assets..."]
  }
}
```

### 6. Authentication APIs

#### 6.1 Đăng Ký
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "name": "User Name",
  "acceptTerms": true
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 6.2 Đăng Nhập
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}
```

### 7. Payment APIs

#### 7.1 Tạo Payment Intent
**Endpoint:** `POST /api/payments`

**Request Body:**
```json
{
  "amount": 500000,
  "currency": "VND",
  "description": "Premium Plan",
  "metadata": {
    "planId": "premium-monthly",
    "features": ["ai-generation", "unlimited-projects"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "payment-id",
    "amount": 500000,
    "currency": "VND",
    "status": "pending",
    "bankTxnId": "bank-transaction-id",
    "redirectUrl": "https://bank.com/pay/...",
    "qrCode": "data:image/png;base64,..."
  }
}
```

#### 7.2 Kiểm Tra Trạng Thái Payment
**Endpoint:** `GET /api/payments/[paymentId]`

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "payment-id",
    "status": "paid",
    "paidAt": "2024-01-01T00:00:00Z",
    "amount": 500000,
    "currency": "VND"
  }
}
```

## Error Response Format

Tất cả API endpoints đều trả về error response theo format chuẩn:

```json
{
  "success": false,
  "error": "User-friendly error message",
  "errorType": "VALIDATION_ERROR|AUTH_ERROR|DATABASE_ERROR|NETWORK_ERROR|API_ERROR|UNKNOWN_ERROR",
  "details": "Technical error details (only in development)",
  "retryAfter": 300
}
```

## Authentication

Hầu hết các API endpoints yêu cầu authentication thông qua NextAuth.js session. Headers cần thiết:

```
Authorization: Bearer <session-token>
```

## Rate Limiting

- **AI Generation:** 10 requests/minute per user
- **Unsplash API:** 50 requests/hour per user
- **Project Operations:** 100 requests/minute per user

## Timeout Settings

- **Database Operations:** 8-10 seconds
- **AI Generation:** 30 seconds
- **Image Processing:** 15 seconds
- **Export Operations:** 60 seconds

## Response Headers

```
Content-Type: application/json
X-Request-ID: unique-request-id
X-Rate-Limit-Remaining: 99
X-Rate-Limit-Reset: 1640995200
``` 