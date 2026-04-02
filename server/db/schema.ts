import { pgTable, pgEnum, uuid, text, timestamp, integer, jsonb, primaryKey } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['TUTOR', 'STUDENT'])
export const subscriptionStatusEnum = pgEnum('subscription_status', ['FREE', 'TRIALING', 'ACTIVE', 'CANCELLED', 'EXPIRED'])
export const gameTypeEnum = pgEnum('game_type', ['PAIRS', 'FLASHCARDS', 'MULTIPLE_CHOICE', 'SPLAT', 'SWIPE'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  role: roleEnum('role').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  emailVerified: text('email_verified').default('false'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const tutors = pgTable('tutors', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subscriptionStatus: subscriptionStatusEnum('subscription_status').notNull().default('FREE'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  trialEndsAt: timestamp('trial_ends_at'),
  subscriptionPeriodEnd: timestamp('subscription_period_end'),
  trialReminderSentAt: timestamp('trial_reminder_sent_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const students = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subscriptionStatus: subscriptionStatusEnum('subscription_status').notNull().default('FREE'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  trialEndsAt: timestamp('trial_ends_at'),
  subscriptionPeriodEnd: timestamp('subscription_period_end'),
  trialReminderSentAt: timestamp('trial_reminder_sent_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const games = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom(),
  tutorId: uuid('tutor_id').notNull().references(() => tutors.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  gameType: gameTypeEnum('game_type').notNull(),
  gameData: jsonb('game_data').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const groups = pgTable('groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  tutorId: uuid('tutor_id').notNull().references(() => tutors.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  joinCode: text('join_code').notNull().unique(),
  ageRange: text('age_range'),
  subjectArea: text('subject_area'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const groupMembers = pgTable('group_members', {
  groupId: uuid('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
}, (t) => [
  primaryKey({ columns: [t.groupId, t.studentId] }),
])

export const assignments = pgTable('assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  gameId: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  dueDate: timestamp('due_date'),
  passPercentage: integer('pass_percentage'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const gameAttempts = pgTable('game_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  assignmentId: uuid('assignment_id').notNull().references(() => assignments.id, { onDelete: 'cascade' }),
  scorePercentage: integer('score_percentage').notNull(),
  timeTaken: integer('time_taken').notNull(),
  attemptData: jsonb('attempt_data').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Inferred types
export type SelectUser = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert
export type SelectTutor = typeof tutors.$inferSelect
export type InsertTutor = typeof tutors.$inferInsert
export type SelectStudent = typeof students.$inferSelect
export type InsertStudent = typeof students.$inferInsert
export type SelectGame = typeof games.$inferSelect
export type SelectGroup = typeof groups.$inferSelect
export type SelectAssignment = typeof assignments.$inferSelect
export type SelectGameAttempt = typeof gameAttempts.$inferSelect
