import { Array, Predicate, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseField from '../../base-ui/field'
import * as ShadcnLabel from '../label'
import * as ShadcnSeparator from '../separator'

// MODEL

export const {
  FieldValidation,
  FieldValidityIssue,
  InvalidFieldValidation,
  UnknownFieldValidation,
  ValidFieldValidation,
  combinedValidityData,
  fieldState,
  validityData,
} = BaseField
export type {
  FieldState,
  FieldValidityData,
  InputValueChange,
} from '../../base-ui/field'

type Child = Html | string

export const FieldOrientation = S.Literals([
  'vertical',
  'horizontal',
  'responsive',
])
export type FieldOrientation = typeof FieldOrientation.Type

export const FieldLegendVariant = S.Literals(['legend', 'label'])
export type FieldLegendVariant = typeof FieldLegendVariant.Type

export const FieldStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type FieldStyleOptions = typeof FieldStyleOptions.Type

// VIEW

export type FieldAttributes<Message> = BaseField.FieldAttributes<Message>

export type FieldViewConfig<Message> = Omit<
  BaseField.ViewConfig<Message>,
  'toView'
> &
  FieldStyleOptions &
  Readonly<{
    orientation?: FieldOrientation
    children?: ReadonlyArray<Child>
    toView?: (attributes: FieldAttributes<Message>) => Html
  }>

export type FieldContainerConfig<Message> = FieldStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
    dir?: string
  }>

export type FieldLegendConfig<Message> = FieldContainerConfig<Message> &
  Readonly<{
    variant?: FieldLegendVariant
  }>

export type FieldLabelConfig<Message> = Omit<
  ShadcnLabel.ViewConfig<Message>,
  'toView'
> &
  FieldStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
  }>

export type FieldErrorConfig<Message> = FieldContainerConfig<Message> &
  Readonly<{
    errors?: ReadonlyArray<string | undefined>
  }>

export const fieldSetBaseClassName =
  'flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3'

export const fieldLegendBaseClassName =
  'mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base'

export const fieldGroupBaseClassName =
  'group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4'

export const fieldBaseClassName =
  'group/field flex w-full gap-2 data-[invalid=true]:text-destructive'

export const fieldOrientationClassNames: Readonly<
  Record<FieldOrientation, string>
> = {
  vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
  horizontal:
    'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
  responsive:
    'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
}

export const fieldContentBaseClassName =
  'group/field-content flex flex-1 flex-col gap-0.5 leading-snug'

export const fieldLabelBaseClassName =
  'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col'

export const fieldTitleBaseClassName =
  'flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50'

export const fieldDescriptionBaseClassName =
  'text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5 last:mt-0 nth-last-2:-mt-1 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary'

export const fieldDescriptionRtlBaseClassName =
  'text-start text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5 last:mt-0 nth-last-2:-mt-1 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary'

export const fieldSeparatorBaseClassName =
  'relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2'

export const fieldSeparatorContentBaseClassName =
  'relative mx-auto block w-fit bg-background px-2 text-muted-foreground'

export const fieldErrorBaseClassName = 'text-sm font-normal text-destructive'

export const fieldClassName = ({
  orientation = 'vertical',
  className,
}: FieldStyleOptions &
  Readonly<{ orientation?: FieldOrientation }> = {}): string =>
  cn(fieldBaseClassName, fieldOrientationClassNames[orientation], className)

const containerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: string,
  className: string,
  config: FieldContainerConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', slot),
  h.Class(cn(className, config.className)),
  ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ...(config.attributes ?? []),
]

export const Field = <Message>(config: FieldViewConfig<Message> = {}): Html => {
  const h = html<Message>()
  const {
    children = [],
    className,
    orientation = 'vertical',
    toView,
    ...baseConfig
  } = config

  return BaseField.view<Message>({
    ...baseConfig,
    toView: attributes => {
      const fieldAttributes: FieldAttributes<Message> = {
        ...attributes,
        root: [
          ...attributes.root,
          h.DataAttribute('slot', 'field'),
          h.DataAttribute('orientation', orientation),
          h.Class(fieldClassName({ orientation, className })),
        ],
      }

      return toView === undefined
        ? h.div([...fieldAttributes.root], children)
        : toView(fieldAttributes)
    },
  })
}

