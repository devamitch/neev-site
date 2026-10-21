import Image from 'next/image'
import { Calendar, Shield, MapPin, Heart, BookOpen, Layers, Check } from 'lucide-react'

export function FeatureBento() {
  const cards = [
    {
      title: 'Google Workspace Synchronization',
      subtitle: 'Two-way integration for busy family schedules',
      description: 'Export family rituals, doctor visits, and school preparation directly to Google Calendar and Google Tasks. Strictly verified under the Google Limited Use clause.',
      icon: Calendar,
      badge: 'Google Limited Use',
      image: '/assets/illustrations/neev_functions_rituals.png',
      accent: 'var(--pista)',
      colSpan: 'md:col-span-2',
      details: [
        'Automated calendar event creation for festivals and doctor visits',
        'Direct task export to Google Tasks with assignees & due dates',
        'Google Meet integration for multi-household family calls',
      ],
    },
    {
      title: 'Ancestral Cultural Legacy Vault',
      subtitle: 'Preserving recipes, folklore & generational wisdom',
      description: 'Record voice memories of grandparents, document heirloom cooking techniques, and store family archives that live beyond ephemeral chat threads.',
      icon: BookOpen,
      badge: 'Heirloom Archive',
      image: '/assets/illustrations/neev_heirloom_vault.png',
      accent: 'var(--terracotta)',
      colSpan: 'md:col-span-1',
      details: [
        'Lossless audio recording for Dada & Dadi stories',
        'Categorized recipe & cultural festival playbooks',
      ],
    },
    {
      title: 'Free Offline Tile Maps & 3D Radar',
      subtitle: 'Spatial telemetry with zero Google Maps billing',
      description: 'OpenStreetMap cartography with hardware spatial telemetry. Classify physical plane elevation (table vs. cushion) and acoustic burst detection.',
      icon: MapPin,
      badge: '100% Free Cartography',
      image: '/assets/illustrations/radar-empty.webp',
      accent: 'var(--pista)',
      colSpan: 'md:col-span-1',
      details: [
        'Precision WGS84 coordinates & altitude tracking',
        'Acoustic bursts to locate devices beneath sofa cushions',
      ],
    },
    {
      title: 'Shared Parenting & Milestone Radar',
      subtitle: 'Collaborative development tracking for both parents',
      description: 'Co-manage immunization schedules, dental checkups, and school milestones with clarity. No more forgotten permissions or duplicated pharmacy runs.',
      icon: Heart,
      badge: 'Pediatric Care',
      image: '/assets/illustrations/neev_tree_sanctuary.png',
      accent: 'var(--terracotta)',
      colSpan: 'md:col-span-2',
      details: [
        'Pediatric milestone radar with age-appropriate cues',
        'Shared medicine administration timestamps',
        'Emergency guardian alerts and doctor contacts',
      ],
    },
  ]

  return (
    <section id="features" className="py-20 md:py-28 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--terracotta)] font-semibold block mb-2">
          Sanctuary Architecture
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] mb-4 leading-tight">
          Engineered for Living Harmony
        </h2>
        <p className="text-sm sm:text-base text-[var(--ink-secondary)] font-light leading-relaxed">
          A coherent suite of tools designed around the real-world dynamics of modern Indian multi-generational homes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div
              key={idx}
              className={`sanctuary-card p-7 sm:p-9 flex flex-col justify-between ${card.colSpan} transition-all duration-300 hover:-translate-y-1 overflow-hidden group bg-[var(--surface)] rounded-[32px]`}
            >
              <div>
                {/* Visual Header Thumbnail */}
                <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 bg-[var(--surface2)]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/90 via-transparent to-transparent" />
                  <div className="absolute top-3.5 right-3.5">
                    <span className="px-3.5 py-1.5 rounded-full bg-[var(--surface)]/95 backdrop-blur-md text-[var(--pista-hover)] text-[10px] font-mono font-semibold uppercase">
                      {card.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3.5 left-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[var(--surface)]/95 backdrop-blur-md flex items-center justify-center text-[var(--pista)]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)] mb-1">
                  {card.title}
                </h3>
                <p className="text-xs font-mono text-[var(--terracotta)] mb-3">
                  {card.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 space-y-2.5">
                {card.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2 text-xs text-[var(--ink)]">
                    <Check className="w-3.5 h-3.5 text-[var(--pista)] shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
