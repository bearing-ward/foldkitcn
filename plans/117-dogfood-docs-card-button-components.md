# Plan 117: Dogfood local Card and Button helpers in the docs shell

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 99d8ea45..HEAD -- src/main.ts src/styles.css src/scene.test.ts plans/README.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/116-clone-shadcn-style-docs-preview.md
- **Category**: tech-debt
- **Planned at**: commit `99d8ea45`, 2026-07-08

## Why this matters

The docs shell now has enough local registry components to dogfood them in its
own UI. It already uses `shadcn/input-group` for search, but still hand-rolls
many button and card surfaces with local CSS. Replacing those hand-rolled
surfaces with local `shadcn/button` and `shadcn/card` helpers proves the
registry is usable by a real Foldkit app, reduces visual drift between the docs
site and installable components, and makes future docs-shell cleanup less
special-case heavy.

This is a cleanup pass, not a redesign. Preserve the existing docs information
architecture, accessible names, routing, copy behavior, reveal behavior, and
component live-preview behavior.

## Current state

Relevant files:

- `src/main.ts` — Foldkit docs runtime; owns shell navigation, docs component
  pages, copy/reveal controls, roadmap cards, and live-preview wiring.
- `src/styles.css` — docs shell tokens and hand-rolled button/card classes.
- `src/scene.test.ts` — Scene coverage for docs routes, install tabs, copy
  controls, live previews, and component navigation.
- `src/registry/shadcn/button/index.ts` — local Button helper to dogfood.
- `src/registry/shadcn/card/index.ts` — local Card helper/class helpers to
  dogfood.

Important conventions:

- This is a Foldkit app. Bind `const h = html<Message>()` inside view helpers.
- Keep pure view/update architecture. Do not add DOM local state, React state,
  or imperative event handlers.
- Model state remains the source of truth for install tabs and code reveal
  state.
- Prefer local registry helpers over new hand-rolled styling. Do not import
  from `repos/ui`, upstream shadcn, React components, or `repos/foldkit`.
- Preserve semantic HTML. If a docs surface is currently an `article`, `li`,
  `aside`, or `dl` child, do not force it through a helper that only renders a
  `div`. In those cases, use exported local class helpers such as
  `ShadcnCard.cardClassName(...)`, `ShadcnCard.cardHeaderClassName(...)`, and
  `ShadcnCard.cardContentClassName(...)` on the semantic element.
- Preserve stable docs selectors added by Plan 116. If a local component helper
  owns `data-slot`, add separate docs-specific hooks such as `data-docs-slot`
  instead of losing the component helper's slot.

Current local Button API:

```ts
// src/registry/shadcn/button/index.ts:42-56
export type ViewConfig<Message> = Omit<
  BaseButton.ViewConfig<Message>,
  'toView'
> &
  ButtonStyleOptions &
  Readonly<{
    toView: (attributes: ButtonAttributes<Message>) => Html
  }>
```

```ts
// src/registry/shadcn/button/index.ts:108-126
export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  const {
    toView,
    variant = 'default',
    size = 'default',
    className,
    ...baseConfig
  } = config

  return BaseButton.view<Message>({
    ...baseConfig,
    toView: attributes =>
      toView({
        button: [
          ...attributes.button,
          ...shadcnAttributes(h, variant, size, className),
        ],
      }),
  })
}
```

Current local Card API:

```ts
// src/registry/shadcn/card/index.ts:60-77
export const cardClassName = ({ className }: CardStyleOptions = {}): string =>
  cn(cardBaseClassName, className)

export const cardHeaderClassName = ({
  className,
}: CardPartStyleOptions = {}): string => cn(cardHeaderBaseClassName, className)
```

```ts
// src/registry/shadcn/card/index.ts:107-123
export const Card = <Message>(config: CardConfig<Message> = {}): Html => {
  const h = html<Message>()
  const size = config.size ?? 'default'

  return h.div(
    [
      h.DataAttribute('slot', 'card'),
      h.DataAttribute('size', size),
      h.Class(cardClassName(config)),
      ...optionalDir(h, config.dir),
      ...(config.attributes ?? []),
    ],
    config.children ?? [],
  )
}
```

The docs shell has shell-local tokens, but not a complete shadcn token bridge:

```css
/* src/styles.css:41-51 */
:root {
  color-scheme: light;
  --shell-bg: #f8f7f2;
  --shell-surface: #fffef9;
  --shell-border: #dfddd2;
  --shell-text: #24231f;
  --shell-muted: #686257;
  --shell-accent: #25736f;
  --shell-accent-strong: #124f4c;
  --shell-code: #f0eee5;
  --shell-shadow: 0 18px 45px rgb(36 35 31 / 8%);
```

