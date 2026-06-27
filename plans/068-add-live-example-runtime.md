<!-- prettier-ignore-start -->
<!-- Generated improve plan: preserve command tables and source excerpts literally. -->

# Plan 068: Add live component example runtime

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat f3617d28..HEAD -- src src/registry/shadcn/button/examples.ts registry/docs/shadcn/button.json repos/foldkit/examples repos/foldkit/packages/website/src/page/example repos/foldkit/packages/foldkit/src/runtime`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/067-add-example-docs-artifacts.md
- **Category**: docs
- **Planned at**: commit `f3617d28`, 2026-06-27

## Why this matters

Static snippets are enough for the first docs milestone, but component docs
eventually need interactive previews. Live examples are risky because Foldkit
examples may need their own Model, Message, init, update, commands, reset
behavior, and isolation from the docs app. This plan adds that runtime only
after the example docs contract exists.

## Current state

- Plan 067 should mark examples as `static`, `live-ready`, or `blocked`.
- Current Button examples export pure `() => Html` functions, which are easy
  candidates for live preview.
- More complex examples may later need full Foldkit programs or isolated frames.

Relevant excerpt:

```ts
src/registry/shadcn/button/examples.ts:95-101
export const ButtonDefault = (): Html => {
  const h = html<never>()

  return Button<never>({
    toView: attributes => h.button([...attributes.button], ['Button']),
  })
}
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Targeted tests | `bun run test -- src/story.test.ts src/scene.test.ts` | all pass |
| Typecheck | `bun run typecheck` | exit 0 |
| Full tests | `bun run test` | exit 0 |
| Lint/check | `bun run check` | exit 0 |
| Build | `bun run build` | exit 0 |
| E2E | `bunx playwright test` | exit 0 |
| Whitespace | `git diff --check -- src registry/docs plans` | exit 0 |

## Scope

**In scope**:

- docs app example preview runtime under `src/**`
- `ExampleDocsArtifact` generation tweaks only if needed to mark safe live-ready
  examples
- Button page live preview wiring
- tests under `src/**` and e2e tests
- `plans/README.md` status row update

**Out of scope**:

- Do not make every example live.
- Do not run arbitrary code from Markdown.
- Do not introduce React, iframes, or a separate framework runtime unless a
  fresh design review approves it.
- Do not mutate registry component runtime source unless the example contract
  cannot otherwise reference safe exports.

## Git workflow

- Branch: `codex/068-live-examples`
- Commit after live preview runtime, tests, and browser smoke pass.
- Do not push or open a PR unless the operator explicitly instructs it.

## Steps

### Step 1: Define the live example boundary

Define a narrow live-preview contract for examples that can safely render inside
the docs page. Start with pure stateless examples:

```ts
type StaticExampleView = () => Html
```

For this plan, only examples with `previewStatus: "live-ready"` and a known
export name are eligible. All others remain static snippets.

**Verify**: `bun run test -- src/story.test.ts` -> tests cover eligible and
blocked preview status decisions.

### Step 2: Mark Button examples live-ready

Update example docs generation for `shadcn/button` so simple exported examples
that return `Html` are marked `live-ready` with `previewExportName`.

Do not infer live-ready for examples with commands, subscriptions, model state,
or unresolved dependencies.

**Verify**: `bun run registry:build && rg -n "live-ready|ButtonDefault" registry/docs/shadcn/button.json` -> exit 0.

### Step 3: Render live previews

Add a preview renderer that maps known live-ready example ids/export names to
imported example functions. Keep this explicit; do not dynamically import and
execute arbitrary strings from JSON.

Render live previews above or beside code snippets on the Button page. Include a
reset affordance only if the example owns state; Button examples may not need
one.

**Verify**: `bun run test -- src/scene.test.ts` -> tests assert ButtonDefault
live preview renders a button with accessible name "Button".

### Step 4: Add browser interaction smoke

Add Playwright smoke for a live preview:

- visit `/components/shadcn/button`.
- confirm preview renders.
- click a safe Button preview if it has no side effects.
- verify layout remains stable at desktop and mobile widths.

**Verify**: `bunx playwright test` -> exit 0.

### Step 5: Update the plan index

Mark plan 068 as DONE in `plans/README.md` when complete, unless a reviewer owns
the index.

**Verify**: `rg -n "\\| 068 \\| Add live component example runtime \\| P2 \\| L \\| 067 \\| DONE \\|" plans/README.md` -> exit 0.

## Test plan

- Story tests for preview eligibility.
- Scene tests for live Button previews and blocked static-only examples.
- Playwright e2e for live preview rendering and responsive layout.

## Done criteria

- [ ] Live preview contract is explicit and narrow.
- [ ] Button examples render live previews where safe.
- [ ] Static snippets still render for all examples.
- [ ] No arbitrary Markdown or JSON string execution exists.
- [ ] `bun run test`, `bun run typecheck`, `bun run check`, `bun run build`,
  `bunx playwright test`, and `git diff --check -- src registry/docs plans` exit 0.

## STOP conditions

Stop and report back if:

- Safe live preview requires iframe isolation or a broader runtime design.
- Examples need their own Model/Message/update and cannot fit the stateless
  contract.
- Implementing live previews would require importing from `repos/**` or React.

## Maintenance notes

This plan should stay conservative. Future stateful/live examples may need a
second runtime contract for full Foldkit programs, reset behavior, and command
isolation.

<!-- prettier-ignore-end -->
