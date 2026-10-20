import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { BetaSignupSection } from '@/components/BetaSignupSection'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Join the Beta Testing Program · Neev Sanctuary',
  description: 'Apply for early access to Neev Sanctuary on Android and iOS. Help shape the future of digital sanctuaries for Indian families.',
  alternates: { canonical: `${siteConfig.url}/beta` },
}

export default function BetaPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] py-16 px-4 sm:px-6 lg:px-8">
        <BetaSignupSection />
      </main>
      <SiteFooter />
    </>
  )
}
