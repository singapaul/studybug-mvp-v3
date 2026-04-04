import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import * as schema from './schema'

export async function createTestDb() {
  const client = new PGlite()
  const db = drizzle(client, { schema })

  await client.exec(`
    CREATE TYPE role AS ENUM ('TUTOR', 'STUDENT');
    CREATE TYPE subscription_status AS ENUM ('FREE', 'TRIALING', 'ACTIVE', 'CANCELLED', 'EXPIRED');
    CREATE TYPE game_type AS ENUM ('PAIRS', 'FLASHCARDS', 'MULTIPLE_CHOICE', 'SPLAT', 'SWIPE');

    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      clerk_id TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      role role NOT NULL,
      first_name TEXT,
      last_name TEXT,
      email_verified TEXT DEFAULT 'false',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE tutors (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      subscription_status subscription_status NOT NULL DEFAULT 'FREE',
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      trial_ends_at TIMESTAMP,
      subscription_period_end TIMESTAMP,
      trial_reminder_sent_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE students (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      subscription_status subscription_status NOT NULL DEFAULT 'FREE',
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      trial_ends_at TIMESTAMP,
      subscription_period_end TIMESTAMP,
      trial_reminder_sent_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE groups (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      join_code TEXT NOT NULL UNIQUE,
      age_range TEXT,
      subject_area TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE games (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      game_type game_type NOT NULL,
      game_data JSONB NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE group_members (
      group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
      student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
      PRIMARY KEY (group_id, student_id)
    );

    CREATE TABLE assignments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
      game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
      due_date TIMESTAMP,
      pass_percentage INTEGER,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE game_attempts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      score_percentage INTEGER NOT NULL,
      time_taken INTEGER NOT NULL,
      attempt_data JSONB NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)

  return db
}
