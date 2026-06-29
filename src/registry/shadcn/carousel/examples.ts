import { Array as EffectArray } from 'effect'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import { Card, CardContent } from '../card'
import type {
  CarouselItemConfig,
  CarouselMessage,
  CarouselOrientation as CarouselOrientationValue,
} from './index'
import { carouselState, view as Carousel } from './index'

export type CarouselExampleMessageChange = Readonly<{
  message: CarouselMessage
  itemCount: number
  orientation?: CarouselOrientationValue
  dir?: string
}>

export type CarouselExampleController<Message> = Readonly<{
  selectedIndex?: number
  onCarouselMessage?: (change: CarouselExampleMessageChange) => Message
}>

const arabicNumerals: ReadonlyArray<string> = [
  '٠',
  '١',
  '٢',
  '٣',
  '٤',
  '٥',
  '٦',
  '٧',
  '٨',
  '٩',
]

const toArabicNumerals = (num: number): string =>
  [...num.toString()]
    .map(digit => arabicNumerals[Number.parseInt(digit, 10)] ?? digit)
    .join('')

const slideCard = (
  index: number,
  config: Readonly<{
    cardClassName?: string
    contentClassName: string
    textClassName: string
    text?: string
    wrapperClassName?: string
  }>,
): Html => {
  const h = html<never>()
  const text = config.text ?? String(index + 1)
  const card = Card<never>({
    ...(config.cardClassName === undefined
      ? {}
      : { className: config.cardClassName }),
    children: [
      CardContent<never>({
        className: config.contentClassName,
        children: [h.span([h.Class(config.textClassName)], [text])],
      }),
    ],
  })

  return config.wrapperClassName === undefined
    ? card
    : h.div([h.Class(config.wrapperClassName)], [card])
}

const slideItems = <Message = never>(
  config: Readonly<{
    contentClassName: string
    itemClassName?: string
    textClassName: string
    toText?: (index: number) => string
    wrapperClassName?: string
  }>,
): ReadonlyArray<CarouselItemConfig<Message>> =>
  EffectArray.makeBy(5, index => {
    const text = config.toText?.(index)

    return {
      ...(config.itemClassName === undefined
        ? {}
        : { className: config.itemClassName }),
      children: [
        slideCard(index, {
          contentClassName: config.contentClassName,
          textClassName: config.textClassName,
          ...(text === undefined ? {} : { text }),
          ...(config.wrapperClassName === undefined
            ? {}
            : { wrapperClassName: config.wrapperClassName }),
        }),
      ],
    }
  })

const previousControlClassName = (
  orientation: CarouselOrientationValue | undefined,
  dir: string | undefined,
): string => {
  if (orientation === 'vertical') {
    return 'top-2'
  }

  if (dir === 'rtl') {
    return 'start-2'
  }

  return 'left-2'
}

const nextControlClassName = (
  orientation: CarouselOrientationValue | undefined,
  dir: string | undefined,
): string => {
  if (orientation === 'vertical') {
    return 'bottom-2'
  }

  if (dir === 'rtl') {
    return 'end-2'
  }

  return 'right-2'
}

const carousel = <Message = never>(
  config: Readonly<{
    className: string
    contentClassName?: string
    dir?: string
    items: ReadonlyArray<CarouselItemConfig<Message>>
    nextClassName?: string
    orientation?: CarouselOrientationValue
    previousClassName?: string
  }> &
    CarouselExampleController<Message>,
): Html => {
  const { onCarouselMessage } = config
  const previousClassName = cn(
    previousControlClassName(config.orientation, config.dir),
    config.previousClassName,
  )
  const nextClassName = cn(
    nextControlClassName(config.orientation, config.dir),
    config.nextClassName,
  )

  return Carousel<Message>({
    state: carouselState({
      itemCount: config.items.length,
      ...(config.selectedIndex === undefined
        ? {}
        : { selectedIndex: config.selectedIndex }),
      ...(config.orientation === undefined
        ? {}
        : { orientation: config.orientation }),
      ...(config.dir === undefined ? {} : { dir: config.dir }),
    }),
    items: config.items,
    className: config.className,
    ...(onCarouselMessage === undefined
      ? {}
      : {
          toMessage: message =>
            onCarouselMessage({
              message,
              itemCount: config.items.length,
              ...(config.orientation === undefined
                ? {}
                : { orientation: config.orientation }),
              ...(config.dir === undefined ? {} : { dir: config.dir }),
            }),
        }),
    ...(config.contentClassName === undefined
      ? {}
      : { contentClassName: config.contentClassName }),
    previousClassName,
    nextClassName,
  })
}

