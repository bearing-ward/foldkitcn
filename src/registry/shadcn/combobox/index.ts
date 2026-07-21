import { Schema as S } from 'effect'
import * as Array from 'effect/Array'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseCombobox from '../../base-ui/combobox'
import * as Button from '../button'
import * as Input from '../input'

// MODEL

export type ComboboxAlign = BaseCombobox.ComboboxAlign
export type ComboboxChipAttributes<Message> =
  BaseCombobox.ComboboxChipAttributes<Message>
export type ComboboxChipHighlightChange =
  BaseCombobox.ComboboxChipHighlightChange
export type ComboboxChipHighlightChangeReason =
  BaseCombobox.ComboboxChipHighlightChangeReason
export type ComboboxHighlightChange = BaseCombobox.ComboboxHighlightChange
export type ComboboxHighlightChangeReason =
  BaseCombobox.ComboboxHighlightChangeReason
export type ComboboxInputValueChange = BaseCombobox.ComboboxInputValueChange
export type ComboboxInputValueChangeReason =
  BaseCombobox.ComboboxInputValueChangeReason
export type ComboboxItemAttributes<Message> =
  BaseCombobox.ComboboxItemAttributes<Message>
export type ComboboxItemDescriptor = BaseCombobox.ComboboxItemDescriptor
export type ComboboxOpenChange = BaseCombobox.ComboboxOpenChange
export type ComboboxOpenChangeReason = BaseCombobox.ComboboxOpenChangeReason
export type ComboboxPartAttributes<Message> =
  BaseCombobox.ComboboxPartAttributes<Message>
export type ComboboxSelectionMode = BaseCombobox.ComboboxSelectionMode
export type ComboboxSide = BaseCombobox.ComboboxSide
export type ComboboxTransitionStatus = BaseCombobox.ComboboxTransitionStatus
export type ComboboxValueChange = BaseCombobox.ComboboxValueChange
export type ComboboxValueChangeReason = BaseCombobox.ComboboxValueChangeReason

export const ComboboxStyleOptions = S.Struct({
  dir: S.optional(S.String),
  className: S.optional(S.String),
  inputGroupClassName: S.optional(S.String),
  inputAddonClassName: S.optional(S.String),
  inputClassName: S.optional(S.String),
  triggerClassName: S.optional(S.String),
  valueClassName: S.optional(S.String),
  clearClassName: S.optional(S.String),
  portalClassName: S.optional(S.String),
  positionerClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
  listClassName: S.optional(S.String),
  itemClassName: S.optional(S.String),
  itemTextClassName: S.optional(S.String),
  itemIndicatorClassName: S.optional(S.String),
  groupClassName: S.optional(S.String),
  labelClassName: S.optional(S.String),
  collectionClassName: S.optional(S.String),
  emptyClassName: S.optional(S.String),
  separatorClassName: S.optional(S.String),
  chipsClassName: S.optional(S.String),
  chipClassName: S.optional(S.String),
  chipRemoveClassName: S.optional(S.String),
  chipInputClassName: S.optional(S.String),
})
export type ComboboxStyleOptions = typeof ComboboxStyleOptions.Type

// UPDATE

export const {
  FocusCombobox,
  RestoreComboboxFocus,
  arrowId,
  chipFocusSelector,
  chipHighlightChange,
  chipId,
  chipRemoveId,
  chipsId,
  clearChipHighlightChange,
  clearId,
  clearHighlightChange,
  clearValueChange,
  collectionId,
  commandForOpenChange,
  displayValue,
  emptyId,
  enabledItems,
  filteredItems,
  firstFilteredItem,
  hasSelectedValue,
  highlightChange,
  highlightedItem,
  inputDisplayValue,
  inputGroupId,
  inputId,
  inputValueChange,
  isMultiple,
  itemFocusSelector,
  itemId,
  listId,
  nextHighlightedChip,
  nextHighlightedItem,
  openChange,
  popupId,
  positionerId,
  removeValueChange,
  resolvedSelectionMode,
  rootId,
  selectedItem,
  selectedItems,
  selectedValues,
  triggerId,
  valueChange,
  valueId,
  visibleSelectedItems,
} = BaseCombobox

// VIEW

export type ComboboxAttributes<Message> =
  BaseCombobox.ComboboxAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseCombobox.ViewConfig<Message>,
  'toView'
> &
  ComboboxStyleOptions &
  Readonly<{
    showTrigger?: boolean
    showClear?: boolean
    toView?: (attributes: ComboboxAttributes<Message>) => Html
  }>

const inputGroupBaseClassName =
  'group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5'

