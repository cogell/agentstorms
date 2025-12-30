import { createFileRoute } from '@tanstack/react-router'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useSandboxStore } from '@/stores/sandbox'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/session/$sessionId')({
  component: SessionComponent,
})

function SessionComponent() {
  const { sessionId } = Route.useParams()
  const { isConnected, error, sendMessage, updateInstructions } = useWebSocket(sessionId)
  const { instructions, messages, contextIds } = useSandboxStore()
  const [messageInput, setMessageInput] = useState('')
  const [instructionsInput, setInstructionsInput] = useState('')

  // Sync instructions input with store
  if (instructionsInput === '' && instructions !== '') {
    setInstructionsInput(instructions)
  }

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput)
      setMessageInput('')
    }
  }

  const handleUpdateInstructions = () => {
    updateInstructions(instructionsInput)
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Session: {sessionId.slice(0, 8)}...</h1>
        <span
          className={cn(
            'px-2 py-1 text-xs font-medium',
            isConnected ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'
          )}
        >
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-3 mb-4 bg-destructive/20 text-destructive border border-destructive/50">
          {error}
        </div>
      )}

      {/* Instructions Panel */}
      <div className="mb-4">
        <label className="block mb-2 text-sm text-muted-foreground">
          Instructions (System Prompt)
        </label>
        <textarea
          value={instructionsInput}
          onChange={(e) => setInstructionsInput(e.target.value)}
          onBlur={handleUpdateInstructions}
          className="w-full min-h-20 px-2 py-1.5 text-sm bg-card border border-input placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y"
          placeholder="You are a helpful assistant..."
        />
      </div>

      {/* Messages */}
      <div className="mb-4">
        <label className="block mb-2 text-sm text-muted-foreground">
          Messages ({messages.length}) · In Context: {contextIds.length}
        </label>
        <div className="bg-card border border-input min-h-48 max-h-96 overflow-auto p-2">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-sm italic">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'p-2 mb-2',
                  msg.type === 'user' ? 'bg-primary/10' : 'bg-secondary',
                  contextIds.includes(msg.id) ? 'border-l-2 border-primary' : 'border-l-2 border-transparent'
                )}
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {msg.type} · ~{msg.tokenEstimate} tokens
                </div>
                <div className="text-sm">{msg.content}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 h-8 px-2 py-1.5 text-sm bg-card border border-input placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
          disabled={!isConnected}
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected || !messageInput.trim()}
          className={cn(
            'px-3 py-1 text-sm font-medium transition-colors',
            isConnected
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          Send
        </button>
      </div>

      {/* Debug info */}
      <details className="mt-6">
        <summary className="text-muted-foreground cursor-pointer text-sm">Debug Info</summary>
        <pre className="mt-2 p-2 bg-card text-xs overflow-auto border border-input">
          {JSON.stringify({ sessionId, isConnected, messagesCount: messages.length, contextIds }, null, 2)}
        </pre>
      </details>
    </div>
  )
}
