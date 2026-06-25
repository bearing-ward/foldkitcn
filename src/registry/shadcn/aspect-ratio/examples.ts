import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as AspectRatio } from './index'

const avatarSrc = 'https://avatar.vercel.sh/shadcn1'
const imageClassName = 'rounded-lg object-cover grayscale dark:brightness-20'

const arabicAspectRatioRtl = {
  dir: 'rtl',
  values: {
    caption: 'منظر طبيعي جميل',
  },
}

const avatarImage = (): Html => {
  const h = html<never>()

  return h.img([
    h.Attribute('src', avatarSrc),
    h.Alt('Photo'),
    h.Class(imageClassName),
  ])
}

const aspectRatio = (ratio: number, className: string): Html => {
  const h = html<never>()

  return AspectRatio<never>({
    ratio,
    className,
    toView: attributes => h.div([...attributes.root], [avatarImage()]),
  })
}

export const AspectRatioDemo = (): Html =>
  aspectRatio(16 / 9, 'w-full max-w-sm rounded-lg bg-muted')

export const AspectRatioPortrait = (): Html =>
  aspectRatio(9 / 16, 'w-full max-w-[10rem] rounded-lg bg-muted')

export const AspectRatioRtl = (): Html => {
  const h = html<never>()
  const { dir, values } = arabicAspectRatioRtl

  return h.figure(
    [h.Class('w-full max-w-sm'), h.Dir(dir)],
    [
      aspectRatio(16 / 9, 'rounded-lg bg-muted'),
      h.figcaption(
        [h.Class('mt-2 text-center text-sm text-muted-foreground')],
        [values.caption],
      ),
    ],
  )
}

export const AspectRatioSquare = (): Html =>
  aspectRatio(1 / 1, 'w-full max-w-[12rem] rounded-lg bg-muted')
