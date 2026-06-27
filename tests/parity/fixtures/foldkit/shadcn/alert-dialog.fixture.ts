import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as AlertDialog from '../../../../../src/registry/shadcn/alert-dialog'
import * as Button from '../../../../../src/registry/shadcn/button'
import type { FixtureCase } from '../../../fixture'
import { snapshotHtml } from '../render'

const snapshot = (view: ReturnType<typeof AlertDialog.view<never>>) =>
  snapshotHtml(view, {
    click: 'activates',
    Enter: 'native-activates',
    Space: 'native-activates',
    mousedown: 'passes-through',
    pointerdown: 'passes-through',
  })

const mediaIcon = (name: string): Html => {
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
      h.AriaHidden(true),
    ],
    [],
  )
}

const settingsLink = (): Html => {
  const h = html<never>()

  return h.a([h.Href('#')], ['Settings'])
}

const shadcnAlertDialogRoot = (
  options: Readonly<{
    id: string
    trigger: string
    title: string
    description: ReadonlyArray<Html | string>
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
) =>
  AlertDialog.view<never>({
    id: options.id,
    open: true,
    titleId: `${options.id}-title`,
    descriptionId: `${options.id}-description`,
    size: options.size,
    dir: options.dir,
    mediaClassName: options.mediaClassName,
    actionVariant: options.actionVariant,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          Button.view<never>({
            variant: options.triggerVariant ?? 'outline',
            toView: buttonAttributes =>
              h.button(
                [...buttonAttributes.button, ...attributes.trigger],
                [options.trigger],
              ),
          }),
          h.dialog(
            [...attributes.dialog],
            [
              h.div([...attributes.backdrop.root], []),
              h.div(
                [
                  ...attributes.popup.root,
                  ...(options.lang === undefined
                    ? []
                    : [h.DataAttribute('lang', options.lang)]),
                ],
                [
                  h.div(
                    [...attributes.header],
                    [
                      options.media === undefined
                        ? h.empty
                        : h.div(
                            [...attributes.media],
                            [mediaIcon(options.media)],
                          ),
                      h.h2([...attributes.title], [options.title]),
                      h.p([...attributes.description], options.description),
                    ],
                  ),
                  h.div(
                    [...attributes.footer],
                    [
                      h.button([...attributes.cancel], [options.cancel]),
                      h.button([...attributes.action], [options.action]),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      )
    },
  })

const shadcnAlertDialogRtl = () => {
  const h = html<never>()

  return h.div(
    [h.Class('flex gap-4'), h.Dir('rtl')],
    [
      shadcnAlertDialogRoot({
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
      shadcnAlertDialogRoot({
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
    ],
  )
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'alert-dialog-demo',
    snapshot: snapshot(
      shadcnAlertDialogRoot({
        id: 'alert-dialog-demo',
        trigger: 'Show Dialog',
        title: 'Are you absolutely sure?',
        description: [
          'This action cannot be undone. This will permanently delete your account from our servers.',
        ],
        cancel: 'Cancel',
        action: 'Continue',
      }),
    ),
  },
  {
    id: 'alert-dialog-basic',
    snapshot: snapshot(
      shadcnAlertDialogRoot({
        id: 'alert-dialog-basic',
        trigger: 'Show Dialog',
        title: 'Are you absolutely sure?',
        description: [
          'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
        ],
        cancel: 'Cancel',
        action: 'Continue',
      }),
    ),
  },
  {
    id: 'alert-dialog-destructive',
    snapshot: snapshot(
      shadcnAlertDialogRoot({
        id: 'alert-dialog-destructive',
        trigger: 'Delete Chat',
        triggerVariant: 'destructive',
        title: 'Delete chat?',
        description: [
          'This will permanently delete this chat conversation. View ',
          settingsLink(),
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
    ),
  },
  {
    id: 'alert-dialog-media',
    snapshot: snapshot(
      shadcnAlertDialogRoot({
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
    ),
  },
  {
    id: 'alert-dialog-small',
    snapshot: snapshot(
      shadcnAlertDialogRoot({
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
    ),
  },
  {
    id: 'alert-dialog-small-media',
    snapshot: snapshot(
      shadcnAlertDialogRoot({
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
    ),
  },
  {
    id: 'alert-dialog-rtl',
    snapshot: snapshot(shadcnAlertDialogRtl()),
  },
]
