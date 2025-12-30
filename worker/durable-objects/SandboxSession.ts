import { DurableObject } from 'cloudflare:workers'
import type { DOState, StoredMessage, StepRecord, Branch } from '../types'

/**
 * WebSocket protocol types
 */
type ClientMessage =
  | { type: 'session:join'; sessionId: string }
  | { type: 'session:create' }
  | { type: 'step:execute' }
  | { type: 'step:retry' }
  | { type: 'context:update'; contextIds: string[] }
  | { type: 'instructions:update'; instructions: string }
  | { type: 'message:send'; content: string }

type ServerMessage =
  | { type: 'session:state'; state: DOState }
  | { type: 'step:start'; stepNumber: number }
  | { type: 'step:chunk'; chunk: unknown }
  | { type: 'step:complete'; step: StepRecord }
  | { type: 'step:error'; error: string }
  | { type: 'state:updated'; partial: Partial<DOState> }
  | { type: 'error'; message: string }

/**
 * Default state for new sessions
 */
function createDefaultState(sessionId: string): DOState {
  return {
    sessionId,
    createdAt: new Date().toISOString(),
    instructions: 'You are a helpful assistant.',
    selectedModel: 'claude-sonnet-4-20250514',
    enabledTools: [],
    messages: [],
    contextIds: [],
    steps: [],
    currentStepIndex: 0,
    branches: [],
    activeBranchId: 'main',
  }
}

/**
 * SandboxSession Durable Object
 * Manages session state and WebSocket connections
 */
export class SandboxSession extends DurableObject {
  private state: DOState | null = null
  private initialized = false

