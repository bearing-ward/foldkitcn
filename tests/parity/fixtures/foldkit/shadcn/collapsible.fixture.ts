import { html } from 'foldkit/html'

import * as Collapsible from '../../../../../src/registry/shadcn/collapsible'
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
    panel: {
      id: 'details-panel',
      label: 'Details content',
    },
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          h.button([...attributes.trigger], ['Toggle details']),
          attributes.panel.isMounted
            ? h.keyed('div')(
                attributes.panel.isOpen ? 'open' : 'closed',
                [...attributes.panel.root],
                ['Details content'],
              )
            : h.empty,
        ],
      )
    },
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'collapsible-demo',
    snapshot: snapshot(() =>
      collapsibleRoot({
        open: false,
        className: 'flex w-[350px] flex-col gap-2',
        triggerClassName: 'size-8',
      }),
    ),
  },
  {
    id: 'collapsible-open',
    snapshot: snapshot(() =>
      collapsibleRoot({
        open: true,
        className: 'rounded-md data-open:bg-muted',
        triggerClassName: 'w-full',
        contentClassName: 'flex flex-col gap-2',
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
          contentClassName: 'flex flex-col gap-2',
          panel: {
            id: 'details-panel',
            label: 'Details content',
            keepMounted: true,
          },
        }),
      suppressedKeyboard,
    ),
  },
]
