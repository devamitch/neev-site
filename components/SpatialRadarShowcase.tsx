'use client';

import { useState } from 'react';
import {
  Compass,
  MapPin,
  Volume2,
  Shield,
  WifiOff,
  Smartphone,
  Zap,
  CheckCircle2,
  Layers,
  Radio,
  Sparkles
} from 'lucide-react';

export function SpatialRadarShowcase() {
  const [selectedPlane, setSelectedPlane] = useState<'cushion' | 'table' | 'floor'>('cushion');
  const [selectedNode, setSelectedNode] = useState<'dada' | 'mom' | 'aarav'>('dada');
  const [isChirping, setIsChirping] = useState(false);

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
  };

  const familyNodes = {
    dada: {
      name: 'Dada (Grandparent)',
      device: 'Pixel 8 Pro · Sanctuary Elder Mode',
      distance: '2.1m Direct',
      rssi: '-78 dBm (Damped)',
      elevation: 'Sofa Cushion Plane (~0.4m)',
      battery: '84% · Not Charging',
    },
    mom: {
      name: 'Sneha (Mother)',
      device: 'iPhone 15 Pro · Co-Parent Hearth',
      distance: '4.8m Line-of-Sight',
      rssi: '-46 dBm (Optimal)',
      elevation: 'Teakwood Dining Table (~0.8m)',
      battery: '96% · MagSafe Active',
    },
    aarav: {
      name: 'Aarav (Child)',
      device: 'iPad Mini · Balak Playbook',
      distance: '3.4m Angle',
      rssi: '-62 dBm',
      elevation: 'Study Desk Plane (~0.75m)',
      battery: '72% · Standby',
    },
  };

  const current = planes[selectedPlane];
  const currentNode = familyNodes[selectedNode];

  const playRadarChirpSound = () => {
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
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([30, 50, 30]);
      }
    } catch {
      // safe fallback
    }
  };

  const triggerChirp = () => {
    playRadarChirpSound();
    setIsChirping(true);
    setTimeout(() => setIsChirping(false), 2200);
  };

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
          {/* Left: 3D Radar Simulator Canvas */}
          <div className="lg:col-span-7 rounded-3xl bg-[var(--dock)] p-6 text-white relative overflow-hidden min-h-[380px] flex flex-col justify-between border border-white/10 shadow-xl">
            {/* Geodetic Telemetry Header */}
            <div className="flex items-center justify-between text-[11px] font-mono text-white/70 border-b border-white/10 pb-3 z-10">
              <span className="text-[var(--pista)] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--pista)] animate-pulse" />
                Bengaluru Radar Grid
              </span>
              <span>12.971640° N, 77.594610° E</span>
            </div>

            {/* Radar Center Animation Area */}
            <div className="relative my-6 flex items-center justify-center h-52">
              {/* Rotating Sweep Beam */}
              <div
                className="absolute w-56 h-56 rounded-full border border-white/10 animate-spin pointer-events-none"
                style={{ animationDuration: '12s' }}
              >
                <div className="w-1/2 h-1/2 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent rounded-tl-full origin-bottom-right" />
              </div>

              {/* Concentric Radar Distance Rings */}
              <div className="absolute w-52 h-52 rounded-full border border-white/10" />
              <div className="absolute w-38 h-38 rounded-full border border-white/15" />
              <div className="absolute w-24 h-24 rounded-full border border-white/20" />
              <div className="w-3.5 h-3.5 rounded-full bg-[var(--pista)] z-10 shadow-[0_0_12px_var(--pista)]" />

              {/* Pulsing Acoustic Wave */}
              {isChirping && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 rounded-full border-2 border-[var(--terracotta)] animate-ping opacity-80" />
                  <div
                    className="w-48 h-48 rounded-full border border-[var(--terracotta)] animate-ping opacity-60"
                    style={{ animationDelay: '180ms' }}
                  />
                </div>
              )}

              {/* Family Interactive Nodes */}
              <button
                type="button"
                onClick={() => setSelectedNode('dada')}
                className={`absolute top-4 left-10 flex items-center gap-2 p-1 rounded-xl transition-transform cursor-pointer ${
                  selectedNode === 'dada' ? 'scale-110 ring-2 ring-[var(--pista)]' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[var(--pista)] text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-lg">
                  Dada
                </div>
                <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-mono border border-white/15 text-left">
                  <span className="text-white block font-semibold">Dada’s Phone</span>
                  <span className="text-[var(--terracotta)] block font-bold">Cushion · 2.1m</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedNode('mom')}
                className={`absolute bottom-4 right-10 flex items-center gap-2 p-1 rounded-xl transition-transform cursor-pointer ${
                  selectedNode === 'mom' ? 'scale-110 ring-2 ring-[var(--terracotta)]' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[var(--terracotta)] text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-lg">
                  Mom
                </div>
                <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-mono border border-white/15 text-left">
                  <span className="text-white block font-semibold">Sneha</span>
                  <span className="text-[var(--pista)] block font-bold">Table · 4.8m</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedNode('aarav')}
                className={`absolute bottom-6 left-14 flex items-center gap-2 p-1 rounded-xl transition-transform cursor-pointer ${
                  selectedNode === 'aarav' ? 'scale-110 ring-2 ring-sky-400' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-lg">
                  Aarav
                </div>
                <div className="bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded-lg text-[9px] font-mono border border-white/15 text-left">
                  <span className="text-white block font-semibold">Aarav</span>
                  <span className="text-sky-300 block">Desk · 3.4m</span>
                </div>
              </button>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/70 z-10">
              <span className="flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5 text-[var(--pista)]" />
                <span>Selected: {currentNode.name}</span>
              </span>
              <span className="text-[var(--pista)] font-semibold">{currentNode.rssi}</span>
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
                  type="button"
                  onClick={() => setSelectedPlane(plane)}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    selectedPlane === plane
                      ? 'bg-[var(--surface)] border-[var(--ink)] shadow-xs scale-[1.01]'
                      : 'bg-[var(--surface2)] border-[var(--border)] hover:bg-[var(--surface3)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-sm font-bold text-[var(--ink)] capitalize">
                      {plane === 'cushion'
                        ? 'Sofa Cushion Depth'
                        : plane === 'table'
                        ? 'Table / Counter Plane'
                        : 'Under-Bed Floor Level'}
                    </span>
                    <span
                      className="text-[10px] font-mono font-semibold"
                      style={{ color: planes[plane].color }}
                    >
                      {planes[plane].rfDamping}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                    {planes[plane].desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Acoustic Locator Trigger */}
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--ink)]">Acoustic Cushion Chirp</span>
                <span className="text-[10px] font-mono text-[var(--pista-hover)] font-bold">
                  Hardware Resonant Tone
                </span>
              </div>
              <p className="text-[11px] text-[var(--ink-secondary)] leading-relaxed">
                Emits penetrating 880Hz → 440Hz sonic chirps and haptics to penetrate sofa fabric and divans.
              </p>
              <button
                type="button"
                onClick={triggerChirp}
                className="w-full py-2.5 rounded-xl bg-[var(--terracotta)] text-white text-xs font-semibold hover:bg-[var(--terracotta-hover)] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isChirping ? 'Sonic Burst Emitting...' : 'Test Acoustic Cushion Chirp'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
