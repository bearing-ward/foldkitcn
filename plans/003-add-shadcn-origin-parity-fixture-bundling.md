# Plan 003: Add shadcn origin parity fixture bundling

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` - unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 24113a13..HEAD -- package.json bun.lock scripts tests src/registry/parity plans vite.config.ts vitest.config.ts oxlint.config.ts oxfmt.config.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: HIGH
- **Depends on**: 001
- **Category**: tests
- **Planned at**: commit `24113a13`, 2026-06-24

## Why this matters

Plan 002 cannot honestly finish shadcn Button parity until the registry can
render pinned shadcn origin examples without rewriting them into local Foldkit
code. The first execution attempt proved Base UI origin-backed parity can work,
but shadcn examples depend on app aliases, Base UI React, CVA, icon packages,
and the shadcn app utility layer. This plan creates the fixture-only
browser/bundler layer needed for plan 002 and every future shadcn component.

## Current state

- `bun run parity:check -- --grep button --dry-run` only discovers slots on
  `main`.
- A stopped worker branch at
  `/Volumes/Sync/Development/Bearing-Ward/projects/repos/foldkitcn-002-button-proving-batch`
  showed the missing infrastructure. Do not depend on that worktree existing;
  treat it as advisory evidence only.
- The stopped attempt reported that `@base-ui/react@file:repos/base-ui/packages/react`
  failed because Base UI uses `workspace:*` dependencies outside this repo's
  package graph.
- The pinned shadcn Button files import:
  - `@/styles/base-nova/ui/button`
  - `@/styles/base-nova/ui/spinner`
  - `@/styles/base-nova/ui-rtl/button`
  - `@/styles/base-nova/ui-rtl/spinner`
  - `@/lib/utils`
  - `@/components/language-selector`
  - `@base-ui/react/button`
  - `class-variance-authority`
  - `lucide-react`
  - `@tabler/icons-react`
- `repos/ui/apps/v4/lib/utils.ts`,
  `repos/ui/apps/v4/components/language-selector.tsx`,
  `repos/ui/apps/v4/styles/base-nova/ui/button.tsx`, and
  `repos/ui/apps/v4/styles/base-nova/ui/spinner.tsx` exist locally.

Relevant evidence command:

```bash
rg -n "from \"@/|@base-ui/react/button|class-variance-authority|lucide-react|@tabler/icons-react|language-selector" repos/ui/apps/v4/examples/base/button*.tsx repos/ui/apps/v4/styles/base-nova/ui/button.tsx repos/ui/apps/v4/styles/base-nova/ui/spinner.tsx
```

## Commands you will need

| Purpose                              | Command                                                 | Expected on success                                                    |
| ------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------------------------- |
| Install after dev dependency changes | `bun install`                                           | exit 0 and lockfile updated only for fixture-only dependencies         |
| Origin fixture smoke                 | `bun run parity:origin:shadcn -- --grep button-default` | exit 0 and prints a captured origin snapshot from pinned shadcn source |
| Parity tests                         | `bun run test -- tests/parity`                          | exit 0                                                                 |
| Typecheck                            | `bun run typecheck`                                     | exit 0                                                                 |
| Ultracite check                      | `bun run check`                                         | exit 0                                                                 |
| Build                                | `bun run build`                                         | exit 0                                                                 |
| Git whitespace                       | `git diff --check`                                      | exit 0                                                                 |

If you choose a different script name than `parity:origin:shadcn`, update this
plan's verification commands and `package.json` consistently before finishing.

## Suggested executor toolkit

- Use the repo-local Foldkit guidance before adding Foldkit fixture code.
- Use Playwright plus Vite, or an equivalent browser-backed fixture runner, for
  shadcn origin rendering. `happy-dom` is not enough for the final visual
  parity layer because later plans need exact dimensions and browser-computed
  styles.
- Keep React, React DOM, icon libraries, CVA, and Base UI React resolution
  fixture-only. They must not enter any registry item `installableSourcePaths`.

## Scope

**In scope**:

- `tests/parity/**`
- `scripts/**` for fixture-only parity runner scripts
- `package.json`, `bun.lock` for dev/fixture dependencies and scripts
- `vite.config.ts`, `vitest.config.ts`, `oxlint.config.ts`, `oxfmt.config.ts`
  only if required for fixture infrastructure
- `src/registry/parity/**` only for generic snapshot/canonicalization helpers
- `plans/README.md` status row update when done

**Out of scope**:

- Do not implement or edit `base-ui/button` or `shadcn/button`.
- Do not create or modify `registry-src/base-ui/button/**` or
  `registry-src/shadcn/button/**`.
- Do not mark any registry item installable.
- Do not rewrite pinned shadcn examples into local Foldkit examples.
- Do not fetch or update upstream submodules.
- Do not add React, Base UI React, CVA, or icon packages as runtime
  dependencies.

## Steps

### Step 1: Inventory the shadcn origin import graph

Create an artifact under `plans/artifacts/003-shadcn-origin-parity/` listing
the exact shadcn Button origin files this runner must be able to import and
the aliases/packages each one needs.

At minimum include:

- `repos/ui/apps/v4/styles/base-nova/ui/button.tsx`
- `repos/ui/apps/v4/styles/base-nova/ui/spinner.tsx`
- `repos/ui/apps/v4/examples/base/button-default.tsx`
- `repos/ui/apps/v4/examples/base/button-demo.tsx`
- `repos/ui/apps/v4/examples/base/button-render.tsx`
- `repos/ui/apps/v4/examples/base/button-rtl.tsx`

**Verify**:

```bash
find plans/artifacts/003-shadcn-origin-parity -type f | sort
rg -n "@base-ui/react/button|class-variance-authority|lucide-react|@tabler/icons-react|@/styles/base-nova|@/lib/utils|@/components/language-selector" plans/artifacts/003-shadcn-origin-parity
```

### Step 2: Add fixture-only browser runner dependencies

Add the smallest dev dependency set needed to run a browser-backed origin
fixture. Prefer `@playwright/test` with Chromium and Vite if no lighter local
browser runner already exists.

React and React DOM are allowed as dev dependencies for fixture rendering only.
If shadcn examples need icon packages or CVA to import without rewriting, add
them as dev dependencies only.

Do not add `@base-ui/react` as a normal package if its `workspace:*`
dependencies cannot resolve. Prefer Vite aliases into `repos/base-ui` source
and package aliases for the specific Base UI utility modules required by the
pinned source.

**Verify**:

```bash
bun install
rg -n '"react"|"react-dom"|"@playwright/test"|"class-variance-authority"|"lucide-react"|"@tabler/icons-react"' package.json
```

### Step 3: Build a shadcn origin fixture Vite entry

Create fixture-only source under `tests/parity/fixtures/origin/shadcn/`.

The fixture entry should render a selected shadcn Button origin example in a
browser page and expose a snapshot API to the runner. Start with
`button-default` and `button-render`; those cover the component wrapper and the
plain-link class helper without pulling in Button Group.

Add Vite alias configuration for:

- `@/styles/base-nova/ui/button` ->
  `repos/ui/apps/v4/styles/base-nova/ui/button.tsx`
- `@/styles/base-nova/ui/spinner` ->
  `repos/ui/apps/v4/styles/base-nova/ui/spinner.tsx`
- `@/styles/base-nova/ui-rtl/button` ->
  `repos/ui/apps/v4/styles/base-nova/ui/button.tsx`
- `@/styles/base-nova/ui-rtl/spinner` ->
  `repos/ui/apps/v4/styles/base-nova/ui/spinner.tsx`
- `@/lib/utils` -> `repos/ui/apps/v4/lib/utils.ts`
- `@/components/language-selector` -> the pinned file if it imports cleanly,
  otherwise a fixture-only shim that preserves the public `useTranslation`
  contract needed by `button-rtl.tsx`
- `@base-ui/react/button` -> pinned local Base UI Button source or a
  fixture-only package alias that resolves to it
- `@base-ui/utils/*` -> pinned local Base UI utility source as needed

**Verify**:

```bash
bun run parity:origin:shadcn -- --grep button-default
```

Expected output must include the source origin file path and a serialized
snapshot containing at least tag name, attributes, class tokens, text, computed
style summary, and bounding box.

### Step 4: Add snapshot capture and canonicalization checks

Reuse the canonicalization helpers from `src/registry/parity/canonicalize.ts`.
The browser runner should capture enough data for future parity comparisons:

- DOM structure
- attributes
- class tokens
- text
- computed style summary
- colors
- dimensions
- bounding box

Add tests under `tests/parity/` that exercise the shadcn origin runner against
the `button-default` and `button-render` examples.

**Verify**:

```bash
bun run test -- tests/parity
```

### Step 5: Guard source/runtime boundaries

Ensure the new fixture dependencies and aliases are isolated to tests/scripts.
No registry manifest should list React, Base UI React, CVA, or icon packages as
runtime dependencies.

**Verify**:

```bash
bun run registry:check
rg -n "react|react-dom|@base-ui/react|class-variance-authority|lucide-react|@tabler/icons-react" registry-src src/registry
```

The `rg` command may find strings in tests or fixture-only docs only if you
expand the searched paths. It should find no installable runtime imports in
`src/registry` or registry item `installableSourcePaths`.

### Step 6: Final verification

Run:

```bash
bun run parity:origin:shadcn -- --grep button-default
bun run test -- tests/parity
bun run registry:check
bun run typecheck
bun run check
bun run build
git diff --check
```

Update `plans/README.md` status for plan 003 to `DONE` only after every command
passes.

## Test plan

- A test proving the shadcn origin runner renders `button-default` from pinned
  `repos/ui` source and captures a non-empty snapshot.
- A test proving `button-render` exposes the class helper output on a plain
  anchor.
- A guard test or validation assertion proving fixture-only React/CVA/icon
  dependencies are not used by installable registry source.

## Done criteria

ALL must hold:

- [ ] A fixture-only shadcn origin runner exists under `tests/parity/**` and/or
      `scripts/**`.
- [ ] `bun run parity:origin:shadcn -- --grep button-default` exits 0 and
      captures a snapshot from pinned shadcn source.
- [ ] The runner resolves the `@/styles`, `@/lib/utils`,
      `@/components/language-selector`, Base UI React, CVA, and icon imports
      required by direct shadcn Button examples.
- [ ] `bun run test -- tests/parity`, `bun run registry:check`,
      `bun run typecheck`, `bun run check`, `bun run build`, and
      `git diff --check` all exit 0.
- [ ] React, Base UI React, CVA, and icon packages remain fixture-only and do
      not enter installable registry source.
- [ ] No files outside the in-scope list are modified.
- [ ] `plans/README.md` status row is updated.

## STOP conditions

Stop and report back without improvising if:

- A browser binary cannot be installed or launched in this environment.
- Resolving pinned Base UI React source requires rewriting upstream source.
- The only workable path is replacing pinned shadcn examples with local
  hand-authored snapshots.
- The runner requires adding React, Base UI React, CVA, or icon packages as
  runtime dependencies.
- A verification command fails twice after a reasonable fix attempt.

## Maintenance notes

- This plan is infrastructure for plan 002 and future shadcn components.
- Keep the runner generic enough that later shadcn examples can add cases
  without adding a new bundler per component.
- Reviewers should scrutinize alias boundaries and dependency placement first;
  the whole point is to keep origin React code fixture-only.
