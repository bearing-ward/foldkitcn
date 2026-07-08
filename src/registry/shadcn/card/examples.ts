import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Badge } from '../badge'
import * as Button from '../button'
import { view as Input } from '../input'
import { view as Label } from '../label'
import { toggleGroupClassName, toggleGroupItemClassName } from '../toggle-group'
import type { CardSize } from './index'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './index'

type Child = Html | string

type LoginCopy = Readonly<{
  dir: 'ltr' | 'rtl'
  title: string
  description: string
  signUp: string
  email: string
  emailId: string
  emailPlaceholder: string
  password: string
  passwordId: string
  forgotPassword: string
  forgotPasswordClassName: string
  login: string
  loginWithGoogle: string
}>

const defaultLoginCopy: LoginCopy = {
  dir: 'ltr',
  title: 'Login to your account',
  description: 'Enter your email below to login to your account',
  signUp: 'Sign Up',
  email: 'Email',
  emailId: 'email',
  emailPlaceholder: 'm@example.com',
  password: 'Password',
  passwordId: 'password',
  forgotPassword: 'Forgot your password?',
  forgotPasswordClassName:
    'ml-auto inline-block text-sm underline-offset-4 hover:underline',
  login: 'Login',
  loginWithGoogle: 'Login with Google',
}

const arabicLoginCopy: LoginCopy = {
  dir: 'rtl',
  title: 'تسجيل الدخول إلى حسابك',
  description: 'أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك',
  signUp: 'إنشاء حساب',
  email: 'البريد الإلكتروني',
  emailId: 'email-rtl',
  emailPlaceholder: 'm@example.com',
  password: 'كلمة المرور',
  passwordId: 'password-rtl',
  forgotPassword: 'نسيت كلمة المرور؟',
  forgotPasswordClassName:
    'ms-auto inline-block text-sm underline-offset-4 hover:underline',
  login: 'تسجيل الدخول',
  loginWithGoogle: 'تسجيل الدخول باستخدام Google',
}

const spacingLoginCopy: LoginCopy = {
  ...defaultLoginCopy,
  emailId: 'email-spacing',
  passwordId: 'password-spacing',
}

const spacingOptions = [
  {
    className: '[--card-spacing:--spacing(4)]',
    label: '16px',
    value: '4',
  },
  {
    className: '[--card-spacing:--spacing(5)]',
    label: '20px',
    value: '5',
  },
  {
    className: '[--card-spacing:--spacing(6)]',
    label: '24px',
    value: '6',
  },
  {
    className: '[--card-spacing:--spacing(8)]',
    label: '32px',
    value: '8',
  },
]

const [selectedSpacing] = spacingOptions

