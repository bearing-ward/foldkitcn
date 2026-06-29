/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import { SpinnerBadge, SpinnerDemo, SpinnerSize } from './examples'
import {
  Spinner,
  spinnerBaseClassName,
  spinnerClassName,
  spinnerIconClassName,
  spinnerPath,
} from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

const viewSpinner =
  (config: Parameters<typeof Spinner<Message>>[0] = {}) =>
  (_model: Model): Html =>
    Spinner<Message>(config)

describe('shadcn/spinner class helpers', () => {
  test('exports the exact origin Spinner base class string', () => {
    expect(spinnerBaseClassName).toBe('size-4 animate-spin')
  })

  test('exports the local lucide loader-circle class string', () => {
    expect(spinnerIconClassName).toBe('lucide lucide-loader-circle')
  })

  test('preserves custom size classes through local cn canonicalization', () => {
    const className = spinnerClassName({ className: 'custom size-4 size-8' })

    expect(className).toContain('custom')
    expect(className).toContain('size-8')
    expect(className).not.toContain('size-4')
  })
})

describe('shadcn/spinner view', () => {
  test('adds origin spinner attributes and SVG path', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSpinner() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('svg')).toHaveAttr('data-slot', 'spinner'),
        Scene.expect(Scene.selector('svg')).toHaveAttr('role', 'status'),
        Scene.expect(Scene.selector('svg')).toHaveAttr('aria-label', 'Loading'),
        Scene.expect(Scene.selector('svg')).toHaveAttr(
          'class',
          spinnerClassName(),
        ),
        Scene.expect(Scene.selector('path')).toHaveAttr('d', spinnerPath),
      )
    }).not.toThrow()
  })

  test('supports custom attributes and aria labels', () => {
    const h = html<Message>()

    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSpinner({
            ariaLabel: 'Saving',
            className: 'size-6',
            attributes: [h.DataAttribute('icon', 'inline-start')],
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('svg')).toHaveAttr('aria-label', 'Saving'),
        Scene.expect(Scene.selector('svg')).toHaveAttr(
          'data-icon',
          'inline-start',
        ),
        Scene.expect(Scene.selector('svg')).toHaveAttr(
          'class',
          spinnerClassName({ className: 'size-6' }),
        ),
      )
    }).not.toThrow()
  })

  test('keeps the toView composition seam', () => {
    const h = html<Message>()

    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSpinner({
            toView: attributes => h.svg([...attributes.spinner], []),
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('svg')).toHaveAttr('data-slot', 'spinner'),
      )
    }).not.toThrow()
  })
})

describe('shadcn/spinner examples', () => {
  test('renders a demo Item with the Spinner root', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => SpinnerDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="item"]')).toExist(),
        Scene.expect(Scene.selector('[data-slot="spinner"]')).toExist(),
      )
    }).not.toThrow()
  })

  test('renders badge spinners with inline-start icon metadata', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => SpinnerBadge() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="badge"]')).toExist(),
        Scene.expect(Scene.selector('[data-slot="spinner"]')).toHaveAttr(
          'data-icon',
          'inline-start',
        ),
      )
    }).not.toThrow()
  })

  test('renders size examples through class canonicalization', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => SpinnerSize() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('svg.size-8')).toExist(),
      )
    }).not.toThrow()
  })

  test('exposes the installable source manifest paths', async () => {
    const manifestModule =
      await import('../../../../registry-src/shadcn/spinner/item.json?raw')
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/spinner/index.ts',
      'src/registry/shadcn/spinner/examples.ts',
    ])
  })
})
