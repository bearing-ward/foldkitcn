import { createElement } from 'react'
import type { ComponentProps } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

import { Separator } from '../../../../../repos/base-ui/packages/react/src/separator/Separator'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type SeparatorProps = ComponentProps<typeof Separator>

type CaseConfig = Readonly<{
  id: string
  props: SeparatorProps
}>

const renderOriginSeparator = ({ id, props }: CaseConfig): FixtureSnapshot => {
  const container = document.createElement('div')
  const root = createRoot(container)

  document.body.append(container)

  flushSync(() => {
    root.render(createElement(Separator, props))
  })

  const element = container.firstElementChild

  if (element === null) {
    throw new Error(`Base UI Separator did not render: ${id}`)
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
    id: 'horizontal-default',
    props: {},
  },
  {
    id: 'vertical',
    props: { orientation: 'vertical' },
  },
  {
    id: 'custom-element',
    props: { render: createElement('hr') },
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.id,
  snapshot: renderOriginSeparator(config),
}))
