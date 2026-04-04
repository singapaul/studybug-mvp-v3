import type { GameService } from '../interface';
import { type Game, type GameWithData, GameType } from '@/types/game';
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

function hydrateGame(raw: any): Game {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    gameData: typeof raw.gameData === 'string' ? raw.gameData : JSON.stringify(raw.gameData),
  };
}

function hydrateGameWithData(raw: any): GameWithData {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    gameData: typeof raw.gameData === 'string' ? JSON.parse(raw.gameData) : raw.gameData,
  };
}

export const apiGameService: GameService = {
  getMyGames: async (_userId: string): Promise<Game[]> => {
    const res = await authFetch('/api/games');
    return (await res.json()).map(hydrateGame);
  },

  getGameById: async (gameId: string): Promise<GameWithData | null> => {
    try {
      const res = await authFetch(`/api/games/${gameId}`);
      return hydrateGameWithData(await res.json());
    } catch (err: any) {
      if (err.message?.includes('404') || err.message === 'Not found') return null;
      throw err;
    }
  },

  getMyGamesByType: async (userId: string, type: GameType): Promise<Game[]> => {
    const all = await apiGameService.getMyGames(userId);
    return all.filter((g) => g.gameType === type);
  },

  createGame: async (_userId: string, input): Promise<GameWithData> => {
    const res = await authFetch('/api/games', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return hydrateGameWithData(await res.json());
  },

  updateGame: async (gameId: string, input): Promise<GameWithData> => {
    const res = await authFetch(`/api/games/${gameId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    return hydrateGameWithData(await res.json());
  },

  deleteGame: async (gameId: string): Promise<void> => {
    await authFetch(`/api/games/${gameId}`, { method: 'DELETE' });
  },

  isGameAssigned: async (gameId: string): Promise<boolean> => {
    const game = await apiGameService.getGameById(gameId);
    return (game?._count?.assignments ?? 0) > 0;
  },

  duplicateGame: async (gameId: string, _userId: string): Promise<GameWithData> => {
    const res = await authFetch(`/api/games/${gameId}/duplicate`, { method: 'POST' });
    return hydrateGameWithData(await res.json());
  },
};
