-- Supabase Schema for StudyBug MVP
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE role AS ENUM ('TUTOR', 'STUDENT');
CREATE TYPE subscription_status AS ENUM ('FREE', 'TRIALING', 'ACTIVE', 'CANCELLED', 'EXPIRED');
CREATE TYPE game_type AS ENUM ('PAIRS', 'FLASHCARDS', 'MULTIPLE_CHOICE', 'SPLAT', 'SWIPE');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- User table
-- Note: id matches auth.users.id, passwords managed by Supabase Auth
CREATE TABLE "User" (
    id uuid PRIMARY KEY, -- Set from auth.users.id, not auto-generated
    email text UNIQUE NOT NULL,
    password_hash text DEFAULT '', -- Not used, kept for compatibility
    role role NOT NULL,
    first_name text,
    last_name text,
    email_verified boolean DEFAULT false,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

CREATE INDEX idx_user_email ON "User"(email);

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tutor table
CREATE TABLE "Tutor" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    subscription_status subscription_status DEFAULT 'FREE',
    stripe_customer_id text UNIQUE,
    stripe_subscription_id text UNIQUE,
    stripe_price_id text,
    subscription_period_end timestamptz,
    trial_ends_at timestamptz,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

CREATE TRIGGER update_tutor_updated_at BEFORE UPDATE ON "Tutor"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Student table
CREATE TABLE "Student" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    subscription_status subscription_status DEFAULT 'FREE',
    stripe_customer_id text UNIQUE,
    stripe_subscription_id text UNIQUE,
    stripe_price_id text,
    subscription_period_end timestamptz,
    trial_ends_at timestamptz,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

CREATE TRIGGER update_student_updated_at BEFORE UPDATE ON "Student"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Group table
CREATE TABLE "Group" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id uuid NOT NULL REFERENCES "Tutor"(id) ON DELETE CASCADE,
    name text NOT NULL,
    age_range text,
    subject_area text,
    join_code text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

CREATE INDEX idx_group_tutor_id ON "Group"(tutor_id);
CREATE INDEX idx_group_join_code ON "Group"(join_code);

CREATE TRIGGER update_group_updated_at BEFORE UPDATE ON "Group"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Game table
CREATE TABLE "Game" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id uuid NOT NULL REFERENCES "Tutor"(id) ON DELETE CASCADE,
    name text NOT NULL,
    game_type game_type NOT NULL,
    game_data jsonb NOT NULL,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

CREATE INDEX idx_game_tutor_id ON "Game"(tutor_id);
CREATE INDEX idx_game_game_type ON "Game"(game_type);

CREATE TRIGGER update_game_updated_at BEFORE UPDATE ON "Game"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Assignment table
CREATE TABLE "Assignment" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id uuid NOT NULL REFERENCES "Game"(id) ON DELETE CASCADE,
    group_id uuid NOT NULL REFERENCES "Group"(id) ON DELETE CASCADE,
    due_date timestamptz,
    pass_percentage integer,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

CREATE INDEX idx_assignment_game_id ON "Assignment"(game_id);
CREATE INDEX idx_assignment_group_id ON "Assignment"(group_id);
CREATE INDEX idx_assignment_due_date ON "Assignment"(due_date);

CREATE TRIGGER update_assignment_updated_at BEFORE UPDATE ON "Assignment"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- GameAttempt table
CREATE TABLE "GameAttempt" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id uuid NOT NULL REFERENCES "Assignment"(id) ON DELETE CASCADE,
    student_id uuid NOT NULL REFERENCES "Student"(id) ON DELETE CASCADE,
    score_percentage real NOT NULL,
    time_taken integer NOT NULL,
    completed_at timestamptz DEFAULT NOW(),
    attempt_data jsonb NOT NULL
);

CREATE INDEX idx_game_attempt_assignment_id ON "GameAttempt"(assignment_id);
CREATE INDEX idx_game_attempt_student_id ON "GameAttempt"(student_id);
CREATE INDEX idx_game_attempt_completed_at ON "GameAttempt"(completed_at);

-- GroupMember table
CREATE TABLE "GroupMember" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id uuid NOT NULL REFERENCES "Group"(id) ON DELETE CASCADE,
    student_id uuid NOT NULL REFERENCES "Student"(id) ON DELETE CASCADE,
    joined_at timestamptz DEFAULT NOW(),
    UNIQUE(group_id, student_id)
);

CREATE INDEX idx_group_member_group_id ON "GroupMember"(group_id);
CREATE INDEX idx_group_member_student_id ON "GroupMember"(student_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tutor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Student" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Group" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Game" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Assignment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GameAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GroupMember" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- User: self-read
CREATE POLICY "Users can view own data" ON "User"
    FOR SELECT USING (auth.uid() = id);

-- Tutor: self-read only (writes go through service role / Edge Functions)
CREATE POLICY "Tutors can read own row" ON "Tutor"
    FOR SELECT USING (auth.uid() = user_id);

-- Student: self-read
CREATE POLICY "Students can read own row" ON "Student"
    FOR SELECT USING (auth.uid() = user_id);

-- Student: tutors can read their students (via group membership)
CREATE POLICY "Tutors can read their students" ON "Student"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "GroupMember" gm
            JOIN "Group" g ON g.id = gm.group_id
            JOIN "Tutor" t ON t.id = g.tutor_id
            WHERE gm.student_id = "Student".id
              AND t.user_id = auth.uid()
        )
    );

