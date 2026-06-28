import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type ItemKind = 'trigger' | 'link'
type TransitionStatus = 'starting' | 'ending'

type NavigationItem = Readonly<{
  closeOnClick?: boolean
  href?: string
  isActive?: boolean
  isDisabled?: boolean
  kind?: ItemKind
  label: string
  value: string
}>

type CaseConfig = Readonly<{
  align?: string
  alignOffset?: number
  forceMount?: boolean
  isAnchorHidden?: boolean
  isArrowUncentered?: boolean
  isDisabled?: boolean
  isViewportTransitioning?: boolean
  side?: string
  sideOffset?: number
  transitionStatus?: TransitionStatus
  value?: string
  viewportActivationDirection?: string
}>

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

const navigationItems: ReadonlyArray<NavigationItem> = [
  { value: 'product', label: 'Product' },
  { value: 'solutions', label: 'Solutions' },
  {
    value: 'disabled',
    label: 'Disabled',
    isDisabled: true,
  },
  {
    value: 'docs',
    label: 'Docs',
    kind: 'link',
    href: '/docs',
    isActive: true,
    closeOnClick: true,
  },
]

const setAttributes = (
  element: HTMLElement,
  attributes: Readonly<Record<string, string | undefined>>,
): HTMLElement =>
  Object.entries(attributes).reduce((currentElement, [name, value]) => {
    if (value !== undefined) {
      currentElement.setAttribute(name, value)
    }

    return currentElement
  }, element)

const setBoolean = (
  element: HTMLElement,
  name: string,
  value: boolean | undefined,
): void => {
  if (value === true) {
    element.setAttribute(name, '')
  }
}

const itemKind = (item: NavigationItem): ItemKind => item.kind ?? 'trigger'

const side = (config: CaseConfig): string => config.side ?? 'bottom'

const align = (config: CaseConfig): string => config.align ?? 'center'

const isTriggerItem = (item: NavigationItem): boolean =>
  itemKind(item) === 'trigger'

const activeItem = (config: CaseConfig): NavigationItem | undefined =>
  navigationItems.find(item => item.value === config.value)

const isActiveItem = (config: CaseConfig, item: NavigationItem): boolean =>
  config.value === item.value && isTriggerItem(item)

const isOpen = (config: CaseConfig): boolean => {
  const item = activeItem(config)

  return item !== undefined && isTriggerItem(item)
}

const isMounted = (config: CaseConfig): boolean =>
  isOpen(config) ||
  config.forceMount === true ||
  config.transitionStatus === 'ending'

const isContentMounted = (config: CaseConfig, item: NavigationItem): boolean =>
  isActiveItem(config, item) ||
  config.forceMount === true ||
  config.transitionStatus === 'ending'

const stateAttributes = (
  open: boolean,
): Readonly<Record<string, string | undefined>> =>
  open ? { 'data-open': '' } : { 'data-closed': '' }

const transitionAttributes = (
  transitionStatus: TransitionStatus | undefined,
): Readonly<Record<string, string | undefined>> => {
  if (transitionStatus === 'starting') {
    return { 'data-starting-style': '' }
  }

  if (transitionStatus === 'ending') {
    return { 'data-ending-style': '' }
  }

  return {}
}

const placementAttributes = (
  config: CaseConfig,
): Readonly<Record<string, string | undefined>> => ({
  'data-side': side(config),
  'data-align': align(config),
  'data-side-offset': String(config.sideOffset ?? 0),
  'data-align-offset': String(config.alignOffset ?? 0),
  'data-collision-avoidance': 'true',
  'data-collision-padding': '5',
  'data-arrow-padding': '5',
})

const rootElement = (config: CaseConfig): HTMLElement => {
  const root = setAttributes(document.createElement('nav'), {
    id: 'site-nav',
    ...stateAttributes(isOpen(config)),
    'data-orientation': 'horizontal',
    'data-side': side(config),
    'data-align': align(config),
  })

  setBoolean(root, 'data-disabled', config.isDisabled)
  if (config.isDisabled === true) {
    root.setAttribute('aria-disabled', 'true')
  }

  return root
}

const listElement = (config: CaseConfig): HTMLElement =>
  setAttributes(document.createElement('ul'), {
    id: 'site-nav-list',
    ...stateAttributes(isOpen(config)),
    'data-orientation': 'horizontal',
  })

const itemElement = (item: NavigationItem): HTMLElement => {
  const element = setAttributes(document.createElement('li'), {
    id: `site-nav-item-${item.value}`,
    'data-value': item.value,
  })

  setBoolean(element, 'data-disabled', item.isDisabled)
  setBoolean(element, 'data-active', item.isActive)

  return element
}

const triggerElement = (
  config: CaseConfig,
  item: NavigationItem,
): HTMLElement => {
  const isActive = isActiveItem(config, item)
  const isDisabled = item.isDisabled === true || config.isDisabled === true
  const trigger = setAttributes(document.createElement('button'), {
    id: `site-nav-trigger-${item.value}`,
    type: 'button',
    tabindex: isDisabled ? '-1' : '0',
    'aria-expanded': String(isActive),
    'aria-controls': isActive ? 'site-nav-popup' : undefined,
    'data-base-ui-navigation-menu-trigger': '',
    'data-delay': '50',
    'data-close-delay': '50',
  })
  const icon = setAttributes(document.createElement('span'), {
    id: `site-nav-trigger-${item.value}-icon`,
    'aria-hidden': 'true',
  })

  setBoolean(trigger, 'data-disabled', item.isDisabled)
  setBoolean(trigger, 'data-popup-open', isActive)
  setBoolean(trigger, 'data-open', isActive)
  if (isDisabled) {
    trigger.setAttribute('aria-disabled', 'true')
  }

  setBoolean(icon, 'data-popup-open', isActive)
  icon.append(document.createTextNode('▼'))
  trigger.append(document.createTextNode(item.label), icon)

  return trigger
}

