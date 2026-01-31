## Splat Reaction Game Implementation

## Overview

A fast-paced reaction game where players must quickly click correct answers positioned randomly on screen before time runs out. Features countdown timers, particle effects, sound effects, and speed-based scoring.

## Features Implemented

### ✅ Game Mechanics

**Display**:
- Question prominently at top in large card
- 3-6 answer buttons randomly positioned on screen
- Countdown timer per question (configurable, default 10s)
- Progress bar showing question position in game
- Score display in header

**Button Positioning**:
- Absolute positioning with random placement
- Grid-based distribution to ensure spread
- Collision avoidance (buttons don't overlap)
- Safe zones (avoids header area)
- Responsive positioning for different screen sizes

**Game Flow**:
1. Display question with countdown
2. Show answer buttons in random positions
3. Player clicks answer
4. **Correct**: Splat animation, particles, sound, +points, auto-advance
5. **Wrong**: Shake animation, buzzer, -10 points, show correct, advance
6. **Timeout**: Show correct answer, buzzer, 0 points, advance
7. Repeat until all questions complete
8. Show results screen

### ✅ Animations

**Correct Answer ("Splat")**:
- Scale up (2x)
- Fade out
- Color burst particle effect
- Central explosion wave
- 20 colored particles exploding outward
- 8 rotating star particles
- "SPLAT!" text animation
- Green color transition

**Wrong Answer**:
- Shake animation (horizontal oscillation)
- Red color pulse
- Brief pause to show mistake
- Then reveal correct answer highlighted

**Timer Warning**:
- Last 3 seconds: pulsing animation
- Red color when ≤ 3 seconds
- Tick sound each second

**Button Entrance**:
- Staggered entrance (0.1s delay per button)
- Spin in from 0 to random position
- Scale up spring animation

### ✅ Scoring System

**Base Points**: 100 per correct answer

**Speed Bonus**: Up to 50 extra points
- Formula: `(timeLimit - reactionTime) / timeLimit × 50`
- Faster answer = more points
- Instant answer ≈ 150 points total
- Answer at 50% time ≈ 125 points
- Answer at 90% time ≈ 105 points

**Penalties**:
- Wrong answer: -10 points
- Timeout: 0 points (no penalty)

**Score can't go below 0**

### ✅ Results Screen

**Statistics Displayed**:
- **Total Score**: Large, prominent
- **Percentage Correct**: Badge
- **Correct Answers**: X/Y format
- **Average Reaction Time**: In ms or seconds
- **Fastest Reaction**: Best time achieved
- **Average Points per Question**

**Reaction Time Breakdown**:
- Individual times for each question
- Shows Q1, Q2, etc. with time
- Easy to identify slow vs fast responses

**Performance Levels**:
- 90%+: "Lightning Fast!" ⚡ (yellow)
- 75-89%: "Sharp Reflexes!" 🎯 (orange)
- 50-74%: "Getting Better!" 👍 (blue)
- <50%: "Keep Practicing!" 💪 (purple)

**Improvement Tips**:
- Shown when score < 75%
- Specific advice for improving
- Focus, speed, practice suggestions

### ✅ Sound Effects

**Web Audio API** (no external files needed):

**Tick** (Timer countdown):
- High-pitched sine wave (800Hz)
- 0.1s duration
- Plays on last 3 seconds

**Splat** (Correct answer):
- Layered synthesizer sound
- Base tone (220Hz) + harmonics (440Hz, 880Hz)
- Noise burst for impact
- 0.3s duration
- Satisfying "pop" effect

**Wrong** (Incorrect/timeout):
- Descending sawtooth wave (200Hz → 50Hz)
- Buzzer-like sound
- 0.3s duration

**Mute Toggle**:
- Button in header (volume icon)
- Persists sounds on/off preference
- Visual indicator (Volume2/VolumeX icon)

### ✅ Data Persistence

**Saved on Completion**:
```typescript
{
  scorePercentage: 75,          // (6/8) × 100
  timeTaken: 48,                // Total seconds (sum of reaction times)
  attemptData: {
    totalQuestions: 8,
    correctAnswers: 6,
    totalScore: 850,
    reactionTimes: [1200, 850, 2100, ...], // Array in ms
    scores: [140, 145, 120, -10, ...],     // Points per question
    averageReactionTime: 1500,             // Average in ms
    fastestReaction: 850                   // Best time in ms
  }
}
```

Saved to `localStorage.dev_game_attempts` for MVP.

## Technical Implementation

### Component Architecture

```
src/components/games/splat/
├── SplatGame.tsx           # Main game controller (400+ lines)
├── SplatButton.tsx         # Answer button with positioning (100+ lines)
├── ParticleEffect.tsx      # Explosion effect (100+ lines)
├── SplatResult.tsx         # Results screen (250+ lines)
└── soundEffects.ts         # Web Audio synth (150+ lines)
```

### Key Technologies

- **Framer Motion**: Button animations, particle effects, results
- **Web Audio API**: Synthesized sound effects
- **React Hooks**: useState, useEffect, useCallback, useRef
- **CSS Animations**: Shake effect, pulse warnings
- **Absolute Positioning**: Random button placement

### Button Positioning Algorithm

```typescript
function generateRandomPosition(
  index: number,
  totalAnswers: number,
  buttonWidth: number,
  buttonHeight: number
): { x: number; y: number } {
  // Calculate grid
  const cols = Math.ceil(Math.sqrt(totalAnswers));
  const rows = Math.ceil(totalAnswers / cols);

  // Assign to cell
  const col = index % cols;
  const row = Math.floor(index / cols);

  // Random within cell
  const x = minX + col * cellWidth + random * (cellWidth - buttonWidth);
  const y = minY + row * cellHeight + random * (cellHeight - buttonHeight);

  return { x, y };
}
```

**Benefits**:
- Ensures even distribution
- Prevents overlap
- Maintains randomness
- Responsive to screen size

### Game State Management

```typescript
interface QuestionState {
  question: string;
  correctAnswer: string;
  answers: string[];      // All options
  image?: string;
  startTime: number;      // For reaction time
}

interface QuestionResult {
  questionId: string;
  correct: boolean;
  reactionTime: number;   // In milliseconds
  points: number;         // Calculated score
  timedOut: boolean;
}
```

### Particle System

**Central Burst**:
- Large expanding circle
- Fades out as it grows
- Orange-to-red gradient

**20 Particles**:
- Radial distribution (360°)
- Random distances (100-200px)
- Random sizes (8-20px)
- Multiple colors (orange, red, pink, yellow)
- Fade + scale down animation

**8 Star Particles**:
- Emoji stars (⭐)
- Even distribution around circle
- Rotate while expanding
- Fade out

**"SPLAT!" Text**:
- Large bold text
- Scales up and fades
- Slight rotation
- Text shadow glow

## File Structure

```
src/
├── components/games/splat/
│   ├── SplatGame.tsx              # Main game
│   ├── SplatButton.tsx            # Answer button
│   ├── ParticleEffect.tsx         # Burst effect
│   ├── SplatResult.tsx            # Summary screen
│   └── soundEffects.ts            # Audio synthesis
├── pages/student/
│   └── PlayGame.tsx               # Updated with Splat
├── pages/tutor/
│   └── PreviewGame.tsx            # Updated with Splat
└── index.css                      # Added shake animation
```

## Usage

### From Student Dashboard

1. Click "Play Now" on Splat assignment
2. Route: `/student/play/:assignmentId`
3. Game loads with countdown
4. Click answers quickly for bonus points
5. Complete all questions
6. View results

### From Tutor Preview

1. Click on Splat game in games list
2. Route: `/tutor/games/:gameId`
3. Preview mode (results not saved)
4. Yellow "Preview Mode" banner

### Game Data Format

```typescript
interface SplatGameData {
  description?: string;
  timeLimit?: number;     // Seconds per question (default: 10)
  items: Array<{
    id: string;
    question: string;
    answer: string;
    image?: string;
  }>;
}
```

**Example**:
```json
{
  "description": "Answer fast! Test your quick thinking",
  "timeLimit": 8,
  "items": [
    { "id": "1", "question": "What is 5 + 7?", "answer": "12" },
    { "id": "2", "question": "What is 9 × 3?", "answer": "27" },
    { "id": "3", "question": "What is 20 - 8?", "answer": "12" }
  ]
}
```

**Note**: Wrong answers are auto-generated from other questions' correct answers.

## Testing

### Quick Test

1. `npm run dev`
2. Login as student
3. Dev Tools → Create Test Data
4. Play "Quick Math Splat" (8 questions, 8s each)
5. Test features:
   - Answer quickly (high score)
   - Answer slowly (low bonus)
   - Answer wrong (shake + penalty)
   - Let timer run out (timeout)
   - Toggle sound on/off

### Test Checklist

**Game Mechanics**:
- [x] Question displays prominently
- [x] Countdown timer active
- [x] Timer turns red at 3 seconds
- [x] Tick sound plays each second (last 3)
- [x] Answer buttons randomly positioned
- [x] Buttons don't overlap
- [x] Buttons accessible on all screen sizes

**Correct Answer**:
- [x] Splat animation plays
- [x] Particle burst effect
- [x] Splat sound plays
- [x] Points awarded (100-150)
- [x] Auto-advances to next

**Wrong Answer**:
- [x] Shake animation
- [x] Wrong buzzer plays
- [x] -10 points penalty
- [x] Shows correct answer highlighted
- [x] Then advances

**Timeout**:
- [x] Wrong buzzer plays
- [x] Shows correct answer
- [x] 0 points awarded
- [x] Advances after brief delay

**Scoring**:
- [x] Base points (100) awarded
- [x] Speed bonus calculated correctly
- [x] Fast answers get more points
- [x] Wrong answer penalty (-10)
- [x] Score can't go below 0

**Sound Effects**:
- [x] Tick sound (last 3 seconds)
- [x] Splat sound (correct)
- [x] Wrong buzzer (incorrect/timeout)
- [x] Mute toggle works
- [x] Icon changes (Volume2/VolumeX)

**Results Screen**:
- [x] Total score displayed
- [x] Percentage correct badge
- [x] All stats accurate
- [x] Reaction times shown
- [x] Performance level matches score
- [x] Tips shown when score < 75%

**Animations**:
- [x] Button entrance staggered
- [x] Splat animation smooth
- [x] Particles explode correctly
- [x] Shake animation on wrong
- [x] Results animations staggered

## Animations Reference

### Button Entrance
```typescript
initial={{ opacity: 0, scale: 0, rotate: -180 }}
animate={{ opacity: 1, scale: 1, rotate: 0, x, y }}
transition={{ type: 'spring', duration: 0.5, delay: index * 0.1 }}
```

### Splat Animation
```typescript
animate={{ opacity: 0, scale: 2 }}
transition={{ duration: 0.6, ease: 'easeOut' }}
```

### Shake Animation (CSS)
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}
```

## Performance Optimizations

1. **useCallback**: Memoized click handlers
2. **useRef**: Reaction time tracking without re-renders
3. **Absolute Positioning**: No layout thrashing
4. **Web Audio**: No file loading delays
5. **Framer Motion**: GPU-accelerated animations
6. **Cleanup**: Intervals cleared on unmount

## Known Limitations

1. **No Difficulty Levels**: Fixed time limit per game
2. **Auto-Generated Wrong Answers**: Uses other correct answers
3. **No Multi-Player**: Single player only
4. **No Leaderboards**: Local scores only
5. **Sound Synthesis Only**: No custom audio files
6. **Fixed Penalties**: -10 for wrong, can't be configured

## Future Enhancements

### Potential Features
- [ ] Difficulty modes (easy/medium/hard time limits)
- [ ] Power-ups (freeze time, eliminate wrong answers)
- [ ] Combo system (consecutive correct = multiplier)
- [ ] Custom wrong answers (instead of auto-generated)
- [ ] Leaderboards with friends
- [ ] Daily challenges
- [ ] Achievement badges
- [ ] Custom sound packs
- [ ] Visual themes
- [ ] Multiplayer race mode

### Code Improvements
- [ ] Custom hook for positioning logic
- [ ] Unit tests for scoring calculation
- [ ] Optimize particle rendering
- [ ] Add error boundaries
- [ ] Improve accessibility (ARIA labels)
- [ ] Add keyboard shortcuts (number keys)
- [ ] Touch feedback (haptic on mobile)

## Troubleshooting

### Buttons overlap or off-screen
- Check viewport size calculation
- Verify safe zones correct
- Increase minimum margins

### Sound not playing
- Check Web Audio API support
- Verify not muted
- Check browser autoplay policy

### Animation lag
- Reduce particle count
- Disable sound effects
- Check device performance

### Timer inaccurate
- Verify setInterval cleanup
- Check Date.now() vs timeout drift
- Consider requestAnimationFrame

## API Integration (Production)

When moving to production:

1. **Save Attempt**: POST to `/api/game-attempts`
2. **Load Game**: GET from `/api/games/:id`
3. **Leaderboards**: GET/POST to `/api/leaderboards`
4. **Sound Files**: Load from CDN instead of synthesis

## Comparison to Other Games

| Feature | Pairs | Flashcards | Splat |
|---------|-------|------------|-------|
| **Pace** | Moderate | Self-paced | Fast |
| **Pressure** | None | None | High (timer) |
| **Scoring** | Fixed 100% | % self-assessed | Variable (speed bonus) |
| **Focus** | Memory | Learning | Reactions |
| **Sound** | None | None | Yes (3 types) |
| **Particles** | None | None | Yes (burst) |
| **Positioning** | Grid | Static | Random |

## Educational Value

**Best For**:
- Quick fact recall
- Mental math practice
- Vocabulary recognition
- Fast decision making
- Competitive learning

**Skills Developed**:
- Speed of processing
- Pressure management
- Quick thinking
- Accuracy under time constraint
- Focus and concentration

## Summary

The Splat reaction game is fully functional with:
- ✅ Random button positioning with collision avoidance
- ✅ Countdown timer per question
- ✅ Splat animation with particle effects
- ✅ Shake animation for wrong answers
- ✅ Speed-based scoring system
- ✅ Comprehensive results screen
- ✅ Web Audio sound effects (tick, splat, wrong)
- ✅ Mute toggle
- ✅ Complete data persistence
- ✅ Mobile responsive

Ready for fast-paced fun! ⚡
