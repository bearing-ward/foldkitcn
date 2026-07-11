import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Button from '../button'
import {
  ButtonGroup,
  ButtonGroupText,
  buttonGroupTextClassName,
} from '../button-group'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../card'
import * as DropdownMenu from '../dropdown-menu'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../field'
import { view as Input } from '../input'
import { groupView as KbdGroup, view as Kbd } from '../kbd'
import * as Label from '../label'
import { Spinner } from '../spinner'
import * as Tooltip from '../tooltip'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './index'

type IconName =
  | 'check'
  | 'chevronDown'
  | 'code'
  | 'copy'
  | 'cornerDownLeft'
  | 'creditCard'
  | 'externalLink'
  | 'eyeOff'
  | 'info'
  | 'link'
  | 'loader'
  | 'mail'
  | 'mic'
  | 'moreHorizontal'
  | 'radio'
  | 'refresh'
  | 'search'
  | 'sparkles'
  | 'star'
  | 'trash'

type Child = Html | string

const iconPaths: Readonly<Record<IconName, ReadonlyArray<string>>> = {
  check: ['M20 6 9 17l-5-5'],
  chevronDown: ['m6 9 6 6 6-6'],
  code: ['m16 18 6-6-6-6', 'm8 6-6 6 6 6'],
  copy: [
    'M7 7m0 2.667A2.667 2.667 0 0 1 9.667 7h8.666A2.667 2.667 0 0 1 21 9.667v8.666A2.667 2.667 0 0 1 18.333 21H9.667A2.667 2.667 0 0 1 7 18.333z',
    'M4.012 16.737A2.005 2.005 0 0 1 3 15V5c0-1.1.9-2 2-2h10c.75 0 1.158.385 1.5 1',
  ],
  cornerDownLeft: ['m9 10-4 4 4 4', 'M20 4v7a4 4 0 0 1-4 4H5'],
  creditCard: [
    'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
    'M2 10h20',
  ],
  externalLink: [
    'M15 3h6v6',
    'M10 14 21 3',
    'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  ],
  eyeOff: [
    'm2 2 20 20',
    'M10.584 10.587A2 2 0 0 0 13.414 13.4',
    'M9.363 5.365A9.466 9.466 0 0 1 12 5c7 0 10 7 10 7a13.11 13.11 0 0 1-1.67 2.68',
    'M6.11 6.1C3.73 7.72 2 12 2 12a13.12 13.12 0 0 0 5.03 5.48',
  ],
  info: ['M12 16v-4', 'M12 8h.01', 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0'],
  link: [
    'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
    'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  ],
  loader: [
    'M12 2v4',
    'm16.2 7.8 2.9-2.9',
    'M18 12h4',
    'm16.2 16.2 2.9 2.9',
    'M12 18v4',
    'm4.9 19.1 2.9-2.9',
    'M2 12h4',
    'm4.9 4.9 2.9 2.9',
  ],
  mail: [
    'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    'm22 7-10 5L2 7',
  ],
  mic: [
    'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3',
    'M19 10v2a7 7 0 0 1-14 0v-2',
    'M12 19v3',
  ],
  moreHorizontal: ['M12 12h.01', 'M19 12h.01', 'M5 12h.01'],
  radio: [
    'path 4.9 19.1A10 10 0 0 1 19.1 4.9',
    'path 7.8 16.2A6 6 0 0 1 16.2 7.8',
    'circle 12 12 2',
  ],
  refresh: [
    'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16',
    'M3 21v-5h5',
    'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8',
    'M16 8h5V3',
  ],
  search: ['m21 21-4.34-4.34'],
  sparkles: [
    'M9.94 15.5 8.5 20l-1.44-4.5L2.5 14l4.56-1.5L8.5 8l1.44 4.5L14.5 14z',
    'M17.5 8 16.5 11 15.5 8 12.5 7 15.5 6 16.5 3 17.5 6 20.5 7z',
  ],
  star: [
    'M11.5 2.5 8.6 8.38 2.1 9.32l4.7 4.58-1.1 6.47 5.8-3.05 5.8 3.05-1.1-6.47 4.7-4.58-6.5-.94z',
  ],
  trash: ['M3 6h18', 'M8 6V4h8v2', 'M19 6l-1 14H6L5 6', 'M10 11v6', 'M14 11v6'],
}

const iconClassNames: Readonly<Record<IconName, string>> = {
  check: 'lucide lucide-check-icon',
  chevronDown: 'lucide lucide-chevron-down-icon',
  code: 'lucide lucide-code-icon',
  copy: 'lucide lucide-copy-icon',
  cornerDownLeft: 'lucide lucide-corner-down-left-icon',
  creditCard: 'lucide lucide-credit-card-icon',
  externalLink: 'lucide lucide-external-link-icon',
  eyeOff: 'lucide lucide-eye-off-icon',
  info: 'lucide lucide-info-icon',
  link: 'lucide lucide-link-icon',
  loader: 'lucide lucide-loader-icon',
  mail: 'lucide lucide-mail-icon',
  mic: 'lucide lucide-mic-icon',
  moreHorizontal: 'lucide lucide-more-horizontal-icon',
  radio: 'lucide lucide-radio-icon',
  refresh: 'lucide lucide-refresh-icon',
  search: 'lucide lucide-search-icon',
  sparkles: 'lucide lucide-sparkles-icon',
  star: 'lucide lucide-star-icon',
  trash: 'lucide lucide-trash-icon',
}

const icon = (
  name: IconName,
  attributes: ReadonlyArray<Attribute<never>> = [],
): Html => {
  const h = html<never>()
  const paths = iconPaths[name].map(path => h.path([h.D(path)], []))
  const extra =
    name === 'search' ? [h.circle([h.Cx('11'), h.Cy('11'), h.R('8')], [])] : []

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
      h.Class(iconClassNames[name]),
      h.AriaHidden(true),
      ...attributes,
    ],
    [...paths, ...extra],
  )
}

const loaderIcon = (): Html => {
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
      h.Class(`${iconClassNames.loader} animate-spin`),
      h.AriaHidden(true),
    ],
    iconPaths.loader.map(path => h.path([h.D(path)], [])),
  )
}

