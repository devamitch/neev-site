import type { MetadataRoute } from 'next'
import { routes, siteConfig } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const canonicalRoutes = routes.filter(
    (route) => route !== '/privacy-policy' && route !== '/terms-of-service'
  )
  return canonicalRoutes.map((route) => {
    let priority = 0.8
    let changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly'

    if (route === '/') {
      priority = 1.0
      changeFrequency = 'daily'
    } else if (route === '/features' || route === '/how-it-works' || route === '/about') {
      priority = 0.9
      changeFrequency = 'weekly'
    } else if (route === '/beta' || route === '/download') {
      priority = 0.95
      changeFrequency = 'weekly'
    } else if (route === '/privacy' || route === '/privacy-policy') {
      priority = 0.85
      changeFrequency = 'monthly'
    } else if (route === '/terms' || route === '/terms-of-service') {
      priority = 0.7
      changeFrequency = 'monthly'
    }

    return {
      url: `${siteConfig.url}${route === '/' ? '' : route}`,
      lastModified: now,
      changeFrequency,
      priority,
    }
  })
}
