import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

const baseKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowRight: 'focuses',
  ArrowLeft: 'focuses',
  Home: 'focuses',
  End: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const automaticKeyboard = {
  ...baseKeyboard,
  ArrowRight: 'activates',
  ArrowLeft: 'activates',
  Home: 'activates',
  End: 'activates',
}

const verticalKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowDown: 'activates',
  ArrowUp: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const tabDefinitions = [
  { id: 'overview-tab', value: 'overview', label: 'Overview' },
  { id: 'analytics-tab', value: 'analytics', label: 'Analytics' },
]

const panelDefinitions = [
  {
    id: 'overview-panel',
    value: 'overview',
    label: 'Overview panel',
    keepMounted: true,
  },
  {
    id: 'analytics-panel',
    value: 'analytics',
    label: 'Analytics panel',
    keepMounted: true,
  },
]

const dataState = (orientation = 'horizontal') => ({
  'data-orientation': orientation,
  'data-activation-direction': 'none',
})

const tabsRoot = (
  value: string,
  options: Readonly<{
    orientation?: 'horizontal' | 'vertical'
    disabledAnalytics?: boolean
    keyboard?: FixtureSnapshot['keyboardBehavior']
  }> = {},
): FixtureSnapshot => {
  const orientation = options.orientation ?? 'horizontal'
  const root = document.createElement('div')
  Object.entries(dataState(orientation)).map(([name, attributeValue]) =>
    root.setAttribute(name, attributeValue),
  )

  const list = document.createElement('div')
  Object.entries({
    role: 'tablist',
    ...(orientation === 'vertical' ? { 'aria-orientation': 'vertical' } : {}),
    ...dataState(orientation),
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
      'aria-controls': `${tab.value}-panel`,
      ...(active ? { 'data-active': '' } : {}),
      ...(disabled ? { 'aria-disabled': 'true', 'data-disabled': '' } : {}),
      ...dataState(orientation),
    }).map(([name, attributeValue]) =>
      button.setAttribute(name, attributeValue),
    )
    button.append(document.createTextNode(tab.label))
    list.append(button)

    return tab.value
  })

  root.append(list)

  panelDefinitions.map((panel, index) => {
    const active = value === panel.value
    const panelElement = document.createElement('div')
    Object.entries({
      role: 'tabpanel',
      tabindex: active ? '0' : '-1',
      'data-index': String(index),
      id: panel.id,
      'aria-labelledby': `${panel.value}-tab`,
      ...(active ? {} : { hidden: '', inert: '', 'data-hidden': '' }),
      ...dataState(orientation),
    }).map(([name, attributeValue]) =>
      panelElement.setAttribute(name, attributeValue),
    )
    panelElement.append(document.createTextNode(panel.label))
    root.append(panelElement)

    return panel.value
  })

  document.body.append(root)
  const snapshot = snapshotElement(root, options.keyboard ?? baseKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'tabs-manual',
    snapshot: tabsRoot('overview'),
  },
  {
    id: 'tabs-automatic',
    snapshot: tabsRoot('overview', { keyboard: automaticKeyboard }),
  },
  {
    id: 'tabs-vertical-disabled',
    snapshot: tabsRoot('overview', {
      orientation: 'vertical',
      disabledAnalytics: true,
      keyboard: verticalKeyboard,
    }),
  },
]
