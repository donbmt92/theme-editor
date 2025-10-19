# Template Engine Sync Checklist

## 📋 Tổng quan
File này ghi lại tất cả các khác biệt giữa `template-engine` và `VietnamCoffeeTheme` cần được đồng bộ để đảm bảo deploy có cùng kết quả với preview.

## ✅ Đã hoàn thành

### 1. ProjectLanguage Support
- ✅ **Hero Template** (`src/app/api/deploy-project/template-engine/template/hero.ts`)
  - Thêm localization cho title, subtitle, description, benefits
  - Hỗ trợ cả tiếng Việt và tiếng Anh
- ✅ **Problems Template** (`src/app/api/deploy-project/template-engine/template/problems.ts`)
  - Thêm localization cho about, problems, solutions, cta
  - Hỗ trợ cả tiếng Việt và tiếng Anh
- ✅ **Types** (`src/app/api/deploy-project/types.ts`)
  - Cập nhật ThemeParams interface để hỗ trợ projectLanguage

### 2. Deploy API Updates
- ✅ **Deploy Route** (`src/app/api/deploy-project/route.ts`)
  - Tự động load project data từ database
  - Merge projectLanguage vào themeParams
  - Đảm bảo deploy với data mới nhất

## 🔴 Cần sửa - HIGH PRIORITY

### 1. Templates chưa có ProjectLanguage Support

#### A. Products Template (`src/app/api/deploy-project/template-engine/template/products.ts`)
**Status:** ❌ Chưa có projectLanguage support

**Cần thêm:**
```typescript
// Get project language from themeParams
const projectLanguage = themeParams?.projectLanguage || 'vietnamese';

// Get localized text based on project language
const getLocalizedText = () => {
  if (projectLanguage === 'english') {
    return {
      title: "Our Products",
      description: "Discover unique Vietnamese coffee varieties with distinctive flavors",
      items: [
        {
          id: "1",
          name: "Vietnamese Robusta Coffee",
          description: "Vietnamese Robusta coffee with rich flavor, high caffeine content, perfect for espresso",
          price: "2.50 USD/kg",
          category: "Robusta"
        },
        // ... more items
      ],
      services: [
        {
          id: "1",
          name: "Export Consultation",
          description: "Comprehensive export process support",
          icon: "Package",
          cta: "Learn More"
        },
        // ... more services
      ]
    };
  } else {
    return {
      title: "Sản Phẩm Của Chúng Tôi",
      description: "Khám phá các loại cà phê đặc trưng của Việt Nam với hương vị độc đáo",
      // ... Vietnamese content
    };
  }
};
```

**Cần cập nhật:**
- Default product names, descriptions, prices
- Service names, descriptions, CTA buttons
- Section titles và descriptions

#### B. Testimonials Template (`src/app/api/deploy-project/template-engine/template/testimonials.ts`)
**Status:** ❌ Chưa có projectLanguage support

**Cần thêm:**
```typescript
const getLocalizedText = () => {
  if (projectLanguage === 'english') {
    return {
      title: "What Our Customers Say",
      subtitle: "Testimonials from international partners and customers",
      testimonials: [
        {
          name: "Sarah Johnson",
          title: "Coffee Buyer",
          company: "Starbucks Reserve",
          content: "Vietnamese coffee quality exceeded expectations. Rich flavor and very professional production process.",
          rating: 5
        },
        // ... more testimonials
      ],
      partners: [
        "Starbucks Reserve", "Blue Bottle Coffee", "Intelligentsia"
      ],
      stats: [
        { number: "500+", label: "Export Shipments", sublabel: "High Quality" },
        { number: "200+", label: "Trusted Customers", sublabel: "Global" },
        { number: "15+", label: "Years Experience", sublabel: "Market" },
        { number: "98%", label: "Satisfaction Rate", sublabel: "Customers" }
      ]
    };
  } else {
    // Vietnamese content
  }
};
```

#### C. Blog Template (`src/app/api/deploy-project/template-engine/template/blog.ts`)
**Status:** ❌ Chưa có projectLanguage support

