'use client'

import { useState } from 'react'
import { Calendar, Shield, Heart, Compass, Sliders, CheckCircle2, Layers, Maximize2, Sparkles } from 'lucide-react'

const screens = [
  {
    id: 'dashboard',
    title: 'Sanctuary Living Dashboard',
    label: 'One Home for Family',
    icon: Layers,
    src: '/screenshots/01_one_home_sanctuary.png',
    tagline: 'Multi-Generational Harmony & Living Sprout',
    description:
      'The calm daily hearth for joint families. Features a living animated mascot with organic breathing cycles, quick perspective switcher for elders, parents, and kids, and upcoming festival tithis with Google Calendar indicators.',
    highlights: [
      'Pista & Terracotta authentic color harmonies',
      'One-tap switch between Grandparents, Parents, and Kids',
      'Bi-directional sync status for Google Calendar & Tasks',
    ],
  },
  {
    id: 'radar',
    title: 'Kutumb Live Radar Map',
    label: 'Stay Close Everywhere',
    icon: Compass,
    src: '/screenshots/02_stay_close_radar_map.png',
    tagline: 'Offline-First Spatial Telemetry',
    description:
      'Peer-to-peer proximity telemetry built with free OpenStreetMap cartography. Classifies physical elevation (table plane vs sofa cushion depth) and emits acoustic chirps to find misplaced phones without cellular service.',
    highlights: [
      'Zero continuous GPS tracking uploaded to cloud servers',
      'Acoustic penetration for sofa cushions and divans',
      '100% free cartography with zero Google Maps billing',
    ],
  },
  {
    id: 'rituals',
    title: 'Sacred Rituals & Panchang',
    label: 'Plan Together, Celebrate',
    icon: Calendar,
    src: '/screenshots/03_plan_together_rituals.png',
    tagline: 'Pan-Indian Tithis & Chores',
    description:
      'Harmonizes regional panchang dates (Ekadashi, Purnima, Diwali, Chhath Puja) with modern school and office schedules. Co-parents can delegate puja prep and chores directly to Google Tasks.',
    highlights: [
      'Accurate sandhya & puja muhurat calculations',
      'Automated chore delegation with assignees and due dates',
      'No commercial ads or algorithmic distractions',
    ],
  },
  {
    id: 'vault',
    title: 'Sanskriti Heirloom Vault',
    label: 'Preserve What Matters',
    icon: Heart,
    src: '/screenshots/04_preserve_memory_vault.png',
    tagline: 'Generational Wisdom & Folklore',
    description:
      'A permanent digital sanctuary for oral histories. Record Dada and Dadi’s childhood stories, store grandmother’s handwritten secret recipes, and safeguard family property deeds under AES-256 hardware encryption.',
    highlights: [
      'Lossless audio recording with visual waveform player',
      'Private family archive never shared with third parties',
      'Local encrypted backup with hardware keystore security',
    ],
  },
  {
    id: 'functions',
    title: 'Family Functions & Celebrations',
    label: 'Celebrations & Milestones',
    icon: Sliders,
    src: '/screenshots/05_plan_celebrate_functions.png',
    tagline: 'Plan, Celebrate, Stay Together',
    description:
      'Keep track of all upcoming family occasions, milestones, and pooja functions. Shared invitations, duty delegations, and synchronized calendar alerts for everyone in the family.',
    highlights: [
      'Multi-household coordinated event planner',
      'Automated reminders for birthdays, anniversaries & vrats',
      'Seamless Google Calendar synchronization',
    ],
  },
  {
    id: 'growth',
    title: 'Everyday Family Bonds',
    label: 'More Together, Every Day',
    icon: Shield,
    src: '/screenshots/06_more_together_everyday.png',
    tagline: 'Mindful Growth & Well-Being',
    description:
      'Cultivate everyday closeness with gentle reminders, shared moments, and family gratitude. Free from social media comparison, commercial feeds, or intrusive surveillance.',
    highlights: [
      'Zero ads, zero algorithmic feed, 100% privacy',
      'Culturally grounded in Indian joint family traditions',
      'Private family network with cryptographic invite keys',
    ],
  },
]

