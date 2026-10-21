'use client'

import { useState } from 'react'
import { PhoneFrame } from '@/components/PhoneFrame'
import { Calendar, Shield, Heart, Compass, Sliders, CheckCircle2, Lock, ArrowRight, Sparkles } from 'lucide-react'

const screens = [
  {
    id: 'dashboard',
    title: 'Sanctuary Living Dashboard',
    label: 'Multi-Generational Hub',
    icon: Sparkles,
    src: '/assets/app/01_dashboard_sanctuary.png',
    tagline: 'Apple Large Title & Living Sprout Mascot',
    description:
      'The calm daily hearth for joint families. Features a living animated mascot with organic breathing cycles, quick perspective switcher for elders and parents, and upcoming festival tithis with Google Calendar indicators.',
    highlights: [
      'Pista & Terracotta authentic color harmonies',
      'One-tap switch between Grandparents, Parents, and Kids',
      'Bi-directional sync status for Google Calendar & Tasks',
    ],
  },
  {
    id: 'rituals',
    title: 'Sacred Rituals & Panchang',
    label: 'Festival & Muhurat Engine',
    icon: Calendar,
    src: '/assets/illustrations/neev_functions_rituals.png',
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
    label: 'Oral Folklore & Recipes',
    icon: Heart,
    src: '/assets/illustrations/neev_heirloom_vault.png',
    tagline: 'Preserving Generational Wisdom',
    description:
      'A permanent digital sanctuary for oral histories. Record Dada and Dadi’s childhood stories, store grandmother’s handwritten secret recipes, and safeguard family property deeds under AES-256 hardware encryption.',
    highlights: [
      'Lossless audio recording with visual waveform player',
      'Private family archive not shared with any third party',
      'Optional 1-click backup to private Google Drive (drive.file)',
    ],
  },
  {
    id: 'settings',
    title: 'Sovereignty & Security Controls',
    label: 'Hard Keystore Encryption',
    icon: Sliders,
    src: '/assets/app/05_sanctuary_settings_theme.png',
    tagline: 'Absolute User Ownership',
    description:
      'Control your family’s digital footprint with total transparency. Toggle theme aesthetics, inspect hardware keystore security, manage Google OAuth permissions, or perform an instant one-tap hard deletion of your sanctuary.',
    highlights: [
      'Local MMKV database with hardware-backed encryption',
      'Immediate Google OAuth revocation & disconnect controls',
      'Irreversible hard deletion wipes all local and cloud records',
    ],
  },
  {
    id: 'radar',
    title: 'Kutumb 3D Spatial Radar',
    label: 'Offline Proximity Mesh',
    icon: Compass,
    src: '/assets/illustrations/neev_sanctuary_home.png',
    tagline: 'Zero Cloud GPS Telemetry',
    description:
      'Peer-to-peer proximity telemetry built with free OpenStreetMap cartography. Classifies physical elevation (table plane vs sofa cushion depth) and emits acoustic chirps to find misplaced phones without cellular service.',
    highlights: [
      'Zero continuous GPS tracking uploaded to cloud servers',
      'Acoustic penetration for sofa cushions and divans',
      '100% free cartography with zero Google Maps billing',
    ],
  },
]

export function ScreensShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeScreen = screens[activeIndex]

  return (
    <section id="screens" className="py-20 md:py-32 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="max-w-2xl mb-14 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)] text-xs font-mono uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Captured from Native Android Builds</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[var(--ink)] leading-tight mb-4">
            Inside the Sanctuary App
          </h2>
          <p className="text-sm sm:text-base text-[var(--ink-secondary)] leading-relaxed font-light">
            Every screen captured directly from our live Android and iOS release builds. Authentic light-mode porcelain surfaces, zero-shadow squircles, and cultural warmth.
          </p>
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
                  className={`w-full text-left p-5 sm:p-6 rounded-2xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[var(--surface)] border-[var(--border-strong)] shadow-xs'
                      : 'bg-[var(--surface2)]/60 border-transparent hover:bg-[var(--surface)] hover:border-[var(--border)]'
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
                    <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-2.5 animate-fadeIn">
                      <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                        {screen.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
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

          {/* Right Column: Precision Titanium Phone Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[320px] sm:max-w-[340px]">
              <PhoneFrame
                key={activeScreen.id}
                src={activeScreen.src}
                alt={`Neev Sanctuary screen: ${activeScreen.title}`}
                priority
              />
              <div className="mt-4 text-center space-y-1">
                <span className="text-xs font-mono text-[var(--ink-muted)] block">
                  Captured on Physical Pixel / Motorola Hardware
                </span>
                <span className="text-[10px] font-mono text-[var(--terracotta)] uppercase font-semibold">
                  100% Native Expo &amp; React Native Release
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Extended System Architecture & Design Boards Gallery */}
        <div className="mt-20 pt-16 border-t border-[var(--border)]">
          <div className="max-w-2xl mb-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface2)] text-[var(--terracotta)] text-xs font-mono uppercase tracking-wider mb-3 border border-[var(--border)]">
              <Sliders className="w-3.5 h-3.5" />
              <span>Complete Design System &amp; Architecture</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] mb-3">
              Screen Inventory &amp; App Architecture Boards
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
              Explore the full system architecture of Neev Sanctuary — including multi-perspective routing, Picture-in-Picture (PIP) states, panchang ritual scheduling, and local-first cryptographic vaults.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="sanctuary-card p-4 rounded-2xl group hover:border-[var(--border-strong)] transition-all flex flex-col justify-between">
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[var(--surface2)] border border-[var(--border)] mb-3">
                <img
                  src="/assets/screens/01_complete_screen_gallery.png"
                  alt="Complete Screen Gallery"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[var(--pista-hover)] uppercase font-bold block mb-1">Board 01</span>
                <h4 className="font-serif text-base font-bold text-[var(--ink)] mb-1">Complete Screen Gallery</h4>
                <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                  High-fidelity layout of all native porcelain screens, raised-cosine bottom docks, and living sprout mascot states.
                </p>
              </div>
            </div>

            <div className="sanctuary-card p-4 rounded-2xl group hover:border-[var(--border-strong)] transition-all flex flex-col justify-between">
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[var(--surface2)] border border-[var(--border)] mb-3">
                <img
                  src="/assets/screens/03_app_flow_and_screen_inventory.png"
                  alt="App Flow and Screen Inventory"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[var(--terracotta)] uppercase font-bold block mb-1">Board 02</span>
                <h4 className="font-serif text-base font-bold text-[var(--ink)] mb-1">App Flow &amp; Screen Inventory</h4>
                <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                  End-to-end navigational hierarchy, multi-generational perspective switching, and family invitation lifecycle.
                </p>
              </div>
            </div>

            <div className="sanctuary-card p-4 rounded-2xl group hover:border-[var(--border-strong)] transition-all flex flex-col justify-between">
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[var(--surface2)] border border-[var(--border)] mb-3">
                <img
                  src="/assets/screens/05_features_and_pip_states.png"
                  alt="Features and PIP States"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[var(--pista-hover)] uppercase font-bold block mb-1">Board 03</span>
                <h4 className="font-serif text-base font-bold text-[var(--ink)] mb-1">Features &amp; PIP States</h4>
                <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                  Floating mini-player radar, persistent ritual countdown timer, and background acoustic chirp telemetry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
