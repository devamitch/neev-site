import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { siteConfig } from '@/lib/site'
import { ShieldCheck, Lock, ExternalLink, Calendar, CheckSquare, Mail, Phone, Database, Server, UserCheck, HardDrive, Cpu, HeartHandshake } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy & Google Limited Use Disclosure',
  description: 'Official Privacy Policy for Neev Sanctuary (The Modern Indian Family OS). Details our adherence to the Google API Services User Data Policy, Limited Use requirements, OAuth scope disclosures, and zero-knowledge data security.',
  alternates: { canonical: `${siteConfig.url}/privacy-policy` },
}

export default function PrivacyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Neev Sanctuary Privacy Policy & Google Limited Use Disclosure',
    url: 'https://neevsanctuary.devamit.co.in/privacy-policy',
    description: 'Comprehensive Privacy Policy and Google API Services User Data Policy compliance statement for Neev Sanctuary.',
    publisher: {
      '@type': 'Organization',
      name: 'Amit Dev Labs',
      url: 'https://devamit.co.in',
      logo: 'https://neevsanctuary.devamit.co.in/favicon-96x96.png',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] py-16 px-4 sm:px-6 lg:px-8 text-[var(--ink)]">
        <div className="mx-auto max-w-4xl sanctuary-card p-6 sm:p-12">
          {/* Header */}
          <div className="border-b border-[var(--border)] pb-8 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)] text-xs font-mono uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Google API Verified Policy & Limited Use Disclosure</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] mb-3">
              Privacy Policy & Data Protection Manifesto
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-secondary)]">
              Effective Date: October 2026 · Last Updated: October 21, 2026 · Jurisdiction: India (DPDP Act) & Global (GDPR / CCPA)
            </p>
          </div>

          <div className="space-y-10 text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
            {/* 1. Google Limited Use Clause Banner */}
            <section className="rounded-2xl bg-[var(--pista-container)]/60 p-6 sm:p-8 border border-[var(--pista)]/30 space-y-4">
              <div className="flex items-center gap-2 text-base font-bold text-[var(--ink)]">
                <Lock className="w-5 h-5 text-[var(--pista)] shrink-0" />
                <h2>Google API Services User Data Policy & Limited Use Disclosure</h2>
              </div>
              <p className="font-medium text-[var(--ink)] leading-relaxed">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="font-bold text-[var(--ink)] block mb-1">No AI/LLM Model Training</span>
                  <p className="text-xs text-[var(--ink-secondary)]">
                    We do <strong>not</strong> use Google Workspace user data (Calendar, Tasks, Drive, Contacts) to train, re-train, or fine-tune general artificial intelligence or machine learning models.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="font-bold text-[var(--ink)] block mb-1">Zero Commercial Data Sales</span>
                  <p className="text-xs text-[var(--ink-secondary)]">
                    We do <strong>not</strong> sell Google user data or transfer it to third-party data brokers, advertising platforms, or commercial trackers under any circumstance.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="font-bold text-[var(--ink)] block mb-1">Strict Human Access Prohibition</span>
                  <p className="text-xs text-[var(--ink-secondary)]">
                    No employee or contractor of Neev Sanctuary reads your private family calendars or tasks unless explicitly authorized by you for a targeted technical support ticket.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="font-bold text-[var(--ink)] block mb-1">Purpose Limitation</span>
                  <p className="text-xs text-[var(--ink-secondary)]">
                    Google data is accessed strictly to provide user-facing family coordination features (shared household calendars, pediatric medicine bells, and ritual reminders).
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Comprehensive Google OAuth Scope Disclosures */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                2. Comprehensive Google OAuth Scopes We Request & Exact Justifications
              </h2>
              <p>
                When connecting your Google Account to Neev Sanctuary (either on web or mobile), we request explicit, granular permissions. Below is the complete catalog of requested scopes and their direct user-facing functions:
              </p>

              <div className="space-y-4 pt-2">
                {/* Scope 1: Calendar */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--pista)]">
                      https://www.googleapis.com/auth/calendar.events &amp; calendar
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                      User-Initiated Sync
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ink)] mb-2">
                    <strong>User Benefit:</strong> Allows you to export sacred Indian festival tithis, pediatric vaccination milestones, school exam schedules, and Dada-Dadi doctor appointments directly into your personal Google Calendar.
                  </p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    <strong>Access Level:</strong> Read and write access to calendar events created for your family sanctuary. We do not inspect unrelated private calendar events outside your selected family calendar.
                  </p>
                </div>

                {/* Scope 2: Tasks */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--pista)]">
                      https://www.googleapis.com/auth/tasks
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                      Task Delegation
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ink)] mb-2">
                    <strong>User Benefit:</strong> Enables cross-household task management. Co-parents can assign grocery errands, medicine schedules, and utility payments that synchronize automatically with Google Tasks on Android and desktop devices.
                  </p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    <strong>Access Level:</strong> Read and write access to the specific &ldquo;Neev Sanctuary&rdquo; task list.
                  </p>
                </div>

                {/* Scope 3: Drive */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--pista)]">
                      https://www.googleapis.com/auth/drive.file &amp; drive.readonly
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                      Heirloom Vault Backup
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ink)] mb-2">
                    <strong>User Benefit:</strong> Allows families to securely back up oral history audio recordings, heirloom recipe photographs, and encrypted emergency documents to their own private Google Drive folder.
                  </p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    <strong>Access Level:</strong> Strictly restricted via <code className="font-mono">drive.file</code> to files created or opened by Neev Sanctuary. We have zero access to the rest of your Google Drive files.
                  </p>
                </div>

                {/* Scope 4: Contacts */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--pista)]">
                      https://www.googleapis.com/auth/contacts.readonly
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                      Family Circle Picker
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ink)] mb-2">
                    <strong>User Benefit:</strong> Simplifies inviting grandparents, uncles, aunts, and verified emergency contacts to your private family circle without manual phone number entry.
                  </p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    <strong>Access Level:</strong> Read-only during invitation flows. Contacts are never uploaded to a persistent advertising database.
                  </p>
                </div>

                {/* Scope 5: Identity & Profile */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--pista)]">
                      openid, profile, email
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                      Core Authentication
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ink)] mb-2">
                    <strong>User Benefit:</strong> Used solely to authenticate your identity, display your display name and avatar in the family tree, and send critical sanctuary safety alerts.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. On-Device Sovereignty & Local Encryption */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                3. On-Device Sovereignty & Local Storage Architecture
              </h2>
              <p>
                Unlike conventional consumer platforms that hoard data in centralized cloud datacenters, Neev Sanctuary is engineered as a <strong>Local-First System</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>
                  <strong>Hardware Keystore Encryption:</strong> All daily routine logs, milestone memories, and family health notes are stored locally in an encrypted MMKV binary database backed by AES-256-GCM hardware keys inside the iOS Secure Enclave or Android Keystore.
                </li>
                <li>
                  <strong>Offline Sovereignty:</strong> You can view and manage routines, read folklore, and check festival dates without active cellular or Wi-Fi connectivity.
                </li>
                <li>
                  <strong>Zero Surveillance Radar:</strong> The Kutumb Radar and 3D spatial Bluetooth locator operate using peer-to-peer RF beaconing without uploading continuous GPS coordinates to any cloud telemetry server.
                </li>
              </ul>
            </section>

            {/* 4. Data Revocation, Account Deletion & User Control */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                4. Data Revocation & Complete Hard Deletion
              </h2>
              <p>
                You retain absolute sovereignty over your family data. You can disconnect integrations or delete your entire sanctuary at any moment through three independent mechanisms:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
                  <h3 className="font-bold text-xs text-[var(--ink)] mb-1">1. One-Tap In-App Purge</h3>
                  <p className="text-xs text-[var(--ink-secondary)]">
                    In the app, navigate to <em>Settings &gt; Sanctuary Profile &gt; Delete Family Sanctuary</em>. This instantly and irreversibly wipes all local records and encryption keys.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
                  <h3 className="font-bold text-xs text-[var(--ink)] mb-1">2. Google Account Portal</h3>
                  <p className="text-xs text-[var(--ink-secondary)]">
                    Revoke Neev Sanctuary’s access instantly at{' '}
                    <a
                      href="https://myaccount.google.com/permissions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--pista)] underline font-semibold"
                    >
                      myaccount.google.com/permissions
                    </a>.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
                  <h3 className="font-bold text-xs text-[var(--ink)] mb-1">3. Direct Email Request</h3>
                  <p className="text-xs text-[var(--ink-secondary)]">
                    Email our Data Protection Officer at{' '}
                    <a href="mailto:amit@devamit.co.in" className="text-[var(--pista)] underline font-semibold">
                      amit@devamit.co.in
                    </a>{' '}
                    for hard deletion across all infrastructure within 24 hours.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Subprocessors & Cloud Infrastructure */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                5. Third-Party Subprocessors & Infrastructure Disclosures
              </h2>
              <p>
                Neev Sanctuary utilizes a strictly vetted, minimal set of enterprise infrastructure providers:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[var(--border)] rounded-xl overflow-hidden">
                  <thead className="bg-[var(--surface2)] border-b border-[var(--border)] font-mono text-[var(--ink-muted)] uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Entity</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Data Location</th>
                      <th className="p-3">Security Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    <tr>
                      <td className="p-3 font-semibold text-[var(--ink)]">Google Cloud Platform</td>
                      <td className="p-3">OAuth2 Authentication & Calendar/Task Sync</td>
                      <td className="p-3">Global / India</td>
                      <td className="p-3">SOC 2 Type II, ISO 27001</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[var(--ink)]">Supabase Inc.</td>
                      <td className="p-3">Family Membership Relays & Encrypted Backups</td>
                      <td className="p-3">EU (Frankfurt) / Asia (Mumbai)</td>
                      <td className="p-3">AES-256 at Rest, Row-Level Security</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[var(--ink)]">Cloudflare, Inc.</td>
                      <td className="p-3">Edge Web Delivery & DDoS Defense</td>
                      <td className="p-3">Edge Anycast Global</td>
                      <td className="p-3">TLS 1.3 Strict, Zero-Payload Caching</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. Children's Privacy (COPPA & DPDP Act) */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                6. Multi-Generational Protection & Children&rsquo;s Privacy
              </h2>
              <p>
                Neev Sanctuary is designed for family harmony, which means children participate under the direct affirmative consent and management of verified parent or legal guardian accounts.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Children cannot register standalone accounts without a parent invite.</li>
                <li>Children’s interfaces are 100% ad-free with zero behavioral profiling or algorithmically recommended feeds.</li>
                <li>In accordance with the India DPDP Act 2023 and COPPA, parents can review, modify, or delete any record created by a minor child at any time.</li>
              </ul>
            </section>

            {/* 7. Contact Details */}
            <section className="space-y-3 pt-6 border-t border-[var(--border)]">
              <h2 className="font-serif text-xl font-bold text-[var(--ink)]">
                7. Contact Our Data Protection Officer
              </h2>
              <p className="text-xs">
                For questions regarding this policy, Google Limited Use disclosures, or our data handling practices:
              </p>
              <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs space-y-1">
                <p><strong>Amit Chakraborty</strong> — Founder &amp; Lead Systems Architect</p>
                <p><strong>Organization:</strong> Amit Dev Labs</p>
                <p><strong>Email:</strong> <a href="mailto:amit@devamit.co.in" className="text-[var(--pista)] underline font-medium">amit@devamit.co.in</a></p>
                <p><strong>Physical Address:</strong> Bengaluru, Karnataka 560001, India</p>
                <p><strong>Official Portal:</strong> <a href="https://neevsanctuary.devamit.co.in" className="text-[var(--pista)] underline font-medium">https://neevsanctuary.devamit.co.in</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
