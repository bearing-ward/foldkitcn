import * as ShadcnTabs from '../../../../../src/registry/shadcn/tabs'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

const baseKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowRight: 'focuses',
  ArrowLeft: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const suppressedKeyboard = {
  click: 'suppressed',
  Enter: 'suppressed',
  Space: 'suppressed',
  ArrowRight: 'suppressed',
  ArrowLeft: 'suppressed',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const tabDefinitions = [
  { id: 'overview-tab', value: 'overview', label: 'Overview' },
  { id: 'analytics-tab', value: 'analytics', label: 'Analytics' },
]

const dataState = (orientation = 'horizontal') => ({
  'data-orientation': orientation,
  'data-activation-direction': 'none',
})

const shadcnTabsRoot = (
  value: string,
  options: Readonly<{
    orientation?: 'horizontal' | 'vertical'
    disabledAnalytics?: boolean
    variant?: ShadcnTabs.TabsListVariant
    keyboard?: FixtureSnapshot['keyboardBehavior']
  }> = {},
): FixtureSnapshot => {
  const orientation = options.orientation ?? 'horizontal'
  const variant = options.variant ?? 'default'
  const root = document.createElement('div')
  Object.entries({
    ...dataState(orientation),
    'data-slot': 'tabs',
    class: ShadcnTabs.tabsClassName(),
  }).map(([name, attributeValue]) => root.setAttribute(name, attributeValue))

  const list = document.createElement('div')
  Object.entries({
    role: 'tablist',
    ...(orientation === 'vertical' ? { 'aria-orientation': 'vertical' } : {}),
    ...dataState(orientation),
    'data-slot': 'tabs-list',
    'data-variant': variant,
    class: ShadcnTabs.tabsListClassName({ variant }),
  }).map(([name, attributeValue]) => list.setAttribute(name, attributeValue))

  tabDefinitions.map(tab => {
    const active = value === tab.value
    const disabled =
      options.disabledAnalytics === true && tab.value === 'analytics'
    const button = document.createElement('button')
    Object.entries({
      role: 'tab',
      type: 'button',
      'aria-selected': String(active),
      tabindex: active ? '0' : '-1',
      id: tab.id,
      ...(active ? { 'aria-controls': `${tab.value}-panel` } : {}),
      ...(active ? { 'data-active': '' } : {}),
      ...(disabled ? { 'aria-disabled': 'true', 'data-disabled': '' } : {}),
      ...dataState(orientation),
      'data-slot': 'tabs-trigger',
      class: ShadcnTabs.tabsTriggerClassName(),
    }).map(([name, attributeValue]) =>
      button.setAttribute(name, attributeValue),
    )
    button.append(document.createTextNode(tab.label))
    list.append(button)

    return tab.value
  })

  root.append(list)
  document.body.append(root)
  const snapshot = snapshotElement(root, options.keyboard ?? baseKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'tabs-demo',
    snapshot: shadcnTabsRoot('overview'),
  },
  {
    id: 'tabs-line',
    snapshot: shadcnTabsRoot('overview', { variant: 'line' }),
  },
  {
    id: 'tabs-disabled-vertical',
    snapshot: shadcnTabsRoot('overview', {
      orientation: 'vertical',
      disabledAnalytics: true,
      keyboard: suppressedKeyboard,
    }),
  },
]
