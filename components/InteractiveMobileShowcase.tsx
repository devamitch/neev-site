'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Calendar, CheckSquare, Compass, Shield, Heart, MapPin, Volume2, Play, Pause, Lock, Sparkles, WifiOff, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react'

export function InteractiveMobileShowcase() {
  const [activeTab, setActiveTab] = useState<'hub' | 'radar' | 'vault'>('hub')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [radarAcousticActive, setRadarAcousticActive] = useState(false)
  const [activeTaskChecked, setActiveTaskChecked] = useState(false)

  const triggerAcousticPulse = () => {
    setRadarAcousticActive(true)
    setTimeout(() => setRadarAcousticActive(false), 2400)
  }

  return (
    <div className="w-full py-8">
      {/* Interactive Mode Selector Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('hub')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'hub'
              ? 'bg-[var(--ink)] text-white shadow-none'
              : 'bg-[var(--surface)] text-[var(--ink-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-[var(--pista)]" />
          <span>1. Daily Routine &amp; Google Sync</span>
        </button>

        <button
          onClick={() => setActiveTab('radar')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'radar'
              ? 'bg-[var(--ink)] text-white shadow-none'
              : 'bg-[var(--surface)] text-[var(--ink-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)]'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-[var(--terracotta)]" />
          <span>2. Kutumb 3D Spatial Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'vault'
              ? 'bg-[var(--ink)] text-white shadow-none'
              : 'bg-[var(--surface)] text-[var(--ink-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-[var(--pista)]" />
          <span>3. Sanskriti Heirloom Vault</span>
        </button>
      </div>

      {/* Flagship Device Chassis */}
      <div className="mx-auto max-w-[380px] sm:max-w-[420px] relative">
        {/* Subtle Ambient Glow */}
        <div className="absolute -inset-4 bg-gradient-to-b from-[var(--pista-container)]/70 via-[var(--terracotta-container)]/40 to-transparent blur-2xl rounded-[48px] -z-10" />

        {/* Titanium Frame */}
        <div className="relative rounded-[48px] p-3.5 bg-gradient-to-b from-[#E3E7E2] via-[#F0F2EE] to-[#D5DAD4] border-2 border-[rgba(255,255,255,0.8)] shadow-2xl">
          {/* Glass Inner Screen */}
          <div className="rounded-[40px] bg-[var(--bg)] border border-[var(--border)] overflow-hidden flex flex-col h-[680px] select-none text-[var(--ink)] relative">
            
            {/* Status Bar */}
            <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-mono text-[var(--ink-muted)] shrink-0 z-30">
              <span className="font-semibold text-[var(--ink)]">09:41</span>
              {/* Dynamic Pill Notch */}
              <div className="h-4 w-24 rounded-full bg-[var(--dock)] flex items-center justify-center px-2 gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--pista)] animate-pulse" />
                <span className="text-[8px] font-mono text-white/90 uppercase tracking-widest">Neev</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-[var(--pista)] font-bold">5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Apple Large Title Header */}
            <div className="px-5 pt-2 pb-3 border-b border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-md shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--terracotta)] font-bold block">
                    Bengaluru Sanctuary · Kutumb
                  </span>
                  <h3 className="font-serif text-xl font-bold tracking-tight text-[var(--ink)] leading-tight">
                    Neev Sanctuary
                  </h3>
                </div>
                {/* Living Mascot Avatar in Header */}
                <div className="w-9 h-9 rounded-2xl bg-[var(--pista-container)] border border-[var(--pista)]/30 flex items-center justify-center p-1.5">
                  <Image
                    src="/favicon.png"
                    alt="Neev Mascot"
                    width={24}
                    height={24}
                    className="object-contain animate-breathing"
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Viewport Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
              {activeTab === 'hub' && (
                <div className="space-y-3.5 animate-fadeIn">
                  {/* Google Workspace Live Sync Banner */}
                  <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--pista)]/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[var(--pista-container)] text-[var(--pista)] flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-[var(--ink)] block">
                          Google Calendar &amp; Tasks Linked
                        </span>
                        <span className="text-[9px] font-mono text-[var(--pista)]">
                          Limited Use Compliant · Zero AI Training
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)] text-[9px] font-mono font-bold">
                      Active
                    </span>
                  </div>

                  {/* Sacred Panchang Tithi Card */}
                  <div className="p-4 rounded-2xl bg-[var(--terracotta-container)]/70 border border-[var(--terracotta)]/25 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--terracotta)]">
                        Today’s Panchang Tithi
                      </span>
                      <span className="text-[9px] font-mono text-[var(--ink-secondary)]">
                        Kartik Shukla Ekadashi
                      </span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-[var(--ink)]">
                      Tulsi Vivah &amp; Evening Deep Daan
                    </h4>
                    <p className="text-[11px] text-[var(--ink-secondary)] leading-relaxed">
                      Sandhya Muhurat: 06:12 PM – 07:45 PM. Co-parents notified; Dadi’s clay diya task synced to Google Tasks.
                    </p>
                  </div>

                  {/* Geriatric / Pediatric Care Card */}
                  <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--terracotta)] animate-ping" />
                        <span className="text-xs font-bold text-[var(--ink)]">
                          Dada’s Cardiology Follow-up
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--ink-muted)]">
                        10:30 AM
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--ink-secondary)] leading-relaxed">
                      Dr. K. Banerjee · Manipal Hospital Old Airport Rd. Synced to Dad &amp; Mom’s Google Calendar with 45-min traffic alert.
                    </p>
                    <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono text-[var(--ink-muted)]">
                      <span>Medicine: Cardivas 6.25mg</span>
                      <span className="text-[var(--pista)] font-bold">Administered ✓</span>
                    </div>
                  </div>

                  {/* Shared Family Chores Checklist */}
                  <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--ink)]">
                        Today’s Shared Chores
                      </span>
                      <span className="text-[10px] font-mono text-[var(--pista)]">
                        Google Tasks Sync
                      </span>
                    </div>
                    
                    <div 
                      onClick={() => setActiveTaskChecked(!activeTaskChecked)}
                      className="p-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-between cursor-pointer hover:bg-[var(--surface3)] transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-4 h-4 transition-colors ${activeTaskChecked ? 'text-[var(--pista)]' : 'text-[var(--ink-muted)]'}`} />
                        <span className={activeTaskChecked ? 'line-through text-[var(--ink-muted)]' : 'text-[var(--ink)] font-medium'}>
                          Organic A2 Desi Cow Milk &amp; Paneer
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-[var(--terracotta)] font-semibold">
                        Assigned: Dad
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'radar' && (
                <div className="space-y-3.5 animate-fadeIn">
                  {/* Radar Telemetry Header */}
                  <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between text-[10px] font-mono text-[var(--ink-muted)]">
                    <span className="text-[var(--pista)] font-bold">WGS84: 12.9716° N, 77.5946° E</span>
                    <span>Alt: +912m</span>
                  </div>

                  {/* 3D Radar Visualizer Canvas */}
                  <div className="relative h-56 rounded-3xl bg-[var(--dock)] overflow-hidden flex items-center justify-center p-4 border border-[var(--border)]">
                    {/* Concentric Radar Rings */}
                    <div className="absolute w-44 h-44 rounded-full border border-white/10" />
                    <div className="absolute w-32 h-32 rounded-full border border-white/15" />
                    <div className="absolute w-20 h-20 rounded-full border border-white/20" />
                    <div className="absolute w-2 h-2 rounded-full bg-[var(--pista)] animate-ping" />

                    {/* Acoustic Wave Animation */}
                    {radarAcousticActive && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-52 h-52 rounded-full border-2 border-[var(--terracotta)] animate-ping opacity-75" />
                      </div>
                    )}

                    {/* Radar Nodes */}
                    <div className="absolute top-8 left-12 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[var(--pista)] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-md">
                        Dada
                      </div>
                      <span className="text-[8px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded-full mt-1">
                        Cushion · 2.1m
                      </span>
                    </div>

                    <div className="absolute bottom-8 right-14 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[var(--terracotta)] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-md">
                        Aarav
                      </div>
                      <span className="text-[8px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded-full mt-1">
                        Desk · 3.4m
                      </span>
                    </div>
                  </div>

                  {/* Spatial Telemetry Card */}
                  <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--ink)]">
                        Spatial Classification &amp; RF Plane
                      </span>
                      <span className="text-[10px] font-mono text-[var(--terracotta)] font-semibold">
                        Sofa Cushion Depth (~0.4m)
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--ink-secondary)] leading-relaxed">
                      Dada’s beacon occluded beneath living room divan cushions (8 dB attenuation). Trigger acoustic burst to locate without internet.
                    </p>
                    <button
                      onClick={triggerAcousticPulse}
                      className="w-full mt-2 py-2 rounded-xl bg-[var(--terracotta)] text-white text-xs font-semibold hover:bg-[var(--terracotta-hover)] transition-all flex items-center justify-center gap-2"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{radarAcousticActive ? 'Audible Chirp Emitting...' : 'Trigger Sofa Cushion Chirp'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'vault' && (
                <div className="space-y-3.5 animate-fadeIn">
                  {/* Sanskriti Folklore Audio Player */}
                  <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--pista)]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--pista)] font-bold">
                        Oral History Archive
                      </span>
                      <span className="text-[9px] font-mono text-[var(--ink-muted)]">
                        Recorded 14 Oct · Dada
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-[var(--ink)]">
                      &ldquo;Stories of the Old Ganges Ghats in 1952&rdquo;
                    </h4>

                    {/* Waveform Visualization */}
                    <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] flex items-center gap-3">
                      <button
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="w-8 h-8 rounded-full bg-[var(--pista)] text-white flex items-center justify-center shrink-0 hover:bg-[var(--pista-hover)] transition-all"
                      >
                        {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </button>

                      <div className="flex-1 flex items-center gap-0.5 h-6">
                        {[40, 65, 80, 50, 95, 70, 85, 60, 45, 90, 75, 100, 60, 40, 70, 85, 55, 30, 65, 80, 50, 35].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all duration-300 ${
                              isPlayingAudio ? 'bg-[var(--pista)] animate-pulse' : 'bg-[var(--ink-muted)]/40'
                            }`}
                            style={{ height: `${isPlayingAudio ? Math.max(20, (h * Math.random()).toFixed(0)) : h}%` }}
                          />
                        ))}
                      </div>

                      <span className="text-[10px] font-mono text-[var(--ink-muted)]">
                        {isPlayingAudio ? '01:14' : '03:42'}
                      </span>
                    </div>
                  </div>

                  {/* Heirloom Family Recipe Card */}
                  <div className="p-4 rounded-2xl bg-[var(--terracotta-container)]/80 border border-[var(--terracotta)]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase font-bold text-[var(--terracotta)]">
                        Ancestral Culinary Heirloom
                      </span>
                      <span className="text-[9px] font-mono text-[var(--ink-secondary)]">
                        Dadi’s 1928 Cookbook
                      </span>
                    </div>
                    <h5 className="font-serif text-sm font-bold text-[var(--ink)]">
                      Nolen Gurer Sandesh &amp; Mustard Shorshe Ilish
                    </h5>
                    <p className="text-[11px] text-[var(--ink-secondary)] leading-relaxed">
                      Zero-knowledge encrypted note with handwritten proportions of ground yellow mustard, green chilies, and cold-pressed mustard oil.
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono text-[var(--pista)] font-bold">
                      <Lock className="w-3 h-3" />
                      <span>AES-256 Hardware Keystore Protected</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Raised-Cosine Bottom Tab Dock */}
            <div className="h-16 bg-[var(--dock)] border-t border-white/10 px-6 flex items-center justify-between shrink-0 relative z-20">
              <button
                onClick={() => setActiveTab('hub')}
                className={`flex flex-col items-center gap-1 text-[9px] font-mono transition-colors ${
                  activeTab === 'hub' ? 'text-[var(--pista)] font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Routines</span>
              </button>

              {/* Raised-Cosine Mascot Center Orb */}
              <div className="relative -top-4">
                <div 
                  onClick={() => setActiveTab('hub')}
                  className="w-13 h-13 rounded-2xl bg-[var(--pista)] border-2 border-[var(--dock)] flex items-center justify-center p-2.5 shadow-xl cursor-pointer hover:scale-105 transition-transform"
                >
                  <Image
                    src="/favicon.png"
                    alt="Center Orb Mascot"
                    width={28}
                    height={28}
                    className="object-contain animate-breathing"
                  />
                </div>
              </div>

              <button
                onClick={() => setActiveTab('radar')}
                className={`flex flex-col items-center gap-1 text-[9px] font-mono transition-colors ${
                  activeTab === 'radar' ? 'text-[var(--terracotta)] font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Radar</span>
              </button>

              <button
                onClick={() => setActiveTab('vault')}
                className={`flex flex-col items-center gap-1 text-[9px] font-mono transition-colors ${
                  activeTab === 'vault' ? 'text-[var(--pista)] font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Vault</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
