/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  InputOTPDisabled,
  InputOTPDemo,
  InputOTPForm,
  InputOTPInvalid,
  InputOTPSeparatorExample,
} from './examples'
import {
  InputOTPGroup,
  inputOTPContainerClassName,
  inputOTPGroupClassName,
  inputOTPInputClassName,
  inputOTPSeparatorClassName,
  inputOTPSlotClassName,
  view as InputOTP,
} from './index'
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

const viewInputOTP =
  (config: Omit<ViewConfig<Message>, 'length' | 'toView'>) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return InputOTP<Message>({
      id: 'otp',
      length: 6,
      value: '123456',
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            InputOTPGroup<Message>({
              attributes,
              indexes: Array.from(
                { length: attributes.state.length },
                (_item, index) => index,
              ),
            }),
          ],
        ),
    })
  }

describe('shadcn/input-otp class helpers', () => {
  test('exports base-nova class strings', () => {
    expect(inputOTPContainerClassName()).toBe(
      'cn-input-otp flex items-center has-disabled:opacity-50',
    )
    expect(inputOTPInputClassName()).toBe('disabled:cursor-not-allowed')
    expect(inputOTPGroupClassName()).toContain(
      'has-aria-invalid:border-destructive',
    )
    expect(inputOTPSlotClassName()).toContain('data-[active=true]:ring-3')
    expect(inputOTPSeparatorClassName()).toContain('flex items-center')
  })

  test('preserves custom className through cn canonicalization', () => {
    expect(
      inputOTPSlotClassName({ className: 'custom size-9 size-10' }),
    ).toContain('size-10')
    expect(
      inputOTPSlotClassName({ className: 'custom size-9 size-10' }),
    ).not.toContain('size-9')
  })
})

describe('shadcn/input-otp view', () => {
  test('adds shadcn slots and classes to the Base UI OTP attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewInputOTP({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr('data-slot', 'input-otp'),
        Scene.expect(Scene.role('group')).toHaveAttr(
          'class',
          inputOTPContainerClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="input-otp-slot"]')).toHaveAttr(
          'data-slot',
          'input-otp-slot',
        ),
        Scene.expect(Scene.selector('[data-slot="input-otp-slot"]')).toHaveAttr(
          'data-active',
          'false',
        ),
        Scene.expect(Scene.selector('[data-slot="input-otp-slot"]')).toHaveAttr(
          'class',
          inputOTPSlotClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="input-otp-input"]'),
        ).toHaveAttr('class', inputOTPInputClassName()),
      )
    }).not.toThrow()
  })

  test('disabled and invalid states pass through visible slots', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewInputOTP({
            isDisabled: true,
            isInvalid: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#otp')).toHaveAttr('disabled', 'true'),
        Scene.expect(Scene.selector('#otp')).toHaveAttr('aria-invalid', 'true'),
        Scene.expect(Scene.selector('#otp')).toHaveAttr('data-disabled'),
      )
    }).not.toThrow()
  })

  test('examples render grouped, separator, disabled, invalid, and form shapes', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => InputOTPDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#input-otp-demo')).toHaveValue('1'),
      )
      Scene.scene(
        { update, view: () => InputOTPSeparatorExample() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="input-otp-separator"]'),
        ).toExist(),
      )
      Scene.scene(
        { update, view: () => InputOTPDisabled() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#disabled')).toHaveAttr(
          'disabled',
          'true',
        ),
      )
      Scene.scene(
        { update, view: () => InputOTPInvalid() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#input-otp-invalid')).toHaveAttr(
          'aria-invalid',
          'true',
        ),
      )
      Scene.scene(
        { update, view: () => InputOTPForm() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Verify your login')).toExist(),
        Scene.expect(Scene.selector('#otp-verification')).toHaveAttr(
          'required',
          'true',
        ),
      )
    }).not.toThrow()
  })
})
