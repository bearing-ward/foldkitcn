import { createElement } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

import { Meter } from '../../../../../repos/base-ui/packages/react/src/meter'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type CaseConfig = Readonly<{
  id: string
  value: number
  min?: number
  max?: number
  low?: number
  high?: number
  optimum?: number
  label?: string
  labelId?: string
  includeValue?: boolean
}>

const renderOriginMeter = (config: CaseConfig): FixtureSnapshot => {
  const container = document.createElement('div')
  const root = createRoot(container)
  const {
    id,
    value,
    min,
    max,
    low,
    high,
    optimum,
    label,
    labelId,
    includeValue = false,
  } = config
  const maybeLabel =
    label === undefined
      ? undefined
      : createElement(Meter.Label, { id: labelId }, label)
  const maybeValue = includeValue ? createElement(Meter.Value) : undefined
  const rootProps = { value, min, max, low, high, optimum }

  document.body.append(container)

  flushSync(() => {
    root.render(
      createElement(
        Meter.Root,
        rootProps,
        maybeLabel,
        maybeValue,
        createElement(Meter.Track, {}, createElement(Meter.Indicator, {})),
      ),
    )
  })

  const element = container.firstElementChild

  if (element === null) {
    throw new Error(`Base UI Meter did not render: ${id}`)
  }

  const snapshot = snapshotElement(element, {})

  flushSync(() => {
    root.unmount()
  })
  container.remove()

  return snapshot
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    id: 'default-meter',
    value: 30,
  },
  {
    id: 'custom-range',
    value: 30,
    min: 20,
    max: 40,
    includeValue: true,
  },
  {
    id: 'low-high-optimum',
    value: 60,
    low: 20,
    high: 80,
    optimum: 60,
  },
  {
    id: 'label-value-composition',
    value: 45,
    label: 'Battery Level',
    labelId: 'meter-label',
    includeValue: true,
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.id,
  snapshot: renderOriginMeter(config),
}))
