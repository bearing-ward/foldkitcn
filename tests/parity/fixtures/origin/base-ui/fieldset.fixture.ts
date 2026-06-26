import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type CaseConfig = Readonly<{
  id: string
  rootId: string
  legendId: string
  legend: string
  disabled?: boolean
  name?: string
  form?: string
}>

const renderOriginFieldset = (config: CaseConfig): FixtureSnapshot => {
  const fieldset = document.createElement('fieldset')
  const legend = document.createElement('div')
  const input = document.createElement('input')

  fieldset.id = config.rootId
  fieldset.setAttribute('aria-labelledby', config.legendId)

  if (config.name !== undefined) {
    fieldset.setAttribute('name', config.name)
  }

  if (config.form !== undefined) {
    fieldset.setAttribute('form', config.form)
  }

  if (config.disabled === true) {
    fieldset.setAttribute('disabled', '')
    fieldset.dataset.disabled = ''
    legend.dataset.disabled = ''
    input.disabled = true
  }

  legend.id = config.legendId
  legend.textContent = config.legend
  input.dataset.testid = `${config.rootId}-control`

  fieldset.append(legend, input)
  document.body.append(fieldset)
  const snapshot = snapshotElement(fieldset, {})
  fieldset.remove()

  return snapshot
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    id: 'basic',
    rootId: 'account',
    legendId: 'account-legend',
    legend: 'Account details',
  },
  {
    id: 'custom-legend-id',
    rootId: 'billing',
    legendId: 'billing-heading',
    legend: 'Billing details',
    name: 'billing',
    form: 'checkout',
  },
  {
    id: 'disabled',
    rootId: 'shipping',
    legendId: 'shipping-legend',
    legend: 'Shipping details',
    disabled: true,
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.id,
  snapshot: renderOriginFieldset(config),
}))
