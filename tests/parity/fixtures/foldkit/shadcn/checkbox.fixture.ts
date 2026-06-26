import { html } from 'foldkit/html'

import * as Checkbox from '../../../../../src/registry/shadcn/checkbox'
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

const snapshot = (
  build: (
    h: ReturnType<typeof html<never>>,
  ) => ReturnType<typeof Checkbox.view<never>>,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = baseKeyboard,
): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(build(h), keyboardBehavior)
}

const checkboxRoot = (
  h: ReturnType<typeof html<never>>,
  config: Omit<Checkbox.ViewConfig<never>, 'toView'>,
) =>
  Checkbox.view<never>({
    ...config,
    toView: attributes =>
      h.span(
        [...attributes.root],
        attributes.indicator.length > 0
          ? [
              h.span(
                [...attributes.indicator],
                [
                  h.svg(
                    [
                      h.Xmlns('http://www.w3.org/2000/svg'),
                      h.Width('24'),
                      h.Height('24'),
                      h.ViewBox('0 0 24 24'),
                      h.Fill('none'),
                      h.Stroke('currentColor'),
                      h.StrokeWidth('2'),
                      h.StrokeLinecap('round'),
                      h.StrokeLinejoin('round'),
                      h.AriaHidden(true),
                    ],
                    [h.path([h.D('M20 6 9 17l-5-5')], [])],
                  ),
                ],
              ),
            ]
          : [],
      ),
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'checkbox-basic',
    snapshot: snapshot(h =>
      checkboxRoot(h, {
        checkedState: 'unchecked',
      }),
    ),
  },
  {
    id: 'checkbox-checked',
    snapshot: snapshot(h =>
      checkboxRoot(h, {
        checkedState: 'checked',
      }),
    ),
  },
  {
    id: 'checkbox-indeterminate',
    snapshot: snapshot(
      h =>
        checkboxRoot(h, {
          checkedState: 'indeterminate',
        }),
      suppressedKeyboard,
    ),
  },
  {
    id: 'checkbox-disabled-invalid',
    snapshot: snapshot(
      h =>
        checkboxRoot(h, {
          checkedState: 'unchecked',
          isDisabled: true,
          isInvalid: true,
        }),
      suppressedKeyboard,
    ),
  },
]
