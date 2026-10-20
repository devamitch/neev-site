import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { siteConfig } from '@/lib/site'
import { CheckCircle2, Clock, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Product Roadmap · Neev Sanctuary',
  description: 'Upcoming features and engineering milestones for Neev Sanctuary: Indian language voice assistants, Wear OS extensions, and offline mesh sync.',
  alternates: { canonical: `${siteConfig.url}/roadmap` },
}

export default function RoadmapPage() {
  const milestones = [
    {
      quarter: 'Q4 2026',
      status: 'Current Focus',
      title: 'Google Verification & Closed Beta Rollout',
      items: [
        'Production verification of Google Calendar and Tasks scopes',
        'Initial cohort of 500 multi-generational family testers in India',
        'Zero-knowledge encrypted cloud backup engine',
      ],
      current: true,
    },
    {
      quarter: 'Q1 2027',
      status: 'Next Up',
      title: 'Multilingual Indian Voice Assistant for Elders',
      items: [
        'On-device speech recognition in Hindi, Bengali, Tamil, and Gujarati',
        'Voice prompt logging for Dadi & Dada folklore stories',
        'Automatic regional Panchang festival alerts',
      ],
      current: false,
    },
    {
      quarter: 'Q2 2027',
      status: 'In Design',
      title: 'Wear OS & Apple Watch Emergency Complications',
      items: [
        'One-tap family beacon from smartwatch watchfaces',
        'Fall detection alert handoff to co-parent emergency circle',
        'Heart rate and sleep synchronization for grandparents',
      ],
      current: false,
    },
  ]

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--terracotta)] font-semibold block mb-2">
              Evolution of the Sanctuary
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] mb-4">
              Product Roadmap
            </h1>
            <p className="text-sm sm:text-base text-[var(--ink-secondary)] font-light leading-relaxed">
              Our engineering milestones as we expand the digital heirloom across platforms and languages.
            </p>
          </div>

          <div className="space-y-6">
            {milestones.map((milestone, idx) => (
              <div
                key={idx}
                className={`sanctuary-card p-8 rounded-3xl ${
                  milestone.current ? 'border-[var(--pista)]/50 bg-[var(--surface)]' : 'bg-[var(--surface2)]/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[var(--pista)]">
                      {milestone.quarter}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)] text-[10px] font-mono font-semibold uppercase">
                      {milestone.status}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[var(--ink)]">
                    {milestone.title}
                  </h3>
                </div>

                <div className="space-y-2">
                  {milestone.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--ink-secondary)]">
                      <CheckCircle2 className="w-4 h-4 text-[var(--pista)] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
