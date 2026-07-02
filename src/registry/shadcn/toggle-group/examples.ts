import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import type { ToggleSize, ToggleVariant } from '../toggle'
import { view as ToggleGroup } from './index'
import type {
  ToggleGroupSpacing as ToggleGroupSpacingValue,
  ToggleGroupValueChange,
} from './index'

type IconName = 'alignCenter' | 'alignLeft' | 'alignRight' | 'bold' | 'italic'

export type ToggleGroupExampleController<Message> = Readonly<{
  valueFor: (
    groupId: string,
    defaultValue: ReadonlyArray<string>,
  ) => ReadonlyArray<string>
  onValueChange: (groupId: string, change: ToggleGroupValueChange) => Message
}>

const toggleGroupValue = <Message>(
  controller: ToggleGroupExampleController<Message> | undefined,
  groupId: string,
  defaultValue: ReadonlyArray<string>,
): ReadonlyArray<string> =>
  controller?.valueFor(groupId, defaultValue) ?? defaultValue

const iconPaths: Readonly<Record<IconName, string>> = {
  alignCenter: 'M17 12H7m12-6H5m14 12H5',
  alignLeft: 'M21 6H3m15 6H3m11 6H3',
  alignRight: 'M21 6H3m18 6H6m15 6H10',
  bold: 'M6 12h9a4 4 0 0 0 0-8H7a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h9a4 4 0 0 0 0-8',
  italic: 'M19 4h-9m4 16H5m10-16-4 16',
}

const iconClassNames: Readonly<Record<IconName, string>> = {
  alignCenter: 'lucide lucide-align-center-icon',
  alignLeft: 'lucide lucide-align-left-icon',
  alignRight: 'lucide lucide-align-right-icon',
  bold: 'lucide lucide-bold-icon',
  italic: 'lucide lucide-italic-icon',
}

const icon = (name: IconName): Html => {
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
      h.Class(iconClassNames[name]),
      h.AriaHidden(true),
    ],
    [h.path([h.D(iconPaths[name])], [])],
  )
}

const items = [
  { id: 'align-left', value: 'left', label: 'Left' },
  { id: 'align-center', value: 'center', label: 'Center' },
  { id: 'align-right', value: 'right', label: 'Right' },
]

const formattingItems = [
  { id: 'format-bold', value: 'bold', label: 'Bold' },
  { id: 'format-italic', value: 'italic', label: 'Italic' },
]

const group = <Message>(
  config: Readonly<{
    ariaLabel: string
    children: (h: ReturnType<typeof html<Message>>) => ReadonlyArray<Html>
    className?: string
    dir?: string
    itemClassName?: string
    orientation?: 'horizontal' | 'vertical'
    selectionMode?: 'single' | 'multiple'
    size?: ToggleSize
    spacing?: ToggleGroupSpacingValue
    value?: ReadonlyArray<string>
    variant?: ToggleVariant
  }>,
  controller: ToggleGroupExampleController<Message> | undefined,
): Html => {
  const h = html<Message>()

  return ToggleGroup<Message>({
    value: toggleGroupValue(
      controller,
      config.ariaLabel,
      config.value ?? ['center'],
    ),
    items,
    ...(config.className === undefined ? {} : { className: config.className }),
    ...(config.dir === undefined ? {} : { dir: config.dir }),
    ...(config.itemClassName === undefined
      ? {}
      : { itemClassName: config.itemClassName }),
    ...(config.orientation === undefined
      ? {}
      : { orientation: config.orientation }),
    ...(config.selectionMode === undefined
      ? {}
      : { selectionMode: config.selectionMode }),
    ...(config.size === undefined ? {} : { size: config.size }),
    ...(config.spacing === undefined ? {} : { spacing: config.spacing }),
    ...(config.variant === undefined ? {} : { variant: config.variant }),
    ...(controller === undefined
      ? {}
      : {
          onValueChange: change =>
            controller.onValueChange(config.ariaLabel, change),
        }),
    toView: attributes =>
      h.div(
        [...attributes.root, h.AriaLabel(config.ariaLabel)],
        config
          .children(h)
          .map((child, index) =>
            h.button([...(attributes.items[index]?.root ?? [])], [child]),
          ),
      ),
  })
}

