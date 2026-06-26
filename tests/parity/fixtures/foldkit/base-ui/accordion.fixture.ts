import { html } from 'foldkit/html'

import * as Accordion from '../../../../../src/registry/base-ui/accordion'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

const enabledKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowDown: 'moves-focus',
  ArrowUp: 'moves-focus',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const suppressedKeyboard = {
  click: 'suppressed',
  Enter: 'suppressed',
  Space: 'suppressed',
  ArrowDown: 'suppressed',
  ArrowUp: 'suppressed',
  mousedown: 'suppressed',
  pointerdown: 'suppressed',
}

const items: ReadonlyArray<Accordion.AccordionItemDescriptor> = [
  {
    id: 'shipping-item',
    value: 'shipping',
    label: 'Shipping',
    triggerId: 'shipping-trigger',
    panel: { id: 'shipping-panel', label: 'Shipping panel' },
  },
  {
    id: 'billing-item',
    value: 'billing',
    label: 'Billing',
    triggerId: 'billing-trigger',
    panel: { id: 'billing-panel', label: 'Billing panel', keepMounted: true },
  },
]

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof Accordion.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = enabledKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const accordionRoot = (
  config: Omit<Accordion.ViewConfig<never>, 'items' | 'toView'> &
    Readonly<{ items?: ReadonlyArray<Accordion.AccordionItemDescriptor> }>,
) =>
  Accordion.view<never>({
    value: ['shipping'],
    items,
    ...config,
    toView: attributes => {
      const h = html<never>()

      return h.div(
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
      )
    },
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'accordion-single-open',
    snapshot: snapshot(() => accordionRoot({})),
  },
  {
    id: 'accordion-multiple-open',
    snapshot: snapshot(() =>
      accordionRoot({ multiple: true, value: ['shipping', 'billing'] }),
    ),
  },
  {
    id: 'accordion-disabled',
    snapshot: snapshot(
      () =>
        accordionRoot({
          items: [
            items[0],
            {
              ...items[1],
              isDisabled: true,
            },
          ],
        }),
      suppressedKeyboard,
    ),
  },
  {
    id: 'accordion-hidden-until-found',
    snapshot: snapshot(() =>
      accordionRoot({
        value: [],
        items: [
          {
            ...items[0],
            panel: {
              id: 'shipping-panel',
              label: 'Shipping panel',
              hiddenUntilFound: true,
            },
          },
        ],
      }),
    ),
  },
]
