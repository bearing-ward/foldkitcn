import { createElement } from 'react'
import type { ComponentProps, ReactElement } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

import { Switch } from '../../../../../repos/base-ui/packages/react/src/switch'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type RootProps = ComponentProps<typeof Switch.Root>

type CaseConfig = Readonly<{
  id: string
  props: RootProps
  children?: ReactElement
}>

const ignoreCheckedChange = (_isChecked: boolean): undefined => undefined

const withoutRootId = (snapshot: FixtureSnapshot): FixtureSnapshot => {
  const { id: _id, ...attributes } = snapshot.dom.attributes ?? {}

  return {
    ...snapshot,
    dom: {
      ...snapshot.dom,
      attributes,
    },
  }
}

const renderOriginSwitch = ({
  id,
  props,
  children,
}: CaseConfig): FixtureSnapshot => {
  const container = document.createElement('div')
  const root = createRoot(container)

  document.body.append(container)

  flushSync(() => {
    root.render(createElement(Switch.Root, props, children))
  })

  const element = container.firstElementChild

  if (element === null) {
    throw new Error(`Base UI Switch did not render: ${id}`)
  }

  const snapshot = withoutRootId(snapshotElement(element, {}))

  flushSync(() => {
    root.unmount()
  })
  container.remove()

  return snapshot
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    id: 'unchecked',
    props: {},
  },
  {
    id: 'checked-with-thumb',
    props: { checked: true, onCheckedChange: ignoreCheckedChange },
    children: createElement(Switch.Thumb),
  },
  {
    id: 'disabled-readonly-required',
    props: {
      checked: true,
      disabled: true,
      readOnly: true,
      required: true,
      onCheckedChange: ignoreCheckedChange,
    },
    children: createElement(Switch.Thumb),
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.id,
  snapshot: renderOriginSwitch(config),
}))