const alignmentChildren = <Message>(
  h: ReturnType<typeof html<Message>>,
): ReadonlyArray<Html> => [
  h.span([h.DataAttribute('icon', 'inline-start')], [icon('alignLeft')]),
  h.span([h.DataAttribute('icon', 'inline-start')], [icon('alignCenter')]),
  h.span([h.DataAttribute('icon', 'inline-start')], [icon('alignRight')]),
]

export const ToggleGroupDemo = <Message = never>(
  controller?: ToggleGroupExampleController<Message>,
): Html =>
  group<Message>(
    {
      ariaLabel: 'Text alignment',
      variant: 'outline',
      children: alignmentChildren,
    },
    controller,
  )

export const ToggleGroupDisabled = <Message = never>(
  controller?: ToggleGroupExampleController<Message>,
): Html =>
  ToggleGroup<Message>({
    value: toggleGroupValue(controller, 'Disabled formatting', ['bold']),
    selectionMode: 'multiple',
    variant: 'outline',
    items: [
      { id: 'format-bold', value: 'bold', label: 'Bold' },
      { id: 'format-italic', value: 'italic', label: 'Italic' },
      {
        id: 'format-strikethrough',
        value: 'strikethrough',
        label: 'Disabled',
        isDisabled: true,
      },
    ],
    ...(controller === undefined
      ? {}
      : {
          onValueChange: change =>
            controller.onValueChange('Disabled formatting', change),
        }),
  })

export const ToggleGroupFontWeightSelector = <Message = never>(
  controller?: ToggleGroupExampleController<Message>,
): Html => {
  const h = html<Message>()

  return ToggleGroup<Message>({
    value: toggleGroupValue(controller, 'Font weight', ['bold']),
    selectionMode: 'multiple',
    variant: 'outline',
    items: formattingItems,
    ...(controller === undefined
      ? {}
      : {
          onValueChange: change =>
            controller.onValueChange('Font weight', change),
        }),
    toView: attributes =>
      h.div(
        [...attributes.root, h.AriaLabel('Font weight')],
        [
          h.button([...(attributes.items[0]?.root ?? [])], [icon('bold')]),
          h.button([...(attributes.items[1]?.root ?? [])], [icon('italic')]),
        ],
      ),
  })
}

export const ToggleGroupOutline = <Message = never>(
  controller?: ToggleGroupExampleController<Message>,
): Html =>
  group<Message>(
    {
      ariaLabel: 'Text alignment outline',
      variant: 'outline',
      spacing: 0,
      children: alignmentChildren,
    },
    controller,
  )

export const ToggleGroupRtl = <Message = never>(
  controller?: ToggleGroupExampleController<Message>,
): Html =>
  group<Message>(
    {
      ariaLabel: 'محاذاة النص',
      dir: 'rtl',
      variant: 'outline',
      children: h => [
        h.span([h.DataAttribute('icon', 'inline-start')], [icon('alignRight')]),
        h.span(
          [h.DataAttribute('icon', 'inline-start')],
          [icon('alignCenter')],
        ),
        h.span([h.DataAttribute('icon', 'inline-start')], [icon('alignLeft')]),
      ],
    },
    controller,
  )

export const ToggleGroupSizes = <Message = never>(
  controller?: ToggleGroupExampleController<Message>,
): Html => {
  const h = html<Message>()

  return h.div(
    [h.Class('flex flex-wrap items-center gap-2')],
    [
      group<Message>(
        {
          ariaLabel: 'Small alignment',
          size: 'sm',
          variant: 'outline',
          children: alignmentChildren,
        },
        controller,
      ),
      group<Message>(
        {
          ariaLabel: 'Default alignment',
          size: 'default',
          variant: 'outline',
          children: alignmentChildren,
        },
        controller,
      ),
      group<Message>(
        {
          ariaLabel: 'Large alignment',
          size: 'lg',
          variant: 'outline',
          children: alignmentChildren,
        },
        controller,
      ),
    ],
  )
}

export const ToggleGroupSpacing = <Message = never>(
  controller?: ToggleGroupExampleController<Message>,
): Html =>
  group<Message>(
    {
      ariaLabel: 'Spaced alignment',
      spacing: 4,
      variant: 'outline',
      children: alignmentChildren,
    },
    controller,
  )

export const ToggleGroupVertical = <Message = never>(
  controller?: ToggleGroupExampleController<Message>,
): Html =>
  group<Message>(
    {
      ariaLabel: 'Vertical text alignment',
      orientation: 'vertical',
      variant: 'outline',
      children: alignmentChildren,
    },
    controller,
  )
