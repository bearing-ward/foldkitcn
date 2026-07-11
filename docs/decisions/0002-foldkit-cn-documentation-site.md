# 0002: Foldkit CN Documentation Site

## Status

Accepted.

## Context

Foldkit CN needs a public documentation site for its registry components. The
site is a product surface for this registry, not a one-off page in the starter
app and not a clone of shadcn.com. It should help users discover installable
Foldkit components, inspect examples and provenance, and understand roadmap
status without losing the Foldkit identity established at `https://foldkit.dev/`.

The local Foldkit website source under `repos/foldkit/packages/website/`,
including `repos/foldkit/packages/website/src/styles.css`, is the canonical
local reference for Foldkit visual identity, tone, and token direction.

## Decision

The documentation site is a Foldkit-native documentation website for Foldkit
CN registry components. It must present the registry through Foldkit's product
identity rather than copying another site's brand or layout wholesale.

Visual identity and tone come from `https://foldkit.dev/` and the local Foldkit
website source under `repos/foldkit/packages/website/`.

Component documentation affordances are inspired by `https://ui.shadcn.com/`:
component index, sidebar taxonomy, search, install panel, copy buttons, usage,
examples, API, quality/provenance, source links, and table of contents.

Public component routes are namespace-explicit. Examples include
`/components/base-ui/button` and `/components/shadcn/button`.

Component pages are generated from registry artifacts plus hand-authored sidecar
docs. `registry/index.json` remains the catalog, while separate generated docs
artifacts live under `registry/docs/**`. Future `docsStatus` data belongs in
the registry/docs artifact contract, not in ad hoc route code.

Every component and example carries a behavior contract. The normative
expectations, authoring rules, and CI compliance boundary are documented in
[`docs/behavior-contracts.md`](../behavior-contracts.md).

Public navigation shows installable and preview components. Planned, private,
and blocked rows belong on Roadmap or Registry pages where their lifecycle can
be explained without implying that they are available to install.

The docs shell and component preview styling are separate concerns. The shell
follows the Foldkit identity. shadcn previews render with shadcn/base-nova
tokens so component examples can remain faithful to their registry styling.

Site-level visual parity with shadcn.com is not a goal. Component parity remains
scoped to origin component fixtures.

## Consequences

The site can use familiar documentation affordances without becoming a
shadcn.com clone.

Generated registry/docs artifacts become the stable data boundary between the
registry and the website. Runtime route code should consume those artifacts
instead of scanning source folders or deriving lifecycle state on the fly.

Documentation, roadmap, and registry pages can expose incomplete work honestly
without making planned, private, or blocked items look installable.

## Non-Goals

This decision does not implement the documentation site.

This decision does not change registry schemas or generated artifacts.

This decision does not require site-level visual parity with shadcn.com.
