/**
 * Worker-side type definitions
 * Extends shared types from src/lib/types.ts
 */

export interface DOState {
  sessionId: string
  createdAt: string

  // Agent config
  instructions: string
  selectedModel: string
  enabledTools: string[]

  // Messages
  messages: StoredMessage[]
  contextIds: string[]

  // Execution
  steps: StepRecord[]
  currentStepIndex: number

  // Branching (Phase 4)
  branches: Branch[]
  activeBranchId: string
}

export interface StoredMessage {
  id: string
  type: 'user' | 'assistant' | 'tool-call' | 'tool-result'
  content: string
  timestamp: string
  tokenEstimate: number
  metadata?: Record<string, unknown>
}

export interface StepRecord {
  stepNumber: number
  timestamp: string
  instructionsSnapshot: string
  tokenCount: number
  finishReason: string
  modelId: string
  durationMs: number
}

export interface Branch {
  id: string
  name: string
  parentBranchId: string | null
  forkStepIndex: number
}
