import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { FaqSection } from '@/components/FaqSection'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions · Neev Sanctuary',
  description: 'Everything you need to know about Neev Sanctuary: Indian joint family features, Google Calendar sync, zero-knowledge security, and offline support.',
  alternates: { canonical: `${siteConfig.url}/faq` },
}

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] py-16 px-4 sm:px-6 lg:px-8">
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  )
}
