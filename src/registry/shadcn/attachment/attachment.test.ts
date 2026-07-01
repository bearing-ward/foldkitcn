/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  AttachmentDemo,
  AttachmentGroupDemo,
  AttachmentImage,
  AttachmentSizes,
  AttachmentStates,
  AttachmentTriggerDemo,
} from './examples'
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentOrientation,
  AttachmentSize,
  AttachmentState,
  AttachmentTitle,
  AttachmentTrigger,
  attachmentActionClassName,
  attachmentActionsClassName,
  attachmentClassName,
  attachmentContentClassName,
  attachmentDescriptionClassName,
  attachmentGroupClassName,
  attachmentMediaClassName,
  attachmentStateValues,
  attachmentTitleClassName,
  attachmentTriggerClassName,
  attachmentTriggerBaseClassName,
  attachmentMediaVariantValues,
  attachmentOrientationValues,
  attachmentSizeValues,
} from './index'
import { AttachmentWorkflowDemo } from './workflow'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

const h = html<Message>()

type AttachmentViewConfig = Readonly<{
  state?: 'idle' | 'uploading' | 'processing' | 'error' | 'done'
  size?: 'default' | 'sm' | 'xs'
  orientation?: 'horizontal' | 'vertical'
  className?: string
}>

const viewAttachment =
  (config: AttachmentViewConfig = {}) =>
  (_model: Model): Html =>
    Attachment<Message>({
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.attachment],
          [
            AttachmentMedia<Message>({
              variant: 'image',
              toView: mediaAttributes =>
                h.div(
                  [...mediaAttributes.media],
                  [
                    h.img([
                      h.Src('https://example.com/image.png'),
                      h.Alt('Preview'),
                    ]),
                  ],
                ),
            }),
            AttachmentContent<Message>({
              toView: contentAttributes =>
                h.div(
                  [...contentAttributes.content],
                  [
                    AttachmentTitle<Message>({
                      toView: titleAttributes =>
                        h.span([...titleAttributes.title], ['research.pdf']),
                    }),
                    AttachmentDescription<Message>({
                      toView: descriptionAttributes =>
                        h.span(
                          [...descriptionAttributes.description],
                          ['PDF · 2.4 MB'],
                        ),
                    }),
                  ],
                ),
            }),
            AttachmentActions<Message>({
              toView: actionsAttributes =>
                h.div(
                  [...actionsAttributes.actions],
                  [
                    AttachmentAction<Message>({
                      attributes: [h.AriaLabel('Remove research.pdf')],
                      children: ['Remove'],
                    }),
                  ],
                ),
            }),
            AttachmentTrigger<Message>({
              attributes: [h.AriaLabel('Preview research.pdf')],
            }),
          ],
        ),
    })

describe('shadcn/attachment class helpers', () => {
  test('exports Effect Schema literals for attachment variants', () => {
    expect(S.decodeUnknownSync(AttachmentState)('processing')).toBe(
      'processing',
    )
    expect(S.decodeUnknownSync(AttachmentSize)('xs')).toBe('xs')
    expect(S.decodeUnknownSync(AttachmentOrientation)('vertical')).toBe(
      'vertical',
    )
  })

  test('includes attachment state, size, and orientation values', () => {
    expect(attachmentStateValues).toStrictEqual([
      'idle',
      'uploading',
      'processing',
      'error',
      'done',
    ])
    expect(attachmentSizeValues).toStrictEqual(['default', 'sm', 'xs'])
    expect(attachmentOrientationValues).toStrictEqual([
      'horizontal',
      'vertical',
    ])
    expect(attachmentMediaVariantValues).toStrictEqual(['icon', 'image'])
  })

  test('canonicalizes attachment root classes', () => {
    const className = attachmentClassName({
      className: 'custom rounded-full',
      orientation: 'vertical',
      size: 'xs',
    })

    expect(className).toContain('group/attachment')
    expect(className).toContain('custom rounded-full')
    expect(className).toContain('w-24')
  })

  test('uses local button classes for attachment actions', () => {
    const className = attachmentActionClassName()

    expect(className).toContain('group/button')
    expect(className).toContain('size-6')
  })

  test('exports content and part class helpers', () => {
    expect(attachmentTriggerClassName()).toBe(attachmentTriggerBaseClassName)
    expect(attachmentActionsClassName()).toContain('relative z-20')
    expect(attachmentContentClassName()).toContain('flex-1')
    expect(attachmentTitleClassName()).toContain('truncate')
  })

  test('exports description, group, and media class helpers', () => {
    expect(attachmentDescriptionClassName()).toContain('text-xs')
    expect(attachmentGroupClassName()).toContain('scroll-fade-x')
    expect(attachmentMediaClassName({ variant: 'image' })).toContain(
      'object-cover',
    )
  })
})

