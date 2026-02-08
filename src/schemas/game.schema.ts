import { z } from 'zod';
import { GameType } from '@/types/game';

// Base game schema
export const gameBaseSchema = z.object({
  name: z
    .string()
    .min(1, 'Game name is required')
    .min(3, 'Game name must be at least 3 characters')
    .max(100, 'Game name must be less than 100 characters'),
  description: z.string().optional(),
});

// Pairs game schemas
export const pairsItemSchema = z.object({
  id: z.string(),
  leftText: z.string().min(1, 'Left text is required'),
  rightText: z.string().min(1, 'Right text is required'),
  leftImage: z.string().optional(),
  rightImage: z.string().optional(),
});

export const pairsGameDataSchema = z.object({
  description: z.string().optional(),
  items: z.array(pairsItemSchema).min(3, 'At least 3 pairs are required'),
});

// Flashcards game schemas
export const flashcardItemSchema = z.object({
  id: z.string(),
  front: z.string().min(1, 'Front text is required'),
  back: z.string().min(1, 'Back text is required'),
  frontImage: z.string().optional(),
  backImage: z.string().optional(),
});

export const flashcardsGameDataSchema = z.object({
  description: z.string().optional(),
  cards: z.array(flashcardItemSchema).min(5, 'At least 5 flashcards are required'),
});

// Multiple choice game schemas
export const multipleChoiceOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
});

export const multipleChoiceQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1, 'Question text is required'),
  image: z.string().optional(),
  options: z
    .array(multipleChoiceOptionSchema)
    .min(2, 'At least 2 options are required')
    .max(4, 'Maximum 4 options allowed')
    .refine(
      (options) => options.filter((o) => o.isCorrect).length === 1,
      'Exactly one option must be marked as correct'
    ),
});

export const multipleChoiceGameDataSchema = z.object({
  description: z.string().optional(),
  questions: z.array(multipleChoiceQuestionSchema).min(5, 'At least 5 questions are required'),
});

// Splat game schemas
export const splatItemSchema = z.object({
  id: z.string(),
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  image: z.string().optional(),
});

export const splatGameDataSchema = z.object({
  description: z.string().optional(),
  timeLimit: z.number().min(5).max(60).optional(),
  items: z.array(splatItemSchema).min(10, 'At least 10 items are required'),
});

// Swipe game schemas
export const swipeItemSchema = z.object({
  id: z.string(),
  statement: z.string().min(1, 'Statement is required'),
  isCorrect: z.boolean(),
  image: z.string().optional(),
  explanation: z.string().optional(),
});

export const swipeGameDataSchema = z.object({
  description: z.string().optional(),
  items: z.array(swipeItemSchema).min(10, 'At least 10 items are required'),
});

// Create game schema (combines base + game data)
export const createGameSchema = z.object({
  name: z.string().min(3, 'Game name must be at least 3 characters'),
  gameType: z.nativeEnum(GameType),
  gameData: z.union([
    pairsGameDataSchema,
    flashcardsGameDataSchema,
    multipleChoiceGameDataSchema,
    splatGameDataSchema,
    swipeGameDataSchema,
  ]),
});

export type CreateGameFormData = z.infer<typeof createGameSchema>;
