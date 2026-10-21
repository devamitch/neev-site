import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site'
import { SiteHeader } from '@/components/SiteHeader'
import { HeroSection } from '@/components/HeroSection'
import { InteractiveMobileShowcase } from '@/components/InteractiveMobileShowcase'
import { GoogleSyncInteractiveDemo } from '@/components/GoogleSyncInteractiveDemo'
import { FeatureBento } from '@/components/FeatureBento'
import { SpatialRadarShowcase } from '@/components/SpatialRadarShowcase'
import { FaqSection } from '@/components/FaqSection'
import { BetaSignupSection } from '@/components/BetaSignupSection'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  alternates: { canonical: siteConfig.url },
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="top" className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
        <HeroSection />

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 sm:gap-24 sm:px-6 lg:px-8">
          {/* Interactive Mobile Device Simulator */}
          <InteractiveMobileShowcase />

          {/* Interactive Google Workspace Synchronization Pipeline */}
          <GoogleSyncInteractiveDemo />

          {/* Feature Bento Architecture */}
          <FeatureBento />

          {/* 3D Spatial Radar & Offline Tile Maps */}
          <SpatialRadarShowcase />

          {/* Comprehensive FAQ Section */}
          <FaqSection />

          {/* Beta Waitlist Registration */}
          <BetaSignupSection />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
