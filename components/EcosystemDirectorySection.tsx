import { ArrowUpRight, ShieldCheck, Sparkles, Heart, Home, Eye, Users } from 'lucide-react'

interface EcosystemApp {
  name: string
  tagline: string
  description: string
  icon: any
  badge: string
  status: string
  playUrl: string
}

const APPS: EcosystemApp[] = [
  {
    name: 'Thrivefold',
    tagline: 'Mindful Health & Alarm-Clock Routines',
    description: 'On-device biomechanics, 12-hour AM/PM routine alarms, local RAG voice companion, and encrypted health records.',
    icon: Sparkles,
    badge: 'Flagship Health',
    status: 'In Production (Google Play)',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.thrivefold',
  },
  {
    name: 'HarmonyBloom',
    tagline: "Women's Hormonal Harmony & Sanctuary",
    description: 'Authentic sage-green cycle awareness, phase-tailored insights, private journal, and mindful wellbeing sanctuary.',
    icon: Heart,
    badge: "Women's Health",
    status: 'In Production (Google Play)',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.harmonybloom',
  },
  {
    name: 'Neev Sanctuary',
    tagline: 'Private Family Operating System',
    description: 'Sacred offline family spaces, child emergency beacon, schedules, spatial radar, and peer-to-peer sync.',
    icon: Home,
    badge: 'Family OS',
    status: 'In Production (Google Play)',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.neev',
  },
  {
    name: 'Setu',
    tagline: 'Offline P2P Mesh & Identity Anchor',
    description: 'Near-zero battery nearby discovery, Wi-Fi Aware peer transfers, and cryptographic federated identity.',
    icon: ShieldCheck,
    badge: 'Peer Mesh',
    status: 'In Production (Google Play)',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.setu',
  },
  {
    name: 'BlinkQuest',
    tagline: 'Vision Ergonomics & Blink Coach',
    description: 'MediaPipe on-device blink rate tracking, screen fatigue breaks, and vision ergonomics for digital professionals.',
    icon: Eye,
    badge: 'Vision Health',
    status: 'In Production (Google Play)',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.blinkquest',
  },
]

export function EcosystemDirectorySection() {
  return (
    <section id="ecosystem" className="scroll-mt-24 py-16 px-4">
      <div className="mx-auto max-w-[1140px] space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--terracotta,#c46849)] block">
            AnvayKosh Ecosystem (अन्वयकोश)
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[var(--ink,#1c1917)] tracking-tight">
            One Unified Offline-First Family of Apps
          </h2>
          <p className="max-w-[680px] mx-auto text-sm sm:text-base text-[var(--ink-secondary,#78716c)]">
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
                className="rounded-2xl border border-[var(--border-subtle,#e7e5e4)] bg-white p-6 flex flex-col justify-between hover:border-[var(--terracotta,#c46849)] transition-colors duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[var(--terracotta,#c46849)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-[var(--ink-secondary,#78716c)]">
                      {app.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[var(--ink,#1c1917)]">{app.name}</h3>
                    <p className="text-xs font-medium text-[var(--terracotta,#c46849)] mt-0.5">{app.tagline}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--ink-secondary,#78716c)] leading-relaxed">
                    {app.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[var(--border-subtle,#e7e5e4)] mt-6">
                  <a
                    href={app.playUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ink,#1c1917)] hover:text-[var(--terracotta,#c46849)] transition-colors"
                  >
                    <span>Google Play Track</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )
          })}

          {/* Join Beta Testing Community Card */}
          <div className="rounded-2xl border border-dashed border-[var(--terracotta,#c46849)] bg-orange-50/50 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--terracotta,#c46849)] flex items-center justify-center text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-medium text-[var(--ink,#1c1917)]">Beta Community</h3>
                <p className="text-xs font-medium text-[var(--terracotta,#c46849)] mt-0.5">Google Groups Early Access</p>
                <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Open Community
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--ink-secondary,#78716c)] leading-relaxed">
                Join our verified Google Play Beta Testers group to receive early builds, shape ecosystem releases, and test offline cross-app sync.
              </p>
            </div>

            <div className="pt-6 border-t border-[var(--border-subtle,#e7e5e4)] mt-6">
              <a
                href="https://groups.google.com/g/anvaykosh-beta-testers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--terracotta,#c46849)] hover:underline"
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
