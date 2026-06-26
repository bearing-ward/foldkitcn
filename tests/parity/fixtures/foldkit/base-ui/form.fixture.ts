import { html } from 'foldkit/html'

import * as Field from '../../../../../src/registry/base-ui/field'
import * as Form from '../../../../../src/registry/base-ui/form'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

type FieldConfig = Omit<Field.ViewConfig<never>, 'toView'> &
  Readonly<{
    label: string
    description: string
  }>

type CaseConfig = Omit<Form.ViewConfig<never>, 'fields' | 'toView'> &
  Readonly<{
    caseId: string
    fields: ReadonlyArray<FieldConfig>
  }>

const renderField = (h: ReturnType<typeof html<never>>, config: FieldConfig) =>
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
  })

const formFields = (
  fields: ReadonlyArray<FieldConfig>,
): ReadonlyArray<Form.FormFieldValue> =>
  fields.map(field => ({
    name: field.name ?? '',
    value:
      typeof field.value === 'string' || typeof field.value === 'number'
        ? field.value
        : '',
    validation: field.validation,
    isDisabled: field.isDisabled,
  }))

const renderFoldkitForm = (config: CaseConfig): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(
    Form.view<never>({
      ...config,
      fields: formFields(config.fields),
      toView: attributes =>
        h.form(
          [...attributes.root],
          config.fields.map(field => renderField(h, field)),
        ),
    }),
    {},
  )
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    caseId: 'basic',
    id: 'profile-form',
    action: '/profiles',
    method: 'post',
    fields: [
      {
        id: 'profile-name',
        name: 'name',
        label: 'Name',
        value: 'Ada',
        description: 'Your public display name.',
      },
    ],
  },
  {
    caseId: 'invalid',
    id: 'signup-form',
    isSubmitted: true,
    fields: [
      {
        id: 'signup-email',
        name: 'email',
        label: 'Email',
        isRequired: true,
        validation: Field.InvalidFieldValidation({
          error: 'Email is required',
          errors: ['Email is required'],
          issues: ['valueMissing'],
        }),
        description: 'Use your work email.',
      },
    ],
  },
  {
    caseId: 'disabled',
    id: 'disabled-form',
    isDisabled: true,
    fields: [
      {
        id: 'disabled-url',
        name: 'url',
        label: 'Homepage',
        isDisabled: true,
        description: 'A verified homepage.',
      },
    ],
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.caseId,
  snapshot: renderFoldkitForm(config),
}))
