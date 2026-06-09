import { renderLucideIcon } from '../icons'

type LibrarySectionType =
  | 'trustBar'
  | 'targetBuyers'
  | 'buyerProblem'
  | 'solutionOverview'
  | 'process'
  | 'proof'
  | 'faq'
  | 'finalCta'

interface LibrarySectionItem {
  id?: string
  icon?: string
  title?: string
  description?: string
  label?: string
  value?: string
  image?: string
}

interface LibrarySectionContent {
  type?: LibrarySectionType
  variant?: string
  title?: string
  description?: string
  badge?: string
  buttonText?: string
  secondaryButtonText?: string
  backgroundColor?: string
  textColor?: string
  items?: LibrarySectionItem[]
  faqs?: Array<{ id?: string; question?: string; answer?: string }>
}

interface LibrarySectionParams {
  type: LibrarySectionType
  content?: LibrarySectionContent
  themeParams: any
}

const defaults: Record<LibrarySectionType, LibrarySectionContent> = {
  trustBar: {
    title: 'Trusted by export-ready businesses',
    items: [
      { value: '15+', label: 'Years export experience' },
      { value: '500+', label: 'Shipments supported' },
      { value: '98%', label: 'On-time documentation' },
    ],
  },
  targetBuyers: {
    title: 'Built for serious buyers',
    description: 'Clear value for importers, distributors, private-label brands, and sourcing teams.',
    items: [
      { icon: 'Store', title: 'Importers', description: 'Reliable supply and export documentation.' },
      { icon: 'Building2', title: 'Distributors', description: 'Consistent quality for repeat orders.' },
      { icon: 'PackageCheck', title: 'Private label', description: 'Flexible packaging and OEM support.' },
    ],
  },
  buyerProblem: {
    badge: 'Buyer challenge',
    title: 'Buying from overseas should not feel risky',
    description: 'Most buyers struggle with unclear quality, slow samples, weak documentation, and limited visibility after deposit.',
    items: [
      { title: 'Unclear quality', description: 'Samples and production batches do not always match.' },
      { title: 'Slow paperwork', description: 'Export documents are often prepared too late.' },
      { title: 'Low visibility', description: 'Buyers need clearer production and shipment updates.' },
    ],
  },
  solutionOverview: {
    badge: 'Our approach',
    title: 'A cleaner path from sample to shipment',
    description: 'We combine sourcing, quality control, documentation, and logistics support into one practical workflow.',
    items: [
      { icon: 'SearchCheck', title: 'Source', description: 'Match products to buyer requirements.' },
      { icon: 'ShieldCheck', title: 'Verify', description: 'Check quality before production and shipment.' },
      { icon: 'Ship', title: 'Deliver', description: 'Coordinate documents, packing, and export timeline.' },
    ],
  },
  process: {
    title: 'Simple export workflow',
    description: 'A transparent process from the first brief to the final shipment.',
    items: [
      { value: '01', title: 'Brief', description: 'Confirm product, specs, target market, and timeline.' },
      { value: '02', title: 'Sample', description: 'Prepare samples and align quality expectations.' },
      { value: '03', title: 'Produce', description: 'Track production, QC, packing, and documentation.' },
      { value: '04', title: 'Ship', description: 'Coordinate export handoff and post-shipment updates.' },
    ],
  },
  proof: {
    variant: 'caseStudyWithGallery',
    badge: 'Proof',
    title: 'Export-ready results buyers can verify',
    description: 'Use this section for factory proof, shipment evidence, certificates, or a compact case study.',
    items: [
      { image: 'https://placehold.co/640x420?text=Factory', title: 'Factory audit', description: 'Verified production capability.' },
      { image: 'https://placehold.co/640x420?text=QC', title: 'Quality check', description: 'Documented inspection process.' },
      { image: 'https://placehold.co/640x420?text=Shipment', title: 'Shipment', description: 'Export packing and delivery handoff.' },
    ],
  },
  faq: {
    title: 'Frequently asked questions',
    description: 'Give buyers quick answers before they contact your team.',
    faqs: [
      { question: 'What is your minimum order quantity?', answer: 'MOQ depends on product type and packaging. We can confirm it after reviewing your brief.' },
      { question: 'Can you support export documents?', answer: 'Yes. We can help prepare commercial documents and coordinate required certificates.' },
      { question: 'Do you offer samples?', answer: 'Yes. Samples can be arranged before production so quality and specs are aligned.' },
    ],
  },
  finalCta: {
    variant: 'formRight',
    title: 'Ready to discuss your next order?',
    description: 'Share your product requirements and we will help map the next practical step.',
    buttonText: 'Request consultation',
    secondaryButtonText: 'View products',
  },
}

