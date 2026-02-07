# Mock User Mode Feature Flag

## Overview

The `VITE_MOCK_USER_MODE` feature flag allows you to toggle between using mock/hardcoded users and real Supabase authentication. This is useful for:

- **Development and testing** - Quickly switch between user roles without creating accounts
- **Demo purposes** - Show the app without requiring real user credentials
- **Offline development** - Work on the frontend without needing Supabase connectivity

## Configuration

### Enable Mock User Mode

Add this to your `.env.local` file:

```env
VITE_MOCK_USER_MODE=true
```

### Use Real Authentication

Set it to false or remove the variable entirely:

```env
VITE_MOCK_USER_MODE=false
```

Or simply remove the line from `.env.local`.

## How It Works

### Mock User Mode (VITE_MOCK_USER_MODE=true)

When enabled:
- **Login Screen**: Shows role selection cards directly
- **Click "Continue as Tutor"**: Instantly logs you in as a mock tutor with hardcoded data
- **Click "Continue as Student"**: Instantly logs you in as a mock student with hardcoded data
- **No authentication required**: No email, no password, no Supabase calls
- **Session stored in localStorage**: Persists between page refreshes
- **Visual indicator**: Shows amber warning banner "Mock User Mode: Select your role to continue"

Mock user details:
```typescript
// Tutor
{
  id: 'tutor-dev-1',
  email: 'tutor@dev.local',
  role: Role.TUTOR
}

// Student
{
  id: 'student-dev-1',
  email: 'student@dev.local',
  role: Role.STUDENT
}
```

### Real Authentication Mode (VITE_MOCK_USER_MODE=false)

When disabled:
- **Login Screen**: Shows "Sign In" and "Create Account" buttons
- **Sign In Flow**:
  1. Click "Sign In"
  2. Enter email and password
  3. Authenticates with Supabase
  4. Redirects to dashboard

- **Sign Up Flow**:
  1. Click "Create Account"
  2. Select role (Tutor or Student)
  3. Enter email, password, and confirm password
  4. Creates Supabase account with role metadata
  5. Automatically creates role-specific profile
  6. Redirects to dashboard

- **Real Supabase integration**: All authentication handled by Supabase
- **Persistent sessions**: Auto-refresh tokens, email verification support
- **Secure**: Passwords encrypted, proper session management

## Files Modified

### `src/contexts/AuthContext.tsx`
- Added `MOCK_USER_MODE` constant
- Updated initialization logic to check flag
- Mock mode uses localStorage for session persistence
- Real mode uses Supabase auth state listener

### `src/pages/Login.tsx`
- Added `MOCK_USER_MODE` constant
- Renamed `handleDevRoleSelection` to `handleMockRoleSelection`
- Updated UI to show different flows based on flag
- Shows warning banner in mock mode

## Switching Between Modes

### To enable Mock User Mode:

1. Edit `.env.local`:
   ```env
   VITE_MOCK_USER_MODE=true
   ```

2. Restart dev server:
   ```bash
   npm run dev
   ```

3. Open login page - you'll see role selection directly

### To enable Real Authentication:

1. Edit `.env.local`:
   ```env
   VITE_MOCK_USER_MODE=false
   ```

2. Ensure Supabase credentials are set:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Restart dev server:
   ```bash
   npm run dev
   ```

4. Open login page - you'll see "Sign In" and "Create Account" buttons

## Environment Variable Reference

```env
# Mock User Mode
# When true: Use hardcoded mock users, no Supabase calls
# When false: Use real Supabase authentication
VITE_MOCK_USER_MODE=true

# Supabase Configuration (required when MOCK_USER_MODE=false)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Tips

- **Use Mock Mode for**: UI development, component testing, quick role switching
- **Use Real Auth for**: Integration testing, production, testing actual user flows
- **Default**: If `VITE_MOCK_USER_MODE` is not set, defaults to real authentication
- **Environment files**: `.env.local` is gitignored, safe for local configuration

## Troubleshooting

### "Cannot connect to Supabase" error
- Make sure `VITE_MOCK_USER_MODE=false` and Supabase credentials are correct
- Or set `VITE_MOCK_USER_MODE=true` to bypass Supabase

### Mock mode not working
- Check that `VITE_MOCK_USER_MODE=true` is in `.env.local`
- Restart dev server after changing environment variables
- Verify with: `console.log(import.meta.env.VITE_MOCK_USER_MODE)`

### Still showing authentication forms in mock mode
- Clear browser localStorage
- Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+F5)
- Check browser console for the amber warning banner
