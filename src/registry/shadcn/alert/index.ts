import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const AlertVariant = S.Union([
  S.Literal('default'),
  S.Literal('destructive'),
])
export type AlertVariant = typeof AlertVariant.Type

export const alertVariantValues: ReadonlyArray<AlertVariant> = [
  'default',
  'destructive',
]

export const AlertStyleOptions = S.Struct({
  variant: S.optional(AlertVariant),
  direction: S.optional(S.Union([S.Literal('ltr'), S.Literal('rtl')])),
  className: S.optional(S.String),
})
export type AlertStyleOptions = typeof AlertStyleOptions.Type

export const AlertTitleStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type AlertTitleStyleOptions = typeof AlertTitleStyleOptions.Type

export const AlertDescriptionStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type AlertDescriptionStyleOptions =
  typeof AlertDescriptionStyleOptions.Type

export const AlertActionStyleOptions = S.Struct({
  direction: S.optional(S.Union([S.Literal('ltr'), S.Literal('rtl')])),
  className: S.optional(S.String),
})
export type AlertActionStyleOptions = typeof AlertActionStyleOptions.Type

// VIEW

export type AlertAttributes<Message> = Readonly<{
  alert: ReadonlyArray<Attribute<Message>>
}>

export type AlertTitleAttributes<Message> = Readonly<{
  title: ReadonlyArray<Attribute<Message>>
}>

export type AlertDescriptionAttributes<Message> = Readonly<{
  description: ReadonlyArray<Attribute<Message>>
}>

export type AlertActionAttributes<Message> = Readonly<{
  action: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = AlertStyleOptions &
  Readonly<{
    toView: (attributes: AlertAttributes<Message>) => Html
  }>

export type TitleViewConfig<Message> = AlertTitleStyleOptions &
  Readonly<{
    toView: (attributes: AlertTitleAttributes<Message>) => Html
  }>

export type DescriptionViewConfig<Message> = AlertDescriptionStyleOptions &
  Readonly<{
    toView: (attributes: AlertDescriptionAttributes<Message>) => Html
  }>

export type ActionViewConfig<Message> = AlertActionStyleOptions &
  Readonly<{
    toView: (attributes: AlertActionAttributes<Message>) => Html
  }>

export const alertBaseClassName =
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4"

export const alertRtlBaseClassName =
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-start text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pe-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4"

export const alertVariantClassNames: Readonly<Record<AlertVariant, string>> = {
  default: 'bg-card text-card-foreground',
  destructive:
    'bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current',
}

export const alertTitleBaseClassName =
  'font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground'

export const alertDescriptionBaseClassName =
  'text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4'

export const alertActionBaseClassName = 'absolute top-2 right-2'
export const alertRtlActionBaseClassName = 'absolute end-2 top-2'

export const alertClassName = ({
  variant = 'default',
  direction = 'ltr',
  className,
}: AlertStyleOptions = {}): string =>
  cn(
    direction === 'rtl' ? alertRtlBaseClassName : alertBaseClassName,
    alertVariantClassNames[variant],
    className,
  )

export const alertTitleClassName = ({
  className,
}: AlertTitleStyleOptions = {}): string =>
  cn(alertTitleBaseClassName, className)

export const alertDescriptionClassName = ({
  className,
}: AlertDescriptionStyleOptions = {}): string =>
  cn(alertDescriptionBaseClassName, className)

export const alertActionClassName = ({
  className,
  direction = 'ltr',
}: AlertActionStyleOptions = {}): string =>
  cn(
    direction === 'rtl'
      ? alertRtlActionBaseClassName
      : alertActionBaseClassName,
    className,
  )

const alertAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  variant: AlertVariant,
  direction: AlertStyleOptions['direction'],
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'alert'),
  h.Role('alert'),
  h.Class(alertClassName({ variant, direction, className })),
]

const titleAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'alert-title'),
  h.Class(alertTitleClassName({ className })),
]

const descriptionAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'alert-description'),
  h.Class(alertDescriptionClassName({ className })),
]

const actionAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  direction: AlertActionStyleOptions['direction'],
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'alert-action'),
  h.Class(alertActionClassName({ direction, className })),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, variant = 'default', direction = 'ltr', className } = config

  return toView({
    alert: alertAttributes(h, variant, direction, className),
  })
}

export const titleView = <Message>(config: TitleViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, className } = config

  return toView({
    title: titleAttributes(h, className),
  })
}

export const descriptionView = <Message>(
  config: DescriptionViewConfig<Message>,
): Html => {
  const h = html<Message>()
  const { toView, className } = config

  return toView({
    description: descriptionAttributes(h, className),
  })
}

export const actionView = <Message>(
  config: ActionViewConfig<Message>,
): Html => {
  const h = html<Message>()
  const { toView, direction = 'ltr', className } = config

  return toView({
    action: actionAttributes(h, direction, className),
  })
}
