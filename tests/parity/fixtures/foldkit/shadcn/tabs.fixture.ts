import { html } from 'foldkit/html'

import * as Tabs from '../../../../../src/registry/shadcn/tabs'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

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

const tabs: ReadonlyArray<Tabs.TabsTabDescriptor> = [
  { id: 'overview-tab', value: 'overview', label: 'Overview' },
  { id: 'analytics-tab', value: 'analytics', label: 'Analytics' },
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
  config: Omit<Tabs.ViewConfig<never>, 'tabs'> &
    Readonly<{ tabs?: ReadonlyArray<Tabs.TabsTabDescriptor> }>,
) =>
  Tabs.view<never>({
    value: 'overview',
    tabs,
    ...config,
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'tabs-demo',
    snapshot: snapshot(() => tabsRoot({})),
  },
  {
    id: 'tabs-line',
    snapshot: snapshot(() => tabsRoot({ listVariant: 'line' })),
  },
  {
    id: 'tabs-disabled-vertical',
    snapshot: snapshot(
      () =>
        tabsRoot({
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
      suppressedKeyboard,
    ),
  },
]