const inputAddonBaseClassName =
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4 order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]"

const inputAddonRtlBaseClassName =
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4 order-last pe-2 has-[>button]:me-[-0.3rem] has-[>kbd]:me-[-0.15rem]"

const inputControlBaseClassName =
  'flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent'

const inputGroupButtonIconXsClassName =
  'flex items-center gap-2 text-sm shadow-none size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0'

const triggerBaseClassName =
  "group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent [&_svg:not([class*='size-'])]:size-4"

const clearBaseClassName = ''
const positionerBaseClassName = 'isolate z-50'

const contentBaseClassName =
  'cn-menu-target cn-menu-translucent group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const contentRtlBaseClassName =
  'cn-menu-target cn-menu-translucent group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const listBaseClassName =
  'no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0'

const itemBaseClassName =
  "relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const itemRtlBaseClassName =
  "relative flex w-full cursor-default items-center gap-2 rounded-md py-1 ps-1.5 pe-8 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const itemTextBaseClassName = 'flex flex-1 min-w-0'
const itemIndicatorBaseClassName =
  'pointer-events-none absolute right-2 flex size-4 items-center justify-center'
const itemIndicatorRtlBaseClassName =
  'pointer-events-none absolute end-2 flex size-4 items-center justify-center'
const labelBaseClassName = 'px-2 py-1.5 text-xs text-muted-foreground'
const emptyBaseClassName =
  'hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex'
const separatorBaseClassName = '-mx-1 my-1 h-px bg-border'
const chipsBaseClassName =
  'flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40'
const chipBaseClassName =
  'flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0'
const chipRtlBaseClassName =
  'flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pe-0'
const chipRemoveBaseClassName = '-ml-1 opacity-50 hover:opacity-100'
const chipRemoveRtlBaseClassName = '-ms-1 opacity-50 hover:opacity-100'
const chipInputBaseClassName = 'min-w-16 flex-1 outline-none'

export const comboboxClassName = ({
  className,
}: Pick<ComboboxStyleOptions, 'className'> = {}): string => cn(className)

export const comboboxInputGroupClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(inputGroupBaseClassName, 'w-auto', className)

export const comboboxInputAddonClassName = ({
  className,
  dir,
}: Pick<ComboboxStyleOptions, 'dir'> &
  Readonly<{ className?: string | undefined }> = {}): string =>
  cn(
    dir === 'rtl' ? inputAddonRtlBaseClassName : inputAddonBaseClassName,
    className,
  )

export const comboboxInputClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(Input.inputClassName(), inputControlBaseClassName, className)

export const comboboxTriggerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(
    Button.buttonVariants({
      variant: 'ghost',
      size: 'icon-xs',
      className: cn(
        inputGroupButtonIconXsClassName,
        triggerBaseClassName,
        className,
      ),
    }),
  )

export const comboboxValueClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string => cn(className)

export const comboboxClearClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(
    Button.buttonVariants({
      variant: 'ghost',
      size: 'icon-xs',
      className: cn(
        inputGroupButtonIconXsClassName,
        clearBaseClassName,
        className,
      ),
    }),
  )

export const comboboxPositionerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(positionerBaseClassName, className)

export const comboboxContentClassName = ({
  className,
  dir,
}: Pick<ComboboxStyleOptions, 'dir'> &
  Readonly<{ className?: string | undefined }> = {}): string =>
  cn(dir === 'rtl' ? contentRtlBaseClassName : contentBaseClassName, className)

export const comboboxListClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(listBaseClassName, className)

export const comboboxItemClassName = ({
  className,
  dir,
}: Pick<ComboboxStyleOptions, 'dir'> &
  Readonly<{ className?: string | undefined }> = {}): string =>
  cn(dir === 'rtl' ? itemRtlBaseClassName : itemBaseClassName, className)

export const comboboxItemTextClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(itemTextBaseClassName, className)

export const comboboxItemIndicatorClassName = ({
  className,
  dir,
}: Pick<ComboboxStyleOptions, 'dir'> &
  Readonly<{ className?: string | undefined }> = {}): string =>
  cn(
    dir === 'rtl' ? itemIndicatorRtlBaseClassName : itemIndicatorBaseClassName,
    className,
  )

export const comboboxGroupClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string => cn(className)

export const comboboxLabelClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(labelBaseClassName, className)

export const comboboxCollectionClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string => cn(className)

export const comboboxEmptyClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(emptyBaseClassName, className)

export const comboboxSeparatorClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(separatorBaseClassName, className)

