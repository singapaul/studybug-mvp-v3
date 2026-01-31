/**
 * Mock Game Service
 * In production, this would call real API endpoints
 */

import { Game, GameWithData, CreateGameInput, UpdateGameInput, GameData, GameType } from '@/types/game';

const STORAGE_KEY = 'dev_games';

// Helper to get all games from localStorage
function getGames(): Game[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored).map((g: any) => ({
    ...g,
    createdAt: new Date(g.createdAt),
    updatedAt: new Date(g.updatedAt),
  }));
}

// Helper to save games to localStorage
function saveGames(games: Game[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

// Parse game data from JSON string
function parseGameData(game: Game): GameWithData {
  return {
    ...game,
    gameData: JSON.parse(game.gameData) as GameData,
  };
}

/**
 * Get all games for a tutor
 */
export async function getTutorGames(tutorId: string): Promise<Game[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const games = getGames().filter((g) => g.tutorId === tutorId);

  // Add assignment counts (mock)
  return games.map((game) => ({
    ...game,
    _count: {
      assignments: 0, // TODO: Implement with assignments
    },
  }));
}

/**
 * Get a single game by ID with parsed data
 */
export async function getGameById(gameId: string): Promise<GameWithData | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const games = getGames();
  const game = games.find((g) => g.id === gameId);
  if (!game) return null;

  return parseGameData(game);
}

/**
 * Get games filtered by type
 */
export async function getGamesByType(tutorId: string, type: GameType): Promise<Game[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return getGames().filter((g) => g.tutorId === tutorId && g.gameType === type);
}

/**
 * Create a new game
 */
export async function createGame(
  tutorId: string,
  input: CreateGameInput
): Promise<GameWithData> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const games = getGames();

  const newGame: Game = {
    id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    tutorId,
    name: input.name,
    gameType: input.gameType,
    gameData: JSON.stringify(input.gameData),
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: {
      assignments: 0,
    },
  };

  games.push(newGame);
  saveGames(games);

  return parseGameData(newGame);
}

/**
 * Update a game
 */
export async function updateGame(
  gameId: string,
  input: UpdateGameInput
): Promise<GameWithData> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const games = getGames();
  const index = games.findIndex((g) => g.id === gameId);

  if (index === -1) {
    throw new Error('Game not found');
  }

  const updatedGame: Game = {
    ...games[index],
    name: input.name ?? games[index].name,
    gameData: input.gameData ? JSON.stringify(input.gameData) : games[index].gameData,
    updatedAt: new Date(),
  };

  games[index] = updatedGame;
  saveGames(games);

  return parseGameData(updatedGame);
}

/**
 * Delete a game
 */
export async function deleteGame(gameId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const games = getGames();
  const filtered = games.filter((g) => g.id !== gameId);
  saveGames(filtered);
}

/**
 * Check if game is assigned to any groups (mock)
 */
export async function isGameAssigned(gameId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  // TODO: Check assignments when implemented
  return false;
}

/**
 * Duplicate a game
 */
export async function duplicateGame(
  gameId: string,
  tutorId: string
): Promise<GameWithData> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const original = await getGameById(gameId);
  if (!original) {
    throw new Error('Game not found');
  }

  return createGame(tutorId, {
    name: `${original.name} (Copy)`,
    gameType: original.gameType,
    gameData: original.gameData,
  });
}