const DESIGN_BOARDS = [
  {
    id: 'b1',
    boardNum: 'Board 01',
    title: 'Complete Screen Gallery',
    category: 'Design System & Squircles',
    desc: 'High-fidelity layout of all native porcelain screens, raised-cosine bottom docks, and living sprout mascot states.',
    src: '/assets/screens/01_complete_screen_gallery.png',
  },
  {
    id: 'b2',
    boardNum: 'Board 02',
    title: 'Full Navigation & App Flow',
    category: 'Information Architecture',
    desc: 'Hierarchical navigation board showing elder-to-child perspective routing, bottom sheet modals, and PIP transitions.',
    src: '/assets/screens/02_full_app_and_navigation_board.png',
  },
  {
    id: 'b3',
    boardNum: 'Board 03',
    title: 'App Flow & Screen Inventory',
    category: 'Lifecycle & State Machines',
    desc: 'End-to-end navigational hierarchy, multi-generational perspective switching, and family invitation lifecycle.',
    src: '/assets/screens/03_app_flow_and_screen_inventory.png',
  },
  {
    id: 'b4',
    boardNum: 'Board 04',
    title: 'Detailed Screen Library',
    category: 'Micro-Interactions & Haptics',
    desc: 'Deep-dive component library with Fraunces serif typography, Pista and Terracotta palette harmonies, and tactile chips.',
    src: '/assets/screens/04_detailed_screen_library.png',
  },
  {
    id: 'b5',
    boardNum: 'Board 05',
    title: 'Features & PIP States',
    category: 'Spatial Telemetry & Audio',
    desc: 'Floating mini-player radar, persistent ritual countdown timer, and background acoustic chirp telemetry.',
    src: '/assets/screens/05_features_and_pip_states.png',
  },
  {
    id: 'b7',
    boardNum: 'Board 06',
    title: 'Product Design Masterboard',
    category: 'Full Production Spec',
    desc: 'Full product overview showcasing the living hearth, Pan-Indian panchang engine, and encrypted Sanskriti vault.',
    src: '/assets/screens/07_full_product_and_pip_design_board.png',
  },
]

