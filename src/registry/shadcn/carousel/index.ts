import { Match as M, Option, Schema as S } from 'effect'
import type { Command } from 'foldkit'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

import { cn } from '../../../utils/cn'
import * as Button from '../button'

// MODEL

export const CarouselOrientation = S.Union([
  S.Literal('horizontal'),
  S.Literal('vertical'),
])
export type CarouselOrientation = typeof CarouselOrientation.Type

export const carouselOrientationValues: ReadonlyArray<CarouselOrientation> = [
  'horizontal',
  'vertical',
]

export const CarouselState = S.Struct({
  selectedIndex: S.Number,
  itemCount: S.Number,
  orientation: CarouselOrientation,
  dir: S.optional(S.String),
  canScrollPrevious: S.Boolean,
  canScrollNext: S.Boolean,
})
export type CarouselState = typeof CarouselState.Type

export const CarouselStateOptions = S.Struct({
  selectedIndex: S.optional(S.Number),
  itemCount: S.Number,
  orientation: S.optional(CarouselOrientation),
  dir: S.optional(S.String),
})
export type CarouselStateOptions = typeof CarouselStateOptions.Type

const normalizedItemCount = (itemCount: number): number =>
  Math.max(0, Math.floor(itemCount))

const wrapSelectedIndex = (
  selectedIndex: number,
  itemCount: number,
): number => {
  const count = normalizedItemCount(itemCount)

  if (count === 0) {
    return 0
  }

  return ((Math.floor(selectedIndex) % count) + count) % count
}

export const carouselState = ({
  selectedIndex = 0,
  itemCount,
  orientation = 'horizontal',
  dir,
}: CarouselStateOptions): CarouselState => {
  const count = normalizedItemCount(itemCount)
  const index = wrapSelectedIndex(selectedIndex, count)
  const canScroll = count > 1

  return {
    selectedIndex: index,
    itemCount: count,
    orientation,
    dir,
    canScrollPrevious: canScroll,
    canScrollNext: canScroll,
  }
}

export const selectedCarouselState = (
  state: CarouselState,
  selectedIndex: number,
): CarouselState =>
  carouselState({
    selectedIndex,
    itemCount: state.itemCount,
    orientation: state.orientation,
    dir: state.dir,
  })

export const previousCarouselState = (state: CarouselState): CarouselState =>
  selectedCarouselState(state, state.selectedIndex - 1)

export const nextCarouselState = (state: CarouselState): CarouselState =>
  selectedCarouselState(state, state.selectedIndex + 1)

// MESSAGE

export const ClickedCarouselPrevious = m('ClickedCarouselPrevious')
export const ClickedCarouselNext = m('ClickedCarouselNext')
export const PressedCarouselKey = m('PressedCarouselKey', { key: S.String })
export const CarouselMessage = S.Union([
  ClickedCarouselPrevious,
  ClickedCarouselNext,
  PressedCarouselKey,
])
export type CarouselMessage = typeof CarouselMessage.Type

// UPDATE

export type UpdateReturn = readonly [
  CarouselState,
  ReadonlyArray<Command.Command<CarouselMessage>>,
]

const withUpdateReturn = M.withReturnType<UpdateReturn>()

export const carouselMessageForKey = (
  state: CarouselState,
  key: string,
): Option.Option<CarouselMessage> => {
  if (state.orientation === 'vertical') {
    if (key === 'ArrowUp') {
      return Option.some(ClickedCarouselPrevious())
    }

    if (key === 'ArrowDown') {
      return Option.some(ClickedCarouselNext())
    }

    return Option.none()
  }

  if (key === 'ArrowLeft') {
    return Option.some(ClickedCarouselPrevious())
  }

  if (key === 'ArrowRight') {
    return Option.some(ClickedCarouselNext())
  }

  return Option.none()
}

export const update = (
  state: CarouselState,
  message: CarouselMessage,
): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ClickedCarouselPrevious: () => [previousCarouselState(state), []],
      ClickedCarouselNext: () => [nextCarouselState(state), []],
      PressedCarouselKey: ({ key }) =>
        Option.match(carouselMessageForKey(state, key), {
          onNone: () => [state, []],
          onSome: keyMessage => update(state, keyMessage),
        }),
    }),
  )

// VIEW

type Child = Html | string

