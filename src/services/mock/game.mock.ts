import { SEED_GAMES } from './seed';
import type { GameService } from '../interface';
import { Game, GameWithData, CreateGameInput, UpdateGameInput, GameType, GameData } from '@/types/game';

let games: Game[] = SEED_GAMES.map((g) => ({ ...g }));

export const mockGameService: GameService = {
  async getMyGames(userId: string): Promise<Game[]> {
    return games.filter((g) => g.userId === userId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getGameById(gameId: string): Promise<GameWithData | null> {
    const game = games.find((g) => g.id === gameId);
    if (!game) return null;
    return {
      ...game,
      gameData: JSON.parse(game.gameData) as GameData,
    };
  },

  async getMyGamesByType(userId: string, type: GameType): Promise<Game[]> {
    return games.filter((g) => g.userId === userId && g.gameType === type);
  },

  async createGame(userId: string, input: CreateGameInput): Promise<GameWithData> {
    const now = new Date();
    const game: Game = {
      id: crypto.randomUUID(),
      userId,
      name: input.name,
      gameType: input.gameType,
      gameData: JSON.stringify(input.gameData),
      createdAt: now,
      updatedAt: now,
      _count: { assignments: 0 },
    };
    games = [...games, game];
    return {
      ...game,
      gameData: input.gameData,
    };
  },

  async updateGame(gameId: string, input: UpdateGameInput): Promise<GameWithData> {
    const idx = games.findIndex((g) => g.id === gameId);
    if (idx === -1) throw new Error('Game not found');
    const updated: Game = {
      ...games[idx],
      ...(input.name !== undefined && { name: input.name }),
      ...(input.gameData !== undefined && { gameData: JSON.stringify(input.gameData) }),
      updatedAt: new Date(),
    };
    games = games.map((g) => (g.id === gameId ? updated : g));
    return {
      ...updated,
      gameData: JSON.parse(updated.gameData) as GameData,
    };
  },

  async deleteGame(gameId: string): Promise<void> {
    games = games.filter((g) => g.id !== gameId);
  },

  async isGameAssigned(gameId: string): Promise<boolean> {
    const game = games.find((g) => g.id === gameId);
    return (game?._count?.assignments ?? 0) > 0;
  },

  async duplicateGame(gameId: string, userId: string): Promise<GameWithData> {
    const original = await mockGameService.getGameById(gameId);
    if (!original) throw new Error('Game not found');
    return mockGameService.createGame(userId, {
      name: `${original.name} (Copy)`,
      gameType: original.gameType,
      gameData: original.gameData,
    });
  },
};

export function resetGameMockData(): void {
  games = SEED_GAMES.map((g) => ({ ...g }));
}
