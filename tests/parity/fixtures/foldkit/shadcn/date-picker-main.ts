import { Calendar } from 'foldkit'
import type { Command } from 'foldkit'
import type { Document } from 'foldkit/html'
import { html } from 'foldkit/html'

import {
  DatePickerMessage,
  DatePickerModel,
  datePickerInit,
  datePickerUpdate,
} from '../../../../../src/registry/shadcn/date-picker'
import { DatePickerDemo } from '../../../../../src/registry/shadcn/date-picker/examples'

export const Model = DatePickerModel
export type Model = typeof Model.Type

export const Message = DatePickerMessage
export type Message = typeof Message.Type

export const init = (): readonly [
  Model,
  ReadonlyArray<Command.Command<Message>>,
] => [
  datePickerInit({
    id: 'date-picker-demo',
    today: Calendar.make(2025, 6, 12),
  }),
  [],
]

export const update = datePickerUpdate

export const view = (model: Model): Document => {
  const h = html<Message>()

  return {
    title: 'Date Picker parity fixture',
    body: h.div(
      [
        h.DataAttribute('foldkit-fixture-root', ''),
        h.DataAttribute('foldkit-case-id', 'date-picker-demo'),
        h.Class('p-6'),
      ],
      [
        DatePickerDemo<Message>({
          model,
          toParentMessage: message => message,
        }),
      ],
    ),
  }
}
