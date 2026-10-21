import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { siteConfig } from '@/lib/site'
import { Heart, Shield, ExternalLink, Code } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Neev Sanctuary & Amit Chakraborty',
  description: 'The story and engineering philosophy behind Neev Sanctuary — crafting digital sanctuaries rooted in Indian joint family traditions and zero-knowledge privacy.',
  alternates: { canonical: `${siteConfig.url}/about` },
}

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--bg)] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Hero */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--terracotta)] font-semibold block mb-2">
              Our Origin & Vision
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] mb-4 leading-tight">
              Crafting Digital Sanctuaries Rooted in Culture & Privacy
            </h1>
            <p className="text-sm sm:text-base text-[var(--ink-secondary)] font-light leading-relaxed">
              Neev was born from an intimate observation: modern family life is fragmented across messaging chats and calendars, while our deep ancestral wisdom and cultural rituals quietly slip through the cracks.
            </p>
          </div>

          {/* Philosophy Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="sanctuary-card p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[var(--pista-container)] text-[var(--pista-hover)] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[var(--ink)]">
                Multi-Generational Grounding
              </h2>
              <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                Indian families thrive on multi-generational synergy. Grandparents are the keepers of folklore and rituals; parents are the active orchestrators; children are the joyful explorers. We architect tailored interfaces for every generation.
              </p>
            </div>

            <div className="sanctuary-card p-8 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[var(--terracotta-container)] text-[var(--terracotta)] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[var(--ink)]">
                Zero-Knowledge Sanctuary
              </h2>
              <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                Your family’s intimate photos, folklore voice notes, and pediatric health timelines are protected by zero-knowledge client encryption. No advertisements, no surveillance capitalism, no tracking.
              </p>
            </div>
          </div>

          {/* Architect Bio */}
          <div className="sanctuary-card p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-20 h-20 rounded-3xl bg-[var(--pista-container)] border border-[var(--pista)]/30 flex items-center justify-center font-serif text-3xl font-bold text-[var(--pista-hover)] shrink-0">
                AC
              </div>
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--terracotta)] font-semibold block">
                  Founding Architect
                </span>
                <h3 className="font-serif text-2xl font-bold text-[var(--ink)]">
                  Amit Chakraborty (@devamitch)
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                  Amit Chakraborty is a systems and mobile architect building human-centric software across Android, iOS, and Web. Based in Bengaluru and Kolkata, Amit crafts digital heirlooms designed to serve human well-being, authentic community bonding, and cultural preservation.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
                  <a
                    href="https://devamit.co.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--pista)] underline font-bold"
                  >
                    <span>Portfolio (devamit.co.in)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://github.com/devamitch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--ink-secondary)] hover:text-[var(--ink)]"
                  >
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://x.com/devamitch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--ink-secondary)] hover:text-[var(--ink)]"
                  >
                    <span>X / Twitter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
