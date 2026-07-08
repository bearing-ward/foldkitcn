import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { buttonVariants, view as Button } from './index'

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

const arrowUpIcon = (placement?: IconPlacement): Html =>
  icon('lucide lucide-arrow-up', 'M12 19V5m0 0-7 7m7-7 7 7', placement)

const arrowUpRightIcon = (): Html =>
  icon('lucide lucide-arrow-up-right', 'M7 7h10v10M7 17 17 7')

const arrowRightIcon = (placement?: IconPlacement): Html =>
  icon(
    'lucide lucide-arrow-right rtl:rotate-180',
    'M5 12h14m-7-7 7 7-7 7',
    placement,
  )

const plusIcon = (): Html => icon('lucide lucide-plus', 'M5 12h14M12 5v14')

const circleFadingArrowUpIcon = (): Html =>
  icon(
    'lucide lucide-circle-fading-arrow-up',
    'M12 2a10 10 0 0 1 7.38 16.75M12 8v8m0-8-3 3m3-3 3 3M2.5 8.875a10 10 0 0 0-.5 3.125M2.83 16a10 10 0 0 0 2.43 3.4M8.125 21.5a10 10 0 0 0 7.75 0',
  )

const branchIcon = (placement: IconPlacement): Html =>
  icon(
    'tabler-icon tabler-icon-git-branch',
    'M7 3v12m10-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM7 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10-12a9 9 0 0 1-9 9',
    placement,
  )

const forkIcon = (placement: IconPlacement): Html =>
  icon(
    'tabler-icon tabler-icon-git-fork',
    'M7 3v6a3 3 0 0 0 3 3h4M7 3a3 3 0 1 0 0 6M17 3a3 3 0 1 0 0 6M17 21a3 3 0 1 0 0-6M17 9v6',
    placement,
  )

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

export const ButtonDefault = (): Html => {
  const h = html<never>()

  return Button<never>({
    toView: attributes => h.button([...attributes.button], ['Button']),
  })
}

export const ButtonDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-wrap items-center gap-2 md:flex-row')],
    [
      Button<never>({
        variant: 'outline',
        toView: attributes => h.button([...attributes.button], ['Button']),
      }),
      Button<never>({
        variant: 'outline',
        size: 'icon',
        toView: attributes =>
          h.button(
            [...attributes.button, h.AriaLabel('Submit')],
            [arrowUpIcon()],
          ),
      }),
    ],
  )
}

export const ButtonOutline = (): Html => {
  const h = html<never>()

  return Button<never>({
    variant: 'outline',
    toView: attributes => h.button([...attributes.button], ['Outline']),
  })
}

export const ButtonSecondary = (): Html => {
  const h = html<never>()

  return Button<never>({
    variant: 'secondary',
    toView: attributes => h.button([...attributes.button], ['Secondary']),
  })
}

export const ButtonGhost = (): Html => {
  const h = html<never>()

  return Button<never>({
    variant: 'ghost',
    toView: attributes => h.button([...attributes.button], ['Ghost']),
  })
}

export const ButtonDestructive = (): Html => {
  const h = html<never>()

  return Button<never>({
    variant: 'destructive',
    toView: attributes => h.button([...attributes.button], ['Destructive']),
  })
}

export const ButtonLink = (): Html => {
  const h = html<never>()

  return Button<never>({
    variant: 'link',
    toView: attributes => h.button([...attributes.button], ['Link']),
  })
}

export const ButtonIcon = (): Html => {
  const h = html<never>()

  return Button<never>({
    variant: 'outline',
    size: 'icon',
    toView: attributes =>
      h.button([...attributes.button], [circleFadingArrowUpIcon()]),
  })
}

export const ButtonWithIcon = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex gap-2')],
    [
      Button<never>({
        variant: 'outline',
        toView: attributes =>
          h.button(
            [...attributes.button],
            [branchIcon('inline-start'), ' New Branch'],
          ),
      }),
      Button<never>({
        variant: 'outline',
        toView: attributes =>
          h.button([...attributes.button], ['Fork ', forkIcon('inline-end')]),
      }),
    ],
  )
}

export const ButtonSize = (): Html => {
  const h = html<never>()
  const sizePair = (
    label: string,
    size: 'xs' | 'sm' | 'default' | 'lg',
    iconSize: 'icon-xs' | 'icon-sm' | 'icon' | 'icon-lg',
  ): Html =>
    h.div(
      [h.Class('flex items-start gap-2')],
      [
        Button<never>({
          variant: 'outline',
          size,
          toView: attributes => h.button([...attributes.button], [label]),
        }),
        Button<never>({
          variant: 'outline',
          size: iconSize,
          toView: attributes =>
            h.button(
              [...attributes.button, h.AriaLabel('Submit')],
              [arrowUpRightIcon()],
            ),
        }),
      ],
    )

  return h.div(
    [h.Class('flex flex-col items-start gap-8 sm:flex-row')],
    [
      sizePair('Extra Small', 'xs', 'icon-xs'),
      sizePair('Small', 'sm', 'icon-sm'),
      sizePair('Default', 'default', 'icon'),
      sizePair('Large', 'lg', 'icon-lg'),
    ],
  )
}

export const ButtonRounded = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex gap-2')],
    [
      Button<never>({
        toView: attributes => h.button([...attributes.button], ['Get Started']),
      }),
      Button<never>({
        variant: 'outline',
        size: 'icon',
        toView: attributes => h.button([...attributes.button], [arrowUpIcon()]),
      }),
    ],
  )
}

export const ButtonSpinner = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex gap-2')],
    [
      Button<never>({
        variant: 'outline',
        isDisabled: true,
        toView: attributes =>
          h.button(
            [...attributes.button],
            [spinner('inline-start'), ' Generating'],
          ),
      }),
      Button<never>({
        variant: 'secondary',
        isDisabled: true,
        toView: attributes =>
          h.button(
            [...attributes.button],
            ['Downloading ', spinner('inline-start')],
          ),
      }),
    ],
  )
}

export const ButtonRender = (): Html => {
  const h = html<never>()

  return h.a(
    [
      h.Href('#'),
      h.Class(buttonVariants({ variant: 'secondary', size: 'sm' })),
    ],
    ['Login'],
  )
}

export const ButtonRtl = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-wrap items-center gap-2 md:flex-row'), h.Dir('rtl')],
    [
      Button<never>({
        variant: 'outline',
        toView: attributes => h.button([...attributes.button], ['زر']),
      }),
      Button<never>({
        variant: 'destructive',
        toView: attributes => h.button([...attributes.button], ['حذف']),
      }),
      Button<never>({
        variant: 'outline',
        toView: attributes =>
          h.button(
            [...attributes.button],
            ['إرسال ', arrowRightIcon('inline-end')],
          ),
      }),
      Button<never>({
        variant: 'outline',
        size: 'icon',
        toView: attributes =>
          h.button([...attributes.button, h.AriaLabel('Add')], [plusIcon()]),
      }),
      Button<never>({
        variant: 'secondary',
        isDisabled: true,
        toView: attributes =>
          h.button(
            [...attributes.button],
            [spinner('inline-start'), ' جاري التحميل'],
          ),
      }),
    ],
  )
}
