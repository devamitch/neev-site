import { HelpCircle } from 'lucide-react'

export function FaqSection() {
  const faqs = [
    {
      q: 'How does Neev integrate with my Google Account?',
      a: 'Neev allows you to optionally export family events to Google Calendar and chores to Google Tasks. We adhere strictly to the Google API Services User Data Policy, including the Limited Use requirements. Your data is never sold, transferred to third parties, or used to train general AI models.',
    },
    {
      q: 'How is Neev customized for Indian joint families?',
      a: 'Unlike generic productivity apps, Neev recognizes the roles of Grandparents, Parents, and Children. Interfaces for elders feature larger typography and voice recording, while parents receive collaborative scheduling and panchang puja timing alerts.',
    },
    {
      q: 'Is my family’s data private?',
      a: 'Yes. Neev utilizes zero-knowledge client-side encryption for vault memories and private photos. The system is designed so that only verified family members possessing your sanctuary key can view your records.',
    },
    {
      q: 'Are the offline tile maps free to use?',
      a: 'Absolutely. Neev uses free OpenStreetMap and Carto Light cartography. We do not incur or pass on any Google Maps billing to our users.',
    },
    {
      q: 'How do I revoke access or delete my data?',
      a: 'You can delete your family sanctuary anytime within the app settings. You can also revoke Google permissions instantly via myaccount.google.com/permissions or by emailing amit@devamit.co.in.',
    },
  ]

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
            Everything you need to know about privacy, family roles, and Google Workspace integration.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="sanctuary-card p-6 rounded-2xl hover:border-[var(--border-strong)] transition-all">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--ink)] mb-2 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-[var(--pista)] shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed pl-8">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
