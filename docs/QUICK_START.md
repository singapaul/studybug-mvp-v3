# Quick Start Guide - StudyBug Auth System

## Getting Started

### 1. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 2. Choose Your Role

On the home page, you'll see two options:
- **Continue as Tutor** - Access the tutor dashboard
- **Continue as Student** - Access the student dashboard

### 3. Using the Role Switcher

In development mode, a floating button appears in the bottom-right corner:
- Click it to open the role switcher menu
- Switch between TUTOR and STUDENT roles instantly
- Log out to return to the home page

## Building Features

### Adding a New Tutor Page

1. Create the page component:

```tsx
// src/pages/tutor/CreateGame.tsx
import { useAuth } from '@/contexts/AuthContext';

export default function CreateGame() {
  const { session } = useAuth();

  return (
    <div>
      <h1>Create New Game</h1>
      <p>Tutor: {session?.user.email}</p>
      {/* Your game creation form */}
    </div>
  );
}
```

2. Add the route to `App.tsx`:

```tsx
import CreateGame from "./pages/tutor/CreateGame";

// Inside Routes:
<Route
  path="/tutor/games/create"
  element={
    <ProtectedRoute requiredRole={Role.TUTOR}>
      <CreateGame />
    </ProtectedRoute>
  }
/>
```

### Adding a New Student Page

Same process, but use `/student/*` path and `Role.STUDENT`:

```tsx
<Route
  path="/student/assignments"
  element={
    <ProtectedRoute requiredRole={Role.STUDENT}>
      <StudentAssignments />
    </ProtectedRoute>
  }
/>
```

### Creating Role-Aware Components

```tsx
import { useAuth } from '@/contexts/AuthContext';

export function DashboardHeader() {
  const { session, isTutor, isStudent } = useAuth();

  return (
    <header>
      <h1>
        {isTutor && 'Tutor Dashboard'}
        {isStudent && 'Student Dashboard'}
      </h1>
      <p>Welcome, {session?.user.email.split('@')[0]}</p>
    </header>
  );
}
```

### Using Utility Functions

```tsx
import { isTutor, getDisplayName, getHomePath } from '@/lib/auth-utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function UserMenu() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goHome = () => {
    const path = getHomePath(session!.user.role);
    navigate(path);
  };

  return (
    <div>
      <p>{getDisplayName(session)}</p>
      <button onClick={goHome}>Dashboard</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

## Available Hooks and Utilities

### useAuth()

```tsx
const {
  session,          // UserSession | null
  isAuthenticated,  // boolean
  isTutor,         // boolean
  isStudent,       // boolean
  login,           // (role: Role) => void
  logout,          // () => void
  switchRole,      // (role: Role) => void
} = useAuth();
```

### Utility Functions

```tsx
import {
  hasRole,           // (session, role) => boolean
  isTutor,          // (session) => boolean
  isStudent,        // (session) => boolean
  isAuthenticated,  // (session) => boolean
  getTutorProfile,  // (session) => Tutor | null
  getStudentProfile,// (session) => Student | null
  getDisplayName,   // (session) => string
  getHomePath,      // (role) => string
} from '@/lib/auth-utils';
```

## Common Tasks

### Navigate to Home Dashboard

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getHomePath } from '@/lib/auth-utils';

const { session } = useAuth();
const navigate = useNavigate();

navigate(getHomePath(session!.user.role));
```

### Check User Subscription (Tutor Only)

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { getTutorProfile } from '@/lib/auth-utils';

const { session } = useAuth();
const tutor = getTutorProfile(session);

if (tutor?.subscriptionStatus === 'FREE') {
  // Show upgrade prompt
}
```

### Show Role-Specific Content

```tsx
import { useAuth } from '@/contexts/AuthContext';

const { isTutor, isStudent } = useAuth();

return (
  <div>
    {isTutor && (
      <button>Create New Game</button>
    )}
    {isStudent && (
      <button>Join Group</button>
    )}
  </div>
);
```

### Protect a Component

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export function AdminPanel() {
  const { isTutor } = useAuth();

  if (!isTutor) {
    return <Navigate to="/" />;
  }

  return <div>Admin controls...</div>;
}
```

## Testing Both Roles

1. Log in as Tutor
2. Build your tutor feature
3. Use role switcher to switch to Student
4. Verify student experience
5. Switch back and iterate

## Development Workflow

### Typical Session

1. `npm run dev` - Start server
2. Choose role on home page
3. Build feature for that role
4. Use role switcher to test other role
5. Test navigation and route protection
6. Check session persistence (refresh page)

### What to Test

- [ ] Pages load correctly for each role
- [ ] Route protection works (try accessing wrong role's pages)
- [ ] Session persists on page refresh
- [ ] Role switcher toggles roles smoothly
- [ ] Logout clears session
- [ ] Navigation works correctly

## Project Structure

```
src/
├── types/
│   └── auth.ts                 # Types: User, Role, Session, etc.
├── contexts/
│   └── AuthContext.tsx         # Auth state management
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx  # Route protection
│   └── dev/
│       └── RoleSwitcher.tsx    # Dev role switcher
├── pages/
│   ├── Home.tsx                # Role selection
│   ├── tutor/
│   │   └── TutorDashboard.tsx
│   └── student/
│       └── StudentDashboard.tsx
└── lib/
    ├── auth.ts                 # Convenience exports
    └── auth-utils.ts           # Utility functions
```

## Next Steps

1. **Build the Tutor Features**
   - Game creation
   - Group management
   - Student progress tracking

2. **Build the Student Features**
   - Group joining
   - Game playing
   - Progress viewing

3. **Add Shared Components**
   - Navigation bars
   - User menus
   - Settings pages

4. **Integrate with Backend**
   - When ready, replace hardcoded sessions
   - See `docs/AUTH_SYSTEM.md` for migration guide

## Need Help?

- **Auth documentation**: `docs/AUTH_SYSTEM.md`
- **Database schema**: `prisma/README.md`
- **Type definitions**: `src/types/auth.ts`
- **Example usage**: This file!

## Tips

- Use the role switcher liberally - it's there to help you
- Session state persists, so refresh freely while developing
- TypeScript will catch role-related errors at compile time
- Check the console for any authentication-related warnings
- The role switcher only appears in development mode
