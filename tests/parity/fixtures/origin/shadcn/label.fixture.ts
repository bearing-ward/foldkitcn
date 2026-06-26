import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

const labelBaseClassName =
  'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50'

const snapshotLabel = (
  attributes: Readonly<Record<string, string>>,
  text: string,
): FixtureSnapshot => {
  const label = document.createElement('label')
  Object.entries({
    'data-slot': 'label',
    class: labelBaseClassName,
    ...attributes,
  }).map(([name, value]) => label.setAttribute(name, value))
  label.append(document.createTextNode(text))

  document.body.append(label)
  const snapshot = snapshotElement(label, {})
  label.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'label-basic',
    snapshot: snapshotLabel({ for: 'email' }, 'Email'),
  },
  {
    id: 'label-custom-class',
    snapshot: snapshotLabel(
      {
        for: 'terms',
        class: `${labelBaseClassName} custom-label`,
      },
      'Accept terms and conditions',
    ),
  },
  {
    id: 'label-rtl',
    snapshot: snapshotLabel(
      {
        for: 'terms-rtl',
        dir: 'rtl',
      },
      'قبول الشروط والأحكام',
    ),
  },
]
