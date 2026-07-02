/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import { TypographyDemo, TypographyInlineCode, TypographyRtl } from './examples'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

const viewHtml = (renderedHtml: Html) => (): Html => renderedHtml

describe('shadcn/typography examples', () => {
  test('TypographyDemo renders the semantic typography specimen', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewHtml(TypographyDemo()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('h1')).toHaveText(
          'Taxing Laughter: The Joke Tax Chronicles',
        ),
        Scene.expect(Scene.selector('p')).toHaveText(
          'The king thought laughter was too valuable to be free, so he taxed every punchline in the realm.',
        ),
        Scene.expect(Scene.selector('blockquote')).toHaveText(
          'After all, he said, everyone enjoys a joke more when it arrives with paperwork.',
        ),
        Scene.expect(Scene.selector('ul')).toHaveText(
          'The court jester kept detailed receipts.The townspeople shared quiet smiles instead.The audit office ran out of forms by noon.',
        ),
        Scene.expect(Scene.selector('table')).toHaveText(
          'TypeTaxPunsOne groanKnock-knock jokesTwo knocks',
        ),
      )
    }).not.toThrow()
  })

  test('TypographyInlineCode renders inline code', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewHtml(TypographyInlineCode()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('code')).toHaveText('h.code'),
      )
    }).not.toThrow()
  })

  test('TypographyRtl renders deterministic RTL copy', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewHtml(TypographyRtl()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[dir="rtl"]')).toHaveText(
          'دليل الضحك المنظمهذا المثال يستخدم نصا عربيا ثابتا لعرض اتجاه القراءة من اليمين إلى اليسار.',
        ),
      )
    }).not.toThrow()
  })
})
