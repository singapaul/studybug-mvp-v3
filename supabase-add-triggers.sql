-- Add Auth Triggers to Existing Supabase Schema (Fixed for camelCase)
-- Run this if you already have tables created

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
    -- Expected format: raw_user_meta_data: { role: 'TUTOR' or 'STUDENT' }
    user_role := NEW.raw_user_meta_data->>'role';

    -- Default to STUDENT if no role specified
    IF user_role IS NULL THEN
        user_role := 'STUDENT';
    END IF;

    -- Validate role
    IF user_role NOT IN ('TUTOR', 'STUDENT') THEN
        RAISE EXCEPTION 'Invalid role: %. Must be TUTOR or STUDENT', user_role;
    END IF;

    -- Create User record (camelCase columns)
    INSERT INTO public."User" (
        id,
        email,
        "passwordHash",
        role,
        "emailVerified",
        "createdAt",
        "updatedAt"
    ) VALUES (
        NEW.id,
        NEW.email,
        '', -- Password is managed by Supabase Auth, not stored here
        user_role::"Role",
        NEW.email_confirmed_at IS NOT NULL,
        NOW(),
        NOW()
    );

    -- Create role-specific record
    IF user_role = 'TUTOR' THEN
        INSERT INTO public."Tutor" (
            "userId",
            "subscriptionStatus",
            "createdAt",
            "updatedAt"
        ) VALUES (
            NEW.id,
            'FREE'::"SubscriptionStatus",
            NOW(),
            NOW()
        );
    ELSIF user_role = 'STUDENT' THEN
        INSERT INTO public."Student" (
            "userId",
            "createdAt",
            "updatedAt"
        ) VALUES (
            NEW.id,
            NOW(),
            NOW()
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- USER DELETION CLEANUP
-- ============================================================================

-- Function to handle user deletion (cleanup)
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete from User table (cascades to Tutor/Student)
    DELETE FROM public."User" WHERE id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- Trigger for user deletion
CREATE TRIGGER on_auth_user_deleted
    AFTER DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_delete();

-- ============================================================================
-- EMAIL VERIFICATION SYNC
-- ============================================================================

-- Function to sync email verification status
CREATE OR REPLACE FUNCTION public.handle_user_email_verified()
RETURNS TRIGGER AS $$
BEGIN
    -- Update emailVerified status when user confirms email (camelCase)
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public."User"
        SET "emailVerified" = true,
            "updatedAt" = NOW()
        WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;

-- Trigger for email verification
CREATE TRIGGER on_auth_user_email_verified
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_email_verified();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check that triggers were created successfully
SELECT
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name IN (
    'on_auth_user_created',
    'on_auth_user_deleted',
    'on_auth_user_email_verified'
)
ORDER BY trigger_name;

-- Expected output should show 3 triggers
