import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Combobox from './index'
import type { ComboboxItemDescriptor, ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  open: S.Boolean,
  inputValue: S.String,
  value: S.optional(S.String),
  values: S.Array(S.String),
  highlightedValue: S.optional(S.String),
  highlightedChipValue: S.optional(S.String),
  lastOpenReason: Combobox.ComboboxOpenChangeReason,
  lastInputReason: Combobox.ComboboxInputValueChangeReason,
  lastValueReason: Combobox.ComboboxValueChangeReason,
  lastHighlightReason: Combobox.ComboboxHighlightChangeReason,
  lastChipHighlightReason: Combobox.ComboboxChipHighlightChangeReason,
})
type Model = typeof Model.Type

const initialModel: Model = {
  open: false,
  inputValue: '',
  value: undefined,
  values: [],
  highlightedValue: undefined,
  highlightedChipValue: undefined,
  lastOpenReason: 'none',
  lastInputReason: 'none',
  lastValueReason: 'none',
  lastHighlightReason: 'none',
  lastChipHighlightReason: 'none',
}

const fruitItems: ReadonlyArray<ComboboxItemDescriptor> = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes', isDisabled: true },
  { value: 'pineapple', label: 'Pineapple' },
]

// MESSAGE

const ChangedComboboxOpen = m('ChangedComboboxOpen', {
  open: S.Boolean,
  reason: Combobox.ComboboxOpenChangeReason,
})
const ChangedComboboxInputValue = m('ChangedComboboxInputValue', {
  value: S.String,
  reason: Combobox.ComboboxInputValueChangeReason,
})
const ChangedComboboxValue = m('ChangedComboboxValue', {
  value: S.optional(S.String),
  values: S.Array(S.String),
  label: S.optional(S.String),
  changedValue: S.optional(S.String),
  reason: Combobox.ComboboxValueChangeReason,
})
const ChangedComboboxHighlight = m('ChangedComboboxHighlight', {
  value: S.optional(S.String),
  reason: Combobox.ComboboxHighlightChangeReason,
  focusSelector: S.optional(S.String),
})
const ChangedComboboxChipHighlight = m('ChangedComboboxChipHighlight', {
  value: S.optional(S.String),
  reason: Combobox.ComboboxChipHighlightChangeReason,
  focusSelector: S.optional(S.String),
})

const Message = S.Union([
  ChangedComboboxOpen,
  ChangedComboboxInputValue,
  ChangedComboboxValue,
  ChangedComboboxHighlight,
  ChangedComboboxChipHighlight,
])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedComboboxOpen: ({ open, reason }) => [
        evo(model, {
          open: () => open,
          highlightedValue: () =>
            open
              ? (model.highlightedValue ??
                Combobox.firstFilteredItem({
                  inputValue: model.inputValue,
                  items: fruitItems,
                })?.value)
              : undefined,
          lastOpenReason: () => reason,
        }),
        [],
      ],
      ChangedComboboxInputValue: ({ value, reason }) => [
        evo(model, {
          open: () => value.length > 0,
          inputValue: () => value,
          value: () => (reason === 'input-clear' ? undefined : model.value),
          values: () => (reason === 'input-clear' ? [] : model.values),
          highlightedValue: () =>
            Combobox.firstFilteredItem({
              inputValue: value,
              items: fruitItems,
            })?.value,
          lastInputReason: () => reason,
        }),
        [],
      ],
      ChangedComboboxValue: ({ value, values, label, reason }) => [
        evo(model, {
          open: () => values.length > 1,
          value: () => value,
          values: () => values,
          inputValue: () => label ?? '',
          highlightedValue: () => value,
          highlightedChipValue: () => initialModel.highlightedChipValue,
          lastValueReason: () => reason,
        }),
        [],
      ],
      ChangedComboboxHighlight: ({ value, reason }) => [
        evo(model, {
          highlightedValue: () => value,
          lastHighlightReason: () => reason,
        }),
        [],
      ],
      ChangedComboboxChipHighlight: ({ value, reason }) => [
        evo(model, {
          highlightedChipValue: () => value,
          lastChipHighlightReason: () => reason,
        }),
        [],
      ],
    }),
  )

// VIEW

const configured = (model: Model): Combobox.ComboboxOptions => ({
  id: 'fruit-combobox',
  items: fruitItems,
  open: model.open,
  inputValue: model.inputValue,
  value: model.value,
  values: model.values,
  highlightedValue: model.highlightedValue,
  highlightedChipValue: model.highlightedChipValue,
  placeholder: 'Select a fruit',
})

