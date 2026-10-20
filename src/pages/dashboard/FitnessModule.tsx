import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, Heart, Footprints, Flame, Clock, RefreshCw, AlertCircle, X, Loader2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import gsap from 'gsap';
import { useAuth } from '../../contexts/AuthContext';
import { fetchFitAggregate, fetchFitWeekly, FitAggregateResult, FitDailyStats } from '../../lib/googleFit';

const STEP_GOAL = 10000;
const CALORIE_GOAL = 500;
const ACTIVE_GOAL = 30;

function StatCard({ icon: Icon, label, value, unit, color, progress }: {
  icon: React.ElementType; label: string; value: number; unit: string; color: string; progress?: number;
}) {
  return (
    <Card className="p-6 bg-surface-hi border-none rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        {progress !== undefined && (
          <span className="text-xs font-sans font-bold text-text-muted uppercase tracking-widest">
            {Math.min(100, Math.round(progress))}%
          </span>
        )}
      </div>
      <div>
        <p className="font-serif text-3xl text-text-ink">{value.toLocaleString()}</p>
        <div className="flex items-end gap-2 mt-1">
          <span className="text-sm text-text-muted font-sans">{unit}</span>
          <span className="text-[0.68rem] text-text-ghost font-sans uppercase tracking-widest">{label}</span>
        </div>
      </div>
      {progress !== undefined && (
        <div className="h-1.5 rounded-full bg-surface-mid overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${color.replace('bg-', 'bg-').replace('/10', '')}`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      )}
    </Card>
  );
}

function WeekBar({ day, steps, maxSteps }: { day: string; steps: number; maxSteps: number }) {
  const pct = maxSteps > 0 ? (steps / maxSteps) * 100 : 0;
  const isGoal = steps >= STEP_GOAL;
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <p className="text-[0.65rem] font-sans font-medium text-text-muted uppercase tracking-wider">{steps > 0 ? steps.toLocaleString() : '—'}</p>
      <div className="w-full bg-surface-mid rounded-full overflow-hidden" style={{ height: '100px' }}>
        <div
          className={`w-full rounded-full transition-all duration-700 ${isGoal ? 'bg-emerald-500' : 'bg-primary/60'}`}
          style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
        />
      </div>
      <p className="text-[0.65rem] font-sans text-text-muted uppercase tracking-wider">{day}</p>
    </div>
  );
}

