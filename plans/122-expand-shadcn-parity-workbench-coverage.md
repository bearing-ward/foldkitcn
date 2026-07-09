# Plan 122: Expand shadcn parity workbench coverage

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the next
> step. If anything in the "STOP conditions" section occurs, stop and report; do
> not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
>
> ```bash
> git diff --stat a46f944d..HEAD -- tests/parity scripts/parity-workbench.ts src/registry/parity docs/component-conversion-checklist.md plans/README.md
> bun run parity:workbench -- --item shadcn/tabs --case tabs-demo --dry-run
> bun run parity:workbench -- --item shadcn/empty --case empty-demo --dry-run
> ```
>
> If `shadcn/empty/empty-demo` already resolves, inspect the landed workbench
> registry and either narrow this plan to missing-surface guardrails or mark it
> `REJECTED (fixed independently)`.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/120-audit-complete-shadcn-ui-ux-parity.md
- **Category**: tests, tooling
- **Planned at**: commit `a46f944d`, 2026-07-08

## Why this matters

Plan 120 found that the QA harness is useful but still too narrow for follow-up
cleanup. Broad shadcn parity dry runs cover many ready components, but the
focused workbench can only resolve `shadcn/tabs/tabs-demo`. The next useful
step is to prove the workbench is component-extensible with a second ready
component, then add guardrails so missing surfaces like chart and toast are
handled as explicit product/architecture gaps rather than silent harness holes.

This plan addresses the P3 harness finding from Plan 120. It intentionally does
not change the docs shell: Plan 120's docs-shell P3 item is a scope guard backed
by ADR 0002, not an implementation defect.

## Current State

Plan 120 evidence:

- `plans/artifacts/120-shadcn-ui-ux-parity-audit/punch-list.md:65-76` reports
  the P3 harness gap.
- `plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/parity-workbench-tabs-demo-dry-run.txt`
  shows the tabs workbench case resolves.
- `plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/parity-workbench-empty-demo-dry-run.txt`
  fails with `Unknown workbench case: shadcn/empty/empty-demo`.
- `plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/parity-check-shadcn-chart-dry-run.txt`
  and `parity-check-shadcn-toast-dry-run.txt` both report no parity slots.

Implementation evidence:

- `tests/parity/slots.ts:527-540` already marks `shadcn/empty` ready in the
  broad parity slot registry.
- `tests/parity/slots.ts:1491-1507` marks `shadcn/tabs` ready with dedicated
  fixture entrypoints and keyboard behavior comparisons.
- `tests/parity/fixtures/foldkit/shadcn/cases.ts:787-794` maps
  `empty-demo` and sibling Empty cases to Foldkit examples.
- `tests/parity/fixtures/foldkit/shadcn/cases.ts:867` maps `empty-*` cases to
  `src/registry/shadcn/empty/examples.ts`.
- `tests/parity/fixtures/origin/shadcn/case-metadata.ts:970-973` maps
  `empty-demo` to `repos/ui/apps/v4/examples/base/empty-demo.tsx`.
- `tests/parity/workbench-cases.ts:14-17` stores tabs-specific fixture state.
- `tests/parity/workbench-cases.ts:56-133` derives only the tabs neutral
  fixture.
- `tests/parity/workbench-cases.ts:186-218` exports only
  `shadcnTabsWorkbenchCases`, resolves only `shadcn/tabs/tabs-demo`, and loads
  only the tabs fixture.
- `tests/parity/workbench.test.ts:27-43` asserts exactly one workbench case and
  only tests tabs fixture loading.
- `scripts/parity-workbench.ts:24-28` imports the tabs loader directly.
- `scripts/parity-workbench.ts:925-940` always harvests the tabs fixture when
  running a real workbench capture, regardless of the requested item/case.

## Scope

**In scope**:

- Add `shadcn/empty/empty-demo` as the first non-tabs workbench case.
- Generalize workbench fixture loading so the CLI asks the registry for the
  requested item/case instead of hardcoding tabs.
- Add tests proving both tabs and empty workbench cases validate, resolve, and
  load neutral fixture data.
- Add missing-surface guardrails for chart and toast that preserve their current
  product/architecture decisions without pretending parity slots exist.
- Preserve the broad parity slot model for ready components.

**Out of scope**:

- Do not implement `shadcn/chart` or `shadcn/toast` in this plan.
- Do not add fake chart/toast parity slots for missing local surfaces.
- Do not widen to every shadcn component. One second workbench case plus a
  reusable loader path is the intended tracer bullet.
- Do not revisit docs-shell visual differences; ADR 0002 keeps those out of
  component parity unless shell chrome blocks component inspection.

## Commands You Will Need

