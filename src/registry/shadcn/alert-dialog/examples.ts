import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Button from '../button'
import { view as AlertDialog } from './index'
import type { AlertDialogOpenChange, AlertDialogSize } from './index'

type IconName = 'bluetooth' | 'circle-fading-plus' | 'trash'

export type AlertDialogExampleController<Message> = Readonly<{
  openFor?: (dialogId: string, defaultOpen: boolean) => boolean
  onOpenChange?: (dialogId: string, change: AlertDialogOpenChange) => Message
}>

const isOpenFor = <Message>(
  controller: AlertDialogExampleController<Message>,
  dialogId: string,
  defaultOpen: boolean,
): boolean => controller.openFor?.(dialogId, defaultOpen) ?? defaultOpen

const icon = (
  name: IconName,
  children: ReadonlyArray<Html>,
  className = 'lucide',
): Html => {
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
      h.DataAttribute('icon', name),
      h.Class(className),
      h.AriaHidden(true),
    ],
    children,
  )
}

const bluetoothIcon = (): Html => {
  const h = html<never>()

  return icon('bluetooth', [
    h.path([h.D('m6.5 6.5 11 11-5.5 4.5V2l5.5 4.5-11 11')], []),
  ])
}

const circleFadingPlusIcon = (): Html => {
  const h = html<never>()

  return icon('circle-fading-plus', [
    h.path([h.D('M12 2a10 10 0 0 1 7.38 16.75')], []),
    h.path([h.D('M12 8v8')], []),
    h.path([h.D('M8 12h8')], []),
    h.path([h.D('M2.5 8.9A10 10 0 0 0 12 22')], []),
    h.path([h.D('M2 14.5A10 10 0 0 0 5.5 20')], []),
  ])
}

const trashIcon = (): Html => {
  const h = html<never>()

  return icon('trash', [
    h.path([h.D('M3 6h18')], []),
    h.path([h.D('M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2')], []),
    h.path([h.D('M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6')], []),
    h.path([h.D('M10 11v6')], []),
    h.path([h.D('M14 11v6')], []),
  ])
}

