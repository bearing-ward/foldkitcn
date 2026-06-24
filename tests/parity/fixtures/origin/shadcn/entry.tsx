import * as React from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

import type { ShadcnOriginCase } from './cases'
import { findShadcnOriginCase } from './cases'
import type { OriginFixtureSnapshot } from './snapshot'
import { captureOriginSnapshot } from './snapshot'

import './style.css'

interface ShadcnOriginFixtureApi {
  readonly selectedCase: Pick<
    ShadcnOriginCase,
    'id' | 'originFilePath' | 'title'
  >
  readonly captureSnapshot: () => OriginFixtureSnapshot
}

declare global {
  interface Window {
    readonly __SHADCN_ORIGIN_FIXTURE__: ShadcnOriginFixtureApi
  }
}

const fixtureRoot = document.querySelector('#root')

if (fixtureRoot === null) {
  throw new Error('Missing shadcn origin fixture root element.')
}

const searchParams = new URLSearchParams(window.location.search)
const originCase = findShadcnOriginCase(
  searchParams.get('case') ?? 'button-default',
)
const root = createRoot(fixtureRoot)
const { Component } = originCase

flushSync(() => {
  root.render(
    <div
      data-origin-fixture-root=""
      data-origin-case-id={originCase.id}
      data-origin-file-path={originCase.originFilePath}
    >
      <Component />
    </div>,
  )
})

window.__SHADCN_ORIGIN_FIXTURE__ = {
  selectedCase: {
    id: originCase.id,
    title: originCase.title,
    originFilePath: originCase.originFilePath,
  },
  captureSnapshot: () => {
    const rootElement = document.querySelector('[data-origin-fixture-root]')
    const targetElement = rootElement?.firstElementChild

    if (targetElement === undefined || targetElement === null) {
      throw new Error(`No rendered element found for ${originCase.id}.`)
    }

    return captureOriginSnapshot(targetElement, {
      caseId: originCase.id,
      originFilePath: originCase.originFilePath,
    })
  },
}
