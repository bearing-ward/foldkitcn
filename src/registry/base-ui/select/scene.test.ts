import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Select from './index'
import type { SelectItemDescriptor, ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  open: S.Boolean,
  value: S.optional(S.String),
  highlightedValue: S.optional(S.String),
  lastOpenReason: Select.SelectOpenChangeReason,
  lastValueReason: Select.SelectValueChangeReason,
  lastHighlightReason: Select.SelectHighlightChangeReason,
})
type Model = typeof Model.Type

const initialModel: Model = {
  open: false,
  value: undefined,
  highlightedValue: undefined,
  lastOpenReason: 'none',
  lastValueReason: 'none',
  lastHighlightReason: 'none',
}

const fruitItems: ReadonlyArray<SelectItemDescriptor> = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes', isDisabled: true },
  { value: 'pineapple', label: 'Pineapple' },
]

// MESSAGE

const ChangedSelectOpen = m('ChangedSelectOpen', {
  open: S.Boolean,
  reason: Select.SelectOpenChangeReason,
})
const ChangedSelectValue = m('ChangedSelectValue', {
  value: S.String,
  label: S.String,
  reason: Select.SelectValueChangeReason,
})
const ChangedSelectHighlight = m('ChangedSelectHighlight', {
  value: S.String,
  reason: Select.SelectHighlightChangeReason,
  focusSelector: S.optional(S.String),
})

const Message = S.Union([
  ChangedSelectOpen,
  ChangedSelectValue,
  ChangedSelectHighlight,
])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedSelectOpen: ({ open, reason }) => [
        evo(model, {
          open: () => open,
          highlightedValue: () =>
            open ? (model.highlightedValue ?? fruitItems[0]?.value) : undefined,
          lastOpenReason: () => reason,
        }),
        [],
      ],
      ChangedSelectValue: ({ value, reason }) => [
        evo(model, {
          open: () => false,
          value: () => value,
          highlightedValue: () => value,
          lastValueReason: () => reason,
        }),
        [],
      ],
      ChangedSelectHighlight: ({ value, reason }) => [
        evo(model, {
          highlightedValue: () => value,
          lastHighlightReason: () => reason,
        }),
        [],
      ],
    }),
  )

// VIEW

const configured = (model: Model): Select.SelectOptions => ({
  id: 'fruit-select',
  items: fruitItems,
  open: model.open,
  value: model.value,
  highlightedValue: model.highlightedValue,
  placeholder: 'Select a fruit',
})

const viewSelect =
  (config: Omit<ViewConfig<Message>, 'id' | 'items' | 'open' | 'toView'>) =>
  (model: Model): Html => {
    const h = html<Message>()

    return Select.view<Message>({
      id: 'fruit-select',
      items: fruitItems,
      open: model.open,
      value: model.value,
      highlightedValue: model.highlightedValue,
      placeholder: 'Select a fruit',
      onOpenChange: change => ChangedSelectOpen(change),
      onValueChange: change => ChangedSelectValue(change),
      onHighlightChange: change => ChangedSelectHighlight(change),
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.button(
              [...attributes.trigger],
              [
                h.span(
                  [...attributes.value],
                  [Select.displayValue(configured(model))],
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
                            h.div([...attributes.scrollDown.root], ['Down']),
                          ],
                        ),
                      ],
                    ),
                  ]
                : [],
            ),
            h.input([...attributes.hiddenInput]),
            h.p([], [`Open ${model.lastOpenReason}`]),
            h.p([], [`Value ${model.lastValueReason}`]),
            h.p([], [`Highlight ${model.lastHighlightReason}`]),
          ],
        ),
    })
  }

describe('base-ui/select helpers', () => {
  test('exposes selected item, display value, and keyboard navigation helpers', () => {
    expect(Select.displayValue(configured(initialModel))).toBe('Select a fruit')
    expect(
      Select.displayValue({ ...configured(initialModel), value: 'banana' }),
    ).toBe('Banana')
    expect(
      Select.nextHighlightedItem(configured(initialModel), 'first')?.value,
    ).toBe('apple')
    expect(
      Select.nextHighlightedItem(
        { ...configured(initialModel), highlightedValue: 'banana' },
        'next',
      )?.value,
    ).toBe('blueberry')
  })

  test('skips disabled items and supports typeahead helpers', () => {
    expect(
      Select.nextHighlightedItem(
        { ...configured(initialModel), highlightedValue: 'blueberry' },
        'next',
      )?.value,
    ).toBe('pineapple')
    expect(
      Select.typeaheadItem(
        { ...configured(initialModel), highlightedValue: 'apple' },
        'b',
      )?.value,
    ).toBe('banana')
  })
})

