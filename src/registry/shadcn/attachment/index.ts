import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as Button from '../button'

// MODEL

type Child = Html | string

export const AttachmentState = S.Union([
  S.Literal('idle'),
  S.Literal('uploading'),
  S.Literal('processing'),
  S.Literal('error'),
  S.Literal('done'),
])
export type AttachmentState = typeof AttachmentState.Type

export const AttachmentSize = S.Union([
  S.Literal('default'),
  S.Literal('sm'),
  S.Literal('xs'),
])
export type AttachmentSize = typeof AttachmentSize.Type

export const AttachmentOrientation = S.Union([
  S.Literal('horizontal'),
  S.Literal('vertical'),
])
export type AttachmentOrientation = typeof AttachmentOrientation.Type

export const AttachmentMediaVariant = S.Union([
  S.Literal('icon'),
  S.Literal('image'),
])
export type AttachmentMediaVariant = typeof AttachmentMediaVariant.Type

export const attachmentStateValues: ReadonlyArray<AttachmentState> = [
  'idle',
  'uploading',
  'processing',
  'error',
  'done',
]

export const attachmentSizeValues: ReadonlyArray<AttachmentSize> = [
  'default',
  'sm',
  'xs',
]

export const attachmentOrientationValues: ReadonlyArray<AttachmentOrientation> =
  ['horizontal', 'vertical']

export const attachmentMediaVariantValues: ReadonlyArray<AttachmentMediaVariant> =
  ['icon', 'image']

export const AttachmentStyleOptions = S.Struct({
  className: S.optional(S.String),
  state: S.optional(AttachmentState),
  size: S.optional(AttachmentSize),
  orientation: S.optional(AttachmentOrientation),
})
export type AttachmentStyleOptions = typeof AttachmentStyleOptions.Type

export const AttachmentPartStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type AttachmentPartStyleOptions = typeof AttachmentPartStyleOptions.Type

export const AttachmentMediaStyleOptions = S.Struct({
  className: S.optional(S.String),
  variant: S.optional(AttachmentMediaVariant),
})
export type AttachmentMediaStyleOptions =
  typeof AttachmentMediaStyleOptions.Type

export const AttachmentActionStyleOptions = S.Struct({
  className: S.optional(S.String),
  variant: S.optional(Button.ButtonVariant),
  size: S.optional(Button.ButtonSize),
})
export type AttachmentActionStyleOptions =
  typeof AttachmentActionStyleOptions.Type

// VIEW

export type AttachmentAttributes<Message> = Readonly<{
  attachment: ReadonlyArray<Attribute<Message>>
}>

export type AttachmentPartAttributes<Message> = Readonly<{
  part: ReadonlyArray<Attribute<Message>>
}>

export type AttachmentMediaAttributes<Message> = Readonly<{
  media: ReadonlyArray<Attribute<Message>>
}>

export type AttachmentContentAttributes<Message> = Readonly<{
  content: ReadonlyArray<Attribute<Message>>
}>

export type AttachmentTitleAttributes<Message> = Readonly<{
  title: ReadonlyArray<Attribute<Message>>
}>

export type AttachmentDescriptionAttributes<Message> = Readonly<{
  description: ReadonlyArray<Attribute<Message>>
}>

export type AttachmentActionsAttributes<Message> = Readonly<{
  actions: ReadonlyArray<Attribute<Message>>
}>

export type AttachmentActionAttributes<Message> = Readonly<{
  action: ReadonlyArray<Attribute<Message>>
}>

export type AttachmentTriggerAttributes<Message> = Readonly<{
  trigger: ReadonlyArray<Attribute<Message>>
}>

export type AttachmentGroupAttributes<Message> = Readonly<{
  group: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = AttachmentStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: AttachmentAttributes<Message>) => Html
  }>

export type AttachmentPartConfig<Message> = AttachmentPartStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: AttachmentPartAttributes<Message>) => Html
  }>

export type AttachmentMediaConfig<Message> = AttachmentMediaStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: AttachmentMediaAttributes<Message>) => Html
  }>

export type AttachmentContentConfig<Message> = AttachmentPartStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: AttachmentContentAttributes<Message>) => Html
  }>

export type AttachmentTitleConfig<Message> = AttachmentPartStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: AttachmentTitleAttributes<Message>) => Html
  }>

export type AttachmentDescriptionConfig<Message> = AttachmentPartStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: AttachmentDescriptionAttributes<Message>) => Html
  }>

