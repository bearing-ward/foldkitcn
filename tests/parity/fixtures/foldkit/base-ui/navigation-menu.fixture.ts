import { html } from 'foldkit/html'

import * as NavigationMenu from '../../../../../src/registry/base-ui/navigation-menu'
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

const navigationItems: ReadonlyArray<NavigationMenu.NavigationMenuItemDescriptor> =
  [
    { value: 'product', label: 'Product' },
    { value: 'solutions', label: 'Solutions' },
    {
      value: 'disabled',
      label: 'Disabled',
      isDisabled: true,
    },
    {
      value: 'docs',
      label: 'Docs',
      kind: 'link',
      href: '/docs',
      isActive: true,
      closeOnClick: true,
    },
  ]

const snapshot = (
  view: ReturnType<typeof NavigationMenu.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => snapshotHtml(view, keyboardBehavior)

const navigationMenuRoot = (
  config: Omit<NavigationMenu.ViewConfig<never>, 'id' | 'items' | 'toView'>,
) =>
  NavigationMenu.view<never>({
    id: 'site-nav',
    items: navigationItems,
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.nav(
        [...attributes.root],
        [
          h.ul(
            [...attributes.list],
            attributes.items.map(itemAttributes =>
              h.li(
                [...itemAttributes.root],
                NavigationMenu.itemKind(itemAttributes.item) === 'link'
                  ? [h.a([...itemAttributes.link], [itemAttributes.item.label])]
                  : [
                      h.button(
                        [...itemAttributes.trigger],
                        [
                          itemAttributes.item.label,
                          h.span([...itemAttributes.icon], ['▼']),
                        ],
                      ),
                    ],
              ),
            ),
          ),
          h.div(
            [...attributes.portal],
            attributes.isMounted
              ? [
                  h.div([...attributes.backdrop.root], []),
                  h.div(
                    [...attributes.positioner.root],
                    [
                      h.nav(
                        [...attributes.popup.root],
                        [
                          h.div(
                            [...attributes.viewport.root],
                            attributes.items
                              .filter(
                                itemAttributes =>
                                  itemAttributes.content.isMounted,
                              )
                              .map(itemAttributes =>
                                h.div(
                                  [...itemAttributes.content.root],
                                  [`${itemAttributes.item.label} panel`],
                                ),
                              ),
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
    id: 'navigation-menu-open',
    snapshot: snapshot(
      navigationMenuRoot({
        value: 'product',
        side: 'top',
        align: 'end',
        sideOffset: 8,
      }),
    ),
  },
  {
    id: 'navigation-menu-activation-direction',
    snapshot: snapshot(
      navigationMenuRoot({
        value: 'solutions',
        viewportActivationDirection: 'right',
        transitionStatus: 'starting',
      }),
    ),
  },
  {
    id: 'navigation-menu-link',
    snapshot: snapshot(navigationMenuRoot({ value: undefined })),
  },
  {
    id: 'navigation-menu-force-mounted',
    snapshot: snapshot(
      navigationMenuRoot({
        value: undefined,
        forceMount: true,
        alignOffset: 2,
      }),
    ),
  },
  {
    id: 'navigation-menu-disabled',
    snapshot: snapshot(
      navigationMenuRoot({
        value: undefined,
        isDisabled: true,
        forceMount: true,
      }),
      suppressedKeyboard,
    ),
  },
]
