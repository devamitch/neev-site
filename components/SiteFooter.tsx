import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/lib/site'
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-16 text-[var(--ink-secondary)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[var(--border)]">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--pista-container)] border border-[var(--pista)]/20">
                <Image src="/favicon.png" alt="Neev Logo" width={22} height={22} />
              </div>
              <span className="font-serif text-lg font-bold text-[var(--ink)]">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[var(--ink-muted)]">
              {siteConfig.tagline} A private digital sanctuary for modern Indian joint families to preserve ancestral wisdom and harmonize shared parenting.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--terracotta)]">
              <span>Bengaluru, Karnataka, India</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">
              Sanctuary
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/features" className="hover:text-[var(--ink)] transition-colors">
                  Features & Bento
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[var(--ink)] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-[var(--ink)] transition-colors">
                  Zero-Knowledge Security
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-[var(--ink)] transition-colors">
                  Product Roadmap
                </Link>
              </li>
              <li>
                <Link href="/beta" className="hover:text-[var(--ink)] transition-colors">
                  Join Beta Sanctuary
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">
              Google Compliance & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-[var(--ink)] transition-colors font-medium text-[var(--pista)]">
                  Privacy Policy (Limited Use)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[var(--ink)] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-[var(--ink)] transition-colors">
                  XML Sitemap
                </Link>
              </li>
              <li>
                <Link href="/robots.txt" className="hover:text-[var(--ink)] transition-colors">
                  Robots & AI Directives
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Architect */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">
              Architect
            </h4>
            <div className="rounded-2xl p-4 bg-[var(--surface2)] border border-[var(--border)] space-y-2">
              <span className="text-[11px] font-mono text-[var(--pista)] block uppercase">
                Created & Engineered by
              </span>
              <p className="text-xs font-semibold text-[var(--ink)]">
                Amit Chakraborty (@devamitch)
              </p>
              <p className="text-[11px] text-[var(--ink-muted)] leading-relaxed">
                Founding Engineer & Mobile/Web Architect building human-grounded digital heirlooms.
              </p>
              <div className="pt-1">
                <a
                  href="https://devamit.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--terracotta)] hover:underline"
                >
                  <span>devamit.co.in</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Google Limited Use Notice & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-muted)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--pista)] shrink-0" />
            <p>
              Neev adheres strictly to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--ink)]"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </div>
          <p>© {new Date().getFullYear()} Neev Sanctuary. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
