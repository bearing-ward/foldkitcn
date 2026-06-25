import { html } from 'foldkit/html'

import * as Input from '../../../../../src/registry/base-ui/input'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof Input.view<never>>,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), {})
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'basic',
    snapshot: snapshot(h =>
      Input.view<never>({
        id: 'name',
        name: 'name',
        placeholder: 'Name',
        toView: attributes => h.input([...attributes.input]),
      }),
    ),
  },
  {
    id: 'controlled-value',
    snapshot: snapshot(h =>
      Input.view<never>({
        id: 'controlled',
        value: 'Ada',
        toView: attributes => h.input([...attributes.input]),
      }),
    ),
  },
  {
    id: 'disabled',
    snapshot: snapshot(h =>
      Input.view<never>({
        id: 'disabled',
        isDisabled: true,
        toView: attributes => h.input([...attributes.input]),
      }),
    ),
  },
  {
    id: 'invalid',
    snapshot: snapshot(h =>
      Input.view<never>({
        id: 'invalid',
        isInvalid: true,
        toView: attributes => h.input([...attributes.input]),
      }),
    ),
  },
  {
    id: 'required-readonly',
    snapshot: snapshot(h =>
      Input.view<never>({
        id: 'required-readonly',
        isRequired: true,
        isReadOnly: true,
        toView: attributes => h.input([...attributes.input]),
      }),
    ),
  },
  {
    id: 'file',
    snapshot: snapshot(h =>
      Input.view<never>({
        id: 'file',
        type: 'file',
        toView: attributes => h.input([...attributes.input]),
      }),
    ),
  },
]
