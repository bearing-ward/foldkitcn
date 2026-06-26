import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Checkbox } from '../checkbox'
import { view as Label } from './index'

const checkbox = (id: string, dir?: string): Html => {
  const h = html<never>()

  return Checkbox<never>({
    id,
    name: id,
    checkedState: 'unchecked',
    ...(dir === undefined ? {} : { dir }),
    toView: attributes =>
      h.span(
        [...attributes.root],
        attributes.indicator.length > 0
          ? [h.span([...attributes.indicator], [])]
          : [],
      ),
  })
}

const checkboxInput = (id: string, dir?: string): Html =>
  Checkbox<never>({
    id,
    name: id,
    checkedState: 'unchecked',
    ...(dir === undefined ? {} : { dir }),
    toView: attributes => html<never>().input([...attributes.input]),
  })

export const LabelDemo = (): Html => {
  const h = html<never>()
  const id = 'label-demo-terms'

  return h.div(
    [h.Class('flex items-center gap-2')],
    [
      checkbox(id),
      checkboxInput(id),
      Label<never>({
        htmlFor: id,
        toView: attributes =>
          h.label([...attributes.label], ['Accept terms and conditions']),
      }),
    ],
  )
}

export const LabelRtl = (): Html => {
  const h = html<never>()
  const id = 'label-rtl-terms'
  const dir = 'rtl'

  return h.div(
    [h.Class('flex items-center gap-2'), h.Dir(dir)],
    [
      checkbox(id, dir),
      checkboxInput(id, dir),
      Label<never>({
        htmlFor: id,
        dir,
        toView: attributes =>
          h.label([...attributes.label], ['قبول الشروط والأحكام']),
      }),
    ],
  )
}
