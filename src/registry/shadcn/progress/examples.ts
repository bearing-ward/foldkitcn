import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { progressState, valueText, view as Progress } from './index'

const progressValue = (value: number): string =>
  valueText(progressState({ value }))

const arabicProgressRtl = {
  dir: 'rtl',
  values: {
    label: 'تقدم الرفع',
    value: '٥٦%',
  },
}

export const ProgressControlled = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-4')],
    [
      Progress<never>({
        value: 50,
        className: 'w-full',
      }),
    ],
  )
}

export const ProgressDemo = (): Html =>
  Progress<never>({
    value: 13,
    className: 'w-[60%]',
  })

export const ProgressWithLabel = (): Html => {
  const h = html<never>()

  return Progress<never>({
    value: 56,
    className: 'w-full max-w-sm',
    labelId: 'base-ui-_r_0_',
    children: attributes => [
      h.span([...attributes.label], ['Upload progress']),
      h.span([...attributes.value], [progressValue(56)]),
    ],
  })
}

export const ProgressRtl = (): Html => {
  const h = html<never>()
  const { dir, values } = arabicProgressRtl

  return Progress<never>({
    value: 56,
    className: 'w-full max-w-sm',
    dir,
    labelId: 'base-ui-_r_0_',
    children: attributes => [
      h.span([...attributes.label], [values.label]),
      h.span(
        [...attributes.value],
        [h.span([h.Class('ms-auto')], [values.value])],
      ),
    ],
  })
}
