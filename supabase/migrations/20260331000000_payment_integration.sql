-- Migration: Payment Integration
-- Adds TRIALING subscription status, user name fields, Stripe columns,
-- Student subscription tracking, updated handle_new_user trigger, and complete RLS policies.

-- ============================================================================
-- 1. Extend subscription_status enum
-- ============================================================================
ALTER TYPE public.subscription_status ADD VALUE IF NOT EXISTS 'TRIALING';

-- ============================================================================
-- 2. Add first_name / last_name to User table
-- ============================================================================
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text;

-- ============================================================================
-- 3. Add Stripe columns to Tutor table
-- ============================================================================
ALTER TABLE "Tutor"
  ADD COLUMN IF NOT EXISTS stripe_customer_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_price_id text,
  ADD COLUMN IF NOT EXISTS subscription_period_end timestamptz,
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz;

-- ============================================================================
-- 4. Add subscription + Stripe columns to Student table
-- ============================================================================
ALTER TABLE "Student"
  ADD COLUMN IF NOT EXISTS subscription_status subscription_status DEFAULT 'FREE',
  ADD COLUMN IF NOT EXISTS stripe_customer_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_price_id text,
  ADD COLUMN IF NOT EXISTS subscription_period_end timestamptz,
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz;

-- ============================================================================
-- 5. Update handle_new_user trigger to store name + initialise Student subscription
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role text;
BEGIN
    user_role := NEW.raw_user_meta_data->>'role';

    IF user_role IS NULL THEN
        user_role := 'STUDENT';
    END IF;

    IF user_role NOT IN ('TUTOR', 'STUDENT') THEN
        RAISE EXCEPTION 'Invalid role: %. Must be TUTOR or STUDENT', user_role;
    END IF;

    INSERT INTO public."User" (
        id, email, password_hash, role,
        first_name, last_name,
        email_verified, created_at, updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        '',
        user_role::role,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.email_confirmed_at IS NOT NULL,
        NOW(),
        NOW()
    );

    IF user_role = 'TUTOR' THEN
        INSERT INTO public."Tutor" (user_id, subscription_status, created_at, updated_at)
        VALUES (NEW.id, 'FREE', NOW(), NOW());
    ELSIF user_role = 'STUDENT' THEN
        INSERT INTO public."Student" (user_id, subscription_status, created_at, updated_at)
        VALUES (NEW.id, 'FREE', NOW(), NOW());
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. RLS policies — drop stale ones and add complete set
-- ============================================================================

-- User
DROP POLICY IF EXISTS "Users can view own data" ON "User";
CREATE POLICY "Users can view own data" ON "User"
    FOR SELECT USING (auth.uid() = id);

-- Tutor
DROP POLICY IF EXISTS "Tutors can read own row" ON "Tutor";
CREATE POLICY "Tutors can read own row" ON "Tutor"
    FOR SELECT USING (auth.uid() = user_id);

-- Student: self-read
DROP POLICY IF EXISTS "Students can read own row" ON "Student";
CREATE POLICY "Students can read own row" ON "Student"
    FOR SELECT USING (auth.uid() = user_id);

-- Student: tutor can read their students
DROP POLICY IF EXISTS "Tutors can read their students" ON "Student";
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

-- Group: tutors manage; students view own
DROP POLICY IF EXISTS "Tutors can manage own groups" ON "Group";
CREATE POLICY "Tutors can manage own groups" ON "Group"
    FOR ALL USING (
        tutor_id IN (SELECT id FROM "Tutor" WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Students can view their groups" ON "Group";
CREATE POLICY "Students can view their groups" ON "Group"
    FOR SELECT USING (
        id IN (
            SELECT group_id FROM "GroupMember"
            WHERE student_id IN (SELECT id FROM "Student" WHERE user_id = auth.uid())
        )
    );

-- GroupMember: tutors manage; students view own
DROP POLICY IF EXISTS "Tutors can manage their group members" ON "GroupMember";
CREATE POLICY "Tutors can manage their group members" ON "GroupMember"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "Group" g
            JOIN "Tutor" t ON t.id = g.tutor_id
            WHERE g.id = group_id AND t.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Students can read own group memberships" ON "GroupMember";
CREATE POLICY "Students can read own group memberships" ON "GroupMember"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "Student" s
            WHERE s.id = student_id AND s.user_id = auth.uid()
        )
    );

-- Game: tutors manage; students view assigned
DROP POLICY IF EXISTS "Tutors can manage own games" ON "Game";
CREATE POLICY "Tutors can manage own games" ON "Game"
    FOR ALL USING (
        tutor_id IN (SELECT id FROM "Tutor" WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Students can view assigned games" ON "Game";
CREATE POLICY "Students can view assigned games" ON "Game"
    FOR SELECT USING (
        id IN (
            SELECT a.game_id FROM "Assignment" a
            JOIN "GroupMember" gm ON gm.group_id = a.group_id
            JOIN "Student" s ON s.id = gm.student_id
            WHERE s.user_id = auth.uid()
        )
    );

-- Assignment: tutors manage; students view
DROP POLICY IF EXISTS "Tutors can manage own assignments" ON "Assignment";
CREATE POLICY "Tutors can manage own assignments" ON "Assignment"
    FOR ALL USING (
        game_id IN (
            SELECT id FROM "Game"
            WHERE tutor_id IN (SELECT id FROM "Tutor" WHERE user_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Students can view assignments" ON "Assignment";
CREATE POLICY "Students can view assignments" ON "Assignment"
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM "GroupMember"
            WHERE student_id IN (SELECT id FROM "Student" WHERE user_id = auth.uid())
        )
    );

-- GameAttempt: students manage own; tutors read for their games
DROP POLICY IF EXISTS "Students can manage own attempts" ON "GameAttempt";
CREATE POLICY "Students can manage own attempts" ON "GameAttempt"
    FOR ALL USING (
        student_id IN (SELECT id FROM "Student" WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Tutors can read attempts for their games" ON "GameAttempt";
CREATE POLICY "Tutors can read attempts for their games" ON "GameAttempt"
    FOR SELECT USING (
        assignment_id IN (
            SELECT a.id FROM "Assignment" a
            JOIN "Game" g ON g.id = a.game_id
            JOIN "Tutor" t ON t.id = g.tutor_id
            WHERE t.user_id = auth.uid()
        )
    );
