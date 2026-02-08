# Supabase Authentication Flow

## Complete User Signup Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User fills out signup form                               │
│    - Email: tutor@example.com                               │
│    - Password: ********                                      │
│    - Role: TUTOR                                            │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend calls signUp() helper                           │
│    await signUp(email, password, Role.TUTOR)                │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Supabase Auth creates user in auth.users table          │
│    - id: 123e4567-e89b-12d3-a456-426614174000              │
│    - email: tutor@example.com                               │
│    - encrypted_password: [hashed by Supabase]              │
│    - raw_user_meta_data: { role: 'TUTOR' }                │
│    - email_confirmed_at: null (pending verification)        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. DATABASE TRIGGER: on_auth_user_created fires            │
│    → Calls handle_new_user() function                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. handle_new_user() reads role from metadata              │
│    user_role := NEW.raw_user_meta_data->>'role'            │
│    → user_role = 'TUTOR'                                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Creates User record in public.User table                │
│    INSERT INTO "User" (                                     │
│      id: 123e4567-e89b-12d3-a456-426614174000             │
│      email: tutor@example.com,                             │
│      role: 'TUTOR',                                        │
│      email_verified: false                                 │
│    )                                                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Creates Tutor record in public.Tutor table              │
│    INSERT INTO "Tutor" (                                    │
│      id: [auto-generated UUID],                            │
│      user_id: 123e4567-e89b-12d3-a456-426614174000,       │
│      subscription_status: 'FREE'                           │
│    )                                                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Supabase sends verification email                       │
│    → User clicks link in email                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Email verified - auth.users updated                     │
│    email_confirmed_at: 2024-01-15T10:30:00Z               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. TRIGGER: on_auth_user_email_verified fires            │
│     → Updates public.User.email_verified = true            │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 11. User can now sign in and access the app               │
└─────────────────────────────────────────────────────────────┘
```

## Database Tables After Signup

### auth.users (Supabase managed)
```sql
id                   | email              | role | raw_user_meta_data
---------------------|--------------------|----- |--------------------
123e...174000        | tutor@example.com  | NULL | {"role": "TUTOR"}
```

### public.User (Your app table)
```sql
id            | email              | role   | email_verified
--------------|--------------------| -------|---------------
123e...174000 | tutor@example.com  | TUTOR  | true
```

### public.Tutor (Role-specific table)
```sql
id            | user_id           | subscription_status
--------------|-------------------|--------------------
456f...290111 | 123e...174000     | FREE
```

## Sign In Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User enters email and password                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend calls signIn() helper                           │
│    const result = await signIn(email, password)             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Supabase Auth validates credentials                      │
│    → Returns user data and JWT token                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Read role from user metadata                             │
│    role = user.user_metadata.role                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Redirect based on role                                   │
│    - TUTOR   → /tutor/dashboard                            │
│    - STUDENT → /student/dashboard                          │
└─────────────────────────────────────────────────────────────┘
```

## Getting User Profile Data

```typescript
// Get current user
const user = await getCurrentUser();
// → { id: '123e...', email: 'tutor@example.com', ... }

// Get role
const role = await getCurrentUserRole();
// → 'TUTOR'

// Get full profile (includes Tutor or Student data)
const profile = await getUserProfile(user.id);
// → {
//     id: '456f...',
//     user_id: '123e...',
//     subscription_status: 'FREE',
//     role: 'TUTOR'
//   }
```

## Row Level Security (RLS)

Each table has RLS policies that use `auth.uid()` to ensure users can only access their own data:

### Example: Tutor can only see their own games
```sql
CREATE POLICY "Tutors can manage own games" ON "Game"
    FOR ALL USING (
        tutor_id IN (SELECT id FROM "Tutor" WHERE user_id = auth.uid())
    );
```

**How it works:**
1. User signs in → Gets JWT with `auth.uid()` set to their User.id
2. Query: `SELECT * FROM "Game"`
3. Supabase automatically adds: `WHERE tutor_id IN (SELECT id FROM "Tutor" WHERE user_id = auth.uid())`
4. User only sees their own games

## User Deletion Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Admin deletes user from Supabase dashboard              │
│    OR user requests account deletion                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. User deleted from auth.users                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. TRIGGER: on_auth_user_deleted fires                     │
│    → Calls handle_user_delete()                            │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Deletes from public.User                                │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. CASCADE DELETE removes:                                  │
│    - Tutor/Student record                                   │
│    - All Groups (if tutor)                                  │
│    - All Games (if tutor)                                   │
│    - All GroupMember records (if student)                   │
│    - All GameAttempts (if student)                          │
└─────────────────────────────────────────────────────────────┘
```

## Security Features

### ✅ Password Management
- Passwords NEVER stored in your tables
- Managed entirely by Supabase Auth
- Encrypted and salted by bcrypt

### ✅ JWT Tokens
- Automatic token refresh
- Stored in httpOnly cookies (if configured)
- Includes user metadata and role

### ✅ Row Level Security
- Database-level access control
- Cannot be bypassed from frontend
- Policies checked on every query

### ✅ Email Verification
- Optional but recommended
- Prevents fake signups
- Syncs to User.email_verified automatically

## Common Patterns

### Get logged-in user's Tutor ID
```typescript
const user = await getCurrentUser();
const { data } = await supabase
  .from('Tutor')
  .select('id')
  .eq('user_id', user.id)
  .single();

const tutorId = data.id;
```

### Get logged-in user's Student ID
```typescript
const user = await getCurrentUser();
const { data } = await supabase
  .from('Student')
  .select('id')
  .eq('user_id', user.id)
  .single();

const studentId = data.id;
```

### Check if user is a tutor
```typescript
const role = await getCurrentUserRole();
const isTutor = role === Role.TUTOR;
```

## Troubleshooting

### Issue: User created but no Tutor/Student record
**Cause**: Trigger didn't fire or role not set in metadata

**Fix**: Check that role is passed in signUp():
```typescript
await signUp(email, password, Role.TUTOR); // ✅ Correct
await signUp(email, password);             // ❌ Wrong - no role
```

### Issue: "relation does not exist" error
**Cause**: Schema not created

**Fix**: Run `supabase-schema.sql` in Supabase SQL Editor

### Issue: RLS policy blocks queries
**Cause**: User not authenticated or wrong auth context

**Fix**: Ensure user is signed in:
```typescript
const user = await getCurrentUser();
if (!user) {
  // Redirect to login
}
```

### Issue: Email not sent
**Cause**: Email templates not configured in Supabase

**Fix**:
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Configure SMTP settings (or use Supabase's built-in email)
3. Customize templates as needed
