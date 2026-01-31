# Group Management Testing Guide

Step-by-step guide to test all group management features.

## Prerequisites

1. Start dev server: `npm run dev`
2. Visit `http://localhost:5173`
3. Select "Continue as Tutor"

## Test 1: Create Your First Group

### Steps:
1. From tutor dashboard, click "Manage Groups" quick action
2. You should see empty state: "No groups yet"
3. Click "Create Your First Group" button
4. Modal opens with create form

### Fill the form:
- Name: "Year 5 Mathematics" ✓
- Age Range: "9-10 years"
- Subject Area: "Mathematics"

5. Click "Create Group"

### Expected Results:
- ✅ Modal closes
- ✅ Toast notification: "Group 'Year 5 Mathematics' created successfully!"
- ✅ Group appears in list
- ✅ Card shows group name, badges, and join code
- ✅ Member count shows 0 students
- ✅ Created date is today

## Test 2: Form Validation

1. Click "Create Group" again
2. Try submitting empty form

### Expected Results:
- ✅ Error: "Group name is required"

3. Enter "AB" (too short)

### Expected Results:
- ✅ Error: "Group name must be at least 3 characters"

4. Enter valid name, submit
5. Form resets after successful creation

## Test 3: Create Multiple Groups

Create these groups:
1. "Year 6 English" (Age: 10-11, Subject: English)
2. "Science Club" (Age: 8-12, Subject: Science)
3. "Chess Group" (leave optional fields empty)

### Expected Results:
- ✅ All groups appear in grid layout
- ✅ Each has unique join code
- ✅ Cards show correct information
- ✅ Responsive grid (1 col mobile, 2 tablet, 3 desktop)

## Test 4: View Group Details

1. Click on "Year 5 Mathematics" card
2. Navigate to detail page

