import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as Button from '../button'
import { view as Input } from '../input'
import { view as Label } from '../label'
import { DirectionProvider } from './index'
import type { Direction } from './index'

type Child = Html | string

type LoginCopy = Readonly<{
  dir: Direction
  lang: string
  title: string
  description: string
  signUp: string
  email: string
  emailPlaceholder: string
  password: string
  forgotPassword: string
  login: string
  loginWithProvider: string
}>

const englishLoginCopy: LoginCopy = {
  dir: 'ltr',
  lang: 'en',
  title: 'Login to your account',
  description: 'Enter your email below to login to your account',
  signUp: 'Sign Up',
  email: 'Email',
  emailPlaceholder: 'm@example.com',
  password: 'Password',
  forgotPassword: 'Forgot your password?',
  login: 'Login',
  loginWithProvider: 'Login with Google',
}

const arabicLoginCopy: LoginCopy = {
  dir: 'rtl',
  lang: 'ar',
  title: 'تسجيل الدخول إلى حسابك',
  description: 'أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك',
  signUp: 'إنشاء حساب',
  email: 'البريد الإلكتروني',
  emailPlaceholder: 'm@example.com',
  password: 'كلمة المرور',
  forgotPassword: 'نسيت كلمة المرور؟',
  login: 'تسجيل الدخول',
  loginWithProvider: 'تسجيل الدخول باستخدام Google',
}

const cardBaseClassName =
  'group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl'
const cardHeaderClassName =
  'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)'
const cardTitleClassName =
  'cn-font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm'
const cardDescriptionClassName = 'text-sm text-muted-foreground'
const cardActionClassName =
  'col-start-2 row-span-2 row-start-1 self-start justify-self-end'
const cardContentClassName = 'px-(--card-spacing)'
const cardFooterClassName =
  'flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)'

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

const input = (
  config: Readonly<{
    id: string
    type: string
    placeholder?: string
    isRequired?: boolean
  }>,
): Html => {
  const h = html<never>()

  return Input<never>({
    id: config.id,
    type: config.type,
    placeholder: config.placeholder,
    isRequired: config.isRequired,
    toView: attributes => h.input([...attributes.input]),
  })
}

const label = (forId: string, text: string): Html => {
  const h = html<never>()

  return Label<never>({
    htmlFor: forId,
    toView: attributes => h.label([...attributes.label], [text]),
  })
}

const cardPart = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: string,
  className: string,
  children: ReadonlyArray<Child>,
  attributes: ReadonlyArray<Attribute<Message>> = [],
): Html =>
  h.div(
    [h.DataAttribute('slot', slot), h.Class(className), ...attributes],
    children,
  )

const loginCard = (copy: LoginCopy): Html => {
  const h = html<never>()

  return DirectionProvider<never>({
    direction: copy.dir,
    lang: copy.lang,
    className: 'w-full max-w-sm',
    toView: attributes =>
      h.div(
        [
          ...attributes.root,
          h.DataAttribute('slot', 'card'),
          h.DataAttribute('size', 'default'),
          h.Class(cn(cardBaseClassName, 'w-full max-w-sm')),
        ],
        [
          cardPart(h, 'card-header', cardHeaderClassName, [
            cardPart(h, 'card-title', cardTitleClassName, [copy.title]),
            cardPart(h, 'card-description', cardDescriptionClassName, [
              copy.description,
            ]),
            cardPart(h, 'card-action', cardActionClassName, [
              button(copy.signUp, { variant: 'link' }),
            ]),
          ]),
          cardPart(h, 'card-content', cardContentClassName, [
            h.form(
              [],
              [
                h.div(
                  [h.Class('flex flex-col gap-6')],
                  [
                    h.div(
                      [h.Class('grid gap-2')],
                      [
                        label('email-direction', copy.email),
                        input({
                          id: 'email-direction',
                          type: 'email',
                          placeholder: copy.emailPlaceholder,
                          isRequired: true,
                        }),
                      ],
                    ),
                    h.div(
                      [h.Class('grid gap-2')],
                      [
                        h.div(
                          [h.Class('flex items-center')],
                          [
                            label('password-direction', copy.password),
                            h.a(
                              [
                                h.Href('#'),
                                h.Class(
                                  'ms-auto inline-block text-sm underline-offset-4 hover:underline',
                                ),
                              ],
                              [copy.forgotPassword],
                            ),
                          ],
                        ),
                        input({
                          id: 'password-direction',
                          type: 'password',
                          isRequired: true,
                        }),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ]),
          cardPart(
            h,
            'card-footer',
            cn(cardFooterClassName, 'flex-col gap-2'),
            [
              button(copy.login, { type: 'submit', className: 'w-full' }),
              button(copy.loginWithProvider, {
                variant: 'outline',
                className: 'w-full',
              }),
            ],
          ),
        ],
      ),
  })
}

export const DirectionDemo = (): Html => loginCard(englishLoginCopy)

export const DirectionRtlCard = (): Html => loginCard(arabicLoginCopy)
