import type { Metadata, Viewport } from 'next'
import { Inter, Poppins, Roboto, Open_Sans, Montserrat, Lato, Nunito, Raleway, Playfair_Display, Merriweather } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import ErrorBoundary from '@/components/ui/error-boundary'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'], variable: '--font-poppins' })
const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '500', '700', '900'], variable: '--font-roboto' })
const openSans = Open_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-open-sans' })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'], variable: '--font-montserrat' })
const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700', '900'], variable: '--font-lato' })
const nunito = Nunito({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'], variable: '--font-nunito' })
const raleway = Raleway({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'], variable: '--font-raleway' })
const playfairDisplay = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-playfair-display' })
const merriweather = Merriweather({ subsets: ['latin'], weight: ['300', '400', '700', '900'], variable: '--font-merriweather' })

export const metadata: Metadata = {
  title: 'Theme Editor SaaS - Tùy chỉnh và xuất theme React',
  description: 'Một nền tảng SaaS cho phép người dùng tùy chỉnh và xuất theme React thông qua giao diện web trực quan.',
  keywords: ['theme editor', 'react themes', 'web design', 'saas', 'customization'],
  authors: [{ name: 'Theme Editor Team' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'Theme Editor SaaS',
    description: 'Tùy chỉnh và xuất theme React với giao diện trực quan',
    url: 'https://theme-editor.com',
    siteName: 'Theme Editor',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Theme Editor Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Theme Editor SaaS',
    description: 'Tùy chỉnh và xuất theme React với giao diện trực quan',
    images: ['/og-image.png']
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${roboto.variable} ${openSans.variable} ${montserrat.variable} ${lato.variable} ${nunito.variable} ${raleway.variable} ${playfairDisplay.variable} ${merriweather.variable}`}>
        <ErrorBoundary>
          <SessionProvider>
            <div id="root">
              {children}
            </div>
            <div id="modal-root" />
            <div id="toast-root" />
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
