import { html } from 'foldkit/html'

import * as PreviewCard from '../../../../../src/registry/base-ui/preview-card'
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
  ) => ReturnType<typeof PreviewCard.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const previewCardRoot = (
  config: Omit<PreviewCard.ViewConfig<never>, 'id' | 'toView'>,
) =>
  PreviewCard.view<never>({
    id: 'profile-preview',
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          h.a([...attributes.trigger], ['Open profile']),
          h.div(
            [...attributes.portal],
            attributes.isMounted
              ? [
                  h.div([...attributes.backdrop.root], []),
                  h.div(
                    [...attributes.positioner.root],
                    [
                      h.div(
                        [...attributes.popup.root],
                        [
                          h.div(
                            [...attributes.viewport.root],
                            [
                              h.h3([], ['@base-ui']),
                              h.p([], ['Preview Card primitive']),
                            ],
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
      )
    },
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'preview-card-open',
    snapshot: snapshot(() =>
      previewCardRoot({
        open: true,
        activeTriggerId: 'profile-preview-trigger',
        side: 'top',
        align: 'end',
        sideOffset: 4,
      }),
    ),
  },
  {
    id: 'preview-card-closed',
    snapshot: snapshot(() => previewCardRoot({ open: false })),
  },
  {
    id: 'preview-card-force-mounted',
    snapshot: snapshot(() =>
      previewCardRoot({ open: false, forceMount: true, alignOffset: 2 }),
    ),
  },
  {
    id: 'preview-card-instant-viewport',
    snapshot: snapshot(() =>
      previewCardRoot({
        open: true,
        instant: 'focus',
        viewportActivationDirection: 'left up',
        isViewportTransitioning: true,
      }),
    ),
  },
  {
    id: 'preview-card-disabled',
    snapshot: snapshot(
      () =>
        previewCardRoot({
          open: false,
          isDisabled: true,
          forceMount: true,
        }),
      suppressedKeyboard,
    ),
  },
]
