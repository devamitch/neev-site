import type { Metadata } from 'next'
import { siteConfig } from './site'

export function constructMetadata({
  title,
  description = siteConfig.description,
  path = '',
}: {
  title?: string
  description?: string
  path?: string
} = {}): Metadata {
  const fullTitle = title ? `${title} · ${siteConfig.name}` : `${siteConfig.name} — The Indian Family Sanctuary`
  const canonicalUrl = `${siteConfig.url}${path}`

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: '@devamitch',
      images: ['/og-image.png'],
    },
    icons: {
      icon: '/favicon.png',
      shortcut: '/favicon.png',
      apple: '/apple-touch-icon.png',
    },
  }
}
