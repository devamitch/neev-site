import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/site'
import { ShieldCheck, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy Redirect | Neev Sanctuary',
  description: 'Neev Sanctuary official Privacy Policy has moved to its canonical route at /privacy.',
  alternates: { canonical: `${siteConfig.url}/privacy` },
}

export default function PrivacyPolicyRedirectPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4 text-[var(--ink)]">
      <div className="sanctuary-card max-w-md w-full p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[var(--pista-container)] border border-[var(--pista)]/25 flex items-center justify-center mx-auto text-[var(--pista)]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-[var(--ink)]">
          Neev Sanctuary Privacy Policy
        </h1>
        <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
          Our canonical Privacy Policy &amp; Google API Services Limited Use Disclosure is published at{' '}
          <strong className="text-[var(--ink)]">/privacy</strong>.
        </p>
        <div className="pt-2">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--pista)] text-white text-xs font-semibold hover:bg-[var(--pista-hover)] transition-all"
          >
            <span>Proceed to /privacy</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <meta httpEquiv="refresh" content="0; url=/privacy" />
      </div>
    </div>
  )
}
