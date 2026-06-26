import * as ShadcnTooltip from '../../../../../src/registry/shadcn/tooltip'
import type { FixtureCase } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (view: ReturnType<typeof ShadcnTooltip.view<never>>) =>
  snapshotHtml(view, {
    click: 'activates',
    Enter: 'native-activates',
    Space: 'native-activates',
    mousedown: 'passes-through',
    pointerdown: 'passes-through',
  })

const shadcnTooltipRoot = (
  options: Readonly<{
    open: boolean
    contentClassName?: string
    dir?: string
    instant?: ShadcnTooltip.TooltipInstant
    side?: ShadcnTooltip.TooltipSide
  }>,
) =>
  ShadcnTooltip.view<never>({
    id: 'library-tooltip',
    open: options.open,
    contentClassName: options.contentClassName,
    dir: options.dir,
    instant: options.instant,
    side: options.side,
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'tooltip-demo',
    snapshot: snapshot(shadcnTooltipRoot({ open: true })),
  },
  {
    id: 'tooltip-keyboard',
    snapshot: snapshot(
      shadcnTooltipRoot({ open: true, contentClassName: 'has-kbd' }),
    ),
  },
  {
    id: 'tooltip-delayed',
    snapshot: snapshot(shadcnTooltipRoot({ open: true, instant: 'delay' })),
  },
  {
    id: 'tooltip-rtl',
    snapshot: snapshot(
      shadcnTooltipRoot({
        open: true,
        dir: 'rtl',
        side: 'inline-start',
      }),
    ),
  },
]
