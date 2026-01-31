# Troubleshooting 404 Error

## ✅ FIXED: Tutor Game Preview Route

**Issue**: Trying to access `/tutor/games/[gameId]` resulted in 404

**Solution**: Added `PreviewGame` component and route for tutors to preview their games.

---

## Issue
Clicking "Play Now" on an assignment or game results in a 404 page not found error.

## Checklist

### 1. Restart Dev Server
The most common issue is that the dev server needs to be restarted after adding new routes:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Clear Browser Cache
Sometimes the browser caches the old route configuration:
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or open in incognito/private window

### 3. Verify Test Data
Check that assignment IDs are being created correctly:

```javascript
// In browser console:
const assignments = JSON.parse(localStorage.getItem('dev_assignments') || '[]');
console.table(assignments);

// Check if IDs exist:
assignments.forEach(a => console.log('Assignment ID:', a.id));
```

### 4. Check Console Logs
After clicking "Play Now", check the browser console for:
- The navigation log: `🎮 Navigating to game: [assignment-id]`
- The URL being generated
- Any error messages

### 5. Manual URL Test
Try navigating directly to the route:
- Go to: `http://localhost:5173/student/play/test123`
- You should see either the game loader or an error (not 404)
- If you see 404, the route isn't registered

### 6. Verify Route in App.tsx
Check that the route exists in src/App.tsx:

```typescript
<Route
  path="/student/play/:assignmentId"
  element={
    <ProtectedRoute requiredRole={Role.STUDENT}>
      <PlayGame />
    </ProtectedRoute>
  }
/>
```

### 7. Check ProtectedRoute
The ProtectedRoute might be redirecting. Check:
- Are you logged in as a student?
- Does the session have student role?
- Check RoleSwitcher is set to STUDENT

### 8. Verify File Exists
```bash
ls -la src/pages/student/PlayGame.tsx
```

Should show the file exists.

## Quick Fix

**Most likely solution**: Restart the dev server

1. Stop current server (Ctrl+C in terminal)
2. Clear any caches: `rm -rf node_modules/.vite`
3. Restart: `npm run dev`
4. Hard refresh browser
5. Try clicking "Play Now" again

## Still Not Working?

If the issue persists after restart:

1. **Check the actual URL in browser**:
   - What URL are you on when you see 404?
   - Is it `/student/play/[some-id]`?
   - Or something else?

2. **Check browser console**:
   - Any red errors?
   - Any warnings about routes?

3. **Verify role**:
   - Use RoleSwitcher to ensure you're in STUDENT mode
   - Check: `console.log(session?.role)` in browser console

4. **Check for route conflicts**:
   - Make sure no other routes are catching the URL first
   - The route order in App.tsx matters

## Debug Script

Run this in browser console to diagnose:

```javascript
// Check session
console.log('Session:', JSON.parse(localStorage.getItem('auth_session') || 'null'));

// Check assignments
const assignments = JSON.parse(localStorage.getItem('dev_assignments') || '[]');
console.log('Assignments:', assignments);

// Try manual navigation
window.location.href = '/student/play/test123';
```

## Expected Behavior

When clicking "Play Now":
1. Console shows: `🎮 Navigating to game: [assignment-id]`
2. URL changes to: `/student/play/[assignment-id]`
3. Page shows loading skeleton
4. Then either:
   - Game loads (if data exists)
   - Error message (if assignment not found)
   - NOT a 404 page

If you see NotFound component (404), the route isn't being matched.
