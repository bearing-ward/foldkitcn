import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseSelect from '../../base-ui/select'

// MODEL

export type SelectAlign = BaseSelect.SelectAlign
export type SelectHighlightChange = BaseSelect.SelectHighlightChange
export type SelectHighlightChangeReason = BaseSelect.SelectHighlightChangeReason
export type SelectItemDescriptor = BaseSelect.SelectItemDescriptor
export type SelectOpenChange = BaseSelect.SelectOpenChange
export type SelectOpenChangeReason = BaseSelect.SelectOpenChangeReason
export type SelectSide = BaseSelect.SelectSide
export type SelectTransitionStatus = BaseSelect.SelectTransitionStatus
export type SelectValueChange = BaseSelect.SelectValueChange
export type SelectValueChangeReason = BaseSelect.SelectValueChangeReason

export const SelectSize = S.Union([S.Literal('default'), S.Literal('sm')])
export type SelectSize = typeof SelectSize.Type

export const selectSizeValues: ReadonlyArray<SelectSize> = ['default', 'sm']

export const SelectStyleOptions = S.Struct({
  size: S.optional(SelectSize),
  dir: S.optional(S.String),
  className: S.optional(S.String),
  triggerClassName: S.optional(S.String),
  valueClassName: S.optional(S.String),
  iconClassName: S.optional(S.String),
  portalClassName: S.optional(S.String),
  positionerClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
  groupClassName: S.optional(S.String),
  labelClassName: S.optional(S.String),
  itemClassName: S.optional(S.String),
  itemTextClassName: S.optional(S.String),
  itemIndicatorClassName: S.optional(S.String),
  separatorClassName: S.optional(S.String),
  scrollUpClassName: S.optional(S.String),
  scrollDownClassName: S.optional(S.String),
})
export type SelectStyleOptions = typeof SelectStyleOptions.Type

// UPDATE

export const {
  FocusSelect,
  RestoreSelectFocus,
  arrowId,
  commandForOpenChange,
  displayValue,
  enabledItems,
  firstEnabledItem,
  hasSelectedValue,
  highlightChange,
  highlightedItem,
  iconId,
  itemFocusSelector,
  itemId,
  lastEnabledItem,
  listId,
  nextHighlightedItem,
  openChange,
  popupId,
  positionerId,
  scrollDownId,
  scrollUpId,
  selectedItem,
  triggerId,
  typeaheadItem,
  valueChange,
  valueId,
} = BaseSelect

// VIEW

export type SelectPartAttributes<Message> =
  BaseSelect.SelectPartAttributes<Message>
export type SelectItemAttributes<Message> =
  BaseSelect.SelectItemAttributes<Message>
export type SelectAttributes<Message> = BaseSelect.SelectAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseSelect.ViewConfig<Message>,
  'toView'
> &
  SelectStyleOptions &
  Readonly<{
    toView?: (attributes: SelectAttributes<Message>) => Html
  }>

const triggerBaseClassName =
  "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const triggerRtlBaseClassName =
  "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 ps-2.5 pe-2 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const valueBaseClassName = 'flex flex-1 text-left'
const valueRtlBaseClassName = 'flex flex-1 text-start'
const iconBaseClassName = 'pointer-events-none size-4 text-muted-foreground'
const positionerBaseClassName = 'isolate z-50'

const contentBaseClassName =
  'cn-menu-target cn-menu-translucent relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const contentRtlBaseClassName =
  'cn-menu-target cn-menu-translucent relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const groupBaseClassName = 'scroll-my-1 p-1'
const labelBaseClassName = 'px-1.5 py-1 text-xs text-muted-foreground'

const itemBaseClassName =
  "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"

const itemRtlBaseClassName =
  "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 ps-1.5 pe-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"

const itemTextBaseClassName = 'flex flex-1 shrink-0 gap-2 whitespace-nowrap'
const itemIndicatorBaseClassName =
  'pointer-events-none absolute right-2 flex size-4 items-center justify-center'
const itemIndicatorRtlBaseClassName =
  'pointer-events-none absolute end-2 flex size-4 items-center justify-center'
const separatorBaseClassName = 'pointer-events-none -mx-1 my-1 h-px bg-border'
const scrollUpBaseClassName =
  "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4"
const scrollDownBaseClassName =
  "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4"

