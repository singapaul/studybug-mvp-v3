# Progress Tracking - Quick Start Guide

## 🚀 How to Test

### Setup Test Data

1. **Run the app**: `npm run dev`
2. **Login as student**
3. **Setup test data**:
   - Click "Dev Tools" button (bottom right)
   - Click "Create Student Test Data"
   - This creates games, groups, assignments, and attempts

### Access My Scores

1. **From Student Dashboard**: Click "My Scores" button in header
2. **Direct URL**: http://localhost:8080/student/scores

## 📊 Features to Test

### Assignment Attempts Tab

#### View All Attempts
- [ ] Tab loads with table of attempts
- [ ] Each row shows: Date, Game, Type, Group, Score, Time
- [ ] Score badges are color-coded (green 90%+, blue 75-89%, yellow 60-74%, red <60%)
- [ ] Time is formatted (e.g., "2m 30s" or "45s")

#### Filter Attempts
- [ ] Select game type: All, Pairs, Flashcards, Splat
- [ ] Select group from dropdown
- [ ] Filter count updates ("Showing X of Y attempts")
- [ ] Table updates immediately

#### Sort Attempts
- [ ] Date (Newest) - default
- [ ] Date (Oldest)
- [ ] Score (High to Low)
- [ ] Score (Low to High)
- [ ] Time (Longest)
- [ ] Time (Shortest)

#### Export CSV
- [ ] Click "Export CSV" button
- [ ] File downloads: `my-scores-YYYY-MM-DD.csv`
- [ ] Open file - contains all filtered attempts
- [ ] Columns: Date, Game, Game Type, Group, Score %, Time

#### View Details
- [ ] Click "Details" on any attempt
- [ ] Navigate to attempt details page
- [ ] Shows full breakdown of that specific attempt

#### Empty States
- [ ] Clear all localStorage
- [ ] Login as new student
- [ ] See "No Attempts Found" message
- [ ] Apply filter with no results
- [ ] See "No attempts match your current filters"

### Personal Bests Tab

#### View Summary Stats
- [ ] "Games Played" card shows count
- [ ] "Total Attempts" card shows sum
- [ ] "Average Best Score" card shows percentage
- [ ] Color coding: green for high scores

#### View Game Cards
- [ ] Cards show for each game played
- [ ] Each card displays:
  - Game name and type
  - Best score (large, color-coded badge)
  - Best time
  - Average score
  - Total attempts
  - Last played date
- [ ] Top 3 games have trophy icons (gold, silver, bronze)
- [ ] Cards animate in sequence on load

#### Play Again
- [ ] Click "Play Again" on any card
- [ ] Navigate to student dashboard
- [ ] (Future: Navigate directly to that game)

#### Empty State
- [ ] No attempts exist
- [ ] See "No Games Played Yet" message
- [ ] "View Assignments" button shows
- [ ] Click button → navigate to dashboard

### Progress Trends Tab

#### Select Time Range
- [ ] Dropdown shows: Last 7, 14, 30, 60, 90 Days
- [ ] Default: 30 days
- [ ] Change selection → data updates
- [ ] Charts re-render with new data

#### Key Metrics Cards
- [ ] **Study Streak**: Shows consecutive days with attempts
  - Orange gradient background
  - Flame icon
  - Text: "X day(s)"
- [ ] **Total Attempts**: Count in selected time range
  - Blue gradient background
  - Target icon
- [ ] **Average Score**: Percentage across attempts
  - Green gradient background
  - Trending up icon
  - Color changes based on score

#### Score Over Time Chart
- [ ] Line chart renders
- [ ] X-axis: Dates (formatted "Jan 15")
- [ ] Y-axis: Score % (0-100)
- [ ] Purple line with dots
- [ ] Hover over dots → shows exact score and date
- [ ] Shows trend of improving/declining scores

#### Performance by Game Type Chart
- [ ] Bar chart renders
- [ ] X-axis: Game types (PAIRS, FLASHCARDS, SPLAT)
- [ ] Y-axis: Average score % (0-100)
- [ ] Blue bars with rounded tops
- [ ] Hover over bars → shows exact average

