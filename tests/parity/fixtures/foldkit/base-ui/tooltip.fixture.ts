import { html } from 'foldkit/html'

import * as Tooltip from '../../../../../src/registry/base-ui/tooltip'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

const enabledKeyboard = {
  click: 'activates',
  Enter: 'native-activates',
  Space: 'native-activates',
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
  ) => ReturnType<typeof Tooltip.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const tooltipRoot = (
  config: Omit<Tooltip.ViewConfig<never>, 'id' | 'toView'>,
) =>
  Tooltip.view<never>({
    id: 'library-tooltip',
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.provider],
        [
          h.div(
            [...attributes.root],
            [
              h.button([...attributes.trigger], ['Hover']),
              h.div(
                [...attributes.portal],
                attributes.isMounted
                  ? [
                      h.div(
                        [...attributes.positioner.root],
                        [
                          h.div(
                            [...attributes.popup.root],
                            [
                              h.div(
                                [...attributes.viewport.root],
                                ['Add to library'],
                              ),
                              h.div([...attributes.arrow.root], []),
                            ],
                          ),
                        ],
                      ),
                    ]
                  : [],
              ),
            ],
          ),
        ],
      )
    },
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'tooltip-open',
    snapshot: snapshot(() =>
      tooltipRoot({
        open: true,
        side: 'bottom',
        align: 'end',
        sideOffset: 4,
      }),
    ),
  },
  {
    id: 'tooltip-closed',
    snapshot: snapshot(() => tooltipRoot({ open: false })),
  },
  {
    id: 'tooltip-force-mounted',
    snapshot: snapshot(() =>
      tooltipRoot({ open: false, forceMount: true, alignOffset: 2 }),
    ),
  },
  {
    id: 'tooltip-instant-viewport',
    snapshot: snapshot(() =>
      tooltipRoot({
        open: true,
        instant: 'delay',
        viewportActivationDirection: 'right down',
        isViewportTransitioning: true,
      }),
    ),
  },
  {
    id: 'tooltip-disabled',
    snapshot: snapshot(
      () => tooltipRoot({ open: false, isDisabled: true, forceMount: true }),
      suppressedKeyboard,
    ),
  },
]
