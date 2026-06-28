import * as ShadcnDrawer from '../../../../../src/registry/shadcn/drawer'
import type { FixtureCase } from '../../../fixture'
import { nativeEnabledKeyboard } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (view: ReturnType<typeof ShadcnDrawer.view<never>>) =>
  snapshotHtml(view, nativeEnabledKeyboard)

const shadcnDrawerRoot = (
  options: Readonly<{
    open: boolean
    direction?: ShadcnDrawer.DrawerDirection
    dir?: string
  }>,
) =>
  ShadcnDrawer.view<never>({
    id: 'activity-drawer',
    open: options.open,
    direction: options.direction,
    dir: options.dir,
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'drawer-demo',
    snapshot: snapshot(shadcnDrawerRoot({ open: true })),
  },
  {
    id: 'drawer-right',
    snapshot: snapshot(shadcnDrawerRoot({ direction: 'right', open: true })),
  },
  {
    id: 'drawer-rtl',
    snapshot: snapshot(
      shadcnDrawerRoot({ dir: 'rtl', direction: 'left', open: true }),
    ),
  },
]
