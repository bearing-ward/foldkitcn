import { html } from 'foldkit/html'

import * as ToggleGroup from '../../../../../src/registry/base-ui/toggle-group'
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

const verticalKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowDown: 'focuses',
  ArrowUp: 'focuses',
  Home: 'focuses',
  End: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const items: ReadonlyArray<ToggleGroup.ToggleGroupItemDescriptor> = [
  { id: 'align-left', value: 'left', label: 'Left' },
  { id: 'align-center', value: 'center', label: 'Center' },
  { id: 'align-right', value: 'right', label: 'Right' },
]

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof ToggleGroup.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = baseKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const toggleGroupRoot = (
  config: Omit<ToggleGroup.ViewConfig<never>, 'items' | 'toView'> &
    Readonly<{ items?: ReadonlyArray<ToggleGroup.ToggleGroupItemDescriptor> }>,
) =>
  ToggleGroup.view<never>({
    value: ['center'],
    items,
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        attributes.items.map(item =>
          h.button([...item.root], [item.item.label ?? item.item.value]),
        ),
      )
    },
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'toggle-group-single',
    snapshot: snapshot(() => toggleGroupRoot({})),
  },
  {
    id: 'toggle-group-multiple',
    snapshot: snapshot(() =>
      toggleGroupRoot({
        selectionMode: 'multiple',
        value: ['left', 'center'],
      }),
    ),
  },
  {
    id: 'toggle-group-vertical-disabled',
    snapshot: snapshot(
      () =>
        toggleGroupRoot({
          orientation: 'vertical',
          value: ['left'],
          items: [
            { id: 'align-left', value: 'left', label: 'Left' },
            {
              id: 'align-center',
              value: 'center',
              label: 'Center',
              isDisabled: true,
            },
          ],
        }),
      verticalKeyboard,
    ),
  },
]
