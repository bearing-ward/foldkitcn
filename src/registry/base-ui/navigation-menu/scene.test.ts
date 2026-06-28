import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as NavigationMenu from './index'
import type { NavigationMenuItemDescriptor, ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  value: S.optional(S.String),
  lastReason: NavigationMenu.NavigationMenuValueChangeReason,
  lastPreviousValue: S.optional(S.String),
  lastFocusSelector: S.optional(S.String),
  lastActivationDirection: S.optional(
    NavigationMenu.NavigationMenuActivationDirection,
  ),
})
type Model = typeof Model.Type

const initialModel: Model = {
  value: undefined,
  lastReason: 'none',
  lastPreviousValue: undefined,
  lastFocusSelector: undefined,
  lastActivationDirection: undefined,
}

const navigationItems: ReadonlyArray<NavigationMenuItemDescriptor> = [
  {
    value: 'product',
    label: 'Product',
    textValue: 'Product',
  },
  {
    value: 'solutions',
    label: 'Solutions',
    textValue: 'Solutions',
  },
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

// MESSAGE

const ChangedNavigationMenuValue = m('ChangedNavigationMenuValue', {
  value: S.optional(S.String),
  reason: NavigationMenu.NavigationMenuValueChangeReason,
  previousValue: S.optional(S.String),
  focusSelector: S.optional(S.String),
  activationDirection: S.optional(
    NavigationMenu.NavigationMenuActivationDirection,
  ),
})

const Message = S.Union([ChangedNavigationMenuValue])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedNavigationMenuValue: ({
        activationDirection,
        focusSelector,
        previousValue,
        reason,
        value,
      }) => [
        evo(model, {
          value: () => value,
          lastReason: () => reason,
          lastPreviousValue: () => previousValue,
          lastFocusSelector: () => focusSelector,
          lastActivationDirection: () => activationDirection,
        }),
        [],
      ],
    }),
  )

// VIEW

const contentText = (item: NavigationMenuItemDescriptor): string =>
  `${item.label} panel`

const viewNavigationMenu =
  (
    config: Omit<
      ViewConfig<Message>,
      'id' | 'items' | 'onValueChange' | 'toView' | 'value'
    >,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return NavigationMenu.view<Message>({
      id: 'site-nav',
      items: navigationItems,
      value: model.value,
      onValueChange: change => ChangedNavigationMenuValue(change),
      ...config,
      toView: attributes =>
        h.nav(
          [...attributes.root],
          [
            h.ul(
              [...attributes.list],
              attributes.items.map(itemAttributes =>
                h.li(
                  [...itemAttributes.root],
                  itemAttributes.item.kind === 'link'
                    ? [
                        h.a(
                          [...itemAttributes.link],
                          [itemAttributes.item.label],
                        ),
                      ]
                    : [
                        h.button(
                          [...itemAttributes.trigger],
                          [
                            itemAttributes.item.label,
                            h.span([...itemAttributes.icon], ['▼']),
                          ],
                        ),
                      ],
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
                        h.nav(
                          [...attributes.popup.root],
                          [
                            h.div(
                              [...attributes.viewport.root],
                              attributes.items
                                .filter(
                                  itemAttributes =>
                                    itemAttributes.content.isMounted,
                                )
                                .map(itemAttributes =>
                                  h.div(
                                    [...itemAttributes.content.root],
                                    [contentText(itemAttributes.item)],
                                  ),
                                ),
                            ),
                            h.div([...attributes.arrow.root], []),
                          ],
                        ),
                      ],
                    ),
                  ]
                : [],
            ),
            h.p([], [`Value ${model.value ?? 'none'}`]),
            h.p([], [`Reason ${model.lastReason}`]),
            h.p([], [`Previous ${model.lastPreviousValue ?? 'none'}`]),
            h.p([], [`Focus ${model.lastFocusSelector ?? 'none'}`]),
            h.p([], [`Direction ${model.lastActivationDirection ?? 'none'}`]),
          ],
        ),
    })
  }

describe('base-ui/navigation-menu helpers', () => {
  test('resolves ids, active item, open state, and roving item navigation', () => {
    expect(NavigationMenu.listId({ id: 'site-nav' })).toBe('site-nav-list')
    expect(
      NavigationMenu.activeItem({
        items: navigationItems,
        value: 'product',
      })?.value,
    ).toBe('product')
    expect(
      NavigationMenu.isOpen({
        items: navigationItems,
        value: 'docs',
      }),
    ).toBeFalsy()
    expect(
      NavigationMenu.nextEnabledItem(
        {
          items: navigationItems,
          value: 'product',
        },
        'next',
      )?.value,
    ).toBe('solutions')
    expect(
      NavigationMenu.nextEnabledItem(
        {
          items: navigationItems,
          value: 'solutions',
        },
        'next',
      )?.value,
    ).toBe('docs')
  })

  test('builds typed value changes and command selectors', () => {
    expect(
      NavigationMenu.valueChange(
        'solutions',
        'trigger-hover',
        'product',
        '#site-nav-popup',
        'right',
      ),
    ).toStrictEqual({
      value: 'solutions',
      reason: 'trigger-hover',
      previousValue: 'product',
      focusSelector: '#site-nav-popup',
      activationDirection: 'right',
    })
    const openCommand = NavigationMenu.commandForValueChange(
      { id: 'site-nav', items: navigationItems },
      NavigationMenu.valueChange('product', 'trigger-press'),
    )
    const closeCommand = NavigationMenu.commandForValueChange(
      { id: 'site-nav', items: navigationItems },
      NavigationMenu.valueChange(undefined, 'escape-key', 'product'),
    )

    expect(openCommand.name).toBe('FocusNavigationMenu')
    expect(openCommand.args).toStrictEqual({ selector: '#site-nav-popup' })
    expect(closeCommand.name).toBe('RestoreNavigationMenuFocus')
    expect(closeCommand.args).toStrictEqual({
      selector: '#site-nav-trigger-product',
    })
  })
})

