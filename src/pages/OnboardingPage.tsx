import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Heart, BookOpen } from 'lucide-react';
import gsap from 'gsap';

const steps = [
  {
    id: 'heritage',
    label: 'THE HERITAGE',
    title: 'Your lineage is a living story.',
    description: 'Virasat is the heartbeat of your family\'s history. We help you capture the whispers of the past to guide the voices of the future.',
    image: '/images/neev_role_elder.png',
    icon: <BookOpen className="w-6 h-6" />,
    accent: 'bg-primary-container'
  },
  {
    id: 'guardian',
    label: 'THE GUARDIAN',
    title: 'Wisdom that anticipates.',
    description: 'Not a chatbot, but a digital elder. The Guardian learns your family\'s rhythm to provide proactive guidance and gentle reminders.',
    image: '/images/neev_real_guardian.png',
    icon: <Sparkles className="w-6 h-6" />,
    accent: 'bg-tertiary-container'
  },
  {
    id: 'vault',
    label: 'THE VAULT',
    title: 'Secure your family legacy.',
    description: 'A sanctuary for your most precious documents, memories, and lessons. Encrypted, private, and preserved for generations.',
    image: '/images/neev_real_home.png',
    icon: <Shield className="w-6 h-6" />,
    accent: 'bg-secondary-container'
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
      });
      gsap.from(footerRef.current, {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.5
      });
    });

    return () => ctx.revert();
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/role-setup');
    }
  };

  const step = steps[currentStep];

  return (
    <div ref={containerRef} className="min-h-screen bg-surface flex flex-col overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation */}
      <header ref={headerRef} className="px-8 py-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-on-primary" />
          </div>
          <span className="text-xl font-serif italic text-primary tracking-widest">NEEV</span>
        </div>
        <button 
          onClick={() => navigate('/role-setup')}
          className="text-sm font-sans font-medium text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase"
        >
          Skip
        </button>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row items-center px-6 lg:px-24 py-12 gap-16 lg:gap-32">
        {/* Left: Image */}
        <div className="w-full lg:w-1/2">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="aspect-4/5 rounded-2xl overflow-hidden"
            >
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Narrative Content */}
        <div className="w-full lg:w-1/2 space-y-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="label-md text-primary tracking-[0.3em] block">{step.label}</span>
                <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tighter leading-tight text-on-surface">
                  {step.title.split(' ').map((word, i) => (
                    <span key={i} className={word === 'living' || word === 'anticipates.' || word === 'legacy.' ? 'italic text-primary' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </h1>
                <p className="font-sans text-xl text-on-surface-variant leading-relaxed max-w-lg font-light">
                  {step.description}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl ${step.accent} flex items-center justify-center text-primary`}>
                  {step.icon}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between pt-8">
            <div className="flex gap-3">
              {steps.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1.5 transition-all duration-500 rounded-full ${i === currentStep ? 'w-12 bg-primary' : 'w-3 bg-primary/10'}`}
                />
              ))}
            </div>

            <Button 
              onClick={handleNext}
              variant="primary"
              className="px-10 py-8 text-sm uppercase tracking-[0.3em] rounded-md group"
            >
              {currentStep === steps.length - 1 ? 'Begin Journey' : 'Next Step'}
              <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer ref={footerRef} className="px-8 py-12 flex justify-center opacity-20">
        <span className="font-serif italic text-primary tracking-widest text-sm">परिवार की नींव — Foundation of the Family</span>
      </footer>
    </div>
  );
}
