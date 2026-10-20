import React, { useEffect, useRef, useState } from 'react';
import {
  Heart, Activity, Clock, Plus, X, Trash2, Loader2, Phone,
  School, Syringe, Pill, AlertTriangle, ChevronDown, ChevronUp,
  TrendingUp, User, Check
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChildCardSkeleton } from '../../components/dashboard/ModuleSkeleton';
import gsap from 'gsap';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import {
  collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc,
  serverTimestamp, query, orderBy, arrayUnion,
} from 'firebase/firestore';

type Milestone = { date: string; event: string; type: string };
type Vaccine = { name: string; date: string; due: string; done: boolean };
type GrowthEntry = { date: string; heightCm: number; weightKg: number };
type EmergencyContact = { name: string; relation: string; phone: string };
type Medication = { name: string; dose: string; frequency: string; note: string };

type Child = {
  id: string;
  name: string;
  dob: string;
  age: string;
  grade: string;
  initial: string;
  color: string;
  textColor: string;
  image: string;
  bloodGroup: string;
  allergies: string;
  milestones: Milestone[];
  health: { lastCheckup: string; nextVaccine: string; allergies: string; doctorName: string; doctorPhone: string; insuranceId: string };
  vaccinations: Vaccine[];
  medications: Medication[];
  growthEntries: GrowthEntry[];
  school: { name: string; grade: string; teacher: string; teacherEmail: string; teacherPhone: string; section: string };
  emergencyContacts: EmergencyContact[];
};

const ROLE_IMAGES = [
  '/images/neev_role_child.png',
  '/images/neev_schooling_kids.png',
  '/images/neev_college_students.png',
  '/images/neev_studying_student.png',
];

const COLORS = [
  { color: 'bg-primary-container', textColor: 'text-primary' },
  { color: 'bg-secondary-container', textColor: 'text-secondary' },
  { color: 'bg-tertiary-container', textColor: 'text-tertiary' },
  { color: 'bg-sage-pale', textColor: 'text-sage-dim' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

const DEFAULT_VACCINES: Vaccine[] = [
  { name: 'BCG', date: '', due: 'At birth', done: false },
  { name: 'Hepatitis B (1st)', date: '', due: 'At birth', done: false },
  { name: 'OPV (1st)', date: '', due: '6 weeks', done: false },
  { name: 'DPT (1st)', date: '', due: '6 weeks', done: false },
  { name: 'Hib (1st)', date: '', due: '6 weeks', done: false },
  { name: 'MMR (1st)', date: '', due: '9 months', done: false },
  { name: 'Typhoid', date: '', due: '2 years', done: false },
  { name: 'Varicella', date: '', due: '15 months', done: false },
];

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <h3 className="flex items-center gap-2 text-[0.72rem] font-sans font-bold uppercase tracking-widest text-text-muted mb-3">
      <Icon className="w-4 h-4" /> {label}
    </h3>
  );
}

