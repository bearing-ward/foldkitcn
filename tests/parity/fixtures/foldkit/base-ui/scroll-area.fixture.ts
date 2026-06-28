import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as ScrollArea from '../../../../../src/registry/base-ui/scroll-area'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotStyledHtml } from '../../foldkit/render-style'

type CaseConfig = Omit<ScrollArea.ViewConfig<never>, 'toView'> &
  Readonly<{
    caseId: string
  }>

const keyboardBehavior = {
  click: 'passes-through',
  Enter: 'passes-through',
  Space: 'passes-through',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const scrollAreaView = (config: CaseConfig): Html => {
  const h = html<never>()

  return ScrollArea.view<never>({
    ...config,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.div(
            [...attributes.viewport],
            [
              h.div(
                [...attributes.content],
                [h.div([h.Style({ width: '1000px', height: '1000px' })], [])],
              ),
            ],
          ),
          ...attributes.scrollbars.flatMap(scrollbar =>
            scrollbar.isMounted
              ? [h.div([...scrollbar.root], [h.div([...scrollbar.thumb], [])])]
              : [],
          ),
          ...(attributes.corner.isMounted
            ? [h.div([...attributes.corner.root], [])]
            : []),
        ],
      ),
  })
}

const snapshotHtml = (htmlNode: Html): FixtureSnapshot =>
  snapshotStyledHtml(htmlNode, keyboardBehavior)

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    caseId: 'vertical-overflow',
    metrics: {
      viewportWidth: 200,
      viewportHeight: 200,
      contentWidth: 200,
      contentHeight: 1000,
    },
    scrollbars: [{ orientation: 'vertical' }],
  },
  {
    caseId: 'both-axis-overflow',
    state: {
      hasOverflowX: true,
      hasOverflowY: true,
      overflowXEnd: true,
      overflowYEnd: true,
      thumbSize: { width: 40, height: 40 },
      cornerSize: { width: 10, height: 10 },
    },
    scrollbars: [{ orientation: 'vertical' }, { orientation: 'horizontal' }],
  },
  {
    caseId: 'kept-scrollbars-without-overflow',
    metrics: {
      viewportWidth: 200,
      viewportHeight: 200,
      contentWidth: 100,
      contentHeight: 100,
    },
    scrollbars: [
      { orientation: 'vertical', keepMounted: true },
      { orientation: 'horizontal', keepMounted: true },
    ],
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.caseId,
  snapshot: snapshotHtml(scrollAreaView(config)),
}))