describe('base-ui/select view', () => {
  test('renders trigger, value, portal, positioner, popup, listbox, group, label, separator, and scroll controls', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSelect({
            align: 'end',
            alignItemWithTrigger: false,
            name: 'fruit',
            side: 'top',
            sideOffset: 4,
          }),
        },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(
          Scene.role('button', { name: 'Select a fruit' }),
        ).toHaveAttr('aria-haspopup', 'listbox'),
        Scene.expect(
          Scene.role('button', { name: 'Select a fruit' }),
        ).toHaveAttr('aria-expanded', 'true'),
        Scene.expect(
          Scene.role('button', { name: 'Select a fruit' }),
        ).toHaveAttr('aria-controls', 'fruit-select-popup'),
        Scene.expect(
          Scene.role('button', { name: 'Select a fruit' }),
        ).toHaveAttr('data-placeholder'),
        Scene.expect(Scene.selector('#fruit-select-positioner')).toHaveAttr(
          'data-side',
          'top',
        ),
        Scene.expect(Scene.selector('#fruit-select-positioner')).toHaveAttr(
          'data-align',
          'end',
        ),
        Scene.expect(Scene.selector('#fruit-select-positioner')).toHaveAttr(
          'data-side-offset',
          '4',
        ),
        Scene.expect(Scene.selector('#fruit-select-popup')).toHaveAttr(
          'role',
          'listbox',
        ),
        Scene.expect(Scene.selector('#fruit-select-popup')).toHaveAttr(
          'popover',
          'manual',
        ),
        Scene.expect(Scene.selector('#fruit-select-popup')).toHaveAttr(
          'data-align-trigger',
          'false',
        ),
        Scene.expect(Scene.selector('#fruit-select-list')).toHaveAttr(
          'role',
          'presentation',
        ),
        Scene.expect(Scene.selector('div[role="group"]')).toExist(),
        Scene.expect(Scene.text('Fruits')).toExist(),
        Scene.expect(Scene.selector('div[role="separator"]')).toHaveAttr(
          'aria-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.selector('#fruit-select-scroll-up')).toHaveText(
          'Up',
        ),
        Scene.expect(Scene.selector('#fruit-select-scroll-down')).toHaveText(
          'Down',
        ),
        Scene.expect(Scene.selector('input[name="fruit"]')).toHaveAttr(
          'value',
          '',
        ),
      )
    }).not.toThrow()
  })

  test('model-owned open, value, and highlight state changes from facts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSelect({}) },
        Scene.with(initialModel),
        Scene.click(Scene.role('button', { name: 'Select a fruit' })),
        Scene.expect(Scene.selector('#fruit-select-popup')).toHaveAttr(
          'data-open',
        ),
        Scene.expect(Scene.text('Open trigger-press')).toExist(),
        Scene.expect(Scene.role('option', { name: 'Banana' })).toHaveHandler(
          'click',
        ),
        Scene.click(Scene.role('option', { name: 'Banana' })),
        Scene.expect(Scene.text('Value item-press')).toExist(),
        Scene.expect(Scene.selector('#fruit-select-trigger')).toHaveAttr(
          'aria-expanded',
          'false',
        ),
        Scene.expect(Scene.text('Banana')).toExist(),
      )
      Scene.scene(
        { update, view: viewSelect({}) },
        Scene.with({ ...initialModel, open: true, highlightedValue: 'apple' }),
        Scene.keydown(Scene.selector('#fruit-select-popup'), 'ArrowDown'),
        Scene.expect(Scene.selector('#fruit-select-item-banana')).toHaveAttr(
          'data-highlighted',
        ),
        Scene.expect(Scene.text('Highlight keyboard-navigation')).toExist(),
        Scene.keydown(Scene.selector('#fruit-select-popup'), 'p'),
        Scene.expect(Scene.selector('#fruit-select-item-pineapple')).toHaveAttr(
          'data-highlighted',
        ),
        Scene.expect(Scene.text('Highlight typeahead')).toExist(),
      )
    }).not.toThrow()
  })

  test('selected, highlighted, disabled, placeholder, data attributes, and hidden input states are deterministic', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSelect({
            forceMount: true,
            isInvalid: true,
            isRequired: true,
            name: 'fruit',
          }),
        },
        Scene.with({
          ...initialModel,
          highlightedValue: 'banana',
          value: 'banana',
        }),
        Scene.expect(Scene.selector('#fruit-select-trigger')).not.toHaveAttr(
          'data-placeholder',
        ),
        Scene.expect(Scene.selector('#fruit-select-item-banana')).toHaveAttr(
          'aria-selected',
          'true',
        ),
        Scene.expect(Scene.selector('#fruit-select-item-banana')).toHaveAttr(
          'data-selected',
        ),
        Scene.expect(Scene.selector('#fruit-select-item-banana')).toHaveAttr(
          'data-highlighted',
        ),
        Scene.expect(Scene.selector('#fruit-select-item-grapes')).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(Scene.selector('#fruit-select-item-grapes')).toHaveAttr(
          'data-disabled',
        ),
        Scene.expect(
          Scene.selector('#fruit-select-item-grapes'),
        ).not.toHaveHandler('click'),
        Scene.expect(Scene.selector('input[name="fruit"]')).toHaveAttr(
          'value',
          'banana',
        ),
        Scene.expect(Scene.selector('input[name="fruit"]')).toHaveAttr(
          'required',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('read-only trigger exposes readonly state and does not open from click or keyboard', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSelect({ isReadOnly: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#fruit-select-trigger')).toHaveAttr(
          'aria-readonly',
          'true',
        ),
        Scene.expect(Scene.selector('#fruit-select-trigger')).toHaveAttr(
          'data-readonly',
        ),
        Scene.expect(
          Scene.role('button', { name: 'Select a fruit' }),
        ).not.toHaveHandler('click'),
        Scene.expect(Scene.selector('#fruit-select-trigger')).toHaveAttr(
          'aria-expanded',
          'false',
        ),
      )
      Scene.scene(
        { update, view: viewSelect({ isReadOnly: true }) },
        Scene.with(initialModel),
        Scene.keydown(Scene.selector('#fruit-select-trigger'), 'Enter'),
        Scene.expect(Scene.selector('#fruit-select-trigger')).toHaveAttr(
          'aria-expanded',
          'false',
        ),
        Scene.expect(Scene.text('Open none')).toExist(),
      )
    }).not.toThrow()
  })

  test('read-only forced-open items do not emit value changes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSelect({ isReadOnly: true }) },
        Scene.with({ ...initialModel, open: true, highlightedValue: 'banana' }),
        Scene.expect(
          Scene.role('option', { name: 'Banana' }),
        ).not.toHaveHandler('click'),
        Scene.expect(
          Scene.role('option', { name: 'Banana' }),
        ).not.toHaveHandler('keydown'),
        Scene.expect(Scene.text('Value none')).toExist(),
      )
    }).not.toThrow()
  })

  test('outside press, Escape, hover, item keyboard select, disabled root, and command helpers preserve public behavior', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSelect({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.click(Scene.selector('div[role="presentation"]')),
        Scene.expect(Scene.text('Open outside-press')).toExist(),
      )
      Scene.scene(
        { update, view: viewSelect({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.keydown(Scene.selector('#fruit-select-popup'), 'Escape'),
        Scene.expect(Scene.text('Open escape-key')).toExist(),
      )
      Scene.scene(
        { update, view: viewSelect({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.hover(Scene.role('option', { name: 'Blueberry' })),
        Scene.expect(Scene.selector('#fruit-select-item-blueberry')).toHaveAttr(
          'data-highlighted',
        ),
        Scene.expect(Scene.text('Highlight item-hover')).toExist(),
      )
      Scene.scene(
        { update, view: viewSelect({}) },
        Scene.with({ ...initialModel, open: true, highlightedValue: 'apple' }),
        Scene.keydown(Scene.role('option', { name: 'Apple' }), 'Enter'),
        Scene.expect(Scene.selector('#fruit-select-trigger')).toHaveAttr(
          'aria-expanded',
          'false',
        ),
        Scene.expect(Scene.text('Apple')).toExist(),
        Scene.expect(Scene.text('Value keyboard-select')).toExist(),
      )
      Scene.scene(
        { update, view: viewSelect({ isDisabled: true, forceMount: true }) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('button', { name: 'Select a fruit' }),
        ).not.toHaveHandler('click'),
        Scene.expect(Scene.selector('#fruit-select-popup')).toHaveAttr(
          'hidden',
        ),
      )
    }).not.toThrow()

    const command = Select.commandForOpenChange(
      { id: 'fruit-select' },
      Select.openChange(false, 'escape-key'),
    )

    expect(command.name).toBe('RestorePopoverFocus')
    expect(command.args).toStrictEqual({
      modal: false,
      selector: '#fruit-select-trigger',
    })
  })
})
