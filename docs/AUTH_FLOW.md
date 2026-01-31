# Authentication Flow Diagram

## User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                         START APPLICATION                            │
│                         Visit localhost:5173                         │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   Check localStorage  │
                │   for 'dev_role'      │
                └──────────┬────────────┘
                           │
            ┌──────────────┴───────────────┐
            │                              │
         Found                          Not Found
            │                              │
            ▼                              ▼
   ┌─────────────────┐           ┌──────────────────┐
   │  Load Session   │           │   Show Home Page │
   │  Auto-redirect  │           │   Role Selection │
   └────────┬────────┘           └────────┬─────────┘
            │                              │
            │                              │
    ┌───────┴────────┐            ┌───────┴────────┐
    │                │            │                │
  TUTOR           STUDENT      TUTOR           STUDENT
    │                │            │                │
    ▼                ▼            ▼                ▼
┌───────────┐  ┌────────────┐  Set              Set
│   Tutor   │  │  Student   │  localStorage     localStorage
│ Dashboard │  │ Dashboard  │  Navigate         Navigate
└───────────┘  └────────────┘     │                │
                                   ▼                ▼
                           ┌─────────────┐  ┌────────────┐
                           │   Tutor     │  │  Student   │
                           │  Dashboard  │  │ Dashboard  │
                           └─────────────┘  └────────────┘
```

## Route Protection Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                   User Accesses Protected Route                    │
│                   e.g., /tutor/dashboard                           │
└──────────────────────────┬─────────────────────────────────────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  ProtectedRoute HOC  │
                │  Check Auth State    │
                └──────────┬────────────┘
                           │
            ┌──────────────┴──────────────┐
            │                             │
        Authenticated                Not Authenticated
            │                             │
            ▼                             ▼
   ┌─────────────────┐           ┌──────────────────┐
   │ Check Role      │           │  Redirect to '/' │
   │ (if specified)  │           │  (Home Page)     │
   └────────┬────────┘           └──────────────────┘
            │
     ┌──────┴──────┐
     │             │
  Correct       Wrong
   Role         Role
     │             │
     ▼             ▼
┌─────────┐  ┌──────────────────┐
│ Render  │  │  Redirect to     │
│ Content │  │  Correct         │
└─────────┘  │  Dashboard       │
             └──────────────────┘
```

## Dev Role Switcher Flow

```
┌────────────────────────────────────────────────────────────────────┐
│               User Clicks Role Switcher Button                     │
│               (Bottom-right floating button)                       │
└──────────────────────────┬─────────────────────────────────────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   Show Dropdown      │
                │   Menu with Options  │
                └──────────┬────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  Switch to Tutor    Switch to Student    Logout
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌────────────────┐  ┌─────────────┐
│ Set Role      │  │  Set Role      │  │ Clear       │
│ to TUTOR      │  │  to STUDENT    │  │ localStorage│
└───────┬───────┘  └────────┬───────┘  └──────┬──────┘
        │                   │                  │
        ▼                   ▼                  ▼
┌───────────────┐  ┌────────────────┐  ┌─────────────┐
│ Update        │  │  Update        │  │ Navigate    │
│ localStorage  │  │  localStorage  │  │ to Home     │
└───────┬───────┘  └────────┬───────┘  └─────────────┘
        │                   │
        ▼                   ▼
┌───────────────┐  ┌────────────────┐
│ Navigate to   │  │  Navigate to   │
│ /tutor/       │  │  /student/     │
│ dashboard     │  │  dashboard     │
└───────────────┘  └────────────────┘
```

## Component Hierarchy

```
App
├── AuthProvider (wraps entire app)
│   └── BrowserRouter
│       ├── Routes
│       │   ├── Home (public)
│       │   ├── ProtectedRoute (TUTOR)
│       │   │   └── TutorDashboard
│       │   └── ProtectedRoute (STUDENT)
│       │       └── StudentDashboard
│       └── RoleSwitcher (dev only)
```

## State Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          AuthContext State                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  session: UserSession | null                                        │
│  ├─ user: User                                                      │
│  │   ├─ id: string                                                  │
│  │   ├─ email: string                                               │
│  │   ├─ role: Role (TUTOR | STUDENT)                               │
│  │   └─ ...                                                         │
│  ├─ tutor?: Tutor (if role === TUTOR)                              │
│  └─ student?: Student (if role === STUDENT)                         │
│                                                                      │
│  Computed Values:                                                   │
│  ├─ isAuthenticated: boolean                                        │
│  ├─ isTutor: boolean                                                │
│  └─ isStudent: boolean                                              │
│                                                                      │
│  Methods:                                                           │
│  ├─ login(role: Role): void                                         │
│  ├─ logout(): void                                                  │
│  └─ switchRole(role: Role): void                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ useAuth() hook
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       Any Component in App                           │
│                                                                      │
│  const { session, isTutor, login, ... } = useAuth();               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Persistence

```
┌────────────────────────┐
│    User Action         │
│  (login/switchRole)    │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Update Context       │
│   setSession(...)      │
└───────────┬────────────┘
            │
            ├──────────────────────────┐
            │                          │
            ▼                          ▼
┌────────────────────────┐  ┌───────────────────────┐
│  Update localStorage   │  │  Trigger Re-render    │
│  key: 'dev_role'       │  │  All useAuth() hooks  │
│  value: 'TUTOR' etc.   │  │                       │
└────────────────────────┘  └───────────────────────┘
            │
            ▼
┌────────────────────────┐
│  Persists across       │
│  page refreshes        │
└────────────────────────┘
```

## Usage Example Flow

```
Component Lifecycle:
───────────────────

1. Component Mounts
   └─> useAuth() subscribes to context

2. Check Auth State
   └─> Read session from context

3. Conditional Rendering
   ├─> if (isTutor) { render tutor UI }
   └─> if (isStudent) { render student UI }

4. User Action (e.g., logout)
   └─> Call logout() from context
       └─> Context updates session
           └─> localStorage cleared
               └─> All subscribers re-render
                   └─> Redirect to home
```

## Security Flow (Development)

```
Current (Dev):
──────────────
User -> Click Role -> Set localStorage -> Load Session -> Access Dashboard
                      (Plain text)        (Hardcoded)

Future (Production):
────────────────────
User -> Enter Credentials -> API Call -> JWT Token -> Verify Token -> Access Dashboard
                                        (Encrypted)   (Backend)
```

## Migration Path

```
Development                          Production
──────────────────────────────────────────────────────────

Hardcoded Sessions        ─────>    API-based Sessions
localStorage              ─────>    HTTP-only Cookies
No Expiration            ─────>    Token Expiration
No Validation            ─────>    Server-side Validation
switchRole()             ─────>    Re-authenticate
RoleSwitcher Component   ─────>    Removed

Types (Keep)             ─────>    Types (Same)
Context Structure        ─────>    Context Structure
Protected Routes         ─────>    Protected Routes
Utility Functions        ─────>    Utility Functions
```

## Quick Reference

### Key Files
- **Context**: `src/contexts/AuthContext.tsx`
- **Types**: `src/types/auth.ts`
- **Protection**: `src/components/auth/ProtectedRoute.tsx`
- **Switcher**: `src/components/dev/RoleSwitcher.tsx`
- **Utils**: `src/lib/auth-utils.ts`

### Key Methods
- `useAuth()` - Access auth state
- `login(role)` - Set user role
- `logout()` - Clear session
- `switchRole(role)` - Change role

### Key States
- `session` - Current user data
- `isAuthenticated` - Login status
- `isTutor` - Role check
- `isStudent` - Role check
