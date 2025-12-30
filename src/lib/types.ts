/**
 * Shared types for Agent Sandbox
 * Full type definitions will be added as features are implemented
 */

// Session state
export interface StoredMessage {
  id: string
  type: 'user' | 'assistant' | 'tool-call' | 'tool-result'
  content: string
  timestamp: string
  tokenEstimate: number
  metadata?: Record<string, unknown>
}

// WebSocket protocol - Client → Server
export type ClientMessage =
  | { type: 'session:join'; sessionId: string }
  | { type: 'session:create' }
  | { type: 'step:execute' }
  | { type: 'step:retry' }
  | { type: 'context:update'; contextIds: string[] }
  | { type: 'instructions:update'; instructions: string }
  | { type: 'message:send'; content: string }

// WebSocket protocol - Server → Client
export type ServerMessage =
  | { type: 'session:state'; state: unknown }
  | { type: 'state:updated'; partial: Record<string, unknown> }
  | { type: 'step:start'; stepNumber: number }
  | { type: 'step:chunk'; chunk: unknown }
  | { type: 'step:complete'; step: unknown }
  | { type: 'step:error'; error: string }
  | { type: 'error'; message: string }
