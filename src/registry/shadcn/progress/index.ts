import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseProgress from '../../base-ui/progress'

// MODEL

export type ProgressFormatOptions = BaseProgress.ProgressFormatOptions
export type ProgressStatus = BaseProgress.ProgressStatus
export type ProgressState = BaseProgress.ProgressState

export const ProgressStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type ProgressStyleOptions = typeof ProgressStyleOptions.Type

export const ProgressTrackStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type ProgressTrackStyleOptions = typeof ProgressTrackStyleOptions.Type

export const ProgressIndicatorStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type ProgressIndicatorStyleOptions =
  typeof ProgressIndicatorStyleOptions.Type

export const ProgressLabelStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type ProgressLabelStyleOptions = typeof ProgressLabelStyleOptions.Type

export const ProgressValueStyleOptions = S.Struct({
  className: S.optional(S.String),
  direction: S.optional(S.Union([S.Literal('ltr'), S.Literal('rtl')])),
})
export type ProgressValueStyleOptions = typeof ProgressValueStyleOptions.Type

// UPDATE

export const { progressState, valueText } = BaseProgress

// VIEW

export type ProgressAttributes<Message> =
  BaseProgress.ProgressAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseProgress.ViewConfig<Message>,
  'toView'
> &
  ProgressStyleOptions &
  Readonly<{
    dir?: string
    trackClassName?: string
    indicatorClassName?: string
    labelClassName?: string
    valueClassName?: string
    valueDirection?: 'ltr' | 'rtl'
    children?: (
      attributes: ProgressAttributes<Message>,
    ) => ReadonlyArray<Html | string>
    toView?: (attributes: ProgressAttributes<Message>) => Html
  }>

export const progressBaseClassName = 'flex flex-wrap gap-3'
export const progressTrackBaseClassName =
  'relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted'
export const progressIndicatorBaseClassName = 'h-full bg-primary transition-all'
export const progressLabelBaseClassName = 'text-sm font-medium'
export const progressValueBaseClassName =
  'ml-auto text-sm text-muted-foreground tabular-nums'
export const progressRtlValueBaseClassName =
  'ms-auto text-sm text-muted-foreground tabular-nums'

export const progressClassName = ({
  className,
}: ProgressStyleOptions = {}): string => cn(progressBaseClassName, className)

export const progressTrackClassName = ({
  className,
}: ProgressTrackStyleOptions = {}): string =>
  cn(progressTrackBaseClassName, className)

export const progressIndicatorClassName = ({
  className,
}: ProgressIndicatorStyleOptions = {}): string =>
  cn(progressIndicatorBaseClassName, className)

export const progressLabelClassName = ({
  className,
}: ProgressLabelStyleOptions = {}): string =>
  cn(progressLabelBaseClassName, className)

export const progressValueClassName = ({
  className,
  direction = 'ltr',
}: ProgressValueStyleOptions = {}): string =>
  cn(
    direction === 'rtl'
      ? progressRtlValueBaseClassName
      : progressValueBaseClassName,
    className,
  )

const indicatorStyleAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: BaseProgress.ProgressOptions,
): ReadonlyArray<Attribute<Message>> => {
  const style = BaseProgress.indicatorStyle(
    BaseProgress.progressState(config).percentage,
  )

  if (style.width === undefined) {
    return []
  }

  return [
    h.Attribute(
      'style',
      `inset-inline-start: 0px; height: inherit; width: ${style.width};`,
    ),
  ]
}

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
  dir: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'progress'),
  h.Class(progressClassName({ className })),
  ...(dir === undefined ? [] : [h.Dir(dir)]),
]

const trackAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'progress-track'),
  h.Class(progressTrackClassName({ className })),
]

const indicatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
  config: BaseProgress.ProgressOptions,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'progress-indicator'),
  h.Class(progressIndicatorClassName({ className })),
  ...indicatorStyleAttribute(h, config),
]

const labelAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'progress-label'),
  h.Class(progressLabelClassName({ className })),
]

const valueAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
  direction: 'ltr' | 'rtl' | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'progress-value'),
  h.Class(progressValueClassName({ className, direction })),
]

const visuallyHiddenValue = <Message>(
  h: ReturnType<typeof html<Message>>,
): Html =>
  h.span(
    [
      h.Role('presentation'),
      h.Attribute(
        'style',
        'clip-path: inset(50%); overflow: hidden; white-space: nowrap; border: 0px; padding: 0px; width: 1px; height: 1px; margin: -1px; position: fixed; top: 0px; left: 0px;',
      ),
    ],
    ['x'],
  )

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    ViewConfig<Message>,
    | 'className'
    | 'dir'
    | 'trackClassName'
    | 'indicatorClassName'
    | 'labelClassName'
    | 'valueClassName'
    | 'valueDirection'
  > &
    BaseProgress.ProgressOptions,
  attributes: ProgressAttributes<Message>,
): ProgressAttributes<Message> => ({
  root: [
    ...attributes.root,
    ...rootAttributes(h, config.className, config.dir),
  ],
  label: [...attributes.label, ...labelAttributes(h, config.labelClassName)],
  track: [...attributes.track, ...trackAttributes(h, config.trackClassName)],
  indicator: [
    ...attributes.indicator,
    ...indicatorAttributes(h, config.indicatorClassName, config),
  ],
  value: [
    ...attributes.value,
    ...valueAttributes(
      h,
      config.valueClassName,
      config.valueDirection ?? (config.dir === 'rtl' ? 'rtl' : 'ltr'),
    ),
  ],
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { children, toView, ...baseConfig } = config

  return BaseProgress.view<Message>({
    ...baseConfig,
    toView: attributes => {
      const shadcnProgressAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(shadcnProgressAttributes)
      }

      return h.div(
        [...shadcnProgressAttributes.root],
        [
          ...(children?.(shadcnProgressAttributes) ?? []),
          h.div(
            [...shadcnProgressAttributes.track],
            [h.div([...shadcnProgressAttributes.indicator], [])],
          ),
          visuallyHiddenValue(h),
        ],
      )
    },
  })
}
