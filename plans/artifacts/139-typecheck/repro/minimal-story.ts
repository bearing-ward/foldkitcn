import { Schema as S } from 'effect'
import type { Command } from 'foldkit'
import { Story } from 'foldkit'
import { m } from 'foldkit/message'

const Model = S.Struct({ count: S.Number })
type Model = typeof Model.Type

const ClickedIncrement = m('ClickedIncrement')
const Message = S.Union([ClickedIncrement])
type Message = typeof Message.Type

const update = (
  model: Model,
  _message: Message,
): readonly [Model, ReadonlyArray<Command.Command<Message>>] => [
  { count: model.count + 1 },
  [],
]

Story.story(
  update,
  Story.with({ count: 0 }),
  Story.message(ClickedIncrement()),
  Story.model(model => {
    if (model.count !== 1) {
      throw new Error('Expected incremented model')
    }
  }),
)
