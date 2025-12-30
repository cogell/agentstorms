# Logo for the LLM/Agent Era

## Inspiration

**Logo (1967)** was designed by Seymour Papert, Wally Feurzeig, and Cynthia Solomon not to teach programming, but to use programming as a vehicle for learning how to think.

- **The turtle as "object to think with"**: A simple entity whose behavior you could understand by imagining yourself as the turtle—position, heading, pen state. Abstract computation became embodied.

- **Constructionism**: Learning happens best when you're building something tangible and shareable. Logo gave immediate visual feedback: type a command, watch the turtle move. The gap between intention and result was visible and explorable.

- **"No training wheels"**: Logo used real Lisp concepts (recursion, procedures, list processing), not simplified toy versions. Children are capable of powerful ideas if given the right environment.

- **Debugging as learning**: Papert reframed bugs not as failures but as opportunities. Logo created a culture where being wrong was productive—you could see what went wrong and fix it.

- **"Low floor, high ceiling"**: Easy to start, but no arbitrary limits on where you could go. The same environment served beginners and experts.

- **Body-syntonic reasoning**: When you could imagine yourself *as* the turtle, abstract operations became intuitive. "Turn right 90 degrees" made sense because you could feel it.

**The modern problem**: Today, people interact with LLMs through prompts, but the process is opaque. Context windows, attention, system prompts, and tool use are invisible. Users develop superstitions rather than intuitions.

---

## Principles

See [PRINCIPLES.md](../PRINCIPLES.md) for our design commitments.

---

## Plan: Agent Sandbox

### Overview

Agent Sandbox is a learning environment for developing intuition about LLM agents. Users interact with an agent through a spatial interface that makes context, instructions, and reasoning visible and manipulable. The core loop is step-by-step execution controlled by the learner, not autonomous completion.

### Goals

1. **Demystify agent behavior**: Make the relationship between input (context, instructions) and output (reasoning, actions) legible.

2. **Build transferable intuition**: Users develop mental models that apply whether they're chatting with Claude, writing system prompts, or building agent systems.

3. **Enable deliberate practice**: Retry, branch, and compare. See how small changes cascade through agent behavior.

4. **Scale with expertise**: Beginners watch and learn; experts compose and optimize.

### Non-Goals

- Production agent deployment
- Autonomous task completion
- Multi-agent orchestration (v1)
- Persistent memory across sessions (v1)

---

### User Experience

#### The Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  INSTRUCTIONS                                          [Edit ✎]│
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ You are a helpful assistant. Be concise.                  │ │
│  │ When asked about weather, always check multiple sources.  │ │
│  └───────────────────────────────────────────────────────────┘ │
├─────────────────────────────────┬───────────────────────────────┤
│  CONTEXT                        │  OFFSTAGE                     │
│  What the agent sees            │  Available but not visible    │
│                                 │                               │
│  ┌───────┐ ┌───────┐ ┌───────┐ │  ┌───────┐ ┌───────┐         │
│  │User   │ │Agent  │ │Tool   │ │  │Old    │ │Summary│         │
│  │msg 1  │ │resp 1 │ │result │ │  │turns  │ │of doc │         │
│  │       │ │       │ │       │ │  │       │ │       │         │
│  └───────┘ └───────┘ └───────┘ │  └───────┘ └───────┘         │
│        ↕ drag to move ↕        │                               │
│                                 │                               │
│  ████████████░░░░ ~3,200 tokens                                │
├─────────────────────────────────┴───────────────────────────────┤
│  STEP STREAM                                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ▸ Step 1: User prompt received                            │ │
│  │ ▾ Step 2: Agent reasoning                                 │ │
│  │   │ "The user is asking about weather in SF. I should     │ │
│  │   │  use the weather tool to get current conditions..."   │ │
│  │   └─→ Tool call: getWeather({location: "San Francisco"})  │ │
│  │ ▸ Step 3: Tool result received                            │ │
│  │ ● Step 4: Generating response... ████░░░░                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [▶ Continue]   [↩ Retry Step]   [⑂ Branch]   [📷 Snapshot]    │
├─────────────────────────────────────────────────────────────────┤
│  HISTORY (collapsed)                                            │
│  ▸ Conversation started 2 minutes ago • 4 steps • 2 tool calls  │
├─────────────────────────────────────────────────────────────────┤
│  MESSAGE  [attach files] [add to context]                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ What's the weather in San Francisco?                    ⏎ │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### Core Interactions

