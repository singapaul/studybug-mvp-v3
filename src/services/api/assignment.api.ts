import type { AssignmentService, CreateAssignmentInput } from '../interface';
import type { Assignment, StudentAssignment, AssignmentFilter, AssignmentSort } from '@/types/assignment';
import { tokenStore } from './token-store';

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3001';

async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await tokenStore.getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res;
}

function hydrateDates(raw: any): any {
  if (!raw) return raw;
  return {
    ...raw,
    createdAt: raw.createdAt ? new Date(raw.createdAt) : raw.createdAt,
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : raw.updatedAt,
    dueDate: raw.dueDate ? new Date(raw.dueDate) : null,
    game: raw.game ? {
      ...raw.game,
      createdAt: raw.game.createdAt ? new Date(raw.game.createdAt) : raw.game.createdAt,
      updatedAt: raw.game.updatedAt ? new Date(raw.game.updatedAt) : raw.game.updatedAt,
      gameData: typeof raw.game.gameData === 'string' ? raw.game.gameData : JSON.stringify(raw.game.gameData),
    } : raw.game,
    group: raw.group ? {
      ...raw.group,
      createdAt: raw.group.createdAt ? new Date(raw.group.createdAt) : raw.group.createdAt,
      updatedAt: raw.group.updatedAt ? new Date(raw.group.updatedAt) : raw.group.updatedAt,
    } : raw.group,
  };
}

export const apiAssignmentService: AssignmentService = {
  createAssignment: async (input: CreateAssignmentInput): Promise<Assignment> => {
    const res = await authFetch('/api/assignments', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return hydrateDates(await res.json());
  },

  deleteAssignment: async (assignmentId: string): Promise<void> => {
    await authFetch(`/api/assignments/${assignmentId}`, { method: 'DELETE' });
  },

  updateAssignment: async (assignmentId: string, updates): Promise<Assignment> => {
    const res = await authFetch(`/api/assignments/${assignmentId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return hydrateDates(await res.json());
  },

  getGroupAssignments: async (groupId: string): Promise<Assignment[]> => {
    const res = await authFetch(`/api/groups/${groupId}/assignments`);
    return (await res.json()).map(hydrateDates);
  },

  isGameAssignedToGroup: async (gameId: string, groupId: string): Promise<boolean> => {
    try {
      const assignments = await apiAssignmentService.getGroupAssignments(groupId);
      return assignments.some(a => a.gameId === gameId);
    } catch {
      return false;
    }
  },

  getMyAssignments: async (
    _studentId: string,
    _filter?: AssignmentFilter,
    _sort?: AssignmentSort
  ): Promise<StudentAssignment[]> => {
    const res = await authFetch('/api/student/assignments');
    return (await res.json()).map(hydrateDates);
  },

  getAssignmentById: async (_studentId: string, assignmentId: string): Promise<StudentAssignment | null> => {
    try {
      const res = await authFetch(`/api/student/assignments/${assignmentId}`);
      return hydrateDates(await res.json());
    } catch (err: any) {
      if (err.message === 'Not found' || err.message?.includes('404')) return null;
      throw err;
    }
  },

  getMyStats: async (_studentId: string) => {
    const res = await authFetch('/api/student/stats');
    return res.json();
  },

  getMyAttempts: async (_studentId: string, filters?: any): Promise<any[]> => {
    const res = await authFetch('/api/attempts');
    return res.json();
  },

  getMyPersonalBests: async (_studentId: string): Promise<any[]> => {
    const res = await authFetch('/api/student/personal-bests');
    return res.json();
  },

  getMyProgressTrends: async (_studentId: string, days?: number): Promise<any> => {
    const qs = days ? `?days=${days}` : '';
    const res = await authFetch(`/api/student/progress-trends${qs}`);
    return res.json();
  },

  getAttemptDetails: async (attemptId: string): Promise<any> => {
    try {
      const res = await authFetch(`/api/attempts/${attemptId}`);
      return res.json();
    } catch (err: any) {
      if (err.message === 'Not found' || err.message?.includes('404')) return null;
      throw err;
    }
  },
};
