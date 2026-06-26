import * as ShadcnDialog from '../../../../../src/registry/shadcn/dialog'
import type { FixtureCase } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (view: ReturnType<typeof ShadcnDialog.view<never>>) =>
  snapshotHtml(view, {
    click: 'activates',
    Enter: 'native-activates',
    Space: 'native-activates',
    mousedown: 'passes-through',
    pointerdown: 'passes-through',
  })

const shadcnDialogRoot = (
  options: Readonly<{
    open: boolean
    dir?: string
    showCloseButton?: boolean
    contentClassName?: string
  }>,
) =>
  ShadcnDialog.view<never>({
    id: 'profile-dialog',
    open: options.open,
    dir: options.dir,
    showCloseButton: options.showCloseButton,
    contentClassName: options.contentClassName,
  })

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'dialog-demo',
    snapshot: snapshot(
      shadcnDialogRoot({ open: true, contentClassName: 'sm:max-w-sm' }),
    ),
  },
  {
    id: 'dialog-no-close-button',
    snapshot: snapshot(
      shadcnDialogRoot({ open: true, showCloseButton: false }),
    ),
  },
  {
    id: 'dialog-rtl',
    snapshot: snapshot(
      shadcnDialogRoot({
        open: true,
        dir: 'rtl',
        contentClassName: 'sm:max-w-sm',
      }),
    ),
  },
]
