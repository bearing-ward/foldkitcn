/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  AlertVariant,
  actionView as AlertAction,
  alertActionClassName,
  alertBaseClassName,
  alertClassName,
  alertDescriptionClassName,
  alertTitleClassName,
  alertVariantClassNames,
  alertVariantValues,
  descriptionView as AlertDescription,
  titleView as AlertTitle,
  view as Alert,
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

const viewAlert =
  (config: Omit<ViewConfig<Message>, 'toView'>) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Alert<Message>({
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.alert],
          [
            AlertTitle<Message>({
              toView: titleAttributes =>
                h.div([...titleAttributes.title], ['Alert title']),
            }),
            AlertDescription<Message>({
              toView: descriptionAttributes =>
                h.div(
                  [...descriptionAttributes.description],
                  ['Alert description'],
                ),
            }),
            AlertAction<Message>({
              toView: actionAttributes =>
                h.div([...actionAttributes.action], ['Alert action']),
            }),
          ],
        ),
    })
  }

describe('shadcn/alert class helpers', () => {
  test('exports Effect Schema literals for variants', () => {
    expect(S.decodeUnknownSync(AlertVariant)('destructive')).toBe('destructive')
  })

  test('returns the base class and default variant class by default', () => {
    const className = alertClassName()

    expect(className).toContain(alertBaseClassName)
    expect(className).toContain(alertVariantClassNames.default)
  })

  test.each(alertVariantValues)(
    'maps %s to the exact origin variant class string',
    variant => {
      expect(alertClassName({ variant })).toContain(
        alertVariantClassNames[variant],
      )
    },
  )

  test('preserves custom className through local cn canonicalization', () => {
    const className = alertClassName({
      className: 'custom-alert px-1 px-6',
    })

    expect(className).toContain('custom-alert')
    expect(className).toContain('px-6')
    expect(className).not.toContain('px-1')
  })

  test('exports part class helpers', () => {
    expect(alertTitleClassName()).toContain('font-medium')
    expect(alertDescriptionClassName()).toContain('text-muted-foreground')
    expect(alertActionClassName()).toBe('absolute top-2 right-2')
  })
})

describe('shadcn/alert view', () => {
  test('adds root role, data slot, and expected classes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAlert({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="alert"]')).toHaveAttr(
          'role',
          'alert',
        ),
        Scene.expect(Scene.selector('[data-slot="alert"]')).toHaveAttr(
          'class',
          alertClassName(),
        ),
      )
    }).not.toThrow()
  })

  test('adds expected part slots and classes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAlert({ variant: 'destructive' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="alert-title"]')).toHaveAttr(
          'class',
          alertTitleClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="alert-description"]'),
        ).toHaveAttr('class', alertDescriptionClassName()),
        Scene.expect(Scene.selector('[data-slot="alert-action"]')).toHaveAttr(
          'class',
          alertActionClassName(),
        ),
      )
    }).not.toThrow()
  })
})
