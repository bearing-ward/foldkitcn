import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Collapsible from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  open: S.Boolean,
  lastReason: Collapsible.CollapsibleChangeReason,
})
type Model = typeof Model.Type

const initialModel: Model = {
  open: false,
  lastReason: 'none',
}

// MESSAGE

const ChangedCollapsible = m('ChangedCollapsible', {
  open: S.Boolean,
  reason: Collapsible.CollapsibleChangeReason,
})

const Message = S.Union([ChangedCollapsible])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedCollapsible: ({ open, reason }) => [
        evo(model, {
          open: () => open,
          lastReason: () => reason,
        }),
        [],
      ],
    }),
  )

// VIEW

const viewCollapsible =
  (
    config: Omit<ViewConfig<Message>, 'open' | 'toView'> &
      Readonly<{ panelText?: string }>,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()
    const panelText = config.panelText ?? 'This is panel content'

    return h.div(
      [],
      [
        Collapsible.view<Message>({
          open: model.open,
          ...config,
          onOpenChange: change => ChangedCollapsible(change),
          toView: attributes =>
            h.div(
              [...attributes.root],
              [
                h.button([...attributes.trigger], ['Toggle']),
                attributes.panel.isMounted
                  ? h.keyed('div')(
                      attributes.panel.isOpen ? 'open' : 'closed',
                      [...attributes.panel.root],
                      [panelText],
                    )
                  : h.empty,
              ],
            ),
        }),
        h.p([], [`Open ${String(model.open)}`]),
        h.p([], [`Reason ${model.lastReason}`]),
      ],
    )
  }

describe('base-ui/collapsible', () => {
  test('root, trigger, and panel expose open ARIA and data attributes', () => {
    const [openModel] = update(
      initialModel,
      ChangedCollapsible({ open: true, reason: 'none' }),
    )

    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCollapsible({
            id: 'recovery-keys',
            panel: { id: 'recovery-panel' },
          }),
        },
        Scene.with(openModel),
        Scene.expect(Scene.selector('#recovery-keys')).toHaveAttr('data-open'),
        Scene.expect(Scene.role('button', { name: 'Toggle' })).toHaveAttr(
          'aria-expanded',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Toggle' })).toHaveAttr(
          'aria-controls',
          'recovery-panel',
        ),
        Scene.expect(Scene.selector('#recovery-panel')).toHaveAttr('data-open'),
        Scene.expect(Scene.role('button', { name: 'Toggle' })).toHaveAttr(
          'data-panel-open',
        ),
      )
    }).not.toThrow()
  })

  test('closed panel is unmounted by default and trigger omits aria-controls', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCollapsible({
            id: 'recovery-keys',
            panel: { id: 'recovery-panel' },
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#recovery-keys')).toHaveAttr(
          'data-closed',
        ),
        Scene.expect(Scene.role('button', { name: 'Toggle' })).toHaveAttr(
          'aria-expanded',
          'false',
        ),
        Scene.expect(Scene.role('button', { name: 'Toggle' })).not.toHaveAttr(
          'aria-controls',
        ),
        Scene.expect(Scene.text('This is panel content')).toBeAbsent(),
      )
    }).not.toThrow()
  })

  test('click, Enter, and Space request model-owned open changes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCollapsible({
            panel: { id: 'recovery-panel' },
          }),
        },
        Scene.with(initialModel),
        Scene.click(Scene.role('button', { name: 'Toggle' })),
        Scene.expect(Scene.text('Open true')).toExist(),
        Scene.expect(Scene.text('Reason trigger-press')).toExist(),
        Scene.keydown(Scene.role('button', { name: 'Toggle' }), 'Enter'),
        Scene.expect(Scene.text('Open false')).toExist(),
        Scene.keydown(Scene.role('button', { name: 'Toggle' }), ' '),
        Scene.expect(Scene.text('Open true')).toExist(),
      )
    }).not.toThrow()
  })

  test('disabled trigger preserves disabled attributes and suppresses activation', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCollapsible({
            isDisabled: true,
            panel: { id: 'disabled-panel' },
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Toggle' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Toggle' })).toHaveAttr(
          'data-disabled',
        ),
        Scene.expect(
          Scene.role('button', { name: 'Toggle' }),
        ).not.toHaveHandler('click'),
        Scene.expect(
          Scene.role('button', { name: 'Toggle' }),
        ).not.toHaveHandler('keydown'),
        Scene.expect(Scene.text('Open false')).toExist(),
      )
    }).not.toThrow()
  })

  test('keepMounted and hiddenUntilFound preserve closed panel rendering policy', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCollapsible({
            panel: {
              id: 'kept-panel',
              keepMounted: true,
            },
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#kept-panel')).toHaveAttr('hidden'),
        Scene.expect(Scene.selector('#kept-panel')).toHaveAttr('data-closed'),
      )
      Scene.scene(
        {
          update,
          view: viewCollapsible({
            panel: {
              id: 'findable-panel',
              hiddenUntilFound: true,
            },
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#findable-panel')).toHaveAttr(
          'hidden',
          'until-found',
        ),
        Scene.expect(Scene.selector('#findable-panel')).toHaveAttr(
          'data-closed',
        ),
      )
    }).not.toThrow()
  })

  test('transition status and measured geometry are explicit render inputs', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCollapsible({
            transitionStatus: 'starting',
            panel: {
              id: 'measured-panel',
              keepMounted: true,
              geometry: {
                height: 96,
                width: 240,
              },
            },
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#measured-panel')).toHaveAttr(
          'data-starting-style',
        ),
        Scene.expect(Scene.selector('#measured-panel')).toHaveStyle(
          '--collapsible-panel-height',
          '96px',
        ),
        Scene.expect(Scene.selector('#measured-panel')).toHaveStyle(
          '--collapsible-panel-width',
          '240px',
        ),
      )
    }).not.toThrow()
  })
})
