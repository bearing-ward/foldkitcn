# Foldkit CN

Foldkit CN is a Foldkit-native component registry and documentation shell for installable UI primitives, shadcn-style wrappers, utilities, and future component packs.

## Documentation

The component documentation and public registry are published through GitHub
Pages at [bearing-ward.github.io/foldkitcn](https://bearing-ward.github.io/foldkitcn/).

Component and example acceptance criteria are defined in
[Behavior Contracts](docs/behavior-contracts.md). These declarations are part
of the registry schema, generated docs artifacts, and browser-test gate.

## Commands

```bash
bun run dev
bun run build
bun run typecheck
bun run test
bun run check
```

Registry artifacts are regenerated with:

```bash
bun run registry:build
```

## Project Map

- Implementation plans live in `plans/README.md`.
- Registry source lives under `registry-src`.
- Generated registry catalog data lives in `registry/index.json`.
- Generated component docs route artifacts live under `registry/docs`.
- The docs site reads generated registry artifacts; it does not read `registry-src` at runtime.

## Installation

Add the Foldkit CN Pages registry namespace to `components.json`:

```json
{
  "registries": {
    "@foldkitcn": "https://bearing-ward.github.io/foldkitcn/r/{name}.json"
  }
}
```

Install a component through that namespace:

```bash
bunx shadcn@latest add @foldkitcn/shadcn-button
```

Public GitHub registries can also be installed directly from a repository that has a root `registry.json`:

```bash
bunx shadcn@latest add <owner>/<repo>/shadcn-button
```

Useful discovery and validation commands:

```bash
bunx shadcn@latest list <owner>/<repo>
bunx shadcn@latest search <owner>/<repo> --query button
bunx shadcn@latest view <owner>/<repo>/shadcn-button
bunx shadcn@latest registry validate <owner>/<repo>
bunx shadcn@latest add <owner>/<repo>/shadcn-button --dry-run
```

Before installing from a registry you do not control, review the repository, root `registry.json`, item files, dependencies, registry dependencies, and generated targets.

## Publishing

- In GitHub Settings, open `Pages`, then set `Build and deployment` `Source` to `GitHub Actions`.
- GitHub Free requires a public repository for Pages. Pages output is public even when the repository is private on a plan that supports private Pages.
- Direct registry installs require the Pages URL to be reachable by the shadcn CLI.
- Submitting to the public shadcn registry directory requires an open-source, publicly accessible registry.

Foldkit CN is published at `https://bearing-ward.github.io/foldkitcn/`.

Registry URLs:

- Catalog: `https://bearing-ward.github.io/foldkitcn/r/registry.json`
- Item: `https://bearing-ward.github.io/foldkitcn/r/shadcn-button.json`

If the site is deployed at `/`, set `FOLDKITCN_BASE_PATH=/` in the Pages workflow. If it is deployed at `/<repo>/`, set `FOLDKITCN_BASE_PATH=/<repo>/`.
