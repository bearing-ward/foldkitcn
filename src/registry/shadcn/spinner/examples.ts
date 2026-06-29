import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Badge } from '../badge'
import { view as Button } from '../button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from '../input-group'
import { Item, ItemContent, ItemMedia, ItemTitle } from '../item'
import { view as Spinner } from './index'

export { SpinnerEmpty } from '../empty/examples'

type Child = Html | string

const loaderIconPaths: ReadonlyArray<string> = [
  'M12 2v4',
  'm16.2 7.8 2.9-2.9',
  'M18 12h4',
  'm16.2 16.2 2.9 2.9',
  'M12 18v4',
  'm4.9 19.1 2.9-2.9',
  'M2 12h4',
  'm4.9 4.9 2.9 2.9',
]

const spinner = (
  attributes: ReadonlyArray<Attribute<never>> = [],
  className?: string,
): Html =>
  Spinner<never>({
    className,
    attributes,
  })

const badge = (
  children: ReadonlyArray<Child>,
  variant?: 'default' | 'secondary' | 'outline',
): Html => {
  const h = html<never>()

  return Badge<never>({
    variant,
    toView: attributes => h.span([...attributes.badge], children),
  })
}

const button = (
  children: ReadonlyArray<Child>,
  config: Readonly<{
    variant?: 'outline' | 'secondary'
    size?: 'sm'
    disabled?: boolean
  }> = {},
): Html => {
  const h = html<never>()

  return Button<never>({
    variant: config.variant,
    size: config.size,
    isDisabled: config.disabled,
    toView: attributes => h.button([...attributes.button], children),
  })
}

const arrowUpIcon = (): Html => {
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
      h.Class('lucide lucide-arrow-up-icon'),
      h.AriaHidden(true),
    ],
    [h.path([h.D('m5 12 7-7 7 7')], []), h.path([h.D('M12 19V5')], [])],
  )
}

export const SpinnerDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-xs flex-col gap-4 [--radius:1rem]')],
    [
      Item<never>({
        variant: 'muted',
        children: [
          ItemMedia<never>({
            children: [spinner()],
          }),
          ItemContent<never>({
            children: [
              ItemTitle<never>({
                className: 'line-clamp-1',
                children: ['Processing payment...'],
              }),
            ],
          }),
          ItemContent<never>({
            className: 'flex-none justify-end',
            children: [h.span([h.Class('text-sm tabular-nums')], ['$100.00'])],
          }),
        ],
      }),
    ],
  )
}

export const SpinnerBadge = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex items-center gap-4 [--radius:1.2rem]')],
    [
      badge([spinner([h.DataAttribute('icon', 'inline-start')]), 'Syncing']),
      badge(
        [spinner([h.DataAttribute('icon', 'inline-start')]), 'Updating'],
        'secondary',
      ),
      badge(
        [spinner([h.DataAttribute('icon', 'inline-start')]), 'Processing'],
        'outline',
      ),
    ],
  )
}

export const SpinnerButton = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-col items-center gap-4')],
    [
      button(
        [spinner([h.DataAttribute('icon', 'inline-start')]), 'Loading...'],
        {
          disabled: true,
          size: 'sm',
        },
      ),
      button(
        [spinner([h.DataAttribute('icon', 'inline-start')]), 'Please wait'],
        {
          disabled: true,
          size: 'sm',
          variant: 'outline',
        },
      ),
      button(
        [spinner([h.DataAttribute('icon', 'inline-start')]), 'Processing'],
        {
          disabled: true,
          size: 'sm',
          variant: 'secondary',
        },
      ),
    ],
  )
}

export const SpinnerCustom = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex items-center gap-4')],
    [
      h.svg(
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
          h.Role('status'),
          h.AriaLabel('Loading'),
          h.Class('lucide lucide-loader-icon size-4 animate-spin'),
        ],
        loaderIconPaths.map(path => h.path([h.D(path)], [])),
      ),
    ],
  )
}

export const SpinnerInputGroup = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-md flex-col gap-4')],
    [
      InputGroup<never>({
        children: [
          InputGroupInput<never>({
            placeholder: 'Send a message...',
            isDisabled: true,
          }),
          InputGroupAddon<never>({
            align: 'inline-end',
            children: [spinner()],
          }),
        ],
      }),
      InputGroup<never>({
        children: [
          InputGroupTextarea<never>({
            placeholder: 'Send a message...',
            isDisabled: true,
          }),
          InputGroupAddon<never>({
            align: 'block-end',
            children: [
              spinner(),
              ' Validating...',
              InputGroupButton<never>({
                className: 'ml-auto',
                variant: 'default',
                children: [
                  arrowUpIcon(),
                  h.span([h.Class('sr-only')], ['Send']),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  )
}

export const SpinnerRtl = (): Html => {
  const h = html<never>()

  return h.div(
    [
      h.Class('flex w-full max-w-xs flex-col gap-4 [--radius:1rem]'),
      h.Dir('rtl'),
    ],
    [
      Item<never>({
        variant: 'muted',
        dir: 'rtl',
        children: [
          ItemMedia<never>({
            children: [spinner()],
          }),
          ItemContent<never>({
            children: [
              ItemTitle<never>({
                className: 'line-clamp-1',
                children: ['جاري معالجة الدفع...'],
              }),
            ],
          }),
          ItemContent<never>({
            className: 'flex-none justify-end',
            children: [
              h.span([h.Class('text-sm tabular-nums')], ['١٠٠.٠٠ دولار']),
            ],
          }),
        ],
      }),
    ],
  )
}

export const SpinnerSize = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex items-center gap-6')],
    [
      spinner([], 'size-3'),
      spinner([], 'size-4'),
      spinner([], 'size-6'),
      spinner([], 'size-8'),
    ],
  )
}