export const CarouselStyleOptions = S.Struct({
  className: S.optional(S.String),
  contentClassName: S.optional(S.String),
  itemClassName: S.optional(S.String),
  previousClassName: S.optional(S.String),
  nextClassName: S.optional(S.String),
})
export type CarouselStyleOptions = typeof CarouselStyleOptions.Type

export type CarouselItemConfig<Message> = Readonly<{
  children?: ReadonlyArray<Child>
  className?: string
  attributes?: ReadonlyArray<Attribute<Message>>
}>

export type CarouselItemAttributes<Message> = Readonly<{
  item: CarouselItemConfig<Message>
  root: ReadonlyArray<Attribute<Message>>
}>

export type CarouselAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  viewport: ReadonlyArray<Attribute<Message>>
  content: ReadonlyArray<Attribute<Message>>
  items: ReadonlyArray<CarouselItemAttributes<Message>>
  previousControl: Html
  nextControl: Html
}>

export type ViewConfig<Message> = CarouselStyleOptions &
  Readonly<{
    state: CarouselState
    items: ReadonlyArray<CarouselItemConfig<Message>>
    toMessage?: (message: CarouselMessage) => Message
    toView?: (attributes: CarouselAttributes<Message>) => Html
  }>

export const carouselBaseClassName = 'relative'

export const carouselViewportBaseClassName = 'overflow-hidden'

export const carouselContentBaseClassName = 'flex'

export const carouselContentHorizontalClassName = '-ml-4'

export const carouselContentHorizontalRtlClassName = '-ms-4'

export const carouselContentVerticalClassName = '-mt-4 flex-col'

export const carouselItemBaseClassName = 'min-w-0 shrink-0 grow-0 basis-full'

export const carouselItemHorizontalClassName = 'pl-4'

export const carouselItemHorizontalRtlClassName = 'ps-4'

export const carouselItemVerticalClassName = 'pt-4'

export const carouselControlBaseClassName =
  'absolute touch-manipulation rounded-full'

export const carouselPreviousHorizontalClassName = 'inset-y-0 -left-12 my-auto'

export const carouselNextHorizontalClassName = 'inset-y-0 -right-12 my-auto'

export const carouselPreviousHorizontalRtlClassName =
  'inset-y-0 -start-12 my-auto'

export const carouselNextHorizontalRtlClassName = 'inset-y-0 -end-12 my-auto'

export const carouselPreviousVerticalClassName =
  '-top-12 left-1/2 -translate-x-1/2 rotate-90'

export const carouselNextVerticalClassName =
  '-bottom-12 left-1/2 -translate-x-1/2 rotate-90'

export const carouselPreviousVerticalRtlClassName =
  'start-1/2 -top-12 -translate-x-1/2 rotate-90 rtl:translate-x-1/2'

export const carouselNextVerticalRtlClassName =
  'start-1/2 -bottom-12 -translate-x-1/2 rotate-90 rtl:translate-x-1/2'

const isRtl = (dir: string | undefined): boolean => dir === 'rtl'

const carouselContentOrientationClassName = (
  orientation: CarouselOrientation,
  dir?: string | undefined,
): string => {
  if (orientation === 'vertical') {
    return carouselContentVerticalClassName
  }

  if (isRtl(dir)) {
    return carouselContentHorizontalRtlClassName
  }

  return carouselContentHorizontalClassName
}

const carouselItemOrientationClassName = (
  orientation: CarouselOrientation,
  dir?: string | undefined,
): string => {
  if (orientation === 'vertical') {
    return carouselItemVerticalClassName
  }

  if (isRtl(dir)) {
    return carouselItemHorizontalRtlClassName
  }

  return carouselItemHorizontalClassName
}

export const carouselClassName = ({
  className,
}: Pick<CarouselStyleOptions, 'className'> = {}): string =>
  cn(carouselBaseClassName, className)

export const carouselViewportClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(carouselViewportBaseClassName, className)

