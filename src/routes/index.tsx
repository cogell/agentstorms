import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus, BookOpen, Layers } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  const navigate = useNavigate()

  const createSession = () => {
    const sessionId = crypto.randomUUID()
    navigate({ to: '/session/$sessionId', params: { sessionId } })
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Agent Sandbox</h1>
        <p className="text-muted-foreground text-sm">
          A learning environment for developing intuition about LLM agents.
          Experiment with context windows, token budgets, and message flow.
        </p>
      </div>

      {/* Quick start */}
      <div className="mb-8">
        <button
          onClick={createSession}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-emerald-600 active:bg-emerald-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New Session
        </button>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 border border-border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Context Management</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Add and remove messages from context. See token counts update in real-time.
          </p>
        </div>

        <div className="p-3 border border-border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Step-by-Step Execution</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Execute agent steps one at a time. Observe the decision-making process.
          </p>
        </div>
      </div>
    </div>
  )
}
