import { html } from 'foldkit/html'

import * as ShadcnCombobox from '../../../../../src/registry/shadcn/combobox'
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

const fruitItems: ReadonlyArray<ShadcnCombobox.ComboboxItemDescriptor> = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes', isDisabled: true },
]

const snapshot = (
  view: ReturnType<typeof ShadcnCombobox.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => snapshotHtml(view, keyboardBehavior)

const comboboxRoot = (
  config: Omit<
    ShadcnCombobox.ViewConfig<never>,
    'id' | 'inputValue' | 'items' | 'toView'
  > &
    Readonly<{ inputValue?: string }>,
) =>
  ShadcnCombobox.view<never>({
    id: 'profile-combobox',
    items: fruitItems,
    inputValue: config.inputValue ?? '',
    placeholder: 'Select a fruit',
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
                          h.div([...attributes.empty], []),
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
        ],
      )
    },
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'combobox-basic',
    snapshot: snapshot(
      comboboxRoot({ open: true, highlightedValue: 'banana' }),
    ),
  },
  {
    id: 'combobox-filtered',
    snapshot: snapshot(comboboxRoot({ open: true, inputValue: 'blue' })),
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
    id: 'combobox-rtl',
    snapshot: snapshot(
      comboboxRoot({
        open: true,
        dir: 'rtl',
        side: 'inline-start',
        selectionMode: 'multiple',
        values: ['apple'],
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
