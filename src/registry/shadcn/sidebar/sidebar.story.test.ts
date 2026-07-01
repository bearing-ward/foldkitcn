import { Match as M, Schema as S } from 'effect'
import type { Command } from 'foldkit'
import { Story } from 'foldkit'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Sidebar from './index'

// MODEL

const Model = S.Struct({
  open: S.Boolean,
  mobileOpen: S.Boolean,
  activeItem: S.String,
  direction: Sidebar.SidebarSide,
})
type Model = typeof Model.Type

const initialModel: Model = {
  open: true,
  mobileOpen: false,
  activeItem: 'overview',
  direction: 'left',
}

// MESSAGE

const ClickedToggleSidebar = m('ClickedToggleSidebar')
const ClickedToggleMobileSidebar = m('ClickedToggleMobileSidebar')
const SelectedSidebarItem = m('SelectedSidebarItem', { value: S.String })
const UpdatedSidebarDirection = m('UpdatedSidebarDirection', {
  value: Sidebar.SidebarSide,
})
const Message = S.Union([
  ClickedToggleSidebar,
  ClickedToggleMobileSidebar,
  SelectedSidebarItem,
  UpdatedSidebarDirection,
])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ClickedToggleSidebar: () => [evo(model, { open: open => !open }), []],
      ClickedToggleMobileSidebar: () => [
        evo(model, { mobileOpen: open => !open }),
        [],
      ],
      SelectedSidebarItem: ({ value }) => [
        evo(model, { activeItem: () => value }),
        [],
      ],
      UpdatedSidebarDirection: ({ value }) => [
        evo(model, { direction: () => value }),
        [],
      ],
    }),
  )

describe('shadcn/sidebar story', () => {
  test('toggles desktop and mobile shell state, active item, and direction', () => {
    Story.story(
      update,
      Story.with(initialModel),
      Story.message(ClickedToggleSidebar()),
      Story.model(model => {
        expect(model.open).toBeFalsy()
      }),
      Story.message(ClickedToggleMobileSidebar()),
      Story.model(model => {
        expect(model.mobileOpen).toBeTruthy()
      }),
      Story.message(SelectedSidebarItem({ value: 'projects' })),
      Story.model(model => {
        expect(model.activeItem).toBe('projects')
      }),
      Story.message(UpdatedSidebarDirection({ value: 'right' })),
      Story.model(model => {
        expect(model.direction).toBe('right')
      }),
    )
  })
})
