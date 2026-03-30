/**
 * AudioManager
 * 8-bit音效管理器，使用Web Audio API
 */

export type SoundEffect =
  | 'button_click'
  | 'donation_success'
  | 'level_up'
  | 'achievement_unlock'
  | 'cat_meow'
  | 'cat_happy'
  | 'notification';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume?: number;
}

/**
 * 8-bit音效配置
 */
const SOUND_CONFIGS: Record<SoundEffect, SoundConfig[]> = {
  button_click: [
    { frequency: 800, duration: 0.05, type: 'square', volume: 0.1 },
    { frequency: 600, duration: 0.05, type: 'square', volume: 0.1 },
  ],
  donation_success: [
    { frequency: 523.25, duration: 0.1, type: 'square', volume: 0.15 }, // C5
    { frequency: 659.25, duration: 0.1, type: 'square', volume: 0.15 }, // E5
    { frequency: 783.99, duration: 0.15, type: 'square', volume: 0.15 }, // G5
    { frequency: 1046.50, duration: 0.2, type: 'square', volume: 0.15 }, // C6
  ],
  level_up: [
    { frequency: 440, duration: 0.1, type: 'square', volume: 0.15 },
    { frequency: 554.37, duration: 0.1, type: 'square', volume: 0.15 },
    { frequency: 659.25, duration: 0.1, type: 'square', volume: 0.15 },
    { frequency: 880, duration: 0.3, type: 'square', volume: 0.15 },
  ],
  achievement_unlock: [
    { frequency: 523.25, duration: 0.08, type: 'square', volume: 0.15 },
    { frequency: 659.25, duration: 0.08, type: 'square', volume: 0.15 },
    { frequency: 783.99, duration: 0.08, type: 'square', volume: 0.15 },
    { frequency: 1046.50, duration: 0.08, type: 'square', volume: 0.15 },
    { frequency: 1318.51, duration: 0.25, type: 'square', volume: 0.15 },
  ],
  cat_meow: [
    { frequency: 600, duration: 0.1, type: 'sawtooth', volume: 0.1 },
    { frequency: 500, duration: 0.15, type: 'sawtooth', volume: 0.08 },
    { frequency: 400, duration: 0.1, type: 'sawtooth', volume: 0.1 },
  ],
  cat_happy: [
    { frequency: 800, duration: 0.1, type: 'sine', volume: 0.1 },
    { frequency: 1000, duration: 0.15, type: 'sine', volume: 0.1 },
    { frequency: 1200, duration: 0.1, type: 'sine', volume: 0.1 },
  ],
  notification: [
    { frequency: 880, duration: 0.1, type: 'sine', volume: 0.1 },
    { frequency: 1100, duration: 0.15, type: 'sine', volume: 0.1 },
  ],
};

class AudioManager {
  private context: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadSettings();
    }
  }

  /**
   * 获取AudioContext
   */
  private getContext(): AudioContext | null {
    if (!this.context) {
      try {
        this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
        return null;
      }
    }

    // 恢复context（如果被挂起）
    if (this.context.state === 'suspended') {
      this.context.resume().catch(console.warn);
    }

    return this.context;
  }

  /**
   * 播放单个音调
   */
  private playTone(config: SoundConfig): void {
    const context = this.getContext();
    if (!context || !this.enabled) return;

    try {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, context.currentTime);

      const volume = (config.volume || 0.1) * this.volume;
      gainNode.gain.setValueAtTime(volume, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + config.duration
      );

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + config.duration);
    } catch (error) {
      console.warn('Error playing tone:', error);
    }
  }

  /**
   * 播放音效
   */
  play(soundName: SoundEffect): void {
    const configs = SOUND_CONFIGS[soundName];
    if (!configs) return;

    // 依次播放所有音调
    let delay = 0;
    configs.forEach((config) => {
      setTimeout(() => {
        this.playTone(config);
      }, delay * 1000);
      delay += config.duration;
    });
  }

  /**
   * 播放按钮点击音效
   */
  playClick(): void {
    this.play('button_click');
  }

  /**
   * 播放施舍成功音效
   */
  playDonationSuccess(): void {
    this.play('donation_success');
  }

  /**
   * 播放升级音效
   */
  playLevelUp(): void {
    this.play('level_up');
  }

  /**
   * 播放成就解锁音效
   */
  playAchievement(): void {
    this.play('achievement_unlock');
  }

  /**
   * 播放小猫叫声
   */
  playCatMeow(): void {
    this.play('cat_meow');
  }

  /**
   * 播放小猫开心音效
   */
  playCatHappy(): void {
    this.play('cat_happy');
  }

  /**
   * 启用/禁用音效
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.saveSettings();
  }

  /**
   * 设置音量
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  /**
   * 获取音量
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * 检查音效是否启用
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * 加载设置
   */
  private loadSettings(): void {
    try {
      const settings = localStorage.getItem('audio_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this.enabled = parsed.enabled ?? true;
        this.volume = parsed.volume ?? 0.5;
      }
    } catch (error) {
      console.warn('Error loading audio settings:', error);
    }
  }

  /**
   * 保存设置
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('audio_settings', JSON.stringify({
        enabled: this.enabled,
        volume: this.volume,
      }));
    } catch (error) {
      console.warn('Error saving audio settings:', error);
    }
  }
}

// 单例导出
export const audioManager = new AudioManager();
