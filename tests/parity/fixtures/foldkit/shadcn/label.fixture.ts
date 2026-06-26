import { html } from 'foldkit/html'

import * as Label from '../../../../../src/registry/shadcn/label'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (
  config: Omit<Label.ViewConfig<never>, 'toView'>,
  text: string,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(
    Label.view<never>({
      ...config,
      toView: attributes => h.label([...attributes.label], [text]),
    }),
    {},
  )
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'label-basic',
    snapshot: snapshot({ htmlFor: 'email' }, 'Email'),
  },
  {
    id: 'label-custom-class',
    snapshot: snapshot(
      {
        htmlFor: 'terms',
        className: 'custom-label',
      },
      'Accept terms and conditions',
    ),
  },
  {
    id: 'label-rtl',
    snapshot: snapshot(
      {
        htmlFor: 'terms-rtl',
        dir: 'rtl',
      },
      'قبول الشروط والأحكام',
    ),
  },
]
