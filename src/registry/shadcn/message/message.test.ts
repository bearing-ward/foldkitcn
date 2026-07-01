/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  MessageActionsDemo,
  MessageAttachmentDemo,
  MessageAvatarDemo,
  MessageDemo,
  MessageGroupDemo,
  MessageHeaderFooterDemo,
  MessageMarkdownDemo,
} from './examples'
import * as Message from './index'
import type { ViewConfig } from './index'

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

const viewMessage =
  (config: ViewConfig<TestMessage>) =>
  (_model: Model): Html =>
    Message.view<TestMessage>(config)

describe('shadcn/message class helpers', () => {
  test('exports Effect Schema literals for message variants', () => {
    expect(S.decodeUnknownSync(Message.MessageAlign)('end')).toBe('end')
    expect(S.decodeUnknownSync(Message.MessageRole)('assistant')).toBe(
      'assistant',
    )
    expect(S.decodeUnknownSync(Message.MessageAvatarPlacement)('start')).toBe(
      'start',
    )
  })

  test('exports values arrays for documented options', () => {
    expect(Message.messageAlignValues).toStrictEqual(['start', 'end'])
    expect(Message.messageRoleValues).toStrictEqual([
      'user',
      'assistant',
      'system',
    ])
    expect(Message.messageAvatarPlacementValues).toStrictEqual(['start', 'end'])
  })

  test('canonicalizes root and part classes', () => {
    expect(
      Message.messageClassName({
        align: 'end',
        role: 'system',
        className: 'custom-message',
      }),
    ).toContain('group/message')
    expect(
      Message.messageAvatarClassName({
        placement: 'end',
        className: 'custom-avatar',
      }),
    ).toContain('order-last')
    expect(
      Message.messageContentClassName({ className: 'custom-content gap-4' }),
    ).toContain('custom-content')
    expect(Message.messageGroupClassName()).toBe('flex min-w-0 flex-col gap-2')
  })

  test('canonicalizes metadata part classes', () => {
    expect(Message.messageHeaderClassName()).toContain('text-muted-foreground')
    expect(Message.messageFooterClassName()).toContain(
      'group-data-[align=end]/message:justify-end',
    )
  })
})

describe('shadcn/message view', () => {
  test('adds origin slots and root data attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewMessage({ align: 'end', role: 'user' }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="message"]')).toHaveAttr(
          'data-align',
          'end',
        ),
        Scene.expect(Scene.selector('[data-slot="message"]')).toHaveAttr(
          'class',
          Message.messageClassName({ align: 'end', role: 'user' }),
        ),
      )
    }).not.toThrow()
  })

  test('adds group, avatar, content, header, and footer slots', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: () =>
            Message.MessageGroup<TestMessage>({
              children: [
                Message.Message<TestMessage>({
                  children: [
                    Message.MessageAvatar<TestMessage>(),
                    Message.MessageContent<TestMessage>({
                      children: [
                        Message.MessageHeader<TestMessage>({
                          children: ['Olivia'],
                        }),
                        Message.MessageFooter<TestMessage>({
                          children: ['Delivered'],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="message-group"]')).toHaveAttr(
          'class',
          Message.messageGroupClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="message-avatar"]')).toHaveAttr(
          'class',
          Message.messageAvatarClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="message-content"]'),
        ).toHaveAttr('class', Message.messageContentClassName()),
        Scene.expect(Scene.selector('[data-slot="message-header"]')).toHaveAttr(
          'class',
          Message.messageHeaderClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="message-footer"]')).toHaveAttr(
          'class',
          Message.messageFooterClassName(),
        ),
      )
    }).not.toThrow()
  })

  test('supports custom renderers for every part', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: () =>
            Message.MessageContent<TestMessage>({
              toView: attributes => {
                const h = html<TestMessage>()

                return h.section([...attributes.content], ['Custom content'])
              },
            }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Custom content')).toExist(),
        Scene.expect(Scene.selector('[data-slot="message-content"]')).toExist(),
      )
    }).not.toThrow()
  })

  test('examples render supported message compositions', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => MessageDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Deploying to prod real quick.')).toExist(),
        Scene.expect(Scene.role('status')).toExist(),
      )
      Scene.scene(
        { update, view: () => MessageGroupDemo() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.text(
            'The component and example JSON now live under the UI registry.',
          ),
        ).toExist(),
      )
      Scene.scene(
        { update, view: () => MessageAvatarDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="avatar"]')).toExist(),
      )
      Scene.scene(
        { update, view: () => MessageHeaderFooterDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Olivia')).toExist(),
        Scene.expect(Scene.text('Yesterday')).toExist(),
      )
      Scene.scene(
        { update, view: () => MessageActionsDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Copy' })).toExist(),
        Scene.expect(Scene.role('button', { name: 'Retry' })).toExist(),
      )
      Scene.scene(
        { update, view: () => MessageAttachmentDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('sales-dashboard.pdf')).toExist(),
        Scene.expect(Scene.role('button', { name: 'Download' })).toExist(),
      )
      Scene.scene(
        { update, view: () => MessageMarkdownDemo() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.text('How do I render markdown in a message?'),
        ).toExist(),
        Scene.expect(
          Scene.text('Render assistant text through Markdown.'),
        ).toExist(),
      )
    }).not.toThrow()
  })
})