#### Game Type Summary
- [ ] Below bar chart, shows cards for each type
- [ ] Displays: Game type name, attempt count, average score
- [ ] Updates when time range changes

#### Insights Section
- [ ] Purple gradient card at bottom
- [ ] Shows personalized messages based on:
  - Current streak (if > 0)
  - High average score (if ≥ 85%)
  - Low average score (if < 70%)
  - High attempt count (if ≥ 20)
- [ ] Icons next to each insight (flame, trending up, target)

#### Empty State
- [ ] No attempts in time range
- [ ] See "No Data Available" message
- [ ] Bar chart icon shown

### Attempt Details Page

#### Navigate to Details
1. From Assignment Attempts tab → Click "Details"
2. Direct URL: http://localhost:8080/student/attempts/[attemptId]

#### Summary Section
- [ ] Game name and type displayed
- [ ] Group name shown
- [ ] Three large stat cards:
  - **Score**: Color-coded, large percentage
  - **Time**: Blue card, formatted time
  - **Date**: Purple card, formatted date and time
- [ ] "Play Again" button in header

#### Game-Specific Breakdowns

**Pairs Game**:
- [ ] Shows "Attempt Details" section
- [ ] Four stat boxes:
  - Total Moves
  - Pairs Found
  - Efficiency % (calculated)
  - Perfect Game (checkmark or X icon)

**Flashcards**:
- [ ] Shows "Attempt Details" section
- [ ] Four stat boxes:
  - Total Cards
  - Known Cards (green background)
  - Unknown Cards (red background)
  - Completion (checkmark or X icon)

**Splat Game**:
- [ ] Shows "Attempt Details" section
- [ ] Four summary boxes:
  - Total Questions
  - Correct Answers (green)
  - Total Score (blue)
  - Average Reaction Time (purple)
- [ ] "Question-by-Question Breakdown" section
- [ ] Grid of Q1, Q2, etc. showing:
  - Reaction time (seconds)
  - Points earned

#### Actions
- [ ] "Back to My Scores" button → navigate to /student/scores
- [ ] "Play Again" button → navigate to play that assignment
- [ ] Browser back button works correctly

#### Error Handling
- [ ] Visit invalid attempt ID
- [ ] See "Attempt Not Found" card
- [ ] "Back to My Scores" button shown

## 🎯 Test Scenarios

### Scenario 1: First-Time Student
1. Login as new student (no data)
2. Navigate to My Scores
3. **Expected**: All tabs show empty states
4. **Assignment Attempts**: "You haven't completed any assignments yet"
5. **Personal Bests**: "No Games Played Yet" with button
6. **Progress Trends**: "No Data Available"

### Scenario 2: Active Student
1. Create test data (Dev Tools button)
2. Navigate to My Scores
3. **Assignment Attempts**: See table with 10+ attempts
4. **Personal Bests**: See 3 game cards with stats
5. **Progress Trends**: See charts with data

### Scenario 3: Filter and Export
1. Go to Assignment Attempts tab
2. Filter by "Pairs" game type
3. Note attempt count
4. Change sort to "Score (High to Low)"
5. Export CSV
6. Open CSV file → verify data matches table

### Scenario 4: View Details
1. Assignment Attempts tab → Click "Details" on first row
2. View full breakdown
3. Verify game-specific data shows correctly
4. Click "Play Again"
5. **Expected**: Navigate to game play screen
6. Return to scores

### Scenario 5: Track Trends
1. Progress Trends tab → Select "Last 7 Days"
2. Note current streak
3. Complete a new assignment
4. Return to Progress Trends
5. Verify:
   - Total attempts increased
   - New data point in line chart
   - Streak updated (if consecutive day)

### Scenario 6: Personal Bests
1. Personal Bests tab → Note best score for a game
2. Go to dashboard → Play that game
3. Score higher than previous best
4. Return to Personal Bests
5. Verify:
   - Best score updated
   - Total attempts increased
   - Average score recalculated

