import { html } from 'foldkit/html'

import * as Switch from '../../../../../src/registry/base-ui/switch'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof Switch.view<never>>,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), {})
}

const switchRoot = (
  h: ReturnType<typeof html<never>>,
  config: Omit<Switch.ViewConfig<never>, 'toView'>,
) =>
  Switch.view<never>({
    ...config,
    toView: attributes =>
      h.span(
        [...attributes.root],
        config.isChecked ? [h.span([...attributes.thumb], [])] : [],
      ),
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'unchecked',
    snapshot: snapshot(h =>
      switchRoot(h, {
        isChecked: false,
      }),
    ),
  },
  {
    id: 'checked-with-thumb',
    snapshot: snapshot(h =>
      switchRoot(h, {
        isChecked: true,
      }),
    ),
  },
  {
    id: 'disabled-readonly-required',
    snapshot: snapshot(h =>
      switchRoot(h, {
        isChecked: true,
        isDisabled: true,
        isReadOnly: true,
        isRequired: true,
      }),
    ),
  },
]
