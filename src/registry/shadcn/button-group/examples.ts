import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Button from '../button'
import * as DropdownMenu from '../dropdown-menu'
import type { DropdownMenuExampleController } from '../dropdown-menu/examples'
import { Field, FieldDescription, FieldLabel } from '../field'
import * as Input from '../input'
import * as Popover from '../popover'
import type { PopoverExampleController } from '../popover/examples'
import { displayValue as displaySelectValue, view as Select } from '../select'
import type { SelectOpenChange, SelectValueChange } from '../select'
import * as Textarea from '../textarea'
import { ButtonGroup, ButtonGroupSeparator } from './index'

type IconName =
  | 'arrowLeft'
  | 'arrowRight'
  | 'bot'
  | 'chevronDown'
  | 'minus'
  | 'moreHorizontal'
  | 'plus'
  | 'search'

type ButtonChild = Html | string

type ButtonGroupDropdownController<Message> =
  DropdownMenuExampleController<Message>

type ButtonGroupPopoverController<Message> = PopoverExampleController<Message>

type ButtonGroupSelectController<Message> = Readonly<{
  isOpenFor: (selectId: string, defaultOpen: boolean) => boolean
  valueFor: (selectId: string, defaultValue?: string) => string | undefined
  onOpenChange: (selectId: string, change: SelectOpenChange) => Message
  onValueChange: (selectId: string, change: SelectValueChange) => Message
}>

const iconPaths: Readonly<Record<IconName, ReadonlyArray<string>>> = {
  arrowLeft: ['m12 19-7-7 7-7', 'M19 12H5'],
  arrowRight: ['M5 12h14', 'm12 5 7 7-7 7'],
  bot: ['M12 8V4H8', 'M2 14h2', 'M20 14h2', 'M15 13v2', 'M9 13v2', 'M12 18v4'],
  chevronDown: ['m6 9 6 6 6-6'],
  minus: ['M5 12h14'],
  moreHorizontal: ['M12 12h.01', 'M19 12h.01', 'M5 12h.01'],
  plus: ['M5 12h14', 'M12 5v14'],
  search: ['m21 21-4.34-4.34'],
}

const iconClassNames: Readonly<Record<IconName, string>> = {
  arrowLeft: 'lucide lucide-arrow-left-icon',
  arrowRight: 'lucide lucide-arrow-right-icon',
  bot: 'lucide lucide-bot-icon',
  chevronDown: 'lucide lucide-chevron-down-icon',
  minus: 'lucide lucide-minus-icon',
  moreHorizontal: 'lucide lucide-more-horizontal-icon',
  plus: 'lucide lucide-plus-icon',
  search: 'lucide lucide-search-icon',
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

const button = <Message = never>(
  children: ReadonlyArray<ButtonChild>,
  options: Button.ButtonStyleOptions &
    Readonly<{
      ariaLabel?: string
      attributes?: ReadonlyArray<Attribute<Message>>
      preferTriggerSlot?: boolean
    }> = {},
): Html => {
  const h = html<Message>()
  const extraAttributes = options.attributes ?? []

  return Button.view<Message>({
    variant: options.variant,
    size: options.size,
    className: options.className,
    toView: attributes => {
      const orderedAttributes = options.preferTriggerSlot
        ? [...attributes.button, ...extraAttributes]
        : [...extraAttributes, ...attributes.button]

      return h.button(
        [
          ...orderedAttributes,
          ...(options.ariaLabel === undefined
            ? []
            : [h.AriaLabel(options.ariaLabel)]),
        ],
        children,
      )
    },
  })
}

const input = (
  placeholder: string,
  attributes: ReadonlyArray<Attribute<never>> = [],
): Html => {
  const h = html<never>()

  return Input.view<never>({
    placeholder,
    toView: inputAttributes =>
      h.input([...inputAttributes.input, ...attributes]),
  })
}

const dropdownTriggerButton = (
  id: string,
  children: ReadonlyArray<ButtonChild>,
  options: Button.ButtonStyleOptions & Readonly<{ ariaLabel?: string }> = {},
): Html =>
  DropdownMenu.view<never>({
    id,
    items: [],
    open: false,
    toView: attributes =>
      button(children, {
        ...options,
        attributes: attributes.trigger,
      }),
  })

const popoverTriggerButton = (
  children: ReadonlyArray<ButtonChild>,
  options: Button.ButtonStyleOptions & Readonly<{ ariaLabel?: string }> = {},
): Html =>
  Popover.view<never>({
    id: 'button-group-popover',
    open: false,
    titleId: 'button-group-popover-title',
    descriptionId: 'button-group-popover-description',
    toView: attributes =>
      button(children, {
        ...options,
        attributes: attributes.trigger,
        preferTriggerSlot: true,
      }),
  })

const currencyItems: ReadonlyArray<Readonly<{ label: string; value: string }>> =
  [
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'GBP', value: 'GBP' },
  ]