export function ScreensShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeBoardModal, setActiveBoardModal] = useState<typeof DESIGN_BOARDS[0] | null>(null)
  const activeScreen = screens[activeIndex]

  return (
    <section id="screens" className="py-20 md:py-32 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="max-w-2xl mb-10 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)] text-xs font-mono uppercase tracking-wider mb-4 border-none">
            <Layers className="w-3.5 h-3.5" />
            <span>Official Play Store &amp; Fastlane Editions</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[var(--ink)] leading-tight mb-4">
            Inside the Sanctuary App
          </h2>
          <p className="text-sm sm:text-base text-[var(--ink-secondary)] leading-relaxed font-light">
            Crafted for multi-generational Indian families. Authentic porcelain surfaces, calm sacred spaces, offline-first privacy, and zero algorithmic distractions.
          </p>
        </div>

        {/* Full Feature Banner: One Home for Family */}
        <div className="mb-14 overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[var(--surface)] shadow-2xl shadow-black/8 border-none group">
          <img
            src="/screenshots/feature-graphic-hero.png"
            alt="Neev: One Home for Family"
            width={1795}
            height={876}
            className="w-full h-auto object-cover rounded-[28px] sm:rounded-[36px] block border-none group-hover:scale-[1.01] transition-transform duration-700 ease-out"
          />
        </div>

        {/* 2-Column Walkthrough */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Interactive Dimension Tabs */}
          <div className="lg:col-span-7 space-y-3">
            {screens.map((screen, idx) => {
              const Icon = screen.icon
              const isSelected = activeIndex === idx
              return (
                <button
                  key={screen.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left p-6 sm:p-7 rounded-[28px] transition-all cursor-pointer border-none ${
                    isSelected
                      ? 'bg-[var(--surface)] text-[var(--ink)] shadow-md shadow-black/5'
                      : 'bg-[var(--surface2)]/60 text-[var(--ink-secondary)] hover:bg-[var(--surface)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--terracotta)]">
                      {screen.label}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[var(--pista)]' : 'text-[var(--ink-muted)]'}`} />
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--ink)] mb-1">
                    {screen.title}
                  </h3>

                  <p className="text-xs font-mono text-[var(--pista-hover)] mb-2">
                    {screen.tagline}
                  </p>

                  {isSelected && (
                    <div className="mt-4 pt-3 space-y-3 animate-fadeIn">
                      <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                        {screen.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {screen.highlights.map((highlight, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-1.5 text-xs text-[var(--ink)]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--pista)] shrink-0" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Right Column: Borderless High-Resolution Marketing Poster */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[340px] sm:max-w-[380px]">
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[var(--surface)] shadow-2xl shadow-black/10 transition-all duration-500 ease-out hover:-translate-y-1.5 border-none">
                <img
                  key={activeScreen.id}
                  src={activeScreen.src}
                  alt={`Neev Sanctuary: ${activeScreen.title}`}
                  className="w-full h-full object-cover rounded-[28px] sm:rounded-[36px] block border-none animate-fadeIn"
                />
              </div>
              <div className="mt-5 text-center space-y-1">
                <span className="text-xs font-mono text-[var(--ink-muted)] block">
                  Official Play Store &amp; Fastlane Release Poster
                </span>
                <span className="text-[10px] font-mono text-[var(--terracotta)] uppercase font-semibold">
                  100% Native Multi-Generational Sanctuary
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Extended System Architecture & Design Boards Gallery */}
        <div className="mt-24 pt-16">
          <div className="max-w-2xl mb-10 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface2)] text-[var(--terracotta)] text-xs font-mono uppercase tracking-wider mb-3">
              <Sliders className="w-3.5 h-3.5" />
              <span>Engineering Blueprint &amp; Screen Inventory</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] mb-3">
              Production Architecture &amp; Design Masterboards
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
              Click on any board to expand in full-resolution zoom. Inspect the complete system architecture of Neev Sanctuary — including multi-perspective routing, Picture-in-Picture (PIP) states, panchang ritual scheduling, and local-first cryptographic vaults.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESIGN_BOARDS.map((board) => (
              <div
                key={board.id}
                onClick={() => setActiveBoardModal(board)}
                className="sanctuary-card p-5 rounded-[28px] group bg-[var(--surface)] hover:bg-[#FFFFFF] transition-all flex flex-col justify-between cursor-pointer hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[var(--surface2)] mb-4">
                  <img
                    src={board.src}
                    alt={board.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3.5 py-1.5 rounded-full bg-white/95 text-[11px] font-semibold text-[var(--ink)] flex items-center gap-1.5">
                      <Maximize2 className="w-3 h-3 text-[var(--terracotta)]" />
                      <span>Click to Zoom</span>
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-[var(--terracotta)] uppercase font-bold">
                      {board.boardNum}
                    </span>
                    <span className="text-[9px] font-mono text-[var(--ink-muted)] px-2.5 py-1 rounded-full bg-[var(--surface2)]">
                      {board.category}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-[var(--ink)] mb-1.5 group-hover:text-[var(--pista-hover)] transition-colors">
                    {board.title}
                  </h4>
                  <p className="text-xs text-[var(--ink-secondary)] leading-relaxed line-clamp-2">
                    {board.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Screen High-Resolution Lightbox Modal */}
      {activeBoardModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 sm:p-8 animate-fadeIn"
          onClick={() => setActiveBoardModal(null)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[92vh] bg-[var(--surface)] rounded-[32px] p-5 sm:p-7 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--terracotta)] font-bold block">
                  {activeBoardModal.boardNum} · {activeBoardModal.category}
                </span>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-[var(--ink)]">
                  {activeBoardModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveBoardModal(null)}
                className="px-4 py-2 rounded-full bg-[var(--surface2)] hover:bg-[var(--surface3)] text-xs font-semibold text-[var(--ink)] transition-colors cursor-pointer"
              >
                Close &times;
              </button>
            </div>

            {/* Modal Image Body with Natural Aspect Ratio */}
            <div className="flex-1 overflow-auto rounded-2xl bg-[#0D1210] p-2 flex items-center justify-center">
              <img
                src={activeBoardModal.src}
                alt={activeBoardModal.title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="pt-3 flex items-center justify-between text-xs text-[var(--ink-secondary)]">
              <span>{activeBoardModal.desc}</span>
              <span className="font-mono text-[10px] text-[var(--pista-hover)] font-bold">100% Native Architecture</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
