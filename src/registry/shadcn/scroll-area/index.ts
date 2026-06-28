import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseScrollArea from '../../base-ui/scroll-area'

// MODEL

export type ScrollAreaDirection = BaseScrollArea.ScrollAreaDirection
export type ScrollAreaMetrics = BaseScrollArea.ScrollAreaMetrics
export type ScrollAreaOrientation = BaseScrollArea.ScrollAreaOrientation
export type ScrollAreaScrollbarDescriptor =
  BaseScrollArea.ScrollAreaScrollbarDescriptor
export type ScrollAreaState = BaseScrollArea.ScrollAreaState
export type ScrollAreaStateOptions = BaseScrollArea.ScrollAreaStateOptions

type Child = Html | string

export const ScrollAreaStyleOptions = S.Struct({
  className: S.optional(S.String),
  viewportClassName: S.optional(S.String),
  scrollbarClassName: S.optional(S.String),
  horizontalScrollbarClassName: S.optional(S.String),
  verticalScrollbarClassName: S.optional(S.String),
  thumbClassName: S.optional(S.String),
})
export type ScrollAreaStyleOptions = typeof ScrollAreaStyleOptions.Type

// UPDATE

export const {
  minThumbSize,
  scrollAreaState,
  scrollAreaStateFromMetrics,
  thumbDragScrollOffset,
  trackPressScrollOffset,
} = BaseScrollArea

// VIEW

export type ScrollAreaAttributes<Message> =
  BaseScrollArea.ScrollAreaAttributes<Message>

export type ScrollAreaScrollbarAttributes<Message> =
  BaseScrollArea.ScrollAreaScrollbarAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseScrollArea.ViewConfig<Message>,
  'children' | 'toView'
> &
  ScrollAreaStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    toView?: (attributes: ScrollAreaAttributes<Message>) => Html
  }>

export const scrollAreaBaseClassName = 'relative'

export const scrollAreaViewportBaseClassName =
  'size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 base-ui-disable-scrollbar'

export const scrollAreaScrollbarBaseClassName =
  'flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent'

export const scrollAreaScrollbarRtlBaseClassName =
  'flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-s data-vertical:border-s-transparent'

export const scrollAreaThumbBaseClassName =
  'relative flex-1 rounded-full bg-border'

export const scrollAreaClassName = ({
  className,
}: Pick<ScrollAreaStyleOptions, 'className'> = {}): string =>
  cn(scrollAreaBaseClassName, className)

export const scrollAreaViewportClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(scrollAreaViewportBaseClassName, className)

export const scrollAreaScrollbarClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: BaseScrollArea.ScrollAreaDirection | undefined
}> = {}): string =>
  cn(
    dir === 'rtl'
      ? scrollAreaScrollbarRtlBaseClassName
      : scrollAreaScrollbarBaseClassName,
    className,
  )

export const scrollAreaThumbClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(scrollAreaThumbBaseClassName, className)

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'className'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'scroll-area'),
  h.Class(scrollAreaClassName({ className: config.className })),
]

const viewportAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'viewportClassName'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'scroll-area-viewport'),
  h.Class(
    scrollAreaViewportClassName({
      className: config.viewportClassName,
    }),
  ),
]

const scrollbarClassName = <Message>(
  config: Pick<
    ViewConfig<Message>,
    | 'scrollbarClassName'
    | 'horizontalScrollbarClassName'
    | 'verticalScrollbarClassName'
  >,
  orientation: BaseScrollArea.ScrollAreaOrientation,
): string | undefined => {
  if (orientation === 'horizontal') {
    return cn(config.scrollbarClassName, config.horizontalScrollbarClassName)
  }

  return cn(config.scrollbarClassName, config.verticalScrollbarClassName)
}

const scrollbarAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  scrollbar: ScrollAreaScrollbarAttributes<Message>,
): ScrollAreaScrollbarAttributes<Message> => ({
  orientation: scrollbar.orientation,
  isMounted: scrollbar.isMounted,
  root: [
    ...scrollbar.root,
    h.DataAttribute('slot', 'scroll-area-scrollbar'),
    h.DataAttribute('orientation', scrollbar.orientation),
    h.Class(
      scrollAreaScrollbarClassName({
        className: scrollbarClassName(config, scrollbar.orientation),
        dir: config.dir,
      }),
    ),
  ],
  thumb: [
    ...scrollbar.thumb,
    h.DataAttribute('slot', 'scroll-area-thumb'),
    h.Class(scrollAreaThumbClassName({ className: config.thumbClassName })),
  ],
})

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: ScrollAreaAttributes<Message>,
): ScrollAreaAttributes<Message> => ({
  state: attributes.state,
  root: [...attributes.root, ...rootAttributes(h, config)],
  viewport: [...attributes.viewport, ...viewportAttributes(h, config)],
  content: attributes.content,
  scrollbars: attributes.scrollbars.map(scrollbar =>
    scrollbarAttributes(h, config, scrollbar),
  ),
  corner: attributes.corner,
})

export const view = <Message>(config: ViewConfig<Message> = {}): Html => {
  const h = html<Message>()
  const { toView, children = [], ...baseConfig } = config

  return BaseScrollArea.view<Message>({
    ...baseConfig,
    toView: attributes => {
      const scrollAreaAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(scrollAreaAttributes)
      }

      return h.div(
        [...scrollAreaAttributes.root],
        [
          h.div([...scrollAreaAttributes.viewport], children),
          ...scrollAreaAttributes.scrollbars.flatMap(scrollbar =>
            scrollbar.isMounted
              ? [h.div([...scrollbar.root], [h.div([...scrollbar.thumb], [])])]
              : [],
          ),
          ...(scrollAreaAttributes.corner.isMounted
            ? [h.div([...scrollAreaAttributes.corner.root], [])]
            : []),
        ],
      )
    },
  })
}

export const ScrollArea = view
