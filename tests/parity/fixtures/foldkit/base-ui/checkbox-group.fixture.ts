import { Option } from 'effect'
import { html } from 'foldkit/html'

import * as CheckboxGroup from '../../../../../src/registry/base-ui/checkbox-group'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotHtml } from '../render'

const baseKeyboard = {
  click: 'activates',
  Enter: 'suppressed',
  Space: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const items: ReadonlyArray<CheckboxGroup.CheckboxGroupItemDescriptor> = [
  { id: 'apple-fuji', value: 'fuji-apple' },
  { id: 'apple-gala', value: 'gala-apple' },
  { id: 'apple-granny', value: 'granny-smith-apple' },
]

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof CheckboxGroup.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = baseKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const checkboxGroupRoot = (
  h: ReturnType<typeof html<never>>,
  config: Omit<CheckboxGroup.ViewConfig<never>, 'items' | 'toView'> &
    Readonly<{
      items?: ReadonlyArray<CheckboxGroup.CheckboxGroupItemDescriptor>
    }>,
) =>
  CheckboxGroup.view<never>({
    id: 'apples',
    ariaLabelledBy: 'apples-caption',
    items,
    ...config,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          ...Option.match(attributes.parent, {
            onNone: () => [],
            onSome: parent => [
              h.span(
                [...parent.root],
                parent.indicator.length > 0
                  ? [h.span([...parent.indicator], [])]
                  : [],
              ),
              h.input([...parent.input]),
            ],
          }),
          ...attributes.items.flatMap(item => [
            h.span(
              [...item.root],
              item.indicator.length > 0
                ? [h.span([...item.indicator], [])]
                : [],
            ),
            h.input([...item.input]),
          ]),
        ],
      ),
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'hero-default-value',
    snapshot: snapshot(h =>
      checkboxGroupRoot(h, {
        value: ['fuji-apple'],
        name: 'apple',
      }),
    ),
  },
  {
    id: 'parent-mixed',
    snapshot: snapshot(h =>
      checkboxGroupRoot(h, {
        value: ['fuji-apple'],
        hasParent: true,
        allValues: ['fuji-apple', 'gala-apple', 'granny-smith-apple'],
      }),
    ),
  },
  {
    id: 'disabled-required',
    snapshot: snapshot(
      h =>
        checkboxGroupRoot(h, {
          value: ['fuji-apple'],
          name: 'apple',
          isDisabled: true,
          isRequired: true,
        }),
      suppressedKeyboard,
    ),
  },
]
