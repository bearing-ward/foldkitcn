import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import {
  nativeEnabledKeyboard,
  nonNativeEnabledKeyboard,
  suppressedKeyboard,
} from '../../../fixture'
import { snapshotElement } from '../../dom'

type ElementKind = 'button' | 'div'

type CaseConfig = Readonly<{
  id: string
  elementKind: ElementKind
  label: string
  isDisabled?: boolean
  isPressed: boolean
  keyboardBehavior: FixtureSnapshot['keyboardBehavior']
}>

const attributeEntries = (
  config: CaseConfig,
): ReadonlyArray<readonly [string, string]> => [
  ...(config.elementKind === 'button'
    ? [['type', 'button'] as const, ['tabindex', '0'] as const]
    : [
        ['role', 'button'] as const,
        ['tabindex', config.isDisabled === true ? '-1' : '0'] as const,
      ]),
  ...(config.isDisabled === true && config.elementKind === 'button'
    ? [['disabled', ''] as const, ['data-disabled', ''] as const]
    : []),
  ...(config.isDisabled === true && config.elementKind === 'div'
    ? [['aria-disabled', 'true'] as const, ['data-disabled', ''] as const]
    : []),
  ['aria-pressed', String(config.isPressed)] as const,
  ...(config.isPressed ? [['data-pressed', ''] as const] : []),
]

const renderOriginToggle = (config: CaseConfig): FixtureSnapshot => {
  const element = document.createElement(config.elementKind)

  attributeEntries(config).reduce((currentElement, [name, value]) => {
    currentElement.setAttribute(name, value)

    return currentElement
  }, element)
  element.append(document.createTextNode(config.label))

  document.body.append(element)
  const snapshot = snapshotElement(element, config.keyboardBehavior)
  element.remove()

  return snapshot
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    id: 'native-unpressed',
    elementKind: 'button',
    label: 'Bookmark',
    isPressed: false,
    keyboardBehavior: nativeEnabledKeyboard,
  },
  {
    id: 'native-pressed',
    elementKind: 'button',
    label: 'Bookmark',
    isPressed: true,
    keyboardBehavior: nativeEnabledKeyboard,
  },
  {
    id: 'native-disabled',
    elementKind: 'button',
    label: 'Disabled',
    isPressed: false,
    isDisabled: true,
    keyboardBehavior: suppressedKeyboard,
  },
  {
    id: 'native-disabled-pressed',
    elementKind: 'button',
    label: 'Disabled',
    isPressed: true,
    isDisabled: true,
    keyboardBehavior: suppressedKeyboard,
  },
  {
    id: 'non-native-unpressed',
    elementKind: 'div',
    label: 'Div toggle',
    isPressed: false,
    keyboardBehavior: nonNativeEnabledKeyboard,
  },
  {
    id: 'non-native-disabled',
    elementKind: 'div',
    label: 'Div disabled',
    isPressed: false,
    isDisabled: true,
    keyboardBehavior: suppressedKeyboard,
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.id,
  snapshot: renderOriginToggle(config),
}))
