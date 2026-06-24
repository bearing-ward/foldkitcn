import { html } from 'foldkit/html'

import * as Separator from '../../../../../src/registry/base-ui/separator'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof Separator.view<never>>,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), {})
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'horizontal-default',
    snapshot: snapshot(h =>
      Separator.view<never>({
        toView: attributes => h.div([...attributes.separator], []),
      }),
    ),
  },
  {
    id: 'vertical',
    snapshot: snapshot(h =>
      Separator.view<never>({
        orientation: 'vertical',
        toView: attributes => h.div([...attributes.separator], []),
      }),
    ),
  },
  {
    id: 'custom-element',
    snapshot: snapshot(h =>
      Separator.view<never>({
        toView: attributes => h.hr([...attributes.separator]),
      }),
    ),
  },
]
