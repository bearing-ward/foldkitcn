import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Accordion from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  value: S.Array(S.String),
  lastReason: Accordion.AccordionChangeReason,
})
type Model = typeof Model.Type

const initialModel: Model = {
  value: ['shipping'],
  lastReason: 'none',
}

// MESSAGE

const ChangedAccordion = m('ChangedAccordion', {
  value: S.Array(S.String),
  reason: Accordion.AccordionChangeReason,
})

const Message = S.Union([ChangedAccordion])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedAccordion: ({ value, reason }) => [
        evo(model, {
          value: () => value,
          lastReason: () => reason,
        }),
        [],
      ],
    }),
  )

// VIEW

const shippingItem: Accordion.AccordionItemDescriptor = {
  id: 'shipping-item',
  value: 'shipping',
  label: 'Shipping',
  triggerId: 'shipping-trigger',
  panel: { id: 'shipping-panel', label: 'Shipping panel' },
}

const billingItem: Accordion.AccordionItemDescriptor = {
  id: 'billing-item',
  value: 'billing',
  label: 'Billing',
  triggerId: 'billing-trigger',
  panel: { id: 'billing-panel', label: 'Billing panel', keepMounted: true },
}

const refundsItem: Accordion.AccordionItemDescriptor = {
  id: 'refunds-item',
  value: 'refunds',
  label: 'Refunds',
  triggerId: 'refunds-trigger',
  panel: { id: 'refunds-panel', label: 'Refunds panel' },
}

const items: ReadonlyArray<Accordion.AccordionItemDescriptor> = [
  shippingItem,
  billingItem,
  refundsItem,
]

const viewAccordion =
  (
    config: Omit<
      ViewConfig<Message>,
      'items' | 'onValueChange' | 'toView' | 'value'
    > &
      Readonly<{ items?: ReadonlyArray<Accordion.AccordionItemDescriptor> }>,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return h.div(
      [],
      [
        Accordion.view<Message>({
          value: model.value,
          items,
          ...config,
          onValueChange: change => ChangedAccordion(change),
          toView: attributes =>
            h.div(
              [...attributes.root],
              attributes.items.map(item =>
                h.div(
                  [...item.root],
                  [
                    h.h3(
                      [...item.header],
                      [
                        h.button(
                          [...item.trigger],
                          [item.item.label ?? item.item.value],
                        ),
                      ],
                    ),
                    item.panel.isMounted
                      ? h.keyed('div')(
                          item.panel.isOpen ? 'open' : 'closed',
                          [...item.panel.root],
                          [item.panel.panel.label ?? item.item.value],
                        )
                      : h.empty,
                  ],
                ),
              ),
            ),
        }),
        h.p([], [`Value ${model.value.join(',')}`]),
        h.p([], [`Reason ${model.lastReason}`]),
      ],
    )
  }

