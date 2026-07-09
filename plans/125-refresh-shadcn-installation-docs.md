# Plan 125: Refresh shadcn installation docs

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report; do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
> `git diff --stat 4fa5d5f2..HEAD -- README.md src/main.ts scripts/registry-common.ts src/registry/schema.ts src/registry/schema.test.ts scripts/registry-common.test.ts tests/e2e/docs.test.ts registry/docs public/r registry/index.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/103-publish-docs-and-public-registry-on-github-pages.md, plans/116-clone-shadcn-style-docs-preview.md
- **Category**: docs
- **Planned at**: commit `4fa5d5f2`, 2026-07-09

## Why this matters

Foldkit CN is now a public shadcn-compatible registry surface, but the docs
still split install guidance across a sparse README, a docs shell that shows
`bunx foldkitcn add <itemId>`, and generated docs artifacts whose
`installCommand` is always `null`. Users should see one current installation
story everywhere: configure the Foldkit CN registry, then use the shadcn CLI at
`shadcn@latest` for component installation. This also aligns the project with
the current shadcn GitHub registry guidance at
`https://ui.shadcn.com/docs/registry/github`.

## Current state

- `README.md` names the registry source/generated split and has one install
  example:

```text
README.md:43
`components.json` namespace snippet:

README.md:53
Install example:

README.md:56
bunx shadcn@latest add @foldkitcn/shadcn-button
```

- The README does not document the GitHub registry form from the current
  shadcn docs: `shadcn@latest add <owner>/<repo>/<item>`, nor does it document
  list/search/view/validate or review-before-install commands.

- `scripts/registry-common.ts` already has the canonical public item name
  transformation and namespace dependency address:

```text
scripts/registry-common.ts:242
export const publicNameForItemId = (itemId: string): string =>
  itemId.replaceAll('/', '-')

scripts/registry-common.ts:250
const publicRegistryDependencyForTarget = (target: string): string =>
  `@foldkitcn/${publicNameForItemId(target)}`
```

- `scripts/registry-common.ts` currently generates component docs artifacts
  with no install command:

```text
scripts/registry-common.ts:1323
installCommand: null,
```

- `src/registry/schema.ts` already has a schema field for generated docs
  install commands, so this work should use that field instead of inventing a
  second ad hoc contract. This field uses `OptionFromNullOr`, so decoded app
  code should read it with `Option.match`:

```text
src/registry/schema.ts:375
installCommand: S.OptionFromNullOr(S.String),
```

- `src/main.ts` currently hardcodes a local installer command for the docs
  install tab:

```text
src/main.ts:3533
const installCommandFor = (itemId: string): string =>
  `bunx foldkitcn add ${itemId}`

src/main.ts:3842
installCommandFor(component.entry.item.id),
```

- `src/main.ts` also has the docs overview page. It is currently a good place
  to add general installation guidance without creating a new route:

```text
src/main.ts:3403
const docsPageView = (): Html => {

src/main.ts:3413
h.h2([], ['Start points']),
```

- ADR 0001 keeps the registry architecture strict: generated/public registry
  output is the install boundary, and installable Foldkit source must not import
  React or upstream Base UI/Radix packages:

```text
docs/decisions/0001-foldkit-registry-architecture.md:39
Live docs URLs are discovery inputs, not parity oracles.

docs/decisions/0001-foldkit-registry-architecture.md:41
React is allowed only in origin fixture infrastructure.

docs/decisions/0001-foldkit-registry-architecture.md:43
Public installability is gated by accepted parity, schema validation,
generated registry output, examples and docs data, resolvable dependencies,
and no unaccepted required deviations.
```

- ADR 0002 says component documentation affordances include install panels and
  copy buttons, and component pages are generated from registry artifacts plus
  sidecar docs:

```text
docs/decisions/0002-foldkit-cn-documentation-site.md:28
Component documentation affordances are inspired by `https://ui.shadcn.com/`:
component index, sidebar taxonomy, search, install panel, copy buttons, usage,
examples, API, quality/provenance, source links, and table of contents.

