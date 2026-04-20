# Error Handling Guide

## Overview

Theme Editor đã được trang bị hệ thống xử lý lỗi toàn diện để đảm bảo trải nghiệm người dùng mượt mà và thông báo lỗi rõ ràng. Hệ thống này bao gồm retry logic, error categorization, và user-friendly notifications.

## Features

- **Retry Logic với Exponential Backoff**: Tự động retry khi gặp lỗi tạm thời
- **Error Categorization**: Phân loại và xử lý các loại lỗi khác nhau
- **User-friendly Notifications**: Toast notifications thay thế alert boxes
- **Graceful Degradation**: Ứng dụng vẫn hoạt động khi một số service không khả dụng
- **Development vs Production**: Error details khác nhau theo môi trường

## Error Handling trong AI Generation

### Retry Logic
```typescript
let retryCount = 0
const maxRetries = 3

while (retryCount < maxRetries) {
  try {
    result = await model.generateContent(prompt)
    break // Success
  } catch (aiError) {
    retryCount++
    
    if (retryCount >= maxRetries) {
      // Handle final failure
    }
    
    // Exponential backoff: 1s, 2s, 4s
    const waitTime = Math.pow(2, retryCount) * 1000
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }
}
```

### Error Types

#### 1. AI Service Overloaded (503)
```json
{
  "success": false,
  "error": "Dịch vụ AI đang quá tải. Vui lòng thử lại sau vài phút.",
  "errorType": "AI_OVERLOADED",
  "retryAfter": 300
}
```

#### 2. Quota Exceeded (429)
```json
{
  "success": false,
  "error": "Đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau.",
  "errorType": "QUOTA_EXCEEDED", 
  "retryAfter": 3600
}
```

#### 3. General AI Error (500)
```json
{
  "success": false,
  "error": "Có lỗi xảy ra khi tạo nội dung. Vui lòng thử lại.",
  "errorType": "AI_ERROR",
  "details": "Error details (development only)"
}
```

## Error Handling trong Unsplash API

### API Key Validation
```typescript
if (!process.env.UNSPLASH_ACCESS_KEY) {
  console.warn('Unsplash API key not configured')
  return null
}
```

### Specific Error Handling
```typescript
if (result.errors) {
  if (result.errors.some(error => error.includes('rate limit'))) {
    console.warn('Unsplash rate limit exceeded')
  } else if (result.errors.some(error => error.includes('unauthorized'))) {
    console.error('Unsplash API unauthorized - check access key')
  }
}
```

### Network Error Handling
```typescript
catch (error: any) {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    console.error('Network error when fetching from Unsplash')
  } else if (error.status === 403) {
    console.error('Unsplash API access forbidden')
  } else if (error.status === 429) {
    console.error('Unsplash rate limit exceeded')
  }
}
```

## React Hooks Error Handling

### useUnsplashImage Hook
```typescript
const { imageUrl, isLoading, error } = useUnsplashImage(customImage, {
  query: 'coffee shop',
  fallbackImage: '/default.jpg'
})

// Error states được handle tự động:
if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage message={error} />
if (imageUrl) return <Image src={imageUrl} />
return <DefaultIcon />
```

### Error Types trong Hooks
- `"Rate limit exceeded. Please try again later."` (429)
- `"Unsplash service temporarily unavailable."` (503) 
- `"Unsplash API authentication failed."` (401)
- `"Network connection failed"` (Network errors)
- `"Request was cancelled"` (AbortError)
- `"Request timed out"` (Timeout)

## Toast Notification System

### Toast Component
```typescript
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()

// Success notification
toast({
  title: "Thành công!",
  description: "Project đã được tạo thành công.",
  variant: "success"
})

// Error notification  
toast({
  title: "Lỗi kết nối",
  description: "Không thể kết nối đến server.",
  variant: "destructive"
})

// Warning notification
toast({
  title: "Cảnh báo",
  description: "Dịch vụ đang tạm thời không khả dụng.",
  variant: "warning"
})
```

### Toast Variants
- `success`: Màu xanh lá, icon CheckCircle
- `destructive`: Màu đỏ, icon AlertCircle  
- `warning`: Màu vàng, icon AlertTriangle
- `info`: Màu xanh dương, icon Info
- `default`: Màu mặc định

## Error Handling Best Practices

### 1. Progressive Enhancement
```typescript
// Always provide fallbacks
{imageUrl ? (
  <Image src={imageUrl} alt="Product" />
) : (
  <DefaultIcon />
)}
```

### 2. User-Friendly Messages
```typescript
// Bad: Technical error messages
"Error: NetworkError when attempting to fetch resource"

// Good: User-friendly messages  
"Không thể kết nối đến server. Vui lòng thử lại."
```

### 3. Retry with Exponential Backoff
```typescript
const waitTime = Math.pow(2, retryCount) * 1000 // 1s, 2s, 4s
await new Promise(resolve => setTimeout(resolve, waitTime))
```

### 4. Error Logging
```typescript
// Development: Detailed logs
console.error('API Error:', error.message, error.stack)

// Production: User-friendly messages only
console.error('API Error occurred')
```

## Error Recovery Strategies

### 1. Automatic Retry
- AI API: 3 attempts với exponential backoff
- Network errors: Automatic retry
- Rate limits: Respect retry-after headers

### 2. Fallback Content
- Unsplash images → Default icons
- AI content → Template defaults
- API failures → Local storage cache

### 3. Graceful Degradation
- Missing images → Show placeholders
- API unavailable → Disable features temporarily
- Network issues → Offline mode indicators

## Monitoring và Debugging

### Error Logging
```typescript
// Console logging với context
console.error(`Failed to load image for theme ${theme.name}:`, error)

// Error categorization
if (error.status === 429) {
  console.warn('Rate limit hit - consider caching')
}
```

### Development Tools
```typescript
// Development-only error details
{
  error: "User-friendly message",
  details: process.env.NODE_ENV === 'development' ? error.stack : undefined
}
```

### Performance Monitoring
```typescript
// Track retry attempts
console.log(`Attempting to generate content (attempt ${retryCount + 1}/${maxRetries})`)

// Track timing
const startTime = Date.now()
// ... operation
console.log(`Operation took ${Date.now() - startTime}ms`)
```

## Common Error Scenarios

### 1. AI Service Overloaded
**Symptom**: 503 errors từ Google Gemini
**Solution**: Retry với exponential backoff, inform user về wait time

### 2. Unsplash Rate Limit
**Symptom**: 429 errors từ Unsplash API  
**Solution**: Cache images, reduce requests, inform user

### 3. Network Connectivity Issues
**Symptom**: TypeError fetch errors
**Solution**: Retry logic, offline indicators, cached content

### 4. Invalid API Keys
**Symptom**: 401/403 errors
**Solution**: Validate keys, graceful fallbacks, clear error messages

## Testing Error Handling

### Unit Tests
```typescript
// Test retry logic
it('should retry on 503 errors', async () => {
  // Mock API to return 503 then success
  // Verify retry attempts
})

// Test error boundaries
it('should not crash on API errors', async () => {
  // Mock API failures
  // Verify graceful degradation
})
```

### Manual Testing
- Disconnect internet → Test offline behavior
- Invalid API keys → Test fallback behavior  
- Rate limit simulation → Test retry logic

## Future Enhancements

- [ ] Error analytics và reporting
- [ ] Advanced retry strategies (circuit breaker)
- [ ] Offline mode với service workers
- [ ] Error boundary components
- [ ] Custom error pages
- [ ] User feedback collection on errors 