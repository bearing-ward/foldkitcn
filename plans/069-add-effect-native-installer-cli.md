<!-- prettier-ignore-start -->
<!-- Generated improve plan: preserve command tables and source excerpts literally. -->

# Plan 069: Add the Effect-native foldkitcn installer CLI

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat f3617d28..HEAD -- package.json src/registry/schema.ts scripts registry registry-src docs/decisions/0003-effect-native-tooling.md repos/effect-smol/migration/v3-to-v4.md repos/effect-smol/LLMS.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/064-add-install-panel-and-copy-affordances.md
- **Category**: dx
- **Planned at**: commit `f3617d28`, 2026-06-27

## Why this matters

The docs site can display `bunx foldkitcn add shadcn/button` before the command
exists, but the project eventually needs the installer to make that promise
true. This plan implements the installer as its own product surface, using the
repo-wide rule: Effect beta/Smol style, `effect/unstable/cli`, and all boundary
types derived from Effect Schema. It is deliberately separate from docs-site
work because file mutation, conflict handling, config detection, and dry-run
plans deserve their own verification.

## Current state

- `package.json` has registry and origin scripts but no `foldkitcn add` binary.
- `registry/index.json` contains item manifests and generated artifacts.
- Docs plan 064 displays a command contract but does not implement it.
- Effect Smol migration docs point CLI work at `effect/unstable/cli`.

Relevant excerpts:

