/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as Progress from './index'
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

const viewProgress =
  (config: Omit<ViewConfig<Message>, 'value'> & { value?: number | null }) =>
  (_model: Model): Html =>
    Progress.view<Message>({
      value: config.value ?? 56,
      ...config,
    })

const viewLabeledProgress =
  (config: Omit<ViewConfig<Message>, 'value'> & { value?: number | null }) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Progress.view<Message>({
      value: config.value ?? 56,
      labelId: 'upload-progress-label',
      ...config,
      children: attributes => [
        h.span([...attributes.label], ['Upload progress']),
        h.span(
          [...attributes.value, h.Attribute('data-testid', 'value')],
          [Progress.valueText(Progress.progressState({ value: 56 }))],
        ),
      ],
    })
  }

describe('shadcn/progress class helpers', () => {
  test('use the exact origin base class strings', () => {
    expect(Progress.progressBaseClassName).toBe('flex flex-wrap gap-3')
    expect(Progress.progressTrackBaseClassName).toBe(
      'relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted',
    )
    expect(Progress.progressIndicatorBaseClassName).toBe(
      'h-full bg-primary transition-all',
    )
    expect(Progress.progressLabelBaseClassName).toBe('text-sm font-medium')
    expect(Progress.progressValueBaseClassName).toBe(
      'ml-auto text-sm text-muted-foreground tabular-nums',
    )
  })

  test('return the exact origin class strings by default', () => {
    expect(Progress.progressClassName()).toBe('flex flex-wrap gap-3')
    expect(Progress.progressTrackClassName()).toBe(
      'relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted',
    )
    expect(Progress.progressIndicatorClassName()).toBe(
      'h-full bg-primary transition-all',
    )
    expect(Progress.progressLabelClassName()).toBe('text-sm font-medium')
    expect(Progress.progressValueClassName()).toBe(
      'ml-auto text-sm text-muted-foreground tabular-nums',
    )
  })

  test('preserve custom classes through local cn canonicalization', () => {
    expect(Progress.progressClassName({ className: 'w-4 w-8' })).toContain(
      'w-8',
    )
    expect(
      Progress.progressTrackClassName({ className: 'h-2 h-3 custom-track' }),
    ).toContain('custom-track')
    expect(
      Progress.progressIndicatorClassName({
        className: 'bg-red-500 bg-blue-500',
      }),
    ).toContain('bg-blue-500')
    expect(
      Progress.progressLabelClassName({ className: 'text-xs text-lg' }),
    ).toContain('text-lg')
    expect(
      Progress.progressValueClassName({ className: 'ml-0 ml-2' }),
    ).toContain('ml-2')
  })
})

describe('shadcn/progress view', () => {
  test('adds the shadcn root data slot', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewProgress({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'data-slot',
          'progress',
        ),
      )
    }).not.toThrow()
  })

  test('default composition includes track and indicator slots', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewProgress({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="progress-track"]')).toHaveAttr(
          'data-progressing',
        ),
        Scene.expect(
          Scene.selector('[data-slot="progress-indicator"]'),
        ).toHaveStyle('width', '56%'),
      )
    }).not.toThrow()
  })

  test('label and value helpers preserve Base UI ARIA and value behavior', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewLabeledProgress({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'aria-valuenow',
          '56',
        ),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'aria-labelledby',
          'upload-progress-label',
        ),
        Scene.expect(Scene.selector('#upload-progress-label')).toHaveAttr(
          'data-slot',
          'progress-label',
        ),
        Scene.expect(Scene.selector('[data-testid="value"]')).toHaveText(
          new Intl.NumberFormat(undefined, { style: 'percent' }).format(0.56),
        ),
        Scene.expect(Scene.selector('[data-testid="value"]')).toHaveAttr(
          'aria-hidden',
          'true',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/progress installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/progress',
      '@base-ui/react',
      '@base-ui-components/react',
      'react',
      'react-dom',
      '@/components/language-selector',
      '@/styles/base-nova/ui/slider',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/progress/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/progress/index.ts',
      'src/registry/shadcn/progress/examples.ts',
    ])
    const installableSourceText = [
      indexModule.default,
      examplesModule.default,
    ].join('\n')

    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSourceText.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
