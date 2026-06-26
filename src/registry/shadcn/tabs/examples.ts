import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Tabs } from './index'

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

const tabsWithCards = (
  dir?: string,
  labels: Readonly<{
    overview: string
    analytics: string
    reports: string
    settings: string
  }> = defaultAnalyticsLabels,
): Html =>
  Tabs<never>({
    value: 'overview',
    className: 'w-[400px]',
    ...(dir === undefined ? {} : { dir }),
    tabs: [
      { id: 'overview-tab', value: 'overview', label: labels.overview },
      { id: 'analytics-tab', value: 'analytics', label: labels.analytics },
      { id: 'reports-tab', value: 'reports', label: labels.reports },
      { id: 'settings-tab', value: 'settings', label: labels.settings },
    ],
    panels: analyticsPanels,
    toView: attributes => {
      const h = html<never>()

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
            [...(attributes.panels.find(panel => panel.isActive)?.root ?? [])],
            [
              localCard(
                labels.overview,
                'View your key metrics and recent project activity. Track progress across all your active projects.',
                'You have 12 active projects and 3 pending tasks.',
              ),
            ],
          ),
        ],
      )
    },
  })

export const TabsDemo = (): Html => tabsWithCards()

export const TabsDisabled = (): Html =>
  Tabs<never>({
    value: 'home',
    tabs: [
      { id: 'home-tab', value: 'home', label: 'Home' },
      {
        id: 'settings-tab',
        value: 'settings',
        label: 'Disabled',
        isDisabled: true,
      },
    ],
  })

export const TabsIcons = (): Html => {
  const h = html<never>()

  return Tabs<never>({
    value: 'preview',
    tabs: [
      { id: 'preview-tab', value: 'preview', label: 'Preview' },
      { id: 'code-tab', value: 'code', label: 'Code' },
    ],
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.div(
            [...attributes.list],
            [
              h.button(
                [...(attributes.tabs[0]?.root ?? [])],
                [
                  h.span([h.DataAttribute('icon', 'inline-start')], []),
                  'Preview',
                ],
              ),
              h.button(
                [...(attributes.tabs[1]?.root ?? [])],
                [h.span([h.DataAttribute('icon', 'inline-start')], []), 'Code'],
              ),
            ],
          ),
        ],
      ),
  })
}

export const TabsLine = (): Html =>
  Tabs<never>({
    value: 'overview',
    listVariant: 'line',
    tabs: analyticsTabs.slice(0, 3),
  })

export const TabsRtl = (): Html =>
  tabsWithCards('rtl', {
    overview: 'نظرة عامة',
    analytics: 'التحليلات',
    reports: 'التقارير',
    settings: 'الإعدادات',
  })

export const TabsVertical = (): Html =>
  Tabs<never>({
    value: 'account',
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
  })
