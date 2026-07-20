/// <reference types="vite/client" />

import { captureOriginSnapshot } from '../../origin/shadcn/snapshot'
import { htmlToElement } from '../render'
import { findShadcnFoldkitCase } from './cases'
import type { ShadcnFoldkitFixtureApi } from './fixture-api'

import './style.css'

declare global {
  interface Window {
    __SHADCN_FOLDKIT_FIXTURE__: ShadcnFoldkitFixtureApi
  }
}

const searchParams = new URLSearchParams(window.location.search)
const requestedCaseId = searchParams.get('case') ?? 'button-default'

if (requestedCaseId === 'data-table-demo') {
  await import('./data-table-entry')
} else if (requestedCaseId === 'date-picker-demo') {
  await import('./date-picker-entry')
} else {
  const fixtureRoot = document.querySelector('#root')

  if (fixtureRoot === null) {
    throw new Error('Missing shadcn Foldkit fixture root element.')
  }

  const foldkitCase = findShadcnFoldkitCase(requestedCaseId)
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
      const fixtureElement = document.querySelector(
        '[data-foldkit-fixture-root]',
      )
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
}
