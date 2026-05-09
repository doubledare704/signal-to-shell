export const playDigitalUnlockSound = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    
    // Quick ascending pleasant chime (success sound)
    osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
    osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1); // C#5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2); // E5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3); // A5

    // Smooth volume envelope for a softer sound
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    // Soft fade in
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    // Smooth fade out trailing off
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};