export const selectClassName = ({
  className,
}: Pick<SelectStyleOptions, 'className'> = {}): string => cn(className)

export const selectTriggerClassName = ({
  className,
  dir,
}: Pick<SelectStyleOptions, 'dir'> &
  Readonly<{ className?: string | undefined }> = {}): string =>
  cn(dir === 'rtl' ? triggerRtlBaseClassName : triggerBaseClassName, className)

export const selectValueClassName = ({
  className,
  dir,
}: Pick<SelectStyleOptions, 'dir'> &
  Readonly<{ className?: string | undefined }> = {}): string =>
  cn(dir === 'rtl' ? valueRtlBaseClassName : valueBaseClassName, className)

export const selectIconClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(iconBaseClassName, className)

export const selectPositionerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(positionerBaseClassName, className)

export const selectContentClassName = ({
  className,
  dir,
}: Pick<SelectStyleOptions, 'dir'> &
  Readonly<{ className?: string | undefined }> = {}): string =>
  cn(dir === 'rtl' ? contentRtlBaseClassName : contentBaseClassName, className)

export const selectGroupClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(groupBaseClassName, className)

export const selectLabelClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(labelBaseClassName, className)

export const selectItemClassName = ({
  className,
  dir,
}: Pick<SelectStyleOptions, 'dir'> &
  Readonly<{ className?: string | undefined }> = {}): string =>
  cn(dir === 'rtl' ? itemRtlBaseClassName : itemBaseClassName, className)

export const selectItemTextClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(itemTextBaseClassName, className)

export const selectItemIndicatorClassName = ({
  className,
  dir,
}: Pick<SelectStyleOptions, 'dir'> &
  Readonly<{ className?: string | undefined }> = {}): string =>
  cn(
    dir === 'rtl' ? itemIndicatorRtlBaseClassName : itemIndicatorBaseClassName,
    className,
  )

export const selectSeparatorClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(separatorBaseClassName, className)

export const selectScrollUpClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(scrollUpBaseClassName, className)

export const selectScrollDownClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(scrollDownBaseClassName, className)

const optionalClassAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string,
): ReadonlyArray<Attribute<Message>> =>
  className === '' ? [] : [h.Class(className)]

const slotAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: string,
  className: string,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', slot),
  ...optionalClassAttribute(h, className),
]

const shadcnItemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  itemAttributes: BaseSelect.SelectItemAttributes<Message>,
): BaseSelect.SelectItemAttributes<Message> => ({
  ...itemAttributes,
  root: [
    ...itemAttributes.root,
    ...slotAttributes(
      h,
      'select-item',
      selectItemClassName({
        className: config.itemClassName,
        dir: config.dir,
      }),
    ),
  ],
  text: [
    ...itemAttributes.text,
    ...slotAttributes(
      h,
      'select-item-text',
      selectItemTextClassName({ className: config.itemTextClassName }),
    ),
  ],
  indicator: [
    ...itemAttributes.indicator,
    ...slotAttributes(
      h,
      'select-item-indicator',
      selectItemIndicatorClassName({
        className: config.itemIndicatorClassName,
        dir: config.dir,
      }),
    ),
  ],
})

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: BaseSelect.SelectAttributes<Message>,
): SelectAttributes<Message> => ({
  ...attributes,
  root: [
    ...attributes.root,
    ...slotAttributes(h, 'select', selectClassName(config)),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  trigger: [
    ...attributes.trigger,
    h.DataAttribute('size', config.size ?? 'default'),
    ...slotAttributes(
      h,
      'select-trigger',
      selectTriggerClassName({
        className: config.triggerClassName,
        dir: config.dir,
      }),
    ),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  value: [
    ...attributes.value,
    ...slotAttributes(
      h,
      'select-value',
      selectValueClassName({
        className: config.valueClassName,
        dir: config.dir,
      }),
    ),
  ],
  icon: [
    ...attributes.icon,
    ...slotAttributes(
      h,
      'select-icon',
      selectIconClassName({ className: config.iconClassName }),
    ),
  ],
  portal: [
    ...attributes.portal,
    ...optionalClassAttribute(h, cn(config.portalClassName)),
  ],
  positioner: {
    ...attributes.positioner,
    root:
      attributes.positioner.root.length > 0
        ? [
            ...attributes.positioner.root,
            ...optionalClassAttribute(
              h,
              selectPositionerClassName({
                className: config.positionerClassName,
              }),
            ),
          ]
        : attributes.positioner.root,
  },
  popup: {
    ...attributes.popup,
    root:
      attributes.popup.root.length > 0
        ? [
            ...attributes.popup.root,
            ...slotAttributes(
              h,
              'select-content',
              selectContentClassName({
                className: config.contentClassName,
                dir: config.dir,
              }),
            ),
            ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
          ]
        : attributes.popup.root,
  },
  group: [
    ...attributes.group,
    ...slotAttributes(
      h,
      'select-group',
      selectGroupClassName({ className: config.groupClassName }),
    ),
  ],
  groupLabel: [
    ...attributes.groupLabel,
    ...slotAttributes(
      h,
      'select-label',
      selectLabelClassName({ className: config.labelClassName }),
    ),
  ],
  separator: [
    ...attributes.separator,
    ...slotAttributes(
      h,
      'select-separator',
      selectSeparatorClassName({ className: config.separatorClassName }),
    ),
  ],
  scrollUp: {
    ...attributes.scrollUp,
    root:
      attributes.scrollUp.root.length > 0
        ? [
            ...attributes.scrollUp.root,
            ...slotAttributes(
              h,
              'select-scroll-up-button',
              selectScrollUpClassName({ className: config.scrollUpClassName }),
            ),
          ]
        : attributes.scrollUp.root,
  },
  scrollDown: {
    ...attributes.scrollDown,
    root:
      attributes.scrollDown.root.length > 0
        ? [
            ...attributes.scrollDown.root,
            ...slotAttributes(
              h,
              'select-scroll-down-button',
              selectScrollDownClassName({
                className: config.scrollDownClassName,
              }),
            ),
          ]
        : attributes.scrollDown.root,
  },
  items: attributes.items.map(itemAttributes =>
    shadcnItemAttributes(h, config, itemAttributes),
  ),
})

export const chevronDownIcon = <Message>(
  attributes: ReadonlyArray<Attribute<Message>>,
): Html => {
  const h = html<Message>()

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
      ...attributes,
    ],
    [h.path([h.D('m6 9 6 6 6-6')], [])],
  )
}

export const chevronUpIcon = <Message>(
  attributes: ReadonlyArray<Attribute<Message>>,
): Html => {
  const h = html<Message>()

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
      ...attributes,
    ],
    [h.path([h.D('m18 15-6-6-6 6')], [])],
  )
}

export const checkIcon = <Message>(
  attributes: ReadonlyArray<Attribute<Message>>,
): Html => {
  const h = html<Message>()

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
      ...attributes,
    ],
    [h.path([h.D('m20 6-11 11-5-5')], [])],
  )
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BaseSelect.view<Message>({
    ...baseConfig,
    sideOffset: config.sideOffset ?? 4,
    toView: attributes => {
      const selectAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(selectAttributes)
      }

      return h.div(
        [...selectAttributes.root],
        [
          h.button(
            [...selectAttributes.trigger],
            [
              h.span(
                [...selectAttributes.value],
                [BaseSelect.displayValue(config)],
              ),
              chevronDownIcon(selectAttributes.icon),
            ],
          ),
          h.div(
            [...selectAttributes.portal],
            selectAttributes.isMounted
              ? [
                  h.div([...selectAttributes.backdrop.root], []),
                  h.div(
                    [...selectAttributes.positioner.root],
                    [
                      h.div(
                        [...selectAttributes.popup.root],
                        [
                          h.div(
                            [...selectAttributes.scrollUp.root],
                            [chevronUpIcon([])],
                          ),
                          h.div(
                            [...selectAttributes.list.root],
                            [
                              h.div(
                                [...selectAttributes.group],
                                selectAttributes.items.map(itemAttributes =>
                                  h.div(
                                    [...itemAttributes.root],
                                    [
                                      h.span(
                                        [...itemAttributes.text],
                                        [itemAttributes.item.label],
                                      ),
                                      h.span(
                                        [...itemAttributes.indicator],
                                        [checkIcon([])],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                          h.div(
                            [...selectAttributes.scrollDown.root],
                            [chevronDownIcon([])],
                          ),
                        ],
                      ),
                    ],
                  ),
                ]
              : [],
          ),
          h.input([...selectAttributes.hiddenInput]),
        ],
      )
    },
  })
}
