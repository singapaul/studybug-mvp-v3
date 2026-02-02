import { z } from 'zod';

/**
 * Schema for joining a group with a join code
 * Join codes are 6-character alphanumeric codes (uppercase letters and numbers)
 */
export const joinGroupSchema = z.object({
  joinCode: z
    .string()
    .min(1, 'Join code is required')
    .length(6, 'Join code must be exactly 6 characters')
    .regex(/^[A-Z0-9]{6}$/, 'Join code must contain only uppercase letters and numbers')
    .transform((val) => val.toUpperCase()), // Always convert to uppercase
});

export type JoinGroupFormData = z.infer<typeof joinGroupSchema>;
