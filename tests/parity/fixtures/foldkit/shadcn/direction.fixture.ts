import { html } from 'foldkit/html'

import * as Direction from '../../../../../src/registry/shadcn/direction'
import type { FixtureCase } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshotDirection = (
  options: Readonly<{ direction: Direction.Direction; lang: string }>,
) => {
  const h = html<never>()

  return snapshotHtml(
    Direction.DirectionProvider<never>({
      direction: options.direction,
      lang: options.lang,
      className: 'direction-shell',
      toView: attributes =>
        h.div(
          [...attributes.root],
          [h.p([], [`Current direction: ${attributes.direction}`])],
        ),
    }),
    {},
  )
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'direction-ltr',
    snapshot: snapshotDirection({ direction: 'ltr', lang: 'en' }),
  },
  {
    id: 'direction-rtl',
    snapshot: snapshotDirection({ direction: 'rtl', lang: 'ar' }),
  },
]
