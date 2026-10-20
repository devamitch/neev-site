import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import {
  fetchTaskLists,
  fetchTasks,
  createTask,
  completeTask,
  uncompleteTask,
  updateTask,
  deleteTask,
  GTask,
} from '../lib/googleTasks';
import { STALE } from '../lib/queryClient';

export function useTaskLists() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'tasks', 'lists'],
    queryFn: async () => {
      let token = googleAccessToken;
      try {
        return await fetchTaskLists(token!);
      } catch (err: any) {
        if (err.status === 401) {
          token = await refreshGoogleToken();
          if (!token) throw err;
          return fetchTaskLists(token);
        }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.tasks,
  });
}

export function useTasks(taskListId = '@default') {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'tasks', 'items', taskListId],
    queryFn: async () => {
      let token = googleAccessToken;
      try {
        return await fetchTasks(token!, taskListId);
      } catch (err: any) {
        if (err.status === 401) {
          token = await refreshGoogleToken();
          if (!token) throw err;
          return fetchTasks(token, taskListId);
        }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.tasks,
    refetchInterval: 2 * 60 * 1000,
  });
}

export function useActiveTasks() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'tasks', 'active'],
    queryFn: async () => {
      let token = googleAccessToken;
      try {
        const tasks = await fetchTasks(token!);
        return tasks.filter((t) => t.status === 'needsAction');
      } catch (err: any) {
        if (err.status === 401) {
          token = await refreshGoogleToken();
          if (!token) throw err;
          const tasks = await fetchTasks(token);
          return tasks.filter((t) => t.status === 'needsAction');
        }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.tasks,
  });
}

export function useCreateTask(taskListId = '@default') {
  const { googleAccessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (task: { title: string; notes?: string; due?: string }) =>
      createTask(googleAccessToken!, task, taskListId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['google', 'tasks'] });
    },
  });
}

export function useToggleTask(taskListId = '@default') {
  const { googleAccessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (task: GTask) =>
      task.status === 'completed'
        ? uncompleteTask(googleAccessToken!, task.id, taskListId)
        : completeTask(googleAccessToken!, task.id, taskListId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['google', 'tasks'] });
    },
  });
}

export function useUpdateTask(taskListId = '@default') {
  const { googleAccessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: { title?: string; notes?: string; due?: string } }) =>
      updateTask(googleAccessToken!, id, updates, taskListId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['google', 'tasks'] });
    },
  });
}

export function useDeleteTask(taskListId = '@default') {
  const { googleAccessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(googleAccessToken!, taskId, taskListId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['google', 'tasks'] });
    },
  });
}
