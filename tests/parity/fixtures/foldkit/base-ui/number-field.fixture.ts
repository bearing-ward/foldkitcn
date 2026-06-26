import { html } from 'foldkit/html'

import * as NumberField from '../../../../../src/registry/base-ui/number-field'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotHtml } from '../render'

type CaseConfig = Omit<NumberField.ViewConfig<never>, 'toView'> &
  Readonly<{
    caseId: string
    label: string
    groupStyle?: string
  }>

const baseKeyboard = {
  click: 'activates',
  Enter: 'suppressed',
  Space: 'suppressed',
  ArrowDown: 'activates',
  ArrowUp: 'activates',
  Home: 'activates',
  End: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const fieldStyle =
  'display: flex; flex-direction: column; align-items: start; gap: 4px; width: 134px;'
const scrubAreaStyle =
  'cursor: ew-resize; font-weight: 700; user-select: none; height: 20px;'
const groupStyle = 'display: flex; height: 32px; width: 134px;'
const inputStyle =
  'box-sizing: border-box; margin: 0; padding: 0 8px; border: 1px solid black; border-radius: 0; width: 70px; height: 32px; font-size: 14px; line-height: 20px; text-align: left; font-variant-numeric: tabular-nums;'
const buttonStyle =
  'box-sizing: border-box; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; margin: 0; padding: 0; border: 1px solid black; border-radius: 0; background-color: white;'

const renderFoldkitNumberField = (config: CaseConfig): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(
    NumberField.view<never>({
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root, h.Attribute('style', fieldStyle)],
          [
            h.span(
              [...attributes.scrubArea, h.Attribute('style', scrubAreaStyle)],
              [
                h.label(
                  [h.Attribute('for', attributes.state.inputId)],
                  [config.label],
                ),
                h.span([...attributes.scrubAreaCursor], ['cursor']),
              ],
            ),
            h.div(
              [
                ...attributes.group,
                h.Attribute('style', config.groupStyle ?? groupStyle),
              ],
              [
                h.button(
                  [...attributes.decrement, h.Attribute('style', buttonStyle)],
                  ['-'],
                ),
                h.input([
                  ...attributes.input,
                  h.Attribute('style', inputStyle),
                ]),
                h.button(
                  [...attributes.increment, h.Attribute('style', buttonStyle)],
                  ['+'],
                ),
              ],
            ),
            h.input([...attributes.hiddenInput]),
          ],
        ),
    }),
    config.isDisabled === true ? suppressedKeyboard : baseKeyboard,
  )
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    caseId: 'hero',
    id: 'amount-field',
    inputId: 'amount',
    name: 'amount',
    label: 'Amount',
    value: 100,
    textValue: '100',
  },
  {
    caseId: 'bounded-step',
    id: 'quantity-field',
    inputId: 'quantity',
    name: 'quantity',
    label: 'Quantity',
    value: 5,
    textValue: '5',
    min: 0,
    max: 10,
    step: 0.5,
    isRequired: true,
  },
  {
    caseId: 'disabled-readonly-invalid',
    id: 'disabled-field',
    inputId: 'disabled-amount',
    name: 'disabledAmount',
    label: 'Disabled amount',
    value: null,
    textValue: 'oops',
    isDisabled: true,
    isReadOnly: true,
    isFieldInvalid: true,
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.caseId,
  snapshot: renderFoldkitNumberField(config),
}))
