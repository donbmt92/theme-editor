import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <SessionProvider>
          <div id="root">
        {children}
          </div>
          <div id="modal-root" />
          <div id="toast-root" />
        </SessionProvider>
      </body>
    </html>
  )
}
