# 0003: Effect-Native Tooling

## Status

Accepted.

## Context

Foldkit CN is a Foldkit and Effect project. Registry, documentation-generation,
and installer tooling should preserve that architecture instead of growing a
parallel Node or Bun scripting style with hand-maintained runtime types.

The Effect CLI module has moved from `@effect/cli/*` package paths to
`effect/unstable/cli/*`. New tooling should use the current Effect-native
surface.

## Decision

New registry, docs-generation, and installer CLIs are Effect programs.

CLI argument, flag, and command modeling uses `effect/unstable/cli`.

Boundary data uses Effect Schema. Runtime types and interfaces derive from
Schema declarations instead of parallel hand-maintained TypeScript interfaces.

Existing scripts do not need a one-time rewrite, but every new script and every
touched script should move toward this standard.

The future `foldkitcn add` installer must follow this rule. Its config decoding,
item id decoding, filesystem plan decoding, generated manifest decoding, and
write-plan verification must use Effect programs and Effect Schema-derived
boundary types.

## Consequences

Tooling keeps the same error handling, dependency modeling, and data-boundary
discipline as the application and registry code.

Schema definitions remain the source of truth for runtime decoding and static
types, which reduces drift between accepted registry data and the scripts that
operate on it.

Incremental migration is allowed. A new script should start in this style, and
a touched script should move toward it when the touch changes its CLI boundary,
data decoding, or write-plan behavior.

## Non-Goals

This decision does not require a one-time rewrite of existing scripts.

This decision does not implement the `foldkitcn add` installer.
