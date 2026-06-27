import * as AlertDialog from '../../../../../src/registry/shadcn/alert-dialog'
import * as Button from '../../../../../src/registry/shadcn/button'
import { cn } from '../../../../../src/utils/cn'
import type { FixtureCase } from '../../../fixture'
import { snapshotElement } from '../../dom'

type DescriptionSegment =
  | string
  | Readonly<{
      href: string
      text: string
      type: 'link'
    }>

const appendMediaIcon = (media: HTMLDivElement, name: string): void => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('width', '24')
  svg.setAttribute('height', '24')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '2')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')
  svg.dataset.icon = name
  svg.setAttribute('aria-hidden', 'true')
  media.append(svg)
}

const snapshotAlertDialogElement = (
  options: Readonly<{
    id: string
    trigger: string
    title: string
    description: ReadonlyArray<DescriptionSegment>
    cancel: string
    action: string
    size?: AlertDialog.AlertDialogSize
    dir?: string
    lang?: string
    media?: string
    mediaClassName?: string
    triggerVariant?: Button.ButtonVariant
    actionVariant?: Button.ButtonVariant
  }>,
) => {
  const size = options.size ?? 'default'
  const root = document.createElement('div')
  root.dataset.modal = 'true'
  root.dataset.slot = 'alert-dialog'

  if (options.dir !== undefined) {
    root.setAttribute('dir', options.dir)
  }

  const trigger = document.createElement('button')
  trigger.setAttribute('type', 'button')
  trigger.setAttribute('tabindex', '0')
  trigger.setAttribute('aria-haspopup', 'dialog')
  trigger.setAttribute('aria-expanded', 'true')
  trigger.setAttribute('aria-controls', `${options.id}-popup`)
  trigger.dataset.popupOpen = ''
  trigger.dataset.slot = 'alert-dialog-trigger'
  trigger.setAttribute(
    'class',
    cn(Button.buttonVariants({ variant: options.triggerVariant ?? 'outline' })),
  )
  trigger.append(document.createTextNode(options.trigger))
  root.append(trigger)

  const dialog = document.createElement('dialog')
  dialog.setAttribute('id', options.id)
  dialog.setAttribute('open', '')
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', 'true')
  dialog.setAttribute('aria-labelledby', `${options.id}-title`)
  dialog.setAttribute('aria-describedby', `${options.id}-description`)

  const overlay = document.createElement('div')
  overlay.setAttribute('role', 'presentation')
  overlay.dataset.open = ''
  overlay.dataset.slot = 'alert-dialog-overlay'
  overlay.setAttribute('class', AlertDialog.alertDialogOverlayClassName())

  const content = document.createElement('div')
  content.setAttribute('id', `${options.id}-popup`)
  content.setAttribute('role', 'alertdialog')
  content.setAttribute('tabindex', '-1')
  content.setAttribute('aria-labelledby', `${options.id}-title`)
  content.setAttribute('aria-describedby', `${options.id}-description`)
  content.dataset.open = ''
  content.dataset.size = size
  content.dataset.slot = 'alert-dialog-content'
  content.setAttribute(
    'class',
    AlertDialog.alertDialogContentClassName({ dir: options.dir }),
  )

  if (options.dir !== undefined) {
    content.setAttribute('dir', options.dir)
  }

  if (options.lang !== undefined) {
    content.dataset.lang = options.lang
  }

  const header = document.createElement('div')
  header.dataset.slot = 'alert-dialog-header'
  header.setAttribute(
    'class',
    AlertDialog.alertDialogHeaderClassName({ dir: options.dir }),
  )

  if (options.media !== undefined) {
    const media = document.createElement('div')
    media.dataset.slot = 'alert-dialog-media'
    media.setAttribute(
      'class',
      AlertDialog.alertDialogMediaClassName({
        className: options.mediaClassName,
      }),
    )
    appendMediaIcon(media, options.media)
    header.append(media)
  }

  const title = document.createElement('h2')
  title.setAttribute('id', `${options.id}-title`)
  title.dataset.slot = 'alert-dialog-title'
  title.setAttribute('class', AlertDialog.alertDialogTitleClassName())
  title.append(document.createTextNode(options.title))

  const description = document.createElement('p')
  description.setAttribute('id', `${options.id}-description`)
  description.dataset.slot = 'alert-dialog-description'
  description.setAttribute(
    'class',
    AlertDialog.alertDialogDescriptionClassName(),
  )
  options.description.reduce((currentDescription, segment) => {
    if (typeof segment === 'string') {
      currentDescription.append(document.createTextNode(segment))
      return currentDescription
    }

    const link = document.createElement('a')
    link.setAttribute('href', segment.href)
    link.append(document.createTextNode(segment.text))
    currentDescription.append(link)

    return currentDescription
  }, description)

  header.append(title, description)

  const footer = document.createElement('div')
  footer.dataset.slot = 'alert-dialog-footer'
  footer.setAttribute('class', AlertDialog.alertDialogFooterClassName())

  const cancel = document.createElement('button')
  cancel.setAttribute('type', 'button')
  cancel.dataset.slot = 'alert-dialog-cancel'
  cancel.setAttribute('class', AlertDialog.alertDialogCancelClassName())
  cancel.append(document.createTextNode(options.cancel))

  const action = document.createElement('button')
  action.setAttribute('type', 'button')
  action.dataset.slot = 'alert-dialog-action'
  action.setAttribute(
    'class',
    AlertDialog.alertDialogActionClassName({
      variant: options.actionVariant,
    }),
  )
  action.append(document.createTextNode(options.action))

  footer.append(cancel, action)
  content.append(header, footer)
  dialog.append(overlay, content)
  root.append(dialog)

  return root
}

