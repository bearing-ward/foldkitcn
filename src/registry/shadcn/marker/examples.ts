import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { Spinner } from '../spinner'
import { Marker, MarkerContent, MarkerIcon } from './index'

type Child = Html | string

const icon = (className: string, paths: ReadonlyArray<string>): Html => {
  const h = html<never>()

  return h.svg(
    [
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.Width('24'),
      h.Height('24'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.StrokeLinecap('round'),
      h.StrokeLinejoin('round'),
      h.AriaHidden(true),
      h.Class(className),
    ],
    paths.map(path => h.path([h.D(path)], [])),
  )
}

const branchIcon = (): Html =>
  icon('lucide lucide-git-branch', [
    'M6 3v12',
    'M6 15a3 3 0 1 0 3 3',
    'M6 3a3 3 0 1 0 3 3',
    'M18 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  ])

const searchIcon = (): Html =>
  icon('lucide lucide-search', [
    'm21 21-4.3-4.3',
    'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z',
  ])

const fileTextIcon = (): Html =>
  icon('lucide lucide-file-text', [
    'M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z',
    'M14 2v5h5',
    'M9 13h6',
    'M9 17h6',
    'M9 9h2',
  ])

const bookOpenCheckIcon = (): Html =>
  icon('lucide lucide-book-open-check', [
    'M12 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4a2 2 0 0 1 2 2',
    'M12 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4a2 2 0 0 0-2 2',
    'M14 9.5 16 11l3-3',
  ])

const rotateCcwIcon = (): Html =>
  icon('lucide lucide-rotate-ccw', ['M3 12a9 9 0 1 0 3-6.7', 'M3 3v6h6'])

const marker = (children: ReadonlyArray<Child>): Html =>
  Marker<never>({
    children,
  })

const markerWithStatus = (children: ReadonlyArray<Child>): Html =>
  Marker<never>({
    attributes: [html<never>().Role('status')],
    children,
  })

const markerLink = (children: ReadonlyArray<Child>): Html => {
  const h = html<never>()

  return Marker<never>({
    toView: attributes =>
      h.a([...attributes.marker, h.Href('#links-and-buttons')], children),
  })
}

const markerButton = (children: ReadonlyArray<Child>): Html => {
  const h = html<never>()

  return Marker<never>({
    className: 'transition-colors hover:text-foreground',
    toView: attributes =>
      h.button([...attributes.marker, h.Type('button')], children),
  })
}

export const MarkerDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-8 py-12')],
    [
      marker([
        MarkerIcon({
          children: [branchIcon()],
        }),
        MarkerContent({
          children: ['Switched to a new branch'],
        }),
      ]),
      markerWithStatus([
        MarkerIcon({
          children: [Spinner()],
        }),
        MarkerContent({
          children: ['Thinking...'],
          className: 'shimmer',
        }),
      ]),
      Marker<never>({
        variant: 'separator',
        children: [
          MarkerContent({
            children: ['Conversation compacted'],
          }),
        ],
      }),
      marker([
        MarkerIcon({
          children: [searchIcon()],
        }),
        MarkerContent({
          children: ['Explored 4 files'],
        }),
      ]),
    ],
  )
}

export const MarkerStatus = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-8 py-12')],
    [
      Marker<never>({
        attributes: [h.Role('status')],
        children: [
          MarkerIcon({
            children: [Spinner()],
          }),
          MarkerContent({
            children: ['Compacting conversation'],
          }),
        ],
      }),
      Marker<never>({
        variant: 'separator',
        attributes: [h.Role('status')],
        children: [
          MarkerIcon({
            children: [Spinner()],
          }),
          MarkerContent({
            children: ['Running tests'],
          }),
        ],
      }),
    ],
  )
}

export const MarkerVariants = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-8 py-12')],
    [
      marker([
        MarkerContent({
          children: ['A default marker for inline notes.'],
        }),
      ]),
      Marker<never>({
        variant: 'separator',
        children: [
          MarkerContent({
            children: ['A separator marker'],
          }),
        ],
      }),
      Marker<never>({
        variant: 'border',
        children: [
          MarkerContent({
            children: ['A border marker for row boundaries.'],
          }),
        ],
      }),
    ],
  )
}

export const MarkerIconDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-12 py-12')],
    [
      marker([
        MarkerIcon({
          children: [branchIcon()],
        }),
        MarkerContent({
          children: ['Switched to a new branch'],
        }),
      ]),
      Marker<never>({
        variant: 'separator',
        children: [
          MarkerIcon({
            children: [searchIcon()],
          }),
          MarkerContent({
            children: ['Explored 4 files'],
          }),
        ],
      }),
      marker([
        MarkerIcon({
          children: [bookOpenCheckIcon()],
        }),
        MarkerContent({
          children: ['Syncing completed'],
        }),
      ]),
    ],
  )
}

export const MarkerBorder = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-3 py-12')],
    [
      Marker<never>({
        variant: 'border',
        children: [
          MarkerIcon({
            children: [branchIcon()],
          }),
          MarkerContent({
            children: ['Switched to release-candidate'],
          }),
        ],
      }),
      Marker<never>({
        variant: 'border',
        children: [
          MarkerIcon({
            children: [searchIcon()],
          }),
          MarkerContent({
            children: ['Reviewed 8 related files'],
          }),
        ],
      }),
      Marker<never>({
        variant: 'border',
        children: [
          MarkerIcon({
            children: [fileTextIcon()],
          }),
          MarkerContent({
            children: ['Opened implementation notes'],
          }),
        ],
      }),
    ],
  )
}

export const MarkerSeparator = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-8 py-12')],
    [
      Marker<never>({
        variant: 'separator',
        children: [MarkerContent({ children: ['Today'] })],
      }),
      Marker<never>({
        variant: 'separator',
        children: [MarkerContent({ children: ['Worked for 42s'] })],
      }),
      Marker<never>({
        variant: 'separator',
        children: [MarkerContent({ children: ['Conversation compacted'] })],
      }),
    ],
  )
}

export const MarkerShimmer = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-8 py-12')],
    [
      Marker<never>({
        attributes: [h.Role('status')],
        children: [
          MarkerContent({
            className: 'shimmer',
            children: ['Thinking...'],
          }),
        ],
      }),
      Marker<never>({
        variant: 'separator',
        attributes: [h.Role('status')],
        children: [
          MarkerContent({
            className: 'shimmer',
            children: ['Reading 4 files'],
          }),
        ],
      }),
    ],
  )
}

export const MarkerLinkButton = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-sm flex-col gap-8 py-12')],
    [
      markerLink([
        MarkerIcon({
          children: [branchIcon()],
        }),
        MarkerContent({
          children: ['View the pull request'],
        }),
      ]),
      markerButton([
        MarkerIcon({
          children: [rotateCcwIcon()],
        }),
        MarkerContent({
          children: ['Revert this change'],
        }),
      ]),
    ],
  )
}
