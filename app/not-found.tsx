import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] flex items-center justify-center bg-[var(--bg)] px-4">
        <div className="max-w-md mx-auto text-center sanctuary-card p-10 space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--terracotta)] font-semibold block">
            404 · Page Not Found
          </span>
          <h1 className="font-serif text-3xl font-bold text-[var(--ink)]">
            Peaceful Sanctuary
          </h1>
          <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
            The pathway you were looking for doesn’t exist or has moved. Return to our sanctuary home.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[var(--pista)] text-white text-xs font-semibold hover:bg-[var(--pista-hover)] transition-all shadow-none"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
