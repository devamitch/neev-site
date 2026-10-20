import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Neev Sanctuary. Clear, respectful terms governing our private family operating system.',
  alternates: { canonical: `${siteConfig.url}/terms` },
}

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl sanctuary-card p-6 sm:p-12">
          <div className="border-b border-[var(--border)] pb-8 mb-8">
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] mb-3">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-secondary)]">
              Effective Date: October 20, 2026
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[var(--ink)]">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Neev Sanctuary, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our sanctuary services.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[var(--ink)]">2. Sanctuary Membership & Family Conduct</h2>
              <p>
                Neev Sanctuary is designed exclusively for personal, family, and domestic coordination. Users agree not to misuse the platform, distribute harmful content, or violate the privacy of fellow family members.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[var(--ink)]">3. Google Workspace Integrations</h2>
              <p>
                Our integration with Google Calendar and Google Tasks is provided to enhance family convenience. Your usage of Google services remains subject to Google’s terms and policies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[var(--ink)]">4. Disclaimers & Limitation of Liability</h2>
              <p>
                Neev Sanctuary is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind. We do not provide medical, legal, or financial advice.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-[var(--border)]">
              <h2 className="font-serif text-base font-bold text-[var(--ink)]">Contact Us</h2>
              <p className="text-xs">
                Email: <a href="mailto:amit@devamit.co.in" className="text-[var(--pista)] underline">amit@devamit.co.in</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
