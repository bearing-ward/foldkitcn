import { createElement } from 'react'
import type { ComponentProps } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

import { Input } from '../../../../../repos/base-ui/packages/react/src/input/Input'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type InputProps = ComponentProps<typeof Input>

type CaseConfig = Readonly<{
  id: string
  props: InputProps
}>

const ignoreChange = (): undefined => undefined

const renderOriginInput = ({ id, props }: CaseConfig): FixtureSnapshot => {
  const container = document.createElement('div')
  const root = createRoot(container)

  document.body.append(container)

  flushSync(() => {
    root.render(createElement(Input, props))
  })

  const element = container.firstElementChild

  if (element === null) {
    throw new Error(`Base UI Input did not render: ${id}`)
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
    id: 'basic',
    props: { id: 'name', name: 'name', placeholder: 'Name' },
  },
  {
    id: 'controlled-value',
    props: { id: 'controlled', value: 'Ada', onChange: ignoreChange },
  },
  {
    id: 'disabled',
    props: { id: 'disabled', disabled: true },
  },
  {
    id: 'invalid',
    props: { id: 'invalid', 'aria-invalid': true },
  },
  {
    id: 'required-readonly',
    props: { id: 'required-readonly', required: true, readOnly: true },
  },
  {
    id: 'file',
    props: { id: 'file', type: 'file' },
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.id,
  snapshot: renderOriginInput(config),
}))
