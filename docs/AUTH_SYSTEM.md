# Authentication System (Development)

This document describes the temporary role-based authentication system for development.

## Overview

A simple, hardcoded authentication system that allows developers to switch between TUTOR and STUDENT roles without implementing full authentication. This enables parallel development of both dashboards.

## Features

- **Role-based access control** with TUTOR and STUDENT roles
- **Protected routes** that redirect based on authentication status and role
- **Dev role switcher** (floating button, dev mode only)
- **Persistent sessions** using localStorage
- **TypeScript types** for type-safe development

## Architecture

### File Structure

```
src/
├── types/
│   └── auth.ts                 # TypeScript types and enums
├── contexts/
│   └── AuthContext.tsx         # Auth context provider
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx  # Route protection HOC
│   └── dev/
│       └── RoleSwitcher.tsx    # Dev-only role switcher
├── pages/
│   ├── Home.tsx                # Role selection page
│   ├── tutor/
│   │   └── TutorDashboard.tsx
│   └── student/
│       └── StudentDashboard.tsx
└── lib/
    ├── auth.ts                 # Convenience re-exports
    └── auth-utils.ts           # Utility functions
```

## Usage

### 1. Using the Auth Context

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { session, isTutor, isStudent, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <p>Welcome, {session.user.email}</p>
      {isTutor && <p>You are a tutor</p>}
      {isStudent && <p>You are a student</p>}
    </div>
  );
}
```

### 2. Protecting Routes

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Role } from '@/types/auth';

// Require authentication only
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

// Require specific role
<Route
  path="/tutor/dashboard"
  element={
    <ProtectedRoute requiredRole={Role.TUTOR}>
      <TutorDashboard />
    </ProtectedRoute>
  }
/>
```

### 3. Using Utility Functions

```tsx
import { isTutor, isStudent, getDisplayName, getHomePath } from '@/lib/auth-utils';
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { session } = useAuth();

  if (isTutor(session)) {
    // Tutor-specific logic
  }

  if (isStudent(session)) {
    // Student-specific logic
  }

  const displayName = getDisplayName(session);
  const homePath = getHomePath(session.user.role);
}
```

### 4. Role Switching (Dev Only)

The `RoleSwitcher` component appears as a floating button in the bottom-right corner during development:

- Click to open menu
- Select "Switch to Tutor" or "Switch to Student"
- Current role is highlighted with an "Active" badge
- "Log Out" option clears the session

**Note:** This component automatically hides in production (`import.meta.env.PROD`).

## Routes

### Public Routes
- `/` - Home page with role selection

### Protected Routes
- `/tutor/dashboard` - Tutor dashboard (requires TUTOR role)
- `/student/dashboard` - Student dashboard (requires STUDENT role)

### Route Protection Behavior
- Unauthenticated users → Redirect to `/`
- Wrong role → Redirect to appropriate dashboard
- Correct role → Render protected content

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Tutor
```typescript
interface Tutor {
  id: string;
  userId: string;
  subscriptionStatus: SubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

### Student
```typescript
interface Student {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### UserSession
```typescript
interface UserSession {
  user: User;
  tutor?: Tutor;      // Present if role is TUTOR
  student?: Student;  // Present if role is STUDENT
}
```

## Hardcoded Dev Users

### Tutor
```
ID: tutor-dev-1
Email: tutor@dev.local
Role: TUTOR
Subscription: FREE
```

### Student
```
ID: student-dev-1
Email: student@dev.local
Role: STUDENT
```

## Auth Context API

### State
- `session: UserSession | null` - Current user session
- `isAuthenticated: boolean` - Whether user is logged in
- `isTutor: boolean` - Whether current user is a tutor
- `isStudent: boolean` - Whether current user is a student

### Methods
- `login(role: Role)` - Log in as specified role
- `logout()` - Clear session
- `switchRole(role: Role)` - Switch to different role

## Storage

Sessions are persisted in `localStorage` using the key `dev_role`:
- Value: `"TUTOR"` or `"STUDENT"`
- Automatically loaded on page refresh
- Cleared on logout

## Migration to Real Auth

When ready to implement real authentication:

1. **Keep the types** (`src/types/auth.ts`)
2. **Update AuthContext** to connect to real API
3. **Replace hardcoded users** with API calls
4. **Add token management** (JWT, cookies, etc.)
5. **Update login/logout** to call API endpoints
6. **Remove RoleSwitcher** component
7. **Add real login/signup forms**
8. **Implement session validation**

### Minimal Changes Required

The current architecture is designed for easy migration:

```typescript
// Before (hardcoded)
const login = (role: Role) => {
  const newSession = role === Role.TUTOR ? DEV_TUTOR_SESSION : DEV_STUDENT_SESSION;
  setSession(newSession);
  localStorage.setItem('dev_role', role);
};

// After (real auth)
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const session = await response.json();
  setSession(session);
  localStorage.setItem('auth_token', session.token);
};
```

All components using `useAuth()` will continue to work without changes.

## Best Practices

1. **Always use `useAuth()` hook** instead of accessing context directly
2. **Use utility functions** for role checks instead of direct comparisons
3. **Keep session checks simple** - the context handles complexity
4. **Test both roles** when building features that differ by role
5. **Use ProtectedRoute** for any authenticated pages
6. **Don't bypass route protection** in components

## Common Patterns

### Conditional Rendering by Role

```tsx
const { isTutor, isStudent } = useAuth();

return (
  <>
    {isTutor && <TutorControls />}
    {isStudent && <StudentView />}
  </>
);
```

### Navigation by Role

```tsx
const { session } = useAuth();
const navigate = useNavigate();

const goHome = () => {
  const path = getHomePath(session.user.role);
  navigate(path);
};
```

### Access User Data

```tsx
const { session } = useAuth();

return (
  <div>
    <p>Email: {session.user.email}</p>
    {session.tutor && (
      <p>Subscription: {session.tutor.subscriptionStatus}</p>
    )}
  </div>
);
```

## Testing

### Manual Testing Steps

1. Start dev server: `npm run dev`
2. Visit home page: `http://localhost:5173`
3. Click "Continue as Tutor"
4. Verify tutor dashboard loads
5. Use role switcher to switch to Student
6. Verify student dashboard loads
7. Try accessing `/tutor/dashboard` as student (should redirect)
8. Log out and verify redirect to home page
9. Refresh page and verify session persists

### What to Test

- [ ] Home page shows both role options
- [ ] Clicking role navigates to correct dashboard
- [ ] Role switcher appears in dev mode
- [ ] Role switcher changes role correctly
- [ ] Protected routes redirect when unauthenticated
- [ ] Protected routes redirect when wrong role
- [ ] Session persists on page refresh
- [ ] Logout clears session and redirects
- [ ] Role switcher hidden in production build

## Future Enhancements

When adding real authentication, consider:

- Password hashing (bcrypt)
- JWT token management
- Refresh tokens
- Email verification
- Password reset flow
- OAuth providers (Google, Microsoft)
- Two-factor authentication
- Session expiration
- CSRF protection
- Rate limiting
