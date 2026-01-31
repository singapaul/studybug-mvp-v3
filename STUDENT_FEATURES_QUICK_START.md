# Student Dashboard - Quick Start Guide

## What Was Built

A complete student join flow and dashboard with:

### ✅ Join Group Feature
- 6-character join code input with validation
- Real-time error handling
- Success confirmation

### ✅ Dashboard Overview
- 4 statistics cards (Groups, Assignments, Completed, Average Score)
- Two main tabs: My Assignments and My Groups

### ✅ My Assignments
- **Visual Cards** for each assignment showing:
  - Game name and type (color-coded badges)
  - Group name
  - Status (Pending/Completed/Overdue)
  - Due date (relative format)
  - Best score and attempts
  - Play button

- **Filtering**: All, Pending, Completed, Overdue
- **Sorting**: Due Date, Group, Game Type
- **Empty States**: Helpful messages when no data

### ✅ My Groups
- List of all enrolled groups
- Shows member count and assignment count
- Subject area and age range display

## How to Test

### Method 1: Using Dev Tool (Easiest)

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Log in as a student**:
   - Navigate to `/student/dashboard`
   - Use the RoleSwitcher if needed

3. **Click the "Dev Tools" button** (bottom-left corner, orange dashed border):
   - Click "Create Test Data"
   - This creates:
     - ✅ 3 test games (Math, Science, History)
     - ✅ 1 test group (code: TEST01)
     - ✅ 3 assignments (pending, overdue, completed)
     - ✅ 1 game attempt (85% score)

4. **Explore the dashboard**:
   - View stats cards updating
   - Try filtering (All, Pending, Completed, Overdue)
   - Try sorting (Due Date, Group, Game Type)
   - Switch to "My Groups" tab

5. **Test Join Flow**:
   - Click "Join Group" button
   - Enter code: `TEST01`
   - See success message

### Method 2: Manual Console Commands

Open browser console and run:

```javascript
// Create test data
import { initializeStudentTestData } from '/src/lib/test-data-utils';
initializeStudentTestData('your_student_id', 'tutor_id');

// Clear test data
import { clearTestData } from '/src/lib/test-data-utils';
clearTestData();
```

### Method 3: Create Custom Test Data

```javascript
// Create a custom group with specific join code
const groups = [{
  id: 'my_group',
  tutorId: 'tutor_123',
  name: 'My Custom Group',
  joinCode: 'ABCDEF',
  ageRange: '10-12',
  subjectArea: 'Science',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}];
localStorage.setItem('dev_groups', JSON.stringify(groups));
```

## Testing Checklist

### ✅ Join Group Flow
- [ ] Click "Join Group" button opens modal
- [ ] Enter invalid code shows error
- [ ] Enter valid code (TEST01) shows success
- [ ] Already joined shows "already a member" error
- [ ] Dashboard refreshes after joining

### ✅ Assignment Display
- [ ] Stats cards show correct numbers
- [ ] Assignment cards show game details
- [ ] Status badges are correct (Pending/Completed/Overdue)
- [ ] Due dates show relative format ("Due in 3 days")
- [ ] Overdue assignments have red border
- [ ] Best scores display correctly
- [ ] Attempt counts show

### ✅ Filtering
- [ ] "All" shows everything
- [ ] "Pending" shows only incomplete
- [ ] "Completed" shows only finished
- [ ] "Overdue" shows only past-due incomplete

### ✅ Sorting
- [ ] "Due Date" sorts by soonest first
- [ ] "Group" sorts alphabetically
- [ ] "Game Type" groups by type

### ✅ Groups Tab
- [ ] Lists all enrolled groups
- [ ] Shows member counts
- [ ] Shows assignment counts per group

### ✅ Empty States
- [ ] No groups: shows "Join a Group to Get Started"
- [ ] No assignments: shows "Your tutor hasn't assigned any games yet"

### ✅ Responsive Design
- [ ] Works on mobile (single column)
- [ ] Works on tablet (2 columns)
- [ ] Works on desktop (3-4 columns)

## Key Files

```
src/
├── pages/student/
│   └── StudentDashboard.tsx          # Main dashboard page
├── components/
│   ├── student/
│   │   └── JoinGroupDialog.tsx       # Join group modal
│   └── dev/
│       └── StudentTestDataButton.tsx # Dev tool (dev only)
├── services/
│   └── student.service.ts            # Backend operations
├── types/
│   └── assignment.ts                 # Type definitions
└── lib/
    └── test-data-utils.ts            # Test data helpers
```

## Visual Features

### Color-Coded Game Types
- **Pairs**: Purple badges
- **Flashcards**: Blue badges
- **Multiple Choice**: Green badges
- **Splat**: Orange badges
- **Swipe**: Pink badges

### Status Indicators
- **Pending**: Blue with clock icon
- **Completed**: Green with checkmark
- **Overdue**: Red with alert icon

### Stats Card Borders
- **My Groups**: Blue left border
- **Total Assignments**: Orange left border
- **Completed**: Green left border
- **Average Score**: Purple left border

## Common Issues

### "No groups" message after joining
- Refresh the page or click Dev Tools → Create Test Data again

### Dev Tools button not visible
- Check you're running in development mode (`npm run dev`)
- Button only shows in dev, not production builds

### Join code not working
- Ensure code is exactly 6 characters
- Use TEST01 for default test group
- Check group exists in localStorage

### Stats showing zeros
- Create test data using Dev Tools button
- Or manually add assignments via console

## Next Steps

After testing, you can:
1. Integrate with real backend API
2. Add assignment detail pages
3. Implement game players
4. Add notifications for due dates
5. Create progress tracking
6. Add search functionality

## Production Notes

Before deploying to production:
- Remove `<StudentTestDataButton />` from StudentDashboard
- Replace localStorage service with API calls
- Add proper error handling
- Implement authentication checks
- Add loading states for API calls