const button = (
  label: string,
  config: Readonly<{
    variant?: Button.ButtonVariant
    size?: Button.ButtonSize
    className?: string
    type?: 'button' | 'submit'
  }> = {},
): Html => {
  const h = html<never>()

  return Button.view<never>({
    variant: config.variant,
    size: config.size,
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

const formFields = (copy: LoginCopy): Html => {
  const h = html<never>()

  return h.form(
    [],
    [
      h.div(
        [h.Class('flex flex-col gap-6')],
        [
          h.div(
            [h.Class('grid gap-2')],
            [
              label(copy.emailId, copy.email),
              input({
                id: copy.emailId,
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
                  label(copy.passwordId, copy.password),
                  h.a(
                    [h.Href('#'), h.Class(copy.forgotPasswordClassName)],
                    [copy.forgotPassword],
                  ),
                ],
              ),
              input({
                id: copy.passwordId,
                type: 'password',
                isRequired: true,
              }),
            ],
          ),
        ],
      ),
    ],
  )
}

const loginCard = (
  copy: LoginCopy,
  config: Readonly<{
    className?: string
    size?: CardSize
  }> = {},
): Html =>
  Card<never>({
    className: config.className ?? 'w-full max-w-sm',
    dir: copy.dir === 'rtl' ? copy.dir : undefined,
    size: config.size,
    children: [
      CardHeader<never>({
        children: [
          CardTitle<never>({ children: [copy.title] }),
          CardDescription<never>({ children: [copy.description] }),
          CardAction<never>({
            children: [button(copy.signUp, { variant: 'link' })],
          }),
        ],
      }),
      CardContent<never>({ children: [formFields(copy)] }),
      CardFooter<never>({
        className: 'flex-col gap-2',
        children: [
          button(copy.login, {
            type: 'submit',
          }),
          button(copy.loginWithGoogle, {
            variant: 'outline',
          }),
        ],
      }),
    ],
  })

const chevronRightIcon = (): Html => {
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
      h.Class(
        'lucide lucide-chevron-right mt-0.5 size-4 shrink-0 text-muted-foreground',
      ),
      h.AriaHidden(true),
    ],
    [h.path([h.D('m9 18 6-6-6-6')], [])],
  )
}

const listItem = (children: ReadonlyArray<Child>): Html => {
  const h = html<never>()

  return h.li(
    [h.Class('flex gap-2')],
    [chevronRightIcon(), h.span([], children)],
  )
}

const spacingToggleGroup = (): Html => {
  const h = html<never>()
  const selectedValue = selectedSpacing?.value ?? '4'

  return h.div(
    [
      h.Role('group'),
      h.DataAttribute('orientation', 'horizontal'),
      h.DataAttribute('slot', 'toggle-group'),
      h.DataAttribute('variant', 'outline'),
      h.DataAttribute('size', 'sm'),
      h.DataAttribute('spacing', '2'),
      h.Attribute('style', '--gap: 2;'),
      h.Class(toggleGroupClassName({ className: 'justify-center' })),
    ],
    spacingOptions.map(option => {
      const isSelected = option.value === selectedValue

      return h.button(
        [
          h.Type('button'),
          h.Tabindex(isSelected ? 0 : -1),
          h.Attribute('aria-disabled', 'false'),
          h.AriaPressed(String(isSelected)),
          ...(isSelected ? [h.DataAttribute('pressed', '')] : []),
          h.DataAttribute('slot', 'toggle-group-item'),
          h.DataAttribute('variant', 'outline'),
          h.DataAttribute('size', 'sm'),
          h.DataAttribute('spacing', '2'),
          h.Class(
            toggleGroupItemClassName({
              size: 'sm',
              variant: 'outline',
            }),
          ),
        ],
        [option.label],
      )
    }),
  )
}

export const CardDemo = (): Html => loginCard(defaultLoginCopy)

export const CardEdgeToEdge = (): Html => {
  const h = html<never>()

  return Card<never>({
    className: 'mx-auto w-full max-w-sm',
    children: [
      CardHeader<never>({
        children: [
          CardTitle<never>({ children: ['Terms of Service'] }),
          CardDescription<never>({
            children: ['Review the terms before accepting the agreement.'],
          }),
        ],
      }),
      CardContent<never>({
        className: '-mb-(--card-spacing)',
        children: [
          h.div(
            [
              h.Class(
                '-mx-(--card-spacing) max-h-48 space-y-4 overflow-y-scroll border-t bg-muted/50 px-(--card-spacing) py-4 text-sm leading-relaxed',
              ),
            ],
            [
              h.p(
                [],
                [
                  'These terms govern your use of the workspace, including access to shared documents, project files, and collaboration tools.',
                ],
              ),
              h.p(
                [],
                [
                  'You are responsible for the content you upload and for ensuring that your team has the appropriate permissions to view or edit it.',
                ],
              ),
              h.p(
                [],
                [
                  'We may update features or limits as the service evolves. When those changes materially affect your workflow, we will notify your workspace administrators.',
                ],
              ),
              h.p(
                [],
                [
                  "By continuing, you agree to keep your account credentials secure and to follow your organization's acceptable use policies.",
                ],
              ),
            ],
          ),
        ],
      }),
      CardFooter<never>({
        className: 'justify-end gap-2',
        children: [button('Decline', { variant: 'outline' }), button('Accept')],
      }),
    ],
  })
}

export const CardImage = (): Html => {
  const h = html<never>()

  return Card<never>({
    className: 'relative mx-auto w-full max-w-sm pt-0',
    children: [
      h.div([h.Class('absolute inset-0 z-30 aspect-video bg-black/35')], []),
      h.img([
        h.Src('https://avatar.vercel.sh/shadcn1'),
        h.Alt('Event cover'),
        h.Class(
          'relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40',
        ),
      ]),
      CardHeader<never>({
        children: [
          CardAction<never>({
            children: [
              Badge<never>({
                variant: 'secondary',
                toView: attributes =>
                  h.span([...attributes.badge], ['Featured']),
              }),
            ],
          }),
          CardTitle<never>({ children: ['Design systems meetup'] }),
          CardDescription<never>({
            children: [
              'A practical talk on component APIs, accessibility, and shipping faster.',
            ],
          }),
        ],
      }),
      CardFooter<never>({
        children: [button('View Event')],
      }),
    ],
  })
}

export const CardRtl = (): Html => loginCard(arabicLoginCopy)

export const CardSmall = (): Html => {
  const h = html<never>()

  return Card<never>({
    size: 'sm',
    className: 'mx-auto w-full max-w-xs',
    children: [
      CardHeader<never>({
        children: [
          CardTitle<never>({ children: ['Scheduled reports'] }),
          CardDescription<never>({
            children: ['Weekly snapshots. No more manual exports.'],
          }),
        ],
      }),
      CardContent<never>({
        children: [
          h.ul(
            [h.Class('grid gap-2 py-2 text-sm')],
            [
              listItem(['Choose a schedule (daily, or weekly).']),
              listItem(['Send to channels or specific teammates.']),
              listItem(['Include charts, tables, and key metrics.']),
            ],
          ),
        ],
      }),
      CardFooter<never>({
        className: 'flex-col gap-2',
        children: [
          button('Set up scheduled reports', {
            size: 'sm',
          }),
          button("See what's new", {
            variant: 'outline',
            size: 'sm',
          }),
        ],
      }),
    ],
  })
}

export const CardSpacing = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('mx-auto grid w-full max-w-sm gap-4')],
    [
      spacingToggleGroup(),
      loginCard(
        spacingLoginCopy,
        selectedSpacing === undefined
          ? {}
          : { className: selectedSpacing.className },
      ),
    ],
  )
}