function esc(value?: string | number) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function mergeContent(type: LibrarySectionType, content?: LibrarySectionContent): LibrarySectionContent {
  return {
    ...defaults[type],
    ...(content || {}),
    items: content?.items || defaults[type].items,
    faqs: content?.faqs || defaults[type].faqs,
  }
}

function colors(themeParams: any, content: LibrarySectionContent, fallbackBackground = '#FFFFFF') {
  return {
    primary: themeParams?.colors?.primary || '#8B4513',
    accent: themeParams?.colors?.accent || '#CD853F',
    text: content.textColor || themeParams?.colors?.text || '#2D3748',
    background: content.backgroundColor || fallbackBackground,
    containerWidth: themeParams?.layout?.containerWidth || '1200px',
    fontFamily: themeParams?.typography?.fontFamily || 'Inter, sans-serif',
  }
}

function header(content: LibrarySectionContent, themeParams: any, centered = true) {
  const c = colors(themeParams, content)
  return `<div style="${centered ? 'text-align:center;margin:0 auto 3rem;' : 'margin-bottom:2.5rem;'}max-width:760px;">
    ${content.badge ? `<div style="display:inline-flex;margin-bottom:1rem;padding:.25rem .75rem;border-radius:999px;background:${c.primary}14;color:${c.primary};font-weight:600;font-size:.875rem;">${esc(content.badge)}</div>` : ''}
    <h2 style="margin:0 0 1rem;color:${c.primary};font-size:2.25rem;line-height:1.15;font-weight:800;">${esc(content.title)}</h2>
    ${content.description ? `<p style="margin:0;color:${c.text};opacity:.78;font-size:1.125rem;line-height:1.7;">${esc(content.description)}</p>` : ''}
  </div>`
}

function sectionShell(content: LibrarySectionContent, themeParams: any, inner: string, fallbackBackground = '#FFFFFF') {
  const c = colors(themeParams, content, fallbackBackground)
  return `<section style="padding:5rem 0;background:${c.background};color:${c.text};font-family:${c.fontFamily};">
    <div style="max-width:${c.containerWidth};margin:0 auto;padding:0 1rem;">${inner}</div>
  </section>`
}