const currencySelect = <Message = never>(
  attributes: ReadonlyArray<Attribute<Message>> = [],
  label = '$',
): Html => {
  const h = html<Message>()
  const hasControllerAttributes = attributes.length > 0

  return h.button(
    [
      ...(hasControllerAttributes
        ? []
        : [h.AriaExpanded(false), h.AriaHasPopup('listbox')]),
      h.Class(
        "flex h-8 w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm whitespace-nowrap shadow-none transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 font-mono",
      ),
      h.DataAttribute('slot', 'select-trigger'),
      h.Type('button'),
      ...attributes,
    ],
    [
      h.span([h.DataAttribute('slot', 'select-value')], [label]),
      icon('chevronDown'),
    ],
  )
}

export const ButtonGroupDemo = (): Html =>
  ButtonGroup<never>({
    children: [
      ButtonGroup<never>({
        className: 'hidden sm:flex',
        children: [
          button([icon('arrowLeft')], {
            variant: 'outline',
            size: 'icon',
            ariaLabel: 'Go Back',
          }),
        ],
      }),
      ButtonGroup<never>({
        children: [
          button(['Archive'], { variant: 'outline' }),
          button(['Report'], { variant: 'outline' }),
        ],
      }),
      ButtonGroup<never>({
        children: [
          button(['Snooze'], { variant: 'outline' }),
          dropdownTriggerButton(
            'button-group-demo-more-options',
            [icon('moreHorizontal')],
            {
              variant: 'outline',
              size: 'icon',
              ariaLabel: 'More Options',
            },
          ),
        ],
      }),
    ],
  })

