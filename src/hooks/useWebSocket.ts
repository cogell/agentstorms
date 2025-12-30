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
export function useWebSocket(sessionId: string) {
  const wsRef = useRef<WebSocket | null>(null)
  const {
    isConnected,
    error,
    setConnected,
    setError,
    setExecuting,
    hydrateFromServer,
    applyPartialUpdate,
    reset,
  } = useSandboxStore()

  /**
   * Handle incoming server messages
   */
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data) as ServerMessage

        switch (message.type) {
          case 'session:state':
            hydrateFromServer(message.state as DOState)
            break

          case 'state:updated':
            applyPartialUpdate(message.partial)
            break

          case 'step:start':
            setExecuting(true)
            break

          case 'step:complete':
          case 'step:error':
            setExecuting(false)
            if (message.type === 'step:error') {
              setError(message.error)
            }
            break

          case 'error':
            setError(message.message)
            break

          default:
            console.log('Unhandled message type:', message)
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e)
      }
    },
    [hydrateFromServer, applyPartialUpdate, setExecuting, setError]
  )

  /**
   * Connect to WebSocket
   */
  useEffect(() => {
    if (!sessionId) return

    const url = getWebSocketUrl(sessionId)
    console.log('Connecting to WebSocket:', url)

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected')
      setConnected(true)
      setError(null)
    }

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason)
      setConnected(false)
      wsRef.current = null
    }

    ws.onerror = (event) => {
      console.error('WebSocket error:', event)
      setError('WebSocket connection error')
    }

    ws.onmessage = handleMessage

    // Cleanup on unmount or sessionId change
    return () => {
      console.log('Cleaning up WebSocket connection')
      reset()
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close()
      }
    }
  }, [sessionId, handleMessage, setConnected, setError, reset])

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