export type AttachmentActionsConfig<Message> = AttachmentPartStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: AttachmentActionsAttributes<Message>) => Html
  }>

export type AttachmentActionConfig<Message> = AttachmentActionStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: AttachmentActionAttributes<Message>) => Html
  }>

export type AttachmentTriggerConfig<Message> = AttachmentPartStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: AttachmentTriggerAttributes<Message>) => Html
  }>

export type AttachmentGroupConfig<Message> = AttachmentPartStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: AttachmentGroupAttributes<Message>) => Html
  }>

export const attachmentBaseClassName =
  'group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-2xl border bg-card text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/30 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed'

export const attachmentSizeClassNames: Readonly<
  Record<AttachmentSize, string>
> = {
  default:
    'gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2',
  sm: 'gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5',
  xs: 'gap-1.5 rounded-xl text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1',
}

export const attachmentOrientationClassNames: Readonly<
  Record<AttachmentOrientation, string>
> = {
  horizontal: 'min-w-40 items-center',
  vertical: 'w-24 flex-col has-data-[slot=attachment-content]:w-30',
}

export const attachmentMediaBaseClassName =
  "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-md group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5"

export const attachmentMediaVariantClassNames: Readonly<
  Record<AttachmentMediaVariant, string>
> = {
  icon: '',
  image:
    'opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover',
}

export const attachmentContentBaseClassName =
  'max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1'

export const attachmentTitleBaseClassName =
  'block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer'

export const attachmentDescriptionBaseClassName =
  'mt-0.5 block min-w-0 truncate text-xs text-muted-foreground group-data-[state=error]/attachment:text-destructive/80 max-w-full'

export const attachmentActionsBaseClassName =
  'relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1'

export const attachmentActionBaseClassName =
  'group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0'

export const attachmentActionVariantClassNames: Readonly<
  Record<Button.ButtonVariant, string>
> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/80',
  outline:
    'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-transparent dark:hover:bg-input/30',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
  ghost:
    'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
  destructive:
    'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
  link: 'text-primary underline-offset-4 hover:underline',
}

export const attachmentActionSizeClassNames: Readonly<
  Record<Button.ButtonSize, string>
> = {
  default:
    'h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5',
  xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
  sm: 'h-7 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
  lg: 'h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
  icon: 'size-8',
  'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3",
  'icon-sm': 'size-7',
  'icon-lg': 'size-9',
}

export const attachmentTriggerBaseClassName =
  'absolute inset-0 z-10 outline-none'

export const attachmentGroupBaseClassName =
  'flex min-w-0 scroll-fade-x snap-x snap-mandatory scroll-px-1 scrollbar-none gap-3 overflow-x-auto overscroll-x-contain py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start'

export const attachmentClassName = ({
  className,
  orientation = 'horizontal',
  size = 'default',
}: AttachmentStyleOptions = {}): string =>
  cn(
    attachmentBaseClassName,
    attachmentSizeClassNames[size],
    attachmentOrientationClassNames[orientation],
    className,
  )

export const attachmentMediaClassName = ({
  className,
  variant = 'icon',
}: AttachmentMediaStyleOptions = {}): string =>
  cn(
    attachmentMediaBaseClassName,
    attachmentMediaVariantClassNames[variant],
    className,
  )

export const attachmentContentClassName = ({
  className,
}: AttachmentPartStyleOptions = {}): string =>
  cn(attachmentContentBaseClassName, className)

export const attachmentTitleClassName = ({
  className,
}: AttachmentPartStyleOptions = {}): string =>
  cn(attachmentTitleBaseClassName, className)

export const attachmentDescriptionClassName = ({
  className,
}: AttachmentPartStyleOptions = {}): string =>
  cn(attachmentDescriptionBaseClassName, className)

export const attachmentActionsClassName = ({
  className,
}: AttachmentPartStyleOptions = {}): string =>
  cn(attachmentActionsBaseClassName, className)

export const attachmentActionClassName = ({
  className,
  variant = 'ghost',
  size = 'icon-xs',
}: AttachmentActionStyleOptions = {}): string =>
  cn(
    attachmentActionBaseClassName,
    attachmentActionVariantClassNames[variant],
    attachmentActionSizeClassNames[size],
    className,
  )

export const attachmentTriggerClassName = ({
  className,
}: AttachmentPartStyleOptions = {}): string =>
  cn(attachmentTriggerBaseClassName, className)

export const attachmentGroupClassName = ({
  className,
}: AttachmentPartStyleOptions = {}): string =>
  cn(attachmentGroupBaseClassName, className)

