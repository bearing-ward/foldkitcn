import { html } from 'foldkit/html'

import * as Field from '../../../../../src/registry/base-ui/field'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

type CaseConfig = Omit<Field.ViewConfig<never>, 'toView'> &
  Readonly<{
    caseId: string
    label: string
    description: string
  }>

const renderFoldkitField = (config: CaseConfig): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(
    Field.view<never>({
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.label([...attributes.label], [config.label]),
            h.input([...attributes.control]),
            h.p([...attributes.description], [config.description]),
            attributes.state.isErrorVisible
              ? h.div(
                  [...attributes.error],
                  [attributes.state.validityData.error],
                )
              : h.empty,
          ],
        ),
    }),
    {},
  )
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    caseId: 'basic',
    id: 'profile',
    name: 'profile',
    value: 'Ada',
    label: 'Name',
    description: 'Your public display name.',
  },
  {
    caseId: 'invalid',
    id: 'email',
    name: 'email',
    isRequired: true,
    isTouched: true,
    isDirty: true,
    label: 'Email',
    description: 'Use your work email.',
    validation: Field.InvalidFieldValidation({
      error: 'Email is required',
      errors: ['Email is required'],
      issues: ['valueMissing'],
    }),
  },
  {
    caseId: 'disabled-valid',
    id: 'team',
    name: 'team',
    isDisabled: true,
    label: 'Team',
    description: 'Assigned team.',
    validation: Field.ValidFieldValidation({ value: 'Platform' }),
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.caseId,
  snapshot: renderFoldkitField(config),
}))
