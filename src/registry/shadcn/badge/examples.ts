import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import type { BadgeVariant } from './index'
import { rtlBadgeVariants, view as Badge } from './index'

type IconPlacement = 'inline-start' | 'inline-end'

const icon = (
  className: string,
  path: string,
  placement?: IconPlacement,
): Html => {
  const h = html<never>()
  const placementAttributes =
    placement === undefined ? [] : [h.DataAttribute('icon', placement)]

  return h.svg(
    [
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.Width('24'),
      h.Height('24'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.StrokeLinecap('round'),
      h.StrokeLinejoin('round'),
      h.Class(className),
      h.AriaHidden(true),
      ...placementAttributes,
    ],
    [h.path([h.D(path)], [])],
  )
}

const badgeCheckIcon = (placement: IconPlacement): Html =>
  icon(
    'lucide lucide-badge-check',
    'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76ZM9 12l2 2 4-4',
    placement,
  )

const bookmarkIcon = (placement: IconPlacement): Html =>
  icon(
    'lucide lucide-bookmark',
    'M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16',
    placement,
  )

const arrowUpRightIcon = (placement: IconPlacement): Html =>
  icon('lucide lucide-arrow-up-right', 'M7 7h10v10M7 17 17 7', placement)

const spinner = (placement: IconPlacement): Html => {
  const h = html<never>()

  return h.svg(
    [
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.Width('24'),
      h.Height('24'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.StrokeLinecap('round'),
      h.StrokeLinejoin('round'),
      h.DataAttribute('slot', 'spinner'),
      h.DataAttribute('icon', placement),
      h.Role('status'),
      h.AriaLabel('Loading'),
      h.Class('lucide lucide-loader-circle size-4 animate-spin'),
    ],
    [h.path([h.D('M21 12a9 9 0 1 1-6.219-8.56')], [])],
  )
}

const arabicBadgeRtl = {
  dir: 'rtl',
  values: {
    badge: 'شارة',
    secondary: 'ثانوي',
    destructive: 'مدمر',
    outline: 'مخطط',
    verified: 'متحقق',
    bookmark: 'إشارة مرجعية',
  },
}

const RtlBadge = (
  variant: BadgeVariant,
  children: ReadonlyArray<Html | string>,
): Html => {
  const h = html<never>()

  return h.span(
    [
      h.Class(rtlBadgeVariants({ variant })),
      h.DataAttribute('slot', 'badge'),
      h.DataAttribute('variant', variant),
    ],
    children,
  )
}

export const BadgeColors = (): Html => {
  const h = html<never>()
  const customColorBadge = (className: string, label: string): Html =>
    Badge<never>({
      className,
      toView: attributes => h.span([...attributes.badge], [label]),
    })

  return h.div(
    [h.Class('flex flex-wrap gap-2')],
    [
      customColorBadge(
        'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
        'Blue',
      ),
      customColorBadge(
        'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
        'Green',
      ),
      customColorBadge(
        'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
        'Sky',
      ),
      customColorBadge(
        'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
        'Purple',
      ),
      customColorBadge(
        'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
        'Red',
      ),
    ],
  )
}

export const BadgeDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full flex-wrap justify-center gap-2')],
    [
      Badge<never>({
        toView: attributes => h.span([...attributes.badge], ['Badge']),
      }),
      Badge<never>({
        variant: 'secondary',
        toView: attributes => h.span([...attributes.badge], ['Secondary']),
      }),
      Badge<never>({
        variant: 'destructive',
        toView: attributes => h.span([...attributes.badge], ['Destructive']),
      }),
      Badge<never>({
        variant: 'outline',
        toView: attributes => h.span([...attributes.badge], ['Outline']),
      }),
    ],
  )
}

export const BadgeIcon = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-wrap gap-2')],
    [
      Badge<never>({
        variant: 'secondary',
        toView: attributes =>
          h.span(
            [...attributes.badge],
            [badgeCheckIcon('inline-start'), 'Verified'],
          ),
      }),
      Badge<never>({
        variant: 'outline',
        toView: attributes =>
          h.span(
            [...attributes.badge],
            ['Bookmark', bookmarkIcon('inline-end')],
          ),
      }),
    ],
  )
}

export const BadgeLink = (): Html => {
  const h = html<never>()

  return Badge<never>({
    toView: attributes =>
      h.a(
        [...attributes.badge, h.Href('#link')],
        ['Open Link ', arrowUpRightIcon('inline-end')],
      ),
  })
}

export const BadgeRtl = (): Html => {
  const h = html<never>()
  const { dir, values } = arabicBadgeRtl

  return h.div(
    [h.Class('flex w-full flex-wrap justify-center gap-2'), h.Dir(dir)],
    [
      RtlBadge('default', [values.badge]),
      RtlBadge('secondary', [values.secondary]),
      RtlBadge('destructive', [values.destructive]),
      RtlBadge('outline', [values.outline]),
      RtlBadge('secondary', [badgeCheckIcon('inline-start'), values.verified]),
      RtlBadge('outline', [values.bookmark, bookmarkIcon('inline-end')]),
    ],
  )
}

export const BadgeSpinner = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-wrap gap-2')],
    [
      Badge<never>({
        variant: 'destructive',
        toView: attributes =>
          h.span([...attributes.badge], [spinner('inline-start'), 'Deleting']),
      }),
      Badge<never>({
        variant: 'secondary',
        toView: attributes =>
          h.span([...attributes.badge], ['Generating', spinner('inline-end')]),
      }),
    ],
  )
}

export const BadgeVariants = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-wrap gap-2')],
    [
      Badge<never>({
        toView: attributes => h.span([...attributes.badge], ['Default']),
      }),
      Badge<never>({
        variant: 'secondary',
        toView: attributes => h.span([...attributes.badge], ['Secondary']),
      }),
      Badge<never>({
        variant: 'destructive',
        toView: attributes => h.span([...attributes.badge], ['Destructive']),
      }),
      Badge<never>({
        variant: 'outline',
        toView: attributes => h.span([...attributes.badge], ['Outline']),
      }),
      Badge<never>({
        variant: 'ghost',
        toView: attributes => h.span([...attributes.badge], ['Ghost']),
      }),
    ],
  )
}
