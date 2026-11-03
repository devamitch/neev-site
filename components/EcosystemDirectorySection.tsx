import {
  ArrowDownToLine,
  ArrowUpRight,
  Building,
  CheckCircle2,
  ExternalLink,
  Eye,
  Globe,
  Heart,
  Home,
  ShieldCheck,
  Shirt,
  Smartphone,
  Sparkles,
  Truck,
  Users,
  Utensils,
  Zap,
} from 'lucide-react'

export interface EcosystemApp {
  name: string
  tagline: string
  description: string
  icon: any
  badge: string
  status: string
  packageId: string
  playUrl: string
  betaUrl: string
  apkUrl: string
  siteUrl: string
}

export const ECOSYSTEM_APPS: EcosystemApp[] = [
  {
    name: 'Thrivefold',
    tagline: 'Mindful Health & Biomechanics Companion',
    description: 'On-device camera pose coaching, 12-hour AM/PM routine alarms, Health Connect sync, local RAG voice companion, and hardware Keystore encryption.',
    icon: Sparkles,
    badge: 'Flagship Health',
    status: 'Google Play Beta Track',
    packageId: 'com.amit.thrivefold',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.thrivefold',
    betaUrl: 'https://play.google.com/apps/testing/com.amit.thrivefold',
    apkUrl: 'https://github.com/devamitch/thrivefold/releases',
    siteUrl: 'https://thrivefold.devamit.co.in',
  },
  {
    name: 'Setu',
    tagline: 'Offline P2P Mesh & Identity Anchor',
    description: 'Near-zero battery nearby discovery, Wi-Fi Direct peer swarm transfers, cryptographic federated identity, and local-first privacy.',
    icon: ShieldCheck,
    badge: 'Flagship Mesh',
    status: 'Google Play Beta Track',
    packageId: 'com.amit.setu',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.setu',
    betaUrl: 'https://play.google.com/apps/testing/com.amit.setu',
    apkUrl: 'https://github.com/devamitch/setu/releases',
    siteUrl: 'https://setu.devamit.co.in',
  },
  {
    name: 'HarmonyBloom',
    tagline: "Women's Hormonal Harmony & Sanctuary",
    description: 'Authentic sage-green cycle awareness, phase-tailored insights, private basal body temperature journal, and mindful wellbeing sanctuary.',
    icon: Heart,
    badge: "Women's Health",
    status: 'Google Play Beta Track',
    packageId: 'com.amit.harmonybloom',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.harmonybloom',
    betaUrl: 'https://play.google.com/apps/testing/com.amit.harmonybloom',
    apkUrl: 'https://github.com/devamitch/harmonybloom/releases',
    siteUrl: 'https://harmonybloom.devamit.co.in',
  },
  {
    name: 'Neev Sanctuary',
    tagline: 'Private Family Operating System',
    description: 'Sacred offline family spaces, multi-generational parenting rhythms, emergency radar maps, and encrypted cultural heirlooms.',
    icon: Home,
    badge: 'Family OS',
    status: 'Google Play Beta Track',
    packageId: 'com.amit.neev',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.neev',
    betaUrl: 'https://play.google.com/apps/testing/com.amit.neev',
    apkUrl: 'https://github.com/devamitch/neev/releases',
    siteUrl: 'https://neevsanctuary.devamit.co.in',
  },
  {
    name: 'BlinkQuest',
    tagline: 'Vision Ergonomics & Blink Coach',
    description: 'MediaPipe on-device blink rate tracking, screen fatigue breaks, and interactive vision ergonomics for digital professionals.',
    icon: Eye,
    badge: 'Vision Health',
    status: 'Google Play Beta Track',
    packageId: 'com.amit.blinkquest',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.blinkquest',
    betaUrl: 'https://play.google.com/apps/testing/com.amit.blinkquest',
    apkUrl: 'https://github.com/devamitch/blinkquest/releases',
    siteUrl: 'https://blinkquest.devamit.co.in',
  },
  {
    name: 'Ravuno',
    tagline: 'Hyperlocal Community Discovery',
    description: 'Privacy-respecting neighborhood networks, local verified bulletin boards, civic announcements, and offline-first community feeds.',
    icon: Zap,
    badge: 'Hyperlocal',
    status: 'Google Play Beta Track',
    packageId: 'com.amit.ravuno',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.ravuno',
    betaUrl: 'https://play.google.com/apps/testing/com.amit.ravuno',
    apkUrl: 'https://github.com/devamitch/ravuno/releases',
    siteUrl: 'https://ravuno.devamit.co.in',
  },
  {
    name: 'Haulwise',
    tagline: 'Smart Fleet & Logistical Dispatch',
    description: 'Intelligent multi-stop route optimization, offline-ready fuel economy analytics, load weight balance calculation, and dispatch dispatchers.',
    icon: Truck,
    badge: 'Logistics',
    status: 'Google Play Beta Track',
    packageId: 'com.amit.haulwise',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.haulwise',
    betaUrl: 'https://play.google.com/apps/testing/com.amit.haulwise',
    apkUrl: 'https://github.com/devamitch/haulwise/releases',
    siteUrl: 'https://haulwise.devamit.co.in',
  },
  {
    name: 'CrumbRush',
    tagline: 'Culinary Artisan & Pantry Rhythm',
    description: 'Zero-waste culinary inventory, pantry expiration tracker, sourdough fermentation timers, and offline recipe collections.',
    icon: Utensils,
    badge: 'Culinary Craft',
    status: 'Google Play Beta Track',
    packageId: 'com.amit.crumbrush',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.crumbrush',
    betaUrl: 'https://play.google.com/apps/testing/com.amit.crumbrush',
    apkUrl: 'https://github.com/devamitch/crumbrush/releases',
    siteUrl: 'https://crumbrush.devamit.co.in',
  },
  {
    name: 'Stayora',
    tagline: 'Serene Hospitality & Retreat Management',
    description: 'Boutique stay reservations, contactless on-device guest key management, mindful hospitality, and zero third-party commission booking.',
    icon: Building,
    badge: 'Hospitality',
    status: 'Google Play Beta Track',
    packageId: 'com.amit.stayora',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.stayora',
    betaUrl: 'https://play.google.com/apps/testing/com.amit.stayora',
    apkUrl: 'https://github.com/devamitch/stayora/releases',
    siteUrl: 'https://stayora.devamit.co.in',
  },
  {
    name: 'ThreadTry',
    tagline: 'AR Virtual Fitting & Fashion Try-On',
    description: 'Real-time on-device cloth simulation, body-contour drape scanning, designer wardrobe catalogs, and return-free shopping.',
    icon: Shirt,
    badge: 'AR Fashion',
    status: 'Google Play Beta Track',
    packageId: 'com.amit.threadtry',
    playUrl: 'https://play.google.com/store/apps/details?id=com.amit.threadtry',
    betaUrl: 'https://play.google.com/apps/testing/com.amit.threadtry',
    apkUrl: 'https://github.com/devamitch/threadtry/releases',
    siteUrl: 'https://threadtry.devamit.co.in',
  },
]

