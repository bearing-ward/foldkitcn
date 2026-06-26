import { html } from 'foldkit/html'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError as fieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  InvalidFieldValidation,
} from '../../../../../src/registry/shadcn/field'
import { view as Input } from '../../../../../src/registry/shadcn/input'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

const input = (id: string): ReturnType<typeof Input<never>> => {
  const h = html<never>()

  return Input<never>({
    id,
    placeholder: 'Max Leiter',
    toView: attributes => h.input([...attributes.input]),
  })
}

const renderFoldkitField = (): FixtureSnapshot =>
  snapshotHtml(
    FieldSet<never>({
      className: 'w-full max-w-xs',
      children: [
        FieldLegend<never>({ children: ['Profile'] }),
        FieldDescription<never>({
          children: ['Fill in your profile information.'],
        }),
        FieldGroup<never>({
          children: [
            Field<never>({
              id: 'name-field',
              children: [
                FieldLabel<never>({
                  htmlFor: 'name',
                  children: ['Name'],
                }),
                FieldContent<never>({
                  children: [
                    input('name'),
                    FieldDescription<never>({
                      children: ['Choose a unique username.'],
                    }),
                  ],
                }),
              ],
            }),
            Field<never>({
              id: 'email-field',
              validation: InvalidFieldValidation({
                error: 'Email is required',
                errors: ['Email is required'],
                issues: ['valueMissing'],
              }),
              children: [
                FieldLabel<never>({
                  htmlFor: 'email',
                  children: ['Email'],
                }),
                input('email'),
                fieldError({ children: ['Email is required'] }),
              ],
            }),
          ],
        }),
        FieldSeparator<never>({ children: ['Optional'] }),
      ],
    }),
    {},
  )

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'field-composition',
    snapshot: renderFoldkitField(),
  },
]
