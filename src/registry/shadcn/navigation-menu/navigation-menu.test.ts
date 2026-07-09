/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import { NavigationMenuDemo, navigationMenuExampleViews } from './examples'
import * as NavigationMenu from './index'
import type { NavigationMenuItemDescriptor, ViewConfig } from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

const navigationItems: ReadonlyArray<NavigationMenuItemDescriptor> = [
  { value: 'product', label: 'Product' },
  { value: 'solutions', label: 'Solutions' },
  {
    value: 'docs',
    label: 'Docs',
    kind: 'link',
    href: '/docs',
    isActive: true,
  },
]

// MESSAGE

type Message = never
type ExampleMessage = 'SelectedNavigationMenuValue'
type ExampleModel = Record<string, never>

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
type ExampleUpdateReturn = readonly [
  ExampleModel,
  ReadonlyArray<Command.Command<ExampleMessage>>,
]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]
const exampleUpdate = (
  model: ExampleModel,
  _message: ExampleMessage,
): ExampleUpdateReturn => [model, []]

// VIEW

const viewNavigationMenu =
  (
    config: Omit<ViewConfig<Message>, 'id' | 'items' | 'toView'> &
      Readonly<{ value?: string | undefined }>,
  ) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return NavigationMenu.view<Message>({
      id: 'navigation-menu-test',
      items: navigationItems,
      value: config.value ?? 'product',
      ...config,
      toView: attributes =>
        h.nav(
          [...attributes.root],
          [
            h.ul(
              [...attributes.list],
              attributes.items.map(itemState =>
                h.li(
                  [...itemState.root],
                  NavigationMenu.itemKind(itemState.item) === 'link'
                    ? [h.a([...itemState.link], [itemState.item.label])]
                    : [
                        h.button(
                          [...itemState.trigger],
                          [
                            itemState.item.label,
                            NavigationMenu.chevronDownIcon(itemState.icon),
                          ],
                        ),
                      ],
                ),
              ),
            ),
            h.div(
              [...attributes.portal],
              [
                h.div(
                  [...attributes.positioner.root],
                  [
                    h.nav(
                      [...attributes.popup.root],
                      [
                        h.div(
                          [...attributes.viewport.root],
                          attributes.items
                            .filter(itemState => itemState.content.isMounted)
                            .map(itemState =>
                              h.div(
                                [...itemState.content.root],
                                [`${itemState.item.label} panel`],
                              ),
                            ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
    })
  }

describe('shadcn/navigation-menu class helpers', () => {
  test('uses origin root, list, trigger, and content class strings', () => {
    expect(NavigationMenu.navigationMenuClassName()).toBe(
      'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
    )
    expect(NavigationMenu.navigationMenuListClassName()).toBe(
      'group flex flex-1 list-none items-center justify-center gap-0',
    )
    expect(NavigationMenu.navigationMenuTriggerStyle()).toContain(
      'group/navigation-menu-trigger inline-flex h-9 w-max',
    )
    expect(NavigationMenu.navigationMenuContentClassName()).toContain(
      'transition-[opacity,transform,translate]',
    )
  })

  test('uses origin positioner, popup, viewport, and link class strings', () => {
    expect(NavigationMenu.navigationMenuPositionerClassName()).toContain(
      'h-(--positioner-height)',
    )
    expect(NavigationMenu.navigationMenuPopupClassName()).toContain(
      'w-(--popup-width)',
    )
    expect(NavigationMenu.navigationMenuViewportClassName()).toBe(
      'relative size-full overflow-hidden',
    )
    expect(NavigationMenu.navigationMenuLinkClassName()).toContain(
      'data-active:bg-muted/50',
    )
  })

  test('preserves custom classes through local cn canonicalization', () => {
    expect(
      NavigationMenu.navigationMenuTriggerStyle({
        className: 'custom-trigger',
      }),
    ).toContain('custom-trigger')
    expect(
      NavigationMenu.navigationMenuContentClassName({
        className: 'w-auto w-96 custom-content',
      }),
    ).toContain('w-96')
    expect(
      NavigationMenu.navigationMenuLinkClassName({
        className: 'custom-link',
      }),
    ).toContain('custom-link')
  })
})

describe('shadcn/navigation-menu view', () => {
  test('adds shadcn slots and classes while preserving Base UI navigation menu attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewNavigationMenu({
            contentClassName: 'custom-content',
            popupClassName: 'custom-popup',
            viewportClassName: 'custom-viewport',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="navigation-menu"]'),
        ).toHaveAttr('data-side', 'bottom'),
        Scene.expect(
          Scene.selector('[data-slot="navigation-menu-list"]'),
        ).toHaveAttr('data-orientation', 'horizontal'),
        Scene.expect(
          Scene.selector('[data-slot="navigation-menu-item"]'),
        ).toHaveAttr('data-value', 'product'),
        Scene.expect(
          Scene.selector('[data-slot="navigation-menu-trigger"]'),
        ).toHaveAttr(
          'class',
          NavigationMenu.navigationMenuTriggerStyle({ className: 'group' }),
        ),
        Scene.expect(
          Scene.selector('[data-slot="navigation-menu-content"]'),
        ).toHaveAttr(
          'class',
          NavigationMenu.navigationMenuContentClassName({
            className: 'custom-content',
          }),
        ),
        Scene.expect(
          Scene.selector('#navigation-menu-test-positioner'),
        ).toHaveAttr(
          'class',
          NavigationMenu.navigationMenuPositionerClassName(),
        ),
        Scene.expect(Scene.selector('#navigation-menu-test-popup')).toHaveAttr(
          'class',
          NavigationMenu.navigationMenuPopupClassName({
            className: 'custom-popup',
          }),
        ),
        Scene.expect(
          Scene.selector('#navigation-menu-test-viewport'),
        ).toHaveAttr(
          'class',
          NavigationMenu.navigationMenuViewportClassName({
            className: 'custom-viewport',
          }),
        ),
        Scene.expect(
          Scene.selector('[data-slot="navigation-menu-link"]'),
        ).toHaveAttr('data-active', ''),
        Scene.expect(
          Scene.selector('#navigation-menu-test-positioner'),
        ).toHaveAttr('data-side-offset', '8'),
      )
    }).not.toThrow()
  })

  test('passes RTL, disabled, transition, and Base UI value state through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewNavigationMenu({
            dir: 'rtl',
            isDisabled: true,
            transitionStatus: 'starting',
            value: 'solutions',
            viewportActivationDirection: 'right',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="navigation-menu"]'),
        ).toHaveAttr('dir', 'rtl'),
        Scene.expect(
          Scene.selector('[data-slot="navigation-menu-content"]'),
        ).toHaveAttr('dir', 'rtl'),
        Scene.expect(
          Scene.selector('[data-slot="navigation-menu-trigger"]'),
        ).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(
          Scene.selector('#navigation-menu-test-content-solutions'),
        ).toHaveAttr('data-starting-style', ''),
        Scene.expect(
          Scene.selector('#navigation-menu-test-content-solutions'),
        ).toHaveAttr('data-activation-direction', 'right'),
      )
    }).not.toThrow()
  })
})

describe('shadcn/navigation-menu examples', () => {
  test('exports dossier-backed demo views', () => {
    expect(navigationMenuExampleViews.map(example => example.id)).toStrictEqual(
      ['shadcn/navigation-menu-demo', 'shadcn/navigation-menu-rtl'],
    )
    expect(() => NavigationMenuDemo()).not.toThrow()
  })

  test('NavigationMenuDemo matches the origin base-ui example content', () => {
    expect(() => {
      Scene.scene(
        {
          update: exampleUpdate,
          view: () =>
            NavigationMenuDemo<ExampleMessage>({
              valueFor: () => 'components',
              onValueChange: () => 'SelectedNavigationMenuValue',
            }),
        },
        Scene.with({}),
        Scene.expect(
          Scene.selector(
            '[data-slot="navigation-menu-item"][data-value="components"]',
          ),
        ).toHaveAttr('class', 'relative hidden md:flex'),
        Scene.expect(
          Scene.text(
            'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
          ),
        ).toExist(),
        Scene.expect(
          Scene.text(
            'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
          ),
        ).toExist(),
      )
    }).not.toThrow()
  })
})