export const carouselContentClassName = ({
  className,
  orientation = 'horizontal',
  dir,
}: Readonly<{
  className?: string | undefined
  orientation?: CarouselOrientation | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(
    carouselContentBaseClassName,
    carouselContentOrientationClassName(orientation, dir),
    className,
  )

export const carouselItemClassName = ({
  className,
  orientation = 'horizontal',
  dir,
}: Readonly<{
  className?: string | undefined
  orientation?: CarouselOrientation | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(
    carouselItemBaseClassName,
    carouselItemOrientationClassName(orientation, dir),
    className,
  )

const carouselControlPlacementClassName = (
  control: 'previous' | 'next',
  state: Pick<CarouselState, 'dir' | 'orientation'>,
): string =>
  M.value({
    control,
    orientation: state.orientation,
    isRtl: isRtl(state.dir),
  }).pipe(
    M.withReturnType<string>(),
    M.when(
      { control: 'previous', orientation: 'horizontal', isRtl: false },
      () => carouselPreviousHorizontalClassName,
    ),
    M.when(
      { control: 'next', orientation: 'horizontal', isRtl: false },
      () => carouselNextHorizontalClassName,
    ),
    M.when(
      { control: 'previous', orientation: 'horizontal', isRtl: true },
      () => carouselPreviousHorizontalRtlClassName,
    ),
    M.when(
      { control: 'next', orientation: 'horizontal', isRtl: true },
      () => carouselNextHorizontalRtlClassName,
    ),
    M.when(
      { control: 'previous', orientation: 'vertical', isRtl: false },
      () => carouselPreviousVerticalClassName,
    ),
    M.when(
      { control: 'next', orientation: 'vertical', isRtl: false },
      () => carouselNextVerticalClassName,
    ),
    M.when(
      { control: 'previous', orientation: 'vertical', isRtl: true },
      () => carouselPreviousVerticalRtlClassName,
    ),
    M.when(
      { control: 'next', orientation: 'vertical', isRtl: true },
      () => carouselNextVerticalRtlClassName,
    ),
    M.exhaustive,
  )

export const carouselControlClassName = ({
  className,
  control,
  state,
}: Readonly<{
  className?: string | undefined
  control: 'previous' | 'next'
  state: Pick<CarouselState, 'dir' | 'orientation'>
}>): string =>
  cn(
    carouselControlBaseClassName,
    carouselControlPlacementClassName(control, state),
    className,
  )

const hasKeyboardModifier = (modifiers: KeyboardModifiers): boolean =>
  modifiers.altKey ||
  modifiers.ctrlKey ||
  modifiers.metaKey ||
  modifiers.shiftKey

const keyboardAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'toMessage'>,
  state: CarouselState,
): ReadonlyArray<Attribute<Message>> => {
  const { toMessage } = config

  if (toMessage === undefined) {
    return []
  }

  return [
    h.OnKeyDownPreventDefault((key, modifiers) => {
      if (hasKeyboardModifier(modifiers)) {
        return Option.none()
      }

      return Option.map(carouselMessageForKey(state, key), () =>
        toMessage(PressedCarouselKey({ key })),
      )
    }),
  ]
}

const optionalDir = <Message>(
  h: ReturnType<typeof html<Message>>,
  dir: string | undefined,
): ReadonlyArray<Attribute<Message>> => (dir === undefined ? [] : [h.Dir(dir)])

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: CarouselState,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('region'),
  h.AriaRoleDescription('carousel'),
  h.DataAttribute('slot', 'carousel'),
  h.Class(carouselClassName({ className: config.className })),
  ...optionalDir(h, state.dir),
  ...keyboardAttributes(h, config, state),
]

const viewportAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'carousel-content'),
  h.Class(carouselViewportClassName()),
]

export const carouselContentStyle = (
  state: Pick<CarouselState, 'dir' | 'orientation' | 'selectedIndex'>,
  config: Readonly<{ usesSlideStepVariable?: boolean }> = {},
): Record<string, string> => {
  if (state.selectedIndex === 0) {
    return {}
  }

  if (config.usesSlideStepVariable === true) {
    const multiplier = isRtl(state.dir)
      ? state.selectedIndex
      : -state.selectedIndex
    const offset = `calc(var(--carousel-slide-step, 100%) * ${multiplier})`

    if (state.orientation === 'vertical') {
      return {
        transform: `translate3d(0, calc(var(--carousel-slide-step, 100%) * -${state.selectedIndex}), 0)`,
      }
    }

    return {
      transform: `translate3d(${offset}, 0, 0)`,
    }
  }

  const offset = state.selectedIndex * 100
  const multiplier = isRtl(state.dir)
    ? state.selectedIndex
    : -state.selectedIndex

  if (state.orientation === 'vertical') {
    return { transform: `translate3d(0, -${offset}%, 0)` }
  }

  return {
    transform: `translate3d(${multiplier * 100}%, 0, 0)`,
  }
}

const usesSlideStepVariable = (className: string | undefined): boolean =>
  className === undefined ? false : className.includes('--carousel-slide-step')

const styleAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: CarouselState,
): ReadonlyArray<Attribute<Message>> => {
  const style = carouselContentStyle(state, {
    usesSlideStepVariable: usesSlideStepVariable(config.contentClassName),
  })
  return Object.keys(style).length === 0 ? [] : [h.Style(style)]
}

const contentAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: CarouselState,
): ReadonlyArray<Attribute<Message>> => [
  h.Class(
    carouselContentClassName({
      className: config.contentClassName,
      orientation: state.orientation,
      dir: state.dir,
    }),
  ),
  ...styleAttributes(h, config, state),
]

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: CarouselState,
  item: CarouselItemConfig<Message>,
): CarouselItemAttributes<Message> => ({
  item,
  root: [
    h.Role('group'),
    h.AriaRoleDescription('slide'),
    h.DataAttribute('slot', 'carousel-item'),
    h.Class(
      carouselItemClassName({
        className: cn(config.itemClassName, item.className),
        orientation: state.orientation,
        dir: state.dir,
      }),
    ),
    ...(item.attributes ?? []),
  ],
})

const loopFillItemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: CarouselState,
  item: CarouselItemConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.AriaHidden(true),
  h.DataAttribute('slot', 'carousel-loop-fill-item'),
  h.Class(
    carouselItemClassName({
      className: cn(config.itemClassName, item.className),
      orientation: state.orientation,
      dir: state.dir,
    }),
  ),
]

const icon = (kind: 'left' | 'right', dir: string | undefined): Html => {
  const h = html<never>()
  const d = kind === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'
  const className = isRtl(dir) ? 'rtl:rotate-180' : 'cn-rtl-flip'

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
      h.AriaHidden(true),
    ],
    [h.path([h.D(d)], [])],
  )
}

const control = <Message>(
  config: ViewConfig<Message>,
  state: CarouselState,
  kind: 'previous' | 'next',
): Html => {
  const h = html<Message>()
  const canScroll =
    kind === 'previous' ? state.canScrollPrevious : state.canScrollNext
  const localMessage =
    kind === 'previous' ? ClickedCarouselPrevious() : ClickedCarouselNext()
  const onClick =
    config.toMessage === undefined ? undefined : config.toMessage(localMessage)
  const className = carouselControlClassName({
    control: kind,
    state,
    className:
      kind === 'previous' ? config.previousClassName : config.nextClassName,
  })

  return Button.view<Message>({
    variant: 'outline',
    size: 'icon-sm',
    className,
    isDisabled: !canScroll,
    ...(onClick === undefined ? {} : { onClick }),
    toView: attributes =>
      h.button(
        [
          ...attributes.button,
          h.DataAttribute(
            'slot',
            kind === 'previous' ? 'carousel-previous' : 'carousel-next',
          ),
        ],
        [
          icon(kind === 'previous' ? 'left' : 'right', state.dir),
          h.span(
            [h.Class('sr-only')],
            [kind === 'previous' ? 'Previous slide' : 'Next slide'],
          ),
        ],
      ),
  })
}

const carouselAttributes = <Message>(
  config: ViewConfig<Message>,
): CarouselAttributes<Message> => {
  const h = html<Message>()
  const state = carouselState({
    selectedIndex: config.state.selectedIndex,
    itemCount: config.items.length,
    orientation: config.state.orientation,
    dir: config.state.dir,
  })

  return {
    root: rootAttributes(h, config, state),
    viewport: viewportAttributes(h),
    content: contentAttributes(h, config, state),
    items: config.items.map(item => itemAttributes(h, config, state, item)),
    previousControl: control(config, state, 'previous'),
    nextControl: control(config, state, 'next'),
  }
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const attributes = carouselAttributes(config)
  const state = carouselState({
    selectedIndex: config.state.selectedIndex,
    itemCount: config.items.length,
    orientation: config.state.orientation,
    dir: config.state.dir,
  })

  if (config.toView !== undefined) {
    return config.toView(attributes)
  }

  return h.div(
    [...attributes.root],
    [
      h.div(
        [...attributes.viewport],
        [
          h.div(
            [...attributes.content],
            [
              ...attributes.items.map(item =>
                h.div([...item.root], item.item.children ?? []),
              ),
              ...attributes.items.map(item =>
                h.div(
                  [...loopFillItemAttributes(h, config, state, item.item)],
                  item.item.children ?? [],
                ),
              ),
            ],
          ),
        ],
      ),
      attributes.previousControl,
      attributes.nextControl,
    ],
  )
}
