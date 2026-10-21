'use client'

import { useState } from 'react'
import { Compass, MapPin, Volume2, Shield, WifiOff, Smartphone, Zap, CheckCircle2, Layers } from 'lucide-react'

export function SpatialRadarShowcase() {
  const [selectedPlane, setSelectedPlane] = useState<'cushion' | 'table' | 'floor'>('cushion')
  const [isChirping, setIsChirping] = useState(false)

  const planes = {
    cushion: {
      title: 'Sofa Cushion Fabric Depth (~0.4m)',
      rfDamping: '8 dB Attenuation (Occluded)',
      status: 'Beneath Divan Cushions',
      desc: 'When phones slip beneath heavy living room sofa cushions, conventional Bluetooth signals are damped by 8 dB. Neev detects the acoustic profile and synthesizes maximum resonant haptic bursts.',
      color: 'var(--terracotta)',
    },
    table: {
      title: 'Dining Table / Counter Plane (~0.8m)',
      rfDamping: 'Direct Line-of-Sight (~0 dB)',
      status: 'Open Surface',
      desc: 'Optimal RF propagation plane. Co-parents can spot nearby family devices in multi-room homes with millimeter-level directional compass vectors.',
      color: 'var(--pista)',
    },
    floor: {
      title: 'Under-Bed / Floor Level (~0.0m)',
      rfDamping: 'Floor Multi-path Reflection',
      status: 'Ground Level Near Baseboard',
      desc: 'Classified automatically by barometric altimetry and micro-gravity sensors. Provides directional guidance towards under-bed areas.',
      color: 'var(--pista-hover)',
    },
  }

  const current = planes[selectedPlane]

  const triggerChirp = () => {
    setIsChirping(true)
    setTimeout(() => setIsChirping(false), 2000)
  }

  return (
    <section className="py-16 scroll-mt-20">
      <div className="sanctuary-card p-6 sm:p-12 max-w-5xl mx-auto border border-[var(--border)]">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)] text-xs font-mono uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Hardware Telemetry &amp; Free Cartography</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--ink)] mb-3">
            Kutumb 3D Spatial Radar &amp; Offline Maps
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
            Free OpenStreetMap cartography paired with peer-to-peer RF spatial telemetry. Zero continuous GPS cloud uploads, zero Google Maps API billing, and acoustic cushion penetration.
          </p>
        </div>

        {/* Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: 3D Radar Simulator */}
          <div className="lg:col-span-7 rounded-3xl bg-[var(--dock)] p-6 text-white relative overflow-hidden min-h-[360px] flex flex-col justify-between">
            {/* Geodetic Telemetry Header */}
            <div className="flex items-center justify-between text-[11px] font-mono text-white/70 border-b border-white/10 pb-3 z-10">
              <span className="text-[var(--pista)] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--pista)] animate-pulse" />
                Bengaluru Radar Grid
              </span>
              <span>12.9716° N, 77.5946° E</span>
            </div>

            {/* Radar Center Animation Area */}
            <div className="relative my-6 flex items-center justify-center h-48">
              {/* Concentric Radar Rings */}
              <div className="absolute w-52 h-52 rounded-full border border-white/10 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute w-40 h-40 rounded-full border border-white/15" />
              <div className="absolute w-28 h-28 rounded-full border border-white/20" />
              <div className="w-3 h-3 rounded-full bg-[var(--pista)] z-10" />

              {/* Pulsing Acoustic Wave */}
              {isChirping && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 rounded-full border-2 border-[var(--terracotta)] animate-ping opacity-80" />
                  <div className="w-48 h-48 rounded-full border border-[var(--terracotta)] animate-ping opacity-60" style={{ animationDelay: '200ms' }} />
                </div>
              )}

              {/* Family Nodes */}
              <div className="absolute top-4 left-10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--pista)] text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-lg">
                  Dada
                </div>
                <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-mono border border-white/15">
                  <span className="text-white block font-semibold">Dada’s Phone</span>
                  <span className="text-[var(--terracotta)] block font-bold">Cushion · 2.1m</span>
                </div>
              </div>

              <div className="absolute bottom-4 right-10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--terracotta)] text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-lg">
                  Mom
                </div>
                <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-mono border border-white/15">
                  <span className="text-white block font-semibold">Sneha</span>
                  <span className="text-[var(--pista)] block font-bold">Office Table · 4.8m</span>
                </div>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/70 z-10">
              <span className="flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5 text-[var(--pista)]" />
                <span>100% Offline P2P Mesh</span>
              </span>
              <span className="text-white/50">Zero Cloud GPS Logs</span>
            </div>
          </div>

          {/* Right: Interactive Plane Elevation Controls */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--terracotta)] font-bold block">
              Physical Plane Elevation Classifier
            </span>

            <div className="space-y-2">
              {(['cushion', 'table', 'floor'] as const).map((plane) => (
                <button
                  key={plane}
                  onClick={() => setSelectedPlane(plane)}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all ${
                    selectedPlane === plane
                      ? 'bg-[var(--surface)] border-[var(--ink)] shadow-none'
                      : 'bg-[var(--surface2)] border-[var(--border)] hover:bg-[var(--surface3)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-sm font-bold text-[var(--ink)] capitalize">
                      {plane === 'cushion' ? 'Sofa Cushion Depth' : plane === 'table' ? 'Table / Counter Plane' : 'Under-Bed Floor Level'}
                    </span>
                    <span className="text-[10px] font-mono font-semibold" style={{ color: planes[plane].color }}>
                      {plane === 'cushion' ? '~0.4m' : plane === 'table' ? '~0.8m' : '~0.0m'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--ink-secondary)] block">
                    {planes[plane].rfDamping}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2 text-xs">
              <span className="font-bold text-[var(--ink)] block">
                {current.title}
              </span>
              <p className="text-[var(--ink-secondary)] leading-relaxed">
                {current.desc}
              </p>
            </div>

            <button
              onClick={triggerChirp}
              disabled={isChirping}
              className="w-full py-3 rounded-full bg-[var(--terracotta)] text-white text-xs font-semibold hover:bg-[var(--terracotta-hover)] transition-all flex items-center justify-center gap-2 shadow-none disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isChirping ? 'Audible Resonant Burst Emitting...' : 'Test Acoustic Cushion Penetration'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
