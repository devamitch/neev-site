import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { FeatureBento } from '@/components/FeatureBento'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Features & Architecture · Neev Sanctuary',
  description: 'Explore the full suite of features: Google Workspace sync, ancestral folklore vaults, 3D spatial radar, shared parenting, and cultural rituals.',
  alternates: { canonical: `${siteConfig.url}/features` },
}

export default function FeaturesPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <FeatureBento />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
