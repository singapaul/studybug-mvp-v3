

# Studybug MVP Implementation Plan
## Full Functional Application Behind Marketing Site

This plan outlines the complete build of the Studybug MVP - transforming the current marketing site into a gateway for a fully functional tutor and student web application.

---

## Overview

### What We're Building
- **Updated marketing site** with tutor/student messaging
- **Simplified pricing** (Free Student vs Paid Tutor)
- **Login system** with hardcoded demo credentials
- **Multi-step signup flow** with role selection
- **Tutor dashboard** with classes, games, assignments management
- **Student dashboard** with assignments and score tracking
- **2 playable game modes**: Multiple Choice Quiz and Flashcards
- **localStorage-based** data persistence for demo purposes

### Demo Credentials
- **Tutor**: demo@studybug.io / demo123
- **Student**: student@studybug.io / demo123

---

## Architecture

### Routing Structure

```text
PUBLIC ROUTES (Marketing)
├── /                    → Homepage (updated messaging)
├── /pricing             → Simplified 2-tier pricing
├── /features            → Features page
├── /how-it-works        → How it works
├── /contact             → Contact page
├── /login               → Login (gateway to app)
└── /signup              → Role-based signup flow

PROTECTED ROUTES (Application)
├── /app/tutor/*         → Tutor dashboard area
│   ├── /dashboard       → Overview stats & quick actions
│   ├── /classes         → List & manage classes
│   ├── /classes/:id     → Class detail view
│   ├── /classes/create  → Create new class
│   ├── /games           → List & manage games
│   ├── /games/create    → Game creation wizard
│   ├── /games/:id/edit  → Edit existing game
│   ├── /assignments     → List all assignments
│   ├── /assignments/:id → Assignment detail & analytics
│   ├── /billing         → Subscription info (static)
│   └── /settings        → Profile & preferences
│
└── /app/student/*       → Student dashboard area
    ├── /dashboard       → Overview & upcoming assignments
    ├── /assignments     → All assigned games
    ├── /assignments/:id/play  → Play a game
    ├── /assignments/:id/result → Game results
    ├── /scores          → Score history
    └── /settings        → Profile & preferences
```

---

## Implementation Details

### Phase 1: Core Infrastructure

#### 1.1 Auth Context & Session Management
Create a new auth context that manages:
- User session state (isLoggedIn, role, email, name)
- localStorage persistence
- Demo credential validation
- Login/logout functions
- Protected route wrapper component

**New Files:**
- `src/context/AuthContext.tsx` - Auth state management
- `src/components/auth/ProtectedRoute.tsx` - Route guard component
- `src/components/auth/RequireRole.tsx` - Role-based access control

#### 1.2 Demo Data Store
Create a comprehensive demo data module with:
- Pre-populated classes, students, games, assignments
- Realistic score data and activity history
- Functions to add/update/delete items
- localStorage sync

**New Files:**
- `src/data/demoData.ts` - Demo data definitions
- `src/hooks/useDemoData.ts` - Hook for accessing/modifying demo data

---

### Phase 2: Login & Signup

#### 2.1 Login Page Update
Enhance the existing `/login` page:
- Email and password fields
- Demo credential validation (demo@studybug.io, student@studybug.io)
- Role-based redirect after login
- "Forgot password" placeholder link
- Demo mode notice at bottom

#### 2.2 New Signup Flow
Create a new multi-step signup experience:

**Step 1: Role Selection** (`/signup`)
- Two large cards: "I'm a Tutor" (owl icon) and "I'm a Student" (bug icon)
- Clear value propositions for each role
- "Continue as..." buttons

**Step 2: Account Creation**
- Name, email, password, confirm password fields
- Validation with zod
- Terms agreement checkbox

**Step 3a: Tutor Trial Start**
- Success message
- Monthly/Annual toggle (£12/mo or £100/yr)
- "Start Trial" button (redirects to app)
- No credit card required notice

**Step 3b: Student Welcome**
- Simple success message
- "Get Started" button (redirects to app)

**New Files:**
- `src/pages/Signup.tsx` - New role-based signup flow
- `src/components/signup/RoleSelection.tsx`
- `src/components/signup/AccountForm.tsx`
- `src/components/signup/TutorTrialStep.tsx`
- `src/components/signup/StudentWelcomeStep.tsx`

---

