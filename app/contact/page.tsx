import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { siteConfig } from '@/lib/site'
import { Mail, ShieldCheck, MapPin, ExternalLink, Code } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact · Neev Sanctuary',
  description: 'Contact Amit Chakraborty and the engineering team behind Neev Sanctuary. Reach out for security reports, Google verification queries, or family partnerships.',
  alternates: { canonical: `${siteConfig.url}/contact` },
}

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-12">
          <div className="text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--terracotta)] font-semibold block mb-2">
              Direct Access
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] mb-4">
              Get in Touch
            </h1>
            <p className="text-sm sm:text-base text-[var(--ink-secondary)] font-light max-w-xl mx-auto">
              Have questions about Google OAuth verification, zero-knowledge privacy, or need help with your family sanctuary?
            </p>
          </div>

          <div className="sanctuary-card p-8 sm:p-12 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--pista)] font-semibold flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  <span>Direct Email</span>
                </span>
                <p className="text-base font-bold text-[var(--ink)]">
                  amit@devamit.co.in
                </p>
                <p className="text-xs text-[var(--ink-muted)]">
                  Replies typically within 24 hours.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--terracotta)] font-semibold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>Headquarters</span>
                </span>
                <p className="text-base font-bold text-[var(--ink)]">
                  Bengaluru & Kolkata, India
                </p>
                <p className="text-xs text-[var(--ink-muted)]">
                  Operating globally across timezones.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--border)] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[var(--ink)]">
                Google Verification & Compliance Reviewers
              </h3>
              <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                If you are a member of the Google Trust &amp; Safety or OAuth Verification team reviewing project ID <code>gen-lang-client-0587640262</code>, please contact Amit Chakraborty directly at <a href="mailto:amit@devamit.co.in" className="text-[var(--pista)] underline font-bold">amit@devamit.co.in</a> or reference our verified disclosures in our <a href="/privacy-policy" className="text-[var(--pista)] underline font-bold">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
