# Pairs/Memory Game Implementation

## Overview

A fully functional memory matching game with card flipping animations, game logic, timer, move tracking, and result screen with star ratings.

## Features Implemented

### ✅ Game Mechanics

**Grid Layout**:
- Responsive grid that adapts to card count
- 2×2 grid for 4 cards (2 pairs)
- 4×4 grid for up to 16 cards (8 pairs)
- 6×6 grid for larger sets

**Card System**:
- Cards rendered face-down with consistent design
- Purple gradient back with pattern overlay
- 3D flip animation using CSS transforms
- Smooth transitions with Framer Motion

**Game Logic**:
- Click to flip card (max 2 cards at a time)
- Matching pairs stay face-up
- Non-matching pairs flip back after 1 second
- Visual feedback for matched pairs (green border + sparkle icon)
- Move counter tracks flip attempts (1 move = 2 cards flipped)
- Real-time timer showing elapsed time

### ✅ Win Detection & Scoring

**Win Condition**:
- Game completes when all pairs are matched
- Automatic transition to result screen

**Scoring System**:
- Score: Always 100% (completion-based)
- Time: Total seconds taken
- Moves: Number of flip attempts
- Star Rating (1-3 stars):
  - 3 stars: Perfect game (minimum moves)
  - 2 stars: Good efficiency (≤ 1.5× minimum)
  - 1 star: Completed

**Perfect Game**:
- Achieved by matching all pairs in minimum moves
- Minimum moves = total number of pairs
- Special badge and message on result screen

### ✅ Result Screen

**Display Elements**:
- Trophy icon with celebratory animation
- Star rating with staggered animation
- Three stat cards:
  - Score (100%)
  - Time taken (MM:SS format)
  - Total moves
- Efficiency badge (Perfect/Great/Good)
- Performance details breakdown
- Confetti animation effect

**Actions**:
- "Play Again" - Restart the same game
- "Back to Assignments" - Return to student dashboard

### ✅ Data Persistence

**Game Attempt Saved**:
```typescript
{
  scorePercentage: 100,
  timeTaken: seconds,
  attemptData: {
    moves: number,
    pairs: number,
    perfectGame: boolean
  }
}
```

Stored in localStorage under `dev_game_attempts` key.

## Technical Implementation

### Component Architecture

```
src/components/games/pairs/
├── PairsGame.tsx           # Main game controller
├── PairsCard.tsx           # Individual card component
└── PairsResultScreen.tsx   # Victory screen
```

### Key Technologies

- **Framer Motion**: Card flip animations, result screen animations
- **React Hooks**: useState, useEffect, useCallback for game state
- **CSS 3D Transforms**: Card flip effect with preserve-3d
- **Fisher-Yates Algorithm**: Card shuffling

### Game State Management

```typescript
interface GameCard {
  id: string;           // Unique card ID
  content: string;      // Display text
  image?: string;       // Optional image
  pairId: string;       // ID to match pairs
  isFlipped: boolean;   // Current flip state
  isMatched: boolean;   // Whether matched
}
```

**State Flow**:
1. Initialize game → shuffle cards
2. User clicks card → flip animation
3. Two cards flipped → check match
4. Match: mark as matched, keep flipped
5. No match: flip back after 1s delay
6. All matched → trigger completion

### Shuffle Algorithm

```typescript
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

## File Structure

```
src/
├── components/games/pairs/
│   ├── PairsGame.tsx              # Main game
│   ├── PairsCard.tsx              # Card component
│   └── PairsResultScreen.tsx      # Result screen
├── pages/student/
│   ├── StudentDashboard.tsx       # Dashboard (updated)
│   └── PlayGame.tsx               # Game launcher
├── services/
│   └── game-attempt.service.ts    # Save attempts
└── types/
    ├── game.ts                    # Game types
    └── assignment.ts              # Assignment types
```

## Usage

### From Student Dashboard

1. **Navigate** to student dashboard
2. **Click** "Play Now" or "Play Again" on an assignment card
3. **Route**: `/student/play/:assignmentId`
4. **Game loads** based on assignment's game data
5. **Complete** the game to save attempt
6. **Return** to dashboard

### Programmatic Usage

```tsx
import PairsGame from '@/components/games/pairs/PairsGame';

<PairsGame
  gameData={pairsGameData}
  gameName="Math Facts Challenge"
  onComplete={(result) => {
    console.log('Score:', result.scorePercentage);
    console.log('Time:', result.timeTaken);
    console.log('Moves:', result.attemptData.moves);
  }}
  onExit={() => navigate('/student/dashboard')}
