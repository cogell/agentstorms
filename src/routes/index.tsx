import { createFileRoute, useNavigate } from '@tanstack/react-router'

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
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-3">Agent Sandbox</h1>
      <p className="mb-6 text-muted-foreground text-sm">
        A learning environment for developing intuition about LLM agents.
      </p>
      <button
        onClick={createSession}
        className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Create New Session
      </button>
    </div>
  )
}
