/**
 * Reactions Module
 * 消息反应功能
 */

export function getAllReactions(): Record<string, Record<string, number>> {
  return {};
}

export function getMessageReactions(messageId: string): Record<string, number> {
  return {};
}

export function addReaction(messageId: string, emoji: string): void {
  // Placeholder implementation
}

export function removeReaction(messageId: string, emoji: string): void {
  // Placeholder implementation
}
