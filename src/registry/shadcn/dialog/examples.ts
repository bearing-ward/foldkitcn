import { Array } from 'effect'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Dialog } from './index'
import type { DialogAttributes, DialogOpenChange } from './index'

export type DialogExampleController<Message> = Readonly<{
  openFor?: (dialogId: string, defaultOpen: boolean) => boolean
  onOpenChange?: (dialogId: string, change: DialogOpenChange) => Message
}>

const isOpenFor = <Message>(
  controller: DialogExampleController<Message>,
  dialogId: string,
  defaultOpen: boolean,
): boolean => controller.openFor?.(dialogId, defaultOpen) ?? defaultOpen

const buttonClassName = (className: string): string =>
  [
    'group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
    className,
  ].join(' ')

const inputClassName =
  'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40'

const paragraphText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

const dialogShell = <Message>(
  config: Readonly<{
    id: string
    trigger: string
    title: string
    description: string
    showCloseButton?: boolean
    contentClassName?: string
    dir?: string
    lang?: string
    body?: ReadonlyArray<Html>
    footer?: (attributes: DialogAttributes<Message>) => ReadonlyArray<Html>
  }>,
  controller: DialogExampleController<Message>,
): Html => {
  const h = html<Message>()
  const { onOpenChange } = controller

  return Dialog<Message>({
    id: config.id,
    open: isOpenFor(controller, config.id, true),
    ...(onOpenChange === undefined
      ? {}
      : { onOpenChange: change => onOpenChange(config.id, change) }),
    dir: config.dir,
    contentClassName: config.contentClassName,
    showCloseButton: config.showCloseButton,
    titleId: `${config.id}-title`,
    descriptionId: `${config.id}-description`,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.button(
            [
              ...attributes.trigger,
              h.Class(
                buttonClassName('border-border bg-background px-2.5 h-8'),
              ),
            ],
            [config.trigger],
          ),
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
                      h.h2([...attributes.title], [config.title]),
                      h.p([...attributes.description], [config.description]),
                    ],
                  ),
                  ...(config.body ?? []),
                  ...(config.footer === undefined
                    ? []
                    : [
                        h.div(
                          [...attributes.footer],
                          config.footer(attributes),
                        ),
                      ]),
                  config.showCloseButton === false
                    ? h.empty
                    : h.button(
                        [...attributes.close],
                        [h.span([h.Class('sr-only')], ['Close'])],
                      ),
                ],
              ),
            ],
          ),
        ],
      ),
  })
}

const profileFields = (
  values: Readonly<{ name: string; username: string; dir?: string }>,
): ReadonlyArray<Html> => {
  const h = html<never>()

  return [
    h.div(
      [h.Class('grid gap-4')],
      [
        h.div(
          [h.Class('grid gap-2')],
          [
            h.label([h.Attribute('for', 'name-1')], [values.name]),
            h.input([
              h.Id('name-1'),
              h.Name('name'),
              h.Value('Pedro Duarte'),
              h.Class(inputClassName),
            ]),
          ],
        ),
        h.div(
          [h.Class('grid gap-2')],
          [
            h.label([h.Attribute('for', 'username-1')], [values.username]),
            h.input([
              h.Id('username-1'),
              h.Name('username'),
              h.Value('@peduarte'),
              h.Class(inputClassName),
            ]),
          ],
        ),
      ],
    ),
  ]
}

const footerButtons = <Message>(
  attributes: DialogAttributes<Message>,
  labels: Readonly<{ cancel: string; save: string }>,
): ReadonlyArray<Html> => {
  const h = html<Message>()

  return [
    h.button(
      [
        ...attributes.close,
        h.Class(buttonClassName('border-border bg-background px-2.5 h-8')),
      ],
      [labels.cancel],
    ),
    h.button(
      [
        ...attributes.close,
        h.Class(
          buttonClassName('bg-primary text-primary-foreground px-2.5 h-8'),
        ),
      ],
      [labels.save],
    ),
  ]
}

