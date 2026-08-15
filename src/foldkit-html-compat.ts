import type { HtmlBuilder } from 'foldkit/html'

import { __htmlBuilder } from '../node_modules/foldkit/dist/html/index.js'

export const html = <Message>() =>
  __htmlBuilder<Message>() as HtmlBuilder<Message>
