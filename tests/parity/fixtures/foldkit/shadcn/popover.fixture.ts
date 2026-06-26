import * as ShadcnPopover from '../../../../../src/registry/shadcn/popover'
import type { FixtureCase } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (view: ReturnType<typeof ShadcnPopover.view<never>>) =>
  snapshotHtml(view, {
    click: 'activates',
    Enter: 'native-activates',
    Space: 'native-activates',
    mousedown: 'passes-through',
    pointerdown: 'passes-through',
  })

const shadcnPopoverRoot = (
  options: Readonly<{
    open: boolean
    align?: ShadcnPopover.PopoverAlign
    contentClassName?: string
    dir?: string
    side?: ShadcnPopover.PopoverSide
  }>,
) =>
  ShadcnPopover.view<never>({
    id: 'profile-popover',
    open: options.open,
    align: options.align,
    contentClassName: options.contentClassName,
    dir: options.dir,
    side: options.side,
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'popover-basic',
    snapshot: snapshot(shadcnPopoverRoot({ open: true, align: 'start' })),
  },
  {
    id: 'popover-demo',
    snapshot: snapshot(
      shadcnPopoverRoot({ open: true, contentClassName: 'w-80' }),
    ),
  },
  {
    id: 'popover-rtl',
    snapshot: snapshot(
      shadcnPopoverRoot({
        open: true,
        dir: 'rtl',
        side: 'inline-start',
      }),
    ),
  },
]
