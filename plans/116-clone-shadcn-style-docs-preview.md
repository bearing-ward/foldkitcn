# Plan 116: Clone the shadcn-style docs preview and source panels

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 6ed91ed2..HEAD -- src/main.ts src/styles.css src/data.ts src/data.test.ts src/scene.test.ts src/registry/schema.ts scripts/registry-common.ts registry/docs registry-src plans/README.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/062-_, plans/064-_, plans/067-_, plans/068-_, plans/113-\*
- **Category**: docs
- **Planned at**: commit `6ed91ed2`, 2026-07-08

## Why this matters

The component docs currently show installation, usage, and examples as separate
plain sections with standalone code blocks. The desired product direction is to
own a Foldkit-native version of the shadcn origin preview component: a framed
live preview with a short source teaser, a "View Code" reveal, copy controls,
and the same treatment for installation tabs and usage snippets. Moving all
docs snippets through one component reduces page-level drift and gives future
component pages a single visual and accessibility contract.

The upstream reference is the current shadcn v4 docs implementation:

- `https://github.com/shadcn-ui/ui/blob/main/apps/v4/components/component-preview.tsx`
- `https://github.com/shadcn-ui/ui/blob/main/apps/v4/components/component-preview-tabs.tsx`
- `https://github.com/shadcn-ui/ui/blob/main/apps/v4/components/component-source.tsx`
- `https://github.com/shadcn-ui/ui/blob/main/apps/v4/mdx-components.tsx`

Use those files as interaction and layout evidence, not as runtime source. This
repo is Foldkit-native; do not introduce React components into the docs runtime.

## Current state

Relevant files:

- `src/main.ts` renders component routes, installation, usage, examples, copy
  buttons, and all live-preview controller wiring.
- `src/styles.css` owns the current `.snippet-block`, `.example-card`, and
  `.live-example-preview` styles.
- `src/registry/schema.ts` defines generated docs artifact schemas.
- `scripts/registry-common.ts` builds generated docs artifacts and example
  snippets from registry manifests.
- `src/scene.test.ts` covers component page rendering, install/import snippets,
  live previews, and copy controls.
- `src/data.test.ts` validates generated docs artifacts and live preview
  renderer coverage.
- `registry/docs/**` is generated output. Update it only by running
  `bun run registry:build`.

Current install, usage, and snippet helpers in `src/main.ts`:

```ts
// src/main.ts:3146-3158
const installCommandFor = (itemId: string): string =>
  `bunx foldkitcn add ${itemId}`

const physicalInstallPathFor = (itemId: string): string =>
  `src/components/foldkitcn/${itemId}.ts`

const aliasImportPathFor = (itemId: string): string =>
  `@/components/foldkitcn/${itemId}`

const importSnippetFor = (component: PublicComponent): string =>
  `import { ${component.entry.item.name} } from '${aliasImportPathFor(
    component.entry.item.id,
  )}'`
