import React, { useEffect, useState } from 'react';
import {
  Syringe, Pill, Phone, Plus, X, AlertTriangle, Loader2,
  Check, Calendar, User, FileText, Heart, ChevronDown, ChevronUp, Stethoscope,
} from 'lucide-react';
import { ModuleSkeleton } from '../../components/dashboard/ModuleSkeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import {
  collection, onSnapshot, doc, updateDoc, addDoc,
  query, orderBy, serverTimestamp, deleteDoc,
} from 'firebase/firestore';

type Child = {
  id: string;
  name: string;
  initial: string;
  color: string;
  textColor: string;
  bloodGroup: string;
  allergies: string;
  vaccinations: { name: string; date: string; due: string; done: boolean }[];
  medications: { name: string; dose: string; frequency: string; note: string }[];
  health: { lastCheckup: string; doctorName: string; doctorPhone: string; insuranceId: string };
};

type Appointment = {
  id: string;
  childId: string;
  childName: string;
  type: string;
  doctor: string;
  date: string;
  time: string;
  notes: string;
  done: boolean;
};

function SectionBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${color}`}>
      {label}
    </span>
  );
}

export default function MedicalModule() {
  const { user, familyId } = useAuth();
  const activeFamilyId = familyId || user?.uid || 'default';

  const [children, setChildren] = useState<Child[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'vaccines' | 'appointments' | 'prescriptions'>('overview');
  const [expandedChild, setExpandedChild] = useState<string | null>(null);

  // Appointment form
  const [showApptForm, setShowApptForm] = useState(false);
  const [apptForm, setApptForm] = useState({
    childId: '', type: 'General Checkup', doctor: '', date: '', time: '', notes: '',
  });
  const [savingAppt, setSavingAppt] = useState(false);

  useEffect(() => {
    const childrenQ = query(
      collection(db, 'families', activeFamilyId, 'children'),
      orderBy('createdAt', 'asc')
    );
    const unsubChildren = onSnapshot(childrenQ, (snap) => {
      setChildren(snap.docs.map(d => ({ id: d.id, ...d.data() } as Child)));
      setLoading(false);
    }, () => setLoading(false));

    const apptQ = query(
      collection(db, 'families', activeFamilyId, 'appointments'),
      orderBy('date', 'asc')
    );
    const unsubAppts = onSnapshot(apptQ, (snap) => {
      setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Appointment)));
    });

    return () => { unsubChildren(); unsubAppts(); };
  }, [activeFamilyId]);

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptForm.childId || !apptForm.date) return;
    setSavingAppt(true);
    const child = children.find(c => c.id === apptForm.childId);
    await addDoc(collection(db, 'families', activeFamilyId, 'appointments'), {
      ...apptForm,
      childName: child?.name || '',
      done: false,
      createdAt: serverTimestamp(),
    });
    setApptForm({ childId: '', type: 'General Checkup', doctor: '', date: '', time: '', notes: '' });
    setShowApptForm(false);
    setSavingAppt(false);
  };

  const handleToggleAppt = async (appt: Appointment) => {
    await updateDoc(doc(db, 'families', activeFamilyId, 'appointments', appt.id), { done: !appt.done });
  };

  const handleDeleteAppt = async (id: string) => {
    await deleteDoc(doc(db, 'families', activeFamilyId, 'appointments', id));
  };

  const handleToggleVaccine = async (child: Child, idx: number) => {
    const updated = child.vaccinations.map((v, i) =>
      i === idx ? { ...v, done: !v.done, date: !v.done ? new Date().toLocaleDateString('en-IN') : '' } : v
    );
    await updateDoc(doc(db, 'families', activeFamilyId, 'children', child.id), { vaccinations: updated });
  };

  if (loading) return <ModuleSkeleton />;

  const upcomingAppts = appointments.filter(a => !a.done && a.date >= new Date().toISOString().slice(0, 10));
  const overdueAppts = appointments.filter(a => !a.done && a.date < new Date().toISOString().slice(0, 10));
  const allVaccines = children.flatMap(c => c.vaccinations?.map(v => ({ ...v, childName: c.name })) || []);
  const pendingVaccines = allVaccines.filter(v => !v.done);
  const totalMeds = children.reduce((sum, c) => sum + (c.medications?.length || 0), 0);

  return (
    <div className="max-w-[1160px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-text-ink mb-1">Medical Command</h1>
          <p className="text-sm text-text-muted font-sans font-light">Real-time health monitoring, vaccinations, and medical history.</p>
        </div>
        <Button onClick={() => setShowApptForm(v => !v)} className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90" size="sm">
          <Plus className="w-4 h-4" /> Book Appointment
        </Button>
      </div>

      {/* Alert bar — pending vaccines / overdue appointments */}
      {(pendingVaccines.length > 0 || overdueAppts.length > 0) && (
        <div className="mb-6 flex flex-wrap gap-3">
          {overdueAppts.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-sm font-medium text-red-800">{overdueAppts.length} overdue appointment{overdueAppts.length > 1 ? 's' : ''}</span>
            </div>
          )}
          {pendingVaccines.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <Syringe className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-sm font-medium text-amber-800">{pendingVaccines.length} pending vaccinations</span>
            </div>
          )}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Children', val: children.length, icon: User, color: 'text-primary' },
          { label: 'Upcoming Appts', val: upcomingAppts.length, icon: Calendar, color: 'text-blue-500' },
          { label: 'Pending Vaccines', val: pendingVaccines.length, icon: Syringe, color: 'text-rose-500' },
          { label: 'Medications', val: totalMeds, icon: Pill, color: 'text-violet-500' },
        ].map(({ label, val, icon: Icon, color }) => (
          <Card key={label} className="p-4 bg-surface-hi border-none rounded-xl">
            <Icon className={`w-5 h-5 mb-2 ${color}`} />
            <p className="text-2xl font-serif text-text-ink">{val}</p>
            <p className="text-xs text-text-muted font-sans">{label}</p>
          </Card>
        ))}
      </div>

      {/* Add Appointment Form */}
      {showApptForm && (
        <Card className="mb-6 p-6 border-none bg-surface-hi rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-text-ink">Book Appointment</h2>
            <button onClick={() => setShowApptForm(false)}><X className="w-5 h-5 text-text-muted" /></button>
          </div>
          <form onSubmit={handleAddAppointment} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Child *</Label>
              <select value={apptForm.childId} onChange={e => setApptForm(f => ({...f, childId: e.target.value}))}
                className="w-full h-10 px-3 bg-surface-lo border-none rounded-md text-sm text-text-ink" required>
                <option value="">Select child…</option>
                {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Appointment Type</Label>
              <select value={apptForm.type} onChange={e => setApptForm(f => ({...f, type: e.target.value}))}
                className="w-full h-10 px-3 bg-surface-lo border-none rounded-md text-sm text-text-ink">
                {['General Checkup', 'Vaccination', 'Dental', 'Eye Checkup', 'Specialist', 'Emergency', 'Follow-up', 'Lab Test'].map(t =>
                  <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Doctor</Label>
              <Input value={apptForm.doctor} onChange={e => setApptForm(f => ({...f, doctor: e.target.value}))} placeholder="Dr. Name" className="bg-surface-lo border-none" />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Date *</Label>
              <Input type="date" value={apptForm.date} onChange={e => setApptForm(f => ({...f, date: e.target.value}))} className="bg-surface-lo border-none" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Time</Label>
              <Input type="time" value={apptForm.time} onChange={e => setApptForm(f => ({...f, time: e.target.value}))} className="bg-surface-lo border-none" />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Notes</Label>
              <Input value={apptForm.notes} onChange={e => setApptForm(f => ({...f, notes: e.target.value}))} placeholder="Symptoms, reason…" className="bg-surface-lo border-none" />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
              <Button type="button" variant="ghost" onClick={() => setShowApptForm(false)}>Cancel</Button>
              <Button type="submit" disabled={savingAppt} className="bg-primary text-on-primary hover:bg-primary/90 px-8">
                {savingAppt ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Book
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-surface-lo rounded-xl w-fit">
        {(['overview', 'vaccines', 'appointments', 'prescriptions'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-sans font-semibold uppercase tracking-wider transition-colors ${activeTab === tab ? 'bg-surface-hi text-text-ink shadow-sm' : 'text-text-muted hover:text-text-ink'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {children.length === 0 ? (
            <div className="text-center py-16 text-text-muted">
              <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Add children in the Children module first.</p>
            </div>
          ) : children.map(child => (
            <Card key={child.id} className="bg-surface-hi border-none rounded-xl overflow-hidden">
              <button onClick={() => setExpandedChild(v => v === child.id ? null : child.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-lo/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${child.color} ${child.textColor} flex items-center justify-center font-serif text-lg`}>
                    {child.initial}
                  </div>
                  <div>
                    <p className="font-serif text-lg text-text-ink">{child.name}</p>
                    <div className="flex gap-2 mt-0.5">
                      {child.bloodGroup && child.bloodGroup !== 'Unknown' && (
                        <SectionBadge label={child.bloodGroup} color="bg-red-100 text-red-700" />
                      )}
                      {child.allergies && child.allergies !== 'None' && (
                        <SectionBadge label={`⚠ ${child.allergies}`} color="bg-amber-100 text-amber-700" />
                      )}
                      {(child.medications?.length > 0) && (
                        <SectionBadge label={`${child.medications.length} med${child.medications.length > 1 ? 's' : ''}`} color="bg-purple-100 text-purple-700" />
                      )}
                    </div>
                  </div>
                </div>
                {expandedChild === child.id ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
              </button>

              {expandedChild === child.id && (
                <div className="px-5 pb-5 border-t border-outline-variant/20 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                    <div className="p-3 rounded-lg bg-surface-lo">
                      <p className="text-[0.6rem] text-text-muted uppercase tracking-wide">Doctor</p>
                      <p className="text-sm font-medium text-text-ink">{child.health?.doctorName || '—'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-lo">
                      <p className="text-[0.6rem] text-text-muted uppercase tracking-wide">Phone</p>
                      <p className="text-sm font-medium text-text-ink">{child.health?.doctorPhone || '—'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-lo">
                      <p className="text-[0.6rem] text-text-muted uppercase tracking-wide">Last Checkup</p>
                      <p className="text-sm font-medium text-text-ink">{child.health?.lastCheckup || '—'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-lo">
                      <p className="text-[0.6rem] text-text-muted uppercase tracking-wide">Insurance ID</p>
                      <p className="text-sm font-medium text-text-ink">{child.health?.insuranceId || '—'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-lo">
                      <p className="text-[0.6rem] text-text-muted uppercase tracking-wide">Blood Group</p>
                      <p className="text-sm font-medium text-text-ink">{child.bloodGroup || 'Unknown'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-lo">
                      <p className="text-[0.6rem] text-text-muted uppercase tracking-wide">Allergies</p>
                      <p className="text-sm font-medium text-text-ink">{child.allergies || 'None'}</p>
                    </div>
                  </div>

                  {/* Current medications */}
                  {(child.medications?.length > 0) && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Current Medications</p>
                      <div className="space-y-2">
                        {child.medications.map((m, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
                            <Pill className="w-4 h-4 text-purple-500 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-purple-900">{m.name}</p>
                              <p className="text-xs text-purple-700">{m.dose} · {m.frequency}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Vaccines tab */}
      {activeTab === 'vaccines' && (
        <div className="space-y-6">
          {children.length === 0 ? (
            <p className="text-center text-text-muted py-12">Add children first.</p>
          ) : children.map(child => (
            <div key={child.id}>
              <h3 className="font-serif text-lg text-text-ink mb-3 flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full ${child.color} ${child.textColor} flex items-center justify-center text-sm font-serif`}>{child.initial}</span>
                {child.name}
                <span className="text-xs text-text-muted font-sans font-normal">
                  {child.vaccinations?.filter(v => v.done).length || 0}/{child.vaccinations?.length || 0} done
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(child.vaccinations || []).map((v, idx) => (
                  <button key={idx} onClick={() => handleToggleVaccine(child, idx)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${v.done ? 'bg-green-50 border border-green-200 hover:bg-green-100' : 'bg-surface-lo hover:bg-surface-mid'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${v.done ? 'bg-green-500 border-green-500 text-white' : 'border-text-muted'}`}>
                      {v.done && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${v.done ? 'text-green-800' : 'text-text-ink'}`}>{v.name}</p>
                      <p className="text-xs text-text-muted">{v.done ? `Given: ${v.date}` : `Due: ${v.due}`}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointments tab */}
      {activeTab === 'appointments' && (
        <div className="space-y-3">
          {overdueAppts.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">Overdue</p>
              {overdueAppts.map(appt => (
                <div key={appt.id} className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-xl mb-2">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-red-900">{appt.type} — {appt.childName}</p>
                    <p className="text-xs text-red-700">{appt.date}{appt.time ? ` at ${appt.time}` : ''}{appt.doctor ? ` · ${appt.doctor}` : ''}</p>
                  </div>
                  <button onClick={() => handleToggleAppt(appt)} className="text-xs text-red-600 border border-red-300 rounded-lg px-3 py-1.5 hover:bg-red-100">Done</button>
                  <button onClick={() => handleDeleteAppt(appt.id)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}

          {upcomingAppts.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Upcoming</p>
              {upcomingAppts.map(appt => (
                <div key={appt.id} className="flex items-center gap-4 p-4 bg-surface-hi rounded-xl mb-2 border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-ink">{appt.type} — {appt.childName}</p>
                    <p className="text-xs text-text-muted">{appt.date}{appt.time ? ` at ${appt.time}` : ''}{appt.doctor ? ` · ${appt.doctor}` : ''}</p>
                    {appt.notes && <p className="text-xs text-text-muted italic mt-0.5">{appt.notes}</p>}
                  </div>
                  <button onClick={() => handleToggleAppt(appt)} className="text-xs text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5">Done</button>
                  <button onClick={() => handleDeleteAppt(appt.id)} className="text-text-muted hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}

          {appointments.filter(a => a.done).length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 mt-4">Completed</p>
              {appointments.filter(a => a.done).map(appt => (
                <div key={appt.id} className="flex items-center gap-4 p-4 bg-surface-lo rounded-xl mb-2 opacity-60">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-text-ink">{appt.type} — {appt.childName}</p>
                    <p className="text-xs text-text-muted">{appt.date}</p>
                  </div>
                  <button onClick={() => handleDeleteAppt(appt.id)} className="text-text-muted hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}

          {appointments.length === 0 && (
            <div className="text-center py-16 text-text-muted">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No appointments booked yet.</p>
              <button onClick={() => setShowApptForm(true)} className="mt-3 text-sm text-primary hover:underline">Book one now</button>
            </div>
          )}
        </div>
      )}

      {/* Prescriptions tab */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-6">
          {children.length === 0 ? (
            <p className="text-center text-text-muted py-12">Add children first.</p>
          ) : children.map(child => (
            <div key={child.id}>
              <h3 className="font-serif text-lg text-text-ink mb-3 flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full ${child.color} ${child.textColor} flex items-center justify-center text-sm font-serif`}>{child.initial}</span>
                {child.name}
              </h3>
              {(child.medications?.length || 0) === 0 ? (
                <p className="text-xs text-text-muted p-3 bg-surface-lo rounded-lg">No active medications.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {child.medications.map((m, i) => (
                    <div key={i} className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                      <div className="flex items-start gap-3">
                        <Pill className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-purple-900">{m.name}</p>
                          <p className="text-sm text-purple-700">{m.dose}</p>
                          <p className="text-xs text-purple-600 mt-1">{m.frequency}</p>
                          {m.note && <p className="text-xs text-purple-500 mt-1 italic">{m.note}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