const kbd = (children: ReadonlyArray<Child>): Html => {
  const h = html<never>()

  return Kbd<never>({
    toView: attributes => h.kbd([...attributes.kbd], children),
  })
}

const kbdGroup = (children: ReadonlyArray<Child>): Html => {
  const h = html<never>()

  return KbdGroup<never>({
    toView: attributes => h.kbd([...attributes.kbdGroup], children),
  })
}

const label = (htmlFor: string, children: ReadonlyArray<Child>): Html => {
  const h = html<never>()

  return Label.view<never>({
    htmlFor,
    toView: attributes => h.label([...attributes.label], children),
  })
}

const labelWithClass = (
  htmlFor: string,
  className: string,
  children: ReadonlyArray<Child>,
): Html => {
  const h = html<never>()

  return Label.view<never>({
    htmlFor,
    className,
    toView: attributes => h.label([...attributes.label], children),
  })
}

const staticTooltipContent = (children: ReadonlyArray<Child>): Html => {
  const h = html<never>()

  return h.div(
    [h.Class(Tooltip.tooltipPositionerClassName())],
    [
      h.div(
        [
          h.DataAttribute('slot', 'tooltip-content'),
          h.DataAttribute('side', 'top'),
          h.Class(Tooltip.tooltipContentClassName()),
        ],
        [
          h.p([], children),
          h.div([h.Class(Tooltip.tooltipArrowClassName())], []),
        ],
      ),
    ],
  )
}

const buttonGroupLabel = (
  htmlFor: string,
  children: ReadonlyArray<Child>,
): Html => {
  const h = html<never>()

  return h.label(
    [
      h.DataAttribute('slot', 'button-group-text'),
      h.Attribute('for', htmlFor),
      h.Class(Label.labelClassName({ className: buttonGroupTextClassName() })),
    ],
    children,
  )
}

const standaloneInput = (id: string): Html => {
  const h = html<never>()

  return Input<never>({
    id,
    placeholder: 'Placeholder',
    toView: attributes => h.input([...attributes.input]),
  })
}

const fieldWithDataAttribute = (
  name: string,
  children: ReadonlyArray<Child>,
): Html => {
  const h = html<never>()

  return Field<never>({
    toView: attributes =>
      h.div([...attributes.root, h.DataAttribute(name, 'true')], children),
  })
}

