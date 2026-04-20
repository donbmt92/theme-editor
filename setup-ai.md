# 🚀 Quick Setup - AI Content Generator

## Step 1: Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

## Step 2: Setup Environment

Create `.env.local` file in the `theme-editor` folder:

```bash
# Copy this content to theme-editor/.env.local

# Database
DATABASE_URL="file:./dev.db"

# Auth  
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini AI (REQUIRED for AI features)
GOOGLE_GEMINI_API_KEY="paste-your-api-key-here"

# Payment (optional for AI features)
SEPAY_API_KEY="your-sepay-api-key"  
SEPAY_WEBHOOK_SECRET="your-sepay-webhook-secret"
```

## Step 3: Start Development Server

```bash
cd theme-editor
npm install
npm run dev
```

## Step 4: Test AI Feature

1. Open http://localhost:3000
2. Go to theme editor: `/editor/[themeId]`
3. Click the purple "AI Tạo Nội Dung" button
4. Fill in business information
5. Click "Tạo nội dung AI"
6. Preview and apply the generated content

## Example Business Info for Testing

**Company:** Cà Phê Việt Plus  
**Industry:** Xuất khẩu cà phê  
**Description:** Chuyên cung cấp cà phê Robusta và Arabica chất lượng cao cho thị trường quốc tế với 15 năm kinh nghiệm  
**Target Audience:** Nhà nhập khẩu cà phê quốc tế  
**Services:** Xuất khẩu cà phê nguyên chất, cà phê rang xay, tư vấn chất lượng  
**Location:** TP. Hồ Chí Minh, Việt Nam  
**Tone:** Chuyên nghiệp  
**Language:** Tiếng Việt  

This will generate professional coffee export content with appropriate brown/orange color scheme!

## ✨ What AI Generates

- **Colors:** Industry-appropriate color palette
- **Content:** Professional copy for all website sections
- **SEO:** Meta tags and descriptions
- **Structure:** Complete website content structure

## 🆘 Need Help?

Check `AI_INTEGRATION_GUIDE.md` for detailed documentation and troubleshooting. 