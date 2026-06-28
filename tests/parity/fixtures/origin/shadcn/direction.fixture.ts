import type { FixtureCase } from '../../../fixture'
import { snapshotElement } from '../../dom'

type Direction = 'ltr' | 'rtl'

const snapshotDirection = (
  options: Readonly<{ direction: Direction; lang: string }>,
) => {
  const root = document.createElement('div')
  root.setAttribute('dir', options.direction)
  root.setAttribute('lang', options.lang)
  root.dataset.direction = options.direction
  root.setAttribute('class', 'direction-shell')

  const paragraph = document.createElement('p')
  paragraph.append(
    document.createTextNode(`Current direction: ${options.direction}`),
  )
  root.append(paragraph)

  document.body.append(root)
  const snapshot = snapshotElement(root, {})
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'direction-ltr',
    snapshot: snapshotDirection({ direction: 'ltr', lang: 'en' }),
  },
  {
    id: 'direction-rtl',
    snapshot: snapshotDirection({ direction: 'rtl', lang: 'ar' }),
  },
]
