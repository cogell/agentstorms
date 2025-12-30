/**
 * Tool registry for agent sandbox
 * Full implementation in Phase 3 (tool execution)
 */

export const toolRegistry = {
  // Tools will be defined here
  // Example: getWeather, searchWeb, etc.
}

export async function executeTool(
  _toolName: string,
  _args: unknown
): Promise<unknown> {
  throw new Error('Tool execution not yet implemented')
}
