import { Array as EffectArray } from 'effect'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { Card, CardContent } from '../card'
import type {
  CarouselItemConfig,
  CarouselOrientation as CarouselOrientationValue,
} from './index'
import { carouselState, view as Carousel } from './index'

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

const slideItems = (
  config: Readonly<{
    contentClassName: string
    itemClassName?: string
    textClassName: string
    toText?: (index: number) => string
    wrapperClassName?: string
  }>,
): ReadonlyArray<CarouselItemConfig<never>> =>
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

const carousel = (
  config: Readonly<{
    className: string
    contentClassName?: string
    dir?: string
    items: ReadonlyArray<CarouselItemConfig<never>>
    nextClassName?: string
    orientation?: CarouselOrientationValue
    previousClassName?: string
  }>,
): Html =>
  Carousel<never>({
    state: carouselState({
      itemCount: config.items.length,
      orientation: config.orientation,
      dir: config.dir,
    }),
    items: config.items,
    className: config.className,
    ...(config.contentClassName === undefined
      ? {}
      : { contentClassName: config.contentClassName }),
    ...(config.previousClassName === undefined
      ? {}
      : { previousClassName: config.previousClassName }),
    ...(config.nextClassName === undefined
      ? {}
      : { nextClassName: config.nextClassName }),
  })

export const CarouselDemo = (): Html =>
  carousel({
    className: 'w-full max-w-[12rem] sm:max-w-xs',
    items: slideItems({
      contentClassName: 'flex aspect-square items-center justify-center p-6',
      textClassName: 'text-4xl font-semibold',
      wrapperClassName: 'p-1',
    }),
  })

export const CarouselSize = (): Html =>
  carousel({
    className: 'w-full max-w-[12rem] sm:max-w-xs md:max-w-sm',
    items: slideItems({
      itemClassName: 'basis-1/2 lg:basis-1/3',
      contentClassName: 'flex aspect-square items-center justify-center p-6',
      textClassName: 'text-3xl font-semibold',
      wrapperClassName: 'p-1',
    }),
  })

export const CarouselMultiple = (): Html =>
  carousel({
    className: 'mx-auto max-w-xs sm:max-w-sm',
    previousClassName: 'hidden sm:inline-flex',
    nextClassName: 'hidden sm:inline-flex',
    items: slideItems({
      itemClassName: 'sm:basis-1/2 lg:basis-1/3',
      contentClassName: 'flex aspect-square items-center justify-center p-6',
      textClassName: 'text-3xl font-semibold',
      wrapperClassName: 'p-1',
    }),
  })

export const CarouselSpacing = (): Html =>
  carousel({
    className: 'w-full max-w-[12rem] sm:max-w-xs md:max-w-sm',
    contentClassName: '-ml-1',
    items: slideItems({
      itemClassName: 'basis-1/2 pl-1 lg:basis-1/3',
      contentClassName: 'flex aspect-square items-center justify-center p-6',
      textClassName: 'text-2xl font-semibold',
      wrapperClassName: 'p-1',
    }),
  })

export const CarouselOrientation = (): Html =>
  carousel({
    className: 'w-full max-w-xs',
    orientation: 'vertical',
    contentClassName: '-mt-1 h-[270px]',
    items: slideItems({
      itemClassName: 'basis-1/2 pt-1',
      contentClassName: 'flex items-center justify-center p-6',
      textClassName: 'text-3xl font-semibold',
      wrapperClassName: 'p-1',
    }),
  })

export const CarouselApi = (): Html => {
  const h = html<never>()
  const itemCount = 5

  return h.div(
    [h.Class('mx-auto max-w-[10rem] sm:max-w-xs')],
    [
      Carousel<never>({
        state: carouselState({ itemCount }),
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
      }),
      h.div(
        [h.Class('py-2 text-center text-sm text-muted-foreground')],
        [`Slide 1 of ${itemCount}`],
      ),
    ],
  )
}

export const CarouselRtl = (): Html =>
  carousel({
    dir: 'rtl',
    className: 'w-full max-w-[12rem] sm:max-w-xs',
    items: slideItems({
      contentClassName: 'flex aspect-square items-center justify-center p-6',
      textClassName: 'text-4xl font-semibold',
      toText: index => toArabicNumerals(index + 1),
      wrapperClassName: 'p-1',
    }),
  })
