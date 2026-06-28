import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const BreadcrumbDirection = S.Union([S.Literal('ltr'), S.Literal('rtl')])
export type BreadcrumbDirection = typeof BreadcrumbDirection.Type

export const BreadcrumbStyleOptions = S.Struct({
  ariaLabel: S.optional(S.String),
  className: S.optional(S.String),
  dir: S.optional(BreadcrumbDirection),
})
export type BreadcrumbStyleOptions = typeof BreadcrumbStyleOptions.Type

export const BreadcrumbPartStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type BreadcrumbPartStyleOptions = typeof BreadcrumbPartStyleOptions.Type

export const BreadcrumbLinkStyleOptions = S.Struct({
  className: S.optional(S.String),
  href: S.optional(S.String),
  rel: S.optional(S.String),
  target: S.optional(S.String),
})
export type BreadcrumbLinkStyleOptions = typeof BreadcrumbLinkStyleOptions.Type

type Child = Html | string

// VIEW

export type BreadcrumbContainerConfig<Message> = BreadcrumbPartStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
  }>

export type BreadcrumbConfig<Message> = BreadcrumbStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
  }>

export type BreadcrumbLinkConfig<Message> = BreadcrumbLinkStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
  }>

export const breadcrumbListBaseClassName =
  'flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground'

export const breadcrumbItemBaseClassName = 'inline-flex items-center gap-1'

export const breadcrumbLinkBaseClassName =
  'transition-colors hover:text-foreground'

export const breadcrumbPageBaseClassName = 'font-normal text-foreground'

export const breadcrumbSeparatorBaseClassName = '[&>svg]:size-3.5'

export const breadcrumbEllipsisBaseClassName =
  'flex size-5 items-center justify-center [&>svg]:size-4'

export const breadcrumbClassName = ({
  className,
}: Pick<BreadcrumbStyleOptions, 'className'> = {}): string => cn(className)

export const breadcrumbListClassName = ({
  className,
}: BreadcrumbPartStyleOptions = {}): string =>
  cn(breadcrumbListBaseClassName, className)

export const breadcrumbItemClassName = ({
  className,
}: BreadcrumbPartStyleOptions = {}): string =>
  cn(breadcrumbItemBaseClassName, className)

export const breadcrumbLinkClassName = ({
  className,
}: BreadcrumbPartStyleOptions = {}): string =>
  cn(breadcrumbLinkBaseClassName, className)

export const breadcrumbPageClassName = ({
  className,
}: BreadcrumbPartStyleOptions = {}): string =>
  cn(breadcrumbPageBaseClassName, className)

export const breadcrumbSeparatorClassName = ({
  className,
}: BreadcrumbPartStyleOptions = {}): string =>
  cn(breadcrumbSeparatorBaseClassName, className)

export const breadcrumbEllipsisClassName = ({
  className,
}: BreadcrumbPartStyleOptions = {}): string =>
  cn(breadcrumbEllipsisBaseClassName, className)

const optionalStringAttribute = <Message>(
  value: string | undefined,
  toAttribute: (nextValue: string) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  value === undefined ? [] : [toAttribute(value)]

const rootClassAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string,
): Attribute<Message> =>
  className === '' ? h.Attribute('class', '') : h.Class(className)

const containerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: string,
  className: string,
  config: BreadcrumbContainerConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', slot),
  h.Class(cn(className, config.className)),
  ...(config.attributes ?? []),
]

export const chevronRightIcon = <Message>(
  attributes: ReadonlyArray<Attribute<Message>> = [],
): Html => {
  const h = html<Message>()

  return h.svg(
    [
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.Width('24'),
      h.Height('24'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.StrokeLinecap('round'),
      h.StrokeLinejoin('round'),
      h.Class('lucide lucide-chevron-right cn-rtl-flip'),
      ...attributes,
    ],
    [h.path([h.D('m9 18 6-6-6-6')], [])],
  )
}

export const moreHorizontalIcon = <Message>(
  attributes: ReadonlyArray<Attribute<Message>> = [],
): Html => {
  const h = html<Message>()

  return h.svg(
    [
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.Width('24'),
      h.Height('24'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.StrokeLinecap('round'),
      h.StrokeLinejoin('round'),
      h.Class('lucide lucide-ellipsis'),
      ...attributes,
    ],
    [
      h.circle([h.Cx('12'), h.Cy('12'), h.R('1')], []),
      h.circle([h.Cx('19'), h.Cy('12'), h.R('1')], []),
      h.circle([h.Cx('5'), h.Cy('12'), h.R('1')], []),
    ],
  )
}

export const Breadcrumb = <Message>(
  config: BreadcrumbConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const className = breadcrumbClassName(config)

  return h.nav(
    [
      h.AriaLabel(config.ariaLabel ?? 'breadcrumb'),
      h.DataAttribute('slot', 'breadcrumb'),
      rootClassAttribute<Message>(h, className),
      ...optionalStringAttribute<Message>(config.dir, value => h.Dir(value)),
      ...(config.attributes ?? []),
    ],
    config.children ?? [],
  )
}

export const BreadcrumbList = <Message>(
  config: BreadcrumbContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.ol(
    [
      ...containerAttributes(
        h,
        'breadcrumb-list',
        breadcrumbListBaseClassName,
        config,
      ),
    ],
    config.children ?? [],
  )
}

export const BreadcrumbItem = <Message>(
  config: BreadcrumbContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.li(
    [
      ...containerAttributes(
        h,
        'breadcrumb-item',
        breadcrumbItemBaseClassName,
        config,
      ),
    ],
    config.children ?? [],
  )
}

export const BreadcrumbLink = <Message>(
  config: BreadcrumbLinkConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.a(
    [
      h.DataAttribute('slot', 'breadcrumb-link'),
      ...optionalStringAttribute<Message>(config.href, value => h.Href(value)),
      ...optionalStringAttribute<Message>(config.target, value =>
        h.Target(value),
      ),
      ...optionalStringAttribute<Message>(config.rel, value => h.Rel(value)),
      h.Class(breadcrumbLinkClassName(config)),
      ...(config.attributes ?? []),
    ],
    config.children ?? [],
  )
}

export const BreadcrumbPage = <Message>(
  config: BreadcrumbContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.span(
    [
      h.DataAttribute('slot', 'breadcrumb-page'),
      h.Role('link'),
      h.AriaDisabled(true),
      h.AriaCurrent('page'),
      h.Class(breadcrumbPageClassName(config)),
      ...(config.attributes ?? []),
    ],
    config.children ?? [],
  )
}

export const BreadcrumbSeparator = <Message>(
  config: BreadcrumbContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.li(
    [
      h.DataAttribute('slot', 'breadcrumb-separator'),
      h.Role('presentation'),
      h.AriaHidden(true),
      h.Class(breadcrumbSeparatorClassName(config)),
      ...(config.attributes ?? []),
    ],
    config.children ?? [chevronRightIcon<Message>()],
  )
}

export const BreadcrumbEllipsis = <Message>(
  config: BreadcrumbContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.span(
    [
      h.DataAttribute('slot', 'breadcrumb-ellipsis'),
      h.Role('presentation'),
      h.AriaHidden(true),
      h.Class(breadcrumbEllipsisClassName(config)),
      ...(config.attributes ?? []),
    ],
    [
      moreHorizontalIcon<Message>(),
      h.span([h.Class('sr-only')], ['More']),
      ...(config.children ?? []),
    ],
  )
}
