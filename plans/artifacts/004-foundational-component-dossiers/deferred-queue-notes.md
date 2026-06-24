# Deferred Foundational Queue Notes

These rows stay in the foundational queue, but should not be handed to
component implementation workers until the named dependency layer is available
or explicitly scoped into a tiny follow-up plan.

## base-ui/toggle + shadcn/toggle

- URLs: `https://base-ui.com/react/components/toggle`,
  `https://ui.shadcn.com/docs/components/toggle`
- dependency layer: Button precedent plus pressed-state data attributes.
- blocker: the implementation plan should reuse the completed
  `base-ui/button` and `shadcn/button` decisions for `toView`, disabled
  behavior, and variant mapping instead of reopening those choices.

## base-ui/toggle-group + shadcn/toggle-group

- URLs: `https://base-ui.com/react/components/toggle-group`,
  `https://ui.shadcn.com/docs/components/toggle-group`
- dependency layer: `base-ui/toggle` and grouped single/multiple selection
  semantics.
- blocker: defer until Toggle is local so pressed-state reflection, roving
  focus, and group value canonicalization are not duplicated.

## base-ui/slider + shadcn/slider

- URLs: `https://base-ui.com/react/components/slider`,
  `https://ui.shadcn.com/docs/components/slider`
- dependency layer: pointer geometry, keyboard value stepping, thumb/track
  structure, and orientation parity.
- blocker: needs a focused geometry/value plan before implementation because
  the row is more than a static styled wrapper.

## base-ui/accordion + shadcn/accordion

- URLs: `https://base-ui.com/react/components/accordion`,
  `https://ui.shadcn.com/docs/components/accordion`
- dependency layer: `base-ui/collapsible` plus coordinated item collection
  and single/multiple disclosure state.
- blocker: defer until Collapsible is local so open/closed behavior and data
  attributes have a shared implementation precedent.

## base-ui/dialog + shadcn/dialog

- URLs: `https://base-ui.com/react/components/dialog`,
  `https://ui.shadcn.com/docs/components/dialog`
- dependency layer: shared overlay foundation, portal mounting, focus trap,
  escape handling, modal semantics, and scroll lock.
- blocker: this should wait for a shared overlay plan rather than become a
  one-off Dialog implementation.

## base-ui/popover + shadcn/popover

- URLs: `https://base-ui.com/react/components/popover`,
  `https://ui.shadcn.com/docs/components/popover`
- dependency layer: shared floating-positioning and portal layer, trigger
  ownership, anchored content placement, and outside interaction handling.
- blocker: defer until the floating/portal layer is designed so Popover and
  later menu/select rows converge on the same behavior.
