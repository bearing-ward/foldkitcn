/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import { inputBaseClassName, inputClassName, view as Input } from './index'
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

const viewInput =
  (config: Omit<ViewConfig<Message>, 'toView'>) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Input<Message>({
      ...config,
      toView: attributes => h.input([...attributes.input]),
    })
  }

describe('shadcn/input class helpers', () => {
  test('exports the base-nova class string', () => {
    expect(inputClassName()).toBe(inputBaseClassName)
    expect(inputClassName()).toContain('h-8')
    expect(inputClassName()).toContain('border-input')
    expect(inputClassName()).toContain('file:h-6')
    expect(inputClassName()).toContain('aria-invalid:border-destructive')
  })

  test('preserves custom className through local cn canonicalization', () => {
    const className = inputClassName({
      className: 'custom-input h-9 h-10',
    })

    expect(className).toContain('custom-input')
    expect(className).toContain('h-10')
    expect(className).not.toContain('h-9')
  })
})

describe('shadcn/input view', () => {
  test('adds slot and class attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewInput({ placeholder: 'Email' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.placeholder('Email')).toHaveAttr(
          'data-slot',
          'input',
        ),
        Scene.expect(Scene.placeholder('Email')).toHaveAttr(
          'class',
          inputClassName(),
        ),
      )
    }).not.toThrow()
  })

  test('passes disabled and invalid attributes through Base UI Input', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewInput({
            isDisabled: true,
            isInvalid: true,
            placeholder: 'Email',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.placeholder('Email')).toHaveAttr('disabled', 'true'),
        Scene.expect(Scene.placeholder('Email')).toHaveAttr(
          'aria-invalid',
          'true',
        ),
        Scene.expect(Scene.placeholder('Email')).toHaveAttr('data-disabled'),
        Scene.expect(Scene.placeholder('Email')).not.toHaveAttr('data-invalid'),
      )
    }).not.toThrow()
  })
})
