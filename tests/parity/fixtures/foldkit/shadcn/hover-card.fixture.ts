import * as ShadcnHoverCard from '../../../../../src/registry/shadcn/hover-card'
import type { FixtureCase } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (view: ReturnType<typeof ShadcnHoverCard.view<never>>) =>
  snapshotHtml(view, {
    click: 'activates',
    Enter: 'native-activates',
    Space: 'native-activates',
    mousedown: 'passes-through',
    pointerdown: 'passes-through',
  })

const shadcnHoverCardRoot = (
  options: Readonly<{
    open: boolean
    contentClassName?: string
    dir?: string
    side?: ShadcnHoverCard.HoverCardSide
  }>,
) =>
  ShadcnHoverCard.view<never>({
    id: 'profile-hover-card',
    open: options.open,
    contentClassName: options.contentClassName,
    dir: options.dir,
    side: options.side,
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'hover-card-demo',
    snapshot: snapshot(
      shadcnHoverCardRoot({
        open: true,
        contentClassName: 'flex w-64 flex-col gap-0.5',
      }),
    ),
  },
  {
    id: 'hover-card-placement',
    snapshot: snapshot(shadcnHoverCardRoot({ open: true, side: 'left' })),
  },
  {
    id: 'hover-card-rtl',
    snapshot: snapshot(
      shadcnHoverCardRoot({
        open: true,
        dir: 'rtl',
        side: 'inline-start',
        contentClassName: 'flex w-64 flex-col gap-1',
      }),
    ),
  },
]
