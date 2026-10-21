'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Calendar, Shield, Users, Compass, CheckCircle2, ArrowRight } from 'lucide-react'

export function HeroSection() {
  const [activeRole, setActiveRole] = useState<'grandparents' | 'parents' | 'children'>('parents')

  const rolePreviews = {
    grandparents: {
      title: 'Grandparents: Wisdom & Cultural Legacy',
      badge: 'Generational Anchor',
      description: 'Simplified, high-contrast, large-touch interfaces designed for Dada & Dadi. Record voice anecdotes, share heirloom recipes, and view daily prayer and medicine reminders effortlessly.',
      features: ['Voice-recorded folklore & bedtime stories', 'Panchang puja timings & medicine bells', 'One-tap family video check-ins'],
      accentColor: 'var(--terracotta)',
    },
    parents: {
      title: 'Parents: Shared Parenting & Routine Sync',
      badge: 'Family Orchestra',
      description: 'Harmonize co-parenting schedules, medical records, school fees, and grocery essentials across busy households with two-way Google Calendar and Tasks synchronization.',
      features: ['Google Calendar & Tasks family export', 'Pediatric vaccination & milestone radar', 'Collaborative meal & errand lists'],
      accentColor: 'var(--pista)',
    },
    children: {
      title: 'Children: Safe Rituals & Family Quests',
      badge: 'Sanctuary Explorer',
      description: 'An ad-free, secure sanctuary for kids to celebrate milestones, learn cultural roots through playful family challenges, and stay connected with distant cousins.',
      features: ['Curated family photo timeline', 'Dadi’s story audio player', 'Zero ads or predatory algorithms'],
      accentColor: 'var(--pista-hover)',
    },
  }

  const current = rolePreviews[activeRole]

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Background Soft Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[var(--pista-container)]/50 blur-[100px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--pista-container)] border border-[var(--pista)]/25 text-[var(--pista-hover)] text-xs font-mono font-medium tracking-wide uppercase mb-8 shadow-none">
          <span className="flex h-2 w-2 rounded-full bg-[var(--terracotta)] animate-pulse" />
          <span>The Modern Indian Joint Family OS</span>
        </div>

        {/* Living Mascot Emblem with Breathing Motion */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-3xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center p-3 animate-breathing sanctuary-card">
              <Image
                src="/favicon.png"
                alt="Living Neev Mascot"
                width={54}
                height={54}
                className="object-contain animate-tilt"
                priority
              />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-[var(--terracotta)] text-white text-[9px] font-mono tracking-wider uppercase font-semibold">
              Live
            </span>
          </div>
        </div>

        {/* Apple Large Title Serif Heading */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--ink)] leading-[1.1] mb-6">
          A Private Sanctuary for the <br />
          <span className="italic font-normal text-[var(--pista)]">
            Multi-Generational
          </span>{' '}
          Indian Family
        </h1>

        {/* Serene Subtitle */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-[var(--ink-secondary)] leading-relaxed mb-10 font-light">
          Coordinate shared parenting, harmonize daily routines with Google Calendar and Tasks, and preserve cultural heirlooms — protected by zero-knowledge privacy.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/beta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[var(--pista)] text-white text-sm font-semibold hover:bg-[var(--pista-hover)] transition-all shadow-none"
          >
            <span>Request Sanctuary Access</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] text-sm font-medium hover:border-[var(--border-strong)] transition-all shadow-none"
          >
            <Compass className="w-4 h-4 text-[var(--terracotta)]" />
            <span>Explore Architecture</span>
          </a>
        </div>

        {/* Multi-Generational Family Roles Interactive Switcher */}
        <div className="mx-auto max-w-3xl sanctuary-card p-6 sm:p-8 text-left transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--border)] gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--terracotta)] font-semibold block">
                Tailored Perspectives
              </span>
              <h3 className="font-serif text-xl font-bold text-[var(--ink)]">
                {current.title}
              </h3>
            </div>

            {/* Role Buttons */}
            <div className="flex items-center bg-[var(--surface2)] p-1 rounded-full border border-[var(--border)]">
              {(['grandparents', 'parents', 'children'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                    activeRole === role
                      ? 'bg-[var(--surface)] text-[var(--ink)] shadow-none font-semibold'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                {current.description}
              </p>
              <div className="space-y-2 pt-2">
                {current.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[var(--ink)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--pista)] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-1 rounded-2xl bg-[var(--surface2)] p-4 border border-[var(--border)] text-center space-y-2">
              <span className="text-[10px] font-mono text-[var(--ink-muted)] uppercase block">
                Sanctuary Mode
              </span>
              <div className="font-serif text-lg font-bold text-[var(--ink)] capitalize">
                {activeRole}
              </div>
              <span className="inline-block px-2.5 py-1 rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)] text-[10px] font-semibold">
                {current.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Google Workspace Coordination & Purpose Clarity Banner */}
        <div className="mt-8 mx-auto max-w-3xl rounded-2xl bg-[var(--surface)] p-5 border border-[var(--border)] text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--pista)] shrink-0" />
              <span className="text-xs font-semibold text-[var(--ink)]">
                Google Workspace Integration (Calendar &amp; Tasks)
              </span>
            </div>
            <p className="text-[11px] text-[var(--ink-secondary)] leading-relaxed">
              Export family festivals, doctor visits, and chores directly to your Google account. Zero AI model training, zero data sales, strictly compliant with Google Limited Use.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/privacy"
              className="text-xs font-semibold text-[var(--pista)] hover:underline whitespace-nowrap"
            >
              Privacy Policy &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
