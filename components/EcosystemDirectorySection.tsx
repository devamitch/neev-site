import { ArrowUpRight, ShieldCheck, Sparkles, Heart, Home, Eye, Users } from 'lucide-react'

interface EcosystemApp {
  name: string
  tagline: string
  description: string
  icon: any
  badge: string
  playUrl: string
}

const APPS: EcosystemApp[] = [
  {
    name: 'Thrivefold',
    tagline: 'Mindful Health & Alarm-Clock Routines',
    description: 'On-device biomechanics, 12-hour AM/PM routine alarms, local RAG voice companion, and encrypted health records.',
    icon: Sparkles,
    badge: 'Flagship Health',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.thrivefold',
  },
  {
    name: 'HarmonyBloom',
    tagline: "Women's Hormonal Harmony & Sanctuary",
    description: 'Authentic sage-green cycle awareness, phase-tailored insights, private journal, and mindful wellbeing sanctuary.',
    icon: Heart,
    badge: "Women's Health",
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.harmonybloom',
  },
  {
    name: 'Neev Sanctuary',
    tagline: 'Private Family Operating System',
    description: 'Sacred offline family spaces, child emergency beacon, schedules, spatial radar, and peer-to-peer sync.',
    icon: Home,
    badge: 'Family OS',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.neev',
  },
  {
    name: 'Setu',
    tagline: 'Offline P2P Mesh & Identity Anchor',
    description: 'Near-zero battery nearby discovery, Wi-Fi Aware peer transfers, and cryptographic federated identity.',
    icon: ShieldCheck,
    badge: 'Peer Mesh',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.setu',
  },
  {
    name: 'BlinkQuest',
    tagline: 'Vision Ergonomics & Blink Coach',
    description: 'MediaPipe on-device blink rate tracking, screen fatigue breaks, and vision ergonomics for digital professionals.',
    icon: Eye,
    badge: 'Vision Health',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.blinkquest',
  },
]

export function EcosystemDirectorySection() {
  return (
    <section id="ecosystem" className="scroll-mt-24">
      <div className="mx-auto max-w-[1140px] space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--pista)] block">
            AnvayKosh Ecosystem (अन्वयकोश)
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[var(--ink)] tracking-tight">
            One Unified Offline-First Family of Apps
          </h2>
          <p className="max-w-[680px] mx-auto text-sm sm:text-base text-[var(--ink-secondary)]">
            Every application in the AnvayKosh ecosystem stores records in hardware-backed device keystores, operates
            completely offline, and adheres to zero-secret exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APPS.map((app) => {
            const Icon = app.icon
            return (
              <div
                key={app.name}
                className="squircle-card p-6 flex flex-col justify-between hover:border-[var(--pista)] transition-colors duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[var(--surface-tinted)] flex items-center justify-center text-[var(--pista)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--surface-tinted)] text-[var(--ink-secondary)]">
                      {app.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[var(--ink)]">{app.name}</h3>
                    <p className="text-xs font-medium text-[var(--pista)] mt-0.5">{app.tagline}</p>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                    {app.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[var(--border-subtle)] mt-6">
                  <a
                    href={app.playUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)] hover:text-[var(--pista)] transition-colors"
                  >
                    <span>Google Play Track</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )
          })}

          {/* Join Beta Testing Community Card */}
          <div className="squircle-card p-6 flex flex-col justify-between bg-[var(--surface-tinted)] border-dashed border-[var(--pista)]">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--pista)] flex items-center justify-center text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-medium text-[var(--ink)]">Beta Community</h3>
                <p className="text-xs font-medium text-[var(--pista)] mt-0.5">Google Groups Early Access</p>
              </div>
              <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                Join our verified Google Play Beta Testers group to receive early builds, shape ecosystem releases, and test offline cross-app sync.
              </p>
            </div>

            <div className="pt-6 border-t border-[var(--border-subtle)] mt-6">
              <a
                href="https://groups.google.com/g/anvaykosh-beta-testers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--pista)] hover:underline"
              >
                <span>Join anvaykosh-beta-testers</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
