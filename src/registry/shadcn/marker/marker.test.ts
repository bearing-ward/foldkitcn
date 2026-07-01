/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  MarkerBorder,
  MarkerDemo,
  MarkerIconDemo,
  MarkerLinkButton,
  MarkerSeparator,
  MarkerShimmer,
  MarkerStatus,
} from './examples'
import {
  Marker,
  MarkerContent,
  MarkerIcon,
  MarkerVariant,
  markerBaseClassName,
  markerClassName,
  markerContentBaseClassName,
  markerContentClassName,
  markerIconBaseClassName,
  markerIconClassName,
  markerVariantValues,
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

const viewMarker =
  (config: Parameters<typeof Marker<Message>>[0] = {}) =>
  (_model: Model): Html =>
    Marker<Message>(config)

describe('shadcn/marker class helpers', () => {
  test('exports the exact origin marker variant values', () => {
    expect(S.decodeUnknownSync(MarkerVariant)('border')).toBe('border')
    expect(markerVariantValues).toStrictEqual([
      'default',
      'separator',
      'border',
    ])
  })

  test('exports the origin marker root class string', () => {
    expect(markerBaseClassName).toContain('group/marker')
    expect(markerClassName({ variant: 'separator' })).toContain('before:mr-1')
  })

  test('canonicalizes icon and content classes', () => {
    expect(markerIconBaseClassName).toContain('size-4')
    expect(markerIconClassName({ className: 'size-6 custom' })).toContain(
      'size-6',
    )
    expect(markerContentBaseClassName).toContain('wrap-break-word')
    expect(markerContentClassName({ className: 'shimmer custom' })).toContain(
      'shimmer',
    )
  })
})

describe('shadcn/marker view', () => {
  test('adds origin marker slot attributes and separator border classes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewMarker({
            variant: 'separator',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="marker"]')).toHaveAttr(
          'class',
          markerClassName({ variant: 'separator' }),
        ),
        Scene.expect(Scene.selector('[data-slot="marker"]')).toHaveAttr(
          'data-variant',
          'separator',
        ),
      )
    }).not.toThrow()
  })

  test('adds marker icon and content slots', () => {
    const h = html<Message>()

    expect(() => {
      Scene.scene(
        {
          update,
          view: () =>
            Marker<Message>({
              children: [
                MarkerIcon<Message>({
                  children: [h.span([], ['icon'])],
                }),
                MarkerContent<Message>({
                  children: ['marker'],
                }),
              ],
            }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="marker-icon"]')).toHaveAttr(
          'aria-hidden',
          'true',
        ),
        Scene.expect(Scene.selector('[data-slot="marker-content"]')).toExist(),
      )
    }).not.toThrow()
  })

  test('supports the toView composition seam for anchors and buttons', () => {
    const h = html<Message>()

    expect(() => {
      Scene.scene(
        {
          update,
          view: () =>
            Marker<Message>({
              toView: attributes => h.a([...attributes.marker], ['Link']),
            }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('a')).toHaveText('Link'),
      )
    }).not.toThrow()
  })
})

describe('shadcn/marker examples', () => {
  test('renders spinner and status examples', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => MarkerStatus() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="marker"]')).toHaveAttr(
          'role',
          'status',
        ),
        Scene.expect(Scene.selector('[data-slot="spinner"]')).toExist(),
      )
    }).not.toThrow()
  })

  test('renders icon, border, separator, shimmer, and link-button examples', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => MarkerDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="marker-icon"]')).toExist(),
      )
      Scene.scene(
        { update, view: () => MarkerIconDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="marker-content"]')).toExist(),
      )
      Scene.scene(
        { update, view: () => MarkerBorder() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="marker"]')).toExist(),
      )
      Scene.scene(
        { update, view: () => MarkerSeparator() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="marker-content"]')).toExist(),
      )
      Scene.scene(
        { update, view: () => MarkerShimmer() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="marker-content"]'),
        ).toHaveClass('shimmer'),
      )
      Scene.scene(
        { update, view: () => MarkerLinkButton() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('a')).toExist(),
        Scene.expect(Scene.selector('button')).toExist(),
      )
    }).not.toThrow()
  })

  test('exposes the installable source manifest paths', async () => {
    const manifestModule =
      await import('../../../../registry-src/shadcn/marker/item.json?raw')
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/marker/index.ts',
      'src/registry/shadcn/marker/examples.ts',
    ])
  })
})
