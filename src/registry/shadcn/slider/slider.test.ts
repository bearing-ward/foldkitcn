/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as Slider from './index'
import type { ViewConfig } from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

const viewSlider =
  (config: Omit<ViewConfig<Message>, 'values'> & { values?: Array<number> }) =>
  (_model: Model): Html =>
    Slider.view<Message>({
      values: config.values ?? [25, 75],
      ...config,
    })

describe('shadcn/slider class helpers', () => {
  test('use the exact origin base class strings', () => {
    expect(Slider.sliderBaseClassName).toBe(
      'data-horizontal:w-full data-vertical:h-full',
    )
    expect(Slider.sliderControlBaseClassName).toContain(
      'relative flex w-full touch-none items-center select-none',
    )
    expect(Slider.sliderTrackBaseClassName).toContain(
      'relative grow overflow-hidden rounded-full bg-muted',
    )
    expect(Slider.sliderRangeBaseClassName).toBe(
      'bg-primary select-none data-horizontal:h-full data-vertical:w-full',
    )
    expect(Slider.sliderThumbBaseClassName).toContain(
      'relative block size-3 shrink-0 rounded-full border border-ring bg-white',
    )
  })

  test('preserve custom classes through local cn canonicalization', () => {
    expect(Slider.sliderClassName({ className: 'w-8 w-12 custom' })).toContain(
      'custom',
    )
    expect(Slider.sliderClassName({ className: 'w-8 w-12 custom' })).toContain(
      'w-12',
    )
    expect(
      Slider.sliderTrackClassName({ className: 'h-2 h-4 custom-track' }),
    ).toContain('custom-track')
    expect(
      Slider.sliderRangeClassName({ className: 'bg-red-500 bg-blue-500' }),
    ).toContain('bg-blue-500')
    expect(
      Slider.sliderThumbClassName({ className: 'size-2 size-5' }),
    ).toContain('size-5')
  })
})

describe('shadcn/slider view', () => {
  test('adds shadcn slots and composes the default track/range/thumb structure', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSlider({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr('data-slot', 'slider'),
        Scene.expect(Scene.selector('[data-slot="slider-track"]')).toHaveAttr(
          'class',
          Slider.sliderTrackClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="slider-range"]')).toHaveAttr(
          'class',
          Slider.sliderRangeClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="slider-thumb"]')).toHaveAttr(
          'class',
          Slider.sliderThumbClassName(),
        ),
      )
    }).not.toThrow()
  })

  test('passes Base UI disabled and orientation attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSlider({
            isDisabled: true,
            orientation: 'vertical',
            className: 'h-40',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr(
          'data-orientation',
          'vertical',
        ),
        Scene.expect(Scene.role('group')).toHaveAttr('data-disabled'),
        Scene.expect(Scene.selector('[data-slot="slider-thumb"]')).toHaveAttr(
          'data-disabled',
        ),
        Scene.expect(Scene.selector('input[type="range"]')).toHaveAttr(
          'disabled',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('renders one thumb per canonical value and keeps range geometry deterministic', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSlider({
            values: [80, 20, 50],
            max: 100,
            step: 10,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-index="0"]')).toHaveStyle(
          'insetInlineStart',
          'calc(20% + 3.6px)',
        ),
        Scene.expect(Scene.selector('[data-index="2"]')).toHaveStyle(
          'insetInlineStart',
          'calc(80% + -3.6px)',
        ),
        Scene.expect(Scene.selector('[data-slot="slider-range"]')).toHaveStyle(
          'width',
          'calc(60% + -7.2px)',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/slider installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/slider',
      '@base-ui-components/react/slider',
      'react',
      'react-dom',
      '@/components/language-selector',
      'shadcn/label',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/slider/item.json?raw'),
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
      'src/registry/shadcn/slider/index.ts',
      'src/registry/shadcn/slider/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSourceText.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
