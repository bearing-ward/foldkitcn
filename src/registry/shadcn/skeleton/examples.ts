import { Array } from 'effect'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Skeleton } from './index'

const arabicSkeletonRtl = {
  dir: 'rtl',
}

const skeleton = (className: string): Html => {
  const h = html<never>()

  return Skeleton<never>({
    className,
    toView: attributes => h.div([...attributes.skeleton], []),
  })
}

const Card = (children: ReadonlyArray<Html>): Html => {
  const h = html<never>()

  return h.div(
    [
      h.DataAttribute('slot', 'card'),
      h.DataAttribute('size', 'default'),
      h.Class(
        'group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl w-full max-w-xs',
      ),
    ],
    children,
  )
}

const CardHeader = (children: ReadonlyArray<Html>): Html => {
  const h = html<never>()

  return h.div(
    [
      h.DataAttribute('slot', 'card-header'),
      h.Class(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)',
      ),
    ],
    children,
  )
}

const CardContent = (children: ReadonlyArray<Html>): Html => {
  const h = html<never>()

  return h.div(
    [h.DataAttribute('slot', 'card-content'), h.Class('px-(--card-spacing)')],
    children,
  )
}

export const SkeletonAvatar = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-fit items-center gap-4')],
    [
      skeleton('size-10 shrink-0 rounded-full'),
      h.div(
        [h.Class('grid gap-2')],
        [skeleton('h-4 w-[150px]'), skeleton('h-4 w-[100px]')],
      ),
    ],
  )
}

export const SkeletonCard = (): Html =>
  Card([
    CardHeader([skeleton('h-4 w-2/3'), skeleton('h-4 w-1/2')]),
    CardContent([skeleton('aspect-video w-full')]),
  ])

export const SkeletonDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex items-center gap-4')],
    [
      skeleton('h-12 w-12 rounded-full'),
      h.div(
        [h.Class('space-y-2')],
        [skeleton('h-4 w-[250px]'), skeleton('h-4 w-[200px]')],
      ),
    ],
  )
}

export const SkeletonForm = (): Html => {
  const h = html<never>()
  const field = (labelClassName: string): Html =>
    h.div(
      [h.Class('flex flex-col gap-3')],
      [skeleton(labelClassName), skeleton('h-8 w-full')],
    )

  return h.div(
    [h.Class('flex w-full max-w-xs flex-col gap-7')],
    [field('h-4 w-20'), field('h-4 w-24'), skeleton('h-8 w-24')],
  )
}

export const SkeletonRtl = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex items-center gap-4'), h.Dir(arabicSkeletonRtl.dir)],
    [
      skeleton('h-12 w-12 rounded-full'),
      h.div(
        [h.Class('space-y-2')],
        [skeleton('h-4 w-[250px]'), skeleton('h-4 w-[200px]')],
      ),
    ],
  )
}

export const SkeletonTable = (): Html => {
  const h = html<never>()
  const row = (index: number): Html =>
    h.div(
      [h.Class('flex gap-4'), h.Key(String(index))],
      [skeleton('h-4 flex-1'), skeleton('h-4 w-24'), skeleton('h-4 w-20')],
    )

  return h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-2')],
    Array.makeBy(5, row),
  )
}

export const SkeletonText = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-xs flex-col gap-2')],
    [skeleton('h-4 w-full'), skeleton('h-4 w-full'), skeleton('h-4 w-3/4')],
  )
}
