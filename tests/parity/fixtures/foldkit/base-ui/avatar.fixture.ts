import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Avatar from '../../../../../src/registry/base-ui/avatar'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../render'

type CaseConfig = Readonly<{
  id: string
  imageLoadingStatus: Avatar.ImageLoadingStatus
  includeImage?: boolean
  includeFallback?: boolean
  fallbackDelayStatus?: Avatar.AvatarFallbackDelayStatus
  rootClassName?: string
  imageClassName?: string
  fallbackClassName?: string
  fallbackText?: string
}>

const avatarImageSrc =
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80'

const renderFoldkitAvatar = (config: CaseConfig): FixtureSnapshot => {
  const h = html<never>()

  return snapshotHtml(
    Avatar.view<never>({
      imageLoadingStatus: config.imageLoadingStatus,
      image: {
        src: avatarImageSrc,
        alt: '',
        width: '48',
        height: '48',
        transitionStatus:
          config.imageLoadingStatus === 'loaded' ? 'starting' : undefined,
      },
      fallback: {
        delayStatus: config.fallbackDelayStatus,
      },
      toView: (attributes, state): Html =>
        h.span(
          [
            ...attributes.root,
            ...(config.rootClassName === undefined
              ? []
              : [h.Class(config.rootClassName)]),
          ],
          [
            ...(state.shouldRenderImage && config.includeImage !== false
              ? [
                  h.img([
                    ...attributes.image,
                    ...(config.imageClassName === undefined
                      ? []
                      : [h.Class(config.imageClassName)]),
                  ]),
                ]
              : []),
            ...(state.shouldRenderFallback && config.includeFallback !== false
              ? [
                  h.span(
                    [
                      ...attributes.fallback,
                      ...(config.fallbackClassName === undefined
                        ? []
                        : [h.Class(config.fallbackClassName)]),
                    ],
                    [config.fallbackText ?? 'LT'],
                  ),
                ]
              : []),
            ...(config.includeImage === false &&
            config.includeFallback === false
              ? [config.fallbackText ?? 'LT']
              : []),
          ],
        ),
    }),
    {},
  )
}

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
  snapshot: renderFoldkitAvatar(config),
}))
