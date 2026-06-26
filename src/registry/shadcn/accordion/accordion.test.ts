/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as Accordion from './index'
import type { ViewConfig } from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

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

const items: ReadonlyArray<Accordion.AccordionItemDescriptor> = [
  shippingItem,
  billingItem,
]

const viewAccordion =
  (
    config: Omit<ViewConfig<Message>, 'items' | 'toView' | 'value'> &
      Readonly<{ items?: ReadonlyArray<Accordion.AccordionItemDescriptor> }>,
  ) =>
  (_model: Model): Html =>
    Accordion.view<Message>({
      value: ['shipping'],
      items,
      ...config,
    })

describe('shadcn/accordion class helpers', () => {
  test('use the exact origin root, item, header, and trigger class strings', () => {
    expect(Accordion.accordionBaseClassName).toBe('flex w-full flex-col')
    expect(Accordion.accordionItemBaseClassName).toBe('not-last:border-b')
    expect(Accordion.accordionHeaderBaseClassName).toBe('flex')
    expect(Accordion.accordionTriggerBaseClassName).toContain(
      'group/accordion-trigger relative flex flex-1',
    )
    expect(Accordion.accordionTriggerBaseClassName).toContain(
      '**:data-[slot=accordion-trigger-icon]:text-muted-foreground',
    )
  })

  test('use the exact origin content and icon class strings', () => {
    expect(Accordion.accordionContentBaseClassName).toBe(
      'overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up',
    )
    expect(Accordion.accordionContentInnerBaseClassName).toContain(
      'h-(--accordion-panel-height) pt-0 pb-2.5',
    )
    expect(Accordion.accordionTriggerIconClassName({ isOpen: false })).toBe(
      'pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden',
    )
  })

  test('preserve custom root, item, and trigger classes', () => {
    expect(
      Accordion.accordionClassName({ className: 'custom-accordion flex' }),
    ).toContain('custom-accordion')
    expect(
      Accordion.accordionItemClassName({ className: 'custom-item' }),
    ).toContain('custom-item')
    expect(
      Accordion.accordionTriggerClassName({ className: 'custom-trigger' }),
    ).toContain('custom-trigger')
  })

  test('preserve custom content and icon classes', () => {
    expect(
      Accordion.accordionContentInnerClassName({ className: 'custom-content' }),
    ).toContain('custom-content')
    expect(
      Accordion.accordionTriggerIconClassName({
        className: 'custom-icon',
        isOpen: true,
      }),
    ).toContain('custom-icon')
  })
})

describe('shadcn/accordion view', () => {
  test('adds shadcn root, item, trigger, content, and icon slots', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAccordion({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="accordion"]')).toHaveAttr(
          'class',
          Accordion.accordionClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="accordion-item"]')).toHaveAttr(
          'class',
          Accordion.accordionItemClassName(),
        ),
        Scene.expect(Scene.role('button', { name: 'Shipping' })).toHaveAttr(
          'data-slot',
          'accordion-trigger',
        ),
        Scene.expect(
          Scene.selector('[data-slot="accordion-content"]'),
        ).toHaveAttr('class', Accordion.accordionContentClassName()),
        Scene.expect(
          Scene.selector('[data-slot="accordion-trigger-icon"]'),
        ).toHaveAttr(
          'class',
          Accordion.accordionTriggerIconClassName({ isOpen: false }),
        ),
      )
    }).not.toThrow()
  })

  test('passes Base UI orientation, open, and disabled attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewAccordion({
            orientation: 'horizontal',
            items: [
              shippingItem,
              {
                ...billingItem,
                isDisabled: true,
              },
            ],
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="accordion"]')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.selector('#shipping-item')).toHaveAttr('data-open'),
        Scene.expect(Scene.role('button', { name: 'Billing' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/accordion installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/accordion',
      '@base-ui-components/react/accordion',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
      'shadcn/card',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/accordion/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    const installableSource = `${indexModule.default}\n${examplesModule.default}`

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/accordion/index.ts',
      'src/registry/shadcn/accordion/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSource.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