const viewCombobox =
  (
    config: Omit<
      ViewConfig<Message>,
      'id' | 'inputValue' | 'items' | 'open' | 'toView'
    >,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()
    const options = configured(model)

    return Combobox.view<Message>({
      ...options,
      onOpenChange: change => ChangedComboboxOpen(change),
      onInputValueChange: change => ChangedComboboxInputValue(change),
      onValueChange: change => ChangedComboboxValue(change),
      onHighlightChange: change => ChangedComboboxHighlight(change),
      onChipHighlightChange: change => ChangedComboboxChipHighlight(change),
      ...config,
      toView: attributes =>
        h.div(
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
                                    h.div(
                                      [...attributes.groupLabel],
                                      ['Fruits'],
                                    ),
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
                                h.div([...attributes.separator], []),
                              ],
                            ),
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
            h.p([], [`Open ${model.lastOpenReason}`]),
            h.p([], [`Input ${model.lastInputReason}`]),
            h.p([], [`Value ${model.lastValueReason}`]),
            h.p([], [`Highlight ${model.lastHighlightReason}`]),
            h.p([], [`Chip ${model.lastChipHighlightReason}`]),
          ],
        ),
    })
  }

describe('base-ui/combobox helpers', () => {
  test('filters items, displays values, and skips disabled items', () => {
    expect(
      Combobox.filteredItems({
        inputValue: 'blue',
        items: fruitItems,
      }).map(item => item.value),
    ).toStrictEqual(['blueberry'])
    expect(
      Combobox.enabledItems({
        items: fruitItems,
      }).map(item => item.value),
    ).not.toContain('grapes')
    expect(
      Combobox.displayValue({
        ...configured(initialModel),
        value: 'banana',
      }),
    ).toBe('Banana')
  })

  test('exposes keyboard and chip navigation helpers', () => {
    expect(
      Combobox.nextHighlightedItem(
        { ...configured(initialModel), highlightedValue: 'apple' },
        'next',
      )?.value,
    ).toBe('banana')
    expect(
      Combobox.nextHighlightedChip(
        {
          ...configured(initialModel),
          selectionMode: 'multiple',
          values: ['apple', 'banana'],
          highlightedChipValue: 'banana',
        },
        'previous',
      )?.value,
    ).toBe('apple')
  })
})