export const FieldSet = <Message>(
  config: FieldContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.fieldset(
    [...containerAttributes(h, 'field-set', fieldSetBaseClassName, config)],
    config.children ?? [],
  )
}

export const FieldLegend = <Message>(
  config: FieldLegendConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const variant = config.variant ?? 'legend'

  return h.legend(
    [
      ...containerAttributes(
        h,
        'field-legend',
        fieldLegendBaseClassName,
        config,
      ),
      h.DataAttribute('variant', variant),
    ],
    config.children ?? [],
  )
}

export const FieldGroup = <Message>(
  config: FieldContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [...containerAttributes(h, 'field-group', fieldGroupBaseClassName, config)],
    config.children ?? [],
  )
}

export const FieldContent = <Message>(
  config: FieldContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [
      ...containerAttributes(
        h,
        'field-content',
        fieldContentBaseClassName,
        config,
      ),
    ],
    config.children ?? [],
  )
}

export const FieldLabel = <Message>(
  config: FieldLabelConfig<Message> = {},
): Html =>
  ShadcnLabel.view<Message>({
    ...config,
    className: cn(fieldLabelBaseClassName, config.className),
    toView: attributes => {
      const h = html<Message>()

      return h.label(
        [...attributes.label, h.DataAttribute('slot', 'field-label')],
        config.children ?? [],
      )
    },
  })

export const FieldTitle = <Message>(
  config: FieldContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [...containerAttributes(h, 'field-label', fieldTitleBaseClassName, config)],
    config.children ?? [],
  )
}

export const FieldDescription = <Message>(
  config: FieldContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const className =
    config.dir === 'rtl'
      ? fieldDescriptionRtlBaseClassName
      : fieldDescriptionBaseClassName

  return h.p(
    [...containerAttributes(h, 'field-description', className, config)],
    config.children ?? [],
  )
}

export const FieldSeparator = <Message>(
  config: FieldContainerConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const children = config.children ?? []

  return h.div(
    [
      ...containerAttributes(
        h,
        'field-separator',
        fieldSeparatorBaseClassName,
        config,
      ),
      h.DataAttribute(
        'content',
        Array.isReadonlyArrayNonEmpty(children) ? 'true' : 'false',
      ),
    ],
    [
      ShadcnSeparator.view<Message>({
        className: 'absolute inset-0 top-1/2',
        orientation: 'horizontal',
        toView: attributes => h.div([...attributes.separator], []),
      }),
      ...(Array.isReadonlyArrayNonEmpty(children)
        ? [
            h.span(
              [
                h.DataAttribute('slot', 'field-separator-content'),
                h.Class(fieldSeparatorContentBaseClassName),
              ],
              children,
            ),
          ]
        : []),
    ],
  )
}

const errorContent = (
  children: ReadonlyArray<Child>,
  errors: ReadonlyArray<string | undefined>,
): ReadonlyArray<Child> => {
  if (Array.isReadonlyArrayNonEmpty(children)) {
    return children
  }

  const messages = errors.filter(Predicate.isNotUndefined)

  if (!Array.isReadonlyArrayNonEmpty(messages)) {
    return []
  }

  if (messages.length === 1) {
    return [messages[0]]
  }

  const h = html<never>()

  return [
    h.ul(
      [h.Class('ml-4 flex list-disc flex-col gap-1')],
      messages.map(message => h.li([], [message])),
    ),
  ]
}

export const FieldError = <Message>(
  config: FieldErrorConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const content = errorContent(config.children ?? [], config.errors ?? [])

  return Array.isReadonlyArrayNonEmpty(content)
    ? h.div(
        [
          ...containerAttributes(
            h,
            'field-error',
            fieldErrorBaseClassName,
            config,
          ),
          h.Role('alert'),
        ],
        content,
      )
    : h.empty
}
