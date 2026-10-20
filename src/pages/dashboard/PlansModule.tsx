import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Target,
  ArrowRight,
  Shield,
  Heart,
  CheckCircle2,
  Circle,
  Plus,
  X,
  ChevronUp,
  Loader2,
  Trash2,
} from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';

type PlanTask = { id: string; text: string; done: boolean };

type Plan = {
  id: string;
  title: string;
  description: string;
  color: string;
  image: string;
  tasks: PlanTask[];
};

const DEFAULT_PLANS: Omit<Plan, 'id'>[] = [
  {
    title: 'Education & Growth',
    description: "Curated learning paths based on your family's school syllabus and interests.",
    color: 'bg-primary-container text-primary',
    image: '/images/neev_studying_student.png',
    tasks: [
      { id: crypto.randomUUID(), text: 'Math: Algebra Basics', done: false },
      { id: crypto.randomUUID(), text: 'Science: Solar System Project', done: false },
      { id: crypto.randomUUID(), text: 'Reading: 30 mins daily', done: true },
    ],
  },
  {
    title: 'Heritage & Legacy',
    description: 'Recording ancestral stories and organizing family archives.',
    color: 'bg-secondary-container text-secondary',
    image: '/images/neev_role_elder.png',
    tasks: [
      { id: crypto.randomUUID(), text: 'Interview Grandfather', done: false },
      { id: crypto.randomUUID(), text: 'Digitize 1980s Photo Album', done: false },
      { id: crypto.randomUUID(), text: 'Write Family Recipe Book', done: false },
    ],
  },
  {
    title: 'Family Wellness',
    description: 'Coordinating health checkups and mindful family rituals.',
    color: 'bg-tertiary-container text-tertiary',
    image: '/images/neev_real_connection.png',
    tasks: [
      { id: crypto.randomUUID(), text: 'Annual Health Checkup', done: true },
      { id: crypto.randomUUID(), text: 'Daily Evening Walk', done: false },
      { id: crypto.randomUUID(), text: 'Weekend Meditation', done: false },
    ],
  },
];

function planIcon(title: string): React.ReactNode {
  if (title.toLowerCase().includes('education')) return <Target className="w-6 h-6" />;
  if (title.toLowerCase().includes('heritage') || title.toLowerCase().includes('legacy'))
    return <Shield className="w-6 h-6" />;
  if (title.toLowerCase().includes('wellness')) return <Heart className="w-6 h-6" />;
  return <Sparkles className="w-6 h-6" />;
}