### Expected Results:
- ✅ Page loads with group name as title
- ✅ Badges show age range and subject
- ✅ Badge shows "0 students"
- ✅ Join Information card displays
- ✅ Join code is visible (e.g., "ABC 123")
- ✅ Shareable link shows (http://localhost:5173/join/ABC123)
- ✅ Students section shows "No students have joined yet"
- ✅ Games section shows "No games assigned yet"
- ✅ "Invite Students" button visible
- ✅ Back button navigates to groups list

## Test 5: Copy Join Code

1. On group detail page, find join code
2. Click copy button next to join code

### Expected Results:
- ✅ Button shows checkmark briefly
- ✅ Toast: "Join code copied!"
- ✅ Code copied to clipboard (paste to verify)

## Test 6: Copy Shareable Link

1. Click copy button next to shareable link

### Expected Results:
- ✅ Button shows checkmark briefly
- ✅ Toast: "Link copied!"
- ✅ Link copied to clipboard (paste to verify)
- ✅ Link format: http://localhost:5173/join/ABC123

## Test 7: Invite Students Modal

1. Click "Invite Students" button
2. Modal opens

### Expected Results:
- ✅ Modal title: "Invite Students to Year 5 Mathematics"
- ✅ Join code section with formatted code (ABC DEF)
- ✅ Copy button for code
- ✅ Shareable link section
- ✅ Copy button for link
- ✅ Instructions for students
- ✅ Copy buttons work (test both)
- ✅ "Done" button closes modal

## Test 8: Add Mock Students (Dev Only)

1. On group detail page, look for "Add Mock Student" button
2. Click it 3 times to add 3 students

### Expected Results after each click:
- ✅ Toast: "Mock student added"
- ✅ Student appears in list
- ✅ Shows email (student_xxx@example.com)
- ✅ Shows join date (today)
- ✅ Trash icon visible
- ✅ Member count badge updates (0 → 1 → 2 → 3)

## Test 9: Remove Student

1. Find a student in the list
2. Click trash icon

### Expected Results:
- ✅ Confirmation dialog opens
- ✅ Title: "Remove Student"
- ✅ Warning message displayed
- ✅ "Cancel" and "Remove Student" buttons

3. Click "Cancel"

### Expected Results:
- ✅ Dialog closes
- ✅ Student still in list

4. Click trash icon again
5. Click "Remove Student"

### Expected Results:
- ✅ Button shows loading spinner
- ✅ Dialog closes
- ✅ Toast: "Student removed from group"
- ✅ Student removed from list
- ✅ Member count decreases

## Test 10: Remove All Students

1. Remove remaining students one by one

### Expected Results:
- ✅ Each removal works correctly
- ✅ Member count updates
- ✅ When last student removed, shows empty state
- ✅ Empty state: "No students have joined yet"

## Test 11: Navigation Flow

1. Click "Back to Groups" button
2. Navigate to groups list
3. Click different group card
4. View its details
5. Click back button

### Expected Results:
- ✅ Navigation works smoothly
- ✅ No data loss
- ✅ Correct group details load
- ✅ Back button always works

## Test 12: Multiple Groups Management

1. Add mock students to different groups
2. Navigate between groups
3. Verify each group has independent data

### Expected Results:
- ✅ Students added to correct group
- ✅ No data mixing between groups
- ✅ Each group maintains its own members
- ✅ Join codes remain unique

## Test 13: Persistence Test

1. Add students to a group
2. Navigate away from page
3. Refresh browser (F5)
4. Login as tutor again
5. Navigate to groups

### Expected Results:
- ✅ All groups still exist
- ✅ Group members preserved
- ✅ No data loss

## Test 14: Empty States

### Groups List Empty State:
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Login as tutor
4. Navigate to groups

### Expected Results:
- ✅ Shows empty state with icon
- ✅ "No groups yet" message
- ✅ Description text
- ✅ "Create Your First Group" CTA button

### Group Students Empty State:
1. Create new group
2. Don't add any students
3. View group details

### Expected Results:
- ✅ Shows students empty state
- ✅ Icon displayed
- ✅ "No students have joined yet" message
- ✅ Instruction to share join code

## Test 15: UI/UX Elements

### Cards:
- ✅ Hover effect on group cards
- ✅ Smooth transitions
- ✅ Click anywhere on card to navigate
- ✅ Responsive layout

### Buttons:
- ✅ Proper loading states
- ✅ Disabled states work
- ✅ Icons display correctly
- ✅ Hover effects

### Modals:
- ✅ Open smoothly
- ✅ Close on overlay click
- ✅ Close on escape key
- ✅ Focus management
- ✅ Backdrop blur effect

### Forms:
- ✅ Inline validation errors
- ✅ Error messages clear
- ✅ Submit button disabled when invalid
- ✅ Reset button works
- ✅ Proper tab order

## Test 16: Join Code Validation

1. Check multiple groups
2. Note all join codes

### Expected Results:
- ✅ Each code is exactly 6 characters
- ✅ Only uses: A-Z, 2-9 (no 0, O, 1, I, L)
- ✅ All codes are unique
- ✅ Codes are uppercase
- ✅ Format is readable (ABC DEF)

## Test 17: Responsive Design

Test at different screen sizes:

### Mobile (375px):
- ✅ Groups show in single column
- ✅ Cards stack nicely
- ✅ Buttons accessible
- ✅ Modal fits screen
- ✅ Form fields full width

### Tablet (768px):
- ✅ Groups show in 2 columns
- ✅ Detail page readable
- ✅ Two-column layout on detail page

### Desktop (1024px+):
- ✅ Groups show in 3 columns
- ✅ Optimal spacing
- ✅ All content readable

## Test 18: Performance

1. Create 20+ groups
2. Navigate through list
3. View different groups

### Expected Results:
- ✅ No lag when loading groups
- ✅ Smooth scrolling
- ✅ Quick page transitions
- ✅ No memory leaks

## Test 19: Error Handling

### Network Errors (Simulated):
1. Check console for errors
2. All operations should handle gracefully

### Expected Results:
- ✅ No unhandled promise rejections
- ✅ Toast notifications for errors
- ✅ Appropriate error messages
- ✅ UI remains functional

## Test 20: Accessibility

### Keyboard Navigation:
- ✅ Tab through all interactive elements
- ✅ Enter/Space activates buttons
- ✅ Escape closes modals
- ✅ Focus visible on all elements

### Screen Reader:
- ✅ Form labels properly associated
- ✅ Buttons have clear labels
- ✅ Error messages announced
- ✅ Modal title announced

## Bug Report Template

If you find issues, report with:

```
**Bug**: [Short description]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Browser**: [Chrome/Firefox/Safari]
**Screen Size**: [Desktop/Tablet/Mobile]
**Console Errors**: [Any errors in console]
```

## Success Criteria

All tests pass:
- [ ] Create group works
- [ ] Form validation works
- [ ] Multiple groups work
- [ ] View details works
- [ ] Copy functions work
- [ ] Invite modal works
- [ ] Add students works
- [ ] Remove students works
- [ ] Navigation works
- [ ] Persistence works
- [ ] Empty states work
- [ ] UI/UX polished
- [ ] Join codes valid
- [ ] Responsive design works
- [ ] Performance acceptable
- [ ] Error handling works
- [ ] Accessibility works

## Notes

- Mock data stored in localStorage
- Join codes generated client-side
- All operations are async with delays
- Production will use real API
- Clear localStorage to reset: `localStorage.clear()`
