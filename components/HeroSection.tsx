'use client';

import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  ShieldCheck,
  Sparkles,
  Lock,
  Calendar,
  Heart,
  Activity
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface HeroCard {
  id: string;
  title: string;
  subtitle: string;
  photo: string;
  badge: string;
}

const HERO_SCREENS: HeroCard[] = [
  {
    id: 'dashboard',
    title: 'Sanctuary Dashboard',
    subtitle: 'Daily Rhythms & Sprout Mascot',
    photo: '/assets/app/01_dashboard_sanctuary.png',
    badge: 'Living Mascot · Active',
  },
  {
    id: 'rituals',
    title: 'Panchang Ritual Engine',
    subtitle: 'Sacred Tithis & Chores',
    photo: '/assets/illustrations/neev_functions_rituals.png',
    badge: 'Google Calendar Synced',
  },
  {
    id: 'vault',
    title: 'Sanskriti Heirloom Vault',
    subtitle: 'Oral Folklore & Recipes',
    photo: '/assets/illustrations/neev_heirloom_vault.png',
    badge: 'AES-256 Keystore Vault',
  },
  {
    id: 'settings',
    title: 'Security & Theme Controls',
    subtitle: 'Google Disconnect & Purge',
    photo: '/assets/app/05_sanctuary_settings_theme.png',
    badge: '1-Tap Hard Deletion',
  },
  {
    id: 'home',
    title: 'Kutumb Family Hearth',
    subtitle: 'Shared Parenting & Care',
    photo: '/assets/illustrations/neev_sanctuary_home.png',
    badge: 'Multi-Gen Harmony',
  },
];

const LIVE_ACTIVITIES = [
  'Just now: Diwali Lakshmi Puja synchronized with Dad & Mom’s Google Calendar',
  '4m ago: Dada’s 1952 Ganges oral history sealed in Sanskriti Keystore Vault',
  '12m ago: Manipal Hospital pediatric checkup routed to co-parent Google Tasks',
  '18m ago: Sofa cushion acoustic burst located phone beneath divan cushions',
];

