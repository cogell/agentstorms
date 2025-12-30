/**
 * AI SDK integration wrapper
 * Full implementation in Phase 1 (agentstorms core loop)
 */

export async function executeStep(_options: {
  instructions: string
  messages: unknown[]
  tools?: unknown[]
}): Promise<unknown> {
  throw new Error('AI integration not yet implemented')
}