  /**
   * Initialize SQLite storage schema
   */
  private async initStorage(): Promise<void> {
    if (this.initialized) return

    const sql = this.ctx.storage.sql

    // Create state table
    sql.exec(`
      CREATE TABLE IF NOT EXISTS session_state (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `)

    // Create messages table for efficient querying
    sql.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        token_estimate INTEGER NOT NULL,
        metadata TEXT
      )
    `)

    // Create steps table
    sql.exec(`
      CREATE TABLE IF NOT EXISTS steps (
        step_number INTEGER PRIMARY KEY,
        timestamp TEXT NOT NULL,
        instructions_snapshot TEXT NOT NULL,
        token_count INTEGER NOT NULL,
        finish_reason TEXT NOT NULL,
        model_id TEXT NOT NULL,
        duration_ms INTEGER NOT NULL
      )
    `)

    this.initialized = true
  }

  /**
   * Load state from storage or create new
   */
  private async loadState(sessionId: string): Promise<DOState> {
    await this.initStorage()

    if (this.state) return this.state

    const sql = this.ctx.storage.sql

    // Try to load existing state
    const result = sql
      .exec<{ value: string }>(`SELECT value FROM session_state WHERE key = 'state'`)
      .toArray()

    if (result.length > 0 && result[0]) {
      this.state = JSON.parse(result[0].value) as DOState
    } else {
      // Create new state
      this.state = createDefaultState(sessionId)
      await this.saveState()
    }

    return this.state
  }

  /**
   * Persist state to storage
   */
  private async saveState(): Promise<void> {
    if (!this.state) return

    const sql = this.ctx.storage.sql
    sql.exec(
      `INSERT OR REPLACE INTO session_state (key, value) VALUES ('state', ?)`,
      JSON.stringify(this.state)
    )
  }

  /**
   * Broadcast message to all connected clients
   */
  private broadcast(message: ServerMessage): void {
    const sockets = this.ctx.getWebSockets()
    const data = JSON.stringify(message)
    for (const ws of sockets) {
      try {
        ws.send(data)
      } catch {
        // Socket may be closed
      }
    }
  }

  /**
   * Send message to a specific client
   */
  private send(ws: WebSocket, message: ServerMessage): void {
    try {
      ws.send(JSON.stringify(message))
    } catch {
      // Socket may be closed
    }
  }

  /**
   * Handle HTTP requests (WebSocket upgrades)
   */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const sessionId = url.pathname.split('/').pop() || crypto.randomUUID()

    // Handle WebSocket upgrade
    const upgradeHeader = request.headers.get('Upgrade')
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426 })
    }

    // Create WebSocket pair - use array destructuring for guaranteed order
    const pair = new WebSocketPair()
    const client = pair[0]
    const server = pair[1]

    // Accept the WebSocket connection
    this.ctx.acceptWebSocket(server, [sessionId])

    // Load state and send to client (after accept, using the hibernation API)
    // The webSocketOpen handler will send the initial state
    this.loadState(sessionId).catch(err => {
      console.error('Failed to load state:', err)
    })

    return new Response(null, {
      status: 101,
      webSocket: client,
    })
  }

  /**
   * Called when WebSocket connection opens (Hibernation API)
   */
  async webSocketOpen(ws: WebSocket): Promise<void> {
    // Get session ID from tags
    const tags = this.ctx.getTags(ws)
    const sessionId = tags[0] || 'unknown'

    // Ensure state is loaded
    await this.loadState(sessionId)

    // Send current state to the new client
    this.send(ws, { type: 'session:state', state: this.state! })
  }

  /**
   * Handle incoming WebSocket messages
   */
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    if (typeof message !== 'string') {
      this.send(ws, { type: 'error', message: 'Binary messages not supported' })
      return
    }

    let parsed: ClientMessage
    try {
      parsed = JSON.parse(message) as ClientMessage
    } catch {
      this.send(ws, { type: 'error', message: 'Invalid JSON' })
      return
    }

    await this.handleMessage(ws, parsed)
  }

  /**
   * Process client messages
   */
  private async handleMessage(ws: WebSocket, msg: ClientMessage): Promise<void> {
    if (!this.state) {
      this.send(ws, { type: 'error', message: 'Session not initialized' })
      return
    }

    switch (msg.type) {
      case 'session:join':
      case 'session:create':
        // Already handled in fetch, just confirm
        this.send(ws, { type: 'session:state', state: this.state })
        break

      case 'instructions:update':
        this.state.instructions = msg.instructions
        await this.saveState()
        this.broadcast({ type: 'state:updated', partial: { instructions: msg.instructions } })
        break

      case 'context:update':
        this.state.contextIds = msg.contextIds
        await this.saveState()
        this.broadcast({ type: 'state:updated', partial: { contextIds: msg.contextIds } })
        break

      case 'message:send':
        const newMessage: StoredMessage = {
          id: crypto.randomUUID(),
          type: 'user',
          content: msg.content,
          timestamp: new Date().toISOString(),
          tokenEstimate: Math.ceil(msg.content.length / 4), // Rough estimate
        }
        this.state.messages.push(newMessage)
        this.state.contextIds.push(newMessage.id)
        await this.saveState()
        this.broadcast({
          type: 'state:updated',
          partial: {
            messages: this.state.messages,
            contextIds: this.state.contextIds,
          },
        })
        break

      case 'step:execute':
      case 'step:retry':
        // AI integration will be added in Phase 1
        this.send(ws, {
          type: 'step:error',
          error: 'AI integration not yet implemented (Phase 1)',
        })
        break

      default:
        this.send(ws, { type: 'error', message: `Unknown message type: ${(msg as { type: string }).type}` })
    }
  }

  /**
   * Handle WebSocket close
   */
  async webSocketClose(
    _ws: WebSocket,
    _code: number,
    _reason: string,
    _wasClean: boolean
  ): Promise<void> {
    // Connection tracking handled by ctx.getWebSockets()
    // State persists across connections
  }

  /**
   * Handle WebSocket errors
   */
  async webSocketError(_ws: WebSocket, error: unknown): Promise<void> {
    console.error('WebSocket error:', error)
  }
}
