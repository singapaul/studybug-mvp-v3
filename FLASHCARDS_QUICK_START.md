# Flashcards Game - Quick Start Guide

## 🎓 How to Play

### Starting the Game

1. **Run the app**: `npm run dev`
2. **Login as student** (use RoleSwitcher if needed)
3. **Setup test data**:
   - Navigate to `/student/dashboard`
   - Click **"Dev Tools"** (bottom-left)
   - Click **"Create Test Data"**
4. **Start studying**:
   - Find "Science Vocabulary" assignment
   - Click **"Play Now"**

### Studying with Flashcards

1. **View the question** (front of card)
2. **Think of the answer**
3. **Flip the card**:
   - Click anywhere on card
   - Press `Space` or `Enter`
   - Swipe up/down (mobile)
4. **Assess yourself**:
   - Click "I knew this" (green) or press `1`
   - Click "I didn't know this" (red) or press `2`
5. **Navigate**:
   - Click Previous/Next buttons
   - Use arrow keys `←` `→`
   - Swipe left/right (mobile)
6. **Continue** until all cards assessed

### Completing the Session

After assessing all cards:
- View your **percentage known**
- See **time spent** studying
- Check **performance level**
- Choose next action:
  - **Review Unknown Cards** (study only cards you missed)
  - **Study Again** (restart session)
  - **Back to Assignments** (return to dashboard)

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` or `Enter` | Flip card |
| `←` | Previous card |
| `→` | Next card |
| `1` | I knew this (when flipped) |
| `2` | I didn't know this (when flipped) |
| `?` | Show keyboard shortcuts |

**Pro tip**: Use numbers 1 and 2 for lightning-fast studying!

## 📱 Mobile Gestures

| Gesture | Action |
|---------|--------|
| **Swipe Up/Down** | Flip card |
| **Swipe Left** | Previous card |
| **Swipe Right** | Next card |
| **Tap Card** | Flip card |

## 🎯 Features to Test

### Basic Functionality
- [ ] Card displays question on front
- [ ] Card displays answer on back
- [ ] Flip animation is smooth
- [ ] Multiple ways to flip (click, spacebar, swipe)
- [ ] Navigate with buttons and arrows
- [ ] Assessment buttons appear when flipped

### Self-Assessment
- [ ] "I knew this" marks card as known (green dot)
- [ ] "I didn't know this" marks card for review (red dot)
- [ ] Auto-advances to next card after assessment
- [ ] Keyboard shortcuts 1/2 work
- [ ] Progress dots update correctly

### Progress Tracking
- [ ] Card counter shows current position
- [ ] Progress bar fills as you go
- [ ] Dot indicators show card status:
  - Gray = not viewed
  - Blue = viewed but not assessed
  - Green = known
  - Red = needs review
  - Ring = current card

### Session Features
- [ ] Shuffle button randomizes order
- [ ] Timer tracks study time
- [ ] ? key shows keyboard shortcuts
- [ ] Exit button returns to dashboard

### Summary Screen
- [ ] Shows percentage known (with animation)
- [ ] Displays total cards, known, unknown
- [ ] Shows time in MM:SS format
- [ ] Performance level matches score
- [ ] "Review Unknown" button appears if applicable

### Review Mode
- [ ] "Review Unknown" filters to only missed cards
- [ ] Shows "Review Mode" badge
- [ ] Can complete review session
- [ ] Can study again after review

### Progress Persistence
- [ ] Leave mid-session (close tab/browser)
- [ ] Return to same assignment
- [ ] Progress restores automatically
- [ ] Continue from where you left off
- [ ] Progress cleared after completion

## 🧪 Test Scenarios

### Scenario 1: Perfect Score
1. Study all 8 cards
2. Mark all as "I knew this"
3. Complete session
4. Should see: 100% known, "Excellent!" message
5. No "Review Unknown" button (all known)

### Scenario 2: Partial Knowledge
1. Study all cards
2. Mark 4 as "I knew this", 4 as "I didn't know"
3. Complete session
4. Should see: 50% known, "Good Effort!" message
5. "Review Unknown Cards" button appears
6. Click review button
7. Should see only 4 unknown cards

### Scenario 3: Interrupted Session
1. Start studying
2. Assess 3-4 cards
3. Close browser/tab completely
4. Reopen and navigate back to game
5. Should restore progress at card 4
6. Continue from where you left off

### Scenario 4: Shuffle Feature
1. Start session, view card 1
2. Click shuffle button
3. Confirm dialog
4. Cards appear in different order
5. Progress resets

### Scenario 5: Keyboard Mastery
1. Start session
2. Use only keyboard:
   - Space to flip
   - 1 or 2 to assess
   - Arrows to navigate
3. Complete entire session without mouse
4. Press ? to see shortcuts anytime

### Scenario 6: Mobile Experience
1. Open on mobile device (or use dev tools mobile mode)
2. Swipe up to flip first card
3. Tap assessment buttons
4. Swipe right to next card
5. Complete session with gestures only

## 📊 Expected Results

### After Completing 8 Cards

**All Known (8/8)**:
- Score: 100%
- Performance: "Excellent!" 🌟
- Color: Green
- Review button: Hidden

**Mostly Known (6/8)**:
- Score: 75%
- Performance: "Great Job!" ⭐
- Color: Blue
- Review button: Shows "Review 2 Unknown Cards"

**Half Known (4/8)**:
- Score: 50%
- Performance: "Good Effort!" 👍
- Color: Yellow
- Review button: Shows "Review 4 Unknown Cards"
- Study tips appear

**Struggling (2/8)**:
- Score: 25%
- Performance: "Keep Practicing!" 💪
- Color: Orange
- Review button: Shows "Review 6 Unknown Cards"
- Study tips appear

## 🎨 Visual Indicators

### Card States
- **Front (Question)**: Blue gradient, blue badge
- **Back (Answer)**: Green gradient, green badge
- **Flipping**: 3D rotation animation

### Progress Dots
- **Gray dot**: Not viewed yet
- **Blue dot**: Viewed but not assessed
- **Green dot**: Marked as known
- **Red dot**: Marked as unknown
- **Ring around dot**: Currently viewing this card

### Assessment Buttons
- **Green button**: "I knew this" with checkmark
- **Red button**: "I didn't know this" with X mark
- Both show keyboard hint (Press 1/2)

## 🔧 Dev Tools

### View Saved Progress

```javascript
// In browser console
const key = 'flashcards_progress_Science_Vocabulary';
const progress = JSON.parse(localStorage.getItem(key) || 'null');
console.log('Saved progress:', progress);
```

### Clear Saved Progress

```javascript
localStorage.removeItem('flashcards_progress_Science_Vocabulary');
location.reload();
```

### Simulate Interrupted Session

```javascript
// Study 3 cards, then run:
localStorage.setItem('flashcards_progress_Science_Vocabulary', JSON.stringify({
  cards: [...], // current cards
  currentIndex: 3,
  progress: [...], // progress array
  time: 45,
  isShuffled: false,
  lastSaved: new Date().toISOString()
}));
location.reload();
```

## 🐛 Troubleshooting

### Card won't flip
**Problem**: Clicking does nothing

**Solution**:
1. Check browser console for errors
2. Verify framer-motion is installed
3. Try spacebar instead
4. Hard refresh browser

### Keyboard shortcuts not working
**Problem**: Keys don't do anything

**Solution**:
1. Click on page to focus
2. Make sure not in text input
3. Try different key
4. Press ? to see help

### Progress not saving
**Problem**: Session resets after reload

**Solution**:
1. Check localStorage not disabled
2. Check browser storage quota
3. Look for console errors
4. Try incognito mode

### Gestures not working
**Problem**: Swipes don't register

**Solution**:
1. Swipe at least 50px
2. Don't swipe diagonally
3. Try slower swipe
4. Use buttons instead

## 💡 Study Tips

### For Best Results:
1. **Say answers out loud** before flipping
2. **Be honest** with self-assessment
3. **Review unknown cards** immediately
4. **Use shuffle** to test true knowledge
5. **Take breaks** between sessions
6. **Study in short bursts** (10-15 min)
7. **Review regularly** (spaced repetition)

### Keyboard Power User:
1. Keep hands on home row
2. Use Space to flip
3. Use 1/2 instantly after seeing answer
4. Use arrows to navigate
5. Complete entire deck without mouse!

### Mobile Master:
1. Swipe up to flip
2. Tap assessment quickly
3. Swipe right to next
4. Hold phone portrait mode
5. One-handed operation possible

## 🚀 Next Steps

After testing Flashcards:
1. Try creating custom flashcard sets
2. Test with different content (languages, formulas, etc.)
3. Practice using only keyboard
4. Test on mobile device
5. Try review mode after first session
6. Test interrupted session recovery

## 📞 Need Help?

Check these files:
- `FLASHCARDS_GAME_IMPLEMENTATION.md` - Full technical docs
- `src/components/games/flashcards/FlashcardsGame.tsx` - Game logic
- `src/components/games/flashcards/FlashcardCard.tsx` - Card component

Press `?` anytime during game to see shortcuts!

Happy studying! 📚