**Cần thêm:**
```typescript
const getLocalizedText = () => {
  if (projectLanguage === 'english') {
    return {
      title: "Latest Industry News",
      subtitle: "Stay updated with the latest news, market trends and expertise on Vietnamese coffee export and US import market",
      categories: [
        { name: "Market", count: 15 },
        { name: "Technology", count: 12 },
        { name: "Export", count: 8 },
        { name: "Quality", count: 10 }
      ],
      featuredPost: {
        title: "Coffee Market Trends 2024",
        excerpt: "Detailed analysis of consumption trends and business opportunities in the coffee industry.",
        author: "Expert",
        date: "2024-01-15",
        category: "Market"
      },
      posts: [
        {
          title: "Coffee Export Guide",
          excerpt: "Detailed process from document preparation to successful delivery.",
          author: "Expert",
          date: "2024-01-10",
          category: "Export"
        },
        // ... more posts
      ],
      newsletter: {
        title: "Subscribe to Newsletter",
        description: "Get the latest market information and opportunities.",
        placeholder: "Your email",
        buttonText: "Subscribe"
      }
    };
  } else {
    // Vietnamese content
  }
};
```

#### D. Footer Template (`src/app/api/deploy-project/template-engine/template/footer.ts`)
**Status:** ❌ Chưa có projectLanguage support

**Cần thêm:**
```typescript
const getLocalizedText = () => {
  if (projectLanguage === 'english') {
    return {
      companyName: "Viet Coffee",
      description: "Specialized in providing high-quality coffee for international markets with commitment to quality and sustainability",
      contact: {
        phone: "+84 123 456 789",
        email: "info@capheviet.com",
        address: "123 ABC Street, District 1, Ho Chi Minh City"
      },
      quickLinks: [
        { name: "About Us", href: "#about" },
        { name: "Products", href: "#products" },
        { name: "Services", href: "#services" },
        { name: "Quality", href: "#quality" },
        { name: "Contact", href: "#contact" }
      ],
      resources: [
        { name: "Guide", href: "#guide" },
        { name: "Reports", href: "#reports" },
        { name: "Documents", href: "#docs" },
        { name: "FAQ", href: "#faq" },
        { name: "Blog", href: "#blog" }
      ],
      legal: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Cookie Policy", href: "#cookies" },
        { name: "Compliance", href: "#compliance" }
      ],
      socialLinks: [
        { icon: "Facebook", href: "#", label: "Facebook" },
        { icon: "Twitter", href: "#", label: "Twitter" },
        { icon: "Linkedin", href: "#", label: "LinkedIn" },
        { icon: "Youtube", href: "#", label: "YouTube" }
      ]
    };
  } else {
    // Vietnamese content
  }
};
```

#### E. Why Choose Us Template (`src/app/api/deploy-project/template-engine/template/why-choose-us.ts`)
**Status:** ❌ Chưa có projectLanguage support

**Cần thêm:**
```typescript
const getLocalizedText = () => {
  if (projectLanguage === 'english') {
    return {
      title: "Why Choose VietCoffee Export?",
      subtitle: "We combine Vietnamese agricultural heritage with modern export expertise to deliver exceptional value to US partners.",
      strengths: [
        { icon: "Award", title: "International Certification", description: "FDA, USDA, ISO" },
        { icon: "Globe", title: "Global Market", description: "Export to 25+ countries" },
        { icon: "Users", title: "Expert Team", description: "20+ years experience" },
        { icon: "Shield", title: "Quality Assurance", description: "Strict control system" },
        { icon: "Clock", title: "On-time Delivery", description: "Time commitment" },
        { icon: "TrendingUp", title: "Sustainable Growth", description: "Develop with partners" }
      ],
      mission: {
        title: "Mission",
        description: "Bring Vietnamese coffee value to the world, create sustainable value for partners."
      },
      vision: {
        title: "Vision",
        description: "Become the leading partner in coffee export, trusted by international markets."
      },
      cta: {
        title: "Start cooperation today",
        description: "Contact us for free consultation.",
        buttonText: "Contact Now"
      }
    };
  } else {
    // Vietnamese content
  }
};
```

