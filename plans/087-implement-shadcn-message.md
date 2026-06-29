# 087 - Implement shadcn Message

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-message registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/084-implement-shadcn-attachment.md, plans/085-implement-shadcn-bubble.md, plans/086-implement-shadcn-marker.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/message` as a local chat message composition over attachment,
bubble, and marker primitives, with examples, docs artifacts, and origin parity.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-message/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-message/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/message`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/message.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/message-*.tsx`
- Origin slots include message group, message, message avatar, message content,
  message header, and message footer.

## Scope

- Add `registry-src/shadcn/message/item.json`.
- Add `src/registry/shadcn/message/index.ts`, `examples.ts`, and tests.
- Add `shadcn/message` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Compose local `shadcn/attachment`, `shadcn/avatar`, `shadcn/bubble`,
  `shadcn/button`, `shadcn/marker`, and `utils/cn`.
- Represent message alignment, role, grouping, avatar placement, header/footer
  metadata, and attachment presence with Effect Schema literals and class maps.
- Treat markdown/AI examples as deterministic fixtures unless a local markdown
  or AI foundation already exists. Do not add those foundations here.
- Preserve origin message grouping, avatar, header/footer, attachment, and
  marker examples.

## Testing

- Add tests for exported parts, role/alignment variants, avatar rendering,
  attachment composition, marker composition, class canonicalization, and
  example structure.
- Replicate all origin message examples that can be supported by local
  dependencies and add origin/Foldkit parity cases.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep message --dry-run`
  - `bun run parity:check -- --grep message`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if local attachment, bubble, or marker contracts are not complete.
- Stop if a required example needs markdown, AI runtime, or external chat
  packages in installable source.
