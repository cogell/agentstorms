import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Zap } from 'lucide-react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-10 border-b border-border flex items-center px-3 shrink-0">
        <Link to="/" className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
          <Zap className="h-3.5 w-3.5" />
          <span>Agent Sandbox</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
