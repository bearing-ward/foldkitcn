/// <reference types="vite/client" />

import { Array as EffectArray, Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import {
  CarouselApi,
  CarouselDemo,
  CarouselMultiple,
  CarouselOrientation,
  CarouselRtl,
  CarouselSize,
  CarouselSpacing,
} from './examples'
import * as Carousel from './index'
import type { CarouselItemConfig, ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  carousel: Carousel.CarouselState,
})
type Model = typeof Model.Type

const initialModel = (
  options: Readonly<{
    dir?: string
    itemCount?: number
    orientation?: Carousel.CarouselOrientation
    selectedIndex?: number
  }> = {},
): Model => ({
  carousel: Carousel.carouselState({
    itemCount: options.itemCount ?? 3,
    orientation: options.orientation,
    selectedIndex: options.selectedIndex,
    dir: options.dir,
  }),
})

// MESSAGE

const GotCarouselMessage = m('GotCarouselMessage', {
  message: Carousel.CarouselMessage,
})
const Message = S.Union([GotCarouselMessage])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      GotCarouselMessage: ({ message: carouselMessage }) => {
        const [carousel] = Carousel.update(model.carousel, carouselMessage)

        return [evo(model, { carousel: () => carousel }), []]
      },
    }),
  )

// VIEW

const slideItems = (
  itemCount: number,
): ReadonlyArray<CarouselItemConfig<Message>> =>
  EffectArray.makeBy(itemCount, index => {
    const h = html<Message>()

    return {
      children: [
        h.div(
          [h.Class('p-1')],
          [h.div([h.Class('aspect-square')], [`Slide ${index + 1}`])],
        ),
      ],
    }
  })

const viewCarousel =
  (config: Omit<ViewConfig<Message>, 'items' | 'state' | 'toMessage'> = {}) =>
  (model: Model): Html =>
    Carousel.view<Message>({
      state: model.carousel,
      items: slideItems(model.carousel.itemCount),
      toMessage: message => GotCarouselMessage({ message }),
      ...config,
    })

type StaticModel = Record<string, never>
type StaticMessage = never

const staticModel: StaticModel = {}
const staticUpdate = (
  model: StaticModel,
  _message: StaticMessage,
): readonly [StaticModel, ReadonlyArray<Command.Command<StaticMessage>>] => [
  model,
  [],
]

const staticView = (renderedHtml: Html) => (): Html => renderedHtml

describe('shadcn/carousel class helpers', () => {
  test('exports Schema literals and base class strings', () => {
    expect(S.decodeUnknownSync(Carousel.CarouselOrientation)('vertical')).toBe(
      'vertical',
    )
    expect(Carousel.carouselOrientationValues).toStrictEqual([
      'horizontal',
      'vertical',
    ])
    expect(Carousel.carouselClassName()).toBe('relative')
    expect(Carousel.carouselViewportClassName()).toBe('overflow-hidden')
    expect(Carousel.carouselContentClassName()).toBe('flex -ml-4')
  })

  test('exports orientation and RTL class strings', () => {
    expect(
      Carousel.carouselContentClassName({
        orientation: 'vertical',
        className: '-mt-1 h-[340px]',
      }),
    ).toBe('flex flex-col -mt-1 h-[340px]')
    expect(
      Carousel.carouselItemClassName({
        orientation: 'horizontal',
        dir: 'rtl',
      }),
    ).toBe('min-w-0 shrink-0 grow-0 basis-full ps-4')
  })

  test('preserves custom classes through local cn canonicalization', () => {
    expect(
      Carousel.carouselClassName({ className: 'relative custom' }),
    ).toContain('custom')
    expect(
      Carousel.carouselItemClassName({
        className: 'basis-full basis-1/2 pl-1',
      }),
    ).toContain('basis-1/2')
    expect(
      Carousel.carouselControlClassName({
        control: 'next',
        state: Carousel.carouselState({ itemCount: 2 }),
        className: 'hidden sm:inline-flex',
      }),
    ).toContain('sm:inline-flex')
  })
})

