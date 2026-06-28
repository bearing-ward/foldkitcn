import { html } from 'foldkit/html'

import * as Combobox from '../../../../../src/registry/base-ui/combobox'
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

const fruitItems: ReadonlyArray<Combobox.ComboboxItemDescriptor> = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes', isDisabled: true },
  { value: 'pineapple', label: 'Pineapple' },
]

const snapshot = (
  view: ReturnType<typeof Combobox.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => snapshotHtml(view, keyboardBehavior)

const comboboxRoot = (
  config: Omit<
    Combobox.ViewConfig<never>,
    'id' | 'inputValue' | 'items' | 'toView'
  > &
    Readonly<{ inputValue?: string }>,
) =>
  Combobox.view<never>({
    id: 'fruit-combobox',
    items: fruitItems,
    inputValue: config.inputValue ?? '',
    placeholder: 'Select a fruit',
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
          h.div(
            [...attributes.chips],
            attributes.chipItems.map(chip =>
              h.div(
                [...chip.root],
                [chip.item.label, h.button([...chip.remove], ['x'])],
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
                        ],
                      ),
                    ],
                  ),
                ]
              : [],
          ),
          ...attributes.hiddenInputs.map(hiddenInput =>
            h.input([...hiddenInput]),
          ),
        ],
      )
    },
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'combobox-open',
    snapshot: snapshot(
      comboboxRoot({
        open: true,
        highlightedValue: 'banana',
        side: 'top',
        align: 'end',
        sideOffset: 4,
      }),
    ),
  },
  {
    id: 'combobox-filtered',
    snapshot: snapshot(comboboxRoot({ open: true, inputValue: 'blue' })),
  },
  {
    id: 'combobox-empty',
    snapshot: snapshot(comboboxRoot({ open: true, inputValue: 'zz' })),
  },
  {
    id: 'combobox-selected',
    snapshot: snapshot(
      comboboxRoot({ open: true, value: 'banana', highlightedValue: 'banana' }),
    ),
  },
  {
    id: 'combobox-multiple',
    snapshot: snapshot(
      comboboxRoot({
        open: true,
        selectionMode: 'multiple',
        values: ['apple', 'banana'],
        highlightedChipValue: 'banana',
        anchorToChips: true,
      }),
    ),
  },
  {
    id: 'combobox-disabled',
    snapshot: snapshot(
      comboboxRoot({ open: false, isDisabled: true, forceMount: true }),
      suppressedKeyboard,
    ),
  },
]
