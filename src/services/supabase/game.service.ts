/**
 * Supabase Game Service (Auth UID Based)
 * All functions use the current authenticated user
 */

import { supabase } from '@/lib/supabase';
import { Game, GameWithData, CreateGameInput, UpdateGameInput, GameData, GameType } from '@/types/game';

/**
 * Get Tutor ID for current authenticated user
 */
async function getCurrentTutorId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No authenticated user');
  }

  const { data, error } = await supabase
    .from('Tutor')
    .select('id')
    .eq('userId', user.id)
    .single();

  if (error || !data) {
    throw new Error('Tutor profile not found');
  }

  return data.id;
}

/**
 * Get all games for current authenticated tutor
 */
export async function getMyGames(): Promise<Game[]> {
  const tutorId = await getCurrentTutorId();

  const { data, error } = await supabase
    .from('Game')
    .select(`
      *,
      assignments:Assignment(count)
    `)
    .eq('tutorId', tutorId)
    .order('createdAt', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch games: ${error.message}`);
  }

  return data.map((game: any) => ({
    id: game.id,
    tutorId: game.tutorId,
    name: game.name,
    gameType: game.gameType as GameType,
    gameData: game.gameData,
    createdAt: new Date(game.createdAt),
    updatedAt: new Date(game.updatedAt),
    _count: {
      assignments: game.assignments?.[0]?.count || 0,
    },
  }));
}

/**
 * Get a single game by ID with parsed data
 */
export async function getGameById(gameId: string): Promise<GameWithData | null> {
  const { data, error } = await supabase
    .from('Game')
    .select('*')
    .eq('id', gameId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch game: ${error.message}`);
  }

  return {
    id: data.id,
    tutorId: data.tutorId,
    name: data.name,
    gameType: data.gameType as GameType,
    gameData: JSON.parse(data.gameData) as GameData,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

/**
 * Get games filtered by type for current tutor
 */
export async function getMyGamesByType(type: GameType): Promise<Game[]> {
  const tutorId = await getCurrentTutorId();

  const { data, error } = await supabase
    .from('Game')
    .select('*')
    .eq('tutorId', tutorId)
    .eq('gameType', type)
    .order('createdAt', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch games by type: ${error.message}`);
  }

  return data.map((game: any) => ({
    id: game.id,
    tutorId: game.tutorId,
    name: game.name,
    gameType: game.gameType as GameType,
    gameData: game.gameData,
    createdAt: new Date(game.createdAt),
    updatedAt: new Date(game.updatedAt),
  }));
}

/**
 * Create a new game for current authenticated tutor
 */
export async function createGame(input: CreateGameInput): Promise<GameWithData> {
  const tutorId = await getCurrentTutorId();

  const { data, error } = await supabase
    .from('Game')
    .insert({
      tutorId: tutorId,
      name: input.name,
      gameType: input.gameType,
      gameData: JSON.stringify(input.gameData),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create game: ${error.message}`);
  }

  return {
    id: data.id,
    tutorId: data.tutorId,
    name: data.name,
    gameType: data.gameType as GameType,
    gameData: JSON.parse(data.gameData) as GameData,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
    _count: {
      assignments: 0,
    },
  };
}

/**
 * Update a game
 */
export async function updateGame(
  gameId: string,
  input: UpdateGameInput
): Promise<GameWithData> {
  const updateData: any = {};

  if (input.name !== undefined) {
    updateData.name = input.name;
  }

  if (input.gameData !== undefined) {
    updateData.gameData = JSON.stringify(input.gameData);
  }

  const { data, error } = await supabase
    .from('Game')
    .update(updateData)
    .eq('id', gameId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update game: ${error.message}`);
  }

  return {
    id: data.id,
    tutorId: data.tutorId,
    name: data.name,
    gameType: data.gameType as GameType,
    gameData: JSON.parse(data.gameData) as GameData,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

/**
 * Delete a game
 */
export async function deleteGame(gameId: string): Promise<void> {
  const { error } = await supabase
    .from('Game')
    .delete()
    .eq('id', gameId);

  if (error) {
    throw new Error(`Failed to delete game: ${error.message}`);
  }
}

/**
 * Check if game is assigned to any groups
 */
export async function isGameAssigned(gameId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('Assignment')
    .select('id')
    .eq('gameId', gameId)
    .limit(1);

  if (error) {
    throw new Error(`Failed to check game assignments: ${error.message}`);
  }

  return data.length > 0;
}

/**
 * Duplicate a game
 */
export async function duplicateGame(gameId: string): Promise<GameWithData> {
  const original = await getGameById(gameId);

  if (!original) {
    throw new Error('Game not found');
  }

  return createGame({
    name: `${original.name} (Copy)`,
    gameType: original.gameType,
    gameData: original.gameData,
  });
}
