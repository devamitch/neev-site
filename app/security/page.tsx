import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { siteConfig } from '@/lib/site'
import { ShieldCheck, Lock, Key, Database, RefreshCw, EyeOff } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Zero-Knowledge Security & Privacy Architecture',
  description: 'Details on our zero-knowledge encryption, local-first storage, on-device telemetry, and Google Limited Use compliance.',
  alternates: { canonical: `${siteConfig.url}/security` },
}

export default function SecurityPage() {
  const pillars = [
    {
      title: 'Zero-Knowledge Encryption',
      desc: 'All sensitive vault contents and folklore recordings are encrypted on the client device before cloud synchronization. We cannot read your family records.',
      icon: Lock,
    },
    {
      title: 'On-Device Spatial Telemetry',
      desc: 'Location telemetry and 3D radar calculations run exclusively in on-device memory. We never log or harvest your family GPS coordinates.',
      icon: EyeOff,
    },
    {
      title: 'Google Limited Use Strict Adherence',
      desc: 'Tokens for Google Calendar and Tasks are stored securely in Android Keystore / iOS Keychain. Google data is never shared with third parties or fed to AI trainers.',
      icon: ShieldCheck,
    },
    {
      title: 'Instant Hard Deletion',
      desc: 'You can delete your sanctuary anytime with zero waiting periods. Cryptographic keys are destroyed and cloud assets purged immediately.',
      icon: RefreshCw,
    },
  ]

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--pista)] font-semibold block mb-2">
              Privacy by Design
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] mb-4">
              Security & Zero-Knowledge Architecture
            </h1>
            <p className="text-sm sm:text-base text-[var(--ink-secondary)] font-light leading-relaxed">
              Family software must be held to the highest standard of sanctity. We build with mathematical guarantees, not advertising promises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="sanctuary-card p-8 space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--pista-container)] text-[var(--pista-hover)] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[var(--ink)]">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
