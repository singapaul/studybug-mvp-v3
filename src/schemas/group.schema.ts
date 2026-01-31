import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, 'Group name is required')
    .min(3, 'Group name must be at least 3 characters')
    .max(100, 'Group name must be less than 100 characters'),
  ageRange: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  subjectArea: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
});

export const updateGroupSchema = z.object({
  name: z
    .string()
    .min(3, 'Group name must be at least 3 characters')
    .max(100, 'Group name must be less than 100 characters')
    .optional(),
  ageRange: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  subjectArea: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
export type UpdateGroupFormData = z.infer<typeof updateGroupSchema>;
