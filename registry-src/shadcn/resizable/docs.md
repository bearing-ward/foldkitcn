# Resizable

## Overview

Foldkit-native shadcn Resizable implements split-panel layouts with local
Schema-backed state, keyboard resizing, pointer-drag messages, and shadcn
base-nova slots.

## Foldkit Model

Use `resizableState` to create the panel model from `orientation`, `dir`, and
panel size constraints. The exported `update` function handles
`ResizableMessage` values for keyboard resizing and pointer drag facts.

## Usage

Render `view` with a `state` and matching `panels` array. Pass `toMessage` when
the parent model owns interactive resizing; omit it for static documentation
examples.

## Examples

The registry includes nested, handle, vertical, and RTL examples matching the
origin Resizable examples without importing React runtime helpers.

## Accessibility

Handles render as focusable `separator` elements with orientation and value
attributes. Keyboard resizing supports arrow keys, Home, End, and larger Shift
steps.

## Foldkit Differences

The component exports `resizableState`, `update`, and pure resize helpers so an
application can keep panel sizes in its model while examples can render static
origin-matching layouts. Installable source does not depend on React or
`react-resizable-panels`.
