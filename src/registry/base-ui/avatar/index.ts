import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const ImageLoadingStatus = S.Union([
  S.Literal('idle'),
  S.Literal('loading'),
  S.Literal('loaded'),
  S.Literal('error'),
])
export type ImageLoadingStatus = typeof ImageLoadingStatus.Type

export const AvatarTransitionStatus = S.Union([
  S.Literal('idle'),
  S.Literal('starting'),
  S.Literal('ending'),
])
export type AvatarTransitionStatus = typeof AvatarTransitionStatus.Type

export const AvatarFallbackDelayStatus = S.Union([
  S.Literal('waiting'),
  S.Literal('elapsed'),
])
export type AvatarFallbackDelayStatus = typeof AvatarFallbackDelayStatus.Type

export const AvatarImageOptions = S.Struct({
  src: S.optional(S.String),
  srcSet: S.optional(S.String),
  sizes: S.optional(S.String),
  alt: S.optional(S.String),
  width: S.optional(S.String),
  height: S.optional(S.String),
  crossOrigin: S.optional(S.String),
  referrerPolicy: S.optional(S.String),
  transitionStatus: S.optional(AvatarTransitionStatus),
})
export type AvatarImageOptions = typeof AvatarImageOptions.Type

export const AvatarFallbackOptions = S.Struct({
  delayStatus: S.optional(AvatarFallbackDelayStatus),
})
export type AvatarFallbackOptions = typeof AvatarFallbackOptions.Type

export const AvatarOptions = S.Struct({
  imageLoadingStatus: ImageLoadingStatus,
  image: S.optional(AvatarImageOptions),
  fallback: S.optional(AvatarFallbackOptions),
})
export type AvatarOptions = typeof AvatarOptions.Type

export const AvatarPart = S.Union([
  S.Literal('root'),
  S.Literal('image'),
  S.Literal('fallback'),
])
export type AvatarPart = typeof AvatarPart.Type

export type AvatarState = Readonly<{
  imageLoadingStatus: ImageLoadingStatus
  transitionStatus: AvatarTransitionStatus
  shouldRenderImage: boolean
  shouldRenderFallback: boolean
}>

// UPDATE

const defaultTransitionStatus: AvatarTransitionStatus = 'idle'

export const avatarState = (options: AvatarOptions): AvatarState => {
  const transitionStatus =
    options.image?.transitionStatus ?? defaultTransitionStatus
  const shouldRenderImage =
    options.imageLoadingStatus === 'loaded' || transitionStatus === 'ending'
  const shouldRenderFallback =
    options.imageLoadingStatus !== 'loaded' &&
    options.fallback?.delayStatus !== 'waiting'

  return {
    imageLoadingStatus: options.imageLoadingStatus,
    transitionStatus,
    shouldRenderImage,
    shouldRenderFallback,
  }
}

// VIEW

export type AvatarAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  image: ReadonlyArray<Attribute<Message>>
  fallback: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = AvatarOptions &
  Readonly<{
    onImageLoaded?: Message
    onImageErrored?: Message
    toView: (attributes: AvatarAttributes<Message>, state: AvatarState) => Html
  }>

const statusAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  status: ImageLoadingStatus,
): ReadonlyArray<Attribute<Message>> => {
  if (status === 'loading') {
    return [h.DataAttribute('loading', '')]
  }

  if (status === 'loaded') {
    return [h.DataAttribute('loaded', '')]
  }

  if (status === 'error') {
    return [h.DataAttribute('error', '')]
  }

  return []
}

const transitionAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  status: AvatarTransitionStatus,
): ReadonlyArray<Attribute<Message>> => {
  if (status === 'starting') {
    return [h.DataAttribute('starting-style', '')]
  }

  if (status === 'ending') {
    return [h.DataAttribute('ending-style', '')]
  }

  return []
}

const optionalAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === undefined ? [] : [h.Attribute(name, value)]

const onErrorAttribute = <Message>(message: Message): Attribute<Message> => ({
  _tag: 'OnError',
  message,
})

const imageAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  state: AvatarState,
): ReadonlyArray<Attribute<Message>> => {
  const image = config.image ?? {}

  return [
    ...optionalAttribute(h, 'src', image.src),
    ...optionalAttribute(h, 'srcset', image.srcSet),
    ...optionalAttribute(h, 'sizes', image.sizes),
    ...optionalAttribute(h, 'alt', image.alt),
    ...optionalAttribute(h, 'width', image.width),
    ...optionalAttribute(h, 'height', image.height),
    ...optionalAttribute(h, 'crossorigin', image.crossOrigin),
    ...optionalAttribute(h, 'referrerpolicy', image.referrerPolicy),
    ...(config.onImageLoaded === undefined
      ? []
      : [h.OnLoad(config.onImageLoaded)]),
    ...(config.onImageErrored === undefined
      ? []
      : [onErrorAttribute(config.onImageErrored)]),
    ...statusAttributes(h, state.imageLoadingStatus),
    ...transitionAttributes(h, state.transitionStatus),
  ]
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const state = avatarState(config)
  const rootAndFallbackStatusAttributes = statusAttributes(
    h,
    state.imageLoadingStatus,
  )

  return config.toView(
    {
      root: [...rootAndFallbackStatusAttributes],
      image: imageAttributes(h, config, state),
      fallback: [...rootAndFallbackStatusAttributes],
    },
    state,
  )
}
