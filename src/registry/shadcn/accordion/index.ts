import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseAccordion from '../../base-ui/accordion'

// MODEL

export type AccordionChangeReason = BaseAccordion.AccordionChangeReason
export type AccordionFocusChange = BaseAccordion.AccordionFocusChange
export type AccordionItemDescriptor = BaseAccordion.AccordionItemDescriptor
export type AccordionOrientation = BaseAccordion.AccordionOrientation
export type AccordionPanelDescriptor = BaseAccordion.AccordionPanelDescriptor
export type AccordionPanelGeometry = BaseAccordion.AccordionPanelGeometry
export type AccordionTransitionStatus = BaseAccordion.AccordionTransitionStatus
export type AccordionValueChange = BaseAccordion.AccordionValueChange

export const AccordionStyleOptions = S.Struct({
  className: S.optional(S.String),
  itemClassName: S.optional(S.String),
  headerClassName: S.optional(S.String),
  triggerClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
  contentInnerClassName: S.optional(S.String),
  triggerIconClassName: S.optional(S.String),
})
export type AccordionStyleOptions = typeof AccordionStyleOptions.Type

// UPDATE

export const {
  focusChange,
  isOpen,
  panelId,
  toggleValue,
  triggerFocusSelector,
  triggerId,
  valueChange,
} = BaseAccordion

// VIEW

export type AccordionAttributes<Message> =
  BaseAccordion.AccordionAttributes<Message>
export type AccordionItemAttributes<Message> =
  BaseAccordion.AccordionItemAttributes<Message>
export type AccordionPanelAttributes<Message> =
  BaseAccordion.AccordionPanelAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseAccordion.ViewConfig<Message>,
  'toView'
> &
  AccordionStyleOptions &
  Readonly<{
    toView?: (attributes: AccordionAttributes<Message>) => Html
  }>

export const accordionBaseClassName = 'flex w-full flex-col'

export const accordionItemBaseClassName = 'not-last:border-b'

export const accordionHeaderBaseClassName = 'flex'

export const accordionTriggerBaseClassName =
  'group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground'

export const accordionContentBaseClassName =
  'overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up'

export const accordionContentInnerBaseClassName =
  'h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4'

export const accordionTriggerIconBaseClassName = 'pointer-events-none'

export const accordionTriggerClosedIconClassName =
  'shrink-0 group-aria-expanded/accordion-trigger:hidden'

export const accordionTriggerOpenIconClassName =
  'hidden shrink-0 group-aria-expanded/accordion-trigger:inline'

export const accordionClassName = ({
  className,
}: Pick<AccordionStyleOptions, 'className'> = {}): string =>
  cn(accordionBaseClassName, className)

export const accordionItemClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(accordionItemBaseClassName, className)

export const accordionHeaderClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(accordionHeaderBaseClassName, className)

export const accordionTriggerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(accordionTriggerBaseClassName, className)

export const accordionContentClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(accordionContentBaseClassName, className)

export const accordionContentInnerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(accordionContentInnerBaseClassName, className)

export const accordionTriggerIconClassName = ({
  className,
  isOpen: iconIsOpen,
}: Readonly<{
  className?: string | undefined
  isOpen: boolean
}>): string =>
  cn(
    accordionTriggerIconBaseClassName,
    iconIsOpen
      ? accordionTriggerOpenIconClassName
      : accordionTriggerClosedIconClassName,
    className,
  )

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'className' | 'dir'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'accordion'),
  h.Class(accordionClassName({ className: config.className })),
  ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
]

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'itemClassName'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'accordion-item'),
  h.Class(accordionItemClassName({ className: config.itemClassName })),
]

const headerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'headerClassName'>,
): ReadonlyArray<Attribute<Message>> => [
  h.Class(accordionHeaderClassName({ className: config.headerClassName })),
]

const triggerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'triggerClassName'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'accordion-trigger'),
  h.Class(accordionTriggerClassName({ className: config.triggerClassName })),
]

const contentAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'contentClassName'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'accordion-content'),
  h.Class(accordionContentClassName({ className: config.contentClassName })),
]

export const contentInnerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'contentInnerClassName'>,
): ReadonlyArray<Attribute<Message>> => [
  h.Class(
    accordionContentInnerClassName({
      className: config.contentInnerClassName,
    }),
  ),
]

export const triggerIconAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'triggerIconClassName'>,
  isOpenValue: boolean,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'accordion-trigger-icon'),
  h.Class(
    accordionTriggerIconClassName({
      className: config.triggerIconClassName,
      isOpen: isOpenValue,
    }),
  ),
]

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: AccordionAttributes<Message>,
): AccordionAttributes<Message> => ({
  root: [...attributes.root, ...rootAttributes(h, config)],
  items: attributes.items.map(item => ({
    ...item,
    root: [...item.root, ...itemAttributes(h, config)],
    header: [...item.header, ...headerAttributes(h, config)],
    trigger: [...item.trigger, ...triggerAttributes(h, config)],
    panel: {
      ...item.panel,
      root:
        item.panel.root.length > 0
          ? [...item.panel.root, ...contentAttributes(h, config)]
          : item.panel.root,
    },
  })),
})

const accordionIcon = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  isOpenValue: boolean,
): Html => h.span([...triggerIconAttributes(h, config, isOpenValue)], [])

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BaseAccordion.view<Message>({
    ...baseConfig,
    toView: attributes => {
      const accordionAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(accordionAttributes)
      }

      return h.div(
        [...accordionAttributes.root],
        accordionAttributes.items.map(item =>
          h.div(
            [...item.root],
            [
              h.h3(
                [...item.header],
                [
                  h.button(
                    [...item.trigger],
                    [
                      item.item.label ?? item.item.value,
                      accordionIcon(h, config, false),
                      accordionIcon(h, config, true),
                    ],
                  ),
                ],
              ),
              item.panel.isMounted
                ? h.keyed('div')(
                    item.panel.isOpen ? 'open' : 'closed',
                    [...item.panel.root],
                    [
                      h.div(
                        [...contentInnerAttributes(h, config)],
                        [item.panel.panel.label ?? item.item.value],
                      ),
                    ],
                  )
                : h.empty,
            ],
          ),
        ),
      )
    },
  })
}
