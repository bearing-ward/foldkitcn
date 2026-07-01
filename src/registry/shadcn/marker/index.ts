import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

type Child = Html | string

export const MarkerVariant = S.Union([
  S.Literal('default'),
  S.Literal('separator'),
  S.Literal('border'),
])
export type MarkerVariant = typeof MarkerVariant.Type

export const markerVariantValues: ReadonlyArray<MarkerVariant> = [
  'default',
  'separator',
  'border',
]

export const MarkerStyleOptions = S.Struct({
  variant: S.optional(MarkerVariant),
  className: S.optional(S.String),
})
export type MarkerStyleOptions = typeof MarkerStyleOptions.Type

export const MarkerPartStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type MarkerPartStyleOptions = typeof MarkerPartStyleOptions.Type

// VIEW

export type MarkerAttributes<Message> = Readonly<{
  marker: ReadonlyArray<Attribute<Message>>
}>

export type MarkerIconAttributes<Message> = Readonly<{
  markerIcon: ReadonlyArray<Attribute<Message>>
}>

export type MarkerContentAttributes<Message> = Readonly<{
  markerContent: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = MarkerStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: MarkerAttributes<Message>) => Html
  }>

export type MarkerIconConfig<Message> = MarkerPartStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: MarkerIconAttributes<Message>) => Html
  }>

export type MarkerContentConfig<Message> = MarkerPartStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: MarkerContentAttributes<Message>) => Html
  }>

export const markerBaseClassName =
  "group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-sm text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [a]:underline [a]:underline-offset-3 [a]:hover:text-foreground"

export const markerVariantClassNames: Readonly<Record<MarkerVariant, string>> =
  {
    default: '',
    separator:
      'before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border',
    border: 'border-b border-border pb-2',
  }

export const markerIconBaseClassName =
  "size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4"

export const markerContentBaseClassName =
  'min-w-0 wrap-break-word group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground'

export const markerClassName = ({
  variant = 'default',
  className,
}: MarkerStyleOptions = {}): string =>
  cn(className, markerBaseClassName, markerVariantClassNames[variant])

export const markerIconClassName = ({
  className,
}: MarkerPartStyleOptions = {}): string =>
  cn(markerIconBaseClassName, className)

export const markerContentClassName = ({
  className,
}: MarkerPartStyleOptions = {}): string =>
  cn(markerContentBaseClassName, className)

const markerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): MarkerAttributes<Message> => ({
  marker: [
    h.DataAttribute('slot', 'marker'),
    h.DataAttribute('variant', config.variant ?? 'default'),
    h.Class(markerClassName(config)),
    ...(config.attributes ?? []),
  ],
})

const markerIconAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: MarkerIconConfig<Message>,
): MarkerIconAttributes<Message> => ({
  markerIcon: [
    h.DataAttribute('slot', 'marker-icon'),
    h.AriaHidden(true),
    h.Class(markerIconClassName(config)),
    ...(config.attributes ?? []),
  ],
})

const markerContentAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: MarkerContentConfig<Message>,
): MarkerContentAttributes<Message> => ({
  markerContent: [
    h.DataAttribute('slot', 'marker-content'),
    h.Class(markerContentClassName(config)),
    ...(config.attributes ?? []),
  ],
})

export const view = <Message>(config: ViewConfig<Message> = {}): Html => {
  const h = html<Message>()
  const attributes = markerAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.marker], config.children ?? [])
    : config.toView(attributes)
}

export const Marker = view

export const MarkerIcon = <Message>(
  config: MarkerIconConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = markerIconAttributes(h, config)

  return config.toView === undefined
    ? h.span([...attributes.markerIcon], config.children ?? [])
    : config.toView(attributes)
}

export const MarkerContent = <Message>(
  config: MarkerContentConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = markerContentAttributes(h, config)

  return config.toView === undefined
    ? h.span([...attributes.markerContent], config.children ?? [])
    : config.toView(attributes)
}