```json
package.json:16-24
"registry:check": "bun run scripts/check-registry.ts",
"registry:build": "bun run scripts/build-registry.ts",
"origin:resolve": "bun run scripts/resolve-origin-url.ts",
"origin:components:status": "bun run scripts/registry-component-progress.ts status",
"origin:components:next": "bun run scripts/registry-component-progress.ts next",
"origin:components:write": "bun run scripts/registry-component-progress.ts write",
"origin:components:check": "bun run scripts/registry-component-progress.ts check",
"parity:check": "bun run scripts/parity-dry-run.ts",

repos/effect-smol/migration/v3-to-v4.md:38-43
@effect/cli/Args -> effect/unstable/cli/Argument (barrel: effect/unstable/cli)
@effect/cli/Command -> effect/unstable/cli/Command (barrel: effect/unstable/cli)
@effect/cli/Options -> effect/unstable/cli/Flag (barrel: effect/unstable/cli)

registry-src/shadcn/button/item.json:9-12
"installableSourcePaths": [
  "src/registry/shadcn/button/index.ts",
  "src/registry/shadcn/button/examples.ts"
]
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| CLI unit tests | `bun run test -- scripts/installer` or the installer test path chosen in this plan | all pass |
| Registry build | `bun run registry:build` | exit 0 |
| Installer dry run | `bun run foldkitcn -- add shadcn/button --dry-run --cwd <fixture-project>` or chosen local script | exit 0; prints planned writes, writes nothing |
| Installer fixture write | `bun run foldkitcn -- add shadcn/button --cwd <fixture-project>` | exit 0; writes namespaced files in fixture only |
| Typecheck | `bun run typecheck` | exit 0 |
| Full tests | `bun run test` | exit 0 |
| Lint/check | `bun run check` | exit 0 |
| Whitespace | `git diff --check -- package.json scripts src tests registry plans` | exit 0 |

## Suggested executor toolkit

- Read `docs/decisions/0003-effect-native-tooling.md` before writing CLI code.
- Use `repos/effect-smol/LLMS.md` and
  `repos/effect-smol/ai-docs/src/70_cli/` if present for current
  `effect/unstable/cli` examples.
- Reuse registry schemas from `src/registry/schema.ts`; do not create parallel
  installer interfaces.

## Scope

**In scope**:

- `package.json`
- new installer CLI code under `scripts/installer/**`, `src/installer/**`, or a
  similarly clear local path
- installer tests and fixture projects under `tests/**` or `scripts/**`
- registry schema additions for installer config/write plans if required
- generated registry artifacts only if needed for installer metadata
- `plans/README.md` status row update

**Out of scope**:

- Do not alter docs-site rendering.
- Do not publish a package.
- Do not install into real user projects during tests. Use fixtures only.
- Do not support every package manager. Start with the Bun command contract.
- Do not flatten namespaces into `src/components/ui`.

## Git workflow

- Branch: `codex/069-effect-installer`
- Commit per logical unit: schema/config, CLI parser, dry-run planner, fixture
  writes/tests.
- Do not push or open a PR unless the operator explicitly instructs it.

## Steps

### Step 1: Define Schema-backed installer data

Add Schema declarations for installer boundaries. Include at least:

- `InstallerConfig`
- `InstallerItemId`
- `InstallTargetPath`
- `InstallerWritePlan`
- `InstallerWriteOperation`
- `InstallerConflictPolicy`
- installer error types with Schema-backed tagged errors if the local Effect
  version supports them.

Required default paths:

```text
src/components/foldkitcn/shadcn/button.ts
src/components/foldkitcn/base-ui/button.ts
src/components/foldkitcn/utils/cn.ts
```

Displayed alias import remains:

```ts
import { Button } from '@/components/foldkitcn/shadcn/button'
```

**Verify**: targeted schema tests decode valid config/write plans and reject
invalid item ids or paths.

### Step 2: Implement Effect CLI parser

Create a CLI with `effect/unstable/cli` for:

```bash
foldkitcn add <item-id> [--cwd <path>] [--dry-run] [--force]
```

If `bin` wiring is premature, expose a local script command first, but keep the
parser and program shaped as the eventual binary.

Do not use ad hoc `process.argv` parsing except at the tiny runtime entry point
required to hand control to Effect CLI.

**Verify**: CLI parser tests cover item id, `--cwd`, `--dry-run`, unknown flags,
and help output.

### Step 3: Build dry-run planning

Implement dry-run planning from `registry/index.json`:

- decode the registry index through Schema.
- resolve requested item and registry dependencies.
- map installable source paths to namespaced target paths.
- include `utils/cn` and Base UI dependencies where required.
- detect conflicts before writing.
- print a human-readable summary and expose a Schema-backed write-plan value in
  tests.

**Verify**: dry-run fixture test for `shadcn/button` lists writes for
`shadcn/button`, `base-ui/button`, and `utils/cn` without writing files.

### Step 4: Implement fixture writes

Write files only inside a fixture project in tests. Preserve existing files
unless `--force` is passed. Use Effect filesystem/platform APIs available in the
repo's Effect version.

**Verify**: fixture write test installs `shadcn/button`, creates expected files,
and refuses to overwrite a changed file without `--force`.

### Step 5: Add command wiring

Add package script and/or `bin` field if appropriate. The docs command should be
able to become:

```bash
bunx foldkitcn add shadcn/button
```

For local verification, a script such as `bun run foldkitcn -- add shadcn/button --dry-run --cwd tests/fixtures/installer/basic` is acceptable if publishing/bin wiring is deferred.

**Verify**: run the local script in dry-run mode and fixture write mode.

### Step 6: Update the plan index

Mark plan 069 as DONE in `plans/README.md` when complete, unless a reviewer owns
the index.

**Verify**: `rg -n "\\| 069 \\| Add the Effect-native foldkitcn installer CLI \\| P2 \\| L \\| 064 \\| DONE \\|" plans/README.md` -> exit 0.

## Test plan

- Schema tests for config, item ids, target paths, write plans, conflicts.
- CLI parser tests for add command flags and errors.
- Dry-run tests with fixture project.
- Write tests with fixture project, including conflict refusal and force.
- Integration smoke for `shadcn/button` dependency closure.

## Done criteria

- [ ] CLI parser uses `effect/unstable/cli`.
- [ ] Installer data boundaries are Schema-backed and types derive from Schema.
- [ ] `add shadcn/button --dry-run` prints a write plan and writes nothing.
- [ ] Fixture install writes namespaced files for `shadcn/button` and dependencies.
- [ ] Conflict handling is tested.
- [ ] `bun run registry:build`, installer tests, `bun run test`,
  `bun run typecheck`, `bun run check`, and `git diff --check -- package.json scripts src tests registry plans` exit 0.

## STOP conditions

Stop and report back if:

- The installed Effect version does not expose the expected `effect/unstable/cli`
  API and a migration decision is needed.
- Implementing writes safely requires a broader package-publishing or config
  design first.
- Dependency closure cannot be derived from the registry index.
- Tests would need to write outside fixture directories.

## Maintenance notes

This is a CLI/product-surface plan, not a docs-site plan. Reviewers should focus
on safety: Schema boundary decoding, conflict handling, dry-run accuracy,
namespaced target paths, and no writes outside the requested project root.

<!-- prettier-ignore-end -->
