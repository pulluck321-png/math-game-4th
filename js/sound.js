// sound.js - Web Audio API 기반 효과음 생성기 (외부 파일 로딩 불필요 & 지연 없음)

class SoundFX {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
    this.initContext();
  }

  initContext() {
    if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    // 브라우저 자동재생 정책 대응
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      const resume = () => {
        if (this.audioCtx) this.audioCtx.resume();
        window.removeEventListener('click', resume);
        window.removeEventListener('keydown', resume);
      };
      window.addEventListener('click', resume, { once: true });
      window.addEventListener('keydown', resume, { once: true });
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem('math_game_sound_enabled', this.enabled ? '1' : '0');
    return this.enabled;
  }

  isSoundEnabled() {
    const saved = localStorage.getItem('math_game_sound_enabled');
    if (saved !== null) {
      this.enabled = saved === '1';
    }
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.15, volume = 0.15, pitchBend = null) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      if (pitchBend) {
        osc.frequency.exponentialRampToValueAtTime(pitchBend, this.audioCtx.currentTime + duration);
      }

      gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Sound play error:", e);
    }
  }

  // 버튼 클릭음
  click() {
    this.playTone(600, 'triangle', 0.08, 0.1, 800);
  }

  // 카드 호버음
  hover() {
    this.playTone(450, 'sine', 0.05, 0.04);
  }

  // 정답음 (도-미-솔 기분 좋은 화음)
  correct() {
    if (!this.enabled) return;
    this.initContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.18, 0.15);
      }, idx * 70);
    });
  }

  // 오답음 (살짝 아쉬운 뾱)
  wrong() {
    if (!this.enabled) return;
    this.playTone(280, 'sawtooth', 0.22, 0.12, 160);
  }

  // 게임 클리어 팡파레
  fanfare() {
    if (!this.enabled) return;
    const chords = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 120 },
      { f: 783.99, t: 240 },
      { f: 1046.50, t: 380 },
      { f: 1318.51, t: 540 }
    ];
    chords.forEach(c => {
      setTimeout(() => this.playTone(c.f, 'triangle', 0.35, 0.2), c.t);
    });
  }

  // 크리티컬 히트 사운드 (강력한 타격감)
  crit() {
    if (!this.enabled) return;
    this.initContext();
    this.playTone(320, 'square', 0.12, 0.25, 900);
    setTimeout(() => this.playTone(850, 'triangle', 0.2, 0.3, 1300), 50);
  }

  // 보스 몬스터 피격 폭발음
  boom() {
    if (!this.enabled) return;
    this.initContext();
    this.playTone(180, 'sawtooth', 0.35, 0.3, 40);
  }

  // 레이저/발사음
  shoot() {
    this.playTone(880, 'sawtooth', 0.2, 0.15, 220);
  }

  // 보석/아이템 획득
  gem() {
    this.playTone(1200, 'sine', 0.12, 0.18, 1600);
  }
}

// 전역 인스턴스
window.soundFX = new SoundFX();
