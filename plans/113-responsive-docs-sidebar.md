# Plan 113: Make the docs shell responsive with a component sidebar

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer tells you they maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat de1f022e..HEAD -- src/main.ts src/styles.css src/scene.test.ts tests/e2e/docs.test.ts`
> If any in-scope source file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding. If they no
> longer match, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/062-replace-starter-app-with-docs-shell.md, plans/065-add-component-navigation-roadmap-search.md, plans/066-add-prerender-and-pagefind-search.md
- **Category**: docs
- **Planned at**: commit `de1f022e`, 2026-07-06

## Why this matters

The docs site is now large enough that search and component navigation need to
behave like permanent documentation infrastructure, not content that competes
with every page. The current shell renders search and component navigation in
one sidebar, but the layout does not make the left-sidebar contract explicit,
and the right "On this page" rail is always rendered even when the active route
is not a component page. This plan makes the docs shell responsive, moves
`Search documentation` and `All components` into clear left-sidebar sections,
and ensures the right table of contents exists only on component detail pages.

This is also the right moment to dogfood more of the registry in the site shell:
the shell currently hand-rolls input and button affordances that now exist as
local `shadcn/*` registry helpers. Dogfooding should be incremental and
visible, but it must not turn the shell into a second component-parity surface.

## Current state

- `src/main.ts` owns the Foldkit model, messages, update, and view for the docs
  site. It already stores search state and Pagefind state in the model:

```ts
// src/main.ts:236-238
searchQuery: S.String,
pagefindSearch: PagefindSearch,
```

- `src/main.ts` initializes the search model fields:

```ts
// src/main.ts:1087-1088
searchQuery: '',
pagefindSearch: IdlePagefindSearch(),
```

- `src/main.ts` updates search through explicit Foldkit messages and commands.
  Preserve this Elm-style flow; do not add imperative DOM search handlers:

```ts
// src/main.ts:1975-1999
UpdatedSearchQuery: ({ value }) => {
  if (value === model.searchQuery) {
    return [model, []]
  }

  if (EffectString.isEmpty(EffectString.trim(value))) {
    return [
      evo(model, {
        searchQuery: () => value,
        pagefindSearch: () => IdlePagefindSearch(),
      }),
      [],
    ]
  }

  return [
    evo(model, {
      searchQuery: () => value,
      pagefindSearch: () =>
        LoadingPagefindSearch({
          results: pagefindResultsFromState(model.pagefindSearch),
        }),
    }),
    [SearchPagefind({ query: value })],
  ]
},
```

- `componentSearchView` currently renders a raw search input and raw clear
  button:

```ts
// src/main.ts:2537-2578
const componentSearchView = (model: Model): Html => {
  const h = html<Message>()
  const results = searchPublicComponents(
    publicComponents(model.data),
    model.searchQuery,
  )
  const isClearDisabled = EffectString.isEmpty(
    EffectString.trim(model.searchQuery),
  )

  return h.div(
    [
      h.Class('component-search'),
      h.Role('search'),
      h.AriaLabel('Documentation search'),
    ],
    [
      h.label([h.For('component-search-input'), h.Class('search-label')], [
        'Search documentation',
      ]),
      h.div([h.Class('search-control')], [
        h.input([
          h.Id('component-search-input'),
          h.Type('search'),
          h.Placeholder('Search components and docs'),
          h.Value(model.searchQuery),
          h.OnInput(value => UpdatedSearchQuery({ value })),
        ]),
        h.button(
          [
            h.Type('button'),
            h.Class('search-clear-button'),
            h.AriaLabel('Clear component search'),
            h.Disabled(isClearDisabled),
            h.OnClick(ClickedClearSearch()),
          ],
          ['Clear'],
        ),
      ]),
      searchResultsView(model.searchQuery, results, model.pagefindSearch),
    ],
  )
}
```

- `sidebarView` already renders search and component links in the left column,
  but the sections are not separated enough for the requested responsive shell:

```ts
// src/main.ts:2587-2605
return h.aside(
  [h.Class('docs-sidebar'), h.DataAttribute('pagefind-ignore', '')],
  [
    componentSearchView(model),
    h.nav([h.AriaLabel('Component navigation')], [
      h.a(
        [
          h.Class(
            isComponentsIndexRoute(model.route)
              ? 'sidebar-root-link active'
              : 'sidebar-root-link',
          ),
          h.Href(componentsIndexRouter({})),
```

- `tableOfContentsView` always renders a `.docs-toc` aside with generic section
  links. `tableOfContentsComponent` returns `Option.none()` for non-component
  routes, but the aside still exists and still says "On this page":

```ts
// src/main.ts:2706-2731
const tableOfContentsView = (model: Model): Html => {
  const h = html<Message>()
  const maybeComponent = tableOfContentsComponent(model)

  return h.aside(
    [
      h.Class('docs-toc'),
      h.AriaLabel('On this page'),
      h.DataAttribute('pagefind-ignore', ''),
    ],
    [
      h.p([h.Class('toc-heading')], ['On this page']),
      h.a([h.Href('#overview')], ['Overview']),
      h.a([h.Href('#installation')], ['Installation']),
      h.a([h.Href('#usage')], ['Usage']),
```

- `shellView` always places the sidebar, main content, and TOC into one grid:

```ts
// src/main.ts:2734-2758
const shellView = (model: Model, content: Html): Html => {
  const h = html<Message>()
  const groups = namespaceGroups(model.data)

  return h.div([h.Class('app-shell')], [
    headerView(model),
    mobileNavigationView(model),
    h.div([h.Class('docs-layout')], [
      sidebarView(model, groups),
      h.main(
        [
          h.Id('main-content'),
          h.Class('docs-main'),
          h.DataAttribute('pagefind-body', ''),
        ],
        [
          h.keyed('div')(
            model.route._tag,
            [h.Class('route-frame')],
            [content],
          ),
        ],
      ),
      tableOfContentsView(model),
    ]),
  ])
}
```

- `src/styles.css` currently uses a three-column desktop grid and hides the TOC
  below 960px:

```css
/* src/styles.css:190-209 */
.docs-layout {
  display: grid;
  grid-template-columns: minmax(13rem, 17rem) minmax(0, 1fr) minmax(
      11rem,
      14rem
    );
  gap: clamp(1rem, 3vw, 2rem);
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 2rem clamp(1rem, 4vw, 2rem);
}