function ChildCard({ child, familyId }: { child: Child; familyId: string }) {
  const [expanded, setExpanded] = useState<string>('health');
  const [editing, setEditing] = useState<string | null>(null);
  const [vaccineUpdating, setVaccineUpdating] = useState<string | null>(null);

  // Milestone form
  const [milestoneEvent, setMilestoneEvent] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');

  // Growth form
  const [growthH, setGrowthH] = useState('');
  const [growthW, setGrowthW] = useState('');
  const [showGrowthForm, setShowGrowthForm] = useState(false);

  // Medication form
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('');
  const [medFreq, setMedFreq] = useState('');
  const [medNote, setMedNote] = useState('');
  const [showMedForm, setShowMedForm] = useState(false);

  // Emergency contact form
  const [ecName, setEcName] = useState('');
  const [ecRelation, setEcRelation] = useState('');
  const [ecPhone, setEcPhone] = useState('');
  const [showEcForm, setShowEcForm] = useState(false);

  const ref = (field: string) => `families/${familyId}/children/${child.id}`;

  const updateChild = (data: Partial<Child>) =>
    updateDoc(doc(db, 'families', familyId, 'children', child.id), data as any);

  const handleToggleVaccine = async (idx: number) => {
    setVaccineUpdating(String(idx));
    const updated = child.vaccinations.map((v, i) =>
      i === idx ? { ...v, done: !v.done, date: !v.done ? new Date().toLocaleDateString('en-IN') : '' } : v
    );
    await updateChild({ vaccinations: updated } as any);
    setVaccineUpdating(null);
  };

  const handleAddMilestone = async () => {
    if (!milestoneEvent.trim()) return;
    const m: Milestone = {
      date: milestoneDate || new Date().toLocaleDateString('en-IN'),
      event: milestoneEvent.trim(),
      type: 'general',
    };
    await updateChild({ milestones: [...child.milestones, m] } as any);
    setMilestoneEvent(''); setMilestoneDate('');
  };

  const handleAddGrowth = async () => {
    if (!growthH && !growthW) return;
    const g: GrowthEntry = {
      date: new Date().toLocaleDateString('en-IN'),
      heightCm: parseFloat(growthH) || 0,
      weightKg: parseFloat(growthW) || 0,
    };
    await updateChild({ growthEntries: [...(child.growthEntries || []), g] } as any);
    setGrowthH(''); setGrowthW(''); setShowGrowthForm(false);
  };

  const handleAddMedication = async () => {
    if (!medName.trim()) return;
    const m: Medication = { name: medName.trim(), dose: medDose.trim(), frequency: medFreq.trim(), note: medNote.trim() };
    await updateChild({ medications: [...(child.medications || []), m] } as any);
    setMedName(''); setMedDose(''); setMedFreq(''); setMedNote(''); setShowMedForm(false);
  };

  const handleRemoveMedication = async (idx: number) => {
    const updated = (child.medications || []).filter((_, i) => i !== idx);
    await updateChild({ medications: updated } as any);
  };

  const handleAddEmergencyContact = async () => {
    if (!ecName.trim() || !ecPhone.trim()) return;
    const c: EmergencyContact = { name: ecName.trim(), relation: ecRelation.trim(), phone: ecPhone.trim() };
    await updateChild({ emergencyContacts: [...(child.emergencyContacts || []), c] } as any);
    setEcName(''); setEcRelation(''); setEcPhone(''); setShowEcForm(false);
  };

  const handleRemoveEmergencyContact = async (idx: number) => {
    const updated = (child.emergencyContacts || []).filter((_, i) => i !== idx);
    await updateChild({ emergencyContacts: updated } as any);
  };

  const handleDeleteChild = () => {
    if (!window.confirm(`Remove ${child.name} from your family? This cannot be undone.`)) return;
    deleteDoc(doc(db, 'families', familyId, 'children', child.id));
  };

  const latestGrowth = child.growthEntries?.slice(-1)[0];
  const nextDueVaccine = child.vaccinations?.find(v => !v.done);
  const sections = ['health', 'vaccines', 'medications', 'school', 'growth', 'milestones', 'emergency'];

  const toggle = (s: string) => setExpanded(v => v === s ? '' : s);

  return (
    <Card className="bg-surface-hi border-none rounded-md overflow-hidden">
      {/* Card Image + header */}
      <div className="h-32 overflow-hidden relative">
        <img src={child.image} alt={child.name} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-linear-to-b from-black/10 to-black/50" />
        <button
          onClick={handleDeleteChild}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        {/* Blood group badge */}
        {child.bloodGroup && child.bloodGroup !== 'Unknown' && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full">
            {child.bloodGroup}
          </span>
        )}
      </div>

      <div className="p-6">
        {/* Name + avatar */}
        <div className="flex items-center gap-4 mb-5">
          <Avatar className="w-14 h-14">
            <AvatarFallback className={`${child.color} ${child.textColor} text-2xl font-serif`}>
              {child.initial}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-serif text-xl text-text-ink">{child.name}</h2>
            <p className="text-xs text-text-muted font-sans">
              {child.dob ? `Born ${child.dob} · ` : ''}{child.age}{child.grade ? ` · ${child.grade}` : ''}
            </p>
            {/* Critical allergy alert */}
            {child.allergies && child.allergies !== 'None' && (
              <div className="flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                <span className="text-[0.65rem] font-sans font-semibold text-amber-600 uppercase tracking-wide">
                  Allergic: {child.allergies}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="p-2 rounded-lg bg-surface-lo text-center">
            <p className="text-[0.58rem] text-text-muted uppercase tracking-wide">Height</p>
            <p className="text-sm font-semibold text-text-ink">{latestGrowth ? `${latestGrowth.heightCm}cm` : '—'}</p>
          </div>
          <div className="p-2 rounded-lg bg-surface-lo text-center">
            <p className="text-[0.58rem] text-text-muted uppercase tracking-wide">Weight</p>
            <p className="text-sm font-semibold text-text-ink">{latestGrowth ? `${latestGrowth.weightKg}kg` : '—'}</p>
          </div>
          <div className="p-2 rounded-lg bg-surface-lo text-center">
            <p className="text-[0.58rem] text-text-muted uppercase tracking-wide">Vaccines</p>
            <p className="text-sm font-semibold text-text-ink">
              {child.vaccinations?.filter(v => v.done).length || 0}/{child.vaccinations?.length || 0}
            </p>
          </div>
        </div>

        {/* Next vaccine alert */}
        {nextDueVaccine && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <Syringe className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-800">Next Vaccine Due</p>
              <p className="text-xs text-amber-700">{nextDueVaccine.name} — {nextDueVaccine.due}</p>
            </div>
          </div>
        )}

        {/* Accordion sections */}
        <div className="space-y-1">
          {/* Health */}
          <button onClick={() => toggle('health')} className="w-full flex items-center justify-between py-2 text-left">
            <SectionHeader icon={Activity} label="Health Overview" />
            {expanded === 'health' ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
          </button>
          {expanded === 'health' && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: 'Last Checkup', val: child.health?.lastCheckup || 'Not recorded' },
                { label: 'Doctor', val: child.health?.doctorName || 'Not set' },
                { label: 'Doctor Phone', val: child.health?.doctorPhone || '—' },
                { label: 'Insurance ID', val: child.health?.insuranceId || '—' },
                { label: 'Blood Group', val: child.bloodGroup || 'Unknown' },
                { label: 'Allergies', val: child.allergies || 'None' },
              ].map(({ label, val }) => (
                <div key={label} className="p-3 rounded-lg bg-surface-lo">
                  <p className="text-[0.6rem] text-text-muted uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-medium text-text-ink truncate">{val}</p>
                </div>
              ))}
            </div>
          )}

          {/* Vaccinations */}
          <button onClick={() => toggle('vaccines')} className="w-full flex items-center justify-between py-2 text-left">
            <SectionHeader icon={Syringe} label="Vaccination Tracker" />
            {expanded === 'vaccines' ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
          </button>
          {expanded === 'vaccines' && (
            <div className="space-y-2 mb-3">
              {(child.vaccinations || []).map((v, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${v.done ? 'bg-green-50 border border-green-200' : 'bg-surface-lo'}`}>
                  <button
                    onClick={() => handleToggleVaccine(idx)}
                    disabled={vaccineUpdating === String(idx)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${v.done ? 'bg-green-500 border-green-500 text-white' : 'border-text-muted hover:border-primary'}`}
                  >
                    {vaccineUpdating === String(idx) ? <Loader2 className="w-3 h-3 animate-spin" /> : v.done ? <Check className="w-3 h-3" /> : null}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${v.done ? 'text-green-800' : 'text-text-ink'}`}>{v.name}</p>
                    <p className="text-xs text-text-muted">{v.done ? `Given: ${v.date}` : `Due: ${v.due}`}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Medications */}
          <button onClick={() => toggle('medications')} className="w-full flex items-center justify-between py-2 text-left">
            <SectionHeader icon={Pill} label="Current Medications" />
            {expanded === 'medications' ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
          </button>
          {expanded === 'medications' && (
            <div className="mb-3 space-y-2">
              {(child.medications || []).length === 0 ? (
                <p className="text-xs text-text-muted p-3">No current medications.</p>
              ) : (
                (child.medications || []).map((m, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <Pill className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-blue-900">{m.name}</p>
                      <p className="text-xs text-blue-700">{m.dose} · {m.frequency}</p>
                      {m.note && <p className="text-xs text-blue-600 mt-0.5">{m.note}</p>}
                    </div>
                    <button onClick={() => handleRemoveMedication(idx)} className="text-blue-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
              {showMedForm ? (
                <div className="p-3 bg-surface-lo rounded-lg space-y-2">
                  <Input value={medName} onChange={e => setMedName(e.target.value)} placeholder="Medication name" className="bg-white border-none text-sm h-8" />
                  <div className="flex gap-2">
                    <Input value={medDose} onChange={e => setMedDose(e.target.value)} placeholder="Dose (e.g. 5ml)" className="bg-white border-none text-sm h-8" />
                    <Input value={medFreq} onChange={e => setMedFreq(e.target.value)} placeholder="Frequency" className="bg-white border-none text-sm h-8" />
                  </div>
                  <Input value={medNote} onChange={e => setMedNote(e.target.value)} placeholder="Notes (optional)" className="bg-white border-none text-sm h-8" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddMedication} className="bg-primary text-on-primary h-7 text-xs">Add</Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowMedForm(false)} className="h-7 text-xs">Cancel</Button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowMedForm(true)} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Medication
                </button>
              )}
            </div>
          )}

          {/* School */}
          <button onClick={() => toggle('school')} className="w-full flex items-center justify-between py-2 text-left">
            <SectionHeader icon={School} label="School Info" />
            {expanded === 'school' ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
          </button>
          {expanded === 'school' && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: 'School Name', val: child.school?.name || 'Not set' },
                { label: 'Grade / Section', val: `${child.school?.grade || '—'} ${child.school?.section || ''}`.trim() },
                { label: 'Teacher', val: child.school?.teacher || '—' },
                { label: 'Teacher Phone', val: child.school?.teacherPhone || '—' },
                { label: 'Teacher Email', val: child.school?.teacherEmail || '—' },
              ].map(({ label, val }) => (
                <div key={label} className={`p-3 rounded-lg bg-surface-lo ${label === 'School Name' || label === 'Teacher Email' ? 'col-span-2' : ''}`}>
                  <p className="text-[0.6rem] text-text-muted uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-medium text-text-ink truncate">{val}</p>
                </div>
              ))}
            </div>
          )}

          {/* Growth */}
          <button onClick={() => toggle('growth')} className="w-full flex items-center justify-between py-2 text-left">
            <SectionHeader icon={TrendingUp} label="Growth Tracker" />
            {expanded === 'growth' ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
          </button>
          {expanded === 'growth' && (
            <div className="mb-3 space-y-3">
              {(child.growthEntries || []).length >= 2 ? (
                <div className="rounded-xl bg-surface-lo p-3">
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={(child.growthEntries || []).slice(-10)} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant, #ccc)" strokeOpacity={0.3} />
                      <XAxis dataKey="date" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
                        formatter={(val: number, name: string) => [`${val} ${name === 'heightCm' ? 'cm' : 'kg'}`, name === 'heightCm' ? 'Height' : 'Weight']}
                      />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} formatter={v => v === 'heightCm' ? 'Height (cm)' : 'Weight (kg)'} />
                      <Line type="monotone" dataKey="heightCm" stroke="var(--color-primary, #6750A4)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="weightKg" stroke="var(--color-tertiary, #7D5260)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-text-muted p-3 bg-surface-lo rounded-lg">Log at least 2 entries to see the growth chart.</p>
              )}
              {/* Last 5 entries table */}
              {(child.growthEntries || []).length > 0 && (
                <div className="space-y-1">
                  {(child.growthEntries || []).slice(-5).reverse().map((g, idx) => (
                    <div key={idx} className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-lo text-xs">
                      <span className="text-text-muted">{g.date}</span>
                      <div className="flex gap-4">
                        <span className="font-medium text-text-ink">{g.heightCm} cm</span>
                        <span className="font-medium text-text-ink">{g.weightKg} kg</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {showGrowthForm ? (
                <div className="flex flex-wrap gap-2 items-end p-3 bg-surface-lo rounded-lg">
                  <Input value={growthH} onChange={e => setGrowthH(e.target.value)} placeholder="Height (cm)" className="bg-white border-none text-sm h-8 flex-1 min-w-[100px]" type="number" min="0" max="250" />
                  <Input value={growthW} onChange={e => setGrowthW(e.target.value)} placeholder="Weight (kg)" className="bg-white border-none text-sm h-8 flex-1 min-w-[100px]" type="number" min="0" max="200" step="0.1" />
                  <Button size="sm" onClick={handleAddGrowth} className="bg-primary text-on-primary h-8 text-xs">Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowGrowthForm(false)} className="h-8 text-xs"><X className="w-3 h-3" /></Button>
                </div>
              ) : (
                <button onClick={() => setShowGrowthForm(true)} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Log Growth Entry
                </button>
              )}
            </div>
          )}

          {/* Milestones */}
          <button onClick={() => toggle('milestones')} className="w-full flex items-center justify-between py-2 text-left">
            <SectionHeader icon={Clock} label="Milestones" />
            {expanded === 'milestones' ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
          </button>
          {expanded === 'milestones' && (
            <div className="mb-3 space-y-2">
              {child.milestones.length === 0 ? (
                <p className="text-xs text-text-muted p-3">No milestones recorded.</p>
              ) : (
                child.milestones.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-lo">
                    <span className="text-sm text-text-ink font-medium">{m.event}</span>
                    <span className="text-xs text-text-muted">{m.date}</span>
                  </div>
                ))
              )}
              <div className="flex gap-2">
                <Input value={milestoneEvent} onChange={e => setMilestoneEvent(e.target.value)} placeholder="Milestone…" className="bg-surface-lo border-none text-sm h-8 flex-1" />
                <Input value={milestoneDate} onChange={e => setMilestoneDate(e.target.value)} placeholder="Date" className="bg-surface-lo border-none text-sm h-8 w-28" />
                <Button size="sm" onClick={handleAddMilestone} className="bg-primary text-on-primary h-8 text-xs"><Plus className="w-3 h-3" /></Button>
              </div>
            </div>
          )}

          {/* Emergency Contacts */}
          <button onClick={() => toggle('emergency')} className="w-full flex items-center justify-between py-2 text-left">
            <SectionHeader icon={Phone} label="Emergency Contacts" />
            {expanded === 'emergency' ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
          </button>
          {expanded === 'emergency' && (
            <div className="mb-3 space-y-2">
              {(child.emergencyContacts || []).length === 0 ? (
                <p className="text-xs text-text-muted p-3">No emergency contacts added.</p>
              ) : (
                (child.emergencyContacts || []).map((c, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-red-900">{c.name}</p>
                      <p className="text-xs text-red-700">{c.relation} · {c.phone}</p>
                    </div>
                    <a href={`tel:${c.phone}`} className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600">
                      <Phone className="w-3 h-3" />
                    </a>
                    <button onClick={() => handleRemoveEmergencyContact(idx)} className="text-red-400 hover:text-red-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
              {showEcForm ? (
                <div className="p-3 bg-surface-lo rounded-lg space-y-2">
                  <Input value={ecName} onChange={e => setEcName(e.target.value)} placeholder="Contact name" className="bg-white border-none text-sm h-8" />
                  <div className="flex gap-2">
                    <Input value={ecRelation} onChange={e => setEcRelation(e.target.value)} placeholder="Relation (e.g. Mother)" className="bg-white border-none text-sm h-8" />
                    <Input value={ecPhone} onChange={e => setEcPhone(e.target.value)} placeholder="Phone" className="bg-white border-none text-sm h-8" type="tel" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddEmergencyContact} className="bg-red-500 text-white h-7 text-xs hover:bg-red-600">Add</Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowEcForm(false)} className="h-7 text-xs">Cancel</Button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowEcForm(true)} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Emergency Contact
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function ChildrenModule() {
  const { user, familyId } = useAuth();
  const activeFamilyId = familyId || user?.uid || 'default';

  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Add child form
  const [form, setForm] = useState({
    name: '', dob: '', age: '', grade: '', allergies: 'None', bloodGroup: 'Unknown',
    doctorName: '', doctorPhone: '', schoolName: '', teacherName: '', teacherPhone: '',
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const col = collection(db, 'families', activeFamilyId, 'children');
    const q = query(col, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChildren(snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name ?? '',
          dob: data.dob ?? '',
          age: data.age ?? '',
          grade: data.grade ?? '',
          initial: data.initial ?? '',
          color: data.color ?? COLORS[0].color,
          textColor: data.textColor ?? COLORS[0].textColor,
          image: data.image ?? ROLE_IMAGES[0],
          bloodGroup: data.bloodGroup ?? 'Unknown',
          allergies: data.allergies ?? 'None',
          milestones: (data.milestones ?? []) as Milestone[],
          health: data.health ?? { lastCheckup: 'Not recorded', nextVaccine: 'Not recorded', allergies: 'None', doctorName: '', doctorPhone: '', insuranceId: '' },
          vaccinations: (data.vaccinations ?? DEFAULT_VACCINES) as Vaccine[],
          medications: (data.medications ?? []) as Medication[],
          growthEntries: (data.growthEntries ?? []) as GrowthEntry[],
          school: data.school ?? { name: '', grade: '', teacher: '', teacherEmail: '', teacherPhone: '', section: '' },
          emergencyContacts: (data.emergencyContacts ?? []) as EmergencyContact[],
        } as Child;
      }));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsubscribe();
  }, [activeFamilyId]);

  useEffect(() => {
    if (loading || animatedRef.current) return;
    animatedRef.current = true;
    const ctx = gsap.context(() => {
      gsap.timeline()
        .from(headerRef.current?.children || [], { y: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' })
        .from(gridRef.current?.children || [], { y: 30, opacity: 0, stagger: 0.2, duration: 1, ease: 'expo.out' }, '-=0.4');
    });
    return () => ctx.revert();
  }, [loading]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const colorSet = COLORS[children.length % COLORS.length];
    await addDoc(collection(db, 'families', activeFamilyId, 'children'), {
      name: form.name.trim(),
      dob: form.dob,
      age: form.age.trim() || 'Unknown age',
      grade: form.grade.trim() || '',
      initial: form.name.trim().charAt(0).toUpperCase(),
      color: colorSet.color,
      textColor: colorSet.textColor,
      image: ROLE_IMAGES[children.length % ROLE_IMAGES.length],
      bloodGroup: form.bloodGroup,
      allergies: form.allergies.trim() || 'None',
      milestones: [],
      health: {
        lastCheckup: 'Not recorded',
        nextVaccine: 'Not recorded',
        allergies: form.allergies.trim() || 'None',
        doctorName: form.doctorName.trim(),
        doctorPhone: form.doctorPhone.trim(),
        insuranceId: '',
      },
      vaccinations: DEFAULT_VACCINES,
      medications: [],
      growthEntries: [],
      school: {
        name: form.schoolName.trim(),
        grade: form.grade.trim(),
        teacher: form.teacherName.trim(),
        teacherEmail: '',
        teacherPhone: form.teacherPhone.trim(),
        section: '',
      },
      emergencyContacts: [],
      createdAt: serverTimestamp(),
    });
    setForm({ name: '', dob: '', age: '', grade: '', allergies: 'None', bloodGroup: 'Unknown', doctorName: '', doctorPhone: '', schoolName: '', teacherName: '', teacherPhone: '' });
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="max-w-[1160px] mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-40 bg-surface-container-highest/60 animate-pulse rounded-lg" />
            <div className="h-4 w-64 bg-surface-container-highest/40 animate-pulse rounded-full" />
          </div>
          <div className="h-9 w-28 bg-surface-container-highest/60 animate-pulse rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <ChildCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1160px] mx-auto">
      <div ref={headerRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-text-ink mb-1">Children</h1>
          <p className="text-sm text-text-muted font-sans font-light">Medical, school, growth — everything in one place.</p>
        </div>
        <Button className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90" size="sm" onClick={() => setShowForm(v => !v)}>
          <Plus className="w-4 h-4" /> Add Child
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 p-6 border-none bg-surface-hi rounded-md">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl text-text-ink">Add a Child</h2>
            <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-ink"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-sans font-bold uppercase tracking-widest text-text-muted">Full Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Priya" className="bg-surface-lo border-none" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-sans font-bold uppercase tracking-widest text-text-muted">Date of Birth</Label>
              <Input type="date" value={form.dob} onChange={e => setForm(f => ({...f, dob: e.target.value}))} className="bg-surface-lo border-none" />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-sans font-bold uppercase tracking-widest text-text-muted">Age</Label>
              <Input value={form.age} onChange={e => setForm(f => ({...f, age: e.target.value}))} placeholder="e.g. 7 years" className="bg-surface-lo border-none" />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-sans font-bold uppercase tracking-widest text-text-muted">Grade / Class</Label>
              <Input value={form.grade} onChange={e => setForm(f => ({...f, grade: e.target.value}))} placeholder="e.g. Grade 2" className="bg-surface-lo border-none" />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-sans font-bold uppercase tracking-widest text-text-muted">Blood Group</Label>
              <select value={form.bloodGroup} onChange={e => setForm(f => ({...f, bloodGroup: e.target.value}))} className="w-full h-10 px-3 bg-surface-lo border-none rounded-md text-sm text-text-ink">
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-sans font-bold uppercase tracking-widest text-text-muted">Known Allergies</Label>
              <Input value={form.allergies} onChange={e => setForm(f => ({...f, allergies: e.target.value}))} placeholder="e.g. Peanuts, Penicillin" className="bg-surface-lo border-none" />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-sans font-bold uppercase tracking-widest text-text-muted">Doctor Name</Label>
              <Input value={form.doctorName} onChange={e => setForm(f => ({...f, doctorName: e.target.value}))} placeholder="Dr. Sharma" className="bg-surface-lo border-none" />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-sans font-bold uppercase tracking-widest text-text-muted">Doctor Phone</Label>
              <Input value={form.doctorPhone} onChange={e => setForm(f => ({...f, doctorPhone: e.target.value}))} placeholder="+91 98765 43210" className="bg-surface-lo border-none" type="tel" />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-sans font-bold uppercase tracking-widest text-text-muted">School Name</Label>
              <Input value={form.schoolName} onChange={e => setForm(f => ({...f, schoolName: e.target.value}))} placeholder="e.g. Delhi Public School" className="bg-surface-lo border-none" />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-sans font-bold uppercase tracking-widest text-text-muted">Class Teacher</Label>
              <Input value={form.teacherName} onChange={e => setForm(f => ({...f, teacherName: e.target.value}))} placeholder="e.g. Mrs. Kapoor" className="bg-surface-lo border-none" />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-on-primary hover:bg-primary/90 px-8">Add Child</Button>
            </div>
          </form>
        </Card>
      )}

      {children.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart className="w-12 h-12 text-text-muted mb-4 opacity-40" />
          <p className="text-lg font-serif text-text-ink mb-2">No children added yet.</p>
          <p className="text-sm text-text-muted font-sans font-light">Click 'Add Child' to begin tracking their health, school, and milestones.</p>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
          {children.map(child => (
            <div key={child.id}>
              <ChildCard child={child} familyId={activeFamilyId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
