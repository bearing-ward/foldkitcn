import { html } from 'foldkit/html'

import * as Fieldset from '../../../../../src/registry/base-ui/fieldset'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

type CaseConfig = Readonly<{
  id: string
  rootId: string
  legendId?: string
  legend: string
  disabled?: boolean
  name?: string
  form?: string
}>

const renderFoldkitFieldset = (config: CaseConfig): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(
    Fieldset.view<never>({
      id: config.rootId,
      legendId: config.legendId,
      name: config.name,
      form: config.form,
      isDisabled: config.disabled,
      toView: attributes =>
        h.fieldset(
          [...attributes.root],
          [
            h.div([...attributes.legend], [config.legend]),
            h.input([
              h.Attribute('data-testid', `${config.rootId}-control`),
              ...(config.disabled === true ? [h.Disabled(true)] : []),
            ]),
          ],
        ),
    }),
    {},
  )
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    id: 'basic',
    rootId: 'account',
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
    legend: 'Shipping details',
    disabled: true,
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.id,
  snapshot: renderFoldkitFieldset(config),
}))
