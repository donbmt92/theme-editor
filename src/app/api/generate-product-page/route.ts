import { NextRequest, NextResponse } from 'next/server'
import { executeAIRequestWithRetry } from '@/lib/ai-request-handler'

export async function POST(req: NextRequest) {
    try {
        const { product, themeParams } = await req.json()

        if (!product) {
            return NextResponse.json({ error: 'Product is required' }, { status: 400 })
        }

        // Get language from themeParams, default to 'english' for B2B export
        const language = themeParams?.projectLanguage || 'english'

        // Language-specific instructions
        const languageInstructions: Record<string, string> = {
            'vietnamese': 'Generate ALL content in Vietnamese language. Use professional Vietnamese business terminology.',
            'english': 'Generate ALL content in English language. Use professional business terminology.',
            'chinese': 'Generate ALL content in Chinese (Simplified) language. Use professional business terminology.',
            'japanese': 'Generate ALL content in Japanese language. Use professional business terminology.',
        }

        const languageInstruction = languageInstructions[language] || languageInstructions['english']

        const prompt = `${languageInstruction}

Generate comprehensive B2B product page content in JSON format for the following product:

Product Name: ${product.name}
Category: ${product.category || 'General'}
Description: ${product.description}
Price: ${product.price || 'Contact for pricing'}

Generate content for a professional B2B export product page with these 13 sections:

1. **hero**: 
   - title: SEO-optimized product title (include product name + Manufacturer & Exporter)
   - subtitle: Professional tagline highlighting expertise
   - usps: Array of 3-5 unique selling points (ISO certification, MOQ, export experience, etc.)

2. **overview**:
   - description: 2-3 sentences describing core value proposition
   - highlights: Array of 4 key highlights with icon, label, value (Application, Target Industries, Export Markets, MOQ)

3. **features**: Array of 6-8 product features
   - Each with: title, description (benefits-focused), icon name (from lucide-react)

4. **specs**:
   - title: "Technical Specifications"
   - specifications: Array of 8-12 spec items (label: value pairs like "Material: Stainless Steel")
   - customizationOptions: Array of 3-5 customization options available

5. **applications**:
   - title: "Applications & Use Cases"
   - applications: Array of 3-4 industries/use cases with industry name, description, icon

6. **certifications**:
   - certifications: Array of 3-5 relevant certifications (name, description)
   - qcProcess: Array of 4-5 quality control steps (step number, title, description)

7. **oem**:
   - title: "OEM/ODM Capabilities"
   - capabilities: Array of 4-6 capabilities (icon, title, description about custom manufacturing)

8. **packaging**:
   - packagingSpecs: Array of 5-7 packaging specifications (label: value)
   - shippingMethods: Array of 3-4 shipping methods (icon, method name, description)
   - incoterms: Array of 3-5 supported Incoterms (e.g., "FOB", "CIF", "EXW")

9. **whyChoose** (Why Choose Us):
   - metrics: Array of 4 impressive metrics (icon, value, label like "15+ Years Experience")
   - strengths: Array of 4-5 key strengths as short bullet points

10. **leadMagnet**:
    - title: "Download Product Catalog & Technical Datasheet"
    - benefits: Array of 4 benefits of downloading

11. **rfq** (Request for Quotation):
    - title: "Request a Quick Quote"
    - benefits: Array of 3-4 benefits of requesting quote

12. **cta**:
    - title: Strong call-to-action title
    - subtitle: Compelling subtitle
    - buttonText: Action-oriented button text
    - benefits: Array of 3 benefits of taking action

13. **enabled**: true
14. **selectedProductId**: "${product.id}"

IMPORTANT:
- ${languageInstruction}
- ALL text fields (titles, descriptions, labels, etc.) MUST be in ${language === 'vietnamese' ? 'Vietnamese' : language === 'english' ? 'English' : language === 'chinese' ? 'Chinese' : 'Japanese'} language
- Use professional B2B export business language
- Focus on international buyers (US, EU, Global markets)
- Include realistic technical details based on product category
- Use appropriate lucide-react icon names (Package, Shield, Truck, Settings, etc.)
- Ensure all descriptions are benefit-focused and sales-oriented
- Keep tone professional but approachable
- Include realistic metrics and certifications

Return ONLY valid JSON with this exact structure. No markdown, no code blocks, just JSON.`

        // Use the project's AI request handler with retry logic
        const aiResult = await executeAIRequestWithRetry(prompt)

        if (!aiResult.success) {
            console.error('AI generation failed:', aiResult.error)
            return NextResponse.json(
                { error: aiResult.error || 'Failed to generate content' },
                { status: 500 }
            )
        }

        // Clean the response to extract JSON
        let cleanedText = (aiResult.text || '').trim()
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?$/g, '')
        } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/```\n?/g, '')
        }

        const productPageData = JSON.parse(cleanedText)
        console.log(productPageData);

        return NextResponse.json({
            success: true,
            productPageData,
            responseTime: aiResult.responseTime
        })

    } catch (error) {
        console.error('Generate product page error:', error)
        return NextResponse.json(
            { error: 'Failed to generate product page content' },
            { status: 500 }
        )
    }
}
