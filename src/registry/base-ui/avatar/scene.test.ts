import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Avatar from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  imageLoadingStatus: Avatar.ImageLoadingStatus,
})
type Model = typeof Model.Type

const initialModel: Model = {
  imageLoadingStatus: 'loading',
}

// MESSAGE

const LoadedImage = m('LoadedImage')
const ErroredImage = m('ErroredImage')

const Message = S.Union([LoadedImage, ErroredImage])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      LoadedImage: () => [
        evo(model, { imageLoadingStatus: () => 'loaded' }),
        [],
      ],
      ErroredImage: () => [
        evo(model, { imageLoadingStatus: () => 'error' }),
        [],
      ],
    }),
  )

// VIEW

type TestAvatarConfig = Omit<
  ViewConfig<Message>,
  'imageLoadingStatus' | 'toView'
> &
  Readonly<{
    imageLoadingStatus?: Avatar.ImageLoadingStatus
  }>

const viewAvatar =
  (config: TestAvatarConfig) =>
  (model: Model): Html => {
    const h = html<Message>()
    const imageLoadingStatus =
      config.imageLoadingStatus ?? model.imageLoadingStatus

    return Avatar.view<Message>({
      imageLoadingStatus,
      image: {
        src: 'avatar.png',
        srcSet: 'avatar.png 1x, avatar@2x.png 2x',
        sizes: '48px',
        alt: 'Jane Doe',
        width: '48',
        height: '48',
        ...config.image,
      },
      fallback: config.fallback,
      onImageLoaded: LoadedImage(),
      onImageErrored: ErroredImage(),
      toView: (attributes, state) =>
        h.span(
          [...attributes.root, h.Attribute('data-testid', 'root')],
          [
            ...(state.shouldRenderImage
              ? [
                  h.img([
                    ...attributes.image,
                    h.Attribute('data-testid', 'image'),
                  ]),
                ]
              : []),
            ...(state.shouldRenderFallback
              ? [
                  h.span(
                    [
                      ...attributes.fallback,
                      h.Attribute('data-testid', 'fallback'),
                    ],
                    ['JD'],
                  ),
                ]
              : []),
          ],
        ),
    })
  }

describe('base-ui/avatar', () => {
  test('root renders as a span with loading state attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAvatar({ imageLoadingStatus: 'loading' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="root"]')).toHaveAttr(
          'data-loading',
        ),
      )
    }).not.toThrow()
  })

  test('loaded status renders the image and hides the fallback', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAvatar({ imageLoadingStatus: 'loaded' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="root"]')).toHaveAttr(
          'data-loaded',
        ),
        Scene.expect(Scene.selector('[data-testid="image"]')).toHaveAttr(
          'src',
          'avatar.png',
        ),
        Scene.expect(Scene.selector('[data-testid="image"]')).toHaveAttr(
          'srcset',
          'avatar.png 1x, avatar@2x.png 2x',
        ),
        Scene.expect(Scene.selector('[data-testid="image"]')).toHaveAttr(
          'sizes',
          '48px',
        ),
        Scene.expect(Scene.selector('[data-testid="image"]')).toHaveAttr(
          'alt',
          'Jane Doe',
        ),
        Scene.expect(Scene.selector('[data-testid="fallback"]')).not.toExist(),
      )
    }).not.toThrow()
  })

  test('error status renders fallback and image status data', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAvatar({ imageLoadingStatus: 'error' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="root"]')).toHaveAttr(
          'data-error',
        ),
        Scene.expect(Scene.selector('[data-testid="fallback"]')).toHaveText(
          'JD',
        ),
      )
    }).not.toThrow()
  })

  test('fallback delay can be represented by caller-owned state', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewAvatar({
            imageLoadingStatus: 'error',
            fallback: { delayStatus: 'waiting' },
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="fallback"]')).not.toExist(),
      )
    }).not.toThrow()
  })

  test('image event handlers are exposed as messages without hidden effects', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAvatar({ imageLoadingStatus: 'loaded' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="image"]')).toHaveHandler(
          'load',
        ),
        Scene.expect(Scene.selector('[data-testid="image"]')).toHaveHandler(
          'error',
        ),
      )
    }).not.toThrow()
  })

  test('transition status preserves image data attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewAvatar({
            imageLoadingStatus: 'loaded',
            image: { transitionStatus: 'starting' },
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="image"]')).toHaveAttr(
          'data-starting-style',
        ),
      )
    }).not.toThrow()
  })

  test('messages update image loading status in the owning model', () => {
    const [loadedModel] = update(initialModel, LoadedImage())
    const [erroredModel] = update(initialModel, ErroredImage())

    expect(loadedModel.imageLoadingStatus).toBe('loaded')
    expect(erroredModel.imageLoadingStatus).toBe('error')
  })
})