const optionalAttributes = <Message>(
  attributes: ReadonlyArray<Attribute<Message>> | undefined,
): ReadonlyArray<Attribute<Message>> => attributes ?? []

const attachmentAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): AttachmentAttributes<Message> => ({
  attachment: [
    h.DataAttribute('slot', 'attachment'),
    h.DataAttribute('state', config.state ?? 'done'),
    h.DataAttribute('size', config.size ?? 'default'),
    h.DataAttribute('orientation', config.orientation ?? 'horizontal'),
    h.Class(attachmentClassName(config)),
    ...optionalAttributes(config.attributes),
  ],
})

const partAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: string,
  className: string,
  attributes: ReadonlyArray<Attribute<Message>> | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', slot),
  h.Class(className),
  ...optionalAttributes(attributes),
]

export const view = <Message>(config: ViewConfig<Message> = {}): Html => {
  const h = html<Message>()
  const attributes = attachmentAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.attachment], config.children ?? [])
    : config.toView(attributes)
}

export const Attachment = view

export const AttachmentMedia = <Message>(
  config: AttachmentMediaConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const variant = config.variant ?? 'icon'
  const attributes: AttachmentMediaAttributes<Message> = {
    media: [
      h.DataAttribute('slot', 'attachment-media'),
      h.DataAttribute('variant', variant),
      h.Class(attachmentMediaClassName(config)),
      ...optionalAttributes(config.attributes),
    ],
  }

  return config.toView === undefined
    ? h.div([...attributes.media], config.children ?? [])
    : config.toView(attributes)
}

export const AttachmentContent = <Message>(
  config: AttachmentContentConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes: AttachmentContentAttributes<Message> = {
    content: partAttributes(
      h,
      'attachment-content',
      attachmentContentClassName(config),
      config.attributes,
    ),
  }

  return config.toView === undefined
    ? h.div([...attributes.content], config.children ?? [])
    : config.toView(attributes)
}

export const AttachmentTitle = <Message>(
  config: AttachmentTitleConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes: AttachmentTitleAttributes<Message> = {
    title: partAttributes(
      h,
      'attachment-title',
      attachmentTitleClassName(config),
      config.attributes,
    ),
  }

  return config.toView === undefined
    ? h.span([...attributes.title], config.children ?? [])
    : config.toView(attributes)
}

export const AttachmentDescription = <Message>(
  config: AttachmentDescriptionConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes: AttachmentDescriptionAttributes<Message> = {
    description: partAttributes(
      h,
      'attachment-description',
      attachmentDescriptionClassName(config),
      config.attributes,
    ),
  }

  return config.toView === undefined
    ? h.span([...attributes.description], config.children ?? [])
    : config.toView(attributes)
}

export const AttachmentActions = <Message>(
  config: AttachmentActionsConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes: AttachmentActionsAttributes<Message> = {
    actions: partAttributes(
      h,
      'attachment-actions',
      attachmentActionsClassName(config),
      config.attributes,
    ),
  }

  return config.toView === undefined
    ? h.div([...attributes.actions], config.children ?? [])
    : config.toView(attributes)
}

export const AttachmentAction = <Message>(
  config: AttachmentActionConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes: AttachmentActionAttributes<Message> = {
    action: [
      h.DataAttribute('slot', 'attachment-action'),
      h.Class(attachmentActionClassName(config)),
      ...optionalAttributes(config.attributes),
    ],
  }

  return config.toView === undefined
    ? h.button(
        [...attributes.action, h.Tabindex(0), h.Type('button')],
        config.children ?? [],
      )
    : config.toView(attributes)
}

export const AttachmentTrigger = <Message>(
  config: AttachmentTriggerConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes: AttachmentTriggerAttributes<Message> = {
    trigger: partAttributes(
      h,
      'attachment-trigger',
      attachmentTriggerClassName(config),
      config.attributes,
    ),
  }

  return config.toView === undefined
    ? h.button([...attributes.trigger, h.Type('button')], config.children ?? [])
    : config.toView(attributes)
}

export const AttachmentGroup = <Message>(
  config: AttachmentGroupConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes: AttachmentGroupAttributes<Message> = {
    group: partAttributes(
      h,
      'attachment-group',
      attachmentGroupClassName(config),
      config.attributes,
    ),
  }

  return config.toView === undefined
    ? h.div([...attributes.group], config.children ?? [])
    : config.toView(attributes)
}