### Phase 3: App Layout & Navigation

#### 3.1 App Shell with Sidebar
Create a shared app layout with:
- Collapsible sidebar navigation
- User profile section with avatar, name, role badge
- Role-specific navigation items
- Logout button
- Responsive mobile drawer

**Tutor Sidebar Items:**
- Dashboard, Classes, Games, Assignments, Billing, Settings

**Student Sidebar Items:**
- Dashboard, Assignments, My Scores, Settings

**New Files:**
- `src/components/app/AppLayout.tsx` - Main app shell
- `src/components/app/AppSidebar.tsx` - Sidebar navigation
- `src/components/app/AppHeader.tsx` - Top bar with mobile trigger
- `src/components/app/UserProfile.tsx` - Profile section in sidebar

---

### Phase 4: Tutor Application

#### 4.1 Tutor Dashboard
Four stat cards:
- Total Classes, Total Students, Active Assignments, Avg Completion Rate

Three quick action cards:
- Create a Class, Create a Game, Create Assignment

Recent activity feed (5-6 items)

**New Files:**
- `src/pages/app/tutor/TutorDashboard.tsx`
- `src/components/app/tutor/QuickStatCard.tsx`
- `src/components/app/tutor/QuickActionCard.tsx`
- `src/components/app/tutor/ActivityFeed.tsx`

#### 4.2 Classes Management
**Classes List** (`/app/tutor/classes`):
- Table view with class name, student count, join code, assignments
- Create new class button
- View/Edit/Delete actions

**Class Detail** (`/app/tutor/classes/:id`):
- Class info card with join code (copy button)
- Shareable link display
- Students table with status and scores
- Assignments for this class list

**Create Class** (`/app/tutor/classes/create`):
- Class name, subject dropdown, age range, description
- Generates random 6-char join code on create

**New Files:**
- `src/pages/app/tutor/Classes.tsx`
- `src/pages/app/tutor/ClassDetail.tsx`
- `src/pages/app/tutor/CreateClass.tsx`
- `src/components/app/tutor/ClassesTable.tsx`
- `src/components/app/tutor/StudentsTable.tsx`
- `src/components/app/tutor/JoinCodeCard.tsx`

#### 4.3 Games Management
**Games List** (`/app/tutor/games`):
- Grid view of game cards
- Game type badge, question count, times assigned
- Play/Edit/Duplicate/Delete actions

**Create Game Wizard** (`/app/tutor/games/create`):
- Step 1: Choose game type (Multiple Choice or Flashcards)
- Step 2: Game details (name, subject, description)
- Step 3: Add questions/cards (dynamic form)
- Save game to localStorage

**Edit Game** (`/app/tutor/games/:id/edit`):
- Same as create but pre-filled

**New Files:**
- `src/pages/app/tutor/Games.tsx`
- `src/pages/app/tutor/CreateGame.tsx`
- `src/pages/app/tutor/EditGame.tsx`
- `src/components/app/tutor/GameCard.tsx`
- `src/components/app/tutor/GameTypeSelector.tsx`
- `src/components/app/tutor/MultipleChoiceEditor.tsx`
- `src/components/app/tutor/FlashcardEditor.tsx`

#### 4.4 Assignments Management
**Assignments List** (`/app/tutor/assignments`):
- Table with assignment, class, game, due date, completion, avg score
- Create assignment button

**Assignment Detail** (`/app/tutor/assignments/:id`):
- Overview card with completion stats
- Student progress table (status, score, attempts, time)
- Most missed questions analytics
- Individual student detail expansion

**Create Assignment**:
- Select game, select class, due date picker, pass percentage

**New Files:**
- `src/pages/app/tutor/Assignments.tsx`
- `src/pages/app/tutor/AssignmentDetail.tsx`
- `src/pages/app/tutor/CreateAssignment.tsx`
- `src/components/app/tutor/AssignmentsTable.tsx`
- `src/components/app/tutor/StudentProgressTable.tsx`
- `src/components/app/tutor/AssignmentAnalytics.tsx`

#### 4.5 Billing & Settings
**Billing** (`/app/tutor/billing`):
- Current subscription card (static trial info)
- Payment method placeholder
- Billing history table (static)

**Settings** (`/app/tutor/settings`):
- Tabs: Profile, Password, Notifications, Contact
- Profile: name, email, avatar upload placeholder
- Password: change password form (demo mode)
- Notifications: email preference checkboxes
- Contact: simple form or mailto link

