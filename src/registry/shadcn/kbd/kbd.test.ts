/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  groupView as KbdGroup,
  kbdBaseClassName,
  kbdClassName,
  kbdGroupBaseClassName,
  kbdGroupClassName,
  view as Kbd,
} from './index'
import type { GroupViewConfig, ViewConfig } from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

const viewKbd =
  (config: Omit<ViewConfig<Message>, 'toView'>) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Kbd<Message>({
      ...config,
      toView: attributes => h.kbd([...attributes.kbd], ['K']),
    })
  }

const viewKbdGroup =
  (config: Omit<GroupViewConfig<Message>, 'toView'>) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return KbdGroup<Message>({
      ...config,
      toView: attributes => h.kbd([...attributes.kbdGroup], ['K']),
    })
  }

describe('shadcn/kbd class helpers', () => {
  test('exports the exact origin Kbd base class string', () => {
    expect(kbdBaseClassName).toBe(
      "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
    )
  })

  test('exports the exact origin KbdGroup base class string', () => {
    expect(kbdGroupBaseClassName).toBe('inline-flex items-center gap-1')
  })

  test('preserves custom Kbd classes through local cn canonicalization', () => {
    const className = kbdClassName({ className: 'custom-kbd px-2 px-4' })

    expect(className).toContain('custom-kbd')
    expect(className).toContain('px-4')
    expect(className).not.toContain('px-2')
  })

  test('preserves custom KbdGroup classes through local cn canonicalization', () => {
    const className = kbdGroupClassName({
      className: 'custom-group gap-2 gap-4',
    })

    expect(className).toContain('custom-group')
    expect(className).toContain('gap-4')
    expect(className).not.toContain('gap-2')
  })
})

describe('shadcn/kbd views', () => {
  test('adds the Kbd data slot and expected classes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewKbd({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('kbd')).toHaveAttr('data-slot', 'kbd'),
        Scene.expect(Scene.selector('kbd')).toHaveAttr('class', kbdClassName()),
      )
    }).not.toThrow()
  })

  test('adds the KbdGroup data slot and expected classes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewKbdGroup({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('kbd')).toHaveAttr(
          'data-slot',
          'kbd-group',
        ),
        Scene.expect(Scene.selector('kbd')).toHaveAttr(
          'class',
          kbdGroupClassName(),
        ),
      )
    }).not.toThrow()
  })
})