```

```ts
// src/main.ts:3168-3195
const snippetBlockView = (
  text: string,
  ariaLabel: string,
  copiedSnippets: HashSet.HashSet<string>,
): Html => {
  const h = html<Message>()
  const isCopied = HashSet.has(copiedSnippets, text)

  return h.div(
    [h.Class('snippet-block')],
    [
      h.pre(
        [h.Class('code-block'), h.DataAttribute('pagefind-ignore', '')],
        [h.code([], [text])],
      ),
      h.button(
        [
          h.Type('button'),
          h.Class('copy-button'),
          h.AriaLabel(ariaLabel),
          h.OnClick(ClickedCopySnippet({ text })),
        ],
        [h.span([h.AriaHidden(true)], ['Copy'])],
      ),
      h.span(
        [h.Role('status'), h.AriaLive('polite'), h.Class('sr-only')],
        [isCopied ? 'Copied to clipboard' : ''],
      ),
    ],
  )
}
```

Current Installation section only exposes one CLI command for installable rows:

```ts
// src/main.ts:3223-3267
const installationSectionView = (
  component: PublicComponent,
  copiedSnippets: HashSet.HashSet<string>,
): Html => {
  const h = html<Message>()
  const availability = component.entry.item.lifecycle.availability

  return h.section([h.Id('installation'), h.Class('content-section')], [
    h.h2([], ['Installation']),
    isDocsOnlyComponent(component)
      ? h.p([], [
          'This docs-only page has no installable component. Foldkit CN does not ship default typography styles or a Typography helper.',
        ])
      : M.value(availability).pipe(
          M.withReturnType<Html>(),
          M.when('installable', () =>
            h.div([], [
              h.p([], [
                'Install the component into your app, then import it from the generated local namespace.',
              ]),
              snippetBlockView(
                installCommandFor(component.entry.item.id),
                `Copy ${component.entry.item.name} install command`,
                copiedSnippets,
              ),
            ]),
          ),
```

Current Usage section is also plain copyable code plus metadata:

```ts
// src/main.ts:3287-3310
const usageSectionView = (
  component: PublicComponent,
  copiedSnippets: HashSet.HashSet<string>,
): Html => {
  const h = html<Message>()

  return h.section([h.Id('usage'), h.Class('content-section')], [
    h.h2([], ['Usage']),
    isDocsOnlyComponent(component)
      ? docsOnlyUsageView()
      : Option.match(component.maybeDocsArtifact, {
          onNone: () =>
            h.p([], [
              'Usage guidance is waiting for the generated docs artifact.',
            ]),
          onSome: artifact =>
            h.div([], [
              h.p([], [
                'Import the helper from the generated local namespace and call it from a Foldkit view after binding the Html factory.',
              ]),
              snippetBlockView(
                importSnippetFor(component),
                `Copy ${component.entry.item.name} import snippet`,
```

Current examples pair a live preview with a full snippet in each repeated card:

```ts
// src/main.ts:4085-4128
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

return h.section([h.Id('examples'), h.Class('content-section')], [
  h.h2([], ['Examples']),
  Option.match(component.maybeDocsArtifact, {
    onNone: () => h.p([], ['Example metadata is not loaded.']),
    onSome: artifact =>
      h.div(
        [h.Class('example-list')],
        artifact.examples.map(example =>
          h.keyed('article')(
            example.id,
            [h.Id(exampleAnchorId(example)), h.Class('example-card')],
            [
              h.div([h.Class('example-card-header')], [
                h.div([], [
                  h.h3([], [example.title]),
                  h.p([], [example.description]),
                ]),
                statusBadgeView(example.previewStatus),
              ]),
              liveExamplePreviewView(example),
              snippetBlockView(
                example.snippet,
                `Copy ${example.title} example snippet`,
                copiedSnippets,
              ),
            ],
```

Current generated docs artifacts contain example snippets but do not include
manual-install source file contents:

```ts
// src/registry/schema.ts:262-273
export const ExampleDocsArtifact = S.Struct({
  id: S.String,
  title: S.String,
  description: S.String,
  componentItemId: S.String,
  sourcePath: S.String,
  snippet: S.String,
  previewStatus: ExamplePreviewStatus,
  previewExportName: S.OptionFromNullOr(S.String),
  requiredRegistryItems: S.Array(S.String),
  notes: S.Array(S.String),
})
```

```ts
// src/registry/schema.ts:360-376
export const ComponentDocsArtifact = S.Struct({
  schemaVersion: RegistrySchemaVersion,
  itemId: S.String,
  routePath: S.String,
  title: S.String,
  description: S.String,
  docsStatus: DocsStatus,
  markdownPath: S.OptionFromNullOr(S.String),
  markdown: S.OptionFromNullOr(S.String),
  headings: S.Array(ComponentDocsHeading),
  installCommand: S.OptionFromNullOr(S.String),
  localInstallPath: S.String,
  defaultImportPath: S.String,
  sourceRoot: S.String,
  installableSourcePaths: S.Array(S.String),
  originProvenance: S.Array(OriginProvenance),
  dependencies: DependencyGraph,
  examples: S.Array(ExampleDocsArtifact),
```

Builder excerpt:

```ts
// scripts/registry-common.ts:1212-1229
const buildExampleDocsArtifact = (
  item: RegistryItemManifest,
  example: ExampleManifest,
): RawExampleDocsArtifact => {
  const source = readFileSync(example.sourcePath, 'utf-8')
  const exportName = exportedExampleNameFromSource(source, example)
  const artifact = {
    id: example.id,
    title: example.title,
    description: example.description,
    componentItemId: item.id,
    sourcePath: example.sourcePath,
    snippet: extractExampleSnippet(source, example),
    previewStatus: previewStatusForExample(item, exportName),
    previewExportName: exportName ?? null,
    requiredRegistryItems: requiredRegistryItemsForItem(item),
    notes: [],
  }
```

```ts
// scripts/registry-common.ts:1295-1323
export const buildComponentDocsArtifacts = (
  registryIndex: RegistryIndexType,
): ComponentDocsBuildResult => {
  const artifacts = registryIndex.items.map(entry => {
    const { item } = entry
    const docsMarkdownPath = docsMarkdownPathFromManifest(item)
    const hasMarkdown = existsSync(docsMarkdownPath)
    const markdown = hasMarkdown ? readFileSync(docsMarkdownPath, 'utf-8') : ''
    const route = componentDocsRouteForItem(item)
    const artifact = {
      schemaVersion: 1,
      itemId: item.id,
      routePath: route.routePath,
      title: item.name,
      description: item.description,
      docsStatus: hasMarkdown ? item.lifecycle.docsStatus : 'missing',
      markdownPath: hasMarkdown ? docsMarkdownPath : null,
      markdown: hasMarkdown ? markdown : null,
      headings: hasMarkdown ? extractMarkdownHeadings(markdown) : [],
      installCommand: null,
      localInstallPath: localInstallPathForItem(item),
      defaultImportPath: item.id,
      sourceRoot: item.sourceRoot,
      installableSourcePaths: item.installableSourcePaths,
      originProvenance: item.originProvenance,
      dependencies: item.dependencies,
      examples: item.examples.map(example =>
        buildExampleDocsArtifact(item, example),
      ),
```

Current styles:

```css
/* src/styles.css:511-543 */
.snippet-block {
  position: relative;
  max-width: 100%;
  min-width: 0;
  margin: 1rem 0;
}

.code-block {
  max-width: 100%;
  min-width: 0;
  margin: 0;
  overflow-x: auto;
  border: 1px solid var(--shell-border);
  background: var(--shell-code);
  padding: 1rem 4rem 1rem 1rem;
  color: var(--shell-text);
}

.copy-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
```

```css
/* src/styles.css:559-593 */
.example-list {
  display: grid;
  gap: 1rem;
  justify-items: start;
  min-width: 0;
}

.example-card {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--shell-border);
  background: var(--shell-surface);
  padding: 1rem;
}

.live-example-preview {
  color-scheme: light;
```

Repo conventions to preserve:

- Foldkit app architecture is Elm-like: model is the source of truth, messages
  describe facts, update owns state transitions, and view is pure.
- Boundary data must use Effect Schema. If docs artifacts gain manual source
  file content, add a schema first and derive types from it.
- Do not import from `repos/foldkit`, `repos/ui`, or upstream shadcn code in
  runtime source. Those trees are read-only evidence.
- Use `html<Message>()` inside view helpers, `Option.match`, `M.value(...).pipe`,
  `evo` for model updates, and verb-first past-tense message names.
- Generated files under `registry/docs/**`, `registry/index.json`, and
  `public/r/**` are updated by `bun run registry:build`, not hand-edited.

## Commands you will need

| Purpose             | Command                                                                                                                                                                                  | Expected on success                        |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Focused scene tests | `bun run test -- src/scene.test.ts`                                                                                                                                                      | exit 0                                     |
| Docs data tests     | `bun run test -- src/data.test.ts`                                                                                                                                                       | exit 0                                     |
| Registry build      | `bun run registry:build`                                                                                                                                                                 | exit 0 and generated artifact changes only |
| Registry validation | `bun run registry:check`                                                                                                                                                                 | exit 0                                     |
| Typecheck           | `bun run typecheck`                                                                                                                                                                      | exit 0                                     |
| Full tests          | `bun run test`                                                                                                                                                                           | exit 0                                     |
| Lint/check          | `bun run check`                                                                                                                                                                          | exit 0                                     |
| Build               | `bun run build`                                                                                                                                                                          | exit 0                                     |
| Whitespace          | `git diff --check -- src/main.ts src/styles.css src/data.ts src/data.test.ts src/scene.test.ts src/registry/schema.ts scripts/registry-common.ts registry/docs public/r plans/README.md` | no output, exit 0                          |

## Scope

**In scope**:

- `src/main.ts`
- `src/styles.css`
- `src/data.ts` only if a new exported helper is needed for docs artifact data.
- `src/registry/schema.ts`
- `scripts/registry-common.ts`
- `src/data.test.ts`
- `src/scene.test.ts`
- Generated output from `bun run registry:build`: `registry/index.json`,
  `registry/docs/**`, and `public/r/**`.
- `plans/README.md` status row for this plan.

**Out of scope**:

- Component implementations under `src/registry/**`, except imports needed by
  existing live preview rendering in `src/main.ts`.
- Source manifests under `registry-src/**/item.json` unless a schema change
  proves every manifest needs an added field. Prefer deriving docs preview data
  from existing manifests and source files.
- Origin fixture files and parity tests.
- Any React, Next.js, shadcn, Radix React, or Base UI React runtime dependency.
- Reworking the whole docs shell, sidebar, routing, search, or Pagefind.
- Fixing missing live preview rows. Handle static or blocked examples in the
  new shell without expanding this plan into example implementation work.

## Git workflow

- Branch: `codex/116-shadcn-style-docs-preview`
- Commit message style: conventional, matching recent history. Example:
  `feat: add shadcn-style docs preview panels`
- Do not push or open a PR unless the operator asks.

## Steps

### Step 1: Add red tests for the desired docs shell

In `src/scene.test.ts`, add tests before changing the view implementation.
Model the tests after the existing Button detail and copy control tests around
`src/scene.test.ts:1078-1194`.

Required failing assertions:

- On `/components/shadcn/button`, every example card uses a single reusable
  preview/source shell selector such as `[data-slot="docs-preview-card"]`.
- The first Button example contains a live preview area and a collapsed source
  preview area with a `View Code` button.
- Before clicking `View Code`, the collapsed source preview contains only the
  short teaser, not the entire snippet. After clicking, the full snippet appears
  in that same card and the copy button still exists.
- Installation renders a tab-like control with both `CLI` and `Manual` choices.
  The `CLI` tab shows `bunx foldkitcn add shadcn/button`; the `Manual` tab
  shows installable source content or, at minimum, a manual source-file panel
  for `src/registry/shadcn/button/index.ts`.
- Usage uses the same reusable code-panel styling and copy semantics rather
  than a plain standalone `snippet-block`.
- `shadcn/typography` still renders docs-only guidance and does not show the
  install command or a fake manual install tab.

Add tests for accessibility:

- The reveal control has an accessible name containing the example title, for
  example `View ButtonDefault code`.
- The install tabs expose button roles or tab roles with stable accessible names
  `CLI` and `Manual`.
- Copy buttons keep the existing labels, such as
  `Copy Button install command`.

**Verify**: `bun run test -- src/scene.test.ts` -> fails only on the newly added
assertions. If unrelated tests fail before implementation, STOP and report the
baseline failure.

### Step 2: Extend generated docs artifacts for manual install source

Add a schema in `src/registry/schema.ts` for installable source files, for
example:

```ts
export const ComponentDocsSourceFile = S.Struct({
  path: S.String,
  content: S.String,
})
export type ComponentDocsSourceFile = typeof ComponentDocsSourceFile.Type
```

Then add a field to `ComponentDocsArtifact`, for example:

```ts
sourceFiles: S.Array(ComponentDocsSourceFile),
```

In `scripts/registry-common.ts`, derive this field from
`item.installableSourcePaths` inside `buildComponentDocsArtifacts`. Read only
the existing installable source files. Do not add a new source manifest field.
Sort source files in manifest order so the first manual tab is stable.

Target shape:

```ts
const sourceFiles = item.installableSourcePaths.map(sourcePath => ({
  path: sourcePath,
  content: readFileSync(sourcePath, 'utf-8'),
}))
```

Then include `sourceFiles` in the generated artifact before schema decoding.

Add or update `src/data.test.ts` to assert that the shadcn Button artifact has
a source file entry whose `path` is `src/registry/shadcn/button/index.ts` and
whose content includes an exported Button helper. The exact code should not be
hard-coded beyond a small stable substring.

**Verify**: `bun run test -- src/data.test.ts` -> fails before generated JSON is
refreshed or before the implementation is complete, and then passes after the
schema and builder are updated with generated artifacts.

### Step 3: Regenerate registry docs artifacts

Run the generator:

```bash
bun run registry:build
```

Expected output includes:

- `Built registry/index.json with ... item(s).`
- `Built registry/docs/index.json with ... route(s).`
- `Built public/r/registry.json with ... item(s).`

Inspect the diff. Generated docs artifacts should now contain the new
`sourceFiles` field. The generated public registry output may refresh if the
builder timestamp or artifact hash changes, but there must be no hand edits in
generated JSON.

**Verify**: `bun run registry:check` -> exit 0.

### Step 4: Add Foldkit-native preview/source state

In `src/main.ts`, add model state for docs preview source reveals and install
tabs. Keep this state separate from live example component state.

Suggested schema additions:

```ts
const DocsInstallTabValue = S.Literal('cli', 'manual')

// Model fields:
docsPreviewCodeOpenValues: S.Record(S.String, S.Boolean),
docsInstallTabValues: S.Record(S.String, DocsInstallTabValue),
```

Suggested messages:

```ts
export const ClickedViewDocsPreviewCode = m('ClickedViewDocsPreviewCode', {
  panelId: S.String,
})
export const SelectedDocsInstallTab = m('SelectedDocsInstallTab', {
  panelId: S.String,
  value: DocsInstallTabValue,
})
```

Initialize both records to `{}` in `init`.

In `update`, add cases:

- `ClickedViewDocsPreviewCode`: set the given `panelId` to `true`.
- `SelectedDocsInstallTab`: set the given `panelId` to the selected value.

Use `evo(model, { ... })` and `EffectRecord.set`, following neighboring update
logic. Do not use DOM local state, uncontrolled checkboxes, or React-like
component state.

**Verify**: `bun run typecheck` -> exit 0.

### Step 5: Replace raw snippet blocks with reusable docs code panels

Keep `snippetBlockView` if it remains useful as a low-level primitive, but add a
higher-level helper that supports:

- stable `data-slot` attributes: `docs-code-panel`, `docs-code-preview`,
  `docs-code-full`, `docs-code-copy`, and `docs-code-reveal`.
- optional teaser lines, defaulting to 3 lines, to mirror shadcn's
  `sourcePreview` behavior.
- a gradient overlay and `View Code` button when collapsed.
- the existing `ClickedCopySnippet` command and status announcement.
- a code title or file path for manual install source files.

The helper should not run formatters or highlighters at runtime. Use the text
already present in generated docs artifacts, example snippets, and source file
contents.

Replace:

- `installationSectionView` install command snippet.
- `usageSectionView` import snippet.
- `docsOnlyUsageView` typography snippet.
- example card snippet rendering in `examplesSectionView`.

**Verify**: `bun run test -- src/scene.test.ts` -> remaining failures should be
limited to the larger preview-card migration if Step 6 is not complete yet.

### Step 6: Add the reusable docs preview card and migrate all examples

Add a `docsPreviewCardView` helper in `src/main.ts` that owns the shadcn-like
shape:

- outer frame with `data-slot="docs-preview-card"`;
- header with title, description, and optional status badge;
- preview area with `data-slot="docs-preview"` and the existing
  `.live-example-preview` child when a live renderer exists;
- fallback preview state for `static` or `blocked` examples that tells the user
  source is available but no live preview renderer is registered;
- code area with the reusable docs code panel from Step 5.

Migrate `examplesSectionView` so every `artifact.examples` entry renders
through this helper. Preserve:

- `exampleAnchorId(example)` for deep links;
- keyed rendering by `example.id`;
- `statusBadgeView(example.previewStatus)`;
- `liveExamplePreviewView(example)` behavior and labels;
- copy labels `Copy ${example.title} example snippet`;
- all existing live-example controller messages and behavior.

Do not change any component example source or live renderer registration.

**Verify**: `bun run test -- src/scene.test.ts` -> the new tests from Step 1
pass, and the existing live interaction tests still pass.

### Step 7: Add CLI and Manual installation tabs

Update `installationSectionView` to render a tabbed install panel for
installable components:

- `CLI` tab: command from `installCommandFor(component.entry.item.id)`.
- `Manual` tab: one or more code panels from `artifact.sourceFiles`. Start with
  the first source file expanded/collapsible in the same shadcn-style code
  shell. If an item has no source files, show a clear empty state and do not
  fabricate code.

The tabs must be Foldkit model state, using the `SelectedDocsInstallTab`
message from Step 4. Use a panel id derived from the item id, for example
`install#shadcn/button`.

Acceptance details:

- The default tab is `cli`.
- The selected tab has `aria-selected="true"` if using tab roles, or
  `aria-pressed="true"` if using buttons.
- Both tab labels are present in the DOM.
- Copy button labels remain specific: `Copy Button install command` for CLI,
  and `Copy Button manual source src/registry/shadcn/button/index.ts` or similar
  for manual source.

**Verify**: `bun run test -- src/scene.test.ts` -> install tab assertions pass.

### Step 8: Polish CSS without making the page a shadcn clone

In `src/styles.css`, replace the old card treatment with a Foldkit-owned shell
that borrows the shadcn preview affordance:

- rounded border no larger than the existing app radius convention;
- large preview region with stable min-height and centered content;
- source teaser region with a top border, dark/code background, gradient fade,
  and centered `View Code` button;
- responsive behavior that keeps text inside buttons and panels;
- no nested cards inside cards;
- preserve `.live-example-preview` token isolation and overlay positioning
  rules.

Do not use a one-note purple/blue gradient, decorative blobs, or marketing-style
hero treatment. This is a docs tool surface.

Suggested class families:

- `.docs-preview-card`
- `.docs-preview-card-header`
- `.docs-preview-surface`
- `.docs-code-panel`
- `.docs-code-preview`
- `.docs-code-reveal`
- `.docs-install-tabs`
- `.docs-install-tab`

Keep existing selectors as compatibility aliases if tests or other code still
depend on them during the migration. At the end, `rg "example-card|snippet-block"
src/main.ts src/styles.css` should show only intentional compatibility or no
runtime use.

**Verify**:

```bash
bun run test -- src/scene.test.ts
bun run typecheck
```

Both exit 0.

### Step 9: Run full gates and inspect generated drift

Run:

```bash
bun run registry:check
bun run test -- src/data.test.ts src/scene.test.ts
bun run test
bun run typecheck
bun run check
bun run build
git diff --check -- src/main.ts src/styles.css src/data.ts src/data.test.ts src/scene.test.ts src/registry/schema.ts scripts/registry-common.ts registry/docs public/r plans/README.md
```

Expected:

- all commands exit 0;
- generated artifact changes are explained by the `sourceFiles` addition;
- no component implementation files changed;
- no new React runtime dependency appears in installable source;
- no missing live preview renderer is introduced.

## Test plan

Add or update tests in `src/scene.test.ts`:

- Button detail page renders `data-slot="docs-preview-card"` for examples.
- ButtonDefault preview card has a live preview, teaser code, `View Code`, full
  code after clicking, and copy control.
- Installation exposes `CLI` and `Manual` tabs, defaults to CLI, switches to
  manual source, and preserves copy commands.
- Usage uses the shared docs code panel and keeps the public import path.
- Typography remains docs-only and does not receive install/manual tabs.

Add or update tests in `src/data.test.ts`:

- Generated docs artifacts decode with `sourceFiles`.
- `shadcn/button` includes at least `src/registry/shadcn/button/index.ts` in
  `sourceFiles`.
- Complete component live example renderer coverage remains unchanged.

Use existing tests as patterns:

- `src/scene.test.ts:1122-1145` for install/import snippet expectations.
- `src/scene.test.ts:1177-1194` for live example preview and snippet
  expectations.
- `src/data.test.ts:146-169` and `src/data.test.ts:210-224` for docs artifact
  and live preview coverage assertions.

## Done criteria

All must hold:

- [ ] `src/main.ts` has one reusable docs preview/source helper path for
      examples instead of each example hand-rendering a separate preview and snippet.
- [ ] Installation for installable components has both `CLI` and `Manual` tabs.
- [ ] Manual install content comes from generated docs artifact source files,
      not from hard-coded Button-specific strings.
- [ ] Usage snippets use the shared docs code panel.
- [ ] Docs-only rows such as `shadcn/typography` still avoid install commands
      and manual source tabs.
- [ ] Example live previews still render through existing live example
      controllers.
- [ ] `bun run registry:build`, `bun run registry:check`, `bun run test -- src/data.test.ts src/scene.test.ts`, `bun run test`, `bun run typecheck`, `bun run check`, `bun run build`, and the `git diff --check` command all exit 0.
- [ ] `plans/README.md` marks Plan 116 DONE or BLOCKED with a one-line reason.

## STOP conditions

Stop and report back if:

- The current code at the cited locations no longer matches the excerpts.
- Adding manual install source content requires changing every
  `registry-src/**/item.json` manifest instead of deriving from existing
  `installableSourcePaths`.
- A source file is too large to include in generated docs artifacts without a
  clear truncation or lazy-loading strategy.
- The implementation would require importing React, Next.js, upstream shadcn
  components, or files from `repos/ui` into runtime docs code.
- Static or blocked examples tempt the executor to implement new live previews.
  That is separate backlog work; render a graceful state here.
- Full tests fail twice after focused tests pass.

## Maintenance notes

The new preview/source shell becomes the default component-docs rendering
surface. Future component plans should not add one-off example card markup or
custom install snippet blocks unless they extend this shared helper. Reviewers
should inspect accessibility names, copy command labels, generated artifact
size, and whether the docs shell still feels Foldkit-owned rather than a
wholesale shadcn.com clone.