docs/decisions/0002-foldkit-cn-documentation-site.md:35
Component pages are generated from registry artifacts plus hand-authored
sidecar docs.
```

- Repo commands from `package.json`:

```text
package.json:8
"build": "vite build",

package.json:13
"typecheck": "tsc --noEmit",

package.json:15
"test": "vitest run",

package.json:17
"check": "ultracite check --disable-nested-config",

package.json:20
"registry:check": "bun run scripts/check-registry.ts",

package.json:21
"registry:build": "bun run scripts/build-registry.ts",
```

## External reference

Read `https://ui.shadcn.com/docs/registry/github` before editing. The relevant
current contract from that page is:

- public GitHub registries install with `shadcn@latest add <owner>/<repo>/<item>`;
- the root `registry.json` defines items;
- useful commands include `list`, `search`, `view`, and `registry validate`;
- item refs can use `#branch`, `#tag`, or a commit SHA;
- review guidance includes `shadcn view`, `shadcn add --dry-run`, `--diff`, and
  `--view`.

Do not copy the example project names from the shadcn docs into this repo's
user-facing docs. Translate them to Foldkit CN placeholders and examples.

## Commands you will need

| Purpose                                 | Command                                                                                                                                                                                                  | Expected on success                                                                    |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Focused docs generation tests           | `bun run test -- scripts/registry-common.test.ts src/registry/schema.test.ts`                                                                                                                            | exit 0; generated docs artifacts encode shadcn install commands                        |
| Build generated registry/docs artifacts | `bun run registry:build`                                                                                                                                                                                 | exit 0; updates `registry/docs/**`, `registry/index.json`, and `public/r/**` as needed |
| Registry validation                     | `bun run registry:check`                                                                                                                                                                                 | exit 0                                                                                 |
| Focused docs e2e                        | `bunx playwright test tests/e2e/docs.test.ts --grep "installation"`                                                                                                                                      | exit 0; install docs show `shadcn@latest`, not `foldkitcn add`                         |
| Typecheck                               | `bun run typecheck`                                                                                                                                                                                      | exit 0, no TypeScript errors                                                           |
| Lint/check                              | `bun run check`                                                                                                                                                                                          | exit 0                                                                                 |
| Full build                              | `bun run build`                                                                                                                                                                                          | exit 0                                                                                 |
| Diff whitespace                         | `git diff --check -- README.md src/main.ts scripts/registry-common.ts src/registry/schema.ts src/registry/schema.test.ts scripts/registry-common.test.ts tests/e2e/docs.test.ts registry public/r plans` | exit 0                                                                                 |

## Scope

**In scope**:

- `README.md`
- `src/main.ts`
- `scripts/registry-common.ts`
- `src/registry/schema.ts`, only if the existing `installCommand` field needs a
  description or schema-adjacent test support
- `src/registry/schema.test.ts`
- `scripts/registry-common.test.ts`
- `tests/e2e/docs.test.ts`
- generated artifacts from `bun run registry:build` under `registry/**` and
  `public/r/**`
- `plans/README.md` status row for this plan

**Out of scope**:

- `src/installer/**` and the local `foldkitcn add` implementation. This plan
  changes public docs and generated install metadata, not the local installer.
- Any component source under `src/registry/base-ui/**` or
  `src/registry/shadcn/**`.
- Registry manifest source under `registry-src/**`, unless a docs sidecar is
  the only existing location for a user-facing installation explanation.
- GitHub Actions, Pages deployment settings, or repository visibility.
- Creating a new docs route unless the existing `/docs` overview cannot hold
  the general installation guidance cleanly.
- Changing public item names away from the existing `publicNameForItemId`
  convention.

## Git workflow

- Branch: `codex/125-refresh-shadcn-installation-docs`.
- Commit style: conventional commits, for example
  `docs: refresh shadcn installation guidance`.
- Do not push or open a PR unless the operator explicitly asks.

## Steps

### Step 1: Make generated docs artifacts carry the public shadcn install command

In `scripts/registry-common.ts`, add a small helper near
`publicNameForItemId` so public install addresses are generated from the same
name transformation used by public registry items:

