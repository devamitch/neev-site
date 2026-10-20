import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Shield, Zap, Crown, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

type Plan = {
  id: string;
  name: string;
  price: number;         // INR per month
  priceAnnual: number;   // INR per month billed annually
  icon: React.ElementType;
  color: string;
  tagline: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Seedling',
    price: 0,
    priceAnnual: 0,
    icon: Sparkles,
    color: 'bg-surface-container-low',
    tagline: 'For families just getting started',
    features: [
      'Up to 2 children',
      'Basic health & vaccination tracking',
      'School & homework tracker',
      'Family calendar',
      'Guardian AI (10 messages/day)',
      '500 MB vault storage',
    ],
    cta: 'Current Plan',
  },
  {
    id: 'family',
    name: 'Family',
    price: 299,
    priceAnnual: 199,
    icon: Shield,
    color: 'bg-primary',
    tagline: 'Everything your family needs',
    features: [
      'Unlimited children',
      'Full medical & vaccination records',
      'Growth chart visualizations',
      'Appointment reminders (SMS + in-app)',
      'Google integrations (Calendar, Tasks, Drive)',
      'Guardian AI (unlimited)',
      '10 GB vault storage',
      'Multi-parent / guardian access',
      'Document upload & sharing',
      'Emergency contact cards (printable)',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    id: 'legacy',
    name: 'Legacy',
    price: 799,
    priceAnnual: 599,
    icon: Crown,
    color: 'bg-on-surface',
    tagline: 'For extended families & professionals',
    features: [
      'Everything in Family',
      'Up to 10 family members',
      'Legacy vault with AI memory indexing',
      'Medical records export (PDF)',
      'Priority Guardian AI with web search',
      'Unlimited storage',
      'Dedicated family advisor (monthly call)',
      'Custom family homepage',
    ],
    cta: 'Go Legacy',
  },
];

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function SubscriptionModule() {
  const { user, familyId } = useAuth();
  const activeFamilyId = familyId || user?.uid || 'default';
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [loading, setLoading] = useState<string | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  useEffect(() => {
    if (!activeFamilyId) return;
    getDoc(doc(db, 'families', activeFamilyId, 'subscription', 'current')).then(d => {
      if (d.exists()) {
        const data = d.data();
        setCurrentPlan(data.planId || 'free');
        setSubscriptionData(data);
      }
    });
  }, [activeFamilyId]);

  const handleSubscribe = async (plan: Plan) => {
    if (plan.id === 'free' || plan.id === currentPlan) return;

    setLoading(plan.id);
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert('Unable to load payment gateway. Please check your internet connection.');
      setLoading(null);
      return;
    }

    const amount = (billing === 'annual' ? plan.priceAnnual : plan.price) * 100; // paise
    const period = billing === 'annual' ? '12 months' : '1 month';

    // In production: create an order via Firebase Cloud Function / backend
    // For demo: use a mock order ID (replace with real backend call)
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_here';

    const options = {
      key: razorpayKey,
      amount,
      currency: 'INR',
      name: 'NEEV Family',
      description: `${plan.name} Plan — ${period}`,
      image: '/images/neev_real_home.png',
      prefill: {
        name: user?.displayName || '',
        email: user?.email || '',
      },
      theme: { color: '#6750A4' },
      modal: { ondismiss: () => setLoading(null) },
      handler: async (response: any) => {
        // Save subscription to Firestore after successful payment
        await setDoc(doc(db, 'families', activeFamilyId, 'subscription', 'current'), {
          planId: plan.id,
          planName: plan.name,
          billing,
          amount: amount / 100,
          razorpayPaymentId: response.razorpay_payment_id,
          activatedAt: serverTimestamp(),
          expiresAt: new Date(Date.now() + (billing === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000),
          status: 'active',
        });
        setCurrentPlan(plan.id);
        setLoading(null);
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert('Payment failed. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="label-md text-[0.65rem] tracking-[0.35em] text-primary uppercase font-bold">Plans & Pricing</span>
        <h1 className="font-serif text-4xl md:text-5xl text-on-surface">
          Choose your family's <span className="italic text-primary/70">foundation</span>
        </h1>
        <p className="text-on-surface-variant font-sans font-light text-lg max-w-xl mx-auto">
          Every rupee goes toward making your family safer, healthier, and more connected.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center bg-surface-container-low rounded-2xl p-1 gap-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-5 py-2 rounded-xl text-sm font-sans font-semibold transition-all ${billing === 'monthly' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`px-5 py-2 rounded-xl text-sm font-sans font-semibold transition-all flex items-center gap-2 ${billing === 'annual' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Annual
            <span className="text-[0.6rem] font-bold uppercase tracking-widest bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Save 33%</span>
          </button>
        </div>
      </div>

      {/* Current plan banner */}
      {subscriptionData && currentPlan !== 'free' && (
        <div className="flex items-center gap-4 p-4 bg-primary-container/40 border border-primary/20 rounded-2xl">
          <Star className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-on-surface">
              You're on the <strong>{subscriptionData.planName}</strong> plan
            </p>
            <p className="text-xs text-on-surface-variant font-sans">
              {subscriptionData.status === 'active' ? 'Active' : 'Expired'} · Payment ID: {subscriptionData.razorpayPaymentId}
            </p>
          </div>
        </div>
      )}

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan, i) => {
          const price = billing === 'annual' ? plan.priceAnnual : plan.price;
          const isCurrent = plan.id === currentPlan;
          const isPopular = plan.popular;
          const isDark = plan.id === 'legacy';
          const isPrimary = plan.id === 'family';

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col rounded-3xl p-7 ${
                isDark ? 'bg-on-surface text-surface-container-lowest' :
                isPrimary ? 'bg-primary text-on-primary ring-4 ring-primary/20' :
                'bg-surface-container-low text-on-surface border border-outline-variant/20'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-on-primary text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                isDark ? 'bg-white/10' : isPrimary ? 'bg-white/20' : 'bg-primary-container'
              }`}>
                <plan.icon className={`w-6 h-6 ${isDark || isPrimary ? 'text-white' : 'text-primary'}`} aria-hidden="true" />
              </div>

              <h3 className="font-serif text-2xl mb-1">{plan.name}</h3>
              <p className={`text-xs font-sans mb-5 ${isDark ? 'opacity-60' : isPrimary ? 'opacity-80' : 'text-on-surface-variant'}`}>
                {plan.tagline}
              </p>

              <div className="mb-6">
                {price === 0 ? (
                  <span className="font-serif text-4xl">Free</span>
                ) : (
                  <div className="flex items-end gap-1">
                    <span className={`text-sm font-sans font-light ${isDark || isPrimary ? 'opacity-70' : 'text-on-surface-variant'}`}>₹</span>
                    <span className="font-serif text-4xl">{price}</span>
                    <span className={`text-sm font-sans mb-1 ${isDark || isPrimary ? 'opacity-70' : 'text-on-surface-variant'}`}>/mo</span>
                  </div>
                )}
                {billing === 'annual' && price > 0 && (
                  <p className={`text-xs mt-1 ${isDark || isPrimary ? 'opacity-60' : 'text-on-surface-variant'}`}>
                    Billed ₹{price * 12}/year
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 flex-1 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-primary' : isPrimary ? 'text-on-primary' : 'text-primary'}`} aria-hidden="true" />
                    <span className={`text-sm font-sans font-light leading-tight ${isDark ? 'opacity-80' : isPrimary ? 'opacity-90' : ''}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan)}
                disabled={isCurrent || loading !== null}
                className={`w-full py-6 rounded-2xl font-sans font-semibold tracking-wide transition-all active:scale-[0.98] ${
                  isCurrent
                    ? isDark || isPrimary ? 'bg-white/20 text-white/60 cursor-default' : 'bg-surface-container text-on-surface-variant cursor-default'
                    : isDark ? 'bg-white text-on-surface hover:bg-white/90'
                    : isPrimary ? 'bg-on-primary text-primary hover:opacity-90'
                    : 'bg-primary text-on-primary hover:bg-primary/90'
                }`}
              >
                {loading === plan.id ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" aria-label="Processing…" />
                ) : isCurrent ? '✓ Current Plan' : plan.cta}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Trust signals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        {[
          { icon: Shield, title: 'Secure Payments', desc: 'Powered by Razorpay. PCI-DSS compliant. Your data never touches our servers.' },
          { icon: Zap, title: 'Cancel Anytime', desc: 'No lock-in contracts. Cancel from Settings in one click, effective end of billing period.' },
          { icon: Star, title: '7-Day Free Trial', desc: 'All paid plans come with a 7-day trial. No charges until trial ends.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-3 p-4 bg-surface-container-low rounded-2xl">
            <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-on-surface mb-1">{title}</p>
              <p className="text-xs text-on-surface-variant font-sans font-light leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-on-surface-variant/50 font-sans">
        Prices in Indian Rupees (INR) · GST applicable as per regulations · NEEV Family Technologies Pvt. Ltd.
      </p>
    </div>
  );
}