export function generateStaticLibrarySection({ type, content, themeParams }: LibrarySectionParams): string {
  const data = mergeContent(type, content)
  const c = colors(themeParams, data)

  switch (type) {
    case 'trustBar':
      return `<section style="padding:2rem 0;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;background:${data.backgroundColor || '#FFFFFF'};color:${c.text};font-family:${c.fontFamily};">
        <div style="max-width:${c.containerWidth};margin:0 auto;padding:0 1rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1.5rem;align-items:center;">
          <h2 style="margin:0;color:${c.primary};font-size:1.25rem;">${esc(data.title)}</h2>
          ${(data.items || []).map(item => `<div style="text-align:center;"><div style="color:${c.accent};font-size:2rem;font-weight:800;">${esc(item.value)}</div><div style="font-size:.875rem;opacity:.75;">${esc(item.label)}</div></div>`).join('')}
        </div>
      </section>`

    case 'targetBuyers':
    case 'solutionOverview':
      return sectionShell(data, themeParams, `${header(data, themeParams)}
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;">
          ${(data.items || []).map(item => `<div style="padding:1.75rem;border:1px solid #e5e7eb;border-radius:.5rem;background:#fff;box-shadow:0 8px 24px rgba(15,23,42,.06);">
            <div style="width:2.5rem;height:2.5rem;margin-bottom:1rem;color:${c.primary};">${renderLucideIcon(item.icon || 'CheckCircle', 40)}</div>
            <h3 style="margin:0 0 .5rem;font-size:1.25rem;color:${c.text};">${esc(item.title)}</h3>
            <p style="margin:0;line-height:1.65;opacity:.75;">${esc(item.description)}</p>
          </div>`).join('')}
        </div>`, type === 'targetBuyers' ? '#F8F9FA' : '#F8F9FA')

    case 'buyerProblem':
      return sectionShell(data, themeParams, `<div style="display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:2.5rem;align-items:start;">
        ${header(data, themeParams, false)}
        <div style="display:grid;gap:1rem;">
          ${(data.items || []).map(item => `<div style="border:1px solid #e5e7eb;border-radius:.5rem;padding:1.25rem;background:#fff;">
            <h3 style="margin:0 0 .5rem;color:${c.text};">${esc(item.title)}</h3>
            <p style="margin:0;line-height:1.65;opacity:.75;">${esc(item.description)}</p>
          </div>`).join('')}
        </div>
      </div>`)

    case 'process':
      return sectionShell(data, themeParams, `${header(data, themeParams)}
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1.25rem;">
          ${(data.items || []).map((item, index) => `<div style="border:1px solid #e5e7eb;border-radius:.5rem;padding:1.5rem;background:#fff;">
            <div style="margin-bottom:1rem;color:${c.primary};font-size:2.25rem;font-weight:800;">${esc(item.value || String(index + 1).padStart(2, '0'))}</div>
            <h3 style="margin:0 0 .5rem;color:${c.text};">${esc(item.title)}</h3>
            <p style="margin:0;font-size:.95rem;line-height:1.65;opacity:.75;">${esc(item.description)}</p>
          </div>`).join('')}
        </div>`)

    case 'proof': {
      const gallery = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;">
        ${(data.items || []).map(item => `<div style="overflow:hidden;border:1px solid #e5e7eb;border-radius:.5rem;background:#fff;">
          <img src="${esc(item.image || 'https://placehold.co/640x420?text=Proof')}" alt="${esc(item.title || 'Proof')}" style="width:100%;height:180px;object-fit:cover;">
          <div style="padding:1rem;"><h3 style="margin:0 0 .35rem;color:${c.text};">${esc(item.title)}</h3><p style="margin:0;font-size:.9rem;opacity:.72;">${esc(item.description)}</p></div>
        </div>`).join('')}
      </div>`
      return sectionShell(data, themeParams, data.variant === 'galleryFirst' ? `${gallery}${header(data, themeParams)}` : `${header(data, themeParams)}${gallery}`, '#F8F9FA')
    }

    case 'faq':
      return sectionShell(data, themeParams, `${header(data, themeParams)}
        <div style="max-width:760px;margin:0 auto;display:grid;gap:1rem;">
          ${(data.faqs || []).map(faq => `<div style="border:1px solid #e5e7eb;border-radius:.5rem;padding:1.25rem;background:#fff;">
            <h3 style="margin:0 0 .5rem;color:${c.text};">${esc(faq.question)}</h3>
            <p style="margin:0;line-height:1.65;opacity:.75;">${esc(faq.answer)}</p>
          </div>`).join('')}
        </div>`)

    case 'finalCta': {
      const bg = data.backgroundColor || c.primary
      const centered = data.variant === 'centeredForm'
      return `<section style="padding:5rem 0;background:${bg};color:${data.textColor || '#FFFFFF'};font-family:${c.fontFamily};">
        <div style="max-width:${c.containerWidth};margin:0 auto;padding:0 1rem;display:grid;grid-template-columns:${centered ? '1fr' : 'repeat(auto-fit,minmax(280px,1fr))'};gap:2rem;align-items:center;text-align:${centered ? 'center' : 'left'};">
          <div style="${centered ? 'max-width:760px;margin:0 auto;' : ''}">
            <h2 style="margin:0 0 1rem;font-size:2.35rem;line-height:1.15;font-weight:800;">${esc(data.title)}</h2>
            <p style="margin:0 0 1.75rem;font-size:1.125rem;line-height:1.7;opacity:.86;">${esc(data.description)}</p>
            <a href="#contact" style="display:inline-flex;padding:.85rem 1.25rem;border-radius:.375rem;background:#fff;color:#111827;text-decoration:none;font-weight:700;">${esc(data.buttonText || 'Contact us')}</a>
            ${data.secondaryButtonText ? `<a href="#products" style="display:inline-flex;margin-left:.75rem;padding:.85rem 1.25rem;border-radius:.375rem;border:1px solid rgba(255,255,255,.55);color:inherit;text-decoration:none;font-weight:700;">${esc(data.secondaryButtonText)}</a>` : ''}
          </div>
          ${centered ? '' : `<div style="border-radius:.5rem;background:#fff;color:#111827;padding:1.5rem;box-shadow:0 18px 40px rgba(15,23,42,.18);">
            <div style="margin-bottom:1rem;font-weight:700;font-size:1.125rem;">Quick request</div>
            <div style="height:44px;margin-bottom:.75rem;border-radius:.375rem;background:#f3f4f6;color:#6b7280;padding:.75rem;">Name / company</div>
            <div style="height:44px;margin-bottom:.75rem;border-radius:.375rem;background:#f3f4f6;color:#6b7280;padding:.75rem;">Email / phone</div>
            <div style="height:96px;border-radius:.375rem;background:#f3f4f6;color:#6b7280;padding:.75rem;">Product requirements</div>
          </div>`}
        </div>
      </section>`
    }

    default:
      return ''
  }
}
