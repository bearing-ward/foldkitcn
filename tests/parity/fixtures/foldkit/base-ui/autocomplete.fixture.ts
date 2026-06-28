import { html } from 'foldkit/html'

import * as Autocomplete from '../../../../../src/registry/base-ui/autocomplete'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { nativeEnabledKeyboard, suppressedKeyboard } from '../../../fixture'
import { snapshotHtml } from '../render'

const fruitItems: ReadonlyArray<Autocomplete.AutocompleteItemDescriptor> = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes', isDisabled: true },
  { value: 'pineapple', label: 'Pineapple' },
]

const snapshot = (
  view: ReturnType<typeof Autocomplete.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = nativeEnabledKeyboard,
): FixtureSnapshot => snapshotHtml(view, keyboardBehavior)

const autocompleteRoot = (
  config: Omit<
    Autocomplete.ViewConfig<never>,
    'id' | 'items' | 'toView' | 'value'
  > &
    Readonly<{ value?: string }>,
) =>
  Autocomplete.view<never>({
    id: 'fruit-autocomplete',
    items: fruitItems,
    value: config.value ?? '',
    placeholder: 'Search fruit',
    name: 'fruit',
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          h.div(
            [...attributes.inputGroup],
            [
              h.input([...attributes.input]),
              h.button([...attributes.trigger], ['v']),
              h.button([...attributes.clear], ['x']),
            ],
          ),
          h.div([...attributes.value], [attributes.valueText]),
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
                          h.div(
                            [...attributes.empty],
                            attributes.isEmpty ? ['No fruit found.'] : [],
                          ),
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
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          h.div([...attributes.separator], []),
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
    id: 'autocomplete-open',
    snapshot: snapshot(
      autocompleteRoot({
        open: true,
        highlightedValue: 'banana',
        side: 'top',
        align: 'end',
        sideOffset: 4,
      }),
    ),
  },
  {
    id: 'autocomplete-filtered',
    snapshot: snapshot(autocompleteRoot({ open: true, value: 'blue' })),
  },
  {
    id: 'autocomplete-empty',
    snapshot: snapshot(autocompleteRoot({ open: true, value: 'zz' })),
  },
  {
    id: 'autocomplete-selected',
    snapshot: snapshot(
      autocompleteRoot({
        open: true,
        value: 'Banana',
        highlightedValue: 'banana',
      }),
    ),
  },
  {
    id: 'autocomplete-inline',
    snapshot: snapshot(
      autocompleteRoot({
        open: true,
        value: 'ap',
        mode: 'inline',
        highlightedValue: 'apple',
      }),
    ),
  },
  {
    id: 'autocomplete-disabled',
    snapshot: snapshot(
      autocompleteRoot({ open: false, isDisabled: true, forceMount: true }),
      suppressedKeyboard,
    ),
  },
]
