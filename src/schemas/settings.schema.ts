import { z } from 'zod';

/**
 * Profile settings validation schema
 */
export const profileSettingsSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
  avatarUrl: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
});

export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;

/**
 * Notification preferences validation schema
 */
export const notificationSettingsSchema = z.object({
  assignmentReminders: z.boolean().default(true),
  completionNotifications: z.boolean().default(true),
  weeklyProgressSummary: z.boolean().default(false),
});

export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;

/**
 * Theme preferences validation schema
 */
export const themeSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
});

export type ThemeSettingsFormData = z.infer<typeof themeSettingsSchema>;

/**
 * Contact support form validation schema
 */
export const contactSupportSchema = z.object({
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

export type ContactSupportFormData = z.infer<typeof contactSupportSchema>;

/**
 * Password change validation schema (placeholder for future implementation)
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
