## Splat Game - Quick Start Guide

## ⚡ How to Play

### Starting the Game

1. **Run the app**: `npm run dev`
2. **Login as student**
3. **Setup test data**: Dev Tools → Create Test Data
4. **Play**: Click "Play Now" on "Quick Math Splat"

### Playing Splat

1. **Read the question** at the top
2. **Watch the countdown** (8 seconds)
3. **Click the correct answer** as fast as you can!
   - Correct: 🎉 SPLAT! Particle burst, points
   - Wrong: Shake animation, -10 points
   - Timeout: Shows correct answer, 0 points
4. **Auto-advances** to next question
5. **Repeat** for all 8 questions
6. **View results** with reaction times

### Scoring

**Base Points**: 100 per correct answer

**Speed Bonus**: Up to 50 extra points
- Answer instantly: ~150 points
- Answer at 50% time: ~125 points
- Answer at 90% time: ~105 points

**Penalties**:
- Wrong answer: -10 points
- Timeout: 0 points

## 🎮 Features to Test

### Basic Gameplay
- [ ] Question displays clearly
- [ ] Timer counts down from 8
- [ ] Timer turns red at 3 seconds
- [ ] Tick sound plays (last 3 seconds)
- [ ] Answer buttons in random positions
- [ ] Buttons don't overlap

### Correct Answer
- [ ] Click correct answer
- [ ] SPLAT animation plays
- [ ] Particle burst effect
- [ ] Sound effect plays
- [ ] Points awarded (100-150)
- [ ] Auto-advances to next

### Wrong Answer
- [ ] Click wrong answer
- [ ] Button shakes
- [ ] Buzzer sound plays
- [ ] -10 points penalty
- [ ] Correct answer highlights
- [ ] Then advances

### Timeout
- [ ] Let timer reach 0
- [ ] Buzzer plays
- [ ] Correct answer shows
- [ ] 0 points
- [ ] Advances after delay

### Sound Effects
- [ ] Toggle mute button
- [ ] Tick (timer countdown)
- [ ] Splat (correct answer)
- [ ] Buzzer (wrong/timeout)
- [ ] Icon changes when muted

### Results Screen
- [ ] Total score displayed
- [ ] Percentage badge
- [ ] Individual reaction times
- [ ] Average time
- [ ] Fastest reaction
- [ ] Performance level
- [ ] Tips (if score < 75%)

## 🎯 Test Scenarios

### Scenario 1: Perfect Speed Run
1. Start game
2. Answer all 8 questions correctly
3. Click as fast as possible (within 1-2 seconds)
4. Should get 140-150 points per question
5. Total: ~1100-1200 points
6. Performance: "Lightning Fast!" ⚡

### Scenario 2: Slow and Steady
1. Start game
2. Answer correctly but slowly (5-7 seconds)
3. Should get 105-110 points per question
4. Total: ~850-900 points
5. Performance: "Sharp Reflexes!" 🎯

### Scenario 3: Mixed Performance
1. Answer 4 correctly (fast)
2. Answer 2 wrong
3. Let 2 timeout
4. Should see variety of animations
5. Score: ~400-500 points
6. Performance: "Getting Better!" 👍
7. Tips should appear

### Scenario 4: Pressure Test
1. Watch timer closely
2. Answer at last second (< 1s remaining)
3. Timer should be red and pulsing
4. Tick sound every second
5. High pressure situation!

### Scenario 5: Sound Test
1. Play with sound ON
2. Listen for all 3 sound types
3. Toggle mute mid-game
4. Continue playing (no sounds)
5. Results screen still works

### Scenario 6: Mobile Test
1. Open on mobile or use dev tools
2. Buttons should be touch-friendly
3. No overlap on smaller screen
4. Animations smooth
5. Particles visible

## 🎨 Visual Effects

### Splat Animation
When you click correct answer:
- Button scales up 2x
- Fades to transparent
- Turns green
- Particle burst from center
- "SPLAT!" text appears
- Stars rotate outward

### Shake Animation
When you click wrong answer:
- Button oscillates horizontally
- Red color pulse
- Happens in 0.5s
- Then shows correct answer

### Timer Warning
Last 3 seconds:
- Timer turns red
- Numbers pulse
- Tick sound each second
- Progress bar turns red

## 📊 Expected Results

### After 8 Questions

**All Correct, Fast (< 2s avg)**:
- Score: 1100-1200
- Performance: "Lightning Fast!" ⚡
- Color: Yellow
- Avg Reaction: ~1500ms
- Fastest: ~800ms

**All Correct, Medium (3-5s avg)**:
- Score: 900-1000
- Performance: "Sharp Reflexes!" 🎯
- Color: Orange
- Avg Reaction: ~4000ms
- Fastest: ~2000ms

**Mixed (6/8 Correct)**:
- Score: 600-700
- Performance: "Getting Better!" 👍
- Color: Blue
- Tips appear