const scrollableBody = (): ReadonlyArray<Html> => {
  const h = html<never>()

  return [
    h.div(
      [h.Class('-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4')],
      Array.makeBy(10, index =>
        h.p(
          [h.Class('mb-4 leading-normal')],
          [`${paragraphText} ${index + 1}`],
        ),
      ),
    ),
  ]
}

export const DialogDemo = <Message = never>(
  controller: DialogExampleController<Message> = {},
): Html =>
  dialogShell(
    {
      id: 'dialog-demo',
      trigger: 'Open Dialog',
      title: 'Edit profile',
      description:
        "Make changes to your profile here. Click save when you're done.",
      contentClassName: 'sm:max-w-sm',
      body: profileFields({ name: 'Name', username: 'Username' }),
      footer: attributes =>
        footerButtons(attributes, { cancel: 'Cancel', save: 'Save changes' }),
    },
    controller,
  )

export const DialogCloseButton = <Message = never>(
  controller: DialogExampleController<Message> = {},
): Html => {
  const h = html<Message>()

  return dialogShell(
    {
      id: 'dialog-close-button',
      trigger: 'Share',
      title: 'Share link',
      description: 'Anyone who has this link will be able to view this.',
      contentClassName: 'sm:max-w-md',
      body: [
        h.div(
          [h.Class('flex items-center gap-2')],
          [
            h.div(
              [h.Class('grid flex-1 gap-2')],
              [
                h.label(
                  [h.Attribute('for', 'link'), h.Class('sr-only')],
                  ['Link'],
                ),
                h.input([
                  h.Id('link'),
                  h.Value('https://ui.shadcn.com/docs/installation'),
                  h.Readonly(true),
                  h.Class(inputClassName),
                ]),
              ],
            ),
          ],
        ),
      ],
      footer: attributes => [
        h.button(
          [
            ...attributes.close,
            h.Class(
              buttonClassName('bg-primary text-primary-foreground px-2.5 h-8'),
            ),
          ],
          ['Close'],
        ),
      ],
    },
    controller,
  )
}

export const DialogNoCloseButton = <Message = never>(
  controller: DialogExampleController<Message> = {},
): Html =>
  dialogShell(
    {
      id: 'dialog-no-close-button',
      trigger: 'No Close Button',
      title: 'No Close Button',
      description:
        "This dialog doesn't have a close button in the top-right corner.",
      showCloseButton: false,
    },
    controller,
  )

export const DialogScrollableContent = <Message = never>(
  controller: DialogExampleController<Message> = {},
): Html =>
  dialogShell(
    {
      id: 'dialog-scrollable-content',
      trigger: 'Scrollable Content',
      title: 'Scrollable Content',
      description: 'This is a dialog with scrollable content.',
      body: scrollableBody(),
    },
    controller,
  )

export const DialogStickyFooter = <Message = never>(
  controller: DialogExampleController<Message> = {},
): Html =>
  dialogShell(
    {
      id: 'dialog-sticky-footer',
      trigger: 'Sticky Footer',
      title: 'Sticky Footer',
      description:
        'This dialog has a sticky footer that stays visible while the content scrolls.',
      body: scrollableBody(),
      footer: attributes => {
        const h = html<Message>()

        return [
          h.button(
            [
              ...attributes.close,
              h.Class(
                buttonClassName('border-border bg-background px-2.5 h-8'),
              ),
            ],
            ['Close'],
          ),
        ]
      },
    },
    controller,
  )

export const DialogRtl = <Message = never>(
  controller: DialogExampleController<Message> = {},
): Html =>
  dialogShell(
    {
      id: 'dialog-rtl',
      trigger: 'فتح الحوار',
      title: 'تعديل الملف الشخصي',
      description:
        'قم بإجراء تغييرات على ملفك الشخصي هنا. انقر فوق حفظ عند الانتهاء.',
      contentClassName: 'sm:max-w-sm',
      dir: 'rtl',
      lang: 'ar',
      body: profileFields({
        name: 'الاسم',
        username: 'اسم المستخدم',
        dir: 'rtl',
      }),
      footer: attributes =>
        footerButtons(attributes, { cancel: 'إلغاء', save: 'حفظ التغييرات' }),
    },
    controller,
  )
