import type { GroupService } from '../interface';
import type { Group, GroupWithDetails, CreateGroupInput } from '@/types/group';
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

function hydrateGroup(raw: any): Group {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

function hydrateGroupWithDetails(raw: any): GroupWithDetails {
  return {
    ...hydrateGroup(raw),
    members: (raw.members ?? []).map((m: any) => ({
      ...m,
      joinedAt: new Date(m.joinedAt),
    })),
    assignments: (raw.assignments ?? []).map((a: any) => ({
      ...a,
      dueDate: a.dueDate ? new Date(a.dueDate) : null,
    })),
  };
}

export const apiGroupService: GroupService = {
  getMyGroups: async (_tutorId: string): Promise<Group[]> => {
    const res = await authFetch('/api/groups');
    return (await res.json()).map(hydrateGroup);
  },

  getGroupById: async (groupId: string): Promise<GroupWithDetails | null> => {
    try {
      const res = await authFetch(`/api/groups/${groupId}`);
      return hydrateGroupWithDetails(await res.json());
    } catch (err: any) {
      if (err.message === 'Not found' || err.message?.includes('404')) return null;
      throw err;
    }
  },

  getGroupByJoinCode: async (joinCode: string): Promise<Group | null> => {
    // No dedicated endpoint — join by code is handled via joinGroup
    // For preview, use the join endpoint and check the response
    return null;
  },

  createGroup: async (_tutorId: string, input: CreateGroupInput): Promise<Group> => {
    const res = await authFetch('/api/groups', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return hydrateGroup(await res.json());
  },

  updateGroup: async (groupId: string, input: Partial<CreateGroupInput>): Promise<Group> => {
    const res = await authFetch(`/api/groups/${groupId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    return hydrateGroup(await res.json());
  },

  deleteGroup: async (groupId: string): Promise<void> => {
    await authFetch(`/api/groups/${groupId}`, { method: 'DELETE' });
  },

  removeStudentFromGroup: async (groupId: string, studentId: string): Promise<void> => {
    await authFetch(`/api/groups/${groupId}/members/${studentId}`, { method: 'DELETE' });
  },

  getMyGroupsAsStudent: async (_studentId: string): Promise<GroupWithDetails[]> => {
    const res = await authFetch('/api/student/groups');
    return (await res.json()).map(hydrateGroupWithDetails);
  },

  joinGroup: async (
    _studentId: string,
    joinCode: string
  ): Promise<{ success: boolean; error?: string; groupName?: string }> => {
    try {
      const res = await authFetch('/api/groups/join', {
        method: 'POST',
        body: JSON.stringify({ joinCode }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message ?? 'Failed to join group' };
    }
  },
};
