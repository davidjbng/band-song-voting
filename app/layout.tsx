import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Band Song Battle',
    template: '%s | Band Song Battle',
  },
  description: 'Pitch songs, vote together in real time, and build your band’s next killer setlist.',
  applicationName: 'Band Song Battle',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['band', 'music', 'song voting', 'setlist', 'collaboration', 'realtime'],
  authors: [{ name: 'davidjbng' }],
  creator: 'davidjbng',
  publisher: 'davidjbng',
  category: 'music',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Band Song Battle',
    description: 'Pitch songs, vote together in real time, and build your band’s next killer setlist.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Band Song Battle',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Band Song Battle',
    description: 'Pitch songs, vote together in real time, and build your band’s next killer setlist.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  appleWebApp: {
    title: 'Band Song Battle',
    capable: true,
    statusBarStyle: 'default',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
