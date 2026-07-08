import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import type { ButtonSize } from '../button'
import { view as Button } from '../button'

// MODEL

export const PaginationDirection = S.Union([S.Literal('ltr'), S.Literal('rtl')])
export type PaginationDirection = typeof PaginationDirection.Type

export const PaginationStyleOptions = S.Struct({
  ariaLabel: S.optional(S.String),
  className: S.optional(S.String),
  dir: S.optional(PaginationDirection),
})
export type PaginationStyleOptions = typeof PaginationStyleOptions.Type

export const PaginationPartStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type PaginationPartStyleOptions = typeof PaginationPartStyleOptions.Type

export const PaginationLinkStyleOptions = S.Struct({
  className: S.optional(S.String),
  href: S.optional(S.String),
  target: S.optional(S.String),
  rel: S.optional(S.String),
  ariaLabel: S.optional(S.String),
  isActive: S.optional(S.Boolean),
  isDisabled: S.optional(S.Boolean),
})
export type PaginationLinkStyleOptions = typeof PaginationLinkStyleOptions.Type

type Child = Html | string

// VIEW

export type PaginationContainerConfig<Message> = PaginationPartStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
  }>

export type PaginationConfig<Message> = PaginationStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
  }>

export type PaginationLinkConfig<Message> = PaginationLinkStyleOptions &
  Readonly<{
    size?: ButtonSize
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
    onClick?: Message
    isFocusableWhenDisabled?: boolean
  }>

export type PaginationDirectionLinkConfig<Message> =
  PaginationLinkConfig<Message> &
    Readonly<{
      dir?: PaginationDirection
      text?: string
    }>

export const paginationBaseClassName = 'mx-auto flex w-full justify-center'

export const paginationContentBaseClassName = 'flex items-center gap-0.5'

export const paginationEllipsisBaseClassName =
  "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4"

export const paginationPreviousBaseClassName = ''

export const paginationNextBaseClassName = ''

export const paginationPreviousRtlBaseClassName = ''

export const paginationNextRtlBaseClassName = ''

export const paginationClassName = ({
  className,
}: Pick<PaginationStyleOptions, 'className'> = {}): string =>
  cn(paginationBaseClassName, className)

export const paginationContentClassName = ({
  className,
}: PaginationPartStyleOptions = {}): string =>
  cn(paginationContentBaseClassName, className)

export const paginationItemClassName = ({
  className,
}: PaginationPartStyleOptions = {}): string => cn(className)

export const paginationEllipsisClassName = ({
  className,
}: PaginationPartStyleOptions = {}): string =>
  cn(paginationEllipsisBaseClassName, className)

export const paginationPreviousClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: PaginationDirection | undefined
}> = {}): string =>
  cn(
    dir === 'rtl'
      ? paginationPreviousRtlBaseClassName
      : paginationPreviousBaseClassName,
    className,
  )

export const paginationNextClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: PaginationDirection | undefined
}> = {}): string =>
  cn(
    dir === 'rtl'
      ? paginationNextRtlBaseClassName
      : paginationNextBaseClassName,
    className,
  )

const optionalStringAttribute = <Message>(
  value: string | undefined,
  toAttribute: (nextValue: string) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  value === undefined ? [] : [toAttribute(value)]

const optionalBooleanDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  key: string,
  value: boolean | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === undefined ? [] : [h.DataAttribute(key, String(value))]

const containerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: string,
  className: string,
  config: PaginationContainerConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', slot),
  h.Class(cn(className, config.className)),
  ...(config.attributes ?? []),
]

const linkAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: PaginationLinkConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  ...optionalStringAttribute<Message>(config.href, value => h.Href(value)),
  ...optionalStringAttribute<Message>(config.target, value => h.Target(value)),
  ...optionalStringAttribute<Message>(config.rel, value => h.Rel(value)),
  ...optionalStringAttribute<Message>(config.ariaLabel, value =>
    h.AriaLabel(value),
  ),
  ...(config.isActive === true ? [h.AriaCurrent('page')] : []),
  h.DataAttribute('slot', 'pagination-link'),
  ...optionalBooleanDataAttribute(h, 'active', config.isActive),
  ...(config.attributes ?? []),
]

const icon = <Message>(
  className: string,
  attributes: ReadonlyArray<Attribute<Message>>,
  children: ReadonlyArray<Html>,
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
      h.Class(className),
      ...attributes,
    ],
    children,
  )
}

