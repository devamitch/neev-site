'use client'

import Link from 'next/link'
import Image from 'next/image'
import { navItems, siteConfig } from '@/lib/site'
import { Sparkles, Shield, Heart } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--pista-container)] border border-[var(--pista)]/20 overflow-hidden shadow-none transition-transform group-hover:scale-105">
            <Image
              src="/favicon.png"
              alt="Neev Sanctuary Emblem"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-[var(--ink)] block leading-tight">
              {siteConfig.name}
            </span>
            <span className="text-[10px] font-mono tracking-wider text-[var(--terracotta)] uppercase block">
              Indian Family OS
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--surface2)]/80 p-1 rounded-full border border-[var(--border)]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-1.5 text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface)] rounded-full transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/privacy-policy"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[var(--pista)] font-medium hover:underline"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Google Verified</span>
          </Link>

          <Link
            href="/beta"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--pista)] text-white text-xs font-semibold hover:bg-[var(--pista-hover)] transition-all shadow-none"
          >
            <span>Join Beta</span>
            <Sparkles className="w-3.5 h-3.5 text-[var(--terracotta-container)]" />
          </Link>
        </div>
      </div>
    </header>
  )
}