-- Group: tutors manage their own groups; students can view groups they belong to
CREATE POLICY "Tutors can manage own groups" ON "Group"
    FOR ALL USING (
        tutor_id IN (SELECT id FROM "Tutor" WHERE user_id = auth.uid())
    );

CREATE POLICY "Students can view their groups" ON "Group"
    FOR SELECT USING (
        id IN (
            SELECT group_id FROM "GroupMember"
            WHERE student_id IN (SELECT id FROM "Student" WHERE user_id = auth.uid())
        )
    );

-- GroupMember: tutors manage their group members; students see own memberships
CREATE POLICY "Tutors can manage their group members" ON "GroupMember"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "Group" g
            JOIN "Tutor" t ON t.id = g.tutor_id
            WHERE g.id = group_id AND t.user_id = auth.uid()
        )
    );

CREATE POLICY "Students can read own group memberships" ON "GroupMember"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "Student" s
            WHERE s.id = student_id AND s.user_id = auth.uid()
        )
    );

-- Game: tutors manage their own games; students can view games assigned to them
CREATE POLICY "Tutors can manage own games" ON "Game"
    FOR ALL USING (
        tutor_id IN (SELECT id FROM "Tutor" WHERE user_id = auth.uid())
    );

CREATE POLICY "Students can view assigned games" ON "Game"
    FOR SELECT USING (
        id IN (
            SELECT a.game_id FROM "Assignment" a
            JOIN "GroupMember" gm ON gm.group_id = a.group_id
            JOIN "Student" s ON s.id = gm.student_id
            WHERE s.user_id = auth.uid()
        )
    );

-- Assignment: tutors manage their assignments; students view assignments for their groups
CREATE POLICY "Tutors can manage own assignments" ON "Assignment"
    FOR ALL USING (
        game_id IN (
            SELECT id FROM "Game"
            WHERE tutor_id IN (SELECT id FROM "Tutor" WHERE user_id = auth.uid())
        )
    );

CREATE POLICY "Students can view assignments" ON "Assignment"
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM "GroupMember"
            WHERE student_id IN (SELECT id FROM "Student" WHERE user_id = auth.uid())
        )
    );

-- GameAttempt: students manage their own attempts; tutors can read attempts for their games
CREATE POLICY "Students can manage own attempts" ON "GameAttempt"
    FOR ALL USING (
        student_id IN (SELECT id FROM "Student" WHERE user_id = auth.uid())
    );

CREATE POLICY "Tutors can read attempts for their games" ON "GameAttempt"
    FOR SELECT USING (
        assignment_id IN (
            SELECT a.id FROM "Assignment" a
            JOIN "Game" g ON g.id = a.game_id
            JOIN "Tutor" t ON t.id = g.tutor_id
            WHERE t.user_id = auth.uid()
        )
    );

-- ============================================================================
-- AUTO-CREATE USER RECORDS ON AUTH SIGNUP
-- ============================================================================

-- Function to handle new user signup
-- This automatically creates User + Student/Tutor records when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role text;
BEGIN
    -- Get role from user metadata (set during signup)
    -- Expected format: raw_user_meta_data: { role: 'TUTOR' | 'STUDENT', first_name, last_name }
    user_role := NEW.raw_user_meta_data->>'role';

    -- Default to STUDENT if no role specified
    IF user_role IS NULL THEN
        user_role := 'STUDENT';
    END IF;

    -- Validate role
    IF user_role NOT IN ('TUTOR', 'STUDENT') THEN
        RAISE EXCEPTION 'Invalid role: %. Must be TUTOR or STUDENT', user_role;
    END IF;

    -- Create User record
    INSERT INTO public."User" (
        id,
        email,
        password_hash,
        role,
        first_name,
        last_name,
        email_verified,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        '', -- Password is managed by Supabase Auth, not stored here
        user_role::role,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.email_confirmed_at IS NOT NULL,
        NOW(),
        NOW()
    );

    -- Create role-specific record
    IF user_role = 'TUTOR' THEN
        INSERT INTO public."Tutor" (
            user_id,
            subscription_status,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            'FREE',
            NOW(),
            NOW()
        );
    ELSIF user_role = 'STUDENT' THEN
        INSERT INTO public."Student" (
            user_id,
            subscription_status,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            'FREE',
            NOW(),
            NOW()
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to handle user deletion (cleanup)
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete from User table (cascades to Tutor/Student)
    DELETE FROM public."User" WHERE id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for user deletion
CREATE TRIGGER on_auth_user_deleted
    AFTER DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_delete();

-- Function to sync email verification status
CREATE OR REPLACE FUNCTION public.handle_user_email_verified()
RETURNS TRIGGER AS $$
BEGIN
    -- Update email_verified status when user confirms email
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public."User"
        SET email_verified = true,
            updated_at = NOW()
        WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for email verification
CREATE TRIGGER on_auth_user_email_verified
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_email_verified();
