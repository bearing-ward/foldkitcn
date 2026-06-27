<!-- prettier-ignore-start -->
<!-- Generated improve plan: preserve command tables and source excerpts literally. -->

# Plan 060: Record documentation-site and Effect-native tooling decisions

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat f3617d28..HEAD -- AGENTS.md docs/decisions plans/README.md package.json repos/foldkit/packages/website/src/styles.css repos/effect-smol/migration/v3-to-v4.md repos/effect-smol/LLMS.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `f3617d28`, 2026-06-27

## Why this matters

The component documentation site is a product direction, not just another page
inside the starter app. Before implementation starts, the repo needs durable
decisions that future agents can read without this conversation: Foldkit CN
should take visual identity from `foldkit.dev`, component documentation
affordances from `ui.shadcn.com`, and registry data from this repo. The same
planning pass also settled a repo-wide tooling rule: all new build and installer
CLIs should be Effect-native, use `effect/unstable/cli`, and derive boundary
types from Effect Schema.

## Current state

- `AGENTS.md` contains Foldkit app conventions, but it does not yet record the
  documentation-site direction or the "always Effect" tooling rule.
- `docs/decisions/0001-foldkit-registry-architecture.md` already establishes
  the registry vocabulary and explicitly leaves the final documentation site out
  of scope for plan 001.
- `plans/README.md` currently ends at component implementation plan 059 and
  does not list documentation-site plans.
- `repos/foldkit/packages/website/src/styles.css` is the local reference for
  Foldkit's visual identity and token palette.
- `repos/effect-smol/migration/v3-to-v4.md` records the current Effect CLI
  module migration path from `@effect/cli/*` to `effect/unstable/cli/*`.

Relevant excerpts:

```md
docs/decisions/0001-foldkit-registry-architecture.md:9
This repository is becoming a Foldkit-native registry for high-fidelity ports of Base UI and shadcn components, plus docs, examples, themes, blocks, charts, and later custom/private registries.

docs/decisions/0001-foldkit-registry-architecture.md:17
All boundary data is schema-backed with Effect Schema.

docs/decisions/0001-foldkit-registry-architecture.md:69
This decision does not rewrite the starter app into the final registry documentation site.

AGENTS.md:25
- Foldkit is tightly coupled to the Effect ecosystem. Do not suggest solutions outside of Effect-TS.

repos/foldkit/packages/website/src/styles.css:35-58
@theme {
  --color-cream: #f8f7fb;
  --color-gray-50: #f5f4f8;
  ...
  --color-accent-500: #82b536;
  --font-sans: 'ABC Favorit', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

repos/effect-smol/migration/v3-to-v4.md:38-43
@effect/cli/Args -> effect/unstable/cli/Argument (barrel: effect/unstable/cli)
@effect/cli/Command -> effect/unstable/cli/Command (barrel: effect/unstable/cli)
@effect/cli/Options -> effect/unstable/cli/Flag (barrel: effect/unstable/cli)
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| ADR presence | `test -f docs/decisions/0002-foldkit-cn-documentation-site.md && test -f docs/decisions/0003-effect-native-tooling.md` | exit 0 |
| Decision content | `rg -n "foldkit.dev|ui.shadcn.com|effect/unstable/cli|Effect Schema|docsStatus|registry/docs" AGENTS.md docs/decisions/0002-foldkit-cn-documentation-site.md docs/decisions/0003-effect-native-tooling.md` | exit 0 and all key phrases present |
| Typecheck | `bun run typecheck` | exit 0 |
| Lint/check | `bun run check` | exit 0 |
| Whitespace | `git diff --check -- AGENTS.md docs/decisions plans` | exit 0 |

## Scope

**In scope**:

- `AGENTS.md`
- `docs/decisions/0002-foldkit-cn-documentation-site.md` (create)
- `docs/decisions/0003-effect-native-tooling.md` (create)
- `plans/README.md` status row update

**Out of scope**:

- Do not implement the docs site.
- Do not change registry schemas, scripts, or component source.
- Do not implement the installer CLI.
- Do not modify vendored references under `repos/foldkit/`, `repos/ui/`,
  `repos/base-ui/`, or `repos/effect-smol/`.

## Git workflow

- Branch: `codex/060-docs-tooling-decisions`
- Commit after the ADR and AGENTS changes pass verification.
- Do not push or open a PR unless the operator explicitly instructs it.
- Preserve pre-existing uncommitted changes. This repo may already contain
  generated plan files after plan 059; do not rewrite unrelated plan content.

## Steps

### Step 1: Add the documentation-site ADR

Create `docs/decisions/0002-foldkit-cn-documentation-site.md`.

It must record these decisions:

- The docs site is a Foldkit-native documentation website for Foldkit CN's
  registry components, not a shadcn.com clone.
- Visual identity and tone come from `https://foldkit.dev/` and the local
  Foldkit website source under `repos/foldkit/packages/website/`.
