import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Slider } from './index'

const slider = (config: {
  readonly values: ReadonlyArray<number>
  readonly min?: number
  readonly max?: number
  readonly step?: number
  readonly orientation?: 'horizontal' | 'vertical'
  readonly dir?: 'ltr' | 'rtl'
  readonly className?: string
  readonly isDisabled?: boolean
}): Html =>
  Slider<never>({
    values: [...config.values],
    min: config.min,
    max: config.max,
    step: config.step,
    orientation: config.orientation,
    dir: config.dir,
    className: config.className,
    isDisabled: config.isDisabled,
  })

export const SliderDemo = (): Html =>
  slider({
    values: [75],
    max: 100,
    step: 1,
    className: 'mx-auto w-full max-w-xs',
  })

export const SliderRange = (): Html =>
  slider({
    values: [25, 50],
    max: 100,
    step: 5,
    className: 'mx-auto w-full max-w-xs',
  })

export const SliderDisabled = (): Html =>
  slider({
    values: [50],
    max: 100,
    step: 1,
    isDisabled: true,
    className: 'mx-auto w-full max-w-xs',
  })

export const SliderMultiple = (): Html =>
  slider({
    values: [10, 20, 70],
    max: 100,
    step: 10,
    className: 'mx-auto w-full max-w-xs',
  })

export const SliderVertical = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('mx-auto flex w-full max-w-xs items-center justify-center gap-6')],
    [
      slider({
        values: [50],
        max: 100,
        step: 1,
        orientation: 'vertical',
        className: 'h-40',
      }),
      slider({
        values: [25],
        max: 100,
        step: 1,
        orientation: 'vertical',
        className: 'h-40',
      }),
    ],
  )
}

export const SliderControlled = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('mx-auto grid w-full max-w-xs gap-3')],
    [
      h.div(
        [h.Class('flex items-center justify-between gap-2')],
        [
          h.span([h.Id('slider-demo-temperature')], ['Temperature']),
          h.span([h.Class('text-sm text-muted-foreground')], ['0.3, 0.7']),
        ],
      ),
      Slider<never>({
        id: 'slider-demo-temperature',
        values: [0.3, 0.7],
        min: 0,
        max: 1,
        step: 0.1,
      }),
    ],
  )
}

export const SliderRtl = (): Html =>
  slider({
    values: [75],
    max: 100,
    step: 1,
    dir: 'rtl',
    className: 'mx-auto w-full max-w-xs',
  })
