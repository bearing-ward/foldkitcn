import { Array as EffectArray, Order } from 'effect'

import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type SliderConfig = Readonly<{
  values: ReadonlyArray<number>
  className?: string
  min?: number
  max?: number
  step?: number
  orientation?: 'horizontal' | 'vertical'
  dir?: 'ltr' | 'rtl'
  isDisabled?: boolean
  id?: string
}>

const sliderBaseClassName = 'data-horizontal:w-full data-vertical:h-full'
const sliderControlBaseClassName =
  'relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col'
const sliderTrackBaseClassName =
  'relative grow overflow-hidden rounded-full bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1'
const sliderRangeBaseClassName =
  'bg-primary select-none data-horizontal:h-full data-vertical:w-full'
const sliderThumbBaseClassName =
  'relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50'

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
  pointerdown: 'passes-through',
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

const cn = (...classes: ReadonlyArray<string | undefined>): string =>
  classes.filter(Boolean).join(' ')

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

const cssPropertyName = (property: string): string =>
  property.replaceAll(/[A-Z]/gu, match => `-${match.toLowerCase()}`)

const styleAttr = (styles: Readonly<Record<string, string>>): string =>
  Object.entries(styles)
    .map(([property, value]) => `${cssPropertyName(property)}: ${value};`)
    .join(' ')

const cssNumber = (value: number): string => String(Number(value.toFixed(6)))

const edgePosition = (percentage: number): string =>
  `calc(${cssNumber(percentage)}% + ${cssNumber(
    6 - (12 * percentage) / 100,
  )}px)`

const edgeSize = (percentage: number): string =>
  `calc(${cssNumber(percentage)}% + ${cssNumber(-(12 * percentage) / 100)}px)`

const stateAttributes = (
  config: SliderConfig,
): Readonly<Record<string, string | undefined>> => ({
  'data-orientation': config.orientation ?? 'horizontal',
  ...(config.isDisabled === true ? { 'data-disabled': '' } : {}),
})

const indicatorStyle = (config: SliderConfig): string => {
  const values = EffectArray.sort(config.values, Order.Number)
  const min = config.min ?? 0
  const max = config.max ?? 100
  const valueToPercent = (value: number): number =>
    ((value - min) * 100) / (max - min)
  const start = valueToPercent(values[0] ?? min)
  const end = valueToPercent(values.at(-1) ?? start)
  const size = values.length > 1 ? end - start : start

  if (config.orientation === 'vertical') {
    return styleAttr({
      position: 'absolute',
      width: 'inherit',
      bottom: edgePosition(start),
      height: edgePosition(size),
    })
  }

  return styleAttr({
    position: 'relative',
    height: 'inherit',
    insetInlineStart: values.length > 1 ? edgePosition(start) : '0',
    width: values.length > 1 ? edgeSize(size) : edgePosition(size),
  })
}

const thumbStyle = (config: SliderConfig, value: number): string => {
  const min = config.min ?? 0
  const max = config.max ?? 100
  const percent = ((value - min) * 100) / (max - min)

  if (config.orientation === 'vertical') {
    return styleAttr({
      position: 'absolute',
      bottom: edgePosition(percent),
      left: '50%',
      translate: '-50% 50%',
    })
  }

  return styleAttr({
    position: 'absolute',
    insetInlineStart: edgePosition(percent),
    top: '50%',
    translate: config.dir === 'rtl' ? '50% -50%' : '-50% -50%',
  })
}

