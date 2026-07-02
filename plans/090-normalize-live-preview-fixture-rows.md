# 090 - Normalize Live Preview Fixture Rows

## Summary

Resolve the inventory rows in `plans/artifacts/089-docs-live-preview-gaps/missing-live-preview-cards.json` where `previewExportName` is `null`.

These rows are the first blocker in the live-preview backlog: the docs generator cannot mark them `live-ready`, and `src/live-examples.ts` cannot register a renderer, until each card has a real exported example name or is removed from the public docs examples list.

## Current State

- Planned from commit `88e28f16`.
- The gap inventory contains 258 rows.
- 17 rows have `previewExportName: null`.
- `scripts/registry-common.ts` derives `previewExportName` from the example source path and only marks examples `live-ready` when the export name is present in `liveReadyExampleExportsByItemId`.
- `src/live-examples.ts` only renders previews when generated docs data says `previewStatus === 'live-ready'`.
- `src/data.test.ts` checks that live-ready examples have a renderer and that the checked-in gap inventory matches the report.

## Target Rows

| Item                   | Example id                             | Example title              |
| ---------------------- | -------------------------------------- | -------------------------- |
| `base-ui/avatar`       | `base-ui/avatar-hero`                  | `AvatarHero`               |
| `base-ui/field`        | `base-ui/field-foldkit-fixture`        | `FieldFoldkitFixture`      |
| `base-ui/field`        | `base-ui/field-origin-fixture`         | `FieldOriginFixture`       |
| `base-ui/fieldset`     | `base-ui/fieldset-foldkit-fixture`     | `FieldsetFoldkitFixture`   |
| `base-ui/fieldset`     | `base-ui/fieldset-origin-fixture`      | `FieldsetOriginFixture`    |
| `base-ui/form`         | `base-ui/form-foldkit-fixture`         | `FormFoldkitFixture`       |
| `base-ui/form`         | `base-ui/form-origin-fixture`          | `FormOriginFixture`        |
| `base-ui/number-field` | `base-ui/number-field-foldkit-fixture` | `NumberFieldFixture`       |
| `base-ui/number-field` | `base-ui/number-field-origin-fixture`  | `NumberFieldOriginFixture` |
| `base-ui/otp-field`    | `base-ui/otp-field-foldkit-fixture`    | `OTPFieldFoldkitFixture`   |
| `base-ui/otp-field`    | `base-ui/otp-field-origin-fixture`     | `OTPFieldOriginFixture`    |
| `shadcn/field`         | `shadcn/field-foldkit-fixture`         | `FieldFoldkitFixture`      |
| `shadcn/field`         | `shadcn/field-origin-fixture`          | `FieldOriginFixture`       |
| `shadcn/input-otp`     | `shadcn/input-otp-foldkit-fixture`     | `InputOTPFoldkitFixture`   |
| `shadcn/input-otp`     | `shadcn/input-otp-origin-fixture`      | `InputOTPOriginFixture`    |
| `shadcn/kbd`           | `shadcn/kbd-group`                     | `KbdGroup`                 |
| `shadcn/spinner`       | `shadcn/spinner-empty`                 | `SpinnerEmpty`             |

## Scope

In scope:

- Inspect the registry source manifests and example source files for the target rows.
- For examples that are meant to be public docs examples, add or repair a named exported Foldkit `Html` example function and ensure the manifest `sourcePath` points at that export.
- For parity-only fixtures that should not be public docs examples, remove them from the public docs example list while preserving any origin/parity evidence that still needs them.
- Rebuild generated registry/docs artifacts.
- Refresh `plans/artifacts/089-docs-live-preview-gaps/missing-live-preview-cards.json`.

Out of scope:

- Implementing all live preview registrations for the remaining 241 rows.
- Rewriting component APIs or replacing registry architecture.
- Adding React/shadcn runtime dependencies.

## Implementation Notes

1. Run a drift check before editing:

   ```bash
   git status --short
   git rev-parse --short HEAD
   node -e "const rows=require('./plans/artifacts/089-docs-live-preview-gaps/missing-live-preview-cards.json'); console.table(rows.filter((row)=>row.previewExportName===null).map((row)=>({item:row.itemId,example:row.exampleId,title:row.title})))"
   ```

2. Inspect each target component's registry source:

   ```bash
   rg -n "foldkit-fixture|origin-fixture|AvatarHero|KbdGroup|SpinnerEmpty" registry-src src
   ```

3. Decide for each row whether it is a public example or a parity fixture:

   - Public example: make the source export discoverable by the docs generator.
   - Parity fixture: keep it available to parity tooling if needed, but stop exposing it as a public docs card.

4. Rebuild and refresh the inventory:

   ```bash
   bun run registry:build
   bun run scripts/report-docs-live-preview-gaps.ts --write
   ```

5. Verify that the null-export blocker is gone:

   ```bash
   node -e "const rows=require('./plans/artifacts/089-docs-live-preview-gaps/missing-live-preview-cards.json'); const nulls=rows.filter((row)=>row.previewExportName===null); if(nulls.length){console.table(nulls); process.exit(1)}"
   ```

## Verification

Run:

```bash
bun run docs:live-preview-gaps
bun run registry:check
bun run origin:components:check
bun run test -- src/data.test.ts
bun run typecheck
bun run check
bun run build
```

If source examples changed for a component with origin evidence, also run the focused parity check for that component:

```bash
bun run parity:check -- --grep "<component-slug>"
```

## Done Criteria

- No row in `missing-live-preview-cards.json` has `previewExportName: null`.
- Public docs examples still show their code snippets.
- Parity-only fixtures are not accidentally exposed as public example cards.
- `src/data.test.ts` passes.
- Generated registry/docs artifacts are up to date.

## Stop Conditions

Stop and report instead of broadening the change if:

- A fixture is intentionally public but has no source file or source export to point at.
- Removing a fixture from docs would break origin/parity evidence and there is no alternate fixture location.
- A required fix would change shared component behavior outside the docs/example layer.
