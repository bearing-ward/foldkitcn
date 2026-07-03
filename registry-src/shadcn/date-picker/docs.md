# Date Picker

Foldkit-native shadcn base-nova Date Picker built on `@foldkit/ui/DatePicker`
and the native Foldkit `Calendar` date model.

## Overview

Date Picker renders a shadcn-style trigger and popover calendar while keeping
selection, focus, visible month, and open/close behavior inside the native
Foldkit UI submodels. It supports single-date selection, hidden ISO form values,
min/max constraints, deterministic ISO input composition, and RTL locale data.

## Foldkit Model

Parents own a `DatePicker.Model` submodel and delegate
`DatePicker.Message` through `DatePicker.update`. The wrapper returns native
`DatePicker.OutMessage` values such as `SelectedDate` so application models can
lift the selected `Calendar.CalendarDate` into domain state when needed.

## Usage

Import the generated helper from `src/registry/shadcn/date-picker`. Initialize
models with `datePickerInit`, passing `Calendar.make(...)` or `Calendar.today`
at the application boundary. Use `Calendar.CalendarDateFromIsoString` for ISO
input examples and keep parsed dates as native `Calendar.CalendarDate` values.

## Examples

The supported live examples are `DatePickerDemo`, `DatePickerBasic`,
`DatePickerDob`, `DatePickerInput`, and `DatePickerRtl`. Range, time, and
natural-language examples from the origin docs are deferred until Foldkit has a
native model for those flows.

## Accessibility

The native DatePicker composes a Popover submodel with a Calendar submodel, so
trigger state, popover visibility, calendar grid focus, keyboard selection, and
hidden form submission follow the same command-driven Foldkit architecture as
the rest of the app.

## Foldkit Differences

This implementation does not ship React, React DayPicker, `date-fns`, or
`chrono-node` runtime code. Date arithmetic and formatting use Foldkit
`Calendar` helpers, and icons are local inline SVGs instead of `lucide-react`.
