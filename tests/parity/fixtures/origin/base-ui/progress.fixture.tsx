import { createElement } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

import { Progress } from '../../../../../repos/base-ui/packages/react/src/progress'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type CaseConfig = Readonly<{
  id: string
  value: number | null
  min?: number
  max?: number
  label?: string
  labelId?: string
  includeValue?: boolean
}>

const renderOriginProgress = (config: CaseConfig): FixtureSnapshot => {
  const container = document.createElement('div')
  const root = createRoot(container)
  const { id, value, min, max, label, labelId, includeValue = false } = config
  const maybeLabel =
    label === undefined
      ? undefined
      : createElement(Progress.Label, { id: labelId }, label)
  const maybeValue = includeValue ? createElement(Progress.Value) : undefined

  document.body.append(container)

  flushSync(() => {
    root.render(
      createElement(
        Progress.Root,
        { value, min, max },
        maybeLabel,
        maybeValue,
        createElement(
          Progress.Track,
          {},
          createElement(Progress.Indicator, {}),
        ),
      ),
    )
  })

  const element = container.firstElementChild

  if (element === null) {
    throw new Error(`Base UI Progress did not render: ${id}`)
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
    id: 'default-determinate',
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
    id: 'complete',
    value: 100,
  },
  {
    id: 'indeterminate',
    value: null,
  },
  {
    id: 'label-value-composition',
    value: 45,
    label: 'Loading files',
    labelId: 'progress-label',
    includeValue: true,
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.id,
  snapshot: renderOriginProgress(config),
}))