describe('shadcn/carousel view', () => {
  test('renders accessible slots and item groups', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCarousel() },
        Scene.with(initialModel()),
        Scene.expect(Scene.role('region')).toHaveAttr(
          'aria-roledescription',
          'carousel',
        ),
        Scene.expect(Scene.selector('[data-slot="carousel"]')).toHaveAttr(
          'class',
          Carousel.carouselClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="carousel-content"]'),
        ).toHaveAttr('class', Carousel.carouselViewportClassName()),
        Scene.expectAll(
          Scene.all.selector('[data-slot="carousel-item"]'),
        ).toHaveCount(3),
      )
    }).not.toThrow()
  })

  test('renders disabled and enabled controls', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCarousel() },
        Scene.with(initialModel()),
        Scene.expect(
          Scene.role('button', { name: 'Previous slide' }),
        ).toBeEnabled(),
        Scene.expect(
          Scene.role('button', { name: 'Next slide' }),
        ).toBeEnabled(),
      )
    }).not.toThrow()
  })

  test('clicking controls updates selected index and disabled states', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCarousel() },
        Scene.with(initialModel()),
        Scene.click(Scene.role('button', { name: 'Next slide' })),
        Scene.expect(
          Scene.role('button', { name: 'Previous slide' }),
        ).toBeEnabled(),
        Scene.expect(
          Scene.selector('[data-slot="carousel-content"] div'),
        ).toHaveStyle('transform', 'translate3d(-100%, 0, 0)'),
        Scene.click(Scene.role('button', { name: 'Previous slide' })),
        Scene.expect(
          Scene.selector('[data-slot="carousel-content"] div'),
        ).not.toHaveStyle('transform', 'translate3d(-100%, 0, 0)'),
      )
    }).not.toThrow()
  })

  test('previous control wraps from the first slide to the last slide', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCarousel() },
        Scene.with(initialModel()),
        Scene.click(Scene.role('button', { name: 'Previous slide' })),
        Scene.expect(
          Scene.selector('[data-slot="carousel-content"] div'),
        ).toHaveStyle('transform', 'translate3d(-200%, 0, 0)'),
      )
    }).not.toThrow()
  })

  test('keyboard input updates through the root carousel region', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCarousel() },
        Scene.with(initialModel()),
        Scene.keydown(Scene.role('region'), 'ArrowRight'),
        Scene.expect(
          Scene.selector('[data-slot="carousel-content"] div'),
        ).toHaveStyle('transform', 'translate3d(-100%, 0, 0)'),
        Scene.keydown(Scene.role('region'), 'ArrowLeft'),
        Scene.expect(
          Scene.selector('[data-slot="carousel-content"] div'),
        ).not.toHaveStyle('transform', 'translate3d(-100%, 0, 0)'),
      )
    }).not.toThrow()
  })

  test('vertical orientation uses vertical spacing and up/down keyboard input', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCarousel() },
        Scene.with(initialModel({ orientation: 'vertical' })),
        Scene.expect(
          Scene.selector('[data-slot="carousel-content"] div'),
        ).toHaveAttr(
          'class',
          Carousel.carouselContentClassName({ orientation: 'vertical' }),
        ),
        Scene.expect(Scene.selector('[data-slot="carousel-item"]')).toHaveAttr(
          'class',
          Carousel.carouselItemClassName({ orientation: 'vertical' }),
        ),
        Scene.keydown(Scene.role('region'), 'ArrowDown'),
        Scene.expect(
          Scene.selector('[data-slot="carousel-content"] div'),
        ).toHaveStyle('transform', 'translate3d(0, -100%, 0)'),
        Scene.keydown(Scene.role('region'), 'ArrowUp'),
        Scene.expect(
          Scene.selector('[data-slot="carousel-content"] div'),
        ).not.toHaveStyle('transform', 'translate3d(0, -100%, 0)'),
      )
    }).not.toThrow()
  })

  test('RTL state uses logical spacing, logical controls, and positive transform', () => {
    const state = Carousel.carouselState({
      itemCount: 3,
      selectedIndex: 1,
      dir: 'rtl',
    })

    expect(Carousel.carouselContentClassName(state)).toBe('flex -ms-4')
    expect(Carousel.carouselItemClassName(state)).toBe(
      'min-w-0 shrink-0 grow-0 basis-full ps-4',
    )
    expect(Carousel.carouselContentStyle(state)).toStrictEqual({
      transform: 'translate3d(100%, 0, 0)',
    })
  })

  test('examples render the replicated carousel fixtures', () => {
    expect(() => {
      Scene.scene(
        { update: staticUpdate, view: staticView(CarouselDemo()) },
        Scene.with(staticModel),
        Scene.expectAll(
          Scene.all.selector('[data-slot="carousel-item"]'),
        ).toHaveCount(5),
        Scene.expect(Scene.selector('[data-slot="card-content"]')).toHaveText(
          '1',
        ),
      )
      Scene.scene(
        { update: staticUpdate, view: staticView(CarouselSize()) },
        Scene.with(staticModel),
        Scene.expect(Scene.selector('[data-slot="carousel-item"]')).toHaveAttr(
          'class',
          Carousel.carouselItemClassName({
            className: 'basis-1/2 lg:basis-1/3',
          }),
        ),
        Scene.expectAll(
          Scene.all.selector('[data-slot="carousel-loop-fill-item"]'),
        ).toHaveCount(5),
      )
      Scene.scene(
        { update: staticUpdate, view: staticView(CarouselMultiple()) },
        Scene.with(staticModel),
        Scene.expect(
          Scene.selector('[data-slot="carousel-previous"]'),
        ).toExist(),
      )
      Scene.scene(
        { update: staticUpdate, view: staticView(CarouselSpacing()) },
        Scene.with(staticModel),
        Scene.expect(
          Scene.selector('[data-slot="carousel-content"] div'),
        ).toHaveAttr(
          'class',
          'flex -ml-1 [--carousel-slide-step:50%] lg:[--carousel-slide-step:33.333333%]',
        ),
      )
      Scene.scene(
        { update: staticUpdate, view: staticView(CarouselOrientation()) },
        Scene.with(staticModel),
        Scene.expect(
          Scene.selector('[data-slot="carousel-content"] div'),
        ).toHaveAttr(
          'class',
          'flex flex-col -mt-1 h-[340px] [--carousel-slide-step:50%]',
        ),
      )
      Scene.scene(
        { update: staticUpdate, view: staticView(CarouselApi()) },
        Scene.with(staticModel),
        Scene.expect(Scene.text('Slide 1 of 5')).toBeVisible(),
      )
      Scene.scene(
        { update: staticUpdate, view: staticView(CarouselRtl()) },
        Scene.with(staticModel),
        Scene.expect(Scene.selector('[data-slot="carousel"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(Scene.selector('[data-slot="card-content"]')).toHaveText(
          '١',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/carousel installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      'embla-carousel-autoplay',
      'embla-carousel-react',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
      '@/lib/utils',
      '@/styles/',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/carousel/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    const installableSourceText = [
      indexModule.default,
      examplesModule.default,
    ].join('\n')

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/carousel/index.ts',
      'src/registry/shadcn/carousel/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSourceText.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
