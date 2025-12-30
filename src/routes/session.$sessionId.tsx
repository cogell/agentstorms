import { createFileRoute } from '@tanstack/react-router'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useSandboxStore } from '@/stores/sandbox'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Send, AlertCircle, User, Bot, Settings, Hash } from 'lucide-react'

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
    <div className="h-full flex flex-col">
      {/* Session header */}
      <div className="h-9 border-b border-border flex items-center justify-between px-3 shrink-0 bg-card">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Hash className="h-3 w-3" />
          <span className="font-medium text-foreground">{sessionId.slice(0, 8)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium',
              isConnected
                ? 'bg-primary/10 text-primary'
                : 'bg-destructive/10 text-destructive'
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', isConnected ? 'bg-primary' : 'bg-destructive')} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 text-destructive text-xs border-b border-destructive/20">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main content - two column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Instructions */}
        <div className="w-72 border-r border-border flex flex-col shrink-0">
          <div className="h-8 border-b border-border flex items-center px-3 text-xs font-medium text-muted-foreground bg-secondary/50">
            <Settings className="h-3 w-3 mr-1.5" />
            Instructions
          </div>
          <div className="flex-1 p-2">
            <textarea
              value={instructionsInput}
              onChange={(e) => setInstructionsInput(e.target.value)}
              onBlur={handleUpdateInstructions}
              className="w-full h-full px-2 py-1.5 text-xs bg-background border border-input placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              placeholder="You are a helpful assistant..."
            />
          </div>
        </div>

        {/* Right panel - Messages */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages header */}
          <div className="h-8 border-b border-border flex items-center justify-between px-3 text-xs font-medium text-muted-foreground bg-secondary/50">
            <span>Messages</span>
            <span className="text-xs">
              {messages.length} total · {contextIds.length} in context
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                No messages yet. Send a message to get started.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'p-2 border',
                    contextIds.includes(msg.id)
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-border bg-card'
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {msg.type === 'user' ? (
                      <User className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <Bot className="h-3 w-3 text-primary" />
                    )}
                    <span className="text-xs font-medium">
                      {msg.type === 'user' ? 'User' : 'Assistant'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ~{msg.tokenEstimate} tokens
                    </span>
                    {contextIds.includes(msg.id) && (
                      <span className="ml-auto text-xs text-primary font-medium">in context</span>
                    )}
                  </div>
                  <div className="text-sm pl-4">{msg.content}</div>
                </div>
              ))
            )}
          </div>

          {/* Message input */}
          <div className="border-t border-border p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 h-8 px-2 py-1.5 text-sm bg-background border border-input placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                disabled={!isConnected}
              />
              <button
                onClick={handleSendMessage}
                disabled={!isConnected || !messageInput.trim()}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium transition-colors',
                  isConnected && messageInput.trim()
                    ? 'bg-primary text-primary-foreground hover:bg-emerald-600'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                <Send className="h-3.5 w-3.5" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