#### F. Lead Magnet Template (`src/app/api/deploy-project/template-engine/template/lead-magnet.ts`)
**Status:** ❌ Chưa có projectLanguage support

**Cần thêm:**
```typescript
const getLocalizedText = () => {
  if (projectLanguage === 'english') {
    return {
      title: "Unlock Import-Export Success",
      description: "Download comprehensive guide 'Vietnamese Coffee Export Handbook 2024' - everything you need to know about successful coffee export to the US market.",
      guideTitle: "Complete Export Guide",
      guideSubtitle: "2024 Edition - 45 pages",
      formTitle: "Download Free Guide",
      formDescription: "Enter your information below to get instant access to this valuable resource.",
      buttonText: "Download Free Guide Now",
      features: [
        {
          icon: "FileText",
          title: "Complete Document List",
          description: "All forms, certifications and documents needed for FDA compliance"
        },
        {
          icon: "TrendingUp",
          title: "Market Analysis & Price Trends",
          description: "Current US coffee market data and 2024 pricing information"
        },
        {
          icon: "Shield",
          title: "Quality Standards & Testing",
          description: "Detailed requirements for US import quality standards"
        },
        {
          icon: "CheckCircle",
          title: "Step-by-step Import Process",
          description: "Clear timeline from order to warehouse delivery"
        }
      ],
      trustIndicators: [
        { number: "5,000+", label: "Downloads" },
        { number: "92%", label: "Success Rate" },
        { number: "4.9/5", label: "User Rating" }
      ]
    };
  } else {
    // Vietnamese content
  }
};
```

### 2. Styling Architecture ✅

#### A. CSS Variables vs Tailwind Classes
**Status:** ✅ Không cần đồng bộ - hai hệ thống có mục đích khác nhau

**Giải thích:**
- **Template-engine:** Sử dụng inline styles để tạo static HTML cho deploy
- **VietnamCoffeeTheme:** Sử dụng Tailwind classes cho React components preview
- Hai hệ thống hoạt động độc lập và phù hợp với mục đích riêng

#### B. Typography Styles
**Status:** ✅ Đã đồng bộ về mặt chức năng

**Giải thích:**
- Template-engine sử dụng JavaScript functions để generate styles
- VietnamCoffeeTheme sử dụng Tailwind classes với conditional styling
- Cả hai đều hỗ trợ đầy đủ font customization

#### C. Spacing và Layout
**Status:** ✅ Đã đồng bộ về mặt chức năng

**Giải thích:**
- Template-engine sử dụng CSS values trực tiếp
- VietnamCoffeeTheme sử dụng Tailwind spacing system
- Cả hai đều tạo ra layout tương tự

### 3. Customization Options

#### A. Font Customization
**Status:** ✅ Template-engine hỗ trợ đầy đủ, ❌ VietnamCoffeeTheme hỗ trợ một phần

**Cần sửa trong VietnamCoffeeTheme:**
```typescript
// Thêm hỗ trợ đầy đủ font customization
const getFontFamily = (fontType: string) => {
  const fontName = content?.[fontType] || "inter";
  // Implement font mapping logic
};

const getFontSize = (sizeType: string) => {
  const size = content?.[sizeType];
  // Implement size mapping logic
};

const getFontWeight = (weightType: string) => {
  const weight = content?.[weightType];
  // Implement weight mapping logic
};
```

#### B. Size Customization
**Status:** ✅ Template-engine hỗ trợ đầy đủ, ❌ VietnamCoffeeTheme hỗ trợ một phần

**Cần sửa:**
- Đảm bảo VietnamCoffeeTheme hỗ trợ đầy đủ size system (xs, sm, base, lg, xl, 2xl, 3xl)
- Đồng bộ size mapping giữa hai hệ thống

### 4. Interface Types

#### A. ThemeParams Interface
**Status:** ✅ Template-engine đã có projectLanguage, ❌ VietnamCoffeeTheme chưa có

