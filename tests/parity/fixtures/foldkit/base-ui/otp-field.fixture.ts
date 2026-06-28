import { html } from 'foldkit/html'

import * as OTPField from '../../../../../src/registry/base-ui/otp-field'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotHtml } from '../render'

type CaseConfig = Omit<OTPField.ViewConfig<never>, 'toView'> &
  Readonly<{
    caseId: string
    grouped?: boolean
  }>

const baseKeyboard = {
  click: 'activates',
  Enter: 'native-activates',
  Space: 'native-activates',
  ArrowLeft: 'activates',
  ArrowRight: 'activates',
  Backspace: 'activates',
  Delete: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const snapshot = (
  config: CaseConfig,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = baseKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(
    OTPField.view<never>({
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          config.grouped === true
            ? [
                h.div(
                  [h.Attribute('data-testid', 'first-group')],
                  attributes.slots
                    .slice(0, 3)
                    .map(slot => h.input([...slot.input])),
                ),
                h.span([h.Role('separator')], ['-']),
                h.div(
                  [h.Attribute('data-testid', 'second-group')],
                  attributes.slots
                    .slice(3)
                    .map(slot => h.input([...slot.input])),
                ),
                h.input([...attributes.hiddenInput]),
              ]
            : [
                ...attributes.slots.map(slot => h.input([...slot.input])),
                h.input([...attributes.hiddenInput]),
              ],
        ),
    }),
    config.isDisabled === true ? suppressedKeyboard : keyboardBehavior,
  )
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    caseId: 'basic',
    id: 'otp-basic',
    name: 'otp-basic',
    length: 6,
  },
  {
    caseId: 'grouped',
    id: 'otp-grouped',
    length: 6,
    value: '123456',
    grouped: true,
  },
  {
    caseId: 'complete',
    id: 'otp-complete',
    name: 'otp-complete',
    length: 6,
    value: '123456',
    isFocused: true,
    focusedIndex: 5,
  },
  {
    caseId: 'disabled',
    id: 'otp-disabled',
    name: 'otp-disabled',
    length: 6,
    value: '123456',
    isDisabled: true,
  },
  {
    caseId: 'invalid',
    id: 'otp-invalid',
    length: 6,
    value: '123',
    isInvalid: true,
    isFieldInvalid: true,
  },
  {
    caseId: 'alphanumeric',
    id: 'otp-alphanumeric',
    length: 6,
    value: 'A1B2C3',
    validationType: 'alphanumeric',
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.caseId,
  snapshot: snapshot(config),
}))