export function HeroSection() {
  const [centerIndex, setCenterIndex] = useState(0);
  const [activityIndex, setActivityIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % LIVE_ACTIVITIES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const leftIndex = (centerIndex - 1 + HERO_SCREENS.length) % HERO_SCREENS.length;
  const rightIndex = (centerIndex + 1) % HERO_SCREENS.length;

  const centerCard = HERO_SCREENS[centerIndex];
  const leftCard = HERO_SCREENS[leftIndex];
  const rightCard = HERO_SCREENS[rightIndex];

  const swapToLeft = () => setCenterIndex(leftIndex);
  const swapToRight = () => setCenterIndex(rightIndex);

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-14 lg:px-10">
      {/* Subtle dual radial ambient aura */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[760px] bg-[radial-gradient(60%_60%_at_70%_20%,rgba(107,133,110,0.18),transparent_70%),radial-gradient(40%_40%_at_10%_10%,rgba(218,119,86,0.15),transparent_70%)]" />

      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        {/* Left Column: Editorial Story & Google Workspace Trust */}
        <div className="max-w-[620px] text-center lg:text-left mx-auto lg:mx-0">
          
          {/* Top Eyebrow Badge & Live Activity Ticker */}
          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-2 mb-4">
            <Link
              href="/beta"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--surface)] py-1.5 pl-2 pr-3.5 text-[12px] font-semibold text-[var(--ink-secondary)] border border-[var(--border)] shadow-xs transition-all hover:border-[var(--border-strong)]"
            >
              <span className="rounded-full bg-[var(--terracotta)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                Family OS Beta
              </span>
              <span>Sanctuary access for your kutumb</span>
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-[var(--terracotta)]"
                aria-hidden="true"
              />
            </Link>

            {/* Micro Live Activity Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface2)] border border-[var(--border)] text-[11px] font-mono text-[var(--ink-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate max-w-[240px] transition-all duration-500">
                {LIVE_ACTIVITIES[activityIndex]}
              </span>
            </div>
          </div>

          {/* OFFICIAL GOOGLE OAUTH 2.0 & APPLICATION PURPOSE VERIFICATION STATEMENT */}
          <div className="mb-6 p-4 rounded-2xl bg-[var(--pista-container)]/80 border border-[var(--pista)] text-left shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-[var(--pista-hover)] shrink-0" />
              <span className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider font-mono">
                Application Purpose &amp; Public Access Statement
              </span>
            </div>
            <p className="text-xs text-[var(--ink)] leading-relaxed mb-2 font-medium">
              <strong>Application Purpose:</strong> Neev Sanctuary is the private Indian Family
              Operating System engineered for multi-generational joint households (grandparents,
              parents, and children). It orchestrates shared parenting schedules, synchronizes daily
              routines and rituals with personal Google Workspace accounts (Calendar &amp; Tasks),
              and safeguards ancestral family memories.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1.5 border-t border-[var(--pista)]/30 text-[var(--ink-secondary)]">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  <strong>Public Website:</strong> No login or authentication required to explore
                  our features and privacy terms.
                </span>
              </span>
              <Link
                href="/privacy"
                className="font-bold text-[var(--pista-hover)] hover:underline inline-flex items-center gap-1"
              >
                <span>Privacy Policy &amp; Limited Use &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Grand Headline */}
          <h1 className="text-balance font-serif text-[clamp(2.75rem,6vw,5.2rem)] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--ink)]">
            A Private Sanctuary for the{' '}
            <span className="italic font-normal text-[var(--pista-hover)] relative inline-block">
              Multi-Generational
            </span>{' '}
            Indian Family
          </h1>

          {/* Serene Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-[var(--ink-secondary)] leading-relaxed font-light">
            Coordinate shared parenting, harmonize daily routines with Google Calendar and Tasks,
            and preserve ancestral heirlooms — protected by zero-knowledge sovereignty and on-device
            hardware encryption.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/beta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-13 px-8 rounded-full bg-[var(--pista)] hover:bg-[var(--pista-hover)] text-white text-base font-semibold transition-all active:scale-95 shadow-none"
            >
              <span>Join Beta Sanctuary</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <a
              href="#screens"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-13 px-6 rounded-full bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--ink)] text-base font-semibold border border-[var(--border-strong)] transition-all active:scale-95 shadow-xs"
            >
              <Compass className="h-4 w-4 text-[var(--terracotta)]" aria-hidden="true" />
              <span>Explore Native Screens</span>
            </a>
          </div>

          {/* Heritage Trust Bullets */}
          <ul className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2.5 text-xs sm:text-sm font-medium text-[var(--ink-secondary)]">
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)]">
                <Check className="h-3 w-3" aria-hidden="true" />
              </span>
              100% On-Device MMKV Encryption
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)]">
                <Check className="h-3 w-3" aria-hidden="true" />
              </span>
              Google Calendar &amp; Tasks Sync
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)]">
                <Check className="h-3 w-3" aria-hidden="true" />
              </span>
              Zero AI Model Training
            </li>
          </ul>

          {/* Google Workspace Unauthenticated Reviewer Trust Card */}
          <div className="mt-8 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--pista-hover)] shrink-0" />
                <span className="text-xs font-bold text-[var(--ink)]">
                  Google Workspace Integration · Limited Use Verified
                </span>
              </div>
              <p className="text-[11px] text-[var(--ink-secondary)] leading-relaxed">
                Sync family festivals, pediatric vaccine appointments, and household chores directly
                into your personal Google Calendar and Google Tasks.
              </p>
            </div>
            <Link
              href="/privacy"
              className="text-xs font-semibold text-[var(--pista-hover)] hover:underline whitespace-nowrap shrink-0"
            >
              Privacy Policy &rarr;
            </Link>
          </div>
        </div>

        {/* Right Column: 3-Device Cascade Showcase with Real Screenshots */}
        <div className="relative mx-auto h-[480px] w-full max-w-[500px] sm:h-[580px] select-none flex items-center justify-center">
          {/* Backlight Radial Glow */}
          <div className="absolute inset-[8%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(107,133,110,0.25),transparent_65%)] blur-2xl" />

          {/* Left Tilted Device */}
          <button
            type="button"
            onClick={swapToLeft}
            aria-label={`Show ${leftCard.title}`}
            className="absolute left-0 top-[12%] w-[48%] -rotate-[7deg] rounded-[26px] sm:rounded-[34px] bg-[var(--surface)] p-1.5 sm:p-2 shadow-[0_35px_70px_-20px_rgba(20,31,28,0.25),0_2px_6px_rgba(20,31,28,0.06)] border border-[var(--border)] transition-all duration-500 hover:scale-105 hover:opacity-100 opacity-65 cursor-pointer z-10"
          >
            <div className="relative aspect-[1080/2400] w-full rounded-[20px] sm:rounded-[28px] overflow-hidden bg-[#FAF9F5]">
              <Image
                src={leftCard.photo}
                alt={leftCard.title}
                fill
                sizes="240px"
                className="object-cover object-top"
              />
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] shadow-xs whitespace-nowrap hidden sm:block">
              <span className="text-[10px] font-bold text-[var(--ink)]">{leftCard.title}</span>
            </div>
          </button>

          {/* Right Tilted Device */}
          <button
            type="button"
            onClick={swapToRight}
            aria-label={`Show ${rightCard.title}`}
            className="absolute right-0 top-[16%] w-[48%] rotate-[7deg] rounded-[26px] sm:rounded-[34px] bg-[var(--surface)] p-1.5 sm:p-2 shadow-[0_35px_70px_-20px_rgba(20,31,28,0.25),0_2px_6px_rgba(20,31,28,0.06)] border border-[var(--border)] transition-all duration-500 hover:scale-105 hover:opacity-100 opacity-65 cursor-pointer z-10"
          >
            <div className="relative aspect-[1080/2400] w-full rounded-[20px] sm:rounded-[28px] overflow-hidden bg-[#FAF9F5]">
              <Image
                src={rightCard.photo}
                alt={rightCard.title}
                fill
                sizes="240px"
                className="object-cover object-top"
              />
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] shadow-xs whitespace-nowrap hidden sm:block">
              <span className="text-[10px] font-bold text-[var(--ink)]">{rightCard.title}</span>
            </div>
          </button>

          {/* Center Dominant Device */}
          <div className="absolute left-1/2 top-0 z-20 w-[56%] sm:w-[54%] -translate-x-1/2 rounded-[28px] sm:rounded-[36px] bg-[var(--surface)] p-1.5 sm:p-2.5 shadow-[0_45px_90px_-24px_rgba(20,31,28,0.35),0_4px_12px_rgba(20,31,28,0.08)] border border-[var(--border-strong)] transition-all duration-500">
            <div className="relative aspect-[1080/2400] w-full rounded-[22px] sm:rounded-[30px] overflow-hidden bg-[#FAF9F5]">
              <Image
                key={centerCard.id}
                src={centerCard.photo}
                alt={centerCard.title}
                fill
                sizes="340px"
                className="object-cover object-top"
                priority
              />
              {/* Subtle specular reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent pointer-events-none" />
            </div>

            {/* Bottom floating badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] shadow-md whitespace-nowrap flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--pista)] animate-pulse" />
              <span className="text-[11px] font-bold text-[var(--ink)]">{centerCard.badge}</span>
            </div>
          </div>

          {/* Interactive Navigation Chevron Arrows */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
            <button
              type="button"
              onClick={swapToLeft}
              aria-label="Previous screen"
              className="w-9 h-9 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-xs flex items-center justify-center text-[var(--ink)] hover:bg-[var(--surface2)] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5">
              {HERO_SCREENS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCenterIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === centerIndex ? 'w-6 bg-[var(--pista)]' : 'w-2 bg-[var(--border-strong)]'
                  }`}
                  aria-label={`Jump to screen ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={swapToRight}
              aria-label="Next screen"
              className="w-9 h-9 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-xs flex items-center justify-center text-[var(--ink)] hover:bg-[var(--surface2)] transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
