import type { HtmlBuilder } from 'foldkit/html'

import { __htmlBuilder } from '../node_modules/foldkit/dist/html/index.js'

let currentBuilder: HtmlBuilder<never> | undefined

export const withHtmlBuilder = <Message, Result>(
  builder: HtmlBuilder<Message>,
  render: () => Result,
): Result => {
  const previousBuilder = currentBuilder
  currentBuilder = builder as unknown as HtmlBuilder<never>

  try {
    return render()
  } finally {
    currentBuilder = previousBuilder
  }
}

export const html = <Message>(): HtmlBuilder<Message> =>
  currentBuilder === undefined
    ? __htmlBuilder<Message>()
    : (currentBuilder as unknown as HtmlBuilder<Message>)
