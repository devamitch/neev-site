'use client';

import { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  ShieldCheck,
  Lock,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Code,
  Terminal,
  Activity,
  Layers,
  Eye,
  Check
} from 'lucide-react';

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
      jsonPayload: {
        summary: 'Diwali Lakshmi Puja & Family Aarti',
        description: 'Panchang Muhurat calculated locally. Deep Daan at Sunset.',
        start: { dateTime: '2026-11-08T18:45:00+05:30' },
        end: { dateTime: '2026-11-08T19:30:00+05:30' },
        extendedProperties: {
          private: {
            sanctuary_id: 'neev_kutumb_blr_01',
            client_verification: 'LIMITED_USE_COMPLIANT',
            ai_training_exempt: 'TRUE'
          }
        }
      }
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
      jsonPayload: {
        summary: 'Dr. Banerjee Follow-up · Manipal Hospital',
        location: 'Old Airport Rd, Kodihalli, Bengaluru',
        start: { dateTime: '2026-10-24T10:30:00+05:30' },
        end: { dateTime: '2026-10-24T11:15:00+05:30' },
        reminders: {
          useDefault: false,
          overrides: [{ method: 'popup', minutes: 45 }]
        },
        extendedProperties: {
          private: {
            pii_sanitized: 'TRUE',
            medical_diagnosis_redacted: 'TRUE'
          }
        }
      }
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
      jsonPayload: {
        title: 'Pay Quarter 3 Transport & Activity Fee',
        due: '2026-10-28T23:59:00+05:30',
        notes: 'Co-parent joint school account checklist. Zero child tracking data attached.',
        status: 'needsAction'
      }
    },
  ];

  const [selectedId, setSelectedId] = useState('festival');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  const current = presets.find((p) => p.id === selectedId) || presets[0];

  const handleSimulateSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
    }, 1200);
  };

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
            See how sacred Indian rituals, elder medical appointments, and shared parenting chores flow safely into your personal Google Calendar and Google Tasks without leaking sensitive family records.
          </p>
        </div>

        {/* Preset Selector Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setSelectedId(preset.id);
                  setSyncStatus('idle');
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedId === preset.id
                    ? 'bg-[var(--pista)] text-white shadow-xs'
                    : 'bg-[var(--surface2)] text-[var(--ink-secondary)] hover:bg-[var(--surface3)]'
                }`}
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowJsonInspector(!showJsonInspector)}
            className="px-3 py-1.5 rounded-full text-xs font-mono text-[var(--ink-secondary)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] flex items-center gap-1.5 cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-[var(--terracotta)]" />
            <span>{showJsonInspector ? 'Hide Raw JSON' : 'Inspect Clean Payload'}</span>
          </button>
        </div>

        {/* 3-Step Pipeline Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative">
          {/* Step 1: On-Device Sovereign Origin */}
          <div className={`p-5 rounded-2xl bg-[var(--surface2)] border transition-all ${
            syncStatus === 'syncing' ? 'border-[var(--pista)] scale-[1.01]' : 'border-[var(--border)]'
          } space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--pista-hover)] font-bold">
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
          <div className={`p-5 rounded-2xl bg-[var(--surface2)] border transition-all ${
            syncStatus === 'syncing' ? 'border-[var(--terracotta)] scale-[1.01]' : 'border-[var(--border)]'
          } space-y-3`}>
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
          <div className={`p-5 rounded-2xl bg-[var(--surface2)] border transition-all ${
            syncStatus === 'synced' ? 'border-[var(--pista)] ring-2 ring-[var(--pista)]/20' : 'border-[var(--border)]'
          } space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--pista-hover)] font-bold">
                Step 3: Google Workspace
              </span>
              <Calendar className="w-4 h-4 text-[var(--pista)]" />
            </div>
            <h4 className="font-serif text-sm font-bold text-[var(--ink)]">
              Target Calendar &amp; Tasks
            </h4>
            <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
              Authorized via standard OAuth 2.0. Exported directly into your personal Google account with no third-party data broker access.
            </p>
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono space-y-1">
              <p className="text-[var(--pista-hover)] font-semibold truncate"><strong>Scope:</strong> {current.googleScope}</p>
              <p className="text-[var(--ink)]"><strong>Assigned:</strong> {current.assignee}</p>
            </div>
          </div>
        </div>

        {/* JSON Payload Inspector Drawer */}
        {showJsonInspector && (
          <div className="mb-8 p-4 rounded-2xl bg-[var(--dock)] text-white border border-white/10 font-mono text-xs overflow-x-auto animate-fadeIn">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-[11px] text-white/70">
              <span className="text-[var(--pista)] font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Sanitized Outbound OAuth Payload (Zero Biometrics / Zero AI Training)
              </span>
              <span className="text-white/40">JSON · Content-Type: application/json</span>
            </div>
            <pre className="text-[11px] leading-relaxed text-emerald-300">
              {JSON.stringify(current.jsonPayload, null, 2)}
            </pre>
          </div>
        )}

        {/* Action & Feedback Footer */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[var(--ink-secondary)] text-center sm:text-left">
            <span className="font-bold text-[var(--ink)] block sm:inline">Verification Compliance: </span>
            <span>Adheres strictly to the Google API Services User Data Policy, including Limited Use.</span>
          </div>

          <button
            type="button"
            onClick={handleSimulateSync}
            disabled={syncStatus === 'syncing'}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[var(--pista)] hover:bg-[var(--pista-hover)] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {syncStatus === 'syncing' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating OAuth 2.0 Pipeline...</span>
              </>
            ) : syncStatus === 'synced' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Synchronized Successfully (200 OK)</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Simulate Real-Time Google Sync</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