const iconAddon = (
  name: IconName,
  align?: 'inline-start' | 'inline-end',
): Html =>
  InputGroupAddon<never>({
    align,
    children: [icon(name)],
  })

const dropdownButton = (labelText: string): Html => {
  const isIconButton = labelText === 'More'

  return DropdownMenu.view<never>({
    id: `input-group-${labelText.toLowerCase().replaceAll(' ', '-')}`,
    items: [],
    open: false,
    toView: attributes =>
      InputGroupButton<never>({
        variant: 'ghost',
        size: isIconButton ? 'icon-xs' : 'xs',
        attributes: attributes.trigger.filter(
          attribute =>
            !(attribute._tag === 'DataAttribute' && attribute.key === 'slot'),
        ),
        ...(isIconButton ? { ariaLabel: labelText } : {}),
        children: isIconButton
          ? [icon('moreHorizontal')]
          : [labelText, icon('chevronDown', [html<never>().Class('size-3')])],
      }),
  })
}

export const InputGroupDemo = (): Html =>
  InputGroup<never>({
    className: 'max-w-xs',
    children: [
      InputGroupInput<never>({ placeholder: 'Search...' }),
      iconAddon('search'),
      InputGroupAddon<never>({
        align: 'inline-end',
        children: ['12 results'],
      }),
    ],
  })

export const InputGroupBasic = (): Html =>
  FieldGroup<never>({
    children: [
      Field<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'input-default-01',
            children: ['Default (No Input Group)'],
          }),
          standaloneInput('input-default-01'),
        ],
      }),
      Field<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'input-group-02',
            children: ['Input Group'],
          }),
          InputGroup<never>({
            children: [
              InputGroupInput<never>({
                id: 'input-group-02',
                placeholder: 'Placeholder',
              }),
            ],
          }),
        ],
      }),
      fieldWithDataAttribute('disabled', [
        FieldLabel<never>({
          htmlFor: 'input-disabled-03',
          children: ['Disabled'],
        }),
        InputGroup<never>({
          children: [
            InputGroupInput<never>({
              id: 'input-disabled-03',
              placeholder: 'This field is disabled',
              isDisabled: true,
            }),
          ],
        }),
      ]),
      fieldWithDataAttribute('invalid', [
        FieldLabel<never>({
          htmlFor: 'input-invalid-04',
          children: ['Invalid'],
        }),
        InputGroup<never>({
          children: [
            InputGroupInput<never>({
              id: 'input-invalid-04',
              placeholder: 'This field is invalid',
              isInvalid: true,
            }),
          ],
        }),
      ]),
    ],
  })

export const InputGroupInlineStart = (): Html =>
  Field<never>({
    className: 'max-w-sm',
    children: [
      FieldLabel<never>({
        htmlFor: 'inline-start-input',
        children: ['Input'],
      }),
      InputGroup<never>({
        children: [
          InputGroupInput<never>({
            id: 'inline-start-input',
            placeholder: 'Search...',
          }),
          iconAddon('search', 'inline-start'),
        ],
      }),
      FieldDescription<never>({ children: ['Icon positioned at the start.'] }),
    ],
  })

export const InputGroupInlineEnd = (): Html =>
  Field<never>({
    className: 'max-w-sm',
    children: [
      FieldLabel<never>({
        htmlFor: 'inline-end-input',
        children: ['Input'],
      }),
      InputGroup<never>({
        children: [
          InputGroupInput<never>({
            id: 'inline-end-input',
            type: 'password',
            placeholder: 'Enter password',
          }),
          iconAddon('eyeOff', 'inline-end'),
        ],
      }),
      FieldDescription<never>({ children: ['Icon positioned at the end.'] }),
    ],
  })