export const chevronLeftIcon = <Message>(
  attributes: ReadonlyArray<Attribute<Message>> = [],
): Html => {
  const h = html<Message>()

  return icon('lucide lucide-chevron-left cn-rtl-flip', attributes, [
    h.path([h.D('m15 18-6-6 6-6')], []),
  ])
}

export const chevronRightIcon = <Message>(
  attributes: ReadonlyArray<Attribute<Message>> = [],
): Html => {
  const h = html<Message>()

  return icon('lucide lucide-chevron-right cn-rtl-flip', attributes, [
    h.path([h.D('m9 18 6-6-6-6')], []),
  ])
}

export const moreHorizontalIcon = <Message>(
  attributes: ReadonlyArray<Attribute<Message>> = [],
): Html => {
  const h = html<Message>()

  return icon('lucide lucide-ellipsis', attributes, [
    h.circle([h.Cx('12'), h.Cy('12'), h.R('1')], []),
    h.circle([h.Cx('19'), h.Cy('12'), h.R('1')], []),
    h.circle([h.Cx('5'), h.Cy('12'), h.R('1')], []),
  ])
}

export const Pagination = <Message>(
  config: PaginationConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.nav(
    [
      h.Role('navigation'),
      h.AriaLabel(config.ariaLabel ?? 'pagination'),
      h.DataAttribute('slot', 'pagination'),
      h.Class(paginationClassName(config)),
      ...optionalStringAttribute<Message>(config.dir, value => h.Dir(value)),
      ...(config.attributes ?? []),
    ],
    config.children ?? [],
  )
}

export const PaginationContent = <Message>(
  config: PaginationContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.ul(
    [
      ...containerAttributes(
        h,
        'pagination-content',
        paginationContentBaseClassName,
        config,
      ),
    ],
    config.children ?? [],
  )
}

export const PaginationItem = <Message>(
  config: PaginationContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.li(
    [
      h.DataAttribute('slot', 'pagination-item'),
      h.Class(paginationItemClassName(config)),
      ...(config.attributes ?? []),
    ],
    config.children ?? [],
  )
}

export const PaginationLink = <Message>(
  config: PaginationLinkConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const {
    children = [],
    className,
    isActive = false,
    isDisabled = false,
    isFocusableWhenDisabled = false,
    onClick,
    size = 'icon',
  } = config

  return Button<Message>({
    variant: isActive ? 'outline' : 'ghost',
    size,
    className: cn(className),
    isNativeButton: false,
    isDisabled,
    isFocusableWhenDisabled,
    ...(onClick === undefined ? {} : { onClick }),
    toView: attributes =>
      h.a([...attributes.button, ...linkAttributes(h, config)], children),
  })
}

export const PaginationPrevious = <Message>(
  config: PaginationDirectionLinkConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const { text = 'Previous', className, children, dir, ...linkConfig } = config
  const previousClassName =
    className === undefined
      ? paginationPreviousClassName({ dir })
      : paginationPreviousClassName({ className, dir })

  return PaginationLink<Message>({
    ...linkConfig,
    ariaLabel: config.ariaLabel ?? 'Go to previous page',
    size: 'default',
    className: previousClassName,
    children: children ?? [
      chevronLeftIcon<Message>([h.DataAttribute('icon', 'inline-start')]),
      h.span([h.Class('hidden sm:block')], [text]),
    ],
  })
}

export const PaginationNext = <Message>(
  config: PaginationDirectionLinkConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const { text = 'Next', className, children, dir, ...linkConfig } = config
  const nextClassName =
    className === undefined
      ? paginationNextClassName({ dir })
      : paginationNextClassName({ className, dir })

  return PaginationLink<Message>({
    ...linkConfig,
    ariaLabel: config.ariaLabel ?? 'Go to next page',
    size: 'default',
    className: nextClassName,
    children: children ?? [
      h.span([h.Class('hidden sm:block')], [text]),
      chevronRightIcon<Message>([h.DataAttribute('icon', 'inline-end')]),
    ],
  })
}

export const PaginationEllipsis = <Message>(
  config: PaginationContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.span(
    [
      h.AriaHidden(true),
      h.DataAttribute('slot', 'pagination-ellipsis'),
      h.Class(paginationEllipsisClassName(config)),
      ...(config.attributes ?? []),
    ],
    [
      moreHorizontalIcon<Message>(),
      h.span([h.Class('sr-only')], ['More pages']),
      ...(config.children ?? []),
    ],
  )
}
