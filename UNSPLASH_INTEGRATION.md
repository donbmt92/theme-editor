# Unsplash API Integration Guide

## Overview

The Theme Editor now includes full integration with the Unsplash API to provide dynamic, high-quality images for themes and components. This integration automatically fetches relevant images when no custom images are provided.

## Features

- **Dynamic Theme Preview Images**: Templates page automatically loads relevant images from Unsplash based on theme names
- **Product Images**: Coffee shop theme can display dynamic product images when no custom images are provided
- **Hero Background Images**: Automatic hero section backgrounds for themes
- **Smart Caching**: Prevents repeated API calls for the same themes
- **Fallback Support**: Gracefully falls back to icons or default images when Unsplash is unavailable

## Setup

### 1. Environment Configuration

Add your Unsplash API key to your `.env` file:

```env
UNSPLASH_ACCESS_KEY="your-unsplash-access-key"
```

Get your access key from [Unsplash Developers](https://unsplash.com/developers).

### 2. API Endpoints

The integration provides several API endpoints:

- `POST /api/unsplash/theme-image` - Get theme-specific images
- `GET /api/unsplash/random?query=coffee` - Get random photos by query
- `POST /api/unsplash/random` - Get random photos with JSON payload

### 3. React Hooks

Use the provided hooks in your components:

```tsx
import { useUnsplashImage, useProductImage, useHeroImage } from '@/hooks/use-unsplash-image'

// Generic hook
const { imageUrl, isLoading, error } = useUnsplashImage(customImage, {
  query: 'coffee shop',
  fallbackImage: '/default.jpg'
})

// Specific hooks
const productImage = useProductImage(product.image, product.name)
const heroImage = useHeroImage(hero.backgroundImage, 'coffee business')
```

## Usage Examples

### Templates Page

The templates page automatically fetches Unsplash images:

```tsx
// Automatic theme preview images
{themes.map((theme) => (
  <Card key={theme.id}>
    {theme.unsplashImageUrl ? (
      <Image src={theme.unsplashImageUrl} alt={theme.name} />
    ) : (
      <EyeIcon />
    )}
  </Card>
))}
```

### Product Components

Products automatically get relevant images:

```tsx
<ProductImage
  image={product.image}
  productName={product.name}
  index={index}
  primaryColor={theme.colors.primary}
  borderRadiusClass={getBorderRadiusClass()}
/>
```

### Hero Sections

Hero backgrounds can be dynamic:

```tsx
const { imageUrl } = useHeroImage(content.backgroundImage, 'coffee shop interior')
```

## Theme-Specific Queries

The system automatically maps theme names to relevant search queries:

- `vietnam-coffee` → "coffee shop vietnam"
- `restaurant` → "restaurant food"
- `business` → "modern business"
- `portfolio` → "creative portfolio"
- `ecommerce` → "online store shopping"
- `blog` → "blog writing content"
- `agency` → "digital agency office"
- `landing` → "startup business"

## Attribution

The integration automatically adds Unsplash attribution overlays to images as required by Unsplash guidelines:

```tsx
{!image && (
  <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
    Unsplash
  </div>
)}
```

## Best Practices

1. **Always provide fallbacks**: Don't rely solely on Unsplash availability
2. **Cache images**: The system caches theme images to reduce API calls
3. **Use specific queries**: More specific search terms yield better results
4. **Monitor API limits**: Unsplash has rate limits on their free tier
5. **Attribution**: Always include proper attribution when required

## Performance Considerations

- Images are loaded progressively to avoid blocking the UI
- Caching reduces repeated API calls for the same themes
- Loading states provide good user experience
- Error handling ensures graceful degradation

## API Guidelines Compliance

This integration follows Unsplash API guidelines:

- ✅ Proper attribution when required
- ✅ Hotlinking images directly from Unsplash CDN
- ✅ Download tracking (when implemented)
- ✅ Rate limit respect with caching

## Troubleshooting

### Common Issues

1. **No images loading**: Check your `UNSPLASH_ACCESS_KEY` environment variable
2. **Rate limits**: Implement additional caching or upgrade your Unsplash plan
3. **Wrong images**: Adjust the theme query mappings in `src/lib/unsplash.ts`

### Debug Mode

Enable console logging to debug image fetching:

```tsx
console.log('Fetching image for:', themeName, 'with query:', query)
```

## Future Enhancements

- [ ] Download tracking implementation
- [ ] More granular image categories
- [ ] User-customizable search queries
- [ ] Image quality options
- [ ] Advanced caching with Redis
- [ ] Batch image loading optimization 