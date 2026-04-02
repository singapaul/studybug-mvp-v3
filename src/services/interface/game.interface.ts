import { Game, GameWithData, CreateGameInput, UpdateGameInput, GameType } from '@/types/game';

export interface GameService {
  getMyGames(userId: string): Promise<Game[]>;
  getGameById(gameId: string): Promise<GameWithData | null>;
  getMyGamesByType(userId: string, type: GameType): Promise<Game[]>;
  createGame(userId: string, input: CreateGameInput): Promise<GameWithData>;
  updateGame(gameId: string, input: UpdateGameInput): Promise<GameWithData>;
  deleteGame(gameId: string): Promise<void>;
  isGameAssigned(gameId: string): Promise<boolean>;
  duplicateGame(gameId: string, userId: string): Promise<GameWithData>;
}
