/**
 * useSpeechSynthesis Hook
 */

import { useState, useCallback, useRef } from 'react';
import { speechSynthesis, SpeechSynthesisConfig } from '@/lib/speech/speechEngine';

export interface UseSpeechSynthesisResult {
  speak: (text: string, config?: SpeechSynthesisConfig) => Promise<void>;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  voices: SpeechSynthesisVoice[];
}

export function useSpeechSynthesis(): UseSpeechSynthesisResult {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const isSupportedRef = useRef(speechSynthesis.isSupported);

  const speak = useCallback(async (text: string, config?: SpeechSynthesisConfig) => {
    setIsSpeaking(true);
    try {
      await speechSynthesis.speak(text, config);
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const cancel = useCallback(() => {
    speechSynthesis.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  return {
    speak,
    cancel,
    pause,
    resume,
    isSupported: isSupportedRef.current,
    isSpeaking: speechSynthesis.speaking,
    isPaused: speechSynthesis.paused,
    voices: speechSynthesis.getVoices(),
  };
}