const renderSliderElement = (config: SliderConfig): Element => {
  const min = config.min ?? 0
  const max = config.max ?? 100
  const step = config.step ?? 1
  const values = EffectArray.sort(config.values, Order.Number)
  const root = document.createElement('div')
  setAttributes(root, {
    role: 'group',
    ...(config.id === undefined ? {} : { id: config.id }),
    ...(config.dir === undefined ? {} : { dir: config.dir }),
    'data-slot': 'slider',
    class: cn(sliderBaseClassName, config.className),
    ...stateAttributes(config),
  })

  const control = document.createElement('div')
  setAttributes(control, {
    'data-base-ui-slider-control': '',
    class: sliderControlBaseClassName,
    ...stateAttributes(config),
  })

  const track = document.createElement('div')
  setAttributes(track, {
    style: 'position: relative;',
    'data-slot': 'slider-track',
    class: sliderTrackBaseClassName,
    ...stateAttributes(config),
  })

  const range = document.createElement('div')
  setAttributes(range, {
    'data-base-ui-slider-indicator': '',
    style: indicatorStyle(config),
    'data-slot': 'slider-range',
    class: sliderRangeBaseClassName,
    ...stateAttributes(config),
  })

  track.append(range)
  control.append(track)

  values.map((value, index) => {
    const thumb = document.createElement('div')
    setAttributes(thumb, {
      id: `${config.id ?? 'slider'}-thumb-${index}`,
      'data-index': String(index),
      'data-slot': 'slider-thumb',
      style: thumbStyle(config, value),
      class: sliderThumbBaseClassName,
      ...stateAttributes(config),
    })

    const input = document.createElement('input')
    setAttributes(input, {
      type: 'range',
      id: `${config.id ?? 'slider'}-input-${index}`,
      'aria-orientation': config.orientation ?? 'horizontal',
      'aria-valuenow': String(value),
      ...(values.length === 2
        ? {
            'aria-valuetext': `${value} ${index === 0 ? 'start' : 'end'} range`,
          }
        : {}),
      min: String(min),
      max: String(max),
      step: String(step),
      value: String(value),
      style:
        'clip-path: inset(50%); overflow: hidden; white-space: nowrap; border: 0px; padding: 0px; width: 100%; height: 100%; margin: -1px; position: fixed; top: 0px; left: 0px;',
      ...(config.isDisabled === true ? { disabled: '' } : {}),
    })

    thumb.append(input)
    control.append(thumb)

    return value
  })

  root.append(control)

  return root
}

const snapshotFromElement = (
  element: Element,
  keyboard: FixtureSnapshot['keyboardBehavior'],
): FixtureSnapshot => {
  document.body.append(element)
  const snapshot = snapshotElement(element, keyboard)
  element.remove()

  return snapshot
}

const sliderSnapshot = (config: SliderConfig): FixtureSnapshot =>
  snapshotFromElement(
    renderSliderElement(config),
    config.isDisabled === true ? suppressedKeyboard : keyboardBehavior,
  )

const controlledSnapshot = (): FixtureSnapshot => {
  const root = document.createElement('div')
  setAttributes(root, {
    class: 'mx-auto grid w-full max-w-xs gap-3',
  })

  const header = document.createElement('div')
  setAttributes(header, {
    class: 'flex items-center justify-between gap-2',
  })

  const label = document.createElement('span')
  setAttributes(label, { id: 'slider-demo-temperature' })
  label.textContent = 'Temperature'

  const value = document.createElement('span')
  setAttributes(value, { class: 'text-sm text-muted-foreground' })
  value.textContent = '0.3, 0.7'

  header.append(label, value)
  root.append(
    header,
    renderSliderElement({
      id: 'slider-demo-temperature',
      values: [0.3, 0.7],
      min: 0,
      max: 1,
      step: 0.1,
    }),
  )

  return snapshotFromElement(root, keyboardBehavior)
}

const verticalSnapshot = (): FixtureSnapshot => {
  const root = document.createElement('div')
  setAttributes(root, {
    class: 'mx-auto flex w-full max-w-xs items-center justify-center gap-6',
  })
  root.append(
    renderSliderElement({
      values: [50],
      max: 100,
      step: 1,
      orientation: 'vertical',
      className: 'h-40',
    }),
    renderSliderElement({
      values: [25],
      max: 100,
      step: 1,
      orientation: 'vertical',
      className: 'h-40',
    }),
  )

  return snapshotFromElement(root, keyboardBehavior)
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'slider-controlled',
    snapshot: controlledSnapshot(),
  },
  {
    id: 'slider-demo',
    snapshot: sliderSnapshot({
      values: [75],
      max: 100,
      step: 1,
      className: 'mx-auto w-full max-w-xs',
    }),
  },
  {
    id: 'slider-disabled',
    snapshot: sliderSnapshot({
      values: [50],
      max: 100,
      step: 1,
      isDisabled: true,
      className: 'mx-auto w-full max-w-xs',
    }),
  },
  {
    id: 'slider-multiple',
    snapshot: sliderSnapshot({
      values: [10, 20, 70],
      max: 100,
      step: 10,
      className: 'mx-auto w-full max-w-xs',
    }),
  },
  {
    id: 'slider-range',
    snapshot: sliderSnapshot({
      values: [25, 50],
      max: 100,
      step: 5,
      className: 'mx-auto w-full max-w-xs',
    }),
  },
  {
    id: 'slider-rtl',
    snapshot: sliderSnapshot({
      values: [75],
      max: 100,
      step: 1,
      dir: 'rtl',
      className: 'mx-auto w-full max-w-xs',
    }),
  },
  {
    id: 'slider-vertical',
    snapshot: verticalSnapshot(),
  },
]
