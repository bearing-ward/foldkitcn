---
name: add-registry-component
description: Plan a new Foldkit registry component from an origin docs or registry URL. This skill resolves pinned local origin evidence and writes an improve-compatible dossier/plan preview, but does not implement the component.
---

# Add Registry Component

Use this skill when the user provides an origin docs or registry URL and asks to add, plan, port, or prepare a registry item.

## Contract

- Accept `status`, `next [count]`, `backlog [many] [limit <number>]`, `backlog [many] [<number>]`, or one or more origin docs or registry URLs.
- Resolve origin evidence from pinned local repositories first with `bun run origin:resolve -- <url>`.
- Treat live docs pages as discovery inputs, not parity oracles.
- Write an improve-compatible dossier and plan preview, not implementation code.
- Compose with the improve plan flow directly when available; hand the generated plan to improve instead of inventing a separate execution process.
- Stop after planning unless the user explicitly asks for `improve execute`.
- End every invocation by offering the most likely next step. Skip the question only when the user already requested that follow-up in the same prompt.
- Create dependency-complete batch plans when missing local dependencies are required.
- Create no `registry-src/<namespace>/<item>/` folders during planning.
- Use Effect Schema and Foldkit-native conventions in every generated plan.
- Treat historical queue artifacts as priority hints only. The live component progress tracker is authoritative because it derives from pinned origins plus `registry-src`.
- For backlog execution, `plans/README.md` is the authoritative implementation backlog. Pick the oldest ready plan in execution order, not the newest generated dossier.

## Invocation Modes

### `status`

- Run `bun run origin:components:status`.
- Report the summary and point at `docs/component-conversion-checklist.md`.
- Do not create dossier artifacts.
- Offer the next step based on the status:
  - If there are ready or dossier-ready rows, ask whether to run `next [count]`.
  - If a recent selection/dossier artifact exists, ask whether to compile implementation plans with `[$improve] plan ...`.
  - If there are only blocked rows, ask whether to generate blocked planning evidence for those rows.

### `next [count]`

- Run `bun run origin:components:next -- <count>`.
- Use the returned rows as the next candidate batch.
- For a normal planning invocation, generate dossier previews for those rows with `scripts/draft-registry-component-plan.ts`.
- Keep each generated batch to one row and at most two origin URLs.
- Do not include blocked rows unless the user explicitly asks for blocked planning evidence.
- After writing the selection and dossier previews, report their paths and ask: "Would you like me to compile implementation plans from this selection with `[$improve] plan ...`?" Use the concrete selection path in the suggested command.
- If the user says yes, invoke the `improve` plan flow with a prompt like: `create implementation plans for all rows in <selection-path>`.
- If the original request already asks to compile implementation plans, skip the question and proceed directly to the `improve` plan flow after the dossier previews are written and validated.

### `backlog [many] [limit <number>]`

- Use when the user asks to process existing implementation backlog instead of creating new dossier previews.
- Read `plans/README.md` first and identify the oldest plan whose status is `TODO` or stale `IN PROGRESS`, whose dependencies are `DONE`, and whose title/notes do not mark it `BLOCKED`, held, rejected, or gated by missing infrastructure.
- Confirm the selected plan file exists (`plans/<number>-*.md`) and read it fully before dispatching work.
- If no ready plan exists, report the first blocked or dependency-gated row and the concrete dependency/blocker.
- For `backlog` without `many`, process exactly one oldest ready plan.
- For `backlog many`, select every currently ready plan in oldest-first order, but preserve dependency boundaries: do not select a plan whose dependency is also selected unless the dependency will complete first.
- If a numeric limit is provided as `limit <number>` or as a bare number, treat it as the maximum number of concurrent worker processes/subagents. Default concurrency is 1 for `backlog` and 3 for `backlog many`.
- Do not exceed the concurrency limit. Start at most that many workers, wait for completions, then launch the next ready plan if `many` still has pending selections.
- Use subagents for `backlog many` when multi-agent tools are available. Give each worker one plan file, the plan text, relevant dossier paths, and the Foldkit/Effect guardrails. Keep worker branches/worktrees separate.
- The main agent remains the reviewer. After each worker finishes, inspect the diff, rerun the plan's required gates or the closest focused gates, and merge/commit only work that is complete and verified.
- If a worker reports a blocker, leave that plan unmerged, record the blocker in the status report, and continue with independent ready plans when possible.
- Never create new dossier previews in backlog mode unless the selected plan explicitly requires refreshed evidence before implementation.
- End with the processed plan IDs, worker outcomes, verification commands, and the next oldest ready plan if one remains.

### `<origin URL> [...origin URL]`

- Preserve the existing behavior: resolve each URL, then write a dossier and plan preview for that explicit origin batch.
- After writing the dossier and plan preview, report their paths and ask: "Would you like me to compile an implementation plan from this dossier with `[$improve] plan ...`?"
- If the explicit URL batch is blocked or incomplete, offer the next unblock step instead, using the concrete blocker from the dossier.
- If the original request already asks to compile implementation plans, skip the question and proceed directly to the `improve` plan flow after the dossier preview is written and validated.

## Evidence To Capture

For each origin, record the pinned local repo, pinned ref, docs paths, source paths, demo paths, tests/spec paths, API reference paths, style variant paths, registry dependency hints, runtime dependency hints, confidence, and unresolved questions.

Record origin `asChild` or Base UI `render` support and map it to Foldkit `toView` or named part-renderer composition. Do not expose a public Foldkit `asChild` option.

Classify dependencies with the schema vocabulary from `src/registry/schema.ts`:

- `registry-local`
- `allowed-runtime`
- `dev-or-fixture-only`
- `replace-with-foldkit`
- `reject-or-defer`

Use test classification for origin tests:

- `port-directly`
- `port-semantically`
- `covered-by-parity`
- `not-applicable`

## Planning Rules

Base UI items are unstyled behavior primitives. Styled origin demos become examples layered on top.

shadcn items are styled Foldkit wrappers or compositions. When a shadcn item references Base UI behavior, depend on the local `base-ui/*` item instead of duplicating it or importing upstream packages.

Variants must be represented with Effect Schema literals and local pure mapping functions. Do not add `class-variance-authority`.

React is fixture-only evidence. Do not add React, React DOM, Radix React, upstream Base UI React, or `repos/*` imports to installable Foldkit source.

Blocks and charts must be blocked or warned when they need missing infrastructure. Chart requests require the native chart foundation before implementation planning can proceed.

## Button Proving Batch

The first proving batch after the registry foundation is:

- `base-ui/button`
- `shadcn/button`

The batch plan must show the local dependency from `shadcn/button` to `base-ui/button`, the local `utils/cn` dependency, Button parity slots, `focusableWhenDisabled`, `data-disabled`, `toView`/part-renderer composition, theme token expectations, and the absence of real component implementation files.

## Useful Commands

```bash
bun run origin:resolve -- https://base-ui.com/react/components/button
bun run origin:components:status
bun run origin:components:next -- 4
bun run origin:components:write
bun run origin:components:check
bun run scripts/draft-registry-component-plan.ts --output plans/artifacts/001-button-dossier-preview https://base-ui.com/react/components/button https://ui.shadcn.com/docs/components/button
bun run registry:check
bun run parity:check -- --grep button --dry-run
```