### Scenario 7: Multiple Time Ranges
1. Progress Trends tab
2. Try each time range (7, 14, 30, 60, 90 days)
3. Verify:
   - Chart data updates
   - Total attempts changes
   - Some ranges might have no data (show empty state)

### Scenario 8: Mobile View
1. Open DevTools → Toggle device toolbar
2. Select mobile device (iPhone, Android)
3. Navigate through all tabs
4. Verify:
   - Layout responsive
   - Buttons accessible
   - Table scrolls horizontally
   - Charts resize appropriately
   - No horizontal overflow

## 🐛 Common Issues

### Charts not showing
**Problem**: White space where chart should be

**Solution**:
1. Check browser console for errors
2. Verify recharts installed: `npm list recharts`
3. Hard refresh: Cmd/Ctrl + Shift + R
4. Clear cache and reload

### CSV export not working
**Problem**: Clicking "Export CSV" does nothing

**Solution**:
1. Check browser console
2. Verify attempts data loaded (check table)
3. Try different browser
4. Check browser download settings

### Filters not updating
**Problem**: Changing filter doesn't update table

**Solution**:
1. Check browser console for errors
2. Verify useEffect dependencies in code
3. Hard refresh page
4. Try clearing localStorage and reloading test data

### Attempt details 404
**Problem**: Click "Details" → 404 page

**Solution**:
1. Verify routes in App.tsx
2. Restart dev server
3. Hard refresh browser
4. Check attempt ID in URL is valid

### Empty charts on mobile
**Problem**: Charts don't render on small screens

**Solution**:
1. Check ResponsiveContainer width
2. Verify viewport meta tag in index.html
3. Try landscape orientation
4. Test on actual device vs DevTools

## 💡 Tips for Best Results

### For Testing
1. **Generate diverse data**: Create multiple attempts with varying scores and times
2. **Test edge cases**: Single attempt, 100 attempts, 0% score, 100% score
3. **Test all game types**: Ensure Pairs, Flashcards, and Splat all work
4. **Test date ranges**: Complete attempts on different days to see trends

### For Development
1. **Use React DevTools**: Inspect component state
2. **Check Network tab**: Verify data loading (will be API calls in production)
3. **Test performance**: Large datasets (50+ attempts)
4. **Test accessibility**: Keyboard navigation, screen readers

## 📱 Mobile Testing Checklist

- [ ] All three tabs accessible
- [ ] Filters work with touch
- [ ] Table scrolls horizontally
- [ ] Charts render correctly
- [ ] Cards stack vertically
- [ ] Buttons are touch-friendly (44x44px minimum)
- [ ] Text readable at mobile sizes
- [ ] No horizontal overflow

## 🔄 Data Flow Test

1. **Create attempt** (play game)
2. **Assignment Attempts** → See new row in table
3. **Personal Bests** → Best score updates if higher
4. **Progress Trends** → New data point in chart
5. **Attempt Details** → View full breakdown
6. **Play Again** → Navigate to game

## ✅ Acceptance Criteria

### Must Have
- [x] All three tabs load without errors
- [x] Filters work correctly
- [x] Sorting works correctly
- [x] CSV export downloads valid file
- [x] Charts render with data
- [x] Attempt details show correctly
- [x] Navigation works between pages
- [x] Empty states show appropriately
- [x] Mobile responsive

### Nice to Have
- [x] Smooth animations
- [x] Color-coded scores
- [x] Trophy rankings
- [x] Personalized insights
- [x] Study streak tracking

## 🚀 Next Steps After Testing

1. Test with real students
2. Gather feedback on insights
3. Add more chart types (pie chart for game type distribution)
4. Implement date range picker
5. Add compare feature (multiple attempts side-by-side)
6. Create print view
7. Add goal setting

## Summary

The progress tracking system is fully functional with:
- ✅ Three comprehensive tabs
- ✅ Advanced filtering and sorting
- ✅ Interactive charts
- ✅ Detailed breakdowns
- ✅ CSV export
- ✅ Mobile responsive

Ready for student testing! 📊🎯

**Estimated testing time**: 20-30 minutes for full feature exploration
