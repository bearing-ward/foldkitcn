import { Array } from 'effect'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Button from '../button'
import { Field, FieldGroup, FieldLabel } from '../field'
import { view as Input } from '../input'
import { sheetSideValues, view as Sheet } from './index'
import type { SheetOpenChange, SheetSide as SheetSideValue } from './index'

export type SheetExampleController<Message> = Readonly<{
  openFor?: (sheetId: string, defaultOpen: boolean) => boolean
  onOpenChange?: (sheetId: string, change: SheetOpenChange) => Message
}>

const isOpenFor = <Message>(
  controller: SheetExampleController<Message>,
  sheetId: string,
  defaultOpen: boolean,
): boolean => controller.openFor?.(sheetId, defaultOpen) ?? defaultOpen

const button = (
  label: string,
  config: Readonly<{
    variant?: Button.ButtonVariant
    className?: string
    type?: 'button' | 'submit'
  }> = {},
): Html => {
  const h = html<never>()

  return Button.view<never>({
    variant: config.variant,
    className: config.className,
    type: config.type,
    toView: attributes => h.button([...attributes.button], [label]),
  })
}

const optionalDir = (dir: string | undefined): Readonly<{ dir?: string }> =>
  dir === undefined ? {} : { dir }

const input = (
  config: Readonly<{ id: string; value: string; dir?: string }>,
): Html => {
  const h = html<never>()

  return Input<never>({
    id: config.id,
    value: config.value,
    toView: attributes =>
      h.input([
        ...attributes.input,
        ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
      ]),
  })
}

const profileFields = (
  labels: Readonly<{
    name: string
    nameId: string
    nameValue: string
    username: string
    usernameId: string
    usernameValue: string
    dir?: string
  }>,
): Html =>
  FieldGroup<never>({
    className: 'grid flex-1 auto-rows-min gap-6 px-4',
    ...optionalDir(labels.dir),
    children: [
      Field<never>({
        className: 'grid gap-3',
        children: [
          FieldLabel<never>({
            htmlFor: labels.nameId,
            ...optionalDir(labels.dir),
            children: [labels.name],
          }),
          input({
            id: labels.nameId,
            value: labels.nameValue,
            ...optionalDir(labels.dir),
          }),
        ],
      }),
      Field<never>({
        className: 'grid gap-3',
        children: [
          FieldLabel<never>({
            htmlFor: labels.usernameId,
            ...optionalDir(labels.dir),
            children: [labels.username],
          }),
          input({
            id: labels.usernameId,
            value: labels.usernameValue,
            ...optionalDir(labels.dir),
          }),
        ],
      }),
    ],
  })

const paragraphText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

const scrollableBody = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('no-scrollbar overflow-y-auto px-4')],
    Array.makeBy(10, index =>
      h.p([h.Class('mb-2 leading-relaxed')], [`${paragraphText} ${index + 1}`]),
    ),
  )
}

const sheetShell = <Message>(
  config: Readonly<{
    id: string
    trigger: string
    title: string
    description: string
    side?: SheetSideValue
    dir?: string
    lang?: string
    contentClassName?: string
    showCloseButton?: boolean
    body?: ReadonlyArray<Html>
    footer?: ReadonlyArray<Html>
  }>,
  controller: SheetExampleController<Message>,
): Html => {
  const h = html<Message>()
  const { onOpenChange } = controller

  return Sheet<Message>({
    id: config.id,
    open: isOpenFor(controller, config.id, true),
    ...(onOpenChange === undefined
      ? {}
      : { onOpenChange: change => onOpenChange(config.id, change) }),
    side: config.side,
    dir: config.dir,
    contentClassName: config.contentClassName,
    showCloseButton: config.showCloseButton,
    titleId: `${config.id}-title`,
    descriptionId: `${config.id}-description`,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          Button.view<Message>({
            variant: 'outline',
            toView: buttonAttributes =>
              h.button(
                [...attributes.trigger, ...buttonAttributes.button],
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
                      h.h2([...attributes.title], [config.title]),
                      h.p([...attributes.description], [config.description]),
                    ],
                  ),
                  ...(config.body ?? []),
                  ...(config.footer === undefined
                    ? []
                    : [h.div([...attributes.footer], config.footer)]),
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

export const SheetDemo = <Message = never>(
  controller: SheetExampleController<Message> = {},
): Html =>
  sheetShell(
    {
      id: 'sheet-demo',
      trigger: 'Open',
      title: 'Edit profile',
      description:
        "Make changes to your profile here. Click save when you're done.",
      body: [
        profileFields({
          name: 'Name',
          nameId: 'sheet-demo-name',
          nameValue: 'Pedro Duarte',
          username: 'Username',
          usernameId: 'sheet-demo-username',
          usernameValue: '@peduarte',
        }),
      ],
      footer: [
        button('Save changes', { type: 'submit' }),
        button('Close', { variant: 'outline' }),
      ],
    },
    controller,
  )

export const SheetSide = <Message = never>(
  controller: SheetExampleController<Message> = {},
): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-wrap gap-2')],
    sheetSideValues.map(side =>
      sheetShell(
        {
          id: `sheet-side-${side}`,
          trigger: side,
          title: 'Edit profile',
          description:
            "Make changes to your profile here. Click save when you're done.",
          side,
          contentClassName:
            'data-[side=bottom]:!max-h-[25vh] data-[side=top]:!max-h-[25vh]',
          body: [scrollableBody()],
          footer: [
            button('Save changes', { type: 'submit' }),
            button('Cancel', { variant: 'outline' }),
          ],
        },
        controller,
      ),
    ),
  )
}

export const SheetNoCloseButton = <Message = never>(
  controller: SheetExampleController<Message> = {},
): Html =>
  sheetShell(
    {
      id: 'sheet-no-close-button',
      trigger: 'Open Sheet',
      title: 'No Close Button',
      description:
        "This sheet doesn't have a close button in the top-right corner. Click outside to close.",
      showCloseButton: false,
    },
    controller,
  )

export const SheetRtl = <Message = never>(
  controller: SheetExampleController<Message> = {},
): Html =>
  sheetShell(
    {
      id: 'sheet-rtl',
      trigger: 'فتح',
      title: 'تعديل الملف الشخصي',
      description:
        'قم بإجراء تغييرات على ملفك الشخصي هنا. انقر حفظ عند الانتهاء.',
      dir: 'rtl',
      lang: 'ar',
      side: 'left',
      body: [
        profileFields({
          name: 'الاسم',
          nameId: 'sheet-rtl-name',
          nameValue: 'Pedro Duarte',
          username: 'اسم المستخدم',
          usernameId: 'sheet-rtl-username',
          usernameValue: 'peduarte',
          dir: 'rtl',
        }),
      ],
      footer: [
        button('حفظ التغييرات', { type: 'submit' }),
        button('إغلاق', { variant: 'outline' }),
      ],
    },
    controller,
  )
