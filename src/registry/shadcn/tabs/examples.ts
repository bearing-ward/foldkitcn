import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Tabs } from './index'
import type { TabsValueChange } from './index'

export type TabsExampleController<Message> = Readonly<{
  valueFor: (
    exampleId: string,
    defaultValue: string | undefined,
  ) => string | undefined
  onValueChange: (exampleId: string, change: TabsValueChange) => Message
}>

const tabsValue = <Message>(
  controller: TabsExampleController<Message> | undefined,
  exampleId: string,
  defaultValue: string | undefined,
): string | undefined =>
  controller?.valueFor(exampleId, defaultValue) ?? defaultValue

const analyticsTabs = [
  { id: 'overview-tab', value: 'overview', label: 'Overview' },
  { id: 'analytics-tab', value: 'analytics', label: 'Analytics' },
  { id: 'reports-tab', value: 'reports', label: 'Reports' },
  { id: 'settings-tab', value: 'settings', label: 'Settings' },
]

const analyticsPanels = [
  { id: 'overview-panel', value: 'overview', label: 'Overview' },
  { id: 'analytics-panel', value: 'analytics', label: 'Analytics' },
  { id: 'reports-panel', value: 'reports', label: 'Reports' },
  { id: 'settings-panel', value: 'settings', label: 'Settings' },
]

const defaultAnalyticsLabels = {
  overview: 'Overview',
  analytics: 'Analytics',
  reports: 'Reports',
  settings: 'Settings',
}

const analyticsDescriptions: Readonly<Record<string, string>> = {
  overview: 'View your key metrics and recent project activity.',
  analytics:
    'Compare trend lines, conversion rates, and week-over-week movement.',
  reports: 'Review scheduled reports and recently exported documents.',
  settings: 'Adjust workspace preferences and notification defaults.',
}

const analyticsContent: Readonly<Record<string, string>> = {
  overview: 'You have 12 active projects and 3 pending tasks.',
  analytics: 'Conversion is up 8% over the last 30 days.',
  reports: 'Two reports are ready to export.',
  settings: 'Email summaries are enabled for this workspace.',
}

const localCard = (
  title: string,
  description: string,
  content: string,
): Html => {
  const h = html<never>()

  return h.div(
    [
      h.Class(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
      ),
    ],
    [
      h.div(
        [
          h.Class(
            '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]',
          ),
        ],
        [
          h.div(
            [
              h.Class(
                'leading-none font-semibold group-data-[slot=card-action]/card-header:col-start-1 group-data-[slot=card-action]/card-header:row-start-1',
              ),
            ],
            [title],
          ),
          h.div([h.Class('text-muted-foreground text-sm')], [description]),
        ],
      ),
      h.div([h.Class('px-6 text-sm text-muted-foreground')], [content]),
    ],
  )
}

const previewIcon = (): Html => {
  const h = html<never>()

  return h.svg(
    [
      h.Attribute('data-icon', 'preview'),
      h.Attribute('viewBox', '0 0 24 24'),
      h.Attribute('fill', 'none'),
      h.Attribute('stroke', 'currentColor'),
      h.Attribute('stroke-width', '2'),
      h.Attribute('stroke-linecap', 'round'),
      h.Attribute('stroke-linejoin', 'round'),
      h.AriaHidden(true),
    ],
    [
      h.rect(
        [
          h.Attribute('x', '3'),
          h.Attribute('y', '4'),
          h.Attribute('width', '18'),
          h.Attribute('height', '14'),
          h.Attribute('rx', '2'),
        ],
        [],
      ),
      h.path([h.Attribute('d', 'M8 20h8')], []),
    ],
  )
}

const codeIcon = (): Html => {
  const h = html<never>()

  return h.svg(
    [
      h.Attribute('data-icon', 'code'),
      h.Attribute('viewBox', '0 0 24 24'),
      h.Attribute('fill', 'none'),
      h.Attribute('stroke', 'currentColor'),
      h.Attribute('stroke-width', '2'),
      h.Attribute('stroke-linecap', 'round'),
      h.Attribute('stroke-linejoin', 'round'),
      h.AriaHidden(true),
    ],
    [
      h.path([h.Attribute('d', 'm9 18-6-6 6-6')], []),
      h.path([h.Attribute('d', 'm15 6 6 6-6 6')], []),
    ],
  )
}