```text
export const publicRegistryAddressForItemId = (itemId: string): string =>
  `@foldkitcn/${publicNameForItemId(itemId)}`

export const publicInstallCommandForItemId = (itemId: string): string =>
  `bunx shadcn@latest add ${publicRegistryAddressForItemId(itemId)}`
```

Use this helper when building `ComponentDocsArtifact`:

- installable rows get `installCommand:
publicInstallCommandForItemId(item.id)`;
- preview/private/planned rows keep `installCommand: null`.

Keep `publicRegistryDependencyForTarget` aligned with the new helper instead of
duplicating the string template.

Update `scripts/registry-common.test.ts` so at least one installable docs
artifact, preferably `shadcn/button`, asserts:

```text
installCommand === 'bunx shadcn@latest add @foldkitcn/shadcn-button'
```

Update `src/registry/schema.test.ts` fixture data from `installCommand: null`
to a real command for the installable `shadcn/button` artifact.

**Verify**:
`bun run test -- scripts/registry-common.test.ts src/registry/schema.test.ts`
-> exit 0.

### Step 2: Make component pages render the generated shadcn command

In `src/main.ts`, replace the local installer fallback in `installCommandFor`
with the shadcn namespace command:

```text
const publicRegistryItemNameFor = (itemId: string): string =>
  itemId.replaceAll('/', '-')

const installCommandFor = (itemId: string): string =>
  `bunx shadcn@latest add @foldkitcn/${publicRegistryItemNameFor(itemId)}`
```

Then update `installationSectionView` so it prefers the generated
`artifact.installCommand` when present. `installCommand` is decoded as an
`Option`, so use `Option.match` instead of `??`:

```text
const installCommand = Option.match(component.maybeDocsArtifact, {
  onNone: () => installCommandFor(component.entry.item.id),
  onSome: artifact =>
    Option.match(artifact.installCommand, {
      onNone: () => installCommandFor(component.entry.item.id),
      onSome: command => command,
    }),
})
```

Use that value in the CLI tab. Keep the Manual tab intact.

Adjust the installation paragraph to make the prerequisite explicit without
turning the component page into a full tutorial. Suggested text:

```text
After adding the Foldkit CN registry to components.json, install the component
with the shadcn CLI and import it from the generated local namespace.
```

Do not mention `foldkitcn add` in the public component installation UI.

**Verify**:
`bun run typecheck`
-> exit 0.

### Step 3: Add general installation guidance to README and the docs overview

Update `README.md` to add a clearer installation section before or inside
`Publishing`. It must cover:

- use `bunx shadcn@latest` in every command example;
- namespace setup via `components.json`:

```json
{
  "registries": {
    "@foldkitcn": "https://<owner>.github.io/<repo>/r/{name}.json"
  }
}
```

- component install via namespace:

```bash
bunx shadcn@latest add @foldkitcn/shadcn-button
```

- GitHub registry install form from the shadcn docs:

```bash
bunx shadcn@latest add <owner>/<repo>/shadcn-button
```

- discovery and review commands:

```bash
bunx shadcn@latest list <owner>/<repo>
bunx shadcn@latest search <owner>/<repo> --query button
bunx shadcn@latest view <owner>/<repo>/shadcn-button
bunx shadcn@latest registry validate <owner>/<repo>
bunx shadcn@latest add <owner>/<repo>/shadcn-button --dry-run
```

- a short safety note: review the repository, root `registry.json`, item files,
  dependencies, registry dependencies, and generated targets before installing
  from a registry you do not control.

Update `docsPageView` in `src/main.ts` with a compact "Installation" section
that mirrors the README at a high level:

- show the `components.json` namespace snippet;
- show one component install command:
  `bunx shadcn@latest add @foldkitcn/shadcn-button`;
- mention the GitHub direct form
  `bunx shadcn@latest add <owner>/<repo>/shadcn-button`;
- link users to component pages for item-specific commands.

Use existing docs primitives such as `docsCodePanel`, `docsLinkButtonClassName`,
and regular semantic headings/paragraphs. Do not add a marketing hero or a new
visual system.

**Verify**:
`bun run typecheck`
-> exit 0.

### Step 4: Add install docs regression coverage

In `tests/e2e/docs.test.ts`, add a focused test whose name includes
`installation` so the grep command is useful. The test should:

