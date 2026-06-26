import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Slider from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  values: S.Array(S.Number),
  lastReason: Slider.SliderChangeReason,
  activeThumbIndex: S.Number,
})
type Model = typeof Model.Type

const initialModel: Model = {
  values: [25, 75],
  lastReason: 'none',
  activeThumbIndex: -1,
}

// MESSAGE

const ChangedSlider = m('ChangedSlider', {
  values: S.Array(S.Number),
  reason: Slider.SliderChangeReason,
  activeThumbIndex: S.Number,
})

const Message = S.Union([ChangedSlider])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedSlider: ({ values, reason, activeThumbIndex }) => [
        evo(model, {
          values: () => values,
          lastReason: () => reason,
          activeThumbIndex: () => activeThumbIndex,
        }),
        [],
      ],
    }),
  )

// VIEW

const viewSlider =
  (config: Omit<ViewConfig<Message>, 'toView' | 'values'>) =>
  (model: Model): Html => {
    const h = html<Message>()
    const state = Slider.sliderState({ values: model.values, ...config })

    return h.div(
      [],
      [
        Slider.view<Message>({
          values: model.values,
          id: 'volume-slider',
          labelId: 'volume-label',
          name: 'volume',
          ...config,
          onValueChange: change => ChangedSlider(change),
          toView: attributes =>
            h.div(
              [...attributes.root],
              [
                h.div([...attributes.label], ['Volume']),
                h.div(
                  [
                    ...attributes.control,
                    h.Attribute('data-testid', 'control'),
                  ],
                  [
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
                    ...attributes.thumbs.map(thumb =>
                      h.div(
                        [
                          ...thumb.root,
                          h.Attribute(
                            'data-testid',
                            `thumb-${thumb.state.index}`,
                          ),
                        ],
                        [h.input([...thumb.input])],
                      ),
                    ),
                  ],
                ),
                h.output([...attributes.value], [Slider.valueText(state)]),
                h.p([], [`Values ${model.values.join(',')}`]),
                h.p([], [`Reason ${model.lastReason}`]),
                h.p([], [`Thumb ${model.activeThumbIndex}`]),
              ],
            ),
        }),
      ],
    )
  }

describe('base-ui/slider source-port helpers', () => {
  test('canonicalizes values by clamping and sorting before comparison', () => {
    expect(Slider.canonicalValues([80, -10, 30], 0, 60)).toStrictEqual([
      0, 30, 60,
    ])
    expect(Slider.sliderState({ values: [80, 20] }).values).toStrictEqual([
      20, 80,
    ])
  })

  test('rounds values from the step origin with decimal precision', () => {
    expect(Slider.roundValueToStep(0.35, 0.1, 0.25)).toBe(0.35)
    expect(Slider.roundValueToStep(0.36, 0.1, 0.25)).toBe(0.35)
  })

  test('clamps single values and range values to real neighbours', () => {
    expect(Slider.getSliderValue(150, 0, 0, 100, false, [50])).toBe(100)
    expect(Slider.getSliderValue(-10, 0, 0, 100, false, [50])).toBe(0)
    expect(
      Slider.getSliderValue(90, 1, 0, 100, true, [20, 40, 80]),
    ).toStrictEqual([20, 80, 80])
    expect(
      Slider.getSliderValue(10, 1, 0, 100, true, [20, 40, 80]),
    ).toStrictEqual([20, 20, 80])
  })

  test('pushes and swaps multiple thumbs while preserving minimum distance', () => {
    expect(
      Slider.getPushedThumbValues({
        values: [20, 40],
        index: 0,
        nextValue: 60,
        min: 0,
        max: 100,
        step: 1,
        minStepsBetweenValues: 5,
      }),
    ).toStrictEqual([60, 65])

    const swap = Slider.resolveThumbCollision({
      behavior: 'swap',
      values: [20, 80],
      currentValues: [20, 80],
      initialValues: [20, 80],
      pressedIndex: 0,
      nextValue: 85,
      min: 0,
      max: 100,
      step: 1,
      minStepsBetweenValues: 10,
    })

    expect(swap.value).toStrictEqual([70, 85])
    expect(swap.thumbIndex).toBe(1)
    expect(swap.didSwap).toBeTruthy()
  })

  test('maps pointer coordinates to deterministic values without shared DOM measurement', () => {
    const state = Slider.sliderState({
      values: [25, 75],
      min: 0,
      max: 100,
      step: 5,
    })

    expect(
      Slider.pointerValueChange({
        state,
        pointer: { clientX: 82, clientY: 0 },
        rect: { left: 0, right: 100, bottom: 20, width: 100, height: 20 },
      }),
    ).toStrictEqual({
      values: [25, 80],
      reason: 'track-press',
      activeThumbIndex: 1,
    })
  })
})

