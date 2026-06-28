import * as ShadcnSheet from '../../../../../src/registry/shadcn/sheet'
import type { FixtureCase } from '../../../fixture'
import { nativeEnabledKeyboard } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (view: ReturnType<typeof ShadcnSheet.view<never>>) =>
  snapshotHtml(view, nativeEnabledKeyboard)

const shadcnSheetRoot = (
  options: Readonly<{
    open: boolean
    side?: ShadcnSheet.SheetSide
    dir?: string
    showCloseButton?: boolean
  }>,
) =>
  ShadcnSheet.view<never>({
    id: 'profile-sheet',
    open: options.open,
    side: options.side,
    dir: options.dir,
    showCloseButton: options.showCloseButton,
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'sheet-demo',
    snapshot: snapshot(shadcnSheetRoot({ open: true })),
  },
  {
    id: 'sheet-left',
    snapshot: snapshot(shadcnSheetRoot({ open: true, side: 'left' })),
  },
  {
    id: 'sheet-no-close-button',
    snapshot: snapshot(shadcnSheetRoot({ open: true, showCloseButton: false })),
  },
  {
    id: 'sheet-rtl',
    snapshot: snapshot(
      shadcnSheetRoot({ dir: 'rtl', open: true, side: 'left' }),
    ),
  },
]
