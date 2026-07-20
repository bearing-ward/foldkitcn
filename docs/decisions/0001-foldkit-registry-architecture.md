# 0001: Foldkit Registry Architecture

## Status

Accepted.

## Context

This repository is becoming a Foldkit-native registry for high-fidelity ports of Base UI and shadcn components, plus docs, examples, themes, blocks, charts, and later custom/private registries. The registry needs durable conventions before component work begins so that origin evidence, installable source, generated output, parity checks, and future docs all share the same vocabulary.

The live Foldkit code in `repos/foldkit/` remains the canonical framework reference. Origin repositories such as `repos/base-ui/`, `repos/ui/`, and `repos/components.build/` are read-only evidence sources, not runtime dependencies for installable Foldkit code.

## Decision

This is a Foldkit-native registry. Origin APIs are reference material; public APIs must use Foldkit `Model`, `Message`, `init`, `update`, `view`, Submodel, OutMessage, commands, and `toView` or named part-renderer composition where appropriate.

All boundary data is schema-backed with Effect Schema. Registry manifests, Origin provenance dossiers, dependency classifications, theme tokens, parity result records, docs data, component `Model`, component `Message`, and route data are declared as schemas, and TypeScript types derive from those schemas.

The editable source of truth is `registry-src/<namespace>/<item>/`. Generated or public registry output lives under `registry/`, `public/r/`, or `dist/` and is not hand-edited.

Item IDs are path-like and must match their folder path, such as `base-ui/button`, `shadcn/button`, `shadcn/blocks/sidebar-01`, `shadcn/charts/area`, `utils/cn`, `themes/default`, and `local/acme-widget`.

Every upstream-derived item is pinned to immutable origin provenance: origin library, docs URL, source URL, local repo path, git ref or commit, source/docs/examples/tests inventory, and inventory hash.

Source manifests are human-authored `item.json` files validated by shared Effect schemas. Generated hashes, computed dependency graphs, parity run results, drift reports, and generated docs URLs do not belong in `item.json`.

Registry dependency lanes reflect where a dependency is consumed. `dependencies.registry` contains only local registry items required by installed runtime source. `dependencies.examples` contains local registry items used only by documentation and example composition; these remain visible in generated docs but do not expand installer or public shadcn registry closure. External runtime packages remain in `dependencies.runtime`, and fixture-only packages remain in `dependencies.development`.

Base UI namespace items are unstyled behavior primitives by default. Origin styled demos become executable examples layered on top.

shadcn namespace items are styled Foldkit wrappers and compositions that depend on local registry primitives instead of upstream Base UI or Radix React packages.

shadcn items that reference Base UI must depend on local `base-ui/*` items. They must not duplicate those primitives and must not import upstream packages.

Themes are registry items and theme packs. Component folders declare consumed tokens; theme packs declare covered namespaces and items.

Blocks are first-class registry items whose runtime requirements must be met locally. A block plan expands into a dependency-complete batch when required.

Charts are gated on an explicit native chart foundation. Chart requests are recognized by the registry vocabulary, but chart items remain deferred until that foundation exists.

Live docs URLs are discovery inputs, not parity oracles. Parity compares local pinned-origin fixtures against local Foldkit implementations.

React is allowed only in origin fixture infrastructure. React, React DOM, Radix React packages, upstream Base UI React packages, and local origin repo paths are not allowed in installable Foldkit runtime source.

Public installability is gated by accepted parity, schema validation, generated registry output, examples and docs data, resolvable dependencies, and no unaccepted required deviations.

Lifecycle is multi-dimensional: implementation status, parity status, drift status, and availability are tracked independently. They must not collapse into one overloaded enum.

Upstream drift is visible but non-blocking by default because pinned components remain reproducible until an explicit upgrade plan accepts new evidence.

The future playground exports drafts into the registry workflow. It must not mutate accepted registry items directly.

`components.build` principles are advisory standards captured in docs and checklists. Local schemas, tests, and parity checks enforce acceptance.

The first proving batch after this plan is `base-ui/button` plus `shadcn/button`. That batch must be produced as its own plan by the registry component-planning skill; Button is not implemented by this foundation plan.

## Consequences

High fidelity has a real cost. Component work proceeds in small dependency-complete batches rather than wide shallow imports.

The source/generated split adds build and validation steps, but it keeps human-authored intent separate from computed hashes, dependency graphs, drift reports, and generated installable output.

Origin code can inform fixtures, dossiers, and parity expectations, but installable Foldkit source must stay independent of React and upstream implementation packages.

The multi-dimensional lifecycle makes registry state more verbose, but it avoids hiding important distinctions such as implemented-but-not-accepted, accepted-but-upstream-drifted, or private-but-ready-for-preview.

## Non-Goals

This decision does not implement any real `base-ui/button` or `shadcn/button` runtime component.

This decision does not rewrite the starter app into the final registry documentation site.

This decision does not fetch or update upstream submodules.
