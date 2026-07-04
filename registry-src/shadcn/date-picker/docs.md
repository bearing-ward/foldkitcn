# Date Picker

Foldkit-native shadcn Date Picker wrapper built on the native `@foldkit/ui`
DatePicker and Foldkit Calendar model.

## Overview

Date Picker renders a shadcn-style trigger and popover calendar while delegating
date state, focus movement, hidden form input output, and selection messages to
the native Foldkit UI DatePicker submodel.

## Foldkit Model

Applications own a `DatePickerModel` in their model and delegate
`DatePickerMessage` values through `datePickerUpdate`. The native submodel emits
`DatePickerOutMessage` values such as `SelectedDate` when the user commits a
date.

## Usage

Initialize with `datePickerInit`, passing `Calendar.make(...)` or `Calendar.today`
at the app boundary. For ISO input examples, decode with
`Calendar.CalendarDateFromIsoString` before reflecting the value into the
submodel.

## Examples

The installable examples cover `DatePickerDemo`, `DatePickerBasic`,
`DatePickerDob`, `DatePickerInput`, and `DatePickerRtl`. Range selection, time
selection, presets, and natural-language parsing are documented as deferred
follow-up work.

## Accessibility

The native Foldkit UI DatePicker owns trigger, popover, grid, keyboard, focus,
and hidden-input semantics. The shadcn wrapper preserves those attributes while
adding local visual classes and deterministic labels.

## Foldkit Differences

This implementation does not import React DayPicker, `date-fns`, `chrono-node`,
React, or Lucide React. Origin examples are treated as evidence, while the
installable component uses native Foldkit Calendar dates, native Foldkit UI
submodels, and local inline SVG icons.
