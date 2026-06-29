import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Input } from './index'
import type { InputValueChange } from './index'

export type InputExampleController<Message> = Readonly<{
  value?: string
  idPrefix?: string
  onValueChange?: (change: InputValueChange) => Message
}>

type InputExampleConfig<Message> = Readonly<{
  id: string
  label: string
  value: string
  placeholder: string
  idPrefix?: string
  isDisabled?: boolean
  isInvalid?: boolean
  onValueChange?: (change: InputValueChange) => Message
}>

const labelClassName =
  'flex flex-col items-start gap-1 text-sm font-bold text-neutral-950 dark:text-white'
const inputClassName =
  'h-8 w-40 border border-neutral-950 bg-white px-2 text-sm font-normal text-neutral-950 placeholder:text-neutral-500 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 any-pointer-coarse:text-base dark:border-white dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-400 dark:focus:outline-white'

const idFor = <Message>(
  config: Pick<InputExampleConfig<Message>, 'id' | 'idPrefix'>,
): string => `${config.idPrefix ?? ''}${config.id}`

const inputExample = <Message>(config: InputExampleConfig<Message>): Html => {
  const h = html<Message>()
  const id = idFor(config)

  return h.label(
    [h.For(id), h.Class(labelClassName)],
    [
      config.label,
      Input<Message>({
        id,
        value: config.value,
        placeholder: config.placeholder,
        ...(config.isDisabled === undefined
          ? {}
          : { isDisabled: config.isDisabled }),
        ...(config.isInvalid === undefined
          ? {}
          : { isInvalid: config.isInvalid }),
        ...(config.onValueChange === undefined
          ? {}
          : { onValueChange: config.onValueChange }),
        toView: attributes =>
          h.input([...attributes.input, h.Class(inputClassName)]),
      }),
    ],
  )
}

export const InputDemo = <Message = never>({
  value = '',
  idPrefix,
  onValueChange,
}: InputExampleController<Message> = {}): Html =>
  inputExample({
    id: 'name',
    label: 'Name',
    value,
    placeholder: 'e.g. Colm Tuite',
    ...(idPrefix === undefined ? {} : { idPrefix }),
    ...(onValueChange === undefined ? {} : { onValueChange }),
  })

export const InputDisabled = <Message = never>({
  value = 'Colm Tuite',
  idPrefix,
}: InputExampleController<Message> = {}): Html =>
  inputExample({
    id: 'disabled-name',
    label: 'Name',
    value,
    placeholder: 'e.g. Colm Tuite',
    isDisabled: true,
    ...(idPrefix === undefined ? {} : { idPrefix }),
  })
