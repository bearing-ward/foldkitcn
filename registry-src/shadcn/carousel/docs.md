# Carousel

Foldkit-native shadcn base-nova Carousel helper with local selected-index
state, previous/next controls, keyboard navigation, orientation support, RTL
layout, and deterministic examples without Embla runtime dependencies.

## Overview

Carousel renders a shadcn-style slide viewport from local Foldkit state. It
tracks the selected slide index, boundary-enabled controls, horizontal or
vertical orientation, and optional RTL direction.

## Foldkit Model

Carousel state is serializable and model-owned. Applications keep the selected
index in their model, route `ClickedCarouselPrevious`, `ClickedCarouselNext`,
and `PressedCarouselKey` messages through `update`, then pass the next state
back into the view.

## Usage

Import the generated Carousel helper, create a `carouselState` from your item
count, and pass `toMessage` when the controls should update application state.
Use `items` for slide content and class-name options for origin-style spacing,
size, orientation, and control placement variants.

## Examples

The supported examples cover the default card carousel, responsive slide sizes,
multiple visible slides, custom spacing, vertical orientation, local API/status
copy, and an RTL carousel with local Arabic numerals.

## Accessibility

The root renders as a `region` with carousel role description. Slides render as
groups with slide role descriptions, controls are named for previous and next
slides, disabled control state reflects carousel boundaries, and keyboard
navigation is surfaced through Foldkit messages.

## Foldkit Differences

This implementation intentionally replaces `embla-carousel-react`,
`embla-carousel-autoplay`, React hooks, lucide-react, and origin language
selector dependencies with local Foldkit state, messages, inline SVG chevrons,
and deterministic RTL data. Autoplay/plugin parity is deferred until a broader
lifecycle-command foundation exists.
