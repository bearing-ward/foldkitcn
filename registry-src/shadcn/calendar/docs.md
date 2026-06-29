# Calendar

Foldkit-native shadcn base-nova Calendar helper for single-month date grids,
single-date selection, disabled days, outside-month days, month navigation, and
RTL rendering without `react-day-picker` or `date-fns`.

## Overview

Calendar renders a shadcn-style month grid from local Foldkit data. It supports
single-date selection, deterministic disabled dates, today/selected/outside
states, month navigation controls, and direction-aware layout.

## Foldkit Model

Calendar state is represented with serializable ISO date strings and Effect
Schema constructors. Applications own the selected date, focused date, and
visible month, then feed them back into the stateless `Calendar` view.

## Usage

Import the generated Calendar helper and pass the visible month plus optional
selected date. Use `onSelectDate`, `onPreviousMonth`, `onNextMonth`, and
`onKeyDown` to turn user interaction into Foldkit messages.

## Examples

The supported examples cover the default selected-date demo, a basic bordered
calendar, booked/disabled dates inside a local Card, and an RTL calendar using
native Intl locale formatting.

## Accessibility

The rendered month uses a grid role, labeled day buttons, disabled day
attributes, selected state, and deterministic month navigation buttons. Keyboard
movement is exposed through messages so apps can keep focus state in their
model.

## Foldkit Differences

This implementation intentionally replaces the origin `react-day-picker`,
`date-fns`, locale packages, React hooks, and icon packages with local Foldkit
state helpers, UTC-safe ISO date arithmetic, and inline SVG chevrons. Range,
multiple-date, Persian/Hijri, presets, time, custom-day, caption-select, and
week-number examples are deferred until a reusable local date foundation exists.