describe('base-ui/navigation-menu view', () => {
  test('renders root, list, item, trigger, content, viewport, positioner, popup, arrow, backdrop, link, data attributes, and ARIA', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewNavigationMenu({
            side: 'top',
            align: 'end',
            sideOffset: 8,
            viewportActivationDirection: 'right',
          }),
        },
        Scene.with({ ...initialModel, value: 'product' }),
        Scene.expect(Scene.selector('#site-nav')).toHaveAttr('data-open', ''),
        Scene.expect(Scene.selector('#site-nav-list')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.selector('#site-nav-item-product')).toHaveAttr(
          'data-value',
          'product',
        ),
        Scene.expect(Scene.role('button', { name: 'Product▼' })).toHaveAttr(
          'aria-expanded',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Product▼' })).toHaveAttr(
          'aria-controls',
          'site-nav-popup',
        ),
        Scene.expect(
          Scene.selector('#site-nav-trigger-product-icon'),
        ).toHaveAttr('data-popup-open', ''),
        Scene.expect(Scene.selector('#site-nav-content-product')).toHaveAttr(
          'data-activation-direction',
          'right',
        ),
        Scene.expect(Scene.selector('#site-nav-positioner')).toHaveAttr(
          'data-side',
          'top',
        ),
        Scene.expect(Scene.selector('#site-nav-popup')).toHaveAttr(
          'tabIndex',
          '-1',
        ),
        Scene.expect(Scene.selector('#site-nav-viewport')).toHaveText(
          'Product panel',
        ),
        Scene.expect(Scene.selector('#site-nav-arrow')).toHaveAttr(
          'aria-hidden',
          'true',
        ),
        Scene.expect(Scene.selector('#site-nav-backdrop')).toHaveAttr(
          'role',
          'presentation',
        ),
        Scene.expect(Scene.role('link', { name: 'Docs' })).toHaveAttr(
          'aria-current',
          'page',
        ),
      )
    }).not.toThrow()
  })

  test('emits trigger press, hover, list keyboard, trigger keyboard, link press, backdrop, and escape facts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewNavigationMenu({}) },
        Scene.with(initialModel),
        Scene.click(Scene.role('button', { name: 'Product▼' })),
        Scene.expect(Scene.text('Value product')).toBeVisible(),
        Scene.expect(Scene.text('Reason trigger-press')).toBeVisible(),
        Scene.with({ ...initialModel, value: 'product' }),
        Scene.hover(Scene.role('button', { name: 'Solutions▼' })),
        Scene.expect(Scene.text('Value solutions')).toBeVisible(),
        Scene.expect(Scene.text('Reason trigger-hover')).toBeVisible(),
        Scene.expect(Scene.text('Direction right')).toBeVisible(),
        Scene.with({ ...initialModel, value: 'product' }),
        Scene.keydown(Scene.selector('#site-nav-list'), 'ArrowRight'),
        Scene.expect(Scene.text('Value solutions')).toBeVisible(),
        Scene.expect(Scene.text('Reason list-navigation')).toBeVisible(),
        Scene.with(initialModel),
        Scene.keydown(Scene.role('button', { name: 'Product▼' }), 'ArrowDown'),
        Scene.expect(Scene.text('Value product')).toBeVisible(),
        Scene.expect(Scene.text('Reason list-navigation')).toBeVisible(),
        Scene.with({ ...initialModel, value: 'product' }),
        Scene.click(Scene.role('link', { name: 'Docs' })),
        Scene.expect(Scene.text('Value none')).toBeVisible(),
        Scene.expect(Scene.text('Reason link-press')).toBeVisible(),
        Scene.expect(Scene.text('Focus #site-nav-link-docs')).toBeVisible(),
        Scene.with({ ...initialModel, value: 'product' }),
        Scene.click(Scene.selector('#site-nav-backdrop')),
        Scene.expect(Scene.text('Reason outside-press')).toBeVisible(),
        Scene.with({ ...initialModel, value: 'product' }),
        Scene.keydown(Scene.selector('#site-nav-popup'), 'Escape'),
        Scene.expect(Scene.text('Reason escape-key')).toBeVisible(),
      )
    }).not.toThrow()
  })

  test('renders force-mounted closed content and suppresses disabled trigger interactions', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewNavigationMenu({
            forceMount: true,
            isDisabled: true,
            orientation: 'vertical',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#site-nav')).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(Scene.selector('#site-nav-list')).toHaveAttr(
          'data-orientation',
          'vertical',
        ),
        Scene.expect(Scene.selector('#site-nav-popup')).toHaveAttr(
          'hidden',
          'true',
        ),
        Scene.expect(Scene.selector('#site-nav-positioner')).toHaveAttr(
          'inert',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Product▼' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(
          Scene.role('button', { name: 'Product▼' }),
        ).not.toHaveHandler('click'),
      )
    }).not.toThrow()
  })
})
