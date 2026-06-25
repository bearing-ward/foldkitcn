/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as Avatar from './index'
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

const viewAvatar =
  (config: Omit<ViewConfig<Message>, 'toView'>) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Avatar.view<Message>({
      ...config,
      toView: (attributes, state) =>
        h.span(
          [...attributes.root],
          [
            ...(state.shouldRenderImage
              ? [
                  h.img([
                    ...attributes.image,
                    h.Attribute('data-testid', 'image'),
                  ]),
                ]
              : []),
            ...(state.shouldRenderFallback
              ? [
                  h.span(
                    [
                      ...attributes.fallback,
                      h.Attribute('data-testid', 'fallback'),
                    ],
                    ['CN'],
                  ),
                ]
              : []),
          ],
        ),
    })
  }

describe('shadcn/avatar class helpers', () => {
  test('exports Effect Schema literals for sizes', () => {
    expect(S.decodeUnknownSync(Avatar.AvatarSize)('lg')).toBe('lg')
  })

  test('return the exact origin base class strings by default', () => {
    expect(Avatar.avatarClassName()).toBe(Avatar.avatarBaseClassName)
    expect(Avatar.avatarImageClassName()).toBe(Avatar.avatarImageBaseClassName)
    expect(Avatar.avatarFallbackClassName()).toBe(
      Avatar.avatarFallbackBaseClassName,
    )
  })

  test('return the exact origin addon class strings by default', () => {
    expect(Avatar.avatarBadgeClassName()).toBe(Avatar.avatarBadgeBaseClassName)
    expect(Avatar.avatarGroupClassName()).toBe(Avatar.avatarGroupBaseClassName)
    expect(Avatar.avatarGroupCountClassName()).toBe(
      Avatar.avatarGroupCountBaseClassName,
    )
  })

  test('preserves custom classes through local cn canonicalization', () => {
    expect(Avatar.avatarClassName({ className: 'size-4 size-12' })).toContain(
      'size-12',
    )
    expect(
      Avatar.avatarImageClassName({ className: 'rounded-md rounded-lg' }),
    ).toContain('rounded-lg')
    expect(
      Avatar.avatarFallbackClassName({ className: 'text-xs text-lg' }),
    ).toContain('text-lg')
  })
})

describe('shadcn/avatar view', () => {
  test('adds shadcn slots and size attributes over Base UI behavior', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewAvatar({
            imageLoadingStatus: 'loaded',
            size: 'lg',
            image: { src: 'avatar.png', alt: '@shadcn' },
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="avatar"]')).toHaveAttr(
          'data-size',
          'lg',
        ),
        Scene.expect(Scene.selector('[data-slot="avatar-image"]')).toHaveAttr(
          'alt',
          '@shadcn',
        ),
      )
    }).not.toThrow()
  })

  test('renders styled fallback when the modeled image status errors', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewAvatar({
            imageLoadingStatus: 'error',
            image: { src: 'missing.png', alt: '@shadcn' },
          }),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="avatar-fallback"]'),
        ).toHaveText('CN'),
        Scene.expect(
          Scene.selector('[data-slot="avatar-fallback"]'),
        ).toHaveAttr('data-slot', 'avatar-fallback'),
      )
    }).not.toThrow()
  })

  test('badge, group, and count helpers expose origin slots', () => {
    const h = html<Message>()
    const view = (_model: Model): Html =>
      Avatar.groupView<Message>({
        toView: groupAttributes =>
          h.div(
            [...groupAttributes.group],
            [
              Avatar.badgeView<Message>({
                toView: badgeAttributes =>
                  h.span([...badgeAttributes.badge], []),
              }),
              Avatar.groupCountView<Message>({
                toView: countAttributes =>
                  h.div([...countAttributes.count], ['+3']),
              }),
            ],
          ),
      })

    expect(() => {
      Scene.scene(
        { update, view },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="avatar-group"]')).toExist(),
        Scene.expect(Scene.selector('[data-slot="avatar-badge"]')).toExist(),
        Scene.expect(
          Scene.selector('[data-slot="avatar-group-count"]'),
        ).toHaveText('+3'),
      )
    }).not.toThrow()
  })
})

describe('shadcn/avatar installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/avatar',
      '@base-ui/react',
      '@base-ui-components/react',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
      '@/styles/base-nova/ui/avatar',
      '@/styles/base-nova/ui/dropdown-menu',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/avatar/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/avatar/index.ts',
      'src/registry/shadcn/avatar/examples.ts',
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
