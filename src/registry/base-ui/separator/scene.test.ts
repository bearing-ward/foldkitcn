import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as Separator from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({})
type Model = typeof Model.Type

const initialModel: Model = {}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

type ElementKind = 'div' | 'hr'

type TestSeparatorConfig = Omit<ViewConfig<Message>, 'toView'> &
  Readonly<{
    elementKind?: ElementKind
  }>

const viewSeparator =
  (config: TestSeparatorConfig) =>
  (_model: Model): Html => {
    const h = html<Message>()
    const { elementKind = 'div', ...separatorConfig } = config

    return Separator.view<Message>({
      ...separatorConfig,
      toView: attributes =>
        elementKind === 'div'
          ? h.div([...attributes.separator], [])
          : h.hr([...attributes.separator]),
    })
  }

describe('base-ui/separator', () => {
  test('default separator renders a visible element with separator role', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSeparator({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('separator')).toBeVisible(),
      )
    }).not.toThrow()
  })

  test('default separator uses horizontal orientation attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSeparator({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'aria-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
      )
    }).not.toThrow()
  })

  test('vertical separator uses vertical orientation attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSeparator({ orientation: 'vertical' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'aria-orientation',
          'vertical',
        ),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'data-orientation',
          'vertical',
        ),
      )
    }).not.toThrow()
  })

  test('toView can choose an alternate element while preserving attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSeparator({ elementKind: 'hr' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('hr')).toHaveAttr('role', 'separator'),
        Scene.expect(Scene.selector('hr')).toHaveAttr(
          'aria-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.selector('hr')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
      )
    }).not.toThrow()
  })
})