.docs-sidebar,
.docs-toc {
  position: sticky;
  top: 5.5rem;
  align-self: start;
  max-height: calc(100vh - 7rem);
  overflow: auto;
}
```

```css
/* src/styles.css:973-1001 */
@media (max-width: 960px) {
  .desktop-nav,
  .docs-toc {
    display: none;
  }

  .docs-layout {
    grid-template-columns: 1fr;
  }

  .docs-sidebar {
    position: static;
    max-height: none;
    padding: 0 0 1rem;
    border-right: 0;
    border-bottom: 1px solid var(--shell-border);
  }
}
```

- Existing Scene coverage already tests search behavior and component-detail
  TOC example links:

```ts
// src/scene.test.ts:916-947
test('documentation search filters public generated records and clears', () => {
  Scene.scene(
    { update, view },
    Scene.with(modelWithRoute(ComponentsIndexRoute({}))),
    Scene.type(Scene.label('Search documentation'), 'button'),
    Scene.Command.resolve(
      SearchPagefind({ query: 'button' }),
      ReceivedPagefindSearchResults({ query: 'button', results: [] }),
    ),
    Scene.expect(Scene.label('Search documentation')).toHaveValue('button'),
    ...
  )
})
```

```ts
// src/scene.test.ts:1440-1455
test('Component detail table of contents links to individual examples', () => {
  Scene.scene(
    { update, view },
    Scene.with(
      modelWithRoute(
        ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
      ),
    ),
    Scene.expect(
      Scene.within(
        Scene.selector('.docs-toc'),
        Scene.selector('a[href="#shadcn-button-demo"]'),
      ),
    ).toHaveText('ButtonDemo'),
    Scene.expect(Scene.selector('#shadcn-button-demo')).toExist(),
  )
})
```

- Existing Playwright docs tests run through `playwright.config.ts`, whose
  webServer builds, prerenders, indexes Pagefind, and serves preview:

```ts
// playwright.config.ts:18-23
webServer: {
  command: `bun run build && bun run docs:prerender && bun run docs:search && bun run preview -- --host 127.0.0.1 --port ${PORT} --strictPort`,
  url: BASE_URL,
  reuseExistingServer: false,
  timeout: 180_000,
},
```

- Foldkit conventions from `AGENTS.md` and `.agents/skills/foldkit/SKILL.md`
  apply: keep state in the `Model`, use `m()` messages, update with `evo`,
  bind `const h = html<Message>()` inside each view function, use `empty` for
  conditional rendering, and keep side effects in Commands.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Focused Scene/Story tests | `bun run test -- src/scene.test.ts src/story.test.ts` | exit 0; all matching Vitest tests pass |
| Focused browser docs tests | `bunx playwright test tests/e2e/docs.test.ts --grep "docs shell|documentation search|component detail"` | exit 0; Chromium tests pass |
| Full typecheck | `bun run typecheck` | exit 0; no TypeScript errors |
| Formatting/lint check | `bun run check` | exit 0; Ultracite reports all matched files use correct format |
| Full build | `bun run build` | exit 0; Vite build completes |

## Suggested executor toolkit

- Use the `foldkit` skill if available. This is a Foldkit app; do not introduce
  React patterns, mutable DOM state, or imperative event handlers.
- Use the existing Scene tests in `src/scene.test.ts` for structural DOM and
  accessibility assertions.
- Use `tests/e2e/docs.test.ts` for viewport and geometry assertions.

## Scope

**In scope** (the only source files you should modify):

- `src/main.ts` - docs shell, sidebar, search, and TOC view functions.
- `src/styles.css` - docs layout, sidebar sections, responsive rules.
- `src/scene.test.ts` - shell structure and TOC route-scoping tests.
- `tests/e2e/docs.test.ts` - browser viewport regression tests.
- `plans/README.md` - update this plan's status row when finished.

**Out of scope** (do NOT touch, even though they look related):

- `registry-src/**`, `registry/index.json`, `public/r/**`, and
  `registry/docs/**` - this is a docs-shell change, not registry generation.
- `src/route.ts` - route definitions already distinguish component detail
  routes; this plan should not add routes.
- `scripts/prerender.ts`, Pagefind scripts, or search indexing logic - search
  behavior should continue to use existing `UpdatedSearchQuery`,
  `SearchPagefind`, and `ReceivedPagefindSearchResults`.
- Component primitive implementations under `src/registry/**` - dogfooding may
  import existing helpers, but do not change primitive APIs or examples.
- Visual parity fixtures under `tests/parity/**` - site-shell responsiveness is
  not component origin parity.

## Git workflow

- Branch: `codex/113-responsive-docs-sidebar`.
- Commit style: match recent history such as
  `fix: remove shadcn toast roadmap row` or
  `fix: harden shadcn regression follow-ups`.
- Do not push or open a PR unless the operator explicitly asks.

## Steps

### Step 1: Add failing shell structure tests

In `src/scene.test.ts`, add or extend tests near the existing documentation
search and TOC tests.

Add a test that renders `ComponentsIndexRoute({})` and asserts:

- `Scene.selector('.docs-sidebar')` exists.
- `Scene.within(Scene.selector('.docs-sidebar'), Scene.label('Search documentation'))`
  exists.
- `Scene.within(Scene.selector('.docs-sidebar'), Scene.role('navigation', { name: 'Component navigation' }))`
  exists.
- The `All components` link exists inside `.docs-sidebar`, has
  `aria-current="page"` on `ComponentsIndexRoute({})`, and is not in
  `#main-content`.
- Search still filters to public generated records and clears as the existing
  test expects.

Add a test that renders at least `HomeRoute({})`, `DocsRoute({})`,
`ComponentsIndexRoute({})`, `RegistryRoute({})`, `RoadmapRoute({})`, and
`NotFoundRoute({ path: '/missing' })` and asserts:

- `.docs-toc` does not exist.
- Text `On this page` does not exist.

Extend the existing component-detail TOC test to keep asserting `.docs-toc`
exists and links to `#shadcn-button-demo`.

**Verify**: `bun run test -- src/scene.test.ts --grep "documentation search|table of contents|sidebar"` -> the new route-scoping assertions should fail before implementation because `.docs-toc` currently exists on non-component routes. Existing search behavior should still pass.

### Step 2: Add browser viewport tests for the responsive shell

In `tests/e2e/docs.test.ts`, add a `playwrightTest` with a name containing
`docs shell` so it can be filtered.

Cover these viewports and routes:

- Desktop component detail: set viewport `{ width: 1280, height: 900 }`, go to
  `/components/shadcn/button`, assert `.docs-sidebar`, `#main-content`, and
  `.docs-toc` are visible and ordered left-to-right by bounding boxes.
- Desktop non-component route: go to `/docs`, assert `.docs-sidebar` and
  `#main-content` are visible, `.docs-toc` has count `0`, and the main column
  has no blank right-rail gap large enough to look like a missing sidebar.
- Mobile component detail: set viewport `{ width: 390, height: 844 }`, go to
  `/components/shadcn/button`, assert `.docs-sidebar` appears before
  `#main-content`, `.docs-toc` has count `0` or is not visible, search input is
  inside the viewport, and `document.documentElement.scrollWidth <= window.innerWidth + 1`.

Use helpers already present in `tests/e2e/docs.test.ts` such as `visibleBox`,
`expectBoxInside`, and `expectNoHeaderMainOverlap` where useful.

**Verify**: `bunx playwright test tests/e2e/docs.test.ts --grep "docs shell"` -> this should fail before implementation on at least the non-component TOC and responsive geometry expectations.

### Step 3: Split the sidebar into explicit search and component navigation sections

In `src/main.ts`, keep `componentSearchView(model)` as the search behavior
owner, but make the sidebar structure explicit:

- Add a `componentNavigationView(model, groups)` helper that owns the
  `h.nav([h.AriaLabel('Component navigation')], ...)` currently embedded in
  `sidebarView`.
- Update `sidebarView` to render two sibling sections:
  - `.docs-sidebar-section.docs-sidebar-search` containing
    `componentSearchView(model)`.
  - `.docs-sidebar-section.docs-sidebar-components` containing a visible
    section heading such as `Components` and `componentNavigationView`.
- Keep the existing `All components` link text and route. It must remain the
  first navigation target in the left sidebar.
- Preserve `h.DataAttribute('pagefind-ignore', '')` on the sidebar so Pagefind
  does not index navigation chrome.

Do not change search messages, commands, or Pagefind state.

**Verify**: `bun run test -- src/scene.test.ts --grep "documentation search|sidebar"` -> the sidebar/search structure assertions pass, and the existing search clear/filter test still passes.

### Step 4: Render "On this page" only for component detail routes

In `src/main.ts`, change the TOC rendering so the `.docs-toc` aside is not in
the DOM for non-component routes.

Preferred shape:

- Keep `tableOfContentsComponent(model)` as the route-to-component selector.
- Change `tableOfContentsView(model)` to return `Option.match(maybeComponent, { onNone: () => h.empty, onSome: component => ... })`.
- Pass the concrete `component` into the inner TOC body so
  `tableOfContentsExampleLinksView` no longer needs an `Option`.
- Keep component-detail links for `#overview`, `#installation`, `#usage`,
  `#examples`, `#api`, `#accessibility`, `#quality`, `#source`, and
  `#foldkit-differences`.

Because `shellView` now structurally differs between routes with and without a
TOC, add an explicit layout class:

- `docs-layout has-toc` when `tableOfContentsComponent(model)` is `Option.some`.
- `docs-layout no-toc` when it is `Option.none`.

Use `Option.match` or a small helper; do not inspect `_tag` with a `switch`.

**Verify**: `bun run test -- src/scene.test.ts --grep "table of contents"` -> non-component routes have no `.docs-toc`, component detail still has example links.

### Step 5: Update responsive layout CSS

In `src/styles.css`, make desktop and mobile layout states explicit:

- `.docs-layout.has-toc` uses a three-column grid:
  `minmax(14rem, 18rem) minmax(0, 1fr) minmax(11rem, 14rem)`.
- `.docs-layout.no-toc` uses a two-column grid:
  `minmax(14rem, 18rem) minmax(0, 1fr)`.
- `.docs-layout.no-toc .route-frame` may grow wider than component detail
  pages, but must keep readable measure. A target max width around `960px` is
  acceptable; do not make content full-bleed.
- `.docs-sidebar-section` separates search from component navigation without
  nesting cards inside cards. Use borders, spacing, and headings rather than
  decorative cards.
- `.docs-sidebar-search` keeps the search input and results constrained inside
  the left rail. Long result URLs and component IDs must wrap or truncate
  without causing horizontal scroll.
- Below `960px`, the grid becomes one column, the sidebar is static above main,
  and the right TOC remains absent/hidden.
- Below narrow mobile widths, the search control must not overflow. If the
  current "Clear" text button is too wide, prefer a stable-width clear button
  with accessible text still present through `aria-label`.

Respect existing design constraints: no gradient orbs, no cards inside cards,
no viewport-width font scaling, and no text overflow in controls.

**Verify**: `bun run check` -> exit 0.

### Step 6: Dogfood the registry where it is low-risk, and record follow-ups

Identify dogfood opportunities while touching the shell. Do not implement every
opportunity in this plan; keep the executed changes small.

Low-risk dogfood candidates in `src/main.ts`:

- Search control: `src/registry/shadcn/input-group` already composes local
  `shadcn/input`, `shadcn/button`, and `shadcn/textarea` helpers. It can
  replace the raw `.search-control` input/button pair if the shell can preserve
  Foldkit identity through `className` overrides and existing `UpdatedSearchQuery`
  / `ClickedClearSearch` messages.
- Buttons: `src/registry/shadcn/button` exposes `view` and `linkClassName`.
  It can back copy buttons, clear buttons, and action links later. The first
  candidate is the search clear button because it is already a button with a
  simple click message.
- Badges/status chips: `statusBadgeView` is hand-rolled shell UI. A later plan
  can evaluate dogfooding `shadcn/badge` if doing so does not collapse shell
  lifecycle badges into component-preview styling.
- Scrollable sidebar: the docs sidebar uses native overflow. A later plan can
  evaluate `base-ui/scroll-area` or `shadcn/scroll-area`, but only if it keeps
  keyboard and Pagefind-ignore behavior simple.
- Component summary rows and relationship panels can eventually dogfood
  `shadcn/card` or `shadcn/item`, but not in this plan; those changes affect
  page information architecture and should get their own review.

For this plan, implement only one dogfood change if it stays within the
responsive shell work: the search clear button can use `ShadcnButton.view`, or
the full search input row can use `ShadcnInputGroup` if the resulting DOM still
passes existing search tests and does not introduce shadcn preview tokens into
the Foldkit shell unexpectedly.

If the dogfood change starts expanding scope, STOP and leave the dogfood list
as a note in the implementation summary instead of forcing it.

**Verify**:

- `bun run test -- src/scene.test.ts src/story.test.ts` -> exit 0.
- `bunx playwright test tests/e2e/docs.test.ts --grep "docs shell|documentation search|component detail"` -> exit 0.

### Step 7: Run final verification

Run the focused tests first, then full static checks:

```bash
bun run test -- src/scene.test.ts src/story.test.ts
bunx playwright test tests/e2e/docs.test.ts --grep "docs shell|documentation search|component detail"
bun run typecheck
bun run check
bun run build
```

**Verify**: every command exits 0. If Playwright fails because browsers are not
installed in the executor environment, STOP and report the exact missing-browser
message instead of deleting the browser test.

## Test plan

- Add Scene tests in `src/scene.test.ts` for:
  - left sidebar search and component navigation structure,
  - `All components` being in the sidebar and active on the component index,
  - `.docs-toc` absent on all non-component routes,
  - `.docs-toc` present on component detail and linking to example anchors.
- Add Playwright tests in `tests/e2e/docs.test.ts` for:
  - desktop component-detail three-column order,
  - desktop non-component two-column layout with no right-rail placeholder,
  - mobile single-column layout with sidebar before main and no horizontal
    overflow.
- Reuse existing search tests in `src/scene.test.ts:916-947` and
  `src/story.test.ts:324-381`; do not weaken them.

## Done criteria

All must hold:

- [ ] `Search documentation` and `All components` are rendered in the left
      sidebar on docs routes.
- [ ] `.docs-toc` and visible text `On this page` render only on
      `ComponentDetailRoute`.
- [ ] Desktop component pages use a left sidebar, main content, and right TOC;
      desktop non-component pages use a left sidebar and main content only.
- [ ] Mobile viewports do not horizontally overflow, and the sidebar stacks
      above main content.
- [ ] Existing search model/update behavior is unchanged.
- [ ] At least one concrete shell dogfood opportunity is either implemented
      safely or explicitly deferred in the implementation summary.
- [ ] `bun run test -- src/scene.test.ts src/story.test.ts` exits 0.
- [ ] `bunx playwright test tests/e2e/docs.test.ts --grep "docs shell|documentation search|component detail"` exits 0, or the executor reports a missing-browser environment blocker.
- [ ] `bun run typecheck`, `bun run check`, and `bun run build` exit 0.
- [ ] No files outside the in-scope list are modified.
- [ ] `plans/README.md` status row for Plan 113 is updated.

## STOP conditions

Stop and report back if:

- The current-state excerpts above no longer match the live code.
- Making the TOC conditional requires route changes in `src/route.ts`.
- Search behavior requires changing `SearchPagefind`, Pagefind indexing, or
  `scripts/prerender.ts`.
- Dogfooding a registry helper requires changing `src/registry/**` APIs or
  generated registry artifacts.
- Playwright viewport tests reveal broad page layout failures unrelated to the
  docs shell.
- A verification command fails twice after a focused fix attempt.

## Maintenance notes

- Keep the docs shell and component preview styling separate. ADR 0002 says the
  shell follows Foldkit identity while shadcn previews preserve shadcn/base-nova
  tokens. Dogfooding shell controls is useful, but it should not make the
  entire docs site look like a shadcn component fixture.
- The right TOC should remain component-scoped. If future docs pages need their
  own TOC, add an explicit route-aware TOC model rather than resurrecting a
  generic always-on "On this page" rail.
- Watch for Pagefind indexing regressions: sidebar and TOC chrome should keep
  `data-pagefind-ignore`.
- Future dogfood plans can target shell badges, action links, component summary
  rows, relationship panels, and sidebar scroll behavior once this responsive
  shell foundation is stable.