**New Files:**
- `src/pages/app/tutor/Billing.tsx`
- `src/pages/app/tutor/Settings.tsx`

---

### Phase 5: Student Application

#### 5.1 Student Dashboard
Quick stat cards:
- Classes Joined, Assignments Due, Avg Score, Current Streak

Upcoming assignments (card view):
- Game name, class, progress, due date
- Play Now/Continue/Play Again buttons

Recent scores list

**Join Class Card** (if no classes joined):
- Enter join code field
- Join class button with validation

**New Files:**
- `src/pages/app/student/StudentDashboard.tsx`
- `src/components/app/student/UpcomingAssignments.tsx`
- `src/components/app/student/JoinClassCard.tsx`
- `src/components/app/student/RecentScores.tsx`

#### 5.2 Assignments & Gameplay
**Assignments List** (`/app/student/assignments`):
- Filter tabs: All, Due Soon, Completed, Not Started
- Card view with game name, class, due date, status, score
- Play button on each

**Play Game** (`/app/student/assignments/:id/play`):
- Game header with progress, timer, score
- Multiple Choice: Question + 4 answer buttons
- Flashcards: Swipeable/flippable cards
- Immediate correct/incorrect feedback
- Pause modal

**Results Page** (`/app/student/assignments/:id/result`):
- Large score display
- Time taken
- Pass/fail status
- Question breakdown with answers
- Play again button

**New Files:**
- `src/pages/app/student/Assignments.tsx`
- `src/pages/app/student/PlayGame.tsx`
- `src/pages/app/student/GameResult.tsx`
- `src/components/app/student/AssignmentCard.tsx`
- `src/components/app/games/MultipleChoiceGame.tsx`
- `src/components/app/games/FlashcardsGame.tsx`
- `src/components/app/games/GameHeader.tsx`
- `src/components/app/games/QuestionFeedback.tsx`
- `src/components/app/games/PauseModal.tsx`

#### 5.3 Scores & Settings
**My Scores** (`/app/student/scores`):
- Scores table with filters
- Stats summary (total played, avg score, best streak)

**Settings** (`/app/student/settings`):
- Simplified version of tutor settings

**New Files:**
- `src/pages/app/student/Scores.tsx`
- `src/pages/app/student/Settings.tsx`
- `src/components/app/student/ScoresTable.tsx`

---

### Phase 6: Marketing Site Updates

#### 6.1 Homepage Updates
- New headline: "Interactive Learning Games for Tutors and Students"
- New subheadline about creating games, assigning, tracking
- Two CTAs: "Get Started as Tutor" → /signup?role=tutor, "I'm a Student" → /signup?role=student
- Updated stats: 500+ Tutors, 2,000+ Students, 92% Improvement
- Updated "How It Works" with For Tutors / For Students sections
- Updated features grid to MVP features

#### 6.2 Pricing Page Simplification
Remove 4-tier structure. Replace with 2 cards:

**Student Plan - FREE**
- Join unlimited classes, play assigned games, track progress, score history
- "Sign Up Free" button

**Tutor Plan - £12/month or £100/year**
- 7-day free trial
- Create unlimited games (2 game modes)
- Create unlimited classes, invite students
- Track student progress, assign with due dates
- "Start Free Trial" button

#### 6.3 Navigation Updates
Remove "For Schools" from main nav. Updated nav:
- Features, How It Works, Pricing, Contact, Log In, Get Started

**Files to Update:**
- `src/pages/Index.tsx`
- `src/pages/Pricing.tsx`
- `src/components/layout/Header.tsx`
- `src/components/pricing/PricingHero.tsx`
- `src/components/pricing/HowItWorks.tsx`
- `src/components/pricing/FeaturesGrid.tsx`
- `src/types/signup.ts` (update PLANS array)

---

## Demo Data Structure

### Classes (3 pre-populated)
| ID | Name | Subject | Students | Join Code |
|----|------|---------|----------|-----------|
| 1 | Year 7 Maths | Maths | 8 | ABC123 |
| 2 | Year 8 Science | Science | 4 | DEF456 |
| 3 | GCSE English | English | 6 | GHI789 |

