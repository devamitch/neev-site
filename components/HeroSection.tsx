import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'

const PROMISES = [
  'Zero cloud requirement',
  'Hardware keystore encrypted',
  'Google Calendar & Tasks synced',
]

const APP_SCREEN_HOME = '/assets/app/01_dashboard_sanctuary.png'
const APP_SCREEN_RITUALS = '/assets/illustrations/neev_functions_rituals.png'
const APP_SCREEN_VAULT = '/assets/illustrations/neev_heirloom_vault.png'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36 lg:px-10">
      {/* Setu Signature Warm Radial Ambient Light */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(60%_60%_at_70%_20%,rgba(215,114,89,0.16),transparent_70%),radial-gradient(40%_40%_at_10%_10%,rgba(205,199,183,0.5),transparent_70%)]" />

      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Left Narrative Column */}
        <div className="max-w-[640px] text-left">
          <Link
            href="/beta"
            className="group mb-7 inline-flex items-center gap-2.5 rounded-full bg-[var(--surface)] py-1.5 pl-1.5 pr-4 text-[13px] font-medium text-[var(--ink-secondary)] shadow-[0_2px_10px_rgba(25,25,24,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(25,25,24,0.1)]"
          >
            <span className="rounded-full bg-[var(--pista)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
              Private Beta
            </span>
            <span>Now testing for Indian Families</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 text-[var(--pista)]" aria-hidden="true" />
          </Link>

          <h1 className="text-balance font-serif text-[clamp(2.75rem,7.4vw,6.4rem)] font-medium leading-[0.98] tracking-[-0.055em] text-[var(--ink)]">
            Harmonize family life <span className="italic text-[var(--terracotta)]">right at home.</span>
          </h1>

          <p className="mt-7 max-w-[540px] text-[17px] leading-8 text-[var(--ink-secondary)] sm:text-[19px]">
            Neev Sanctuary coordinates shared parenting, sacred festival panchang, and elder care across generations. Sync seamlessly with Google Calendar and Tasks, while family heirlooms remain encrypted on your personal devices.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/beta"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[var(--pista)] hover:bg-[var(--pista-hover)] text-white px-7 text-base font-semibold transition-transform active:scale-[0.985]"
            >
              <span>Get Neev for Family</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[var(--surface2)] hover:bg-[#E2DCCE] text-[var(--ink)] px-6 text-base font-medium transition-colors"
            >
              <span>See how it works</span>
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5">
            {PROMISES.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm font-medium text-[var(--ink-secondary)]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--pista-container)]">
                  <Check className="h-3 w-3 text-[var(--pista)]" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Phone Cascade Canvas (Identical to Setu Architecture) */}
        <div className="relative mx-auto h-[440px] w-full max-w-[520px] sm:h-[600px]" aria-hidden="true">
          <div className="absolute inset-[8%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(215,114,89,0.28),transparent_65%)] blur-2xl" />
          <PhoneCard src={APP_SCREEN_RITUALS} className="left-0 top-[12%] w-[46%] -rotate-[7deg]" />
          <PhoneCard src={APP_SCREEN_VAULT} className="right-0 top-[16%] w-[46%] rotate-[7deg]" />
          <PhoneCard src={APP_SCREEN_HOME} className="left-1/2 top-0 z-10 w-[54%] -translate-x-1/2" priority />
        </div>
      </div>
    </section>
  )
}

function PhoneCard({ src, className, priority }: { src: string; className: string; priority?: boolean }) {
  return (
    <div
      className={`absolute overflow-hidden rounded-[28px] bg-[var(--surface)] p-1.5 shadow-[0_40px_80px_-24px_rgba(25,25,24,0.30),0_2px_6px_rgba(25,25,24,0.06)] sm:rounded-[36px] sm:p-2 ${className}`}
    >
      <img
        src={src}
        alt=""
        width={576}
        height={1024}
        fetchPriority={priority ? 'high' : 'auto'}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="aspect-[9/16] w-full rounded-[22px] object-cover sm:rounded-[30px]"
      />
    </div>
  )
}
