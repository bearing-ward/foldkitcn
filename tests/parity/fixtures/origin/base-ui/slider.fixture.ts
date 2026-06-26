import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type CaseConfig = Readonly<{
  caseId: string
  values: ReadonlyArray<number>
  max: number
  step: number
  orientation?: 'horizontal' | 'vertical'
  isDisabled?: boolean
}>

const keyboardBehavior = {
  click: 'activates',
  Enter: 'suppressed',
  Space: 'suppressed',
  ArrowDown: 'activates',
  ArrowLeft: 'activates',
  ArrowRight: 'activates',
  ArrowUp: 'activates',
  Home: 'activates',
  End: 'activates',
  PageDown: 'activates',
  PageUp: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'activates',
}

const suppressedKeyboard = {
  click: 'suppressed',
  Enter: 'suppressed',
  Space: 'suppressed',
  ArrowDown: 'suppressed',
  ArrowLeft: 'suppressed',
  ArrowRight: 'suppressed',
  ArrowUp: 'suppressed',
  Home: 'suppressed',
  End: 'suppressed',
  PageDown: 'suppressed',
  PageUp: 'suppressed',
  mousedown: 'suppressed',
  pointerdown: 'suppressed',
}

const percentage = (value: number): number => value

const setAttributes = (
  element: Element,
  attributes: Readonly<Record<string, string | undefined>>,
): Element => {
  Object.entries(attributes).reduce((currentElement, [name, value]) => {
    if (value !== undefined) {
      currentElement.setAttribute(name, value)
    }

    return currentElement
  }, element)

  return element
}

const stateAttributes = (
  config: CaseConfig,
): Readonly<Record<string, string | undefined>> => ({
  'data-orientation': config.orientation ?? 'horizontal',
  ...(config.isDisabled === true ? { 'data-disabled': '' } : {}),
})

const cssPropertyName = (property: string): string =>
  property.replaceAll(/[A-Z]/gu, match => `-${match.toLowerCase()}`)

const styleAttr = (styles: Readonly<Record<string, string>>): string =>
  Object.entries(styles)
    .map(([property, value]) => `${cssPropertyName(property)}: ${value};`)
    .join(' ')

const indicatorStyle = (config: CaseConfig): string => {
  const start = percentage(config.values[0] ?? 0)
  const end = percentage(config.values.at(-1) ?? start)
  const size = config.values.length > 1 ? end - start : start

  if (config.orientation === 'vertical') {
    return styleAttr({
      position: 'absolute',
      width: 'inherit',
      bottom: `${start}%`,
      height: `${size}%`,
    })
  }

  return styleAttr({
    position: 'relative',
    height: 'inherit',
    insetInlineStart: config.values.length > 1 ? `${start}%` : '0',
    width: `${size}%`,
  })
}

const thumbStyle = (config: CaseConfig, value: number): string => {
  if (config.orientation === 'vertical') {
    return styleAttr({
      position: 'absolute',
      bottom: `${percentage(value)}%`,
      left: '50%',
      translate: '-50% 50%',
    })
  }

  return styleAttr({
    position: 'absolute',
    insetInlineStart: `${percentage(value)}%`,
    top: '50%',
    translate: '-50% -50%',
  })
}

const renderOriginSlider = (config: CaseConfig): FixtureSnapshot => {
  const root = document.createElement('div')
  setAttributes(root, { role: 'group', ...stateAttributes(config) })

  const control = document.createElement('div')
  setAttributes(control, {
    'data-base-ui-slider-control': '',
    ...stateAttributes(config),
  })

  const track = document.createElement('div')
  setAttributes(track, {
    style: 'position: relative;',
    ...stateAttributes(config),
  })

  const indicator = document.createElement('div')
  setAttributes(indicator, {
    'data-base-ui-slider-indicator': '',
    style: indicatorStyle(config),
    ...stateAttributes(config),
  })

  track.append(indicator)
  control.append(track)

  config.values.map((value, index) => {
    const thumb = document.createElement('div')
    setAttributes(thumb, {
      id: `slider-thumb-${index}`,
      'data-index': String(index),
      style: thumbStyle(config, value),
      ...stateAttributes(config),
    })

    const input = document.createElement('input')
    setAttributes(input, {
      type: 'range',
      id: `slider-input-${index}`,
      'aria-orientation': config.orientation ?? 'horizontal',
      'aria-valuenow': String(value),
      min: '0',
      max: String(config.max),
      step: String(config.step),
      value: String(value),
      style:
        'clip-path: inset(50%); overflow: hidden; white-space: nowrap; border: 0px; padding: 0px; width: 100%; height: 100%; margin: -1px; position: fixed; top: 0px; left: 0px;',
      ...(config.values.length === 2
        ? {
            'aria-valuetext': `${value} ${index === 0 ? 'start' : 'end'} range`,
          }
        : {}),
      ...(config.isDisabled === true ? { disabled: '' } : {}),
    })

    thumb.append(input)
    control.append(thumb)

    return value
  })

  const output = document.createElement('output')
  setAttributes(output, {
    'aria-live': 'off',
    for: config.values.map((_, index) => `slider-input-${index}`).join(' '),
    ...stateAttributes(config),
  })
  output.textContent = config.values.join(' – ')

  root.append(control, output)
  document.body.append(root)
  const snapshot = snapshotElement(
    root,
    config.isDisabled === true ? suppressedKeyboard : keyboardBehavior,
  )
  root.remove()

  return snapshot
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    caseId: 'single-horizontal',
    values: [75],
    max: 100,
    step: 1,
  },
  {
    caseId: 'range-horizontal',
    values: [25, 50],
    max: 100,
    step: 5,
  },
  {
    caseId: 'disabled-vertical',
    values: [50],
    max: 100,
    step: 1,
    orientation: 'vertical',
    isDisabled: true,
  },
  {
    caseId: 'multiple-thumbs',
    values: [10, 20, 70],
    max: 100,
    step: 10,
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.caseId,
  snapshot: renderOriginSlider(config),
}))
