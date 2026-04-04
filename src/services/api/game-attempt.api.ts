import type { GameAttemptService } from '../interface';
import type { GameAttempt } from '@/types/assignment';
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

function hydrateAttempt(raw: any): GameAttempt {
  return {
    ...raw,
    completedAt: new Date(raw.completedAt),
    attemptData: typeof raw.attemptData === 'string' ? raw.attemptData : JSON.stringify(raw.attemptData),
  };
}

export const apiGameAttemptService: GameAttemptService = {
  saveGameAttempt: async (
    _studentId: string,
    assignmentId: string,
    scorePercentage: number,
    timeTaken: number,
    attemptData: Record<string, unknown>
  ): Promise<GameAttempt> => {
    const res = await authFetch('/api/attempts', {
      method: 'POST',
      body: JSON.stringify({ assignmentId, scorePercentage, timeTaken, attemptData }),
    });
    return hydrateAttempt(await res.json());
  },

  getMyAssignmentAttempts: async (_studentId: string, assignmentId: string): Promise<GameAttempt[]> => {
    const res = await authFetch('/api/attempts');
    const all: GameAttempt[] = (await res.json()).map(hydrateAttempt);
    return all.filter(a => a.assignmentId === assignmentId);
  },

  getMyBestAttempt: async (_studentId: string, assignmentId: string): Promise<GameAttempt | null> => {
    const res = await authFetch('/api/attempts');
    const all: GameAttempt[] = (await res.json())
      .map(hydrateAttempt)
      .filter((a: GameAttempt) => a.assignmentId === assignmentId);
    if (all.length === 0) return null;
    return all.reduce((best, cur) => cur.scorePercentage > best.scorePercentage ? cur : best);
  },

  getMyAttempts: async (_studentId: string): Promise<GameAttempt[]> => {
    const res = await authFetch('/api/attempts');
    return (await res.json()).map(hydrateAttempt);
  },
};
