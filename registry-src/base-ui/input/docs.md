# Input

## Overview

Input is a Foldkit-native Base UI primitive for rendering a controlled native
`input` element with form attributes, value-change facts, and Field control data
attributes.

## Foldkit Model

Input does not own state. Keep the current value in the parent model and handle
`onValueChange` from the parent update function.

## Usage

Import the helper from the generated registry source and call it inside a view
after binding `const h = html<Message>()`.

```ts
Input.view<Message>({
  value: model.name,
  placeholder: 'e.g. Colm Tuite',
  onValueChange: UpdatedName,
  toView: attributes => h.input([...attributes.input]),
})
```

## Examples

The registry examples cover the Base UI hero input and the disabled state. The
default example is controlled by the docs page so typing into the preview updates
the rendered value.

## Accessibility

Associate inputs with a visible label using `id` plus `for`, or wrap the input in
a label. Disabled and invalid state are forwarded to native and ARIA attributes.

## Foldkit Differences

The origin Base UI implementation is a React component. This registry item keeps
the same native input surface but emits Foldkit messages as facts and leaves all
state in the parent model.
