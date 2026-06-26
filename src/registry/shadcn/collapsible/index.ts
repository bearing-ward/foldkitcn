import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseCollapsible from '../../base-ui/collapsible'

// MODEL

export type CollapsibleChangeReason = BaseCollapsible.CollapsibleChangeReason
export type CollapsibleOpenChange = BaseCollapsible.CollapsibleOpenChange
export type CollapsiblePanelDescriptor =
  BaseCollapsible.CollapsiblePanelDescriptor
export type CollapsiblePanelGeometry = BaseCollapsible.CollapsiblePanelGeometry
export type CollapsibleTransitionStatus =
  BaseCollapsible.CollapsibleTransitionStatus

export const CollapsibleStyleOptions = S.Struct({
  className: S.optional(S.String),
  triggerClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
})
export type CollapsibleStyleOptions = typeof CollapsibleStyleOptions.Type

// UPDATE

export const { openChange, triggerOpenChange } = BaseCollapsible

// VIEW

export type CollapsibleAttributes<Message> =
  BaseCollapsible.CollapsibleAttributes<Message>
export type CollapsiblePanelAttributes<Message> =
  BaseCollapsible.CollapsiblePanelAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseCollapsible.ViewConfig<Message>,
  'toView'
> &
  CollapsibleStyleOptions &
  Readonly<{
    dir?: string
    toView?: (attributes: CollapsibleAttributes<Message>) => Html
  }>

export const collapsibleClassName = ({
  className,
}: Pick<CollapsibleStyleOptions, 'className'> = {}): string => cn(className)

export const collapsibleTriggerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string => cn(className)

export const collapsibleContentClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string => cn(className)

const optionalClassAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string,
): ReadonlyArray<Attribute<Message>> =>
  className === '' ? [] : [h.Class(className)]

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'className' | 'dir'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'collapsible'),
  ...optionalClassAttribute(h, collapsibleClassName(config)),
  ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
]

const triggerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'triggerClassName'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'collapsible-trigger'),
  ...optionalClassAttribute(
    h,
    collapsibleTriggerClassName({ className: config.triggerClassName }),
  ),
]

const contentAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'contentClassName'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'collapsible-content'),
  ...optionalClassAttribute(
    h,
    collapsibleContentClassName({ className: config.contentClassName }),
  ),
]

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: CollapsibleAttributes<Message>,
): CollapsibleAttributes<Message> => ({
  root: [...attributes.root, ...rootAttributes(h, config)],
  trigger: [...attributes.trigger, ...triggerAttributes(h, config)],
  panel: {
    ...attributes.panel,
    root:
      attributes.panel.root.length > 0
        ? [...attributes.panel.root, ...contentAttributes(h, config)]
        : attributes.panel.root,
  },
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BaseCollapsible.view<Message>({
    ...baseConfig,
    toView: attributes => {
      const collapsibleAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(collapsibleAttributes)
      }

      return h.div(
        [...collapsibleAttributes.root],
        [
          h.button(
            [...collapsibleAttributes.trigger],
            [
              collapsibleAttributes.panel.isOpen
                ? 'Hide details'
                : 'Show details',
            ],
          ),
          collapsibleAttributes.panel.isMounted
            ? h.keyed('div')(
                collapsibleAttributes.panel.isOpen ? 'open' : 'closed',
                [...collapsibleAttributes.panel.root],
                [
                  collapsibleAttributes.panel.panel.label ??
                    'Collapsible content',
                ],
              )
            : h.empty,
        ],
      )
    },
  })
}
