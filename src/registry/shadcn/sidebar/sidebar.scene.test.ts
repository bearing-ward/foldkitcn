/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  SidebarControlled,
  SidebarDemo,
  SidebarMenuAction,
  SidebarMenuCollapsible,
  SidebarMenuSub,
  SidebarRtl,
} from './examples'
import * as Sidebar from './index'

// MODEL

type Model = Readonly<{
  open: boolean
  mobileOpen: boolean
  activeItem: string
  direction: Sidebar.SidebarSide
  isMobile: boolean
}>

const initialModel: Model = {
  open: true,
  mobileOpen: false,
  activeItem: 'overview',
  direction: 'left',
  isMobile: false,
}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

const viewSidebar =
  (overrides: Partial<Model> = {}) =>
  (model: Model): Html => {
    const h = html<Message>()
    const nextModel = { ...model, ...overrides }

    return Sidebar.SidebarProvider<Message>({
      dir: nextModel.direction,
      children: [
        Sidebar.Sidebar<Message>({
          id: 'sidebar-scene',
          dir: nextModel.direction,
          open: nextModel.open,
          mobileOpen: nextModel.mobileOpen,
          isMobile: nextModel.isMobile,
          collapsible: 'icon',
          variant: 'sidebar',
          children: [
            Sidebar.SidebarHeader<Message>({
              children: [
                Sidebar.SidebarMenu<Message>({
                  children: [
                    Sidebar.SidebarMenuItem<Message>({
                      children: [
                        Sidebar.SidebarMenuButton<Message>({
                          href: '#',
                          isActive: nextModel.activeItem === 'overview',
                          children: [h.span([], ['Overview'])],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            Sidebar.SidebarContent<Message>({
              children: [
                Sidebar.SidebarMenu<Message>({
                  children: [
                    Sidebar.SidebarMenuItem<Message>({
                      children: [
                        Sidebar.SidebarMenuButton<Message>({
                          href: '#',
                          isActive: nextModel.activeItem === 'projects',
                          children: [h.span([], ['Projects'])],
                        }),
                        Sidebar.SidebarMenuBadge<Message>({ children: ['8'] }),
                      ],
                    }),
                  ],
                }),
                Sidebar.SidebarSeparator<Message>(),
                Sidebar.SidebarMenu<Message>({
                  children: [
                    Sidebar.SidebarMenuItem<Message>({
                      children: [
                        Sidebar.SidebarMenuButton<Message>({
                          href: '#',
                          isActive: nextModel.activeItem === 'documentation',
                          children: [h.span([], ['Documentation'])],
                        }),
                        Sidebar.SidebarMenuSub<Message>({
                          children: [
                            Sidebar.SidebarMenuSubItem<Message>({
                              children: [
                                Sidebar.SidebarMenuSubButton<Message>({
                                  href: '#',
                                  isActive: true,
                                  children: [h.span([], ['Introduction'])],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            Sidebar.SidebarFooter<Message>({
              children: [h.p([], ['Footer'])],
            }),
          ],
        }),
        Sidebar.SidebarInset<Message>({
          children: [
            h.section(
              [h.Class('flex h-12 items-center justify-between px-4')],
              [Sidebar.SidebarTrigger<Message>({}), h.p([], ['Content'])],
            ),
          ],
        }),
      ],
    })
  }

describe('shadcn/sidebar class helpers', () => {
  test('exports origin class helpers for shell, menu, and nested states', () => {
    expect(Sidebar.sidebarProviderClassName()).toContain(
      'group/sidebar-wrapper flex min-h-svh',
    )
    expect(Sidebar.sidebarGapClassName({ variant: 'floating' })).toContain(
      'w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]',
    )
    expect(
      Sidebar.sidebarMenuButtonClassName({ variant: 'outline' }),
    ).toContain('shadow-[0_0_0_1px_var(--sidebar-border)]')
    expect(
      Sidebar.sidebarMenuButtonClassName({ dir: 'rtl', variant: 'outline' }),
    ).toContain('text-start')
    expect(Sidebar.sidebarMenuSubButtonClassName({ dir: 'rtl' })).toContain(
      'rtl:translate-x-px',
    )
  })
})

describe('shadcn/sidebar view', () => {
  test('renders desktop shell slots, active items, and inset content', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSidebar() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="sidebar-wrapper"]')).toExist(),
        Scene.expect(Scene.selector('[data-slot="sidebar"]')).toHaveAttr(
          'data-state',
          'expanded',
        ),
        Scene.expect(Scene.selector('[data-slot="sidebar-inset"]')).toHaveAttr(
          'class',
          Sidebar.sidebarInsetClassName(),
        ),
        Scene.expect(Scene.role('link', { name: 'Overview' })).toHaveAttr(
          'aria-current',
          'page',
        ),
        Scene.expect(
          Scene.selector('[data-slot="sidebar-menu-badge"]'),
        ).toHaveText('8'),
        Scene.expect(
          Scene.selector('[data-slot="sidebar-separator"]'),
        ).toHaveAttr('data-slot', 'sidebar-separator'),
      )
    }).not.toThrow()
  })

  test('renders the mobile sheet branch when mobile state is active', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSidebar({ isMobile: true, mobileOpen: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="sidebar-mobile"]')).toExist(),
      )
    }).not.toThrow()
  })

  test('renders the rtl example', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => SidebarRtl() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[dir="rtl"]')).toExist(),
        Scene.expect(
          Scene.selector('[data-slot="sidebar-menu-button"]'),
        ).toHaveAttr(
          'class',
          Sidebar.sidebarMenuButtonClassName({
            dir: 'rtl',
            size: 'lg',
          }),
        ),
      )
    }).not.toThrow()
  })

  test('renders the demo example', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => SidebarDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="sidebar-header"]')).toHaveText(
          'Acme IncEnterprise',
        ),
        Scene.expect(
          Scene.role('button', { name: 'Toggle Sidebar' }),
        ).toExist(),
      )
    }).not.toThrow()
  })

  test('renders the controlled example', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => SidebarControlled() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Close Sidebar' })).toExist(),
      )
    }).not.toThrow()
  })

  test('renders the menu action example', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => SidebarMenuAction() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'More' })).toExist(),
      )
    }).not.toThrow()
  })

  test('renders the menu collapsible example', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => SidebarMenuCollapsible() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('link', { name: 'Installation' })).toExist(),
      )
    }).not.toThrow()
  })

  test('renders the submenu example', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => SidebarMenuSub() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('link', { name: 'Installation' })).toExist(),
      )
    }).not.toThrow()
  })
})
