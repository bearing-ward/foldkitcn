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
