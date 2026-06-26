import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseTabs from '../../base-ui/tabs'

// MODEL

export type TabsActivationDirection = BaseTabs.TabsActivationDirection
export type TabsActivationMode = BaseTabs.TabsActivationMode
export type TabsChangeReason = BaseTabs.TabsChangeReason
export type TabsHighlightChange = BaseTabs.TabsHighlightChange
export type TabsIndicatorGeometry = BaseTabs.TabsIndicatorGeometry
export type TabsOrientation = BaseTabs.TabsOrientation
export type TabsPanelDescriptor = BaseTabs.TabsPanelDescriptor
export type TabsTabDescriptor = BaseTabs.TabsTabDescriptor
export type TabsValueChange = BaseTabs.TabsValueChange

export const TabsListVariant = S.Union([
  S.Literal('default'),
  S.Literal('line'),
])
export type TabsListVariant = typeof TabsListVariant.Type

export const TabsStyleOptions = S.Struct({
  className: S.optional(S.String),
  listClassName: S.optional(S.String),
  triggerClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
  indicatorClassName: S.optional(S.String),
  listVariant: S.optional(TabsListVariant),
})
export type TabsStyleOptions = typeof TabsStyleOptions.Type

// UPDATE

export const { highlightChange, isActive, tabFocusSelector, valueChange } =
  BaseTabs

// VIEW

export type TabsAttributes<Message> = BaseTabs.TabsAttributes<Message>
export type TabsPanelAttributes<Message> = BaseTabs.TabsPanelAttributes<Message>
export type TabsTabAttributes<Message> = BaseTabs.TabsTabAttributes<Message>

export type ViewConfig<Message> = Omit<BaseTabs.ViewConfig<Message>, 'toView'> &
  TabsStyleOptions &
  Readonly<{
    dir?: string
    toView?: (attributes: TabsAttributes<Message>) => Html
  }>

export const tabsBaseClassName =
  'group/tabs flex gap-2 data-horizontal:flex-col'

export const tabsListBaseClassName =
  'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none'

export const tabsListDefaultVariantClassName = 'bg-muted'

export const tabsListLineVariantClassName = 'gap-1 bg-transparent'

export const tabsTriggerBaseClassName =
  "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100"

export const tabsContentBaseClassName = 'flex-1 text-sm outline-none'

export const tabsIndicatorBaseClassName = 'absolute pointer-events-none'

export const tabsClassName = ({
  className,
}: Pick<TabsStyleOptions, 'className'> = {}): string =>
  cn(tabsBaseClassName, className)

export const tabsListClassName = ({
  className,
  variant = 'default',
}: Readonly<{
  className?: string | undefined
  variant?: TabsListVariant | undefined
}> = {}): string =>
  cn(
    tabsListBaseClassName,
    variant === 'line'
      ? tabsListLineVariantClassName
      : tabsListDefaultVariantClassName,
    className,
  )

export const tabsTriggerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(tabsTriggerBaseClassName, className)

export const tabsContentClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(tabsContentBaseClassName, className)

export const tabsIndicatorClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(tabsIndicatorBaseClassName, className)

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'className' | 'dir' | 'orientation'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'tabs'),
  h.DataAttribute('orientation', config.orientation ?? 'horizontal'),
  h.Class(tabsClassName({ className: config.className })),
  ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
]

const listAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'listClassName' | 'listVariant'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'tabs-list'),
  h.DataAttribute('variant', config.listVariant ?? 'default'),
  h.Class(
    tabsListClassName({
      className: config.listClassName,
      variant: config.listVariant,
    }),
  ),
]

const triggerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'triggerClassName'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'tabs-trigger'),
  h.Class(tabsTriggerClassName({ className: config.triggerClassName })),
]

const contentAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'contentClassName'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'tabs-content'),
  h.Class(tabsContentClassName({ className: config.contentClassName })),
]

const indicatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'indicatorClassName'>,
  attributes: ReadonlyArray<Attribute<Message>>,
): ReadonlyArray<Attribute<Message>> =>
  attributes.length > 0
    ? [
        ...attributes,
        h.DataAttribute('slot', 'tabs-indicator'),
        h.Class(
          tabsIndicatorClassName({
            className: config.indicatorClassName,
          }),
        ),
      ]
    : []

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: TabsAttributes<Message>,
): TabsAttributes<Message> => ({
  root: [...attributes.root, ...rootAttributes(h, config)],
  list: [...attributes.list, ...listAttributes(h, config)],
  tabs: attributes.tabs.map(tab => ({
    tab: tab.tab,
    root: [...tab.root, ...triggerAttributes(h, config)],
  })),
  panels: attributes.panels.map(panel => ({
    ...panel,
    root:
      panel.root.length > 0
        ? [...panel.root, ...contentAttributes(h, config)]
        : panel.root,
  })),
  indicator: indicatorAttributes(h, config, attributes.indicator),
})

const mountedPanels = <Message>(
  panels: ReadonlyArray<TabsPanelAttributes<Message>>,
): ReadonlyArray<TabsPanelAttributes<Message>> =>
  panels.filter(panel => panel.isMounted)

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BaseTabs.view<Message>({
    ...baseConfig,
    toView: attributes => {
      const tabsAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(tabsAttributes)
      }

      return h.div(
        [...tabsAttributes.root],
        [
          h.div(
            [...tabsAttributes.list],
            tabsAttributes.tabs.map(tab =>
              h.button([...tab.root], [tab.tab.label ?? tab.tab.value]),
            ),
          ),
          ...mountedPanels(tabsAttributes.panels).map(panel =>
            h.div([...panel.root], [panel.panel.label ?? panel.panel.value]),
          ),
        ],
      )
    },
  })
}
