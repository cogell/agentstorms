import { create } from 'zustand'
import type { StoredMessage, ClientMessage, ServerMessage } from '@/lib/types'

/**
 * DO State shape (mirrored from server)
 */
interface DOState {
  sessionId: string
  createdAt: string
  instructions: string
  selectedModel: string
  enabledTools: string[]
  messages: StoredMessage[]
  contextIds: string[]
  steps: unknown[]
  currentStepIndex: number
  branches: unknown[]
  activeBranchId: string
}

/**
 * Client-side state store
 * Combines DO state mirror + connection state + UI state
 */
interface SandboxStore {
  // Connection state
  isConnected: boolean
  isExecuting: boolean
  error: string | null

  // Mirrored from DO
  sessionId: string | null
  createdAt: string | null
  instructions: string
  selectedModel: string
  messages: StoredMessage[]
  contextIds: string[]
  steps: unknown[]
  currentStepIndex: number

  // Actions
  setConnected: (connected: boolean) => void
  setError: (error: string | null) => void
  setExecuting: (executing: boolean) => void
  hydrateFromServer: (state: DOState) => void
  applyPartialUpdate: (partial: Partial<DOState>) => void
  addMessage: (message: StoredMessage) => void
  updateInstructions: (instructions: string) => void
  updateContextIds: (contextIds: string[]) => void
  reset: () => void
}

const initialState = {
  isConnected: false,
  isExecuting: false,
  error: null,
  sessionId: null,
  createdAt: null,
  instructions: '',
  selectedModel: 'claude-sonnet-4-20250514',
  messages: [],
  contextIds: [],
  steps: [],
  currentStepIndex: 0,
}

export const useSandboxStore = create<SandboxStore>((set) => ({
  ...initialState,

  setConnected: (connected) => set({ isConnected: connected }),
  setError: (error) => set({ error }),
  setExecuting: (executing) => set({ isExecuting: executing }),

  hydrateFromServer: (state) =>
    set({
      sessionId: state.sessionId,
      createdAt: state.createdAt,
      instructions: state.instructions,
      selectedModel: state.selectedModel,
      messages: state.messages,
      contextIds: state.contextIds,
      steps: state.steps,
      currentStepIndex: state.currentStepIndex,
    }),

  applyPartialUpdate: (partial) =>
    set((state) => ({
      ...state,
      ...partial,
    })),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      contextIds: [...state.contextIds, message.id],
    })),

  updateInstructions: (instructions) => set({ instructions }),
  updateContextIds: (contextIds) => set({ contextIds }),

  reset: () => set(initialState),
}))

export type { DOState, SandboxStore, ClientMessage, ServerMessage }