const tabsWithCards = <Message = never>(
  dir?: string,
  labels: Readonly<Record<string, string>> = defaultAnalyticsLabels,
  controller?: TabsExampleController<Message>,
): Html =>
  Tabs<Message>({
    value: tabsValue(controller, 'cards', 'overview'),
    className: 'w-[400px]',
    ...(dir === undefined ? {} : { dir }),
    tabs: [
      { id: 'overview-tab', value: 'overview', label: labels.overview },
      { id: 'analytics-tab', value: 'analytics', label: labels.analytics },
      { id: 'reports-tab', value: 'reports', label: labels.reports },
      { id: 'settings-tab', value: 'settings', label: labels.settings },
    ],
    panels: analyticsPanels,
    ...(controller === undefined
      ? {}
      : { onValueChange: change => controller.onValueChange('cards', change) }),
    toView: attributes => {
      const h = html<Message>()
      const activePanel = attributes.panels.find(panel => panel.isActive)
      const activeValue = activePanel?.panel.value ?? 'overview'
      const activeLabel = labels[activeValue] ?? labels.overview ?? 'Overview'
      const activeDescription =
        analyticsDescriptions[activeValue] ??
        analyticsDescriptions.overview ??
        'View your key metrics and recent project activity.'
      const activeContent =
        analyticsContent[activeValue] ??
        analyticsContent.overview ??
        'You have 12 active projects and 3 pending tasks.'

      return h.div(
        [...attributes.root],
        [
          h.div(
            [...attributes.list],
            attributes.tabs.map(tab =>
              h.button([...tab.root], [tab.tab.label ?? tab.tab.value]),
            ),
          ),
          h.div(
            [...(activePanel?.root ?? [])],
            [localCard(activeLabel, activeDescription, activeContent)],
          ),
        ],
      )
    },
  })

export const TabsDemo = <Message = never>(
  controller?: TabsExampleController<Message>,
): Html => tabsWithCards(undefined, defaultAnalyticsLabels, controller)

export const TabsDisabled = <Message = never>(
  controller?: TabsExampleController<Message>,
): Html =>
  Tabs<Message>({
    value: tabsValue(controller, 'disabled', 'home'),
    tabs: [
      { id: 'home-tab', value: 'home', label: 'Home' },
      {
        id: 'settings-tab',
        value: 'settings',
        label: 'Disabled',
        isDisabled: true,
      },
    ],
    ...(controller === undefined
      ? {}
      : {
          onValueChange: change => controller.onValueChange('disabled', change),
        }),
  })

export const TabsIcons = <Message = never>(
  controller?: TabsExampleController<Message>,
): Html => {
  const h = html<Message>()

  return Tabs<Message>({
    value: tabsValue(controller, 'icons', 'preview'),
    tabs: [
      { id: 'preview-tab', value: 'preview', label: 'Preview' },
      { id: 'code-tab', value: 'code', label: 'Code' },
    ],
    panels: [
      { id: 'preview-panel', value: 'preview', label: 'Preview' },
      { id: 'code-panel', value: 'code', label: 'Code' },
    ],
    ...(controller === undefined
      ? {}
      : { onValueChange: change => controller.onValueChange('icons', change) }),
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.div(
            [...attributes.list],
            [
              h.button(
                [...(attributes.tabs[0]?.root ?? [])],
                [previewIcon(), 'Preview'],
              ),
              h.button(
                [...(attributes.tabs[1]?.root ?? [])],
                [codeIcon(), 'Code'],
              ),
            ],
          ),
          ...attributes.panels
            .filter(panel => panel.isMounted)
            .map(panel =>
              h.div(
                [...panel.root],
                [
                  panel.panel.value === 'preview'
                    ? 'Interactive preview surface'
                    : 'Installable example code',
                ],
              ),
            ),
        ],
      ),
  })
}

export const TabsLine = <Message = never>(
  controller?: TabsExampleController<Message>,
): Html =>
  Tabs<Message>({
    value: tabsValue(controller, 'line', 'overview'),
    listVariant: 'line',
    tabs: analyticsTabs.slice(0, 3),
    ...(controller === undefined
      ? {}
      : { onValueChange: change => controller.onValueChange('line', change) }),
  })

export const TabsRtl = <Message = never>(
  controller?: TabsExampleController<Message>,
): Html =>
  tabsWithCards(
    'rtl',
    {
      overview: 'نظرة عامة',
      analytics: 'التحليلات',
      reports: 'التقارير',
      settings: 'الإعدادات',
    },
    controller,
  )

export const TabsVertical = <Message = never>(
  controller?: TabsExampleController<Message>,
): Html =>
  Tabs<Message>({
    value: tabsValue(controller, 'vertical', 'account'),
    orientation: 'vertical',
    tabs: [
      { id: 'account-tab', value: 'account', label: 'Account' },
      { id: 'password-tab', value: 'password', label: 'Password' },
      {
        id: 'notifications-tab',
        value: 'notifications',
        label: 'Notifications',
      },
    ],
    ...(controller === undefined
      ? {}
      : {
          onValueChange: change => controller.onValueChange('vertical', change),
        }),
  })
