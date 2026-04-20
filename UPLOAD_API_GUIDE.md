# Upload API Guide

## Tổng quan

API upload được tạo để lưu trữ hình ảnh từ editor. Hình ảnh sẽ được lưu trong thư mục `public/uploads/` và có thể truy cập thông qua URL `/uploads/{fileName}`.

## API Endpoints

### 1. Upload Image

**Endpoint:** `POST /api/upload`

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: FormData với field `file`

**Response:**
```json
{
  "success": true,
  "url": "/uploads/1234567890-abc123.jpg",
  "fileName": "1234567890-abc123.jpg",
  "size": 1024000,
  "type": "image/jpeg"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed"
}
```

### 2. Delete Image

**Endpoint:** `DELETE /api/upload/{fileName}`

**Request:**
- Method: `DELETE`
- Path: `{fileName}` - tên file cần xóa

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Cấu hình

### File Types Allowed
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### File Size Limit
- Maximum: 5MB

### Storage Location
- Local: `public/uploads/`
- URL: `/uploads/{fileName}`

## Sử dụng trong Component

### Hook useUpload

```typescript
import { useUpload } from '@/hooks/use-upload'

const { isUploading, error, upload } = useUpload({
  onSuccess: (url) => {
    console.log('Upload successful:', url)
  },
  onError: (error) => {
    console.error('Upload failed:', error)
  }
})

// Upload file
const handleFileSelect = async (file: File) => {
  const url = await upload(file)
  if (url) {
    // File uploaded successfully
  }
}
```

### Component ImageUpload

```typescript
import ImageUpload from '@/components/ui/image-upload'

<ImageUpload
  value={imageUrl}
  onChange={(url) => setImageUrl(url)}
  placeholder="Upload hero image"
  recommendedSize="1920x1080"
  aspectRatio="16:9"
/>
```

## Bảo mật

1. **File Type Validation**: Chỉ cho phép các định dạng hình ảnh an toàn
2. **File Size Limit**: Giới hạn kích thước file để tránh tấn công
3. **Unique Filename**: Tạo tên file unique để tránh conflict
4. **Error Handling**: Xử lý lỗi một cách an toàn

## Deployment

### Local Development
- Files được lưu trong `public/uploads/`
- Thư mục được tạo tự động khi cần

### Production
- Cần cấu hình storage service (AWS S3, Cloudinary, etc.)
- Cập nhật `UPLOAD_CONFIG` trong `src/lib/upload.ts`
- Đảm bảo thư mục uploads có quyền ghi

## Troubleshooting

### Lỗi thường gặp

1. **"File size too large"**
   - Giảm kích thước file xuống dưới 5MB

2. **"Invalid file type"**
   - Chỉ sử dụng JPEG, PNG, GIF, WebP

3. **"Upload failed"**
   - Kiểm tra quyền ghi thư mục uploads
   - Kiểm tra disk space

### Debug

```typescript
// Enable debug logging
console.log('Upload config:', UPLOAD_CONFIG)
console.log('File info:', { name: file.name, size: file.size, type: file.type })
``` 