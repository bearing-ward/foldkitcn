# Plan 103: Publish docs and public registry on GitHub Pages

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report; do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
> `git diff --stat 9149f910..HEAD -- package.json vite.config.ts index.html .github scripts src registry public docs plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding. On a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: Plan 066 (`docs:prerender`), Plan 069 (`foldkitcn` installer)
- **Category**: direction
- **Planned at**: commit `9149f910`, 2026-07-04

## Why this matters

Foldkit CN is close to being useful outside this checkout: it has a generated
docs site, installable component manifests, and an installer, but no checked-in
GitHub Pages deployment or public registry endpoint. A Pages deployment should
serve both the documentation shell and stable registry JSON so users can install
items from URLs instead of cloning the repo. This plan turns the existing
generated registry boundary into a hosted `/r/` endpoint while keeping Foldkit
CN's internal schema and installer intact.

GitHub Pages can publish a Vite build through a GitHub Actions artifact. GitHub
documents that Pages sites are publicly available even when the repository is
private, and GitHub Free repositories must be public to use Pages. The shadcn
registry docs require schema-valid JSON over HTTP; namespaced registries need a
URL template containing `{name}`. If this repo needs to be used with the public
shadcn registry directory, the registry must also be open source and publicly
accessible. For direct URL or `components.json` namespace usage, the generated
Pages endpoint only needs to be reachable by the CLI.

## Current state

- `package.json` already has the build and docs publishing primitives, but no
  deployment script:

```json
// package.json:5-22
"scripts": {
  "dev": "vite",
  "devtools-mcp": "foldkit-devtools-mcp",
  "build": "vite build",
  "preview": "vite preview",
  "docs:prerender": "bun run scripts/prerender.ts",
  "docs:live-preview-gaps": "bun run scripts/report-docs-live-preview-gaps.ts",
  "docs:search": "pagefind",
  "typecheck": "tsc --noEmit",
  "format": "oxfmt --write .",
  "test": "vitest run",
  "lint": "oxlint",
  "check": "ultracite check --disable-nested-config",
  "fix": "ultracite fix",
  "foldkitcn": "bun run src/installer/entry.ts",
  "registry:check": "bun run scripts/check-registry.ts",
  "registry:build": "bun run scripts/build-registry.ts"
}
```

- `vite.config.ts` has no GitHub Pages base-path handling. Project Pages for a
  repo named `foldkitcn` normally serves from `/<repo>/`, while an organization
  root site or custom domain serves from `/`:

```ts
// vite.config.ts:1-10
import { foldkit } from '@foldkit/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), foldkit({ devToolsMcpPort: 9988 })],
  optimizeDeps: {
    entries: ['src/entry.ts'],
  },
})
```

- The docs app imports generated registry data at build time. This supports the
  website, but it does not create an HTTP registry endpoint by itself:

```ts
// src/data.ts:6-14
import progressReportJson from '../docs/component-conversion-checklist.json'
import docsIndexJson from '../registry/docs/index.json'
import registryIndexJson from '../registry/index.json'
import {
  ComponentDocsArtifact,
  ComponentDocsIndex,
  OriginComponentProgressReport,
  RegistryIndex,
} from './registry/schema'
```

```ts
// src/data.ts:54-70
const docsArtifactModules = import.meta.glob<unknown>(
  '../registry/docs/**/*.json',
  {
    eager: true,
    import: 'default',
  },
)

const docsArtifactModulePathFor = (route: ComponentDocsRoute): string =>
  `../${route.docsArtifactPath}`