**Drag to Context**: Items in the OFFSTAGE panel can be dragged into CONTEXT, and vice versa. The token meter updates in real-time. This makes the abstract question "what does the agent know?" into a concrete spatial relationship.

**Edit Instructions**: The system prompt is always visible and editable between steps. Changes take effect on the next step, allowing A/B testing of instruction variations.

**Step Controls**:
- **Continue**: Execute the next step with current context and instructions
- **Retry Step**: Re-run the current step (useful after adjusting context/instructions)
- **Branch**: Duplicate the current state to explore an alternative path
- **Snapshot**: Save the full state for later restoration

**Step Stream**: Each step shows what the agent received, what it reasoned, and what it output. Tool calls show arguments; tool results show return values. Reasoning tokens (if available) are displayed.

#### Learning Progression

| Level | Focus | Unlocks |
|-------|-------|---------|
| 1 | Watch | Just chat, but with visible step stream. Notice patterns. |
| 2 | Context | Drag items in/out of context. See how visibility affects behavior. |
| 3 | Instructions | Edit the system prompt. Learn that framing changes everything. |
| 4 | Budgeting | Work within token limits. Learn compression and prioritization. |
| 5 | Composition | Save and reuse instruction templates and context kits. |

---

### Technical Architecture

#### Architecture Decisions

| Decision | Choice |
|----------|--------|
| State authority | **DO-first** - Durable Object is source of truth, Zustand is local cache |
| Streaming transport | **WebSocket via DO** - Persistent connection for real-time streaming |
| Token counting | **Approximate** - Client estimate (js-tiktoken) with "~" indicator; no server verification |
| Multi-tab sync | **No sync v1** - Each tab independent, add sync in v2 |
| Tool execution | **Server-only** - All tools execute in Worker/DO |
| Model support | **Claude only v1** - Claude Sonnet 4; model switcher UI deferred |
| Authentication | **Cloudflare Access** - Whitelisted emails only; no in-app auth |
| Deployment | **GitHub Actions** - CI/CD to Cloudflare Workers + Static Assets |
| Testing | **Deferred** - No automated tests for v1 |
| Observability | **Deferred** - No logging/metrics infrastructure for v1 |

**Token Counting Note:** js-tiktoken uses OpenAI's tokenizer, not Claude's. Estimates will diverge from actual usage. UI should display counts as approximate (e.g., "~3,200 tokens") and show actual usage in step footer after completion.

#### Technology Stack

- **Frontend**: Vite + React + TanStack Router
- **UI**: Tailwind CSS + shadcn/ui + dnd-kit (drag and drop)
- **State (client)**: Zustand (cache/UI state)
- **State (server)**: Cloudflare Durable Objects (authoritative)
- **API**: Cloudflare Workers
- **AI Integration**: Vercel AI SDK + Anthropic Claude
- **Deployment**: Cloudflare Workers + Static Assets

#### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BROWSER (Vite SPA)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │  TanStack   │  │   Zustand   │  │  dnd-kit    │                 │
│  │   Router    │  │   (cache)   │  │  drag/drop  │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│         │                │                │                         │
│         └────────────────┼────────────────┘                         │
│                          │ WebSocket                                │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────────────┐
│                    CLOUDFLARE ACCESS                                │
│              (Whitelisted emails only)                              │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────────────┐
│              CLOUDFLARE WORKER + DURABLE OBJECT                     │
│  ┌───────────────────────▼───────────────────────┐                 │
│  │           SandboxSession (DO)                  │                 │
│  │  ┌─────────────────────────────────────────┐  │                 │
│  │  │  State (SQLite)                         │  │                 │
│  │  │  - instructions, messages, steps        │  │                 │
│  │  │  - contextIds, branches, snapshots      │  │                 │
│  │  └─────────────────────────────────────────┘  │                 │
│  │  ┌─────────────────────────────────────────┐  │                 │
│  │  │  WebSocket Handler                      │  │                 │
│  │  │  - step:execute, step:retry             │  │                 │
│  │  │  - context:update, branch:create        │  │                 │
│  │  └─────────────────────────────────────────┘  │                 │
│  └───────────────────────┬───────────────────────┘                 │
│                          │                                          │
│  ┌───────────────────────▼───────────────────────┐                 │
│  │           AI SDK + Anthropic                   │                 │
│  │  streamText() → stream chunks via WebSocket   │                 │
│  └───────────────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
```

#### WebSocket Protocol

```typescript
// Client → DO messages
type ClientMessage =
  | { type: 'session:join'; sessionId: string }
  | { type: 'session:create' }
  | { type: 'step:execute' }
  | { type: 'step:retry' }
  | { type: 'context:update'; contextIds: string[] }
  | { type: 'instructions:update'; instructions: string }
  | { type: 'message:send'; content: string }
  | { type: 'branch:create'; name: string }
  | { type: 'branch:switch'; branchId: string }
  | { type: 'snapshot:create'; name: string }
  | { type: 'snapshot:restore'; snapshotId: string };

