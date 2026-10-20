import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, Clock, Plus, Loader2, Edit2, Trash2, RefreshCw, AlertCircle, Circle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { fetchTaskLists, fetchTasks, createTask, completeTask, uncompleteTask, deleteTask, updateTask, GTask, GTaskList } from '../../lib/googleTasks';
import gsap from 'gsap';
import { format } from 'date-fns';

export default function TasksModule() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  const [taskLists, setTaskLists] = useState<GTaskList[]>([]);
  const [selectedList, setSelectedList] = useState('@default');
  const [tasks, setTasks] = useState<GTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingTask, setEditingTask] = useState<GTask | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  // Form state
  const [form, setForm] = useState({ title: '', notes: '', due: '' });

  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(headerRef.current?.children || [], { y: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' })
        .from(cardRef.current, { y: 30, opacity: 0, duration: 1, ease: 'expo.out' }, '-=0.4');
    });
    return () => ctx.revert();
  }, []);

  const loadTasks = useCallback(async (token: string, listId = '@default') => {
    setLoading(true);
    setError(null);
    try {
      const [lists, items] = await Promise.all([fetchTaskLists(token), fetchTasks(token, listId)]);
      setTaskLists(lists);
      setTasks(items);
    } catch (err: any) {
      if (err.status === 401) setError('Google token expired. Please reconnect.');
      else setError(err.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (googleAccessToken) loadTasks(googleAccessToken, selectedList);
  }, [googleAccessToken, loadTasks]);

  const handleReconnect = async () => {
    const token = await refreshGoogleToken();
    if (token) loadTasks(token, selectedList);
  };

  const handleListChange = (listId: string) => {
    setSelectedList(listId);
    if (googleAccessToken) loadTasks(googleAccessToken, listId);
  };

  const handleToggle = async (task: GTask) => {
    if (!googleAccessToken) return;
    try {
      const updated = task.status === 'completed'
        ? await uncompleteTask(googleAccessToken, task.id, selectedList)
        : await completeTask(googleAccessToken, task.id, selectedList);
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleAccessToken || !form.title.trim()) return;
    setSaving(true);
    try {
      const created = await createTask(
        googleAccessToken,
        {
          title: form.title.trim(),
          ...(form.notes && { notes: form.notes }),
          ...(form.due && { due: new Date(form.due).toISOString() }),
        },
        selectedList
      );
      setTasks(prev => [created, ...prev]);
      setForm({ title: '', notes: '', due: '' });
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleAccessToken || !editingTask || !form.title.trim()) return;
    setSaving(true);
    try {
      const updated = await updateTask(
        googleAccessToken,
        editingTask.id,
        {
          title: form.title.trim(),
          ...(form.notes && { notes: form.notes }),
          ...(form.due && { due: new Date(form.due).toISOString() }),
        },
        selectedList
      );
      setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
      setEditingTask(null);
      setForm({ title: '', notes: '', due: '' });
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!googleAccessToken) return;
    try {
      await deleteTask(googleAccessToken, taskId, selectedList);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openEdit = (task: GTask) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      notes: task.notes || '',
      due: task.due ? task.due.split('T')[0] : '',
    });
    setShowForm(true);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return t.status === 'needsAction';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const activeCount = tasks.filter(t => t.status === 'needsAction').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="max-w-[1160px] mx-auto">
      <div ref={headerRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-text-ink mb-2">Task Engine</h1>
          <p className="text-sm text-text-muted font-sans font-light">
            {googleAccessToken ? `${activeCount} active · ${completedCount} completed · synced with Google Tasks` : 'Connect Google to sync real tasks.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {googleAccessToken && (
            <Button variant="ghost" size="sm" onClick={() => loadTasks(googleAccessToken, selectedList)} disabled={loading}
              className="flex items-center gap-2 border border-surface-mid hover:bg-surface-lo bg-surface-hi text-text-ink">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
          <Button
            size="sm"
            className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90"
            onClick={() => {
              if (!googleAccessToken) {
                handleReconnect();
              } else {
                setEditingTask(null);
                setForm({ title: '', notes: '', due: '' });
                setShowForm(v => !v);
              }
            }}
          >
            <Plus className="w-4 h-4" />
            {googleAccessToken ? 'New Task' : 'Connect Google'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="flex-1 text-sm">{error}</span>
          <Button size="sm" onClick={handleReconnect} className="bg-amber-600 text-white hover:bg-amber-700 shrink-0">Reconnect</Button>
          <button onClick={() => setError(null)}><X className="w-4 h-4 opacity-40 hover:opacity-100" /></button>
        </div>
      )}

      {!googleAccessToken && !error && (
        <div className="mb-6 flex items-center gap-4 p-5 bg-primary-container/20 border border-primary/20 rounded-2xl">
          <div className="flex-1">
            <p className="font-sans font-medium text-on-surface text-sm">Connect Google to manage your real tasks</p>
            <p className="text-xs text-on-surface-variant font-light mt-0.5">All tasks are synced live with Google Tasks.</p>
          </div>
          <Button onClick={handleReconnect} size="sm" className="bg-primary text-on-primary hover:bg-primary/90">Connect Google</Button>
        </div>
      )}

      {/* Task list selector */}
      {taskLists.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {taskLists.map(list => (
            <button
              key={list.id}
              onClick={() => handleListChange(list.id)}
              className={`px-4 py-2 rounded-full text-sm font-sans font-medium whitespace-nowrap transition-all ${selectedList === list.id ? 'bg-primary text-on-primary' : 'bg-surface-hi border border-surface-mid text-text-muted hover:bg-surface-lo'}`}
            >
              {list.title}
            </button>
          ))}
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && googleAccessToken && (
        <Card className="mb-6 p-6 border border-outline-variant/30 bg-surface-hi rounded-2xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl text-text-ink">{editingTask ? 'Edit Task' : 'New Task'}</h2>
            <button onClick={() => { setShowForm(false); setEditingTask(null); }} className="text-text-muted hover:text-text-ink"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={editingTask ? handleUpdate : handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3 space-y-1">
              <Label className="text-[0.68rem] font-sans font-medium uppercase tracking-widest text-text-muted">Task Title *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Pay school fees" className="bg-surface-lo border-none" required />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label className="text-[0.68rem] font-sans font-medium uppercase tracking-widest text-text-muted">Notes</Label>
              <Input value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Optional notes…" className="bg-surface-lo border-none" />
            </div>
            <div className="space-y-1">
              <Label className="text-[0.68rem] font-sans font-medium uppercase tracking-widest text-text-muted">Due Date</Label>
              <Input type="date" value={form.due} onChange={e => setForm(f => ({...f, due: e.target.value}))} className="bg-surface-lo border-none" />
            </div>
            <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditingTask(null); }}>Cancel</Button>
              <Button type="submit" disabled={saving || !form.title.trim()} className="bg-primary text-on-primary hover:bg-primary/90 px-8">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {saving ? 'Saving…' : editingTask ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-surface-hi rounded-xl w-fit border border-surface-lo">
        {(['all', 'active', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-sans font-medium capitalize transition-all ${filter === f ? 'bg-primary text-on-primary shadow-sm' : 'text-text-muted hover:text-text-ink'}`}
          >
            {f === 'active' ? `Active (${activeCount})` : f === 'completed' ? `Done (${completedCount})` : `All (${tasks.length})`}
          </button>
        ))}
      </div>

      <div ref={cardRef}>
        <Card className="bg-surface-hi border-none rounded-md overflow-hidden">
          <div className="divide-y divide-surface-lo">
            {loading ? (
              <div className="p-12 flex items-center justify-center gap-3 text-text-muted">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="font-sans text-sm">Loading tasks from Google…</span>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                <CheckCircle2 className="w-12 h-12 text-surface-mid" />
                <p className="text-sm text-text-muted font-sans">
                  {filter === 'active' ? 'All caught up! No active tasks.' : filter === 'completed' ? 'No completed tasks yet.' : 'No tasks found.'}
                </p>
                {filter === 'active' && googleAccessToken && (
                  <Button size="sm" onClick={() => { setEditingTask(null); setForm({ title: '', notes: '', due: '' }); setShowForm(true); }} className="bg-primary text-on-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-1" /> Add a task
                  </Button>
                )}
              </div>
            ) : filteredTasks.map(task => (
              <div key={task.id} className="p-5 md:p-6 flex items-start gap-4 hover:bg-surface-lo transition-colors group">
                <button
                  onClick={() => handleToggle(task)}
                  className="mt-0.5 shrink-0 text-primary hover:scale-110 transition-transform"
                >
                  {task.status === 'completed'
                    ? <CheckCircle2 className="w-5 h-5" />
                    : <Circle className="w-5 h-5 text-on-surface-variant/40" />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-sans font-medium text-[1.05rem] ${task.status === 'completed' ? 'line-through text-text-ghost' : 'text-text-ink group-hover:text-sage-dim transition-colors'}`}>
                    {task.title}
                  </p>
                  {task.notes && (
                    <p className="text-xs text-text-muted font-light mt-1">{task.notes}</p>
                  )}
                  {task.due && (
                    <div className="flex items-center gap-1 mt-1.5 text-[0.68rem] text-text-muted font-sans uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      {format(new Date(task.due), 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-text-ghost hover:text-text-ink" onClick={() => openEdit(task)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-text-ghost hover:text-red-500" onClick={() => handleDelete(task.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