**Struggling (< 4 Correct)**:
- Score: < 400
- Performance: "Keep Practicing!" 💪
- Color: Purple
- Tips appear

## 🔧 Dev Tools

### View Game State

```javascript
// In browser console during game
// (View in React DevTools)
```

### Test Scoring

```javascript
// Calculate points for 2-second reaction:
const basePoints = 100;
const timeLimit = 8; // seconds
const reactionTime = 2; // seconds
const bonus = Math.floor((timeLimit - reactionTime) / timeLimit * 50);
const total = basePoints + bonus;
console.log('Points:', total); // Should be ~137
```

### Simulate Perfect Score

```javascript
// 8 questions, all correct, 1s each
const perfectScore = 8 * 145; // ~1160 points
const percentage = 100;
const avgTime = 1000; // 1s in ms
```

## 🎵 Sound Effects

### Tick (Timer Countdown)
- **Type**: Sine wave
- **Frequency**: 800Hz
- **Duration**: 0.1s
- **When**: Last 3 seconds of timer

### Splat (Correct Answer)
- **Type**: Layered synth with noise burst
- **Frequencies**: 220Hz, 440Hz, 880Hz
- **Duration**: 0.3s
- **Feeling**: Satisfying pop

### Wrong (Incorrect/Timeout)
- **Type**: Descending sawtooth
- **Frequency**: 200Hz → 50Hz
- **Duration**: 0.3s
- **Feeling**: Buzzer

## 🐛 Common Issues

### Buttons not appearing
**Problem**: Screen blank after question loads

**Solution**:
1. Check browser console for errors
2. Verify button positioning calculated
3. Try resizing window
4. Hard refresh browser

### Sound not working
**Problem**: No audio during game

**Solution**:
1. Check mute button (not muted)
2. Check browser volume
3. Try clicking page first (autoplay policy)
4. Check Web Audio API support

### Animation lag
**Problem**: Splat effect stutters

**Solution**:
1. Reduce particle count (edit ParticleEffect)
2. Disable sound effects
3. Close other tabs
4. Try different browser

### Timer freezing
**Problem**: Countdown stops or jumps

**Solution**:
1. Check for JavaScript errors
2. Don't minimize browser tab
3. Check device performance
4. Refresh page and restart

## 💡 Tips for Best Score

### Speed Strategies
1. **Read fast**: Scan question quickly
2. **Eye tracking**: Look for answer while reading
3. **Click fast**: Don't hesitate once you know
4. **Stay calm**: Panic slows reaction time
5. **Practice**: Do it again to improve

### Focus Techniques
1. **Center screen**: Keep eyes near middle
2. **Peripheral vision**: Scan all buttons quickly
3. **Pattern recognition**: Math problems have patterns
4. **Eliminate**: Rule out wrong answers fast

### Time Management
1. **First 2 seconds**: Read and find answer
2. **Next 3 seconds**: Click without overthinking
3. **Last 3 seconds**: Make best guess if unsure
4. **Never timeout**: Any answer better than none

## 🏆 Challenge Goals

### Beginner Goals
- [ ] Complete all 8 questions
- [ ] Get 50% correct
- [ ] Score 400+ points
- [ ] Don't timeout on any question

### Intermediate Goals
- [ ] Get 75% correct (6/8)
- [ ] Score 700+ points
- [ ] Average reaction < 4 seconds
- [ ] Fastest reaction < 2 seconds

### Expert Goals
- [ ] Get 100% correct (8/8)
- [ ] Score 1000+ points
- [ ] Average reaction < 2 seconds
- [ ] Fastest reaction < 1 second
- [ ] "Lightning Fast!" achievement ⚡

### Speed Run Goals
- [ ] Complete in under 20 seconds total
- [ ] All correct, all under 2s each
- [ ] Score 1100+ points
- [ ] No mistakes allowed!

## 🎓 Game Modes (Ideas)

### Current: Standard Mode
- 8 questions
- 8 seconds each
- Base 100 + speed bonus

### Future: Marathon Mode
- 20+ questions
- Increasing difficulty
- Cumulative score

### Future: Speed Round
- 5 seconds per question
- Higher pressure
- 2x point multiplier

### Future: Zen Mode
- No timer
- Focus on accuracy
- No speed bonus

## 📱 Mobile Tips

1. **Portrait Mode**: Best orientation
2. **Thumb Ready**: Keep thumb hovering
3. **Zoom Out**: See all buttons at once
4. **Brightness Up**: Spot buttons faster
5. **Distraction Free**: Close other apps

## 🚀 Next Steps

After testing:
1. Try to beat your high score
2. Test on different devices
3. Challenge a friend
4. Create custom Splat games
5. Try other game modes (Pairs, Flashcards)

## 📞 Need Help?

Check:
- `SPLAT_GAME_IMPLEMENTATION.md` - Full technical docs
- `src/components/games/splat/SplatGame.tsx` - Game logic
- Browser console for errors

Ready to test your reflexes? ⚡ Good luck!