const snapshotAlertDialog = (
  options: Parameters<typeof snapshotAlertDialogElement>[0],
) => {
  const root = snapshotAlertDialogElement(options)

  document.body.append(root)
  const snapshot = snapshotElement(root, {
    click: 'activates',
    Enter: 'native-activates',
    Space: 'native-activates',
    mousedown: 'passes-through',
    pointerdown: 'passes-through',
  })
  root.remove()

  return snapshot
}

const snapshotAlertDialogRtl = () => {
  const root = document.createElement('div')
  root.setAttribute('class', 'flex gap-4')
  root.setAttribute('dir', 'rtl')
  root.append(
    snapshotAlertDialogElement({
      id: 'alert-dialog-rtl-default',
      trigger: 'إظهار الحوار',
      title: 'هل أنت متأكد تمامًا؟',
      description: [
        'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيًا من خوادمنا.',
      ],
      cancel: 'إلغاء',
      action: 'متابعة',
      dir: 'rtl',
      lang: 'ar',
    }),
    snapshotAlertDialogElement({
      id: 'alert-dialog-rtl-small',
      trigger: 'إظهار الحوار (صغير)',
      title: 'السماح للملحق بالاتصال؟',
      description: ['هل تريد السماح لملحق USB بالاتصال بهذا الجهاز؟'],
      cancel: 'عدم السماح',
      action: 'السماح',
      size: 'sm',
      dir: 'rtl',
      lang: 'ar',
      media: 'bluetooth',
    }),
  )

  document.body.append(root)
  const snapshot = snapshotElement(root, {
    click: 'activates',
    Enter: 'native-activates',
    Space: 'native-activates',
    mousedown: 'passes-through',
    pointerdown: 'passes-through',
  })
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'alert-dialog-demo',
    snapshot: snapshotAlertDialog({
      id: 'alert-dialog-demo',
      trigger: 'Show Dialog',
      title: 'Are you absolutely sure?',
      description: [
        'This action cannot be undone. This will permanently delete your account from our servers.',
      ],
      cancel: 'Cancel',
      action: 'Continue',
    }),
  },
  {
    id: 'alert-dialog-basic',
    snapshot: snapshotAlertDialog({
      id: 'alert-dialog-basic',
      trigger: 'Show Dialog',
      title: 'Are you absolutely sure?',
      description: [
        'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
      ],
      cancel: 'Cancel',
      action: 'Continue',
    }),
  },
  {
    id: 'alert-dialog-destructive',
    snapshot: snapshotAlertDialog({
      id: 'alert-dialog-destructive',
      trigger: 'Delete Chat',
      triggerVariant: 'destructive',
      title: 'Delete chat?',
      description: [
        'This will permanently delete this chat conversation. View ',
        {
          href: '#',
          text: 'Settings',
          type: 'link',
        },
        ' delete any memories saved during this chat.',
      ],
      cancel: 'Cancel',
      action: 'Delete',
      size: 'sm',
      media: 'trash',
      mediaClassName:
        'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive',
      actionVariant: 'destructive',
    }),
  },
  {
    id: 'alert-dialog-media',
    snapshot: snapshotAlertDialog({
      id: 'alert-dialog-media',
      trigger: 'Share Project',
      title: 'Share this project?',
      description: [
        'Anyone with the link will be able to view and edit this project.',
      ],
      cancel: 'Cancel',
      action: 'Share',
      media: 'circle-fading-plus',
    }),
  },
  {
    id: 'alert-dialog-small',
    snapshot: snapshotAlertDialog({
      id: 'alert-dialog-small',
      trigger: 'Show Dialog',
      title: 'Allow accessory to connect?',
      description: [
        'Do you want to allow the USB accessory to connect to this device?',
      ],
      cancel: "Don't allow",
      action: 'Allow',
      size: 'sm',
    }),
  },
  {
    id: 'alert-dialog-small-media',
    snapshot: snapshotAlertDialog({
      id: 'alert-dialog-small-media',
      trigger: 'Show Dialog',
      title: 'Allow accessory to connect?',
      description: [
        'Do you want to allow the USB accessory to connect to this device?',
      ],
      cancel: "Don't allow",
      action: 'Allow',
      size: 'sm',
      media: 'bluetooth',
    }),
  },
  {
    id: 'alert-dialog-rtl',
    snapshot: snapshotAlertDialogRtl(),
  },
]
