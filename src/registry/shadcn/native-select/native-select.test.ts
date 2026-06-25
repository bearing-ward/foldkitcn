/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  NativeSelectSize,
  chevronDownIcon,
  iconClassName,
  nativeSelectSizeValues,
  optGroupClassName,
  optGroupView as NativeSelectOptGroup,
  optionClassName,
  optionView as NativeSelectOption,
  selectClassName,
  view as NativeSelect,
  wrapperClassName,
} from './index'
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

const viewNativeSelect =
  (config: Omit<ViewConfig<Message>, 'toView'>) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return NativeSelect<Message>({
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.wrapper],
          [
            h.select(
              [...attributes.select],
              [
                NativeSelectOption<Message>({
                  value: '',
                  toView: optionAttributes =>
                    h.option([...optionAttributes.option], ['Select status']),
                }),
                NativeSelectOptGroup<Message>({
                  label: 'Engineering',
                  toView: optGroupAttributes =>
                    h.optgroup(
                      [...optGroupAttributes.optGroup],
                      [
                        NativeSelectOption<Message>({
                          value: 'frontend',
                          toView: optionAttributes =>
                            h.option(
                              [...optionAttributes.option],
                              ['Frontend'],
                            ),
                        }),
                      ],
                    ),
                }),
              ],
            ),
            chevronDownIcon(attributes.icon),
          ],
        ),
    })
  }

describe('shadcn/native-select class helpers', () => {
  test('exports Effect Schema literals for sizes', () => {
    expect(S.decodeUnknownSync(NativeSelectSize)('sm')).toBe('sm')
  })

  test.each(nativeSelectSizeValues)('supports %s size data classes', size => {
    expect(selectClassName({ size })).toContain('data-[size=sm]:h-7')
  })

  test('preserves custom wrapper className through local cn canonicalization', () => {
    const className = wrapperClassName({
      className: 'custom-select w-24 w-40',
    })

    expect(className).toContain('custom-select')
    expect(className).toContain('w-40')
    expect(className).not.toContain('w-24')
  })

  test('exports option, optgroup, and icon class helpers', () => {
    expect(optionClassName()).toBe('bg-[Canvas] text-[CanvasText]')
    expect(optGroupClassName()).toBe('bg-[Canvas] text-[CanvasText]')
    expect(iconClassName()).toContain('text-muted-foreground')
  })
})

describe('shadcn/native-select view', () => {
  test('adds wrapper and select data attributes for size', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewNativeSelect({ size: 'sm' }) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="native-select-wrapper"]'),
        ).toHaveAttr('data-size', 'sm'),
        Scene.expect(Scene.selector('[data-slot="native-select"]')).toHaveAttr(
          'data-size',
          'sm',
        ),
        Scene.expect(Scene.selector('[data-slot="native-select"]')).toHaveAttr(
          'class',
          selectClassName(),
        ),
      )
    }).not.toThrow()
  })

  test('passes disabled and invalid attributes to the native select', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewNativeSelect({ disabled: true, invalid: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="native-select"]')).toHaveAttr(
          'disabled',
          '',
        ),
        Scene.expect(Scene.selector('[data-slot="native-select"]')).toHaveAttr(
          'aria-invalid',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('renders option and optgroup attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewNativeSelect({}) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="native-select-option"]'),
        ).toHaveAttr('class', optionClassName()),
        Scene.expect(
          Scene.selector('[data-slot="native-select-optgroup"]'),
        ).toHaveAttr('label', 'Engineering'),
        Scene.expect(
          Scene.selector('[data-slot="native-select-optgroup"]'),
        ).toHaveAttr('class', optGroupClassName()),
      )
    }).not.toThrow()
  })

  test('renders icon attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewNativeSelect({}) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="native-select-icon"]'),
        ).toHaveAttr('aria-hidden', 'true'),
        Scene.expect(
          Scene.selector('[data-slot="native-select-icon"]'),
        ).toHaveAttr('class', iconClassName()),
      )
    }).not.toThrow()
  })
})
