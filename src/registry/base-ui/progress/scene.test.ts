import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Progress from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  value: S.Number,
})
type Model = typeof Model.Type

const initialModel: Model = {
  value: 30,
}

// MESSAGE

const UpdatedProgress = m('UpdatedProgress', { value: S.Number })

const Message = S.Union([UpdatedProgress])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      UpdatedProgress: ({ value }) => [evo(model, { value: () => value }), []],
    }),
  )

// VIEW

type TestProgressConfig = Omit<ViewConfig<Message>, 'toView' | 'value'> &
  Readonly<{
    value?: number | null
  }>

const viewProgress =
  (config: TestProgressConfig) =>
  (model: Model): Html => {
    const h = html<Message>()
    const { value = model.value, ...progressConfig } = config
    const state = Progress.progressState({ value, ...progressConfig })

    return Progress.view<Message>({
      value,
      ...progressConfig,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.span([...attributes.label], ['Downloading']),
            h.span(
              [...attributes.value, h.Attribute('data-testid', 'value')],
              [Progress.valueText(state)],
            ),
            h.div(
              [...attributes.track],
              [
                h.div(
                  [
                    ...attributes.indicator,
                    h.Attribute('data-testid', 'indicator'),
                  ],
                  [],
                ),
              ],
            ),
          ],
        ),
    })
  }

describe('base-ui/progress', () => {
  test('root exposes ARIA attributes and label association for a determinate value', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewProgress({ labelId: 'download-label' }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'aria-valuenow',
          '30',
        ),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'aria-valuemin',
          '0',
        ),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'aria-valuemax',
          '100',
        ),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'aria-valuetext',
          new Intl.NumberFormat(undefined, { style: 'percent' }).format(0.3),
        ),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'aria-labelledby',
          'download-label',
        ),
        Scene.expect(Scene.selector('#download-label')).toHaveAttr(
          'role',
          'presentation',
        ),
      )
    }).not.toThrow()
  })

  test('aria-valuenow updates when the view receives a different value', () => {
    const [updatedModel] = update(initialModel, UpdatedProgress({ value: 77 }))

    expect(() => {
      Scene.scene(
        { update, view: viewProgress({}) },
        Scene.with(updatedModel),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'aria-valuenow',
          '77',
        ),
      )
    }).not.toThrow()
  })

  test('custom range normalizes the value text and indicator to the range', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewProgress({ min: 20, max: 40 }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'aria-valuenow',
          '30',
        ),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'aria-valuetext',
          new Intl.NumberFormat(undefined, { style: 'percent' }).format(0.5),
        ),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveStyle(
          'width',
          '50%',
        ),
        Scene.expect(Scene.selector('[data-testid="value"]')).toHaveText(
          new Intl.NumberFormat(undefined, { style: 'percent' }).format(0.5),
        ),
      )
    }).not.toThrow()
  })

  test('overshoot clamps aria-valuenow and indicator width', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewProgress({ value: 50, max: 40 }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'aria-valuenow',
          '40',
        ),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveStyle(
          'width',
          '100%',
        ),
        Scene.expect(Scene.selector('[data-testid="value"]')).toHaveText(
          new Intl.NumberFormat(undefined, { style: 'percent' }).format(1),
        ),
      )
    }).not.toThrow()
  })

  test('complete status sets data-complete', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewProgress({ value: 100 }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('progressbar')).toHaveAttr('data-complete'),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveAttr(
          'data-complete',
        ),
      )
    }).not.toThrow()
  })

  test('min equals max produces zero percent and stable ARIA', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewProgress({ value: 5, min: 5, max: 5 }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'aria-valuenow',
          '5',
        ),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'aria-valuetext',
          new Intl.NumberFormat(undefined, { style: 'percent' }).format(0),
        ),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveStyle(
          'width',
          '0%',
        ),
      )
    }).not.toThrow()
  })

  test('indeterminate value omits aria-valuenow and status width', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewProgress({ value: null }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'data-indeterminate',
        ),
        Scene.expect(Scene.role('progressbar')).toHaveAttr(
          'aria-valuetext',
          'indeterminate progress',
        ),
        Scene.expect(Scene.role('progressbar')).not.toHaveAttr('aria-valuenow'),
        Scene.expect(
          Scene.selector('[data-testid="indicator"]'),
        ).not.toHaveStyle('width'),
      )
    }).not.toThrow()
  })

  test('value text uses percent by default and honors supported format options', () => {
    expect(Progress.progressState({ value: 30 }).formattedValue).toBe(
      new Intl.NumberFormat(undefined, { style: 'percent' }).format(0.3),
    )
    expect(
      Progress.progressState({
        value: 30,
        format: { style: 'currency', currency: 'USD' },
      }).formattedValue,
    ).toBe(
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      }).format(30),
    )
  })
})
