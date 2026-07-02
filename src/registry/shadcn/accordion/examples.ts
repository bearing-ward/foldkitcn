import { html } from 'foldkit/html'
import type { Html } from 'foldkit/html'

import * as Accordion from './index'

export type AccordionExampleController<Message> = Readonly<{
  valueFor: (
    exampleId: string,
    defaultValue: ReadonlyArray<string>,
  ) => ReadonlyArray<string>
  onValueChange: (
    exampleId: string,
    change: Accordion.AccordionValueChange,
  ) => Message
}>

const accordionValue = <Message>(
  controller: AccordionExampleController<Message> | undefined,
  exampleId: string,
  defaultValue: ReadonlyArray<string>,
): ReadonlyArray<string> =>
  controller?.valueFor(exampleId, defaultValue) ?? defaultValue

const faqItems: ReadonlyArray<Accordion.AccordionItemDescriptor> = [
  {
    value: 'item-1',
    label: 'How do I reset my password?',
    panel: {
      id: 'accordion-basic-item-1-panel',
      label:
        "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password. The link will expire in 24 hours.",
    },
  },
  {
    value: 'item-2',
    label: 'Can I change my subscription plan?',
    panel: {
      id: 'accordion-basic-item-2-panel',
      label:
        'Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.',
    },
  },
  {
    value: 'item-3',
    label: 'What payment methods do you accept?',
    panel: {
      id: 'accordion-basic-item-3-panel',
      label:
        'We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.',
    },
  },
]

const faqPasswordItem: Accordion.AccordionItemDescriptor = faqItems[0] ?? {
  value: 'item-1',
  label: 'How do I reset my password?',
}

const faqSubscriptionItem: Accordion.AccordionItemDescriptor = faqItems[1] ?? {
  value: 'item-2',
  label: 'Can I change my subscription plan?',
}

const faqPaymentItem: Accordion.AccordionItemDescriptor = faqItems[2] ?? {
  value: 'item-3',
  label: 'What payment methods do you accept?',
}

const settingsItems: ReadonlyArray<Accordion.AccordionItemDescriptor> = [
  {
    value: 'notifications',
    label: 'Notification Settings',
    panel: {
      id: 'accordion-settings-notifications-panel',
      label:
        'Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.',
    },
  },
  {
    value: 'privacy',
    label: 'Privacy & Security',
    panel: {
      id: 'accordion-settings-privacy-panel',
      label:
        'Control your privacy settings and security preferences. Enable two-factor authentication, manage connected devices, review active sessions, and configure data sharing preferences.',
    },
  },
  {
    value: 'billing',
    label: 'Billing & Subscription',
    panel: {
      id: 'accordion-settings-billing-panel',
      label:
        'View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.',
    },
  },
]

export const AccordionBasic = <Message = never>(
  controller?: AccordionExampleController<Message>,
): ReturnType<typeof Accordion.view<Message>> =>
  Accordion.view<Message>({
    value: accordionValue(controller, 'basic', ['item-1']),
    items: faqItems,
    className: 'max-w-lg',
    ...(controller === undefined
      ? {}
      : { onValueChange: change => controller.onValueChange('basic', change) }),
  })

export const AccordionMultiple = <Message = never>(
  controller?: AccordionExampleController<Message>,
): ReturnType<typeof Accordion.view<Message>> =>
  Accordion.view<Message>({
    value: accordionValue(controller, 'multiple', ['notifications', 'billing']),
    items: settingsItems,
    multiple: true,
    className: 'max-w-lg',
    ...(controller === undefined
      ? {}
      : {
          onValueChange: change => controller.onValueChange('multiple', change),
        }),
  })

export const AccordionDisabled = <Message = never>(
  controller?: AccordionExampleController<Message>,
): ReturnType<typeof Accordion.view<Message>> =>
  Accordion.view<Message>({
    value: accordionValue(controller, 'disabled', []),
    items: [
      faqPasswordItem,
      {
        ...faqSubscriptionItem,
        isDisabled: true,
      },
      faqPaymentItem,
    ],
    className: 'max-w-lg',
    ...(controller === undefined
      ? {}
      : {
          onValueChange: change => controller.onValueChange('disabled', change),
        }),
  })

export const AccordionRtl = <Message = never>(
  controller?: AccordionExampleController<Message>,
): ReturnType<typeof Accordion.view<Message>> =>
  Accordion.view<Message>({
    value: accordionValue(controller, 'rtl', ['item-1']),
    items: faqItems,
    className: 'max-w-lg',
    dir: 'rtl',
    ...(controller === undefined
      ? {}
      : { onValueChange: change => controller.onValueChange('rtl', change) }),
  })

export const AccordionCard = <Message = never>(
  controller?: AccordionExampleController<Message>,
): Html => {
  const h = html<Message>()

  return h.div(
    [
      h.Class(
        'w-full max-w-lg rounded-xl border bg-card p-4 text-card-foreground shadow-sm',
      ),
    ],
    [
      h.h3([h.Class('mb-2 text-sm font-medium')], ['Account questions']),
      Accordion.view<Message>({
        value: accordionValue(controller, 'card', ['item-1']),
        items: faqItems,
        ...(controller === undefined
          ? {}
          : {
              onValueChange: change => controller.onValueChange('card', change),
            }),
      }),
    ],
  )
}
