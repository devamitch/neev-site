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
    <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-8 sm:pb-24 sm:pt-32 lg:px-10">
      {/* Setu & BlinkQuest Signature Warm Radial Ambient Light */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[760px] bg-[radial-gradient(55%_55%_at_68%_18%,rgba(218,119,86,0.14),transparent_72%),radial-gradient(45%_45%_at_12%_12%,rgba(107,133,110,0.16),transparent_72%)]" />

      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        {/* Left Narrative Column */}
        <div className="max-w-[640px] text-left">
          <Link
            href="/beta"
            className="group mb-7 inline-flex items-center gap-2.5 rounded-full bg-[var(--surface)] py-1.5 pl-2 pr-4 text-[13px] font-medium text-[var(--ink-secondary)] transition-transform duration-300 hover:scale-[1.02]"
          >
            <span className="rounded-full bg-[var(--pista)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
              Private Beta
            </span>
            <span>Now testing for Indian Families</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-[var(--pista)]" aria-hidden="true" />
          </Link>

          <h1 className="text-balance font-serif text-[clamp(2.75rem,7.2vw,6.2rem)] font-medium leading-[0.98] tracking-[-0.05em] text-[var(--ink)]">
            Harmonize family life <span className="italic text-[var(--terracotta)] font-normal">right at home.</span>
          </h1>

          <p className="mt-7 max-w-[540px] text-[17px] leading-8 text-[var(--ink-secondary)] sm:text-[19px]">
            Neev coordinates shared parenting, sacred festival panchang, and elder care across generations. Sync seamlessly with Google Calendar and Tasks, while family memories remain encrypted on your personal devices.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/beta"
              className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-[var(--pista)] hover:bg-[var(--pista-hover)] text-white px-8 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.985]"
            >
              <span>Get Neev for Family</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#EBEFE8] hover:bg-[#E1E7DE] text-[var(--ink)] px-7 text-base font-medium transition-colors"
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

        {/* Right Phone Cascade Canvas (Identical to Setu Architecture, zero shadows, pure porcelain bezels) */}
        <div className="relative mx-auto h-[440px] w-full max-w-[520px] sm:h-[600px]" aria-hidden="true">
          {/* Organic Ambient Warm Radial Glow */}
          <div className="absolute inset-[6%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(218,119,86,0.22),transparent_65%)] blur-3xl pointer-events-none" />
          <div className="absolute inset-[15%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(107,133,110,0.20),transparent_70%)] blur-2xl pointer-events-none" />

          <PhoneCard src={APP_SCREEN_RITUALS} className="left-0 top-[12%] w-[46%] -rotate-[6deg] transition-transform duration-500 hover:-translate-y-1" />
          <PhoneCard src={APP_SCREEN_VAULT} className="right-0 top-[16%] w-[46%] rotate-[6deg] transition-transform duration-500 hover:-translate-y-1" />
          <PhoneCard src={APP_SCREEN_HOME} className="left-1/2 top-0 z-10 w-[54%] -translate-x-1/2 transition-transform duration-500 hover:-translate-y-1" priority />
        </div>
      </div>
    </section>
  )
}

function PhoneCard({ src, className, priority }: { src: string; className: string; priority?: boolean }) {
  return (
    <div
      className={`absolute overflow-hidden rounded-[32px] bg-[var(--surface)] p-2 sm:rounded-[40px] sm:p-2.5 ${className}`}
    >
      <img
        src={src}
        alt=""
        width={576}
        height={1024}
        fetchPriority={priority ? 'high' : 'auto'}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="aspect-[9/16] w-full rounded-[24px] object-cover sm:rounded-[32px]"
      />
    </div>
  )
}
