# Pairs Game - Quick Start Guide

## 🎮 How to Play

### Starting the Game

1. **Run the app**:
   ```bash
   npm run dev
   ```

2. **Login as a student** or use RoleSwitcher to switch to student role

3. **Setup test data** (if not done already):
   - Navigate to `/student/dashboard`
   - Click the **"Dev Tools"** button (bottom-left, orange border)
   - Click **"Create Test Data"**

4. **Start the game**:
   - Find "Math Facts Challenge" assignment card
   - Click **"Play Now"**

### Playing

1. **Click any card** to flip it face-up
2. **Click another card** to flip it
3. **Match found?**
   - ✅ Both cards stay face-up with green borders
   - ⭐ Sparkle animation appears
4. **No match?**
   - ❌ Both cards flip back after 1 second
   - Try to remember their positions!

5. **Continue** until all pairs are matched

### Winning

- **Complete all pairs** to finish the game
- **Result screen** shows:
  - Your star rating (1-3 stars)
  - Total time taken
  - Number of moves
  - Efficiency badge

### Perfect Game

To get 3 stars and "Perfect Game":
- Match all pairs in **minimum moves**
- Minimum moves = number of pairs
- Example: 6 pairs = 6 moves for perfect score

## 📊 Game Metrics

**Score**: Always 100% when completed

**Time**: Total seconds from first flip to last match

**Moves**: Number of flip attempts
- 1 move = flipping 2 cards
- Lower is better

**Star Rating**:
- ⭐⭐⭐ Perfect (moves = pairs)
- ⭐⭐ Great (moves ≤ 1.5× pairs)
- ⭐ Good (completed)

## 🎯 Test Checklist

### Basic Functionality
- [ ] Cards start face-down
- [ ] Clicking flips card with animation
- [ ] Max 2 cards can be flipped at once
- [ ] Timer starts on first flip
- [ ] Move counter increments correctly

### Matching Logic
- [ ] Matching pairs stay face-up
- [ ] Non-matching pairs flip back
- [ ] Matched cards show green border + sparkle
- [ ] Cannot flip matched cards again

### Result Screen
- [ ] Shows after all pairs matched
- [ ] Displays 3-star rating
- [ ] Shows time in MM:SS format
- [ ] Shows move count
- [ ] "Play Again" restarts game
- [ ] "Back to Assignments" returns to dashboard

### Data Persistence
- [ ] Attempt is saved to localStorage
- [ ] Dashboard shows updated score
- [ ] Dashboard shows attempt count
- [ ] Best score is highlighted

### Responsive Design
- [ ] Works on mobile (smaller grid)
- [ ] Works on tablet (medium grid)
- [ ] Works on desktop (full grid)
- [ ] Cards scale appropriately

## 🔧 Dev Tools

### View Saved Attempts

```javascript
// In browser console
const attempts = JSON.parse(localStorage.getItem('dev_game_attempts') || '[]');
console.table(attempts);
```

### Clear All Attempts

```javascript
localStorage.removeItem('dev_game_attempts');
location.reload();
```

### Create Custom Game

```javascript
// Create a simple 3-pair game
const game = {
  id: 'easy_pairs',
  tutorId: 'test_tutor',
  name: 'Easy Memory Game',
  gameType: 'PAIRS',
  gameData: JSON.stringify({
    description: 'Match the pairs!',
    items: [
      { id: '1', leftText: 'Cat', rightText: '🐱' },
      { id: '2', leftText: 'Dog', rightText: '🐶' },
      { id: '3', leftText: 'Fish', rightText: '🐟' },
    ]
  }),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const games = JSON.parse(localStorage.getItem('dev_games') || '[]');
games.push(game);
localStorage.setItem('dev_games', JSON.stringify(games));

// Create assignment
const assignment = {
  id: 'easy_assignment',
  gameId: 'easy_pairs',
  groupId: 'test_group_1',
  dueDate: null,
  passPercentage: 70,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const assignments = JSON.parse(localStorage.getItem('dev_assignments') || '[]');
assignments.push(assignment);
localStorage.setItem('dev_assignments', JSON.stringify(assignments));

location.reload();
```

## 🎨 Visual Features

### Card Design
- **Back**: Purple gradient with dot pattern
- **Front**: White with content + optional image
- **Matched**: Green border + sparkle icon
- **Hover**: Subtle scale effect

### Animations
- **Flip**: 0.6s 3D rotation
- **Match**: Spring animation on sparkle icon
- **Result**: Staggered entrance animations
- **Confetti**: Continuous falling effect

### Colors
- Purple: Game theme (#8B5CF6)
- Green: Matched state (#10B981)
- Yellow: Trophy/stars (#FBBF24)
- Blue: Timer (#3B82F6)

## 🐛 Common Issues

### Game won't load
**Problem**: "Unable to Load Game" error

**Solution**:
1. Check assignment exists in localStorage
2. Check game exists with matching gameId
3. Verify gameData is valid JSON
4. Create test data using Dev Tools

### Cards not flipping
**Problem**: Click doesn't flip card

**Solution**:
1. Wait for checking period to finish
2. Don't click already matched cards
3. Check browser console for errors
4. Verify framer-motion is installed

### Score not saving
**Problem**: Attempt not appearing in dashboard

**Solution**:
1. Complete the game fully (all pairs matched)
2. Check browser console for save errors
3. Verify localStorage is not disabled
4. Check student ID is set in session

### Animation stuttering
**Problem**: Laggy animations

**Solution**:
1. Close other browser tabs
2. Reduce number of pairs (fewer cards)
3. Disable hardware acceleration
4. Try different browser

## 📱 Responsive Breakpoints

### Mobile (< 640px)
- Grid: 2 columns
- Card size: ~150px
- Best for: 4-8 pairs (2×2 to 4×2)

### Tablet (640px - 1024px)
- Grid: 4 columns
- Card size: ~175px
- Best for: 8-16 pairs (4×4)

### Desktop (> 1024px)
- Grid: 6 columns
- Card size: ~200px
- Best for: 12-18 pairs (6×6)

## 🎓 Tips for Best Experience

1. **Start with fewer pairs** (3-5) to test mechanics
2. **Use emojis** for easy recognition (🍎🍌🍒)
3. **Keep text short** for better card display
4. **Test on mobile** for touch interactions
5. **Try perfect game** for challenge

## 🚀 Next Steps

After testing Pairs game:
1. Implement other game types (Flashcards, Multiple Choice, etc.)
2. Add tutor game creation UI
3. Connect to real backend API
4. Add sound effects
5. Implement leaderboards
6. Add hint system
7. Create difficulty modes

## 📞 Need Help?

Check these files for details:
- `PAIRS_GAME_IMPLEMENTATION.md` - Full technical docs
- `src/components/games/pairs/PairsGame.tsx` - Game logic
- `src/components/games/pairs/PairsCard.tsx` - Card component
- `src/components/games/pairs/PairsResultScreen.tsx` - Result screen

Happy testing! 🎮