const buttonGroupDropdownShell = <Message>(
  controller: ButtonGroupDropdownController<Message>,
): Html => {
  const h = html<Message>()
  const { isOpenFor, onItemPress, onOpenChange, openSubmenuValuesFor } =
    controller
  const open = isOpenFor('button-group-dropdown', false)

  return DropdownMenu.view<Message>({
    id: 'button-group-dropdown',
    items: [
      { value: 'mute', label: 'Mute' },
      { value: 'snooze', label: 'Snooze' },
      { value: 'archive', label: 'Archive' },
    ],
    open,
    openSubmenuValues: openSubmenuValuesFor('button-group-dropdown', []),
    onOpenChange: change => onOpenChange('button-group-dropdown', change),
    ...(onItemPress === undefined
      ? {}
      : {
          onItemPress: press => onItemPress('button-group-dropdown', press),
        }),
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          ButtonGroup<Message>({
            children: [
              button(['Follow'], { variant: 'outline' }),
              button([icon('chevronDown')], {
                variant: 'outline',
                attributes: attributes.trigger,
              }),
            ],
          }),
          h.div(
            [...attributes.portal],
            attributes.popup.isMounted
              ? [
                  h.div([...attributes.popup.backdrop.root], []),
                  h.div(
                    [...attributes.popup.positioner.root],
                    [
                      h.div(
                        [...attributes.popup.popup.root],
                        [
                          h.div(
                            [...attributes.popup.group],
                            attributes.popup.items.map(itemAttributes =>
                              h.div(
                                [...itemAttributes.root],
                                [
                                  h.span(
                                    [...itemAttributes.label],
                                    [itemAttributes.item.label],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ]
              : [],
          ),
        ],
      ),
  })
}

export const ButtonGroupDropdown = <Message = never>(
  controller?: ButtonGroupDropdownController<Message>,
): Html => {
  if (controller !== undefined) {
    return buttonGroupDropdownShell(controller)
  }

  return ButtonGroup<never>({
    children: [
      button(['Follow'], { variant: 'outline' }),
      dropdownTriggerButton('button-group-dropdown', [icon('chevronDown')], {
        variant: 'outline',
      }),
    ],
  })
}

export const ButtonGroupInput = (): Html =>
  ButtonGroup<never>({
    children: [
      input('Search...'),
      button([icon('search')], {
        variant: 'outline',
        ariaLabel: 'Search',
      }),
    ],
  })

export const ButtonGroupOrientation = (): Html =>
  ButtonGroup<never>({
    orientation: 'vertical',
    ariaLabel: 'Media controls',
    className: 'h-fit',
    children: [
      button([icon('plus')], { variant: 'outline', size: 'icon' }),
      button([icon('minus')], { variant: 'outline', size: 'icon' }),
    ],
  })

const buttonGroupPopoverShell = <Message>(
  controller: ButtonGroupPopoverController<Message>,
): Html => {
  const h = html<Message>()
  const { onOpenChange, openFor } = controller
  const open = openFor?.('button-group-popover', true) ?? true

  return Popover.view<Message>({
    id: 'button-group-popover',
    open,
    titleId: 'button-group-popover-title',
    descriptionId: 'button-group-popover-description',
    ...(onOpenChange === undefined
      ? {}
      : {
          onOpenChange: change => onOpenChange('button-group-popover', change),
        }),
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          ButtonGroup<Message>({
            children: [
              button([icon('bot'), 'Copilot'], { variant: 'outline' }),
              button([icon('chevronDown')], {
                variant: 'outline',
                size: 'icon',
                ariaLabel: 'Open Popover',
                attributes: attributes.trigger,
              }),
            ],
          }),
          h.div(
            [...attributes.portal],
            [
              h.div([...attributes.backdrop.root], []),
              h.div(
                [...attributes.positioner.root],
                [
                  h.div(
                    [...attributes.popup.root],
                    [
                      h.div(
                        [...attributes.header],
                        [
                          h.h4([...attributes.title], ['Button group popover']),
                          h.p(
                            [...attributes.description],
                            [
                              'Floating content remains anchored to the trigger.',
                            ],
                          ),
                        ],
                      ),
                      h.p(
                        [],
                        ['Pick a follow-up action or close the surface.'],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
  })
}

export const ButtonGroupPopover = <Message = never>(
  controller?: ButtonGroupPopoverController<Message>,
): Html => {
  if (controller !== undefined) {
    return buttonGroupPopoverShell(controller)
  }

  return ButtonGroup<never>({
    children: [
      button([icon('bot'), 'Copilot'], { variant: 'outline' }),
      popoverTriggerButton([icon('chevronDown')], {
        variant: 'outline',
        size: 'icon',
        ariaLabel: 'Open Popover',
      }),
    ],
  })
}

const rtlLabels = {
  archive: 'أرشفة',
  report: 'تقرير',
  snooze: 'تأجيل',
}

export const ButtonGroupRtl = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Dir('rtl')],
    [
      ButtonGroup<never>({
        dir: 'rtl',
        children: [
          ButtonGroup<never>({
            dir: 'rtl',
            className: 'hidden sm:flex',
            children: [
              button([icon('arrowLeft', [h.Class('rtl:rotate-180')])], {
                variant: 'outline',
                size: 'icon',
                ariaLabel: 'Go Back',
              }),
            ],
          }),
          ButtonGroup<never>({
            dir: 'rtl',
            children: [
              button([rtlLabels.archive], { variant: 'outline' }),
              button([rtlLabels.report], { variant: 'outline' }),
            ],
          }),
          ButtonGroup<never>({
            dir: 'rtl',
            children: [
              button([rtlLabels.snooze], { variant: 'outline' }),
              dropdownTriggerButton(
                'button-group-rtl-more-options',
                [icon('moreHorizontal')],
                {
                  variant: 'outline',
                  size: 'icon',
                  ariaLabel: 'More Options',
                },
              ),
            ],
          }),
        ],
      }),
    ],
  )
}

const buttonGroupSelectShell = <Message>(
  controller: ButtonGroupSelectController<Message>,
): Html => {
  const h = html<Message>()
  const { isOpenFor, onOpenChange, onValueChange, valueFor } = controller
  const open = isOpenFor('button-group-select', false)
  const value = valueFor('button-group-select')
  const label = displaySelectValue({
    items: currencyItems,
    placeholder: '$',
    value,
  })

  return Select<Message>({
    id: 'button-group-select',
    items: currencyItems,
    open,
    value,
    placeholder: '$',
    onOpenChange: change => onOpenChange('button-group-select', change),
    onValueChange: change => onValueChange('button-group-select', change),
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          ButtonGroup<Message>({
            children: [
              currencySelect(attributes.trigger, label),
              input('10.00', [h.Attribute('pattern', '[0-9]*')]),
            ],
          }),
          ButtonGroup<Message>({
            children: [
              button([icon('arrowRight')], {
                variant: 'outline',
                size: 'icon',
                ariaLabel: 'Send',
              }),
            ],
          }),
          h.div(
            [...attributes.portal],
            attributes.isMounted
              ? [
                  h.div([...attributes.backdrop.root], []),
                  h.div(
                    [...attributes.positioner.root],
                    [
                      h.div(
                        [...attributes.popup.root],
                        [
                          h.div([...attributes.arrow.root], []),
                          h.div([...attributes.scrollUp.root], ['Up']),
                          h.div(
                            [...attributes.list.root],
                            [
                              h.div(
                                [...attributes.group],
                                [
                                  h.div(
                                    [...attributes.groupLabel],
                                    ['Currency'],
                                  ),
                                  ...attributes.items.map(itemAttributes =>
                                    h.div(
                                      [...itemAttributes.root],
                                      [
                                        h.span(
                                          [...itemAttributes.text],
                                          [itemAttributes.item.label],
                                        ),
                                        h.span(
                                          [...itemAttributes.indicator],
                                          [],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              h.div([...attributes.separator], []),
                            ],
                          ),
                          h.div([...attributes.scrollDown.root], ['Down']),
                        ],
                      ),
                    ],
                  ),
                ]
              : [],
          ),
          h.input([...attributes.hiddenInput]),
        ],
      ),
  })
}

export const ButtonGroupSelect = <Message = never>(
  controller?: ButtonGroupSelectController<Message>,
): Html => {
  if (controller !== undefined) {
    return buttonGroupSelectShell(controller)
  }

  const h = html<never>()

  return ButtonGroup<never>({
    children: [
      ButtonGroup<never>({
        children: [
          currencySelect(),
          input('10.00', [h.Attribute('pattern', '[0-9]*')]),
        ],
      }),
      ButtonGroup<never>({
        children: [
          button([icon('arrowRight')], {
            variant: 'outline',
            size: 'icon',
            ariaLabel: 'Send',
          }),
        ],
      }),
    ],
  })
}

export const ButtonGroupSeparatorDemo = (): Html =>
  ButtonGroup<never>({
    children: [
      button(['Copy'], { variant: 'secondary', size: 'sm' }),
      ButtonGroupSeparator<never>(),
      button(['Paste'], { variant: 'secondary', size: 'sm' }),
    ],
  })

export const ButtonGroupSize = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-col items-start gap-8')],
    [
      ButtonGroup<never>({
        children: [
          button(['Small'], { variant: 'outline', size: 'sm' }),
          button(['Button'], { variant: 'outline', size: 'sm' }),
          button(['Group'], { variant: 'outline', size: 'sm' }),
          button([icon('plus')], { variant: 'outline', size: 'icon-sm' }),
        ],
      }),
      ButtonGroup<never>({
        children: [
          button(['Default'], { variant: 'outline' }),
          button(['Button'], { variant: 'outline' }),
          button(['Group'], { variant: 'outline' }),
          button([icon('plus')], { variant: 'outline', size: 'icon' }),
        ],
      }),
      ButtonGroup<never>({
        children: [
          button(['Large'], { variant: 'outline', size: 'lg' }),
          button(['Button'], { variant: 'outline', size: 'lg' }),
          button(['Group'], { variant: 'outline', size: 'lg' }),
          button([icon('plus')], { variant: 'outline', size: 'icon-lg' }),
        ],
      }),
    ],
  )
}

export const ButtonGroupSplit = (): Html =>
  ButtonGroup<never>({
    children: [
      button(['Button'], { variant: 'secondary' }),
      ButtonGroupSeparator<never>(),
      button([icon('plus')], { variant: 'secondary', size: 'icon' }),
    ],
  })

export const ButtonGroupTextExample = (): Html =>
  ButtonGroup<never>({
    children: [
      button(['Preview'], { variant: 'outline' }),
      Field<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'button-group-task',
            className: 'sr-only',
            children: ['Task Description'],
          }),
          Textarea.view<never>({
            id: 'button-group-task',
            placeholder: 'I need to...',
            className: 'resize-none',
            toView: attributes =>
              html<never>().textarea([...attributes.textarea], []),
          }),
          FieldDescription<never>({
            children: ['Copilot will open a pull request for review.'],
          }),
        ],
      }),
    ],
  })
