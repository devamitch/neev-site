import React, { useEffect, useState } from 'react';
import {
  BookOpen, Plus, X, Check, Clock, AlertTriangle, Loader2,
  GraduationCap, CalendarDays, User, Phone, Mail, ChevronDown, ChevronUp, Star,
} from 'lucide-react';
import { ModuleSkeleton } from '../../components/dashboard/ModuleSkeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import {
  collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore';

type Child = {
  id: string;
  name: string;
  initial: string;
  color: string;
  textColor: string;
  school: { name: string; grade: string; teacher: string; teacherEmail: string; teacherPhone: string; section: string };
};

type Homework = {
  id: string;
  childId: string;
  childName: string;
  subject: string;
  title: string;
  dueDate: string;
  done: boolean;
  priority: 'high' | 'medium' | 'low';
};

type Exam = {
  id: string;
  childId: string;
  childName: string;
  subject: string;
  date: string;
  time: string;
  grade: string;
  notes: string;
  done: boolean;
};

const SUBJECTS = ['Math', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer', 'Art', 'PE', 'Other'];
const PRIORITIES: { val: Homework['priority']; label: string; color: string }[] = [
  { val: 'high', label: 'High', color: 'bg-red-100 text-red-700' },
  { val: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-700' },
  { val: 'low', label: 'Low', color: 'bg-green-100 text-green-700' },
];

export default function SchoolModule() {
  const { user, familyId } = useAuth();
  const activeFamilyId = familyId || user?.uid || 'default';

  const [children, setChildren] = useState<Child[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'homework' | 'exams' | 'teachers'>('homework');
  const [expandedChild, setExpandedChild] = useState<string | null>(null);

  // Homework form
  const [showHWForm, setShowHWForm] = useState(false);
  const [hwForm, setHwForm] = useState({ childId: '', subject: 'Math', title: '', dueDate: '', priority: 'medium' as Homework['priority'] });
  const [savingHW, setSavingHW] = useState(false);

  // Exam form
  const [showExamForm, setShowExamForm] = useState(false);
  const [examForm, setExamForm] = useState({ childId: '', subject: 'Math', date: '', time: '', notes: '' });
  const [savingExam, setSavingExam] = useState(false);

  useEffect(() => {
    const childQ = query(collection(db, 'families', activeFamilyId, 'children'), orderBy('createdAt', 'asc'));
    const unsubChildren = onSnapshot(childQ, (snap) => {
      setChildren(snap.docs.map(d => ({ id: d.id, ...d.data() } as Child)));
      setLoading(false);
    }, () => setLoading(false));

    const hwQ = query(collection(db, 'families', activeFamilyId, 'homework'), orderBy('dueDate', 'asc'));
    const unsubHW = onSnapshot(hwQ, (snap) => {
      setHomework(snap.docs.map(d => ({ id: d.id, ...d.data() } as Homework)));
    });

    const examQ = query(collection(db, 'families', activeFamilyId, 'exams'), orderBy('date', 'asc'));
    const unsubExam = onSnapshot(examQ, (snap) => {
      setExams(snap.docs.map(d => ({ id: d.id, ...d.data() } as Exam)));
    });

    return () => { unsubChildren(); unsubHW(); unsubExam(); };
  }, [activeFamilyId]);

  const handleAddHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwForm.childId || !hwForm.title) return;
    setSavingHW(true);
    const child = children.find(c => c.id === hwForm.childId);
    await addDoc(collection(db, 'families', activeFamilyId, 'homework'), {
      ...hwForm, childName: child?.name || '', done: false, createdAt: serverTimestamp(),
    });
    setHwForm({ childId: '', subject: 'Math', title: '', dueDate: '', priority: 'medium' });
    setShowHWForm(false);
    setSavingHW(false);
  };

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.childId || !examForm.date) return;
    setSavingExam(true);
    const child = children.find(c => c.id === examForm.childId);
    await addDoc(collection(db, 'families', activeFamilyId, 'exams'), {
      ...examForm, childName: child?.name || '', grade: '', done: false, createdAt: serverTimestamp(),
    });
    setExamForm({ childId: '', subject: 'Math', date: '', time: '', notes: '' });
    setShowExamForm(false);
    setSavingExam(false);
  };

  const handleToggleHW = async (hw: Homework) => {
    await updateDoc(doc(db, 'families', activeFamilyId, 'homework', hw.id), { done: !hw.done });
  };

  const handleDeleteHW = async (id: string) => {
    await deleteDoc(doc(db, 'families', activeFamilyId, 'homework', id));
  };

  const handleSetGrade = async (exam: Exam, grade: string) => {
    await updateDoc(doc(db, 'families', activeFamilyId, 'exams', exam.id), { grade, done: true });
  };

  const handleDeleteExam = async (id: string) => {
    await deleteDoc(doc(db, 'families', activeFamilyId, 'exams', id));
  };

  if (loading) return <ModuleSkeleton />;

  const today = new Date().toISOString().slice(0, 10);
  const pendingHW = homework.filter(h => !h.done);
  const overdueHW = pendingHW.filter(h => h.dueDate && h.dueDate < today);
  const upcomingExams = exams.filter(e => !e.done && e.date >= today);

  return (
    <div className="max-w-[1160px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-text-ink mb-1">Academic Engine</h1>
          <p className="text-sm text-text-muted font-sans font-light">Academic performance, attendance, and faculty coordination.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowHWForm(v => !v)} size="sm" variant="outline" className="flex items-center gap-2 border-primary text-primary hover:bg-primary/5">
            <BookOpen className="w-4 h-4" /> Add Homework
          </Button>
          <Button onClick={() => setShowExamForm(v => !v)} size="sm" className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90">
            <CalendarDays className="w-4 h-4" /> Add Exam
          </Button>
        </div>
      </div>

      {/* Alert banner */}
      {(overdueHW.length > 0 || upcomingExams.length > 0) && (
        <div className="mb-6 flex flex-wrap gap-3">
          {overdueHW.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-sm font-medium text-red-800">{overdueHW.length} overdue assignment{overdueHW.length > 1 ? 's' : ''}</span>
            </div>
          )}
          {upcomingExams.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
              <GraduationCap className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-sm font-medium text-blue-800">{upcomingExams.length} upcoming exam{upcomingExams.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pending Tasks', val: pendingHW.length, icon: BookOpen, color: 'text-primary' },
          { label: 'Overdue', val: overdueHW.length, icon: AlertTriangle, color: 'text-red-500' },
          { label: 'Upcoming Exams', val: upcomingExams.length, icon: GraduationCap, color: 'text-blue-500' },
          { label: 'Completed HW', val: homework.filter(h => h.done).length, icon: Check, color: 'text-green-500' },
        ].map(({ label, val, icon: Icon, color }) => (
          <Card key={label} className="p-4 bg-surface-hi border-none rounded-xl">
            <Icon className={`w-5 h-5 mb-2 ${color}`} />
            <p className="text-2xl font-serif text-text-ink">{val}</p>
            <p className="text-xs text-text-muted font-sans">{label}</p>
          </Card>
        ))}
      </div>

      {/* Homework form */}
      {showHWForm && (
        <Card className="mb-6 p-6 border-none bg-surface-hi rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-text-ink">Add Homework</h2>
            <button onClick={() => setShowHWForm(false)}><X className="w-5 h-5 text-text-muted" /></button>
          </div>
          <form onSubmit={handleAddHomework} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Child *</Label>
              <select value={hwForm.childId} onChange={e => setHwForm(f => ({...f, childId: e.target.value}))}
                className="w-full h-10 px-3 bg-surface-lo border-none rounded-md text-sm text-text-ink" required>
                <option value="">Select child…</option>
                {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Subject</Label>
              <select value={hwForm.subject} onChange={e => setHwForm(f => ({...f, subject: e.target.value}))}
                className="w-full h-10 px-3 bg-surface-lo border-none rounded-md text-sm text-text-ink">
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Assignment *</Label>
              <Input value={hwForm.title} onChange={e => setHwForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Chapter 5 exercises, Science project…" className="bg-surface-lo border-none" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Due Date</Label>
              <Input type="date" value={hwForm.dueDate} onChange={e => setHwForm(f => ({...f, dueDate: e.target.value}))} className="bg-surface-lo border-none" />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Priority</Label>
              <div className="flex gap-2">
                {PRIORITIES.map(p => (
                  <button key={p.val} type="button" onClick={() => setHwForm(f => ({...f, priority: p.val}))}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${hwForm.priority === p.val ? p.color + ' ring-2 ring-offset-1 ring-current' : 'bg-surface-lo text-text-muted'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
              <Button type="button" variant="ghost" onClick={() => setShowHWForm(false)}>Cancel</Button>
              <Button type="submit" disabled={savingHW} className="bg-primary text-on-primary px-8">
                {savingHW ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Add
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Exam form */}
      {showExamForm && (
        <Card className="mb-6 p-6 border-none bg-surface-hi rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-text-ink">Add Exam / Test</h2>
            <button onClick={() => setShowExamForm(false)}><X className="w-5 h-5 text-text-muted" /></button>
          </div>
          <form onSubmit={handleAddExam} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Child *</Label>
              <select value={examForm.childId} onChange={e => setExamForm(f => ({...f, childId: e.target.value}))}
                className="w-full h-10 px-3 bg-surface-lo border-none rounded-md text-sm text-text-ink" required>
                <option value="">Select child…</option>
                {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Subject</Label>
              <select value={examForm.subject} onChange={e => setExamForm(f => ({...f, subject: e.target.value}))}
                className="w-full h-10 px-3 bg-surface-lo border-none rounded-md text-sm text-text-ink">
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Date *</Label>
              <Input type="date" value={examForm.date} onChange={e => setExamForm(f => ({...f, date: e.target.value}))} className="bg-surface-lo border-none" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Time</Label>
              <Input type="time" value={examForm.time} onChange={e => setExamForm(f => ({...f, time: e.target.value}))} className="bg-surface-lo border-none" />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Notes / Syllabus</Label>
              <Input value={examForm.notes} onChange={e => setExamForm(f => ({...f, notes: e.target.value}))} placeholder="Chapters, topics covered…" className="bg-surface-lo border-none" />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
              <Button type="button" variant="ghost" onClick={() => setShowExamForm(false)}>Cancel</Button>
              <Button type="submit" disabled={savingExam} className="bg-primary text-on-primary px-8">
                {savingExam ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Add Exam
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-surface-lo rounded-xl w-fit">
        {(['homework', 'exams', 'teachers'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-sans font-semibold uppercase tracking-wider transition-colors ${activeTab === tab ? 'bg-surface-hi text-text-ink shadow-sm' : 'text-text-muted hover:text-text-ink'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Homework tab */}
      {activeTab === 'homework' && (
        <div>
          {/* Group by child */}
          {children.map(child => {
            const childHW = homework.filter(h => h.childId === child.id);
            if (childHW.length === 0) return null;
            return (
              <div key={child.id} className="mb-8">
                <h3 className="font-serif text-lg text-text-ink mb-3 flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-full ${child.color} ${child.textColor} flex items-center justify-center text-sm font-serif`}>{child.initial}</span>
                  {child.name}
                </h3>
                <div className="space-y-2">
                  {childHW.map(hw => {
                    const priority = PRIORITIES.find(p => p.val === hw.priority);
                    const isOverdue = !hw.done && hw.dueDate && hw.dueDate < today;
                    return (
                      <div key={hw.id} className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${hw.done ? 'bg-surface-lo opacity-60' : isOverdue ? 'bg-red-50 border border-red-200' : 'bg-surface-hi border border-outline-variant/20'}`}>
                        <button onClick={() => handleToggleHW(hw)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${hw.done ? 'bg-green-500 border-green-500 text-white' : isOverdue ? 'border-red-400 hover:border-red-600' : 'border-text-muted hover:border-primary'}`}>
                          {hw.done && <Check className="w-3.5 h-3.5" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm font-medium ${hw.done ? 'line-through text-text-muted' : isOverdue ? 'text-red-800' : 'text-text-ink'}`}>{hw.title}</span>
                            <span className="text-[0.6rem] px-1.5 py-0.5 rounded-full bg-surface-lo text-text-muted">{hw.subject}</span>
                            {priority && <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-full ${priority.color}`}>{priority.label}</span>}
                          </div>
                          {hw.dueDate && <p className={`text-xs mt-0.5 ${isOverdue ? 'text-red-600 font-semibold' : 'text-text-muted'}`}>Due: {hw.dueDate}{isOverdue ? ' — OVERDUE' : ''}</p>}
                        </div>
                        <button onClick={() => handleDeleteHW(hw.id)} className="text-text-muted hover:text-red-500 shrink-0">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {homework.length === 0 && (
            <div className="text-center py-16 text-text-muted">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No homework tracked yet.</p>
              <button onClick={() => setShowHWForm(true)} className="mt-3 text-sm text-primary hover:underline">Add one now</button>
            </div>
          )}
        </div>
      )}

      {/* Exams tab */}
      {activeTab === 'exams' && (
        <div>
          {children.map(child => {
            const childExams = exams.filter(e => e.childId === child.id);
            if (childExams.length === 0) return null;
            return (
              <div key={child.id} className="mb-8">
                <h3 className="font-serif text-lg text-text-ink mb-3 flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-full ${child.color} ${child.textColor} flex items-center justify-center text-sm font-serif`}>{child.initial}</span>
                  {child.name}
                </h3>
                <div className="space-y-3">
                  {childExams.map(exam => (
                    <div key={exam.id} className={`flex items-start gap-4 p-4 rounded-xl ${exam.done ? 'bg-surface-lo opacity-70' : exam.date < today ? 'bg-amber-50 border border-amber-200' : 'bg-surface-hi border border-outline-variant/20'}`}>
                      <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 text-center ${exam.done ? 'bg-green-100' : 'bg-blue-100'}`}>
                        <span className="text-[0.55rem] font-bold text-blue-600 uppercase">{exam.date ? new Date(exam.date).toLocaleString('en', { month: 'short' }) : ''}</span>
                        <span className="text-sm font-bold text-blue-800">{exam.date ? new Date(exam.date).getDate() : ''}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-ink">{exam.subject} {exam.done ? '— Done' : ''}</p>
                        <p className="text-xs text-text-muted">{exam.time ? `${exam.time} · ` : ''}{exam.childName}</p>
                        {exam.notes && <p className="text-xs text-text-muted mt-0.5 italic">{exam.notes}</p>}
                        {exam.done && exam.grade && (
                          <div className="mt-1 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-sm font-bold text-amber-700">Grade: {exam.grade}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        {!exam.done && (
                          <div className="flex gap-1">
                            <Input
                              placeholder="Grade"
                              className="h-7 w-20 text-xs bg-surface-lo border-none"
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSetGrade(exam, (e.target as HTMLInputElement).value); }}
                            />
                          </div>
                        )}
                        <button onClick={() => handleDeleteExam(exam.id)} className="text-text-muted hover:text-red-500 self-end">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {exams.length === 0 && (
            <div className="text-center py-16 text-text-muted">
              <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No exams tracked yet.</p>
              <button onClick={() => setShowExamForm(true)} className="mt-3 text-sm text-primary hover:underline">Add one now</button>
            </div>
          )}
        </div>
      )}

      {/* Teachers tab */}
      {activeTab === 'teachers' && (
        <div className="space-y-4">
          {children.length === 0 ? (
            <div className="text-center py-16 text-text-muted">
              <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Add children first from the Children module.</p>
            </div>
          ) : children.map(child => (
            <Card key={child.id} className="bg-surface-hi border-none rounded-xl">
              <button onClick={() => setExpandedChild(v => v === child.id ? null : child.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-surface-lo/50 transition-colors rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${child.color} ${child.textColor} flex items-center justify-center font-serif text-lg`}>{child.initial}</div>
                  <div>
                    <p className="font-serif text-lg text-text-ink">{child.name}</p>
                    <p className="text-xs text-text-muted">{child.school?.name || 'School not set'}</p>
                  </div>
                </div>
                {expandedChild === child.id ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
              </button>
              {expandedChild === child.id && (
                <div className="px-5 pb-5 border-t border-outline-variant/20">
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {[
                      { label: 'School', val: child.school?.name || '—', span: true },
                      { label: 'Grade', val: child.school?.grade || '—', span: false },
                      { label: 'Section', val: child.school?.section || '—', span: false },
                      { label: 'Class Teacher', val: child.school?.teacher || '—', span: true },
                      { label: 'Teacher Phone', val: child.school?.teacherPhone || '—', span: false },
                      { label: 'Teacher Email', val: child.school?.teacherEmail || '—', span: false },
                    ].map(({ label, val, span }) => (
                      <div key={label} className={`p-3 rounded-lg bg-surface-lo ${span ? 'col-span-2' : ''}`}>
                        <p className="text-[0.6rem] text-text-muted uppercase tracking-wide">{label}</p>
                        <p className="text-sm font-medium text-text-ink">{val}</p>
                      </div>
                    ))}
                  </div>
                  {child.school?.teacherPhone && (
                    <div className="flex gap-3 mt-3">
                      <a href={`tel:${child.school.teacherPhone}`} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary/90">
                        <Phone className="w-3.5 h-3.5" /> Call Teacher
                      </a>
                      {child.school?.teacherEmail && (
                        <a href={`mailto:${child.school.teacherEmail}`} className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg text-xs font-semibold hover:bg-primary/5">
                          <Mail className="w-3.5 h-3.5" /> Email Teacher
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
