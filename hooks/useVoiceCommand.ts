/**
 * useVoiceCommand Hook
 */

import { useEffect, useCallback, useRef } from 'react';
import { voiceCommandSystem, VoiceCommand } from '@/lib/speech/speechEngine';

export function useVoiceCommand(commands: VoiceCommand[], enabled = true) {
  const commandsRef = useRef(commands);

  useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);

  useEffect(() => {
    if (!enabled) return;

    // 注册所有命令
    commands.forEach(command => {
      voiceCommandSystem.registerCommand(command);
    });

    return () => {
      // 清理命令
      commands.forEach(command => {
        voiceCommandSystem.unregisterCommand(command.description);
      });
    };
  }, [commands, enabled]);

  const executeCommand = useCallback((transcript: string) => {
    return voiceCommandSystem.execute(transcript);
  }, []);

  return {
    executeCommand,
    listCommands: () => voiceCommandSystem.listCommands(),
  };
}