- Component documentation affordances are inspired by `https://ui.shadcn.com/`:
  component index, sidebar taxonomy, search, install panel, copy buttons,
  usage, examples, API, quality/provenance, source links, and table of contents.
- Public component routes are namespace-explicit, such as
  `/components/base-ui/button` and `/components/shadcn/button`.
- Component pages are generated from registry artifacts plus hand-authored
  sidecar docs; `registry/index.json` stays the catalog and separate generated
  docs artifacts live under `registry/docs/**`.
- Public nav shows installable and preview components; planned/private/blocked
  rows belong on Roadmap or Registry pages.
- Docs shell and component preview styling are separate. The shell follows the
  Foldkit identity; shadcn previews render with shadcn/base-nova tokens.
- Site-level visual parity with shadcn.com is not a goal. Component parity
  remains scoped to origin component fixtures.

**Verify**: `rg -n "foldkit.dev|ui.shadcn.com|/components/shadcn/button|registry/docs|Roadmap|visual parity" docs/decisions/0002-foldkit-cn-documentation-site.md` -> exit 0.

### Step 2: Add the Effect-native tooling ADR

Create `docs/decisions/0003-effect-native-tooling.md`.

It must record these decisions:

- New registry, docs-generation, and installer CLIs are Effect programs.
- CLI argument, flag, and command modeling uses `effect/unstable/cli`.
- Boundary data uses Effect Schema. Runtime types/interfaces derive from
  Schema declarations instead of parallel hand-maintained TypeScript interfaces.
- Existing scripts do not need a one-time rewrite, but every new script and
  every touched script should move toward this standard.
- The future `foldkitcn add` installer must follow this rule, including config
  decoding, item id decoding, filesystem plan decoding, generated manifest
  decoding, and write-plan verification.

**Verify**: `rg -n "effect/unstable/cli|Effect Schema|installer|derive|new script|touched script" docs/decisions/0003-effect-native-tooling.md` -> exit 0.

### Step 3: Update AGENTS.md

Add a short "Documentation Site" or "Tooling" convention section to `AGENTS.md`
near the existing project conventions. Keep it operational, not long-form.

It must tell future agents:

- Read `docs/decisions/0002-foldkit-cn-documentation-site.md` before docs-site
  work.
- Read `docs/decisions/0003-effect-native-tooling.md` before new CLI or
  build-tooling work.
- New CLIs/build scripts use Effect, `effect/unstable/cli`, and Schema-derived
  boundary types.
- Docs website design uses Foldkit identity plus shadcn-like component docs
  affordances.

**Verify**: `rg -n "0002-foldkit-cn-documentation-site|0003-effect-native-tooling|effect/unstable/cli|Schema-derived|shadcn" AGENTS.md` -> exit 0.

### Step 4: Update the plan index

Mark plan 060 as DONE in `plans/README.md` when this plan is complete. If a
reviewer told you they maintain the index, skip this step and report that.

**Verify**: `rg -n "\\| 060 \\| Record documentation-site and Effect-native tooling decisions \\| P1 \\| S \\| - \\| DONE \\|" plans/README.md` -> exit 0.

## Test plan

- No new product tests are required because this plan records architecture
  decisions and agent guidance only.
- Run `bun run typecheck` and `bun run check` to catch accidental formatting or
  repository-wide markdown/lint effects.

## Done criteria

- [ ] `docs/decisions/0002-foldkit-cn-documentation-site.md` exists and records
  the docs-site product/data/brand decisions.
- [ ] `docs/decisions/0003-effect-native-tooling.md` exists and records the
  Effect-native tooling rule.
- [ ] `AGENTS.md` points future agents at both ADRs and the Effect tooling rule.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run check` exits 0.
- [ ] `git diff --check -- AGENTS.md docs/decisions plans` exits 0.
- [ ] No files outside the in-scope list are modified.

## STOP conditions

Stop and report back if:

- Existing ADR 0001 has changed so the excerpts above no longer match.
- The operator wants to edit source code or scripts as part of this plan.
- `bun run check` demands unrelated formatting in generated plan files or
  component code outside this plan's scope.

## Maintenance notes

Future documentation-site plans depend on these ADRs. Reviewers should check
that later implementation plans refer to ADR 0002 for product shape and ADR
0003 for any script or installer work.

<!-- prettier-ignore-end -->
