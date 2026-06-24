import type {
  BoundingBox,
  DomSnapshot,
} from '../../src/registry/parity/canonicalize'

export type ComparisonKind =
  | 'class-tokens'
  | 'attributes'
  | 'dom-structure'
  | 'computed-style'
  | 'colors'
  | 'dimensions'
  | 'bounding-box'
  | 'keyboard-behavior'

export interface FixtureSnapshot {
  readonly dom: DomSnapshot
  readonly className: string
  readonly computedStyle: Readonly<Record<string, string>>
  readonly boundingBox: BoundingBox
  readonly keyboardBehavior: Readonly<Record<string, string>>
}

export interface FixtureCase {
  readonly id: string
  readonly snapshot: FixtureSnapshot
}

export interface FixtureModule {
  readonly cases: ReadonlyArray<FixtureCase>
}

export const emptyComputedStyle: Readonly<Record<string, string>> = {
  'background-color': 'rgba(0, 0, 0, 0)',
  'border-color': 'rgba(0, 0, 0, 0)',
  'border-radius': '0px',
  color: 'rgb(0, 0, 0)',
  display: 'inline-block',
  'font-size': '13px',
  height: '32px',
  'line-height': 'normal',
  opacity: '1',
  'padding-bottom': '2px',
  'padding-left': '6px',
  'padding-right': '6px',
  'padding-top': '2px',
  width: '64px',
}

export const defaultBoundingBox: BoundingBox = {
  x: 0,
  y: 0,
  width: 64,
  height: 32,
}

export const nativeEnabledKeyboard: Readonly<Record<string, string>> = {
  click: 'activates',
  Enter: 'native-activates',
  Space: 'native-activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

export const suppressedKeyboard: Readonly<Record<string, string>> = {
  click: 'suppressed',
  Enter: 'suppressed',
  Space: 'suppressed',
  mousedown: 'suppressed',
  pointerdown: 'suppressed',
}

export const nonNativeEnabledKeyboard: Readonly<Record<string, string>> = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

export const withFixtureDefaults = (
  dom: DomSnapshot,
  keyboardBehavior: Readonly<Record<string, string>>,
): FixtureSnapshot => ({
  dom,
  className:
    typeof dom.attributes?.['class'] === 'string' ? dom.attributes.class : '',
  computedStyle: emptyComputedStyle,
  boundingBox: defaultBoundingBox,
  keyboardBehavior,
})
