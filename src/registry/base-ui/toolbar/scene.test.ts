import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Toolbar from './index'
import type {
  ToolbarChildAttributes,
  ToolbarChildDescriptor,
  ToolbarItemAttributes,
  ViewConfig,
} from './index'

// MODEL

const Model = S.Struct({
  highlightedValue: S.String,
  inputValue: S.String,
  lastFocusSelector: S.String,
  lastPressedValue: S.String,
})
type Model = typeof Model.Type

const initialModel: Model = {
  highlightedValue: '',
  inputValue: '',
  lastFocusSelector: '',
  lastPressedValue: '',
}

// MESSAGE

const ChangedInput = m('ChangedInput', {
  itemValue: S.String,
  value: S.String,
})
const HighlightedItem = m('HighlightedItem', {
  focusSelector: S.String,
  value: S.String,
})
const PressedItem = m('PressedItem', { value: S.String })

const Message = S.Union([ChangedInput, HighlightedItem, PressedItem])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedInput: ({ value }) => [
        evo(model, { inputValue: () => value }),
        [],
      ],
      HighlightedItem: ({ focusSelector, value }) => [
        evo(model, {
          highlightedValue: () => value,
          lastFocusSelector: () => focusSelector,
        }),
        [],
      ],
      PressedItem: ({ value }) => [
        evo(model, { lastPressedValue: () => value }),
        [],
      ],
    }),
  )

// VIEW

const defaultChildren = (
  model: Model,
): ReadonlyArray<ToolbarChildDescriptor> => [
  { id: 'toolbar-bold', value: 'bold', label: 'Bold' },
  {
    id: 'toolbar-docs',
    value: 'docs',
    label: 'Docs',
    kind: 'link',
    href: '#docs',
  },
  {
    id: 'toolbar-formatting',
    value: 'formatting',
    label: 'Formatting',
    kind: 'group',
    items: [
      { id: 'toolbar-italic', value: 'italic', label: 'Italic' },
      {
        id: 'toolbar-underline',
        value: 'underline',
        label: 'Underline',
      },
    ],
  },
  {
    id: 'toolbar-search',
    value: 'search',
    label: 'Search',
    kind: 'input',
    inputValue: model.inputValue,
    placeholder: 'Find command',
  },
]

type TestToolbarConfig = Omit<
  ViewConfig<Message>,
  'children' | 'highlightedValue' | 'toView'
> &
  Readonly<{
    buildChildren?: (model: Model) => ReadonlyArray<ToolbarChildDescriptor>
  }>

const renderItem = (
  h: ReturnType<typeof html<Message>>,
  attributes: ToolbarItemAttributes<Message>,
): Html => {
  const label = attributes.item.label ?? attributes.item.value

  if (attributes.kind === 'link') {
    return h.a([...attributes.root], [label])
  }

  if (attributes.kind === 'input') {
    return h.label([], [label, h.input([...attributes.root])])
  }

  if (attributes.item.isNativeButton === false) {
    return h.div([...attributes.root], [label])
  }

  return h.button([...attributes.root], [label])
}

const renderChild = (
  h: ReturnType<typeof html<Message>>,
  child: ToolbarChildAttributes<Message>,
): Html => {
  if (child._tag === 'Group') {
    return h.div(
      [...child.group.root],
      child.group.items.map(item => renderItem(h, item)),
    )
  }

  return renderItem(h, child.item)
}

const viewToolbar =
  (config: TestToolbarConfig) =>
  (model: Model): Html => {
    const h = html<Message>()
    const { buildChildren, ...toolbarConfig } = config

    return Toolbar.view<Message>({
      children:
        buildChildren === undefined
          ? defaultChildren(model)
          : buildChildren(model),
      highlightedValue:
        model.highlightedValue.length === 0
          ? undefined
          : model.highlightedValue,
      onHighlightChange: change =>
        HighlightedItem({
          value: change.value,
          focusSelector: change.focusSelector ?? '',
        }),
      onInputValueChange: change =>
        ChangedInput({
          itemValue: change.itemValue,
          value: change.value,
        }),
      onItemPress: press => PressedItem({ value: press.value }),
      ...toolbarConfig,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            ...attributes.children.map(child => renderChild(h, child)),
            h.p([], [`Pressed ${model.lastPressedValue}`]),
            h.p([], [`Input ${model.inputValue}`]),
            h.p([], [`Focus ${model.lastFocusSelector}`]),
          ],
        ),
    })
  }

