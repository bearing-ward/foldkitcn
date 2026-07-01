# Attachment

## Overview

Attachment is a Foldkit-native port of the shadcn base-nova Attachment helper. It renders the origin attachment card structure with root, media, content, title, description, actions, action, trigger, and group slots while preserving the size, orientation, and state styling contracts.

## Foldkit Model

Attachment is a stateless render helper. It owns no Model, Message, update function, or Command. Parent views decide which attachment rows exist, which state each row shows, and when a trigger should open a dialog or preview.

The installable registry also includes a FileDrop-backed attachment workflow example that uses `FileDrop.init()`, delegates through `FileDrop.update()`, renders with `FileDrop.view()`, and stores `ReceivedFiles` in parent-owned model state.

## Usage

Import the helper from the generated registry source and compose the parts inside a Foldkit view after binding the Html factory.

```ts
Attachment<Message>({
  state: 'uploading',
  size: 'default',
  orientation: 'horizontal',
  children: [
    AttachmentMedia<Message>({
      children: [Spinner<Message>({})],
    }),
    AttachmentContent<Message>({
      children: [
        AttachmentTitle<Message>({
          children: ['sales-dashboard.pdf'],
        }),
        AttachmentDescription<Message>({
          children: ['Uploading · 64%'],
        }),
      ],
    }),
  ],
})
```

Use `AttachmentTrigger` for the absolute overlay trigger slot, `AttachmentAction` for icon-only actions, and `AttachmentGroup` for scrollable attachment rows.

For the real file-arrival workflow, use the FileDrop-backed attachment example as the parent-owned Submodel pattern: keep the FileDrop model in parent state, embed `FileDrop.Message` in the parent Message union, and render accepted files as Attachment rows below the drop zone.

## Examples

The registry includes live examples for the basic demo stack, grouped files, image cards, size variations, idle/uploading/processing/error/done states, a dialog-backed preview trigger demo, and a FileDrop-backed attachment workflow demo.

## Accessibility

Attachment renders slot attributes for every subpart and state attributes on the root. Keep icon-only actions labelled, keep the trigger overlay labelled, and use the dialog preview example as a pattern for interactive previews.

The FileDrop workflow example is the reference for actual file arrival handling inside a Foldkit parent model.

## Foldkit Differences

The origin shadcn implementation imports React, CVA, Base UI render hooks, merge-props helpers, and lucide-react. This registry item replaces those pieces with Foldkit Html, Effect Schema variants, local shadcn button/dialog/spinner helpers, and deterministic inline SVGs in the examples so installable source stays Foldkit-native.

Those differences are accepted because the installable source must stay in the local Foldkit ecosystem while preserving the origin structure and visual footprint.
