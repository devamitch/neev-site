import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Sparkles,
  ChevronRight,
  Plus,
  CheckCircle2,
  X,
  Edit3,
  Shield,
  BookOpen,
  Activity,
  Loader2,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import gsap from 'gsap';
import DataPreparationOverlay from '../../components/dashboard/DataPreparationOverlay';
import { fetchCalendarEvents, GCalEvent } from '../../lib/googleCalendar';
import { fetchTasks, GTask } from '../../lib/googleTasks';
import { startOfDay, endOfDay } from 'date-fns';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

type ChildCard = { id: string; name: string; initial: string; color: string; textColor: string; image: string; age: string; allergies: string; bloodGroup: string; vaccinations: any[]; medications: any[]; school: any; userNote: string };
type FamilyAlert = { id: string; text: string; icon: React.ReactNode; type: 'info' | 'warning' | 'success' };

const getWeekDays = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      date: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
      full: d,
    };
  });
};

const quickLinks = [
  { label: 'Add Task', icon: <Plus className="w-4 h-4" />, path: '/dashboard/tasks' },
  { label: 'Medical', icon: <Activity className="w-4 h-4" />, path: '/dashboard/medical' },
  { label: 'School', icon: <BookOpen className="w-4 h-4" />, path: '/dashboard/school' },
  { label: 'Calendar', icon: <CalendarIcon className="w-4 h-4" />, path: '/dashboard/calendar' },
  { label: 'Vault', icon: <Shield className="w-4 h-4" />, path: '/dashboard/vault' },
  { label: 'Guardian', icon: <Sparkles className="w-4 h-4" />, path: '/dashboard/guidance' },
];

