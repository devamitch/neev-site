import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { siteConfig } from '@/lib/site'
import { Smartphone, Download, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Download Neev Sanctuary for Android & iOS',
  description: 'Download Neev Sanctuary mobile app for Android and iOS. Built with Apple Large Titles, offline tile maps, and Google Calendar sync.',
  alternates: { canonical: `${siteConfig.url}/download` },
}

export default function DownloadPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--terracotta)] font-semibold block mb-2">
              Cross-Platform Sanctuary
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] mb-4">
              Get Neev Sanctuary
            </h1>
            <p className="text-sm sm:text-base text-[var(--ink-secondary)] font-light max-w-2xl mx-auto">
              Neev Sanctuary is currently rolling out across the Google Play Store and Apple App Store in progressive testing cohorts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
            {/* Android */}
            <div className="sanctuary-card p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--pista-container)] text-[var(--pista-hover)] flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--ink)]">
                  Android App
                </h3>
                <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                  Requires Android 10+ (API 29+). Full support for Google Play Services, Google Calendar export, and hardware spatial radar telemetry.
                </p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-[var(--ink)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--pista)]" />
                    <span>Package: com.amit.neev</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--ink)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--pista)]" />
                    <span>Status: Closed Beta Testing</span>
                  </div>
                </div>
              </div>

              <Link
                href="/beta"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[var(--pista)] text-white text-xs font-semibold hover:bg-[var(--pista-hover)] transition-all shadow-none"
              >
                <span>Request Android APK / Play Invite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* iOS */}
            <div className="sanctuary-card p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--surface2)] text-[var(--ink)] flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--ink)]">
                  iOS & iPadOS
                </h3>
                <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                  Requires iOS 17+. Native Apple Large Titles, smooth gesture-driven bottom sheets, and Apple HealthKit integration.
                </p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-[var(--ink)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--pista)]" />
                    <span>Platform: TestFlight Exclusive</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--ink)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--pista)]" />
                    <span>Status: Invitations Open</span>
                  </div>
                </div>
              </div>

              <Link
                href="/beta"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[var(--surface2)] border border-[var(--border)] text-[var(--ink)] text-xs font-semibold hover:border-[var(--border-strong)] transition-all shadow-none"
              >
                <span>Request TestFlight Invite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