// DO → Client messages
type ServerMessage =
  | { type: 'session:state'; state: DOState }
  | { type: 'step:start'; stepNumber: number }
  | { type: 'step:chunk'; chunk: StreamPart }
  | { type: 'step:complete'; step: StepRecord }
  | { type: 'step:error'; error: string }
  | { type: 'tool:executing'; toolName: string; args: unknown }
  | { type: 'tool:result'; toolName: string; result: unknown }
  | { type: 'state:updated'; partial: Partial<DOState> }
  | { type: 'error'; message: string };
```

#### File Structure

```
agentstorms/
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── wrangler.toml
├── tailwind.config.js
│
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions → Cloudflare
│
├── src/                          # Vite frontend
│   ├── main.tsx
│   ├── index.css
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx             # Landing → create session
│   │   └── session.$sessionId.tsx
│   ├── components/
│   │   ├── ui/                   # shadcn components
│   │   ├── InstructionsPanel.tsx
│   │   ├── ContextPanel.tsx
│   │   ├── OffstagePanel.tsx
│   │   ├── StepStream.tsx
│   │   ├── StepControls.tsx
│   │   ├── TokenMeter.tsx
│   │   ├── MessageInput.tsx
│   │   └── BranchSwitcher.tsx
│   ├── stores/
│   │   └── sandbox.ts            # Zustand store (cache)
│   ├── hooks/
│   │   ├── useWebSocket.ts       # DO connection
│   │   └── useTokenEstimate.ts   # Client-side estimation
│   └── lib/
│       ├── tokens.ts             # js-tiktoken wrapper
│       └── types.ts              # Shared types
│
├── worker/                       # Cloudflare Worker
│   ├── index.ts                  # Worker entry, routes to DO
│   ├── durable-objects/
│   │   └── SandboxSession.ts     # Main DO class
│   ├── lib/
│   │   ├── ai.ts                 # AI SDK wrapper
│   │   ├── tools.ts              # Tool definitions
│   │   └── tokens.ts             # Server token counting
│   └── types.ts
│
└── plans/
    └── poc.md                    # This document
```

#### Concept Mapping to AI SDK

| Agent Sandbox Concept | AI SDK Equivalent |
|-----------------------|-------------------|
| Instructions panel | `system` parameter in `streamText` |
| Context (visible items) | `messages: ModelMessage[]` passed to `streamText` |
| Offstage (full history) | `UIMessage[]` stored in application state |
| Step stream | `fullStream` iteration with `includeRawChunks: true` |
| Token meter | Token counting on `ModelMessage[]` before submission |
| Tool visibility | Tool invocation parts with states |
| Retry step | Re-call `streamText` with same context |
| Branch | Deep clone of `{ instructions, uiMessages, contextIds }` |

#### The Loop Control Model

**Why Not ToolLoopAgent?**

AI SDK 6's `ToolLoopAgent` with `stopWhen` is designed for autonomous execution. Once you call `agent.stream()`, the loop runs until completion. The user is an observer, not a participant.

```typescript
// Autonomous loop - user watches
const agent = new ToolLoopAgent({
  model,
  tools,
  stopWhen: stepCountIs(10),  // Runs up to 10 steps automatically
});
await agent.stream({ prompt });  // User has no control during execution
```

For learning, we need the inverse: the user controls progression, and each pause is a learning opportunity.

**Learner-Controlled Loop**

We use the lower-level `streamText` directly and manage the loop in application code:

```typescript
// Learner-controlled loop - user drives
async function executeStep(state: SandboxState): Promise<StepResult> {
  // Build context from what learner has marked "visible"
  const visibleMessages = state.uiMessages
    .filter(m => state.contextIds.includes(m.id))
    .map(convertToModelMessage);
  
  // Execute ONE step
  const result = streamText({
    model: gateway(state.selectedModel),
    system: state.instructions,
    messages: visibleMessages,
    tools: state.enabledTools,
    // No stopWhen - single step only
  });
  
  // Stream to UI
  const parts: StreamPart[] = [];
  for await (const part of result.fullStream) {
    parts.push(part);
    emitToUI(part);  // Real-time rendering
  }
  
  const response = await result.response;
  
  return {
    parts,
    response,
    shouldContinue: response.finishReason !== 'stop',
    toolCalls: response.toolCalls,
  };
}

