import { html } from 'foldkit/html'

import * as Tabs from '../../../../../src/registry/base-ui/tabs'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

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

const tabs: ReadonlyArray<Tabs.TabsTabDescriptor> = [
  { id: 'overview-tab', value: 'overview', label: 'Overview' },
  { id: 'analytics-tab', value: 'analytics', label: 'Analytics' },
]

const panels: ReadonlyArray<Tabs.TabsPanelDescriptor> = [
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

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof Tabs.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = baseKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const tabsRoot = (
  h: ReturnType<typeof html<never>>,
  config: Omit<Tabs.ViewConfig<never>, 'tabs' | 'toView'> &
    Readonly<{ tabs?: ReadonlyArray<Tabs.TabsTabDescriptor> }>,
) =>
  Tabs.view<never>({
    value: 'overview',
    tabs,
    panels,
    ...config,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.div(
            [...attributes.list],
            attributes.tabs.map(tab =>
              h.button([...tab.root], [tab.tab.label ?? tab.tab.value]),
            ),
          ),
          ...attributes.panels
            .filter(panel => panel.isMounted)
            .map(panel =>
              h.div([...panel.root], [panel.panel.label ?? panel.panel.value]),
            ),
        ],
      ),
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'tabs-manual',
    snapshot: snapshot(h => tabsRoot(h, {})),
  },
  {
    id: 'tabs-automatic',
    snapshot: snapshot(
      h => tabsRoot(h, { activationMode: 'automatic' }),
      automaticKeyboard,
    ),
  },
  {
    id: 'tabs-vertical-disabled',
    snapshot: snapshot(
      h =>
        tabsRoot(h, {
          orientation: 'vertical',
          tabs: [
            { id: 'overview-tab', value: 'overview', label: 'Overview' },
            {
              id: 'analytics-tab',
              value: 'analytics',
              label: 'Analytics',
              isDisabled: true,
            },
          ],
        }),
      verticalKeyboard,
    ),
  },
]