1. Visit `/components/shadcn/button`.
2. Assert the CLI tab shows
   `bunx shadcn@latest add @foldkitcn/shadcn-button`.
3. Assert the page does not contain `bunx foldkitcn add shadcn/button` or
   `foldkitcn add`.
4. Click the `Manual` tab and assert manual source still renders.
5. Visit `/docs`.
6. Assert the general installation section includes `components.json`,
   `@foldkitcn`, `bunx shadcn@latest add @foldkitcn/shadcn-button`, and the
   direct GitHub placeholder `<owner>/<repo>/shadcn-button`.

Use the existing Playwright style in this file:

```text
import { expect as playwrightExpect, test as playwrightTest } from '@playwright/test'
```

Prefer accessible locators and visible text. Avoid screenshot assertions for
this docs-copy change.

**Verify**:
`bunx playwright test tests/e2e/docs.test.ts --grep "installation"`
-> exit 0.

### Step 5: Rebuild generated registry artifacts and run final gates

Run `bun run registry:build` so generated docs artifacts and public registry
outputs reflect the new install command metadata.

Then run:

- `bun run registry:check`
- `bun run test -- scripts/registry-common.test.ts src/registry/schema.test.ts`
- `bunx playwright test tests/e2e/docs.test.ts --grep "installation"`
- `bun run typecheck`
- `bun run check`
- `bun run build`
- `git diff --check -- README.md src/main.ts scripts/registry-common.ts src/registry/schema.ts src/registry/schema.test.ts scripts/registry-common.test.ts tests/e2e/docs.test.ts registry public/r plans`

All commands must exit 0.

## Test plan

- `scripts/registry-common.test.ts` proves generated docs artifacts encode the
  public shadcn install command.
- `src/registry/schema.test.ts` keeps the schema fixture aligned with non-null
  install commands on installable artifacts.
- `tests/e2e/docs.test.ts` proves the public docs UI shows
  `shadcn@latest`, does not leak `foldkitcn add`, preserves Manual source, and
  includes general registry setup guidance.
- `bun run registry:check` proves generated registry artifacts are still valid.

## Done criteria

All must hold:

- [ ] `README.md` documents namespace setup, GitHub registry install form,
      list/search/view/validate, dry-run review, and uses `bunx shadcn@latest`
      for every public install command.
- [ ] Component pages render `bunx shadcn@latest add @foldkitcn/<public-name>`
      for installable rows.
- [ ] Public docs do not render `bunx foldkitcn add` or `foldkitcn add` as the
      recommended component installation path.
- [ ] Generated installable component docs artifacts contain non-null
      `installCommand` values using `shadcn@latest`.
- [ ] `bun run registry:build` has refreshed any required generated files.
- [ ] All commands in Step 5 exit 0.
- [ ] `git status --short` shows only in-scope files changed for this plan,
      plus pre-existing unrelated work that the executor did not touch.
- [ ] `plans/README.md` marks Plan 125 `DONE` only after the verification gates
      above pass.

## STOP conditions

Stop and report back if:

- The current shadcn CLI behavior no longer supports `@foldkitcn/<item>` or
  GitHub `owner/repo/item` addresses with `shadcn@latest`.
- The implementation appears to require changing `src/installer/**` or
  removing the local `foldkitcn add` tool.
- Correct install commands require hardcoding a personal owner/repo instead of
  placeholders or generated public namespace addresses.
- Generated public item names no longer come from `publicNameForItemId`.
- Any installable docs command would point at a non-installable, private,
  planned, or docs-only row.
- Verification requires touching component implementation source under
  `src/registry/base-ui/**` or `src/registry/shadcn/**`.

## Maintenance notes

- Keep the README and docs-site install examples in sync with
  `scripts/registry-common.ts`. The generated docs artifact's
  `installCommand` should be the durable data boundary for component pages.
- The local `foldkitcn add` installer can remain useful for development, but it
  is no longer the public installation command shown to users.
- If the project later publishes under a stable GitHub owner/repo or registry
  directory entry, update the placeholders and tests in one follow-up plan
  rather than mixing that release decision into this docs normalization.
