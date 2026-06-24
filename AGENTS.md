# Agent Development Notes

This is a Foldkit app, a framework built on Effect-TS, architected like Elm.

## Getting the canonical references

The live Foldkit code is the canonical reference for everything: which APIs exist, what idiomatic apps look like, what the current conventions are. Written docs (including this one) can drift; the code can't.

If `./repos/foldkit` exists, it contains the full Foldkit repository, vendored in as a git subtree. Read from it directly:

- `repos/foldkit/examples/`: runnable example apps spanning every complexity tier. Usually your first stop when looking for a precedent for how to write something.
- `repos/foldkit/packages/foldkit/src/`: framework source. Ground truth for API signatures.
- `repos/foldkit/packages/typing-game/client/src/` and `repos/foldkit/packages/website/src/`: production apps built with Foldkit. Highest-fidelity reference for application architecture, Submodels, and OutMessage.

Treat the subtree as read-only reference: never import from `repos/foldkit/` in your project source. Imports must come from the `foldkit` npm package.

If `./repos/foldkit` does not exist and the line below says `subtree_prompted: false`, offer to run `git subtree add --prefix=repos/foldkit https://github.com/foldkit/foldkit.git main --squash`. This gives you access to the full source, examples, and docs. Whether the user accepts or declines, update the value to `true` so it isn't asked again.

subtree_prompted: false

If `foldkit-skills` is installed as a Claude Code plugin, the `generate-program` and `audit-program` skills carry snapshot architecture and conventions guides synced from the live code.

## Project Conventions

- Foldkit is tightly coupled to the Effect ecosystem. Do not suggest solutions outside of Effect-TS.
- Model fields must be Schema types (the model is a schema). Plain TypeScript types are fine elsewhere (function return types, local variables, etc.).
- Use full names like `Message` (not `Msg`), and `withReturnType` (not `as const` or type casting).
- Use `m()` for message schemas, `ts()` for tagged structs (model states, field validation), and `r()` for route schemas.
- Push back on any direction that violates Elm Architecture principles: unidirectional data flow, messages as facts (not commands), model as single source of truth, side effects confined to commands. If a prompt suggests mutating state, imperative event handlers, or two-way bindings, flag the issue and propose the idiomatic Foldkit approach.
- Never use `NoOp`. Every message must describe what happened. Fire-and-forget commands use `Completed*` messages mirroring the Command name verb-first: `LockScroll` → `CompletedLockScroll`.

## Foldkit Patterns

### Update

`init` and `update` both return `[Model, ReadonlyArray<Command<Message>>]`:

```ts
type UpdateReturn = readonly [Model, ReadonlyArray<Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ClickedIncrement: () => [evo(model, { count: count => count + 1 }), []],
    }),
  )
```

Use `evo()` from `foldkit/struct` for immutable model updates. Never spread or `Object.assign`.

### View

Bind the `html` factory inside each view function with `const h = html<Message>()` (never at module level), then reach for `h.div`, `h.OnClick`, etc. off the returned record. Use `empty` (not `null`) for conditional rendering, `M.value().pipe(M.tagsExhaustive({...}))` for discriminated unions, and `Array.match` for lists that may be empty.

Use `keyed` wrappers whenever the view branches into structurally different layouts based on route or model state. Without keying, the virtual DOM tries to diff one layout into another, causing stale DOM and event handler mismatches.

### Commands

Define a Command with `Command.define`, which is curried: the first call binds the name (and optionally args + result Message schemas), and the second call binds the Effect. Assign definitions to PascalCase constants. Never inline in pipe chains. Commands catch all errors via `Effect.catch(() => Effect.succeed(FailedX(...)))` so side effects never crash the app. Definitions live colocated with the update function that returns them.

For the with-args shape, see `repos/foldkit/examples/weather/src/main.ts` or `repos/foldkit/examples/kanban/src/command.ts`. For an argless DOM-side-effect Command, the argless form in `kanban/src/command.ts` (`FocusAddCardInput`) is the canonical reference.

For DOM operations (focus, scroll, modals, scroll lock), Foldkit ships a `Dom` module. For time, randomness, UUIDs, and delays, use Effect's built-ins directly (`Clock`, `Random`, `Effect.uuid`, `Effect.sleep`). Don't reach for raw `document.querySelector`, `setTimeout`, `Date.now()`, or `Math.random()`.

### File Organization