describe('shadcn/attachment view', () => {
  test('adds origin attachment slots and root state attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAttachment({ state: 'uploading' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="attachment"]')).toHaveAttr(
          'data-state',
          'uploading',
        ),
      )
    }).not.toThrow()
  })

  test('adds attachment root sizing attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAttachment({ state: 'uploading' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="attachment"]')).toHaveAttr(
          'data-size',
          'default',
        ),
        Scene.expect(Scene.selector('[data-slot="attachment"]')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
      )
    }).not.toThrow()
  })

  test('adds attachment slot attributes to the part renderers', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAttachment({ state: 'uploading' }) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="attachment-media"]'),
        ).toHaveAttr('data-slot', 'attachment-media'),
        Scene.expect(
          Scene.selector('[data-slot="attachment-content"]'),
        ).toHaveAttr('class', attachmentContentClassName()),
        Scene.expect(
          Scene.selector('[data-slot="attachment-title"]'),
        ).toHaveAttr('class', attachmentTitleClassName()),
        Scene.expect(
          Scene.selector('[data-slot="attachment-description"]'),
        ).toHaveAttr('class', attachmentDescriptionClassName()),
      )
    }).not.toThrow()
  })

  test('adds attachment action and trigger button attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAttachment({ state: 'uploading' }) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="attachment-actions"]'),
        ).toHaveAttr('class', attachmentActionsClassName()),
        Scene.expect(
          Scene.selector('[data-slot="attachment-action"]'),
        ).toHaveAttr('type', 'button'),
        Scene.expect(
          Scene.selector('[data-slot="attachment-trigger"]'),
        ).toHaveAttr('type', 'button'),
      )
    }).not.toThrow()
  })

  test('supports custom toView composition on the root and trigger', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: () =>
            Attachment<Message>({
              className: 'custom-root',
              toView: attributes =>
                h.div(
                  [...attributes.attachment],
                  [
                    AttachmentTrigger<Message>({
                      toView: triggerAttributes =>
                        h.button([...triggerAttributes.trigger], ['Preview']),
                    }),
                  ],
                ),
            }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="attachment"]')).toHaveAttr(
          'class',
          attachmentClassName({ className: 'custom-root' }),
        ),
        Scene.expect(Scene.role('button', { name: 'Preview' })).toHaveAttr(
          'data-slot',
          'attachment-trigger',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/attachment examples', () => {
  test('renders the demo group and file rows', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => AttachmentDemo() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="attachment-group"]'),
        ).toExist(),
      )
    }).not.toThrow()
  })

  test('renders the uploading spinner example', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => AttachmentDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="spinner"]')).toExist(),
      )
    }).not.toThrow()
  })

  test('renders grouped attachments and image triggers', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => AttachmentGroupDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="attachment"]')).toExist(),
      )
    }).not.toThrow()

    expect(() => {
      Scene.scene(
        { update, view: () => AttachmentImage() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="attachment-trigger"]'),
        ).toExist(),
        Scene.expect(Scene.selector('a[target="_blank"]')).toExist(),
      )
    }).not.toThrow()
  })

  test('renders attachment size examples', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => AttachmentSizes() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="attachment"][data-size="xs"]'),
        ).toExist(),
      )
    }).not.toThrow()
  })

  test('renders attachment state examples', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => AttachmentStates() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="attachment"][data-state="error"]'),
        ).toExist(),
        Scene.expect(
          Scene.selector('[data-slot="attachment"][data-state="uploading"]'),
        ).toExist(),
      )
    }).not.toThrow()
  })

  test('renders the dialog trigger demo with a closed dialog trigger overlay', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => AttachmentTriggerDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="dialog-trigger"]')).toExist(),
        Scene.expect(Scene.selector('[data-slot="dialog-trigger"]')).toHaveAttr(
          'aria-expanded',
          'false',
        ),
        Scene.expect(
          Scene.selector('[data-slot="dialog-trigger"]'),
        ).toHaveClass('absolute'),
      )
    }).not.toThrow()
  })

  test('renders the FileDrop-backed attachment workflow demo', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => AttachmentWorkflowDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('label')).toExist(),
        Scene.expect(Scene.selector('p')).toHaveText(
          'Accepted files will appear here after they are dropped or chosen.',
        ),
      )
    }).not.toThrow()
  })

  test('exposes the installable source manifest paths', async () => {
    const manifestModule =
      await import('../../../../registry-src/shadcn/attachment/item.json?raw')
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/attachment/index.ts',
      'src/registry/shadcn/attachment/examples.ts',
      'src/registry/shadcn/attachment/workflow.ts',
    ])
  })
})
