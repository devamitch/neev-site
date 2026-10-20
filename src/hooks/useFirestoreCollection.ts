/**
 * React Query + Firestore real-time bridge.
 *
 * Every hook here:
 *  1. Sets up a real-time Firestore `onSnapshot` listener
 *  2. Pushes updates into queryClient.setQueryData (React Query cache)
 *  3. Returns useQuery so the component gets cached data instantly on mount
 *     (data survives page refresh via persistQueryClient in queryClient.ts)
 *
 * Result: zero loading state after the first visit, real-time updates always.
 */
import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  query as fsQuery,
  onSnapshot,
  orderBy,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';

function useRealtimeCollection<T extends { id: string }>(
  familyId: string,
  collectionPath: string,
  queryKey: string[],
  orderField: string,
  orderDir: 'asc' | 'desc' = 'asc',
) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!familyId || familyId === 'default') return;
    const q = fsQuery(
      collection(db, 'families', familyId, collectionPath),
      orderBy(orderField, orderDir),
    );
    return onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as T[];
        qc.setQueryData(queryKey, docs);
      },
      () => {
        // On error, keep stale data — don't clear the cache
      },
    );
  }, [familyId]);

  return useQuery<T[]>({
    queryKey,
    queryFn: () => qc.getQueryData<T[]>(queryKey) ?? [],
    staleTime: Infinity,      // Firestore keeps it fresh — never refetch on its own
    gcTime: 1000 * 60 * 60,  // 1 hour in-memory after last use
    initialData: () => qc.getQueryData<T[]>(queryKey),
  });
}

// ── Public hooks ────────────────────────────────────────────────────────────

export function useChildren(familyId: string) {
  return useRealtimeCollection(familyId, 'children', ['children', familyId], 'createdAt');
}

export function useAppointments(familyId: string) {
  return useRealtimeCollection(familyId, 'appointments', ['appointments', familyId], 'date');
}

export function useHomework(familyId: string) {
  return useRealtimeCollection(familyId, 'homework', ['homework', familyId], 'dueDate');
}

export function useExams(familyId: string) {
  return useRealtimeCollection(familyId, 'exams', ['exams', familyId], 'date');
}

export function useVaultEntries(familyId: string) {
  return useRealtimeCollection(familyId, 'vault', ['vault', familyId], 'createdAt', 'desc');
}

// ── Smart family alerts ─────────────────────────────────────────────────────
// Aggregates data from children, appointments, homework and exams to produce
// a prioritised list of actionable alerts shown across the whole dashboard.

export type FamilySmartAlert = {
  id: string;
  type: 'medication' | 'vaccine' | 'appointment' | 'homework' | 'exam';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  path: string;  // where to navigate on click
};

export function useFamilyAlerts(familyId: string): FamilySmartAlert[] {
  const { data: children = [] } = useChildren(familyId);
  const { data: appointments = [] } = useAppointments(familyId);
  const { data: homework = [] } = useHomework(familyId);
  const { data: exams = [] } = useExams(familyId);

  return useMemo(() => {
    const alerts: FamilySmartAlert[] = [];
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const in48h = new Date(Date.now() + 48 * 3600000).toISOString().slice(0, 10);

    // 1. Medication reminders — every child with active meds needs a daily prompt
    children.forEach((c: any) => {
      const meds: any[] = c.medications || [];
      if (meds.length > 0) {
        alerts.push({
          id: `med-${c.id}`,
          type: 'medication',
          severity: 'critical',
          title: `${c.name}'s medication today`,
          detail: meds.map((m: any) => `${m.name} ${m.dose} (${m.frequency})`).join(' · '),
          path: '/dashboard/medical',
        });
      }
    });

    // 2. Pending vaccines — flag children with any unfinished vaccines
    children.forEach((c: any) => {
      const pending = (c.vaccinations || []).filter((v: any) => !v.done);
      if (pending.length > 0) {
        alerts.push({
          id: `vax-${c.id}`,
          type: 'vaccine',
          severity: pending.length > 2 ? 'critical' : 'warning',
          title: `${c.name} — ${pending.length} vaccine${pending.length > 1 ? 's' : ''} pending`,
          detail: pending.slice(0, 3).map((v: any) => v.name).join(', ') + (pending.length > 3 ? ` +${pending.length - 3} more` : ''),
          path: '/dashboard/medical',
        });
      }
    });

    // 3. Appointments in the next 48 hours (not done)
    appointments
      .filter((a: any) => !a.done && a.date >= today && a.date <= in48h)
      .forEach((a: any) => {
        const isToday = a.date === today;
        alerts.push({
          id: `appt-${a.id}`,
          type: 'appointment',
          severity: isToday ? 'critical' : 'warning',
          title: `${isToday ? 'Today' : 'Tomorrow'}: ${a.type} for ${a.childName}`,
          detail: `${a.doctor ? `Dr. ${a.doctor}` : ''}${a.time ? ` at ${a.time}` : ''}`.trim() || 'Check Medical module',
          path: '/dashboard/medical',
        });
      });

    // 4. Homework due today or overdue
    homework
      .filter((h: any) => !h.done && h.dueDate && h.dueDate <= today)
      .slice(0, 3)
      .forEach((h: any) => {
        const isOverdue = h.dueDate < today;
        alerts.push({
          id: `hw-${h.id}`,
          type: 'homework',
          severity: isOverdue ? 'warning' : 'info',
          title: `${isOverdue ? 'Overdue' : 'Due today'}: ${h.subject} — ${h.childName}`,
          detail: h.title,
          path: '/dashboard/school',
        });
      });

    // 5. Exams in the next 48 hours
    exams
      .filter((e: any) => !e.done && e.date >= today && e.date <= in48h)
      .slice(0, 2)
      .forEach((e: any) => {
        alerts.push({
          id: `exam-${e.id}`,
          type: 'exam',
          severity: e.date === today ? 'critical' : 'warning',
          title: `Exam ${e.date === today ? 'today' : 'tomorrow'}: ${e.subject} — ${e.childName}`,
          detail: e.time ? `at ${e.time}` : '',
          path: '/dashboard/school',
        });
      });

    // Sort: critical first, then warning, then info; deduplicate by id
    const seen = new Set<string>();
    return alerts
      .filter(a => { if (seen.has(a.id)) return false; seen.add(a.id); return true; })
      .sort((a, b) => {
        const order = { critical: 0, warning: 1, info: 2 };
        return order[a.severity] - order[b.severity];
      });
  }, [children, appointments, homework, exams]);
}