const alertDialogShell = <Message>(
  config: Readonly<{
    id: string
    trigger: string
    title: string
    description: ReadonlyArray<Html | string>
    cancel: string
    action: string
    size?: AlertDialogSize
    dir?: string
    lang?: string
    media?: Html
    mediaClassName?: string
    triggerVariant?: Button.ButtonVariant
    actionVariant?: Button.ButtonVariant
  }>,
  controller: AlertDialogExampleController<Message>,
): Html => {
  const h = html<Message>()
  const { onOpenChange } = controller

  return AlertDialog<Message>({
    id: config.id,
    open: isOpenFor(controller, config.id, true),
    ...(onOpenChange === undefined
      ? {}
      : {
          onOpenChange: change => onOpenChange(config.id, change),
        }),
    titleId: `${config.id}-title`,
    descriptionId: `${config.id}-description`,
    size: config.size,
    dir: config.dir,
    mediaClassName: config.mediaClassName,
    actionVariant: config.actionVariant,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          Button.view<Message>({
            variant: config.triggerVariant ?? 'outline',
            toView: buttonAttributes =>
              h.button(
                [...buttonAttributes.button, ...attributes.trigger],
                [config.trigger],
              ),
          }),
          h.dialog(
            [...attributes.dialog],
            [
              h.div([...attributes.backdrop.root], []),
              h.div(
                [
                  ...attributes.popup.root,
                  ...(config.lang === undefined
                    ? []
                    : [h.DataAttribute('lang', config.lang)]),
                ],
                [
                  h.div(
                    [...attributes.header],
                    [
                      config.media === undefined
                        ? h.empty
                        : h.div([...attributes.media], [config.media]),
                      h.h2([...attributes.title], [config.title]),
                      h.p([...attributes.description], config.description),
                    ],
                  ),
                  h.div(
                    [...attributes.footer],
                    [
                      h.button([...attributes.cancel], [config.cancel]),
                      h.button([...attributes.action], [config.action]),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
  })
}

export const AlertDialogDemo = <Message = never>(
  controller: AlertDialogExampleController<Message> = {},
): Html =>
  alertDialogShell(
    {
      id: 'alert-dialog-demo',
      trigger: 'Show Dialog',
      title: 'Are you absolutely sure?',
      description: [
        'This action cannot be undone. This will permanently delete your account from our servers.',
      ],
      cancel: 'Cancel',
      action: 'Continue',
    },
    controller,
  )

export const AlertDialogBasic = <Message = never>(
  controller: AlertDialogExampleController<Message> = {},
): Html =>
  alertDialogShell(
    {
      id: 'alert-dialog-basic',
      trigger: 'Show Dialog',
      title: 'Are you absolutely sure?',
      description: [
        'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
      ],
      cancel: 'Cancel',
      action: 'Continue',
    },
    controller,
  )

export const AlertDialogDestructive = <Message = never>(
  controller: AlertDialogExampleController<Message> = {},
): Html => {
  const h = html<never>()

  return alertDialogShell(
    {
      id: 'alert-dialog-destructive',
      trigger: 'Delete Chat',
      triggerVariant: 'destructive',
      title: 'Delete chat?',
      description: [
        'This will permanently delete this chat conversation. View ',
        h.a([h.Href('#')], ['Settings']),
        ' delete any memories saved during this chat.',
      ],
      cancel: 'Cancel',
      action: 'Delete',
      size: 'sm',
      media: trashIcon(),
      mediaClassName:
        'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive',
      actionVariant: 'destructive',
    },
    controller,
  )
}

export const AlertDialogWithMedia = <Message = never>(
  controller: AlertDialogExampleController<Message> = {},
): Html =>
  alertDialogShell(
    {
      id: 'alert-dialog-media',
      trigger: 'Share Project',
      title: 'Share this project?',
      description: [
        'Anyone with the link will be able to view and edit this project.',
      ],
      cancel: 'Cancel',
      action: 'Share',
      media: circleFadingPlusIcon(),
    },
    controller,
  )

export const AlertDialogSmall = <Message = never>(
  controller: AlertDialogExampleController<Message> = {},
): Html =>
  alertDialogShell(
    {
      id: 'alert-dialog-small',
      trigger: 'Show Dialog',
      title: 'Allow accessory to connect?',
      description: [
        'Do you want to allow the USB accessory to connect to this device?',
      ],
      cancel: "Don't allow",
      action: 'Allow',
      size: 'sm',
    },
    controller,
  )

export const AlertDialogSmallWithMedia = <Message = never>(
  controller: AlertDialogExampleController<Message> = {},
): Html =>
  alertDialogShell(
    {
      id: 'alert-dialog-small-media',
      trigger: 'Show Dialog',
      title: 'Allow accessory to connect?',
      description: [
        'Do you want to allow the USB accessory to connect to this device?',
      ],
      cancel: "Don't allow",
      action: 'Allow',
      size: 'sm',
      media: bluetoothIcon(),
    },
    controller,
  )

export const AlertDialogRtl = <Message = never>(
  controller: AlertDialogExampleController<Message> = {},
): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex gap-4'), h.Dir('rtl')],
    [
      alertDialogShell(
        {
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
        },
        controller,
      ),
      alertDialogShell(
        {
          id: 'alert-dialog-rtl-small',
          trigger: 'إظهار الحوار (صغير)',
          title: 'السماح للملحق بالاتصال؟',
          description: ['هل تريد السماح لملحق USB بالاتصال بهذا الجهاز؟'],
          cancel: 'عدم السماح',
          action: 'السماح',
          size: 'sm',
          dir: 'rtl',
          lang: 'ar',
          media: bluetoothIcon(),
        },
        controller,
      ),
    ],
  )
}
