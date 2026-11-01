import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { BetaSignupSection } from '@/components/BetaSignupSection'
import { EcosystemDirectorySection } from '@/components/EcosystemDirectorySection'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Join the Android Beta Testing Program · Neev Sanctuary',
  description: 'Apply for early access to Neev Sanctuary on Google Play. Test offline family sanctuary and AnvayKosh ecosystem apps.',
  alternates: { canonical: `${siteConfig.url}/beta` },
}

export default function BetaPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] py-16 px-4 sm:px-6 lg:px-8">
        <BetaSignupSection />
        <div className="mt-16">
          <EcosystemDirectorySection />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
