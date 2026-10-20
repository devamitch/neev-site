import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { siteConfig } from '@/lib/site'
import { ShieldCheck, Lock, ExternalLink, Calendar, CheckSquare, Mail, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy & Google Limited Use Disclosure',
  description: 'Official Privacy Policy for Neev Sanctuary. Details our adherence to the Google API Services User Data Policy, Limited Use requirements, and zero-knowledge data security.',
  alternates: { canonical: `${siteConfig.url}/privacy-policy` },
}

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl sanctuary-card p-6 sm:p-12">
          {/* Header */}
          <div className="border-b border-[var(--border)] pb-8 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)] text-xs font-mono uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Google API Verified Policy</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] mb-3">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-secondary)]">
              Effective Date: October 20, 2026 · Last Updated: October 20, 2026
            </p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
            {/* Google Limited Use Clause */}
            <section className="rounded-2xl bg-[var(--pista-container)]/50 p-6 border border-[var(--pista)]/30 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
                <Lock className="w-4 h-4 text-[var(--pista)]" />
                <h2>Google API Services User Data Policy & Limited Use Disclosure</h2>
              </div>
              <p className="font-medium text-[var(--ink)]">
                Neev Sanctuary’s use and transfer to any other app of information received from Google APIs will adhere to the{' '}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--pista)] underline font-bold"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>We do <strong>not</strong> use Google Workspace user data to train or fine-tune general artificial intelligence or machine learning models.</li>
                <li>We do <strong>not</strong> sell Google user data or transfer it to third-party data brokers or advertising networks.</li>
                <li>Human access to user data is strictly prohibited unless required for explicit security investigations or with your affirmative consent.</li>
              </ul>
            </section>

            {/* Introduction */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--ink)]">1. Introduction</h2>
              <p>
                Neev Sanctuary (&ldquo;Neev&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), engineered by Amit Chakraborty, is a family operating system designed for modern Indian joint families. We provide a sacred, private environment to coordinate shared parenting, preserve cultural heritage, and harmonize household routines.
              </p>
            </section>

            {/* Scope Disclosures */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--ink)]">2. Google OAuth Scopes We Request & Why</h2>
              <div className="grid grid-cols-1 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
                  <div className="font-mono text-xs text-[var(--pista)] font-bold mb-1">
                    https://www.googleapis.com/auth/calendar.events
                  </div>
                  <p className="text-xs">
                    <strong>Purpose:</strong> To export family ritual dates, pediatric medical appointments, and school events directly to your personal Google Calendar.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
                  <div className="font-mono text-xs text-[var(--pista)] font-bold mb-1">
                    https://www.googleapis.com/auth/tasks
                  </div>
                  <p className="text-xs">
                    <strong>Purpose:</strong> To sync household chore assignments, medication reminders, and shopping lists to your Google Tasks.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Revocation and Deletion */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--ink)]">3. Data Revocation & Account Deletion</h2>
              <p>
                You maintain complete ownership of your family records. You can revoke Google access or delete your data at any time via:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li><strong>In-App Deletion:</strong> Navigate to Settings &gt; Sanctuary Profile &gt; Delete Family Sanctuary to purge all records.</li>
                <li><strong>Google Permissions Portal:</strong> Revoke permissions anytime at{' '}
                  <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-[var(--pista)] underline">
                    myaccount.google.com/permissions
                  </a>.
                </li>
                <li><strong>Email Request:</strong> Email our privacy officer at{' '}
                  <a href="mailto:amit@devamit.co.in" className="text-[var(--pista)] underline">amit@devamit.co.in</a> for immediate hard deletion within 24 hours.
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="space-y-2 pt-4 border-t border-[var(--border)]">
              <h2 className="font-serif text-lg font-bold text-[var(--ink)]">Contact Our Privacy Team</h2>
              <p className="text-xs">
                Amit Chakraborty (Founding Engineer)<br />
                Email: <a href="mailto:amit@devamit.co.in" className="text-[var(--pista)] underline">amit@devamit.co.in</a><br />
                Address: Bengaluru, Karnataka, India
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
