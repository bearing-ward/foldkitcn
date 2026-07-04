# Foldkit CN

Foldkit CN is a Foldkit-native component registry and documentation shell for installable UI primitives, shadcn-style wrappers, utilities, and future component packs.

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

## Publishing

- In GitHub Settings, open `Pages`, then set `Build and deployment` `Source` to `GitHub Actions`.
- GitHub Free requires a public repository for Pages. Pages output is public even when the repository is private on a plan that supports private Pages.
- Direct registry installs require the Pages URL to be reachable by the shadcn CLI.
- Submitting to the public shadcn registry directory requires an open-source, publicly accessible registry.

Project Pages usually live at `https://<owner>.github.io/<repo>/`.

Registry URLs:

- Catalog: `https://<owner>.github.io/<repo>/r/registry.json`
- Item: `https://<owner>.github.io/<repo>/r/shadcn-button.json`

`components.json` namespace snippet:

```json
{
  "registries": {
    "@foldkitcn": "https://<owner>.github.io/<repo>/r/{name}.json"
  }
}
```

Install example:

```bash
bunx shadcn@latest add @foldkitcn/shadcn-button
```

If the site is deployed at `/`, set `FOLDKITCN_BASE_PATH=/` in the Pages workflow. If it is deployed at `/<repo>/`, set `FOLDKITCN_BASE_PATH=/<repo>/`.
