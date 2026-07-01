# Plan 089: Inventory docs example cards without live previews

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
> `git diff --stat b7719cd6..HEAD -- scripts src registry/docs registry-src plans/089-inventory-docs-live-preview-gaps.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/068-\*.md
- **Category**: docs
- **Planned at**: commit `b7719cd6`, 2026-07-01

## Why this matters

The docs route renders an example card for every generated docs example, but a
card only shows the actual component preview when `.live-example-preview` is
present. The current tests prove that every `live-ready` example has a renderer,
but they do not identify every example card still marked `static`, so large
parts of the docs can silently degrade to snippet-only cards. This plan creates
a repeatable inventory of every missing preview card and a regression gate that
keeps future components from claiming example completion without a real preview.

## Current state

- `scripts/registry-common.ts` - the registry docs build decides whether an
  example is `live-ready` or `static`.
- `src/live-examples.ts` - the runtime registry maps `componentItemId` plus
  `previewExportName` to a Foldkit-rendered example view.
- `src/main.ts` - the component route renders `.live-example-preview` only when
  `liveExampleViewFor` returns a view.
- `src/data.test.ts` - existing tests check complete docs for at least one live
  example and for missing renderers among examples already marked `live-ready`.

Relevant excerpts:

```ts
// scripts/registry-common.ts:493
const previewStatusForExample = (
  item: RegistryItemManifest,
  exportName: string | undefined,
): ExamplePreviewStatus => {
  if (
    exportName !== undefined &&
    liveReadyExampleExportsByItemId[item.id]?.has(exportName) === true
  ) {
    return 'live-ready'
  }

  return 'static'
}
```

```ts
// src/live-examples.ts:769
export const liveExampleViewFor = <Message>(
  example: ExampleDocsArtifact,
  context: LiveExampleContext<Message>,
): Option.Option<Html> => {
  if (example.previewStatus !== 'live-ready') {
    return Option.none()
  }
```

```ts
// src/main.ts:2200
const liveExamplePreviewView = (example: ExampleDocsArtifact): Html =>
  Option.match(liveExampleViewFor(example, liveExampleContext), {
    onNone: () => h.empty,
    onSome: exampleView =>
      h.div(
        [
          h.Class('live-example-preview'),
          h.AriaLabel(`${example.title} live preview`),
        ],
        [exampleView],
      ),
  })
```

```ts
// src/data.test.ts:89
const missingLiveExampleRenderers = pipe(
  completeArtifacts,
  Array.flatMap(artifact =>
    pipe(
      artifact.examples,
      Array.filter(
        example =>
          example.previewStatus === 'live-ready' &&
          Option.isNone(liveExampleViewFor(example, liveExampleContext)),
      ),
```

Current read-only inventory at plan time:

- Generated docs examples: 414
- Example cards that already have a live preview renderer: 132
- `live-ready` examples missing a runtime renderer: 0
- Example cards missing `.live-example-preview` because they are still
  `static`: 282

Current missing-preview count by component:

| Component                | Missing preview cards |
| ------------------------ | --------------------- |
| `shadcn/dropdown-menu`   | 13                    |
| `shadcn/input-otp`       | 12                    |
| `shadcn/combobox`        | 11                    |
| `shadcn/context-menu`    | 11                    |
| `shadcn/avatar`          | 10                    |
| `shadcn/bubble`          | 10                    |
| `shadcn/checkbox`        | 8                     |
| `shadcn/marker`          | 8                     |
| `shadcn/toggle-group`    | 8                     |
| `shadcn/alert-dialog`    | 7                     |
| `shadcn/attachment`      | 7                     |
| `shadcn/badge`           | 7                     |
| `shadcn/breadcrumb`      | 7                     |
| `shadcn/field`           | 7                     |
| `shadcn/select`          | 7                     |
| `shadcn/skeleton`        | 7                     |
| `shadcn/slider`          | 7                     |
| `shadcn/switch`          | 7                     |
| `shadcn/alert`           | 6                     |
| `shadcn/card`            | 6                     |
| `shadcn/dialog`          | 6                     |
| `shadcn/input`           | 6                     |
| `shadcn/kbd`             | 6                     |
| `shadcn/menubar`         | 6                     |
| `shadcn/tabs`            | 6                     |
| `shadcn/textarea`        | 6                     |
| `shadcn/toggle`          | 6                     |
| `shadcn/accordion`       | 5                     |
| `shadcn/collapsible`     | 5                     |
| `shadcn/native-select`   | 5                     |
| `shadcn/popover`         | 5                     |
| `shadcn/separator`       | 5                     |
| `shadcn/tooltip`         | 5                     |
| `shadcn/aspect-ratio`    | 4                     |
| `shadcn/drawer`          | 4                     |
| `shadcn/progress`        | 4                     |
| `shadcn/sheet`           | 4                     |
| `shadcn/sonner`          | 4                     |
| `shadcn/hover-card`      | 3                     |
| `shadcn/scroll-area`     | 3                     |
| `base-ui/field`          | 2                     |
| `base-ui/fieldset`       | 2                     |
| `base-ui/form`           | 2                     |
| `base-ui/number-field`   | 2                     |
| `base-ui/otp-field`      | 2                     |
| `shadcn/direction`       | 2                     |
| `shadcn/label`           | 2                     |
| `shadcn/navigation-menu` | 2                     |
| `base-ui/avatar`         | 1                     |
| `shadcn/spinner`         | 1                     |

Docs-site constraints from `docs/decisions/0002-foldkit-cn-documentation-site.md`:

- Component pages are generated from registry artifacts plus hand-authored
  sidecar docs.
- Generated `registry/docs/**` artifacts are the stable data boundary between
  the registry and the website.
- shadcn previews render with shadcn/base-nova tokens, but the docs shell stays
  Foldkit-native.

Foldkit conventions to preserve:

- Do not scan raw `registry-src/**` from runtime route code. Runtime UI consumes
  generated docs artifacts.
- Keep state in Foldkit models and messages. For this plan, the new inventory
  logic should be a build/test/tooling concern, not route-level state.
- Use Effect/Foldkit style in application tests; plain Node filesystem APIs are
  acceptable in standalone tooling only when matching existing scripts.

## Commands you will need

| Purpose             | Command                            | Expected on success                                |
| ------------------- | ---------------------------------- | -------------------------------------------------- |
| Registry docs build | `bun run registry:build`           | exits 0 and refreshes generated `registry/docs/**` |
| Registry validation | `bun run registry:check`           | exits 0                                            |
| Unit tests          | `bun run test -- src/data.test.ts` | exits 0                                            |
| Typecheck           | `bun run typecheck`                | exits 0                                            |
| Repo check          | `bun run check`                    | exits 0                                            |

## Scope

**In scope**:

- `scripts/report-docs-live-preview-gaps.ts` - create a repeatable inventory
  command.
- `package.json` - add a script only if the command should be operator-facing.
- `src/data.test.ts` - add or tighten tests that keep the inventory honest.
- `plans/artifacts/089-docs-live-preview-gaps/` - create checked-in inventory
  output with all missing cards.
- `plans/README.md` - update this plan's status row when complete.

**Out of scope**:

- Do not implement all 282 missing previews in this plan.
- Do not change component source under `src/registry/**` except if a tiny test
  fixture is absolutely required; that should be treated as a STOP condition
  unless the reviewer explicitly broadens scope.
- Do not change visual styling for example cards.
- Do not weaken the existing `live-ready` renderer tests.

## Git workflow

- Branch: `codex/089-docs-live-preview-gap-inventory`
- Commit message style: use the repo's conventional pattern, for example
  `docs: inventory missing live example previews`.
- Do not push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add an inventory script

Create `scripts/report-docs-live-preview-gaps.ts`.

The script should:

- Read generated docs artifacts from `registry/docs/**`, excluding
  `registry/docs/index.json`.
- Import the generated docs schema types or reuse the existing docs artifact
  shape if there is an established helper.
- Import `docsData`, `publicComponents`, `liveExampleViewFor`, and a minimal
  `LiveExampleContext` shaped like the existing context in `src/data.test.ts`
  when practical. Prefer calling `liveExampleViewFor` over regex-parsing
  `src/live-examples.ts`.
- Emit one row for every example card where
  `liveExampleViewFor(example, context)` returns `Option.none()`.
- Include these fields in the machine-readable output:
  `routePath`, `itemId`, `exampleId`, `title`, `previewExportName`,
  `previewStatus`, and `reason`.
- Treat `previewStatus === 'static'` as reason `static-status`.
- Treat `previewStatus === 'live-ready'` plus no renderer as reason
  `missing-live-renderer`.

Also emit a short human-readable summary:

- total example cards
- cards with `.live-example-preview`
- cards missing `.live-example-preview`
- missing count by component
- missing count by reason

Use `src/data.test.ts` as the pattern for the mock `LiveExampleContext`.

**Verify**: `bun run scripts/report-docs-live-preview-gaps.ts` exits 0 and
prints a summary. At the current plan baseline, expect 414 total examples, 132
with previews, 282 missing previews, and 0 `missing-live-renderer` rows.

### Step 2: Check in the full inventory artifact

Create `plans/artifacts/089-docs-live-preview-gaps/`.

Write:

- `missing-live-preview-cards.json` with the complete row list from the script.
- `README.md` with the summary, the command used to generate it, and the by
  component table.

The artifact must list all missing cards, not just the component summary. This
is the handoff backlog for future component/example plans.

**Verify**:
`node --input-type=module -e "const rows = JSON.parse(await import('node:fs').then(fs => fs.readFileSync('plans/artifacts/089-docs-live-preview-gaps/missing-live-preview-cards.json', 'utf8'))); if (!Array.isArray(rows) || rows.length === 0) throw new Error('missing rows'); console.log(rows.length)"`
prints the row count and exits 0.

### Step 3: Add a regression test for the inventory contract

Update `src/data.test.ts` so the current `live-ready` renderer guard remains,
and add a separate test that computes the full preview gap inventory.

The new test should assert:

- every row with reason `missing-live-renderer` is forbidden, because it means
  registry docs promised a live preview that runtime cannot render.
- every row with reason `static-status` is allowed only if it is present in the
  checked-in inventory artifact.
- the checked-in inventory artifact has no stale rows after `registry:build`.

This preserves the current reality while making missing previews explicit. When
future executor plans wire a component's examples into `src/live-examples.ts`
and `scripts/registry-common.ts`, they must update the artifact by removing the
now-live rows.

**Verify**: `bun run test -- src/data.test.ts` exits 0.

### Step 4: Add an operator-facing script if useful

If the script from Step 1 is stable, add a `package.json` script:

```json
"docs:live-preview-gaps": "bun run scripts/report-docs-live-preview-gaps.ts"
```

Skip this step if there is already a more appropriate registry/docs reporting
script name. Do not rename existing scripts.

**Verify**: `bun run docs:live-preview-gaps` exits 0 and prints the same summary
as Step 1.

### Step 5: Run final gates and update the plan index

Run:

1. `bun run registry:build`
2. `bun run registry:check`
3. `bun run test -- src/data.test.ts`
4. `bun run typecheck`
5. `bun run check`

Update this plan's row in `plans/README.md` from `TODO` to `DONE` only after
all final gates pass.

**Verify**: `git diff --stat` shows only in-scope files.

## Test plan

- Add a data-level test in `src/data.test.ts` that proves no `live-ready`
  example is missing a renderer.
- Add a data-level test that proves every snippet-only example card is present
  in `plans/artifacts/089-docs-live-preview-gaps/missing-live-preview-cards.json`.
- Keep the test independent of browser layout; browser verification belongs to
  the later plans that actually wire missing previews.

## Done criteria

- [ ] `bun run scripts/report-docs-live-preview-gaps.ts` exits 0.
- [ ] `plans/artifacts/089-docs-live-preview-gaps/missing-live-preview-cards.json`
      contains every generated docs example card without `.live-example-preview`.
- [ ] `plans/artifacts/089-docs-live-preview-gaps/README.md` summarizes the
      current gap by reason and component.
- [ ] `bun run test -- src/data.test.ts` exits 0 and includes the new inventory
      contract.
- [ ] `bun run registry:build`, `bun run registry:check`, `bun run typecheck`,
      and `bun run check` exit 0.
- [ ] No files outside the in-scope list are modified.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back if:

- The plan-time current-state excerpts no longer match the source files.
- `liveExampleViewFor` cannot be imported into the reporting script without
  causing runtime side effects; do not duplicate preview registry logic unless
  the reviewer explicitly approves that fallback.
- The inventory finds any `missing-live-renderer` rows. That means generated
  docs claim `live-ready` but runtime cannot render the preview, which is a
  higher-severity bug than this inventory task.
- The fix appears to require implementing component examples, changing
  registry component source, or changing example-card CSS.
- A final gate fails twice after a reasonable fix attempt.

## Maintenance notes

This inventory is intentionally a backlog, not a fix for the missing previews.
Future component/example plans should remove rows from the artifact as they
wire examples into `scripts/registry-common.ts` and `src/live-examples.ts`.
Reviewers should scrutinize any future plan that marks examples complete while
leaving generated cards without `.live-example-preview`.