describe('base-ui/slider view', () => {
  test('renders root, label, track, range, thumbs, and form inputs', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSlider({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr(
          'aria-labelledby',
          'volume-label',
        ),
        Scene.expect(Scene.role('group')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.selector('#volume-label')).toHaveText('Volume'),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveStyle(
          'width',
          '50%',
        ),
        Scene.expect(Scene.selector('[data-testid="thumb-0"]')).toHaveAttr(
          'data-index',
          '0',
        ),
        Scene.expect(Scene.selector('#volume-slider-input-0')).toHaveAttr(
          'type',
          'range',
        ),
        Scene.expect(Scene.selector('#volume-slider-input-0')).toHaveAttr(
          'name',
          'volume',
        ),
        Scene.expect(Scene.selector('output')).toHaveAttr(
          'for',
          'volume-slider-input-0 volume-slider-input-1',
        ),
      )
    }).not.toThrow()
  })

  test('keyboard changes emit value facts owned by the consuming model', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSlider({ step: 5, largeStep: 20 }),
        },
        Scene.with(initialModel),
        Scene.keydown(Scene.selector('#volume-slider-input-0'), 'ArrowRight'),
        Scene.expect(Scene.text('Values 30,75')).toExist(),
        Scene.expect(Scene.text('Reason keyboard')).toExist(),
        Scene.keydown(Scene.selector('#volume-slider-input-1'), 'PageDown'),
        Scene.expect(Scene.text('Values 30,55')).toExist(),
      )
    }).not.toThrow()
  })

  test('rtl keyboard direction reverses horizontal arrow keys', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSlider({ dir: 'rtl', step: 5 }) },
        Scene.with(initialModel),
        Scene.keydown(Scene.selector('#volume-slider-input-0'), 'ArrowRight'),
        Scene.expect(Scene.text('Values 20,75')).toExist(),
      )
    }).not.toThrow()
  })

  test('disabled state suppresses handlers and marks all interactive parts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSlider({ isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr('data-disabled'),
        Scene.expect(Scene.selector('[data-testid="control"]')).toHaveAttr(
          'data-disabled',
        ),
        Scene.expect(Scene.selector('#volume-slider-input-0')).toHaveAttr(
          'disabled',
          'true',
        ),
        Scene.expect(
          Scene.selector('#volume-slider-input-0'),
        ).not.toHaveHandler('keydown'),
      )
    }).not.toThrow()
  })

  test('vertical sliders place the indicator on the block axis', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSlider({ orientation: 'vertical' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr(
          'data-orientation',
          'vertical',
        ),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveStyle(
          'height',
          '50%',
        ),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveStyle(
          'bottom',
          '25%',
        ),
      )
    }).not.toThrow()
  })

  test('pointerdown can emit a track-press change when a control rect is supplied', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSlider({
            controlRect: {
              left: 0,
              right: 100,
              bottom: 20,
              width: 100,
              height: 20,
            },
          }),
        },
        Scene.with(initialModel),
        Scene.pointerDown(Scene.selector('[data-testid="control"]'), {
          clientX: 10,
          clientY: 0,
        }),
        Scene.expect(Scene.text('Values 10,75')).toExist(),
        Scene.expect(Scene.text('Reason track-press')).toExist(),
        Scene.expect(Scene.text('Thumb 0')).toExist(),
      )
    }).not.toThrow()
  })
})
