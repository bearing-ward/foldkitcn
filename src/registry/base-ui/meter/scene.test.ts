import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Meter from './index'
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

const UpdatedMeter = m('UpdatedMeter', { value: S.Number })

const Message = S.Union([UpdatedMeter])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      UpdatedMeter: ({ value }) => [evo(model, { value: () => value }), []],
    }),
  )

// VIEW

type TestMeterConfig = Omit<ViewConfig<Message>, 'toView' | 'value'> &
  Readonly<{
    value?: number
  }>

const viewMeter =
  (config: TestMeterConfig) =>
  (model: Model): Html => {
    const h = html<Message>()
    const { value = model.value, ...meterConfig } = config
    const state = Meter.meterState({ value, ...meterConfig })

    return Meter.view<Message>({
      value,
      ...meterConfig,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.span([...attributes.label], ['Battery Level']),
            h.span(
              [...attributes.value, h.Attribute('data-testid', 'value')],
              [Meter.valueText(state)],
            ),
            h.div(
              [...attributes.track, h.Attribute('data-testid', 'track')],
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

describe('base-ui/meter', () => {
  test('root exposes ARIA attributes and label association', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewMeter({ labelId: 'battery-label' }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('meter')).toHaveAttr('aria-valuenow', '30'),
        Scene.expect(Scene.role('meter')).toHaveAttr('aria-valuemin', '0'),
        Scene.expect(Scene.role('meter')).toHaveAttr('aria-valuemax', '100'),
        Scene.expect(Scene.role('meter')).toHaveAttr(
          'aria-valuetext',
          new Intl.NumberFormat(undefined, { style: 'percent' }).format(0.3),
        ),
        Scene.expect(Scene.role('meter')).toHaveAttr(
          'aria-labelledby',
          'battery-label',
        ),
        Scene.expect(Scene.selector('#battery-label')).toHaveAttr(
          'role',
          'presentation',
        ),
      )
    }).not.toThrow()
  })

  test('aria-valuenow updates when the view receives a different value', () => {
    const [updatedModel] = update(initialModel, UpdatedMeter({ value: 77 }))

    expect(() => {
      Scene.scene(
        { update, view: viewMeter({}) },
        Scene.with(updatedModel),
        Scene.expect(Scene.role('meter')).toHaveAttr('aria-valuenow', '77'),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveStyle(
          'width',
          '77%',
        ),
      )
    }).not.toThrow()
  })

  test('custom range normalizes the value text and indicator to the range', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMeter({ min: 20, max: 40 }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('meter')).toHaveAttr('aria-valuenow', '30'),
        Scene.expect(Scene.role('meter')).toHaveAttr(
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

  test('clamps range attributes and indicator width', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMeter({ value: 150 }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('meter')).toHaveAttr('aria-valuenow', '100'),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveStyle(
          'width',
          '100%',
        ),
      )
      Scene.scene(
        { update, view: viewMeter({ value: -10 }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('meter')).toHaveAttr('aria-valuenow', '0'),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveStyle(
          'width',
          '0%',
        ),
      )
    }).not.toThrow()
  })

  test('min equals max and NaN produce stable zero-percent output', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMeter({ value: 5, min: 5, max: 5 }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('meter')).toHaveAttr('aria-valuenow', '5'),
        Scene.expect(Scene.role('meter')).toHaveAttr(
          'aria-valuetext',
          new Intl.NumberFormat(undefined, { style: 'percent' }).format(0),
        ),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveStyle(
          'width',
          '0%',
        ),
      )
      Scene.scene(
        { update, view: viewMeter({ value: Number.NaN }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('meter')).toHaveAttr('aria-valuenow', '0'),
        Scene.expect(Scene.role('meter')).toHaveAttr(
          'aria-valuetext',
          new Intl.NumberFormat(undefined, { style: 'percent' }).format(0),
        ),
      )
    }).not.toThrow()
  })

  test('value text uses percent by default and honors supported format options', () => {
    expect(Meter.meterState({ value: 30 }).formattedValue).toBe(
      new Intl.NumberFormat(undefined, { style: 'percent' }).format(0.3),
    )
    expect(
      Meter.meterState({
        value: 30,
        format: { style: 'currency', currency: 'USD' },
      }).formattedValue,
    ).toBe(
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      }).format(30),
    )
    expect(
      Meter.meterState({
        value: 86.49,
        locale: 'de-DE',
        format: {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      }).formattedValue,
    ).toBe(
      new Intl.NumberFormat('de-DE', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(86.49),
    )
  })

  test('low high optimum options are reflected as root attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewMeter({ low: 20, high: 80, optimum: 60 }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('meter')).toHaveAttr('low', '20'),
        Scene.expect(Scene.role('meter')).toHaveAttr('high', '80'),
        Scene.expect(Scene.role('meter')).toHaveAttr('optimum', '60'),
      )
    }).not.toThrow()
  })

  test('part attributes match the meter roles and presentation behavior', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewMeter({ labelId: 'battery-label' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="value"]')).toHaveAttr(
          'aria-hidden',
          'true',
        ),
        Scene.expect(Scene.selector('[data-testid="track"]')).not.toHaveAttr(
          'role',
        ),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveStyle(
          'height',
          'inherit',
        ),
      )
    }).not.toThrow()
  })
})