describe('base-ui/combobox view', () => {
  test('renders input, trigger, popup, listbox, empty, groups, chips, and hidden input attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCombobox({
            align: 'end',
            name: 'fruit',
            side: 'top',
            sideOffset: 4,
          }),
        },
        Scene.with({
          ...initialModel,
          open: true,
          inputValue: 'zz',
        }),
        Scene.expect(Scene.selector('#fruit-combobox-input')).toHaveAttr(
          'role',
          'combobox',
        ),
        Scene.expect(Scene.selector('#fruit-combobox-input')).toHaveAttr(
          'aria-autocomplete',
          'list',
        ),
        Scene.expect(Scene.selector('#fruit-combobox-input')).toHaveAttr(
          'data-list-empty',
        ),
        Scene.expect(Scene.selector('#fruit-combobox-trigger')).toHaveAttr(
          'aria-haspopup',
          'listbox',
        ),
        Scene.expect(Scene.selector('#fruit-combobox-positioner')).toHaveAttr(
          'data-side',
          'top',
        ),
        Scene.expect(Scene.selector('#fruit-combobox-positioner')).toHaveAttr(
          'data-align',
          'end',
        ),
        Scene.expect(Scene.selector('#fruit-combobox-list')).toHaveAttr(
          'role',
          'listbox',
        ),
        Scene.expect(Scene.selector('#fruit-combobox-empty')).toHaveAttr(
          'aria-live',
          'polite',
        ),
        Scene.expect(Scene.text('No fruit found.')).toExist(),
        Scene.expect(Scene.selector('div[role="group"]')).toExist(),
        Scene.expect(Scene.selector('div[role="separator"]')).toHaveAttr(
          'aria-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.selector('input[name="fruit"]')).toHaveAttr(
          'value',
          '',
        ),
      )
    }).not.toThrow()
  })

  test('model-owned input, filtering, value, highlight, and clear changes are emitted as facts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCombobox({}) },
        Scene.with(initialModel),
        Scene.type(Scene.selector('#fruit-combobox-input'), 'bl'),
        Scene.expect(Scene.text('Input input-change')).toExist(),
        Scene.expect(Scene.role('option', { name: 'Blueberry' })).toExist(),
        Scene.expect(Scene.role('option', { name: 'Apple' })).not.toExist(),
        Scene.click(Scene.role('option', { name: 'Blueberry' })),
        Scene.expect(Scene.text('Value item-press')).toExist(),
        Scene.expect(Scene.selector('#fruit-combobox-input')).toHaveAttr(
          'value',
          'Blueberry',
        ),
        Scene.click(Scene.selector('#fruit-combobox-clear')),
        Scene.expect(Scene.text('Value clear-press')).toExist(),
      )
      Scene.scene(
        {
          update,
          view: viewCombobox({}),
        },
        Scene.with({ ...initialModel, open: true, highlightedValue: 'apple' }),
        Scene.keydown(Scene.selector('#fruit-combobox-input'), 'ArrowDown'),
        Scene.expect(Scene.selector('#fruit-combobox-item-banana')).toHaveAttr(
          'data-highlighted',
        ),
        Scene.expect(Scene.text('Highlight keyboard-navigation')).toExist(),
        Scene.keydown(Scene.selector('#fruit-combobox-input'), 'Enter'),
        Scene.expect(Scene.text('Value keyboard-select')).toExist(),
      )
    }).not.toThrow()
  })

  test('multiple selection chips remove values and keep chip state model-owned', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCombobox({
            selectionMode: 'multiple',
            anchorToChips: true,
            name: 'fruit',
          }),
        },
        Scene.with({
          ...initialModel,
          open: true,
          values: ['apple', 'banana'],
          highlightedChipValue: 'banana',
        }),
        Scene.expect(Scene.selector('#fruit-combobox-chips')).toHaveAttr(
          'role',
          'toolbar',
        ),
        Scene.expect(Scene.selector('#fruit-combobox-popup')).toHaveAttr(
          'data-chips',
        ),
        Scene.expect(Scene.selector('#fruit-combobox-chip-banana')).toHaveAttr(
          'data-highlighted',
        ),
        Scene.click(Scene.selector('#fruit-combobox-chip-banana-remove')),
        Scene.expect(Scene.text('Value chip-remove-press')).toExist(),
        Scene.expect(Scene.text('Banana')).not.toExist(),
      )
      Scene.scene(
        {
          update,
          view: viewCombobox({ selectionMode: 'multiple' }),
        },
        Scene.with({
          ...initialModel,
          values: ['apple', 'banana'],
          highlightedChipValue: 'banana',
        }),
        Scene.keydown(
          Scene.selector('#fruit-combobox-chip-banana'),
          'ArrowLeft',
        ),
        Scene.expect(Scene.selector('#fruit-combobox-chip-apple')).toHaveAttr(
          'data-highlighted',
        ),
        Scene.expect(Scene.text('Chip keyboard-navigation')).toExist(),
        Scene.keydown(Scene.selector('#fruit-combobox-input'), 'Backspace'),
        Scene.expect(Scene.text('Value chip-keyboard-remove')).toExist(),
      )
    }).not.toThrow()
  })

  test('disabled and read-only states suppress interaction, and command helpers reuse Popover commands', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCombobox({ isDisabled: true, forceMount: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#fruit-combobox-input')).toHaveAttr(
          'disabled',
          'true',
        ),
        Scene.expect(
          Scene.selector('#fruit-combobox-trigger'),
        ).not.toHaveHandler('click'),
        Scene.expect(
          Scene.selector('#fruit-combobox-item-apple'),
        ).not.toHaveHandler('click'),
      )
      Scene.scene(
        { update, view: viewCombobox({ isReadOnly: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#fruit-combobox-input')).toHaveAttr(
          'aria-readonly',
          'true',
        ),
        Scene.expect(
          Scene.selector('#fruit-combobox-trigger'),
        ).not.toHaveHandler('click'),
      )
    }).not.toThrow()

    const command = Combobox.commandForOpenChange(
      { id: 'fruit-combobox' },
      Combobox.openChange(false, 'escape-key'),
    )

    expect(command.name).toBe('RestorePopoverFocus')
    expect(command.args).toStrictEqual({
      modal: false,
      selector: '#fruit-combobox-input',
    })
  })
})
