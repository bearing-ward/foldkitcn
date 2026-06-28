import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type Orientation = 'horizontal' | 'vertical'

type ScrollbarConfig = Readonly<{
  orientation: Orientation
  overflowX?: boolean
  overflowY?: boolean
  overflowXEnd?: boolean
  overflowYEnd?: boolean
  thumbSize: string
}>

type CaseConfig = Readonly<{
  id: string
  rootStyle: string
  viewportStyle: string
  viewportTabIndex: string
  contentOverflowX?: boolean
  contentOverflowY?: boolean
  contentOverflowXEnd?: boolean
  contentOverflowYEnd?: boolean
  rootOverflowX?: boolean
  rootOverflowY?: boolean
  rootOverflowXEnd?: boolean
  rootOverflowYEnd?: boolean
  scrollbars: ReadonlyArray<ScrollbarConfig>
  cornerStyle?: string
}>

const keyboardBehavior = {
  click: 'passes-through',
  Enter: 'passes-through',
  Space: 'passes-through',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const overflowAttributes = (
  config: Readonly<{
    overflowX?: boolean
    overflowY?: boolean
    overflowXEnd?: boolean
    overflowYEnd?: boolean
  }>,
): Readonly<Record<string, string>> => ({
  ...(config.overflowX === true ? { 'data-has-overflow-x': '' } : {}),
  ...(config.overflowY === true ? { 'data-has-overflow-y': '' } : {}),
  ...(config.overflowXEnd === true ? { 'data-overflow-x-end': '' } : {}),
  ...(config.overflowYEnd === true ? { 'data-overflow-y-end': '' } : {}),
})

const setAttributes = (
  element: HTMLElement,
  attributes: Readonly<Record<string, string>>,
): HTMLElement =>
  Object.entries(attributes).reduce((currentElement, [name, value]) => {
    currentElement.setAttribute(name, value)

    return currentElement
  }, element)

const div = (attributes: Readonly<Record<string, string>>): HTMLDivElement =>
  setAttributes(document.createElement('div'), attributes)

const contentElement = (config: CaseConfig): HTMLElement => {
  const wrapper = div({
    role: 'presentation',
    style: 'min-width: fit-content;',
    ...overflowAttributes({
      overflowX: config.contentOverflowX,
      overflowY: config.contentOverflowY,
      overflowXEnd: config.contentOverflowXEnd,
      overflowYEnd: config.contentOverflowYEnd,
    }),
  })
  const oversizedContent = div({
    style: 'width: 1000px; height: 1000px;',
  })

  wrapper.append(oversizedContent)

  return wrapper
}

const viewportElement = (config: CaseConfig): HTMLElement => {
  const viewport = div({
    role: 'presentation',
    tabindex: config.viewportTabIndex,
    style: config.viewportStyle,
    ...overflowAttributes({
      overflowX: config.rootOverflowX,
      overflowY: config.rootOverflowY,
      overflowXEnd: config.rootOverflowXEnd,
      overflowYEnd: config.rootOverflowYEnd,
    }),
  })

  viewport.append(contentElement(config))

  return viewport
}

const scrollbarStyle = (config: ScrollbarConfig): string =>
  config.orientation === 'horizontal'
    ? `position: absolute; touch-action: none; user-select: none; inset-inline-start: 0px; inset-inline-end: var(--scroll-area-corner-width); bottom: 0px; --scroll-area-thumb-width: ${config.thumbSize};`
    : `position: absolute; touch-action: none; user-select: none; top: 0px; bottom: var(--scroll-area-corner-height); inset-inline-end: 0px; --scroll-area-thumb-height: ${config.thumbSize};`

const thumbStyle = (orientation: Orientation): string =>
  orientation === 'horizontal'
    ? 'width: var(--scroll-area-thumb-width); transform: translate3d(0px, 0px, 0px);'
    : 'height: var(--scroll-area-thumb-height); transform: translate3d(0px, 0px, 0px);'

const scrollbarElement = (config: ScrollbarConfig): HTMLElement => {
  const scrollbar = div({
    'data-orientation': config.orientation,
    ...overflowAttributes(config),
    style: scrollbarStyle(config),
  })
  const thumb = div({
    'data-orientation': config.orientation,
    style: thumbStyle(config.orientation),
  })

  scrollbar.append(thumb)

  return scrollbar
}

const rootElement = (config: CaseConfig): HTMLElement => {
  const root = div({
    role: 'presentation',
    style: config.rootStyle,
    ...overflowAttributes({
      overflowX: config.rootOverflowX,
      overflowY: config.rootOverflowY,
      overflowXEnd: config.rootOverflowXEnd,
      overflowYEnd: config.rootOverflowYEnd,
    }),
  })

  root.append(
    viewportElement(config),
    ...config.scrollbars.map(scrollbarElement),
    ...(config.cornerStyle === undefined
      ? []
      : [div({ style: config.cornerStyle })]),
  )

  return root
}

const snapshotOriginScrollArea = (config: CaseConfig): FixtureSnapshot => {
  const element = rootElement(config)

  document.body.append(element)
  const snapshot = snapshotElement(element, keyboardBehavior)
  element.remove()

  return snapshot
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    id: 'vertical-overflow',
    rootStyle:
      'position: relative; --scroll-area-corner-height: 0px; --scroll-area-corner-width: 0px;',
    viewportStyle:
      'overflow: scroll; --scroll-area-overflow-x-start: 0px; --scroll-area-overflow-x-end: 0px; --scroll-area-overflow-y-start: 0px; --scroll-area-overflow-y-end: 800px;',
    viewportTabIndex: '0',
    rootOverflowY: true,
    rootOverflowYEnd: true,
    contentOverflowY: true,
    contentOverflowYEnd: true,
    scrollbars: [
      {
        orientation: 'vertical',
        overflowY: true,
        overflowYEnd: true,
        thumbSize: '40px',
      },
    ],
  },
  {
    id: 'both-axis-overflow',
    rootStyle:
      'position: relative; --scroll-area-corner-height: 10px; --scroll-area-corner-width: 10px;',
    viewportStyle:
      'overflow: scroll; --scroll-area-overflow-x-start: 0px; --scroll-area-overflow-x-end: 0px; --scroll-area-overflow-y-start: 0px; --scroll-area-overflow-y-end: 0px;',
    viewportTabIndex: '0',
    rootOverflowX: true,
    rootOverflowY: true,
    rootOverflowXEnd: true,
    rootOverflowYEnd: true,
    contentOverflowX: true,
    contentOverflowY: true,
    contentOverflowXEnd: true,
    contentOverflowYEnd: true,
    scrollbars: [
      {
        orientation: 'vertical',
        overflowX: true,
        overflowY: true,
        overflowXEnd: true,
        overflowYEnd: true,
        thumbSize: '40px',
      },
      {
        orientation: 'horizontal',
        overflowX: true,
        overflowY: true,
        overflowXEnd: true,
        overflowYEnd: true,
        thumbSize: '40px',
      },
    ],
    cornerStyle:
      'position: absolute; bottom: 0; inset-inline-end: 0; width: 10px; height: 10px;',
  },
  {
    id: 'kept-scrollbars-without-overflow',
    rootStyle:
      'position: relative; --scroll-area-corner-height: 0px; --scroll-area-corner-width: 0px;',
    viewportStyle:
      'overflow: scroll; --scroll-area-overflow-x-start: 0px; --scroll-area-overflow-x-end: 0px; --scroll-area-overflow-y-start: 0px; --scroll-area-overflow-y-end: 0px;',
    viewportTabIndex: '-1',
    scrollbars: [
      {
        orientation: 'vertical',
        thumbSize: '0px',
      },
      {
        orientation: 'horizontal',
        thumbSize: '0px',
      },
    ],
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.id,
  snapshot: snapshotOriginScrollArea(config),
}))