// The "loop" is driven by user clicking Continue
async function onContinueClick() {
  const stepResult = await executeStep(currentState);
  
  // Add to history
  updateState(prev => ({
    ...prev,
    uiMessages: [...prev.uiMessages, ...stepResult.newMessages],
    steps: [...prev.steps, stepResult],
  }));
  
  // If tool was called, execute it
  if (stepResult.toolCalls.length > 0) {
    const toolResults = await executeTools(stepResult.toolCalls);
    updateState(prev => ({
      ...prev,
      uiMessages: [...prev.uiMessages, toolResults],
    }));
  }
  
  // UI now waits for next user action
  // - Continue (run next step)
  // - Retry (re-run this step with possibly different context)
  // - Branch (fork state)
  // - Edit context/instructions
}
```

**Key Insight**: `prepareStep` in AI SDK is for *programmatic* filtering during autonomous execution. We want *manual* filtering with visual feedback. The learner develops intuition that could later inform how they'd write a `prepareStep` function, but the learning happens through direct manipulation, not code.

#### State Shape

**Durable Object State (Server, Authoritative):**

```typescript
// Stored in DO - source of truth
interface DOState {
  sessionId: string;
  createdAt: string;

  // Agent config
  instructions: string;
  selectedModel: string;  // "claude-sonnet-4-20250514"
  enabledTools: ToolDefinition[];

  // Messages (full history)
  messages: StoredMessage[];  // All messages ever
  contextIds: string[];       // IDs currently visible to agent

  // Execution history
  steps: StepRecord[];
  currentStepIndex: number;

  // Branching
  branches: Branch[];
  activeBranchId: string;

  // Snapshots
  snapshots: Snapshot[];
}

interface StoredMessage {
  id: string;
  type: 'user' | 'assistant' | 'tool-call' | 'tool-result';
  content: string;
  timestamp: string;
  tokenEstimate: number;  // Calculated server-side on creation
  metadata?: Record<string, unknown>;
}
```

**Zustand State (Client, Cache):**

```typescript
// Client cache - hydrates from DO on connect
interface SandboxStore {
  // Mirrored from DO
  sessionId: string | null;
  instructions: string;
  messages: StoredMessage[];
  contextIds: string[];
  steps: StepRecord[];
  currentStepIndex: number;
  branches: Branch[];
  activeBranchId: string;

  // Client-only UI state
  isConnected: boolean;
  isExecuting: boolean;
  currentStreamChunks: StreamPart[];
  expandedSteps: Set<number>;
  selectedMessageId: string | null;

  // Actions
  hydrate: (state: DOState) => void;
  appendChunk: (chunk: StreamPart) => void;
  completeStep: (step: StepRecord) => void;
}

interface StepRecord {
  stepNumber: number;
  timestamp: Date;
  
  // Inputs (what the agent saw)
  instructionsSnapshot: string;
  contextSnapshot: ModelMessage[];
  tokenCount: number;
  
  // Outputs
  streamParts: StreamPart[];
  finishReason: string;
  toolCalls: ToolCall[];
  toolResults: ToolResult[];
  
  // Metadata
  modelId: string;
  durationMs: number;
  usage: TokenUsage;
}