describe('base-ui/accordion', () => {
  test('root, item, trigger, and panel expose ARIA and data attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAccordion({ id: 'faq' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#faq')).toHaveAttr(
          'data-orientation',
          'vertical',
        ),
        Scene.expect(Scene.selector('#shipping-item')).toHaveAttr('data-open'),
        Scene.expect(Scene.selector('#shipping-item')).toHaveAttr(
          'data-index',
          '0',
        ),
        Scene.expect(Scene.role('button', { name: 'Shipping' })).toHaveAttr(
          'aria-expanded',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Shipping' })).toHaveAttr(
          'aria-controls',
          'shipping-panel',
        ),
        Scene.expect(Scene.selector('#shipping-panel')).toHaveAttr(
          'role',
          'region',
        ),
        Scene.expect(Scene.selector('#shipping-panel')).toHaveAttr(
          'aria-labelledby',
          'shipping-trigger',
        ),
        Scene.expect(Scene.selector('#billing-panel')).toHaveAttr('hidden'),
        Scene.expect(Scene.selector('#billing-panel')).toHaveAttr('inert'),
      )
    }).not.toThrow()
  })

  test('single selection toggles one model-owned open item at a time', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAccordion({}) },
        Scene.with(initialModel),
        Scene.click(Scene.role('button', { name: 'Billing' })),
        Scene.expect(Scene.text('Value billing')).toExist(),
        Scene.expect(Scene.text('Reason trigger-press')).toExist(),
        Scene.click(Scene.role('button', { name: 'Billing' })),
        Scene.expect(Scene.text('Value ')).toExist(),
      )
    }).not.toThrow()
  })

  test('multiple selection opens and closes items independently', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAccordion({ multiple: true }) },
        Scene.with(initialModel),
        Scene.click(Scene.role('button', { name: 'Billing' })),
        Scene.expect(Scene.text('Value shipping,billing')).toExist(),
        Scene.click(Scene.role('button', { name: 'Shipping' })),
        Scene.expect(Scene.text('Value billing')).toExist(),
      )
    }).not.toThrow()
  })

  test('disabled items and disabled roots suppress activation', () => {
    const disabledItems: ReadonlyArray<Accordion.AccordionItemDescriptor> = [
      shippingItem,
      { ...billingItem, isDisabled: true },
    ]

    expect(() => {
      Scene.scene(
        { update, view: viewAccordion({ items: disabledItems }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Billing' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(
          Scene.role('button', { name: 'Billing' }),
        ).not.toHaveHandler('click'),
        Scene.expect(
          Scene.role('button', { name: 'Billing' }),
        ).not.toHaveHandler('keydown'),
      )
      Scene.scene(
        { update, view: viewAccordion({ isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('div[data-disabled]')).toHaveAttr(
          'data-disabled',
        ),
        Scene.expect(
          Scene.role('button', { name: 'Shipping' }),
        ).not.toHaveHandler('click'),
      )
    }).not.toThrow()
  })

  test('keyboard activation uses Enter and Space without roving focus', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAccordion({}) },
        Scene.with(initialModel),
        Scene.keydown(Scene.role('button', { name: 'Shipping' }), 'ArrowDown'),
        Scene.expect(Scene.text('Value shipping')).toExist(),
        Scene.keydown(Scene.role('button', { name: 'Shipping' }), 'Home'),
        Scene.expect(Scene.text('Value shipping')).toExist(),
        Scene.keydown(Scene.role('button', { name: 'Refunds' }), 'Enter'),
        Scene.expect(Scene.text('Value refunds')).toExist(),
        Scene.keydown(Scene.role('button', { name: 'Refunds' }), ' '),
        Scene.expect(Scene.text('Value ')).toExist(),
      )
    }).not.toThrow()
  })

  test('orientation is a data attribute and does not drive arrow-key focus', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewAccordion({ orientation: 'horizontal', dir: 'rtl' }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('div[data-orientation]')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
        Scene.keydown(Scene.role('button', { name: 'Shipping' }), 'ArrowLeft'),
        Scene.expect(Scene.text('Value shipping')).toExist(),
      )
    }).not.toThrow()
  })

  test('mounting policy and transition geometry are explicit render inputs', () => {
    const measuredItems: ReadonlyArray<Accordion.AccordionItemDescriptor> = [
      {
        value: 'measured',
        label: 'Measured',
        triggerId: 'measured-trigger',
        transitionStatus: 'starting',
        panel: {
          id: 'measured-panel',
          label: 'Measured panel',
          hiddenUntilFound: true,
          geometry: {
            height: 96,
            width: 240,
          },
        },
      },
    ]

    expect(() => {
      Scene.scene(
        { update, view: viewAccordion({ items: measuredItems }) },
        Scene.with({ ...initialModel, value: [] }),
        Scene.expect(Scene.selector('#measured-panel')).toHaveAttr(
          'hidden',
          'until-found',
        ),
        Scene.expect(Scene.selector('#measured-panel')).toHaveAttr(
          'data-starting-style',
        ),
        Scene.expect(Scene.selector('#measured-panel')).toHaveStyle(
          '--accordion-panel-height',
          '96px',
        ),
        Scene.expect(Scene.selector('#measured-panel')).toHaveStyle(
          '--accordion-panel-width',
          '240px',
        ),
      )
    }).not.toThrow()
  })
})
