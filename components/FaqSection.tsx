'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck } from 'lucide-react';

export function FaqSection() {
  const faqs = [
    {
      q: 'How does Neev integrate with my personal Google Account?',
      a: 'Neev allows you to optionally export family events to Google Calendar and chores to Google Tasks. We adhere strictly to the Google API Services User Data Policy, including the Limited Use requirements. Your data is never sold, transferred to third parties, or used to train general AI models.',
    },
    {
      q: 'How is Neev customized for Indian joint multi-generational families?',
      a: 'Unlike generic productivity apps, Neev recognizes the distinct roles of Grandparents (Elders), Co-Parents, and Children. Interfaces for elders feature larger typography, voice oral recording, and Panchang sandhya timings, while parents receive collaborative scheduling and pediatrician vaccine alerts.',
    },
    {
      q: 'Is my family’s data sovereign and private?',
      a: 'Yes. Neev utilizes zero-knowledge client-side encryption for vault memories and private photos. The system is designed so that only verified family members possessing your sanctuary key can view your records. Local records are encrypted via hardware-backed Keystore/MMKV.',
    },
    {
      q: 'Are the offline tile maps free to use without Google Maps API charges?',
      a: 'Absolutely. Neev uses free OpenStreetMap and Carto Light cartography. We do not incur or pass on any Google Maps billing to our users.',
    },
    {
      q: 'How do I revoke Google access or delete my sanctuary data?',
      a: 'You can delete your family sanctuary anytime within the app settings under "1-Tap Hard Deletion". You can also revoke Google permissions instantly via myaccount.google.com/permissions or by emailing amit@devamit.co.in.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--terracotta)] font-semibold block mb-2">
            Clear Answers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink)] mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[var(--ink-secondary)] font-light">
            Everything you need to know about privacy, multi-generational roles, and Google Workspace integration.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="sanctuary-card rounded-2xl overflow-hidden border border-[var(--border)] transition-all hover:border-[var(--border-strong)]"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-[var(--ink)] flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[var(--pista)] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--ink-muted)] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[var(--pista)]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed pl-12 border-t border-[var(--border)]/50 bg-[var(--surface2)]/40 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