**Cần sửa trong `src/types/index.ts`:**
```typescript
export interface ThemeParams {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    headingSize?: string;
    bodySize?: string;
    lineHeight?: string;
    fontWeight?: string;
  };
  layout?: {
    containerWidth?: string;
    sectionSpacing?: string;
    spacing?: string;
    borderRadius?: string;
  };
  components?: {
    button?: {
      style?: string;
      size?: string;
      rounded?: boolean;
    };
    // ... other components
  };
  content?: any;
  projectLanguage?: string; // ← Cần thêm này
}
```

#### B. Content Interfaces
**Status:** ❌ Không đồng bộ giữa template-engine và VietnamCoffeeTheme

**Cần sửa:**
- Đồng bộ interface structure
- Centralized content interfaces
- Consistent content merging strategy

### 5. Technical Issues

#### A. Linting Errors
**Status:** ❌ 11 linting warnings trong template-engine

**Cần sửa:**
```typescript
// Thay thế any types
interface ProblemsContentExtended {
  [key: string]: string | number | boolean | undefined | Array<any> | object
  // ↓ Cần thay bằng specific types
  [key: string]: string | number | boolean | undefined | Array<ProblemItem> | ProblemContent | SolutionContent
}

// Sửa unused variables
.map((benefit, index) => ` // ← Remove unused index
  // ... template code
`)
```

#### B. Type Safety
**Status:** ❌ Nhiều any types trong cả hai hệ thống

**Cần sửa:**
- Replace all `any` types với specific interfaces
- Improve type safety
- Add proper type guards

## 🟡 MEDIUM PRIORITY

### 1. Centralized Default Content
**Vấn đề:** Default content được hardcode ở nhiều nơi

**Cần tạo:**
```typescript
// src/lib/default-content.ts
export const DEFAULT_CONTENT = {
  vietnamese: {
    hero: { /* Vietnamese hero content */ },
    problems: { /* Vietnamese problems content */ },
    // ... all sections
  },
  english: {
    hero: { /* English hero content */ },
    problems: { /* English problems content */ },
    // ... all sections
  }
};
```

### 2. Content Merging Strategy
**Vấn đề:** Merge logic không nhất quán

**Cần tạo:**
```typescript
// src/lib/content-merger.ts
export function mergeContent(defaultContent: any, customContent: any, language: string) {
  // Consistent merging logic
}
```

## 🟢 LOW PRIORITY

### 1. Performance Optimization
- Optimize template generation
- Reduce bundle size
- Improve rendering performance

### 2. Documentation
- Add JSDoc comments
- Create usage examples
- Update API documentation

## 📝 Checklist để kiểm tra

### Templates cần ProjectLanguage Support:
- [x] Products Template ✅
- [x] Testimonials Template ✅
- [x] Blog Template ✅
- [x] Footer Template ✅
- [x] Why Choose Us Template ✅
- [x] Lead Magnet Template ✅

### Styling cần đồng bộ:
- [x] CSS Variables vs Tailwind Classes ✅
- [x] Typography Styles ✅
- [x] Spacing và Layout ✅
- [ ] Color System

### Customization cần đồng bộ:
- [ ] Font Customization
- [ ] Size Customization
- [ ] Color Customization
- [ ] Layout Customization

### Technical Issues:
- [x] Sửa linting errors ✅
- [x] Improve type safety ✅
- [ ] Đồng bộ interfaces
- [ ] Centralized content

## 🎯 Thứ tự ưu tiên

1. **HIGH PRIORITY:** ✅ Thêm projectLanguage vào các template còn lại
2. **HIGH PRIORITY:** ✅ Đồng bộ styling giữa static CSS và Tailwind
3. **HIGH PRIORITY:** ✅ Sửa linting errors
4. **MEDIUM PRIORITY:** Đồng bộ customization options
5. **MEDIUM PRIORITY:** Đồng bộ interface types
6. **LOW PRIORITY:** Performance optimization và documentation

---

**Lưu ý:** File này sẽ được cập nhật khi hoàn thành từng phần. Đánh dấu ✅ khi hoàn thành, ❌ khi chưa hoàn thành.