describe('base-ui/toolbar', () => {
  test('renders root, group, button, link, and input attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewToolbar({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('toolbar')).toHaveAttr('role', 'toolbar'),
        Scene.expect(Scene.role('toolbar')).toHaveAttr(
          'aria-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.role('toolbar')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.role('group')).toHaveAttr('role', 'group'),
        Scene.expect(Scene.role('group')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.role('button', { name: 'Bold' })).toHaveAttr(
          'type',
          'button',
        ),
        Scene.expect(Scene.role('button', { name: 'Bold' })).toHaveAttr(
          'data-focusable',
        ),
        Scene.expect(Scene.role('link', { name: 'Docs' })).toHaveAttr(
          'href',
          '#docs',
        ),
        Scene.expect(Scene.label('Search')).toHaveAttr(
          'placeholder',
          'Find command',
        ),
        Scene.expect(Scene.label('Search')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
      )
    }).not.toThrow()
  })

  test('roves focus metadata across top-level items and grouped items', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewToolbar({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#toolbar-bold')).toHaveAttr(
          'tabIndex',
          '0',
        ),
        Scene.expect(Scene.selector('#toolbar-docs')).toHaveAttr(
          'tabIndex',
          '-1',
        ),
        Scene.keydown(Scene.selector('#toolbar-bold'), 'ArrowRight'),
        Scene.expect(Scene.selector('#toolbar-docs')).toHaveAttr(
          'tabIndex',
          '0',
        ),
        Scene.expect(Scene.text('Focus #toolbar-docs')).toExist(),
        Scene.keydown(Scene.selector('#toolbar-docs'), 'ArrowRight'),
        Scene.expect(Scene.selector('#toolbar-italic')).toHaveAttr(
          'tabIndex',
          '0',
        ),
        Scene.keydown(Scene.selector('#toolbar-italic'), 'End'),
        Scene.expect(Scene.selector('#toolbar-search')).toHaveAttr(
          'tabIndex',
          '0',
        ),
        Scene.keydown(Scene.selector('#toolbar-search'), 'ArrowRight'),
        Scene.expect(Scene.selector('#toolbar-bold')).toHaveAttr(
          'tabIndex',
          '0',
        ),
      )
    }).not.toThrow()
  })

  test('respects vertical orientation and rtl horizontal navigation', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewToolbar({ orientation: 'vertical' }) },
        Scene.with(initialModel),
        Scene.keydown(Scene.selector('#toolbar-bold'), 'ArrowRight'),
        Scene.expect(Scene.selector('#toolbar-bold')).toHaveAttr(
          'tabIndex',
          '0',
        ),
        Scene.keydown(Scene.selector('#toolbar-bold'), 'ArrowDown'),
        Scene.expect(Scene.selector('#toolbar-docs')).toHaveAttr(
          'tabIndex',
          '0',
        ),
      )
      Scene.scene(
        { update, view: viewToolbar({ dir: 'rtl' }) },
        Scene.with(initialModel),
        Scene.keydown(Scene.selector('#toolbar-bold'), 'ArrowLeft'),
        Scene.expect(Scene.selector('#toolbar-docs')).toHaveAttr(
          'tabIndex',
          '0',
        ),
      )
    }).not.toThrow()
  })

  test('disabled root and groups disable buttons and inputs but not links', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewToolbar({
            isDisabled: true,
            buildChildren: model => defaultChildren(model),
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('toolbar')).toHaveAttr('data-disabled'),
        Scene.expect(Scene.role('button', { name: 'Bold' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Bold' })).toHaveAttr(
          'data-disabled',
        ),
        Scene.expect(Scene.role('button', { name: 'Bold' })).not.toHaveHandler(
          'click',
        ),
        Scene.expect(Scene.label('Search')).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(Scene.label('Search')).not.toHaveAttr('disabled'),
        Scene.expect(Scene.role('group')).toHaveAttr('data-disabled'),
        Scene.expect(Scene.role('link', { name: 'Docs' })).not.toHaveAttr(
          'data-disabled',
        ),
        Scene.expect(Scene.role('link', { name: 'Docs' })).not.toHaveAttr(
          'aria-disabled',
        ),
      )
      Scene.scene(
        {
          update,
          view: viewToolbar({
            buildChildren: () => [
              {
                id: 'disabled-group',
                value: 'disabled-group',
                kind: 'group',
                isDisabled: true,
                items: [
                  {
                    id: 'group-button',
                    value: 'group-button',
                    label: 'Inside',
                  },
                  {
                    id: 'group-link',
                    value: 'group-link',
                    label: 'Group link',
                    kind: 'link',
                    href: '#group-link',
                  },
                ],
              },
            ],
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Inside' })).toHaveAttr(
          'data-disabled',
        ),
        Scene.expect(Scene.role('link', { name: 'Group link' })).not.toHaveAttr(
          'data-disabled',
        ),
      )
    }).not.toThrow()
  })

  test('non-focusable disabled items leave the roving tab stop', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewToolbar({
            buildChildren: () => [
              {
                id: 'first',
                value: 'first',
                label: 'First',
                isDisabled: true,
                isFocusableWhenDisabled: false,
              },
              { id: 'second', value: 'second', label: 'Second' },
            ],
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'First' })).toHaveAttr(
          'disabled',
        ),
        Scene.expect(Scene.role('button', { name: 'First' })).not.toHaveAttr(
          'aria-disabled',
        ),
        Scene.expect(Scene.selector('#first')).toHaveAttr('tabIndex', '-1'),
        Scene.expect(Scene.selector('#second')).toHaveAttr('tabIndex', '0'),
      )
    }).not.toThrow()
  })

  test('activation and input changes return facts to the app model', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewToolbar({}) },
        Scene.with(initialModel),
        Scene.click(Scene.role('button', { name: 'Bold' })),
        Scene.expect(Scene.text('Pressed bold')).toExist(),
        Scene.type(Scene.label('Search'), 'abc'),
        Scene.expect(Scene.text('Input abc')).toExist(),
      )
    }).not.toThrow()
  })
})