| Purpose                    | Command                                                                       | Expected on success                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Check local drift          | `git status --short`                                                          | Existing unrelated drift may be present; this plan should touch only parity/workbench tooling, fixtures/tests, and the Plan 122 row |
| Confirm existing tabs case | `bun run parity:workbench -- --item shadcn/tabs --case tabs-demo --dry-run`   | Exits 0 before and after changes                                                                                                    |
| Confirm existing empty gap | `bun run parity:workbench -- --item shadcn/empty --case empty-demo --dry-run` | Fails before changes with `Unknown workbench case`; exits 0 after changes                                                           |
| Broad empty slot dry run   | `bun run parity:check -- --grep shadcn/empty --dry-run`                       | Exits 0 and shows the ready empty slot                                                                                              |
| Missing chart slot guard   | `bun run parity:check -- --grep shadcn/chart --dry-run`                       | Still reports no slot unless chart has landed separately                                                                            |
| Missing toast slot guard   | `bun run parity:check -- --grep shadcn/toast --dry-run`                       | Still reports no slot unless toast has landed separately                                                                            |
| Focused unit tests         | `bunx vitest run tests/parity/workbench.test.ts`                              | Exits 0                                                                                                                             |
| Full tests                 | `bun run test`                                                                | Exits 0                                                                                                                             |
| Typecheck                  | `bun run typecheck`                                                           | Exits 0                                                                                                                             |
| Lint/check                 | `bun run check`                                                               | Exits 0                                                                                                                             |

## Steps

1. Reproduce the current harness shape.
   - Run the drift commands.
   - Confirm tabs resolves and empty fails before edits.
   - Run `bun run parity:check -- --grep shadcn/empty --dry-run` to confirm
     Empty is already a ready broad parity slot.

2. Add Empty fixture entrypoints if the workbench needs dedicated wrappers.
   - Follow the shape of `tests/parity/fixtures/origin/shadcn/tabs.fixture.ts`
     and `tests/parity/fixtures/foldkit/shadcn/tabs.fixture.ts`.
   - Prefer reusing the existing aggregate case metadata and case maps instead
     of duplicating source evidence.
   - If dedicated wrappers are unnecessary, document that in the execution
     notes and load the `empty-demo` snapshot through the existing aggregate
     fixture infrastructure.

3. Add `shadcn/empty/empty-demo` to the workbench case registry.
   - Define an Empty workbench case in `tests/parity/workbench-cases.ts`.
   - Use `originSourcePath:
'repos/ui/apps/v4/examples/base/empty-demo.tsx'`.
   - Use Foldkit owner hints for `src/registry/shadcn/empty/index.ts` if it
     exists and `src/registry/shadcn/empty/examples.ts`.
   - Use report paths under `.parity-workbench/shadcn-empty/empty-demo`.
   - Keep capture zones simple: root capture only, no portal/layer selectors.
   - Do not add interaction recipes unless the rendered Empty example has a
     meaningful focus or click interaction to verify.

4. Generalize fixture harvesting.
   - Replace tabs-only exports with a registry-backed shape that can load the
     neutral fixture for any declared workbench case.
   - Keep `loadShadcnTabsWorkbenchFixture` as a compatibility export only if
     existing tests or callers still import it.
   - Add a matching `loadShadcnEmptyWorkbenchFixture` or a generic
     `loadWorkbenchFixture` helper.
   - Update `scripts/parity-workbench.ts` so the real run path uses
     `workbenchFixtureFor(input.itemId, input.caseId)` instead of
     `loadShadcnTabsWorkbenchFixture()`.
   - Preserve the `--write-fixture` behavior for tabs and make it work for
     Empty.

5. Add missing-surface guardrails.
   - Do not add chart/toast slots.
   - Add or extend tests that assert `resolveWorkbenchCase('shadcn/chart', ...)`
     and `resolveWorkbenchCase('shadcn/toast', ...)` fail with an explicit
     "missing parity slot" or "unknown workbench case" message.
   - If the current error is too generic, improve the error text in the
     workbench resolver so future agents can distinguish a missing component
     surface from an unregistered case for an otherwise ready component.
   - Keep any chart/toast product-direction planning in a separate future plan.

6. Update tests.
   - In `tests/parity/workbench.test.ts`, expect the declared registry to
     include both tabs and empty.
   - Add resolve tests for `shadcn/empty/empty-demo`.
   - Add fixture-loading tests for Empty.
   - Keep the existing tabs fixture tests green.
   - Add explicit negative tests for chart/toast guardrails.

7. Verify.
   - Run the focused unit test command.
   - Run tabs and empty workbench dry runs.
   - Run the broad empty parity dry run.
   - Run chart/toast dry runs and confirm their missing-slot behavior remains
     explicit.
   - Run `bun run test`, `bun run typecheck`, and `bun run check`.

8. Update plan status.
   - Mark Plan 122 `DONE` in `plans/README.md` only after the focused and full
     verification commands pass.
   - If unrelated pre-existing failures block the full suite, record the exact
     failing command and the focused passing checks in the status note.

## STOP Conditions

- Stop if adding Empty requires changing the core parity report schema in
  `src/registry/parity/**`; report the schema limitation instead of widening the
  plan.
- Stop if chart or toast landed independently while this plan is being executed;
  re-run the Plan 120 inventory and split any implementation work into its own
  plan.
- Stop if the workbench can only support tabs because of hardcoded behavior
  comparisons that cannot be generalized safely in one medium plan.
- Stop if generated fixture output becomes nondeterministic across consecutive
  runs.

## Acceptance Criteria

- `bun run parity:workbench -- --item shadcn/empty --case empty-demo --dry-run`
  exits 0 and prints Empty report paths.
- `scripts/parity-workbench.ts` no longer harvests tabs fixture data for every
  requested item/case.
- `tests/parity/workbench.test.ts` proves tabs and empty both validate, resolve,
  and load neutral fixture data.
- Chart and toast remain explicit missing-surface cases until separate product
  or architecture plans decide their local surfaces.
- Focused unit tests, full tests, typecheck, and check pass or unrelated
  pre-existing failures are precisely documented.