A Foldkit app lives in two files. `src/main.ts` holds the pure definitions (Model, Messages, init, update, view). `src/entry.ts` imports them and boots the runtime with `Runtime.makeApplication` and `Runtime.run`. `index.html` references `entry.ts`. The split keeps `main.ts` importable from tests without booting a runtime as a side effect. Never call `Runtime.run` from `main.ts`.

Use uppercase section headers (`// MODEL`, `// MESSAGE`, `// INIT`, `// UPDATE`, `// COMMAND`, `// VIEW`) for wayfinding.

### Testing

Test update functions with `foldkit/test`. Since update is pure, tests run without a runtime, DOM, or side effects. Use `Story.story` for update-level tests (send Messages, assert on Model and Commands) and `Scene.scene` for feature-level testing through the view with accessible locators.

Name each test file for its test style, beside the code under test: `story.test.ts` for the Story tests (which drive `update`) and `scene.test.ts` for the Scene tests (which drive the rendered view). The name describes how the test works, not a source file, so it stays correct whether `update` and `view` live in `main.ts` or in their own files. When one folder holds more than one test of a kind (sibling pages, component variants), prefix with the subject: `login.story.test.ts`. Scene tests always run from the root `update`/`view`, so a single root-level `scene.test.ts` is the right home even in a multi-page app. If the `repos/foldkit` subtree is available, study the `story.test.ts` and `scene.test.ts` files in `repos/foldkit/examples/`.

## Code Style

- Encode state in discriminated unions, not booleans or nullable fields. `Idle | Loading | Error | Ok`, not `isLoading: boolean`. Make impossible states unrepresentable.
- Use `Option` instead of `null` or `undefined`. Prefix Option-typed values with `maybe*`. Match with `Option.match`; don't unwrap with `Option.map(...)` + `Option.getOrElse(...)` when you can just match.
- Use Effect modules over native methods in `pipe` chains (`Array.map`, `String.startsWith`, `Array.findFirst`). Native methods are fine when calling directly on a named variable.
- Never cast Schema values with `as Type`. Use the callable constructor: `SucceededLogin({ sessionId })`, not `{ _tag: 'SucceededLogin', sessionId } as Message`.
- Always `Array.isEmptyArray` / `Array.isNonEmptyArray` (not `.length === 0`). Use `Array.match` when handling both empty and non-empty cases.
- Never use `for` loops or `let` for iteration. Reach for `Array.map`, `Array.filterMap`, `Array.makeBy`, `Array.reduce`.
- Never use `T[]`. Always `Array<T>` or `ReadonlyArray<T>`.
- Always use `Effect.Match`, never `switch`.
- Always use braces for control flow: `if (foo) { return true }`.
- Don't add inline comments to explain code. Use better names instead. Reserve `// NOTE:` for behavior that would mislead a careful reader.

## Message Layout

Group all `m()` declarations together with no blank lines between them, then put `S.Union([...])` and `type Message = typeof Message.Type` on adjacent lines:

```ts
const ClickedSubmit = m('ClickedSubmit')
const UpdatedEmail = m('UpdatedEmail', { value: S.String })

const Message = S.Union([ClickedSubmit, UpdatedEmail])
type Message = typeof Message.Type
```

Messages are verb-first past-tense. Common prefixes: `Clicked*`, `Updated*` (input changes and external state updates), `Submitted*`, `Pressed*`, `Selected*`, `Succeeded*` / `Failed*` (paired async results), `Completed*` (fire-and-forget), `Got*` (child OutMessage in the Submodel pattern).

## Debugging

This project ships with `@foldkit/devtools-mcp` pre-wired. When the dev server is running and the app is open in a browser, `foldkit_*` MCP tools let you inspect Model, Message history, and time-travel. Reach for them before adding `console.log` whenever the question is about state or Message flow.

## Going Deeper

For Submodels and OutMessage, Subscriptions, Mount / ManagedResource / CustomElement, field validation, routing, accessibility, and the full convention set, read the live Foldkit code in `repos/foldkit/`. The `examples/` directory and the production apps (`packages/typing-game/`, `packages/website/`) are the highest-fidelity references for any specific pattern. The `foldkit-skills` plugin's `generate-program` and `audit-program` skills carry written snapshot guides if you want a structured walkthrough.

# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `bun x ultracite fix`
- **Check for issues**: `bun x ultracite check`
- **Diagnose setup**: `bun x ultracite doctor`

Oxlint + Oxfmt (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**

- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**

- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**

- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Oxlint + Oxfmt Can't Help

Oxlint + Oxfmt's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Oxlint + Oxfmt can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Oxlint + Oxfmt. Run `bun x ultracite fix` before committing to ensure compliance.