export const InputGroupBlockStart = (): Html =>
  FieldGroup<never>({
    className: 'max-w-sm',
    children: [
      Field<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'block-start-input',
            children: ['Input'],
          }),
          InputGroup<never>({
            className: 'h-auto',
            children: [
              InputGroupInput<never>({
                id: 'block-start-input',
                placeholder: 'Enter your name',
              }),
              InputGroupAddon<never>({
                align: 'block-start',
                children: [InputGroupText<never>({ children: ['Full Name'] })],
              }),
            ],
          }),
          FieldDescription<never>({
            children: ['Header positioned above the input.'],
          }),
        ],
      }),
      Field<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'block-start-textarea',
            children: ['Textarea'],
          }),
          InputGroup<never>({
            children: [
              InputGroupTextarea<never>({
                id: 'block-start-textarea',
                placeholder: "console.log('Hello, world!');",
                className: 'font-mono text-sm',
              }),
              InputGroupAddon<never>({
                align: 'block-start',
                children: [
                  icon('code'),
                  InputGroupText<never>({
                    className: 'font-mono',
                    children: ['script.js'],
                  }),
                  InputGroupButton<never>({
                    size: 'icon-xs',
                    children: [
                      icon('copy'),
                      html<never>().span(
                        [html<never>().Class('sr-only')],
                        ['Copy'],
                      ),
                    ],
                  }),
                ],
              }),
            ],
          }),
          FieldDescription<never>({
            children: ['Header positioned above the textarea.'],
          }),
        ],
      }),
    ],
  })

export const InputGroupBlockEnd = (): Html =>
  FieldGroup<never>({
    className: 'max-w-sm',
    children: [
      Field<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'block-end-input',
            children: ['Input'],
          }),
          InputGroup<never>({
            className: 'h-auto',
            children: [
              InputGroupInput<never>({
                id: 'block-end-input',
                placeholder: 'Enter amount',
              }),
              InputGroupAddon<never>({
                align: 'block-end',
                children: [InputGroupText<never>({ children: ['USD'] })],
              }),
            ],
          }),
          FieldDescription<never>({
            children: ['Footer positioned below the input.'],
          }),
        ],
      }),
      Field<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'block-end-textarea',
            children: ['Textarea'],
          }),
          InputGroup<never>({
            children: [
              InputGroupTextarea<never>({
                id: 'block-end-textarea',
                placeholder: 'Write a comment...',
              }),
              InputGroupAddon<never>({
                align: 'block-end',
                children: [
                  InputGroupText<never>({ children: ['0/280'] }),
                  InputGroupButton<never>({
                    variant: 'default',
                    size: 'sm',
                    children: ['Post'],
                  }),
                ],
              }),
            ],
          }),
          FieldDescription<never>({
            children: ['Footer positioned below the textarea.'],
          }),
        ],
      }),
    ],
  })

