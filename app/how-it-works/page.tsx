import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { siteConfig } from '@/lib/site'
import { Shield, Sparkles, Key, Smartphone, Cloud, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How It Works · Technical Architecture & Sync',
  description: 'Understand how Neev Sanctuary synchronizes your family rituals, protects memories with local-first security, and exports schedules to Google Calendar.',
  alternates: { canonical: `${siteConfig.url}/how-it-works` },
}

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Create Your Private Sanctuary Key',
      desc: 'Set up your family sanctuary on your phone in under 60 seconds. A cryptographic keypair is generated directly on-device. No advertising profile is ever created.',
      icon: Key,
    },
    {
      num: '02',
      title: 'Invite Multi-Generational Roles',
      desc: 'Send simple invites to Grandparents, Co-parents, and Kids. Each member is welcomed with an interface tuned specifically for their cognitive preferences and comfort.',
      icon: Smartphone,
    },
    {
      num: '03',
      title: 'Two-Way Google Workspace Export',
      desc: 'Optionally link your Google account. Neev pushes puja dates, school deadlines, and chore items to your personal Google Calendar and Google Tasks without ever reading your emails or unrelated files.',
      icon: Cloud,
    },
    {
      num: '04',
      title: 'Preserve Heirlooms Across Generations',
      desc: 'Grandparents record audio anecdotes, parents catalog ancestral recipes, and memories are timestamped on your family timeline forever.',
      icon: Sparkles,
    },
  ]

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--terracotta)] font-semibold block mb-2">
              Architecture & Flow
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] mb-4">
              How Neev Sanctuary Works
            </h1>
            <p className="text-sm sm:text-base text-[var(--ink-secondary)] font-light leading-relaxed">
              Designed for zero cognitive fatigue. Powerful enough for complex joint households, yet simple enough for elders on their first smartphone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon
              return (
                <div key={idx} className="sanctuary-card p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-[var(--pista)]">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[var(--surface2)] flex items-center justify-center text-[var(--terracotta)]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[var(--ink)]">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <Link
              href="/beta"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--pista)] text-white text-sm font-semibold hover:bg-[var(--pista-hover)] transition-all shadow-none"
            >
              <span>Join The Beta Testing Cohort</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
