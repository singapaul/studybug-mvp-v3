import { z } from 'zod';

export const createAssignmentSchema = z.object({
  gameId: z.string().min(1, 'Game is required'),
  groupId: z.string().min(1, 'Group is required'),
  dueDate: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val === '') return undefined;
      return val;
    })
    .refine(
      (val) => {
        if (!val) return true; // Optional field
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: 'Invalid date format' }
    )
    .refine(
      (val) => {
        if (!val) return true; // Optional field
        const date = new Date(val);
        const now = new Date();
        return date >= now;
      },
      { message: 'Due date must be in the future' }
    ),
  passPercentage: z
    .number()
    .min(0, 'Pass percentage must be at least 0')
    .max(100, 'Pass percentage must be at most 100')
    .default(70),
});

export const updateAssignmentSchema = z.object({
  dueDate: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val === '') return undefined;
      return val;
    })
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: 'Invalid date format' }
    ),
  passPercentage: z
    .number()
    .min(0, 'Pass percentage must be at least 0')
    .max(100, 'Pass percentage must be at most 100')
    .optional(),
});

export type CreateAssignmentFormData = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentFormData = z.infer<typeof updateAssignmentSchema>;
