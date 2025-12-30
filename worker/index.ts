/**
 * Cloudflare Worker entry point
 * Routes:
 *   /ws/:sessionId → Durable Object (WebSocket)
 *   /* → Static assets (Vite SPA)
 */

export { SandboxSession } from './durable-objects/SandboxSession'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // WebSocket upgrade for /ws/:sessionId
    if (url.pathname.startsWith('/ws/')) {
      const sessionId = url.pathname.split('/')[2]
      if (!sessionId) {
        return new Response('Missing session ID', { status: 400 })
      }

      const id = env.SANDBOX_SESSION.idFromName(sessionId)
      const stub = env.SANDBOX_SESSION.get(id)
      return stub.fetch(request)
    }

    // API routes (future expansion)
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Not implemented' }), {
        status: 501,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Static assets handled automatically by [assets] config
    // With not_found_handling = "single-page-application", unknown paths serve index.html
    return env.ASSETS.fetch(request)
  },
}

interface Env {
  SANDBOX_SESSION: DurableObjectNamespace
  ASSETS: Fetcher
  ENVIRONMENT: string
}
