import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseSlider from '../../base-ui/slider'

// MODEL

export type SliderChangeReason = BaseSlider.SliderChangeReason
export type SliderDirection = BaseSlider.SliderDirection
export type SliderOrientation = BaseSlider.SliderOrientation
export type SliderState = BaseSlider.SliderState
export type SliderThumbAttributes<Message> =
  BaseSlider.SliderThumbAttributes<Message>
export type SliderValueChange = BaseSlider.SliderValueChange

export const SliderStyleOptions = S.Struct({
  className: S.optional(S.String),
  controlClassName: S.optional(S.String),
  trackClassName: S.optional(S.String),
  rangeClassName: S.optional(S.String),
  thumbClassName: S.optional(S.String),
})
export type SliderStyleOptions = typeof SliderStyleOptions.Type

// UPDATE

export const {
  canonicalValues,
  closestThumbIndex,
  getPushedThumbValues,
  getSliderValue,
  indicatorStyle,
  keyboardValueChange,
  pointerValue,
  pointerValueChange,
  resolveThumbCollision,
  roundValueToStep,
  sliderState,
  validateMinimumDistance,
  valueArrayToPercentages,
  valueText,
} = BaseSlider

// VIEW

export type SliderAttributes<Message> = BaseSlider.SliderAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseSlider.ViewConfig<Message>,
  'toView'
> &
  SliderStyleOptions &
  Readonly<{
    toView?: (attributes: SliderAttributes<Message>) => Html
  }>

export const sliderBaseClassName = 'data-horizontal:w-full data-vertical:h-full'

export const sliderControlBaseClassName =
  'relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col'

export const sliderTrackBaseClassName =
  'relative grow overflow-hidden rounded-full bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1'

export const sliderRangeBaseClassName =
  'bg-primary select-none data-horizontal:h-full data-vertical:w-full'

export const sliderThumbBaseClassName =
  'relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50'

export const sliderClassName = ({
  className,
}: Pick<SliderStyleOptions, 'className'> = {}): string =>
  cn(sliderBaseClassName, className)

export const sliderControlClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(sliderControlBaseClassName, className)

export const sliderTrackClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(sliderTrackBaseClassName, className)

export const sliderRangeClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(sliderRangeBaseClassName, className)

export const sliderThumbClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(sliderThumbBaseClassName, className)

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'slider'),
  h.Class(sliderClassName({ className: config.className })),
]

const controlAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Class(
    sliderControlClassName({
      className: config.controlClassName,
    }),
  ),
]

const trackAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'slider-track'),
  h.Class(sliderTrackClassName({ className: config.trackClassName })),
]

const rangeAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'slider-range'),
  h.Class(sliderRangeClassName({ className: config.rangeClassName })),
]

const thumbAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  thumb: SliderThumbAttributes<Message>,
): SliderThumbAttributes<Message> => ({
  state: thumb.state,
  root: [
    ...thumb.root,
    h.DataAttribute('slot', 'slider-thumb'),
    h.Class(sliderThumbClassName({ className: config.thumbClassName })),
  ],
  input: thumb.input,
})

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: SliderAttributes<Message>,
): SliderAttributes<Message> => ({
  root: [...attributes.root, ...rootAttributes(h, config)],
  label: attributes.label,
  control: [...attributes.control, ...controlAttributes(h, config)],
  track: [...attributes.track, ...trackAttributes(h, config)],
  indicator: [...attributes.indicator, ...rangeAttributes(h, config)],
  value: attributes.value,
  thumbs: attributes.thumbs.map(thumb => thumbAttributes(h, config, thumb)),
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BaseSlider.view<Message>({
    ...baseConfig,
    thumbAlignment: config.thumbAlignment ?? 'edge',
    thumbSizePx: config.thumbSizePx ?? 12,
    toView: attributes => {
      const sliderAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(sliderAttributes)
      }

      return h.div(
        [...sliderAttributes.root],
        [
          h.div(
            [...sliderAttributes.control],
            [
              h.div(
                [...sliderAttributes.track],
                [h.div([...sliderAttributes.indicator], [])],
              ),
              ...sliderAttributes.thumbs.map(thumb =>
                h.div([...thumb.root], [h.input([...thumb.input])]),
              ),
            ],
          ),
        ],
      )
    },
  })
}
