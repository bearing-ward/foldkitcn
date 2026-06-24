import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Separator } from './index'

const arabicSeparatorRtl = {
  dir: 'rtl',
  values: {
    title: 'shadcn/ui',
    subtitle: 'الأساس لنظام التصميم الخاص بك',
    description:
      'مجموعة من المكونات المصممة بشكل جميل يمكنك تخصيصها وتوسيعها والبناء عليها.',
  },
}

export const SeparatorDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex max-w-sm flex-col gap-4 text-sm')],
    [
      h.div(
        [h.Class('flex flex-col gap-1.5')],
        [
          h.div([h.Class('leading-none font-medium')], ['shadcn/ui']),
          h.div(
            [h.Class('text-muted-foreground')],
            ['The Foundation for your Design System'],
          ),
        ],
      ),
      Separator<never>({
        toView: attributes => h.div([...attributes.separator], []),
      }),
      h.div(
        [],
        [
          'A set of beautifully designed components that you can customize, extend, and build on.',
        ],
      ),
    ],
  )
}

export const SeparatorList = (): Html => {
  const h = html<never>()
  const row = (item: string, value: string): Html =>
    h.dl(
      [h.Class('flex items-center justify-between')],
      [h.dt([], [item]), h.dd([h.Class('text-muted-foreground')], [value])],
    )
  const separator = (): Html =>
    Separator<never>({
      toView: attributes => h.div([...attributes.separator], []),
    })

  return h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-2 text-sm')],
    [
      row('Item 1', 'Value 1'),
      separator(),
      row('Item 2', 'Value 2'),
      separator(),
      row('Item 3', 'Value 3'),
    ],
  )
}

export const SeparatorMenu = (): Html => {
  const h = html<never>()
  const group = (
    title: string,
    description: string,
    className = 'flex flex-col gap-1',
  ): Html =>
    h.div(
      [h.Class(className)],
      [
        h.span([h.Class('font-medium')], [title]),
        h.span([h.Class('text-xs text-muted-foreground')], [description]),
      ],
    )
  const verticalSeparator = (className?: string): Html =>
    Separator<never>({
      orientation: 'vertical',
      className,
      toView: attributes => h.div([...attributes.separator], []),
    })

  return h.div(
    [h.Class('flex items-center gap-2 text-sm md:gap-4')],
    [
      group('Settings', 'Manage preferences'),
      verticalSeparator(),
      group('Account', 'Profile & security'),
      verticalSeparator('hidden md:block'),
      group('Help', 'Support & docs', 'hidden flex-col gap-1 md:flex'),
    ],
  )
}

export const SeparatorVertical = (): Html => {
  const h = html<never>()
  const verticalSeparator = (): Html =>
    Separator<never>({
      orientation: 'vertical',
      toView: attributes => h.div([...attributes.separator], []),
    })

  return h.div(
    [h.Class('flex h-5 items-center gap-4 text-sm')],
    [
      h.div([], ['Blog']),
      verticalSeparator(),
      h.div([], ['Docs']),
      verticalSeparator(),
      h.div([], ['Source']),
    ],
  )
}

export const SeparatorRtl = (): Html => {
  const h = html<never>()
  const { dir, values } = arabicSeparatorRtl

  return h.div(
    [h.Class('flex max-w-sm flex-col gap-4 text-sm'), h.Dir(dir)],
    [
      h.div(
        [h.Class('flex flex-col gap-1.5')],
        [
          h.div([h.Class('leading-none font-medium')], [values.title]),
          h.div([h.Class('text-muted-foreground')], [values.subtitle]),
        ],
      ),
      Separator<never>({
        toView: attributes => h.div([...attributes.separator], []),
      }),
      h.div([], [values.description]),
    ],
  )
}
