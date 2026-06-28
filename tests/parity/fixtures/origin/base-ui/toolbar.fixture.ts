import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

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

type ItemKind = 'button' | 'input' | 'link'

type SharedItemDefinition = Readonly<{
  href?: string
  id: string
  inputValue?: string
  isDisabled?: boolean
  isFocusableWhenDisabled?: boolean
  label?: string
  placeholder?: string
  value: string
}>

type ItemDefinition = SharedItemDefinition & Readonly<{ kind?: ItemKind }>

type ChildDefinition = SharedItemDefinition &
  Readonly<{ items?: ReadonlyArray<ItemDefinition>; kind?: ItemKind | 'group' }>

type ResolvedItem = Readonly<{
  group?: ChildDefinition
  item: ItemDefinition
}>

type ToolbarConfig = Readonly<{
  children: ReadonlyArray<ChildDefinition>
  highlightedValue?: string
  isDisabled?: boolean
  keyboard?: FixtureSnapshot['keyboardBehavior']
  orientation?: 'horizontal' | 'vertical'
}>

const defaultChildren = (inputValue = ''): ReadonlyArray<ChildDefinition> => [
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

const appendAttributes = (
  element: HTMLElement,
  attributes: Readonly<Record<string, string>>,
): HTMLElement => {
  Object.entries(attributes).map(([name, value]) =>
    element.setAttribute(name, value),
  )

  return element
}

const itemKind = (item: ItemDefinition): ItemKind => item.kind ?? 'button'

const focusableWhenDisabled = (item: ItemDefinition): boolean =>
  item.isFocusableWhenDisabled ?? true

const resolvedItems = (
  children: ReadonlyArray<ChildDefinition>,
): ReadonlyArray<ResolvedItem> =>
  children.flatMap(child =>
    child.kind === 'group'
      ? (child.items ?? []).map(item => ({ group: child, item }))
      : [{ item: child }],
  )

const isItemDisabled = (
  config: Pick<ToolbarConfig, 'isDisabled'>,
  resolvedItem: ResolvedItem,
): boolean =>
  itemKind(resolvedItem.item) === 'link'
    ? false
    : config.isDisabled === true ||
      resolvedItem.group?.isDisabled === true ||
      resolvedItem.item.isDisabled === true

const isNavigableItem = (
  config: Pick<ToolbarConfig, 'isDisabled'>,
  resolvedItem: ResolvedItem,
): boolean =>
  !isItemDisabled(config, resolvedItem) ||
  itemKind(resolvedItem.item) === 'link' ||
  focusableWhenDisabled(resolvedItem.item)

const navigableItems = (
  config: Pick<ToolbarConfig, 'children' | 'isDisabled'>,
): ReadonlyArray<ResolvedItem> =>
  resolvedItems(config.children).filter(item => isNavigableItem(config, item))

const tabbableValue = (
  config: Pick<ToolbarConfig, 'children' | 'highlightedValue' | 'isDisabled'>,
): string | undefined =>
  navigableItems(config).find(
    item => item.item.value === config.highlightedValue,
  )?.item.value ?? navigableItems(config)[0]?.item.value

const disabledAttributes = (
  kind: ItemKind,
  item: ItemDefinition,
  isDisabled: boolean,
): Readonly<Record<string, string>> => {
  if (!isDisabled || kind === 'link') {
    return {}
  }

  if (focusableWhenDisabled(item)) {
    return {
      'aria-disabled': 'true',
      'data-disabled': '',
    }
  }

  return {
    disabled: '',
    'data-disabled': '',
  }
}

const focusableAttributes = (
  kind: ItemKind,
  item: ItemDefinition,
): Readonly<Record<string, string>> => {
  if (kind !== 'button' && kind !== 'input') {
    return {}
  }

  return focusableWhenDisabled(item) ? { 'data-focusable': '' } : {}
}

const createItemElement = (kind: ItemKind): HTMLElement => {
  if (kind === 'link') {
    return document.createElement('a')
  }

  if (kind === 'input') {
    return document.createElement('input')
  }

  return document.createElement('button')
}

const itemAttributes = (
  config: ToolbarConfig,
  resolvedItem: ResolvedItem,
): Readonly<Record<string, string>> => {
  const kind = itemKind(resolvedItem.item)
  const orientation = config.orientation ?? 'horizontal'
  const tabIndex =
    tabbableValue(config) === resolvedItem.item.value ? '0' : '-1'
  const isDisabled = isItemDisabled(config, resolvedItem)

  if (kind === 'link') {
    return {
      ...(resolvedItem.item.href === undefined
        ? {}
        : { href: resolvedItem.item.href }),
      tabindex: tabIndex,
      id: resolvedItem.item.id,
      'data-orientation': orientation,
    }
  }

  if (kind === 'input') {
    return {
      ...(resolvedItem.item.placeholder === undefined
        ? {}
        : { placeholder: resolvedItem.item.placeholder }),
      ...(resolvedItem.item.inputValue === undefined
        ? {}
        : { value: resolvedItem.item.inputValue }),
      tabindex: tabIndex,
      id: resolvedItem.item.id,
      ...disabledAttributes(kind, resolvedItem.item, isDisabled),
      'data-orientation': orientation,
      ...focusableAttributes(kind, resolvedItem.item),
    }
  }

  return {
    type: 'button',
    tabindex: tabIndex,
    id: resolvedItem.item.id,
    ...disabledAttributes(kind, resolvedItem.item, isDisabled),
    'data-orientation': orientation,
    ...focusableAttributes(kind, resolvedItem.item),
  }
}

const renderItem = (
  config: ToolbarConfig,
  resolvedItem: ResolvedItem,
): HTMLElement => {
  const kind = itemKind(resolvedItem.item)
  const element = createItemElement(kind)

  appendAttributes(element, itemAttributes(config, resolvedItem))

  if (kind !== 'input') {
    element.append(
      document.createTextNode(
        resolvedItem.item.label ?? resolvedItem.item.value,
      ),
    )
  }

  return element
}

const groupAttributes = (
  config: ToolbarConfig,
  group: ChildDefinition,
): Readonly<Record<string, string>> => ({
  role: 'group',
  id: group.id,
  'data-orientation': config.orientation ?? 'horizontal',
  ...(config.isDisabled === true || group.isDisabled === true
    ? { 'data-disabled': '' }
    : {}),
})

const renderChild = (
  config: ToolbarConfig,
  child: ChildDefinition,
): HTMLElement => {
  if (child.kind === 'group') {
    const group = appendAttributes(
      document.createElement('div'),
      groupAttributes(config, child),
    )

    const groupItems = child.items ?? []
    groupItems.map(item =>
      group.append(renderItem(config, { group: child, item })),
    )

    return group
  }

  return renderItem(config, { item: child })
}

const toolbarRoot = (config: ToolbarConfig): FixtureSnapshot => {
  const orientation = config.orientation ?? 'horizontal'
  const root = appendAttributes(document.createElement('div'), {
    role: 'toolbar',
    'aria-orientation': orientation,
    'data-orientation': orientation,
    ...(config.isDisabled === true ? { 'data-disabled': '' } : {}),
  })

  config.children.map(child => root.append(renderChild(config, child)))

  document.body.append(root)
  const snapshot = snapshotElement(root, config.keyboard ?? horizontalKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'toolbar-default',
    snapshot: toolbarRoot({
      children: defaultChildren(),
      highlightedValue: 'bold',
    }),
  },
  {
    id: 'toolbar-vertical-disabled',
    snapshot: toolbarRoot({
      children: defaultChildren('Find'),
      highlightedValue: 'bold',
      isDisabled: true,
      keyboard: verticalKeyboard,
      orientation: 'vertical',
    }),
  },
  {
    id: 'toolbar-nonfocusable-disabled',
    snapshot: toolbarRoot({
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