const linkElement = (config: CaseConfig, item: NavigationItem): HTMLElement => {
  const link = setAttributes(document.createElement('a'), {
    id: `site-nav-link-${item.value}`,
    href: item.href ?? '#',
  })

  setBoolean(link, 'data-active', item.isActive)
  setBoolean(link, 'data-disabled', item.isDisabled)
  if (item.isActive === true) {
    link.setAttribute('aria-current', 'page')
  }
  if (config.isDisabled === true || item.isDisabled === true) {
    link.setAttribute('aria-disabled', 'true')
  }

  link.append(document.createTextNode(item.label))

  return link
}

const appendListItems = (list: HTMLElement, config: CaseConfig): void => {
  navigationItems.reduce((currentList, item) => {
    const element = itemElement(item)
    const child =
      itemKind(item) === 'link'
        ? linkElement(config, item)
        : triggerElement(config, item)

    element.append(child)
    currentList.append(element)

    return currentList
  }, list)
}

const backdropElement = (config: CaseConfig): HTMLElement => {
  const element = setAttributes(document.createElement('div'), {
    id: 'site-nav-backdrop',
    role: 'presentation',
    ...stateAttributes(isOpen(config)),
    ...transitionAttributes(config.transitionStatus),
  })

  if (!isOpen(config)) {
    element.setAttribute('hidden', '')
  }

  return element
}

const positionerElement = (config: CaseConfig): HTMLElement => {
  const element = setAttributes(document.createElement('div'), {
    id: 'site-nav-positioner',
    ...stateAttributes(isOpen(config)),
    ...placementAttributes(config),
  })

  setBoolean(element, 'data-anchor-hidden', config.isAnchorHidden)
  if (!isOpen(config)) {
    element.setAttribute('hidden', '')
    element.setAttribute('inert', '')
  }

  return element
}

const contentElement = (
  config: CaseConfig,
  item: NavigationItem,
): HTMLElement => {
  const contentIsOpen = isActiveItem(config, item)
  const element = setAttributes(document.createElement('div'), {
    id: `site-nav-content-${item.value}`,
    ...stateAttributes(contentIsOpen),
    ...transitionAttributes(config.transitionStatus),
    'data-activation-direction': config.viewportActivationDirection,
  })

  if (!contentIsOpen) {
    element.setAttribute('hidden', '')
  }

  element.append(document.createTextNode(`${item.label} panel`))

  return element
}

const viewportElement = (config: CaseConfig): HTMLElement => {
  const element = setAttributes(document.createElement('div'), {
    id: 'site-nav-viewport',
  })

  setBoolean(element, 'data-transitioning', config.isViewportTransitioning)
  navigationItems
    .filter(item => isContentMounted(config, item))
    .reduce((currentElement, item) => {
      currentElement.append(contentElement(config, item))

      return currentElement
    }, element)

  return element
}

const arrowElement = (config: CaseConfig): HTMLElement => {
  const element = setAttributes(document.createElement('div'), {
    id: 'site-nav-arrow',
    'aria-hidden': 'true',
    ...stateAttributes(isOpen(config)),
    'data-side': side(config),
    'data-align': align(config),
  })

  setBoolean(element, 'data-uncentered', config.isArrowUncentered)

  return element
}

const popupElement = (config: CaseConfig): HTMLElement => {
  const popup = setAttributes(document.createElement('nav'), {
    id: 'site-nav-popup',
    tabindex: '-1',
    ...stateAttributes(isOpen(config)),
    ...transitionAttributes(config.transitionStatus),
    ...placementAttributes(config),
  })

  setBoolean(popup, 'data-anchor-hidden', config.isAnchorHidden)
  if (!isOpen(config)) {
    popup.setAttribute('hidden', '')
  }

  popup.append(viewportElement(config), arrowElement(config))

  return popup
}

const portalElement = (config: CaseConfig): HTMLElement => {
  const portal = setAttributes(document.createElement('div'), {
    'data-portal': '',
  })

  if (isMounted(config)) {
    const positioner = positionerElement(config)

    positioner.append(popupElement(config))
    portal.append(backdropElement(config), positioner)
  }

  return portal
}

const navigationMenuRoot = (
  config: CaseConfig,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => {
  const root = rootElement(config)
  const list = listElement(config)

  appendListItems(list, config)
  root.append(list, portalElement(config))
  document.body.append(root)
  const snapshot = snapshotElement(root, keyboardBehavior)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'navigation-menu-open',
    snapshot: navigationMenuRoot({
      value: 'product',
      side: 'top',
      align: 'end',
      sideOffset: 8,
    }),
  },
  {
    id: 'navigation-menu-activation-direction',
    snapshot: navigationMenuRoot({
      value: 'solutions',
      viewportActivationDirection: 'right',
      transitionStatus: 'starting',
    }),
  },
  {
    id: 'navigation-menu-link',
    snapshot: navigationMenuRoot({}),
  },
  {
    id: 'navigation-menu-force-mounted',
    snapshot: navigationMenuRoot({
      forceMount: true,
      alignOffset: 2,
    }),
  },
  {
    id: 'navigation-menu-disabled',
    snapshot: navigationMenuRoot(
      {
        isDisabled: true,
        forceMount: true,
      },
      suppressedKeyboard,
    ),
  },
]
