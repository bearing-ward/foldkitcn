import { html } from 'foldkit/html'

import * as RadioGroup from '../../../../../src/registry/shadcn/radio-group'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotHtml } from '../render'

const baseKeyboard = {
  click: 'activates',
  Enter: 'suppressed',
  Space: 'activates',
  ArrowDown: 'activates',
  ArrowUp: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof RadioGroup.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = baseKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const items: ReadonlyArray<RadioGroup.RadioGroupItemDescriptor> = [
  { id: 'density-default', value: 'default' },
  { id: 'density-comfortable', value: 'comfortable' },
]

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'radio-group-basic',
    snapshot: snapshot(h =>
      RadioGroup.view<never>({
        items,
        toView: attributes =>
          h.div(
            [...attributes.root],
            attributes.items.flatMap(item => [
              h.span(
                [...item.root],
                item.indicator.length > 0
                  ? [
                      h.span(
                        [...item.indicator],
                        [
                          h.span(
                            [
                              h.Class(
                                'absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground',
                              ),
                            ],
                            [],
                          ),
                        ],
                      ),
                    ]
                  : [],
              ),
              h.input([...item.input]),
            ]),
          ),
      }),
    ),
  },
  {
    id: 'radio-group-checked',
    snapshot: snapshot(h =>
      RadioGroup.view<never>({
        items,
        value: 'comfortable',
        toView: attributes =>
          h.div(
            [...attributes.root],
            attributes.items.flatMap(item => [
              h.span(
                [...item.root],
                item.indicator.length > 0
                  ? [
                      h.span(
                        [...item.indicator],
                        [
                          h.span(
                            [
                              h.Class(
                                'absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground',
                              ),
                            ],
                            [],
                          ),
                        ],
                      ),
                    ]
                  : [],
              ),
              h.input([...item.input]),
            ]),
          ),
      }),
    ),
  },
  {
    id: 'radio-group-disabled-invalid',
    snapshot: snapshot(
      h =>
        RadioGroup.view<never>({
          items,
          value: 'default',
          isDisabled: true,
          isInvalid: true,
          toView: attributes =>
            h.div(
              [...attributes.root],
              attributes.items.flatMap(item => [
                h.span(
                  [...item.root],
                  item.indicator.length > 0
                    ? [
                        h.span(
                          [...item.indicator],
                          [
                            h.span(
                              [
                                h.Class(
                                  'absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground',
                                ),
                              ],
                              [],
                            ),
                          ],
                        ),
                      ]
                    : [],
                ),
                h.input([...item.input]),
              ]),
            ),
        }),
      suppressedKeyboard,
    ),
  },
]