### Games (5 pre-populated)
| ID | Name | Type | Questions |
|----|------|------|-----------|
| 1 | Times Tables Practice | Multiple Choice | 10 |
| 2 | Capital Cities Quiz | Multiple Choice | 15 |
| 3 | Vocabulary Builder | Flashcards | 20 |
| 4 | Quick Maths Challenge | Multiple Choice | 12 |
| 5 | Science Facts Review | Flashcards | 8 |

### Students (12 fake students across classes)
Sarah Jones, Tom Smith, Emma Brown, Jake Wilson, Lily Chen, Oliver Davis, Sophie Taylor, Noah Martinez, Ava Johnson, Ethan Williams, Mia Anderson, Lucas Thompson

### Assignments (8 pre-populated with varying completion states)
Mix of completed, in-progress, and not started across different classes and games.

---

## File Summary

### New Files (~55 files)

**Context & Hooks:**
- `src/context/AuthContext.tsx`
- `src/hooks/useDemoData.ts`
- `src/data/demoData.ts`

**Auth Components:**
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/auth/RequireRole.tsx`

**Signup Flow:**
- `src/pages/Signup.tsx`
- `src/components/signup/RoleSelection.tsx`
- `src/components/signup/AccountForm.tsx`
- `src/components/signup/TutorTrialStep.tsx`
- `src/components/signup/StudentWelcomeStep.tsx`

**App Layout:**
- `src/components/app/AppLayout.tsx`
- `src/components/app/AppSidebar.tsx`
- `src/components/app/AppHeader.tsx`
- `src/components/app/UserProfile.tsx`

**Tutor Pages (~15 files):**
- Dashboard, Classes, ClassDetail, CreateClass
- Games, CreateGame, EditGame
- Assignments, AssignmentDetail, CreateAssignment
- Billing, Settings

**Tutor Components (~12 files):**
- QuickStatCard, QuickActionCard, ActivityFeed
- ClassesTable, StudentsTable, JoinCodeCard
- GameCard, GameTypeSelector, MultipleChoiceEditor, FlashcardEditor
- AssignmentsTable, StudentProgressTable, AssignmentAnalytics

**Student Pages (~6 files):**
- Dashboard, Assignments, PlayGame, GameResult, Scores, Settings

**Student Components (~8 files):**
- UpcomingAssignments, JoinClassCard, RecentScores, AssignmentCard
- ScoresTable

**Game Components (~6 files):**
- MultipleChoiceGame, FlashcardsGame
- GameHeader, QuestionFeedback, PauseModal

### Updated Files (~10 files)
- `src/App.tsx` - Add new routes
- `src/pages/Login.tsx` - Demo credential handling
- `src/pages/Index.tsx` - Updated messaging
- `src/pages/Pricing.tsx` - Simplified tiers
- `src/components/layout/Header.tsx` - Updated nav
- `src/components/pricing/PricingHero.tsx`
- `src/components/pricing/HowItWorks.tsx`
- `src/components/pricing/FeaturesGrid.tsx`
- `src/types/signup.ts`

---

## Technical Notes

### Session Management
- All auth state stored in localStorage
- Keys: `studybug_user`, `studybug_session`
- AuthContext checks localStorage on mount
- Logout clears localStorage and redirects to /

### Data Persistence
- All demo data stored in localStorage
- Key: `studybug_demo_data`
- Pre-populated on first login
- Persists across sessions until cleared

### Game State
- Current game progress stored in session state
- Answers, time, score tracked during gameplay
- Results saved to demo data on completion

### Responsive Design
- Sidebar collapses to sheet on mobile
- Tables become card lists on mobile
- Game UI is touch-friendly
- Forms stack vertically on small screens

---

## Post-Implementation Testing Checklist
- [ ] Login with tutor demo credentials → lands on tutor dashboard
- [ ] Login with student demo credentials → lands on student dashboard
- [ ] Create a new class as tutor → appears in classes list
- [ ] Create a Multiple Choice game → appears in games list
- [ ] Create a Flashcard game → appears in games list
- [ ] Assign game to class → appears in assignments
- [ ] Student can join class with code
- [ ] Student can play Multiple Choice game
- [ ] Student can play Flashcards game
- [ ] Results save and appear in tutor analytics
- [ ] Marketing site messaging reflects tutor/student model
- [ ] Pricing shows simplified 2-tier structure
- [ ] Mobile navigation works correctly
- [ ] Logout clears session and redirects