export const CarouselDemo = <Message = never>(
  controller: CarouselExampleController<Message> = {},
): Html =>
  carousel({
    ...controller,
    className: 'w-full max-w-[12rem] sm:max-w-xs',
    items: slideItems<Message>({
      contentClassName: 'flex aspect-square items-center justify-center p-6',
      textClassName: 'text-4xl font-semibold',
      wrapperClassName: 'p-1',
    }),
  })

export const CarouselSize = <Message = never>(
  controller: CarouselExampleController<Message> = {},
): Html =>
  carousel({
    ...controller,
    className: 'w-full max-w-[12rem] sm:max-w-xs md:max-w-sm',
    contentClassName:
      '[--carousel-slide-step:50%] lg:[--carousel-slide-step:33.333333%]',
    items: slideItems<Message>({
      itemClassName: 'basis-1/2 lg:basis-1/3',
      contentClassName: 'flex aspect-square items-center justify-center p-6',
      textClassName: 'text-3xl font-semibold',
      wrapperClassName: 'p-1',
    }),
  })

export const CarouselMultiple = <Message = never>(
  controller: CarouselExampleController<Message> = {},
): Html =>
  carousel({
    ...controller,
    className: 'mx-auto max-w-xs sm:max-w-sm',
    contentClassName:
      '[--carousel-slide-step:50%] lg:[--carousel-slide-step:33.333333%]',
    previousClassName: 'hidden sm:inline-flex',
    nextClassName: 'hidden sm:inline-flex',
    items: slideItems<Message>({
      itemClassName: 'sm:basis-1/2 lg:basis-1/3',
      contentClassName: 'flex aspect-square items-center justify-center p-6',
      textClassName: 'text-3xl font-semibold',
      wrapperClassName: 'p-1',
    }),
  })

export const CarouselSpacing = <Message = never>(
  controller: CarouselExampleController<Message> = {},
): Html =>
  carousel({
    ...controller,
    className: 'w-full max-w-[12rem] sm:max-w-xs md:max-w-sm',
    contentClassName:
      '-ml-1 [--carousel-slide-step:50%] lg:[--carousel-slide-step:33.333333%]',
    items: slideItems<Message>({
      itemClassName: 'basis-1/2 pl-1 lg:basis-1/3',
      contentClassName: 'flex aspect-square items-center justify-center p-6',
      textClassName: 'text-2xl font-semibold',
      wrapperClassName: 'p-1',
    }),
  })

export const CarouselOrientation = <Message = never>(
  controller: CarouselExampleController<Message> = {},
): Html =>
  carousel({
    ...controller,
    className: 'w-full max-w-xs',
    orientation: 'vertical',
    contentClassName: '-mt-1 h-[340px] [--carousel-slide-step:50%]',
    items: slideItems<Message>({
      itemClassName: 'basis-1/2 pt-1',
      contentClassName: 'flex items-center justify-center p-6',
      textClassName: 'text-3xl font-semibold',
      wrapperClassName: 'p-1',
    }),
  })

export const CarouselApi = <Message = never>({
  selectedIndex,
  onCarouselMessage,
}: CarouselExampleController<Message> = {}): Html => {
  const h = html<Message>()
  const itemCount = 5
  const state = carouselState({
    itemCount,
    ...(selectedIndex === undefined ? {} : { selectedIndex }),
  })

  return h.div(
    [h.Class('mx-auto max-w-[10rem] sm:max-w-xs')],
    [
      Carousel<Message>({
        state,
        className: 'w-full max-w-xs',
        items: EffectArray.makeBy(itemCount, index => ({
          children: [
            slideCard(index, {
              cardClassName: 'm-px',
              contentClassName:
                'flex aspect-square items-center justify-center p-6',
              textClassName: 'text-4xl font-semibold',
            }),
          ],
        })),
        ...(onCarouselMessage === undefined
          ? {}
          : {
              toMessage: message => onCarouselMessage({ message, itemCount }),
            }),
      }),
      h.div(
        [h.Class('py-2 text-center text-sm text-muted-foreground')],
        [`Slide ${state.selectedIndex + 1} of ${itemCount}`],
      ),
    ],
  )
}

export const CarouselRtl = <Message = never>(
  controller: CarouselExampleController<Message> = {},
): Html =>
  carousel({
    ...controller,
    dir: 'rtl',
    className: 'w-full max-w-[12rem] sm:max-w-xs',
    items: slideItems<Message>({
      contentClassName: 'flex aspect-square items-center justify-center p-6',
      textClassName: 'text-4xl font-semibold',
      toText: index => toArabicNumerals(index + 1),
      wrapperClassName: 'p-1',
    }),
  })
