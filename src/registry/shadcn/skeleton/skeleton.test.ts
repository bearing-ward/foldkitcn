/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import { baseClassName, skeletonClassName, view as Skeleton } from './index'
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

const viewSkeleton =
  (config: Omit<ViewConfig<Message>, 'toView'>) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Skeleton<Message>({
      ...config,
      toView: attributes => h.div([...attributes.skeleton], []),
    })
  }

describe('shadcn/skeleton class helper', () => {
  test('uses the exact origin base class string', () => {
    expect(baseClassName).toBe('animate-pulse rounded-md bg-muted')
  })

  test('includes base tokens by default', () => {
    expect(skeletonClassName()).toContain('animate-pulse')
    expect(skeletonClassName()).toContain('rounded-md')
    expect(skeletonClassName()).toContain('bg-muted')
  })

  test('preserves custom className through local cn canonicalization', () => {
    const className = skeletonClassName({
      className: 'custom-skeleton rounded-sm rounded-lg',
    })

    expect(className).toContain('custom-skeleton')
    expect(className).toContain('rounded-lg')
    expect(className).not.toContain('rounded-sm')
  })
})

describe('shadcn/skeleton view', () => {
  test('adds the shadcn data slot and expected classes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSkeleton({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('div')).toHaveAttr('data-slot', 'skeleton'),
        Scene.expect(Scene.selector('div')).toHaveAttr(
          'class',
          skeletonClassName(),
        ),
      )
    }).not.toThrow()
  })
})
