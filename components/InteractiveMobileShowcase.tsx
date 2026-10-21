'use client';

import {
  Calendar,
  CheckCircle2,
  Compass,
  Heart,
  Lock,
  Pause,
  Play,
  Volume2,
  Users,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Check,
  Clock,
  MapPin,
  Bell,
  Radio,
  FileText
} from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

type FamilyPerspective = 'elder' | 'parent' | 'child';
type ActiveShowcaseTab = 'hub' | 'radar' | 'vault';

export function InteractiveMobileShowcase() {
  const [perspective, setPerspective] = useState<FamilyPerspective>('parent');
  const [activeTab, setActiveTab] = useState<ActiveShowcaseTab>('hub');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [radarAcousticActive, setRadarAcousticActive] = useState(false);
  const [activeTaskChecked, setActiveTaskChecked] = useState(false);
  const [mascotEmotion, setMascotEmotion] = useState<'calm' | 'joy' | 'curious'>('calm');
  const [mascotBubble, setMascotBubble] = useState<string | null>(null);
  const [audioSeconds, setAudioSeconds] = useState(42);

  // Audio timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioSeconds((prev) => (prev >= 222 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  // Web Audio API Synthesizers (Graceful and safe in all browser environments)
  const playChimeSound = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(216, ctx.currentTime + 1.6);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.6);
    } catch {
      // safe fallback
    }
  };

  const playSonarPulse = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }
    } catch {
      // safe fallback
    }
  };

  const playMascotChirp = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch {
      // safe fallback
    }
  };

  const handleAudioToggle = () => {
    if (!isPlayingAudio) {
      playChimeSound();
    }
    setIsPlayingAudio(!isPlayingAudio);
  };

  const triggerAcousticPulse = () => {
    playSonarPulse();
    setRadarAcousticActive(true);
    setTimeout(() => setRadarAcousticActive(false), 2400);
  };

  const handleMascotClick = () => {
    playMascotChirp();
    const emotions: ('calm' | 'joy' | 'curious')[] = ['joy', 'curious', 'calm'];
    const next = emotions[(emotions.indexOf(mascotEmotion) + 1) % emotions.length];
    setMascotEmotion(next);

    const dialogues = [
      'Shubh Sandhya! Dadi’s aarti is in 25 mins.',
      'Google Calendar & Tasks synchronized!',
      'Heirloom vault sealed under hardware keystore.',
      'All 3 generations in harmony today.',
    ];
    setMascotBubble(dialogues[Math.floor(Math.random() * dialogues.length)]);
    setTimeout(() => setMascotBubble(null), 3600);
  };

  const formatAudioTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section className="w-full py-12 scroll-mt-20">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)] text-xs font-mono uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Living Hardware Simulator</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] mb-4">
          Experience Neev in Your Hands
        </h2>
        <p className="text-sm sm:text-base text-[var(--ink-secondary)] max-w-xl mx-auto leading-relaxed">
          Switch multi-generational family perspectives, trigger physical acoustic bursts, and test Google Workspace bi-directional sync in real time.
        </p>
      </div>

      {/* Dual Control Switcher: Perspectives & Functional Tabs */}
      <div className="flex flex-col items-center gap-4 mb-10">
        {/* Multi-Generational Perspective Selector */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-muted)] px-3 hidden sm:inline-block">
            Perspective:
          </span>
          <button
            type="button"
            onClick={() => setPerspective('elder')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              perspective === 'elder'
                ? 'bg-[var(--pista)] text-white shadow-xs'
                : 'text-[var(--ink-secondary)] hover:bg-[var(--surface2)]'
            }`}
          >
            <span>👴 Dada / Dadi (Elders)</span>
          </button>
          <button
            type="button"
            onClick={() => setPerspective('parent')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              perspective === 'parent'
                ? 'bg-[var(--terracotta)] text-white shadow-xs'
                : 'text-[var(--ink-secondary)] hover:bg-[var(--surface2)]'
            }`}
          >
            <span>👨‍👩‍👧 Parents &amp; Co-Care</span>
          </button>
          <button
            type="button"
            onClick={() => setPerspective('child')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              perspective === 'child'
                ? 'bg-[var(--dock)] text-white shadow-xs'
                : 'text-[var(--ink-secondary)] hover:bg-[var(--surface2)]'
            }`}
          >
            <span>🌱 Balak (Children)</span>
          </button>
        </div>

        {/* Dimension Functional Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('hub')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'hub'
                ? 'bg-[var(--ink)] text-white shadow-xs'
                : 'bg-[var(--surface)] text-[var(--ink-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[var(--pista)]" />
            <span>1. Routines &amp; Google Sync</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('radar')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'radar'
                ? 'bg-[var(--ink)] text-white shadow-xs'
                : 'bg-[var(--surface)] text-[var(--ink-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[var(--terracotta)]" />
            <span>2. Kutumb 3D Spatial Radar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'vault'
                ? 'bg-[var(--ink)] text-white shadow-xs'
                : 'bg-[var(--surface)] text-[var(--ink-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[var(--pista)]" />
            <span>3. Sanskriti Heirloom Vault</span>
          </button>
        </div>
      </div>

      {/* Flagship Device Chassis with Aerospace Titanium Finish */}
      <div className="mx-auto max-w-[390px] sm:max-w-[430px] relative select-none">
        {/* Subtle Ambient Radial Backlight */}
        <div className="absolute -inset-6 bg-gradient-to-b from-[var(--pista-container)]/80 via-[var(--terracotta-container)]/50 to-transparent blur-3xl rounded-[56px] -z-10" />

        {/* Titanium Frame Bezel */}
        <div className="relative rounded-[50px] p-3 sm:p-3.5 bg-gradient-to-b from-[#2C322E] via-[#1D221F] to-[#121513] border-2 border-[rgba(255,255,255,0.15)] shadow-[0_45px_100px_-25px_rgba(20,31,28,0.5),0_15px_35px_rgba(0,0,0,0.25)] ring-1 ring-black/80">
          
          {/* Glass Inner Screen */}
          <div className="rounded-[40px] bg-[var(--bg)] border border-[var(--border)] overflow-hidden flex flex-col h-[700px] text-[var(--ink)] relative">
            
            {/* Status Bar */}
            <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-mono text-[var(--ink-muted)] shrink-0 z-30 bg-[var(--surface-glass)] backdrop-blur-md">
              <span className="font-semibold text-[var(--ink)]">09:41</span>
              {/* Dynamic Pill Notch with Living Indicator */}
              <div
                onClick={handleMascotClick}
                className="h-5 px-3 rounded-full bg-[var(--dock)] flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 transition-transform"
                title="Tap to interact with Neev Sprout"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--pista)] animate-pulse" />
                <span className="text-[9px] font-mono text-white/90 uppercase tracking-widest font-semibold">
                  Neev
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-[var(--pista)] font-bold">5G</span>
                <span className="font-mono">100%</span>
              </div>
            </div>

            {/* Apple Large Title Collapsible Header Bar */}
            <div className="px-5 pt-2 pb-3 border-b border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-md shrink-0 relative">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--terracotta)] font-bold block">
                    {perspective === 'elder'
                      ? '👴 Dada’s Perspective · Calm Large View'
                      : perspective === 'child'
                      ? '🌱 Aarav’s Hearth · Playful Sanctuary'
                      : '👨‍👩‍👧 Joint Hearth · Bengaluru Kutumb'}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)] leading-tight">
                    Neev Sanctuary
                  </h3>
                </div>

                {/* Living Mascot Avatar in Header */}
                <div
                  onClick={handleMascotClick}
                  className="relative w-10 h-10 rounded-2xl bg-[var(--pista-container)] border border-[var(--pista)]/40 flex items-center justify-center p-1.5 cursor-pointer transition-transform hover:scale-110 active:scale-95 shadow-xs"
                >
                  <Image
                    src="/favicon.png"
                    alt="Neev Mascot"
                    width={26}
                    height={26}
                    className={`object-contain ${
                      mascotEmotion === 'joy'
                        ? 'animate-bounce'
                        : mascotEmotion === 'curious'
                        ? 'animate-tilt'
                        : 'animate-breathing'
                    }`}
                  />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
              </div>

              {/* Speech bubble overlay when interacting with mascot */}
              {mascotBubble && (
                <div className="absolute top-14 right-5 z-40 max-w-[240px] p-2.5 rounded-2xl bg-[var(--dock)] text-white text-[11px] font-medium shadow-xl border border-white/20 animate-fadeIn">
                  <p>{mascotBubble}</p>
                </div>
              )}
            </div>

            {/* Scrollable Viewport Body with Perspective-Tailored Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left scrollbar-thin">
              {activeTab === 'hub' && (
                <div className="space-y-3.5 animate-fadeIn">
                  {/* Google Workspace Live Sync Banner */}
                  <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--pista)]/40 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[var(--pista-container)] text-[var(--pista-hover)] flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-[var(--ink)] block">
                          Google Calendar &amp; Tasks Synced
                        </span>
                        <span className="text-[9px] font-mono text-[var(--pista-hover)] block">
                          Limited Use Verified · Zero Model Training
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)] text-[9px] font-mono font-bold shrink-0">
                      Live Sync ✓
                    </span>
                  </div>

                  {/* Sacred Panchang Tithi Card */}
                  <div className="p-4 rounded-2xl bg-[var(--terracotta-container)]/80 border border-[var(--terracotta)]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--terracotta)]">
                        Today’s Panchang Tithi
                      </span>
                      <span className="text-[10px] font-mono text-[var(--ink-secondary)]">
                        Kartik Shukla Ekadashi
                      </span>
                    </div>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-[var(--ink)]">
                      Tulsi Vivah &amp; Evening Deep Daan
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[var(--ink-secondary)] leading-relaxed">
                      Sandhya Muhurat: 06:12 PM – 07:45 PM. Synced to Google Calendar with 30-min preparation alert.
                    </p>
                    <div className="pt-2 border-t border-[var(--terracotta)]/20 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[var(--ink-muted)]">Muhurat: Sunset</span>
                      <span className="font-bold text-[var(--terracotta)]">Exported to Calendar ✓</span>
                    </div>
                  </div>

                  {/* Elder / Health Care Card (Adapted for Perspective) */}
                  <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--terracotta)] animate-ping" />
                        <span className="text-xs font-bold text-[var(--ink)]">
                          {perspective === 'elder'
                            ? 'Dr. Banerjee Follow-Up · 10:30 AM'
                            : 'Dada’s Cardiology Follow-up'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--ink-muted)]">
                        10:30 AM
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[var(--ink-secondary)] leading-relaxed">
                      Dr. K. Banerjee · Manipal Hospital Old Airport Rd. Synced to Dad &amp; Mom’s
                      Google Calendar with traffic buffer alert.
                    </p>
                    <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[var(--ink-muted)]">Medicine: Cardivas 6.25mg</span>
                      <span className="text-[var(--pista-hover)] font-bold">Administered ✓</span>
                    </div>
                  </div>

                  {/* Shared Family Chores Checklist with Interactive Google Tasks Sync */}
                  <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--ink)]">
                        Today’s Shared Chores
                      </span>
                      <span className="text-[10px] font-mono text-[var(--pista-hover)] font-semibold">
                        Google Tasks Sync Active
                      </span>
                    </div>

                    <div
                      onClick={() => setActiveTaskChecked(!activeTaskChecked)}
                      className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-between cursor-pointer hover:bg-[var(--surface3)] transition-all"
                    >
                      <div className="flex items-center gap-2.5 text-xs">
                        <CheckCircle2
                          className={`w-4 h-4 transition-colors ${
                            activeTaskChecked ? 'text-[var(--pista)]' : 'text-[var(--ink-muted)]'
                          }`}
                        />
                        <span
                          className={
                            activeTaskChecked
                              ? 'line-through text-[var(--ink-muted)] font-normal'
                              : 'text-[var(--ink)] font-semibold'
                          }
                        >
                          Organic A2 Desi Cow Milk &amp; Paneer
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-[var(--terracotta)] font-bold">
                        {activeTaskChecked ? 'Completed in Google Tasks ✓' : 'Assigned: Dad'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'radar' && (
                <div className="space-y-3.5 animate-fadeIn">
                  {/* Radar Telemetry Header */}
                  <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between text-[10px] font-mono text-[var(--ink-muted)] shadow-xs">
                    <span className="text-[var(--pista-hover)] font-bold">
                      WGS84: 12.971640° N, 77.594610° E
                    </span>
                    <span>Alt: +912.4m</span>
                  </div>

                  {/* 3D Radar Visualizer Canvas */}
                  <div className="relative h-60 rounded-3xl bg-[var(--dock)] overflow-hidden flex items-center justify-center p-4 border border-white/10 shadow-inner">
                    {/* Concentric Radar Rings */}
                    <div className="absolute w-48 h-48 rounded-full border border-white/10 animate-spin" style={{ animationDuration: '24s' }} />
                    <div className="absolute w-36 h-36 rounded-full border border-white/15" />
                    <div className="absolute w-24 h-24 rounded-full border border-white/20" />
                    <div className="absolute w-3 h-3 rounded-full bg-[var(--pista)] z-10" />

                    {/* Acoustic Wave Animation */}
                    {radarAcousticActive && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-56 h-56 rounded-full border-2 border-[var(--terracotta)] animate-ping opacity-80" />
                        <div className="w-40 h-40 rounded-full border border-[var(--terracotta)] animate-ping opacity-60" style={{ animationDelay: '180ms' }} />
                      </div>
                    )}

                    {/* Radar Family Nodes */}
                    <div className="absolute top-6 left-10 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[var(--pista)] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-md">
                        Dada
                      </div>
                      <span className="text-[8px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded-full mt-1 border border-white/10">
                        Cushion · 2.1m
                      </span>
                    </div>

                    <div className="absolute bottom-6 right-10 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[var(--terracotta)] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-md">
                        Mom
                      </div>
                      <span className="text-[8px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded-full mt-1 border border-white/10">
                        Desk · 4.8m
                      </span>
                    </div>
                  </div>

                  {/* Spatial Telemetry Card */}
                  <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--ink)]">
                        Spatial Classification &amp; RF Plane
                      </span>
                      <span className="text-[10px] font-mono text-[var(--terracotta)] font-bold">
                        Sofa Cushion Depth (~0.4m)
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[var(--ink-secondary)] leading-relaxed">
                      Dada’s beacon occluded beneath living room divan cushions (8 dB RF attenuation).
                      Trigger resonant acoustic burst to locate without internet or cell connectivity.
                    </p>
                    <button
                      type="button"
                      onClick={triggerAcousticPulse}
                      className="w-full mt-2 py-2.5 rounded-xl bg-[var(--terracotta)] text-white text-xs font-semibold hover:bg-[var(--terracotta-hover)] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>
                        {radarAcousticActive
                          ? 'Resonant Sonar Chirping (440Hz)...'
                          : 'Trigger Sofa Cushion Chirp & Haptics'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'vault' && (
                <div className="space-y-3.5 animate-fadeIn">
                  {/* Sanskriti Folklore Audio Player with Dynamic Web Audio */}
                  <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--pista)]/40 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--pista-hover)] font-bold">
                        Oral History Archive · Sanskriti
                      </span>
                      <span className="text-[9px] font-mono text-[var(--ink-muted)]">
                        Recorded 14 Oct · Dada
                      </span>
                    </div>

                    <h4 className="font-serif text-base sm:text-lg font-bold text-[var(--ink)]">
                      &ldquo;Stories of the Old Ganges Ghats in 1952&rdquo;
                    </h4>

                    {/* Waveform Visualization with Live Equalizer */}
                    <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleAudioToggle}
                        className="w-9 h-9 rounded-full bg-[var(--pista)] text-white flex items-center justify-center shrink-0 hover:bg-[var(--pista-hover)] transition-transform active:scale-90 shadow-xs cursor-pointer"
                        title={isPlayingAudio ? 'Pause Folklore' : 'Play Folklore'}
                      >
                        {isPlayingAudio ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </button>

                      <div className="flex-1 flex items-center gap-1 h-7">
                        {[
                          40, 65, 80, 50, 95, 70, 85, 60, 45, 90, 75, 100, 60, 40, 70, 85, 55, 30,
                          65, 80, 50, 35, 75, 45
                        ].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all duration-200 ${
                              isPlayingAudio
                                ? 'bg-[var(--pista)] animate-pulse'
                                : 'bg-[var(--ink-muted)]/40'
                            }`}
                            style={{
                              height: isPlayingAudio
                                ? `${Math.max(25, (h * (0.6 + 0.4 * Math.sin(audioSeconds + i))).toFixed(0))}%`
                                : `${h}%`,
                            }}
                          />
                        ))}
                      </div>

                      <span className="text-[10px] font-mono text-[var(--ink-muted)]">
                        {isPlayingAudio ? formatAudioTime(audioSeconds) : '03:42'}
                      </span>
                    </div>
                  </div>

                  {/* Heirloom Family Recipe Card */}
                  <div className="p-4 rounded-2xl bg-[var(--terracotta-container)]/80 border border-[var(--terracotta)]/30 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase font-bold text-[var(--terracotta)]">
                        Ancestral Culinary Heirloom
                      </span>
                      <span className="text-[9px] font-mono text-[var(--ink-secondary)]">
                        Dadi’s 1928 Secret Notebook
                      </span>
                    </div>
                    <h5 className="font-serif text-sm sm:text-base font-bold text-[var(--ink)]">
                      Nolen Gurer Sandesh &amp; Mustard Shorshe Ilish
                    </h5>
                    <p className="text-[11px] sm:text-xs text-[var(--ink-secondary)] leading-relaxed">
                      Zero-knowledge encrypted note with handwritten proportions of ground yellow
                      mustard, green chilies, and cold-pressed mustard oil.
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono text-[var(--pista-hover)] font-bold">
                      <Lock className="w-3 h-3" />
                      <span>AES-256 Hardware Keystore Sealed</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Raised-Cosine Bottom Tab Dock with Living Center Mascot */}
            <div className="h-16 bg-[var(--dock)] border-t border-white/10 px-6 flex items-center justify-between shrink-0 relative z-20">
              <button
                type="button"
                onClick={() => setActiveTab('hub')}
                className={`flex flex-col items-center gap-1 text-[9px] font-mono transition-colors ${
                  activeTab === 'hub'
                    ? 'text-[var(--pista)] font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Routines</span>
              </button>

              {/* Raised-Cosine Mascot Center Orb */}
              <div className="relative -top-4">
                <div
                  onClick={handleMascotClick}
                  className="w-13 h-13 rounded-2xl bg-[var(--pista)] border-2 border-[var(--dock)] flex items-center justify-center p-2.5 shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                  title="Interact with Neev Mascot"
                >
                  <Image
                    src="/favicon.png"
                    alt="Center Orb Mascot"
                    width={28}
                    height={28}
                    className={`object-contain ${
                      mascotEmotion === 'joy'
                        ? 'animate-bounce'
                        : mascotEmotion === 'curious'
                        ? 'animate-tilt'
                        : 'animate-breathing'
                    }`}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('radar')}
                className={`flex flex-col items-center gap-1 text-[9px] font-mono transition-colors ${
                  activeTab === 'radar'
                    ? 'text-[var(--terracotta)] font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Radar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('vault')}
                className={`flex flex-col items-center gap-1 text-[9px] font-mono transition-colors ${
                  activeTab === 'vault'
                    ? 'text-[var(--pista)] font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Vault</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
