import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { describe, expect, test } from 'vitest'

import * as Fieldset from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({})
type Model = typeof Model.Type

const initialModel: Model = {}

// MESSAGE

const RenderedFieldset = m('RenderedFieldset')

const Message = S.Union([RenderedFieldset])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      RenderedFieldset: () => [model, []],
    }),
  )

// VIEW

const viewFieldset =
  (config: Omit<ViewConfig<Message>, 'toView'>) => (): Html => {
    const h = html<Message>()

    return Fieldset.view<Message>({
      ...config,
      toView: attributes =>
        h.fieldset(
          [...attributes.root],
          [
            h.div([...attributes.legend], ['Billing details']),
            h.input([h.Attribute('data-testid', 'street')]),
          ],
        ),
    })
  }

const viewNestedFieldset = (): Html => {
  const h = html<Message>()
  const outerState = Fieldset.fieldsetState({
    id: 'outer',
    isDisabled: true,
  })

  return h.div(
    [],
    [
      Fieldset.view<Message>({
        id: 'outer',
        isDisabled: true,
        toView: outerAttributes =>
          h.fieldset(
            [...outerAttributes.root],
            [
              h.div([...outerAttributes.legend], ['Outer']),
              Fieldset.view<Message>({
                id: 'inner',
                isParentDisabled: outerState.isDisabled,
                toView: innerAttributes =>
                  h.fieldset(
                    [...innerAttributes.root],
                    [
                      h.div([...innerAttributes.legend], ['Inner']),
                      h.input([
                        h.Attribute('data-testid', 'inner-control'),
                        h.Disabled(
                          Fieldset.fieldsetState({
                            id: 'inner',
                            isParentDisabled: outerState.isDisabled,
                          }).isDisabled,
                        ),
                      ]),
                    ],
                  ),
              }),
            ],
          ),
      }),
    ],
  )
}

describe('base-ui/fieldset', () => {
  test('root and legend use the derived legend id by default', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewFieldset({ id: 'billing' }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('fieldset')).toHaveAttr('id', 'billing'),
        Scene.expect(Scene.selector('fieldset')).toHaveAttr(
          'aria-labelledby',
          'billing-legend',
        ),
        Scene.expect(Scene.selector('#billing-legend')).toHaveText(
          'Billing details',
        ),
      )
    }).not.toThrow()
  })

  test('root and legend honor a custom legend id', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewFieldset({
            id: 'payment',
            legendId: 'payment-heading',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('fieldset')).toHaveAttr(
          'aria-labelledby',
          'payment-heading',
        ),
        Scene.expect(Scene.selector('#payment-heading')).toHaveText(
          'Billing details',
        ),
      )
    }).not.toThrow()
  })

  test('root preserves native form ownership attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewFieldset({
            id: 'shipping',
            name: 'shippingAddress',
            form: 'checkout',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('fieldset')).toHaveAttr(
          'name',
          'shippingAddress',
        ),
        Scene.expect(Scene.selector('fieldset')).toHaveAttr('form', 'checkout'),
      )
    }).not.toThrow()
  })

  test('disabled state marks the root and legend without adding hidden state', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewFieldset({
            id: 'disabled',
            isDisabled: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('fieldset')).toHaveAttr('disabled', 'true'),
        Scene.expect(Scene.selector('fieldset')).toHaveAttr('data-disabled'),
        Scene.expect(Scene.selector('#disabled-legend')).toHaveAttr(
          'data-disabled',
        ),
      )
    }).not.toThrow()
  })

  test('parent disabled state is propagated through explicit view props', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewNestedFieldset,
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#outer')).toHaveAttr('disabled', 'true'),
        Scene.expect(Scene.selector('#inner')).toHaveAttr('disabled', 'true'),
        Scene.expect(Scene.selector('#inner')).toHaveAttr('data-disabled'),
        Scene.expect(
          Scene.selector('[data-testid="inner-control"]'),
        ).toHaveAttr('disabled', 'true'),
      )
    }).not.toThrow()
  })

  test('fieldset state derives disabled and legend facts deterministically', () => {
    expect(Fieldset.fieldsetState({ id: 'profile' })).toStrictEqual({
      isDisabled: false,
      legendId: 'profile-legend',
    })
    expect(
      Fieldset.fieldsetState({
        id: 'profile',
        legendId: 'profile-title',
        isParentDisabled: true,
      }),
    ).toStrictEqual({
      isDisabled: true,
      legendId: 'profile-title',
    })
  })
})
