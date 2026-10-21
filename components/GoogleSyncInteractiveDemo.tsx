'use client'

import { useState } from 'react'
import { Calendar, CheckSquare, ShieldCheck, Lock, ArrowRight, RefreshCw, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react'

export function GoogleSyncInteractiveDemo() {
  const presets = [
    {
      id: 'festival',
      label: 'Diwali Puja & Deep Daan',
      category: 'Panchang Ritual',
      eventTitle: 'Diwali Lakshmi Puja & Family Aarti',
      eventTime: '06:45 PM – 07:30 PM (Amavasya Tithi)',
      googleScope: 'https://www.googleapis.com/auth/calendar.events',
      taskTitle: 'Procure 21 Terracotta Diyas & Pure Desi Ghee',
      taskScope: 'https://www.googleapis.com/auth/tasks',
      assignee: 'Co-Parents & Grandparents',
      sanitization: 'Zero medical or biometric context included.',
    },
    {
      id: 'health',
      label: 'Dada’s Heart Checkup',
      category: 'Geriatric Care',
      eventTitle: 'Dr. Banerjee Follow-up · Manipal Hospital',
      eventTime: '10:30 AM – 11:15 AM (Traffic buffer included)',
      googleScope: 'https://www.googleapis.com/auth/calendar.events',
      taskTitle: 'Pick up Cardivas 6.25mg & BP logbook',
      taskScope: 'https://www.googleapis.com/auth/tasks',
      assignee: 'Dad (Assigned in Google Tasks)',
      sanitization: 'Health records remain local; only appointment time and hospital location exported.',
    },
    {
      id: 'pediatric',
      label: 'Aarav School Exam & Fees',
      category: 'Shared Parenting',
      eventTitle: 'CBSE Term 1 Mathematics Assessment',
      eventTime: '08:30 AM – 11:30 AM',
      googleScope: 'https://www.googleapis.com/auth/calendar.events',
      taskTitle: 'Pay Quarter 3 Transport & Activity Fee',
      taskScope: 'https://www.googleapis.com/auth/tasks',
      assignee: 'Mom & Dad (Shared Checklist)',
      sanitization: 'Child’s biometric identifiers completely excluded.',
    },
  ]

  const [selectedId, setSelectedId] = useState('festival')
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle')

  const current = presets.find((p) => p.id === selectedId) || presets[0]

  const handleSimulateSync = () => {
    setSyncStatus('syncing')
    setTimeout(() => {
      setSyncStatus('synced')
    }, 1200)
  }

  return (
    <section className="py-16 scroll-mt-20">
      <div className="sanctuary-card p-6 sm:p-12 max-w-5xl mx-auto border border-[var(--border)]">
        {/* Header */}
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)] text-xs font-mono uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Interactive Privacy Architecture Demo</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--ink)] mb-3">
            Google Workspace Bi-Directional Synchronizer
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
            See how sacred Indian rituals, elder medical appointments, and shared parenting chores flow safely into your personal Google Calendar and Google Tasks without leaking sensitive family data.
          </p>
        </div>

        {/* Preset Selector Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedId(preset.id)
                setSyncStatus('idle')
              }}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedId === preset.id
                  ? 'bg-[var(--pista)] text-white shadow-none font-semibold'
                  : 'bg-[var(--surface2)] text-[var(--ink-secondary)] hover:bg-[var(--surface3)]'
              }`}
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* 3-Step Pipeline Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Step 1: On-Device Sovereign Origin */}
          <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--pista)] font-bold">
                Step 1: Origin
              </span>
              <Lock className="w-4 h-4 text-[var(--pista)]" />
            </div>
            <h4 className="font-serif text-sm font-bold text-[var(--ink)]">
              Local Hardware Keystore (MMKV)
            </h4>
            <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
              Created within your family sanctuary. AES-256-GCM encrypted in iOS Secure Enclave or Android Keystore before touching any network.
            </p>
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono space-y-1">
              <p><strong>Item:</strong> {current.eventTitle}</p>
              <p className="text-[var(--terracotta)] font-semibold"><strong>Category:</strong> {current.category}</p>
            </div>
          </div>

          {/* Step 2: Context Sanitizer Boundary */}
          <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--terracotta)] font-bold">
                Step 2: Sanitizer
              </span>
              <ShieldCheck className="w-4 h-4 text-[var(--terracotta)]" />
            </div>
            <h4 className="font-serif text-sm font-bold text-[var(--ink)]">
              Data Minimization Boundary
            </h4>
            <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
              Filters out unrelated family health notes and minor children’s identifiers. Zero data is sent to external AI/LLM models for training.
            </p>
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono space-y-1 text-[var(--pista-hover)]">
              <p>✓ Health PII Stripped</p>
              <p>✓ Zero Model Training</p>
              <p>✓ Limited Use Enforced</p>
            </div>
          </div>

          {/* Step 3: Google Workspace Destination */}
          <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink)] font-bold">
                Step 3: Google Export
              </span>
              <Calendar className="w-4 h-4 text-[var(--ink)]" />
            </div>
            <h4 className="font-serif text-sm font-bold text-[var(--ink)]">
              Google Calendar &amp; Tasks
            </h4>
            <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
              Exported via official OAuth2 scopes with user authorization. Synchronizes directly to personal Google accounts.
            </p>
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[10px] font-mono space-y-1">
              <p className="text-[var(--pista)]">Scope: calendar.events</p>
              <p className="text-[var(--terracotta)]">Scope: tasks</p>
            </div>
          </div>
        </div>

        {/* Action & Result Preview */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-left w-full sm:w-auto">
            <span className="text-xs font-bold text-[var(--ink)] block">
              Test Synchronization Pipeline
            </span>
            <p className="text-xs text-[var(--ink-secondary)]">
              Simulate how Neev synchronizes &ldquo;{current.eventTitle}&rdquo; into your Google ecosystem.
            </p>
          </div>

          <button
            onClick={handleSimulateSync}
            disabled={syncStatus === 'syncing'}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--ink)] text-white text-xs font-semibold hover:bg-[var(--ink-secondary)] transition-all flex items-center justify-center gap-2 shrink-0 shadow-none disabled:opacity-50"
          >
            {syncStatus === 'syncing' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[var(--pista)]" />
                <span>Sanitizing &amp; Syncing...</span>
              </>
            ) : syncStatus === 'synced' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[var(--pista)]" />
                <span>Synced to Google Successfully!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[var(--terracotta)]" />
                <span>Simulate 1-Click Google Sync</span>
              </>
            )}
          </button>
        </div>

        {/* Live Exported Payload Cards */}
        {syncStatus === 'synced' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            {/* Calendar Card Preview */}
            <div className="p-4 rounded-xl bg-[var(--pista-container)]/70 border border-[var(--pista)]/30 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-[var(--pista-hover)]">
                  Google Calendar Result
                </span>
                <span className="text-[10px] font-mono text-[var(--pista)]">HTTP 200 OK</span>
              </div>
              <h5 className="font-serif text-sm font-bold text-[var(--ink)]">
                {current.eventTitle}
              </h5>
              <p className="text-xs text-[var(--ink-secondary)] font-mono">
                {current.eventTime}
              </p>
            </div>

            {/* Tasks Card Preview */}
            <div className="p-4 rounded-xl bg-[var(--terracotta-container)]/70 border border-[var(--terracotta)]/30 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-[var(--terracotta)]">
                  Google Tasks Result
                </span>
                <span className="text-[10px] font-mono text-[var(--terracotta)]">HTTP 200 OK</span>
              </div>
              <h5 className="font-serif text-sm font-bold text-[var(--ink)]">
                {current.taskTitle}
              </h5>
              <p className="text-xs text-[var(--ink-secondary)] font-mono">
                {current.assignee}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
