// Lightweight Lucide SVG renderer for static HTML templates
// Only includes the small subset of icons we actually use in theme content

const ICON_PATHS: Record<string, string> = {
  Award: `
    <circle cx="12" cy="8" r="5"/>
    <path d="m8.21 13.89-2.66 7.95 6.45-3.06L18.45 22l-2.66-8.11"/>
  `,
  Globe: `
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  `,
  Users: `
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  `,
  Shield: `
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  `,
  Clock: `
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  `,
  TrendingUp: `
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  `,
  CheckCircle: `
    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/>
    <path d="m9 12 2 2 4-4"/>
  `,
  AlertCircle: `
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12" y2="16"/>
  `,
  Truck: `
    <path d="M10 17h4V5H2v12h3"/>
    <path d="M14 17h3l3-5h-6"/>
    <circle cx="5.5" cy="17.5" r="2.5"/>
    <circle cx="16.5" cy="17.5" r="2.5"/>
  `,
  Package: `
    <path d="m16.5 9.4-9-5.19"/>
    <path d="m21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="M3.3 7L12 12l8.7-5"/>
    <path d="M12 22V12"/>
  `,
  PackageCheck: `
    <path d="m16 16 2 2 4-4"/>
    <path d="m21 10-9-5-9 5 9 5 9-5Z"/>
    <path d="M3 10v6l9 5 4.5-2.5"/>
    <path d="M21 10v3"/>
    <path d="M12 15v6"/>
  `,
  Store: `
    <path d="m2 7 2-4h16l2 4"/>
    <path d="M4 7v13h16V7"/>
    <path d="M8 21v-8h8v8"/>
    <path d="M2 7h20"/>
  `,
  Building2: `
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
    <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"/>
    <path d="M10 6h4"/>
    <path d="M10 10h4"/>
    <path d="M10 14h4"/>
  `,
  SearchCheck: `
    <path d="m8 11 2 2 4-4"/>
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  `,
  ShieldCheck: `
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    <path d="m9 12 2 2 4-4"/>
  `,
  Ship: `
    <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1"/>
    <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-8-4-8 4a11.6 11.6 0 0 0 1.62 6"/>
    <path d="M12 10V3"/>
    <path d="M8 7h8"/>
  `,
  Zap: `
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  `,
  Lightbulb: `
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
    <path d="M2 10a10 10 0 1 1 20 0c0 3.53-1.83 5.27-3 6-1 0.67-1 2-1 2H6s0-1.33-1-2c-1.17-.73-3-2.47-3-6z"/>
  `,
  Coffee: `
    <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
    <line x1="6" y1="2" x2="6" y2="4"/>
    <line x1="10" y1="2" x2="10" y2="4"/>
    <line x1="14" y1="2" x2="14" y2="4"/>
  `,
  FileText: `
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <path d="M14 2v6h6"/>
    <path d="M16 13H8"/>
    <path d="M16 17H8"/>
    <path d="M10 9H8"/>
  `,
  Target: `
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  `,
  ArrowUpRight: `
    <path d="M7 17L17 7"/>
    <path d="M7 7h10v10"/>
  `,
  ArrowRight: `
    <path d="M5 12h14"/>
    <path d="M12 5l7 7-7 7"/>
  `,
  Phone: `
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.1 4.11 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.05.95.24 1.9.57 2.79a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.52 2.79.57A2 2 0 0 1 22 16.92z"/>
  `,
  Menu: `
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <line x1="4" y1="18" x2="20" y2="18"/>
  `,
  Download: `
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  `,
}

export function renderLucideIcon(
  name: string | undefined,
  size: number = 48,
  color?: string,
  extraAttributes: string = ''
): string {
  const key = (name || '').trim()
  const paths = ICON_PATHS[key]
  if (!paths) {
    // Fallback: empty string to avoid rendering raw text
    return ''
  }
  const strokeColor = color || 'currentColor'
  const dimension = `${size}`
  return `<svg ${extraAttributes} width="${dimension}" height="${dimension}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`
}


