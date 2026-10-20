import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Target, Compass, Heart, Shield, Sparkles, ArrowRight, Plus } from 'lucide-react';
import gsap from 'gsap';

const goals = [
  {
    id: 'legacy',
    title: 'Preserve Legacy',
    description: 'Archive family stories, photos, and wisdom for future generations.',
    icon: <Compass className="w-6 h-6" />,
  },
  {
    id: 'growth',
    title: 'Nurture Growth',
    description: 'Track children\'s milestones and daily progress with AI guidance.',
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: 'security',
    title: 'Family Security',
    description: 'Secure shared documentation and essential family information.',
    icon: <Shield className="w-6 h-6" />,
  },
  {
    id: 'connection',
    title: 'Deepen Connection',
    description: 'Coordinate schedules and tasks with spouse and extended family.',
    icon: <Heart className="w-6 h-6" />,
  }
];

export default function GoalsSetupPage() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [customGoals, setCustomGoals] = useState<{ id: string; title: string }[]>([]);
  const [customInput, setCustomInput] = useState('');
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(headerRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'expo.out'
      })
      .from(gridRef.current?.children || [], {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'expo.out'
      }, "-=0.6");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const addCustomGoal = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    const id = `custom-${Date.now()}`;
    setCustomGoals(prev => [...prev, { id, title: trimmed }]);
    setSelectedGoals(prev => [...prev, id]);
    setCustomInput('');
  };

  const handleNext = () => {
    if (selectedGoals.length > 0) {
      navigate('/google-connect');
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-surface flex flex-col relative overflow-hidden">
      <header ref={headerRef} className="px-8 pt-20 pb-12 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="space-y-4 max-w-xl text-left md:w-1/2">
          <span className="label-md text-primary tracking-[0.4em] block">INTENTION</span>
          <h1 className="font-serif text-4xl md:text-5xl text-on-surface">Why are you <span className="italic text-primary">here</span>?</h1>
          <p className="font-sans text-on-surface-variant font-light text-lg">
            Understanding your goals helps NEEV tailor the sanctuary to your family's unique rhythm. Select all that resonate.
          </p>
        </div>
        <div className="hidden md:block md:w-1/3 aspect-4/5 rounded-2xl overflow-hidden">
          <img src="/images/neev_real_goals.png" alt="Planning family future" className="w-full h-full object-cover" />
        </div>
      </header>

      <main className="flex-grow px-6 max-w-4xl mx-auto w-full pb-24">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <Card
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`group relative cursor-pointer transition-all duration-500 border-none rounded-2xl overflow-hidden ${
                selectedGoals.includes(goal.id)
                  ? 'bg-primary-container/30 ring-1 ring-primary'
                  : 'bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <CardContent className="p-8 flex items-start gap-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                  selectedGoals.includes(goal.id) ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-primary'
                }`}>
                  {goal.icon}
                </div>
                <div className="flex-grow space-y-2">
                  <h3 className="font-serif text-xl text-on-surface">{goal.title}</h3>
                  <p className="text-sm font-sans font-light text-on-surface-variant leading-relaxed">
                    {goal.description}
                  </p>
                </div>
                {selectedGoals.includes(goal.id) && (
                  <CheckCircle2 className="w-6 h-6 text-primary animate-in zoom-in duration-300" />
                )}
              </CardContent>
            </Card>
          ))}

          {customGoals.map((goal) => (
            <Card
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`group relative cursor-pointer transition-all duration-500 border-none rounded-2xl overflow-hidden ${
                selectedGoals.includes(goal.id)
                  ? 'bg-primary-container/30 ring-1 ring-primary'
                  : 'bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <CardContent className="p-8 flex items-start gap-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                  selectedGoals.includes(goal.id) ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-primary'
                }`}>
                  <Target className="w-6 h-6" />
                </div>
                <div className="flex-grow space-y-2">
                  <h3 className="font-serif text-xl text-on-surface">{goal.title}</h3>
                  <p className="text-sm font-sans font-light text-on-surface-variant">Your intention</p>
                </div>
                {selectedGoals.includes(goal.id) && (
                  <CheckCircle2 className="w-6 h-6 text-primary animate-in zoom-in duration-300" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <Input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomGoal()}
            placeholder="Add your own intention…"
            className="bg-surface-container-low border-none h-14 rounded-md font-sans text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-highest transition-colors"
          />
          <Button
            type="button"
            onClick={addCustomGoal}
            disabled={!customInput.trim()}
            className="h-14 px-6 bg-primary text-on-primary rounded-md hover:bg-primary/90 disabled:opacity-30 shrink-0"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            onClick={handleNext}
            disabled={selectedGoals.length === 0}
            variant="primary"
            className="group px-12 py-7 text-sm uppercase tracking-[0.3em] rounded-md disabled:opacity-30"
          >
            Continue Journey
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </main>

      <footer className="py-12 text-center opacity-30">
        <p className="label-md text-[0.6rem] tracking-[0.2em]">NEEV · THE MODERN HEIRLOOM</p>
      </footer>
    </div>
  );
}