The header and sidebar still hand-roll buttons:

```ts
// src/main.ts:2482-2490
h.button(
  [
    h.Type('button'),
    h.Class('mobile-nav-toggle'),
    h.AriaLabel('Toggle navigation'),
    h.AriaExpanded(model.mobileNavigation.isOpen),
    h.OnClick(ClickedToggleMobileNavigation()),
  ],
  ['Menu'],
)
```

```ts
// src/main.ts:2871-2879
return h.button(
  [
    h.Type('button'),
    h.Class('docs-sidebar-toggle'),
    h.Attribute('aria-controls', 'docs-sidebar'),
    h.AriaExpanded(model.docsSidebar.isOpen),
    h.OnClick(ClickedToggleDocsSidebar()),
  ],
  [model.docsSidebar.isOpen ? 'Hide components' : 'Browse components'],
)
```

The docs code panel still hand-rolls reveal and copy buttons:

```ts
// src/main.ts:3268-3280
h.button(
  [
    h.Type('button'),
    h.Class('docs-code-reveal-button'),
    h.DataAttribute('slot', 'docs-code-reveal'),
    h.OnClick(
      ClickedViewDocsPreviewCode({
        panelId: config.panelId,
      }),
    ),
  ],
  [label],
)
```

```ts
// src/main.ts:3285-3293
h.button(
  [
    h.Type('button'),
    h.Class('copy-button docs-code-copy'),
    h.DataAttribute('slot', 'docs-code-copy'),
    h.AriaLabel(config.copyLabel),
    h.OnClick(ClickedCopySnippet({ text: config.text })),
  ],
  [h.span([h.AriaHidden(true)], ['Copy'])],
)
```

Install tabs are hand-rolled buttons:

```ts
// src/main.ts:3376-3384
return h.button(
  [
    h.Type('button'),
    h.Class('docs-install-tab'),
    h.AriaPressed(isSelected ? 'true' : 'false'),
    h.OnClick(SelectedDocsInstallTab({ panelId, value })),
  ],
  [label],
)
```

Component rows and preview cards are hand-rolled card surfaces:

```ts
// src/main.ts:3088-3118
return h.keyed('article')(
  component.entry.item.id,
  [h.Class('component-row')],
  [
    h.div([], [
      h.h3([], [
        h.a(
          [
            h.Href(
              componentDetailRouter({
                namespace: component.entry.item.namespace,
                slug: component.entry.item.id.split('/')[1] ?? '',
              }),
            ),
          ],
          [component.entry.item.name],
        ),
      ]),
      h.p([], [component.entry.item.description]),
    ]),
    h.dl([h.Class('meta-list')], [
```

```ts
// src/main.ts:3562-3578
return h.keyed('article')(
  example.id,
  [
    h.Id(exampleAnchorId(example)),
    h.Class('docs-preview-card'),
    h.DataAttribute('slot', 'docs-preview-card'),
  ],
  [
    h.div([h.Class('docs-preview-card-header')], [
      h.div([], [
        h.h3([], [example.title]),
        h.p([], [example.description]),
      ]),
      statusBadgeView(example.previewStatus),
    ]),
    h.div(
      [h.Class('docs-preview-surface'), h.DataAttribute('slot', 'docs-preview')],
```

Roadmap cards are also hand-rolled:

```ts
// src/main.ts:4717-4739
return h.div([h.Class('roadmap-stat')], [
  h.dt([], [label]),
  h.dd([], [value]),
  h.p([], [detail]),
])

const roadmapRowView = (row: OriginComponentProgressRow): Html => {
  const h = html<Message>()

  return h.li([h.Class('roadmap-row')], [
    h.div([h.Class('roadmap-row-header')], [
      h.strong([], [row.itemId]),
      statusBadgeView(row.readiness),
```

Existing Scene tests to preserve and extend:

```ts
// src/scene.test.ts:1148-1214
test('Button detail renders install tabs and shared usage code panels', () => {
  Scene.scene(
    { update, view },
    Scene.with(
      modelWithRoute(
        ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
      ),
    ),
    Scene.expect(
      Scene.within(
        Scene.selector('#installation'),
        Scene.role('button', { name: 'CLI' }),
      ),
    ).toExist(),
```

```ts
// src/scene.test.ts:1281-1338
test('Button detail renders examples in preview cards with collapsed source', () => {
  const defaultCard = Scene.selector('#shadcn-button-default')

  Scene.scene(
    { update, view },
    Scene.with(
      modelWithRoute(
        ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
      ),
    ),
    Scene.expect(Scene.selector('[data-slot="docs-preview-card"]')).toExist(),
```

