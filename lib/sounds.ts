// lib/sounds.ts - NEW FILE
type SoundType = 'chime' | 'bell' | 'ding' | 'beep';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private volume: number = 0.5;
  private enabled: boolean = true;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported:', e);
        return null;
      }
    }
    return this.audioContext;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume / 100));
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  play(type: SoundType) {
    if (!this.enabled || typeof window === 'undefined') return;
    
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      // Resume context if suspended (required by browsers)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;

      // Configure sound based on type
      switch (type) {
        case 'chime':
          oscillator.frequency.setValueAtTime(800, now);
          oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.3);
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(this.volume, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          oscillator.start(now);
          oscillator.stop(now + 0.4);
          break;

        case 'bell':
          oscillator.frequency.setValueAtTime(600, now);
          oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.5);
          oscillator.type = 'triangle';
          gainNode.gain.setValueAtTime(this.volume, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
          oscillator.start(now);
          oscillator.stop(now + 0.6);
          break;

        case 'ding':
          oscillator.frequency.setValueAtTime(1200, now);
          oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.15);
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(this.volume * 0.8, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          oscillator.start(now);
          oscillator.stop(now + 0.2);
          break;

        case 'beep':
          oscillator.frequency.setValueAtTime(440, now);
          oscillator.type = 'square';
          gainNode.gain.setValueAtTime(this.volume * 0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          oscillator.start(now);
          oscillator.stop(now + 0.15);
          break;
      }
    } catch (e) {
      console.warn('Sound playback failed:', e);
    }
  }

  playStart(soundType: SoundType = 'ding') {
    this.play(soundType);
  }

  playPause(soundType: SoundType = 'chime') {
    this.play(soundType);
  }

  playLap(soundType: SoundType = 'beep') {
    this.play(soundType);
  }

  playComplete(soundType: SoundType = 'bell') {
    this.play(soundType);
  }

  // Play a success/celebration sound
  playSuccess() {
    if (!this.enabled || typeof window === 'undefined') return;
    
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      
      // Play ascending notes
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      
      notes.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(freq, now + i * 0.1);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, now + i * 0.1);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.5, now + i * 0.1 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
        
        oscillator.start(now + i * 0.1);
        oscillator.stop(now + i * 0.1 + 0.3);
      });
    } catch (e) {
      console.warn('Success sound failed:', e);
    }
  }
}

// Singleton instance
export const soundManager = new SoundManager();