/>
```

### Game Data Format

```typescript
interface PairsGameData {
  description?: string;
  items: Array<{
    id: string;
    leftText: string;
    rightText: string;
    leftImage?: string;
    rightImage?: string;
  }>;
}
```

**Example**:
```json
{
  "description": "Match numbers with their operations",
  "items": [
    { "id": "1", "leftText": "5 + 3", "rightText": "8" },
    { "id": "2", "leftText": "10 - 4", "rightText": "6" },
    { "id": "3", "leftText": "3 × 4", "rightText": "12" }
  ]
}
```

## Testing

### Quick Test with Dev Tools

1. **Start dev server**: `npm run dev`
2. **Login as student** and navigate to dashboard
3. **Click "Dev Tools"** button (bottom-left)
4. **Click "Create Test Data"**
5. **Click "Play Now"** on "Math Facts Challenge" assignment
6. **Play the game** and complete it
7. **Check result screen** shows correct stats
8. **Verify attempt saved** (check dashboard for score)

### Manual Test Steps

**Basic Gameplay**:
- [x] Cards start face-down
- [x] Click flips card with 3D animation
- [x] Can flip maximum 2 cards at a time
- [x] Matching pairs stay face-up with green border
- [x] Non-matching pairs flip back after 1 second
- [x] Cannot flip already matched cards
- [x] Move counter increments correctly
- [x] Timer runs during game

**Matching Logic**:
- [x] Pairs with same `pairId` match
- [x] Matched cards get green border and sparkle
- [x] Matched cards cannot be flipped again
- [x] Non-matched cards return to face-down

**Win Condition**:
- [x] Game completes when all pairs matched
- [x] Transitions to result screen
- [x] Displays correct score (100%)
- [x] Shows time in MM:SS format
- [x] Shows move count

**Star Rating**:
- [x] 3 stars for perfect game (moves = pairs)
- [x] 2 stars for good performance (moves ≤ 1.5× pairs)
- [x] 1 star for completion

**Data Persistence**:
- [x] Attempt saved to localStorage
- [x] Includes score, time, moves, perfect flag
- [x] Dashboard shows best score
- [x] Dashboard shows attempt count

**UI/UX**:
- [x] Responsive grid on mobile/tablet/desktop
- [x] Smooth animations throughout
- [x] Clear visual feedback
- [x] Restart button works
- [x] Exit button returns to dashboard

### Creating Custom Test Games

```typescript
// In browser console
const game = {
  id: 'custom_pairs',
  tutorId: 'test_tutor',
  name: 'Custom Memory Game',
  gameType: 'PAIRS',
  gameData: JSON.stringify({
    description: 'Match the items',
    items: [
      { id: '1', leftText: 'Apple', rightText: '🍎' },
      { id: '2', leftText: 'Banana', rightText: '🍌' },
      { id: '3', leftText: 'Cherry', rightText: '🍒' },
      { id: '4', leftText: 'Grape', rightText: '🍇' },
    ]
  }),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const games = JSON.parse(localStorage.getItem('dev_games') || '[]');
games.push(game);
localStorage.setItem('dev_games', JSON.stringify(games));

// Create assignment for this game
const assignment = {
  id: 'custom_assignment',
  gameId: 'custom_pairs',
  groupId: 'test_group_1',
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  passPercentage: 80,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const assignments = JSON.parse(localStorage.getItem('dev_assignments') || '[]');
assignments.push(assignment);
localStorage.setItem('dev_assignments', JSON.stringify(assignments));

// Refresh dashboard
location.reload();
```

## Animations

### Card Flip
- **Duration**: 0.6s
- **Easing**: easeInOut
- **Transform**: rotateY(180deg)
- **3D Effect**: perspective(1000px)

### Result Screen
- **Trophy**: Scale + rotate spring animation
- **Stars**: Staggered scale + rotate animations
- **Stats Cards**: Sequential slide-in from different directions
- **Confetti**: Continuous falling animation

### Matched Cards
- **Green Border**: Instant
- **Sparkle Icon**: Scale + rotate spring animation

## Performance Considerations

1. **Debouncing**: Prevent clicks during checking period
2. **Memoization**: useCallback for click handlers
3. **Efficient Updates**: Update only changed cards in state
4. **Animation Performance**: Use transform and opacity (GPU-accelerated)

## Known Limitations

1. **No Hints System**: Players must rely on memory
2. **No Difficulty Levels**: Same rules for all games
3. **No Leaderboards**: Only tracks personal best
4. **No Sound Effects**: Silent gameplay
5. **No Multiplayer**: Single-player only

## Future Enhancements

### Potential Features
- [ ] Difficulty modes (easy/medium/hard with time limits)
- [ ] Hint system (reveal cards temporarily)
- [ ] Sound effects (flip, match, win)
- [ ] Combo system (bonus points for consecutive matches)
- [ ] Leaderboards per assignment
- [ ] Practice mode (no scoring)
- [ ] Custom themes (card back designs)
- [ ] Multiplayer support (race mode)
- [ ] Daily challenges
- [ ] Achievement system

### Code Improvements
- [ ] Extract game state to custom hook
- [ ] Add unit tests for game logic
- [ ] Optimize re-renders with React.memo
- [ ] Add error boundaries
- [ ] Implement pause functionality
- [ ] Add keyboard navigation
- [ ] Improve accessibility (ARIA labels)

## Troubleshooting

### Cards not flipping
- Check console for errors
- Verify framer-motion is installed
- Check CSS backface-visibility support

### Game not saving
- Check localStorage is available
- Verify studentId is set
- Check console for save errors

### Animation lag
- Reduce number of cards
- Disable confetti on result screen
- Check browser performance

### Route not found
- Verify route added to App.tsx
- Check assignmentId in URL
- Ensure ProtectedRoute configured

## API Integration (Production)

When moving to production API:

1. Replace `PlayGame.tsx` data loading with API calls
2. Update `game-attempt.service.ts` to POST to backend
3. Add loading states for network requests
4. Add error handling for failed requests
5. Implement retry logic
6. Add optimistic updates for better UX

**Example API Endpoints**:
```
GET  /api/assignments/:id
GET  /api/games/:id
POST /api/game-attempts
GET  /api/game-attempts/assignment/:id
```

## Summary

The Pairs/Memory game is fully functional with:
- ✅ Responsive grid layout
- ✅ 3D card flip animations
- ✅ Complete game logic
- ✅ Move tracking and timer
- ✅ Star-based scoring
- ✅ Beautiful result screen
- ✅ Data persistence
- ✅ Integration with student dashboard

Ready for play testing and tutor feedback!
