import { createElement } from 'react'
import type { ComponentProps } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

import { Button } from '../../../../../repos/base-ui/packages/react/src/button/Button'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type ButtonProps = ComponentProps<typeof Button>

interface EventCounters {
  click: number
  mouseDown: number
  pointerDown: number
}

type CaseConfig = Readonly<{
  id: string
  label: string
  props: ButtonProps
}>

const isDisabled = (element: Element): boolean =>
  element.hasAttribute('disabled') ||
  element.getAttribute('aria-disabled') === 'true'

const eventView = (element: Element): Window => {
  const view = element.ownerDocument.defaultView

  if (view === null) {
    throw new Error('Expected origin fixture element to have a defaultView.')
  }

  return view
}

const resetCounters = (counters: EventCounters): void => {
  counters.click = 0
  counters.mouseDown = 0
  counters.pointerDown = 0
}

const dispatchClick = (element: Element): void => {
  const view = eventView(element)

  element.dispatchEvent(
    new view.MouseEvent('click', { bubbles: true, cancelable: true }),
  )
}

const dispatchMouseDown = (element: Element): void => {
  const view = eventView(element)

  element.dispatchEvent(
    new view.MouseEvent('mousedown', { bubbles: true, cancelable: true }),
  )
}

const dispatchPointerDown = (element: Element): void => {
  const view = eventView(element)
  const EventConstructor =
    typeof view.PointerEvent === 'function'
      ? view.PointerEvent
      : view.MouseEvent

  element.dispatchEvent(
    new EventConstructor('pointerdown', { bubbles: true, cancelable: true }),
  )
}

const dispatchKeyboard = (element: Element, key: string): void => {
  const view = eventView(element)

  element.dispatchEvent(
    new view.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
  )
  element.dispatchEvent(
    new view.KeyboardEvent('keyup', { key, bubbles: true, cancelable: true }),
  )
}

const clickBehavior = (
  element: Element,
  counters: EventCounters,
): 'activates' | 'suppressed' => {
  resetCounters(counters)
  dispatchClick(element)

  return counters.click > 0 ? 'activates' : 'suppressed'
}

const passthroughBehavior = (
  element: Element,
  counters: EventCounters,
  eventName: 'mousedown' | 'pointerdown',
): 'passes-through' | 'suppressed' => {
  resetCounters(counters)

  if (eventName === 'mousedown') {
    dispatchMouseDown(element)
  } else {
    dispatchPointerDown(element)
  }

  const count =
    eventName === 'mousedown' ? counters.mouseDown : counters.pointerDown

  return count > 0 ? 'passes-through' : 'suppressed'
}

const keyboardBehavior = (
  element: Element,
  counters: EventCounters,
  key: 'Enter' | ' ',
): 'activates' | 'native-activates' | 'suppressed' => {
  if (element.tagName === 'BUTTON' && !isDisabled(element)) {
    return 'native-activates'
  }

  resetCounters(counters)
  dispatchKeyboard(element, key)

  return counters.click > 0 ? 'activates' : 'suppressed'
}

const behaviorSnapshot = (
  element: Element,
  counters: EventCounters,
): FixtureSnapshot['keyboardBehavior'] => ({
  click: clickBehavior(element, counters),
  Enter: keyboardBehavior(element, counters, 'Enter'),
  Space: keyboardBehavior(element, counters, ' '),
  mousedown: passthroughBehavior(element, counters, 'mousedown'),
  pointerdown: passthroughBehavior(element, counters, 'pointerdown'),
})

const renderOriginButton = ({ label, props }: CaseConfig): FixtureSnapshot => {
  const container = document.createElement('div')
  const counters: EventCounters = {
    click: 0,
    mouseDown: 0,
    pointerDown: 0,
  }
  const root = createRoot(container)

  document.body.append(container)

  flushSync(() => {
    root.render(
      createElement(
        Button,
        {
          ...props,
          onClick: () => {
            counters.click += 1
          },
          onMouseDown: () => {
            counters.mouseDown += 1
          },
          onPointerDown: () => {
            counters.pointerDown += 1
          },
        },
        label,
      ),
    )
  })

  const element = container.firstElementChild

  if (element === null) {
    throw new Error(`Base UI Button did not render: ${label}`)
  }

  const snapshot = snapshotElement(element, behaviorSnapshot(element, counters))

  flushSync(() => {
    root.unmount()
  })
  container.remove()

  return snapshot
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    id: 'native-enabled',
    label: 'Native',
    props: {},
  },
  {
    id: 'native-disabled',
    label: 'Disabled',
    props: { disabled: true },
  },
  {
    id: 'native-focusable-disabled',
    label: 'Focusable disabled',
    props: { disabled: true, focusableWhenDisabled: true },
  },
  {
    id: 'non-native-enabled',
    label: 'Div button',
    props: { nativeButton: false, render: createElement('div') },
  },
  {
    id: 'non-native-disabled',
    label: 'Non-native disabled',
    props: {
      disabled: true,
      nativeButton: false,
      render: createElement('div'),
    },
  },
  {
    id: 'native-submit',
    label: 'Submit',
    props: { type: 'submit' },
  },
  {
    id: 'native-reset',
    label: 'Reset',
    props: { type: 'reset' },
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.id,
  snapshot: renderOriginButton(config),
}))
