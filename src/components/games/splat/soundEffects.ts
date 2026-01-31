// Sound effects using Web Audio API
// Creates simple synth sounds without external files

let audioContext: AudioContext | null = null;
let muted = false;

export function initializeSounds() {
  if (typeof window === 'undefined') return;

  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch (e) {
    console.warn('Web Audio API not supported');
  }
}

export function toggleMute() {
  muted = !muted;
}

export function isMuted() {
  return muted;
}

// Tick sound (high-pitched beep for timer)
function playTick() {
  if (!audioContext || muted) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

// Splat sound (correct answer - satisfying pop with harmonics)
function playSplat() {
  if (!audioContext || muted) return;

  const now = audioContext.currentTime;

  // Base frequency
  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  osc1.connect(gain1);
  gain1.connect(audioContext.destination);
  osc1.frequency.value = 220;
  osc1.type = 'sine';
  gain1.gain.setValueAtTime(0.3, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
  osc1.start(now);
  osc1.stop(now + 0.3);

  // Harmonic
  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.connect(gain2);
  gain2.connect(audioContext.destination);
  osc2.frequency.value = 440;
  osc2.type = 'sine';
  gain2.gain.setValueAtTime(0.2, now);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
  osc2.start(now);
  osc2.stop(now + 0.25);

  // High harmonic (sparkle)
  const osc3 = audioContext.createOscillator();
  const gain3 = audioContext.createGain();
  osc3.connect(gain3);
  gain3.connect(audioContext.destination);
  osc3.frequency.value = 880;
  osc3.type = 'sine';
  gain3.gain.setValueAtTime(0.15, now + 0.05);
  gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
  osc3.start(now + 0.05);
  osc3.stop(now + 0.2);

  // Noise burst (for impact)
  const bufferSize = audioContext.sampleRate * 0.1;
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const noiseSource = audioContext.createBufferSource();
  const noiseGain = audioContext.createGain();
  noiseSource.buffer = noiseBuffer;
  noiseSource.connect(noiseGain);
  noiseGain.connect(audioContext.destination);
  noiseGain.gain.setValueAtTime(0.05, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
  noiseSource.start(now);
}

// Wrong buzzer (incorrect answer - descending tone)
function playWrong() {
  if (!audioContext || muted) return;

  const now = audioContext.currentTime;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Descending frequency (buzzer sound)
  oscillator.frequency.setValueAtTime(200, now);
  oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.3);
  oscillator.type = 'sawtooth';

  gainNode.gain.setValueAtTime(0.2, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

  oscillator.start(now);
  oscillator.stop(now + 0.3);
}

export type SoundEffect = 'tick' | 'splat' | 'wrong';

export function playSound(effect: SoundEffect) {
  if (muted) return;

  switch (effect) {
    case 'tick':
      playTick();
      break;
    case 'splat':
      playSplat();
      break;
    case 'wrong':
      playWrong();
      break;
  }
}