## Commands you will need

| Purpose                  | Command                                                                            | Expected on success |
| ------------------------ | ---------------------------------------------------------------------------------- | ------------------- |
| Focused docs Scene tests | `bun run test -- src/scene.test.ts`                                                | exit 0              |
| Typecheck                | `bun run typecheck`                                                                | exit 0              |
| Lint/check               | `bun run check`                                                                    | exit 0              |
| Full tests               | `bun run test`                                                                     | exit 0              |
| Build                    | `bun run build`                                                                    | exit 0              |
| Whitespace               | `git diff --check -- src/main.ts src/styles.css src/scene.test.ts plans/README.md` | no output, exit 0   |

## Scope

**In scope**:

- `src/main.ts`
- `src/styles.css`
- `src/scene.test.ts`
- `plans/README.md` status row for this plan

**Out of scope**:

- Registry component implementation files under `src/registry/**`.
- Generated artifacts under `registry/**` and `public/r/**`; this plan should
  not need `bun run registry:build`.
- Live example component behavior, live renderer registration, and generated
  docs artifacts.
- Any React, Next.js, upstream shadcn, `repos/ui`, or `repos/foldkit` runtime
  import.
- A broad docs redesign, route restructure, Pagefind/search rewrite, or
  sidebar IA change.
- Replacing every single link/list with a button or card. Only dogfood obvious
  button-like controls and card-like panels where semantics stay intact.

## Git workflow

- Branch: `codex/117-dogfood-docs-card-button-components`
- Commit message style: conventional, matching recent history. Example:
  `refactor: dogfood docs card and button helpers`
- Do not push or open a PR unless the operator asks.

## Steps

### Step 1: Add characterization tests for the dogfooding target surfaces

Update `src/scene.test.ts` before changing implementation. Add focused
assertions to existing docs-shell tests rather than creating a large new test
fixture.

Required assertions:

- On `/components/shadcn/button`, the `CLI`, `Manual`,
  `View ButtonDefault code`, `Copy ButtonDefault example snippet`, and
  `Copy Button install command` controls still have button roles and their
  existing accessible names.
- Those same docs controls carry the local Button component marker after the
  migration. The preferred marker is `[data-slot="button"]` from
  `ShadcnButton.view`. Keep docs-specific hooks as classes or `data-docs-slot`
  if a control also needs a docs selector.
- The `ButtonDefault` example still has a docs preview card selector and a
  docs preview surface selector. If `ShadcnCard` owns `data-slot="card"`, move
  docs-specific selectors to `data-docs-slot="docs-preview-card"` and update
  tests consistently.
- On `/components`, component summary rows still expose component links such
  as `Button (base-ui/button)` and `Button (shadcn/button)`, still show
  availability/docs metadata, and render with the local Card styling marker or
  class helper.
- On `/roadmap`, roadmap stat and row panels still show the summary counts and
  origin docs links, and render with local Card styling markers or class
  helpers.
- Typography remains docs-only and does not gain install/manual tabs.

Do not assert exact generated class strings from Tailwind-heavy helpers.
Prefer stable attributes, roles, visible text, and accessible names.

**Verify**: `bun run test -- src/scene.test.ts` -> fails only on the new
dogfooding marker assertions. If unrelated tests fail before implementation,
STOP and report the baseline failure.

### Step 2: Add a docs-shell token bridge for local shadcn helpers

In `src/styles.css`, extend the existing `:root` and dark-mode token sections
so local `shadcn/button` and `shadcn/card` classes render correctly outside
`.live-example-preview`.

Add token aliases from shell tokens to shadcn/Tailwind token names used by the
helpers. At minimum cover:

