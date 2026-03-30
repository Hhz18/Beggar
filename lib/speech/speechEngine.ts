/**
 * Web Speech Engine
 * 语音识别和语音合成引擎
 * Speech Recognition and Synthesis Engine
 */

export interface SpeechRecognitionConfig {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface SpeechSynthesisConfig {
  lang?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}

export interface VoiceCommand {
  pattern: RegExp | string;
  action: (match: RegExpMatchArray | string, transcript: string) => void;
  description: string;
}

/**
 * SpeechRecognition封装类
 */
class SpeechRecognitionEngine {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private onResultCallbacks: Set<(transcript: string, isFinal: boolean) => void> = new Set();
  private onErrorCallbacks: Set<(error: string) => void> = new Set();
  private onStartCallbacks: Set<() => void> = new Set();
  private onEndCallbacks: Set<() => void> = new Set();

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'zh-CN';

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const { resultIndex, results } = event;
      const current = results[resultIndex];
      const transcript = current[0].transcript;

      this.onResultCallbacks.forEach(callback => {
        callback(transcript, current.isFinal);
      });
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.onErrorCallbacks.forEach(callback => {
        callback(event.error);
      });

      if (event.error === 'no-speech') {
        this.stop();
      }
    };

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStartCallbacks.forEach(callback => callback());
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onEndCallbacks.forEach(callback => callback());

      // 如果应该是监听状态但停止了，重新启动
      if (this.shouldListen && !this.isListening) {
        setTimeout(() => {
          if (this.shouldListen) {
            this.start();
          }
        }, 100);
      }
    };
  }

  private shouldListen = false;

  start(config?: SpeechRecognitionConfig) {
    if (!this.recognition) {
      console.warn('Speech Recognition not available');
      return;
    }

    if (this.isListening) {
      return;
    }

    if (config?.lang) {
      this.recognition.lang = config.lang;
    }
    if (config?.continuous !== undefined) {
      this.recognition.continuous = config.continuous;
    }
    if (config?.interimResults !== undefined) {
      this.recognition.interimResults = config.interimResults;
    }
    if (config?.maxAlternatives !== undefined) {
      this.recognition.maxAlternatives = config.maxAlternatives;
    }

    this.shouldListen = true;
    this.recognition.start();
  }

  stop() {
    if (!this.recognition) return;

    this.shouldListen = false;
    this.recognition.stop();
  }

  onResult(callback: (transcript: string, isFinal: boolean) => void) {
    this.onResultCallbacks.add(callback);
    return () => this.onResultCallbacks.delete(callback);
  }

  onError(callback: (error: string) => void) {
    this.onErrorCallbacks.add(callback);
    return () => this.onErrorCallbacks.delete(callback);
  }

  onStart(callback: () => void) {
    this.onStartCallbacks.add(callback);
    return () => this.onStartCallbacks.delete(callback);
  }

  onEnd(callback: () => void) {
    this.onEndCallbacks.add(callback);
    return () => this.onEndCallbacks.delete(callback);
  }

  get isSupported() {
    return typeof window !== 'undefined' && (
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    );
  }

  get listening() {
    return this.isListening;
  }
}

/**
 * SpeechSynthesis封装类
 */
class SpeechSynthesisEngine {
  private synthesis: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.initSynthesis();
  }

  private initSynthesis() {
    if (typeof window === 'undefined') return;

    this.synthesis = window.speechSynthesis;

    // 加载声音列表
    if (this.synthesis) {
      const loadVoices = () => {
        this.voices = this.synthesis!.getVoices();
      };

      loadVoices();
      this.synthesis.onvoiceschanged = loadVoices;
    }
  }

  speak(text: string, config?: SpeechSynthesisConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech Synthesis not available'));
        return;
      }

      // 停止当前播放
      if (this.currentUtterance) {
        this.synthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);

      if (config?.lang) {
        utterance.lang = config.lang;
      }
      if (config?.pitch !== undefined) {
        utterance.pitch = config.pitch;
      }
      if (config?.rate !== undefined) {
        utterance.rate = config.rate;
      }
      if (config?.volume !== undefined) {
        utterance.volume = config.volume;
      }
      if (config?.voice) {
        utterance.voice = config.voice;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(new Error(event.error));
      };

      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    });
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  pause() {
    if (this.synthesis) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  getVoices(lang?: string): SpeechSynthesisVoice[] {
    if (lang) {
      return this.voices.filter(voice => voice.lang.startsWith(lang));
    }
    return this.voices;
  }

  get isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  get speaking() {
    return this.synthesis?.speaking || false;
  }

  get paused() {
    return this.synthesis?.paused || false;
  }
}

/**
 * VoiceCommandSystem
 * 语音命令系统
 */
class VoiceCommandSystem {
  private commands: VoiceCommand[] = [];

  registerCommand(command: VoiceCommand) {
    this.commands.push(command);
  }

  unregisterCommand(description: string) {
    this.commands = this.commands.filter(cmd => cmd.description !== description);
  }

  execute(transcript: string) {
    for (const command of this.commands) {
      if (command.pattern instanceof RegExp) {
        const match = transcript.match(command.pattern);
        if (match) {
          command.action(match, transcript);
          return true;
        }
      } else {
        if (transcript.includes(command.pattern)) {
          command.action(command.pattern, transcript);
          return true;
        }
      }
    }
    return false;
  }

  listCommands() {
    return this.commands.map(cmd => cmd.description);
  }

  clear() {
    this.commands = [];
  }
}

// 导出单例
export const speechRecognition = new SpeechRecognitionEngine();
export const speechSynthesis = new SpeechSynthesisEngine();
export const voiceCommandSystem = new VoiceCommandSystem();
