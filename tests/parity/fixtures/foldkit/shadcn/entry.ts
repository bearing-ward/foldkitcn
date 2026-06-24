import type { OriginFixtureSnapshot } from '../../origin/shadcn/snapshot'
import { captureOriginSnapshot } from '../../origin/shadcn/snapshot'
import { htmlToElement } from '../render'
import type { ShadcnFoldkitCase } from './cases'
import { findShadcnFoldkitCase } from './cases'

import './style.css'

interface ShadcnFoldkitFixtureApi {
  readonly selectedCase: Pick<
    ShadcnFoldkitCase,
    'id' | 'originFilePath' | 'title'
  >
  readonly captureSnapshot: () => OriginFixtureSnapshot
}

declare global {
  interface Window {
    readonly __SHADCN_FOLDKIT_FIXTURE__: ShadcnFoldkitFixtureApi
  }
}

const fixtureRoot = document.querySelector('#root')

if (fixtureRoot === null) {
  throw new Error('Missing shadcn Foldkit fixture root element.')
}

const searchParams = new URLSearchParams(window.location.search)
const foldkitCase = findShadcnFoldkitCase(
  searchParams.get('case') ?? 'button-default',
)
const rootElement = document.createElement('div')
rootElement.dataset.foldkitFixtureRoot = ''
rootElement.dataset.foldkitCaseId = foldkitCase.id
rootElement.dataset.foldkitFilePath = foldkitCase.originFilePath
rootElement.append(htmlToElement(foldkitCase.view()))
fixtureRoot.append(rootElement)

window.__SHADCN_FOLDKIT_FIXTURE__ = {
  selectedCase: {
    id: foldkitCase.id,
    title: foldkitCase.title,
    originFilePath: foldkitCase.originFilePath,
  },
  captureSnapshot: () => {
    const fixtureElement = document.querySelector('[data-foldkit-fixture-root]')
    const targetElement = fixtureElement?.firstElementChild

    if (targetElement === undefined || targetElement === null) {
      throw new Error(`No rendered element found for ${foldkitCase.id}.`)
    }

    return captureOriginSnapshot(targetElement, {
      caseId: foldkitCase.id,
      originFilePath: foldkitCase.originFilePath,
    })
  },
}
