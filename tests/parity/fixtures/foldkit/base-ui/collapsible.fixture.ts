import { html } from 'foldkit/html'

import * as Collapsible from '../../../../../src/registry/base-ui/collapsible'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

const enabledKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const suppressedKeyboard = {
  click: 'suppressed',
  Enter: 'suppressed',
  Space: 'suppressed',
  mousedown: 'suppressed',
  pointerdown: 'suppressed',
}

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof Collapsible.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const collapsibleRoot = (
  config: Omit<Collapsible.ViewConfig<never>, 'toView'>,
) =>
  Collapsible.view<never>({
    panel: { id: 'recovery-panel', label: 'Recovery keys panel' },
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          h.button([...attributes.trigger], ['Recovery keys']),
          attributes.panel.isMounted
            ? h.keyed('div')(
                attributes.panel.isOpen ? 'open' : 'closed',
                [...attributes.panel.root],
                ['Recovery keys panel'],
              )
            : h.empty,
        ],
      )
    },
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'collapsible-open',
    snapshot: snapshot(() => collapsibleRoot({ open: true })),
  },
  {
    id: 'collapsible-closed',
    snapshot: snapshot(() => collapsibleRoot({ open: false })),
  },
  {
    id: 'collapsible-keep-mounted',
    snapshot: snapshot(() =>
      collapsibleRoot({
        open: false,
        panel: {
          id: 'recovery-panel',
          label: 'Recovery keys panel',
          keepMounted: true,
        },
      }),
    ),
  },
  {
    id: 'collapsible-hidden-until-found',
    snapshot: snapshot(() =>
      collapsibleRoot({
        open: false,
        panel: {
          id: 'recovery-panel',
          label: 'Recovery keys panel',
          hiddenUntilFound: true,
        },
      }),
    ),
  },
  {
    id: 'collapsible-disabled',
    snapshot: snapshot(
      () =>
        collapsibleRoot({
          open: false,
          isDisabled: true,
          panel: {
            id: 'recovery-panel',
            label: 'Recovery keys panel',
            keepMounted: true,
          },
        }),
      suppressedKeyboard,
    ),
  },
]
