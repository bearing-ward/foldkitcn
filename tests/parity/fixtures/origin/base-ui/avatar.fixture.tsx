import { createElement } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

import { Avatar } from '../../../../../repos/base-ui/packages/react/src/avatar'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type CaseConfig = Readonly<{
  id: string
  imageLoadingStatus: 'loaded' | 'error' | 'idle'
  includeImage?: boolean
  includeFallback?: boolean
  rootClassName?: string
  imageClassName?: string
  fallbackClassName?: string
  fallbackText?: string
}>

interface MockImage {
  complete: boolean
  naturalWidth: number
  onload: (() => void) | null
  onerror: (() => void) | null
  src: string
}

const avatarImageSrc =
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80'

const withMockedImageStatus = <A,>(
  imageLoadingStatus: CaseConfig['imageLoadingStatus'],
  run: () => A,
): A => {
  const OriginalImage = window.Image
  class FixtureImage implements MockImage {
    complete = imageLoadingStatus !== 'idle'
    naturalWidth = imageLoadingStatus === 'loaded' ? 100 : 0
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    src = ''
  }

  Object.defineProperty(window, 'Image', {
    configurable: true,
    value: FixtureImage,
  })

  try {
    return run()
  } finally {
    Object.defineProperty(window, 'Image', {
      configurable: true,
      value: OriginalImage,
    })
  }
}

const statusDataAttribute = (
  imageLoadingStatus: CaseConfig['imageLoadingStatus'],
): Readonly<Record<string, string>> => {
  if (imageLoadingStatus === 'loaded') {
    return { 'data-loaded': '' }
  }

  if (imageLoadingStatus === 'error') {
    return { 'data-error': '' }
  }

  return {}
}

const renderOriginAvatar = (config: CaseConfig): FixtureSnapshot =>
  withMockedImageStatus(config.imageLoadingStatus, () => {
    const container = document.createElement('div')
    const root = createRoot(container)
    const statusAttributes = statusDataAttribute(config.imageLoadingStatus)
    const image =
      config.includeImage === false
        ? undefined
        : createElement(Avatar.Image, {
            ...statusAttributes,
            src: avatarImageSrc,
            width: '48',
            height: '48',
            className: config.imageClassName,
          })
    const fallback =
      config.includeFallback === false
        ? undefined
        : createElement(
            Avatar.Fallback,
            { ...statusAttributes, className: config.fallbackClassName },
            config.fallbackText ?? 'LT',
          )
    const textOnly =
      config.includeImage === false && config.includeFallback === false
        ? (config.fallbackText ?? 'LT')
        : undefined

    document.body.append(container)

    flushSync(() => {
      root.render(
        createElement(
          Avatar.Root,
          { ...statusAttributes, className: config.rootClassName },
          image,
          fallback,
          textOnly,
        ),
      )
    })

    const element = container.firstElementChild

    if (element === null) {
      throw new Error(`Base UI Avatar did not render: ${config.id}`)
    }

    const snapshot = snapshotElement(element, {})

    flushSync(() => {
      root.unmount()
    })
    container.remove()

    return snapshot
  })

const heroRootClassName =
  'inline-flex size-8 items-center justify-center overflow-hidden rounded-full bg-neutral-200 align-middle text-sm leading-none font-normal text-neutral-950 select-none dark:bg-neutral-800 dark:text-white'
const heroImageClassName = 'size-full object-cover'
const heroFallbackClassName =
  'flex size-full items-center justify-center text-sm'

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    id: 'hero-loaded',
    imageLoadingStatus: 'loaded',
    rootClassName: heroRootClassName,
    imageClassName: heroImageClassName,
    fallbackClassName: heroFallbackClassName,
  },
  {
    id: 'hero-fallback',
    imageLoadingStatus: 'error',
    rootClassName: heroRootClassName,
    imageClassName: heroImageClassName,
    fallbackClassName: heroFallbackClassName,
  },
  {
    id: 'text-only',
    imageLoadingStatus: 'idle',
    includeImage: false,
    includeFallback: false,
    rootClassName: heroRootClassName,
    fallbackText: 'LT',
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.id,
  snapshot: renderOriginAvatar(config),
}))
