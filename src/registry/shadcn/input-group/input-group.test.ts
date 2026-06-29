/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  InputGroupBasic,
  InputGroupBlockEnd,
  InputGroupBlockStart,
  InputGroupButtonGroup,
  InputGroupDemo,
  InputGroupDropdown,
  InputGroupIcon,
  InputGroupKbd,
  InputGroupLabel,
  InputGroupRtl,
  InputGroupTextExample,
  InputGroupTextareaExample,
  InputGroupWithButtons,
} from './examples'
import * as InputGroup from './index'
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

const viewInputGroup =
  (config: ViewConfig<Message>) =>
  (_model: Model): Html =>
    InputGroup.view<Message>(config)

describe('shadcn/input-group class helpers', () => {
  test('exports Effect Schema literals for addon alignment and button sizes', () => {
    expect(
      S.decodeUnknownSync(InputGroup.InputGroupAddonAlign)('inline-start'),
    ).toBe('inline-start')
    expect(
      S.decodeUnknownSync(InputGroup.InputGroupButtonSize)('icon-xs'),
    ).toBe('icon-xs')
    expect(InputGroup.inputGroupAddonAlignValues).toStrictEqual([
      'inline-start',
      'inline-end',
      'block-start',
      'block-end',
    ])
    expect(InputGroup.inputGroupButtonSizeValues).toStrictEqual([
      'xs',
      'sm',
      'icon-xs',
      'icon-sm',
    ])
  })

  test('uses origin class composition for group, addons, buttons, and controls', () => {
    expect(InputGroup.inputGroupClassName()).toContain('group/input-group')
    expect(
      InputGroup.inputGroupAddonClassName({ align: 'inline-end' }),
    ).toContain('order-last pr-2')
    expect(
      InputGroup.inputGroupAddonClassName({
        align: 'inline-start',
        dir: 'rtl',
      }),
    ).toContain('ps-2')
    expect(InputGroup.inputGroupButtonClassName({ size: 'icon-xs' })).toContain(
      'size-6',
    )
    expect(InputGroup.inputGroupInputClassName()).toContain('rounded-none')
  })

  test('preserves custom classes through local cn canonicalization', () => {
    expect(
      InputGroup.inputGroupClassName({
        className: 'custom-group w-full w-fit',
      }),
    ).toContain('custom-group')
    expect(
      InputGroup.inputGroupAddonClassName({
        className: 'custom-addon px-1 px-2',
      }),
    ).toContain('custom-addon')
    expect(
      InputGroup.inputGroupTextareaClassName({
        className: 'custom-textarea py-1 py-2',
      }),
    ).toContain('custom-textarea')
  })
})

describe('shadcn/input-group view', () => {
  test('adds root slot, group role, disabled data, and optional accessible name', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewInputGroup({
            ariaLabel: 'Search controls',
            isDisabled: true,
            children: ['One'],
          }),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('group', { name: 'Search controls' }),
        ).toHaveAttr('data-slot', 'input-group'),
        Scene.expect(
          Scene.role('group', { name: 'Search controls' }),
        ).toHaveAttr('data-disabled', 'true'),
      )
    }).not.toThrow()
  })

  test('adds addon, text, input, textarea, and button slots', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: () =>
            InputGroup.InputGroup<Message>({
              children: [
                InputGroup.InputGroupAddon<Message>({
                  align: 'block-end',
                  children: [
                    InputGroup.InputGroupText<Message>({
                      children: ['USD'],
                    }),
                    InputGroup.InputGroupButton<Message>({
                      children: ['Apply'],
                    }),
                  ],
                }),
                InputGroup.InputGroupInput<Message>({
                  placeholder: 'Amount',
                }),
                InputGroup.InputGroupTextarea<Message>({
                  placeholder: 'Notes',
                }),
              ],
            }),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="input-group-addon"]'),
        ).toHaveAttr('data-align', 'block-end'),
        Scene.expect(Scene.text('USD')).toExist(),
        Scene.expect(Scene.role('textbox', { name: '' })).toExist(),
        Scene.expect(Scene.role('button', { name: 'Apply' })).toHaveAttr(
          'data-size',
          'xs',
        ),
      )
    }).not.toThrow()
  })

  test('examples render implemented shadcn Input Group demos', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => InputGroupDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('textbox')).toHaveAttr(
          'placeholder',
          'Search...',
        ),
        Scene.expect(Scene.text('12 results')).toExist(),
      )
      Scene.scene(
        { update, view: () => InputGroupBasic() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Disabled')).toExist(),
        Scene.expect(Scene.text('Invalid')).toExist(),
      )
      Scene.scene(
        { update, view: () => InputGroupBlockStart() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('script.js')).toExist(),
      )
      Scene.scene(
        { update, view: () => InputGroupBlockEnd() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Post' })).toExist(),
      )
      Scene.scene(
        { update, view: () => InputGroupWithButtons() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Outline' })).toExist(),
      )
      Scene.scene(
        { update, view: () => InputGroupButtonGroup() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('https://')).toExist(),
      )
      Scene.scene(
        { update, view: () => InputGroupDropdown() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Search In...' })).toExist(),
      )
      Scene.scene(
        { update, view: () => InputGroupIcon() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('textbox')).toHaveAttr(
          'placeholder',
          'Search...',
        ),
      )
      Scene.scene(
        { update, view: () => InputGroupKbd() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('⌘K')).toExist(),
      )
      Scene.scene(
        { update, view: () => InputGroupLabel() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Help' })).toExist(),
      )
      Scene.scene(
        { update, view: () => InputGroupTextExample() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('USD')).toExist(),
      )
      Scene.scene(
        { update, view: () => InputGroupTextareaExample() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Run ')).toExist(),
      )
      Scene.scene(
        { update, view: () => InputGroupRtl() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[dir="rtl"]')).toExist(),
      )
    }).not.toThrow()
  })
})

describe('shadcn/input-group installable source', () => {
  test('keeps forbidden origin runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@tabler/icons-react',
      'class-variance-authority',
      'lucide-react',
      'react',
      'react-dom',
      'react-textarea-autosize',
      'sonner',
      '@/components/language-selector',
      '@/hooks/use-copy-to-clipboard',
      '@/styles/base-nova',
      'repos/',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/input-group/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const combinedSource = [
      manifestModule.default,
      indexModule.default,
      examplesModule.default,
    ].join('\n')

    for (const specifier of forbiddenRuntimeSpecifiers) {
      expect(combinedSource).not.toContain(`from '${specifier}'`)
      expect(combinedSource).not.toContain(`from "${specifier}"`)
    }
  })
})