export default function DashboardHome() {
  const { user, googleAccessToken, refreshGoogleToken, familyId } = useAuth();
  const activeFamilyId = familyId || user?.uid || 'default';
  const navigate = useNavigate();
  const firstName = user?.displayName?.split(' ')[0] || 'User';
  const containerRef = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [children, setChildren] = useState<ChildCard[]>([]);
  const [alerts, setAlerts] = useState<FamilyAlert[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [noteEditIndex, setNoteEditIndex] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const weekDays = getWeekDays();
  const todayIndex = weekDays.findIndex((d) => d.isToday);

  // Load real children from Firestore
  useEffect(() => {
    const q = query(collection(db, 'families', activeFamilyId, 'children'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, userNote: '', ...d.data() } as ChildCard));
      setChildren(docs);
      // Generate dynamic alerts from children data
      const generated: FamilyAlert[] = [];
      docs.forEach(child => {
        const pendingVaccines = (child.vaccinations || []).filter((v: any) => !v.done);
        if (pendingVaccines.length > 0) {
          generated.push({ id: `vax-${child.id}`, text: `${child.name} has ${pendingVaccines.length} pending vaccination${pendingVaccines.length > 1 ? 's' : ''}`, icon: <Activity className="w-4 h-4" />, type: 'warning' });
        }
        if (child.allergies && child.allergies !== 'None') {
          generated.push({ id: `allergy-${child.id}`, text: `${child.name} — allergy alert: ${child.allergies}`, icon: <Shield className="w-4 h-4" />, type: 'info' });
        }
        if ((child.medications || []).length > 0) {
          generated.push({ id: `med-${child.id}`, text: `${child.name} is on ${child.medications.length} active medication${child.medications.length > 1 ? 's' : ''}`, icon: <Activity className="w-4 h-4" />, type: 'info' });
        }
      });
      setAlerts(generated.slice(0, 4));
    });
    return () => unsub();
  }, [activeFamilyId]);

  // Real Google data
  const [todayEvents, setTodayEvents] = useState<GCalEvent[]>([]);
  const [googleTasks, setGoogleTasks] = useState<GTask[]>([]);
  const [googleDataLoading, setGoogleDataLoading] = useState(false);

  useEffect(() => {
    if (!googleAccessToken) return;
    setGoogleDataLoading(true);
    const today = new Date();
    Promise.all([
      fetchCalendarEvents(googleAccessToken, startOfDay(today), endOfDay(today)),
      fetchTasks(googleAccessToken),
    ])
      .then(([events, gtasks]) => {
        setTodayEvents(events);
        setGoogleTasks(gtasks.filter((t) => t.status === 'needsAction'));
      })
      .catch(async (err) => {
        if (err.status === 401) {
          const token = await refreshGoogleToken();
          if (token) {
            const today2 = new Date();
            const [events, gtasks] = await Promise.all([
              fetchCalendarEvents(token, startOfDay(today2), endOfDay(today2)),
              fetchTasks(token),
            ]);
            setTodayEvents(events);
            setGoogleTasks(gtasks.filter((t) => t.status === 'needsAction'));
          }
        }
      })
      .finally(() => setGoogleDataLoading(false));
  }, [googleAccessToken]);

  useEffect(() => {
    const hasSeenOverlay = localStorage.getItem('neev_overlay_seen');
    if (!hasSeenOverlay) setShowOverlay(true);
    setSelectedDay(todayIndex);
  }, []);

  const handleOverlayComplete = () => {
    setShowOverlay(false);
    localStorage.setItem('neev_overlay_seen', 'true');
  };

  useEffect(() => {
    if (!showOverlay) {
      const ctx = gsap.context(() => {
        gsap.from('.dashboard-card', { y: 30, opacity: 0, stagger: 0.1, duration: 1.2, ease: 'expo.out' });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [showOverlay]);

  const saveNote = (index: number) => {
    setChildren((prev) => prev.map((c, i) => i === index ? { ...c, userNote: noteInput } : c));
    setNoteEditIndex(null);
    setNoteInput('');
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const activeTaskCount = googleTasks.length;
  const pendingVaccineCount = children.reduce((sum: number, c: ChildCard) => sum + (c.vaccinations || []).filter((v: any) => !v.done).length, 0);

  return (
    <>
      <AnimatePresence>
        {showOverlay && <DataPreparationOverlay onComplete={handleOverlayComplete} />}
      </AnimatePresence>

      <div ref={containerRef} className={`space-y-12 ${showOverlay ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}`}>

        {/* Guardian Brief Card */}
        <div className="dashboard-card">
          <Card className="relative overflow-hidden border-none bg-on-surface text-surface-container-lowest rounded-2xl p-6 md:p-10 lg:p-14">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-10">
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="label-md text-[0.65rem] tracking-[0.4em] text-primary uppercase">
                    GUARDIAN BRIEF · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-tight">
                  "Good morning, {firstName}. You have{' '}
                  <span className="italic text-primary">{activeTaskCount} active task{activeTaskCount !== 1 ? 's' : ''}</span>
                  {children.length > 0 && <> and <span className="italic">{children.length} child{children.length !== 1 ? 'ren' : ''}</span> to look after</>}."
                </h2>
                <p className="font-sans text-surface-container-lowest/60 font-light text-lg leading-relaxed max-w-xl">
                  {todayEvents.length > 0
                    ? `You have ${todayEvents.length} event${todayEvents.length !== 1 ? 's' : ''} on your calendar today.${pendingVaccineCount > 0 ? ` ${pendingVaccineCount} vaccine${pendingVaccineCount !== 1 ? 's' : ''} pending across your children.` : ''}`
                    : pendingVaccineCount > 0
                    ? `${pendingVaccineCount} vaccination${pendingVaccineCount !== 1 ? 's' : ''} pending across your children. Check the Medical tab.`
                    : 'Your family is all caught up. A calm day — enjoy it.'}
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                {/* Stat pills */}
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest/10 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-sans">{activeTaskCount} Active Tasks</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest/10 rounded-xl">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-sm font-sans">{pendingVaccineCount} Vaccines Pending</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard/guardian')}
                  className="bg-surface-container-lowest/10 border-none text-surface-container-lowest hover:bg-surface-container-lowest/20 px-10 py-8 rounded-md label-md tracking-[0.2em] transition-all active:scale-95"
                >
                  TALK TO GUARDIAN
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Family Alerts */}
        {alerts.length > 0 && (
          <div className="dashboard-card space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl border ${
                  alert.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                  alert.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                  'bg-primary-container/30 border-primary/20 text-on-surface'
                }`}
              >
                <div className="shrink-0">{alert.icon}</div>
                <p className="flex-1 text-sm font-sans">{alert.text}</p>
                <button onClick={() => dismissAlert(alert.id)} className="shrink-0 opacity-40 hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {quickLinks.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-2 px-5 py-3 bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface-variant rounded-xl whitespace-nowrap text-sm font-sans font-medium transition-all duration-300 active:scale-95 shrink-0"
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Calendar + Tasks */}
          <div className="lg:col-span-2 space-y-12">
            <section className="dashboard-card space-y-8">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <span className="label-md text-primary tracking-[0.3em] block uppercase text-[0.7rem]">GOOGLE SYNC</span>
                  <h3 className="font-serif text-4xl">
                    {selectedDay !== null && weekDays[selectedDay]
                      ? weekDays[selectedDay].full.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                      : 'Integrated Calendar'}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard/calendar')}
                  className="text-primary label-md tracking-[0.15em] hover:bg-primary/5 px-4"
                >
                  OPEN CALENDAR <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              {/* Dynamic Calendar Strip */}
              <div className="flex gap-5 overflow-x-auto no-scrollbar pb-6">
                {weekDays.map((day, i) => (
                  <button
                    key={day.label}
                    onClick={() => setSelectedDay(i)}
                    className={`shrink-0 w-24 h-32 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-500 group relative ${
                      selectedDay === i
                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/30 scale-105'
                        : day.isToday
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/30'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-mid'
                    }`}
                  >
                    <span className={`label-md text-[0.65rem] tracking-[0.15em] transition-opacity duration-500 ${selectedDay === i ? 'opacity-80' : 'opacity-50'}`}>
                      {day.label}
                    </span>
                    <span className="font-serif text-3xl">{day.date}</span>
                    {day.isToday && (
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedDay === i ? 'bg-on-primary' : 'bg-primary'}`} />
                    )}
                  </button>
                ))}
              </div>

              {/* Today's events + active tasks */}
              <div className="space-y-5">
                {googleDataLoading ? (
                  <div className="flex items-center gap-3 p-8 text-on-surface-variant/60">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-sans text-sm">Loading from Google…</span>
                  </div>
                ) : !googleAccessToken ? (
                  <div className="p-8 rounded-2xl border-2 border-dashed border-outline-variant/30 text-center space-y-3">
                    <p className="text-sm font-sans text-on-surface-variant/60">Connect Google to see today's real events and tasks.</p>
                    <Button size="sm" onClick={() => navigate('/google-connect')} className="bg-primary text-on-primary hover:bg-primary/90">
                      Connect Google
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Today's calendar events */}
                    {todayEvents.length > 0 && (
                      <div className="space-y-3">
                        <span className="label-md text-[0.65rem] tracking-[0.25em] text-primary uppercase font-bold">Today's Events</span>
                        {todayEvents.slice(0, 3).map((ev) => {
                          const startTime = ev.start.dateTime
                            ? new Date(ev.start.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                            : 'All day';
                          const endTime = ev.end.dateTime
                            ? new Date(ev.end.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                            : '';
                          return (
                            <Card
                              key={ev.id}
                              className="group border-none bg-surface-container-low hover:bg-surface-container-mid transition-all duration-700 rounded-2xl p-6 cursor-pointer relative overflow-hidden"
                              onClick={() => navigate('/dashboard/calendar')}
                            >
                              <div className="flex items-center gap-6 relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shrink-0">
                                  <CalendarIcon className="w-5 h-5" />
                                </div>
                                <div className="space-y-1 flex-1 min-w-0">
                                  <h4 className="font-serif text-xl group-hover:text-primary transition-colors duration-500 truncate">{ev.summary || '(No title)'}</h4>
                                  <div className="flex items-center gap-3 text-sm text-on-surface-variant/60 font-light">
                                    <span>{startTime}{endTime ? ` – ${endTime}` : ''}</span>
                                    {ev.location && (
                                      <>
                                        <span className="w-1 h-1 rounded-full bg-outline-variant/30" />
                                        <span className="truncate">{ev.location}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <span className="label-md text-[0.6rem] tracking-[0.15em] text-primary uppercase shrink-0">Google Cal</span>
                              </div>
                              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </Card>
                          );
                        })}
                      </div>
                    )}

                    {/* Active Google Tasks */}
                    {googleTasks.length > 0 && (
                      <div className="space-y-3">
                        <span className="label-md text-[0.65rem] tracking-[0.25em] text-primary uppercase font-bold">Active Tasks</span>
                        {googleTasks.slice(0, 3).map((task) => (
                          <Card
                            key={task.id}
                            className="group border-none bg-surface-container-low hover:bg-surface-container-mid transition-all duration-700 rounded-2xl p-6 cursor-pointer relative overflow-hidden"
                            onClick={() => navigate('/dashboard/tasks')}
                          >
                            <div className="flex items-center gap-6 relative z-10">
                              <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shrink-0">
                                <Circle className="w-5 h-5" />
                              </div>
                              <div className="space-y-1 flex-1 min-w-0">
                                <h4 className="font-serif text-xl group-hover:text-primary transition-colors duration-500 truncate">{task.title}</h4>
                                {task.due && (
                                  <p className="text-sm text-on-surface-variant/60 font-light">
                                    Due {new Date(task.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </p>
                                )}
                              </div>
                              <span className="label-md text-[0.6rem] tracking-[0.15em] text-primary uppercase shrink-0">Google Tasks</span>
                            </div>
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          </Card>
                        ))}
                      </div>
                    )}

                    {todayEvents.length === 0 && googleTasks.length === 0 && (
                      <div className="p-8 rounded-2xl border-2 border-dashed border-outline-variant/30 text-center">
                        <p className="text-sm font-sans text-on-surface-variant/60">Nothing scheduled for today. Enjoy the calm.</p>
                      </div>
                    )}
                  </>
                )}

                {/* Add task quick action */}
                <button
                  onClick={() => navigate('/dashboard/tasks')}
                  className="w-full flex items-center gap-4 p-6 rounded-2xl border-2 border-dashed border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 text-on-surface-variant/50 hover:text-primary transition-all duration-500 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-low group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-sans text-sm font-medium tracking-wide">Add a task for today</span>
                </button>
              </div>
            </section>
          </div>

          {/* Right: Children & Family Card */}
          <div className="space-y-12">
            <section className="dashboard-card space-y-8">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <span className="label-md text-primary tracking-[0.3em] block uppercase text-[0.7rem]">CHILDREN'S PROGRESS</span>
                  <h3 className="font-serif text-4xl">Daily Growth</h3>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard/children')}
                  className="text-primary label-md tracking-[0.15em] hover:bg-primary/5 px-4 text-[0.65rem]"
                >
                  ALL <ChevronRight className="ml-1 w-3 h-3" />
                </Button>
              </div>

              <div className="space-y-6">
                {children.length === 0 && (
                  <div className="p-8 rounded-2xl border-2 border-dashed border-outline-variant/30 text-center">
                    <p className="text-sm font-sans text-on-surface-variant/60">No children added yet.</p>
                    <Button size="sm" onClick={() => navigate('/dashboard/children')} className="mt-3 bg-primary text-on-primary hover:bg-primary/90">Add Child</Button>
                  </div>
                )}
                {children.map((child, i) => {
                  const pendingVax = (child.vaccinations || []).filter((v: any) => !v.done).length;
                  return (
                    <Card key={child.id} className="border-none bg-surface-container-low p-6 md:p-8 rounded-2xl hover:bg-surface-container-mid transition-all duration-700 group cursor-pointer" onClick={() => navigate('/dashboard/children')}>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-14 h-14 rounded-2xl group-hover:scale-105 transition-transform duration-700">
                            <AvatarImage src={child.image} className="object-cover" />
                            <AvatarFallback className={child.color || 'bg-primary-container text-primary'}>{child.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5 flex-1">
                            <h4 className="font-serif text-xl group-hover:text-primary transition-colors duration-500">{child.name}</h4>
                            <p className="text-xs text-on-surface-variant/60 font-light">{child.age || 'Age not set'}{child.bloodGroup ? ` · ${child.bloodGroup}` : ''}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {pendingVax > 0 && (
                            <span className="text-[0.65rem] px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-sans font-semibold uppercase tracking-wider">{pendingVax} vaccine{pendingVax > 1 ? 's' : ''} pending</span>
                          )}
                          {child.allergies && child.allergies !== 'None' && (
                            <span className="text-[0.65rem] px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-sans font-semibold uppercase tracking-wider">⚠ {child.allergies}</span>
                          )}
                          {(child.medications || []).length > 0 && (
                            <span className="text-[0.65rem] px-2.5 py-1 rounded-full bg-primary-container/60 text-primary font-sans font-semibold uppercase tracking-wider">{child.medications.length} medication{child.medications.length > 1 ? 's' : ''}</span>
                          )}
                        </div>
                        {/* Note section */}
                        {noteEditIndex === i ? (
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Input
                              autoFocus
                              value={noteInput}
                              onChange={(e) => setNoteInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && saveNote(i)}
                              placeholder="Add a note…"
                              className="h-8 text-xs bg-surface-container border-outline-variant/30"
                            />
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); saveNote(i); }} className="h-8 px-3 bg-primary text-on-primary hover:bg-primary/90">Save</Button>
                            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setNoteEditIndex(null); }} className="h-8 px-2"><X className="w-3 h-3" /></Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-[0.7rem] font-sans font-light text-on-surface-variant italic">{child.userNote || (child.school?.name ? `School: ${child.school.name}` : 'No notes yet')}</span>
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setNoteInput(child.userNote); setNoteEditIndex(i); }} className="h-7 text-[0.6rem] tracking-widest text-primary hover:bg-primary/5 px-2 uppercase flex items-center gap-1">
                              <Edit3 className="w-3 h-3" />
                              {child.userNote ? 'EDIT' : 'NOTE'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Shared Ecosystem / Family Photo Card */}
            <div className="dashboard-card">
              <Card className="border-none bg-on-surface rounded-2xl overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src="/images/neev_role_father.png"
                    alt="Family together"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-on-surface/80 to-transparent" />
                </div>
                <div className="p-6 md:p-8 space-y-4 text-surface-container-lowest">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-px bg-primary" />
                    <span className="label-md text-[0.7rem] tracking-[0.3em] text-primary uppercase font-bold">LEGACY VAULT</span>
                  </div>
                  <p className="font-serif italic text-xl md:text-2xl leading-relaxed">
                    "Preserve what matters. Photos, documents, memories, and milestones — all in one family vault, forever."
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/dashboard/vault')}
                      className="p-0 text-primary label-md tracking-[0.15em] h-auto uppercase text-[0.7rem] font-bold hover:opacity-80"
                    >
                      OPEN VAULT <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/dashboard/subscription')}
                      className="p-0 text-surface-container-lowest/50 label-md tracking-[0.15em] h-auto uppercase text-[0.7rem] font-bold hover:text-surface-container-lowest transition-colors"
                    >
                      UPGRADE PLAN
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
