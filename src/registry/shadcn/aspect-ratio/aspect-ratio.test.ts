/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as AspectRatio from './index'
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

const viewAspectRatio =
  (config: Omit<ViewConfig<Message>, 'toView'>) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return AspectRatio.view<Message>({
      ...config,
      toView: attributes => h.div([...attributes.root], []),
    })
  }

describe('shadcn/aspect-ratio class helpers', () => {
  test('use the exact origin base class string', () => {
    expect(AspectRatio.baseClassName).toBe('relative aspect-(--ratio)')
  })

  test('return the exact origin class string by default', () => {
    expect(AspectRatio.aspectRatioClassName()).toBe('relative aspect-(--ratio)')
  })

  test('preserve custom classes through local cn canonicalization', () => {
    const className = AspectRatio.aspectRatioClassName({
      className: 'w-4 w-8 rounded-md rounded-lg',
    })

    expect(className).toContain('w-8')
    expect(className).toContain('rounded-lg')
    expect(className).not.toContain('w-4')
    expect(className).not.toContain('rounded-md')
  })

  test('stores the ratio in the origin CSS custom property', () => {
    expect(AspectRatio.aspectRatioStyle(16 / 9)).toStrictEqual({
      '--ratio': String(16 / 9),
    })
    expect(AspectRatio.aspectRatioStyleAttribute(16 / 9)).toBe(
      `--ratio: ${String(16 / 9)};`,
    )
  })
})

describe('shadcn/aspect-ratio view', () => {
  test('adds the shadcn data slot and ratio style', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAspectRatio({ ratio: 16 / 9 }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('div')).toHaveAttr(
          'data-slot',
          'aspect-ratio',
        ),
        Scene.expect(Scene.selector('div')).toHaveAttr(
          'style',
          `--ratio: ${String(16 / 9)};`,
        ),
        Scene.expect(Scene.selector('div')).toHaveAttr(
          'class',
          AspectRatio.aspectRatioClassName(),
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/aspect-ratio installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@radix-ui/react-aspect-ratio',
      '@radix-ui/react',
      'next/image',
      'react',
      'react-dom',
      '@/components/language-selector',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/aspect-ratio/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/aspect-ratio/index.ts',
      'src/registry/shadcn/aspect-ratio/examples.ts',
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