- `--radius`
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`

Map these to the current `--shell-*` colors where possible, preserving the
Foldkit docs identity from ADR 0002. Do not replace the separate shadcn/base
Nova token isolation inside `.live-example-preview`; examples must remain
faithful to their registry styling.

**Verify**: `bun run test -- src/scene.test.ts` -> same expected failures as
Step 1 only. CSS token aliases should not change behavior yet.

### Step 3: Import local Button and Card helpers into the docs runtime

In `src/main.ts`, import the local registry helpers:

```ts
import * as ShadcnButton from './registry/shadcn/button'
import * as ShadcnCard from './registry/shadcn/card'
```

Then add small docs-runtime wrappers near the other view helpers:

- `docsButtonView` wraps `ShadcnButton.view<Message>`.
- `docsLinkButtonClassName` wraps `ShadcnButton.buttonVariants(...)` for
  anchor elements that are visually button-like but must remain links.
- `docsCardClassName` wraps `ShadcnCard.cardClassName(...)` for semantic
  roots (`article`, `li`, `aside`, `dl` children) that cannot become helper
  `div`s.
- Optional part wrappers can use `ShadcnCard.cardHeaderClassName(...)`,
  `cardContentClassName(...)`, and `cardFooterClassName(...)`.

Preserve caller-owned attributes by appending them in `toView`. Example shape:

```ts
const docsButtonView = (
  config: Readonly<{
    className: string
    variant?: ShadcnButton.ButtonVariant
    size?: ShadcnButton.ButtonSize
    attributes: ReadonlyArray<Attribute<Message>>
    children: ReadonlyArray<Html | string>
  }>,
): Html =>
  ShadcnButton.view<Message>({
    variant: config.variant ?? 'outline',
    size: config.size ?? 'sm',
    className: config.className,
    toView: attributes => {
      const h = html<Message>()

      return h.button(
        [...attributes.button, ...config.attributes],
        config.children,
      )
    },
  })
