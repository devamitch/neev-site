import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Neev Sanctuary: The Modern Indian Family OS',
    template: '%s · Neev Sanctuary',
  },
  description: siteConfig.description,
  keywords: [
    'Neev Sanctuary',
    'Neev',
    'Indian Joint Family App',
    'Family OS',
    'Shared Parenting',
    'Cultural Legacy Vault',
    'Google Calendar sync family',
    'Google Tasks Indian family',
    'Grandparent daily rhythm sync',
    'Privacy-first family app',
    'Zero-knowledge family vault',
    'Offline tile maps family',
    'Amit Chakraborty developer',
  ],
  applicationName: siteConfig.name,
  category: 'lifestyle',
  classification: 'Family Operating System & Cultural Heritage',
  authors: [{ name: siteConfig.author, url: siteConfig.authorUrl }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'en-IN': siteConfig.url,
      'en-US': siteConfig.url,
    },
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: 'Neev Sanctuary: The Modern Indian Family OS',
    description: siteConfig.secondaryTagline,
    siteName: siteConfig.name,
    locale: 'en_IN',
    images: [
      {
        url: `${siteConfig.url}/apple-touch-icon.png`,
        width: 1024,
        height: 1024,
        alt: 'Neev Sanctuary — The Modern Indian Family OS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neev Sanctuary: The Modern Indian Family OS',
    description: siteConfig.secondaryTagline,
    creator: '@devamitch',
    site: '@devamitch',
    images: [`${siteConfig.url}/apple-touch-icon.png`],
  },
  icons: {
    shortcut: '/favicon.ico',
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
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
  other: {
    'geo.region': 'IN-KA',
    'geo.placename': 'Bengaluru, Karnataka, India',
    'geo.position': '12.9716;77.5946',
    ICBM: '12.9716, 77.5946',
    'ai-content-declarations': 'index, read',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FAFBF9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const author = {
  '@type': 'Person',
  '@id': `${siteConfig.url}/#author`,
  name: siteConfig.author,
  url: siteConfig.authorUrl,
  sameAs: [siteConfig.githubUrl, siteConfig.linkedinUrl, siteConfig.xUrl],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/apple-touch-icon.png`,
      },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${siteConfig.url}/#app`,
      name: siteConfig.name,
      operatingSystem: 'iOS, Android, Web',
      applicationCategory: 'LifestyleApplication',
      description: siteConfig.description,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
      author,
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteConfig.url}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Neev Sanctuary?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Neev Sanctuary is an AI-guided digital sanctuary designed for modern Indian joint families. It coordinates shared parenting, synchronizes daily routines with Google Workspace, and preserves cultural heritage.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does Google Workspace integration work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Neev strictly complies with the Google API Services User Data Policy (Limited Use). Google Calendar and Google Tasks access is used exclusively to export family rituals, doctor visits, and chores directly to your personal Google account.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  )
}
