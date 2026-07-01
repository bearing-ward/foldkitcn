/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  MessageScrollerDemo,
  MessageScrollerEmpty,
  MessageScrollerLoadHistory,
  MessageScrollerOpeningPosition,
  MessageScrollerScrollable,
} from './examples'
import * as MessageScroller from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

// MESSAGE

type TestMessage = never

// UPDATE

type UpdateReturn = readonly [
  Model,
  ReadonlyArray<Command.Command<TestMessage>>,
]

const update = (model: Model, _message: TestMessage): UpdateReturn => [
  model,
  [],
]

// VIEW

const view = (body: Html) => (): Html => body

describe('shadcn/message-scroller scene', () => {
  test('adds origin slots and accessibility attributes', () => {
    const h = html<TestMessage>()

    expect(() => {
      Scene.scene(
        {
          update,
          view: view(
            MessageScroller.MessageScroller<TestMessage>({
              children: [
                MessageScroller.MessageScrollerViewport<TestMessage>({
                  attributes: [h.AriaLabel('Test messages')],
                  children: [
                    MessageScroller.MessageScrollerContent<TestMessage>({
                      isBusy: true,
                      children: [
                        MessageScroller.MessageScrollerItem<TestMessage>({
                          scrollAnchor: true,
                          children: ['Anchored row'],
                        }),
                      ],
                    }),
                  ],
                }),
                MessageScroller.MessageScrollerButton<TestMessage>({
                  isActive: true,
                  ariaLabel: 'Scroll to new messages',
                }),
              ],
            }),
          ),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="message-scroller"]'),
        ).toExist(),
        Scene.expect(
          Scene.selector('[data-slot="message-scroller-content"]'),
        ).toHaveAttr('role', 'log'),
        Scene.expect(
          Scene.selector('[data-slot="message-scroller-content"]'),
        ).toHaveAttr('aria-relevant', 'additions'),
        Scene.expect(
          Scene.selector('[data-slot="message-scroller-content"]'),
        ).toHaveAttr('aria-busy', 'true'),
        Scene.expect(
          Scene.selector('[data-slot="message-scroller-item"]'),
        ).toHaveAttr('data-scroll-anchor', 'true'),
        Scene.expect(
          Scene.role('button', { name: 'Scroll to new messages' }),
        ).toExist(),
      )
    }).not.toThrow()
  })

  test('hides inactive scroll button from tab order', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: view(
            MessageScroller.MessageScrollerButton<TestMessage>({
              isActive: false,
            }),
          ),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('button', { name: 'Scroll to end' }),
        ).toHaveAttr('data-active', 'false'),
      )
    }).not.toThrow()
  })

  test('examples render deterministic scroller states', () => {
    expect(() => {
      Scene.scene(
        { update, view: view(MessageScrollerDemo()) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.text(
            'The chat viewport should stay pinned while the assistant streams.',
          ),
        ).toExist(),
        Scene.expect(Scene.role('button', { name: 'Scroll to end' })).toExist(),
      )
      Scene.scene(
        { update, view: view(MessageScrollerScrollable()) },
        Scene.with(initialModel),
        Scene.expect(Scene.text('1 new message')).toExist(),
        Scene.expect(Scene.role('status')).toExist(),
      )
      Scene.scene(
        { update, view: view(MessageScrollerLoadHistory()) },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Load earlier messages')).toExist(),
        Scene.expect(
          Scene.role('button', { name: 'Scroll to earlier messages' }),
        ).toExist(),
      )
      Scene.scene(
        { update, view: view(MessageScrollerOpeningPosition()) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.text('What happens when the reader scrolls up?'),
        ).toExist(),
      )
      Scene.scene(
        { update, view: view(MessageScrollerEmpty()) },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Morning, shadcn!')).toExist(),
      )
    }).not.toThrow()
  })
})
