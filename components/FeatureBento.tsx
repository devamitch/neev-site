import { Calendar, Shield, Sparkles, MapPin, Heart, BookOpen, Layers, Check } from 'lucide-react'

export function FeatureBento() {
  const cards = [
    {
      title: 'Google Workspace Synchronization',
      subtitle: 'Two-way integration for busy family schedules',
      description: 'Export family rituals, doctor visits, and school preparation directly to Google Calendar and Google Tasks. Strictly verified under the Google Limited Use clause.',
      icon: Calendar,
      badge: 'Google Limited Use',
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
    <section id="features" className="py-16 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--terracotta)] font-semibold block mb-2">
          Sanctuary Architecture
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] mb-4 leading-tight">
          Engineered for Living Harmony
        </h2>
        <p className="text-sm sm:text-base text-[var(--ink-secondary)] font-light">
          A coherent suite of tools designed around the real-world dynamics of modern Indian multi-generational homes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div
              key={idx}
              className={`sanctuary-card p-6 sm:p-8 flex flex-col justify-between ${card.colSpan} hover:border-[var(--border-strong)] transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-center text-[var(--pista)]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)] text-[10px] font-mono font-semibold uppercase">
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)] mb-1">
                  {card.title}
                </h3>
                <p className="text-xs font-mono text-[var(--terracotta)] mb-4">
                  {card.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)] space-y-2">
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
