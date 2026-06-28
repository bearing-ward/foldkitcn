import { html } from 'foldkit/html'

import * as InputOTP from '../../../../../src/registry/shadcn/input-otp'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotHtml } from '../render'

type CaseConfig = Omit<InputOTP.ViewConfig<never>, 'toView'> &
  Readonly<{
    caseId: string
    grouped?: boolean
    split?: boolean
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
    InputOTP.view<never>({
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          config.split === true
            ? [
                InputOTP.InputOTPGroup<never>({
                  attributes,
                  indexes: [0, 1, 2],
                }),
                InputOTP.InputOTPSeparator<never>(),
                InputOTP.InputOTPGroup<never>({
                  attributes,
                  indexes: [3, 4, 5],
                }),
                h.input([...attributes.hiddenInput]),
              ]
            : [
                InputOTP.InputOTPGroup<never>({
                  attributes,
                  indexes: Array.from(
                    { length: attributes.state.length },
                    (_item, index) => index,
                  ),
                }),
                h.input([...attributes.hiddenInput]),
              ],
        ),
    }),
    config.isDisabled === true ? suppressedKeyboard : keyboardBehavior,
  )
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    caseId: 'input-otp-demo',
    id: 'input-otp-demo',
    length: 6,
    value: '123456',
  },
  {
    caseId: 'input-otp-separator',
    id: 'input-otp-separator',
    length: 6,
    split: true,
  },
  {
    caseId: 'input-otp-disabled',
    id: 'disabled',
    length: 6,
    value: '123456',
    isDisabled: true,
    split: true,
  },
  {
    caseId: 'input-otp-invalid',
    id: 'input-otp-invalid',
    length: 6,
    value: '000000',
    isInvalid: true,
  },
  {
    caseId: 'input-otp-four-digits',
    id: 'input-otp-four-digits',
    length: 4,
    validationType: 'numeric',
  },
  {
    caseId: 'input-otp-alphanumeric',
    id: 'input-otp-alphanumeric',
    length: 6,
    validationType: 'alphanumeric',
    split: true,
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.caseId,
  snapshot: snapshot(config),
}))