export default function PlansModule() {
  const { user, familyId } = useAuth();
  const activeFamilyId = familyId || user?.uid || 'default';

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState<Record<string, string>>({});
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanDesc, setNewPlanDesc] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  // Real-time Firestore listener + seed on empty
  useEffect(() => {
    const col = collection(db, 'families', activeFamilyId, 'plans');
    const q = query(col, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        if (snapshot.empty && !snapshot.metadata.hasPendingWrites) {
          // Seed default plans
          try {
            for (const plan of DEFAULT_PLANS) {
              await addDoc(col, { ...plan, createdAt: serverTimestamp() });
            }
          } catch (err) {
            console.error('Error seeding plans:', err);
          }
          // onSnapshot will fire again with the seeded docs
          return;
        }

        const docs: Plan[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title ?? '',
            description: data.description ?? '',
            color: data.color ?? 'bg-primary-container text-primary',
            image: data.image ?? '/images/neev_studying_student.png',
            tasks: (data.tasks ?? []) as PlanTask[],
          };
        });
        setPlans(docs);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading plans:', error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [activeFamilyId]);

  // GSAP animation once after first load
  useEffect(() => {
    if (loading || animatedRef.current) return;
    animatedRef.current = true;
    const ctx = gsap.context(() => {
      gsap.from('.plan-card', { y: 30, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out' });
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  const toggleTask = async (plan: Plan, taskId: string) => {
    const updatedTasks = plan.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
    try {
      await updateDoc(doc(db, 'families', activeFamilyId, 'plans', plan.id), { tasks: updatedTasks });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const addTask = async (plan: Plan) => {
    const text = (newTaskText[plan.id] || '').trim();
    if (!text) return;
    const updatedTasks: PlanTask[] = [...plan.tasks, { id: crypto.randomUUID(), text, done: false }];
    try {
      await updateDoc(doc(db, 'families', activeFamilyId, 'plans', plan.id), { tasks: updatedTasks });
      setNewTaskText((prev) => ({ ...prev, [plan.id]: '' }));
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (plan: Plan, taskId: string) => {
    const updatedTasks = plan.tasks.filter((t) => t.id !== taskId);
    try {
      await updateDoc(doc(db, 'families', activeFamilyId, 'plans', plan.id), { tasks: updatedTasks });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const deletePlan = async (planId: string) => {
    try {
      await deleteDoc(doc(db, 'families', activeFamilyId, 'plans', planId));
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanTitle.trim()) return;
    try {
      await addDoc(collection(db, 'families', activeFamilyId, 'plans'), {
        title: newPlanTitle.trim(),
        description: newPlanDesc.trim(),
        color: 'bg-primary-container text-primary',
        image: '/images/neev_real_connection.png',
        tasks: [],
        createdAt: serverTimestamp(),
      });
      setNewPlanTitle('');
      setNewPlanDesc('');
      setShowAddPlan(false);
    } catch (error) {
      console.error('Error adding plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-12">
      <header className="space-y-4">
        <span className="label-md text-primary tracking-[0.4em] block uppercase">CURATED PLANS</span>
        <h1 className="font-serif text-4xl md:text-5xl">
          Your Family <span className="italic text-primary">Blueprints</span>
        </h1>
        <p className="font-sans text-on-surface-variant max-w-2xl font-light">
          Based on your goals and Google ecosystem sync, I've prepared these actionable plans to nurture your family's
          growth and legacy.
        </p>
        <div className="pt-2">
          <Button
            size="sm"
            className="bg-primary text-on-primary hover:bg-primary/90 flex items-center gap-2"
            onClick={() => setShowAddPlan((v) => !v)}
          >
            <Plus className="w-4 h-4" />
            Add Plan
          </Button>
        </div>
      </header>

      {showAddPlan && (
        <div className="bg-surface-hi rounded-2xl p-8 space-y-5 border border-surface-mid">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-text-ink">New Plan</h2>
            <button onClick={() => setShowAddPlan(false)} className="text-text-muted hover:text-text-ink transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleAddPlan} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[0.68rem] font-sans font-medium uppercase tracking-widest text-text-muted">Title *</Label>
              <Input
                value={newPlanTitle}
                onChange={(e) => setNewPlanTitle(e.target.value)}
                placeholder="e.g. Financial Literacy"
                className="bg-surface-lo border-none"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[0.68rem] font-sans font-medium uppercase tracking-widest text-text-muted">Description</Label>
              <Input
                value={newPlanDesc}
                onChange={(e) => setNewPlanDesc(e.target.value)}
                placeholder="Short description…"
                className="bg-surface-lo border-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowAddPlan(false)} className="text-text-muted">
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-on-primary hover:bg-primary/90 px-8">
                Create Plan
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isExpanded = expandedPlan === plan.id;
          const doneCount = plan.tasks.filter((t) => t.done).length;
          const progress = plan.tasks.length ? Math.round((doneCount / plan.tasks.length) * 100) : 0;

          return (
            <Card
              key={plan.id}
              className="plan-card border-none bg-surface-container-low rounded-2xl overflow-hidden group flex flex-col"
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={plan.image}
                  alt={plan.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/80 to-transparent" />
                <div
                  className={`absolute bottom-4 left-4 w-12 h-12 rounded-2xl ${plan.color} flex items-center justify-center shadow-sm`}
                >
                  {planIcon(plan.title)}
                </div>
                <button
                  onClick={() => deletePlan(plan.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <CardContent className="p-10 space-y-8 flex flex-col flex-1">
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl group-hover:text-primary transition-colors duration-500">
                    {plan.title}
                  </h3>
                  <p className="text-sm font-sans font-light text-on-surface-variant leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[0.65rem] label-md tracking-[0.1em] text-on-surface-variant/60">
                    <span>
                      {doneCount}/{plan.tasks.length} TASKS
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {!isExpanded && (
                  <div className="space-y-4">
                    <span className="label-md text-[0.6rem] tracking-[0.2em] text-primary uppercase">ACTIVE TASKS</span>
                    <ul className="space-y-3">
                      {plan.tasks.slice(0, 3).map((task) => (
                        <li
                          key={task.id}
                          className="flex items-center gap-3 text-sm font-sans font-light text-on-surface-variant"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${task.done ? 'bg-primary' : 'bg-primary/30'}`} />
                          <span className={task.done ? 'line-through opacity-50' : ''}>{task.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {isExpanded && (
                  <div className="space-y-4 flex-1">
                    <span className="label-md text-[0.6rem] tracking-[0.2em] text-primary uppercase">ALL TASKS</span>
                    <ul className="space-y-3">
                      {plan.tasks.map((task) => (
                        <li key={task.id} className="flex items-center gap-3 group/task">
                          <button
                            onClick={() => toggleTask(plan, task.id)}
                            className="shrink-0 text-primary hover:scale-110 transition-transform"
                          >
                            {task.done ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5 text-on-surface-variant/40" />
                            )}
                          </button>
                          <span
                            className={`flex-1 text-sm font-sans font-light ${
                              task.done ? 'line-through text-on-surface-variant/40' : 'text-on-surface-variant'
                            }`}
                          >
                            {task.text}
                          </span>
                          <button
                            onClick={() => deleteTask(plan, task.id)}
                            className="opacity-0 group-hover/task:opacity-100 text-on-surface-variant/40 hover:text-red-400 transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-2 pt-2">
                      <Input
                        value={newTaskText[plan.id] || ''}
                        onChange={(e) => setNewTaskText((prev) => ({ ...prev, [plan.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && addTask(plan)}
                        placeholder="Add a task…"
                        className="h-9 bg-surface-container border-none text-sm font-sans placeholder:text-on-surface-variant/40"
                      />
                      <Button
                        size="sm"
                        onClick={() => addTask(plan)}
                        disabled={!(newTaskText[plan.id] || '').trim()}
                        className="h-9 px-3 bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-30"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto text-primary label-md tracking-[0.15em] hover:text-on-surface transition-colors group/btn mt-auto"
                  onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                >
                  {isExpanded ? (
                    <>
                      COLLAPSE <ChevronUp className="w-4 h-4 transition-transform" />
                    </>
                  ) : (
                    <>
                      MANAGE PLAN{' '}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
