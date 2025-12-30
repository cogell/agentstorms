import { useEffect, useRef, useCallback } from 'react'
import { useSandboxStore, type DOState } from '@/stores/sandbox'
import type { ClientMessage, ServerMessage } from '@/lib/types'

/**
 * Determine WebSocket URL based on environment
 * In dev: connect directly to worker (bypasses Vite proxy issues)
 * In prod: use same host (Worker serves both assets and WebSocket)
 */
function getWebSocketUrl(sessionId: string): string {
  if (import.meta.env.DEV) {
    // Dev: connect directly to worker on port 8711
    return `ws://localhost:8711/ws/${sessionId}`
  }
  // Prod: use same host as the page
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = window.location.host
  return `${protocol}//${host}/ws/${sessionId}`
}

/**
 * WebSocket connection hook for DO communication
 * Manages connection lifecycle and message handling
 */
// Track active connections globally to prevent duplicates across StrictMode remounts
const activeConnections = new Map<string, WebSocket>()

export function useWebSocket(sessionId: string) {
  const wsRef = useRef<WebSocket | null>(null)
  const { isConnected, error } = useSandboxStore()

  // Use refs for store actions to avoid effect re-runs
  const storeRef = useRef(useSandboxStore.getState())
  useEffect(() => {
    // Keep ref in sync with store
    return useSandboxStore.subscribe((state) => {
      storeRef.current = state
    })
  }, [])

  /**
   * Connect to WebSocket - only depends on sessionId
   */
  useEffect(() => {
    if (!sessionId) return

    // Check for existing connection (handles StrictMode double-mount)
    const existingWs = activeConnections.get(sessionId)
    if (existingWs && (existingWs.readyState === WebSocket.OPEN || existingWs.readyState === WebSocket.CONNECTING)) {
      console.log('Reusing existing WebSocket connection')
      wsRef.current = existingWs
      return
    }

    const url = getWebSocketUrl(sessionId)
    console.log('Connecting to WebSocket:', url)

    const ws = new WebSocket(url)
    wsRef.current = ws
    activeConnections.set(sessionId, ws)

    ws.onopen = () => {
      console.log('WebSocket connected')
      storeRef.current.setConnected(true)
      storeRef.current.setError(null)
    }

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason)
      storeRef.current.setConnected(false)
      activeConnections.delete(sessionId)
      wsRef.current = null
    }

    ws.onerror = (event) => {
      console.error('WebSocket error:', event)
      storeRef.current.setError('WebSocket connection error')
    }

    ws.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data) as ServerMessage
        const store = storeRef.current

        switch (message.type) {
          case 'session:state':
            store.hydrateFromServer(message.state as DOState)
            break

          case 'state:updated':
            store.applyPartialUpdate(message.partial)
            break

          case 'step:start':
            store.setExecuting(true)
            break

          case 'step:complete':
          case 'step:error':
            store.setExecuting(false)
            if (message.type === 'step:error') {
              store.setError(message.error)
            }
            break

          case 'error':
            store.setError(message.message)
            break

          default:
            console.log('Unhandled message type:', message)
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e)
      }
    }

    // Cleanup on unmount or sessionId change
    return () => {
      // Don't close if this is a StrictMode remount - let the new mount reuse it
      // Only close if the component is truly unmounting (sessionId changed or navigated away)
      const currentWs = activeConnections.get(sessionId)
      if (currentWs === ws) {
        // Small delay to allow StrictMode second mount to claim the connection
        setTimeout(() => {
          const stillActive = activeConnections.get(sessionId)
          if (stillActive === ws && wsRef.current !== ws) {
            console.log('Cleaning up WebSocket connection')
            activeConnections.delete(sessionId)
            storeRef.current.reset()
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
              ws.close()
            }
          }
        }, 100)
      }
    }
  }, [sessionId]) // Only re-run when sessionId changes

  /**
   * Send message to server
   */
  const send = useCallback((message: ClientMessage) => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected')
      return false
    }

    try {
      ws.send(JSON.stringify(message))
      return true
    } catch (e) {
      console.error('Failed to send message:', e)
      return false
    }
  }, [])

  /**
   * Helper: Send a user message
   */
  const sendMessage = useCallback(
    (content: string) => {
      return send({ type: 'message:send', content })
    },
    [send]
  )

  /**
   * Helper: Update instructions
   */
  const updateInstructions = useCallback(
    (instructions: string) => {
      return send({ type: 'instructions:update', instructions })
    },
    [send]
  )

  /**
   * Helper: Update context
   */
  const updateContext = useCallback(
    (contextIds: string[]) => {
      return send({ type: 'context:update', contextIds })
    },
    [send]
  )

  /**
   * Helper: Execute step
   */
  const executeStep = useCallback(() => {
    return send({ type: 'step:execute' })
  }, [send])

  /**
   * Helper: Retry step
   */
  const retryStep = useCallback(() => {
    return send({ type: 'step:retry' })
  }, [send])

  return {
    isConnected,
    error,
    send,
    sendMessage,
    updateInstructions,
    updateContext,
    executeStep,
    retryStep,
  }
}