const rawDocsArtifactFor = (route: ComponentDocsRoute): unknown => {
  const modulePath = docsArtifactModulePathFor(route)
  const rawArtifact = docsArtifactModules[modulePath]

  if (rawArtifact === undefined) {
    throw new Error(`Generated docs artifact is not importable: ${modulePath}`)
  }
```

- Routes are parsed from the URL path without a visible deployment-base strip.
  If the app is hosted at `/foldkitcn/`, direct navigation to
  `/foldkitcn/components/shadcn/button` will otherwise look like an unknown
  route unless routing is made base-aware:

```ts
// src/route.ts:43-85
export const homeRouter = pipe(root, mapTo(HomeRoute))
export const docsRouter = pipe(literal('docs'), mapTo(DocsRoute))
export const componentsIndexRouter = pipe(
  literal('components'),
  mapTo(ComponentsIndexRoute),
)
export const componentDetailRouter = pipe(
  literal('components'),
  slash(string('namespace')),
  slash(string('slug')),
  mapTo(ComponentDetailRoute),
)
export const routeParser = oneOf(
  componentDetailRouter,
  componentsNamespaceRouter,
  componentsIndexRouter,
  registrySchemaRouter,
  registryLifecycleRouter,
  registryRouter,
  roadmapRouter,
  docsRouter,
  homeRouter,
)

export const urlToAppRoute = parseUrlWithFallback(routeParser, NotFoundRoute)
```

- `scripts/prerender.ts` already creates static HTML for generated docs routes,
  but it assumes the preview server is rooted at `/`:

```ts
// scripts/prerender.ts:21-24
const PREVIEW_HOST = '127.0.0.1'
const PREVIEW_PORT = 4174
const PREVIEW_BASE_URL = `http://${PREVIEW_HOST}:${PREVIEW_PORT}`
```

```ts
// scripts/prerender.ts:261-274
yield *
  Effect.tryPromise({
    try: () =>
      page.evaluate(urlPath => {
        window.history.replaceState(null, '', urlPath)
        window.dispatchEvent(new CustomEvent('foldkit:urlchange'))
      }, entry.path),
    catch: error => error,
  })
```

- The internal generated registry index is schema-backed and currently written
  to `registry/index.json`. It includes Foldkit CN metadata, hashes, and source
  artifact records; it is not the shadcn registry wire format:

```ts
// scripts/registry-common.ts:250-273
return {
  item: manifest,
  manifestHash: hashJson(entry.rawManifest),
  artifacts: [manifestArtifact, ...sourceArtifacts],
}
const index = {
  schemaVersion: 1,
  generatedAt: options.generatedAt ?? new Date().toISOString(),
  sourceRoot: registrySourceRoot,
  items,
}

const decodedIndex = S.decodeUnknownSync(RegistryIndex)(index)

return {
  ...decodedIndex,
  generatedAt: selectRegistryGeneratedAt(decodedIndex, {
    previousIndex: options.previousIndex,
    generatedAt: options.generatedAt,
  }),
}
```

- Registry docs routes are generated under `/components/<item-id>`, which should
  remain the public docs URL shape:

```ts
// scripts/registry-common.ts:276-282
export const componentDocsRouteForItem = (
  item: RegistryItemManifest,
): ComponentDocsRoute => ({
  itemId: item.id,
  routePath: `/components/${item.id}`,
  docsArtifactPath: `registry/docs/${item.id}.json`,
})
```

- The local installer reads the internal index from disk. Do not replace this
  behavior in this plan; the hosted shadcn-compatible endpoint is additive:

```ts
// src/installer/cli.ts:16-18
const VERSION = '0.1.0'
const DEFAULT_REGISTRY_INDEX_PATH = 'registry/index.json'
```

```ts
// src/installer/cli.ts:48-72
export const makeAddCommand = (handleAdd: AddHandler = defaultAddHandler) =>
  Command.make(
    'add',
    {
      itemId: Argument.string('item-id').pipe(
        Argument.withDescription(
          'Registry item id, for example shadcn/button.',
        ),
      ),
```

- ADR constraints to preserve:
  - `docs/decisions/0001-foldkit-registry-architecture.md` says editable source
    lives in `registry-src/<namespace>/<item>/`, while generated/public output
    may live under `registry/`, `public/r/`, or `dist/`.
  - `docs/decisions/0002-foldkit-cn-documentation-site.md` says the docs site
    consumes generated registry/docs artifacts and should show public
    namespace-explicit routes like `/components/shadcn/button`.
  - `docs/decisions/0003-effect-native-tooling.md` says new registry,
    docs-generation, and installer CLIs should use Effect programs and
    Schema-derived boundary types.

## Commands you will need

| Purpose                | Command                                                                                             | Expected on success                                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Registry generation    | `bun run registry:build`                                                                            | exit 0; internal and public registry artifacts are current                                                                             |
| Registry check         | `bun run registry:check`                                                                            | exit 0; validates source manifests and generated artifacts                                                                             |
| Focused registry tests | `bun run test -- scripts/registry-common.test.ts src/installer/installer.test.ts src/route.test.ts` | exit 0; if `src/route.test.ts` does not exist before the plan, create it or add equivalent route tests to the existing route test file |
| Focused docs tests     | `bun run test -- src/data.test.ts src/scene.test.ts`                                                | exit 0                                                                                                                                 |
| Typecheck              | `bun run typecheck`                                                                                 | exit 0                                                                                                                                 |
| Lint/check             | `bun run check`                                                                                     | exit 0                                                                                                                                 |
| Build                  | `bun run build`                                                                                     | exit 0                                                                                                                                 |
| Prerender              | `bun run docs:prerender`                                                                            | exit 0; static route HTML exists in `dist`                                                                                             |
| Search index           | `bun run docs:search`                                                                               | exit 0; `dist/pagefind` exists                                                                                                         |
| Public registry smoke  | `test -f dist/r/registry.json && test -f dist/r/shadcn-button.json`                                 | exit 0                                                                                                                                 |
| Pages workflow syntax  | `git diff --check -- .github package.json vite.config.ts scripts src registry public plans`         | exit 0                                                                                                                                 |

Use `bun`, not `npm` or `pnpm`, because this repo has `bun.lock` and
`package.json` scripts are written for Bun.

## Suggested executor toolkit

- Use the `foldkit` skill if available for route/model/test conventions.
- Use the official GitHub Pages docs for the Actions artifact shape:
  `https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site`
- Use the Vite GitHub Pages deployment guide for `base` behavior:
  `https://vite.dev/guide/static-deploy#github-pages`
- Use the shadcn registry docs for registry wire-format requirements:
  `https://ui.shadcn.com/docs/registry/getting-started`,
  `https://ui.shadcn.com/docs/registry/registry-item-json`, and
  `https://ui.shadcn.com/docs/registry/namespace`.

## Scope

**In scope**:

- `.github/workflows/pages.yml` (create)
- `package.json`
- `vite.config.ts`
- `src/route.ts`
- `src/route.test.ts` or the existing route test file if one already exists
- `scripts/prerender.ts`
- `scripts/build-registry.ts`
- `scripts/registry-common.ts`
- `scripts/registry-common.test.ts`
- `src/registry/schema.ts`
- `src/registry/schema.test.ts`
- `src/registry/validation.ts` only if public registry artifact validation
  naturally belongs there
- `src/data.test.ts` and `src/scene.test.ts` only for public URL/display smoke
  coverage
- Generated public registry artifacts under `public/r/**` (create)
- Generated internal artifacts under `registry/**` only when changed by
  `bun run registry:build`
- `README.md` docs for published Pages and registry usage
- `plans/README.md`

**Out of scope**:

- Do not rewrite the local `foldkitcn add` installer to fetch HTTP registries.
  That can be a later plan; this plan only publishes shadcn-compatible JSON and
  documents the direct URL / namespace usage.
- Do not change any component implementation under `src/registry/base-ui/**` or
  `src/registry/shadcn/**`.
- Do not change registry source manifests under `registry-src/**` unless a
  validation bug proves the existing manifests cannot be represented in the
  public registry shape.
- Do not add custom domain DNS files or settings unless the operator gives an
  exact domain. A `CNAME` file alone is not enough; GitHub settings still own
  the custom domain.
- Do not publish, push, or alter repository visibility. The human owner handles
  GitHub settings.
- Do not submit to the shadcn registry directory in this plan.

## Git workflow

- Branch: use the current branch unless the operator instructs otherwise. If
  creating a branch manually, use `codex/103-github-pages-public-registry`.
- Commit style: recent history uses Conventional Commits, for example
  `feat: add shadcn date picker` and `chore: add Codex hook config`.
- Suggested commit message after execution:
  `feat: publish docs registry on github pages`
- Do not push or open a PR unless explicitly instructed.

## Steps

### Step 1: Add a base-path configuration boundary

Add a small base-path helper instead of hard-coding `/foldkitcn/` throughout
the app.

Recommended shape:

- In `vite.config.ts`, set `base` from an environment variable:
  - `process.env.FOLDKITCN_BASE_PATH ?? '/'`
  - The value must always start and end with `/`.
  - If the value is invalid, throw an `Error` during config evaluation.
- In `src/route.ts`, add and export a pure helper that strips the deployment
  base from URL pathnames before parsing:
  - Use `import.meta.env.BASE_URL` in browser/runtime code.
  - Treat `/` as no-op.
  - For `/foldkitcn/`, normalize:
    - `/foldkitcn/` -> `/`
    - `/foldkitcn/components/shadcn/button` -> `/components/shadcn/button`
    - `/components/shadcn/button` -> `/components/shadcn/button` for local dev
  - Preserve query/hash behavior if the Foldkit route parser expects full URL
    input; otherwise document that only pathname is normalized.
- Change `urlToAppRoute` to parse the normalized URL/path.

Add route tests. If no route test file exists, create `src/route.test.ts`.
Cover at least:

- root route at `/`
- project Pages base route at `/foldkitcn/`
- component route at `/foldkitcn/components/shadcn/button`
- local dev component route at `/components/shadcn/button`
- unknown route under the base becomes `NotFoundRoute` with the user-visible
  path stripped or clearly normalized.

**Verify**:

```sh
bun run test -- src/route.test.ts
```

Expected: exit 0. If route tests live in a different existing file, run that
file instead and record the actual command in the plan checklist before marking
DONE.

### Step 2: Make prerender aware of the deployment base

Update `scripts/prerender.ts` so it can prerender with the same base path used
by Vite.

Requirements:

- Read the base path from `process.env.FOLDKITCN_BASE_PATH ?? '/'`.
- Use the base path when waiting for and navigating the preview server.
  - For `/`, keep the existing behavior.
  - For `/foldkitcn/`, the browser should initially load
    `http://127.0.0.1:4174/foldkitcn/`.
- When replacing history for a route, prefix the route with the base path for
  the browser URL, but keep the output path base-free:
  - route `/components/shadcn/button` writes
    `dist/components/shadcn/button/index.html`
  - browser location during capture may be
    `/foldkitcn/components/shadcn/button`
- After prerender, write a `dist/404.html` fallback copied from the base app
  shell or rendered Not Found shell. This is a fallback for routes not in the
  generated inventory; it must not replace the generated component route files.
- Keep the script as an Effect program, matching ADR 0003.

**Verify**:

```sh
FOLDKITCN_BASE_PATH=/foldkitcn/ bun run build
FOLDKITCN_BASE_PATH=/foldkitcn/ bun run docs:prerender
test -f dist/index.html
test -f dist/components/shadcn/button/index.html
test -f dist/404.html
```

Expected: all commands exit 0.

### Step 3: Define public shadcn registry schemas

Add schema-backed public registry types rather than emitting ad hoc JSON.

Recommended location:

- `src/registry/schema.ts`, if the public wire schema is small.
- Or `src/registry/public-schema.ts`, if adding these shapes makes
  `schema.ts` too large. If you choose a new file, export/import it explicitly
  in scripts and tests; do not add a barrel file.

Model these minimum shapes:

- Public registry catalog:
  - `$schema`: literal `https://ui.shadcn.com/schema/registry.json`
  - `name`: `foldkitcn`
  - `homepage`: string
  - `items`: array of catalog items
- Public registry item:
  - `$schema`: literal `https://ui.shadcn.com/schema/registry-item.json`
  - `name`: public item name
  - `type`: use `registry:ui` for component/utility files unless a stronger
    shadcn type is clearly required
  - `title`
  - `description`
  - `dependencies`: npm runtime dependencies from
    `item.dependencies.runtime`
  - `registryDependencies`: public names for local registry dependencies
  - `files`: array with `path`, `type`, `target`, and `content`
- Public registry file:
  - `path`: source path from the Foldkit CN registry source
  - `type`: `registry:ui` for installable source, `registry:lib` for
    `utils/cn`
  - `target`: final target in a consumer project, such as
    `src/components/foldkitcn/shadcn/button.ts`
  - `content`: transformed source with local registry imports rewritten to the
    target layout, matching the installer rewrite behavior.

Use a stable public name function:

- `shadcn/button` -> `shadcn-button`
- `base-ui/button` -> `base-ui-button`
- `utils/cn` -> `utils-cn`
- Nested item ids replace `/` with `-`.

This keeps the public namespace simple:

```json
{
  "registries": {
    "@foldkitcn": "https://<owner>.github.io/<repo>/r/{name}.json"
  }
}
```

Then users can install:

```sh
bunx shadcn@latest add @foldkitcn/shadcn-button
```

Also support direct URL install:

```sh
bunx shadcn@latest add https://<owner>.github.io/<repo>/r/shadcn-button.json
```

Do not use bare `button` dependencies in public `registryDependencies`, because
shadcn treats bare names as built-in shadcn items, not Foldkit CN local items.
Use `@foldkitcn/base-ui-button` or full URLs for Foldkit CN dependencies.

**Verify**:

```sh
bun run test -- src/registry/schema.test.ts
```

Expected: exit 0, with tests decoding at least one catalog and one item payload.

### Step 4: Generate checked-in public registry artifacts under `public/r`

Extend `scripts/registry-common.ts` and `scripts/build-registry.ts` to generate
the public registry artifacts alongside the current internal artifacts.

Implementation details:

- Create `public/r/registry.json`.
- Create one `public/r/<public-name>.json` per installable item.
- Only include items where `item.lifecycle.availability === 'installable'`.
- Preserve `registry/index.json` as the internal source for the docs app and
  local installer.
- Preserve existing `registry/docs/**` generation.
- Reuse the installer source rewrite logic if practical. If reuse would cause a
  circular dependency, extract only the pure path/import-rewrite helpers into a
  neutral module such as `src/installer/source-rewrite.ts`, then import from
  both the installer and registry generator.
- Keep generated item files deterministic:
  - sorted by public name
  - stable JSON indentation
  - preserve generated timestamps only where the existing internal registry
    already does so
- Add `public/r/.nojekyll` if needed to keep GitHub Pages from treating any
  generated paths as Jekyll input.

Tests to add in `scripts/registry-common.test.ts`:

- `publicNameForItemId('shadcn/button') === 'shadcn-button'`
- catalog contains installable `shadcn-button`
- catalog does not include private or blocked items
- item payload for `shadcn-button` includes:
  - `name: "shadcn-button"`
  - a file targeting `src/components/foldkitcn/shadcn/button.ts`
  - dependency on `@foldkitcn/base-ui-button` and/or `@foldkitcn/utils-cn`
    where applicable
  - no `react`, `react-dom`, `@radix-ui/react-*`, `@base-ui/react*`, or
    origin repo imports in `files[].content`
- `registry:check` fails if `public/r/**` is stale.

**Verify**:

```sh
bun run registry:build
bun run registry:check
bun run test -- scripts/registry-common.test.ts src/installer/installer.test.ts
test -f public/r/registry.json
test -f public/r/shadcn-button.json
```

Expected: all commands exit 0.

### Step 5: Add the GitHub Pages workflow

Create `.github/workflows/pages.yml`.

Requirements:

- Trigger on:
  - pushes to `main`
  - `workflow_dispatch`
- Permissions:
  - `contents: read`
  - `pages: write`
  - `id-token: write`
- Concurrency:
  - group `pages`
  - `cancel-in-progress: true`
- Use Bun because the repo has `bun.lock`.
- Run:
  - checkout
  - setup Bun
  - `bun install --frozen-lockfile`
  - `bun run registry:check`
  - `bun run typecheck`
  - `bun run test`
  - `bun run check`
  - `FOLDKITCN_BASE_PATH=/${{ github.event.repository.name }}/ bun run build`
  - `FOLDKITCN_BASE_PATH=/${{ github.event.repository.name }}/ bun run docs:prerender`
  - `bun run docs:search`
  - smoke checks for:
    - `dist/index.html`
    - `dist/components/shadcn/button/index.html`
    - `dist/r/registry.json`
    - `dist/r/shadcn-button.json`
  - `actions/configure-pages`
  - `actions/upload-pages-artifact` with `path: ./dist`
  - `actions/deploy-pages`
- Set the environment to `github-pages` and URL to the deploy-pages output.

If the human owner plans to deploy from a root Pages repository
(`<owner>.github.io`) or a custom domain, change only the workflow environment
value to `FOLDKITCN_BASE_PATH=/`. Do not hard-code a custom domain in this plan.

**Verify**:

```sh
test -f .github/workflows/pages.yml
rg -n "pages: write|id-token: write|upload-pages-artifact|deploy-pages|FOLDKITCN_BASE_PATH" .github/workflows/pages.yml
git diff --check -- .github/workflows/pages.yml
```

Expected: all commands exit 0.

### Step 6: Document the GitHub settings and install URLs

Update `README.md` with a concise "Publishing" section.

Include:

- GitHub Settings -> Pages -> Build and deployment -> Source:
  `GitHub Actions`.
- Repository visibility note:
  - GitHub Free requires a public repository for Pages.
  - Pages output is publicly available even if the repository is private on a
    plan that supports private Pages.
  - Direct registry use requires the generated Pages URL to be reachable by
    the shadcn CLI.
  - Submitting to the public shadcn registry directory requires an open-source
    publicly accessible registry.
- Default project Pages URL shape:
  - `https://<owner>.github.io/<repo>/`
- Registry catalog URL:
  - `https://<owner>.github.io/<repo>/r/registry.json`
- Direct item URL:
  - `https://<owner>.github.io/<repo>/r/shadcn-button.json`
- `components.json` namespace snippet:

```json
{
  "registries": {
    "@foldkitcn": "https://<owner>.github.io/<repo>/r/{name}.json"
  }
}
```

- Install example:

```sh
bunx shadcn@latest add @foldkitcn/shadcn-button
```

Also document the custom-domain/root-site base path exception:

- If the site is deployed at `/`, set `FOLDKITCN_BASE_PATH=/` in the workflow.
- If deployed at `/<repo>/`, set `FOLDKITCN_BASE_PATH=/<repo>/`.

**Verify**:

```sh
rg -n "GitHub Pages|r/registry.json|@foldkitcn|FOLDKITCN_BASE_PATH" README.md
```

Expected: exit 0.

### Step 7: Run the full deployment verification suite

Run:

```sh
bun run registry:build
bun run registry:check
bun run typecheck
bun run test
bun run check
FOLDKITCN_BASE_PATH=/foldkitcn/ bun run build
FOLDKITCN_BASE_PATH=/foldkitcn/ bun run docs:prerender
bun run docs:search
test -f dist/index.html
test -f dist/components/shadcn/button/index.html
test -f dist/r/registry.json
test -f dist/r/shadcn-button.json
git diff --check -- .github package.json vite.config.ts scripts src registry public README.md plans
```

Expected: every command exits 0.

Optional local smoke if time permits:

```sh
bun run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Then, in another terminal:

```sh
curl -fsS http://127.0.0.1:4173/r/registry.json >/tmp/foldkitcn-registry.json
curl -fsS http://127.0.0.1:4173/r/shadcn-button.json >/tmp/foldkitcn-shadcn-button.json
```

Expected: both `curl` commands exit 0. Stop the preview server afterward.

### Step 8: Update the plan index

Update `plans/README.md` row for Plan 103 from `TODO` to `DONE` only after all
verification commands pass. If GitHub settings or repository visibility block
the actual hosted deployment after the code lands, use:

```md
BLOCKED (waiting for GitHub Pages source/visibility setting)
```

Do not mark DONE just because the workflow file exists.

**Verify**:

```sh
rg -n "\| 103 \| Publish docs and public registry on GitHub Pages \| P1 \| L \| 066, 069 \| (DONE|BLOCKED)" plans/README.md
```

Expected: exit 0.

## Test plan

- Add route normalization tests for Pages base path in `src/route.test.ts` or
  the existing route test file.
- Add public registry schema/decode tests in `src/registry/schema.test.ts`.
- Extend `scripts/registry-common.test.ts` for public registry generation,
  deterministic public names, dependency mapping, forbidden runtime imports,
  and stale artifact detection.
- Keep `src/installer/installer.test.ts` passing to prove the existing local
  installer still consumes `registry/index.json`.
- Keep `src/data.test.ts` and `src/scene.test.ts` passing to prove the docs app
  still reads generated docs artifacts and routes.
- Full verification is the command list in Step 7.

## Done criteria

All must hold:

- [ ] `.github/workflows/pages.yml` exists and uses GitHub Pages artifact
      deployment with `pages: write` and `id-token: write` permissions.
- [ ] `vite.config.ts`, `src/route.ts`, and `scripts/prerender.ts` support both
      `/` and `/<repo>/` deployment base paths.
- [ ] `public/r/registry.json` and `public/r/shadcn-button.json` are generated
      by `bun run registry:build`.
- [ ] `public/r/*.json` conforms to shadcn registry/catalog item expectations
      and contains no forbidden React/Base UI origin runtime imports.
- [ ] `bun run registry:check` fails when public registry artifacts are stale.
- [ ] `README.md` documents GitHub Pages settings, public/private visibility
      implications, the `/r/` URLs, and the `@foldkitcn` namespace snippet.
- [ ] `bun run registry:check`, `bun run typecheck`, `bun run test`,
      `bun run check`, `FOLDKITCN_BASE_PATH=/foldkitcn/ bun run build`,
      `FOLDKITCN_BASE_PATH=/foldkitcn/ bun run docs:prerender`, and
      `bun run docs:search` all exit 0.
- [ ] `dist/components/shadcn/button/index.html`,
      `dist/r/registry.json`, and `dist/r/shadcn-button.json` exist after the
      build/prerender/search sequence.
- [ ] No component implementation files under `src/registry/base-ui/**` or
      `src/registry/shadcn/**` are modified.
- [ ] `plans/README.md` status row for Plan 103 is updated.

## STOP conditions

Stop and report back if:

- The app cannot be made to support a GitHub Pages base path without changing
  Foldkit routing internals or vendored `repos/foldkit/**`.
- The shadcn CLI's current registry schema rejects `files[].content` for direct
  item URLs; in that case, stop and propose either a raw GitHub repository
  registry shape or a separate download endpoint.
- Public registry generation requires changing component source APIs or
  registry source manifests for most items.
- `bun run docs:prerender` cannot run with a non-root base path after two
  reasonable fixes.
- The human owner decides the repository cannot be public and the current
  GitHub plan does not allow private Pages. The code can still be prepared, but
  actual deployment is blocked by account settings.
- The official GitHub Pages or shadcn registry docs have changed materially
  from the URLs listed above.

## Maintenance notes

- Adding a new installable item must update both the internal registry and the
  public `/r/` output. Reviewers should check `public/r/<public-name>.json`
  whenever `registry-src/**/item.json` changes.
- The public name mapping is now part of the external contract. Changing from
  `shadcn-button` to another name is a breaking registry change for users'
  `components.json` and install commands.
- If the project later adds a custom domain, update only the workflow base path
  and README examples. Do not rewrite docs routes.
- A later plan can add HTTP registry fetching to `foldkitcn add`; this plan
  deliberately leaves the local installer on `registry/index.json`.
