import { html } from 'foldkit/html'

import * as ShadcnSelect from '../../../../../src/registry/shadcn/select'
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

const fruitItems: ReadonlyArray<ShadcnSelect.SelectItemDescriptor> = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'grapes', label: 'Grapes', isDisabled: true },
]

const snapshot = (
  view: ReturnType<typeof ShadcnSelect.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => snapshotHtml(view, keyboardBehavior)

const selectRoot = (
  config: Omit<ShadcnSelect.ViewConfig<never>, 'id' | 'items' | 'toView'>,
) =>
  ShadcnSelect.view<never>({
    id: 'profile-select',
    items: fruitItems,
    placeholder: 'Select a fruit',
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          h.button(
            [...attributes.trigger],
            [
              h.span(
                [...attributes.value],
                [
                  ShadcnSelect.displayValue({
                    items: fruitItems,
                    placeholder: 'Select a fruit',
                    value: config.value,
                  }),
                ],
              ),
              h.span([...attributes.icon], ['v']),
            ],
          ),
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
                          h.div([...attributes.scrollUp.root], ['Up']),
                          h.div(
                            [...attributes.list.root],
                            [
                              h.div(
                                [...attributes.group],
                                [
                                  h.div([...attributes.groupLabel], ['Fruits']),
                                  ...attributes.items.map(itemAttributes =>
                                    h.div(
                                      [...itemAttributes.root],
                                      [
                                        h.span(
                                          [...itemAttributes.text],
                                          [itemAttributes.item.label],
                                        ),
                                        h.span(
                                          [...itemAttributes.indicator],
                                          [],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          h.div([...attributes.separator], []),
                          h.div([...attributes.scrollDown.root], ['Down']),
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
    id: 'select-basic',
    snapshot: snapshot(selectRoot({ open: true, highlightedValue: 'banana' })),
  },
  {
    id: 'select-selected',
    snapshot: snapshot(
      selectRoot({ open: true, value: 'banana', highlightedValue: 'banana' }),
    ),
  },
  {
    id: 'select-rtl',
    snapshot: snapshot(
      selectRoot({
        open: true,
        dir: 'rtl',
        side: 'inline-start',
        triggerClassName: 'w-32',
      }),
    ),
  },
  {
    id: 'select-disabled',
    snapshot: snapshot(
      selectRoot({ open: false, isDisabled: true, forceMount: true }),
      suppressedKeyboard,
    ),
  },
]
