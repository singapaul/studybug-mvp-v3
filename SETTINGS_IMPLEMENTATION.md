# Settings Pages Implementation

## Overview

Comprehensive settings pages have been implemented for both tutors and students with profile management, notification preferences, theme settings, and privacy/support features.

## Features Implemented

### ✅ Profile Settings
- **Avatar Upload**: File input with preview (placeholder - will need backend integration)
  - Shows current avatar or generated initials
  - Accepts JPG, PNG, GIF (max 2MB)
  - Note: Full implementation with crop/resize and save to `/public/avatars` requires backend
- **Display Name**: Optional field (2-50 characters)
- **Email Display**: Read-only (future: will add change flow with auth)
- **Bio/Description**: Optional textarea (0-500 characters)
- **Save Button**: With loading state and success toast

### ✅ Account Settings
- **Password Change**: Placeholder section (awaiting full auth integration)
- **Email Notifications**:
  - **Tutors**: Student completion notifications, weekly progress summary
  - **Students**: Assignment reminders, weekly progress summary
- **Theme Preference**: Light/Dark/System (placeholder - theme switching will be functional in future update)
- Individual save buttons for each section

### ✅ Privacy & Legal
- **Terms of Service**: Link to /terms (opens in new tab)
- **Privacy Policy**: Link to /privacy (opens in new tab)
- **Stripe Note**: "Payments securely processed by Stripe (coming soon)"
- **Contact Support**:
  - Subject field (5-100 characters)
  - Message textarea (20-1000 characters)
  - Character count display
  - Direct email mention: support@studybug.com
  - Send button with loading state

### ✅ Student-Specific Features
- **Groups Management Tab**:
  - List of all joined groups
  - Group details (name, age range, subject area)
  - "Contact Tutor" button per group (placeholder for messaging system)
  - "Leave Group" button with confirmation dialog
  - Empty state when no groups

### ✅ Tutor-Specific Features
- **Billing Tab**:
  - Subscription status display (shows "Free Trial")
  - "Active" badge
  - "Upgrade Plan" button (disabled with "Coming Soon" note)
  - Placeholder for future billing portal link

## Technical Implementation

### Files Created

1. **`src/schemas/settings.schema.ts`**
   - Zod validation schemas for all settings forms
   - Profile, notifications, theme, contact support, password change

2. **`src/pages/tutor/TutorSettings.tsx`**
   - Complete settings page for tutors
   - 4 tabs: Profile, Account, Billing, Privacy

3. **`src/pages/student/StudentSettings.tsx`**
   - Complete settings page for students
   - 4 tabs: Profile, Account, Groups, Privacy

4. **`src/services/group.service.ts`** (updated)
   - Added `getStudentGroups()` function

### Routes Added

```typescript
// Tutor settings
/tutor/settings → TutorSettings component (protected)

// Student settings
/student/settings → StudentSettings component (protected)
```

### Navigation Updated

Added "Settings" link to both tutor and student navigation in `DashboardLayout`:
- Icon: Settings (gear icon)
- Position: Last item in navigation
- Active state: Green highlight when on settings page

## Key Features

### Unsaved Changes Warning
- Tracks changes in all form fields
- Shows confirmation dialog when switching tabs with unsaved changes
- "Cancel" keeps you on current tab
- "Discard Changes" switches to new tab

### Form Validation
- All forms use Zod schemas for validation
- Inline character counts for text fields
- Disabled save buttons when no changes
- Loading states during save operations

### User Experience
- Consistent layout across both roles
- Clear section separation with tabs
- Loading spinners for async operations
- Success toasts on save
- Error toasts on failure
- Disabled buttons during operations

## Data Persistence

Currently uses **localStorage** for settings:
- Key: `userSettings`
- Stored fields: displayName, bio, avatarUrl, notifications, theme

**Production TODO**: Replace with API calls to backend

## Future Enhancements

### Short Term
1. **Avatar Upload Backend**
   - Implement file upload endpoint
   - Add image cropping/resizing (sharp/jimp)
   - Save to `/public/avatars` directory
   - Return avatar URL

2. **Theme Switching**
   - Integrate with ThemeContext
   - Apply theme changes in real-time
   - Persist preference across sessions

3. **Email Change Flow**
   - Add verification email step
   - Confirmation dialog
   - Update email in auth system

### Medium Term
1. **Password Management**
   - Current password verification
   - New password validation
   - Password strength indicator
   - Integration with auth system

2. **Leave Group Implementation**
   - API endpoint to remove student from group
   - Update group member counts
   - Confirmation with consequences

3. **Contact Tutor Feature**
   - In-app messaging system
   - Email notifications
   - Message history

### Long Term
1. **Subscription Management**
   - Stripe integration
   - Plan selection UI
   - Billing portal
   - Payment methods

2. **Email Notifications**
   - Email service integration (SendGrid/AWS SES)
   - Notification preferences backend
   - Scheduled emails (weekly summaries)
   - Assignment reminder emails

3. **Terms & Privacy Pages**
   - Create actual /terms page
   - Create actual /privacy page
   - Legal content

## Usage

### As a Tutor
1. Navigate to Settings from main navigation
2. Update profile information
3. Configure notification preferences
4. View subscription status
5. Contact support if needed

### As a Student
1. Navigate to Settings from main navigation
2. Update profile information
3. Configure notification preferences
4. Manage group memberships
5. Contact tutor or support

## Testing Checklist

- [ ] Profile avatar upload (file input works)
- [ ] Display name saves correctly
- [ ] Bio character count accurate
- [ ] Email shows as read-only
- [ ] Notification switches toggle
- [ ] Theme buttons switch selection
- [ ] Unsaved changes warning appears
- [ ] Save buttons show loading state
- [ ] Success toasts appear on save
- [ ] Settings persist after page reload
- [ ] Student groups list loads
- [ ] Leave group confirmation works
- [ ] Contact support form validates
- [ ] Support message sends successfully
- [ ] Settings link in navigation works
- [ ] Active state highlights correctly

## Notes

- All placeholder features are clearly labeled as "Coming Soon"
- User feedback provided via toasts
- Graceful error handling throughout
- Mobile responsive design
- Consistent with existing app styling
- Uses existing component library (shadcn/ui)

## Related Files

- `src/components/layout/DashboardLayout.tsx` - Navigation updated
- `src/App.tsx` - Routes added
- `src/schemas/index.ts` - Schema exports updated
- `src/services/group.service.ts` - getStudentGroups added
