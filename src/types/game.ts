// Game types and data structures

export enum GameType {
  PAIRS = 'PAIRS',
  FLASHCARDS = 'FLASHCARDS',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SPLAT = 'SPLAT',
  SWIPE = 'SWIPE',
}

// Base game interface
export interface Game {
  id: string;
  tutorId: string;
  name: string;
  gameType: GameType;
  gameData: string; // JSON string of type-specific data
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    assignments: number;
  };
}

// Parsed game data interfaces

export interface PairsItem {
  id: string;
  leftText: string;
  rightText: string;
  leftImage?: string;
  rightImage?: string;
}

export interface PairsGameData {
  description?: string;
  items: PairsItem[];
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  frontImage?: string;
  backImage?: string;
}

export interface FlashcardsGameData {
  description?: string;
  cards: FlashcardItem[];
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  image?: string;
  options: MultipleChoiceOption[];
}

export interface MultipleChoiceGameData {
  description?: string;
  questions: MultipleChoiceQuestion[];
}

export interface SplatItem {
  id: string;
  question: string;
  answer: string;
  image?: string;
}

export interface SplatGameData {
  description?: string;
  timeLimit?: number; // seconds per question
  items: SplatItem[];
}

export interface SwipeItem {
  id: string;
  statement: string;
  isCorrect: boolean;
  image?: string;
  explanation?: string;
}

export interface SwipeGameData {
  description?: string;
  items: SwipeItem[];
}

// Union type for all game data
export type GameData =
  | PairsGameData
  | FlashcardsGameData
  | MultipleChoiceGameData
  | SplatGameData
  | SwipeGameData;

// Game with parsed data
export interface GameWithData extends Omit<Game, 'gameData'> {
  gameData: GameData;
}

// Create/Update input
export interface CreateGameInput {
  name: string;
  gameType: GameType;
  gameData: GameData;
}

export interface UpdateGameInput {
  name?: string;
  gameData?: GameData;
}

// Game template metadata
export interface GameTemplate {
  type: GameType;
  name: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  minItems: number;
}

// Helper type guards
export function isPairsGame(data: GameData): data is PairsGameData {
  return 'items' in data && Array.isArray(data.items);
}

export function isFlashcardsGame(data: GameData): data is FlashcardsGameData {
  return 'cards' in data && Array.isArray(data.cards);
}

export function isMultipleChoiceGame(data: GameData): data is MultipleChoiceGameData {
  return 'questions' in data && Array.isArray(data.questions);
}

export function isSplatGame(data: GameData): data is SplatGameData {
  return 'items' in data && Array.isArray(data.items) && 'timeLimit' in data;
}

export function isSwipeGame(data: GameData): data is SwipeGameData {
  return 'items' in data && Array.isArray(data.items) && data.items.some((item: any) => 'isCorrect' in item);
}
