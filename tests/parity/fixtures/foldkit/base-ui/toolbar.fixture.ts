import { html } from 'foldkit/html'

import * as Toolbar from '../../../../../src/registry/base-ui/toolbar'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

const horizontalKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowRight: 'focuses',
  ArrowLeft: 'focuses',
  Home: 'focuses',
  End: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const verticalKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowDown: 'focuses',
  ArrowUp: 'focuses',
  Home: 'focuses',
  End: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const defaultChildren = (
  inputValue = '',
): ReadonlyArray<Toolbar.ToolbarChildDescriptor> => [
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
    kind: 'input',
    inputValue,
    placeholder: 'Find command',
  },
]

const renderItem = (
  h: ReturnType<typeof html<never>>,
  attributes: Toolbar.ToolbarItemAttributes<never>,
) => {
  const label = attributes.item.label ?? attributes.item.value

  if (attributes.kind === 'link') {
    return h.a([...attributes.root], [label])
  }

  if (attributes.kind === 'input') {
    return h.input([...attributes.root])
  }

  return h.button([...attributes.root], [label])
}

const renderChild = (
  h: ReturnType<typeof html<never>>,
  child: Toolbar.ToolbarChildAttributes<never>,
) => {
  if (child._tag === 'Group') {
    return h.div(
      [...child.group.root],
      child.group.items.map(item => renderItem(h, item)),
    )
  }

  return renderItem(h, child.item)
}

const toolbarRoot = (config: Omit<Toolbar.ViewConfig<never>, 'toView'>) =>
  Toolbar.view<never>({
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        attributes.children.map(child => renderChild(h, child)),
      )
    },
  })

const snapshot = (
  config: Omit<Toolbar.ViewConfig<never>, 'toView'>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = horizontalKeyboard,
): FixtureSnapshot => snapshotHtml(toolbarRoot(config), keyboardBehavior)

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'toolbar-default',
    snapshot: snapshot({
      children: defaultChildren(),
      highlightedValue: 'bold',
    }),
  },
  {
    id: 'toolbar-vertical-disabled',
    snapshot: snapshot(
      {
        children: defaultChildren('Find'),
        highlightedValue: 'bold',
        isDisabled: true,
        orientation: 'vertical',
      },
      verticalKeyboard,
    ),
  },
  {
    id: 'toolbar-nonfocusable-disabled',
    snapshot: snapshot({
      children: [
        {
          id: 'toolbar-disabled',
          value: 'disabled',
          label: 'Disabled',
          isDisabled: true,
          isFocusableWhenDisabled: false,
        },
        { id: 'toolbar-enabled', value: 'enabled', label: 'Enabled' },
      ],
    }),
  },
]
