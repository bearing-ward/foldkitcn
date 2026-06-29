import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

type Child = Html | string

export const EmptyMediaVariant = S.Union([
  S.Literal('default'),
  S.Literal('icon'),
])
export type EmptyMediaVariant = typeof EmptyMediaVariant.Type

export const emptyMediaVariantValues: ReadonlyArray<EmptyMediaVariant> = [
  'default',
  'icon',
]

export const EmptyStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
})
export type EmptyStyleOptions = typeof EmptyStyleOptions.Type

export const EmptyPartStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type EmptyPartStyleOptions = typeof EmptyPartStyleOptions.Type

export const EmptyMediaStyleOptions = S.Struct({
  variant: S.optional(EmptyMediaVariant),
  className: S.optional(S.String),
})
export type EmptyMediaStyleOptions = typeof EmptyMediaStyleOptions.Type

// VIEW

export type EmptyAttributes<Message> = Readonly<{
  empty: ReadonlyArray<Attribute<Message>>
}>

export type EmptyPartAttributes<Message> = Readonly<{
  part: ReadonlyArray<Attribute<Message>>
}>

export type EmptyContainerConfig<Message> = EmptyPartStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: EmptyPartAttributes<Message>) => Html
  }>

export type EmptyConfig<Message> = EmptyStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: EmptyAttributes<Message>) => Html
  }>

export type EmptyMediaConfig<Message> = EmptyMediaStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: EmptyPartAttributes<Message>) => Html
  }>

export const emptyBaseClassName =
  'flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance'

export const emptyHeaderBaseClassName =
  'flex max-w-sm flex-col items-center gap-2'

export const emptyMediaBaseClassName =
  'mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0'

export const emptyMediaVariantClassNames: Readonly<
  Record<EmptyMediaVariant, string>
> = {
  default: 'bg-transparent',
  icon: "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4",
}

export const emptyTitleBaseClassName =
  'cn-font-heading text-sm font-medium tracking-tight'

export const emptyDescriptionBaseClassName =
  'text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary'

export const emptyContentBaseClassName =
  'flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance'

export const emptyClassName = ({ className }: EmptyStyleOptions = {}): string =>
  cn(emptyBaseClassName, className)

export const emptyHeaderClassName = ({
  className,
}: EmptyPartStyleOptions = {}): string =>
  cn(emptyHeaderBaseClassName, className)

export const emptyMediaClassName = ({
  variant = 'default',
  className,
}: EmptyMediaStyleOptions = {}): string =>
  cn(emptyMediaBaseClassName, emptyMediaVariantClassNames[variant], className)

export const emptyTitleClassName = ({
  className,
}: EmptyPartStyleOptions = {}): string => cn(emptyTitleBaseClassName, className)

export const emptyDescriptionClassName = ({
  className,
}: EmptyPartStyleOptions = {}): string =>
  cn(emptyDescriptionBaseClassName, className)

export const emptyContentClassName = ({
  className,
}: EmptyPartStyleOptions = {}): string =>
  cn(emptyContentBaseClassName, className)

const optionalDir = <Message>(
  h: ReturnType<typeof html<Message>>,
  dir: string | undefined,
): ReadonlyArray<Attribute<Message>> => (dir === undefined ? [] : [h.Dir(dir)])

const partAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: string,
  className: string,
  config: EmptyContainerConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', slot),
  h.Class(cn(className, config.className)),
  ...(config.attributes ?? []),
]

export const Empty = <Message>(config: EmptyConfig<Message> = {}): Html => {
  const h = html<Message>()
  const attributes = {
    empty: [
      h.DataAttribute('slot', 'empty'),
      h.Class(emptyClassName(config)),
      ...optionalDir(h, config.dir),
      ...(config.attributes ?? []),
    ],
  }

  if (config.toView !== undefined) {
    return config.toView(attributes)
  }

  return h.div([...attributes.empty], config.children ?? [])
}

export const EmptyHeader = <Message>(
  config: EmptyContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = {
    part: partAttributes(h, 'empty-header', emptyHeaderBaseClassName, config),
  }

  if (config.toView !== undefined) {
    return config.toView(attributes)
  }

  return h.div([...attributes.part], config.children ?? [])
}

export const EmptyMedia = <Message>(
  config: EmptyMediaConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const variant = config.variant ?? 'default'
  const attributes = {
    part: [
      h.DataAttribute('slot', 'empty-icon'),
      h.DataAttribute('variant', variant),
      h.Class(emptyMediaClassName(config)),
      ...(config.attributes ?? []),
    ],
  }

  if (config.toView !== undefined) {
    return config.toView(attributes)
  }

  return h.div([...attributes.part], config.children ?? [])
}

export const EmptyTitle = <Message>(
  config: EmptyContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = {
    part: partAttributes(h, 'empty-title', emptyTitleBaseClassName, config),
  }

  if (config.toView !== undefined) {
    return config.toView(attributes)
  }

  return h.div([...attributes.part], config.children ?? [])
}

export const EmptyDescription = <Message>(
  config: EmptyContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = {
    part: partAttributes(
      h,
      'empty-description',
      emptyDescriptionBaseClassName,
      config,
    ),
  }

  if (config.toView !== undefined) {
    return config.toView(attributes)
  }

  return h.div([...attributes.part], config.children ?? [])
}

export const EmptyContent = <Message>(
  config: EmptyContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = {
    part: partAttributes(h, 'empty-content', emptyContentBaseClassName, config),
  }

  if (config.toView !== undefined) {
    return config.toView(attributes)
  }

  return h.div([...attributes.part], config.children ?? [])
}
