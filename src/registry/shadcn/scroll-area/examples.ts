import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Separator } from '../separator'
import type { ScrollAreaStateOptions } from './index'
import { view as ScrollArea } from './index'

const originRootId = 'base-ui-_r_0_'
const tagCount = 50
const tags = Array.from(
  { length: tagCount },
  (_entry, index) => `v1.2.0-beta.${tagCount - index}`,
)
const verticalOverflowState: ScrollAreaStateOptions = {
  hasOverflowY: true,
  overflowMetrics: {
    xStart: 0,
    xEnd: 0,
    yStart: 0,
    yEnd: 1626,
  },
  thumbSize: {
    width: 0,
    height: 42.48117154811715,
  },
}
const horizontalOverflowState: ScrollAreaStateOptions = {
  hasOverflowX: true,
  overflowMetrics: {
    xStart: 0,
    xEnd: 92,
    yStart: 0,
    yEnd: 0,
  },
  thumbSize: {
    width: 306.24472573839665,
    height: 0,
  },
}

const works: ReadonlyArray<{
  readonly artist: string
  readonly art: string
}> = [
  {
    artist: 'Ornella Binni',
    art: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80',
  },
  {
    artist: 'Tom Byrom',
    art: 'https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80',
  },
  {
    artist: 'Vladimir Malyavko',
    art: 'https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80',
  },
]

const arabicScrollAreaRtl = {
  dir: 'rtl' as const,
  values: {
    tags: 'العلامات',
  },
}

const separator = (): Html => {
  const h = html<never>()

  return Separator<never>({
    className: 'my-2',
    toView: attributes => h.div([...attributes.separator], []),
  })
}

const tagsContent = (heading: string): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('p-4')],
    [
      h.h4([h.Class('mb-4 text-sm leading-none font-medium')], [heading]),
      ...tags.flatMap(tag => [h.div([h.Class('text-sm')], [tag]), separator()]),
    ],
  )
}

const artworkFigure = (artwork: (typeof works)[number]): Html => {
  const h = html<never>()

  return h.figure(
    [h.Class('shrink-0')],
    [
      h.div(
        [h.Class('overflow-hidden rounded-md')],
        [
          h.img([
            h.Attribute('src', artwork.art),
            h.Alt(`Photo by ${artwork.artist}`),
            h.Class('aspect-[3/4] h-fit w-fit object-cover'),
            h.Width('300'),
            h.Height('400'),
          ]),
        ],
      ),
      h.figcaption(
        [h.Class('pt-2 text-xs text-muted-foreground')],
        [
          'Photo by ',
          h.span([h.Class('font-semibold text-foreground')], [artwork.artist]),
        ],
      ),
    ],
  )
}

export const ScrollAreaDemo = (): Html =>
  ScrollArea<never>({
    rootId: originRootId,
    state: verticalOverflowState,
    className: 'h-72 w-48 rounded-md border',
    children: [tagsContent('Tags')],
  })

export const ScrollAreaHorizontalDemo = (): Html => {
  const h = html<never>()

  return ScrollArea<never>({
    rootId: originRootId,
    state: horizontalOverflowState,
    className: 'w-96 rounded-md border whitespace-nowrap',
    scrollbars: [{ orientation: 'horizontal' }],
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.div(
            [...attributes.viewport],
            [
              h.div(
                [h.Class('flex w-max space-x-4 p-4')],
                works.map(artwork => artworkFigure(artwork)),
              ),
              ...attributes.scrollbars.flatMap(scrollbar =>
                scrollbar.isMounted
                  ? [
                      h.div(
                        [...scrollbar.root],
                        [h.div([...scrollbar.thumb], [])],
                      ),
                    ]
                  : [],
              ),
            ],
          ),
        ],
      ),
  })
}

export const ScrollAreaRtl = (): Html => {
  const { dir, values } = arabicScrollAreaRtl

  return ScrollArea<never>({
    rootId: originRootId,
    state: verticalOverflowState,
    className: 'h-72 w-48 rounded-md border',
    dir,
    children: [tagsContent(values.tags)],
  })
}
