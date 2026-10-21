'use client'

import { useState } from 'react'
import { Check, ArrowRight, ShieldCheck, Heart } from 'lucide-react'

export function BetaSignupSection() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <section id="beta" className="py-20 scroll-mt-20">
      <div className="max-w-4xl mx-auto rounded-[36px] bg-[var(--surface)] p-8 sm:p-14 text-center sanctuary-card relative overflow-hidden">
        {/* Soft decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--terracotta-container)]/50 blur-[80px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--pista-container)]/50 blur-[80px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--pista-container)] text-[var(--pista-hover)] text-xs font-mono uppercase tracking-wider mb-6">
            <Heart className="w-3.5 h-3.5" />
            <span>Closed Beta Testing Program</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] mb-4 leading-tight">
            Bring Peace to Your Family Sanctuary
          </h2>

          <p className="text-sm sm:text-base text-[var(--ink-secondary)] font-light leading-relaxed mb-8">
            Join hundreds of multi-generational Indian families orchestrating shared parenting, daily rituals, and cultural legacies together.
          </p>

          {submitted ? (
            <div className="rounded-3xl bg-[var(--pista-container)] p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-[var(--pista)] text-white flex items-center justify-center mx-auto mb-3">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[var(--ink)] mb-1">
                You’re on the Sanctuary Invite List!
              </h3>
              <p className="text-xs text-[var(--ink-secondary)]">
                We’ve reserved your spot. Watch your inbox for test build invites on Android and iOS.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your family email address"
                className="flex-1 px-5 py-3.5 rounded-full bg-[var(--surface2)] text-xs sm:text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--pista)]/25 transition-all"
              />
              <button
                type="submit"
                className="px-7 py-3.5 rounded-full bg-[var(--pista)] text-white text-xs sm:text-sm font-semibold hover:bg-[var(--pista-hover)] transition-all inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-98"
              >
                <span>Request Invite</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-6 text-[11px] font-mono text-[var(--ink-muted)]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--pista)]" />
              <span>Zero-knowledge encryption</span>
            </span>
            <span>•</span>
            <span>Google API verified</span>
            <span>•</span>
            <span>Free during beta</span>
          </div>
        </div>
      </div>
    </section>
  )
}