export function EcosystemDirectorySection() {
  return (
    <section id="ecosystem" className="scroll-mt-24 py-16 px-4">
      <div className="mx-auto max-w-[1240px] space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/70 text-[var(--terracotta,#c46849)] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AnvayKosh (अन्वयकोश) Master Ecosystem</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[var(--ink,#1c1917)] tracking-tight">
            Join Beta Testing &amp; Download APKs <br className="hidden sm:inline" />
            <span className="italic text-[var(--terracotta,#c46849)]">for All 10 Ecosystem Apps</span>
          </h2>
          <p className="max-w-[760px] mx-auto text-sm sm:text-base text-[var(--ink-secondary,#78716c)] leading-relaxed">
            Every application in the AnvayKosh ecosystem stores data locally with hardware-backed encryption, operates
            without remote tracking, and is available for testing on Google Play or as direct release APKs.
          </p>

          {/* Quick Group Action */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://groups.google.com/g/anvaykosh-beta-testers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--terracotta,#c46849)] hover:bg-[#b05a3c] text-white text-xs sm:text-sm font-semibold transition-all active:scale-[0.98]"
            >
              <Users className="w-4 h-4" />
              <span>Join AnvayKosh Google Testers Group (Pre-Approve All Apps)</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 10 Apps Grid - Pure Flat Squircles, No Borders, No Shadows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ECOSYSTEM_APPS.map((app) => {
            const Icon = app.icon
            return (
              <div
                key={app.name}
                className="rounded-3xl bg-[var(--surface2,#f6f3ee)] p-6 sm:p-7 flex flex-col justify-between transition-colors hover:bg-[var(--surface3,#eae4dc)]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--surface,#ffffff)] flex items-center justify-center text-[var(--terracotta,#c46849)]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[var(--surface,#ffffff)] text-[var(--ink-secondary,#78716c)]">
                      {app.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[var(--ink,#1c1917)]">{app.name}</h3>
                    <p className="text-xs font-semibold text-[var(--terracotta,#c46849)] mt-0.5">{app.tagline}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                        {app.status}
                      </span>
                      <code className="text-[10px] text-[var(--ink-muted,#a8a29e)] font-mono">
                        {app.packageId}
                      </code>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--ink-secondary,#78716c)] leading-relaxed">
                    {app.description}
                  </p>
                </div>

                {/* Direct Action Links - Flat Squircles, No Borders, No Shadows */}
                <div className="pt-6 mt-6 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={app.playUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-semibold bg-stone-900 hover:bg-black text-white transition-all active:scale-[0.98]"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Play Store</span>
                    </a>
                    <a
                      href={app.betaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-semibold bg-[var(--terracotta,#c46849)] hover:bg-[#b05a3c] text-white transition-all active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Join Beta</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={app.apkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-2xl text-[11px] font-semibold bg-[var(--surface,#ffffff)] hover:bg-stone-50 text-[var(--ink,#1c1917)] transition-all active:scale-[0.98]"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      <span>Direct APK</span>
                    </a>
                    <a
                      href={app.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-2xl text-[11px] font-semibold bg-[var(--surface,#ffffff)] hover:bg-stone-50 text-[var(--ink,#1c1917)] transition-all active:scale-[0.98]"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>App Site</span>
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Global Beta Community Box - Flat Organic Squircle, Zero Borders, Zero Shadows */}
        <div className="rounded-3xl bg-orange-100/50 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold text-[var(--ink,#1c1917)]">
              One Google Group. Pre-Approval for All 10 Apps.
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-secondary,#78716c)] max-w-2xl leading-relaxed">
              Google Play closed testing requires approved tester group membership. By joining <strong className="text-[var(--ink,#1c1917)]">anvaykosh-beta-testers</strong> with your Android Play Store Gmail, you are instantly pre-approved to test Thrivefold, Setu, BlinkQuest, and the entire suite.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://groups.google.com/g/anvaykosh-beta-testers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[var(--terracotta,#c46849)] hover:bg-[#b05a3c] text-white text-xs sm:text-sm font-semibold transition-all active:scale-[0.98]"
            >
              <Users className="w-4 h-4" />
              <span>Join anvaykosh-beta-testers</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="https://groups.google.com/g/setu-beta-testers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-full bg-[var(--surface,#ffffff)] hover:bg-stone-100 text-xs font-semibold text-[var(--ink,#1c1917)] transition-all active:scale-[0.98]"
            >
              <span>setu-beta-testers</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Architect & Personal Entity Link for Google Search Authority */}
        <div className="pt-2 text-center">
          <p className="text-xs sm:text-sm text-[var(--ink-secondary,#78716c)]">
            AnvayKosh Ecosystem architected &amp; engineered by{' '}
            <a
              href="https://amitchakraborty.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--ink,#1c1917)] hover:text-[var(--terracotta,#c46849)] underline underline-offset-4"
            >
              Amit Chakraborty (amitchakraborty.dev)
            </a>{' '}
            · Mobile Architect &amp; Systems Engineer ·{' '}
            <a
              href="https://amitchakraborty.dev/hire-react-native-architect-india"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--terracotta,#c46849)] hover:underline"
            >
              Remote Engineering &amp; Consulting
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
