# Group Management System

Complete class/group management system for tutors.

## Features

### Create Groups
- Form with React Hook Form + Zod validation
- Required: Group name (3-100 characters)
- Optional: Age range, subject area
- Auto-generates unique 6-character join code
- Stores in localStorage (mock database)

### Groups List Page
- Displays all tutor's groups in a card grid
- Shows member count and assignment count
- Displays join code on each card
- "Create Group" button opens modal
- Empty state with CTA when no groups exist
- Click card to view details

### Group Detail Page
- Full group information display
- Join code with copy-to-clipboard button
- Shareable link with copy button
- List of enrolled students with email and join date
- Remove student functionality with confirmation dialog
- List of assigned games (placeholder for now)
- "Invite Students" button opens modal
- Back button to return to groups list

### Invite Students Modal
- Displays formatted join code (ABC DEF)
- Copy button for join code
- Full shareable link (http://localhost:5173/join/{code})
- Copy button for link
- Instructions for students
- Beautiful, user-friendly UI

### Student Management
- Remove students with confirmation dialog
- View student join date
- Display student email
- Mock "Add Student" button (dev only) for testing

### Join Codes
- 6 characters: uppercase letters and numbers
- Excludes ambiguous characters (0, O, 1, I, L)
- Guaranteed unique across all groups
- Can be copied to clipboard
- Formatted for readability (ABC DEF)

## File Structure

```
src/
├── components/
│   └── groups/
│       ├── CreateGroupForm.tsx       # Create group form with validation
│       ├── GroupCard.tsx             # Group card for list view
│       └── InviteStudentsDialog.tsx  # Invite modal with join info
├── pages/
│   └── tutor/
│       ├── Groups.tsx                # Groups list page
│       └── GroupDetail.tsx           # Group detail page
├── services/
│   └── group.service.ts              # Mock API service (localStorage)
├── schemas/
│   └── group.schema.ts               # Zod validation schemas
├── types/
│   └── group.ts                      # TypeScript types
└── lib/
    └── join-code.ts                  # Join code utilities
```

## Routes

- `/tutor/groups` - Groups list page
- `/tutor/groups/:groupId` - Group detail page
- `/tutor/dashboard` - Links to groups page

## Components

### CreateGroupForm
React Hook Form with Zod validation:
```tsx
<CreateGroupForm
  onSubmit={handleCreate}
  isLoading={isCreating}
/>
```

### GroupCard
Displays group summary:
```tsx
<GroupCard group={group} />
```

### InviteStudentsDialog
Shows join information:
```tsx
<InviteStudentsDialog
  open={open}
  onOpenChange={setOpen}
  groupName="Year 5 Math"
  joinCode="ABC123"
/>
```

## Service Functions

```typescript
// Get all groups for a tutor
await getTutorGroups(tutorId);

// Get single group with details
await getGroupById(groupId);

// Get group by join code
await getGroupByJoinCode('ABC123');

// Create new group
await createGroup(tutorId, {
  name: 'Year 5 Mathematics',
  ageRange: '9-10 years',
  subjectArea: 'Mathematics'
});

// Update group
await updateGroup(groupId, { name: 'New Name' });

// Delete group
await deleteGroup(groupId);

// Remove student from group
await removeStudentFromGroup(groupId, studentId);

// Add student to group (testing)
await addStudentToGroup(groupId, studentId, email);
```

## Join Code Utilities

```typescript
import {
  generateJoinCode,
  isValidJoinCode,
  formatJoinCode,
  getJoinLink
} from '@/lib/join-code';

// Generate unique code
const code = generateJoinCode(); // "ABC123"

// Validate format
isValidJoinCode('ABC123'); // true

// Format for display
formatJoinCode('ABC123'); // "ABC DEF"

// Get shareable link
getJoinLink('ABC123'); // "http://localhost:5173/join/ABC123"
```

## Validation Schema

```typescript
const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, 'Group name is required')
    .min(3, 'Group name must be at least 3 characters')
    .max(100, 'Group name must be less than 100 characters'),
  ageRange: z.string().optional(),
  subjectArea: z.string().optional(),
});
```

## Usage Examples

### Create a Group

1. Navigate to `/tutor/groups`
2. Click "Create Group" button
3. Fill in form:
   - Name: "Year 5 Mathematics"
   - Age Range: "9-10 years"
   - Subject: "Mathematics"
4. Click "Create Group"
5. Group appears in list with unique join code

### View Group Details

1. Click on a group card
2. See full details page with:
   - Join code and shareable link
   - List of students
   - List of assigned games
3. Use "Invite Students" to see join info
4. Click copy buttons to share with students

### Remove Student

1. Go to group detail page
2. Find student in list
3. Click trash icon
4. Confirm removal in dialog
5. Student is removed from group

### Testing with Mock Students

In development mode:
1. Go to group detail page
2. Click "Add Mock Student" button
3. Random student added to group
4. Test removal and other features

## Data Storage

Currently uses localStorage for mock data:
- `dev_groups` - Array of groups
- `dev_group_members` - Array of group members

In production, replace with API calls to backend.

## TypeScript Types

```typescript
interface Group {
  id: string;
  tutorId: string;
  name: string;
  ageRange: string | null;
  subjectArea: string | null;
  joinCode: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    members: number;
    assignments: number;
  };
}

interface GroupMember {
  id: string;
  groupId: string;
  studentId: string;
  joinedAt: Date;
  student: {
    id: string;
    user: {
      id: string;
      email: string;
    };
  };
}

interface GroupWithDetails extends Group {
  members: GroupMember[];
  assignments: Assignment[];
}
```

## Styling

Uses Tailwind CSS with Shadcn/ui components:
- Cards for group display
- Forms with proper validation feedback
- Dialogs for modals
- Alert dialogs for confirmations
- Buttons with icons
- Badges for metadata
- Toast notifications for feedback

## State Management

- React Hook Form for form state
- Local component state for UI state
- Async functions for data fetching
- Toast notifications for user feedback

## Error Handling

- Form validation errors shown inline
- API errors shown with toast notifications
- Loading states for async operations
- Confirmation dialogs for destructive actions

## Empty States

- "No groups yet" with CTA to create first group
- "No students" with instruction to share join code
- "No games" with CTA to create game

## Accessibility

- Proper form labels
- Keyboard navigation
- Screen reader friendly
- Focus management in dialogs
- Clear error messages

## Future Enhancements

When adding backend:
1. Replace localStorage with API calls
2. Add real-time updates for new members
3. Add email invitations
4. Add group settings/preferences
5. Add bulk student import
6. Add group analytics
7. Add group archive/deletion with history

## Migration to Backend

Replace service functions:
```typescript
// Before (localStorage)
export async function getTutorGroups(tutorId: string) {
  const groups = getGroups().filter(g => g.tutorId === tutorId);
  return groups;
}

// After (API)
export async function getTutorGroups(tutorId: string) {
  const response = await fetch(`/api/tutors/${tutorId}/groups`);
  return response.json();
}
```

Keep all components, types, and validation unchanged.

## Testing

Manual testing checklist:
- [ ] Create group with valid data
- [ ] Create group with invalid data (see errors)
- [ ] View groups list
- [ ] Click group to see details
- [ ] Copy join code to clipboard
- [ ] Copy shareable link to clipboard
- [ ] Open invite modal
- [ ] Add mock student
- [ ] Remove student
- [ ] Confirm removal dialog works
- [ ] Cancel removal dialog works
- [ ] Empty state shows correctly
- [ ] Navigation works correctly
- [ ] Form resets after submission
- [ ] Loading states show correctly
- [ ] Toast notifications appear

## Notes

- Join codes are guaranteed unique
- Students can join multiple groups
- Groups can have unlimited students
- Removing student requires confirmation
- All operations have loading states
- All operations show feedback via toasts
- Data persists in localStorage (dev only)