interface Branch {
  id: string;
  name: string;
  parentBranchId: string | null;
  forkStepIndex: number;
  state: SandboxState;
}
```

#### Context Visualization

The drag-and-drop context panel requires:

1. **Token counting**: Estimate tokens for each UIMessage to update the meter
2. **Visual differentiation**: Different item types (user message, assistant message, tool call, tool result, document) have distinct appearances
3. **Compression preview**: When dragging an item out, optionally show "summarize this?" to keep a compressed version

```typescript
interface ContextItem {
  id: string;
  type: 'user' | 'assistant' | 'tool-call' | 'tool-result' | 'document';
  preview: string;           // Short text preview
  tokenEstimate: number;
  isInContext: boolean;
  sourceMessage: UIMessage;
}

function ContextPanel({ items, onMove }: ContextPanelProps) {
  const inContext = items.filter(i => i.isInContext);
  const offstage = items.filter(i => !i.isInContext);
  const totalTokens = inContext.reduce((sum, i) => sum + i.tokenEstimate, 0);
  
  return (
    <div className="flex">
      <DroppableZone id="context" items={inContext} onDrop={onMove}>
        <TokenMeter current={totalTokens} max={MAX_CONTEXT} />
      </DroppableZone>
      <DroppableZone id="offstage" items={offstage} onDrop={onMove} />
    </div>
  );
}
```

#### Step Stream Rendering

The step stream uses AI SDK's `fullStream` with `includeRawChunks` to show everything:

```typescript
function StepStream({ step }: { step: StepRecord }) {
  return (
    <div className="step">
      <StepHeader step={step} />
      
      {step.streamParts.map((part, i) => {
        switch (part.type) {
          case 'text-delta':
            return <TextDelta key={i} delta={part.textDelta} />;
          
          case 'reasoning':
            return <ReasoningBlock key={i} text={part.text} />;
          
          case 'tool-call':
            return (
              <ToolCallBlock 
                key={i}
                name={part.toolName}
                args={part.args}
              />
            );
          
          case 'tool-result':
            return (
              <ToolResultBlock
                key={i}
                name={part.toolName}
                result={part.result}
              />
            );
          
          case 'raw':
            return <RawChunk key={i} value={part.rawValue} />;
        }
      })}
      
      <StepFooter 
        finishReason={step.finishReason}
        usage={step.usage}
        duration={step.durationMs}
      />
    </div>
  );
}
```

---

### Implementation Phases

#### Phase 0: Infrastructure Setup

**Goal:** Vite + Worker + DO skeleton with WebSocket connection + CI/CD

- [ ] Initialize project with pnpm, Vite, React, TanStack Router
- [ ] Configure Tailwind CSS and shadcn/ui
- [ ] Set up Cloudflare Worker with wrangler.toml (static assets config)
- [ ] Configure Cloudflare Access application (whitelisted emails)
- [ ] Create SandboxSession Durable Object class (skeleton)
- [ ] Implement WebSocket connection hook (useWebSocket)
- [ ] Set up GitHub Actions workflow for deploy on push to main
- [ ] Verify end-to-end: browser connects to DO, sends/receives messages

**Acceptance:** `pnpm dev` starts Vite; `pnpm dev:worker` starts Wrangler; browser can connect and exchange messages with DO. Push to main triggers deploy.

#### Phase 1: Core Loop (Single Step Execution)

**Goal:** Execute one LLM step via WebSocket, stream response to UI

- [ ] Implement DOState persistence in Durable Object
- [ ] Add AI SDK integration (streamText with Anthropic)
- [ ] Create Zustand store with hydrate/appendChunk/completeStep actions
- [ ] Build session page with route /session/:sessionId
- [ ] Implement StepStream component for rendering chunks
- [ ] Add Continue/Retry controls (StepControls)
- [ ] Create editable InstructionsPanel
- [ ] Build MessageInput for user messages

**Acceptance:** Create session → connect WebSocket → send message → see streaming response → Continue/Retry work.

#### Phase 2: Context Manipulation

**Goal:** Drag items between Context/Offstage, token meter updates

- [ ] Build ContextPanel with draggable message cards (dnd-kit)
- [ ] Build OffstagePanel for items not in context
- [ ] Implement client-side token estimation (js-tiktoken)
- [ ] Create TokenMeter component with "~" prefix and visual progress bar
- [ ] Display actual token usage from API response in step footer
- [ ] Visual differentiation by message type (user, assistant, tool-call, tool-result)

**Acceptance:** Drag messages between panels; token meter updates instantly; types visually distinct.

#### Phase 3: Tool Execution

**Goal:** Tools execute server-side, results stream back

- [ ] Define tool registry in worker/lib/tools.ts
- [ ] Implement tool execution in DO step loop
- [ ] Stream tool:executing and tool:result events to client
- [ ] Render tool calls and results in StepStream
- [ ] Tool results become draggable context items

**Acceptance:** Agent can call tools; execution happens in DO; results appear in step stream.

#### Phase 4: Branching & Snapshots

**Goal:** Fork state, switch branches, save/restore snapshots

- [ ] Implement branch creation in DO (deep clone current state)
- [ ] Add branch switching logic
- [ ] Build BranchSwitcher UI component
- [ ] Implement snapshot save/restore in DO
- [ ] Add URL routing for branches (/session/:id?branch=:branchId)

**Acceptance:** Create branches; switch between them; snapshots save/restore full state.

#### Phase 5: Polish & UX

**Goal:** Smooth experience, keyboard shortcuts, error handling

- [ ] Keyboard shortcuts (Cmd+Enter = Continue, Cmd+R = Retry, Cmd+B = Branch)
- [ ] Error states (connection lost, API error, rate limit)
- [ ] Loading states (connecting, executing, tool running)
- [ ] Responsive layout (collapse panels on smaller screens)
- [ ] Guided onboarding for first-time users

---

### Success Metrics

1. **Comprehension**: After 30 minutes, users can accurately predict how adding/removing context items affects agent behavior.

2. **Transfer**: Users report improved results in other LLM interfaces after using Agent Sandbox.

3. **Engagement**: Users voluntarily retry steps and create branches (exploration behavior).

4. **Progression**: Users advance through learning levels without explicit instruction.

---

### Open Questions (Resolved)

1. **Real API calls vs. simulated?** → **Real calls.** Authentic behavior is essential for building intuition.

2. **Multi-turn tool use** → **Pause after tool call.** User clicks Continue to see result. Option to "auto-continue through tool calls" can be added later.

3. **Token counting accuracy** → **Hybrid approach.** Client-side estimate (js-tiktoken) for instant feedback; server verification on step execute.

4. **State persistence** → **Durable Objects.** DO is source of truth; Zustand is client cache.

5. **Streaming transport** → **WebSocket via DO.** Persistent connection for real-time streaming.

### Known Limitations (v1)

These are acknowledged gaps we're accepting for the initial release:

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| **Token count approximation** | js-tiktoken ≠ Claude tokenizer; estimates may be 10-20% off | Display as "~N tokens"; show actual in step footer |
| **No WebSocket reconnection** | Tab refresh or network blip loses connection | User refreshes page; DO state persists, client rehydrates |
| **No DO hibernation handling** | Long-idle sessions may lose WebSocket | Same as above; state survives, connection doesn't |
| **Parallel tool calls** | Claude can emit multiple tool calls; we pause after first | Execute all in parallel, show all results, then pause |
| **Streaming errors** | API failure mid-stream leaves partial step | Mark step as error; Retry re-runs from scratch |
| **No rate limiting** | Runaway API costs possible | CF Access restricts to known users; trust whitelisted users |
| **Large context UX** | 200K tokens doesn't fit in drag-and-drop UI | Cap displayed context at reasonable limit; collapse old items |

### Deferred to v2+

- **Multi-tab sync**: Each tab currently independent; add DO broadcast for real-time sync
- **Multi-provider support**: Currently Claude-only; add OpenAI/Workers AI later
- **Collaboration**: Shared sessions for collaborative learning
- **Mobile experience**: Touch-friendly alternative to drag-and-drop
- **Export/import sessions**: Portable session files
- **Template library**: Reusable instruction sets and context kits
- **Learning progression levels**: Guided unlock of features
- **Automated testing**: Unit, integration, and E2E test suites
- **Observability**: Logging, metrics, error tracking

---

### References

- Papert, S. (1980). *Mindstorms: Children, Computers, and Powerful Ideas*
- Vercel AI SDK 5 Blog Post: https://vercel.com/blog/ai-sdk-5
- Vercel AI SDK 6 Blog Post: https://vercel.com/blog/ai-sdk-6
- AI SDK Documentation: https://ai-sdk.dev
