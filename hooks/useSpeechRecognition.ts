/**
 * useSpeechRecognition Hook
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { speechRecognition, SpeechRecognitionConfig } from '@/lib/speech/speechEngine';

export interface UseSpeechRecognitionResult {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  finalTranscript: string;
  error: string | null;
  startListening: (config?: SpeechRecognitionConfig) => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition(config?: SpeechRecognitionConfig): UseSpeechRecognitionResult {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isSupportedRef = useRef(speechRecognition.isSupported);

  useEffect(() => {
    // 初始化监听器
    const unsubscribeResult = speechRecognition.onResult((transcript, isFinal) => {
      if (isFinal) {
        setFinalTranscript(prev => prev + ' ' + transcript);
        setInterimTranscript('');
      } else {
        setInterimTranscript(transcript);
      }
      setTranscript(transcript);
    });

    const unsubscribeError = speechRecognition.onError((error) => {
      setError(error);
    });

    const unsubscribeStart = speechRecognition.onStart(() => {
      setIsListening(true);
      setError(null);
    });

    const unsubscribeEnd = speechRecognition.onEnd(() => {
      setIsListening(false);
    });

    return () => {
      unsubscribeResult();
      unsubscribeError();
      unsubscribeStart();
      unsubscribeEnd();
    };
  }, []);

  const startListening = useCallback((newConfig?: SpeechRecognitionConfig) => {
    setError(null);
    speechRecognition.start(newConfig || config);
  }, [config]);

  const stopListening = useCallback(() => {
    speechRecognition.stop();
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setFinalTranscript('');
  }, []);

  return {
    isListening,
    isSupported: isSupportedRef.current,
    transcript,
    interimTranscript,
    finalTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