```

Adjust the exact wrapper type to match local code style. If `Attribute` is not
already imported from `foldkit/html`, import it as a type.

**Verify**: `bun run typecheck` -> exit 0.

### Step 4: Replace hand-rolled button controls with local Button

In `src/main.ts`, replace these raw `h.button` calls with `docsButtonView`:

- `headerView` mobile nav toggle.
- `docsSidebarToggleView`.
- `docsCodePanelView` reveal button.
- `docsCodePanelView` copy button.
- `docsInstallTabButtonView`.

Preserve:

- Button role and accessible names.
- `aria-expanded`, `aria-controls`, `aria-pressed`, `aria-label`, and click
  messages.
- Existing text labels (`Menu`, `Browse components`, `Hide components`,
  `CLI`, `Manual`, `Copy`, and `View ... code`).
- Existing copy behavior and status live region.

Recommended mapping:

- Navigation/sidebar toggles: `variant: 'outline'`, `size: 'sm'`.
- Copy buttons: `variant: 'ghost'` or `outline`, `size: 'xs'`, preserving
  `.copy-button docs-code-copy` positioning classes.
- Reveal button: `variant: 'secondary'` or `outline`, `size: 'sm'`.
- Install tabs: `variant: selected ? 'secondary' : 'ghost'`, `size: 'sm'`,
  preserving `aria-pressed`.

Do not introduce icon-only buttons in this pass; this is dogfooding, not a
navigation redesign.

**Verify**: `bun run test -- src/scene.test.ts` -> the dogfooding button
assertions pass, and existing install/reveal/copy tests still pass.

### Step 5: Replace hand-rolled card surfaces with local Card styles

In `src/main.ts`, dogfood local Card helpers on card-like docs surfaces while
preserving semantic roots:

- `componentSummaryView`: keep the keyed `article` root, but use
  `docsCardClassName('component-row')` on the root. Use Card header/content
  class helpers where they fit without obscuring the existing layout.
- `dependenciesPanelView`: keep `aside` and `aria-label="Composes"`, but use
  local Card class helpers for the relationship panel.
- `docsPreviewCardView`: keep the keyed `article`, `id`, live-preview
  children, status badge, and code panel behavior. Use local Card class/part
  helpers for the frame/header/content surfaces. Preserve either
  `data-slot="docs-preview-card"` or a migrated
  `data-docs-slot="docs-preview-card"` with tests updated in Step 1.
- `roadmapStatView`: keep the `dt`/`dd` content structure valid inside the
  `dl`, but use local Card styling on the stat container.
- `roadmapRowView`: keep `li`, row text, status badge, and Origin docs link;
  apply local Card styling to the row.
- `roadmapBlockedGroupView`: keep `article` and list semantics; apply local
  Card styling to the group container.
- Search results can be included if low-risk: keep `li` semantics and links,
  but use local Card styling on `.search-result`.

Preserve current class names where they are still useful for layout and tests.
Remove CSS declarations that only duplicate local Card defaults, but keep
docs-specific layout rules such as grid columns, preview surface sizing,
roadmap row header layout, and live-preview token isolation.

**Verify**:

```bash
bun run test -- src/scene.test.ts
bun run typecheck
```

Both exit 0.

### Step 6: Replace button-like links with local Button link styling

In `src/main.ts`, update visually button-like anchors without changing their
semantics:

- Home page `action-link` anchors (`Browse components`, `Inspect registry`).
- Not found page `action-link` anchor (`Back home`).
- Roadmap `source-link` anchors only if the styling still reads as a text
  action and does not make roadmap rows too noisy.

Use `ShadcnButton.buttonVariants(...)` or `ShadcnButton.linkClassName(...)`
through the wrapper from Step 3. Keep anchors as anchors with `href`; do not
turn navigation links into button elements.

**Verify**: `bun run test -- src/scene.test.ts` -> exit 0.

### Step 7: Prune superseded CSS and keep docs-specific layout

In `src/styles.css`, remove or shrink hand-rolled declarations that are now
supplied by local Button/Card helpers:

- `mobile-nav-toggle`
- `docs-sidebar-toggle`
- `action-link`
- `copy-button`
- `docs-code-reveal-button`
- `docs-install-tab`
- `component-row`
- `relationship-panel`
- `docs-preview-card`
- `docs-preview-card-header`
- `roadmap-stat`
- `roadmap-row`
- `roadmap-group`
- optional `search-result`

Keep rules that are genuinely docs-shell layout or behavior:

- responsive display behavior for mobile nav/sidebar toggles;
- absolute positioning for copy buttons inside code panels;
- reveal overlay positioning and gradient;
- install tab selected state if it is not fully represented by Button variant;
- component-row grid layout;
- preview surface min-height and live-preview isolation;
- roadmap row header flex layout;
- scroll margin.

After the pruning pass, run:

```bash
rg "border: 1px solid var\\(--shell-border\\)|background: var\\(--shell-surface\\)" src/styles.css
```

Review remaining matches. Remaining uses should be shell-specific layout
surfaces, not copied card/button chrome. This command is advisory; do not fail
the plan solely because legitimate shell layout surfaces still match.

**Verify**:

```bash
bun run check
bun run test -- src/scene.test.ts
```

Both exit 0.

### Step 8: Run full gates

Run:

```bash
bun run test
bun run typecheck
bun run check
bun run build
git diff --check -- src/main.ts src/styles.css src/scene.test.ts plans/README.md
```

Expected:

- all commands exit 0;
- no generated registry/public artifacts changed;
- no component implementation files changed under `src/registry/**`;
- docs controls still expose the same accessible names and messages;
- examples still render through existing live preview controllers.

## Test plan

Add or update `src/scene.test.ts` coverage for:

- Button detail install/reveal/copy controls dogfood local Button while
  preserving accessible names and click behavior.
- Button detail preview cards preserve source reveal behavior, copy controls,
  and live preview content.
- Components index summary rows preserve component links and lifecycle
  metadata while dogfooding local Card styles.
- Roadmap page preserves stat counts, next-candidate rows, blocked groups, and
  Origin docs links while dogfooding local Card styles.
- Typography docs-only page still does not show install/manual tabs.

Use existing tests around `src/scene.test.ts:1148-1338` as the pattern for
component detail assertions. Use the existing route tests near the component
index and roadmap page tests for page-level assertions.

## Done criteria

All must hold:

- [ ] Docs-shell button-like controls listed in Step 4 render through local
      `shadcn/button` helpers or wrapper helpers.
- [ ] Docs-shell card-like surfaces listed in Step 5 render with local
      `shadcn/card` helpers or class helpers while preserving semantic roots.
- [ ] `src/styles.css` has shell token aliases that allow local shadcn Button
      and Card classes to render outside `.live-example-preview`.
- [ ] Existing docs control accessible names, click messages, and copy/reveal
      behavior are preserved.
- [ ] Existing component live previews still render through
      `liveExampleViewFor`; no live renderer registrations are added or
      removed.
- [ ] No files under `src/registry/**`, `registry/**`, or `public/r/**` are
      modified.
- [ ] `bun run test`, `bun run typecheck`, `bun run check`, `bun run build`,
      and the listed `git diff --check` command exit 0.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back if:

- The code at the locations in "Current state" no longer matches the excerpts.
- Local Button/Card helpers cannot be used without changing semantic roots
  from `article`, `li`, `aside`, `dl`, or `a` into inappropriate elements.
- Token bridging for Button/Card would require replacing the live preview
  shadcn/base Nova token isolation.
- Preserving current docs selectors would require changing `src/registry/**`
  component implementations.
- Any step requires regenerating registry artifacts or changing component
  manifests.
- `bun run test` or `bun run check` fails twice after focused tests pass.

## Maintenance notes

This plan should make the docs app a real consumer of Foldkit CN's own Button
and Card surfaces. Future docs-shell features should start from local registry
helpers first, then add shell-specific layout classes only where needed. Review
the final diff for semantic HTML preservation: dogfooding is not a reason to
turn navigation links into buttons or list rows into generic divs.