export const comboboxChipsClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(chipsBaseClassName, className)

export const comboboxChipClassName = ({
  className,
  dir,
}: Pick<ComboboxStyleOptions, 'dir'> &
  Readonly<{ className?: string | undefined }> = {}): string =>
  cn(dir === 'rtl' ? chipRtlBaseClassName : chipBaseClassName, className)

export const comboboxChipRemoveClassName = ({
  className,
  dir,
}: Pick<ComboboxStyleOptions, 'dir'> &
  Readonly<{ className?: string | undefined }> = {}): string =>
  cn(
    Button.buttonVariants({
      variant: 'ghost',
      size: 'icon-xs',
      className: cn(
        inputGroupButtonIconXsClassName,
        dir === 'rtl' ? chipRemoveRtlBaseClassName : chipRemoveBaseClassName,
        className,
      ),
    }),
  )

export const comboboxChipInputClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(chipInputBaseClassName, className)

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
  itemAttributes: BaseCombobox.ComboboxItemAttributes<Message>,
): BaseCombobox.ComboboxItemAttributes<Message> => ({
  ...itemAttributes,
  root: [
    ...itemAttributes.root,
    ...slotAttributes(
      h,
      'combobox-item',
      comboboxItemClassName({
        className: config.itemClassName,
        dir: config.dir,
      }),
    ),
  ],
  text: [
    ...itemAttributes.text,
    ...slotAttributes(
      h,
      'combobox-item-text',
      comboboxItemTextClassName({ className: config.itemTextClassName }),
    ),
  ],
  indicator: Array.isReadonlyArrayNonEmpty(itemAttributes.indicator)
    ? [
        ...itemAttributes.indicator,
        ...optionalClassAttribute(
          h,
          comboboxItemIndicatorClassName({
            className: config.itemIndicatorClassName,
            dir: config.dir,
          }),
        ),
      ]
    : [],
})

const shadcnChipAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  chipAttributes: BaseCombobox.ComboboxChipAttributes<Message>,
): BaseCombobox.ComboboxChipAttributes<Message> => ({
  ...chipAttributes,
  root: [
    ...chipAttributes.root,
    ...slotAttributes(
      h,
      'combobox-chip',
      comboboxChipClassName({
        className: config.chipClassName,
        dir: config.dir,
      }),
    ),
  ],
  remove: [
    ...chipAttributes.remove,
    ...slotAttributes(
      h,
      'combobox-chip-remove',
      comboboxChipRemoveClassName({
        className: config.chipRemoveClassName,
        dir: config.dir,
      }),
    ),
  ],
})

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: BaseCombobox.ComboboxAttributes<Message>,
): ComboboxAttributes<Message> => ({
  ...attributes,
  root: [
    ...attributes.root,
    ...slotAttributes(h, 'combobox', comboboxClassName(config)),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  inputGroup: [
    ...attributes.inputGroup,
    ...slotAttributes(
      h,
      'input-group',
      comboboxInputGroupClassName({ className: config.inputGroupClassName }),
    ),
  ],
  input: [
    ...attributes.input,
    ...slotAttributes(
      h,
      'input-group-control',
      comboboxInputClassName({ className: config.inputClassName }),
    ),
  ],
  trigger: [
    ...attributes.trigger,
    ...slotAttributes(
      h,
      'combobox-trigger',
      comboboxTriggerClassName({ className: config.triggerClassName }),
    ),
  ],
  value: [
    ...attributes.value,
    ...slotAttributes(
      h,
      'combobox-value',
      comboboxValueClassName({ className: config.valueClassName }),
    ),
  ],
  clear: [
    ...attributes.clear,
    ...slotAttributes(
      h,
      'combobox-clear',
      comboboxClearClassName({ className: config.clearClassName }),
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
              comboboxPositionerClassName({
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
            h.DataAttribute('chips', String(config.anchorToChips === true)),
            ...slotAttributes(
              h,
              'combobox-content',
              comboboxContentClassName({
                className: config.contentClassName,
                dir: config.dir,
              }),
            ),
            ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
          ]
        : attributes.popup.root,
  },
  list: {
    ...attributes.list,
    root:
      attributes.list.root.length > 0
        ? [
            ...attributes.list.root,
            ...slotAttributes(
              h,
              'combobox-list',
              comboboxListClassName({ className: config.listClassName }),
            ),
          ]
        : attributes.list.root,
  },
  collection: [
    ...attributes.collection,
    ...slotAttributes(
      h,
      'combobox-collection',
      comboboxCollectionClassName({ className: config.collectionClassName }),
    ),
  ],
  group: [
    ...attributes.group,
    ...slotAttributes(
      h,
      'combobox-group',
      comboboxGroupClassName({ className: config.groupClassName }),
    ),
  ],
  groupLabel: [
    ...attributes.groupLabel,
    ...slotAttributes(
      h,
      'combobox-label',
      comboboxLabelClassName({ className: config.labelClassName }),
    ),
  ],
  empty: [
    ...attributes.empty,
    ...slotAttributes(
      h,
      'combobox-empty',
      comboboxEmptyClassName({ className: config.emptyClassName }),
    ),
  ],
  separator: [
    ...attributes.separator,
    ...slotAttributes(
      h,
      'combobox-separator',
      comboboxSeparatorClassName({ className: config.separatorClassName }),
    ),
  ],
  chips: [
    ...attributes.chips,
    ...slotAttributes(
      h,
      'combobox-chips',
      comboboxChipsClassName({ className: config.chipsClassName }),
    ),
  ],
  chipInput: [
    ...attributes.chipInput,
    ...slotAttributes(
      h,
      'combobox-chip-input',
      comboboxChipInputClassName({ className: config.chipInputClassName }),
    ),
  ],
  items: attributes.items.map(itemAttributes =>
    shadcnItemAttributes(h, config, itemAttributes),
  ),
  chipItems: attributes.chipItems.map(chipAttributes =>
    shadcnChipAttributes(h, config, chipAttributes),
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

export const xIcon = <Message>(
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
    [h.path([h.D('M18 6 6 18')], []), h.path([h.D('m6 6 12 12')], [])],
  )
}

const renderContent = <Message>(
  h: ReturnType<typeof html<Message>>,
  attributes: ComboboxAttributes<Message>,
): Html =>
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
                  h.div(
                    [...attributes.empty],
                    attributes.isEmpty ? ['No items found.'] : [],
                  ),
                  h.div(
                    [...attributes.list.root],
                    attributes.items.map(itemAttributes =>
                      h.div(
                        [...itemAttributes.root],
                        [
                          h.span(
                            [...itemAttributes.text],
                            [itemAttributes.item.label],
                          ),
                          ...(Array.isReadonlyArrayNonEmpty(
                            itemAttributes.indicator,
                          )
                            ? [
                                h.span(
                                  [...itemAttributes.indicator],
                                  [checkIcon([])],
                                ),
                              ]
                            : []),
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
  )

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const {
    toView,
    showClear = false,
    showTrigger = true,
    ...baseConfig
  } = config

  return BaseCombobox.view<Message>({
    ...baseConfig,
    sideOffset: config.sideOffset ?? 6,
    align: config.align ?? 'start',
    toView: attributes => {
      const comboboxAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(comboboxAttributes)
      }

      if (BaseCombobox.isMultiple(config)) {
        return h.div(
          [...comboboxAttributes.root],
          [
            h.div(
              [...comboboxAttributes.chips],
              [
                ...comboboxAttributes.chipItems.map(chip =>
                  h.div(
                    [...chip.root],
                    [chip.item.label, h.button([...chip.remove], [xIcon([])])],
                  ),
                ),
                h.input([...comboboxAttributes.chipInput]),
              ],
            ),
            renderContent(h, comboboxAttributes),
            ...comboboxAttributes.hiddenInputs.map(hiddenInput =>
              h.input([...hiddenInput]),
            ),
          ],
        )
      }

      return h.div(
        [...comboboxAttributes.root],
        [
          h.div(
            [...comboboxAttributes.inputGroup],
            [
              h.input([...comboboxAttributes.input]),
              h.div(
                [
                  h.Role('group'),
                  h.DataAttribute('slot', 'input-group-addon'),
                  h.DataAttribute('align', 'inline-end'),
                  h.Class(
                    comboboxInputAddonClassName({
                      className: config.inputAddonClassName,
                      dir: config.dir,
                    }),
                  ),
                ],
                [
                  ...(showTrigger
                    ? [
                        h.button(
                          [...comboboxAttributes.trigger],
                          [chevronDownIcon([h.Class('pointer-events-none')])],
                        ),
                      ]
                    : []),
                  ...(showClear
                    ? [
                        h.button(
                          [...comboboxAttributes.clear],
                          [xIcon([h.Class('pointer-events-none')])],
                        ),
                      ]
                    : []),
                ],
              ),
            ],
          ),
          renderContent(h, comboboxAttributes),
          ...comboboxAttributes.hiddenInputs.map(hiddenInput =>
            h.input([...hiddenInput]),
          ),
        ],
      )
    },
  })
}
