# Toast

## Overview

Toast is a Foldkit-native Base UI primitive for unstyled notification surfaces.
It models the lifecycle of transient notices, their viewport position, stacking
order, pause and resume state, swipe dismissal, and promise-driven status
updates.

## Foldkit Model

Toast is a stateful primitive with a pure state model and helper functions for
adding, updating, closing, pausing, resuming, and removing toasts. The model
stores the toast list, viewport timing state, and the counters needed to keep
toast ids deterministic.

## Usage

Create toast state in the parent and render the primitive through `toView`.
The caller chooses how to lay out the provider, portal, viewport, and toast
parts.

```ts
const state = Toast.createToastState({
  toasts: [
    {
      id: 'saved',
      title: 'Saved',
      description: 'Your changes were stored.',
      type: 'success',
    },
  ],
})

Toast.view<Message>({
  id: 'notifications',
  state,
  onClose: request => ClosedToast(request),
  onAction: press => PressedToastAction(press),
  onViewportInteraction: interaction => ChangedViewport(interaction),
  toView: attributes =>
    h.div(
      [...attributes.provider],
      [
        h.div(
          [...attributes.portal],
          [h.div([...attributes.viewport.root], [])],
        ),
      ],
    ),
})
```

The primitive also exposes `positioner` and `arrow` part renderers for anchored
layouts. Keep them unstyled here; later wrappers can layer visual treatment on
top.

## Examples

The registry examples start with origin-style trigger buttons and an empty
viewport. They mirror the origin example set: Anchored toasts, Custom position,
Undo action, Waiting for result, Custom, Deduplicated toast, and Varying
heights.

The example-local classes only make the notification surface easier to inspect
in the docs shell. The primitive itself stays unstyled.

## Accessibility

The viewport is a live region. Toast roots use dialog semantics, high-priority
toasts escalate to `alertdialog`, and close or action buttons remain standard
buttons. Toasts stay keyboard-focusable, support Escape-to-close, and expose the
expected `aria-labelledby` and `aria-describedby` relationships when title and
description parts are rendered.

## Foldkit Differences

The origin Base UI Toast implementation uses React context, hooks, and a toast
manager store. This registry item keeps the notification model explicit in
Foldkit state, messages, and pure helper functions, so no hidden global manager
is needed.
