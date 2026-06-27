import { html } from 'foldkit/html'

import * as Select from '../../../../../src/registry/base-ui/select'
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

const fruitItems: ReadonlyArray<Select.SelectItemDescriptor> = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes', isDisabled: true },
  { value: 'pineapple', label: 'Pineapple' },
]

const snapshot = (
  view: ReturnType<typeof Select.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => snapshotHtml(view, keyboardBehavior)

const selectRoot = (
  config: Omit<Select.ViewConfig<never>, 'id' | 'items' | 'toView'>,
) =>
  Select.view<never>({
    id: 'fruit-select',
    items: fruitItems,
    placeholder: 'Select a fruit',
    name: 'fruit',
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
                  Select.displayValue({
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
                          h.div([...attributes.arrow.root], []),
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
          h.input([...attributes.hiddenInput]),
        ],
      )
    },
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'select-open',
    snapshot: snapshot(
      selectRoot({
        open: true,
        highlightedValue: 'banana',
        side: 'top',
        align: 'end',
        sideOffset: 4,
      }),
    ),
  },
  {
    id: 'select-closed',
    snapshot: snapshot(selectRoot({ open: false })),
  },
  {
    id: 'select-selected',
    snapshot: snapshot(
      selectRoot({ open: true, value: 'banana', highlightedValue: 'banana' }),
    ),
  },
  {
    id: 'select-force-mounted',
    snapshot: snapshot(selectRoot({ open: false, forceMount: true })),
  },
  {
    id: 'select-disabled',
    snapshot: snapshot(
      selectRoot({ open: false, isDisabled: true, forceMount: true }),
      suppressedKeyboard,
    ),
  },
]
