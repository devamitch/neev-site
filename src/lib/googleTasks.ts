export interface GTaskList {
  id: string;
  title: string;
}

export interface GTask {
  id: string;
  title: string;
  notes?: string;
  due?: string; // RFC 3339 timestamp
  status: 'needsAction' | 'completed';
  completed?: string;
  updated?: string;
}

const BASE = 'https://www.googleapis.com/tasks/v1';

async function gFetch(url: string, token: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error?.message || `HTTP ${res.status}`), { status: res.status });
  return data;
}

export async function fetchTaskLists(token: string): Promise<GTaskList[]> {
  const data = await gFetch(`${BASE}/users/@me/lists`, token);
  return data?.items ?? [];
}

export async function fetchTasks(token: string, taskListId = '@default'): Promise<GTask[]> {
  const params = new URLSearchParams({
    showCompleted: 'true',
    showHidden: 'false',
    maxResults: '100',
  });
  const data = await gFetch(`${BASE}/lists/${taskListId}/tasks?${params}`, token);
  return data?.items ?? [];
}

export async function createTask(token: string, task: { title: string; notes?: string; due?: string }, taskListId = '@default'): Promise<GTask> {
  return gFetch(`${BASE}/lists/${taskListId}/tasks`, token, {
    method: 'POST',
    body: JSON.stringify(task),
  });
}

export async function completeTask(token: string, taskId: string, taskListId = '@default'): Promise<GTask> {
  return gFetch(`${BASE}/lists/${taskListId}/tasks/${taskId}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'completed', completed: new Date().toISOString() }),
  });
}

export async function uncompleteTask(token: string, taskId: string, taskListId = '@default'): Promise<GTask> {
  return gFetch(`${BASE}/lists/${taskListId}/tasks/${taskId}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'needsAction', completed: null }),
  });
}

export async function updateTask(token: string, taskId: string, updates: { title?: string; notes?: string; due?: string }, taskListId = '@default'): Promise<GTask> {
  return gFetch(`${BASE}/lists/${taskListId}/tasks/${taskId}`, token, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function deleteTask(token: string, taskId: string, taskListId = '@default'): Promise<void> {
  await gFetch(`${BASE}/lists/${taskListId}/tasks/${taskId}`, token, { method: 'DELETE' });
}