export const InputGroupWithButtons = (): Html =>
  FieldGroup<never>({
    children: [
      Field<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'input-button-13',
            children: ['Button'],
          }),
          InputGroup<never>({
            children: [
              InputGroupInput<never>({ id: 'input-button-13' }),
              InputGroupAddon<never>({
                children: [InputGroupButton<never>({ children: ['Default'] })],
              }),
            ],
          }),
          InputGroup<never>({
            children: [
              InputGroupInput<never>({ id: 'input-button-14' }),
              InputGroupAddon<never>({
                children: [
                  InputGroupButton<never>({
                    variant: 'outline',
                    children: ['Outline'],
                  }),
                ],
              }),
            ],
          }),
          InputGroup<never>({
            children: [
              InputGroupInput<never>({ id: 'input-button-15' }),
              InputGroupAddon<never>({
                children: [
                  InputGroupButton<never>({
                    variant: 'secondary',
                    children: ['Secondary'],
                  }),
                ],
              }),
            ],
          }),
          InputGroup<never>({
            children: [
              InputGroupInput<never>({ id: 'input-button-16' }),
              InputGroupAddon<never>({
                align: 'inline-end',
                children: [
                  InputGroupButton<never>({
                    variant: 'secondary',
                    children: ['Button'],
                  }),
                ],
              }),
            ],
          }),
          InputGroup<never>({
            children: [
              InputGroupInput<never>({ id: 'input-button-17' }),
              InputGroupAddon<never>({
                align: 'inline-end',
                children: [
                  InputGroupButton<never>({
                    size: 'icon-xs',
                    children: [icon('copy')],
                  }),
                ],
              }),
            ],
          }),
          InputGroup<never>({
            children: [
              InputGroupInput<never>({ id: 'input-button-18' }),
              InputGroupAddon<never>({
                align: 'inline-end',
                children: [
                  InputGroupButton<never>({
                    variant: 'secondary',
                    size: 'icon-xs',
                    children: [icon('trash')],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })

export const InputGroupButtonGroup = (): Html =>
  html<never>().div(
    [html<never>().Class('grid w-full max-w-sm gap-6')],
    [
      ButtonGroup<never>({
        children: [
          buttonGroupLabel('url', ['https://']),
          InputGroup<never>({
            children: [
              InputGroupInput<never>({ id: 'url' }),
              InputGroupAddon<never>({
                align: 'inline-end',
                children: [icon('link')],
              }),
            ],
          }),
          ButtonGroupText<never>({ children: ['.com'] }),
        ],
      }),
    ],
  )

export const InputGroupDropdown = (): Html =>
  html<never>().div(
    [html<never>().Class('grid w-full max-w-sm gap-4')],
    [
      InputGroup<never>({
        children: [
          InputGroupInput<never>({ placeholder: 'Enter file name' }),
          InputGroupAddon<never>({
            align: 'inline-end',
            children: [dropdownButton('More')],
          }),
        ],
      }),
      InputGroup<never>({
        children: [
          InputGroupInput<never>({ placeholder: 'Enter search query' }),
          InputGroupAddon<never>({
            align: 'inline-end',
            children: [dropdownButton('Search In...')],
          }),
        ],
      }),
    ],
  )

export const InputGroupIcon = (): Html =>
  html<never>().div(
    [html<never>().Class('grid w-full max-w-sm gap-6')],
    [
      InputGroup<never>({
        children: [
          InputGroupInput<never>({ placeholder: 'Search...' }),
          iconAddon('search'),
        ],
      }),
      InputGroup<never>({
        children: [
          InputGroupInput<never>({
            type: 'email',
            placeholder: 'Enter your email',
          }),
          iconAddon('mail'),
        ],
      }),
      InputGroup<never>({
        children: [
          InputGroupInput<never>({ placeholder: 'Card number' }),
          iconAddon('creditCard'),
          iconAddon('check', 'inline-end'),
        ],
      }),
      InputGroup<never>({
        children: [
          InputGroupInput<never>({ placeholder: 'Card number' }),
          InputGroupAddon<never>({
            align: 'inline-end',
            children: [icon('star'), icon('info')],
          }),
        ],
      }),
    ],
  )

export const InputGroupKbd = (): Html =>
  InputGroup<never>({
    className: 'max-w-sm',
    children: [
      InputGroupInput<never>({ placeholder: 'Search...' }),
      InputGroupAddon<never>({
        children: [icon('search')],
      }),
      InputGroupAddon<never>({
        align: 'inline-end',
        children: [kbd(['⌘K'])],
      }),
    ],
  })

export const InputGroupLabel = (): Html =>
  html<never>().div(
    [html<never>().Class('grid w-full max-w-sm gap-4')],
    [
      InputGroup<never>({
        children: [
          InputGroupInput<never>({ id: 'email', placeholder: 'shadcn' }),
          InputGroupAddon<never>({
            children: [label('email', ['@'])],
          }),
        ],
      }),
      InputGroup<never>({
        children: [
          InputGroupInput<never>({
            id: 'email-2',
            placeholder: 'shadcn@vercel.com',
          }),
          InputGroupAddon<never>({
            align: 'block-start',
            children: [
              labelWithClass('email-2', 'text-foreground', ['Email']),
              InputGroupButton<never>({
                variant: 'ghost',
                ariaLabel: 'Help',
                size: 'icon-xs',
                children: [icon('info')],
              }),
              staticTooltipContent([
                "We'll use this to send you notifications",
              ]),
            ],
          }),
        ],
      }),
    ],
  )

export const InputGroupTextExample = (): Html =>
  html<never>().div(
    [html<never>().Class('grid w-full max-w-sm gap-6')],
    [
      InputGroup<never>({
        children: [
          InputGroupAddon<never>({
            children: [InputGroupText<never>({ children: ['$'] })],
          }),
          InputGroupInput<never>({ placeholder: '0.00' }),
          InputGroupAddon<never>({
            align: 'inline-end',
            children: [InputGroupText<never>({ children: ['USD'] })],
          }),
        ],
      }),
      InputGroup<never>({
        children: [
          InputGroupAddon<never>({
            children: [InputGroupText<never>({ children: ['https://'] })],
          }),
          InputGroupInput<never>({
            placeholder: 'example.com',
            className: 'pl-0.5!',
          }),
          InputGroupAddon<never>({
            align: 'inline-end',
            children: [InputGroupText<never>({ children: ['.com'] })],
          }),
        ],
      }),
      InputGroup<never>({
        children: [
          InputGroupInput<never>({
            placeholder: 'Enter your username',
          }),
          InputGroupAddon<never>({
            align: 'inline-end',
            children: [InputGroupText<never>({ children: ['@company.com'] })],
          }),
        ],
      }),
      InputGroup<never>({
        children: [
          InputGroupTextarea<never>({ placeholder: 'Enter your message' }),
          InputGroupAddon<never>({
            align: 'block-end',
            children: [
              InputGroupText<never>({
                className: 'text-xs text-muted-foreground',
                children: ['120 characters left'],
              }),
            ],
          }),
        ],
      }),
    ],
  )

export const InputGroupTextareaExample = (): Html =>
  html<never>().div(
    [html<never>().Class('grid w-full max-w-md gap-4')],
    [
      InputGroup<never>({
        children: [
          InputGroupTextarea<never>({
            id: 'textarea-code-32',
            placeholder: "console.log('Hello, world!');",
            className: 'min-h-[200px]',
          }),
          InputGroupAddon<never>({
            align: 'block-end',
            className: 'border-t',
            children: [
              InputGroupText<never>({ children: ['Line 1, Column 1'] }),
              InputGroupButton<never>({
                size: 'sm',
                variant: 'default',
                children: ['Run ', icon('cornerDownLeft')],
              }),
            ],
          }),
          InputGroupAddon<never>({
            align: 'block-start',
            className: 'border-b',
            children: [
              InputGroupText<never>({
                className: 'font-mono font-medium',
                children: [icon('code'), 'script.js'],
              }),
              InputGroupButton<never>({
                size: 'icon-xs',
                children: [icon('refresh')],
              }),
              InputGroupButton<never>({
                variant: 'ghost',
                size: 'icon-xs',
                children: [icon('copy')],
              }),
            ],
          }),
        ],
      }),
    ],
  )

export const InputGroupInCard = (): Html =>
  Card<never>({
    className: 'w-full',
    children: [
      CardHeader<never>({
        children: [
          CardTitle<never>({ children: ['Card with Input Group'] }),
          CardDescription<never>({
            children: ['This is a card with an input group.'],
          }),
        ],
      }),
      CardContent<never>({
        children: [
          FieldGroup<never>({
            children: [
              Field<never>({
                children: [
                  FieldLabel<never>({
                    htmlFor: 'email-input',
                    children: ['Email Address'],
                  }),
                  InputGroup<never>({
                    children: [
                      InputGroupInput<never>({
                        id: 'email-input',
                        type: 'email',
                        placeholder: 'you@example.com',
                      }),
                      iconAddon('mail', 'inline-end'),
                    ],
                  }),
                ],
              }),
              Field<never>({
                children: [
                  FieldLabel<never>({
                    htmlFor: 'website-input',
                    children: ['Website URL'],
                  }),
                  InputGroup<never>({
                    children: [
                      InputGroupAddon<never>({
                        children: [
                          InputGroupText<never>({ children: ['https://'] }),
                        ],
                      }),
                      InputGroupInput<never>({
                        id: 'website-input',
                        placeholder: 'example.com',
                      }),
                      InputGroupAddon<never>({
                        align: 'inline-end',
                        children: [icon('externalLink')],
                      }),
                    ],
                  }),
                ],
              }),
              Field<never>({
                children: [
                  FieldLabel<never>({
                    htmlFor: 'feedback-textarea',
                    children: ['Feedback & Comments'],
                  }),
                  InputGroup<never>({
                    children: [
                      InputGroupTextarea<never>({
                        id: 'feedback-textarea',
                        placeholder: 'Share your thoughts...',
                        className: 'min-h-[100px]',
                      }),
                      InputGroupAddon<never>({
                        align: 'block-end',
                        children: [
                          InputGroupText<never>({
                            children: ['0/500 characters'],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      CardFooter<never>({
        className: 'justify-end gap-2',
        children: [
          Button.view<never>({
            variant: 'outline',
            toView: attributes =>
              html<never>().button([...attributes.button], ['Cancel']),
          }),
          Button.view<never>({
            toView: attributes =>
              html<never>().button([...attributes.button], ['Submit']),
          }),
        ],
      }),
    ],
  })

export const InputGroupWithKbd = (): Html =>
  FieldGroup<never>({
    children: [
      Field<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'input-kbd-22',
            children: ['Input Group with Kbd'],
          }),
          InputGroup<never>({
            children: [
              InputGroupInput<never>({ id: 'input-kbd-22' }),
              InputGroupAddon<never>({ children: [kbd(['⌘K'])] }),
            ],
          }),
          InputGroup<never>({
            children: [
              InputGroupInput<never>({ id: 'input-kbd-23' }),
              InputGroupAddon<never>({
                align: 'inline-end',
                children: [kbd(['⌘K'])],
              }),
            ],
          }),
          InputGroup<never>({
            children: [
              InputGroupInput<never>({
                id: 'input-search-apps-24',
                placeholder: 'Search for Apps...',
              }),
              InputGroupAddon<never>({
                align: 'inline-end',
                children: ['Ask AI'],
              }),
              InputGroupAddon<never>({
                align: 'inline-end',
                children: [kbd(['Tab'])],
              }),
            ],
          }),
          InputGroup<never>({
            children: [
              InputGroupInput<never>({
                id: 'input-search-type-25',
                placeholder: 'Type to search...',
              }),
              InputGroupAddon<never>({
                align: 'inline-start',
                children: [icon('sparkles')],
              }),
              InputGroupAddon<never>({
                align: 'inline-end',
                children: [kbdGroup([kbd(['Ctrl']), kbd(['C'])])],
              }),
            ],
          }),
        ],
      }),
      Field<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'input-username-26',
            children: ['Username'],
          }),
          InputGroup<never>({
            children: [
              InputGroupInput<never>({
                id: 'input-username-26',
                value: 'shadcn',
              }),
              InputGroupAddon<never>({
                align: 'inline-end',
                children: [
                  html<never>().div(
                    [
                      html<never>().Class(
                        'flex size-4 items-center justify-center rounded-full bg-green-500 dark:bg-green-800',
                      ),
                    ],
                    [icon('check', [html<never>().Class('size-3 text-white')])],
                  ),
                ],
              }),
            ],
          }),
          FieldDescription<never>({
            className: 'text-green-700',
            children: ['This username is available.'],
          }),
        ],
      }),
      InputGroup<never>({
        children: [
          InputGroupInput<never>({
            id: 'input-search-docs-27',
            placeholder: 'Search documentation...',
          }),
          InputGroupAddon<never>({
            children: [icon('search')],
          }),
          InputGroupAddon<never>({
            align: 'inline-end',
            children: ['12 results'],
          }),
        ],
      }),
      InputGroup<never>({
        isDisabled: true,
        children: [
          InputGroupInput<never>({
            id: 'input-search-disabled-28',
            placeholder: 'Search documentation...',
            isDisabled: true,
          }),
          InputGroupAddon<never>({
            children: [icon('search')],
          }),
          InputGroupAddon<never>({
            align: 'inline-end',
            children: ['Disabled'],
          }),
        ],
      }),
      FieldGroup<never>({
        className: 'grid grid-cols-2 gap-4',
        children: [
          Field<never>({
            children: [
              FieldLabel<never>({
                htmlFor: 'input-group-11',
                children: ['First Name'],
              }),
              InputGroup<never>({
                children: [
                  InputGroupInput<never>({
                    id: 'input-group-11',
                    placeholder: 'First Name',
                  }),
                  InputGroupAddon<never>({
                    align: 'inline-end',
                    children: [icon('info')],
                  }),
                ],
              }),
            ],
          }),
          Field<never>({
            children: [
              FieldLabel<never>({
                htmlFor: 'input-group-12',
                children: ['Last Name'],
              }),
              InputGroup<never>({
                children: [
                  InputGroupInput<never>({
                    id: 'input-group-12',
                    placeholder: 'Last Name',
                  }),
                  InputGroupAddon<never>({
                    align: 'inline-end',
                    children: [icon('info')],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      fieldWithDataAttribute('disabled', [
        FieldLabel<never>({
          htmlFor: 'input-group-29',
          children: ['Loading ("data-disabled="true")'],
        }),
        InputGroup<never>({
          children: [
            InputGroupInput<never>({
              id: 'input-group-29',
              isDisabled: true,
              value: 'shadcn',
            }),
            InputGroupAddon<never>({
              align: 'inline-end',
              children: [Spinner<never>()],
            }),
          ],
        }),
        FieldDescription<never>({
          children: ['This is a description of the input group.'],
        }),
      ]),
    ],
  })

export const InputGroupSpinner = (): Html =>
  html<never>().div(
    [html<never>().Class('grid w-full max-w-sm gap-4')],
    [
      InputGroup<never>({
        children: [
          InputGroupInput<never>({ placeholder: 'Searching...' }),
          InputGroupAddon<never>({
            align: 'inline-end',
            children: [Spinner<never>()],
          }),
        ],
      }),
      InputGroup<never>({
        children: [
          InputGroupInput<never>({ placeholder: 'Processing...' }),
          InputGroupAddon<never>({
            children: [Spinner<never>()],
          }),
        ],
      }),
      InputGroup<never>({
        children: [
          InputGroupInput<never>({ placeholder: 'Saving changes...' }),
          InputGroupAddon<never>({
            align: 'inline-end',
            children: [
              InputGroupText<never>({ children: ['Saving...'] }),
              Spinner<never>(),
            ],
          }),
        ],
      }),
      InputGroup<never>({
        children: [
          InputGroupInput<never>({ placeholder: 'Refreshing data...' }),
          InputGroupAddon<never>({
            children: [loaderIcon()],
          }),
          InputGroupAddon<never>({
            align: 'inline-end',
            children: [
              InputGroupText<never>({
                className: 'text-muted-foreground',
                children: ['Please wait...'],
              }),
            ],
          }),
        ],
      }),
    ],
  )

export const InputGroupRtl = (): Html =>
  html<never>().div(
    [html<never>().Class('grid w-full max-w-sm gap-6')],
    [
      InputGroup<never>({
        dir: 'rtl',
        className: 'max-w-xs',
        children: [
          InputGroupInput<never>({ placeholder: 'بحث...' }),
          InputGroupAddon<never>({
            dir: 'rtl',
            children: [icon('search')],
          }),
          InputGroupAddon<never>({
            align: 'inline-end',
            dir: 'rtl',
            children: ['١٢ نتيجة'],
          }),
        ],
      }),
      InputGroup<never>({
        dir: 'rtl',
        children: [
          InputGroupInput<never>({ placeholder: 'جاري البحث...' }),
          InputGroupAddon<never>({
            align: 'inline-end',
            dir: 'rtl',
            children: [Spinner<never>()],
          }),
        ],
      }),
      InputGroup<never>({
        dir: 'rtl',
        children: [
          InputGroupInput<never>({ placeholder: 'جاري حفظ التغييرات...' }),
          InputGroupAddon<never>({
            align: 'inline-end',
            dir: 'rtl',
            children: [
              InputGroupText<never>({ children: ['جاري الحفظ...'] }),
              Spinner<never>(),
            ],
          }),
        ],
      }),
      FieldGroup<never>({
        className: 'max-w-sm',
        dir: 'rtl',
        children: [
          Field<never>({
            children: [
              FieldLabel<never>({
                htmlFor: 'rtl-textarea',
                children: ['منطقة النص'],
              }),
              InputGroup<never>({
                dir: 'rtl',
                children: [
                  InputGroupTextarea<never>({
                    id: 'rtl-textarea',
                    placeholder: 'اكتب تعليقًا...',
                  }),
                  InputGroupAddon<never>({
                    align: 'block-end',
                    dir: 'rtl',
                    children: [
                      InputGroupText<never>({ children: ['٠/٢٨٠'] }),
                      InputGroupButton<never>({
                        variant: 'default',
                        size: 'sm',
                        children: ['نشر'],
                      }),
                    ],
                  }),
                ],
              }),
              FieldDescription<never>({
                dir: 'rtl',
                children: ['تذييل موضع أسفل منطقة النص.'],
              }),
            ],
          }),
        ],
      }),
    ],
  )
