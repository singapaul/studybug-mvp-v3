import { describe, it, expect, beforeEach } from 'vitest';
import { mockGameService, resetGameMockData } from '@/services/mock/game.mock';
import { GameType } from '@/types/game';

const TUTOR_ID = 'tutor-dev-1';

beforeEach(() => {
  resetGameMockData();
});

describe('mockGameService', () => {
  describe('getMyGames', () => {
    it('returns games owned by the given user', async () => {
      const games = await mockGameService.getMyGames(TUTOR_ID);
      expect(games.length).toBeGreaterThan(0);
      games.forEach((g) => expect(g.userId).toBe(TUTOR_ID));
    });

    it('returns empty array for unknown user', async () => {
      const games = await mockGameService.getMyGames('unknown-user');
      expect(games).toEqual([]);
    });

    it('returns games sorted newest first', async () => {
      const games = await mockGameService.getMyGames(TUTOR_ID);
      for (let i = 1; i < games.length; i++) {
        expect(new Date(games[i - 1].createdAt).getTime()).toBeGreaterThanOrEqual(
          new Date(games[i].createdAt).getTime()
        );
      }
    });
  });

  describe('getGameById', () => {
    it('returns a game with parsed gameData', async () => {
      const game = await mockGameService.getGameById('game-1');
      expect(game).not.toBeNull();
      expect(game!.id).toBe('game-1');
      expect(typeof game!.gameData).toBe('object');
    });

    it('returns null for unknown game id', async () => {
      const game = await mockGameService.getGameById('nonexistent');
      expect(game).toBeNull();
    });
  });

  describe('getMyGamesByType', () => {
    it('filters games by type', async () => {
      const games = await mockGameService.getMyGamesByType(TUTOR_ID, GameType.FLASHCARDS);
      expect(games.length).toBeGreaterThan(0);
      games.forEach((g) => expect(g.gameType).toBe(GameType.FLASHCARDS));
    });
  });

  describe('createGame', () => {
    it('creates a new game and returns it with parsed data', async () => {
      const input = {
        name: 'New Test Game',
        gameType: GameType.PAIRS,
        gameData: { items: [{ id: '1', leftText: 'A', rightText: 'B' }] },
      };
      const created = await mockGameService.createGame(TUTOR_ID, input);
      expect(created.id).toBeTruthy();
      expect(created.name).toBe('New Test Game');
      expect(created.userId).toBe(TUTOR_ID);
      expect(created.gameType).toBe(GameType.PAIRS);
      expect(created.gameData).toEqual(input.gameData);
    });

    it('adds the game to the store', async () => {
      const before = await mockGameService.getMyGames(TUTOR_ID);
      await mockGameService.createGame(TUTOR_ID, {
        name: 'Another Game',
        gameType: GameType.SPLAT,
        gameData: { timeLimit: 10, items: [] },
      });
      const after = await mockGameService.getMyGames(TUTOR_ID);
      expect(after.length).toBe(before.length + 1);
    });
  });

  describe('updateGame', () => {
    it('updates the name of an existing game', async () => {
      const updated = await mockGameService.updateGame('game-1', { name: 'Renamed Game' });
      expect(updated.name).toBe('Renamed Game');
    });

    it('throws for unknown game id', async () => {
      await expect(mockGameService.updateGame('nonexistent', { name: 'X' })).rejects.toThrow(
        'Game not found'
      );
    });
  });

  describe('deleteGame', () => {
    it('removes the game from the store', async () => {
      await mockGameService.deleteGame('game-4');
      const game = await mockGameService.getGameById('game-4');
      expect(game).toBeNull();
    });
  });

  describe('isGameAssigned', () => {
    it('returns true for a game with assignments', async () => {
      const result = await mockGameService.isGameAssigned('game-1');
      expect(result).toBe(true);
    });

    it('returns false for a game with no assignments', async () => {
      const result = await mockGameService.isGameAssigned('game-4');
      expect(result).toBe(false);
    });
  });

  describe('duplicateGame', () => {
    it('creates a copy with "(Copy)" suffix', async () => {
      const copy = await mockGameService.duplicateGame('game-1', TUTOR_ID);
      expect(copy.name).toBe('Times Tables (Copy)');
      expect(copy.gameType).toBe(GameType.FLASHCARDS);
      expect(copy.id).not.toBe('game-1');
    });

    it('throws for unknown source game', async () => {
      await expect(mockGameService.duplicateGame('nonexistent', TUTOR_ID)).rejects.toThrow(
        'Game not found'
      );
    });
  });
});
