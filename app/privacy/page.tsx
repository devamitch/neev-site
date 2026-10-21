import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { siteConfig } from '@/lib/site'
import { ShieldCheck, Lock, ExternalLink, Calendar, CheckSquare, Mail, Phone, Database, Server, UserCheck, HardDrive, Cpu, HeartHandshake, EyeOff, Trash2, Key, Info, RefreshCw } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy & Google Limited Use Disclosure | Neev Sanctuary',
  description: 'Official, exhaustive Privacy Policy for Neev Sanctuary (The Modern Indian Family OS). Details our adherence to the Google API Services User Data Policy, Limited Use requirements, OAuth scope disclosures, data minimization, subprocessor inventory, and user data rights.',
  alternates: { canonical: `${siteConfig.url}/privacy` },
}

export default function PrivacyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Neev Sanctuary Privacy Policy & Google Limited Use Disclosure',
    url: 'https://neevsanctuary.devamit.co.in/privacy',
    description: 'Comprehensive Privacy Policy and Google API Services User Data Policy compliance statement for Neev Sanctuary.',
    publisher: {
      '@type': 'Organization',
      name: 'Amit Dev Labs',
      url: 'https://devamit.co.in',
      logo: 'https://neevsanctuary.devamit.co.in/favicon-96x96.png',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'amit@devamit.co.in',
        contactType: 'Data Protection Officer',
      },
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
              <span>Google API Services &amp; Limited Use Disclosure</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] mb-3">
              Privacy Policy &amp; Data Protection Manifesto
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-secondary)]">
              Effective Date: October 20, 2026 · Last Updated: October 22, 2026 · Jurisdiction: India (DPDP Act 2023) &amp; Global (GDPR / CCPA)
            </p>
          </div>

          <div className="space-y-12 text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
            
            {/* Section 1: Application Identity & Scope */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                1. Application Identity, Scope &amp; Responsible Contact
              </h2>
              <p>
                <strong>Neev Sanctuary</strong> (&ldquo;Neev&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is an intentional, privacy-first family operating system and digital sanctuary engineered specifically for multi-generational Indian families. Neev unites elders (Dada, Dadi, Nana, Nani), co-parents, and children to harmonize household rhythms, coordinate shared parenting duties, maintain pediatric and geriatric care logs, and safeguard ancestral cultural heirlooms.
              </p>
              <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)] space-y-1">
                <p><strong>Application Name:</strong> Neev Sanctuary</p>
                <p><strong>Public Website:</strong> <a href="https://neevsanctuary.devamit.co.in" className="text-[var(--pista)] underline">https://neevsanctuary.devamit.co.in</a></p>
                <p><strong>Primary Domain:</strong> devamit.co.in (Amit Dev Labs)</p>
                <p><strong>Responsible Architect &amp; Data Protection Officer:</strong> Amit Chakraborty (<a href="mailto:amit@devamit.co.in" className="text-[var(--pista)] underline">amit@devamit.co.in</a>)</p>
                <p><strong>Physical Address:</strong> Bengaluru, Karnataka 560001, India</p>
              </div>
            </section>

            {/* MANDATORY GOOGLE OAUTH 2.0 VERIFICATION DISCLOSURES (VERBATIM COMPLIANCE) */}
            <section className="rounded-2xl bg-[var(--pista-container)]/70 p-6 sm:p-8 border-2 border-[var(--pista)] space-y-6">
              <div className="flex items-center gap-2.5 text-base font-bold text-[var(--ink)] border-b border-[var(--pista)]/30 pb-4">
                <ShieldCheck className="w-6 h-6 text-[var(--pista-hover)] shrink-0" />
                <div>
                  <h2 className="text-lg sm:text-xl font-serif">Google OAuth 2.0 Compliance &amp; Mandatory Verification Disclosures</h2>
                  <span className="text-xs font-mono text-[var(--ink-secondary)] block">
                    Direct adherence to Google Cloud Platform OAuth Verification Guidelines (support.google.com/cloud/answer/13806988)
                  </span>
                </div>
              </div>

              {/* Exact Google Clause 1: What Google User Data is Accessed */}
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <h3 className="font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--pista)]" />
                  What Google User Data is Accessed by Our Application
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink)] font-medium leading-relaxed">
                  Our application will access the data you have provided to us, including your name, email address, profile picture, and specifically Google Calendar events (via <code className="font-mono text-xs bg-[var(--surface2)] px-1.5 py-0.5 rounded">https://www.googleapis.com/auth/calendar.events</code>) and Google Tasks items (via <code className="font-mono text-xs bg-[var(--surface2)] px-1.5 py-0.5 rounded">https://www.googleapis.com/auth/tasks</code>).
                </p>
                <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                  We do not access, store, or process sensitive biometric, financial, location, or communication data from your Google account.
                </p>
              </div>

              {/* Exact Google Clause 2: How Application Uses Google User Data */}
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <h3 className="font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--pista)]" />
                  How Our Application Uses Google User Data
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink)] font-medium leading-relaxed">
                  We will use your data to provide you with the services you requested, such as synchronizing family events, shared rituals, doctor appointments, and household chores directly between your private Neev Sanctuary family timeline and your personal Google account. We will not sell your data to third parties, but we may share it with our partners who help us provide our services strictly to operate the technical hosting infrastructure.
                </p>
              </div>

              {/* Exact Google Clause 3: Sharing, Transfer & Third-Party Restrictions */}
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <h3 className="font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--pista)]" />
                  With Whom We Share, Transfer, or Disclose Google User Data
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink)] font-medium leading-relaxed">
                  We do not transfer or disclose your information to third parties for purposes other than the ones provided.
                </p>
                <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                  Our policy does not allow for the transfer of data to third-parties for any of the following reasons:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[var(--ink-secondary)] font-mono pl-4 list-disc">
                  <li>Targeted advertising</li>
                  <li>Selling to data brokers</li>
                  <li>Providing to information resellers</li>
                  <li>Determining credit-worthiness</li>
                  <li>Lending purposes</li>
                  <li>User advertisements</li>
                  <li>Personalized advertisements</li>
                  <li>Retargeted advertisements</li>
                  <li>Interest-based advertisements</li>
                  <li>Training generalized machine-learning (ML) or artificial intelligence (AI) models</li>
                </ul>
              </div>

              {/* Exact Google Clause 4: Data Protection Mechanisms */}
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <h3 className="font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--pista)]" />
                  Data Protection Mechanisms for Sensitive Data
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink)] font-medium leading-relaxed">
                  Security procedures are in place to protect the confidentiality of your data. We use encryption to protect your information, including industry-standard AES-256 cryptographic encryption for all cached data at rest on your device and TLS 1.3 protocol encryption for all data in transit across networks. OAuth tokens are sender-constrained and securely maintained in hardware-backed storage.
                </p>
              </div>

              {/* Exact Google Clause 5: Data Retention & Deletion */}
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <h3 className="font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--pista)]" />
                  Data Retention and Deletion Disclosures
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink)] font-medium leading-relaxed">
                  We store your personal information for a period of time that is consistent with our business purposes. We will retain your personal information for the length of time needed to fulfill the purposes outlined in this privacy policy unless a longer retention period is required or permitted by law. When the data retention period expires for a given type of data, we will delete or destroy it.
                </p>
                <p className="text-xs text-[var(--ink)] leading-relaxed font-semibold">
                  You may request for your data to be deleted by emailing our Data Protection Officer at <a href="mailto:amit@devamit.co.in" className="text-[var(--pista)] underline">amit@devamit.co.in</a> or by opening Settings &rarr; Security &rarr; &ldquo;Revoke Google Access &amp; Hard Delete Account&rdquo; within the Neev Sanctuary application. All tokens and synchronized items are permanently purged within 24 hours.
                </p>
              </div>

              {/* Exact Google Clause 6: AI / ML Model Training Explicit Affirmation */}
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <h3 className="font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--pista)]" />
                  AI / ML Use Cases &amp; Google Workspace API Policy Affirmation
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink)] font-bold leading-relaxed text-[var(--terracotta)]">
                  For AI/ML use cases, your privacy policy must explicitly affirm that Google Workspace APIs are not used to develop, improve, or train non-personalized AI and/or ML models.
                </p>
                <p className="text-xs sm:text-sm text-[var(--ink)] font-medium leading-relaxed">
                  We explicitly affirm that Google Workspace APIs are not used to develop, improve, or train non-personalized AI and/or ML models. Neither Google user data nor Google Workspace API data is ever ingested or leveraged to train generalized artificial intelligence models, foundational large language models (LLMs), or shared algorithms.
                </p>
              </div>

              {/* Exact Google Clause 7: Google Limited Use Commitment Verbatim */}
              <div className="p-4 rounded-xl bg-[var(--surface)] border-2 border-[var(--pista)] space-y-2">
                <h3 className="font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[var(--pista)]" />
                  Google Limited Use Policy Commitment (Verbatim)
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink)] font-bold leading-relaxed">
                  Neev Sanctuary&rsquo;s use and transfer of information received from Google APIs to any other app will adhere to the{' '}
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--pista)] underline"
                  >
                    Google API Services User Data Policy
                  </a>
                  , including the Limited Use requirements.
                </p>
              </div>
            </section>

            {/* Section 3: Exhaustive Google Workspace OAuth Scopes Matrix */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                3. Google Workspace APIs, OAuth Scopes &amp; Exact Technical Justifications
              </h2>
              <p>
                When you connect your Google Account to Neev Sanctuary (on web or mobile), connecting Google is <strong>completely optional</strong>. The core family sanctuary operates without Google integration. If you choose to enable Google sync, we request explicit, granular permissions. Below is the complete catalog of requested Google Workspace scopes, their access level, and why our application requires them:
              </p>

              <div className="space-y-4 pt-2">
                {/* Scope 1: Calendar */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--pista)]">
                      https://www.googleapis.com/auth/calendar.events
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                      Google Calendar API · Bi-Directional Event Export
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ink)] mb-2">
                    <strong>User Benefit &amp; Functionality:</strong> Allows families to sync sacred Indian festival tithis (Diwali, Chhath Puja, Durga Puja), pediatric vaccination appointments, school exam schedules, and elder doctor visits directly into their personal Google Calendar.
                  </p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    <strong>Access Level &amp; Data Handled:</strong> Read and write access limited by application filtering strictly to events created by or tagged for Neev Sanctuary. We do not inspect, index, or store unrelated private events outside your designated family coordination activities.
                  </p>
                </div>

                {/* Scope 2: Tasks */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--pista)]">
                      https://www.googleapis.com/auth/tasks
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                      Google Tasks API · Chores &amp; Reminders
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ink)] mb-2">
                    <strong>User Benefit &amp; Functionality:</strong> Coordinates shared household tasks across family members. Co-parents can assign grocery errands, medicine schedules, and utility payments that synchronize automatically with Google Tasks on Android and desktop devices.
                  </p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    <strong>Access Level &amp; Data Handled:</strong> Read and write access to the specific &ldquo;Neev Sanctuary&rdquo; task list. Unrelated personal task lists are ignored.
                  </p>
                </div>

                {/* Scope 3: Drive */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--pista)]">
                      https://www.googleapis.com/auth/drive.file &amp; drive.readonly
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                      Google Drive API · Heirloom Vault Backup
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ink)] mb-2">
                    <strong>User Benefit &amp; Functionality:</strong> Allows users to create a private backup of their family document vault (oral folklore audio files, heirloom recipes, emergency identity cards) directly in their personal Google Drive storage.
                  </p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    <strong>Access Level &amp; Data Handled:</strong> Strictly restricted via <code className="font-mono">drive.file</code> to files and folders created or opened by Neev Sanctuary. We have zero technical access to other files in your Google Drive.
                  </p>
                </div>

                {/* Scope 4: Docs & Sheets */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--pista)]">
                      Google Docs &amp; Google Sheets APIs
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                      Docs &amp; Sheets APIs · Export-Only Tools
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ink)] mb-2">
                    <strong>User Benefit &amp; Functionality:</strong> Enables one-click export of family memory books into formatted Google Docs, and family monthly grocery or utility budgets into Google Sheets for collaborative review.
                  </p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    <strong>Access Level:</strong> Write-only export operations. Neev does not continuously ingest or parse your private spreadsheets or documents.
                  </p>
                </div>

                {/* Scope 5: People / Contacts */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--pista)]">
                      https://www.googleapis.com/auth/contacts.readonly
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                      People API · Family Circle Contact Picker
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ink)] mb-2">
                    <strong>User Benefit &amp; Functionality:</strong> Allows family administrators to select trusted relatives (grandparents, siblings, pediatricians) to invite to their family sanctuary without manually typing phone numbers or email addresses.
                  </p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    <strong>Access Level:</strong> Ephemeral read access during invitation picker workflows. Contacts are never saved to advertising lists or third-party CRM databases.
                  </p>
                </div>

                {/* Scope 6: Google Meet */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--pista)]">
                      Google Meet API
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                      Meet API · Family Video Circle
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ink)] mb-2">
                    <strong>User Benefit &amp; Functionality:</strong> Generates instant, secure Google Meet links for scheduled multi-city Sunday family calls, milestone celebrations, and remote puja gatherings.
                  </p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    <strong>Access Level:</strong> Meeting creation API only. Neev never records, accesses, or eavesdrops on audio/video streams of your family calls.
                  </p>
                </div>

                {/* Scope 7: Core Authentication */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--pista)]">
                      openid, profile, email
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                      Google Sign-In · Identity &amp; Token Exchange
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ink)] mb-2">
                    <strong>User Benefit &amp; Functionality:</strong> Verifies your account identity securely without passwords, associates your profile with your family circle, and delivers critical safety notifications.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Audit of Discovered Google Cloud Project Services */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                4. Comprehensive Audit of Discovered Google Cloud Services (Project gen-lang-client-0587640262)
              </h2>
              <p>
                To provide 100% transparency, we have audited every API and service enabled in our Google Cloud Console project. We classify them into user-facing product features versus internal backend/developer infrastructure:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[var(--border)] rounded-xl overflow-hidden">
                  <thead className="bg-[var(--surface2)] border-b border-[var(--border)] font-mono text-[var(--ink-muted)] uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Service Identifier</th>
                      <th className="p-3">Classification</th>
                      <th className="p-3">Role in Neev Sanctuary</th>
                      <th className="p-3">Personal Data Handled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    <tr>
                      <td className="p-3 font-mono font-semibold text-[var(--ink)]">firebaseinstallations.googleapis.com</td>
                      <td className="p-3">Firebase Client SDK</td>
                      <td className="p-3">Firebase Installations API generates unique app-instance IDs for push notification delivery and client SDK stability.</td>
                      <td className="p-3">Anonymous app instance ID only; not linked to personal records.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-[var(--ink)]">generativelanguage.googleapis.com</td>
                      <td className="p-3">AI / LLM Service</td>
                      <td className="p-3">Gemini API powers optional in-app cultural summaries (panchang festival explanations, folklore formatting).</td>
                      <td className="p-3">Strictly sanitized cultural queries; no raw family health notes, children's PII, or Google Workspace data is sent.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-[var(--ink)]">firestore.googleapis.com</td>
                      <td className="p-3">Cloud Database</td>
                      <td className="p-3">Cloud Firestore API provides real-time document sync for active family shared chore boards and ritual calendars.</td>
                      <td className="p-3">Encrypted family chore records and calendar metadata restricted by security rules.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-[var(--ink)]">identitytoolkit.googleapis.com</td>
                      <td className="p-3">Auth Infrastructure</td>
                      <td className="p-3">Identity Toolkit API validates Google Sign-In tokens and manages secure user authentication sessions.</td>
                      <td className="p-3">Email address, Google UID, and session tokens.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-[var(--ink)]">securetoken.googleapis.com / sts.googleapis.com</td>
                      <td className="p-3">Security Token Service</td>
                      <td className="p-3">Token Service API handles background credential exchange for short-lived OAuth 2.0 access tokens.</td>
                      <td className="p-3">Ephemeral cryptographic tokens; no personal profile data stored.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-[var(--ink)]">cloudaicompanion.googleapis.com</td>
                      <td className="p-3">Developer Tooling</td>
                      <td className="p-3">Gemini for Google Cloud API is used solely by development engineering tools (IDE assistant) during software construction.</td>
                      <td className="p-3">Zero user data processed; developer workstation only.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-[var(--ink)]">calendar-json.googleapis.com &amp; tasks.googleapis.com</td>
                      <td className="p-3">User-Facing APIs</td>
                      <td className="p-3">Google Calendar and Tasks APIs enable bidirectional household schedule and chore synchronization.</td>
                      <td className="p-3">User-selected family calendar events and task entries.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-[var(--ink)]">Other Infrastructure APIs (Cloud Logging, Monitoring, Pub/Sub, Storage)</td>
                      <td className="p-3">Cloud Platform Ops</td>
                      <td className="p-3">Google Cloud default operational APIs used for server uptime monitoring, operational logs, and error alerting.</td>
                      <td className="p-3">Server performance metrics and anonymized operational request logs.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 5: Gemini AI Data Minimization Safeguards */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                5. Generative AI (Gemini API) &amp; Sensitive Data Minimization Safeguards
              </h2>
              <p>
                Neev Sanctuary employs generative AI (via the official Google Gemini API) strictly for optional, cultural enhancement features—such as explaining traditional Indian rituals, converting regional panchang dates to Gregorian calendars, or generating bedtime folklore outlines. We enforce rigorous data-protection boundaries:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>
                  <strong>Data Minimization Boundary:</strong> Family health notes, children&rsquo;s names, medication timestamps, and Google Workspace user data are <strong>strictly filtered out</strong> at the request-building boundary before any call to the Gemini API is made.
                </li>
                <li>
                  <strong>Zero Training on User Context:</strong> Under our enterprise API arrangement, user prompts submitted via the Gemini API are not used to train or refine Google foundation models.
                </li>
                <li>
                  <strong>No Human Prompt Review:</strong> Sensitive family records are never stored in prompt evaluation logs or exposed to human reviewers.
                </li>
              </ul>
            </section>

            {/* Section 6: Local-First Storage Architecture */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                6. Local-First Sovereignty &amp; Encryption Standards
              </h2>
              <p>
                Unlike conventional consumer platforms that store unencrypted family life on centralized servers, Neev Sanctuary is designed as a <strong>Local-First System</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>
                  <strong>Hardware Keystore Protection:</strong> Daily routines, milestone logs, and family health entries on mobile devices are stored in an encrypted MMKV binary database backed by AES-256-GCM hardware keys residing in the iOS Secure Enclave or Android Keystore.
                </li>
                <li>
                  <strong>Offline Resilience:</strong> You can view and manage routines, read folklore, and check festival dates without active cellular or Wi-Fi connectivity.
                </li>
                <li>
                  <strong>Zero Cloud Location Telemetry:</strong> The Kutumb Radar and 3D spatial Bluetooth locator operate using peer-to-peer RF beaconing. We never upload continuous GPS coordinates or location breadcrumbs to any cloud server.
                </li>
              </ul>
            </section>

            {/* Section 7: User Controls, Revocation & Account Deletion */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                7. Data Revocation, Account Deletion &amp; User Controls
              </h2>
              <p>
                You retain complete ownership over your family data. You can disconnect integrations, purge records, or permanently delete your entire family sanctuary through three distinct methods:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
                  <h3 className="font-bold text-xs text-[var(--ink)] mb-1 flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-[var(--terracotta)]" />
                    <span>1. In-App Immediate Purge</span>
                  </h3>
                  <p className="text-xs text-[var(--ink-secondary)]">
                    In the app, navigate to <em>Settings &gt; Sanctuary Profile &gt; Delete Family Sanctuary</em>. This wipes all local records, cached documents, and hardware encryption keys.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
                  <h3 className="font-bold text-xs text-[var(--ink)] mb-1 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[var(--pista)]" />
                    <span>2. Google Account Portal</span>
                  </h3>
                  <p className="text-xs text-[var(--ink-secondary)]">
                    Instantly revoke Neev Sanctuary&rsquo;s OAuth permissions anytime at{' '}
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
                  <h3 className="font-bold text-xs text-[var(--ink)] mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[var(--pista)]" />
                    <span>3. Direct Email Deletion</span>
                  </h3>
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

            {/* Section 8: Subprocessors & Infrastructure Disclosures */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                8. Third-Party Subprocessors &amp; Cloud Infrastructure
              </h2>
              <p>
                We do not sell data to advertisers. Neev Sanctuary uses only strictly audited infrastructure providers necessary to operate the application:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[var(--border)] rounded-xl overflow-hidden">
                  <thead className="bg-[var(--surface2)] border-b border-[var(--border)] font-mono text-[var(--ink-muted)] uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Entity</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Data Location</th>
                      <th className="p-3">Security Certifications</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    <tr>
                      <td className="p-3 font-semibold text-[var(--ink)]">Google Cloud Platform &amp; Firebase</td>
                      <td className="p-3">Authentication, OAuth token validation, and optional Calendar/Task sync</td>
                      <td className="p-3">Global / India (asia-south1)</td>
                      <td className="p-3">SOC 2 Type II, ISO 27001</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[var(--ink)]">Supabase Inc.</td>
                      <td className="p-3">Family Membership Relays, Encrypted Database Backups</td>
                      <td className="p-3">EU (Frankfurt) / Asia (Mumbai)</td>
                      <td className="p-3">AES-256 at Rest, Row-Level Security (RLS)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[var(--ink)]">Cloudflare, Inc.</td>
                      <td className="p-3">Edge Web Delivery, DNS, and DDoS Mitigation</td>
                      <td className="p-3">Global Edge Network</td>
                      <td className="p-3">TLS 1.3 Strict, Zero-Payload Caching</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 9: Multi-Generational & Children's Privacy */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)]">
                9. Children&rsquo;s Privacy &amp; Multi-Generational Safeguards
              </h2>
              <p>
                Neev Sanctuary is designed for family harmony, which means children participate under the direct affirmative consent and management of verified parent or legal guardian accounts:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Children cannot register standalone accounts without a parent invite.</li>
                <li>Children’s interfaces are 100% ad-free with zero behavioral profiling or algorithmically recommended feeds.</li>
                <li>In accordance with the India Digital Personal Data Protection (DPDP) Act 2023 and COPPA, parents can review, modify, or permanently delete any record created by a minor child at any time.</li>
              </ul>
            </section>

            {/* Section 10: Contact Information */}
            <section className="space-y-3 pt-6 border-t border-[var(--border)]">
              <h2 className="font-serif text-xl font-bold text-[var(--ink)]">
                10. Contact Our Data Protection Officer
              </h2>
              <p className="text-xs">
                For questions regarding this policy, our Google Limited Use commitments, or data deletion requests, contact:
              </p>
              <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs space-y-1">
                <p><strong>Amit Chakraborty</strong> — Founder &amp; Principal Systems Architect</p>
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