export default function FitnessModule() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();

  const [today, setToday] = useState<FitAggregateResult | null>(null);
  const [weekly, setWeekly] = useState<FitDailyStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<'today' | 'week' | 'month'>('today');

  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children || [], {
        y: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, []);

  const load = useCallback(async (token: string, selectedRange = range) => {
    setLoading(true);
    setError(null);
    try {
      const end = new Date();
      const start = new Date();
      if (selectedRange === 'today') start.setHours(0, 0, 0, 0);
      else if (selectedRange === 'week') start.setDate(end.getDate() - 6);
      else start.setDate(end.getDate() - 29);

      const [agg, week] = await Promise.all([
        fetchFitAggregate(token, start, end),
        fetchFitWeekly(token),
      ]);
      setToday(agg);
      setWeekly(week);

      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          y: 20, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'expo.out',
        });
      }
    } catch (err: any) {
      if (err.status === 401) setError('Google token expired. Please reconnect.');
      else setError(err.message || 'Failed to load Google Fit data.');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    if (googleAccessToken) load(googleAccessToken, range);
  }, [googleAccessToken, range]);

  const handleReconnect = async () => {
    const token = await refreshGoogleToken();
    if (token) load(token, range);
  };

  const maxSteps = Math.max(...weekly.map((d) => d.steps), STEP_GOAL);
  const totalWeekSteps = weekly.reduce((s, d) => s + d.steps, 0);
  const avgSteps = weekly.length > 0 ? Math.round(totalWeekSteps / weekly.length) : 0;

  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="max-w-[1160px] mx-auto">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-text-ink mb-2">Family Fitness</h1>
          <p className="text-sm text-text-muted font-sans font-light">
            {googleAccessToken ? 'Live data from Google Fit.' : 'Connect Google Fit to track health.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Range selector */}
          {googleAccessToken && (
            <div className="flex gap-1 p-1 bg-surface-hi rounded-xl border border-surface-lo">
              {(['today', 'week', 'month'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-4 py-2 rounded-lg text-sm font-sans font-medium capitalize transition-all ${range === r ? 'bg-primary text-on-primary shadow-sm' : 'text-text-muted hover:text-text-ink'}`}
                >
                  {r === 'today' ? 'Today' : r === 'week' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
          )}
          {googleAccessToken && (
            <Button variant="ghost" size="sm" onClick={() => load(googleAccessToken, range)} disabled={loading}
              className="border border-surface-mid bg-surface-hi text-text-ink">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="flex-1 text-sm font-sans">{error}</span>
          <Button size="sm" onClick={handleReconnect} className="bg-amber-600 text-white hover:bg-amber-700 shrink-0">Reconnect</Button>
          <button onClick={() => setError(null)}><X className="w-4 h-4 opacity-40 hover:opacity-100" /></button>
        </div>
      )}

      {/* No token */}
      {!googleAccessToken && !error && (
        <div className="p-12 rounded-2xl border-2 border-dashed border-outline-variant/30 text-center space-y-4">
          <Activity className="w-16 h-16 text-outline-variant/40 mx-auto" />
          <p className="font-sans text-on-surface-variant/60">Connect Google Fit to track steps, calories and heart rate.</p>
          <Button onClick={handleReconnect} className="bg-primary text-on-primary hover:bg-primary/90">Connect Google</Button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center p-16 gap-3 text-text-muted">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-sans text-sm">Loading from Google Fit…</span>
        </div>
      )}

      {!loading && googleAccessToken && today && (
        <div className="space-y-10">
          {/* Stat cards */}
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              icon={Footprints}
              label="Steps"
              value={today.steps}
              unit="steps"
              color="bg-primary/10 text-primary"
              progress={(today.steps / STEP_GOAL) * 100}
            />
            <StatCard
              icon={Flame}
              label="Calories"
              value={today.calories}
              unit="kcal"
              color="bg-orange-100 text-orange-500"
              progress={(today.calories / CALORIE_GOAL) * 100}
            />
            <StatCard
              icon={Clock}
              label="Active"
              value={today.activeMinutes}
              unit="minutes"
              color="bg-emerald-100 text-emerald-600"
              progress={(today.activeMinutes / ACTIVE_GOAL) * 100}
            />
            <StatCard
              icon={Heart}
              label="Heart Rate"
              value={today.heartRateAvg}
              unit="bpm avg"
              color="bg-red-100 text-red-500"
            />
          </div>

          {/* Distance banner */}
          {today.distance > 0 && (
            <div className="flex items-center gap-5 p-6 bg-surface-container rounded-2xl border border-outline-variant/20">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="font-serif text-2xl text-text-ink">{(today.distance / 1000).toFixed(2)} km</p>
                <p className="text-sm text-text-muted font-sans font-light mt-0.5">Distance covered</p>
              </div>
            </div>
          )}

          {/* Weekly chart */}
          <Card className="p-8 bg-surface-hi border-none rounded-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-xl text-text-ink">Weekly Steps</h2>
                <p className="text-sm text-text-muted font-sans font-light mt-1">
                  {avgSteps.toLocaleString()} avg/day · {totalWeekSteps.toLocaleString()} total
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-text-muted font-sans">Goal reached</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                  <span className="text-xs text-text-muted font-sans">Steps</span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-3">
              {weekly.map((day, i) => (
                <div key={day.date} className="flex-1">
                  <WeekBar
                    day={DAY_LABELS[i] ?? day.date.slice(5)}
                    steps={day.steps}
                    maxSteps={maxSteps}
                  />
                </div>
              ))}
              {weekly.length === 0 && (
                <p className="text-sm text-text-muted font-sans text-center w-full py-12">No step data available for this week.</p>
              )}
            </div>
            {/* Goal line indicator */}
            <div className="mt-4 pt-4 border-t border-surface-lo flex items-center gap-3">
              <div className="h-0.5 w-8 border-t-2 border-dashed border-primary/40" />
              <span className="text-[0.68rem] text-text-muted font-sans uppercase tracking-widest">
                Daily goal: {STEP_GOAL.toLocaleString()} steps
              </span>
            </div>
          </Card>

          {/* Weekly breakdown */}
          <Card className="bg-surface-hi border-none rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-surface-lo">
              <h2 className="font-serif text-lg text-text-ink">Daily Breakdown</h2>
            </div>
            <div className="divide-y divide-surface-lo">
              {[...weekly].reverse().map((day, i) => (
                <div key={day.date} className="px-6 py-4 flex items-center gap-6">
                  <div className="w-20 shrink-0">
                    <p className="text-sm font-sans font-medium text-text-ink">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex-1 flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Footprints className="w-4 h-4 text-primary" />
                      <span className="text-sm font-sans text-text-ink">{day.steps.toLocaleString() || '—'}</span>
                      <span className="text-[0.65rem] text-text-muted uppercase tracking-wider">steps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-sans text-text-ink">{day.calories || '—'}</span>
                      <span className="text-[0.65rem] text-text-muted uppercase tracking-wider">kcal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-sans text-text-ink">{day.activeMinutes || '—'}</span>
                      <span className="text-[0.65rem] text-text-muted uppercase tracking-wider">min active</span>
                    </div>
                  </div>
                  {day.steps >= STEP_GOAL && (
                    <span className="text-[0.6rem] font-sans font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                      Goal ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
