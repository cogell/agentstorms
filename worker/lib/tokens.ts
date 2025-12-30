/**
 * Token counting utilities (server-side)
 * Note: Using approximate counting via js-tiktoken
 * Claude tokenizer differs, so counts are estimates (~prefix in UI)
 */

export function estimateTokens(_text: string): number {
  // Rough approximation: ~4 chars per token
  // Real implementation will use js-tiktoken
  return Math.ceil(_text.length / 4)
}
