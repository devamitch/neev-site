import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Heart, Shield, Sparkles, Users, User, Star } from 'lucide-react';
import gsap from 'gsap';

const roles = [
  {
    id: 'mother',
    label: 'MOTHER',
    title: 'The Nurturer',
    description: 'The heart of the family, managing the emotional and logistical rhythm.',
    icon: <Heart className="w-6 h-6" />,
    color: 'bg-primary-container',
    image: '/images/neev_role_mother.png',
  },
  {
    id: 'father',
    label: 'FATHER',
    title: 'The Protector',
    description: 'The pillar of strength, ensuring security and long-term vision.',
    icon: <Shield className="w-6 h-6" />,
    color: 'bg-secondary-container',
    image: '/images/neev_role_father.png',
  },
  {
    id: 'elder',
    label: 'ELDER',
    title: 'The Sage',
    description: 'The keeper of wisdom, passing down heritage and ancestral lessons.',
    icon: <Star className="w-6 h-6" />,
    color: 'bg-tertiary-container',
    image: '/images/neev_role_elder.png',
  },
  {
    id: 'child',
    label: 'CHILD',
    title: 'The Future',
    description: 'The blooming legacy, learning and growing within the family sanctuary.',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'bg-primary-container',
    image: '/images/neev_role_child.png',
  }
];

export default function RoleSetupPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 1,
        ease: 'expo.out'
      })
      .from(cardsRef.current?.children || [], {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: 'expo.out'
      }, "-=0.6")
      .from(footerRef.current, {
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
      }, "-=0.4");
    });

    return () => ctx.revert();
  }, []);

  const handleComplete = () => {
    if (selectedRole) {
      navigate('/goals-setup');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col overflow-hidden selection:bg-primary-container selection:text-on-primary-container relative">

      <header ref={headerRef} className="px-8 py-10 text-center">
        <div className="space-y-4">
          <span className="label-md text-primary tracking-[0.4em] block">IDENTITY</span>
          <h1 className="font-serif text-4xl md:text-6xl text-on-surface">Define your <span className="italic text-primary">role</span></h1>
          <p className="font-sans text-on-surface-variant max-w-lg mx-auto font-light">
            Every family member plays a vital part in the lineage. Choose the archetype that best represents your presence.
          </p>
        </div>
      </header>

      <main className="flex-grow px-6 lg:px-24 pb-24">
        <div ref={cardsRef} className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role, idx) => (
            <div key={role.id}>
              <Card
                onClick={() => setSelectedRole(role.id)}
                className={`group cursor-pointer transition-all duration-700 border-none rounded-2xl overflow-hidden ${
                  selectedRole === role.id
                    ? 'ring-2 ring-primary ring-offset-4 ring-offset-surface'
                    : ''
                }`}
              >
                <div className="aspect-4/5 overflow-hidden">
                  <img
                    src={role.image}
                    alt={role.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <CardContent className="p-6 bg-surface-container-low flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${role.color} flex items-center justify-center text-primary`}>
                      {role.icon}
                    </div>
                    {selectedRole === role.id && (
                      <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                        <Sparkles className="w-3.5 h-3.5 text-on-primary" />
                      </div>
                    )}
                  </div>
                  <span className="label-md text-[0.65rem] tracking-[0.3em] text-on-surface-variant">{role.label}</span>
                  <h3 className="font-serif text-xl text-on-surface">{role.title}</h3>
                  <p className="text-sm font-sans font-light text-on-surface-variant leading-relaxed">
                    {role.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button
            onClick={handleComplete}
            disabled={!selectedRole}
            variant="primary"
            className="px-16 py-8 text-sm uppercase tracking-[0.3em] rounded-md disabled:opacity-30"
          >
            Enter the Sanctuary
          </Button>
        </div>
      </main>

      <footer ref={footerRef} className="py-12 text-center opacity-30">
        <p className="label-md text-[0.6rem] tracking-[0.2em]">NEEV · THE MODERN HEIRLOOM</p>
      </footer>
    </div>
  );
}
