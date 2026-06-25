import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Button } from '../button'
import {
  actionView as AlertAction,
  descriptionView as AlertDescription,
  titleView as AlertTitle,
  view as Alert,
} from './index'
import type { AlertVariant } from './index'

const icon = (className: string, children: ReadonlyArray<Html>): Html => {
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
      h.Class(className),
      h.AriaHidden(true),
    ],
    children,
  )
}

const checkCircle2Icon = (): Html => {
  const h = html<never>()

  return icon('lucide lucide-circle-check-big', [
    h.path([h.D('M21.801 10A10 10 0 1 1 17 3.335')], []),
    h.path([h.D('m9 11 3 3L22 4')], []),
  ])
}

const infoIcon = (): Html => {
  const h = html<never>()

  return icon('lucide lucide-info', [
    h.circle([h.Cx('12'), h.Cy('12'), h.R('10')], []),
    h.path([h.D('M12 16v-4')], []),
    h.path([h.D('M12 8h.01')], []),
  ])
}

const alertTriangleIcon = (): Html => {
  const h = html<never>()

  return icon('lucide lucide-triangle-alert', [
    h.path(
      [
        h.D(
          'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3',
        ),
      ],
      [],
    ),
    h.path([h.D('M12 9v4')], []),
    h.path([h.D('M12 17h.01')], []),
  ])
}

const alertCircleIcon = (): Html => {
  const h = html<never>()

  return icon('lucide lucide-circle-alert', [
    h.circle([h.Cx('12'), h.Cy('12'), h.R('10')], []),
    h.line([h.X1('12'), h.X2('12'), h.Y1('8'), h.Y2('12')], []),
    h.line([h.X1('12'), h.X2('12.01'), h.Y1('16'), h.Y2('16')], []),
  ])
}

const alertTitle = (children: ReadonlyArray<Html | string>): Html => {
  const h = html<never>()

  return AlertTitle<never>({
    toView: attributes => h.div([...attributes.title], children),
  })
}

const alertDescription = (children: ReadonlyArray<Html | string>): Html => {
  const h = html<never>()

  return AlertDescription<never>({
    toView: attributes => h.div([...attributes.description], children),
  })
}

const alertAction = (
  children: ReadonlyArray<Html | string>,
  direction: 'ltr' | 'rtl' = 'ltr',
): Html => {
  const h = html<never>()

  return AlertAction<never>({
    direction,
    toView: attributes => h.div([...attributes.action], children),
  })
}

const alert = (
  config: Readonly<{
    variant?: AlertVariant
    direction?: 'ltr' | 'rtl'
    className?: string
    children: ReadonlyArray<Html | string>
  }>,
): Html => {
  const h = html<never>()
  const variantConfig =
    config.variant === undefined ? {} : { variant: config.variant }
  const directionConfig =
    config.direction === undefined ? {} : { direction: config.direction }
  const classNameConfig =
    config.className === undefined ? {} : { className: config.className }

  return Alert<never>({
    ...variantConfig,
    ...directionConfig,
    ...classNameConfig,
    toView: attributes => h.div([...attributes.alert], config.children),
  })
}

const arabicAlertRtl = {
  dir: 'rtl',
  values: {
    paymentTitle: 'تم الدفع بنجاح',
    paymentDescription:
      'تمت معالجة دفعتك البالغة 29.99 دولارًا. تم إرسال إيصال إلى عنوان بريدك الإلكتروني.',
    featureTitle: 'ميزة جديدة متاحة',
    featureDescription:
      'لقد أضفنا دعم الوضع الداكن. يمكنك تفعيله في إعدادات حسابك.',
  },
}

export const AlertActionExample = (): Html => {
  const h = html<never>()

  return alert({
    className: 'max-w-md',
    children: [
      alertTitle(['Dark mode is now available']),
      alertDescription([
        'Enable it under your profile settings to get started.',
      ]),
      alertAction([
        Button<never>({
          size: 'xs',
          variant: 'default',
          toView: attributes => h.button([...attributes.button], ['Enable']),
        }),
      ]),
    ],
  })
}

export const AlertBasic = (): Html =>
  alert({
    className: 'max-w-md',
    children: [
      checkCircle2Icon(),
      alertTitle(['Account updated successfully']),
      alertDescription([
        'Your profile information has been saved. Changes will be reflected immediately.',
      ]),
    ],
  })

export const AlertColors = (): Html =>
  alert({
    className:
      'max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50',
    children: [
      alertTriangleIcon(),
      alertTitle(['Your subscription will expire in 3 days.']),
      alertDescription([
        'Renew now to avoid service interruption or upgrade to a paid plan to continue using the service.',
      ]),
    ],
  })

export const AlertDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('grid w-full max-w-md items-start gap-4')],
    [
      alert({
        children: [
          checkCircle2Icon(),
          alertTitle(['Payment successful']),
          alertDescription([
            'Your payment of $29.99 has been processed. A receipt has been sent to your email address.',
          ]),
        ],
      }),
      alert({
        children: [
          infoIcon(),
          alertTitle(['New feature available']),
          alertDescription([
            "We've added dark mode support. You can enable it in your account settings.",
          ]),
        ],
      }),
    ],
  )
}

export const AlertDestructive = (): Html =>
  alert({
    variant: 'destructive',
    className: 'max-w-md',
    children: [
      alertCircleIcon(),
      alertTitle(['Payment failed']),
      alertDescription([
        'Your payment could not be processed. Please check your payment method and try again.',
      ]),
    ],
  })

export const AlertRtl = (): Html => {
  const h = html<never>()
  const { dir, values } = arabicAlertRtl

  return h.div(
    [h.Class('grid w-full max-w-md items-start gap-4'), h.Dir(dir)],
    [
      alert({
        direction: 'rtl',
        children: [
          checkCircle2Icon(),
          alertTitle([values.paymentTitle]),
          alertDescription([values.paymentDescription]),
        ],
      }),
      alert({
        direction: 'rtl',
        children: [
          infoIcon(),
          alertTitle([values.featureTitle]),
          alertDescription([values.featureDescription]),
        ],
      }),
    ],
  )
}
