# Plan 112: Remove shadcn toast from the public shadcn registry surface

> **Executor instructions**: Add failing tests first that prove `shadcn/toast`
> is still present in the registry, docs route data, live examples, and source
> surface. Confirm those tests fail. Then remove the `shadcn/toast` item
> completely while preserving `base-ui/toast` and `shadcn/sonner`.
>
> **Drift check (run first)**:
> `git diff --stat 0dea03a8..HEAD -- src/live-examples.ts src/data.test.ts src/story.test.ts src/scene.test.ts scripts/registry-component-progress-common.test.ts docs/component-conversion-checklist.json docs/component-conversion-checklist.md registry-src/shadcn/toast src/registry/shadcn/toast registry/docs/shadcn/toast.json registry/index.json public/r/shadcn-toast.json plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the current
> state notes against live code. On a mismatch, stop and report drift.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MEDIUM
- **Depends on**: Plans 081, 082, and 098
- **Category**: product surface cleanup
- **Planned at**: commit `0dea03a8`, 2026-07-06

## Why this matters

The user explicitly said "toast should be removed from shadcn completely." The
current repo still treats `shadcn/toast` as an installable public item, with
source, docs artifacts, live example registrations, generated registry entries,
and tests. Keeping both `shadcn/toast` and `shadcn/sonner` blurs the public
surface and keeps an unwanted component in the registry.

This plan removes only the shadcn toast wrapper. It preserves the local Base UI
toast primitive and the shadcn Sonner wrapper unless the user gives a separate
instruction to remove those too.

## Current state

- `registry-src/shadcn/toast/item.json:3-11` declares item id `shadcn/toast`
  with installable source paths.
- `registry-src/shadcn/toast/docs.md:5-41` documents Toast as a shadcn wrapper.
- `registry/docs/shadcn/toast.json:3-60` exposes the route
  `/components/shadcn/toast` and local install path `src/registry/shadcn/toast`.
- `registry/docs/shadcn/toast.json:149-217` lists public `ToastDemo`,
  `ToastSimple`, `ToastWithTitle`, `ToastWithAction`, `ToastDestructive`, and
  `ToastStacked` examples.
- `src/live-examples.ts:565-575` imports shadcn toast examples, and
  `src/live-examples.ts:2970-2983` registers them as live examples.
- `src/registry/shadcn/toast/**` contains installable source and tests.
- `registry/index.json:20708-20917` still includes the generated
  `shadcn/toast` item.
- `plans/README.md:188` records Plan 098 as the plan that promoted the held
  `shadcn/toast` row. Do not rewrite history; add this removal as a new
  superseding product-surface plan.

## Commands you will need

| Purpose             | Command                  | Expected on success                 |
| ------------------- | ------------------------ | ----------------------------------- |
| Unit/Scene tests    | `bun run test`           | exit 0                              |
| Registry validation | `bun run registry:check` | exit 0                              |
| Typecheck           | `bun run typecheck`      | exit 0                              |
| Lint/check          | `bun run check`          | exit 0                              |
| Registry generation | `bun run registry:build` | exit 0 when artifacts need updating |

## Scope

**In scope**:

- tests that assert `shadcn/toast` is absent
- `registry-src/shadcn/toast/**` deletion
- `src/registry/shadcn/toast/**` deletion
- shadcn toast imports and live registrations in `src/live-examples.ts`
- shadcn toast-specific tests in `src/data.test.ts`, `src/story.test.ts`,
  `src/scene.test.ts`, and `src/registry/shadcn/toast/**`
- generated registry/docs/public artifacts after `bun run registry:build`
- generated component-conversion progress artifacts and assertions after
  `bun run origin:components:write`
- `plans/README.md` status/dependency note updates

**Out of scope**:

- `registry-src/base-ui/toast/**`
- `src/registry/base-ui/toast/**`
- `src/registry/shadcn/sonner/**`
- Bubble, sidebar, or marker examples that use toast/sonner feedback. Keep
  those on `base-ui/toast` or `shadcn/sonner` as appropriate.

## Git workflow

- Branch: `codex/112-remove-shadcn-toast-surface`.
- Commit per logical fix group if the operator asks for commits.
- Do not push or open a PR unless explicitly instructed.

## Steps

### Step 1: Add red absence tests

Add tests that fail on current `0dea03a8` because `shadcn/toast` is still
present:

- A registry/data test that loads `registry/index.json` or the generated
  catalog data and asserts no item has id `shadcn/toast`.
- A docs artifact test that asserts `registry/docs/shadcn/toast.json` does not
  exist or is not referenced by the docs route inventory.
- A live-example map test that asserts there are no keys starting with
  `shadcn/toast`.
- A source guard test or script assertion that `src/registry/shadcn/toast` and
  `registry-src/shadcn/toast` do not exist.
- A browser/docs test is optional but useful: navigate to
  `/components/shadcn/toast` and assert it is not a public component detail
  page. Use the repo's current 404/not-found behavior rather than inventing a
  new route contract.

**Verify red**:

```bash
bun run test -- src/data.test.ts src/story.test.ts src/scene.test.ts
```

Expected before removal: exit nonzero because `shadcn/toast` still exists.

### Step 2: Remove shadcn toast source and registrations

Delete the shadcn toast item and source:

- Remove `registry-src/shadcn/toast/**`.
- Remove `src/registry/shadcn/toast/**`.
- Remove shadcn toast imports from `src/live-examples.ts`.
- Remove shadcn toast live example registrations from `src/live-examples.ts`.
- Remove or update tests that import shadcn toast directly. Replace any
  remaining product-surface expectations with absence assertions.
- Keep base-ui toast imports, examples, docs, and tests intact.
- Keep shadcn sonner imports, examples, docs, and tests intact.

**Verify**:

```bash
bun run test -- src/data.test.ts src/story.test.ts src/scene.test.ts
bun run typecheck
```

Expected after source cleanup: exit 0, with no unresolved shadcn toast imports.

### Step 3: Regenerate registry and docs artifacts

Run:

```bash
bun run registry:build
```

Expected: generated `registry/index.json`, `registry/docs/**`, and `public/r/**`
no longer include `shadcn/toast` or `shadcn-toast` artifacts.

If the removal changes component-progress counts, also run:

```bash
bun run origin:components:write
```

Expected: generated component-conversion checklist files and their progress
test assertions now reflect that `shadcn/toast` is no longer an imported
shadcn item.

### Step 4: Verify no shadcn toast surface remains

Run these searches:

```bash
rg -n "shadcn/toast|shadcn-toast|ToastStacked|ToastWithAction|ToastDestructive" src registry-src registry public tests
```

Expected: no matches for the removed shadcn toast item. Matches under
`base-ui/toast`, `shadcn/sonner`, or prose explaining historical Plan 098 are
acceptable only if they do not expose `shadcn/toast` as an active item.

Run final gates:

```bash
bun run test
bun run typecheck
bun run registry:check
bun run check
```

Expected: all pass.

## Done criteria

- [ ] Red absence tests fail before removal and pass after removal.
- [ ] `shadcn/toast` has no registry source, installable source, docs artifact,
      public registry artifact, docs route, or live example.
- [ ] `base-ui/toast` remains present and tested.
- [ ] `shadcn/sonner` remains present and tested.
- [ ] `bun run test`, `bun run typecheck`, `bun run registry:check`, and
      `bun run check` pass.
- [ ] Component-conversion checklist artifacts and progress assertions reflect
      the new shadcn count without exposing `shadcn/toast` as active.
- [ ] `plans/README.md` records this plan as superseding the product-surface
      outcome of Plan 098 without rewriting Plan 098 history.

## STOP conditions

- The user clarifies they meant to remove Sonner too. Stop and write a broader
  removal plan instead of widening this one mid-execution.
- Generated registry tooling assumes every DONE plan has a live item and cannot
  represent removal. Stop and plan the tooling lifecycle state change first.
- Removing `shadcn/toast` breaks `base-ui/toast` or `shadcn/sonner`. Stop and
  report the shared dependency that needs separation.

## Maintenance notes

This is an intentional product-surface removal, not a failed implementation
cleanup. Keep Plan 098 in history as completed prior work, but treat Plan 112 as
the current source of truth for the active shadcn toast surface.
